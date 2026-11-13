/**
 * Study Session Model
 */
const db = require('../config/db');

const SessionModel = {
    async findById(id) {
        const [rows] = await db.query('SELECT * FROM study_sessions WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async findByGroupId(groupId) {
        const [rows] = await db.query('SELECT * FROM study_sessions WHERE group_id = ? ORDER BY study_date ASC', [groupId]);
        return rows;
    },

    async create(sessionData) {
        const { group_id, created_by, title, study_date, start_time, end_time, location_or_link, description } = sessionData;
        const [result] = await db.query(
            `INSERT INTO study_sessions (group_id, created_by, title, study_date, start_time, end_time, location_or_link, description, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'UPCOMING')`,
            [group_id, created_by, title, study_date, start_time, end_time, location_or_link, description]
        );
        return result.insertId;
    },

    async updateStatus(id, status) {
        const [result] = await db.query('UPDATE study_sessions SET status = ? WHERE id = ?', [status, id]);
        return result.affectedRows > 0;
    }
};

module.exports = SessionModel;
