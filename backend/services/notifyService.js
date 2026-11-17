/**
 * Universal System Notification Dispatcher
 * Dispatches notifications to users, groups, admins, and platform-wide broadcasts.
 */
const db = require('../config/db');

/**
 * Send a notification to a specific user
 */
async function notifyUser(userId, title, message, type = 'SYSTEM', link = '/') {
    try {
        if (!userId) return;
        await db.query(
            `INSERT INTO notifications (user_id, title, message, type, is_read, link)
             VALUES (?, ?, ?, ?, 0, ?)`,
            [parseInt(userId, 10), title.trim(), message.trim(), type, link]
        );
    } catch (err) {
        console.error('notifyUser error:', err);
    }
}

/**
 * Broadcast a notification to ALL active users across the entire system
 * (e.g. new study group created, platform announcements)
 */
async function notifyAllUsers(title, message, type = 'ANNOUNCEMENT', link = '/', excludeUserId = null) {
    try {
        const [users] = await db.query('SELECT id FROM users WHERE is_active = 1');
        if (!users || users.length === 0) return 0;

        let count = 0;
        for (const u of users) {
            if (excludeUserId && parseInt(u.id, 10) === parseInt(excludeUserId, 10)) {
                continue;
            }
            await db.query(
                `INSERT INTO notifications (user_id, title, message, type, is_read, link)
                 VALUES (?, ?, ?, ?, 0, ?)`,
                [u.id, title.trim(), message.trim(), type, link]
            );
            count++;
        }
        return count;
    } catch (err) {
        console.error('notifyAllUsers error:', err);
        return 0;
    }
}

/**
 * Send notification to all approved members of a specific study group
 */
async function notifyGroupMembers(groupId, title, message, type = 'GROUP', link = '/', excludeUserId = null) {
    try {
        const [members] = await db.query(
            'SELECT user_id FROM group_members WHERE group_id = ? AND status = "APPROVED"',
            [parseInt(groupId, 10)]
        );
        if (!members || members.length === 0) return 0;

        let count = 0;
        for (const m of members) {
            if (excludeUserId && parseInt(m.user_id, 10) === parseInt(excludeUserId, 10)) {
                continue;
            }
            await db.query(
                `INSERT INTO notifications (user_id, title, message, type, is_read, link)
                 VALUES (?, ?, ?, ?, 0, ?)`,
                [m.user_id, title.trim(), message.trim(), type, link]
            );
            count++;
        }
        return count;
    } catch (err) {
        console.error('notifyGroupMembers error:', err);
        return 0;
    }
}

/**
 * Send notification to all administrators
 */
async function notifyAdmins(title, message, type = 'ADMIN', link = '/admin', excludeUserId = null) {
    try {
        const [admins] = await db.query('SELECT id FROM users WHERE role = "ADMIN"');
        if (!admins || admins.length === 0) return 0;

        let count = 0;
        for (const admin of admins) {
            if (excludeUserId && parseInt(admin.id, 10) === parseInt(excludeUserId, 10)) {
                continue;
            }
            await db.query(
                `INSERT INTO notifications (user_id, title, message, type, is_read, link)
                 VALUES (?, ?, ?, ?, 0, ?)`,
                [admin.id, title.trim(), message.trim(), type, link]
            );
            count++;
        }
        return count;
    } catch (err) {
        console.error('notifyAdmins error:', err);
        return 0;
    }
}

module.exports = {
    notifyUser,
    notifyAllUsers,
    notifyGroupMembers,
    notifyAdmins
};
