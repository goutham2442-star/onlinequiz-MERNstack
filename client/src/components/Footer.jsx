import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1rem',
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>
              QuizMaster Engine
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Full Stack Academic Examination & Assessment Platform
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Powered by</span>
          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>MongoDB</span>
          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>Express</span>
          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>React 18</span>
          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>Node.js</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
