/**
 * Authentication Controller
 * Handles student registration, login, profile management, and password changes.
 */
const db = require('../config/db');
const { generateToken } = require('../config/jwt');
const { hashPassword, comparePassword } = require('../services/passwordService');

/**
 * Register a new student account
 */
async function register(req, res, next) {
    try {
        const {
            full_name,
            reg_number,
            email,
            password,
            confirm_password,
            programme,
            faculty,
            year_of_study
        } = req.body;

        // Validation
        if (!full_name || !reg_number || !email || !password || !programme || !faculty || !year_of_study) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required. Please fill in all registration details.'
            });
        }

        if (password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long.'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        // Check for duplicates
        const [existingEmail] = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
        if (existingEmail && existingEmail.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email address already exists.'
            });
        }

        const [existingReg] = await db.query('SELECT id FROM users WHERE reg_number = ?', [reg_number.trim()]);
        if (existingReg && existingReg.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'An account with this registration number already exists.'
            });
        }

        const hashedPassword = await hashPassword(password);

        // Cast all fields to string safely before trimming
        const safeTrim = (val) => String(val || '').trim();

        // Security: Default public registration is always STUDENT
        const [result] = await db.query(
            `INSERT INTO users (full_name, reg_number, email, password_hash, role, programme, faculty, year_of_study, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                safeTrim(full_name),
                safeTrim(reg_number),
                email.toLowerCase().trim(),
                hashedPassword,
                'STUDENT',
                safeTrim(programme),
                safeTrim(faculty),
                safeTrim(year_of_study),
                1
            ]
        );

        const newUserId = result.insertId;

        // Create welcome notification
        await db.query(
            `INSERT INTO notifications (user_id, title, message, type, is_read, link)
             VALUES (?, 'Welcome to Student Study Group Finder', 'Your UCU student account has been created. Start exploring academic groups today!', 'SYSTEM', 0, '/explore')`,
            [newUserId]
        );

        const token = generateToken({ id: newUserId, email: email.toLowerCase().trim(), role: 'STUDENT' });

        return res.status(201).json({
            success: true,
            message: 'Student account registered successfully.',
            token,
            user: {
                id: newUserId,
                full_name: safeTrim(full_name),
                reg_number: safeTrim(reg_number),
                email: email.toLowerCase().trim(),
                role: 'STUDENT',
                programme: safeTrim(programme),
                faculty: safeTrim(faculty),
                year_of_study: safeTrim(year_of_study),
                bio: null,
                avatar_url: null
            }
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Log in with Email or Registration Number
 */
async function login(req, res, next) {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please enter your email or registration number and password.'
            });
        }

        const cleanIdentifier = identifier.trim().toLowerCase();

        // Query user by email OR reg_number
        const [users] = await db.query(
            'SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(reg_number) = ?',
            [cleanIdentifier, cleanIdentifier]
        );

        if (!users || users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. Please verify your email or registration number and password.'
            });
        }

        const user = users[0];

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Account deactivated. Please contact the administrator.'
            });
        }

        const isValid = await comparePassword(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. Incorrect password.'
            });
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        // Strip password hash from response
        const { password_hash, ...safeUser } = user;

        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.full_name}!`,
            token,
            user: safeUser
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Get Current User Profile
 */
async function getProfile(req, res, next) {
    try {
        const [users] = await db.query(
            'SELECT id, full_name, reg_number, email, role, programme, faculty, year_of_study, bio, avatar_url, is_active, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        return res.status(200).json({
            success: true,
            user: users[0]
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Update Profile
 */
async function updateProfile(req, res, next) {
    try {
        const { full_name, programme, faculty, year_of_study, bio, avatar_url } = req.body;

        await db.query(
            `UPDATE users
             SET full_name = ?, programme = ?, faculty = ?, year_of_study = ?, bio = ?, avatar_url = ?
             WHERE id = ?`,
            [
                full_name || req.user.full_name,
                programme || req.user.programme,
                faculty || req.user.faculty,
                year_of_study || req.user.year_of_study,
                bio || null,
                avatar_url || null,
                req.user.id
            ]
        );

        const [updatedUsers] = await db.query(
            'SELECT id, full_name, reg_number, email, role, programme, faculty, year_of_study, bio, avatar_url, is_active FROM users WHERE id = ?',
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            user: updatedUsers[0]
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};
