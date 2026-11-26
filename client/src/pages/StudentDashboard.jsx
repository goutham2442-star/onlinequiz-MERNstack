import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, resultsRes] = await Promise.all([
        api.get('/quizzes'),
        api.get('/results/my-results'),
      ]);
      setQuizzes(quizzesRes.data.quizzes || []);
      setMyResults(resultsRes.data.results || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const completedQuizIds = new Set(myResults.map((r) => r.quiz?._id || r.quiz));

  const totalAttempted = myResults.length;
  const avgScore =
    totalAttempted > 0
      ? (myResults.reduce((acc, r) => acc + r.percentage, 0) / totalAttempted).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading your student workstation...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Hero Banner with Modern Gradient */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
          color: '#ffffff',
          marginBottom: '2.5rem',
          padding: '2.5rem 3rem',
          borderRadius: '28px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#c7d2fe',
                marginBottom: '0.85rem',
              }}
            >
              <span>🎓</span> Student Assessment Portal
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={{ color: '#c7d2fe', fontSize: '1.05rem', maxWidth: '600px' }}>
              Select an active assessment below to evaluate your proficiency and view in-depth performance analytics.
            </p>
          </div>

          {/* Metric Tiles */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                padding: '1.25rem 1.75rem',
                borderRadius: '20px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                minWidth: '130px',
              }}
            >
              <div style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1.1 }}>{totalAttempted}</div>
              <div style={{ fontSize: '0.75rem', color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.35rem' }}>
                Quizzes Taken
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                padding: '1.25rem 1.75rem',
                borderRadius: '20px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                minWidth: '130px',
              }}
            >
              <div style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1.1, color: '#34d399' }}>{avgScore}%</div>
              <div style={{ fontSize: '0.75rem', color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.35rem' }}>
                Average Grade
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Available Quizzes Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Available Quizzes
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Choose an exam to begin. Single attempt enforcement is active.
          </p>
        </div>
        <Link to="/my-results" className="btn btn-secondary">
          📜 View Submission History &rarr;
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Live Assessments Available</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto' }}>
            Administrators have not published any active quizzes at this moment. Please check back later.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.75rem',
            marginBottom: '3rem',
          }}
        >
          {quizzes.map((quiz) => {
            const isCompleted = completedQuizIds.has(quiz._id);
            const userAttempt = myResults.find((r) => (r.quiz?._id || r.quiz) === quiz._id);

            return (
              <div
                key={quiz._id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2rem',
                  borderRadius: '24px',
                  background: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className="badge badge-primary">{quiz.category}</span>
                  {isCompleted ? (
                    <span className="badge badge-success">✓ Completed ({userAttempt?.percentage}%)</span>
                  ) : (
                    <span className="badge badge-warning">⚡ Ready to Take</span>
                  )}
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    marginBottom: '0.65rem',
                    lineHeight: 1.3,
                  }}
                >
                  {quiz.title}
                </h3>

                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.925rem',
                    lineHeight: 1.55,
                    marginBottom: '1.5rem',
                    flex: 1,
                  }}
                >
                  {quiz.description || 'Comprehensive evaluation test testing practical problem-solving capabilities.'}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '0.75rem',
                    padding: '1rem 0',
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Questions</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                      {quiz.questions?.length || 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Duration</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                      {quiz.duration}m
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Max Score</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.15rem' }}>
                      {quiz.totalMarks || quiz.questions?.length || 0}
                    </div>
                  </div>
                </div>

                {isCompleted ? (
                  <Link
                    to={`/results/${userAttempt._id}`}
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '0.85rem' }}
                  >
                    View Result Analysis &rarr;
                  </Link>
                ) : (
                  <Link
                    to={`/quiz/${quiz._id}`}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.85rem' }}
                  >
                    Start Assessment &rarr;
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
