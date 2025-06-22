// src/components/SessionStart.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import './SessionStart.css';

import { useNavigate } from "react-router-dom";


function SessionStart() {
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const totalSessions = 4;
  const intervalRef = useRef(null);
  const location = useLocation();
  const { task, time } = location.state;
  const navigate = useNavigate();

  const focusDuration = parseInt(time);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setTimeLeft(focusDuration * 60);
  };

  const handleSessionComplete = () => {
    const overlay = document.getElementById('breakOverlay');
    if (overlay) overlay.style.display = 'flex';

    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBT2Uy+DIdiMG');
      audio.play();
    } catch (e) {}
  };

  const startBreak = () => {
    const overlay = document.getElementById('breakOverlay');
    if (overlay) overlay.style.display = 'none';

    if (currentSession < totalSessions) {
      setCurrentSession((prev) => prev + 1);
      setTimeLeft(5 * 60);
    } else {
      alert('🎉 All focus sessions complete! Great job!');
    }
  };

  const skipSession = () => {
    if (window.confirm('Skip this session?')) handleSessionComplete();
  };

  const goBack = () => {
    alert('Returning to dashboard...'); 
    navigate('/')};

   const progressDegrees = ((focusDuration * 60 - timeLeft) / (focusDuration * 60)) * 360;

  return (
    <div className="sessionstart-container">
      <div className="sessionstart-floating-elements">
        <div className="sessionstart-floating-circle"></div>
        <div className="sessionstart-floating-circle"></div>
        <div className="sessionstart-floating-circle"></div>
      </div>

      <div className="sessionstart-header">
        <button className="sessionstart-back-btn" onClick={goBack}>← Back</button>
        <div className="sessionstart-session-info">Focus Session • Pomodoro</div>
      </div>

      <h1 className="sessionstart-task-title">{task}</h1>

      <div className="sessionstart-timer-circle">
        <div className="sessionstart-circle-bg">
          <div
            className="sessionstart-circle-progress"
            style={{
              background: `conic-gradient(from 0deg, #4facfe 0deg, #00f2fe ${progressDegrees}deg, rgba(255,255,255,0.1) ${progressDegrees}deg)`,
            }}
          />
        </div>
        <div className="sessionstart-timer-display">
          <div className="sessionstart-label">{timeLeft > 5 * 60 ? 'Focus Time' : 'Break Time'}</div>
          <div className="sessionstart-time-text">{formatTime(timeLeft)}</div>
          <div className="sessionstart-count">Session {currentSession} of {totalSessions}</div>
        </div>
      </div>

      <div className="sessionstart-controls">
        <button className={`sessionstart-control-btn ${isRunning ? 'pause-btn' : 'play-btn'}`} onClick={toggleTimer}>
          {isRunning ? '⏸ Pause' : '▶ Start Focus'}
        </button>
        <button className="sessionstart-control-btn sessionstart-reset-btn" onClick={resetTimer}>⏹ Reset</button>
        <button className="sessionstart-control-btn sessionstart-skip-btn" onClick={skipSession}>⏭ Skip</button>
      </div>

      <div className="sessionstart-stats-bar">
        <div className="sessionstart-stat-item">
          <div className="sessionstart-stat-value">12</div>
          <div className="sessionstart-stat-label">Tasks Today</div>
        </div>
        <div className="sessionstart-stat-item">
          <div className="sessionstart-stat-value">3h 45m</div>
          <div className="sessionstart-stat-label">Focus Time</div>
        </div>
        <div className="sessionstart-stat-item">
          <div className="sessionstart-stat-value">7</div>
          <div className="sessionstart-stat-label">Day Streak</div>
        </div>
      </div>

      <div className="sessionstart-break-overlay" id="breakOverlay">
        <div className="sessionstart-break-content">
          <h2 className="sessionstart-break-title">🎉 Great Work!</h2>
          <p className="sessionstart-break-message">Take a 5-minute break.</p>
          <button className="sessionstart-control-btn play-btn" onClick={startBreak}>Start Break</button>
        </div>
      </div>
    </div>
  );
}

export default SessionStart;
