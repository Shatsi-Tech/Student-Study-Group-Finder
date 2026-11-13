import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { groupService } from '../services/groupService';
import { sessionService } from '../services/sessionService';
import { postService } from '../services/postService';
import PostCard from '../components/PostCard';
import SessionCard from '../components/SessionCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  MapPin,
  Calendar,
  MessageSquare,
  Shield,
  Plus,
  Trash2,
  Settings,
  UserX,
  BookOpen,
  Send,
  HelpCircle,
  Megaphone
} from 'lucide-react';

export default function GroupDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discussions'); // 'discussions', 'sessions', 'members', 'settings'

  // Modals
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  // New Session Form State
  const [sessionForm, setSessionForm] = useState({
    title: '',
    study_date: '',
    start_time: '14:00',
    end_time: '16:00',
    location_or_link: '',
    description: ''
  });

  // New Post Form State
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    post_type: 'DISCUSSION',
    is_pinned: false
  });

  useEffect(() => {
    loadAllGroupData();
  }, [id]);

  const loadAllGroupData = async () => {
    try {
      setLoading(true);
      const groupData = await groupService.getGroupById(id);
      setGroup(groupData.group);
      setMembers(groupData.members || []);

      // Fetch group sessions
      const sessionsData = await sessionService.getGroupSessions(id);
      setSessions(sessionsData.sessions || []);

      // Fetch group posts
      const postsData = await postService.getGroupPosts(id);
      setPosts(postsData.posts || []);
    } catch (err) {
      showError('Failed to load group details.');
    } finally {
      setLoading(false);
    }
  };

  const isLeader = group?.is_leader || isAdmin || group?.leader_id === user?.id;
  const isMember = group?.is_member || isLeader;

  const handleJoin = async () => {
    try {
      await groupService.joinGroup(id);
      showSuccess(`You have joined ${group.name}!`);
      loadAllGroupData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to join group.');
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this study group?')) return;
    try {
      await groupService.leaveGroup(id);
      showSuccess('You left the study group.');
      loadAllGroupData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to leave group.');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await groupService.removeMember(id, userId);
      showSuccess('Member removed from study group.');
      loadAllGroupData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to remove member.');
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete this study group? This will remove all sessions and discussion posts.')) return;
    try {
      await groupService.deleteGroup(id);
      showSuccess('Study group deleted.');
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete group.');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await sessionService.createSession({ ...sessionForm, group_id: id });
      showSuccess('Study session scheduled!');
      setShowSessionModal(false);
      setSessionForm({
        title: '',
        study_date: '',
        start_time: '14:00',
        end_time: '16:00',
        location_or_link: '',
        description: ''
      });
      const sessionsData = await sessionService.getGroupSessions(id);
      setSessions(sessionsData.sessions || []);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to schedule session.');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await postService.createPost({ ...postForm, group_id: id });
      showSuccess('Post published to group!');
      setShowPostModal(false);
      setPostForm({ title: '', content: '', post_type: 'DISCUSSION', is_pinned: false });
      const postsData = await postService.getGroupPosts(id);
      setPosts(postsData.posts || []);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to publish post.');
    }
  };

  const handleAddComment = async (postId, content) => {
    try {
      await postService.createComment(postId, content);
      showSuccess('Comment added.');
      const postsData = await postService.getGroupPosts(id);
      setPosts(postsData.posts || []);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to post comment.');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await postService.deletePost(postId);
      showSuccess('Post deleted.');
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      showError('Failed to delete post.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await postService.deleteComment(commentId);
      showSuccess('Comment deleted.');
      const postsData = await postService.getGroupPosts(id);
      setPosts(postsData.posts || []);
    } catch (err) {
      showError('Failed to delete comment.');
    }
  };

  if (loading || !group) {
    return <LoadingSpinner text="Loading study group workspace..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Group Header Hero */}
      <div className="card" style={{ padding: 28, borderTop: '5px solid #0b3b60' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="badge badge-primary">{group.course_code}</span>
              <span className="badge badge-gold">{group.faculty}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                Format: {group.meeting_type}
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b3b60', marginBottom: 4 }}>
              {group.name}
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>
              {group.course_name}
            </p>
          </div>

          {/* Join / Leave / Admin Controls */}
          <div style={{ display: 'flex', gap: 10 }}>
            {isMember ? (
              <>
                <button
                  onClick={() => setShowPostModal(true)}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={16} /> New Post
                </button>
                {isLeader && (
                  <button
                    onClick={() => setShowSessionModal(true)}
                    className="btn btn-accent btn-sm"
                  >
                    <Calendar size={16} /> Schedule Session
                  </button>
                )}
                {!isLeader && (
                  <button
                    onClick={handleLeave}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#ef4444' }}
                  >
                    Leave Group
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handleJoin}
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontSize: '1rem' }}
              >
                Join Study Group
              </button>
            )}
          </div>
        </div>

        {/* Description & Metadata bar */}
        <p style={{ fontSize: '0.925rem', color: '#334155', lineHeight: 1.5, marginTop: 14 }}>
          {group.description}
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 24,
          borderTop: '1px solid #f1f5f9',
          paddingTop: 16,
          marginTop: 18,
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={16} color="#0b3b60" />
            <span>Leader: <strong style={{ color: '#0f172a' }}>{group.leader?.full_name || 'Group Leader'}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={16} color="#e09f3e" />
            <span>{members.length} / {group.max_members} Registered Members</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={16} color="#0284c7" />
            <span>{group.meeting_location}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '2px solid #e2e8f0', paddingBottom: 2 }}>
        <button
          onClick={() => setActiveTab('discussions')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'discussions' ? '3px solid #0b3b60' : '3px solid transparent',
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: activeTab === 'discussions' ? '#0b3b60' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <MessageSquare size={16} /> Discussions ({posts.length})
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'sessions' ? '3px solid #0b3b60' : '3px solid transparent',
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: activeTab === 'sessions' ? '#0b3b60' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Calendar size={16} /> Study Sessions ({sessions.length})
        </button>

        <button
          onClick={() => setActiveTab('members')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'members' ? '3px solid #0b3b60' : '3px solid transparent',
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: activeTab === 'members' ? '#0b3b60' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Users size={16} /> Members ({members.length})
        </button>

        {isLeader && (
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'settings' ? '3px solid #0b3b60' : '3px solid transparent',
              padding: '10px 16px',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: activeTab === 'settings' ? '#0b3b60' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Settings size={16} /> Leader Settings
          </button>
        )}
      </div>

      {/* TAB 1: Discussions & Announcements */}
      {activeTab === 'discussions' && (
        <div>
          {!isMember && (
            <div style={{
              backgroundColor: '#eff6ff',
              padding: 16,
              borderRadius: 8,
              border: '1px solid #bfdbfe',
              color: '#1e40af',
              fontSize: '0.875rem',
              marginBottom: 18
            }}>
              Join this study group to participate in discussions, ask academic questions, and comment on revision posts.
            </div>
          )}

          {posts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <MessageSquare size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b3b60', marginBottom: 6 }}>
                No discussion posts yet
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 16 }}>
                Be the first to share an announcement, start a revision discussion, or ask an academic question!
              </p>
              {isMember && (
                <button onClick={() => setShowPostModal(true)} className="btn btn-primary btn-sm">
                  Create First Post
                </button>
              )}
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onAddComment={handleAddComment}
                onDeletePost={handleDeletePost}
                onDeleteComment={handleDeleteComment}
                isLeader={isLeader}
              />
            ))
          )}
        </div>
      )}

      {/* TAB 2: Study Sessions */}
      {activeTab === 'sessions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0b3b60' }}>
              Scheduled Study Sessions
            </h2>
            {isLeader && (
              <button onClick={() => setShowSessionModal(true)} className="btn btn-accent btn-sm">
                <Plus size={16} /> Schedule Session
              </button>
            )}
          </div>

          {sessions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <Calendar size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0b3b60', marginBottom: 6 }}>
                No study sessions currently scheduled
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 16 }}>
                Group leaders can schedule physical workshops or online Google Meet revision sessions.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {sessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Members List */}
      {activeTab === 'members' && (
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0b3b60', marginBottom: 16 }}>
            Group Members ({members.length})
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '10px 12px' }}>Student Name</th>
                  <th style={{ padding: '10px 12px' }}>Reg Number</th>
                  <th style={{ padding: '10px 12px' }}>Programme</th>
                  <th style={{ padding: '10px 12px' }}>Role</th>
                  <th style={{ padding: '10px 12px' }}>Joined Date</th>
                  {isLeader && <th style={{ padding: '10px 12px' }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.membership_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>
                      {member.full_name}
                    </td>
                    <td style={{ padding: '12px', color: '#475569' }}>
                      {member.reg_number}
                    </td>
                    <td style={{ padding: '12px', color: '#64748b' }}>
                      {member.programme}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className={member.member_role === 'LEADER' ? 'badge badge-gold' : 'badge badge-primary'}>
                        {member.member_role}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#64748b' }}>
                      {new Date(member.joined_at).toLocaleDateString()}
                    </td>
                    {isLeader && (
                      <td style={{ padding: '12px' }}>
                        {member.user_id !== group.leader_id ? (
                          <button
                            onClick={() => handleRemoveMember(member.user_id)}
                            className="btn btn-outline btn-sm"
                            style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                          >
                            <UserX size={14} /> Remove
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Leader</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Leader Settings */}
      {activeTab === 'settings' && isLeader && (
        <div className="card" style={{ padding: 28, maxWidth: 640 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0b3b60', marginBottom: 14 }}>
            Study Group Administration
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 20 }}>
            Manage group configuration, location updates, or delete this study group.
          </p>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20, marginTop: 20 }}>
            <h4 style={{ color: '#ef4444', fontWeight: 700, marginBottom: 6 }}>Danger Zone</h4>
            <p style={{ color: '#64748b', fontSize: '0.825rem', marginBottom: 14 }}>
              Deleting this group will remove all scheduled sessions, posts, comments and member records. This action cannot be undone.
            </p>
            <button onClick={handleDeleteGroup} className="btn btn-danger btn-sm">
              <Trash2 size={15} /> Delete Study Group
            </button>
          </div>
        </div>
      )}

      {/* Modal: Schedule Session */}
      <Modal isOpen={showSessionModal} onClose={() => setShowSessionModal(false)} title="Schedule Study Session">
        <form onSubmit={handleCreateSession}>
          <div className="form-group">
            <label className="form-label">Session Title *</label>
            <input
              type="text"
              placeholder="e.g. Chapter 4 Mock Examination Revision"
              value={sessionForm.title}
              onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                value={sessionForm.study_date}
                onChange={(e) => setSessionForm({ ...sessionForm, study_date: e.target.value })}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time *</label>
              <input
                type="time"
                value={sessionForm.start_time}
                onChange={(e) => setSessionForm({ ...sessionForm, start_time: e.target.value })}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Time *</label>
              <input
                type="time"
                value={sessionForm.end_time}
                onChange={(e) => setSessionForm({ ...sessionForm, end_time: e.target.value })}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location or Meeting Link *</label>
            <input
              type="text"
              placeholder="e.g. Tech Lab 2 or https://meet.google.com/abc-defg-hij"
              value={sessionForm.location_or_link}
              onChange={(e) => setSessionForm({ ...sessionForm, location_or_link: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Session Description / Prep Material</label>
            <textarea
              rows={3}
              placeholder="Topics to prepare, exercises to bring along..."
              value={sessionForm.description}
              onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <button type="button" onClick={() => setShowSessionModal(false)} className="btn btn-outline btn-sm">Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">Schedule Session</button>
          </div>
        </form>
      </Modal>

      {/* Modal: New Post */}
      <Modal isOpen={showPostModal} onClose={() => setShowPostModal(false)} title="Create Discussion Post">
        <form onSubmit={handleCreatePost}>
          <div className="form-group">
            <label className="form-label">Post Type</label>
            <select
              value={postForm.post_type}
              onChange={(e) => setPostForm({ ...postForm, post_type: e.target.value })}
              className="form-control"
            >
              <option value="DISCUSSION">Discussion / Note Sharing</option>
              <option value="QUESTION">Academic Question</option>
              {isLeader && <option value="ANNOUNCEMENT">Official Announcement</option>}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Post Title *</label>
            <input
              type="text"
              placeholder="e.g. Question on SQL Foreign Key Cascading"
              value={postForm.title}
              onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content *</label>
            <textarea
              rows={4}
              placeholder="Write your explanation, question, or share resources..."
              value={postForm.content}
              onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
              className="form-control"
              required
            />
          </div>

          {isLeader && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <input
                type="checkbox"
                id="pinned"
                checked={postForm.is_pinned}
                onChange={(e) => setPostForm({ ...postForm, is_pinned: e.target.checked })}
              />
              <label htmlFor="pinned" style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
                Pin this post to the top of group discussions
              </label>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <button type="button" onClick={() => setShowPostModal(false)} className="btn btn-outline btn-sm">Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">Publish Post</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
