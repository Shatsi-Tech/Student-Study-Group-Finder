/**
 * Post & Discussion Model
 */
const db = require('../config/db');

const PostModel = {
    async findById(id) {
        const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async findByGroupId(groupId) {
        const [rows] = await db.query('SELECT * FROM posts WHERE group_id = ? ORDER BY is_pinned DESC, created_at DESC', [groupId]);
        return rows;
    },

    async create(postData) {
        const { group_id, user_id, title, content, post_type, is_pinned } = postData;
        const [result] = await db.query(
            `INSERT INTO posts (group_id, user_id, title, content, post_type, is_pinned)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [group_id, user_id, title, content, post_type || 'DISCUSSION', is_pinned ? 1 : 0]
        );
        return result.insertId;
    },

    async delete(id) {
        const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = PostModel;
