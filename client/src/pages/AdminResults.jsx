import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import api from '../services/api';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.get('/results');
      setResults(res.data.results || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching student scores');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '2rem auto', padding: '0 1.25rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      <AdminSidebar />

      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem' }}>
            All Student Quiz Submissions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Review performance, accuracy, and scores across all candidates ({results.length} attempts recorded)
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading submission logs...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No student submissions recorded yet.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.925rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Student Name</th>
                    <th style={{ padding: '0.9rem' }}>Quiz Title</th>
                    <th style={{ padding: '0.9rem' }}>Score</th>
                    <th style={{ padding: '0.9rem' }}>Correct / Total</th>
                    <th style={{ padding: '0.9rem' }}>Percentage</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => {
                    const isPass = r.percentage >= 50;
                    return (
                      <tr key={r._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <div style={{ fontWeight: 600 }}>{r.student?.name || 'Student'}</div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{r.student?.email}</div>
                        </td>
                        <td style={{ padding: '0.9rem', fontWeight: 500 }}>
                          {r.quiz?.title || 'Quiz'}
                        </td>
                        <td style={{ padding: '0.9rem', fontWeight: 700 }}>
                          {r.score}
                        </td>
                        <td style={{ padding: '0.9rem' }}>
                          {r.correctAnswers} / {r.totalQuestions}
                        </td>
                        <td style={{ padding: '0.9rem' }}>
                          <span className={`badge ${isPass ? 'badge-success' : 'badge-danger'}`}>
                            {r.percentage}%
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                          {new Date(r.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminResults;
