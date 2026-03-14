import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiPlay, FiAward, FiClock, FiUsers, FiBookOpen, FiUser } from 'react-icons/fi';

export default function MyCourses() {
  const { user, enrollments } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enrollments.length) { setLoading(false); return; }
    Promise.all(enrollments.map(e => axios.get(`/api/courses/${e.courseId}`).then(r => ({
      ...r.data,
      progress: e.progress,
      enrolledAt: e.enrolledAt,
    }))))
      .then(setCourses)
      .finally(() => setLoading(false));
  }, [enrollments]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
            <div>
              <div className="section-eyebrow">My Learning</div>
              <h1 className="section-heading">{greeting()}, {user?.name?.split(' ')[0]} 👋</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.4rem' }}>
                Continue where you left off. You have {courses.length} enrolled course{courses.length !== 1 ? 's' : ''}.
              </p>
            </div>
            <div className="d-flex gap-3">
              {[
                { label: 'Enrolled', val: courses.length, icon: <FiBookOpen /> },
                { label: 'In Progress', val: courses.filter(c => c.progress > 0 && c.progress < 100).length, icon: <FiPlay /> },
                { label: 'Completed', val: courses.filter(c => c.progress === 100).length, icon: <FiAward /> },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0.8rem 1.2rem' }}>
                  <div style={{ color: 'var(--brand-400)', marginBottom: 3 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', background: 'linear-gradient(120deg, #a5b4fc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="container">
          {loading ? (
            <div className="spinner-wrap"><div className="spinner-border spinner-brand" /></div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎓</span>
              <h4 className="empty-title">No courses yet</h4>
              <p className="empty-subtitle">Browse our library and enroll in your first course today!</p>
              <button className="btn-brand mt-3" onClick={() => navigate('/courses')}>
                Explore Courses
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {courses.map((course, i) => (
                <div key={course.id} className={`col-12 col-md-6 col-lg-4 anim-up delay-${Math.min(i + 1, 5)}`}>
                  <div className="enrolled-card">
                    <div style={{ position: 'relative' }}>
                      <img src={course.thumbnail} className="enrolled-thumb" alt={course.title} />
                      <div className="enrolled-overlay"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        <button className="btn-brand"> <FiPlay /> Continue </button>
                      </div>
                      <span className={`progress-badge ${course.progress === 100 ? 'complete' : ''}`}>
                        {course.progress === 100 ? '✓ Complete' : `${course.progress}%`}
                      </span>
                    </div>

                    <div className="enrolled-body">
                      <span className="category-chip">
                        {course.category.replace('-', ' ')}
                      </span>

                      <h5 className="course-title-enrolled">
                        {course.title}
                      </h5>

                      <div className="instructor-row">
                        <FiUser size={16} />
                        <span className="instructor-name">{course.instructor}</span>
                      </div>

                      <div className="meta-row-enrolled">
                        <span><FiClock size={11} />{course.duration}</span>
                        <span><FiBookOpen size={11} />{course.lectures} lectures</span>
                        <span><FiUsers size={11} />{(course.students / 1000).toFixed(1)}k</span>
                      </div>

                      <div className="progress-section">
                        <div className="progress-label">
                          <span>Progress</span>
                          <span className={`progress-pct ${course.progress === 100 ? 'complete' : ''}`}>
                            {course.progress}%
                          </span>
                        </div>
                        <div className="progress-bar-wrap">
                          <div className={`progress-fill ${course.progress === 100 ? 'complete' : ''}`} style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>

                      <div className="enrolled-actions">
                        <button
                          className="btn-brand"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          <FiPlay size={13} />
                          {course.progress === 0 ? 'Start' : course.progress === 100 ? 'Rewatch' : 'Continue'}
                        </button>
                        <button
                          className="btn-brand-outline"
                          title="Certificate"
                        >
                          <FiAward size={14} />
                        </button>
                      </div>

                      <div className="enrolled-date">
                        Enrolled {new Date(course.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
