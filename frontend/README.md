# Student Study Group Finder - Frontend Application

Modern React.js single-page application (SPA) for the **Uganda Christian University (UCU)** Student Study Group Finder.

## Technologies Used
- **Library:** React.js (v18)
- **Routing:** React Router DOM (v6)
- **API Client:** Axios (with Bearer token interceptor and automatic session management)
- **Icons:** Lucide React
- **Design System:** Uganda Christian University theme (Royal Blue `#0B3B60`, Gold `#E09F3E`, Slate Grey `#F8FAFC`, Navy `#07263F`)
- **Build Tool:** Vite

---

## Directory Structure
```
frontend/
├── public/
│   └── favicon.svg           # UCU graduation cap favicon
├── src/
│   ├── assets/               # Brand assets & logos
│   ├── components/
│   │   ├── Navbar.jsx        # Top navigation with notifications & profile dropdown
│   │   ├── Sidebar.jsx       # Responsive drawer for student & admin navigation
│   │   ├── Footer.jsx        # University academic footer
│   │   ├── GroupCard.jsx     # Course code, faculty, member count & join CTA
│   │   ├── SessionCard.jsx   # Study date, start/end time, meeting location/link
│   │   ├── PostCard.jsx      # Discussion threads, announcements & comments
│   │   ├── StatCard.jsx      # Metric cards with icons & counters
│   │   ├── Modal.jsx         # Accessible popups for scheduling & posting
│   │   ├── LoadingSpinner.jsx
│   │   ├── ProtectedRoute.jsx # Route authentication guard
│   │   └── AdminRoute.jsx    # System administrator guard
│   ├── context/
│   │   ├── AuthContext.jsx   # JWT state, login, register, profile refresh
│   │   └── NotificationContext.jsx # Dismissible toast notifications
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx   # University hero, live search & featured groups
│   │   ├── LoginPage.jsx     # Email/Reg Number login with quick-fill demo buttons
│   │   ├── RegisterPage.jsx  # Student signup with full field validation
│   │   ├── StudentDashboard.jsx # Personalized metrics, upcoming sessions, feed
│   │   ├── ExploreGroupsPage.jsx # Real-time filtering by course/faculty/format
│   │   ├── CreateGroupPage.jsx  # Group creation form (auto-assigns leader)
│   │   ├── GroupDetailsPage.jsx # Discussions, sessions, member management
│   │   ├── StudySessionsPage.jsx # Calendar of upcoming revision sessions
│   │   ├── ProfilePage.jsx   # Student details & editable academic bio
│   │   ├── AdminDashboard.jsx # System overview, user and group moderation
│   │   └── NotFoundPage.jsx
│   ├── services/
│   │   ├── api.js            # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── groupService.js
│   │   ├── sessionService.js
│   │   ├── postService.js
│   │   ├── adminService.js
│   │   └── notificationService.js
│   ├── styles/
│   │   └── index.css         # UCU responsive stylesheet
│   ├── App.jsx               # Route definitions
│   └── main.jsx              # React DOM entrypoint
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Running the Frontend

### 1. Prerequisites
- Node.js (v18+)
- Backend running on `http://localhost:5000`

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The React development server will start on `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Generates optimized static assets in `dist/`.
