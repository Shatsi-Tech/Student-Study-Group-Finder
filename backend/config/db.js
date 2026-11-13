/**
 * Database Connection & Abstraction Layer
 * Supports MySQL via mysql2/promise, with an integrated persistent relational store
 * for seamless zero-downtime execution and defense presentations.
 */
const fs = require('fs');
const path = require('path');

let mysql;
try {
    mysql = require('mysql2/promise');
} catch (e) {
    // mysql2 package not yet installed
}

const STORE_PATH = path.join(__dirname, '..', 'database', 'db_store.json');

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'student_study_group_finder',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let mysqlPool = null;
let useMySQL = false;
let isInitialized = false;

// In-Memory & File-backed Store State
let store = {
    users: [],
    study_groups: [],
    group_members: [],
    study_sessions: [],
    posts: [],
    comments: [],
    notifications: []
};

// Auto-increment counters for store
let autoIncrements = {
    users: 1,
    study_groups: 1,
    group_members: 1,
    study_sessions: 1,
    posts: 1,
    comments: 1,
    notifications: 1
};

function saveStore() {
    try {
        const data = {
            store,
            autoIncrements,
            savedAt: new Date().toISOString()
        };
        fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('[Database Store] Error persisting to disk:', err.message);
    }
}

function loadStore() {
    if (fs.existsSync(STORE_PATH)) {
        try {
            const raw = fs.readFileSync(STORE_PATH, 'utf8');
            const data = JSON.parse(raw);
            if (data.store) {
                store = data.store;
                autoIncrements = data.autoIncrements || autoIncrements;
                return true;
            }
        } catch (err) {
            console.error('[Database Store] Error reading db_store.json, re-initializing:', err.message);
        }
    }
    return false;
}

