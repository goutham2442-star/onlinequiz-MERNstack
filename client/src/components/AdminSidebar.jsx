import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const getLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    fontSize: '0.925rem',
    color: isActive ? '#ffffff' : 'var(--text-muted)',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    transition: 'all 0.15s ease',
  });

  return (
    <aside
      className="card"
      style={{
        width: '260px',
        flexShrink: 0,
        height: 'fit-content',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div style={{ padding: '0.5rem 0.5rem 1rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>Admin Operations</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Faculty Control Deck</div>
      </div>

      <NavLink to="/admin/dashboard" style={getLinkStyle}>
        <span>📊</span> Dashboard Overview
      </NavLink>

      <NavLink to="/admin/questions" style={getLinkStyle}>
        <span>❓</span> Question Bank
      </NavLink>

      <NavLink to="/admin/quizzes" style={getLinkStyle}>
        <span>📑</span> Quiz Management
      </NavLink>

      <NavLink to="/admin/results" style={getLinkStyle}>
        <span>📈</span> Student Results
      </NavLink>

      <NavLink to="/admin/students" style={getLinkStyle}>
        <span>👥</span> Registered Students
      </NavLink>
    </aside>
  );
};

export default AdminSidebar;
