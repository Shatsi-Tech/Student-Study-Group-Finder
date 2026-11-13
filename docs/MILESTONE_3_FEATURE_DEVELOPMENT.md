# MILESTONE THREE: FEATURE DEVELOPMENT REPORT

**Project:** Student Study Group Finder  
**Institution:** Uganda Christian University (UCU)  
**Milestone Focus:** Group Membership, Search/Filtering, Sessions, Discussions & Comments  

---

## 1. Overview of Completed Deliverables
In Milestone Three, the interactive academic collaboration features were fully developed and connected to backend REST endpoints. These include group membership management, multi-parameter search and filtering, study session scheduling, threaded discussion boards, and notifications.

---

## 2. Technical Implementation Details

### 2.1 Study Group Search & Filtering
- **Endpoint:** `GET /api/groups`
- **Frontend Page:** `pages/ExploreGroupsPage.jsx`
- **Capabilities:**
  - Full-text search matching course title (e.g. *Web and Mobile Application Development*), course code (e.g. *BIT3104*), and study topics.
  - Faculty filter dropdown supporting all UCU academic faculties.
  - Format filter supporting *Physical*, *Online*, and *Hybrid*.
  - Real-time result rendering with member capacity indicators.

### 2.2 Group Membership Management
- **Endpoints:**
  - `POST /api/groups/:id/join`
  - `POST /api/groups/:id/leave`
  - `DELETE /api/groups/:id/members/:userId`
- **Capabilities:**
  - Students can join any open group with one click.
  - Duplicate membership prevention: both controller checks and database constraints prevent double joins.
  - Capacity enforcement: rejects joins if group member count reaches `max_members`.
  - Notification dispatch: alerts the group leader whenever a new student joins.
  - Member removal: group leaders and administrators can remove members from the roster.

### 2.3 Study Session Scheduling
- **Endpoints:**
  - `POST /api/sessions`
  - `GET /api/sessions/my-upcoming`
  - `GET /api/sessions/group/:groupId`
- **Frontend Components:** `components/SessionCard.jsx`, `pages/StudySessionsPage.jsx`, and scheduling modal in `pages/GroupDetailsPage.jsx`.
- **Capabilities:**
  - Group leaders can schedule physical workshops (e.g. at Hamu Mukasa Library) or online Google Meet sprints.
  - Captures session title, study date, start time, end time, venue/link, and preparation guidelines.
  - Broadcasts session notifications to all enrolled group members.

### 2.4 Group Communication System (Discussions, Announcements & Comments)
- **Endpoints:**
  - `POST /api/posts` (Create post)
  - `GET /api/posts/group/:groupId` (Fetch group posts with threaded comments)
  - `POST /api/comments` (Add comment)
  - `DELETE /api/posts/:id` & `DELETE /api/comments/:id`
- **Frontend Component:** `components/PostCard.jsx`
- **Taxonomy:**
  - **DISCUSSION:** For sharing revision notes, links, and study outlines.
  - **ACADEMIC QUESTION:** For asking peer clarification on coursework exercises.
  - **ANNOUNCEMENT:** Pinned by group leaders to the top of the discussion forum.
- **Threaded Comments:** Real-time commenting allows peers to discuss answers directly underneath posts.

### 2.5 In-App Notifications
- **Endpoints:** `GET /api/notifications`, `PUT /api/notifications/:id/read`, `PUT /api/notifications/read-all`
- **Frontend Component:** Notification bell in `components/Navbar.jsx`.
- **Capabilities:** Displays unread notification count badge and alerts students of new session schedules, comments on their posts, or group membership updates.

---

## 3. Verification & Testing Evidence
The automated test suite (`direct_test.js`) executed the following assertions:
- Student Sarah Nakato successfully joined Group 6.
- Group leader Brian Kigozi scheduled a session for Docker Containerization.
- Discussion question published and received an immediate threaded comment response.
- Sarah's notification inbox received instant notification updates.
