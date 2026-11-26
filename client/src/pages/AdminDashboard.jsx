import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalQuizzes: 0,
    totalStudents: 0,
    totalSubmissions: 0,
  });
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  const fetchAdminOverview = async () => {
    try {
      setLoading(true);
      const [questionsRes, quizzesRes, studentsRes, resultsRes] = await Promise.all([
        api.get('/questions'),
        api.get('/quizzes'),
        api.get('/auth/students'),
        api.get('/results'),
      ]);

      setStats({
        totalQuestions: questionsRes.data.count || 0,
        totalQuizzes: quizzesRes.data.count || 0,
        totalStudents: studentsRes.data.count || 0,
        totalSubmissions: resultsRes.data.count || 0,
      });

      setRecentResults(resultsRes.data.results?.slice(0, 5) || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching admin metrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '2rem auto', padding: '0 1.25rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      <AdminSidebar />

      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem' }}>
            Faculty & Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Manage questions, assemble academic quizzes, and monitor student metrics
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* 4 Metric Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2.5rem',
              }}
            >
              <div className="card" style={{ borderLeft: '4px solid #4f46e5' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Questions</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{stats.totalQuestions}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.25rem' }}>Bank size</div>
              </div>

              <div className="card" style={{ borderLeft: '4px solid #06b6d4' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Live Quizzes</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{stats.totalQuizzes}</div>
                <div style={{ fontSize: '0.75rem', color: '#0891b2', marginTop: '0.25rem' }}>Published tests</div>
              </div>

              <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Students Registered</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{stats.totalStudents}</div>
                <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem' }}>Active learners</div>
              </div>

              <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Submissions</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>{stats.totalSubmissions}</div>
                <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '0.25rem' }}>Completed attempts</div>
              </div>
            </div>

            {/* Recent Submissions Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Student Submissions</h3>
              </div>

              {recentResults.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No quiz submissions logged yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '0.75rem 1.25rem' }}>Student Name</th>
                        <th style={{ padding: '0.75rem' }}>Quiz Title</th>
                        <th style={{ padding: '0.75rem' }}>Score</th>
                        <th style={{ padding: '0.75rem' }}>Percentage</th>
                        <th style={{ padding: '0.75rem 1.25rem' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentResults.map((r) => (
                        <tr key={r._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.75rem 1.25rem', fontWeight: 600 }}>
                            {r.student?.name || 'Student'}
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.student?.email}</div>
                          </td>
                          <td style={{ padding: '0.75rem' }}>{r.quiz?.title || 'Quiz'}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 600 }}>{r.score} / {r.totalQuestions}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span className={`badge ${r.percentage >= 50 ? 'badge-success' : 'badge-danger'}`}>
                              {r.percentage}%
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
