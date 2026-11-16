import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { useNotification } from '../context/NotificationContext';
import GroupCard from '../components/GroupCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, BookOpen, Layers } from 'lucide-react';

const UCU_FACULTIES = [
  'All',
  'Faculty of Science & Technology',
  'Faculty of Law',
  'School of Business',
  'Faculty of Social Sciences',
  'Faculty of Education & Arts',
  'Faculty of Public Health Nursing and Midwifery',
  'Bishop Tucker School of Divinity and Theology'
];

const MEETING_TYPES = ['All', 'Physical', 'Online', 'Hybrid'];

export default function ExploreGroupsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useNotification();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [selectedMeetingType, setSelectedMeetingType] = useState('All');
  const [joiningId, setJoiningId] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, [selectedFaculty, selectedMeetingType]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedFaculty !== 'All') params.faculty = selectedFaculty;
      if (selectedMeetingType !== 'All') params.meeting_type = selectedMeetingType;

      const data = await groupService.getGroups(params);
      setGroups(data.groups || []);
    } catch (err) {
      showError('Failed to fetch study groups.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchGroups();
  };

  const handleJoin = async (groupId) => {
    setJoiningId(groupId);
    try {
      await groupService.joinGroup(groupId);
      showSuccess('Joined study group successfully!');
      fetchGroups();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to join group.');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b3b60' }}>
          Explore UCU Study Groups
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Discover and connect with academic study circles across all Uganda Christian University courses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: 20 }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {/* Search Input */}
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by course code, title, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: 38 }}
              />
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
            </div>

            {/* Faculty Dropdown */}
            <div style={{ flex: '1 1 200px' }}>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="form-control"
              >
                {UCU_FACULTIES.map(fac => (
                  <option key={fac} value={fac}>{fac === 'All' ? 'All Faculties' : fac}</option>
                ))}
              </select>
            </div>

            {/* Meeting Type Dropdown */}
            <div style={{ flex: '1 1 140px' }}>
              <select
                value={selectedMeetingType}
                onChange={(e) => setSelectedMeetingType(e.target.value)}
                className="form-control"
              >
                {MEETING_TYPES.map(type => (
                  <option key={type} value={type}>{type === 'All' ? 'All Formats' : type}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', minHeight: 42 }}>
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Groups Grid */}
      {loading ? (
        <LoadingSpinner text="Searching study group directory..." />
      ) : groups.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <BookOpen size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0b3b60', marginBottom: 6 }}>
            No study groups matched your filter criteria
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 16 }}>
            Try adjusting your search terms or faculty selection, or create the first study group for this course!
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedFaculty('All');
              setSelectedMeetingType('All');
            }}
            className="btn btn-outline btn-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>
            Showing <strong>{groups.length}</strong> study group{groups.length !== 1 ? 's' : ''} available
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: 20
          }}>
            {groups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={handleJoin}
                isJoining={joiningId === group.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
