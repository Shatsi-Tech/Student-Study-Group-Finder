/**
 * Group Posts and Announcements Controller
 */
const db = require('../config/db');

/**
 * Create a new post in a group
 */
async function createPost(req, res, next) {
    try {
        const { group_id, title, content, post_type, is_pinned } = req.body;
        const groupId = parseInt(group_id, 10);
        const userId = req.user.id;

        if (!groupId || !title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Group ID, title, and content are required.'
            });
        }

        // Verify group exists
        const [groups] = await db.query('SELECT * FROM study_groups WHERE id = ?', [groupId]);
        if (!groups || groups.length === 0) {
            return res.status(404).json({ success: false, message: 'Study group not found.' });
        }
        const group = groups[0];

        // Verify user is an approved member or leader or admin
        if (req.user.role !== 'ADMIN') {
            const [membership] = await db.query(
                'SELECT * FROM group_members WHERE group_id = ? AND user_id = ? AND status = "APPROVED"',
                [groupId, userId]
            );
            if (!membership || membership.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'You must join this study group before posting.'
                });
            }
        }

        const type = ['DISCUSSION', 'ANNOUNCEMENT', 'QUESTION'].includes(post_type) ? post_type : 'DISCUSSION';
        const pinned = is_pinned && (req.user.role === 'ADMIN' || group.leader_id === userId) ? 1 : 0;

        const [result] = await db.query(
            `INSERT INTO posts (group_id, user_id, title, content, post_type, is_pinned)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [groupId, userId, title.trim(), content.trim(), type, pinned]
        );

        const newPostId = result.insertId;

        return res.status(201).json({
            success: true,
            message: 'Post published successfully.',
            postId: newPostId
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Get all posts for a group
 */
async function getGroupPosts(req, res, next) {
    try {
        const groupId = parseInt(req.params.groupId, 10);

        const [posts] = await db.query(
            `SELECT p.*, u.full_name as author_name, u.email as author_email, u.programme, u.year_of_study, u.avatar_url
             FROM posts p
             JOIN users u ON p.user_id = u.id
             WHERE p.group_id = ?
             ORDER BY p.is_pinned DESC, p.created_at DESC`,
            [groupId]
        );

        // Fetch comments for all posts
        const [allComments] = await db.query(
            `SELECT c.*, u.full_name as author_name, u.avatar_url
             FROM comments c
             JOIN users u ON c.user_id = u.id
             ORDER BY c.created_at ASC`
        );

        const postsWithComments = posts.map(post => ({
            ...post,
            comments: allComments.filter(c => c.post_id === post.id)
        }));

        return res.status(200).json({
            success: true,
            posts: postsWithComments
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Delete a post (Author, Leader, or Admin)
 */
async function deletePost(req, res, next) {
    try {
        const postId = parseInt(req.params.id, 10);

        const [posts] = await db.query(
            'SELECT p.*, g.leader_id FROM posts p JOIN study_groups g ON p.group_id = g.id WHERE p.id = ?',
            [postId]
        );

        if (!posts || posts.length === 0) {
            return res.status(404).json({ success: false, message: 'Post not found.' });
        }

        const post = posts[0];
        const canDelete = req.user.role === 'ADMIN' || post.user_id === req.user.id || post.leader_id === req.user.id;

        if (!canDelete) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have permission to delete this post.'
            });
        }

        await db.query('DELETE FROM posts WHERE id = ?', [postId]);

        return res.status(200).json({
            success: true,
            message: 'Post deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createPost,
    getGroupPosts,
    deletePost
};
