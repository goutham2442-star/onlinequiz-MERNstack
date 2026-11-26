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
          <span className="nav-logo-icon">⚡</span>
          <span>QuizMaster</span>
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
                My Results
              </Link>
            </>
          )}

          {user && isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
              >
                Admin Panel
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
            </>
          )}
        </nav>

        <div className="nav-user">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user.name}</div>
                <span className={`badge ${isAdmin ? 'badge-primary' : 'badge-success'}`}>
                  {user.role}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
