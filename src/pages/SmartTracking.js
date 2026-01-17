import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/SmartTracking.css';

const SmartTracking = () => {
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [permissions, setPermissions] = useState({
    deviceMotion: false,
    geolocation: false,
    battery: false,
    network: false
  });
  const [deviceData, setDeviceData] = useState({
    screenTime: 0,
    steps: 0,
    heartRate: null,
    batteryLevel: null,
    networkType: null,
    deviceUptime: 0
  });

  useEffect(() => {
    if (trackingEnabled) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [trackingEnabled]);

  const requestPermissions = async () => {
    const newPermissions = { ...permissions };

    // Device Motion & Orientation
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      const response = await DeviceMotionEvent.requestPermission();
      newPermissions.deviceMotion = response === 'granted';
    } else if (window.DeviceMotionEvent) {
      newPermissions.deviceMotion = true;
    }

    // Geolocation
    if (navigator.geolocation) {
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        newPermissions.geolocation = true;
      } catch (error) {
        newPermissions.geolocation = false;
      }
    }

    // Battery API
    if ('getBattery' in navigator) {
      newPermissions.battery = true;
    }

    // Network Information
    if ('connection' in navigator) {
      newPermissions.network = true;
    }

    setPermissions(newPermissions);
    return Object.values(newPermissions).some(p => p);
  };

  const startTracking = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    // Track screen time
    let screenTimeStart = Date.now();
    let isVisible = !document.hidden;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isVisible) {
          setDeviceData(prev => ({
            ...prev,
            screenTime: prev.screenTime + (Date.now() - screenTimeStart)
          }));
          isVisible = false;
        }
      } else {
        screenTimeStart = Date.now();
        isVisible = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track device motion (simulate steps and heart rate)
    let stepCount = 0;
    let lastAcceleration = { x: 0, y: 0, z: 0 };

    const handleDeviceMotion = (event) => {
      if (event.acceleration) {
        const { x, y, z } = event.acceleration;
        const totalAcceleration = Math.sqrt(x*x + y*y + z*z);
        
        // Simple step detection algorithm
        if (totalAcceleration > 12 && 
            Math.abs(totalAcceleration - Math.sqrt(lastAcceleration.x*lastAcceleration.x + 
                                                  lastAcceleration.y*lastAcceleration.y + 
                                                  lastAcceleration.z*lastAcceleration.z)) > 8) {
          stepCount++;
          
          // Simulate heart rate based on activity
          const heartRate = 60 + Math.min(40, stepCount * 0.5 + Math.random() * 10);
          
          setDeviceData(prev => ({
            ...prev,
            steps: stepCount,
            heartRate: Math.round(heartRate)
          }));
        }
        
        lastAcceleration = { x, y, z };
      }
    };

    if (permissions.deviceMotion) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    // Track battery level
    if (permissions.battery && 'getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        const updateBattery = () => {
          setDeviceData(prev => ({
            ...prev,
            batteryLevel: Math.round(battery.level * 100)
          }));
        };
        
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
      });
    }

    // Track network information
    if (permissions.network && 'connection' in navigator) {
      const updateNetwork = () => {
        setDeviceData(prev => ({
          ...prev,
          networkType: navigator.connection.effectiveType || 'unknown'
        }));
      };
      
      updateNetwork();
      navigator.connection.addEventListener('change', updateNetwork);
    }

    // Track device uptime (simulate)
    const uptimeInterval = setInterval(() => {
      setDeviceData(prev => ({
        ...prev,
        deviceUptime: prev.deviceUptime + 1
      }));
    }, 1000);

    // Store cleanup functions
    window.trackingCleanup = () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('devicemotion', handleDeviceMotion);
      clearInterval(uptimeInterval);
    };
  };

  const stopTracking = () => {
    if (window.trackingCleanup) {
      window.trackingCleanup();
      window.trackingCleanup = null;
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="smart-tracking">
      <motion.div 
        className="tracking-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="tracking-header">
          <h2>Smart Device Tracking</h2>
          <p>Enable comprehensive device and health monitoring</p>
        </div>

        <div className="tracking-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={trackingEnabled}
              onChange={(e) => setTrackingEnabled(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
          <span className="toggle-label">
            {trackingEnabled ? 'Tracking Enabled' : 'Enable Smart Tracking'}
          </span>
        </div>

        {trackingEnabled && (
          <motion.div 
            className="tracking-data"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
          >
            <div className="data-grid">
              <div className="data-card">
                <div className="data-icon">⏱️</div>
                <div className="data-value">{formatTime(deviceData.screenTime)}</div>
                <div className="data-label">Screen Time</div>
              </div>

              <div className="data-card">
                <div className="data-icon">👟</div>
                <div className="data-value">{deviceData.steps}</div>
                <div className="data-label">Steps Today</div>
              </div>

              <div className="data-card">
                <div className="data-icon">❤️</div>
                <div className="data-value">
                  {deviceData.heartRate ? `${deviceData.heartRate} BPM` : '--'}
                </div>
                <div className="data-label">Heart Rate</div>
              </div>

              <div className="data-card">
                <div className="data-icon">🔋</div>
                <div className="data-value">
                  {deviceData.batteryLevel ? `${deviceData.batteryLevel}%` : '--'}
                </div>
                <div className="data-label">Battery Level</div>
              </div>

              <div className="data-card">
                <div className="data-icon">📶</div>
                <div className="data-value">
                  {deviceData.networkType || '--'}
                </div>
                <div className="data-label">Network Type</div>
              </div>

              <div className="data-card">
                <div className="data-icon">⚡</div>
                <div className="data-value">{formatUptime(deviceData.deviceUptime)}</div>
                <div className="data-label">Session Time</div>
              </div>
            </div>

            <div className="permissions-status">
              <h3>Permissions Status</h3>
              <div className="permissions-grid">
                <div className={`permission-item ${permissions.deviceMotion ? 'granted' : 'denied'}`}>
                  <span>Device Motion</span>
                  <span>{permissions.deviceMotion ? '✓' : '✗'}</span>
                </div>
                <div className={`permission-item ${permissions.geolocation ? 'granted' : 'denied'}`}>
                  <span>Location</span>
                  <span>{permissions.geolocation ? '✓' : '✗'}</span>
                </div>
                <div className={`permission-item ${permissions.battery ? 'granted' : 'denied'}`}>
                  <span>Battery Info</span>
                  <span>{permissions.battery ? '✓' : '✗'}</span>
                </div>
                <div className={`permission-item ${permissions.network ? 'granted' : 'denied'}`}>
                  <span>Network Info</span>
                  <span>{permissions.network ? '✓' : '✗'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="tracking-info">
          <h3>What We Track</h3>
          <ul>
            <li>Screen time and device usage patterns</li>
            <li>Physical activity and step counting</li>
            <li>Estimated heart rate during activity</li>
            <li>Battery usage and device health</li>
            <li>Network connectivity patterns</li>
            <li>Session duration and engagement</li>
          </ul>
          <p className="privacy-note">
            All data is processed locally on your device and used only for personalized insights.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartTracking;