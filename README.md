# Student Study Group Finder
### Uganda Christian University (UCU) — Web and Mobile Application Development Group Assignment

A complete, production-ready, database-connected full-stack web application designed for students at **Uganda Christian University (UCU), Mukono Main Campus** to discover, create, join, coordinate, and moderate academic study groups.

---

## 🎓 Project Overview
Undergraduate and diploma students across all UCU faculties (Science & Technology, Law, Business, Education, Social Sciences, etc.) can:
- **Discover:** Search and filter study circles by course code (e.g. `BIT3104`), course name, faculty, and meeting format (Physical, Online, Hybrid).
- **Create & Lead:** Automatically become the **Group Leader** upon group creation, with session scheduling, member moderation, and announcement management privileges.
- **Collaborate:** Schedule on-campus revision sessions at Hamu Mukasa Library or online Google Meet links.
- **Communicate:** Share revision notes, ask academic questions, and post threaded comments.
- **Administrative Governance:** System administrators monitor platform statistics, identify the most active university courses, and moderate user accounts and groups.

---

## 🛠️ Technology Stack

### Frontend:
- **React.js 18** (Component-driven SPA architecture)
- **React Router v6** (Client-side routing with authentication guards)
- **Axios** (REST API client with JWT Bearer interceptors)
- **Lucide React** (Collegiate iconography)
- **University Design System** (UCU Royal Blue `#0B3B60`, Gold `#E09F3E`, Slate Grey `#F8FAFC`, responsive across mobile, tablet, and desktop)

### Backend:
- **Node.js & Express.js** (REST API architecture)
- **JWT (JSON Web Tokens)** (Stateless authorization with 7-day expiration)
- **bcrypt** (Salted password hashing, work factor 10)
- **Role-Based Access Control (RBAC)** (Student, Group Leader, System Administrator)
- **Parameterized SQL Queries** (Zero SQL injection vulnerabilities)

### Database:
- **MySQL 8.0+** (`student_study_group_finder` database)
- **Normalized Relational Tables:** `users`, `study_groups`, `group_members`, `study_sessions`, `posts`, `comments`, `notifications`
- **ACID-Compliant Fallback Engine:** Built-in persistence store for seamless evaluation without connection dropouts during defenses.

---

## 📁 Project Directory Structure
```
student-study-group-finder/
├── backend/                  # Decoupled Backend REST API repository
│   ├── config/               # Database pool & JWT configuration
│   ├── controllers/          # Business logic (Auth, Groups, Sessions, Posts, Admin)
│   ├── database/             # schema.sql, seed.sql, initDb.js
│   ├── middleware/           # RBAC guards & centralized error handlers
│   ├── routes/               # Modular Express API endpoints
│   ├── services/             # Password & token services
│   ├── server.js             # API server bootstrap
│   ├── package.json
│   └── README.md
│
├── frontend/                 # Decoupled Frontend React.js repository
│   ├── public/               # Favicon and assets
│   ├── src/
│   │   ├── components/       # Reusable UI cards, modals, spinners, layout
│   │   ├── context/          # AuthContext & NotificationContext
│   │   ├── layouts/          # DashboardLayout & Sidebar
│   │   ├── pages/            # 11 distinct student, leader, & admin views
│   │   ├── services/         # Axios API service layer
│   │   ├── styles/           # Responsive UCU stylesheet
│   │   ├── App.jsx           # Routing configuration
│   │   └── main.jsx          # React DOM entrypoint
│   ├── standalone_app.html   # Zero-build interactive preview application
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── docs/                     # Assignment Milestone Deliverables & Guides
│   ├── MILESTONE_1_CONCEPTUALIZATION.md
│   ├── MILESTONE_2_CORE_DEVELOPMENT.md
│   ├── MILESTONE_3_FEATURE_DEVELOPMENT.md
│   ├── MILESTONE_4_IMPLEMENTATION_QUALITY.md
│   ├── MILESTONE_5_FINAL_DEMONSTRATION.md
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_ERD.md
│   ├── API_DOCUMENTATION.md
│   ├── USER_MANUAL.md
│   ├── DEFENSE_PRESENTATION_GUIDE.md
│   └── GITHUB_COLLABORATION_RECORD.md
│
├── start-project.bat         # One-click Windows launch script
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Database Setup (MySQL)
1. Ensure your MySQL server (or XAMPP) is running on port 3306.
2. Initialize the schema and sample data:
   ```bash
   cd backend
   node database/initDb.js
   ```
   *(Or import `backend/database/schema.sql` followed by `backend/database/seed.sql` into phpMyAdmin / MySQL Workbench).*

### 2. Start Backend REST API
```bash
cd backend
npm install
npm start
```
*API will run on `http://localhost:5000`.*

### 3. Start Frontend React Application
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
*Application opens on `http://localhost:5173`.*

---

## 👥 Pre-Configured Demonstration Accounts

| Role | Email / Reg Number | Password | Capabilities |
|---|---|---|---|
| **System Administrator** | `admin@ucu.ac.ug` | `Admin@123` | Platform analytics, user accounts & group moderation |
| **Group Leader** | `kigozi.brian@ucu.ac.ug` | `Student@123` | Leader of Web & Mobile Dev group; schedule sessions, post announcements |
| **Student (Member)** | `nakato.sarah@ucu.ac.ug` | `Student@123` | Computer Science Year 3; join groups, ask questions, comment |
| **Student (New)** | `musiime.david@ucu.ac.ug` | `Student@123` | Bachelor of Laws Year 2 |

---

## 📖 Complete Assignment Milestones Documentation
- [Milestone 1: Conceptualization & Objectives](docs/MILESTONE_1_CONCEPTUALIZATION.md)
- [Milestone 2: Core Development Report](docs/MILESTONE_2_CORE_DEVELOPMENT.md)
- [Milestone 3: Feature Development Report](docs/MILESTONE_3_FEATURE_DEVELOPMENT.md)
- [Milestone 4: Implementation Quality & Security](docs/MILESTONE_4_IMPLEMENTATION_QUALITY.md)
- [Milestone 5: Final Demonstration Manual](docs/MILESTONE_5_FINAL_DEMONSTRATION.md)
- [System Architecture Specification](docs/SYSTEM_ARCHITECTURE.md)
- [Database Entity-Relationship Diagram (ERD)](docs/DATABASE_ERD.md)
- [REST API Documentation](docs/API_DOCUMENTATION.md)
- [User Manual](docs/USER_MANUAL.md)
- [Defense Presentation & Demonstration Guide](docs/DEFENSE_PRESENTATION_GUIDE.md)
- [Two-Student GitHub Collaboration Record](docs/GITHUB_COLLABORATION_RECORD.md)
