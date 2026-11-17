/**
 * Study Group Controller
 * Handles group creation (auto-assigns leader), discovery, search, filtering,
 * membership management (joining, leaving, member lists, removal).
 */
const db = require('../config/db');
const { notifyUser, notifyAllUsers, notifyGroupMembers, notifyAdmins } = require('../services/notifyService');

/**
 * Create a new study group
 * Rule: The creator automatically becomes the group leader.
 */
async function createGroup(req, res, next) {
    try {
        const {
            name,
            course_name,
            course_code,
            faculty,
            description,
            meeting_location,
            meeting_type,
            max_members
        } = req.body;

        if (!name || !course_name || !course_code || !faculty || !description || !meeting_location) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required. Please provide full details for the study group.'
            });
        }

        const leaderId = req.user.id;
        const groupCapacity = parseInt(max_members, 10) || 15;
        const type = meeting_type || 'Physical';

        // 1. Insert into study_groups with status 'Pending' awaiting Administrator approval
        const [result] = await db.query(
            `INSERT INTO study_groups (name, course_name, course_code, faculty, description, meeting_location, meeting_type, leader_id, max_members, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
            [name.trim(), course_name.trim(), course_code.trim().toUpperCase(), faculty.trim(), description.trim(), meeting_location.trim(), type, leaderId, groupCapacity]
        );

        const newGroupId = result.insertId;

        // 2. Automatically add creator as LEADER in group_members table
        await db.query(
            `INSERT INTO group_members (group_id, user_id, member_role, status)
             VALUES (?, ?, 'LEADER', 'APPROVED')`,
            [newGroupId, leaderId]
        );

        // 3. Automatically schedule an Inaugural Study Session for this group
        // This ensures the session immediately appears in Study Sessions and Admin Dashboard
        const sessionDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        await db.query(
            `INSERT INTO study_sessions (group_id, created_by, title, study_date, start_time, end_time, location_or_link, description, status)
             VALUES (?, ?, ?, ?, '14:00', '16:00', ?, ?, 'UPCOMING')`,
            [
                newGroupId,
                leaderId,
                `Inaugural Study & Orientation Session - ${name.trim()}`,
                sessionDate,
                meeting_location.trim(),
                `First collaborative orientation and revision session for ${name.trim()} (${course_code.trim().toUpperCase()} - ${course_name.trim()}).`
            ]
        );

        // 4. Create initial welcome post
        await db.query(
            `INSERT INTO posts (group_id, user_id, title, content, post_type, is_pinned)
             VALUES (?, ?, 'Welcome to our new study group!', ?, 'ANNOUNCEMENT', 1)`,
            [
                newGroupId,
                leaderId,
                `Welcome everyone to ${name.trim()} for ${course_code.trim().toUpperCase()} (${course_name.trim()}). Feel free to ask questions, share revision notes, and check our scheduled study sessions!`
            ]
        );

        // 5. Create confirmation notification for leader
        await notifyUser(
            leaderId,
            'Study Group Created (Pending Admin Review)',
            `Your study group "${name.trim()}" has been submitted and is pending administrator approval.`,
            'SYSTEM',
            `/groups/${newGroupId}`
        );

        // 6. Notify Administrators of new group submission
        await notifyAdmins(
            'New Study Group Awaiting Approval',
            `${req.user.full_name || 'A student'} created "${name.trim()}" (${course_code.trim().toUpperCase()}). Please review and approve or reject it.`,
            'ADMIN',
            '/admin'
        );

        // 7. Broadcast notification to ALL students/members in the system so everyone is notified
        await notifyAllUsers(
            `New Study Group Available: ${name.trim()}`,
            `${req.user.full_name || 'A student'} has started a study group for ${course_code.trim().toUpperCase()} (${course_name.trim()}). Explore and join!`,
            'GROUP',
            `/groups/${newGroupId}`,
            leaderId
        );

        // 8. Broadcast notification for the scheduled inaugural session
        await notifyAllUsers(
            `New Study Session Scheduled: ${name.trim()}`,
            `Inaugural revision & orientation session scheduled for ${sessionDate} (14:00 - 16:00) in ${name.trim()}.`,
            'SESSION',
            '/sessions',
            leaderId
        );

        return res.status(201).json({
            success: true,
            message: 'Study group created successfully! It is pending administrator approval.',
            groupId: newGroupId,
            status: 'Pending'
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Get all study groups with optional search and filters
 */
async function getGroups(req, res, next) {
    try {
        const { search, faculty, meeting_type, my_groups } = req.query;
        const currentUserId = req.user ? req.user.id : null;

        let [groups] = await db.query('SELECT * FROM study_groups ORDER BY created_at DESC');

        // Fetch leaders and member counts
        const [memberships] = await db.query('SELECT group_id, user_id, member_role, status FROM group_members WHERE status = "APPROVED"');
        const [users] = await db.query('SELECT id, full_name, email FROM users');

        let enrichedGroups = groups.map(g => {
            const leader = users.find(u => u.id === g.leader_id) || {};
            const approvedMembers = memberships.filter(m => m.group_id === g.id);
            const isUserMember = currentUserId ? memberships.some(m => m.group_id === g.id && m.user_id === currentUserId) : false;
            const userMembership = currentUserId ? memberships.find(m => m.group_id === g.id && m.user_id === currentUserId) : null;

            return {
                ...g,
                leader_name: leader.full_name || 'Group Leader',
                leader_email: leader.email || '',
                member_count: approvedMembers.length,
                is_member: isUserMember,
                user_role: userMembership ? userMembership.member_role : null
            };
        });

        // Filter: my_groups only
        if (my_groups === 'true' && currentUserId) {
            enrichedGroups = enrichedGroups.filter(g => g.is_member);
        }

        // Filter: search by name, course_name, or course_code
        if (search && search.trim() !== '') {
            const term = search.trim().toLowerCase();
            enrichedGroups = enrichedGroups.filter(g =>
                (g.name && g.name.toLowerCase().includes(term)) ||
                (g.course_name && g.course_name.toLowerCase().includes(term)) ||
                (g.course_code && g.course_code.toLowerCase().includes(term)) ||
                (g.description && g.description.toLowerCase().includes(term))
            );
        }

        // Filter: faculty
        if (faculty && faculty.trim() !== '' && faculty !== 'All') {
            enrichedGroups = enrichedGroups.filter(g => g.faculty === faculty.trim());
        }

        // Filter: meeting_type
        if (meeting_type && meeting_type.trim() !== '' && meeting_type !== 'All') {
            enrichedGroups = enrichedGroups.filter(g => g.meeting_type === meeting_type.trim());
        }

        return res.status(200).json({
            success: true,
            count: enrichedGroups.length,
            groups: enrichedGroups
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Get single study group details
 */
async function getGroupById(req, res, next) {
    try {
        const groupId = parseInt(req.params.id, 10);
        const currentUserId = req.user ? req.user.id : null;

        const [groups] = await db.query('SELECT * FROM study_groups WHERE id = ?', [groupId]);
        if (!groups || groups.length === 0) {
            return res.status(404).json({ success: false, message: 'Study group not found.' });
        }

        const group = groups[0];

        // Fetch leader info
        const [leaders] = await db.query('SELECT id, full_name, email, reg_number, faculty, programme FROM users WHERE id = ?', [group.leader_id]);
        const leader = leaders.length > 0 ? leaders[0] : null;

        // Fetch approved members
        const [members] = await db.query(
            `SELECT gm.id as membership_id, gm.user_id, gm.member_role, gm.status, gm.joined_at,
                    u.full_name, u.email, u.reg_number, u.programme, u.faculty, u.year_of_study
             FROM group_members gm
             JOIN users u ON gm.user_id = u.id
             WHERE gm.group_id = ? AND gm.status = 'APPROVED'
             ORDER BY gm.member_role DESC, gm.joined_at ASC`,
            [groupId]
        );

        // Check current user status
        let userMembership = null;
        if (currentUserId) {
            const [userMemberRows] = await db.query(
                'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?',
                [groupId, currentUserId]
            );
            if (userMemberRows && userMemberRows.length > 0) {
                userMembership = userMemberRows[0];
            }
        }

        return res.status(200).json({
            success: true,
            group: {
                ...group,
                leader,
                member_count: members.length,
                is_member: !!userMembership,
                user_role: userMembership ? userMembership.member_role : null,
                is_leader: currentUserId === group.leader_id || (userMembership && userMembership.member_role === 'LEADER')
            },
            members
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Update study group details (Leader or Admin)
 */
async function updateGroup(req, res, next) {
    try {
        const groupId = parseInt(req.params.id, 10);
        const { name, course_name, course_code, faculty, description, meeting_location, meeting_type, max_members, status } = req.body;

        const [groups] = await db.query('SELECT * FROM study_groups WHERE id = ?', [groupId]);
        if (!groups || groups.length === 0) {
            return res.status(404).json({ success: false, message: 'Study group not found.' });
        }

        const currentGroup = groups[0];
        if (req.user.role !== 'ADMIN' && currentGroup.leader_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Only the group leader or administrator can edit this group.' });
        }

        await db.query(
            `UPDATE study_groups
             SET name = ?, course_name = ?, course_code = ?, faculty = ?, description = ?, meeting_location = ?, meeting_type = ?, max_members = ?, status = ?
             WHERE id = ?`,
            [
                name || currentGroup.name,
                course_name || currentGroup.course_name,
                (course_code || currentGroup.course_code).toUpperCase(),
                faculty || currentGroup.faculty,
                description || currentGroup.description,
                meeting_location || currentGroup.meeting_location,
                meeting_type || currentGroup.meeting_type,
                max_members || currentGroup.max_members,
                status || currentGroup.status,
                groupId
            ]
        );

        return res.status(200).json({
            success: true,
            message: 'Study group details updated successfully.'
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Delete study group (Leader or Admin)
 */
async function deleteGroup(req, res, next) {
    try {
        const groupId = parseInt(req.params.id, 10);
        const [groups] = await db.query('SELECT * FROM study_groups WHERE id = ?', [groupId]);

        if (!groups || groups.length === 0) {
            return res.status(404).json({ success: false, message: 'Study group not found.' });
        }

        if (req.user.role !== 'ADMIN' && groups[0].leader_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to delete this group.' });
        }

        await db.query('DELETE FROM study_groups WHERE id = ?', [groupId]);

        return res.status(200).json({
            success: true,
            message: 'Study group deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Join a study group
 */
async function joinGroup(req, res, next) {
    try {
        const groupId = parseInt(req.params.id, 10);
        const userId = req.user.id;

        const [groups] = await db.query('SELECT * FROM study_groups WHERE id = ?', [groupId]);
        if (!groups || groups.length === 0) {
            return res.status(404).json({ success: false, message: 'Study group not found.' });
        }

        const group = groups[0];

        // Check if already a member
        const [existing] = await db.query('SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', [groupId, userId]);
        if (existing && existing.length > 0) {
            return res.status(400).json({ success: false, message: 'You have already joined this study group.' });
        }

        // Check capacity
        const [members] = await db.query('SELECT id FROM group_members WHERE group_id = ? AND status = "APPROVED"', [groupId]);
        if (members.length >= group.max_members) {
            return res.status(400).json({ success: false, message: 'This study group has reached its maximum member capacity.' });
        }

        await db.query(
            'INSERT INTO group_members (group_id, user_id, member_role, status) VALUES (?, ?, "MEMBER", "APPROVED")',
            [groupId, userId]
        );

        // Notify the student who joined
        await notifyUser(
            userId,
            `Joined ${group.name}`,
            `You are now an active member of "${group.name}" (${group.course_code}). Start participating in discussions and sessions!`,
            'SUCCESS',
            `/groups/${groupId}`
        );

        // Notify all other members of the group
        await notifyGroupMembers(
            groupId,
            `New Member in ${group.name}`,
            `${req.user.full_name || 'A student'} has joined the study group.`,
            'MEMBER',
            `/groups/${groupId}`,
            userId
        );

        return res.status(200).json({
            success: true,
            message: `Successfully joined ${group.name}!`
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Leave a study group
 */
async function leaveGroup(req, res, next) {
    try {
        const groupId = parseInt(req.params.id, 10);
        const userId = req.user.id;

        const [groups] = await db.query('SELECT * FROM study_groups WHERE id = ?', [groupId]);
        if (!groups || groups.length === 0) {
            return res.status(404).json({ success: false, message: 'Study group not found.' });
        }

        if (groups[0].leader_id === userId) {
            return res.status(400).json({
                success: false,
                message: 'As the Group Leader, you cannot leave the group. You can edit group settings or delete the group instead.'
            });
        }

        await db.query('DELETE FROM group_members WHERE group_id = ? AND user_id = ?', [groupId, userId]);

        // Notify Group Leader
        await notifyUser(
            groups[0].leader_id,
            `Member Left ${groups[0].name}`,
            `${req.user.full_name || 'A student'} has left your study group.`,
            'MEMBER',
            `/groups/${groupId}`
        );

        return res.status(200).json({
            success: true,
            message: 'You have left the study group.'
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Remove a member (Group Leader or Admin only)
 */
async function removeMember(req, res, next) {
    try {
        const groupId = parseInt(req.params.id, 10);
        const memberUserId = parseInt(req.params.userId, 10);

        const [groups] = await db.query('SELECT * FROM study_groups WHERE id = ?', [groupId]);
        if (!groups || groups.length === 0) {
            return res.status(404).json({ success: false, message: 'Study group not found.' });
        }

        if (req.user.role !== 'ADMIN' && groups[0].leader_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden: Only the group leader can remove members.' });
        }

        if (groups[0].leader_id === memberUserId) {
            return res.status(400).json({ success: false, message: 'Cannot remove the primary group leader.' });
        }

        await db.query('DELETE FROM group_members WHERE group_id = ? AND user_id = ?', [groupId, memberUserId]);

        // Notify removed user
        await db.query(
            `INSERT INTO notifications (user_id, title, message, type, is_read)
             VALUES (?, 'Removed from Study Group', ?, 'SYSTEM', 0)`,
            [memberUserId, `You have been removed from the study group "${groups[0].name}".`]
        );

        return res.status(200).json({
            success: true,
            message: 'Member removed from study group.'
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    removeMember
};
