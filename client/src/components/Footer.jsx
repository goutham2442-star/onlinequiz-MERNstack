import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <strong>QuizMaster</strong> &mdash; Modern Online Quiz Application (B.Tech Capstone / Demonstration Project)
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          MERN Stack (MongoDB, Express, React, Node.js)
        </div>
      </div>
    </footer>
  );
};

export default Footer;
