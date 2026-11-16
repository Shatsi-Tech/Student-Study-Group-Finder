import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  PlusCircle,
  Calendar,
  User,
  ShieldCheck
} from 'lucide-react';

export default function MobileBottomNav() {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Create', path: '/create-group', icon: PlusCircle, isHighlight: true },
    { name: 'Sessions', path: '/sessions', icon: Calendar },
    isAdmin 
      ? { name: 'Admin', path: '/admin', icon: ShieldCheck }
      : { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `mobile-nav-item ${isActive ? 'active' : ''} ${item.isHighlight ? 'highlight' : ''}`
            }
          >
            {item.isHighlight ? (
              <div className="mobile-nav-highlight-btn">
                <Icon size={20} color="#ffffff" />
              </div>
            ) : (
              <Icon size={20} className="mobile-nav-icon" />
            )}
            <span className="mobile-nav-label">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
