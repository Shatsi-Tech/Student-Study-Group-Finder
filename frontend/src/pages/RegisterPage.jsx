import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';

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

export default function RegisterPage() {
  const { register } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    reg_number: '',
    email: '',
    password: '',
    confirm_password: '',
    programme: '',
    faculty: UCU_FACULTIES[0],
    year_of_study: 'Year 1'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.reg_number.trim()) newErrors.reg_number = 'Registration number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (!formData.programme.trim()) newErrors.programme = 'Programme of study is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showError('Please correct the validation errors in the form.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      showSuccess('Registration successful! Welcome to UCU Study Hub.');
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
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
      padding: '36px 20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 620,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 36,
        boxShadow: '0 10px 25px -5px rgba(11, 59, 96, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: '#0b3b60',
            color: '#e09f3e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px'
          }}>
            <GraduationCap size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b3b60' }}>
            Student Account Registration
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Uganda Christian University Study Group Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="full_name"
                placeholder="e.g. Brian Kigozi"
                value={formData.full_name}
                onChange={handleChange}
                className="form-control"
              />
              {errors.full_name && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.full_name}</span>}
            </div>

            {/* Registration Number */}
            <div className="form-group">
              <label className="form-label">Registration Number *</label>
              <input
                type="text"
                name="reg_number"
                placeholder="e.g. S22/B23/BSIT/014"
                value={formData.reg_number}
                onChange={handleChange}
                className="form-control"
              />
              {errors.reg_number && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.reg_number}</span>}
            </div>
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. kigozi.brian@ucu.ac.ug"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
            />
            {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.email}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
              />
              {errors.password && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirm_password"
                placeholder="Re-enter password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="form-control"
              />
              {errors.confirm_password && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.confirm_password}</span>}
            </div>
          </div>

          {/* Programme */}
          <div className="form-group">
            <label className="form-label">Programme of Study *</label>
            <input
              type="text"
              name="programme"
              placeholder="e.g. Bachelor of Science in Information Technology"
              value={formData.programme}
              onChange={handleChange}
              className="form-control"
            />
            {errors.programme && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.programme}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {/* Faculty */}
            <div className="form-group">
              <label className="form-label">Faculty / School *</label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                className="form-control"
              >
                {UCU_FACULTIES.map((fac) => (
                  <option key={fac} value={fac}>{fac}</option>
                ))}
              </select>
            </div>

            {/* Year of Study */}
            <div className="form-group">
              <label className="form-label">Year of Study *</label>
              <select
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
                className="form-control"
              >
                {STUDY_YEARS.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
            style={{ padding: '12px 16px', fontSize: '1rem', marginTop: 12 }}
          >
            {loading ? 'Registering Account...' : 'Create Student Account'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: '#0b3b60' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
