import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { groupService } from '../services/groupService';
import { sessionService } from '../services/sessionService';
import StatCard from '../components/StatCard';
import GroupCard from '../components/GroupCard';
import SessionCard from '../components/SessionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  Calendar,
  Compass,
  PlusCircle,
  BookOpen,
  ArrowRight,
  Megaphone,
  Sparkles
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [myGroups, setMyGroups] = useState([]);
  const [recommendedGroups, setRecommendedGroups] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch user's joined groups
      const myGroupsData = await groupService.getGroups({ my_groups: 'true' });
      setMyGroups(myGroupsData.groups || []);

      // Fetch all groups to recommend those in same faculty/programme not joined
      const allGroupsData = await groupService.getGroups();
      const unjoined = (allGroupsData.groups || []).filter(g => !g.is_member);
      setRecommendedGroups(unjoined.slice(0, 3));

      // Fetch user's upcoming sessions
      const sessionsData = await sessionService.getMyUpcomingSessions();
      setUpcomingSessions(sessionsData.sessions || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await groupService.joinGroup(groupId);
      showSuccess('Joined study group successfully!');
      loadDashboardData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to join group.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your academic dashboard..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0b3b60 0%, #07263f 100%)',
        color: '#ffffff',
        borderRadius: 14,
        padding: '22px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 10px 20px rgba(11, 59, 96, 0.15)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f6d89b', fontSize: '0.825rem', fontWeight: 600, marginBottom: 6 }}>
            <Sparkles size={16} color="#e09f3e" />
            Uganda Christian University • {user?.faculty || 'Academic Portal'}
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 800, lineHeight: 1.2 }}>
            Welcome back, {user?.full_name}!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: 6, maxWidth: 540 }}>
            {user?.programme} • {user?.year_of_study} ({user?.reg_number})
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/explore" className="btn btn-accent" style={{ padding: '8px 16px' }}>
            <Compass size={16} /> Explore Groups
          </Link>
          <Link to="/create-group" className="btn btn-outline" style={{ color: '#ffffff', borderColor: '#ffffff', padding: '8px 16px' }}>
            <PlusCircle size={16} /> Create Group
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-stats">
        <StatCard
          title="Groups Joined"
          value={myGroups.length}
          icon={Users}
          color="#0b3b60"
          subtext="Active study circles"
        />
        <StatCard
          title="Upcoming Sessions"
          value={upcomingSessions.length}
          icon={Calendar}
          color="#e09f3e"
          subtext="Scheduled revisions"
        />
        <StatCard
          title="Groups Led"
          value={myGroups.filter(g => g.user_role === 'LEADER' || g.leader_id === user?.id).length}
          icon={BookOpen}
          color="#0284c7"
          subtext="Leader privileges"
        />
      </div>

      {/* Main Grid: My Groups & Upcoming Sessions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 24
      }}>
        {/* Left Column: My Groups */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0b3b60' }}>
              My Study Groups ({myGroups.length})
            </h2>
            <Link to="/explore" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Browse more
            </Link>
          </div>

          {myGroups.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 36 }}>
              <Users size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0b3b60', marginBottom: 6 }}>
                You haven't joined any groups yet
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 18 }}>
                Explore groups matching your UCU course units or start your own study group.
              </p>
              <Link to="/explore" className="btn btn-primary btn-sm">
                Discover Study Groups
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {myGroups.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onJoin={handleJoinGroup}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Sessions & Announcements */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0b3b60' }}>
              Upcoming Revision Sessions
            </h2>
            <Link to="/sessions" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Full calendar
            </Link>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 36 }}>
              <Calendar size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0b3b60', marginBottom: 6 }}>
                No scheduled sessions right now
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                When group leaders schedule revision sprints, they will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {upcomingSessions.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                />
              ))}
            </div>
          )}

          {/* Recommended Groups Box */}
          {recommendedGroups.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b3b60' }}>
                  Recommended For You
                </h3>
                <span className="badge badge-gold">NEW SUGGESTIONS</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recommendedGroups.map(group => (
                  <div key={group.id} className="card" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{group.course_code}</span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0b3b60', marginTop: 4 }}>{group.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{group.meeting_location}</span>
                    </div>
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      className="btn btn-outline btn-sm"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
