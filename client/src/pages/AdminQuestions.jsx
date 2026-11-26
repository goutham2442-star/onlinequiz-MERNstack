import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import api from '../services/api';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    category: 'Web Development',
    difficulty: 'Medium',
    explanation: '',
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/questions');
      setQuestions(res.data.questions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading questions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      category: 'Web Development',
      difficulty: 'Medium',
      explanation: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (q) => {
    setEditingId(q._id);
    setFormData({
      questionText: q.questionText,
      optionA: q.options[0] || '',
      optionB: q.options[1] || '',
      optionC: q.options[2] || '',
      optionD: q.options[3] || '',
      correctAnswer: q.correctAnswer,
      category: q.category,
      difficulty: q.difficulty || 'Medium',
      explanation: q.explanation || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/questions/${id}`);
      setSuccess('Question deleted successfully');
      setQuestions(questions.filter((q) => q._id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const options = [
      formData.optionA.trim(),
      formData.optionB.trim(),
      formData.optionC.trim(),
      formData.optionD.trim(),
    ];

    if (options.some((opt) => !opt)) {
      setError('All 4 options must be filled out');
      return;
    }

    if (!formData.correctAnswer) {
      setError('Please select or specify the correct answer');
      return;
    }

    if (!options.includes(formData.correctAnswer)) {
      setError('Correct answer must match one of the four options exactly');
      return;
    }

    const payload = {
      questionText: formData.questionText,
      options,
      correctAnswer: formData.correctAnswer,
      category: formData.category,
      difficulty: formData.difficulty,
      explanation: formData.explanation,
    };

    try {
      if (editingId) {
        const res = await api.put(`/questions/${editingId}`, payload);
        setQuestions(questions.map((q) => (q._id === editingId ? res.data.question : q)));
        setSuccess('Question updated successfully!');
      } else {
        const res = await api.post('/questions', payload);
        setQuestions([res.data.question, ...questions]);
        setSuccess('New question added to bank successfully!');
      }
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving question');
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '2rem auto', padding: '0 1.25rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      <AdminSidebar />

      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem' }}>
              Question Bank
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
              Add, update, and manage multiple-choice questions ({questions.length} total)
            </p>
          </div>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            + Add New Question
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Fetching questions...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.map((q, idx) => (
              <div key={q._id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className="badge badge-primary">{q.category}</span>
                    <span className="badge badge-warning">{q.difficulty}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleOpenEdit(q)} className="btn btn-secondary btn-sm">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(q._id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                  #{idx + 1}. {q.questionText}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {q.options.map((opt, i) => {
                    const isCorrect = opt === q.correctAnswer;
                    return (
                      <div
                        key={i}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.875rem',
                          backgroundColor: isCorrect ? 'var(--success-bg)' : 'var(--bg-muted)',
                          border: isCorrect ? '1px solid #a7f3d0' : '1px solid transparent',
                          fontWeight: isCorrect ? '600' : '400',
                          color: isCorrect ? '#065f46' : 'var(--text-main)',
                        }}
                      >
                        {String.fromCharCode(65 + i)}. {opt} {isCorrect && '✅'}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    💡 Explanation: {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal for Add / Edit */}
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
                maxWidth: '650px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '1.25rem' }}>
                {editingId ? 'Edit Question' : 'Create New Question'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Question Statement
                  </label>
                  <textarea
                    rows={3}
                    value={formData.questionText}
                    onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                      Option A
                    </label>
                    <input
                      type="text"
                      value={formData.optionA}
                      onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                      Option B
                    </label>
                    <input
                      type="text"
                      value={formData.optionB}
                      onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                      Option C
                    </label>
                    <input
                      type="text"
                      value={formData.optionC}
                      onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                      Option D
                    </label>
                    <input
                      type="text"
                      value={formData.optionD}
                      onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Select Correct Answer
                  </label>
                  <select
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: '#fff' }}
                    required
                  >
                    <option value="">-- Choose which option is correct --</option>
                    {formData.optionA && <option value={formData.optionA}>Option A: {formData.optionA}</option>}
                    {formData.optionB && <option value={formData.optionB}>Option B: {formData.optionB}</option>}
                    {formData.optionC && <option value={formData.optionC}>Option C: {formData.optionC}</option>}
                    {formData.optionD && <option value={formData.optionD}>Option D: {formData.optionD}</option>}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
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
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: '#fff' }}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Explanation / Solution Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Brief explanation shown after student submission"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Save Changes' : 'Add Question'}
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

export default AdminQuestions;
