# REST API DOCUMENTATION

**Base URL:** `http://localhost:5000/api`  
**Authentication Scheme:** Bearer Token via HTTP `Authorization` Header  
`Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 1. Authentication Endpoints

### 1.1 Student Registration
- **Endpoint:** `POST /auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "full_name": "Brian Kigozi",
  "reg_number": "S22/B23/BSIT/014",
  "email": "kigozi.brian@ucu.ac.ug",
  "password": "Student@123",
  "confirm_password": "Student@123",
  "programme": "Bachelor of Science in Information Technology",
  "faculty": "Faculty of Science & Technology",
  "year_of_study": "Year 3"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Student account registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "full_name": "Brian Kigozi",
    "reg_number": "S22/B23/BSIT/014",
    "email": "kigozi.brian@ucu.ac.ug",
    "role": "STUDENT",
    "programme": "Bachelor of Science in Information Technology",
    "faculty": "Faculty of Science & Technology",
    "year_of_study": "Year 3"
  }
}
```

### 1.2 User Login
- **Endpoint:** `POST /auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "identifier": "kigozi.brian@ucu.ac.ug",
  "password": "Student@123"
}
```
*(Accepts either email address or institutional registration number).*
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Welcome back, Brian Kigozi!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "full_name": "Brian Kigozi",
    "email": "kigozi.brian@ucu.ac.ug",
    "reg_number": "S22/B23/BSIT/014",
    "role": "STUDENT"
  }
}
```

### 1.3 Get Current Profile
- **Endpoint:** `GET /auth/profile`
- **Access:** Authenticated (Student / Admin)
- **Response (200 OK):** Returns current user record.

### 1.4 Update Profile
- **Endpoint:** `PUT /auth/profile`
- **Access:** Authenticated
- **Request Body:**
```json
{
  "full_name": "Brian Kigozi",
  "programme": "Bachelor of Science in Information Technology",
  "faculty": "Faculty of Science & Technology",
  "year_of_study": "Year 3",
  "bio": "Full-stack developer with focus on Node.js and React."
}
```

---

## 2. Study Group Endpoints

### 2.1 Get / Search Study Groups
- **Endpoint:** `GET /groups`
- **Access:** Public or Authenticated
- **Query Parameters:**
  - `search` (Optional: searches group title, course name, course code)
  - `faculty` (Optional: filters by faculty)
  - `meeting_type` (Optional: `Physical`, `Online`, `Hybrid`)
  - `my_groups` (Optional: `true` to return groups joined by current user)
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "groups": [
    {
      "id": 1,
      "name": "Web & Mobile Dev Masterminds",
      "course_name": "Web and Mobile Application Development",
      "course_code": "BIT3104",
      "faculty": "Faculty of Science & Technology",
      "description": "Collaborative revision for React and Express.",
      "meeting_location": "Tech Lab 2 / Google Meet",
      "meeting_type": "Hybrid",
      "leader_id": 2,
      "leader_name": "Brian Kigozi",
      "member_count": 3,
      "max_members": 12,
      "is_member": true
    }
  ]
}
```

### 2.2 Create Study Group
- **Endpoint:** `POST /groups`
- **Access:** Authenticated Student
- **Business Rule:** The creator is automatically designated as the `LEADER` of the group in `group_members`.
- **Request Body:**
```json
{
  "name": "Data Structures & Algorithms Circle",
  "course_name": "Data Structures and Algorithms",
  "course_code": "CSC2101",
  "faculty": "Faculty of Science & Technology",
  "description": "Recursion, graph search, and complexity revision.",
  "meeting_location": "Hamu Mukasa Library Discussion Room 3",
  "meeting_type": "Physical",
  "max_members": 10
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Study group created successfully! You are now the Group Leader.",
  "groupId": 2
}
```

### 2.3 Get Group By ID
- **Endpoint:** `GET /groups/:id`
- **Access:** Public or Authenticated
- **Response (200 OK):** Returns complete group record, leader profile, approved members array, and current user status (`is_member`, `is_leader`).

### 2.4 Join Study Group
- **Endpoint:** `POST /groups/:id/join`
- **Access:** Authenticated Student
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully joined Web & Mobile Dev Masterminds!"
}
```

### 2.5 Leave Study Group
- **Endpoint:** `POST /groups/:id/leave`
- **Access:** Authenticated Member (Leaders cannot leave without transferring or deleting the group).

### 2.6 Remove Member
- **Endpoint:** `DELETE /groups/:id/members/:userId`
- **Access:** Group Leader or System Administrator

---

## 3. Study Session Endpoints

### 3.1 Schedule Study Session
- **Endpoint:** `POST /sessions`
- **Access:** Group Leader or System Administrator
- **Request Body:**
```json
{
  "group_id": 1,
  "title": "React Router & REST API Integration Sprint",
  "study_date": "2024-11-20",
  "start_time": "14:00:00",
  "end_time": "16:30:00",
  "location_or_link": "Tech Lab 2 (Main Campus)",
  "description": "Hands-on session building Axios interceptors and state management."
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Study session scheduled successfully.",
  "sessionId": 1
}
```

### 3.2 Get User's Upcoming Sessions
- **Endpoint:** `GET /sessions/my-upcoming`
- **Access:** Authenticated Student

### 3.3 Get Group Sessions
- **Endpoint:** `GET /sessions/group/:groupId`
- **Access:** Authenticated Group Member

---

## 4. Group Discussions & Comments

### 4.1 Create Discussion Post
- **Endpoint:** `POST /posts`
- **Access:** Approved Group Member
- **Request Body:**
```json
{
  "group_id": 1,
  "title": "Question regarding JWT expiration handling",
  "content": "When an access token expires, should we catch the 401 error in Axios interceptors and automatically refresh?",
  "post_type": "QUESTION",
  "is_pinned": false
}
```

### 4.2 Get Group Posts
- **Endpoint:** `GET /posts/group/:groupId`
- **Access:** Approved Group Member or Admin

### 4.3 Add Comment to Post
- **Endpoint:** `POST /comments`
- **Access:** Approved Group Member
- **Request Body:**
```json
{
  "post_id": 2,
  "content": "The best practice is using Axios interceptors to clear localStorage on 401 and redirect to login."
}
```

---

## 5. System Administrator Endpoints

*(Requires `role === 'ADMIN'`)*

### 5.1 Platform Statistics
- **Endpoint:** `GET /admin/stats`
- **Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 6,
    "totalStudents": 5,
    "totalGroups": 5,
    "activeGroups": 5,
    "totalSessions": 5,
    "upcomingSessions": 5,
    "totalPosts": 5,
    "mostActiveCourses": [
      { "course": "BIT3104: Web and Mobile Application Development", "count": 1 }
    ],
    "facultyDistribution": [
      { "faculty": "Faculty of Science & Technology", "count": 4 }
    ]
  }
}
```

### 5.2 User Account Management
- `GET /admin/users` - List all registered accounts
- `PUT /admin/users/:id/toggle-status` - Activate or deactivate account
- `DELETE /admin/users/:id` - Delete account
- `GET /admin/groups` - Inspect all study groups
