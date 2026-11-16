import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { useAuth } from '../context/AuthContext';
import GroupCard from '../components/GroupCard';
import {
  GraduationCap,
  Search,
  BookOpen,
  Users,
  Calendar,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredGroups, setFeaturedGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedGroups();
  }, []);

  const loadFeaturedGroups = async () => {
    try {
      const data = await groupService.getGroups();
      setFeaturedGroups(data.groups?.slice(0, 3) || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top University Header */}
      <nav style={{
        backgroundColor: '#0b3b60',
        padding: '14px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            backgroundColor: '#e09f3e',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#07263f',
            flexShrink: 0
          }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.2 }}>
              Student Study Group Finder
            </span>
            <span style={{ fontSize: '0.725rem', color: '#93c5fd' }}>Uganda Christian University</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-accent btn-sm">
              Go to Dashboard <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>
                Student Login
              </Link>
              <Link to="/register" className="btn btn-accent btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        backgroundColor: '#07263f',
        color: '#ffffff',
        padding: '50px 16px 60px',
        textAlign: 'center',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(11, 59, 96, 0.8) 0%, rgba(7, 38, 63, 1) 100%)'
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(224, 159, 62, 0.15)',
            border: '1px solid rgba(224, 159, 62, 0.3)',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: '0.8rem',
            color: '#f6d89b',
            marginBottom: 18
          }}>
            <Sparkles size={15} color="#e09f3e" />
            Empowering Academic Excellence at Uganda Christian University
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 18 }}>
            Connect, Collaborate & Excel in Your University Coursework
          </h1>
          <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)', color: '#cbd5e1', lineHeight: 1.6, marginBottom: 28, maxWidth: 720, margin: '0 auto 28px' }}>
            The official academic collaboration platform for UCU students. Discover course study groups, coordinate physical and online revision sessions, share resources, and prepare for examinations together.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{
            display: 'flex',
            flexWrap: 'wrap',
            maxWidth: 620,
            margin: '0 auto 20px',
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 4,
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            gap: 4
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 240px', padding: '0 12px' }}>
              <Search size={18} color="#64748b" />
              <input
                type="text"
                placeholder="Search by course code, name, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  padding: '10px 8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  color: '#0f172a'
                }}
              />
            </div>
            <button type="submit" className="btn btn-accent" style={{ padding: '0 20px', minHeight: 40, flex: '0 0 auto' }}>
              Find Groups
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, fontSize: '0.8rem', color: '#94a3b8' }}>
            <span>Popular: BIT3104 (Web & Mobile)</span>
            <span>•</span>
            <span>CSC2101 (Algorithms)</span>
            <span>•</span>
            <span>LAW1201 (Law)</span>
          </div>
        </div>
      </section>

      {/* Featured Groups Section */}
      <section style={{ padding: '60px 24px', backgroundColor: '#f8fafc', flex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: 6 }}>DIRECTORY PREVIEW</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0b3b60' }}>
                Featured Study Groups
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Explore active peer-led learning groups across Uganda Christian University faculties.
              </p>
            </div>
            <Link to="/explore" className="btn btn-outline">
              Browse All Groups <ArrowRight size={16} />
            </Link>
          </div>

          {featuredGroups.length === 0 ? (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: '48px 24px',
              textAlign: 'center',
              border: '1px dashed #cbd5e1'
            }}>
              <BookOpen size={48} color="#0b3b60" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0b3b60', marginBottom: 8 }}>
                No Study Groups Created Yet
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: 460, margin: '0 auto 20px' }}>
                Be the pioneer! Create a student account and start the first academic study group for your course.
              </p>
              <Link to="/register" className="btn btn-primary">
                Register & Start a Group
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 24
            }}>
              {featuredGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onJoin={() => navigate('/login')}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Key Benefits Section */}
      <section style={{ padding: '70px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span className="badge badge-gold" style={{ marginBottom: 8 }}>PLATFORM BENEFITS</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0b3b60' }}>
              Why Join a Study Group at UCU?
            </h2>
            <p style={{ color: '#64748b' }}>
              Designed to solve isolated study patterns and empower students with collaborative revision tools.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 28
          }}>
            <div className="card" style={{ textAlign: 'center', padding: 30 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'rgba(11, 59, 96, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#0b3b60'
              }}>
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b3b60', marginBottom: 10 }}>Course Alignment</h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Connect directly with peers registered in your exact course codes, faculties, and academic programmes.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: 30 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'rgba(224, 159, 62, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#e09f3e'
              }}>
                <Calendar size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b3b60', marginBottom: 10 }}>Organized Revision</h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Group leaders schedule physical meetings at Hamu Mukasa Library or post Google Meet links for hybrid revision.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: 30 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'rgba(2, 132, 199, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#0284c7'
              }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b3b60', marginBottom: 10 }}>Interactive Discussion</h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Ask academic questions, share past paper solutions, and read announcements from your group leaders.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: 30 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#10b981'
              }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0b3b60', marginBottom: 10 }}>Moderated & Secure</h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Strict student verification, role-based controls, and administrative monitoring for a productive university space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus CTA Section */}
      <section style={{
        backgroundColor: '#0b3b60',
        color: '#ffffff',
        padding: '50px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>
            Ready to form your study circle?
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: 24, fontSize: '1rem' }}>
            Create an account using your UCU registration number and connect with your course mates today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
            <Link to="/register" className="btn btn-accent btn-lg">
              Get Started Now
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* University Footer */}
      <footer style={{
        backgroundColor: '#07263f',
        color: '#94a3b8',
        padding: '30px 24px',
        textAlign: 'center',
        fontSize: '0.85rem'
      }}>
        <p>© 2024 Uganda Christian University (UCU) • Student Study Group Finder</p>
        <p style={{ marginTop: 6, fontSize: '0.75rem', color: '#64748b' }}>
          Department of Computing and Technology • Web & Mobile Application Development Assignment
        </p>
      </footer>
    </div>
  );
}
