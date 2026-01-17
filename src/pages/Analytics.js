import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import '../styles/Analytics.css';

const Analytics = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Habits', value: '12', icon: '🎯' },
    { label: 'Current Streak', value: '7 days', icon: '🔥' },
    { label: 'Completion Rate', value: '85%', icon: '📊' },
    { label: 'Best Streak', value: '21 days', icon: '🏆' }
  ];

  return (
    <div className="analytics">
      <header className="analytics-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Analytics & Insights</h1>
      </header>

      <div className="analytics-content">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <GlassCard key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="chart-card">
          <h3>Weekly Progress</h3>
          <div className="chart-placeholder">
            <p>📈 Chart visualization coming soon!</p>
          </div>
        </GlassCard>

        <GlassCard className="insights-card">
          <h3>AI Insights</h3>
          <div className="insights">
            <p>🤖 You're doing great! Your consistency has improved by 23% this week.</p>
            <p>💡 Try adding a morning routine to boost your success rate.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;