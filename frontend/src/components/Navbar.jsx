import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { Bell, User, LogOut, BookOpen, Shield, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {}
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (e) {}
  };

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            backgroundColor: '#0b3b60',
            color: '#e09f3e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0b3b60', display: 'block', lineHeight: 1.2 }}>
              UCU Study Groups
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Uganda Christian University</span>
          </div>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {isAuthenticated ? (
          <>
            {/* Notifications Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: 8,
                  borderRadius: '50%',
                  color: '#475569'
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 45,
                  width: 320,
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  zIndex: 50,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.75rem', cursor: 'pointer' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{
                          padding: '10px 16px',
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: n.is_read ? '#ffffff' : '#f0f9ff'
                        }}>
                          <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#0f172a' }}>{n.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 2 }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  padding: '6px 12px',
                  borderRadius: 20,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: '#0b3b60',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {user?.full_name ? user.full_name[0] : 'U'}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {user?.full_name?.split(' ')[0]}
                </span>
                {isAdmin && (
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>ADMIN</span>
                )}
                <ChevronDown size={14} color="#64748b" />
              </button>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 45,
                  width: 200,
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  zIndex: 50,
                  padding: '6px 0'
                }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b' }}>
                    Signed in as<br />
                    <strong style={{ color: '#0f172a', fontSize: '0.8rem' }}>{user?.email}</strong>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 16px',
                      color: '#0f172a',
                      fontSize: '0.875rem',
                      textDecoration: 'none'
                    }}
                  >
                    <User size={16} /> My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 16px',
                        color: '#0b3b60',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      <Shield size={16} /> Admin Portal
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 16px',
                      color: '#ef4444',
                      fontSize: '0.875rem',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
}
