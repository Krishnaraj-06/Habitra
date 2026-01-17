import React from 'react';
import { motion } from 'framer-motion';
import '../styles/FeatureCard.css';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="feature-card"
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;