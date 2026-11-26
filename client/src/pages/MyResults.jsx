import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyResults();
  }, []);

  const fetchMyResults = async () => {
    try {
      setLoading(true);
      const res = await api.get('/results/my-results');
      setResults(res.data.results || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load past results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading your past results...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem' }}>
            My Quiz History & Records
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Review past scores, accuracy, and detailed question breakdowns
          </p>
        </div>
        <Link to="/dashboard" className="btn btn-secondary btn-sm">
          &larr; Back to Dashboard
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {results.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <span style={{ fontSize: '3rem' }}>📝</span>
          <h3 style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>No Quizzes Attempted Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            You haven't completed any quizzes so far. Visit your dashboard to attempt one!
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Explore Quizzes
          </Link>
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.925rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Quiz Title</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Score</th>
                <th style={{ padding: '1rem' }}>Percentage</th>
                <th style={{ padding: '1rem' }}>Date Attempted</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => {
                const isPass = r.percentage >= 50;
                const formattedDate = new Date(r.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={r._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>
                      {r.quiz?.title || 'Unknown Quiz'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-primary">{r.quiz?.category || 'General'}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <strong>{r.score}</strong> / {r.totalQuestions}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${isPass ? 'badge-success' : 'badge-danger'}`}>
                        {r.percentage}%
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {formattedDate}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <Link to={`/results/${r._id}`} className="btn btn-secondary btn-sm">
                        View Review &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyResults;
