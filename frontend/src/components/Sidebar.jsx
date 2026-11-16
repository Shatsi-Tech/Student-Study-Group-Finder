import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  PlusCircle,
  Calendar,
  User,
  ShieldAlert,
  LogOut,
  GraduationCap,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore Groups', path: '/explore', icon: Compass },
    { name: 'Create Group', path: '/create-group', icon: PlusCircle },
    { name: 'Study Sessions', path: '/sessions', icon: Calendar },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Dashboard', path: '/admin', icon: ShieldAlert });
  }

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {/* Brand Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: '#e09f3e',
            color: '#07263f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>UCU Study Hub</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Mukono Main Campus</div>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="sidebar-close-btn"
          aria-label="Close navigation menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', padding: '0 12px 8px', letterSpacing: '0.05em' }}>
          MAIN MENU
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 8,
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive ? '#ffffff' : '#cbd5e1',
                backgroundColor: isActive ? 'rgba(224, 159, 62, 0.2)' : 'transparent',
                borderLeft: isActive ? '3px solid #e09f3e' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s'
              })}
            >
              <Icon size={18} color="#e09f3e" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div style={{
        padding: '16px 18px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: '#0b3b60',
              border: '2px solid #e09f3e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.85rem',
              flexShrink: 0
            }}>
              {user?.full_name ? user.full_name[0] : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.825rem',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
                {user?.full_name}
              </div>
              <div style={{
                color: '#94a3b8',
                fontSize: '0.7rem',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
                {user?.reg_number || (isAdmin ? 'SYSTEM ADMIN' : '')}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
