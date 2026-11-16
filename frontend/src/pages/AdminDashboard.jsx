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
  Award,
  CheckCircle,
  XCircle,
  Clock,
  MapPin
} from 'lucide-react';

export default function AdminDashboard() {
  const { showSuccess, showError } = useNotification();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'groups', 'sessions', 'users'

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

  const handleUpdateGroupStatus = async (groupId, status) => {
    try {
      const res = await adminService.updateGroupStatus(groupId, status);
      showSuccess(res.message);
      setGroupsList(prev => prev.map(g => g.id === groupId ? { ...g, status } : g));
      // Refresh stats
      const statsData = await adminService.getStats();
      setStats(statsData.stats);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update study group status.');
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('⚠️ WARNING: This will remove all student accounts, groups, sessions, and posts, resetting the platform to a clean slate. Only your administrator account will remain. Are you sure?')) return;
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
        padding: '20px',
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
          <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: 800 }}>Platform Oversight & Analytics</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: 4 }}>
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
      <div className="grid-stats">
        <StatCard
          title="Total Registered Students"
          value={stats.totalUsers}
          icon={Users}
          color="#0b3b60"
          subtext="Student accounts"
        />
        <StatCard
          title="Active Study Groups"
          value={stats.activeGroups || 0}
          icon={BookOpen}
          color="#0284c7"
          subtext={`${stats.pendingGroups || 0} pending review`}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingGroups || 0}
          icon={AlertTriangle}
          color="#e09f3e"
          subtext="Groups awaiting admin action"
        />
        <StatCard
          title="Scheduled Sessions"
          value={stats.totalSessions}
          icon={Calendar}
          color="#10b981"
          subtext={`${stats.upcomingSessions || 0} upcoming`}
        />
      </div>

      {/* Sub-navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '2px solid #e2e8f0', paddingBottom: 2, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '3px solid #0b3b60' : '3px solid transparent',
            padding: '10px 14px',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: activeTab === 'overview' ? '#0b3b60' : '#64748b',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Overview & Sessions
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'groups' ? '3px solid #0b3b60' : '3px solid transparent',
            padding: '10px 14px',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: activeTab === 'groups' ? '#0b3b60' : '#64748b',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Study Groups Approval ({groupsList.length})
          {(stats.pendingGroups || 0) > 0 && (
            <span style={{ marginLeft: 6, backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800 }}>
              {stats.pendingGroups} Pending
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'users' ? '3px solid #0b3b60' : '3px solid transparent',
            padding: '10px 14px',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: activeTab === 'users' ? '#0b3b60' : '#64748b',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          User Accounts ({usersList.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & SESSIONS SIDE */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Upcoming Sessions Widget */}
          <div className="card" style={{ padding: 24, borderTop: '4px solid #0284c7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0b3b60' }}>
                  Upcoming Study Sessions Across All Groups
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  Automatically monitored sessions created with groups or scheduled by leaders.
                </p>
              </div>
              <span className="badge badge-primary">
                {stats.upcomingSessionsList?.length || 0} Scheduled
              </span>
            </div>

            {(!stats.upcomingSessionsList || stats.upcomingSessionsList.length === 0) ? (
              <div style={{ padding: 28, textAlign: 'center', color: '#94a3b8' }}>
                <Calendar size={36} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: '0.9rem' }}>No study sessions scheduled yet. When students create study groups, sessions will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 14 }}>
                {stats.upcomingSessionsList.map((s) => (
                  <div key={s.id} style={{
                    padding: 16,
                    backgroundColor: '#f8fafc',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 10
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{s.course_code || 'SESSION'}</span>
                        <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 700, backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: 8 }}>
                          {s.status}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0b3b60', marginBottom: 4 }}>
                        {s.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                        Group: {s.group_name}
                      </p>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: 4, borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={13} color="#0284c7" />
                        <span>Date: <strong>{s.study_date}</strong> ({s.start_time} - {s.end_time})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={13} color="#e09f3e" />
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          Location: {s.location_or_link}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Analytics Sub-grid: Active Courses & Faculty Distribution */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
            {/* Most Active Courses */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b3b60', marginBottom: 16 }}>
                Most Active Courses
              </h3>
              {(!stats.mostActiveCourses || stats.mostActiveCourses.length === 0) ? (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No course groups active yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {stats.mostActiveCourses.map((item, idx) => (
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
              )}
            </div>

            {/* Faculty Distribution */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b3b60', marginBottom: 16 }}>
                Faculty Participation Breakdown
              </h3>
              {(!stats.facultyDistribution || stats.facultyDistribution.length === 0) ? (
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No student distributions recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {stats.facultyDistribution.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#334155' }}>{item.faculty}</span>
                      <strong style={{ color: '#0b3b60' }}>{item.count} Student{item.count !== 1 ? 's' : ''}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDY GROUPS TABLE WITH APPROVE / REJECT CONTROLS */}
      {activeTab === 'groups' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0b3b60' }}>
                Study Groups Approval & Moderation
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                Review, accept, approve, or reject student study groups.
              </p>
            </div>
          </div>

          {groupsList.length === 0 ? (
            <div style={{ padding: 36, textAlign: 'center', color: '#94a3b8' }}>
              <BookOpen size={40} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
              <p>No study groups submitted yet. When students create groups, they will appear here for your approval.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table style={{ width: '100%', minWidth: 620, borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '10px 12px' }}>Group Name</th>
                    <th style={{ padding: '10px 12px' }}>Course</th>
                    <th style={{ padding: '10px 12px' }}>Leader</th>
                    <th style={{ padding: '10px 12px' }}>Meeting</th>
                    <th style={{ padding: '10px 12px' }}>Current Status</th>
                    <th style={{ padding: '10px 12px' }}>Admin Action</th>
                  </tr>
                </thead>
                <tbody>
                  {groupsList.map((g) => (
                    <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#0b3b60' }}>{g.name}</td>
                      <td style={{ padding: '12px' }}>
                        <span className="badge badge-primary">{g.course_code}</span>
                      </td>
                      <td style={{ padding: '12px', color: '#334155' }}>{g.leader_name}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{g.meeting_location} ({g.meeting_type})</td>
                      <td style={{ padding: '12px' }}>
                        {g.status === 'Active' && (
                          <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: 12, fontWeight: 700, fontSize: '0.75rem' }}>
                            ✓ Active / Approved
                          </span>
                        )}
                        {g.status === 'Pending' && (
                          <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: 12, fontWeight: 700, fontSize: '0.75rem', border: '1px solid #fde68a' }}>
                            ⏳ Pending Approval
                          </span>
                        )}
                        {g.status === 'Rejected' && (
                          <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: 12, fontWeight: 700, fontSize: '0.75rem' }}>
                            ✗ Rejected
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {g.status !== 'Active' && (
                            <button
                              onClick={() => handleUpdateGroupStatus(g.id, 'Active')}
                              className="btn btn-primary btn-sm"
                              style={{ backgroundColor: '#10b981', borderColor: '#10b981', padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
                              title="Accept and approve this study group"
                            >
                              <CheckCircle size={13} /> Approve
                            </button>
                          )}
                          {g.status !== 'Rejected' && (
                            <button
                              onClick={() => handleUpdateGroupStatus(g.id, 'Rejected')}
                              className="btn btn-outline btn-sm"
                              style={{ borderColor: '#ef4444', color: '#ef4444', padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
                              title="Reject this study group"
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT TABLE */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0b3b60', marginBottom: 16 }}>
            Registered Student & Staff Accounts
          </h3>
          <div className="table-responsive">
            <table style={{ width: '100%', minWidth: 620, borderCollapse: 'collapse', fontSize: '0.85rem' }}>
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
    </div>
  );
}
    </div>
  );
}
