import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useNotification } from '../context/NotificationContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  BookOpen,
  Calendar,
  Layers,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  AlertTriangle,
  Award
} from 'lucide-react';

export default function AdminDashboard() {
  const { showSuccess, showError } = useNotification();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'groups'

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, groupsData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
        adminService.getAllGroups()
      ]);
      setStats(statsData.stats);
      setUsersList(usersData.users || []);
      setGroupsList(groupsData.groups || []);
    } catch (err) {
      showError('Failed to load administrator data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      const res = await adminService.toggleUserStatus(userId);
      showSuccess(res.message);
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, is_active: res.is_active } : u));
    } catch (err) {
      showError(err.response?.data?.message || 'Error updating user.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await adminService.deleteUser(userId);
      showSuccess('User account deleted.');
      setUsersList(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      showError(err.response?.data?.message || 'Error deleting user.');
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('⚠️ WARNING: This will remove all student accounts, groups, sessions, and posts, resetting the platform to a clean slate. Only the administrator account will remain. Are you sure?')) return;
    try {
      setLoading(true);
      const res = await adminService.resetDatabase();
      showSuccess(res.message);
      await loadAdminData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to reset database.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <LoadingSpinner text="Compiling university platform analytics..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Admin Header */}
      <div style={{
        backgroundColor: '#07263f',
        color: '#ffffff',
        padding: '24px 30px',
        borderRadius: 14,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e09f3e', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
            <ShieldCheck size={16} /> SYSTEM ADMINISTRATOR CONTROL CONSOLE
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Platform Oversight & Analytics</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: 4 }}>
            Uganda Christian University Study Group Finder Management
          </p>
        </div>

        <button
          onClick={handleResetDatabase}
          className="btn btn-outline"
          style={{ borderColor: '#ef4444', color: '#fca5a5', fontSize: '0.8rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Trash2 size={16} /> Reset Database (Clean Slate)
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 18
      }}>
        <StatCard
          title="Total Registered Students"
          value={stats.totalUsers}
          icon={Users}
          color="#0b3b60"
          subtext="Verified student accounts"
        />
        <StatCard
          title="Active Study Groups"
          value={stats.totalGroups}
          icon={BookOpen}
          color="#0284c7"
          subtext="Peer circles"
        />
        <StatCard
          title="Scheduled Sessions"
          value={stats.totalSessions}
          icon={Calendar}
          color="#e09f3e"
          subtext="Revision sprints"
        />
        <StatCard
          title="Discussions & Posts"
          value={stats.totalPosts}
          icon={Layers}
          color="#10b981"
          subtext="Academic interactions"
        />
      </div>

      {/* Sub-navigation Tabs */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '2px solid #e2e8f0', paddingBottom: 2 }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '3px solid #0b3b60' : '3px solid transparent',
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: activeTab === 'overview' ? '#0b3b60' : '#64748b',
            cursor: 'pointer'
          }}
        >
          Analytics & Activities
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'users' ? '3px solid #0b3b60' : '3px solid transparent',
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: activeTab === 'users' ? '#0b3b60' : '#64748b',
            cursor: 'pointer'
          }}
        >
          User Accounts ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'groups' ? '3px solid #0b3b60' : '3px solid transparent',
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: activeTab === 'groups' ? '#0b3b60' : '#64748b',
            cursor: 'pointer'
          }}
        >
          Study Groups ({groupsList.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ACTIVE COURSES */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
          {/* Most Active Courses */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b3b60', marginBottom: 16 }}>
              Most Active Courses
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.mostActiveCourses?.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0'
                }}>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                    {item.course}
                  </span>
                  <span className="badge badge-primary">
                    {item.count} Group{item.count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Distribution */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b3b60', marginBottom: 16 }}>
              Faculty Participation Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.facultyDistribution?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#334155' }}>{item.faculty}</span>
                  <strong style={{ color: '#0b3b60' }}>{item.count} Students</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT TABLE */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0b3b60', marginBottom: 16 }}>
            Registered Student & Staff Accounts
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '10px 12px' }}>Name</th>
                  <th style={{ padding: '10px 12px' }}>Reg Number</th>
                  <th style={{ padding: '10px 12px' }}>Email</th>
                  <th style={{ padding: '10px 12px' }}>Faculty</th>
                  <th style={{ padding: '10px 12px' }}>Role</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px' }}>Controls</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{u.full_name}</td>
                    <td style={{ padding: '12px', color: '#475569' }}>{u.reg_number}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{u.email}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{u.faculty}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={u.role === 'ADMIN' ? 'badge badge-gold' : 'badge badge-primary'}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className={u.is_active ? 'badge badge-success' : 'badge badge-danger'}>
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', display: 'flex', gap: 6 }}>
                      {u.role !== 'ADMIN' && (
                        <>
                          <button
                            onClick={() => handleToggleUser(u.id)}
                            className="btn btn-outline btn-sm"
                            title={u.is_active ? 'Deactivate Account' : 'Activate Account'}
                          >
                            {u.is_active ? <UserX size={14} color="#ef4444" /> : <UserCheck size={14} color="#10b981" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="btn btn-outline btn-sm"
                            style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GROUP MANAGEMENT TABLE */}
      {activeTab === 'groups' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0b3b60', marginBottom: 16 }}>
            All University Study Groups
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '10px 12px' }}>Group Name</th>
                  <th style={{ padding: '10px 12px' }}>Course Code</th>
                  <th style={{ padding: '10px 12px' }}>Faculty</th>
                  <th style={{ padding: '10px 12px' }}>Group Leader</th>
                  <th style={{ padding: '10px 12px' }}>Members</th>
                  <th style={{ padding: '10px 12px' }}>Format</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {groupsList.map((g) => (
                  <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#0b3b60' }}>{g.name}</td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{g.course_code}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{g.faculty}</td>
                    <td style={{ padding: '12px', color: '#334155' }}>{g.leader_name}</td>
                    <td style={{ padding: '12px' }}>{g.member_count} / {g.max_members}</td>
                    <td style={{ padding: '12px' }}>{g.meeting_type}</td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-success">{g.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
