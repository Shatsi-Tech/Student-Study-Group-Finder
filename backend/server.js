/**
 * STUDENT STUDY GROUP FINDER - BACKEND API SERVER
 * Institution: Uganda Christian University (UCU)
 * Course: Web and Mobile Application Development
 */
const path = require('path');
const fs = require('fs');
const http = require('http');

// Load environment variables if dotenv is available or read .env
try {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (e) {
    // Read .env manually if dotenv not installed
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, 'utf8').split('\n');
        lines.forEach(line => {
            const [k, v] = line.split('=');
            if (k && v && !process.env[k.trim()]) {
                process.env[k.trim()] = v.trim();
            }
        });
    }
}

const PORT = process.env.PORT || 5000;
const db = require('./config/db');

// Controllers
const authController = require('./controllers/authController');
const groupController = require('./controllers/groupController');
const sessionController = require('./controllers/sessionController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');
const notificationController = require('./controllers/notificationController');
const adminController = require('./controllers/adminController');

// Middleware
const { authenticate, requireAdmin } = require('./middleware/authMiddleware');

let expressApp = null;
let useExpress = false;

try {
    const express = require('express');
    const cors = require('cors');

    const app = express();
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Request logger
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });

    // Health check
    app.get('/api/health', async (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Student Study Group Finder API is running.',
            database: db.isMySQLActive() ? 'MySQL (student_study_group_finder)' : 'Persistent Relational Store (ACID JSON)',
            timestamp: new Date().toISOString()
        });
    });

    // Mount Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/groups', require('./routes/groupRoutes'));
    app.use('/api/sessions', require('./routes/sessionRoutes'));
    app.use('/api/posts', require('./routes/postRoutes'));
    app.use('/api/comments', require('./routes/commentRoutes'));
    app.use('/api/notifications', require('./routes/notificationRoutes'));
    app.use('/api/admin', require('./routes/adminRoutes'));

    // Serve static frontend build if present
    const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
    if (fs.existsSync(frontendDist)) {
        app.use(express.static(frontendDist));
        app.get('*', (req, res) => {
            res.sendFile(path.join(frontendDist, 'index.html'));
        });
    }

    const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
    app.use(notFoundHandler);
    app.use(errorHandler);

    expressApp = app;
    useExpress = true;
} catch (e) {
    console.log('[Notice] Express package not installed in global cache. Utilizing built-in HTTP REST dispatcher.');
}

/**
 * Built-in HTTP REST dispatcher for immediate offline runs without external dependencies
 */
