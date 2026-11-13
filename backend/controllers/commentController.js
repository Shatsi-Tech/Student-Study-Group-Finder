/**
 * Post Comments Controller
 */
const db = require('../config/db');

/**
 * Add a comment to a post
 */
async function createComment(req, res, next) {
    try {
        const { post_id, content } = req.body;
        const postId = parseInt(post_id, 10);
        const userId = req.user.id;

        if (!postId || !content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Post ID and comment content are required.'
            });
        }

        // Verify post exists
        const [posts] = await db.query(
            'SELECT p.*, g.name as group_name FROM posts p JOIN study_groups g ON p.group_id = g.id WHERE p.id = ?',
            [postId]
        );
        if (!posts || posts.length === 0) {
            return res.status(404).json({ success: false, message: 'Discussion post not found.' });
        }

        const post = posts[0];

        // Verify membership if not admin
        if (req.user.role !== 'ADMIN') {
            const [membership] = await db.query(
                'SELECT * FROM group_members WHERE group_id = ? AND user_id = ? AND status = "APPROVED"',
                [post.group_id, userId]
            );
            if (!membership || membership.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'You must be a member of this study group to post comments.'
                });
            }
        }

        const [result] = await db.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [postId, userId, content.trim()]
        );

        const newCommentId = result.insertId;

        // Notify post author if not the commenter
        if (post.user_id !== userId) {
            await db.query(
                `INSERT INTO notifications (user_id, title, message, type, is_read, link)
                 VALUES (?, 'New Comment on Your Post', ?, 'COMMENT', 0, ?)`,
                [
                    post.user_id,
                    `${req.user.full_name} commented on "${post.title}" in ${post.group_name}.`,
                    `/groups/${post.group_id}`
                ]
            );
        }

        // Fetch new comment with author details
        const [newComment] = await db.query(
            `SELECT c.*, u.full_name as author_name, u.avatar_url
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.id = ?`,
            [newCommentId]
        );

        return res.status(201).json({
            success: true,
            message: 'Comment posted successfully.',
            comment: newComment[0]
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Delete a comment (Author, Group Leader, or Admin)
 */
async function deleteComment(req, res, next) {
    try {
        const commentId = parseInt(req.params.id, 10);

        const [comments] = await db.query(
            `SELECT c.*, p.group_id, g.leader_id
             FROM comments c
             JOIN posts p ON c.post_id = p.id
             JOIN study_groups g ON p.group_id = g.id
             WHERE c.id = ?`,
            [commentId]
        );

        if (!comments || comments.length === 0) {
            return res.status(404).json({ success: false, message: 'Comment not found.' });
        }

        const comment = comments[0];
        const canDelete = req.user.role === 'ADMIN' || comment.user_id === req.user.id || comment.leader_id === req.user.id;

        if (!canDelete) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have permission to delete this comment.'
            });
        }

        await db.query('DELETE FROM comments WHERE id = ?', [commentId]);

        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createComment,
    deleteComment
};
