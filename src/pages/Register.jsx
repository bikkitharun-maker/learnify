import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handle = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const passwordStrength = (p) => {
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#f43f5e', '#fbbf24', '#34d399', '#10b981'];
    return { score, label: labels[score], color: colors[score] };
  };

  const strength = passwordStrength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) { setError('All fields are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to Learnify 🚀');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = ['Unlimited course access', 'Verified certificates', 'Expert instructors', 'Lifetime access'];

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', background: 'linear-gradient(120deg, #a5b4fc, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ⚡ Learnify
          </div>
        </div>

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join 200,000+ learners already on Learnify</p>

        {/* Perks */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.5rem', justifyContent: 'center' }}>
          {perks.map(p => (
            <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--emerald-400)', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 50, padding: '2px 10px' }}>
              <FiCheck size={10} /> {p}
            </span>
          ))}
        </div>

        {error && <div className="error-alert"><span>⚠️</span> {error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrap">
              <FiUser className="input-icon" />
              <input className="form-input has-icon" name="name" type="text" placeholder="Your full name" value={form.name} onChange={handle} autoComplete="name" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrap">
              <FiMail className="input-icon" />
              <input className="form-input has-icon" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} autoComplete="email" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <FiLock className="input-icon" />
              <input className="form-input has-icon" name="password" type={showPass ? 'text' : 'password'} placeholder="At least 6 characters" value={form.password} onChange={handle} autoComplete="new-password" style={{ paddingRight: '2.6rem' }} />
              <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {form.password && (
              <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                {[1,2,3,4].map(n => (
                  <div key={n} style={{ flex: 1, height: 3, borderRadius: 99, background: n <= strength.score ? strength.color : 'var(--border-subtle)', transition: 'background 0.3s' }} />
                ))}
                <span style={{ fontSize: '0.72rem', color: strength.color, marginLeft: 6, fontWeight: 600, whiteSpace: 'nowrap' }}>{strength.label}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-icon-wrap">
              <FiLock className="input-icon" />
              <input className="form-input has-icon" name="confirm" type="password" placeholder="Repeat your password" value={form.confirm} onChange={handle} autoComplete="new-password" />
              {form.confirm && form.password === form.confirm && (
                <FiCheck style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--emerald-400)' }} />
              )}
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            By signing up, you agree to our <a href="#" className="auth-link">Terms of Service</a> and <a href="#" className="auth-link">Privacy Policy</a>.
          </p>

          <button type="submit" className="btn-brand w-100" style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '0.97rem' }} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
            {loading ? 'Creating account...' : <>Create Account <FiArrowRight /></>}
          </button>
        </form>

        <div className="auth-divider"><div className="auth-divider-line" /><span className="auth-divider-text">Already have an account?</span><div className="auth-divider-line" /></div>

        <p style={{ textAlign: 'center', fontSize: '0.88rem' }}>
          <Link to="/login" className="auth-link">Log in to your account</Link>
        </p>
      </div>
    </div>
  );
}
