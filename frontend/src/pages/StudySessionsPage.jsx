import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionService } from '../services/sessionService';
import SessionCard from '../components/SessionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, PlusCircle, Compass } from 'lucide-react';

export default function StudySessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getMyUpcomingSessions();
      setSessions(data.sessions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b3b60' }}>
            My Study Sessions
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Scheduled physical revisions and online meetings across all your joined study groups.
          </p>
        </div>
        <Link to="/explore" className="btn btn-primary btn-sm">
          <Compass size={16} /> Join More Groups
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving upcoming sessions..." />
      ) : sessions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <Calendar size={42} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0b3b60', marginBottom: 6 }}>
            No upcoming study sessions
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 18 }}>
            Group leaders schedule sessions within their respective study groups.
          </p>
          <Link to="/dashboard" className="btn btn-outline btn-sm">
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: 16
        }}>
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
