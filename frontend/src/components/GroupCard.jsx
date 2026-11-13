import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function GroupCard({ group, onJoin, isJoining }) {
  const isJoined = group.is_member;

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      borderTop: '4px solid #0b3b60'
    }}>
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span className="badge badge-primary">{group.course_code}</span>
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: 12,
            backgroundColor: group.meeting_type === 'Online' ? '#e0f2fe' : group.meeting_type === 'Hybrid' ? '#fef3c7' : '#f1f5f9',
            color: group.meeting_type === 'Online' ? '#0369a1' : group.meeting_type === 'Hybrid' ? '#b45309' : '#334155',
            fontWeight: 600
          }}>
            {group.meeting_type}
          </span>
        </div>

        {/* Group Name & Course */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b3b60', marginBottom: 4 }}>
          {group.name}
        </h3>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: 10 }}>
          {group.course_name}
        </p>

        {/* Faculty */}
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 12 }}>
          {group.faculty}
        </div>

        {/* Description */}
        <p style={{
          fontSize: '0.85rem',
          color: '#334155',
          marginBottom: 16,
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {group.description}
        </p>
      </div>

      <div>
        {/* Metadata section */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: 12,
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={14} color="#0b3b60" />
            <span>Leader: <strong style={{ color: '#0f172a' }}>{group.leader_name}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={14} color="#e09f3e" />
            <span>{group.member_count || 1} / {group.max_members || 15} Members</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} color="#0284c7" />
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {group.meeting_location}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            to={`/groups/${group.id}`}
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
          >
            Details <ArrowRight size={14} />
          </Link>
          {isJoined ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#059669',
              backgroundColor: '#ecfdf5',
              borderRadius: 6
            }}>
              <CheckCircle2 size={14} /> Joined
            </span>
          ) : (
            <button
              onClick={() => onJoin(group.id)}
              disabled={isJoining}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              {isJoining ? 'Joining...' : 'Join Group'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
