import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const getLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.85rem 1.15rem',
    borderRadius: '14px',
    fontWeight: '700',
    fontSize: '0.925rem',
    color: isActive ? '#ffffff' : 'var(--text-muted)',
    background: isActive ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
    boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  });

  return (
    <aside
      className="card"
      style={{
        width: '270px',
        flexShrink: 0,
        height: 'fit-content',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-sm)',
        background: '#ffffff',
      }}
    >
      <div style={{ padding: '0.25rem 0.5rem 1.25rem 0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
          Faculty Deck
        </div>
        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Admin & Course Management
        </div>
      </div>

      <NavLink to="/admin/dashboard" style={getLinkStyle}>
        <span style={{ fontSize: '1.15rem' }}>📊</span> Overview
      </NavLink>

      <NavLink to="/admin/questions" style={getLinkStyle}>
        <span style={{ fontSize: '1.15rem' }}>❓</span> Question Bank
      </NavLink>

      <NavLink to="/admin/quizzes" style={getLinkStyle}>
        <span style={{ fontSize: '1.15rem' }}>📑</span> Quiz Builder
      </NavLink>

      <NavLink to="/admin/results" style={getLinkStyle}>
        <span style={{ fontSize: '1.15rem' }}>📈</span> Student Scores
      </NavLink>

      <NavLink to="/admin/students" style={getLinkStyle}>
        <span style={{ fontSize: '1.15rem' }}>👥</span> Student Directory
      </NavLink>
    </aside>
  );
};

export default AdminSidebar;
