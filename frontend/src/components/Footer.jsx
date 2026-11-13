import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#07263f',
      color: '#94a3b8',
      padding: '30px 24px',
      borderTop: '1px solid #1e293b',
      fontSize: '0.85rem'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16
      }}>
        <div>
          <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>Uganda Christian University (UCU)</strong>
          <p style={{ marginTop: 4 }}>Student Study Group Finder - Web & Mobile Application Development Project</p>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <span>Mukono Main Campus</span>
          <span>•</span>
          <span>Faculty of Science & Technology</span>
          <span>•</span>
          <span>Academic Year 2024/2025</span>
        </div>
      </div>
    </footer>
  );
}
