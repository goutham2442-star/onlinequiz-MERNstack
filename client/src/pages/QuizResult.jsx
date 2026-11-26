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
        <p>Generating your performance breakdown...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '0 1rem' }}>
        <div className="alert alert-danger" style={{ borderRadius: '16px' }}>{error || 'Result not found'}</div>
        <Link to="/dashboard" className="btn btn-secondary">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const isPassed = result.percentage >= 50;

  return (
    <div style={{ maxWidth: '1020px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
      {/* Result Hero Banner */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '3.5rem 2rem',
          borderRadius: '32px',
          background: isPassed
            ? 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)'
            : 'linear-gradient(135deg, #881337 0%, #9f1239 50%, #be123c 100%)',
          color: '#ffffff',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <span style={{ fontSize: '4.5rem', display: 'inline-block', marginBottom: '0.75rem' }}>
          {isPassed ? '🏆' : '📚'}
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}
        >
          {isPassed ? 'Outstanding Performance!' : 'Assessment Concluded'}
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.15rem', marginBottom: '2.5rem' }}>
          Completed: <strong>{result.quiz?.title || 'Academic Assessment'}</strong>
        </p>

        {/* 4 Score Badges Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1.25rem',
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '1.25rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div style={{ fontSize: '2.2rem', fontWeight: '800' }}>
              {result.score} / {result.totalQuestions}
            </div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85, marginTop: '0.2rem' }}>
              Total Marks
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '1.25rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div style={{ fontSize: '2.2rem', fontWeight: '800' }}>{result.percentage}%</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85, marginTop: '0.2rem' }}>
              Accuracy Grade
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '1.25rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#6ee7b7' }}>
              {result.correctAnswers}
            </div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85, marginTop: '0.2rem' }}>
              Correct
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '1.25rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fca5a5' }}>
              {result.incorrectAnswers}
            </div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85, marginTop: '0.2rem' }}>
              Incorrect
            </div>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>
            Question-by-Question Solution Breakdown
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Compare your selections against verified correct options
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/dashboard" className="btn btn-secondary">
            &larr; Dashboard
          </Link>
          <Link to="/my-results" className="btn btn-primary">
            Past Results
          </Link>
        </div>
      </div>

      {/* Questions Solution List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
        {result.selectedAnswers?.map((ans, idx) => {
          const q = ans.question;
          const isCorrect = ans.isCorrect;
          const hasAnswered = !!ans.selectedOption;

          return (
            <div
              key={idx}
              className="card"
              style={{
                borderRadius: '20px',
                borderLeft: isCorrect ? '6px solid var(--success)' : '6px solid var(--danger)',
                padding: '2rem',
                background: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="badge badge-muted" style={{ fontFamily: 'var(--font-mono)' }}>
                  QUESTION {idx + 1}
                </span>
                {isCorrect ? (
                  <span className="badge badge-success">✓ Correct (+1 Mark)</span>
                ) : (
                  <span className="badge badge-danger">✗ Incorrect (0 Marks)</span>
                )}
              </div>

              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', lineHeight: 1.4 }}>
                {q?.questionText || 'Question item'}
              </h4>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                {q?.options?.map((opt, optIdx) => {
                  const isSelectedByStudent = ans.selectedOption === opt;
                  const isTheCorrectAnswer = ans.correctOption === opt;

                  let optBg = '#ffffff';
                  let optBorder = '1px solid var(--border-subtle)';
                  let optColor = 'var(--text-main)';

                  if (isTheCorrectAnswer) {
                    optBg = 'var(--success-bg)';
                    optBorder = '1.5px solid var(--success)';
                    optColor = 'var(--success-text)';
                  } else if (isSelectedByStudent && !isCorrect) {
                    optBg = 'var(--danger-bg)';
                    optBorder = '1.5px solid var(--danger)';
                    optColor = 'var(--danger-text)';
                  }

                  return (
                    <div
                      key={optIdx}
                      style={{
                        padding: '0.85rem 1.25rem',
                        borderRadius: '12px',
                        backgroundColor: optBg,
                        border: optBorder,
                        color: optColor,
                        fontSize: '0.95rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: isTheCorrectAnswer || isSelectedByStudent ? 700 : 500,
                      }}
                    >
                      <span>
                        <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                      </span>
                      {isSelectedByStudent && (
                        <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>
                          (Your Selection)
                        </span>
                      )}
                      {isTheCorrectAnswer && !isSelectedByStudent && (
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--success)' }}>
                          (Correct Answer)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {!hasAnswered && (
                <div style={{ fontSize: '0.875rem', color: 'var(--danger)', fontWeight: 700, marginBottom: '0.75rem' }}>
                  ⚠️ You skipped answering this question.
                </div>
              )}

              {q?.explanation && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  💡 <strong>Instructor Note:</strong> {q.explanation}
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
