import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const QuizResult = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/results/${id}`);
        setResult(res.data.result);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching quiz result details');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading result summary...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem' }}>
        <div className="alert alert-danger">{error || 'Result not found'}</div>
        <Link to="/dashboard" className="btn btn-secondary">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const isPassed = result.percentage >= 50;

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1.25rem' }}>
      {/* Result Hero Card */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          borderRadius: '24px',
          background: isPassed
            ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
            : 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.15)',
        }}
      >
        <span style={{ fontSize: '3.5rem' }}>{isPassed ? '🏆' : '📚'}</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
          {isPassed ? 'Congratulations!' : 'Good Effort! Keep Learning.'}
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          You completed the quiz: <strong>{result.quiz?.title || 'Online Assessment'}</strong>
        </p>

        {/* Stats Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1rem',
            maxWidth: '650px',
            margin: '0 auto',
          }}
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{result.score} / {result.totalQuestions}</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.85 }}>Total Marks</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{result.percentage}%</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.85 }}>Percentage</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#a7f3d0' }}>{result.correctAnswers}</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.85 }}>Correct</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fecaca' }}>{result.incorrectAnswers}</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.85 }}>Incorrect</div>
          </div>
        </div>
      </div>

      {/* Navigation action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>
          Detailed Answer Breakdown ({result.selectedAnswers?.length || 0})
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/dashboard" className="btn btn-secondary">
            &larr; Back to Dashboard
          </Link>
          <Link to="/my-results" className="btn btn-primary">
            View All My Results
          </Link>
        </div>
      </div>

      {/* Detailed Question Review List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
        {result.selectedAnswers?.map((ans, idx) => {
          const q = ans.question;
          const isCorrect = ans.isCorrect;
          const hasAnswered = !!ans.selectedOption;

          return (
            <div
              key={idx}
              className="card"
              style={{
                borderLeft: isCorrect ? '5px solid var(--success)' : '5px solid var(--danger)',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-muted">Question #{idx + 1}</span>
                {isCorrect ? (
                  <span className="badge badge-success">✓ Correct (+1)</span>
                ) : (
                  <span className="badge badge-danger">✗ Incorrect (0)</span>
                )}
              </div>

              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                {q?.questionText || 'Question item'}
              </h4>

              {/* Options list showing what student picked vs correct */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {q?.options?.map((opt, optIdx) => {
                  const isSelectedByStudent = ans.selectedOption === opt;
                  const isTheCorrectAnswer = ans.correctOption === opt;

                  let optBg = '#ffffff';
                  let optBorder = '1px solid var(--border-color)';
                  let optColor = 'var(--text-main)';

                  if (isTheCorrectAnswer) {
                    optBg = 'var(--success-bg)';
                    optBorder = '1.5px solid var(--success)';
                    optColor = '#065f46';
                  } else if (isSelectedByStudent && !isCorrect) {
                    optBg = 'var(--danger-bg)';
                    optBorder = '1.5px solid var(--danger)';
                    optColor = '#991b1b';
                  }

                  return (
                    <div
                      key={optIdx}
                      style={{
                        padding: '0.65rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: optBg,
                        border: optBorder,
                        color: optColor,
                        fontSize: '0.925rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>
                        <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                      </span>
                      {isSelectedByStudent && (
                        <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>
                          (Your Selection)
                        </span>
                      )}
                      {isTheCorrectAnswer && !isSelectedByStudent && (
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--success)' }}>
                          (Correct Answer)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {!hasAnswered && (
                <div style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 600 }}>
                  ⚠️ You skipped this question.
                </div>
              )}

              {q?.explanation && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.5rem',
                  }}
                >
                  💡 <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResult;
