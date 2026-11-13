import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { User, Mail, GraduationCap, BookOpen, Shield, Save } from 'lucide-react';

const UCU_FACULTIES = [
  'Faculty of Science & Technology',
  'Faculty of Law',
  'School of Business',
  'Faculty of Social Sciences',
  'Faculty of Education & Arts',
  'Faculty of Public Health Nursing and Midwifery',
  'Bishop Tucker School of Divinity and Theology'
];

const STUDY_YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Postgraduate'];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    programme: user?.programme || '',
    faculty: user?.faculty || UCU_FACULTIES[0],
    year_of_study: user?.year_of_study || 'Year 1',
    bio: user?.bio || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b3b60' }}>
          Student Profile
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          View and maintain your academic identity and study details.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="card" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: '#0b3b60',
          color: '#e09f3e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          fontWeight: 700,
          flexShrink: 0
        }}>
          {user?.full_name ? user.full_name[0] : 'S'}
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0b3b60' }}>
            {user?.full_name}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 6, fontSize: '0.85rem', color: '#64748b' }}>
            <span><strong>Reg:</strong> {user?.reg_number}</span>
            <span>•</span>
            <span><strong>Email:</strong> {user?.email}</span>
            <span>•</span>
            <span className="badge badge-gold">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card" style={{ padding: 32 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b3b60', marginBottom: 20 }}>
          Edit Academic Information
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Registration Number (Institutional)</label>
              <input
                type="text"
                value={user?.reg_number}
                className="form-control"
                disabled
                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address (Institutional)</label>
              <input
                type="email"
                value={user?.email}
                className="form-control"
                disabled
                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Programme of Study</label>
            <input
              type="text"
              value={formData.programme}
              onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Faculty / School</label>
              <select
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                className="form-control"
              >
                {UCU_FACULTIES.map(fac => (
                  <option key={fac} value={fac}>{fac}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <select
                value={formData.year_of_study}
                onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
                className="form-control"
              >
                {STUDY_YEARS.map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Academic Bio & Study Interests</label>
            <textarea
              rows={3}
              placeholder="Tell other students about your technical passions, study strengths..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="form-control"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '10px 24px', marginTop: 12 }}
          >
            <Save size={16} /> {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
