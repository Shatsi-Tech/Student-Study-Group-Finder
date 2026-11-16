import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { useNotification } from '../context/NotificationContext';
import { PlusCircle, ShieldCheck, MapPin, Users } from 'lucide-react';

const UCU_FACULTIES = [
  'Faculty of Science & Technology',
  'Faculty of Law',
  'School of Business',
  'Faculty of Social Sciences',
  'Faculty of Education & Arts',
  'Faculty of Public Health Nursing and Midwifery',
  'Bishop Tucker School of Divinity and Theology'
];

export default function CreateGroupPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    course_name: '',
    course_code: '',
    faculty: UCU_FACULTIES[0],
    description: '',
    meeting_location: '',
    meeting_type: 'Physical',
    max_members: 15
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Group name is required';
    if (!formData.course_name.trim()) newErrors.course_name = 'Course name is required';
    if (!formData.course_code.trim()) newErrors.course_code = 'Course code is required';
    if (!formData.description.trim()) newErrors.description = 'Study description is required';
    if (!formData.meeting_location.trim()) newErrors.meeting_location = 'Meeting location or platform link is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const result = await groupService.createGroup(formData);
      showSuccess('Study group created successfully! You are the Group Leader.');
      navigate(`/groups/${result.groupId}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create study group.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <div className="card" style={{ padding: '24px 20px' }}>
        <div style={{ marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#0b3b60', marginBottom: 4 }}>
            <PlusCircle size={22} />
            <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', fontWeight: 800 }}>Create a Study Group</h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Initiate a collaborative learning group for your course. As the creator, you will automatically be designated as the <strong>Group Leader</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Group Name */}
          <div className="form-group">
            <label className="form-label">Study Group Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Web & Mobile Dev Revision Circle"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
            />
            {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.name}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {/* Course Code */}
            <div className="form-group">
              <label className="form-label">Course Code *</label>
              <input
                type="text"
                name="course_code"
                placeholder="e.g. BIT3104"
                value={formData.course_code}
                onChange={handleChange}
                className="form-control"
              />
              {errors.course_code && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.course_code}</span>}
            </div>

            {/* Course Name */}
            <div className="form-group">
              <label className="form-label">Course Name *</label>
              <input
                type="text"
                name="course_name"
                placeholder="e.g. Web and Mobile Application Development"
                value={formData.course_name}
                onChange={handleChange}
                className="form-control"
              />
              {errors.course_name && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.course_name}</span>}
            </div>
          </div>

          {/* Faculty */}
          <div className="form-group">
            <label className="form-label">Faculty / School *</label>
            <select
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              className="form-control"
            >
              {UCU_FACULTIES.map(fac => (
                <option key={fac} value={fac}>{fac}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Group Description & Study Objectives *</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe the topics you will cover, expectations, study pace, and guidelines for members..."
              value={formData.description}
              onChange={handleChange}
              className="form-control"
            />
            {errors.description && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.description}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {/* Meeting Type */}
            <div className="form-group">
              <label className="form-label">Meeting Format *</label>
              <select
                name="meeting_type"
                value={formData.meeting_type}
                onChange={handleChange}
                className="form-control"
              >
                <option value="Physical">Physical (On-Campus)</option>
                <option value="Online">Online (Google Meet / Zoom)</option>
                <option value="Hybrid">Hybrid (Physical & Online)</option>
              </select>
            </div>

            {/* Max Members */}
            <div className="form-group">
              <label className="form-label">Maximum Member Capacity</label>
              <input
                type="number"
                name="max_members"
                min="3"
                max="50"
                value={formData.max_members}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          {/* Meeting Location */}
          <div className="form-group">
            <label className="form-label">Default Meeting Location or Meeting Link *</label>
            <input
              type="text"
              name="meeting_location"
              placeholder="e.g. Hamu Mukasa Library Room 2 or https://meet.google.com/xyz"
              value={formData.meeting_location}
              onChange={handleChange}
              className="form-control"
            />
            {errors.meeting_location && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.meeting_location}</span>}
          </div>

          {/* Leader Notice Banner */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 8,
            padding: 14,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: '0.85rem',
            color: '#1e40af'
          }}>
            <ShieldCheck size={22} style={{ flexShrink: 0 }} />
            <span>
              By creating this group, you agree to fulfill the role of <strong>Group Leader</strong>, including scheduling study sessions, moderating discussions, and coordinating course peer learning.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
            style={{ padding: '12px 20px', fontSize: '1rem' }}
          >
            {loading ? 'Creating Study Group...' : 'Publish Study Group'}
          </button>
        </form>
      </div>
    </div>
  );
}
