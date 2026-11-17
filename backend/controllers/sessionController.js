/**
 * Study Session Controller
 * Scheduling, listing, and managing academic study sessions for groups.
 */
const db = require('../config/db');
const { notifyUser, notifyAllUsers, notifyGroupMembers, notifyAdmins } = require('../services/notifyService');

/**
 * Schedule a new study session (Group Leader or Admin)
 */
async function createSession(req, res, next) {
    try {
        const {
            group_id,
            title,
            study_date,
            start_time,
            end_time,
            location_or_link,
            description
        } = req.body;

        const groupId = parseInt(group_id, 10);

        if (!groupId || !title || !study_date || !start_time || !end_time || !location_or_link) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required session details: group, title, date, start time, end time, and location/link.'
            });
        }

        // Validate leader role
        const [groups] = await db.query('SELECT name, leader_id FROM study_groups WHERE id = ?', [groupId]);
        if (!groups || groups.length === 0) {
            return res.status(404).json({ success: false, message: 'Study group not found.' });
        }

        const group = groups[0];
        if (req.user.role !== 'ADMIN' && group.leader_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Only the group leader can schedule study sessions.'
            });
        }

        const [result] = await db.query(
            `INSERT INTO study_sessions (group_id, created_by, title, study_date, start_time, end_time, location_or_link, description, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'UPCOMING')`,
            [groupId, req.user.id, title.trim(), study_date, start_time, end_time, location_or_link.trim(), description ? description.trim() : null]
        );

        const newSessionId = result.insertId;

        // Broadcast notification to all approved group members
        await notifyGroupMembers(
            groupId,
            `New Study Session: ${title.trim()}`,
            `Session scheduled in ${group.name} on ${study_date} at ${start_time} (${location_or_link.trim()}).`,
            'SESSION',
            '/sessions',
            req.user.id
        );

        // Notify session creator
        await notifyUser(
            req.user.id,
            'Study Session Scheduled',
            `Your session "${title.trim()}" in ${group.name} has been scheduled for ${study_date}.`,
            'SUCCESS',
            '/sessions'
        );

        return res.status(201).json({
            success: true,
            message: 'Study session scheduled successfully.',
            sessionId: newSessionId
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Get all sessions for a specific group
 */
async function getGroupSessions(req, res, next) {
    try {
        const groupId = parseInt(req.params.groupId, 10);

        const [sessions] = await db.query(
            `SELECT s.*, u.full_name as creator_name, g.name as group_name, g.course_code
             FROM study_sessions s
             JOIN users u ON s.created_by = u.id
             JOIN study_groups g ON s.group_id = g.id
             WHERE s.group_id = ?
             ORDER BY s.study_date ASC, s.start_time ASC`,
            [groupId]
        );

        return res.status(200).json({
            success: true,
            sessions
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Get upcoming sessions for currently logged-in user across all joined groups
 */
async function getUserUpcomingSessions(req, res, next) {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'ADMIN';
        const showAll = req.query.all === 'true' || isAdmin;

        let sessions;
        if (showAll) {
            const [rows] = await db.query(
                `SELECT s.*, g.name as group_name, g.course_code, g.faculty, u.full_name as leader_name
                 FROM study_sessions s
                 LEFT JOIN study_groups g ON s.group_id = g.id
                 LEFT JOIN users u ON s.created_by = u.id
                 WHERE s.status = 'UPCOMING'
                 ORDER BY s.study_date ASC, s.start_time ASC
                 LIMIT 25`
            );
            sessions = rows;
        } else {
            const [rows] = await db.query(
                `SELECT s.*, g.name as group_name, g.course_code, g.faculty, u.full_name as leader_name
                 FROM study_sessions s
                 JOIN study_groups g ON s.group_id = g.id
                 JOIN group_members gm ON gm.group_id = g.id
                 JOIN users u ON s.created_by = u.id
                 WHERE gm.user_id = ? AND gm.status = 'APPROVED' AND s.status = 'UPCOMING'
                 ORDER BY s.study_date ASC, s.start_time ASC
                 LIMIT 20`,
                [userId]
            );
            sessions = rows;
            // Fallback: If user has no personal sessions yet, show all upcoming platform sessions
            if (!sessions || sessions.length === 0) {
                const [allRows] = await db.query(
                    `SELECT s.*, g.name as group_name, g.course_code, g.faculty, u.full_name as leader_name
                     FROM study_sessions s
                     LEFT JOIN study_groups g ON s.group_id = g.id
                     LEFT JOIN users u ON s.created_by = u.id
                     WHERE s.status = 'UPCOMING'
                     ORDER BY s.study_date ASC, s.start_time ASC
                     LIMIT 20`
                );
                sessions = allRows;
            }
        }

        return res.status(200).json({
            success: true,
            sessions: sessions || []
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Update study session status (Complete or Cancel)
 */
async function updateSessionStatus(req, res, next) {
    try {
        const sessionId = parseInt(req.params.id, 10);
        const { status } = req.body;

        if (!['UPCOMING', 'COMPLETED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid session status.' });
        }

        const [sessions] = await db.query('SELECT s.*, g.leader_id FROM study_sessions s JOIN study_groups g ON s.group_id = g.id WHERE s.id = ?', [sessionId]);
        if (!sessions || sessions.length === 0) {
            return res.status(404).json({ success: false, message: 'Session not found.' });
        }

        if (req.user.role !== 'ADMIN' && sessions[0].leader_id !== req.user.id && sessions[0].created_by !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Only session creators or group leaders can update this session.' });
        }

        await db.query('UPDATE study_sessions SET status = ? WHERE id = ?', [status, sessionId]);

        // Notify group members of session status change
        await notifyGroupMembers(
            sessions[0].group_id,
            `Session Status: ${status}`,
            `The study session "${sessions[0].title}" has been marked as ${status}.`,
            'SESSION',
            '/sessions',
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: `Session status marked as ${status}.`
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createSession,
    getGroupSessions,
    getUserUpcomingSessions,
    updateSessionStatus
};
