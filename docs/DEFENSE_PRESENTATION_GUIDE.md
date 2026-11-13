# DEFENSE PRESENTATION & DEMONSTRATION GUIDE

**Course:** Web and Mobile Application Development  
**Institution:** Uganda Christian University (UCU)  
**Project:** Student Study Group Finder  

---

## 1. Ten-Minute Defense Presentation Agenda

| Time | Slide / Segment | Key Content | Presenter |
|---|---|---|---|
| **0:00 - 1:30** | **Introduction & Problem Statement** | Background of academic study patterns at UCU; problems with unorganized WhatsApp groups and isolated revision; General and Specific Objectives. | Student 1 |
| **1:30 - 3:00** | **System Architecture & Tech Stack** | 3-tier architecture (React.js SPA, Express.js REST API, MySQL 8.0); explanation of JWT security, bcrypt, and relational normalization. | Student 2 |
| **3:00 - 7:00** | **Live System Demonstration** | Live walkthrough of core workflows: registration, login, group discovery, creation (auto-leader), session scheduling, and admin controls. | Both Students |
| **7:00 - 8:30** | **Database Design & Technical Highlights** | ERD presentation, primary/foreign key cascading, index performance, handling role-based access control. | Student 1 |
| **8:30 - 10:00** | **Conclusion & Q&A Defense** | Summary of milestones achieved, future mobile app roadmap, answering lecturer queries. | Student 2 |

---

## 2. Live Demonstration Script for Lecturers

### Step 1: Landing Page & Public Discovery
- **Action:** Open `http://localhost:5173` (or `standalone_app.html`).
- **Narrative:** *"Honorable panel, we begin on our landing page themed in Uganda Christian University's official blue and gold colors. Prospective and registered students can immediately search for their course units—such as BIT3104 or CSC2101—or inspect featured study circles before logging in."*

### Step 2: Student Login & Role Recognition
- **Action:** Click **Student Login**. Demonstrate login using either institutional email (`kigozi.brian@ucu.ac.ug`) or registration number (`S22/B23/BSIT/014`) with password `Student@123`.
- **Narrative:** *"Our authentication supports dual identifiers: either institutional email or student registration number. Passwords are never stored in plain text—they are hashed using bcrypt with salt. Upon authentication, a signed JWT token is issued and stored in memory/session."*

### Step 3: Personalized Student Dashboard
- **Action:** Walk through the dashboard. Highlight metrics: Joined Groups, Upcoming Sessions, Groups Led.
- **Narrative:** *"The student dashboard gives an immediate academic overview: the student's degree programme, joined groups, and upcoming revision sessions scheduled at the Hamu Mukasa Library or online."*

### Step 4: Group Creation & Automated Leader Assignment
- **Action:** Navigate to **Create Group**. Fill in a new group: *“Distributed Systems Sprint”*, course *BIT3209*, Faculty of Science & Technology, format *Hybrid*, location *Tech Lab 1*.
- **Narrative:** *"When a student creates a study group, our business logic in the backend automatically registers that student in the `group_members` relational table with `member_role = 'LEADER'`. This fulfills assignment requirement 3B, granting the creator management rights."*

### Step 5: Scheduling a Study Session
- **Action:** Go to the newly created group. Click **Study Sessions** -> **Schedule Session**. Add a session on *“Docker Containerization Workshop”* for next Friday at 14:00.
- **Narrative:** *"The Group Leader can schedule physical or online revision sessions. Once scheduled, foreign keys link this session to the group, and our notification service alerts all enrolled members."*

### Step 6: Group Communication & Discussion Board
- **Action:** Publish a discussion question: *“Should we bring laptops with Docker Desktop installed?”*. Then show the threaded comment reply system.
- **Narrative:** *"The platform incorporates an integrated academic forum categorized into Discussions, Announcements, and Academic Questions with real-time threaded comments."*

### Step 7: System Administrator Portal
- **Action:** Log out and log in as `admin@ucu.ac.ug` / `Admin@123`. Open `/admin`.
- **Narrative:** *"Finally, our Administrator Dashboard provides university authorities with real-time analytics: total users, active groups, and identifies the most active courses (e.g. BIT3104 and CSC2101), alongside account moderation tools."*

---

## 3. Anticipated Defense Questions & Model Answers

### Question 1: "Why did you choose a relational database (MySQL) instead of NoSQL (MongoDB)?"
- **Answer:** *"Academic study groups inherently have strict relational dependencies: a student belongs to a specific faculty, creates multiple groups, a group has many members, and sessions/posts belong to specific groups. MySQL enforces foreign key constraints (`ON DELETE CASCADE`), prevents duplicate memberships via unique composite keys on `(group_id, user_id)`, and ensures ACID compliance."*

### Question 2: "How do you protect your API against SQL Injection?"
- **Answer:** *"All queries in our backend models and controllers use parameterized queries (`mysql2/promise` with placeholder `?` values), e.g. `SELECT * FROM users WHERE email = ?`. User inputs are never directly concatenated into raw SQL strings, neutralizing SQL injection vectors."*

### Question 3: "How is Role-Based Access Control (RBAC) enforced?"
- **Answer:** *"We implement a multi-layered middleware architecture in Express.js. First, `authenticate` decodes and verifies the JWT token and checks if the student account is active. Second, specialized middleware such as `requireGroupLeader` checks if the requesting student's ID matches `study_groups.leader_id`, while `requireAdmin` checks if `req.user.role === 'ADMIN'`. Unauthorized requests return HTTP 403 Forbidden."*

### Question 4: "What happens if a student tries to join a group twice?"
- **Answer:** *"We prevent duplicate joins both at the application controller level (checking existing membership before insertion) and at the database level with a unique constraint: `CONSTRAINT uq_group_user UNIQUE (group_id, user_id)` in the `group_members` table."*

### Question 5: "How does the system ensure mobile responsiveness?"
- **Answer:** *"Our CSS architecture utilizes fluid flexbox and CSS grid layouts with breakpoints at `768px`. On mobile devices, the persistent sidebar collapses into an accessible mobile layout, cards scale to single columns, and tables enable horizontal scrolling to maintain usability across phones, tablets, and desktop workstations."*
