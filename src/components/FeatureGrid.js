import React from 'react';
import FeatureCard from './FeatureCard';
import '../styles/FeatureGrid.css';

const FeatureGrid = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Smart Tracking',
      description: 'AI-powered habit tracking with personalized insights'
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Detailed progress reports and streak analysis'
    },
    {
      icon: '🏆',
      title: 'Achievements',
      description: 'Unlock badges and celebrate your milestones'
    },
    {
      icon: '🤖',
      title: 'AI Coach',
      description: 'Get personalized recommendations and motivation'
    }
  ];

  return (
    <section className="feature-grid">
      <h2>Why Choose Habitra?</h2>
      <div className="features">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;