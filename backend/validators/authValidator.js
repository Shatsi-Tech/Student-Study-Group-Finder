/**
 * Authentication Validators
 */
function validateRegistration(req, res, next) {
    const { full_name, reg_number, email, password, confirm_password, programme, faculty, year_of_study } = req.body;

    if (!full_name || !reg_number || !email || !password || !confirm_password || !programme || !faculty || !year_of_study) {
        return res.status(400).json({ success: false, message: 'All registration fields are required.' });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email format.' });
    }

    next();
}

function validateLogin(req, res, next) {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        return res.status(400).json({ success: false, message: 'Identifier and password are required.' });
    }
    next();
}

module.exports = {
    validateRegistration,
    validateLogin
};
