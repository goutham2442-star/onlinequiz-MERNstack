import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Hero Section */}
      <div
        className="hero-mesh"
        style={{
          color: '#ffffff',
          borderRadius: '32px',
          padding: '5rem 3rem',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
          marginBottom: '4.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              padding: '0.45rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.75rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>✨</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e0e7ff', letterSpacing: '0.02em' }}>
              Academic Year 2026 MERN Capstone Project
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            Next-Generation <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #a5b4fc 0%, #38bdf8 50%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Interactive Online Quizzing
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.25rem',
              maxWidth: '680px',
              margin: '0 auto 2.75rem auto',
              color: '#cbd5e1',
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            A high-performance assessment suite for universities and colleges.
            Delivers anti-tamper server-side grading, real-time question palettes, and faculty control.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="btn btn-lg"
              style={{
                background: '#ffffff',
                color: '#1e1b4b',
                fontWeight: 700,
                boxShadow: '0 10px 25px -5px rgba(255, 255, 255, 0.4)',
              }}
            >
              Launch Student Demo &rarr;
            </Link>
            <Link
              to="/login"
              className="btn btn-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              Faculty Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Bento Grid Highlights */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Engineered for Modern Examination
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore key design pillars that set QuizMaster apart from basic academic assignments.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          marginBottom: '5rem',
        }}
      >
        <div className="card card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(99, 102, 241, 0.12)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              marginBottom: '1.25rem',
            }}
          >
            ⏱️
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            One-by-One Navigation & Palette
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Distraction-free focus displaying one question at a time. Candidates can jump to any question via a live-updating visual color palette.
          </p>
        </div>

        <div className="card card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              marginBottom: '1.25rem',
            }}
          >
            🛡️
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Server-Side Grade Engine
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Eliminates inspection cheats. Correct answers are stripped from student APIs and verified strictly on the Express backend against MongoDB.
          </p>
        </div>

        <div className="card card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(236, 72, 153, 0.12)',
              color: 'var(--accent-pink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              marginBottom: '1.25rem',
            }}
          >
            📊
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Instant Solution Analytics
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Receive comprehensive question-by-question post-submission reviews, comparing student selections with correct options and teacher explanations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