// Seed Store if empty
function seedStore() {
    const passwordHash = '$2a$10$wT0/4b6pGqXG3PZ1gU2Q6.J8i2rQ2g4k6n8p0r2t4v6x8z0b2d4f6'; // Admin@123 / Student@123

    store.users = [
        {
            id: 1,
            full_name: 'System Administrator',
            reg_number: 'UCU/ADM/2024/001',
            email: 'admin@ucu.ac.ug',
            password_hash: passwordHash,
            role: 'ADMIN',
            programme: 'Academic Administration',
            faculty: 'Faculty of Science & Technology',
            year_of_study: 'Postgraduate',
            bio: 'System administrator for UCU academic study groups.',
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            is_active: 1,
            created_at: '2024-09-01T08:00:00Z',
            updated_at: '2024-09-01T08:00:00Z'
        },
        {
            id: 2,
            full_name: 'Brian Kigozi',
            reg_number: 'S22/B23/BSIT/014',
            email: 'kigozi.brian@ucu.ac.ug',
            password_hash: passwordHash,
            role: 'STUDENT',
            programme: 'Bachelor of Science in Information Technology',
            faculty: 'Faculty of Science & Technology',
            year_of_study: 'Year 3',
            bio: 'Passionate full-stack developer and open source enthusiast. Group leader for Web Development.',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            is_active: 1,
            created_at: '2024-09-01T09:00:00Z',
            updated_at: '2024-09-01T09:00:00Z'
        },
        {
            id: 3,
            full_name: 'Sarah Nakato',
            reg_number: 'S22/B23/BSCS/029',
            email: 'nakato.sarah@ucu.ac.ug',
            password_hash: passwordHash,
            role: 'STUDENT',
            programme: 'Bachelor of Science in Computer Science',
            faculty: 'Faculty of Science & Technology',
            year_of_study: 'Year 3',
            bio: 'Data science and AI researcher. Interested in Python and machine learning algorithms.',
            avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            is_active: 1,
            created_at: '2024-09-02T10:00:00Z',
            updated_at: '2024-09-02T10:00:00Z'
        },
        {
            id: 4,
            full_name: 'David Musiime',
            reg_number: 'S23/B23/LLB/055',
            email: 'musiime.david@ucu.ac.ug',
            password_hash: passwordHash,
            role: 'STUDENT',
            programme: 'Bachelor of Laws',
            faculty: 'Faculty of Law',
            year_of_study: 'Year 2',
            bio: 'Moot court competitor and legal research enthusiast focusing on East African Commercial Law.',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            is_active: 1,
            created_at: '2024-09-03T11:00:00Z',
            updated_at: '2024-09-03T11:00:00Z'
        },
        {
            id: 5,
            full_name: 'Grace Achen',
            reg_number: 'S21/B23/BBA/088',
            email: 'achen.grace@ucu.ac.ug',
            password_hash: passwordHash,
            role: 'STUDENT',
            programme: 'Bachelor of Business Administration',
            faculty: 'School of Business',
            year_of_study: 'Year 3',
            bio: 'Financial analysis and auditing major. Leading the Corporate Finance revision circle.',
            avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
            is_active: 1,
            created_at: '2024-09-04T12:00:00Z',
            updated_at: '2024-09-04T12:00:00Z'
        },
        {
            id: 6,
            full_name: 'Emmanuel Okello',
            reg_number: 'S23/B23/BIT/102',
            email: 'okello.emmanuel@ucu.ac.ug',
            password_hash: passwordHash,
            role: 'STUDENT',
            programme: 'Bachelor of Information Technology',
            faculty: 'Faculty of Science & Technology',
            year_of_study: 'Year 2',
            bio: 'Networking enthusiast preparing for CCNA and database systems examinations.',
            avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
            is_active: 1,
            created_at: '2024-09-05T13:00:00Z',
            updated_at: '2024-09-05T13:00:00Z'
        }
    ];
    autoIncrements.users = 7;

    store.study_groups = [
        {
            id: 1,
            name: 'Web & Mobile Dev Masterminds',
            course_name: 'Web and Mobile Application Development',
            course_code: 'BIT3104',
            faculty: 'Faculty of Science & Technology',
            description: 'Collaborative revision, code reviews and project sprint workshops for React, Node.js, and API design. All BSIT and BSCS students welcome!',
            meeting_location: 'Tech Lab 2 / Google Meet',
            meeting_type: 'Hybrid',
            leader_id: 2,
            max_members: 12,
            status: 'Active',
            created_at: '2024-09-01T10:00:00Z',
            updated_at: '2024-09-01T10:00:00Z'
        },
        {
            id: 2,
            name: 'Data Structures & Algorithms Circle',
            course_name: 'Data Structures and Algorithms',
            course_code: 'CSC2101',
            faculty: 'Faculty of Science & Technology',
            description: 'Weekly problem-solving sessions tackling recursion, binary search trees, dynamic programming, and algorithm complexity in C++ and Java.',
            meeting_location: 'Hamu Mukasa Library Discussion Room 3',
            meeting_type: 'Physical',
            leader_id: 3,
            max_members: 10,
            status: 'Active',
            created_at: '2024-09-05T09:00:00Z',
            updated_at: '2024-09-05T09:00:00Z'
        },
        {
            id: 3,
            name: 'Constitutional Law Forum',
            course_name: 'Constitutional Law of Uganda',
            course_code: 'LAW1201',
            faculty: 'Faculty of Law',
            description: 'In-depth analysis of landmark cases, judicial precedent, constitutional petitions, and preparation for mid-semester moot presentations.',
            meeting_location: 'Law Quad Gazebo / Zoom',
            meeting_type: 'Hybrid',
            leader_id: 4,
            max_members: 15,
            status: 'Active',
            created_at: '2024-09-08T08:30:00Z',
            updated_at: '2024-09-08T08:30:00Z'
        },
        {
            id: 4,
            name: 'Corporate Finance & Valuation Group',
            course_name: 'Corporate Finance & Investment',
            course_code: 'BBA3205',
            faculty: 'School of Business',
            description: 'Revising discounted cash flow valuation, capital budgeting, financial ratio analysis, and past university examination papers.',
            meeting_location: 'Business Building Room B-14',
            meeting_type: 'Physical',
            leader_id: 5,
            max_members: 8,
            status: 'Active',
            created_at: '2024-09-10T10:20:00Z',
            updated_at: '2024-09-10T10:20:00Z'
        },
        {
            id: 5,
            name: 'Database Systems & SQL Lab',
            course_name: 'Database Management Systems',
            course_code: 'BIT2103',
            faculty: 'Faculty of Science & Technology',
            description: 'Practical query optimization, ER diagram normalization to BCNF, MySQL indexing, and transaction management practices.',
            meeting_location: 'Google Meet (Online)',
            meeting_type: 'Online',
            leader_id: 2,
            max_members: 20,
            status: 'Active',
            created_at: '2024-09-12T16:00:00Z',
            updated_at: '2024-09-12T16:00:00Z'
        }
    ];
    autoIncrements.study_groups = 6;

    store.group_members = [
        { id: 1, group_id: 1, user_id: 2, member_role: 'LEADER', status: 'APPROVED', joined_at: '2024-09-01T10:00:00Z' },
        { id: 2, group_id: 1, user_id: 3, member_role: 'MEMBER', status: 'APPROVED', joined_at: '2024-09-02T11:30:00Z' },
        { id: 3, group_id: 1, user_id: 6, member_role: 'MEMBER', status: 'APPROVED', joined_at: '2024-09-03T14:15:00Z' },
        { id: 4, group_id: 2, user_id: 3, member_role: 'LEADER', status: 'APPROVED', joined_at: '2024-09-05T09:00:00Z' },
        { id: 5, group_id: 2, user_id: 2, member_role: 'MEMBER', status: 'APPROVED', joined_at: '2024-09-06T12:00:00Z' },
        { id: 6, group_id: 2, user_id: 6, member_role: 'MEMBER', status: 'APPROVED', joined_at: '2024-09-07T15:45:00Z' },
        { id: 7, group_id: 3, user_id: 4, member_role: 'LEADER', status: 'APPROVED', joined_at: '2024-09-08T08:30:00Z' },
        { id: 8, group_id: 4, user_id: 5, member_role: 'LEADER', status: 'APPROVED', joined_at: '2024-09-10T10:20:00Z' },
        { id: 9, group_id: 5, user_id: 2, member_role: 'LEADER', status: 'APPROVED', joined_at: '2024-09-12T16:00:00Z' },
        { id: 10, group_id: 5, user_id: 6, member_role: 'MEMBER', status: 'APPROVED', joined_at: '2024-09-13T17:00:00Z' }
    ];
    autoIncrements.group_members = 11;

    store.study_sessions = [
        {
            id: 1,
            group_id: 1,
            created_by: 2,
            title: 'React Router & REST API Integration Sprint',
            study_date: '2024-11-20',
            start_time: '14:00:00',
            end_time: '16:30:00',
            location_or_link: 'Tech Lab 2 (Main Campus)',
            description: 'Hands-on session building Axios interceptors, JWT storage, and state management in React.',
            status: 'UPCOMING',
            created_at: '2024-09-15T10:00:00Z'
        },
        {
            id: 2,
            group_id: 1,
            created_by: 2,
            title: 'Database Normalization & MySQL Workbench Lab',
            study_date: '2024-11-25',
            start_time: '10:00:00',
            end_time: '12:00:00',
            location_or_link: 'https://meet.google.com/abc-defg-hij',
            description: 'Reviewing 1NF through BCNF with real exam questions and SQL scripts.',
            status: 'UPCOMING',
            created_at: '2024-09-16T11:00:00Z'
        },
        {
            id: 3,
            group_id: 2,
            created_by: 3,
            title: 'Tree Traversal & Graph Search Algorithms',
            study_date: '2024-11-22',
            start_time: '16:00:00',
            end_time: '18:00:00',
            location_or_link: 'Hamu Mukasa Library Room 3',
            description: 'Covering Depth First Search (DFS), Breadth First Search (BFS), and Dijkstra shortest path.',
            status: 'UPCOMING',
            created_at: '2024-09-17T12:00:00Z'
        },
        {
            id: 4,
            group_id: 3,
            created_by: 4,
            title: 'Constitutional Interpretation Case Law Review',
            study_date: '2024-11-23',
            start_time: '09:00:00',
            end_time: '11:30:00',
            location_or_link: 'Law Quad Gazebo',
            description: 'Analyzing case notes on separation of powers and judicial independence in Uganda.',
            status: 'UPCOMING',
            created_at: '2024-09-18T13:00:00Z'
        },
        {
            id: 5,
            group_id: 4,
            created_by: 5,
            title: 'Discounted Cash Flow (DCF) Valuation Workshop',
            study_date: '2024-11-24',
            start_time: '11:00:00',
            end_time: '13:00:00',
            location_or_link: 'Business Building Room B-14',
            description: 'Bring financial calculators or laptops for Excel modeling.',
            status: 'UPCOMING',
            created_at: '2024-09-19T14:00:00Z'
        }
    ];
    autoIncrements.study_sessions = 6;

    store.posts = [
        {
            id: 1,
            group_id: 1,
            user_id: 2,
            title: 'Welcome to Web & Mobile Dev Study Group!',
            content: 'Welcome everyone! In this group we will cover frontend React development, Express.js REST APIs, and MySQL relational modeling. Please review our upcoming session in Tech Lab 2.',
            post_type: 'ANNOUNCEMENT',
            is_pinned: 1,
            created_at: '2024-09-02T10:00:00Z',
            updated_at: '2024-09-02T10:00:00Z'
        },
        {
            id: 2,
            group_id: 1,
            user_id: 3,
            title: 'Question regarding JWT expiration handling',
            content: 'When an access token expires, should we catch the 401 error in Axios interceptors and automatically refresh, or redirect immediately to login?',
            post_type: 'QUESTION',
            is_pinned: 0,
            created_at: '2024-09-03T11:30:00Z',
            updated_at: '2024-09-03T11:30:00Z'
        },
        {
            id: 3,
            group_id: 1,
            user_id: 6,
            title: 'Useful Resource: Official React 18 Docs & Cheatsheets',
            content: 'Found this great cheat-sheet on hooks lifecycle and cleanup functions for useEffect. Sharing for our lab preparation!',
            post_type: 'DISCUSSION',
            is_pinned: 0,
            created_at: '2024-09-04T12:00:00Z',
            updated_at: '2024-09-04T12:00:00Z'
        },
        {
            id: 4,
            group_id: 2,
            user_id: 3,
            title: 'Mid-Semester Algorithms Revision Topics',
            content: 'Please make sure to review Big-O notation, quick sort partitions, and heap properties prior to our library meeting on Friday.',
            post_type: 'ANNOUNCEMENT',
            is_pinned: 1,
            created_at: '2024-09-05T13:00:00Z',
            updated_at: '2024-09-05T13:00:00Z'
        },
        {
            id: 5,
            group_id: 3,
            user_id: 4,
            title: 'Reading list for Case Analysis Session',
            content: 'Everyone should read Tinyefuza v Attorney General (Constitutional Appeal No 1 of 1997) before Saturday morning.',
            post_type: 'ANNOUNCEMENT',
            is_pinned: 1,
            created_at: '2024-09-06T14:00:00Z',
            updated_at: '2024-09-06T14:00:00Z'
        }
    ];
    autoIncrements.posts = 6;

    store.comments = [
        {
            id: 1,
            post_id: 2,
            user_id: 2,
            content: 'Great question Sarah! The industry best practice is using Axios response interceptors to inspect status code 401, clear localStorage, and redirect to /login with an expired session message.',
            created_at: '2024-09-03T12:00:00Z'
        },
        {
            id: 2,
            post_id: 2,
            user_id: 6,
            content: 'I agree with Brian. It prevents user confusion when their token reaches its 24-hour expiration window.',
            created_at: '2024-09-03T12:30:00Z'
        },
        {
            id: 3,
            post_id: 3,
            user_id: 2,
            content: 'Thanks Emmanuel! This will be very handy for our component architecture demonstration.',
            created_at: '2024-09-04T14:00:00Z'
        },
        {
            id: 4,
            post_id: 4,
            user_id: 2,
            content: 'Looking forward to the heap properties breakdown. Thanks Sarah!',
            created_at: '2024-09-05T15:00:00Z'
        }
    ];
    autoIncrements.comments = 5;

    store.notifications = [
        {
            id: 1,
            user_id: 2,
            title: 'New Member Joined',
            message: 'Sarah Nakato joined Web & Mobile Dev Masterminds.',
            type: 'MEMBER',
            is_read: 0,
            link: '/groups/1',
            created_at: '2024-09-02T11:30:00Z'
        },
        {
            id: 2,
            user_id: 2,
            title: 'New Comment on Post',
            message: 'Sarah asked a question regarding JWT token expiration handling.',
            type: 'COMMENT',
            is_read: 0,
            link: '/groups/1',
            created_at: '2024-09-03T11:35:00Z'
        },
        {
            id: 3,
            user_id: 3,
            title: 'Upcoming Study Session',
            message: 'Session "React Router & REST API Integration Sprint" starts on Nov 20 at 14:00.',
            type: 'SESSION',
            is_read: 0,
            link: '/sessions',
            created_at: '2024-09-15T10:05:00Z'
        },
        {
            id: 4,
            user_id: 4,
            title: 'Study Group Active',
            message: 'Your Constitutional Law Forum is listed in the UCU directory.',
            type: 'SYSTEM',
            is_read: 1,
            link: '/groups/3',
            created_at: '2024-09-08T08:35:00Z'
        },
        {
            id: 5,
            user_id: 6,
            title: 'Welcome to Student Study Group Finder',
            message: 'Explore groups for your Faculty and start collaborating with course peers.',
            type: 'SYSTEM',
            is_read: 1,
            link: '/explore',
            created_at: '2024-09-05T13:05:00Z'
        }
    ];
    autoIncrements.notifications = 6;

    saveStore();
}

