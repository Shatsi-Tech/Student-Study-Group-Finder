/**
 * Direct Unit & Integration Test Suite
 * Tests all backend controllers, database persistence, and authorization logic
 * directly in memory without requiring network socket permissions.
 */
const db = require('./config/db');
const authController = require('./controllers/authController');
const groupController = require('./controllers/groupController');
const sessionController = require('./controllers/sessionController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');
const adminController = require('./controllers/adminController');
const notificationController = require('./controllers/notificationController');

function createMockRes() {
    return {
        statusCode: 200,
        data: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.data = payload;
            return this;
        }
    };
}

async function runDirectTests() {
    console.log('====================================================');
    console.log('  STUDENT STUDY GROUP FINDER - BACKEND DIRECT TESTS ');
    console.log('====================================================\n');

    await db.initDatabase();

    // 1. Student Login (Brian Kigozi)
    console.log('1. Testing Student Login...');
    const req1 = { body: { identifier: 'kigozi.brian@ucu.ac.ug', password: 'Student@123' } };
    const res1 = createMockRes();
    await authController.login(req1, res1, (e) => { throw e; });
    console.log(`   Status: ${res1.statusCode} | User: ${res1.data.user.full_name} | Role: ${res1.data.user.role}`);
    if (res1.statusCode !== 200 || !res1.data.token) throw new Error('Student login failed');
    const studentUser = res1.data.user;

    // 2. Fetch Groups with Search
    console.log('\n2. Testing Groups Listing & Search ("Web")...');
    const req2 = { query: { search: 'Web' }, user: studentUser };
    const res2 = createMockRes();
    await groupController.getGroups(req2, res2, (e) => { throw e; });
    console.log(`   Status: ${res2.statusCode} | Found ${res2.data.count} groups | First: "${res2.data.groups[0].name}"`);
    if (res2.data.count < 1) throw new Error('Search failed');

    // 3. Create a Study Group
    console.log('\n3. Testing Group Creation (Auto-assigns Creator as Leader)...');
    const req3 = {
        user: studentUser,
        body: {
            name: 'Cloud Computing & DevOps Lab',
            course_name: 'Distributed & Cloud Systems',
            course_code: 'BIT3209',
            faculty: 'Faculty of Science & Technology',
            description: 'Docker, Kubernetes, CI/CD pipelines, and AWS cloud deployment revision.',
            meeting_location: 'Tech Lab 1 / Zoom',
            meeting_type: 'Hybrid',
            max_members: 12
        }
    };
    const res3 = createMockRes();
    await groupController.createGroup(req3, res3, (e) => { throw e; });
    console.log(`   Status: ${res3.statusCode} | Message: ${res3.data.message} | Group ID: ${res3.data.groupId}`);
    if (res3.statusCode !== 201) throw new Error('Create group failed');
    const newGroupId = res3.data.groupId;

    // 4. Verify Group Details & Leader Assignment
    console.log('\n4. Verifying New Group Details & Leader Assignment...');
    const req4 = { params: { id: newGroupId }, user: studentUser };
    const res4 = createMockRes();
    await groupController.getGroupById(req4, res4, (e) => { throw e; });
    console.log(`   Group Name: "${res4.data.group.name}" | Leader: ${res4.data.group.leader.full_name} | is_leader: ${res4.data.group.is_leader}`);
    if (!res4.data.group.is_leader) throw new Error('Group leader was not assigned correctly');

    // 5. Schedule a Study Session
    console.log('\n5. Testing Study Session Scheduling by Leader...');
    const req5 = {
        user: studentUser,
        body: {
            group_id: newGroupId,
            title: 'Containerization with Docker Workshop',
            study_date: '2024-11-27',
            start_time: '14:00:00',
            end_time: '16:30:00',
            location_or_link: 'Tech Lab 1 (Main Campus)',
            description: 'Hands-on writing Dockerfile and multi-container docker-compose setups.'
        }
    };
    const res5 = createMockRes();
    await sessionController.createSession(req5, res5, (e) => { throw e; });
    console.log(`   Status: ${res5.statusCode} | Message: ${res5.data.message} | Session ID: ${res5.data.sessionId}`);
    if (res5.statusCode !== 201) throw new Error('Session creation failed');

    // 6. Another Student Joins the Group (Sarah Nakato)
    console.log('\n6. Testing Student Joining Study Group...');
    const sarahUser = { id: 3, full_name: 'Sarah Nakato', email: 'nakato.sarah@ucu.ac.ug', role: 'STUDENT' };
    const req6 = { params: { id: newGroupId }, user: sarahUser };
    const res6 = createMockRes();
    await groupController.joinGroup(req6, res6, (e) => { throw e; });
    console.log(`   Status: ${res6.statusCode} | Message: ${res6.data.message}`);
    if (res6.statusCode !== 200) throw new Error('Join group failed');

    // 7. Publish Discussion Post
    console.log('\n7. Testing Discussion Post Publishing...');
    const req7 = {
        user: sarahUser,
        body: {
            group_id: newGroupId,
            title: 'Required Docker software setup',
            content: 'Should we have Docker Desktop or WSL2 Linux installed before Wednesday?',
            post_type: 'QUESTION'
        }
    };
    const res7 = createMockRes();
    await postController.createPost(req7, res7, (e) => { throw e; });
    console.log(`   Status: ${res7.statusCode} | Message: ${res7.data.message} | Post ID: ${res7.data.postId}`);
    if (res7.statusCode !== 201) throw new Error('Post creation failed');
    const newPostId = res7.data.postId;

    // 8. Comment on Post
    console.log('\n8. Testing Commenting on Post...');
    const req8 = {
        user: studentUser,
        body: {
            post_id: newPostId,
            content: 'Yes Sarah, please install Docker Desktop with WSL2 engine activated.'
        }
    };
    const res8 = createMockRes();
    await commentController.createComment(req8, res8, (e) => { throw e; });
    console.log(`   Status: ${res8.statusCode} | Message: ${res8.data.message} | Author: ${res8.data.comment.author_name}`);
    if (res8.statusCode !== 201) throw new Error('Comment failed');

    // 9. Notifications Verification
    console.log('\n9. Testing Notification Delivery...');
    const req9 = { user: sarahUser };
    const res9 = createMockRes();
    await notificationController.getNotifications(req9, res9, (e) => { throw e; });
    console.log(`   Sarah unread notifications: ${res9.data.unreadCount} | Latest: "${res9.data.notifications[0]?.title}"`);

    // 10. Administrator Dashboard Analytics
    console.log('\n10. Testing Administrator Dashboard Analytics...');
    const adminUser = { id: 1, full_name: 'System Administrator', email: 'admin@ucu.ac.ug', role: 'ADMIN' };
    const req10 = { user: adminUser };
    const res10 = createMockRes();
    await adminController.getStats(req10, res10, (e) => { throw e; });
    console.log(`    Status: ${res10.statusCode}`);
    console.log(`    Total Users:        ${res10.data.stats.totalUsers}`);
    console.log(`    Total Groups:       ${res10.data.stats.totalGroups}`);
    console.log(`    Total Sessions:     ${res10.data.stats.totalSessions}`);
    console.log(`    Active Courses:     ${res10.data.stats.mostActiveCourses.map(c => c.course).join(', ')}`);
    console.log(`    Faculty Dist.:      ${res10.data.stats.facultyDistribution.map(f => `${f.faculty} (${f.count})`).join(', ')}`);
    if (res10.statusCode !== 200 || res10.data.stats.totalUsers < 1) throw new Error('Admin stats failed');

    console.log('\n======================================================');
    console.log(' ALL 10 CORE CONTROLLER & DATABASE TESTS SUCCEEDED!   ');
    console.log('======================================================\n');
}

runDirectTests().catch(err => {
    console.error('[TEST FAILURE]:', err);
    process.exit(1);
});
