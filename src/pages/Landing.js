import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../styles/Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [visibleSections, setVisibleSections] = useState({});
  
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);

  const features = [
    {
      title: "AI Burnout Prediction",
      description: "Advanced machine learning algorithms predict burnout risk before it happens",
      icon: "🧠",
      color: "#6366f1"
    },
    {
      title: "Smart Analytics", 
      description: "Deep insights into your habit patterns with personalized recommendations",
      icon: "📊",
      color: "#10b981"
    },
    {
      title: "Stress Monitoring",
      description: "Real-time stress level tracking with adaptive management strategies", 
      icon: "🎯",
      color: "#f59e0b"
    },
    {
      title: "Performance Tracking",
      description: "Comprehensive discipline scoring and progress visualization",
      icon: "📈",
      color: "#ef4444"
    },
    {
      title: "Habit Automation",
      description: "Intelligent habit scheduling and reminder system for consistency",
      icon: "⚡",
      color: "#8b5cf6"
    },
    {
      title: "Wellness Insights",
      description: "Holistic health analysis combining physical and mental metrics",
      icon: "💎",
      color: "#06b6d4"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'stats'];
      const newVisible = {};
      
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
          newVisible[sectionId] = isVisible;
        }
      });
      
      setVisibleSections(newVisible);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing">
      <div className="landing-container">
        {/* Hero Section */}
        <div className="hero-section">
          <motion.h1 
            className="brand-title"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2
            }}
          >
            HABITRA
          </motion.h1>
          
          <div className="main-headline">
            <motion.h2 
              className="headline-white"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
                delay: 0.6
              }}
            >
              Predict Burnout.
            </motion.h2>
            <motion.h2 
              className="headline-gradient"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
                delay: 0.8
              }}
            >
              Protect Discipline.
            </motion.h2>
          </div>
          
          <motion.p 
            className="subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              delay: 1.2
            }}
          >
            Analytics-driven habit tracking with stress prediction and adaptive management
          </motion.p>
          
          <motion.div 
            className="cta-buttons"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              delay: 1.4
            }}
          >
            <button 
              className="btn-register"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
            <button 
              className="btn-login"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="features-section" id="features">
          <div className={`features-content ${visibleSections.features ? 'visible' : ''}`}>
            <h3 className="features-title">
              Intelligent Habit Management
            </h3>
            
            <div className="features-grid">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`feature-card ${visibleSections.features ? 'visible' : ''}`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    '--feature-color': feature.color
                  }}
                >
                  <div className="feature-icon" style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                  <div className="feature-glow" style={{ backgroundColor: feature.color }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section" id="stats">
          <div className={`stats-content ${visibleSections.stats ? 'visible' : ''}`}>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">AI Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;