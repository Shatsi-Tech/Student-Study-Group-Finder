-- ==============================================================================
-- STUDENT STUDY GROUP FINDER - SAMPLE SEED DATA
-- Institution: Uganda Christian University (UCU)
-- Passwords in this seed file:
--   Admin:       Admin@123
--   Students:    Student@123
-- bcrypt hash for 'Admin@123'  : $2a$10$eEom076x2oW4v9g1N4zWJ.94oD8kPnYvQ6p3fS1Z2r4C5m8V9y7Tq
-- bcrypt hash for 'Student@123': $2a$10$X8m173ZgN5a7Q4q0o9uWxe3QJz9l1oM4n5k8r2s6t7u8v9w0x1y2z
-- ==============================================================================

USE student_study_group_finder;

-- ------------------------------------------------------------------------------
-- 1. Insert Users
-- ------------------------------------------------------------------------------
INSERT INTO users (id, full_name, reg_number, email, password_hash, role, programme, faculty, year_of_study, bio, avatar_url, is_active) VALUES
(1, 'System Administrator', 'UCU/ADM/2024/001', 'admin@ucu.ac.ug', '$2a$10$wT0/4b6pGqXG3PZ1gU2Q6.J8i2rQ2g4k6n8p0r2t4v6x8z0b2d4f6', 'ADMIN', 'Academic Administration', 'Faculty of Science & Technology', 'Postgraduate', 'System administrator for UCU academic study groups.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', TRUE),
(2, 'Brian Kigozi', 'S22/B23/BSIT/014', 'kigozi.brian@ucu.ac.ug', '$2a$10$wT0/4b6pGqXG3PZ1gU2Q6.J8i2rQ2g4k6n8p0r2t4v6x8z0b2d4f6', 'STUDENT', 'Bachelor of Science in Information Technology', 'Faculty of Science & Technology', 'Year 3', 'Passionate full-stack developer and open source enthusiast. Group leader for Web Development.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', TRUE),
(3, 'Sarah Nakato', 'S22/B23/BSCS/029', 'nakato.sarah@ucu.ac.ug', '$2a$10$wT0/4b6pGqXG3PZ1gU2Q6.J8i2rQ2g4k6n8p0r2t4v6x8z0b2d4f6', 'STUDENT', 'Bachelor of Science in Computer Science', 'Faculty of Science & Technology', 'Year 3', 'Data science and AI researcher. Interested in Python and machine learning algorithms.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', TRUE),
(4, 'David Musiime', 'S23/B23/LLB/055', 'musiime.david@ucu.ac.ug', '$2a$10$wT0/4b6pGqXG3PZ1gU2Q6.J8i2rQ2g4k6n8p0r2t4v6x8z0b2d4f6', 'STUDENT', 'Bachelor of Laws', 'Faculty of Law', 'Year 2', 'Moot court competitor and legal research enthusiast focusing on East African Commercial Law.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', TRUE),
(5, 'Grace Achen', 'S21/B23/BBA/088', 'achen.grace@ucu.ac.ug', '$2a$10$wT0/4b6pGqXG3PZ1gU2Q6.J8i2rQ2g4k6n8p0r2t4v6x8z0b2d4f6', 'STUDENT', 'Bachelor of Business Administration', 'School of Business', 'Year 3', 'Financial analysis and auditing major. Leading the Corporate Finance revision circle.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', TRUE),
(6, 'Emmanuel Okello', 'S23/B23/BIT/102', 'okello.emmanuel@ucu.ac.ug', '$2a$10$wT0/4b6pGqXG3PZ1gU2Q6.J8i2rQ2g4k6n8p0r2t4v6x8z0b2d4f6', 'STUDENT', 'Bachelor of Information Technology', 'Faculty of Science & Technology', 'Year 2', 'Networking enthusiast preparing for CCNA and database systems examinations.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', TRUE)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- ------------------------------------------------------------------------------
-- 2. Insert Study Groups
-- ------------------------------------------------------------------------------
INSERT INTO study_groups (id, name, course_name, course_code, faculty, description, meeting_location, meeting_type, leader_id, max_members, status) VALUES
(1, 'Web & Mobile Dev Masterminds', 'Web and Mobile Application Development', 'BIT3104', 'Faculty of Science & Technology', 'Collaborative revision, code reviews and project sprint workshops for React, Node.js, and API design. All BSIT and BSCS students welcome!', 'Tech Lab 2 / Google Meet', 'Hybrid', 2, 12, 'Active'),
(2, 'Data Structures & Algorithms Circle', 'Data Structures and Algorithms', 'CSC2101', 'Faculty of Science & Technology', 'Weekly problem-solving sessions tackling recursion, binary search trees, dynamic programming, and algorithm complexity in C++ and Java.', 'Hamu Mukasa Library Discussion Room 3', 'Physical', 3, 10, 'Active'),
(3, 'Constitutional Law Forum', 'Constitutional Law of Uganda', 'LAW1201', 'Faculty of Law', 'In-depth analysis of landmark cases, judicial precedent, constitutional petitions, and preparation for mid-semester moot presentations.', 'Law Quad Gazebo / Zoom', 'Hybrid', 4, 15, 'Active'),
(4, 'Corporate Finance & Valuation Group', 'Corporate Finance & Investment', 'BBA3205', 'School of Business', 'Revising discounted cash flow valuation, capital budgeting, financial ratio analysis, and past university examination papers.', 'Business Building Room B-14', 'Physical', 5, 8, 'Active'),
(5, 'Database Systems & SQL Lab', 'Database Management Systems', 'BIT2103', 'Faculty of Science & Technology', 'Practical query optimization, ER diagram normalization to BCNF, MySQL indexing, and transaction management practices.', 'Google Meet (Online)', 'Online', 2, 20, 'Active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ------------------------------------------------------------------------------
-- 3. Insert Group Members
-- ------------------------------------------------------------------------------
INSERT INTO group_members (id, group_id, user_id, member_role, status, joined_at) VALUES
-- Group 1
(1, 1, 2, 'LEADER', 'APPROVED', '2024-09-01 10:00:00'),
(2, 1, 3, 'MEMBER', 'APPROVED', '2024-09-02 11:30:00'),
(3, 1, 6, 'MEMBER', 'APPROVED', '2024-09-03 14:15:00'),
-- Group 2
(4, 2, 3, 'LEADER', 'APPROVED', '2024-09-05 09:00:00'),
(5, 2, 2, 'MEMBER', 'APPROVED', '2024-09-06 12:00:00'),
(6, 2, 6, 'MEMBER', 'APPROVED', '2024-09-07 15:45:00'),
-- Group 3
(7, 3, 4, 'LEADER', 'APPROVED', '2024-09-08 08:30:00'),
-- Group 4
(8, 4, 5, 'LEADER', 'APPROVED', '2024-09-10 10:20:00'),
-- Group 5
(9, 5, 2, 'LEADER', 'APPROVED', '2024-09-12 16:00:00'),
(10, 5, 6, 'MEMBER', 'APPROVED', '2024-09-13 17:00:00')
ON DUPLICATE KEY UPDATE member_role=VALUES(member_role);

-- ------------------------------------------------------------------------------
-- 4. Insert Study Sessions
-- ------------------------------------------------------------------------------
INSERT INTO study_sessions (id, group_id, created_by, title, study_date, start_time, end_time, location_or_link, description, status) VALUES
(1, 1, 2, 'React Router & REST API Integration Sprint', '2024-11-20', '14:00:00', '16:30:00', 'Tech Lab 2 (Main Campus)', 'Hands-on session building Axios interceptors, JWT storage, and state management in React.', 'UPCOMING'),
(2, 1, 2, 'Database Normalization & MySQL Workbench Lab', '2024-11-25', '10:00:00', '12:00:00', 'https://meet.google.com/abc-defg-hij', 'Reviewing 1NF through BCNF with real exam questions and SQL scripts.', 'UPCOMING'),
(3, 2, 3, 'Tree Traversal & Graph Search Algorithms', '2024-11-22', '16:00:00', '18:00:00', 'Hamu Mukasa Library Room 3', 'Covering Depth First Search (DFS), Breadth First Search (BFS), and Dijkstra shortest path.', 'UPCOMING'),
(4, 3, 4, 'Constitutional Interpretation Case Law Review', '2024-11-23', '09:00:00', '11:30:00', 'Law Quad Gazebo', 'Analyzing tiny case notes on separation of powers and judicial independence in Uganda.', 'UPCOMING'),
(5, 4, 5, 'Discounted Cash Flow (DCF) Valuation Workshop', '2024-11-24', '11:00:00', '13:00:00', 'Business Building Room B-14', 'Bring your financial calculators or laptops for Excel modeling.', 'UPCOMING')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ------------------------------------------------------------------------------
-- 5. Insert Posts
-- ------------------------------------------------------------------------------
INSERT INTO posts (id, group_id, user_id, title, content, post_type, is_pinned) VALUES
(1, 1, 2, 'Welcome to Web & Mobile Dev Study Group!', 'Welcome everyone! In this group we will cover frontend React development, Express.js REST APIs, and MySQL relational modeling. Please review our upcoming session in Tech Lab 2.', 'ANNOUNCEMENT', TRUE),
(2, 1, 3, 'Question regarding JWT expiration handling', 'When an access token expires, should we catch the 401 error in Axios interceptors and automatically refresh, or redirect immediately to login?', 'QUESTION', FALSE),
(3, 1, 6, 'Useful Resource: Official React 18 Docs & Cheatsheets', 'Found this great cheat-sheet on hooks lifecycle and cleanup functions for useEffect. Sharing for our lab preparation!', 'DISCUSSION', FALSE),
(4, 2, 3, 'Mid-Semester Algorithms Revision Topics', 'Please make sure to review Big-O notation, quick sort partitions, and heap properties prior to our library meeting on Friday.', 'ANNOUNCEMENT', TRUE),
(5, 3, 4, 'Reading list for Case Analysis Session', 'Everyone should read Tinyefuza v Attorney General (Constitutional Appeal No 1 of 1997) before Saturday morning.', 'ANNOUNCEMENT', TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ------------------------------------------------------------------------------
-- 6. Insert Comments
-- ------------------------------------------------------------------------------
INSERT INTO comments (id, post_id, user_id, content) VALUES
(1, 2, 2, 'Great question Sarah! The industry best practice is using Axios response interceptors to inspect status code 401, clear localStorage, and redirect to /login with an expired session message.'),
(2, 2, 6, 'I agree with Brian. It prevents user confusion when their token reaches its 24-hour expiration window.'),
(3, 3, 2, 'Thanks Emmanuel! This will be very handy for our component architecture demonstration.'),
(4, 4, 2, 'Looking forward to the heap properties breakdown. Thanks Sarah!')
ON DUPLICATE KEY UPDATE content=VALUES(content);

-- ------------------------------------------------------------------------------
-- 7. Insert Notifications
-- ------------------------------------------------------------------------------
INSERT INTO notifications (id, user_id, title, message, type, is_read, link) VALUES
(1, 2, 'New Member Joined', 'Sarah Nakato joined Web & Mobile Dev Masterminds.', 'MEMBER', FALSE, '/groups/1'),
(2, 2, 'New Comment on Post', 'Sarah asked a question regarding JWT token expiration handling.', 'COMMENT', FALSE, '/groups/1'),
(3, 3, 'Upcoming Study Session', 'Session "React Router & REST API Integration Sprint" starts on Nov 20 at 14:00.', 'SESSION', FALSE, '/sessions'),
(4, 4, 'Study Group Active', 'Your Constitutional Law Forum is listed in the UCU directory.', 'SYSTEM', TRUE, '/groups/3'),
(5, 6, 'Welcome to Student Study Group Finder', 'Explore groups for your Faculty and start collaborating with course peers.', 'SYSTEM', TRUE, '/explore')
ON DUPLICATE KEY UPDATE title=VALUES(title);