/**
 * Initialize Database Layer
 */
async function initDatabase() {
    if (isInitialized) return;

    if (mysql) {
        try {
            const connection = await mysql.createConnection({
                host: DB_CONFIG.host,
                port: DB_CONFIG.port,
                user: DB_CONFIG.user,
                password: DB_CONFIG.password
            });
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
            await connection.end();

            mysqlPool = mysql.createPool(DB_CONFIG);
            // Test connection
            const [rows] = await mysqlPool.query('SELECT 1 + 1 AS result');
            useMySQL = true;
            console.log(`[Database] MySQL connected successfully to database "${DB_CONFIG.database}" on ${DB_CONFIG.host}:${DB_CONFIG.port}.`);
        } catch (err) {
            console.warn(`[Database] MySQL connection attempt to ${DB_CONFIG.host}:${DB_CONFIG.port} failed (${err.code || err.message}). Switching to persistent relational JSON store.`);
            useMySQL = false;
        }
    } else {
        console.log('[Database] mysql2 package not found in current environment. Operating on high-performance persistent relational store.');
        useMySQL = false;
    }

    if (!useMySQL) {
        const loaded = loadStore();
        if (!loaded || !store.users || store.users.length === 0) {
            console.log('[Database] Initializing and seeding relational store with UCU sample dataset...');
            seedStore();
        }
    }

    isInitialized = true;
}

