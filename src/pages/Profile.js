import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2024-01-15',
    totalHabits: 12,
    longestStreak: 21
  });
  const navigate = useNavigate();

  return (
    <div className="profile">
      <header className="profile-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Profile</h1>
      </header>

      <div className="profile-content">
        <GlassCard className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.name.charAt(0)}
            </div>
          </div>
          
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p className="join-date">Member since {user.joinDate}</p>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{user.totalHabits}</span>
              <span className="stat-label">Total Habits</span>
            </div>
            <div className="stat">
              <span className="stat-number">{user.longestStreak}</span>
              <span className="stat-label">Longest Streak</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="settings-card">
          <h3>Settings</h3>
          <div className="settings-options">
            <button className="setting-btn">🔔 Notifications</button>
            <button className="setting-btn">🎨 Theme</button>
            <button className="setting-btn">📱 Export Data</button>
            <button className="setting-btn logout">🚪 Logout</button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Profile;