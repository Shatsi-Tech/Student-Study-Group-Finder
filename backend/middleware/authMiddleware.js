/**
 * Authentication and Authorization Middleware
 * Role-Based Access Control (RBAC): Student, Group Leader, System Administrator
 */
const { verifyToken } = require('../config/jwt');
const db = require('../config/db');

async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token required. Please log in.'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        // Fetch fresh user details to check active status and role
        const [users] = await db.query('SELECT id, full_name, email, reg_number, role, faculty, programme, is_active FROM users WHERE id = ?', [decoded.id]);

        if (!users || users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'User account not found or token invalid.'
            });
        }

        const user = users[0];
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact the administrator.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Session expired or invalid token. Please log in again.',
            error: error.message
        });
    }
}

// System Administrator Only
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'Access denied: System Administrator privileges required.'
        });
    }
    next();
}

// Group Leader authorization for group management
async function requireGroupLeader(req, res, next) {
    try {
        const groupId = parseInt(req.params.groupId || req.params.id || req.body.group_id, 10);
        const userId = req.user.id;

        if (!groupId) {
            return res.status(400).json({ success: false, message: 'Study group ID is required.' });
        }

        // Administrators bypass check
        if (req.user.role === 'ADMIN') {
            return next();
        }

        const [groups] = await db.query('SELECT leader_id FROM study_groups WHERE id = ?', [groupId]);
        if (!groups || groups.length === 0) {
            return res.status(404).json({ success: false, message: 'Study group not found.' });
        }

        if (groups[0].leader_id !== userId) {
            // Also check group_members table for LEADER role
            const [membership] = await db.query(
                'SELECT member_role FROM group_members WHERE group_id = ? AND user_id = ? AND member_role = "LEADER"',
                [groupId, userId]
            );
            if (!membership || membership.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: Only the group leader can perform this operation.'
                });
            }
        }

        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error checking leader privileges.', error: err.message });
    }
}

// Group Member or Leader authorization
async function requireGroupMember(req, res, next) {
    try {
        const groupId = parseInt(req.params.groupId || req.params.id || req.body.group_id, 10);
        const userId = req.user.id;

        if (!groupId) {
            return res.status(400).json({ success: false, message: 'Study group ID is required.' });
        }

        // Administrators have full visibility
        if (req.user.role === 'ADMIN') {
            return next();
        }

        const [membership] = await db.query(
            'SELECT * FROM group_members WHERE group_id = ? AND user_id = ? AND status = "APPROVED"',
            [groupId, userId]
        );

        if (!membership || membership.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You must be an approved member of this study group.'
            });
        }

        req.membership = membership[0];
        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error verifying group membership.', error: err.message });
    }
}

module.exports = {
    authenticate,
    requireAdmin,
    requireGroupLeader,
    requireGroupMember
};