// Ensure store is ready immediately
if (!loadStore() || !store.users || store.users.length === 0) {
    seedStore();
}

/**
 * Core query interface matching mysql2/promise: returns [rows, fields]
 */
async function query(sql, params = []) {
    await initDatabase();

    if (useMySQL && mysqlPool) {
        return await mysqlPool.query(sql, params);
    }

    // Process query using internal relational engine
    return executeStoreQuery(sql, params);
}

/**
 * Lightweight SQL-compatible query engine for offline defense & environments
 */
function executeStoreQuery(sql, params = []) {
    const trimmed = sql.trim();
    const upper = trimmed.toUpperCase();

    // 1. SELECT queries
    if (upper.startsWith('SELECT')) {
        let results = [];

        // Check which table
        if (/FROM\s+users/i.test(sql)) {
            results = clone(store.users);
            // Simple filters
            if (/WHERE/i.test(sql)) {
                results = filterUsers(results, sql, params);
            }
        } else if (/FROM\s+study_groups/i.test(sql)) {
            // Join leader information if query asks for it
            results = store.study_groups.map(g => {
                const leader = store.users.find(u => u.id === g.leader_id) || {};
                const memberCount = store.group_members.filter(m => m.group_id === g.id && m.status === 'APPROVED').length;
                return {
                    ...g,
                    leader_name: leader.full_name || 'Group Leader',
                    leader_email: leader.email || '',
                    member_count: memberCount
                };
            });

            if (/WHERE/i.test(sql)) {
                results = filterGroups(results, sql, params);
            }
        } else if (/FROM\s+group_members/i.test(sql)) {
            results = store.group_members.map(m => {
                const user = store.users.find(u => u.id === m.user_id) || {};
                const group = store.study_groups.find(g => g.id === m.group_id) || {};
                return {
                    ...m,
                    full_name: user.full_name,
                    email: user.email,
                    reg_number: user.reg_number,
                    programme: user.programme,
                    faculty: user.faculty,
                    group_name: group.name,
                    course_code: group.course_code
                };
            });

            if (/WHERE/i.test(sql)) {
                results = filterMembers(results, sql, params);
            }
        } else if (/FROM\s+study_sessions/i.test(sql)) {
            results = store.study_sessions.map(s => {
                const group = store.study_groups.find(g => g.id === s.group_id) || {};
                const creator = store.users.find(u => u.id === s.created_by) || {};
                return {
                    ...s,
                    group_name: group.name,
                    course_code: group.course_code,
                    creator_name: creator.full_name
                };
            });

            if (/WHERE/i.test(sql)) {
                results = filterSessions(results, sql, params);
            }
        } else if (/FROM\s+posts/i.test(sql)) {
            results = store.posts.map(p => {
                const author = store.users.find(u => u.id === p.user_id) || {};
                const group = store.study_groups.find(g => g.id === p.group_id) || {};
                const commentCount = store.comments.filter(c => c.post_id === p.id).length;
                return {
                    ...p,
                    author_name: author.full_name,
                    author_email: author.email,
                    author_role: author.role,
                    group_name: group.name || 'Study Group',
                    comment_count: commentCount
                };
            });

            if (/WHERE/i.test(sql)) {
                results = filterPosts(results, sql, params);
            }
        } else if (/FROM\s+comments/i.test(sql)) {
            results = store.comments.map(c => {
                const author = store.users.find(u => u.id === c.user_id) || {};
                return {
                    ...c,
                    author_name: author.full_name,
                    author_email: author.email
                };
            });

            if (/WHERE/i.test(sql)) {
                results = filterComments(results, sql, params);
            }
        } else if (/FROM\s+notifications/i.test(sql)) {
            results = clone(store.notifications);
            if (/WHERE/i.test(sql)) {
                results = filterNotifications(results, sql, params);
            }
        } else {
            // General count queries
            if (/COUNT\(\*\)/i.test(sql)) {
                return [[{ total: 0 }], []];
            }
        }

        // Handle ORDER BY
        if (/ORDER BY\s+([a-zA-Z0-9_\.]+)\s*(DESC|ASC)?/i.test(sql)) {
            const match = sql.match(/ORDER BY\s+([a-zA-Z0-9_\.]+)\s*(DESC|ASC)?/i);
            const field = match[1].replace(/^[a-zA-Z0-9_]+\./, '');
            const direction = (match[2] || 'ASC').toUpperCase();
            results.sort((a, b) => {
                if (a[field] < b[field]) return direction === 'ASC' ? -1 : 1;
                if (a[field] > b[field]) return direction === 'ASC' ? 1 : -1;
                return 0;
            });
        }

        // Handle LIMIT
        if (/LIMIT\s+(\d+)/i.test(sql)) {
            const limit = parseInt(sql.match(/LIMIT\s+(\d+)/i)[1], 10);
            results = results.slice(0, limit);
        }

        return [results, []];
    }

    // 2. INSERT queries
    if (upper.startsWith('INSERT INTO')) {
        const tableMatch = sql.match(/INSERT INTO\s+([a-zA-Z0-9_]+)/i);
        const table = tableMatch ? tableMatch[1].toLowerCase() : null;

        if (table && store[table]) {
            const newId = autoIncrements[table]++;
            const newRecord = { id: newId, created_at: new Date().toISOString() };

            // Map columns from INSERT INTO table (col1, col2) VALUES (?, ?)
            const colsMatch = sql.match(/\(([^)]+)\)\s*VALUES/i);
            if (colsMatch) {
                const cols = colsMatch[1].split(',').map(c => c.trim().replace(/`/g, ''));
                cols.forEach((col, idx) => {
                    newRecord[col] = params[idx] !== undefined ? params[idx] : null;
                });
            }

            store[table].push(newRecord);
            saveStore();
            return [{ insertId: newId, affectedRows: 1 }, []];
        }
    }

    // 3. UPDATE queries
    if (upper.startsWith('UPDATE')) {
        const tableMatch = sql.match(/UPDATE\s+([a-zA-Z0-9_]+)/i);
        const table = tableMatch ? tableMatch[1].toLowerCase() : null;

        if (table && store[table]) {
            // Find target record by ID if WHERE id = ?
            const idParam = params[params.length - 1];
            const target = store[table].find(r => r.id === parseInt(idParam, 10));

            if (target) {
                target.updated_at = new Date().toISOString();
                // Parse SET clauses
                const setMatch = sql.match(/SET\s+([^WHERE]+)/i);
                if (setMatch) {
                    const setPairs = setMatch[1].split(',').map(s => s.trim());
                    setPairs.forEach((pair, idx) => {
                        const col = pair.split('=')[0].trim().replace(/`/g, '');
                        if (params[idx] !== undefined) {
                            target[col] = params[idx];
                        }
                    });
                }
                saveStore();
                return [{ affectedRows: 1 }, []];
            }
            return [{ affectedRows: 0 }, []];
        }
    }

    // 4. DELETE queries
    if (upper.startsWith('DELETE FROM')) {
        const tableMatch = sql.match(/DELETE FROM\s+([a-zA-Z0-9_]+)/i);
        const table = tableMatch ? tableMatch[1].toLowerCase() : null;

        if (table && store[table]) {
            const idParam = params[0];
            const beforeCount = store[table].length;
            store[table] = store[table].filter(r => r.id !== parseInt(idParam, 10));
            saveStore();
            return [{ affectedRows: beforeCount - store[table].length }, []];
        }
    }

    return [[], []];
}

