/**
 * User Model
 * Database operations for User entities.
 */
const db = require('../config/db');

const UserModel = {
    async findById(id) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async findByIdentifier(identifier) {
        const clean = identifier.toLowerCase().trim();
        const [rows] = await db.query(
            'SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(reg_number) = ?',
            [clean, clean]
        );
        return rows[0] || null;
    },

    async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
        return rows[0] || null;
    },

    async findByRegNumber(regNumber) {
        const [rows] = await db.query('SELECT * FROM users WHERE reg_number = ?', [regNumber.trim()]);
        return rows[0] || null;
    },

    async create(userData) {
        const { full_name, reg_number, email, password_hash, role, programme, faculty, year_of_study } = userData;
        const [result] = await db.query(
            `INSERT INTO users (full_name, reg_number, email, password_hash, role, programme, faculty, year_of_study, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            [full_name, reg_number, email, password_hash, role || 'STUDENT', programme, faculty, year_of_study]
        );
        return result.insertId;
    },

    async update(id, updates) {
        const { full_name, programme, faculty, year_of_study, bio, avatar_url } = updates;
        const [result] = await db.query(
            `UPDATE users
             SET full_name = ?, programme = ?, faculty = ?, year_of_study = ?, bio = ?, avatar_url = ?
             WHERE id = ?`,
            [full_name, programme, faculty, year_of_study, bio, avatar_url, id]
        );
        return result.affectedRows > 0;
    },

    async toggleStatus(id, newStatus) {
        const [result] = await db.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, id]);
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    async getAll() {
        const [rows] = await db.query('SELECT id, full_name, reg_number, email, role, programme, faculty, year_of_study, is_active, created_at FROM users ORDER BY created_at DESC');
        return rows;
    }
};

module.exports = UserModel;
