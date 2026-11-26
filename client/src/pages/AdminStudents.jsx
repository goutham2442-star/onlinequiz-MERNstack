import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import api from '../services/api';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/students');
      setStudents(res.data.students || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching registered students');
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
            Registered Students Directory
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            List of student accounts registered on the portal ({students.length} students)
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading student directory...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No student accounts registered yet.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.925rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.9rem 1.25rem' }}>#</th>
                    <th style={{ padding: '0.9rem' }}>Student Name</th>
                    <th style={{ padding: '0.9rem' }}>Email Address</th>
                    <th style={{ padding: '0.9rem' }}>Role</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st, idx) => (
                    <tr key={st._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td style={{ padding: '0.9rem', fontWeight: 600 }}>{st.name}</td>
                      <td style={{ padding: '0.9rem' }}>{st.email}</td>
                      <td style={{ padding: '0.9rem' }}>
                        <span className="badge badge-success">{st.role}</span>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {new Date(st.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminStudents;
