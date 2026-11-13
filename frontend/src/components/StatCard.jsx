import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = '#0b3b60', subtext }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
          {value}
        </div>
        {subtext && (
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}
