# MILESTONE FOUR: IMPLEMENTATION QUALITY & SECURITY AUDIT

**Project:** Student Study Group Finder  
**Institution:** Uganda Christian University (UCU)  
**Milestone Focus:** Code Modularity, Security, Validation, UI/UX & Responsive Design  

---

## 1. Overview of Quality Engineering
Milestone Four focuses on ensuring high technical standards, robust application security, rigorous input validation, role-based access control, responsive design across viewport sizes, and error resilience.

---

## 2. Security & Authorization Architecture

### 2.1 Password Hashing with bcrypt
- Passwords are never stored in plain text.
- Passwords are processed through bcrypt with salt rounds set to 10 (`bcrypt.hash(password, 10)`).
- Protects stored user credentials against rainbow-table attacks and unauthorized disclosures.

### 2.2 JWT Authentication & Stateless Authorization
- Signed with HMAC-SHA256 (`HS256`) using a strong secret key (`JWT_SECRET`).
- Token payload embeds user identification (`id`, `email`, `role`).
- Expiration window configured to 7 days.
- Axios request interceptor attaches the token automatically: `Authorization: Bearer <token>`.
- Axios response interceptor catches HTTP 401 Unauthorized responses, clears stale tokens from `localStorage`, and safely redirects to `/login`.

### 2.3 Role-Based Access Control (RBAC)
Three distinct access levels are strictly enforced via middleware (`backend/middleware/authMiddleware.js`):
1. **STUDENT:**
   - Standard access: browse groups, join groups, participate in discussion threads, schedule personal profile updates.
2. **GROUP LEADER:**
   - Evaluated dynamically via `requireGroupLeader`: ensures `req.user.id === study_groups.leader_id`.
   - Authorized to schedule revision sessions, pin announcements, and remove members.
3. **SYSTEM ADMINISTRATOR:**
   - Protected by `requireAdmin`: strictly verifies `req.user.role === 'ADMIN'`.
   - Access to platform statistics, active course monitoring, user deactivation/deletion, and group removal.

### 2.4 SQL Injection Protection
- All database operations execute through parameterized statements with `?` placeholders (e.g. `db.query('SELECT * FROM users WHERE email = ?', [email])`).
- Raw user input is never concatenated directly into SQL command strings.

---

## 3. UI/UX Design System & Responsiveness

### 3.1 Uganda Christian University Aesthetic
- **Primary Color:** Royal Navy Blue (`#0B3B60`) representing academic dignity.
- **Accent Color:** Warm Gold (`#E09F3E`) representing Christian excellence.
- **Background Tones:** Clean White (`#FFFFFF`) and Slate Grey (`#F8FAFC`).
- **Typography:** Modern, legible sans-serif font stack (`Inter`, system UI).

### 3.2 Responsive Viewport Support
- **Mobile (< 768px):** Navigation drawer stacks vertically; dashboard cards scale to single-column layouts; data tables enable horizontal touch-scrolling.
- **Tablet (768px - 1024px):** Two-column card grids; responsive action buttons.
- **Desktop (> 1024px):** Fixed navigation sidebar; three- and four-column metric and group card grids.

### 3.3 Visual Feedback & State Indicators
- **Loading Spinners:** Smooth animated loaders during API roundtrips.
- **Dismissible Toast Notifications:** Green success, red error, and blue info toast alerts positioned at bottom-right.
- **Accessible Modals:** Dark backdrop overlay with keyboard and click-to-close dismiss functionality.

---

## 4. Error Handling & Edge Cases
- **Centralized Middleware (`errorHandler.js`):** Intercepts unhandled errors and returns standardized JSON responses: `{ success: false, message: '...' }`.
- **404 Route Fallback:** Captures invalid API URLs and renders friendly React 404 pages for unknown frontend routes.
- **Duplicate Prevention:** Enforced at both database unique key level (`uq_group_user`) and controller validation level.
