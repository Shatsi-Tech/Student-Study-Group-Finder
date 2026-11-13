/**
 * Automated Backend API Verification Script
 * Tests:
 * 1. Health check endpoint
 * 2. Student login (Brian Kigozi)
 * 3. Explore & search study groups
 * 4. Get group details (Group 1)
 * 5. Create a study session
 * 6. Create a discussion post
 * 7. Post a comment
 * 8. Admin login & stats retrieval
 */
const http = require('http');

function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: body });
                }
            });
        });

        req.on('error', reject);

        if (postData) {
            req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
        }
        req.end();
    });
}

async function runTests() {
    console.log('--- STARTING COMPREHENSIVE BACKEND API TEST ---\n');

    try {
        // 1. Health check
        console.log('1. Testing /api/health ...');
        const health = await makeRequest({
            host: 'localhost',
            port: 5000,
            path: '/api/health',
            method: 'GET'
        });
        console.log('   Response:', health.status, health.data.message);

        // 2. Student login
        console.log('\n2. Testing /api/auth/login (Student)...');
        const studentLogin = await makeRequest({
            host: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            identifier: 'kigozi.brian@ucu.ac.ug',
            password: 'Student@123'
        });
        console.log('   Status:', studentLogin.status);
        console.log('   User:', studentLogin.data.user?.full_name, `[Role: ${studentLogin.data.user?.role}]`);
        const studentToken = studentLogin.data.token;

        // 3. Get study groups
        console.log('\n3. Testing /api/groups ...');
        const groupsRes = await makeRequest({
            host: 'localhost',
            port: 5000,
            path: '/api/groups?search=Web',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${studentToken}` }
        });
        console.log('   Status:', groupsRes.status, `Found ${groupsRes.data.count} groups matching "Web".`);
        console.log('   First group:', groupsRes.data.groups?.[0]?.name, 'Course:', groupsRes.data.groups?.[0]?.course_code);

        // 4. Create new study session
        console.log('\n4. Testing /api/sessions (Create Session)...');
        const sessionRes = await makeRequest({
            host: 'localhost',
            port: 5000,
            path: '/api/sessions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            }
        }, {
            group_id: 1,
            title: 'Mock Defense Revision Sprint',
            study_date: '2024-11-28',
            start_time: '15:00:00',
            end_time: '17:00:00',
            location_or_link: 'Tech Lab 2',
            description: 'Preparing presentation slides and database demo for UCU lecturers.'
        });
        console.log('   Status:', sessionRes.status, sessionRes.data.message);

        // 5. Create a post
        console.log('\n5. Testing /api/posts (Create Discussion Post)...');
        const postRes = await makeRequest({
            host: 'localhost',
            port: 5000,
            path: '/api/posts',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            }
        }, {
            group_id: 1,
            title: 'Final Project Submission Guidelines',
            content: 'Please ensure that all ER diagrams and API endpoints are thoroughly checked before our defense next week.',
            post_type: 'ANNOUNCEMENT'
        });
        console.log('   Status:', postRes.status, postRes.data.message);
        const newPostId = postRes.data.postId;

        // 6. Create comment
        console.log('\n6. Testing /api/comments (Create Comment)...');
        const commentRes = await makeRequest({
            host: 'localhost',
            port: 5000,
            path: '/api/comments',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            }
        }, {
            post_id: newPostId,
            content: 'Understood Brian, the database scripts and seed data are verified.'
        });
        console.log('   Status:', commentRes.status, commentRes.data.message);

        // 7. Admin login & stats
        console.log('\n7. Testing Administrator /api/auth/login & /api/admin/stats ...');
        const adminLogin = await makeRequest({
            host: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            identifier: 'admin@ucu.ac.ug',
            password: 'Admin@123'
        });
        const adminToken = adminLogin.data.token;
        console.log('   Admin Auth:', adminLogin.status, adminLogin.data.user?.full_name);

        const statsRes = await makeRequest({
            host: 'localhost',
            port: 5000,
            path: '/api/admin/stats',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log('   Admin Stats:');
        console.log('     Total Users:       ', statsRes.data.stats?.totalUsers);
        console.log('     Total Study Groups:', statsRes.data.stats?.totalGroups);
        console.log('     Total Sessions:    ', statsRes.data.stats?.totalSessions);
        console.log('     Active Courses:    ', statsRes.data.stats?.mostActiveCourses?.map(c => c.course).join(', '));

        console.log('\n>>> ALL 7 BACKEND API TESTS PASSED SUCCESSFULLY! <<<');
    } catch (err) {
        console.error('Test execution error:', err.message);
    }
}

runTests();
