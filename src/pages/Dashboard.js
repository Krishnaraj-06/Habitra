import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartTracking from './SmartTracking';
import AIChatbot from '../components/AIChatbot';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(null);
  const [habits, setHabits] = useState([]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    const profileCompleted = localStorage.getItem('profileCompleted');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (!profileCompleted) {
      navigate('/profile-setup');
      return;
    }

    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setUserProfile(profile);
    
    // Load habits from localStorage or start empty
    const savedHabits = JSON.parse(localStorage.getItem('userHabits') || '[]');
    setHabits(savedHabits);
  }, [navigate]);

  const getMetrics = () => {
    if (!userProfile || habits.length === 0) {
      return { consistency: 0, streak: 0, discipline: 0, stress: 'Low' };
    }
    
    const completedToday = habits.filter(h => h.completed).length;
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    
    // Calculate average streak
    const avgStreak = habits.length > 0 ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) : 0;
    
    // Calculate discipline based on completion and streaks
    let discipline = 0;
    if (habits.length > 0) {
      const streakScore = Math.min(avgStreak / 10, 1) * 5; // Max 5 points for streaks
      const completionScore = (completionRate / 100) * 5; // Max 5 points for today's completion
      discipline = Math.round((streakScore + completionScore) * 10) / 10;
    }
    
    // Determine stress based on completion and intensity
    let stressLevel = 'Low';
    if (userProfile.stressSensitivity === 'high') {
      if (completionRate < 60) stressLevel = 'High';
      else if (completionRate < 80) stressLevel = 'Medium';
    } else if (userProfile.stressSensitivity === 'medium') {
      if (completionRate < 40) stressLevel = 'High';
      else if (completionRate < 70) stressLevel = 'Medium';
    } else {
      if (completionRate < 30) stressLevel = 'Medium';
    }

    return {
      consistency: completionRate,
      streak: avgStreak,
      discipline: discipline,
      stress: stressLevel
    };
  };

  const metrics = getMetrics();

  const addHabit = () => {
    if (newHabit.trim()) {
      const newHabits = [...habits, {
        id: Date.now(),
        name: newHabit,
        streak: 0,
        completed: false,
        createdAt: new Date().toISOString()
      }];
      setHabits(newHabits);
      localStorage.setItem('userHabits', JSON.stringify(newHabits));
      setNewHabit('');
      setShowAddHabit(false);
    }
  };

  const toggleHabit = (id) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completed;
        return {
          ...habit,
          completed: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
    localStorage.setItem('userHabits', JSON.stringify(updatedHabits));
  };

  const deleteHabit = (id) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits);
    localStorage.setItem('userHabits', JSON.stringify(updatedHabits));
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!userProfile) {
    return <div className="loading">Loading...</div>;
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'tracking':
        return <SmartTracking />;
      case 'profile':
        return (
          <div className="tab-content">
            <div className="profile-header">
              <h2>Profile Settings</h2>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={userProfile.fullName} readOnly />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={userProfile.email} readOnly />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Active Time</label>
                  <input type="text" value={userProfile.activeTime} readOnly />
                </div>
                <div className="form-group">
                  <label>Daily Availability</label>
                  <input type="text" value={userProfile.dailyAvailability} readOnly />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Habit Intensity</label>
                  <input type="text" value={userProfile.habitIntensity} readOnly />
                </div>
                <div className="form-group">
                  <label>Stress Sensitivity</label>
                  <input type="text" value={userProfile.stressSensitivity} readOnly />
                </div>
              </div>
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div className="tab-content">
            <h2>AI Analysis</h2>
            <div className="analysis-layout">
              <div className="analysis-cards">
                <div className="analysis-card">
                  <h3>Current Status</h3>
                  <p>{habits.length === 0 ? 'No habits added yet. Start by adding your first habit!' : `You have ${habits.length} active habits with ${metrics.consistency}% completion rate today.`}</p>
                  <div className="confidence">Real-time data</div>
                </div>
                <div className="analysis-card">
                  <h3>Performance Insights</h3>
                  <p>{habits.length === 0 ? 'Add habits to see personalized insights based on your patterns.' : `Your ${userProfile.habitIntensity} intensity level shows discipline score of ${metrics.discipline}/10.`}</p>
                  <div className="confidence">Live analysis</div>
                </div>
                <div className="analysis-card">
                  <h3>Recommendations</h3>
                  <p>{habits.length === 0 ? 'Start with 2-3 simple habits that match your daily routine.' : `Focus on ${userProfile.activeTime} timing for optimal results with your ${userProfile.dailyAvailability} schedule.`}</p>
                  <div className="confidence">Personalized</div>
                </div>
              </div>
              
              <div className="chatbot-section">
                <AIChatbot 
                  userProfile={userProfile}
                  metrics={metrics}
                  habits={habits}
                />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="hero-section">
              <div className="hero-content">
                <div className="hero-left">
                  <p className="welcome-text">WELCOME BACK, {userProfile.fullName.toUpperCase()}</p>
                  <h1 className="hero-title">
                    Optimize<br />
                    Your Metrics
                  </h1>
                  <button className="view-progress-btn">View Progress</button>
                </div>
                <div className="hero-right">
                  <div className="profile-circle"></div>
                </div>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">
                  {metrics.consistency}<span className="metric-unit">%</span>
                </div>
                <div className="metric-label">TODAY'S COMPLETION</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">
                  {metrics.streak}<span className="metric-unit">avg</span>
                </div>
                <div className="metric-label">AVERAGE STREAK</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">
                  {metrics.discipline}<span className="metric-unit">/10</span>
                </div>
                <div className="metric-label">DISCIPLINE SCORE</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">
                  {metrics.stress}<span className="metric-unit"></span>
                </div>
                <div className="metric-label">STRESS LEVEL</div>
              </div>
            </div>

            <div className="dashboard-sections">
              <div className="habits-section">
                <div className="section-header">
                  <h3>Your Habits ({habits.length})</h3>
                  <button 
                    className="add-habit-btn"
                    onClick={() => setShowAddHabit(true)}
                  >
                    + Add Habit
                  </button>
                </div>
                
                {showAddHabit && (
                  <div className="add-habit-form">
                    <input
                      type="text"
                      placeholder="Enter habit name (e.g., Morning Walk)"
                      value={newHabit}
                      onChange={(e) => setNewHabit(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                    />
                    <button onClick={addHabit}>Add</button>
                    <button onClick={() => setShowAddHabit(false)}>Cancel</button>
                  </div>
                )}

                {habits.length === 0 ? (
                  <div className="empty-habits">
                    <p>No habits added yet. Click "Add Habit" to get started!</p>
                  </div>
                ) : (
                  <div className="habits-list">
                    {habits.map((habit) => (
                      <div key={habit.id} className={`habit-item ${habit.completed ? 'completed' : ''}`}>
                        <div className="habit-info">
                          <span className="habit-name">{habit.name}</span>
                          <span className="habit-streak">{habit.streak} day streak</span>
                        </div>
                        <div className="habit-actions">
                          <button 
                            className={`complete-btn ${habit.completed ? 'completed' : ''}`}
                            onClick={() => toggleHabit(habit.id)}
                          >
                            {habit.completed ? '✓' : '○'}
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => deleteHabit(habit.id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="charts-section">
                <div className="performance-chart">
                  <div className="chart-header">
                    <h3>Performance Trend</h3>
                    <select className="time-selector">
                      <option>Live Data</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                    </select>
                  </div>
                  <div className="chart-container">
                    {habits.length === 0 ? (
                      <div className="empty-chart">
                        <p>Add habits to see your performance trends</p>
                      </div>
                    ) : (
                      <svg viewBox="0 0 600 200" className="trend-svg">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <path
                          d={`M 50 ${180 - metrics.consistency * 1.2} L 150 ${170 - metrics.consistency * 1.1} L 250 ${160 - metrics.consistency} L 350 ${150 - metrics.consistency * 0.9} L 450 ${140 - metrics.consistency * 0.8} L 550 ${130 - metrics.consistency * 0.7}`}
                          stroke="#6366f1"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="550" cy={130 - metrics.consistency * 0.7} r="4" fill="#6366f1"/>
                      </svg>
                    )}
                  </div>
                </div>

                <div className="burnout-risk">
                  <h3>Stress Level</h3>
                  <div className="risk-gauge">
                    <svg viewBox="0 0 200 120" className="gauge-svg">
                      <path
                        d="M 30 100 A 70 70 0 0 1 170 100"
                        stroke="#333333"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d={`M 30 100 A 70 70 0 0 0 ${metrics.stress === 'Low' ? '65' : metrics.stress === 'Medium' ? '100' : '135'} ${metrics.stress === 'Low' ? '45' : metrics.stress === 'Medium' ? '30' : '45'}`}
                        stroke={metrics.stress === 'Low' ? '#10b981' : metrics.stress === 'Medium' ? '#f59e0b' : '#ef4444'}
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="risk-text">
                      <div className="risk-status">{metrics.stress} Stress</div>
                      <div className="risk-percentage">{habits.length > 0 ? `${metrics.consistency}%` : '0%'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>HABITRA</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'tracking' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracking')}
          >
            Smart Tracking
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`nav-item ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            AI Analysis
          </button>
        </nav>
      </div>
      
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;