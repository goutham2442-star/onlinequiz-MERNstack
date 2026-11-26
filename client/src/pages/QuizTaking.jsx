import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const QuizTaking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/quizzes/${id}`);
        const quizData = res.data.quiz;

        if (!quizData) {
          setError('Quiz not found');
          return;
        }

        if (!quizData.questions || quizData.questions.length === 0) {
          setError('This quiz has no questions assigned yet.');
          return;
        }

        setQuiz(quizData);
        setQuestions(quizData.questions);
        setTimeLeft(quizData.duration * 60);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading quiz details');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (loading || submitting || timeLeft <= 0 || !quiz) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, submitting, timeLeft, quiz]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (option) => {
    const currentQ = questions[currentIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ._id]: option,
    }));
  };

  const handleFinalSubmit = async (auto = false) => {
    if (submitting) return;

    if (!auto) {
      const answeredCount = Object.keys(selectedAnswers).length;
      const totalCount = questions.length;
      const confirmMsg =
        answeredCount < totalCount
          ? `You have answered ${answeredCount} of ${totalCount} questions. Submit anyway?`
          : 'Are you ready to submit your exam for evaluation?';

      if (!window.confirm(confirmMsg)) return;
    }

    try {
      setSubmitting(true);
      const formattedAnswers = questions.map((q) => ({
        questionId: q._id,
        selectedOption: selectedAnswers[q._id] || '',
      }));

      const totalTimeSec = quiz.duration * 60 - timeLeft;

      const res = await api.post('/results/submit', {
        quizId: quiz._id,
        answers: formattedAnswers,
        timeTakenSeconds: totalTimeSec > 0 ? totalTimeSec : 1,
      });

      if (res.data.success) {
        navigate(`/results/${res.data.result._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Submission error. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading examination environment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '640px', margin: '4rem auto', padding: '0 1rem' }}>
        <div className="alert alert-danger" style={{ borderRadius: '16px' }}>{error}</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          &larr; Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredTotal = Object.keys(selectedAnswers).length;
  const progressPercent = ((answeredTotal / questions.length) * 100).toFixed(0);

  return (
    <div style={{ maxWidth: '1020px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Top Banner with Quiz Info & Floating Timer */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '1.75rem',
          padding: '1.25rem 2rem',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-md)',
          borderLeft: '5px solid var(--primary)',
          background: '#ffffff',
        }}
      >
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            {quiz.category}
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800 }}>
            {quiz.title}
          </h2>
        </div>

        {/* Dynamic Countdown Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: timeLeft < 120 ? 'var(--danger-bg)' : '#f8fafc',
            color: timeLeft < 120 ? 'var(--danger-text)' : 'var(--text-main)',
            border: timeLeft < 120 ? '1px solid var(--danger-border)' : '1px solid var(--border-subtle)',
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '1.2rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span>⏱️</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem',
          }}
        >
          <span>
            Question <strong>{currentIndex + 1}</strong> of <strong>{questions.length}</strong>
          </span>
          <span style={{ color: 'var(--primary)' }}>
            {answeredTotal} answered ({progressPercent}%)
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '10px',
            background: '#e2e8f0',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
              transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          ></div>
        </div>
      </div>

      {/* Main Question Card */}
      <div
        className="card"
        style={{
          padding: '2.5rem',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '2rem',
          background: '#ffffff',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span
            className="badge badge-muted"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
          >
            QUESTION {currentIndex + 1}
          </span>
          <span className="badge badge-warning">{currentQ.difficulty || 'Medium'}</span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            lineHeight: 1.45,
            fontWeight: 700,
            marginBottom: '2rem',
            color: 'var(--text-main)',
          }}
        >
          {currentQ.questionText}
        </h3>

        {/* 4 Interactive Option Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQ._id] === option;
            const letter = String.fromCharCode(65 + idx);

            return (
              <div
                key={idx}
                onClick={() => handleOptionSelect(option)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.15rem 1.5rem',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.06)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? '0 4px 14px rgba(99, 102, 241, 0.15)' : 'none',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '0.95rem',
                    background: isSelected ? 'var(--primary)' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  {letter}
                </div>
                <div
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: isSelected ? '700' : '500',
                    color: isSelected ? 'var(--primary-dark)' : 'var(--text-main)',
                  }}
                >
                  {option}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem',
        }}
      >
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="btn btn-secondary"
          style={{ opacity: currentIndex === 0 ? 0.4 : 1, padding: '0.8rem 1.6rem' }}
        >
          &larr; Previous Question
        </button>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="btn btn-primary"
              style={{ padding: '0.8rem 1.8rem' }}
            >
              Next Question &rarr;
            </button>
          ) : (
            <button
              onClick={() => handleFinalSubmit(false)}
              disabled={submitting}
              className="btn btn-success btn-lg"
              style={{ padding: '0.85rem 2.25rem' }}
            >
              {submitting ? 'Submitting...' : 'Submit Final Quiz ✅'}
            </button>
          )}
        </div>
      </div>

      {/* Interactive Jump Palette Grid */}
      <div className="card" style={{ padding: '1.75rem', borderRadius: '20px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Question Navigation Palette:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          {questions.map((q, idx) => {
            const isAnswered = !!selectedAnswers[q._id];
            const isCurrent = idx === currentIndex;

            let bg = '#ffffff';
            let color = 'var(--text-main)';
            let border = '1px solid var(--border-subtle)';

            if (isCurrent) {
              border = '2px solid var(--primary)';
              bg = 'rgba(99, 102, 241, 0.12)';
              color = 'var(--primary)';
            } else if (isAnswered) {
              bg = 'var(--success-bg)';
              color = 'var(--success-text)';
              border = '1px solid var(--success-border)';
            }

            return (
              <button
                key={q._id}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: bg,
                  color: color,
                  border: border,
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;
