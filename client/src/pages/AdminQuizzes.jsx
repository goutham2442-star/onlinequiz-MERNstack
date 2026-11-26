import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import api from '../services/api';

const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    duration: 10,
    status: 'active',
    selectedQuestions: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, questionsRes] = await Promise.all([
        api.get('/quizzes'),
        api.get('/questions'),
      ]);
      setQuizzes(quizzesRes.data.quizzes || []);
      setAvailableQuestions(questionsRes.data.questions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      category: 'Web Development',
      duration: 10,
      status: 'active',
      selectedQuestions: [],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (quiz) => {
    setEditingId(quiz._id);
    setFormData({
      title: quiz.title,
      description: quiz.description || '',
      category: quiz.category,
      duration: quiz.duration,
      status: quiz.status || 'active',
      selectedQuestions: quiz.questions?.map((q) => q._id || q) || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await api.delete(`/quizzes/${id}`);
      setQuizzes(quizzes.filter((q) => q._id !== id));
      setSuccess('Quiz removed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete quiz');
    }
  };

  const handleToggleQuestionSelect = (qId) => {
    setFormData((prev) => {
      const exists = prev.selectedQuestions.includes(qId);
      const updated = exists
        ? prev.selectedQuestions.filter((id) => id !== qId)
        : [...prev.selectedQuestions, qId];
      return { ...prev, selectedQuestions: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.category) {
      setError('Please provide title and category');
      return;
    }

    if (formData.selectedQuestions.length === 0) {
      setError('Please select at least 1 question for the quiz');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      duration: Number(formData.duration),
      status: formData.status,
      questions: formData.selectedQuestions,
    };

    try {
      if (editingId) {
        const res = await api.put(`/quizzes/${editingId}`, payload);
        setQuizzes(quizzes.map((q) => (q._id === editingId ? res.data.quiz : q)));
        setSuccess('Quiz updated successfully');
      } else {
        const res = await api.post('/quizzes', payload);
        setQuizzes([res.data.quiz, ...quizzes]);
        setSuccess('New quiz created successfully');
      }
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving quiz');
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '2rem auto', padding: '0 1.25rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      <AdminSidebar />

      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem' }}>
              Quiz Management
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
              Assemble assessments by bundling questions from your question bank
            </p>
          </div>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            + Create New Quiz
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Loading quizzes...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="badge badge-primary">{quiz.category}</span>
                    <span className={`badge ${quiz.status === 'active' ? 'badge-success' : 'badge-muted'}`}>
                      {quiz.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleOpenEdit(quiz)} className="btn btn-secondary btn-sm">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(quiz._id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{quiz.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {quiz.description || 'No description provided.'}
                </p>

                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <span>📋 <strong>{quiz.questions?.length || 0}</strong> Questions</span>
                  <span>⏱️ <strong>{quiz.duration}</strong> Minutes</span>
                  <span>🎯 <strong>{quiz.totalMarks || quiz.questions?.length || 0}</strong> Max Marks</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Create/Edit Quiz */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
          >
            <div
              className="card"
              style={{
                width: '100%',
                maxWidth: '700px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '1.25rem' }}>
                {editingId ? 'Edit Quiz Details' : 'Create New Quiz'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. JavaScript ES6 Mastery Test"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short instructions or syllabus covered"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: '#fff' }}
                    >
                      <option value="active">Active (Visible to students)</option>
                      <option value="inactive">Draft / Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Question Selection Checklist */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      Select Questions ({formData.selectedQuestions.length} selected):
                    </label>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Total Marks = {formData.selectedQuestions.length}
                    </span>
                  </div>

                  <div
                    style={{
                      maxHeight: '220px',
                      overflowY: 'auto',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      background: 'var(--bg-muted)',
                    }}
                  >
                    {availableQuestions.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                        No questions in question bank. Create questions first.
                      </p>
                    ) : (
                      availableQuestions.map((q) => {
                        const isChecked = formData.selectedQuestions.includes(q._id);
                        return (
                          <label
                            key={q._id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '4px',
                              background: isChecked ? 'var(--primary-light)' : '#ffffff',
                              border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleQuestionSelect(q._id)}
                            />
                            <div style={{ flex: 1 }}>
                              <span>{q.questionText}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                                [{q.category} &bull; {q.difficulty}]
                              </span>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Save Quiz' : 'Create Quiz'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminQuizzes;