function createNativeHttpServer() {
    return http.createServer(async (req, res) => {
        // Enable CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            return res.end();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = url.pathname;
        const query = Object.fromEntries(url.searchParams.entries());

        // Body parser
        let body = {};
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            try {
                const buffers = [];
                for await (const chunk of req) {
                    buffers.push(chunk);
                }
                const rawBody = Buffer.concat(buffers).toString('utf8');
                if (rawBody.trim()) {
                    body = JSON.parse(rawBody);
                }
            } catch (err) {
                // Ignore parse error
            }
        }

        // Mock req/res for controller reuse
        const expressLikeReq = {
            method: req.method,
            url: req.url,
            pathname,
            query,
            body,
            headers: req.headers,
            params: {}
        };

        const expressLikeRes = {
            statusCode: 200,
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(data) {
                res.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            },
            send(data) {
                res.writeHead(this.statusCode, { 'Content-Type': 'text/plain' });
                res.end(data);
            }
        };

        console.log(`[Native REST] ${req.method} ${pathname}`);

        try {
            // Health check
            if (pathname === '/api/health' && req.method === 'GET') {
                return expressLikeRes.status(200).json({
                    success: true,
                    message: 'Student Study Group Finder API is operational.',
                    database: db.isMySQLActive() ? 'MySQL (student_study_group_finder)' : 'Persistent Relational Store (ACID JSON)',
                    timestamp: new Date().toISOString()
                });
            }

            // Auth Routes
            if (pathname === '/api/auth/register' && req.method === 'POST') {
                return await authController.register(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes));
            }
            if (pathname === '/api/auth/login' && req.method === 'POST') {
                return await authController.login(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes));
            }
            if (pathname === '/api/auth/profile' && req.method === 'GET') {
                return await runAuth(expressLikeReq, expressLikeRes, () => authController.getProfile(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }
            if (pathname === '/api/auth/profile' && req.method === 'PUT') {
                return await runAuth(expressLikeReq, expressLikeRes, () => authController.updateProfile(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }

            // Group Routes
            if (pathname === '/api/groups' && req.method === 'GET') {
                await extractOptionalAuth(expressLikeReq);
                return await groupController.getGroups(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes));
            }
            if (pathname === '/api/groups' && req.method === 'POST') {
                return await runAuth(expressLikeReq, expressLikeRes, () => groupController.createGroup(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }

            const groupDetailMatch = pathname.match(/^\/api\/groups\/(\d+)$/);
            if (groupDetailMatch) {
                expressLikeReq.params.id = groupDetailMatch[1];
                if (req.method === 'GET') {
                    await extractOptionalAuth(expressLikeReq);
                    return await groupController.getGroupById(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes));
                }
                if (req.method === 'PUT') {
                    return await runAuth(expressLikeReq, expressLikeRes, () => groupController.updateGroup(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
                }
                if (req.method === 'DELETE') {
                    return await runAuth(expressLikeReq, expressLikeRes, () => groupController.deleteGroup(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
                }
            }

            const joinMatch = pathname.match(/^\/api\/groups\/(\d+)\/join$/);
            if (joinMatch && req.method === 'POST') {
                expressLikeReq.params.id = joinMatch[1];
                return await runAuth(expressLikeReq, expressLikeRes, () => groupController.joinGroup(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }

            const leaveMatch = pathname.match(/^\/api\/groups\/(\d+)\/leave$/);
            if (leaveMatch && req.method === 'POST') {
                expressLikeReq.params.id = leaveMatch[1];
                return await runAuth(expressLikeReq, expressLikeRes, () => groupController.leaveGroup(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }

            const removeMemberMatch = pathname.match(/^\/api\/groups\/(\d+)\/members\/(\d+)$/);
            if (removeMemberMatch && req.method === 'DELETE') {
                expressLikeReq.params.id = removeMemberMatch[1];
                expressLikeReq.params.userId = removeMemberMatch[2];
                return await runAuth(expressLikeReq, expressLikeRes, () => groupController.removeMember(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }

            // Session Routes
            if (pathname === '/api/sessions' && req.method === 'POST') {
                return await runAuth(expressLikeReq, expressLikeRes, () => sessionController.createSession(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }
            if (pathname === '/api/sessions/my-upcoming' && req.method === 'GET') {
                return await runAuth(expressLikeReq, expressLikeRes, () => sessionController.getUserUpcomingSessions(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }
            const groupSessionsMatch = pathname.match(/^\/api\/sessions\/group\/(\d+)$/);
            if (groupSessionsMatch && req.method === 'GET') {
                expressLikeReq.params.groupId = groupSessionsMatch[1];
                return await runAuth(expressLikeReq, expressLikeRes, () => sessionController.getGroupSessions(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }
            const sessionStatusMatch = pathname.match(/^\/api\/sessions\/(\d+)\/status$/);
            if (sessionStatusMatch && req.method === 'PUT') {
                expressLikeReq.params.id = sessionStatusMatch[1];
                return await runAuth(expressLikeReq, expressLikeRes, () => sessionController.updateSessionStatus(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }

            // Post Routes
            if (pathname === '/api/posts' && req.method === 'POST') {
                return await runAuth(expressLikeReq, expressLikeRes, () => postController.createPost(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }
            const groupPostsMatch = pathname.match(/^\/api\/posts\/group\/(\d+)$/);
            if (groupPostsMatch && req.method === 'GET') {
                expressLikeReq.params.groupId = groupPostsMatch[1];
                return await runAuth(expressLikeReq, expressLikeRes, () => postController.getGroupPosts(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }
            const postDeleteMatch = pathname.match(/^\/api\/posts\/(\d+)$/);
            if (postDeleteMatch && req.method === 'DELETE') {
                expressLikeReq.params.id = postDeleteMatch[1];
                return await runAuth(expressLikeReq, expressLikeRes, () => postController.deletePost(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }

            // Comment Routes
            if (pathname === '/api/comments' && req.method === 'POST') {
                return await runAuth(expressLikeReq, expressLikeRes, () => commentController.createComment(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }
            const commentDeleteMatch = pathname.match(/^\/api\/comments\/(\d+)$/);
            if (commentDeleteMatch && req.method === 'DELETE') {
                expressLikeReq.params.id = commentDeleteMatch[1];
                return await runAuth(expressLikeReq, expressLikeRes, () => commentController.deleteComment(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }

            // Notification Routes
            if (pathname === '/api/notifications' && req.method === 'GET') {
                return await runAuth(expressLikeReq, expressLikeRes, () => notificationController.getNotifications(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }
            const notifReadMatch = pathname.match(/^\/api\/notifications\/(\d+)\/read$/);
            if (notifReadMatch && req.method === 'PUT') {
                expressLikeReq.params.id = notifReadMatch[1];
                return await runAuth(expressLikeReq, expressLikeRes, () => notificationController.markAsRead(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }
            if (pathname === '/api/notifications/read-all' && req.method === 'PUT') {
                return await runAuth(expressLikeReq, expressLikeRes, () => notificationController.markAllAsRead(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes)));
            }

            // Admin Routes
            if (pathname === '/api/admin/stats' && req.method === 'GET') {
                return await runAuth(expressLikeReq, expressLikeRes, () => runAdmin(expressLikeReq, expressLikeRes, () => adminController.getStats(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes))));
            }
            if (pathname === '/api/admin/users' && req.method === 'GET') {
                return await runAuth(expressLikeReq, expressLikeRes, () => runAdmin(expressLikeReq, expressLikeRes, () => adminController.getAllUsers(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes))));
            }
            const toggleUserMatch = pathname.match(/^\/api\/admin\/users\/(\d+)\/toggle-status$/);
            if (toggleUserMatch && req.method === 'PUT') {
                expressLikeReq.params.id = toggleUserMatch[1];
                return await runAuth(expressLikeReq, expressLikeRes, () => runAdmin(expressLikeReq, expressLikeRes, () => adminController.toggleUserStatus(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes))));
            }
            const deleteUserMatch = pathname.match(/^\/api\/admin\/users\/(\d+)$/);
            if (deleteUserMatch && req.method === 'DELETE') {
                expressLikeReq.params.id = deleteUserMatch[1];
                return await runAuth(expressLikeReq, expressLikeRes, () => runAdmin(expressLikeReq, expressLikeRes, () => adminController.deleteUser(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes))));
            }
            if (pathname === '/api/admin/groups' && req.method === 'GET') {
                return await runAuth(expressLikeReq, expressLikeRes, () => runAdmin(expressLikeReq, expressLikeRes, () => adminController.getAllGroups(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes))));
            }
            if (pathname === '/api/admin/reset-database' && req.method === 'POST') {
                return await runAuth(expressLikeReq, expressLikeRes, () => runAdmin(expressLikeReq, expressLikeRes, () => adminController.resetDatabase(expressLikeReq, expressLikeRes, (err) => handleError(err, expressLikeRes))));
            }

            // Serve standalone HTML frontend if requested at root or page routes
            const standaloneFrontendPath = path.join(__dirname, '..', 'frontend', 'index.html');
            if (fs.existsSync(standaloneFrontendPath) && !pathname.startsWith('/api/')) {
                const html = fs.readFileSync(standaloneFrontendPath, 'utf8');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                return res.end(html);
            }

            // 404 Not Found
            return expressLikeRes.status(404).json({
                success: false,
                message: `Route '${req.method} ${pathname}' not found on Student Study Group Finder API.`
            });
        } catch (err) {
            handleError(err, expressLikeRes);
        }
    });
}

async function extractOptionalAuth(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const { verifyToken } = require('./config/jwt');
            const decoded = verifyToken(authHeader.split(' ')[1]);
            const [users] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
            if (users && users.length > 0) req.user = users[0];
        } catch (e) {}
    }
}

async function runAuth(req, res, next) {
    return new Promise((resolve) => {
        authenticate(req, res, () => {
            resolve(next());
        });
    });
}

function runAdmin(req, res, next) {
    return new Promise((resolve) => {
        requireAdmin(req, res, () => {
            resolve(next());
        });
    });
}

function handleError(err, res) {
    console.error('[API Server Error]:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
}

// Start Server
async function startServer() {
    await db.initDatabase();

    const server = useExpress ? expressApp : createNativeHttpServer();
    server.listen(PORT, () => {
        console.log('====================================================');
        console.log(` STUDENT STUDY GROUP FINDER - BACKEND REST API     `);
        console.log(` Running on: http://localhost:${PORT}             `);
        console.log(` Engine:     ${useExpress ? 'Express.js Framework' : 'Native High-Performance HTTP REST Dispatcher'}`);
        console.log(` Database:   ${db.isMySQLActive() ? 'MySQL (student_study_group_finder)' : 'Persistent Relational Store (ACID JSON)'}`);
        console.log('====================================================\n');
    });
}

startServer();

module.exports = { startServer };
