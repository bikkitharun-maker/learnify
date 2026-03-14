import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FiClock, FiUsers, FiStar, FiBookOpen, FiGlobe, FiCheck, FiLock, FiPlay, FiArrowLeft, FiVideo, FiAward } from 'react-icons/fi';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, enroll, isEnrolled } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const enrolled = course ? isEnrolled(course.id) : false;

  useEffect(() => {
    axios.get(`/api/courses/${id}`)
      .then(r => setCourse(r.data))
      .catch(() => navigate('/courses'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) { toast.info('Please log in to enroll.'); navigate('/login'); return; }
    if (enrolled) return;
    setEnrolling(true);
    try {
      await enroll(course.id);
      toast.success(`🎉 You're now enrolled in "${course.title}"!`);
    } catch { toast.error('Enrollment failed. Try again.'); }
    setEnrolling(false);
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner-border spinner-brand" /></div>;
  if (!course) return null;

  const pctOff = Math.round((1 - course.price / course.originalPrice) * 100);

  return (
    <>
      {/* Detail Hero */}
      <section className="detail-hero">
        <div className="container">
          <div className="row g-5">
            <div className="col-12 col-lg-7">
              <Link to="/courses" className="btn-brand-outline mb-4 d-inline-flex" style={{ fontSize: '0.82rem', padding: '0.38rem 0.9rem' }}>
                <FiArrowLeft /> Back to Courses
              </Link>

              <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid var(--border-medium)', color: 'var(--brand-400)', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', textTransform: 'capitalize', display: 'inline-block', marginBottom: '0.75rem' }}>
                {course.category.replace('-', ' ')}
              </span>

              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.9rem' }}>
                {course.title}
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                {course.description}
              </p>

              {/* Meta row */}
              <div className="d-flex flex-wrap gap-3 mb-4" style={{ fontSize: '0.84rem' }}>
                <span style={{ color: 'var(--amber-400)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <FiStar /> {course.rating} ({course.reviews.toLocaleString()} reviews)
                </span>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <FiUsers /> {course.students.toLocaleString()} students
                </span>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <FiClock /> {course.duration}
                </span>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <FiBookOpen /> {course.lectures} lectures
                </span>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <FiGlobe /> {course.language}
                </span>
              </div>

              {/* Instructor */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.2rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Course Instructor</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{course.instructor}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{course.instructorBio}</div>
                </div>
              </div>

              {/* Tags */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {course.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Last updated: {course.lastUpdated}
                </span>
              </div>

              {/* What you'll learn */}
              <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', padding: '1.25rem 1.4rem' }}>
                <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.9rem' }}>What you'll learn</h5>
                <div className="row g-2">
                  {[
                    `Master ${course.tags[0]} from fundamentals to advanced`,
                    'Build 5+ real-world projects for your portfolio',
                    'Write clean, professional, industry-standard code',
                    'Understand best practices and design patterns',
                    'Debug and troubleshoot like a senior developer',
                    'Deploy your applications to production',
                  ].map((item, i) => (
                    <div key={i} className="col-12 col-sm-6">
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                        <FiCheck style={{ color: 'var(--emerald-400)', flexShrink: 0, marginTop: 2 }} />
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-12 col-lg-5">
              <div className="detail-sidebar">
                {/* Video / Locked */}
                <div className="video-container">
                  {enrolled ? (
                    <video src={course.videoUrl} controls style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <div className="locked-overlay">
                      <div className="locked-icon">🔒</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                        Enroll to unlock
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', textAlign: 'center', maxWidth: 220 }}>
                        Get full access to this course and all its lectures
                      </div>
                    </div>
                  )}
                </div>

                <div className="detail-sidebar-body">
                  {/* Price */}
                  <div className="d-flex align-items-baseline gap-2 mb-3">
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--amber-400)' }}>
                      ₹{course.price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ₹{course.originalPrice.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-400)', marginLeft: 'auto' }}>
                      {pctOff}% off
                    </span>
                  </div>

                  {enrolled ? (
                    <>
                      <div className="btn-success-soft w-100 d-flex justify-content-center mb-3" style={{ padding: '0.7rem' }}>
                        <FiAward style={{ marginRight: 7 }} /> You're enrolled in this course
                      </div>
                      <button onClick={() => navigate('/my-courses')} className="btn-brand w-100" style={{ justifyContent: 'center', padding: '0.7rem' }}>
                        <FiPlay /> Go to My Learning
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn-brand w-100 mb-2" style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '0.97rem' }}
                        onClick={handleEnroll} disabled={enrolling}>
                        {enrolling ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                        {enrolling ? 'Enrolling...' : '🚀 Enroll Now — Free'}
                      </button>
                      <button className="btn-brand-outline w-100" style={{ justifyContent: 'center', padding: '0.65rem', fontSize: '0.9rem' }}>
                        <FiBookOpen /> Add to Wishlist
                      </button>
                    </>
                  )}

                  <div className="divider my-3" />

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>This course includes:</strong>
                    <div className="mt-2 d-flex flex-column gap-2">
                      {[
                        [`${course.duration} of on-demand video`, <FiVideo size={13} />],
                        [`${course.lectures} lectures with resources`, <FiBookOpen size={13} />],
                        ['Full lifetime access', <FiCheck size={13} />],
                        ['Certificate of completion', <FiAward size={13} />],
                        ['Access on mobile & desktop', <FiGlobe size={13} />],
                      ].map(([text, icon], i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ color: 'var(--emerald-400)' }}>{icon}</span>{text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
