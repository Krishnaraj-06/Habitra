import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileSetup.css';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    activeTime: '',
    dailyAvailability: '',
    habitIntensity: '',
    stressSensitivity: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save profile data to localStorage
    localStorage.setItem('userProfile', JSON.stringify(formData));
    localStorage.setItem('profileCompleted', 'true');
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  return (
    <div className="profile-setup">
      <motion.div 
        className="setup-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="setup-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1>Complete Your Profile</h1>
          <p>Complete your profile to personalize your dashboard.</p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="setup-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="activeTime">Preferred Active Time</label>
              <select
                id="activeTime"
                name="activeTime"
                value={formData.activeTime}
                onChange={handleChange}
                required
              >
                <option value="">Select preferred time</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dailyAvailability">Daily Availability (hours)</label>
              <select
                id="dailyAvailability"
                name="dailyAvailability"
                value={formData.dailyAvailability}
                onChange={handleChange}
                required
              >
                <option value="">Select availability</option>
                <option value="1-2">1-2 hours</option>
                <option value="3-4">3-4 hours</option>
                <option value="5-6">5-6 hours</option>
                <option value="7+">7+ hours</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="habitIntensity">Habit Intensity Level</label>
              <select
                id="habitIntensity"
                name="habitIntensity"
                value={formData.habitIntensity}
                onChange={handleChange}
                required
              >
                <option value="">Select intensity</option>
                <option value="beginner">Beginner</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="stressSensitivity">Stress Sensitivity</label>
              <select
                id="stressSensitivity"
                name="stressSensitivity"
                value={formData.stressSensitivity}
                onChange={handleChange}
                required
              >
                <option value="">Select sensitivity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${isFormValid ? 'active' : ''}`}
            disabled={!isFormValid}
          >
            Complete Profile
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;