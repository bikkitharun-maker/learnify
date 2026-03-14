import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'demo@learnify.com', password: 'demo1234' });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', background: 'linear-gradient(120deg, #a5b4fc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ⚡ Learnify
          </div>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Log in to continue your learning journey</p>

        {error && (
          <div className="error-alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-icon-wrap">
              <FiUser className="input-icon" />
              <input
                className="form-input has-icon"
                name="name"
                type="text"
                placeholder="Your username"
                value={form.name}
                onChange={handle}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <div className="input-icon-wrap">
              <FiMail className="input-icon" />
              <input
                className="form-input has-icon"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handle}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <FiLock className="input-icon" />
              <input
                className="form-input has-icon"
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={handle}
                autoComplete="current-password"
                style={{ paddingRight: '2.6rem' }}
              />
              <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-end mb-3">
            <a href="#" style={{ fontSize: '0.8rem', color: 'var(--brand-400)' }}>Forgot password?</a>
          </div>

          <button type="submit" className="btn-brand w-100" style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '0.97rem' }} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
            {loading ? 'Logging in...' : <>Log In <FiArrowRight /></>}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">or</span>
          <div className="auth-divider-line" />
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" className="auth-link">Sign up free</Link>
        </p>

        <div className="demo-hint">
          <strong>Demo Account:</strong><br />
          Email: <strong>demo@learnify.com</strong><br />
          Password: <strong>demo1234</strong>
          <br />
          <button type="button" onClick={fillDemo}
            style={{ marginTop: 6, background: 'rgba(99,102,241,0.15)', border: '1px solid var(--border-medium)', color: 'var(--brand-400)', borderRadius: 6, padding: '3px 10px', fontSize: '0.77rem', fontWeight: 600, cursor: 'pointer' }}>
            Fill demo credentials
          </button>
        </div>
      </div>
    </div>
  );
}
