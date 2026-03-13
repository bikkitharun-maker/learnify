import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { FiSearch, FiArrowRight, FiCode, FiCpu, FiUsers, FiStar, FiBookOpen, FiAward } from 'react-icons/fi';

const FEATURES = [
  { icon: '🎯', color: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', label: 'Expert Instructors', desc: 'Learn from industry professionals with 10+ years of real-world experience at top tech companies.' },
  { icon: '⚡', color: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', label: 'Learn at Your Pace', desc: 'Lifetime access to all course content. Watch on any device, pause and resume anytime you want.' },
  { icon: '🏆', color: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)', label: 'Certificates', desc: 'Earn verified completion certificates to showcase your new skills to employers worldwide.' },
  { icon: '💬', color: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.25)', label: 'Community Support', desc: 'Join 200,000+ learners, ask questions in forums, and connect with peers on the same journey.' },
  { icon: '🔄', color: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)', label: 'Updated Content', desc: 'All courses are regularly updated to reflect the latest industry tools, frameworks, and best practices.' },
  { icon: '📱', color: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.25)', label: 'Mobile Learning', desc: 'Seamlessly switch between desktop and mobile. Download lectures for offline learning anywhere.' },
];

const CATEGORIES = [
  { id: 'all',             label: 'All Courses', icon: <FiBookOpen />, count: 12 },
  { id: 'web-development', label: 'Web Dev',     icon: <FiCode />,     count: 4  },
  { id: 'ai',              label: 'AI & ML',     icon: <FiCpu />,      count: 4  },
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [heroSearch, setHeroSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const courseSectionRef = useRef(null);

  useEffect(() => {
    axios.get('/api/courses')
      .then(r => { setCourses(r.data); setFiltered(r.data); })
      .finally(() => setLoading(false));
  }, []);

  const filterCourses = (cat) => {
    setActiveTab(cat);
    setFiltered(cat === 'all' ? courses : courses.filter(c => c.category === cat));
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/courses?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      courseSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-noise" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="container position-relative">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <div className="anim-up">
                <div className="hero-eyebrow">
                  <span className="hero-eyebrow-dot" />
                  #1 Online Learning Platform in India
                </div>
              </div>

              <h1 className="display-heading anim-up delay-1">
                Learn skills that
                <br />
                <span className="text-gradient">shape your future</span>
              </h1>

              <blockquote className="hero-quote anim-up delay-2">
                "The beautiful thing about learning is that no one can take it away from you. Every skill you gain is a door only you can open."
              </blockquote>

              <p className="anim-up delay-3" style={{ color: 'var(--text-secondary)', fontSize: '0.97rem', marginBottom: '1.75rem', maxWidth: 480 }}>
                Join over <strong style={{ color: 'var(--text-primary)' }}>200,000 learners</strong> building careers in tech. Courses taught by engineers from Google, Meta, and DeepMind — structured for real-world impact.
              </p>

              {/* Hero Search */}
              <form onSubmit={handleHeroSearch} className="anim-up delay-3">
                <div style={{ display: 'flex', gap: 10, maxWidth: 500, marginBottom: '1.75rem' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }} />
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={e => setHeroSearch(e.target.value)}
                      placeholder="What do you want to learn?"
                      style={{
                        width: '100%',
                        background: 'var(--bg-card)',
                        border: '1.5px solid var(--border-medium)',
                        borderRadius: 50,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        padding: '0.75rem 1rem 0.75rem 2.7rem',
                        outline: 'none',
                        transition: 'var(--transition)',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--brand-500)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-medium)'}
                    />
                  </div>
                  <button type="submit" className="btn-brand" style={{ whiteSpace: 'nowrap', padding: '0.75rem 1.5rem' }}>
                    Search <FiArrowRight />
                  </button>
                </div>
              </form>

              <div className="d-flex flex-wrap gap-2 anim-up delay-4">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Popular:</span>
                {['React', 'Python', 'Machine Learning', 'TypeScript'].map(t => (
                  <button key={t} onClick={() => navigate(`/courses?search=${t}`)}
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid var(--border-subtle)', color: 'var(--brand-400)', borderRadius: 50, fontSize: '0.78rem', fontWeight: 600, padding: '3px 12px', cursor: 'pointer', transition: 'var(--transition)' }}
                    onMouseEnter={e => { e.target.style.background = 'rgba(99,102,241,0.2)'; e.target.style.borderColor = 'var(--brand-500)'; }}
                    onMouseLeave={e => { e.target.style.background = 'rgba(99,102,241,0.1)'; e.target.style.borderColor = 'var(--border-subtle)'; }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Image Side */}
            <div className="col-12 col-lg-6 anim-up delay-2">
              <div style={{ position: 'relative' }}>
                <div className="hero-img-card">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=85" alt="Learning" />
                  <div className="hero-img-overlay">
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Currently trending</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Generative AI & Prompt Engineering</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--amber-400)', marginTop: 4 }}>18,900+ students enrolled</div>
                  </div>
                  <div className="hero-floating-badge">⭐ 4.8 Top Rated</div>
                </div>

                {/* Floating stat cards */}
                <div style={{
                  position: 'absolute', bottom: -20, left: -20,
                  background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  borderRadius: 14, padding: '12px 16px', boxShadow: 'var(--shadow-card)',
                  animation: 'pulse-glow 4s ease-in-out infinite'
                }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>New enrollment</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <img src="https://i.pravatar.cc/150?img=9" style={{ width: 22, height: 22, borderRadius: '50%' }} alt="" />
                    Rahul enrolled in React
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--emerald-400)', marginTop: 2 }}>2 minutes ago</div>
                </div>

                <div style={{
                  position: 'absolute', top: -16, right: -16,
                  background: 'linear-gradient(135deg, var(--brand-600), var(--brand-800))',
                  borderRadius: 14, padding: '12px 16px', boxShadow: '0 8px 24px rgba(99,102,241,0.4)'
                }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#fff' }}>200K+</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Learners worldwide</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="row g-3 mt-5">
            {[
              { num: '200K+',  label: 'Active Learners',  icon: <FiUsers /> },
              { num: '50+',    label: 'Expert Instructors', icon: <FiAward /> },
              { num: '12',     label: 'Premium Courses',  icon: <FiBookOpen /> },
              { num: '4.8★',   label: 'Avg. Rating',      icon: <FiStar /> },
            ].map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className={`hero-stat-card anim-up delay-${i+2}`}>
                  <div style={{ color: 'var(--brand-400)', marginBottom: 4, fontSize: '1rem' }}>{s.icon}</div>
                  <div className="hero-stat-num">{s.num}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES SECTION ── */}
      <section className="section-wrap bg-grid" ref={courseSectionRef} id="courses">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end justify-content-between gap-3 mb-4">
            <div>
              <div className="section-eyebrow">Curated Courses</div>
              <h2 className="section-heading">Explore our top courses</h2>
              <div className="section-divider" />
            </div>
            <Link to="/courses" className="btn-brand-outline" style={{ whiteSpace: 'nowrap', fontSize: '0.88rem', padding: '0.5rem 1.2rem' }}>
              View All <FiArrowRight />
            </Link>
          </div>

          {/* Category filter */}
          <div className="filter-tabs mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`filter-tab ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => filterCourses(cat.id)}
              >
                {cat.icon} &nbsp;{cat.label}
                <span style={{ marginLeft: 6, fontSize: '0.7rem', opacity: 0.75 }}>({cat.count})</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner-border spinner-brand" /></div>
          ) : (
            <div className="row g-4">
              {filtered.slice(0, 8).map((course, i) => (
                <div key={course.id} className={`col-12 col-sm-6 col-lg-3 anim-up delay-${Math.min(i+1,5)}`}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/courses" className="btn-brand" style={{ padding: '0.75rem 2.2rem', fontSize: '0.95rem' }}>
              Browse All {courses.length} Courses <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY LEARNIFY ── */}
      <section className="section-wrap">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-eyebrow">Why Choose Us</div>
            <h2 className="section-heading">Everything you need to succeed</h2>
            <div className="section-divider center" />
            <p style={{ color: 'var(--text-muted)', maxWidth: 520, margin: '1rem auto 0', fontSize: '0.95rem' }}>
              We've designed every aspect of Learnify to give you the best possible learning experience.
            </p>
          </div>

          <div className="row g-4">
            {FEATURES.map((f, i) => (
              <div key={i} className={`col-12 col-sm-6 col-lg-4 anim-up delay-${i % 3 + 1}`}>
                <div className="feature-card">
                  <div className="feature-icon" style={{ background: f.color, border: `1px solid ${f.border}` }}>
                    {f.icon}
                  </div>
                  <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{f.label}</h5>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-wrap" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-eyebrow">Student Stories</div>
            <h2 className="section-heading">Loved by learners worldwide</h2>
            <div className="section-divider center" />
          </div>

          <div className="row g-4">
            {[
              { name: 'Aditya Kumar', role: 'Frontend Dev @ Zomato', img: 'https://i.pravatar.cc/150?img=11', text: "Learnify's React course completely transformed my career. Within 3 months of finishing, I landed my dream job. The quality of instruction is unmatched anywhere online." },
              { name: 'Meera Nair', role: 'ML Engineer @ Flipkart', img: 'https://i.pravatar.cc/150?img=25', text: "The ML with TensorFlow course is incredibly well structured. Dr. Gupta explains complex concepts with such clarity. I went from zero ML knowledge to deploying models in production." },
              { name: 'Rohan Verma', role: 'Full Stack Dev @ Startup', img: 'https://i.pravatar.cc/150?img=35', text: "The MERN stack bootcamp gave me everything I needed to build my own SaaS product. The project-based approach means you're always building real things, not just watching videos." },
            ].map((t, i) => (
              <div key={i} className="col-12 col-md-4">
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', padding: '1.6rem', height: '100%',
                  transition: 'var(--transition)'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-medium)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div style={{ color: 'var(--amber-400)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>★★★★★</div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.75, marginBottom: '1.2rem' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={t.img} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-medium)' }} alt="" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="section-wrap">
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--brand-700) 0%, var(--brand-600) 50%, rgba(99,102,241,0.8) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2.5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(99,102,241,0.3)',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")', borderRadius: 'var(--radius-xl)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Limited Time Offer
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
                Start learning today.<br />Your first month is free.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.97rem', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.7 }}>
                Get unlimited access to 12+ premium courses, project files, and community support. Cancel anytime.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/register" className="btn-amber" style={{ padding: '0.8rem 2.2rem', fontSize: '0.97rem' }}>
                  Get Started Free <FiArrowRight />
                </Link>
                <Link to="/courses" style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 50, fontWeight: 600, padding: '0.8rem 2rem', fontSize: '0.97rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                >
                  Browse Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
