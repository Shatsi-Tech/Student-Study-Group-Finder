import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Pin, Trash2, Send, HelpCircle, Megaphone, CornerDownRight } from 'lucide-react';

export default function PostCard({ post, onAddComment, onDeletePost, onDeleteComment, isLeader }) {
  const { user, isAdmin } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const canDeletePost = isAdmin || isLeader || post.user_id === user?.id;

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      await onAddComment(post.id, commentText);
      setCommentText('');
    } finally {
      setSubmitting(false);
    }
  };

  const getPostBadge = () => {
    switch (post.post_type) {
      case 'ANNOUNCEMENT':
        return (
          <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <Megaphone size={12} /> ANNOUNCEMENT
          </span>
        );
      case 'QUESTION':
        return (
          <span className="badge" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
            <HelpCircle size={12} /> ACADEMIC QUESTION
          </span>
        );
      default:
        return (
          <span className="badge badge-primary">
            <MessageSquare size={12} /> DISCUSSION
          </span>
        );
    }
  };

  return (
    <div className="card" style={{
      marginBottom: 16,
      borderLeft: post.is_pinned ? '4px solid #e09f3e' : '1px solid #e2e8f0'
    }}>
      {/* Post Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: '#0b3b60',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            {post.author_name ? post.author_name[0] : 'S'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                {post.author_name}
              </span>
              {getPostBadge()}
              {post.is_pinned ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.7rem', color: '#e09f3e', fontWeight: 700 }}>
                  <Pin size={12} /> PINNED
                </span>
              ) : null}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {post.programme ? `${post.programme} • ` : ''}
              {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {canDeletePost && (
          <button
            onClick={() => onDeletePost(post.id)}
            title="Delete Post"
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Post Content */}
      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0b3b60', marginBottom: 8 }}>
        {post.title}
      </h4>
      <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-line', marginBottom: 16 }}>
        {post.content}
      </p>

      {/* Comments Toggle & Header */}
      <div style={{
        borderTop: '1px solid #f1f5f9',
        paddingTop: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0284c7',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <MessageSquare size={14} />
          {post.comments?.length || 0} Comments
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div style={{ marginTop: 12, backgroundColor: '#f8fafc', padding: 14, borderRadius: 8 }}>
          {/* Comments List */}
          {post.comments && post.comments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              {post.comments.map((comment) => {
                const canDeleteComment = isAdmin || isLeader || comment.user_id === user?.id;
                return (
                  <div key={comment.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    backgroundColor: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <CornerDownRight size={14} color="#94a3b8" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0b3b60' }}>
                          {comment.author_name}
                          <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 8 }}>
                            {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.825rem', color: '#1e293b', marginTop: 2 }}>
                          {comment.content}
                        </div>
                      </div>
                    </div>
                    {canDeleteComment && (
                      <button
                        onClick={() => onDeleteComment(comment.id)}
                        style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 2 }}
                        title="Delete Comment"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginBottom: 10, fontStyle: 'italic' }}>
              No comments yet. Start the academic discussion!
            </div>
          )}

          {/* New Comment Input Form */}
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Write a response or academic question..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="form-control"
              style={{ fontSize: '0.825rem', padding: '6px 12px' }}
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="btn btn-primary btn-sm"
              style={{ flexShrink: 0 }}
            >
              <Send size={14} /> Reply
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
