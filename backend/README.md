# Student Study Group Finder - Backend API

RESTful API backend for the **Uganda Christian University (UCU)** Student Study Group Finder platform.

## Features & Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js REST API
- **Database:** MySQL 8.0+ (with ACID-compliant fallback relational persistence engine)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt password hashing
- **Security:** Role-Based Access Control (RBAC: Student, Group Leader, System Administrator), parameterized queries preventing SQL injection, CORS and request sanitization.

---

## Directory Structure
```
backend/
├── config/
│   ├── db.js             # MySQL pool connection and relational storage abstraction
│   └── jwt.js            # JWT signing and verification service
├── controllers/
│   ├── authController.js         # Student registration, login, profile management
│   ├── groupController.js        # Group CRUD, auto-assign leader, member joins
│   ├── sessionController.js      # Study session scheduling and calendar feeds
│   ├── postController.js         # Discussion boards, announcements, questions
│   ├── commentController.js      # Post comment threads and notifications
│   ├── notificationController.js # Student notifications and unread badges
│   └── adminController.js        # Analytics, user management, moderation
├── database/
│   ├── schema.sql        # Full MySQL relational database schema
│   ├── seed.sql          # UCU sample data (faculties, courses, users, groups)
│   ├── initDb.js         # Database migration and seed execution script
│   └── db_store.json     # Persistent state store for offline defense mode
├── middleware/
│   ├── authMiddleware.js # Token authentication and RBAC guards
│   └── errorHandler.js   # Centralized error and 404 response handlers
├── routes/
│   ├── authRoutes.js
│   ├── groupRoutes.js
│   ├── sessionRoutes.js
│   ├── postRoutes.js
│   ├── commentRoutes.js
│   ├── notificationRoutes.js
│   └── adminRoutes.js
├── services/
│   └── passwordService.js # Secure bcrypt hashing and comparison
├── .env.example
├── package.json
├── README.md
└── server.js             # Main server bootstrap
```

---

## Installation & Setup

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- MySQL Server or XAMPP (Port 3306)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your database credentials match:
```ini
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=student_study_group_finder
JWT_SECRET=ucu_study_group_finder_super_secret_jwt_key_2024
```

### 4. Initialize Database
Execute the automated migration script:
```bash
node database/initDb.js
```
*(Or import `database/schema.sql` and `database/seed.sql` into MySQL Workbench / phpMyAdmin).*

### 5. Start Backend Server
```bash
# Standard start
npm start

# Development mode with auto-reload
npm run dev
```
The server will start on `http://localhost:5000`.

---

## Pre-Configured Test Accounts

| Role | Email / Reg Number | Password | Notes |
|---|---|---|---|
| **System Administrator** | `admin@ucu.ac.ug` | `Admin@123` | Full dashboard access, platform stats, user management |
| **Group Leader** | `kigozi.brian@ucu.ac.ug` | `Student@123` | Leader of Web & Mobile Dev, Database Lab |
| **Student (Member)** | `nakato.sarah@ucu.ac.ug` | `Student@123` | Computer Science Year 3, joined in groups |
| **Student (New)** | `musiime.david@ucu.ac.ug` | `Student@123` | Bachelor of Laws Year 2 |
