import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 24
    }}>
      <BookOpen size={48} color="#0b3b60" style={{ marginBottom: 16 }} />
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0b3b60', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#334155', marginTop: 10 }}>Page Not Found</h2>
      <p style={{ color: '#64748b', maxWidth: 420, marginTop: 8, marginBottom: 24 }}>
        The study group or resource you are looking for does not exist or may have been moved.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        <ArrowLeft size={16} /> Return to Dashboard
      </Link>
    </div>
  );
}
