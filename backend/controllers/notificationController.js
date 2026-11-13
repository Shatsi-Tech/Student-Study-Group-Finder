/**
 * Notifications Controller
 */
const db = require('../config/db');

async function getNotifications(req, res, next) {
    try {
        const userId = req.user.id;

        const [notifications] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 25',
            [userId]
        );

        const unreadCount = notifications.filter(n => !n.is_read).length;

        return res.status(200).json({
            success: true,
            unreadCount,
            notifications
        });
    } catch (err) {
        next(err);
    }
}

async function markAsRead(req, res, next) {
    try {
        const notifId = parseInt(req.params.id, 10);
        const userId = req.user.id;

        await db.query(
            'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
            [notifId, userId]
        );

        return res.status(200).json({
            success: true,
            message: 'Notification marked as read.'
        });
    } catch (err) {
        next(err);
    }
}

async function markAllAsRead(req, res, next) {
    try {
        const userId = req.user.id;

        await db.query(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
            [userId]
        );

        return res.status(200).json({
            success: true,
            message: 'All notifications marked as read.'
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
