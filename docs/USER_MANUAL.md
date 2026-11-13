# USER MANUAL: STUDENT STUDY GROUP FINDER
**Uganda Christian University (UCU)**

---

## 1. Overview
The **Student Study Group Finder** is an institutional web platform created for Uganda Christian University students to organize collaborative study circles, coordinate revision sessions at Mukono Main Campus or online, and engage in peer discussions.

This manual explains how to use the application across its three primary roles:
1. **Student**
2. **Group Leader**
3. **System Administrator**

---

## 2. Getting Started

### 2.1 Accessing the Application
- Open any web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
- Navigate to `http://localhost:5173` (or the deployed university URL).
- The **Landing Page** displays university highlights, featured study groups, and a live course search bar.

---

## 3. Account Registration & Authentication

### 3.1 Registering a Student Account
1. Click **Register Account** on the top navigation bar.
2. Complete all required fields:
   - **Full Name:** Enter your full legal name (e.g. *Brian Kigozi*).
   - **Registration Number:** Enter your official UCU student registration number (e.g. *S22/B23/BSIT/014*).
   - **Email Address:** Enter your student email address (e.g. *kigozi.brian@ucu.ac.ug*).
   - **Password & Confirmation:** Must be at least 6 characters.
   - **Programme of Study:** e.g. *Bachelor of Science in Information Technology*.
   - **Faculty / School:** Select your faculty from the dropdown (e.g. *Faculty of Science & Technology*).
   - **Year of Study:** Select Year 1, 2, 3, 4, or Postgraduate.
3. Click **Create Student Account**. Upon successful validation, you are automatically logged in and redirected to your **Student Dashboard**.

### 3.2 Logging In
1. Navigate to the **Login Page** (`/login`).
2. In the identifier field, you may enter either your **Email Address** OR your **Registration Number**.
3. Enter your password. Use the eye icon toggle to reveal or hide your password.
4. *(Optional during defense/evaluation)*: Use the **Demonstration Quick-Fill Accounts** buttons (Group Leader, Student, or Admin) to fill sample credentials instantly.
5. Click **Sign In**.

---

## 4. Student Workflow

### 4.1 The Student Dashboard
Your dashboard provides a high-level summary of your academic activities:
- **Welcome Banner:** Displays your name, faculty, programme, and registration number.
- **Metrics Cards:** Count of joined groups, upcoming revision sessions, and groups you lead.
- **My Study Groups:** Instant access to your active revision circles.
- **Upcoming Revision Sessions:** Scheduled meetings with dates, times, and venue links.
- **Recommended For You:** Course groups in your faculty that you have not joined yet.

### 4.2 Discovering & Joining Groups
1. Click **Explore Groups** in the sidebar.
2. Filter groups using:
   - **Search Box:** Type course codes (e.g. *BIT3104*), titles (e.g. *Algorithms*), or topics.
   - **Faculty Dropdown:** Filter by specific UCU faculties.
   - **Format Dropdown:** Filter by *Physical*, *Online*, or *Hybrid*.
3. Click **Details** to preview group information, description, and leader.
4. Click **Join Group**. You will immediately be added as a member and gain access to group discussions and scheduled sessions.

---

## 5. Group Leader Workflow

Whenever you create a new study group, you are automatically designated as its **Group Leader**.

### 5.1 Creating a Study Group
1. Click **Create Study Group** in the sidebar menu.
2. Provide group details:
   - **Group Name:** e.g. *Web & Mobile Dev Masterminds*.
   - **Course Code:** e.g. *BIT3104*.
   - **Course Name:** e.g. *Web and Mobile Application Development*.
   - **Faculty / School:** Select the host faculty.
   - **Study Description:** Describe study goals, topics, and expectations.
   - **Meeting Format:** Physical, Online, or Hybrid.
   - **Meeting Location / Link:** Physical room (e.g. *Tech Lab 2*) or Google Meet link.
3. Click **Publish Study Group**. You are now the Group Leader.

### 5.2 Scheduling a Revision Session
1. Navigate to your study group's page (`/groups/:id`).
2. Click the **Study Sessions** tab.
3. Click **Schedule Session**.
4. Fill in:
   - Session Title (e.g. *Exam Revision Sprint: Normalization*).
   - Date, Start Time, and End Time.
   - Physical venue or Google Meet / Zoom link.
   - Preparation notes for members.
5. Click **Schedule Session**. All group members will receive an in-app notification.

### 5.3 Moderating Members
1. Under your study group's **Members** tab, view all registered peers.
2. If necessary, click **Remove** next to any member to remove them from the group.

---

## 6. Group Communication & Discussions

### 6.1 Publishing Posts
Inside any group you belong to:
1. Click **New Post**.
2. Select post classification:
   - **Discussion / Note Sharing:** For general revision notes.
   - **Academic Question:** When seeking clarification from peers.
   - **Announcement (Leaders only):** Pinned to the top of the group.
3. Provide a title and content, then click **Publish Post**.

### 6.2 Commenting on Posts
1. Click on the comment toggle below any post.
2. Type your reply in the input box and click **Reply**.
3. Comments appear in real-time with author names and timestamps.

---

## 7. System Administrator Workflow

System administrators have institutional oversight and moderation authority.

### 7.1 Accessing the Admin Console
1. Log in with administrative credentials:
   - **Email:** `admin@ucu.ac.ug`
   - **Password:** `Admin@123`
2. Click **Admin Dashboard** in the sidebar.

### 7.2 Viewing Analytics
- **Total Registered Students, Groups, and Sessions.**
- **Most Active Courses:** Identifies which course units have the highest study circle engagement.
- **Faculty Participation:** Visual breakdown of student enrollment across faculties.

### 7.3 User & Group Moderation
- **User Accounts Tab:** View all student accounts. Click the toggle button to activate or deactivate an account, or delete accounts violating university policies.
- **Study Groups Tab:** Inspect all groups, course codes, leaders, and member counts.
