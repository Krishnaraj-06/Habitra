import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <motion.section 
      className="hero"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="hero-content">
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          🎯 Build Better Habits with <span className="gradient-text">Habitra</span>
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Your AI-powered companion for tracking habits, building streaks, and achieving your goals
        </motion.p>
        
        <motion.div 
          className="hero-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <button className="cta-button">
            Start Your Journey
          </button>
        </motion.div>
      </div>
      
      <div className="hero-visual">
        <div className="floating-cards">
          <div className="habit-card">💪 Workout</div>
          <div className="habit-card">📚 Reading</div>
          <div className="habit-card">🧘 Meditation</div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;