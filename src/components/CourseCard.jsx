import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FiClock, FiUsers, FiPlay, FiLock, FiCheckCircle, FiGlobe, FiUser } from 'react-icons/fi';

const BADGE_CLASS = {
  'Bestseller': 'badge-bestseller',
  'Top Rated': 'badge-top-rated',
  'New': 'badge-new',
  'Hot': 'badge-hot',
  'Trending': 'badge-trending',
};

const LEVEL_CLASS = {
  'Beginner': 'level-beginner',
  'Intermediate': 'level-intermediate',
  'Advanced': 'level-advanced',
};

function StarRating({ rating }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? 'var(--amber-400)' : 'var(--text-muted)' }}>★</span>
      ))}
    </span>
  );
}

export default function CourseCard({ course, isEnrolled = false, progress = 0, enrolledAt }) {
  const { user, enroll, isEnrolled: checkEnrolled } = useAuth();
  const navigate = useNavigate();
  // const enrolled = checkEnrolled(course.id); // Legacy, use prop now
  const pctOff = Math.round((1 - course.price / course.originalPrice) * 100);

  const handleEnroll = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info('Please log in to enroll in courses.');
      navigate('/login');
      return;
    }
    // Legacy enrolled check removed, use isEnrolled prop
    if (isEnrolled) {
      navigate('/my-courses');
      return;
    }
    try {
      await enroll(course.id);
      toast.success(`🎉 You're enrolled in "${course.title}"!`);
    } catch {
      toast.error('Enrollment failed. Please try again.');
    }
  };

  const handleWatch = (e) => {
    e.stopPropagation();
    if (!user) { toast.info('Please log in first.'); navigate('/login'); return; }
    if (!isEnrolled) { toast.warning('Enroll in this course to unlock the video! 🔒'); return; }
    navigate(`/courses/${course.id}`);
  };

  return (
    <div className="course-card" onClick={() => navigate(`/courses/${course.id}`)}>
      {/* Thumbnail */}
      <div className="course-thumb-wrap">
        <img src={course.thumbnail} alt={course.title} loading="lazy" />
        {course.badge && (
          <span className={`badge-pill ${BADGE_CLASS[course.badge] || 'badge-new'}`}
            style={{ position: 'absolute', top: 10, left: 10 }}>
            {course.badge}
          </span>
        )}
        <span className={`level-badge ${LEVEL_CLASS[course.level]}`}
          style={{ position: 'absolute', top: 10, right: 10 }}>
          {course.level}
        </span>
        {isEnrolled ? (
          <>
            <span className="progress-badge" style={{
              position: 'absolute', top: 10, right: 10,
              background: 'rgba(0,0,0,0.7)', color: progress === 100 ? 'var(--emerald-400)' : 'var(--amber-400)',
              border: `1px solid ${progress === 100 ? 'rgba(52,211,153,0.4)' : 'rgba(251,191,36,0.4)'}`,
              borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', backdropFilter: 'blur(10px)'
            }}>
              {progress === 100 ? '✓ Complete' : `${progress}%`}
            </span>
            <div className="enrolled-overlay" style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0,
              transition: 'opacity 0.3s ease, transform 0.3s ease', cursor: 'pointer'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; e.currentTarget.style.transform = 'scale(1)'; }}
              onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.id}`); }}
            >
              <button className="btn-brand px-4 py-2" style={{ borderRadius: 25 }}>
                <FiPlay style={{ marginRight: 6 }} /> Continue
              </button>
            </div>
          </>
        ) : (
          <>
            {course.badge && (
              <span className={`badge-pill ${BADGE_CLASS[course.badge] || 'badge-new'}`}
                style={{ position: 'absolute', top: 10, left: 10 }}>
                {course.badge}
              </span>
            )}
            <span className={`level-badge ${LEVEL_CLASS[course.level]}`}
              style={{ position: 'absolute', top: 10, right: 10 }}>
              {course.level}
            </span>
          </>
        )}
      </div>

      {/* Body */}
      <div className="course-body">
        <span className="cat-chip">{course.category.replace('-', ' ')}</span>

        <h6 className="course-title">{course.title}</h6>

        <div className="instructor-row">
          <FiUser size={24} style={{ color: 'var(--text-muted)' }} />
          <span className="instructor-name">{course.instructor}</span>
        </div>

        <div className="rating-row">
          <span className="rating-num">{course.rating}</span>
          <StarRating rating={course.rating} />
          <span className="rating-cnt">({course.reviews.toLocaleString()})</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <FiUsers size={11} />{(course.students / 1000).toFixed(1)}k
          </span>
        </div>

        <div className="meta-row">
          <span><FiClock size={11} />{course.duration}</span>
          <span><FiGlobe size={11} />{course.language}</span>
          <span>📄 {course.lectures} lectures</span>
        </div>

        {isEnrolled ? (
          <div className="progress-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 8, color: 'var(--text-muted)' }}>
              <span>Progress</span>
              <span style={{ fontWeight: 700, color: progress === 100 ? 'var(--emerald-400)' : 'var(--brand-400)' }}>{progress}%</span>
            </div>
            <div className="progress-bar-wrap enrolled-progress">
              <div className="progress-fill" style={{ width: `${progress}%`, background: progress === 100 ? 'var(--emerald-500)' : 'var(--brand-500)' }} />
            </div>
            {enrolledAt && (
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 12 }}>
                Enrolled {new Date(enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            )}
          </div>
        ) : (
          <div className="price-row">
            <span className="price-main">₹{course.price.toLocaleString()}</span>
            <span className="price-orig">₹{course.originalPrice.toLocaleString()}</span>
            <span className="price-off">{pctOff}% off</span>
          </div>
        )}

        <div className="card-actions">
          {isEnrolled ? (
            <>
              <button
                className="btn-brand"
                style={{ flex: 1, fontSize: '0.82rem' }}
                onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.id}`); }}
              >
                <FiPlay size={13} style={{ marginRight: 4 }} />
                {progress === 0 ? 'Start Course' : progress === 100 ? 'Rewatch' : 'Continue'}
              </button>
              <button
                className="btn-brand-outline"
                style={{ padding: '0.45rem', minWidth: 44 }}
                title="View Certificate"
                onClick={(e) => { e.stopPropagation(); toast.info('Certificate coming soon! 🎉'); }}
              >
                <FiAward size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-brand-outline"
                style={{ flex: 1, fontSize: '0.82rem' }}
                onClick={handleWatch}
              >
                <FiLock size={13} style={{ marginRight: 4 }} /> Preview
              </button>
              <button
                className="btn-amber"
                style={{ flex: 1, fontSize: '0.82rem' }}
                onClick={handleEnroll}
              >
                + Enroll
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
