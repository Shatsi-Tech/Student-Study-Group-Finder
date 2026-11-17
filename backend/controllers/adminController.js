/**
 * System Administrator Controller
 * Real-time statistics, platform analytics, student and group moderation.
 */
const db = require('../config/db');
const { notifyUser, notifyAllUsers, notifyGroupMembers, notifyAdmins } = require('../services/notifyService');

/**
 * Get Platform Dashboard Statistics
 */
async function getStats(req, res, next) {
    try {
        const [users] = await db.query('SELECT id, role, is_active, faculty, programme, created_at FROM users');
        const [groups] = await db.query('SELECT id, name, course_name, course_code, faculty, leader_id, status, created_at FROM study_groups');
        const [sessions] = await db.query('SELECT s.*, g.name as group_name, g.course_code, g.faculty, u.full_name as leader_name FROM study_sessions s LEFT JOIN study_groups g ON s.group_id = g.id LEFT JOIN users u ON s.created_by = u.id ORDER BY s.study_date ASC, s.start_time ASC');
        const [posts] = await db.query('SELECT id, post_type FROM posts');
        const [memberships] = await db.query('SELECT id FROM group_members WHERE status = "APPROVED"');

        // Total metrics
        const totalUsers = users.length;
        const totalStudents = users.filter(u => u.role === 'STUDENT').length;
        const totalGroups = groups.length;
        const activeGroups = groups.filter(g => g.status === 'Active').length;
        const pendingGroups = groups.filter(g => g.status === 'Pending').length;
        const totalSessions = sessions.length;
        const upcomingSessions = sessions.filter(s => s.status === 'UPCOMING').length;
        const totalPosts = posts.length;
        const totalMemberships = memberships.length;

        // Most active courses (count groups by course_code)
        const courseCounts = {};
        groups.forEach(g => {
            const key = `${g.course_code}: ${g.course_name}`;
            courseCounts[key] = (courseCounts[key] || 0) + 1;
        });

        const mostActiveCourses = Object.entries(courseCounts)
            .map(([course, count]) => ({ course, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Faculty distribution
        const facultyCounts = {};
        users.forEach(u => {
            if (u.faculty) {
                facultyCounts[u.faculty] = (facultyCounts[u.faculty] || 0) + 1;
            }
        });

        const facultyDistribution = Object.entries(facultyCounts).map(([faculty, count]) => ({
            faculty,
            count
        }));

        // Recent platform activities
        const recentUsers = users.slice(-5).reverse();
        const recentGroups = groups.slice(-5).reverse();
        const upcomingSessionsList = sessions.filter(s => s.status === 'UPCOMING').slice(0, 10);

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalStudents,
                totalGroups,
                activeGroups,
                pendingGroups,
                totalSessions,
                upcomingSessions,
                upcomingSessionsList,
                totalPosts,
                totalMemberships,
                mostActiveCourses,
                facultyDistribution,
                recentUsers,
                recentGroups
            }
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Get all users with moderation controls
 */
async function getAllUsers(req, res, next) {
    try {
        const [users] = await db.query(
            'SELECT id, full_name, reg_number, email, role, programme, faculty, year_of_study, is_active, created_at FROM users ORDER BY created_at DESC'
        );

        return res.status(200).json({
            success: true,
            users
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Toggle user active status (deactivate or activate)
 */
async function toggleUserStatus(req, res, next) {
    try {
        const userId = parseInt(req.params.id, 10);

        if (userId === req.user.id) {
            return res.status(400).json({ success: false, message: 'You cannot deactivate your own administrator account.' });
        }

        const [users] = await db.query('SELECT id, is_active, full_name FROM users WHERE id = ?', [userId]);
        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const newStatus = users[0].is_active ? 0 : 1;
        await db.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, userId]);

        return res.status(200).json({
            success: true,
            message: `User ${users[0].full_name} has been ${newStatus ? 'activated' : 'deactivated'}.`,
            is_active: newStatus
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Delete a user account (Admin only)
 */
async function deleteUser(req, res, next) {
    try {
        const userId = parseInt(req.params.id, 10);

        if (userId === req.user.id) {
            return res.status(400).json({ success: false, message: 'Cannot delete your own administrator account.' });
        }

        await db.query('DELETE FROM users WHERE id = ?', [userId]);

        return res.status(200).json({
            success: true,
            message: 'User account deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Get all groups with administrative metadata
 */
async function getAllGroups(req, res, next) {
    try {
        const [groups] = await db.query(
            `SELECT g.*, u.full_name as leader_name, u.email as leader_email
             FROM study_groups g
             JOIN users u ON g.leader_id = u.id
             ORDER BY g.created_at DESC`
        );

        const [memberships] = await db.query('SELECT group_id FROM group_members WHERE status = "APPROVED"');

        const enriched = groups.map(g => ({
            ...g,
            member_count: memberships.filter(m => m.group_id === g.id).length
        }));

        return res.status(200).json({
            success: true,
            groups: enriched
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Reset all database content to clean slate (Only Admin account is kept)
 */
async function resetDatabase(req, res, next) {
    try {
        if (db.seedStore) {
            db.seedStore();
        }
        return res.status(200).json({
            success: true,
            message: 'Database reset to clean slate successfully. All dummy accounts and groups have been removed.'
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Update Group Status (Admin approves, rejects or sets pending)
 */
async function updateGroupStatus(req, res, next) {
    try {
        const groupId = parseInt(req.params.id, 10);
        const { status } = req.body;

        if (!['Active', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status. Must be Active, Rejected, or Pending.' });
        }

        const [groups] = await db.query('SELECT * FROM study_groups WHERE id = ?', [groupId]);
        if (!groups || groups.length === 0) {
            return res.status(404).json({ success: false, message: 'Study group not found.' });
        }

        const group = groups[0];
        await db.query('UPDATE study_groups SET status = ? WHERE id = ?', [status, groupId]);

        // Notify the group leader of administrator's decision
        const actionText = status === 'Active' ? 'approved and activated' : (status === 'Rejected' ? 'rejected' : 'updated');
        await notifyUser(
            group.leader_id,
            `Study Group ${status === 'Active' ? 'Approved' : 'Status Update'}`,
            `Your study group "${group.name}" has been ${actionText} by the Administrator.`,
            status === 'Active' ? 'SUCCESS' : 'WARNING',
            `/groups/${groupId}`
        );

        // When approved, broadcast notification to ALL members in the university system
        if (status === 'Active') {
            await notifyAllUsers(
                `Study Group Now Active: ${group.name}`,
                `${group.course_code} - "${group.name}" is now approved by the Administrator and open for students to join!`,
                'ANNOUNCEMENT',
                `/groups/${groupId}`,
                group.leader_id
            );
        }

        return res.status(200).json({
            success: true,
            message: `Study group "${group.name}" has been ${actionText}.`,
            status
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Get all scheduled sessions across the platform for Admin monitoring
 */
async function getAllSessions(req, res, next) {
    try {
        const [sessions] = await db.query(
            `SELECT s.*, g.name as group_name, g.course_code, g.faculty, u.full_name as leader_name
             FROM study_sessions s
             LEFT JOIN study_groups g ON s.group_id = g.id
             LEFT JOIN users u ON s.created_by = u.id
             ORDER BY s.study_date ASC, s.start_time ASC`
        );
        return res.status(200).json({
            success: true,
            sessions
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getStats,
    getAllUsers,
    toggleUserStatus,
    deleteUser,
    getAllGroups,
    updateGroupStatus,
    getAllSessions,
    resetDatabase
};
