import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      gap: 12
    }}>
      <div style={{
        width: 36,
        height: 36,
        border: '3px solid #e2e8f0',
        borderTopColor: '#0b3b60',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{text}</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
