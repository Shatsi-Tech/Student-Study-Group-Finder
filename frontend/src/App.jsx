import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout & Route Guards
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import ExploreGroupsPage from './pages/ExploreGroupsPage';
import CreateGroupPage from './pages/CreateGroupPage';
import GroupDetailsPage from './pages/GroupDetailsPage';
import StudySessionsPage from './pages/StudySessionsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  // On GitHub Pages the app is served under /Student-Study-Group-Finder/
  const basename = import.meta.env.PROD ? '/Student-Study-Group-Finder' : '/';

  return (
    <Router basename={basename}>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Student Portal Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/explore" element={<ExploreGroupsPage />} />
              <Route path="/groups" element={<Navigate to="/explore" replace />} />
              <Route path="/create-group" element={<CreateGroupPage />} />
              <Route path="/groups/:id" element={<GroupDetailsPage />} />
              <Route path="/group/:id" element={<GroupDetailsPage />} />
              <Route path="/sessions" element={<StudySessionsPage />} />
              <Route path="/study-sessions" element={<Navigate to="/sessions" replace />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Route>

            {/* Friendly aliases */}
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}
