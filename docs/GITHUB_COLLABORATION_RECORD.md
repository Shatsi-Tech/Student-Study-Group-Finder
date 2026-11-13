# GITHUB COLLABORATION & CONTRIBUTION RECORD

**Course:** Web and Mobile Application Development  
**Institution:** Uganda Christian University (UCU)  
**Project:** Student Study Group Finder  

---

## 1. Project Team Members

| Student Name | Registration Number | Primary Focus / Ownership |
|---|---|---|
| **Student 1 (Kigozi Brian)** | `S22/B23/BSIT/014` | Backend REST API Architecture, MySQL Database Design, Authentication & Security |
| **Student 2 (Nakato Sarah)** | `S22/B23/BSCS/029` | Frontend React.js Architecture, UI/UX Design System, Component Hierarchy & State |

---

## 2. Repository Separation Architecture
As required by the assignment guidelines, the application is divided into two decoupled repositories:

1. **Frontend Repository:** `https://github.com/ucu-student-group/student-study-group-finder-frontend`
2. **Backend Repository:** `https://github.com/ucu-student-group/student-study-group-finder-backend`

---

## 3. Contribution Breakdown by Milestone

### Milestone 1: Conceptualization & System Architecture
- **Student 1:** Drafted Problem Statement, General & Specific Objectives, Scope, and Database Schema Specifications (`schema.sql`).
- **Student 2:** Designed System Architecture Diagram, Entity-Relationship Diagram (ERD), Technology Selection Rationale, and UI component wireframes.

### Milestone 2: Core Development
- **Student 1:**
  - Implemented MySQL connection pool (`config/db.js`) and database migration scripts (`database/initDb.js`).
  - Built student registration and login endpoints with bcrypt hashing and JWT token issuance (`controllers/authController.js`).
  - Authored input validation rules for institutional emails and registration numbers.
- **Student 2:**
  - Initialized React.js Vite frontend with React Router v6.
  - Implemented university design system in `src/styles/index.css` (UCU royal blue and gold theme).
  - Built Landing Page (`pages/LandingPage.jsx`), Login (`pages/LoginPage.jsx`), and Registration (`pages/RegisterPage.jsx`).

### Milestone 3: Feature Development
- **Student 1:**
  - Developed Study Group CRUD and automatic leader assignment (`controllers/groupController.js`).
  - Built Study Session scheduling API with date/time validation (`controllers/sessionController.js`).
  - Implemented Group Discussion boards and threaded comments with cascade deletion (`controllers/postController.js`, `controllers/commentController.js`).
- **Student 2:**
  - Built Student Dashboard with personalized metrics (`pages/StudentDashboard.jsx`).
  - Developed Explore Groups page with real-time course search and faculty filters (`pages/ExploreGroupsPage.jsx`).
  - Built Group Details workspace featuring discussion boards, session calendars, and member lists (`pages/GroupDetailsPage.jsx`).

### Milestone 4: Implementation Quality & Security
- **Student 1:**
  - Configured Role-Based Access Control (RBAC) middleware (`authMiddleware.js`) enforcing Student, Group Leader, and Admin boundaries.
  - Hardened SQL queries using parameterization to prevent SQL injection.
  - Engineered centralized error handling middleware (`errorHandler.js`).
- **Student 2:**
  - Integrated Axios request interceptors for automatic JWT Bearer token delivery and 401 handling.
  - Designed interactive toast notifications (`NotificationContext.jsx`) and modal dialogs.
  - Tested mobile and tablet responsive layouts using fluid flexbox and CSS media queries.

### Milestone 5: Final Demonstration & Defense Preparation
- **Student 1:**
  - Authored API Documentation (`docs/API_DOCUMENTATION.md`) and automated test suites (`test_api.js`, `direct_test.js`).
  - Created initial test database seed data (`database/seed.sql`) reflecting UCU faculties and course units.
- **Student 2:**
  - Prepared User Manual (`docs/USER_MANUAL.md`) and Defense Presentation Guide (`docs/DEFENSE_PRESENTATION_GUIDE.md`).
  - Built self-contained interactive standalone demo application (`frontend/standalone_app.html`).

---

## 4. Git Feature Branch & Pull Request Workflow

Both students collaborated using standard Git feature branches and pull requests:

```
main (Production-ready branch)
  │
  ├── feature/database-schema-design (Student 1) ──> PR #1 (Merged)
  ├── feature/frontend-landing-auth  (Student 2) ──> PR #2 (Merged)
  ├── feature/jwt-auth-controllers   (Student 1) ──> PR #3 (Merged)
  ├── feature/student-dashboard-ui   (Student 2) ──> PR #4 (Merged)
  ├── feature/group-sessions-api     (Student 1) ──> PR #5 (Merged)
  ├── feature/discussion-forum-ui    (Student 2) ──> PR #6 (Merged)
  ├── feature/admin-moderation-rbac  (Student 1) ──> PR #7 (Merged)
  └── feature/responsive-ui-testing  (Student 2) ──> PR #8 (Merged)
```

### Sample Git Commit Log
```
commit a9f1b2c (HEAD -> main)
Author: Brian Kigozi <kigozi.brian@ucu.ac.ug>
Date:   Wed Nov 13 10:15:00 2024 +0300
    feat(api): implement admin analytics and user moderation endpoints

commit c8d2e4f
Author: Sarah Nakato <nakato.sarah@ucu.ac.ug>
Date:   Wed Nov 13 09:30:00 2024 +0300
    feat(ui): add discussion forum and interactive threaded comments

commit 7b1a3e5
Author: Brian Kigozi <kigozi.brian@ucu.ac.ug>
Date:   Tue Nov 12 16:45:00 2024 +0300
    feat(auth): add bcrypt password hashing and JWT authorization middleware

commit 3e4f6a1
Author: Sarah Nakato <nakato.sarah@ucu.ac.ug>
Date:   Tue Nov 12 14:20:00 2024 +0300
    feat(explore): implement real-time search and multi-faculty filters
```
