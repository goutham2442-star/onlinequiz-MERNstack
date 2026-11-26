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

  // Set of quiz IDs already completed by student
  const completedQuizIds = new Set(myResults.map((r) => r.quiz?._id || r.quiz));

  // Compute stats
  const totalAttempted = myResults.length;
  const avgScore =
    totalAttempted > 0
      ? (myResults.reduce((acc, r) => acc + r.percentage, 0) / totalAttempted).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          marginBottom: '2rem',
          padding: '2rem',
          borderRadius: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#fff', marginBottom: '0.5rem' }}>
              Student Portal
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem' }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={{ color: '#c7d2fe', fontSize: '0.95rem' }}>
              Select a quiz below to test your domain expertise.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{totalAttempted}</div>
              <div style={{ fontSize: '0.75rem', color: '#c7d2fe', textTransform: 'uppercase' }}>Attempted</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{avgScore}%</div>
              <div style={{ fontSize: '0.75rem', color: '#c7d2fe', textTransform: 'uppercase' }}>Avg Score</div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Available Quizzes Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>
          Available Quizzes ({quizzes.length})
        </h2>
        <Link to="/my-results" className="btn btn-secondary btn-sm">
          View Past Performance &rarr;
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No quizzes are currently published by administrators.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {quizzes.map((quiz) => {
            const isCompleted = completedQuizIds.has(quiz._id);
            const userAttempt = myResults.find((r) => (r.quiz?._id || r.quiz) === quiz._id);

            return (
              <div key={quiz._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">{quiz.category}</span>
                  {isCompleted ? (
                    <span className="badge badge-success">Completed ({userAttempt?.percentage}%)</span>
                  ) : (
                    <span className="badge badge-warning">Pending</span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', flex: 1 }}>{quiz.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  {quiz.description || 'Comprehensive evaluation covering key concepts and problem solving.'}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '0.825rem',
                    color: 'var(--text-muted)',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-color)',
                    marginBottom: '1rem',
                  }}
                >
                  <span>📝 {quiz.questions?.length || 0} Questions</span>
                  <span>⏱️ {quiz.duration} Mins</span>
                  <span>🎯 {quiz.totalMarks || quiz.questions?.length || 0} Marks</span>
                </div>

                {isCompleted ? (
                  <Link
                    to={`/results/${userAttempt._id}`}
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    Review Attempt Analysis
                  </Link>
                ) : (
                  <Link
                    to={`/quiz/${quiz._id}`}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Start Quiz Now
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
