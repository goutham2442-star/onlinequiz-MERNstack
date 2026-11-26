import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isStudent } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-badge">
            <span>⚡</span>
          </div>
          <span style={{ fontWeight: 800 }}>QuizMaster</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>

          {user && isStudent && (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link
                to="/my-results"
                className={`nav-link ${isActive('/my-results') ? 'active' : ''}`}
              >
                Past Results
              </Link>
            </>
          )}

          {user && isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
              >
                Overview
              </Link>
              <Link
                to="/admin/questions"
                className={`nav-link ${isActive('/admin/questions') ? 'active' : ''}`}
              >
                Question Bank
              </Link>
              <Link
                to="/admin/quizzes"
                className={`nav-link ${isActive('/admin/quizzes') ? 'active' : ''}`}
              >
                Quizzes
              </Link>
              <Link
                to="/admin/results"
                className={`nav-link ${isActive('/admin/results') ? 'active' : ''}`}
              >
                Submissions
              </Link>
            </>
          )}
        </nav>

        <div className="nav-user">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: isAdmin
                      ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                      : 'linear-gradient(135deg, #10b981, #06b6d4)',
                    color: '#ffffff',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.95rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.875rem', lineHeight: 1.2 }}>
                    {user.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      color: isAdmin ? 'var(--primary)' : 'var(--success-text)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.45rem 0.9rem' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
