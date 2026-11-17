import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { notificationService } from '../services/notificationService';
import {
  Bell,
  User,
  LogOut,
  BookOpen,
  Shield,
  ChevronDown,
  Menu,
  CheckCircle,
  Clock,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function Navbar({ onToggleMobileMenu }) {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { showInfo } = useNotification();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isRinging, setIsRinging] = useState(false);

  const prevUnreadCountRef = useRef(0);
  const dropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifs(false);
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time live polling for notifications every 5 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    loadNotifications(false);

    const interval = setInterval(() => {
      loadNotifications(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const loadNotifications = async (isBackgroundPoll = false) => {
    try {
      const data = await notificationService.getNotifications();
      const newItems = data.notifications || [];
      const newUnread = data.unreadCount || 0;

      // Detect new incoming notifications during active session
      if (isBackgroundPoll && newUnread > prevUnreadCountRef.current) {
        setIsRinging(true);
        setTimeout(() => setIsRinging(false), 2000);

        // Notify user with toast
        const latest = newItems.find(n => !n.is_read);
        if (latest) {
          showInfo(`🔔 ${latest.title}: ${latest.message}`);
        }
      }

      prevUnreadCountRef.current = newUnread;
      setNotifications(newItems);
      setUnreadCount(newUnread);
    } catch (e) {
      // Background poll silently fails on network jitter
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.is_read) {
        await notificationService.markAsRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: 1 } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        prevUnreadCountRef.current = Math.max(0, prevUnreadCountRef.current - 1);
      }
      setShowNotifs(false);
      if (notif.link) {
        navigate(notif.link);
      }
    } catch (e) {
      if (notif.link) navigate(notif.link);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      prevUnreadCountRef.current = 0;
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (e) {}
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const diffSecs = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSecs < 45) return 'Just now';
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return `${Math.floor(diffSecs / 86400)}d ago`;
    } catch (e) {
      return '';
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'SESSION':
        return { bg: '#e0f2fe', color: '#0369a1', label: 'Session' };
      case 'GROUP':
      case 'GROUP_CREATED':
        return { bg: '#fef3c7', color: '#b45309', label: 'Group' };
      case 'ADMIN':
        return { bg: '#f3e8ff', color: '#7e22ce', label: 'Admin' };
      case 'POST':
      case 'COMMENT':
        return { bg: '#ecfdf5', color: '#047857', label: 'Discussion' };
      case 'ANNOUNCEMENT':
        return { bg: '#fce7f3', color: '#be185d', label: 'Broadcast' };
      default:
        return { bg: '#f1f5f9', color: '#475569', label: 'System' };
    }
  };

  return (
    <header className="top-navbar" ref={dropdownRef}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Mobile Hamburger Drawer Toggle */}
        {isAuthenticated && onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="navbar-mobile-toggle"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
        )}

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: '#0b3b60',
            color: '#e09f3e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            <BookOpen size={20} />
          </div>
          <div>
            <span className="navbar-brand-title">
              UCU Study Groups
            </span>
            <span className="navbar-brand-sub">Uganda Christian University</span>
          </div>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isAuthenticated ? (
          <>
            {/* Real-time Interactive Notifications Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowNotifs(!showNotifs);
                  if (showProfileMenu) setShowProfileMenu(false);
                }}
                className={`notification-bell-btn ${isRinging ? 'ringing' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: 8,
                  borderRadius: '50%',
                  color: unreadCount > 0 ? '#0b3b60' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s ease, background-color 0.15s ease'
                }}
                aria-label={`Notifications (${unreadCount} unread)`}
                title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
              >
                <Bell size={21} />
                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Container */}
              {showNotifs && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 45,
                  width: 'min(360px, calc(100vw - 28px))',
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  zIndex: 100,
                  overflow: 'hidden',
                  animation: 'fadeIn 0.15s ease-out'
                }}>
                  {/* Dropdown Header */}
                  <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f8fafc'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0b3b60' }}>
                        System Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span style={{
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 10
                        }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0284c7',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <CheckCircle size={13} /> Mark all read
                      </button>
                    )}
                  </div>

                  {/* Dropdown Notifications List */}
                  <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '36px 20px', textAlign: 'center', color: '#94a3b8' }}>
                        <Bell size={32} color="#cbd5e1" style={{ margin: '0 auto 10px', display: 'block' }} />
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>
                          No notifications yet
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
                          You will be notified whenever study groups, sessions, or discussions are created.
                        </div>
                      </div>
                    ) : (
                      notifications.map(n => {
                        const badge = getTypeBadge(n.type);
                        return (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid #f1f5f9',
                              backgroundColor: n.is_read ? '#ffffff' : '#f0f9ff',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                              display: 'flex',
                              gap: 10,
                              alignItems: 'flex-start'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = n.is_read ? '#f8fafc' : '#e0f2fe'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = n.is_read ? '#ffffff' : '#f0f9ff'}
                          >
                            {/* Unread Indicator Dot */}
                            <div style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: n.is_read ? 'transparent' : '#0284c7',
                              marginTop: 6,
                              flexShrink: 0
                            }} />

                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                                <span style={{
                                  fontSize: '0.68rem',
                                  padding: '1px 6px',
                                  borderRadius: 8,
                                  backgroundColor: badge.bg,
                                  color: badge.color,
                                  fontWeight: 700
                                }}>
                                  {badge.label}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <Clock size={11} /> {formatTime(n.created_at)}
                                </span>
                              </div>

                              <div style={{
                                fontWeight: n.is_read ? 600 : 700,
                                fontSize: '0.825rem',
                                color: '#0f172a',
                                lineHeight: 1.3
                              }}>
                                {n.title}
                              </div>

                              <div style={{
                                fontSize: '0.75rem',
                                color: '#475569',
                                marginTop: 3,
                                lineHeight: 1.35
                              }}>
                                {n.message}
                              </div>

                              {n.link && (
                                <div style={{
                                  fontSize: '0.7rem',
                                  color: '#0284c7',
                                  marginTop: 4,
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 3
                                }}>
                                  View details <ExternalLink size={10} />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  if (showNotifs) setShowNotifs(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  padding: '5px 10px',
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
                  fontWeight: 600,
                  flexShrink: 0
                }}>
                  {user?.full_name ? user.full_name[0] : 'U'}
                </div>
                <span className="navbar-user-name" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
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
                  width: 'min(210px, calc(100vw - 32px))',
                  backgroundColor: '#ffffff',
                  borderRadius: 10,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                  border: '1px solid #e2e8f0',
                  zIndex: 60,
                  padding: '6px 0',
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b', backgroundColor: '#f8fafc' }}>
                    Signed in as<br />
                    <strong style={{ color: '#0f172a', fontSize: '0.8rem', wordBreak: 'break-all' }}>{user?.email}</strong>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 14px',
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
                        padding: '10px 14px',
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
                      padding: '10px 14px',
                      color: '#ef4444',
                      fontSize: '0.875rem',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderTop: '1px solid #f1f5f9'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
}
