import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';
import ucuLogo from '../assets/ucu-logo.jpg';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#07263f',
      backgroundImage: 'radial-gradient(circle at 50% 30%, #0b3b60 0%, #07263f 100%)',
      padding: '24px 16px',
      color: '#ffffff'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: '36px 28px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        textAlign: 'center',
        border: '1px solid rgba(224, 159, 62, 0.3)'
      }}>
        {/* Uganda Christian University Official Logo */}
        <div style={{ marginBottom: 20 }}>
          <img
            src={ucuLogo}
            alt="Uganda Christian University Crest"
            style={{
              width: 140,
              height: 'auto',
              maxHeight: 160,
              objectFit: 'contain',
              margin: '0 auto',
              display: 'block',
              filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.15))'
            }}
          />
        </div>

        {/* University & Portal Title */}
        <h1 style={{
          fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
          fontWeight: 800,
          color: '#0b3b60',
          lineHeight: 1.25,
          marginBottom: 6
        }}>
          Uganda Christian University
        </h1>
        <h2 style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: '#e09f3e',
          marginBottom: 8
        }}>
          Student Study Group Finder
        </h2>
        <p style={{
          fontSize: '0.85rem',
          color: '#64748b',
          marginBottom: 28,
          lineHeight: 1.4
        }}>
          Mukono Main Campus • Academic Collaboration Portal
        </p>

        {/* Action Buttons: Login and Register Only */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="btn btn-accent btn-lg btn-block"
              style={{
                fontSize: '1rem',
                padding: '13px 20px',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(224, 159, 62, 0.35)'
              }}
            >
              Continue to Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-primary btn-lg btn-block"
                style={{
                  fontSize: '1rem',
                  padding: '13px 20px',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(11, 59, 96, 0.25)'
                }}
              >
                <LogIn size={18} /> Sign In to Portal
              </Link>

              <Link
                to="/register"
                className="btn btn-accent btn-lg btn-block"
                style={{
                  fontSize: '1rem',
                  padding: '13px 20px',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(224, 159, 62, 0.25)'
                }}
              >
                <UserPlus size={18} /> Register Student Account
              </Link>
            </>
          )}
        </div>

        {/* University Motto / Footer Note */}
        <div style={{
          marginTop: 26,
          paddingTop: 16,
          borderTop: '1px solid #f1f5f9',
          fontSize: '0.75rem',
          color: '#94a3b8'
        }}>
          <em>"A Centre of Excellence in the Heart of Africa"</em>
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
        © {new Date().getFullYear()} Uganda Christian University. All rights reserved.
      </div>
    </div>
  );
}