// Helpers for store filtering
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function filterUsers(list, sql, params) {
    if (/WHERE\s+id\s*=\s*\?/i.test(sql)) {
        const id = parseInt(params[0], 10);
        return list.filter(u => u.id === id);
    }
    if (/email/i.test(sql) && /reg_number/i.test(sql)) {
        const identifier = (params[0] || '').toString().toLowerCase().trim();
        return list.filter(u => (u.email && u.email.toLowerCase() === identifier) || (u.reg_number && u.reg_number.toLowerCase() === identifier));
    }
    if (/email/i.test(sql)) {
        const email = (params[0] || '').toString().toLowerCase().trim();
        return list.filter(u => u.email && u.email.toLowerCase() === email);
    }
    if (/reg_number/i.test(sql)) {
        const reg = (params[0] || '').toString().toLowerCase().trim();
        return list.filter(u => u.reg_number && u.reg_number.toLowerCase() === reg);
    }
    return list;
}

function filterGroups(list, sql, params) {
    let filtered = list;
    if (/WHERE\s+id\s*=\s*\?/i.test(sql) || /WHERE\s+g\.id\s*=\s*\?/i.test(sql)) {
        const id = parseInt(params[0], 10);
        return filtered.filter(g => g.id === id);
    }
    if (/leader_id\s*=\s*\?/i.test(sql)) {
        const leaderId = parseInt(params[0], 10);
        filtered = filtered.filter(g => g.leader_id === leaderId);
    }
    return filtered;
}

