# MILESTONE FIVE: FINAL DEMONSTRATION & DEFENSE MANUAL

**Project:** Student Study Group Finder  
**Institution:** Uganda Christian University (UCU)  
**Milestone Focus:** Final Project Verification, Defense Walkthrough & Delivery  

---

## 1. Project Completion Verification Checklist

| Requirement | Implementation Verification | Status |
|---|---|---|
| **Student Registration & Login** | Implemented with validation, bcrypt password hashing, and JWT tokens. | **VERIFIED** |
| **Profile Management** | Students can view and update legal name, programme, faculty, and bio. | **VERIFIED** |
| **Study Group Creation** | Creator is automatically elevated to Group Leader in `group_members`. | **VERIFIED** |
| **Search & Filtering** | Real-time filtering by course code (e.g. `BIT3104`), title, faculty, and format. | **VERIFIED** |
| **Group Membership** | Join/leave functionality with duplicate prevention and capacity limits. | **VERIFIED** |
| **Study Session Scheduling** | Group leaders schedule revision sessions with dates, times, and venue links. | **VERIFIED** |
| **Upcoming Sessions Feed** | Student dashboard displays aggregated calendar of joined group sessions. | **VERIFIED** |
| **Group Communication** | Categorized posts (Announcements, Questions, Discussions) with comments. | **VERIFIED** |
| **Administrator Dashboard** | System stats (total users, groups, sessions, active courses) & user controls. | **VERIFIED** |
| **Responsive UI/UX** | Mobile, tablet, and desktop responsive layout with UCU blue & gold theme. | **VERIFIED** |
| **Frontend/Backend Separation** | Distinct `frontend/` and `backend/` directories prepared for dual repos. | **VERIFIED** |

---

## 2. Pre-Configured Demonstration Accounts

To facilitate smooth demonstration before Uganda Christian University evaluators, the following seed accounts are pre-configured:

### 1. System Administrator Account
- **Email:** `admin@ucu.ac.ug`
- **Registration Number:** `UCU/ADM/2024/001`
- **Password:** `Admin@123`
- **Capabilities:** Full platform metrics, user activation/deactivation, group moderation, active courses analysis.

### 2. Group Leader Account
- **Student Name:** Brian Kigozi
- **Email:** `kigozi.brian@ucu.ac.ug`
- **Registration Number:** `S22/B23/BSIT/014`
- **Password:** `Student@123`
- **Programme:** Bachelor of Science in Information Technology (Year 3)
- **Capabilities:** Leader of *Web & Mobile Dev Masterminds* and *Database Systems Lab*; can schedule sessions, pin announcements, and remove members.

### 3. Student Account (Active Member)
- **Student Name:** Sarah Nakato
- **Email:** `nakato.sarah@ucu.ac.ug`
- **Registration Number:** `S22/B23/BSCS/029`
- **Password:** `Student@123`
- **Programme:** Bachelor of Science in Computer Science (Year 3)
- **Capabilities:** Member of Web Dev Masterminds; can join new groups, publish questions, and comment.

### 4. Student Account (New Student)
- **Student Name:** David Musiime
- **Email:** `musiime.david@ucu.ac.ug`
- **Registration Number:** `S23/B23/LLB/055`
- **Password:** `Student@123`
- **Programme:** Bachelor of Laws (Year 2)
- **Capabilities:** Leader of Constitutional Law Forum.

---

## 3. How to Launch and Demonstrate

### Option A: Standard Full-Stack Execution
1. **Start the Backend Server:**
   ```bash
   cd backend
   npm install
   npm start
   ```
   *Runs on `http://localhost:5000`.*

2. **Start the Frontend Application:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Runs on `http://localhost:5173`.*

3. **Open Browser:** Navigate to `http://localhost:5173`.

### Option B: One-Click Demonstration
Run the provided batch script in the project root:
```cmd
start-project.bat
```

### Option C: Standalone Zero-Build Browser Preview
Double-click `frontend/standalone_app.html` in Windows Explorer to open the complete interactive application in Google Chrome or Microsoft Edge.
