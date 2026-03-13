import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FiClock, FiUsers, FiPlay, FiLock, FiCheckCircle, FiGlobe } from 'react-icons/fi';

const BADGE_CLASS = {
  'Bestseller': 'badge-bestseller',
  'Top Rated':  'badge-top-rated',
  'New':        'badge-new',
  'Hot':        'badge-hot',
  'Trending':   'badge-trending',
};

const LEVEL_CLASS = {
  'Beginner':     'level-beginner',
  'Intermediate': 'level-intermediate',
  'Advanced':     'level-advanced',
};

function StarRating({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? 'var(--amber-400)' : 'var(--text-muted)' }}>★</span>
      ))}
    </span>
  );
}

export default function CourseCard({ course }) {
  const { user, enroll, isEnrolled } = useAuth();
  const navigate = useNavigate();
  const enrolled = isEnrolled(course.id);
  const pctOff = Math.round((1 - course.price / course.originalPrice) * 100);

  const handleEnroll = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info('Please log in to enroll in courses.');
      navigate('/login');
      return;
    }
    if (enrolled) {
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
    if (!enrolled) { toast.warning('Enroll in this course to unlock the video! 🔒'); return; }
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
        {enrolled && (
          <div className="enrolled-banner">
            <FiCheckCircle /> Enrolled
          </div>
        )}
      </div>

      {/* Body */}
      <div className="course-body">
        <span className="cat-chip">{course.category.replace('-', ' ')}</span>

        <h6 className="course-title">{course.title}</h6>

        <div className="instructor-row">
          <img src={course.instructorAvatar} alt={course.instructor} />
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

        <div className="price-row">
          <span className="price-main">₹{course.price.toLocaleString()}</span>
          <span className="price-orig">₹{course.originalPrice.toLocaleString()}</span>
          <span className="price-off">{pctOff}% off</span>
        </div>

        <div className="card-actions">
          <button
            className={enrolled ? 'btn-brand' : 'btn-brand-outline'}
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '0.45rem 0.8rem' }}
            onClick={handleWatch}
          >
            {enrolled ? <><FiPlay size={13} /> Watch</> : <><FiLock size={13} /> Preview</>}
          </button>
          <button
            className={enrolled ? 'btn-success-soft' : 'btn-amber'}
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '0.45rem 0.8rem' }}
            onClick={handleEnroll}
          >
            {enrolled ? <><FiCheckCircle size={13} /> Enrolled</> : '+ Enroll'}
          </button>
        </div>
      </div>
    </div>
  );
}
