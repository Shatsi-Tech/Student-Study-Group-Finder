/**
 * Study Group Model
 * Database operations for Study Group entities.
 */
const db = require('../config/db');

const GroupModel = {
    async findById(id) {
        const [rows] = await db.query('SELECT * FROM study_groups WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async getAll(filters = {}) {
        let sql = 'SELECT * FROM study_groups ORDER BY created_at DESC';
        const [rows] = await db.query(sql);
        return rows;
    },

    async create(groupData) {
        const { name, course_name, course_code, faculty, description, meeting_location, meeting_type, leader_id, max_members } = groupData;
        const [result] = await db.query(
            `INSERT INTO study_groups (name, course_name, course_code, faculty, description, meeting_location, meeting_type, leader_id, max_members, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
            [name, course_name, course_code, faculty, description, meeting_location, meeting_type, leader_id, max_members || 15]
        );
        return result.insertId;
    },

    async update(id, updates) {
        const { name, course_name, course_code, faculty, description, meeting_location, meeting_type, max_members, status } = updates;
        const [result] = await db.query(
            `UPDATE study_groups
             SET name = ?, course_name = ?, course_code = ?, faculty = ?, description = ?, meeting_location = ?, meeting_type = ?, max_members = ?, status = ?
             WHERE id = ?`,
            [name, course_name, course_code, faculty, description, meeting_location, meeting_type, max_members, status, id]
        );
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await db.query('DELETE FROM study_groups WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = GroupModel;
