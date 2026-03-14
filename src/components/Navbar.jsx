import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiSearch, FiMenu, FiX, FiLogOut, FiBookOpen, FiHome, FiAward, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleInput = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length >= 2) {
      try {
        const res = await axios.get(`/api/courses?q=${encodeURIComponent(val)}&_limit=5`);
        setSuggestions(res.data);
        setShowDrop(true);
      } catch { setSuggestions([]); }
    } else {
      setSuggestions([]);
      setShowDrop(false);
    }
  };

  const doSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate(`/courses?search=${encodeURIComponent(query.trim())}`);
      setQuery(''); setShowDrop(false); setMobileOpen(false);
    }
  };

  const pickSuggestion = (c) => {
    navigate(`/courses/${c.id}`);
    setQuery(''); setShowDrop(false); setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out. See you soon! 👋');
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="lms-navbar">
      <div className="container">
        <div className="d-flex align-items-center gap-3">

          {/* Brand */}
          <Link to="/" className="lms-brand me-2">
            <span className="lms-brand-icon">⚡</span>
            <span className="lms-brand-text">Learnify</span>
          </Link>

          {/* Search — desktop */}
          <div className="lms-search-wrap d-none d-md-block" ref={searchRef}>
            <form onSubmit={doSearch}>
              <span className="lms-search-icon"><FiSearch /></span>
              <input
                className="lms-search"
                type="text"
                placeholder="Search any course..."
                value={query}
                onChange={handleInput}
                onFocus={() => suggestions.length > 0 && setShowDrop(true)}
              />
            </form>
            {showDrop && suggestions.length > 0 && (
              <div className="search-dropdown">
                {suggestions.map(c => (
                  <div key={c.id} className="sdrop-item" onClick={() => pickSuggestion(c)}>
                    <img src={c.thumbnail} alt="" />
                    <div>
                      <div className="sdrop-title">{c.title}</div>
                      <div className="sdrop-meta">{c.instructor} · {c.category}</div>
                    </div>
                  </div>
                ))}
                <div className="sdrop-item" style={{ justifyContent: 'center', background: 'rgba(99,102,241,0.06)' }} onClick={doSearch}>
                  <FiSearch style={{ color: 'var(--brand-400)', marginRight: 6 }} />
                  <span style={{ color: 'var(--brand-400)', fontSize: '0.82rem', fontWeight: 600 }}>
                    View all results for "{query}"
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-grow-1" />

          {/* Desktop Nav Links */}
          <div className="d-none d-lg-flex align-items-center gap-1">
            <NavLink to="/" end className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`}><FiHome className="me-1" />Home</NavLink>
            <NavLink to="/courses" className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`}><FiBookOpen className="me-1" />Courses</NavLink>
            {user && <NavLink to="/my-courses" className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`}><FiAward className="me-1" />My Learning</NavLink>}
          </div>

          {/* Auth — desktop */}
          <div className="d-none d-lg-flex align-items-center gap-2 ms-2">
            {user ? (
              <>
                <div className="user-chip">
                  <svg className="profile-logo" viewBox="0 0 24 24" fill="currentColor" aria-label="Profile">
                    <path d="M12 2L12.62 7L17.62 7L14 10.25L14.75 15.25L12 13L9.25 15.25L10 10.25L6.38 7L11.38 7L12 2Z" />
                  </svg>
                  <span className="user-chip-name">{user.name.split(' ')[0]}</span>
                </div>
                <button className="btn-brand-outline" style={{ padding: '0.42rem 1rem', fontSize: '0.83rem' }} onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-brand-outline" style={{ padding: '0.42rem 1.1rem', fontSize: '0.85rem' }}>Log in</Link>
                <Link to="/register" className="btn-brand" style={{ padding: '0.45rem 1.2rem', fontSize: '0.85rem' }}>Get Started</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="hamburger-btn d-lg-none ms-auto" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-menu">
            {/* Mobile search */}
            <div className="mb-3 position-relative" ref={searchRef}>
              <form onSubmit={doSearch}>
                <span className="lms-search-icon"><FiSearch /></span>
                <input
                  className="lms-search mobile-search-input"
                  type="text"
                  placeholder="Search courses..."
                  value={query}
                  onChange={handleInput}
                />
              </form>
            </div>

            <div className="d-flex flex-column gap-1 mb-3">
              <NavLink to="/" end className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`} onClick={() => setMobileOpen(false)}><FiHome className="me-1" />Home</NavLink>
              <NavLink to="/courses" className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`} onClick={() => setMobileOpen(false)}><FiBookOpen className="me-1" />Courses</NavLink>
              {user && <NavLink to="/my-courses" className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`} onClick={() => setMobileOpen(false)}><FiAward className="me-1" />My Learning</NavLink>}
            </div>

            <div className="divider mb-3" />

            {user ? (
              <div className="d-flex align-items-center gap-2">
                <svg className="profile-logo profile-logo-lg" viewBox="0 0 32 32" fill="currentColor" aria-label="Profile">
                  <path d="M12 2L12.62 7L17.62 7L14 10.25L14.75 15.25L12 13L9.25 15.25L10 10.25L6.38 7L11.38 7L12 2Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
                <button className="btn-brand-outline ms-auto" style={{ fontSize: '0.82rem', padding: '0.38rem 0.9rem' }} onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn-brand-outline flex-fill text-center" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem' }}>Log in</Link>
                <Link to="/register" className="btn-brand flex-fill text-center" onClick={() => setMobileOpen(false)} style={{ padding: '0.5rem' }}>Get Started</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
