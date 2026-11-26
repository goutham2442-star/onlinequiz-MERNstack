import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const QuizTaking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: selectedOption }
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch Quiz details
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
        // Duration in seconds
        setTimeLeft(quizData.duration * 60);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading quiz details');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (loading || submitting || timeLeft <= 0 || !quiz) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time runs out
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, submitting, timeLeft, quiz]);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Answer selection handler
  const handleOptionSelect = (option) => {
    const currentQ = questions[currentIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ._id]: option,
    }));
  };

  // Submission handler
  const handleFinalSubmit = async (auto = false) => {
    if (submitting) return;

    if (!auto) {
      const answeredCount = Object.keys(selectedAnswers).length;
      const totalCount = questions.length;
      const confirmMsg =
        answeredCount < totalCount
          ? `You have only answered ${answeredCount} of ${totalCount} questions. Are you sure you want to submit?`
          : 'Are you sure you want to finish and submit your quiz?';

      if (!window.confirm(confirmMsg)) {
        return;
      }
    }

    try {
      setSubmitting(true);

      // Build payload for backend
      const formattedAnswers = questions.map((q) => ({
        questionId: q._id,
        selectedOption: selectedAnswers[q._id] || '',
      }));

      const totalTimeSec = (quiz.duration * 60) - timeLeft;

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
        <p>Preparing quiz interface...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem' }}>
        <div className="alert alert-danger">{error}</div>
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
    <div style={{ maxWidth: '960px', margin: '1.5rem auto', padding: '0 1.25rem' }}>
      {/* Quiz Top Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1rem 1.5rem',
          borderLeft: '4px solid var(--primary)',
        }}
      >
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.2rem' }}>
            {quiz.title}
          </h2>
          <span className="badge badge-primary">{quiz.category}</span>
        </div>

        {/* Timer display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: timeLeft < 120 ? 'var(--danger-bg)' : 'var(--bg-muted)',
            color: timeLeft < 120 ? 'var(--danger)' : 'var(--text-main)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: '700',
            fontSize: '1.1rem',
          }}
        >
          <span>⏳ Time Remaining:</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          <span>
            Question <strong>{currentIndex + 1}</strong> of <strong>{questions.length}</strong>
          </span>
          <span>{answeredTotal} Answered ({progressPercent}%)</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              height: '100%',
              background: 'var(--primary)',
              transition: 'width 0.3s ease',
            }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <span className="badge badge-muted">Question #{currentIndex + 1}</span>
          <span className="badge badge-warning">{currentQ.difficulty || 'Medium'}</span>
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            lineHeight: 1.5,
            marginBottom: '1.75rem',
            color: 'var(--text-main)',
            fontWeight: 700,
          }}
        >
          {currentQ.questionText}
        </h3>

        {/* 4 Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQ._id] === option;
            const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

            return (
              <div
                key={idx}
                onClick={() => handleOptionSelect(option)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-muted)',
                    color: isSelected ? '#ffffff' : 'var(--text-main)',
                    flexShrink: 0,
                  }}
                >
                  {optionLetter}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: isSelected ? '600' : '400' }}>
                  {option}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation and Submission Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="btn btn-secondary"
          style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
        >
          &larr; Previous Question
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="btn btn-primary"
            >
              Next Question &rarr;
            </button>
          ) : (
            <button
              onClick={() => handleFinalSubmit(false)}
              disabled={submitting}
              className="btn btn-success btn-lg"
            >
              {submitting ? 'Evaluating Score...' : 'Submit Final Quiz ✅'}
            </button>
          )}
        </div>
      </div>

      {/* Question Number Quick Jump Grid */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
          Question Palette / Jump:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {questions.map((q, idx) => {
            const isAnswered = !!selectedAnswers[q._id];
            const isCurrent = idx === currentIndex;

            let bg = '#ffffff';
            let color = 'var(--text-main)';
            let border = '1px solid var(--border-color)';

            if (isCurrent) {
              border = '2px solid var(--primary)';
              bg = 'var(--primary-light)';
              color = 'var(--primary)';
            } else if (isAnswered) {
              bg = 'var(--success-bg)';
              color = '#065f46';
              border = '1px solid #a7f3d0';
            }

            return (
              <button
                key={q._id}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: bg,
                  color: color,
                  border: border,
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
