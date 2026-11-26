import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/' ? '/dashboard' : from);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@quiz.com');
      setPassword('adminpassword123');
    } else {
      setEmail('student@quiz.com');
      setPassword('studentpassword123');
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '3.5rem auto', padding: '0 1.25rem' }}>
      <div
        className="card"
        style={{
          padding: '2.75rem 2.25rem',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '2rem',
              boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)',
              marginBottom: '1.25rem',
            }}
          >
            🎓
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '0.4rem',
            }}
          >
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Enter your credentials to access examination sessions
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ borderRadius: '12px' }}>
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@quiz.com"
              style={{
                width: '100%',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                outline: 'none',
                background: '#f8fafc',
                fontSize: '0.95rem',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                }}
              >
                Password
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                outline: 'none',
                background: '#f8fafc',
                fontSize: '0.95rem',
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.9rem',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        {/* Quick Demo Pre-fill Pills */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px dashed var(--border-subtle)',
          }}
        >
          <div
            style={{
              fontSize: '0.775rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.85rem',
            }}
          >
            Instant Viva Demo Accounts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => handleDemoFill('student')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', gap: '0.4rem' }}
            >
              <span>👤</span> Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', gap: '0.4rem' }}
            >
              <span>🛡️</span> Faculty Demo
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.925rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
