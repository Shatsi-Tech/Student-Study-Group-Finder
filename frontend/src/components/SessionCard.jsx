import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';

export default function SessionCard({ session }) {
  const isOnline = session.location_or_link.startsWith('http');

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: 6 }}>
            {session.course_code || 'STUDY SESSION'}
          </span>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0b3b60', marginTop: 4 }}>
            {session.title}
          </h4>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {session.group_name}
          </span>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '4px 8px',
          borderRadius: 6,
          backgroundColor: session.status === 'UPCOMING' ? '#e0f2fe' : session.status === 'COMPLETED' ? '#ecfdf5' : '#fef2f2',
          color: session.status === 'UPCOMING' ? '#0369a1' : session.status === 'COMPLETED' ? '#047857' : '#b91c1c'
        }}>
          {session.status}
        </span>
      </div>

      {session.description && (
        <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.4 }}>
          {session.description}
        </p>
      )}

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        paddingTop: 10,
        borderTop: '1px solid #f1f5f9',
        fontSize: '0.8rem',
        color: '#475569'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={15} color="#e09f3e" />
          <span>{formatDate(session.study_date)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={15} color="#0b3b60" />
          <span>{session.start_time} - {session.end_time}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={15} color="#0284c7" />
          {isOnline ? (
            <a href={session.location_or_link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#0284c7', fontWeight: 600 }}>
              Join Meeting Link <ExternalLink size={12} />
            </a>
          ) : (
            <span>{session.location_or_link}</span>
          )}
        </div>
      </div>
    </div>
  );
}