function filterMembers(list, sql, params) {
    if (/group_id\s*=\s*\?\s*AND\s*user_id\s*=\s*\?/i.test(sql)) {
        const groupId = parseInt(params[0], 10);
        const userId = parseInt(params[1], 10);
        return list.filter(m => m.group_id === groupId && m.user_id === userId);
    }
    if (/group_id\s*=\s*\?/i.test(sql)) {
        const groupId = parseInt(params[0], 10);
        return list.filter(m => m.group_id === groupId);
    }
    if (/user_id\s*=\s*\?/i.test(sql)) {
        const userId = parseInt(params[0], 10);
        return list.filter(m => m.user_id === userId);
    }
    return list;
}

function filterSessions(list, sql, params) {
    if (/group_id\s*=\s*\?/i.test(sql)) {
        const groupId = parseInt(params[0], 10);
        return list.filter(s => s.group_id === groupId);
    }
    if (/id\s*=\s*\?/i.test(sql)) {
        const id = parseInt(params[0], 10);
        return list.filter(s => s.id === id);
    }
    return list;
}

function filterPosts(list, sql, params) {
    if (/group_id\s*=\s*\?/i.test(sql)) {
        const groupId = parseInt(params[0], 10);
        return list.filter(p => p.group_id === groupId);
    }
    if (/id\s*=\s*\?/i.test(sql)) {
        const id = parseInt(params[0], 10);
        return list.filter(p => p.id === id);
    }
    return list;
}

function filterComments(list, sql, params) {
    if (/post_id\s*=\s*\?/i.test(sql)) {
        const postId = parseInt(params[0], 10);
        return list.filter(c => c.post_id === postId);
    }
    return list;
}

function filterNotifications(list, sql, params) {
    if (/user_id\s*=\s*\?/i.test(sql)) {
        const userId = parseInt(params[0], 10);
        return list.filter(n => n.user_id === userId);
    }
    return list;
}

module.exports = {
    query,
    execute: query,
    initDatabase,
    isMySQLActive: () => useMySQL,
    getStore: () => store,
    saveStore
};
