import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Eye, EyeOff, Lock, Mail, GraduationCap, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import ucuLogo from '../assets/ucu-logo.jpg';

export default function LoginPage() {
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      showError('Please enter both identifier and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(identifier, password);
      showSuccess(`Welcome back, ${data.user.full_name}!`);
      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (role) => {
    if (role === 'admin') {
      setIdentifier('shatsikarongo55@mail.com');
      setPassword('Shatsi@1234');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f1f5f9',
      padding: 24
    }}>
      <div style={{
        width: '100%',
        maxWidth: 440,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 32,
        boxShadow: '0 10px 25px -5px rgba(11, 59, 96, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img
            src={ucuLogo}
            alt="Uganda Christian University Crest"
            style={{
              width: 76,
              height: 'auto',
              margin: '0 auto 12px',
              display: 'block'
            }}
          />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b3b60' }}>
            Student Study Group Finder
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>
            Uganda Christian University Portal Login
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Registration Number</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="e.g. kigozi.brian@ucu.ac.ug or S22/B23/BSIT/014"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="form-control"
                style={{ paddingLeft: 38 }}
                required
              />
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 13 }} />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingLeft: 38, paddingRight: 38 }}
                required
              />
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 13 }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 11,
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember" style={{ fontSize: '0.8rem', color: '#64748b', cursor: 'pointer' }}>
              Remember this device
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
            style={{ padding: '12px 16px', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Admin Credential */}
        <div style={{
          marginTop: 24,
          padding: 14,
          backgroundColor: '#f8fafc',
          borderRadius: 8,
          border: '1px dashed #cbd5e1'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0b3b60', marginBottom: 8, textAlign: 'center' }}>
            SYSTEM ADMINISTRATOR ACCESS:
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '6px 16px', color: '#0b3b60', fontWeight: 700 }}
            >
              Fill Administrator (shatsikarongo55@mail.com)
            </button>
          </div>
        </div>

        {/* Register Footer Link */}
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: '#0b3b60' }}>
            Register as Student
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{ backgroundColor: '#ffffff', padding: 24, borderRadius: 10, maxWidth: 380, width: '90%' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b3b60', marginBottom: 8 }}>Password Reset</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 14 }}>
              Enter your student university email address to receive password reset instructions.
            </p>
            <input
              type="email"
              placeholder="e.g. s22b23@ucu.ac.ug"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="form-control"
              style={{ marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForgotModal(false)} className="btn btn-outline btn-sm">Cancel</button>
              <button
                onClick={() => {
                  showSuccess('Password reset link sent to your university inbox.');
                  setShowForgotModal(false);
                }}
                className="btn btn-primary btn-sm"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
