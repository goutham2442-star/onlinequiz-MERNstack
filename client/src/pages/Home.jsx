import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '4.5rem 2.5rem',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '3.5rem',
        }}
      >
        <span
          className="badge"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            marginBottom: '1.25rem',
            padding: '0.4rem 1rem',
            fontSize: '0.85rem',
          }}
        >
          🚀 Academic Year 2026 MERN Project
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: '800',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
          }}
        >
          Master Technical Skills with <br /> Real-Time Online Quizzes
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            maxWidth: '680px',
            margin: '0 auto 2.25rem auto',
            color: '#e0e7ff',
            lineHeight: 1.6,
          }}
        >
          A full-stack examination portal featuring role-based access for students and faculty.
          Experience timed tests, secure backend score evaluation, and comprehensive answer analytics.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/register"
            className="btn btn-lg"
            style={{
              backgroundColor: '#ffffff',
              color: 'var(--primary)',
              fontWeight: '700',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            Get Started as Student &rarr;
          </Link>
          <Link
            to="/login"
            className="btn btn-lg"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            Sign In to Account
          </Link>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Engineered for Interactive Academic Testing
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Robust architecture with full student and admin capabilities
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem',
        }}
      >
        <div className="card card-hover">
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏱️</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>One-by-One Navigation</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Answer multiple choice questions with intuitive next and previous controls, jump navigation, and progress tracking.
          </p>
        </div>

        <div className="card card-hover">
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Anti-Tamper Backend</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Correct answers are never exposed to the client bundle. The server computes grades, percentage, and verifies single-attempt limits.
          </p>
        </div>

        <div className="card card-hover">
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>In-Depth Analysis</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Get instant breakdown of correct vs incorrect options, scores, percentages, and teacher explanations right after submission.
          </p>
        </div>

        <div className="card card-hover">
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Faculty Admin Control</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Instructors can manage questions, assemble custom quizzes, monitor student attempts, and analyze performance data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
