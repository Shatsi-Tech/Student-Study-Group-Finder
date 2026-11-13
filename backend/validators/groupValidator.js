/**
 * Group Validators
 */
function validateGroupCreation(req, res, next) {
    const { name, course_name, course_code, faculty, description, meeting_location } = req.body;

    if (!name || !course_name || !course_code || !faculty || !description || !meeting_location) {
        return res.status(400).json({ success: false, message: 'All study group fields are mandatory.' });
    }

    next();
}

module.exports = {
    validateGroupCreation
};
