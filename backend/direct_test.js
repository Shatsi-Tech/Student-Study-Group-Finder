/**
 * Direct Controller & Database Test Suite (In-Process)
 * Tests full student lifecycle: Registration -> Login -> Create Group -> Sessions -> Discussions -> Admin Analytics
 */
const db = require('./config/db');
const authController = require('./controllers/authController');
const groupController = require('./controllers/groupController');
const sessionController = require('./controllers/sessionController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');
const notificationController = require('./controllers/notificationController');
const adminController = require('./controllers/adminController');

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
    db.seedStore(); // Start with clean state

    // 1. Student Registration
    console.log('1. Testing Student Account Registration...');
    const req1 = {
        body: {
            full_name: 'Test Student',
            reg_number: 'S24/B23/BSIT/999',
            email: 'test.student@ucu.ac.ug',
            password: 'Student@123',
            confirm_password: 'Student@123',
            programme: 'Bachelor of Science in Information Technology',
            faculty: 'Faculty of Science & Technology',
            year_of_study: 'Year 2'
        }
    };
    const res1 = createMockRes();
    await authController.register(req1, res1, (e) => { throw e; });
    console.log(`   Status: ${res1.statusCode} | User: ${res1.data.user.full_name} | Role: ${res1.data.user.role}`);
    if (res1.statusCode !== 201 || !res1.data.token) throw new Error('Student registration failed');
    const studentUser = res1.data.user;

    // 2. Student Login
    console.log('\n2. Testing Student Login with Email...');
    const req2 = { body: { identifier: 'test.student@ucu.ac.ug', password: 'Student@123' } };
    const res2 = createMockRes();
    await authController.login(req2, res2, (e) => { throw e; });
    console.log(`   Status: ${res2.statusCode} | Token: ${res2.data.token.slice(0, 15)}...`);
    if (res2.statusCode !== 200) throw new Error('Student login failed');

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
            study_date: '2026-11-27',
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

    // 6. Register a Second Student and Join Group
    console.log('\n6. Registering Second Student and Testing Group Join...');
    const req6_reg = {
        body: {
            full_name: 'Peer Student',
            reg_number: 'S24/B23/BSCS/888',
            email: 'peer.student@ucu.ac.ug',
            password: 'Student@123',
            confirm_password: 'Student@123',
            programme: 'Bachelor of Science in Computer Science',
            faculty: 'Faculty of Science & Technology',
            year_of_study: 'Year 2'
        }
    };
    const res6_reg = createMockRes();
    await authController.register(req6_reg, res6_reg, (e) => { throw e; });
    const peerUser = res6_reg.data.user;

    const req6 = { params: { id: newGroupId }, user: peerUser };
    const res6 = createMockRes();
    await groupController.joinGroup(req6, res6, (e) => { throw e; });
    console.log(`   Status: ${res6.statusCode} | Message: ${res6.data.message}`);
    if (res6.statusCode !== 200) throw new Error('Join group failed');

    // 7. Publish Discussion Post
    console.log('\n7. Testing Discussion Post Publishing...');
    const req7 = {
        user: peerUser,
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
            content: 'Please install Docker Desktop with WSL2 engine activated.'
        }
    };
    const res8 = createMockRes();
    await commentController.createComment(req8, res8, (e) => { throw e; });
    console.log(`   Status: ${res8.statusCode} | Message: ${res8.data.message} | Author: ${res8.data.comment.author_name}`);
    if (res8.statusCode !== 201) throw new Error('Comment failed');

    // 9. Admin Login & Dashboard Analytics
    console.log('\n9. Testing Admin Login and Dashboard Analytics...');
    const req9 = { body: { identifier: 'shatsikarongo55@mail.com', password: 'Shatsi@1234' } };
    const res9 = createMockRes();
    await authController.login(req9, res9, (e) => { throw e; });
    console.log(`   Admin Login Status: ${res9.statusCode} | Welcome: ${res9.data.user.full_name}`);
    if (res9.statusCode !== 200 || res9.data.user.full_name !== 'Karongo Shatsi') throw new Error('Admin login failed');

    const req10 = { user: res9.data.user };
    const res10 = createMockRes();
    await adminController.getStats(req10, res10, (e) => { throw e; });
    console.log(`   Total Users:        ${res10.data.stats.totalUsers}`);
    console.log(`   Total Groups:       ${res10.data.stats.totalGroups}`);
    console.log(`   Total Sessions:     ${res10.data.stats.totalSessions}`);
    console.log(`   Active Courses:     ${res10.data.stats.mostActiveCourses.map(c => c.course).join(', ')}`);

    // 10. Database Reset / Clean Slate Endpoint
    console.log('\n10. Testing Database Reset (Clean Slate)...');
    const reqReset = { user: res9.data.user };
    const resReset = createMockRes();
    await adminController.resetDatabase(reqReset, resReset, (e) => { throw e; });
    console.log(`   Status: ${resReset.statusCode} | Message: ${resReset.data.message}`);
    if (resReset.statusCode !== 200) throw new Error('Reset failed');

    console.log('\n======================================================');
    console.log(' ALL 10 CORE CONTROLLER & DATABASE TESTS SUCCEEDED!   ');
    console.log('======================================================\n');
}

runDirectTests().catch(err => {
    console.error('[TEST FAILURE]:', err);
    process.exit(1);
});
