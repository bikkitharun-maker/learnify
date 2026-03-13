import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="lms-footer">
      <div className="container">
        <div className="row g-4 mb-2">
          <div className="col-12 col-md-4">
            <div className="lms-brand text-gradient mb-2">⚡ Learnify</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 280 }}>
              Empowering learners worldwide with world-class courses in web development, programming languages, and artificial intelligence.
            </p>
            <div className="d-flex gap-3 mt-3">
              {[FiGithub, FiTwitter, FiLinkedin, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--brand-400)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-6 col-md-2">
            <div className="footer-heading">Platform</div>
            <Link to="/courses" className="footer-link">All Courses</Link>
            <Link to="/courses?category=web-development" className="footer-link">Web Dev</Link>
            <Link to="/courses?category=ai" className="footer-link">AI & ML</Link>
            <Link to="/courses?category=languages" className="footer-link">Languages</Link>
          </div>

          <div className="col-6 col-md-2">
            <div className="footer-heading">Company</div>
            <a href="#" className="footer-link">About Us</a>
            <a href="#" className="footer-link">Careers</a>
            <a href="#" className="footer-link">Blog</a>
            <a href="#" className="footer-link">Press</a>
          </div>

          <div className="col-6 col-md-2">
            <div className="footer-heading">Support</div>
            <a href="#" className="footer-link">Help Center</a>
            <a href="#" className="footer-link">Contact Us</a>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Use</a>
          </div>

          <div className="col-6 col-md-2">
            <div className="footer-heading">For Teams</div>
            <a href="#" className="footer-link">Learnify Business</a>
            <a href="#" className="footer-link">Teach on Learnify</a>
            <a href="#" className="footer-link">Become Affiliate</a>
            <a href="#" className="footer-link">Get the App</a>
          </div>
        </div>

        <div className="footer-bottom d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span className="footer-copy">© 2024 Learnify, Inc. All rights reserved.</span>
          <div className="d-flex gap-3">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🌐 English</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
