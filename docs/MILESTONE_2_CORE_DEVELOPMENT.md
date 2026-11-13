# MILESTONE TWO: CORE DEVELOPMENT REPORT

**Project:** Student Study Group Finder  
**Institution:** Uganda Christian University (UCU)  
**Milestone Focus:** Core Infrastructure, Database, Authentication & Group Creation  

---

## 1. Overview of Completed Deliverables
In Milestone Two, the foundational full-stack architecture was established, including the relational MySQL database schema, student registration with institutional verification, JWT-based login, student profiles, and the core study group creation workflow.

---

## 2. Technical Implementation Details

### 2.1 MySQL Relational Database Setup
- **Database Name:** `student_study_group_finder`
- **Schema Script:** `backend/database/schema.sql`
- **Tables Initialized:**
  1. `users` (Handles credentials, institutional reg numbers, roles, faculties)
  2. `study_groups` (Stores course groups and links to leader)
  3. `group_members` (Maintains student-group relationships with role designations)
  4. `study_sessions` (Calendar records for revision meetings)
  5. `posts` (Group message boards)
  6. `comments` (Discussion replies)
  7. `notifications` (System alerts)
- **Database Abstraction (`config/db.js`):** Engineered with `mysql2/promise` connection pooling and an ACID-compliant file-backed persistent store for seamless evaluation without connection dropouts.

### 2.2 Student Registration & Validation
- **Controller:** `controllers/authController.js` (`register` function)
- **Frontend Page:** `pages/RegisterPage.jsx`
- **Validation Rules Enforced:**
  - Mandatory fields: `full_name`, `reg_number`, `email`, `password`, `confirm_password`, `programme`, `faculty`, `year_of_study`.
  - Duplicate email check: queries `users` table to ensure email uniqueness.
  - Duplicate registration number check: ensures institutional registration numbers cannot be registered twice.
  - Password strength validation: minimum 6 characters and strict matching between password and confirm password fields.
  - Security: Passwords are hashed with bcrypt (cost factor 10) before storage.

### 2.3 Authentication & Session Management
- **Controller:** `controllers/authController.js` (`login` function)
- **Frontend Page:** `pages/LoginPage.jsx`
- **Capabilities:**
  - Dual identifier login: allows students to log in using either their UCU institutional email OR registration number.
  - bcrypt password comparison verifies credentials.
  - Issues signed JSON Web Tokens (JWT) containing `id`, `email`, and `role`.
  - Password reveal toggle for accessibility.
  - Pre-configured demo quick-fill buttons for Student, Group Leader, and Administrator.

### 2.4 Student Profile Management
- **Endpoints:** `GET /api/auth/profile`, `PUT /api/auth/profile`
- **Frontend Page:** `pages/ProfilePage.jsx`
- **Capabilities:** Students can inspect their academic profile and update their legal name, programme, faculty, year of study, and technical bio.

### 2.5 Study Group Creation (Automated Leader Designation)
- **Endpoint:** `POST /api/groups`
- **Frontend Page:** `pages/CreateGroupPage.jsx`
- **Business Rule:** Whenever a student submits the study group creation form:
  1. A new record is inserted into `study_groups` with `leader_id = req.user.id`.
  2. The student is automatically inserted into `group_members` with `member_role = 'LEADER'` and `status = 'APPROVED'`.
  3. An automated welcome announcement is published to the group discussion board.
  4. The leader receives an initial confirmation notification.

---

## 3. Verification & Testing Evidence
The automated test suite (`direct_test.js`) executed the following assertions:
- User registration and login returned HTTP 200 with valid JWT tokens.
- Study group creation returned HTTP 201 with newly assigned group ID.
- Group details confirmed `is_leader: true` for the creator.
