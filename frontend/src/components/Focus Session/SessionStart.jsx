import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import './SessionStart.css';

function SessionStart() {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [distractionCount, setDistractionCount] = useState(0);
  const [pausedTimes, setPausedTimes] = useState([]);
  const [currentPauseStart, setCurrentPauseStart] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [productivityRating, setProductivityRating] = useState(8);
  const [sessionNotes, setSessionNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const intervalRef = useRef(null);
  const heartbeatRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get session data from navigation state
  const {
    sessionId,
    task,
    taskId,
    time,
    sessionType,
    environment,
    mood
  } = location.state || {};

  const focusDuration = parseInt(time) || 25;

  useEffect(() => {
    if (!sessionId) {
      navigate('/focus-session');
      return;
    }
    
    setTimeLeft(focusDuration * 60);
    startHeartbeat();
    
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(heartbeatRef.current);
    };
  }, [sessionId, focusDuration]);

  // Start heartbeat to track session progress
  const startHeartbeat = () => {
    heartbeatRef.current = setInterval(async () => {
      if (sessionId) {
        try {
          await axios.put(`http://localhost:5000/api/sessions/${sessionId}/heartbeat`, {
            currentDuration: Math.floor((focusDuration * 60 - timeLeft) / 60),
            isActive: isRunning,
            distractionCount,
            pausedTimes
          });
        } catch (error) {
          console.error('Heartbeat failed:', error);
        }
      }
    }, 30000); // Send heartbeat every 30 seconds
  };

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
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const toggleTimer = async () => {
    const newIsRunning = !isRunning;
    setIsRunning(newIsRunning);

    try {
      if (newIsRunning) {
        // Resume session
        if (currentPauseStart) {
          const pauseEnd = new Date().toISOString();
          setPausedTimes(prev => [
            ...prev,
            { pausedAt: currentPauseStart, resumedAt: pauseEnd }
          ]);
          setCurrentPauseStart(null);
        }
        await axios.put(`http://localhost:5000/api/sessions/${sessionId}/resume`);
      } else {
        // Pause session
        const pauseStart = new Date().toISOString();
        setCurrentPauseStart(pauseStart);
        await axios.put(`http://localhost:5000/api/sessions/${sessionId}/pause`, {
          pausedAt: pauseStart
        });
      }
    } catch (error) {
      console.error('Failed to update session state:', error);
    }
  };

  const resetTimer = async () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setTimeLeft(focusDuration * 60);
    setDistractionCount(0);
    setPausedTimes([]);
    setCurrentPauseStart(null);

    try {
      await axios.put(`http://localhost:5000/api/sessions/${sessionId}/reset`);
    } catch (error) {
      console.error('Failed to reset session:', error);
    }
  };

  const handleDistraction = async () => {
    const newCount = distractionCount + 1;
    setDistractionCount(newCount);

    try {
      await axios.put(`http://localhost:5000/api/sessions/${sessionId}/distraction`, {
        distractionCount: newCount
      });
    } catch (error) {
      console.error('Failed to log distraction:', error);
    }
  };

  const handleSessionComplete = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setShowCompleteModal(true);

    // Play completion sound
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBT2Uy+DIdiMG');
      audio.play();
    } catch (e) {
      console.log('Could not play completion sound');
    }
  };

  const completeSession = async () => {
    setIsLoading(true);
    
    try {
      const completionData = {
        endedAt: new Date().toISOString(),
        actualDuration: Math.floor((focusDuration * 60 - timeLeft) / 60),
        completionStatus: timeLeft <= 0 ? 'completed' : 'interrupted',
        productivityRating,
        notes: sessionNotes,
        pausedTimes: currentPauseStart ? [
          ...pausedTimes,
          { pausedAt: currentPauseStart, resumedAt: new Date().toISOString() }
        ] : pausedTimes,
        distractionCount
      };

      await axios.put(`http://localhost:5000/api/sessions/${sessionId}/complete`, completionData);
      
      // Navigate to dashboard or session summary
      navigate('/dashboard', {
        state: {
          completedSession: {
            task,
            actualDuration: completionData.actualDuration,
            productivityRating,
            completionStatus: completionData.completionStatus
          }
        }
      });
    } catch (error) {
      console.error('Failed to complete session:', error);
      alert('Failed to save session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const abandonSession = async () => {
    if (window.confirm('Are you sure you want to abandon this session?')) {
      try {
        await axios.put(`http://localhost:5000/api/sessions/${sessionId}/complete`, {
          endedAt: new Date().toISOString(),
          actualDuration: Math.floor((focusDuration * 60 - timeLeft) / 60),
          completionStatus: 'abandoned',
          pausedTimes,
          distractionCount
        });
        
        navigate('/');
      } catch (error) {
        console.error('Failed to abandon session:', error);
      }
    }
  };

  const progressDegrees = ((focusDuration * 60 - timeLeft) / (focusDuration * 60)) * 360;

  if (!sessionId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sessionstart-container">
      <div className="sessionstart-floating-elements">
        <div className="sessionstart-floating-circle"></div>
        <div className="sessionstart-floating-circle"></div>
        <div className="sessionstart-floating-circle"></div>
      </div>

      <div className="sessionstart-header">
        <button className="sessionstart-back-btn" onClick={abandonSession}>← Back</button>
        <div className="sessionstart-session-info">
          Focus Session • {sessionType.charAt(0).toUpperCase() + sessionType.slice(1)}
        </div>
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
          <div className="sessionstart-label">Focus Time</div>
          <div className="sessionstart-time-text">{formatTime(timeLeft)}</div>
          <div className="sessionstart-count">
            {distractionCount} distractions • {environment}
          </div>
        </div>
      </div>

      <div className="sessionstart-controls">
        <button 
          className={`sessionstart-control-btn ${isRunning ? 'pause-btn' : 'play-btn'}`} 
          onClick={toggleTimer}
        >
          {isRunning ? '⏸ Pause' : '▶ Start Focus'}
        </button>
        <button 
          className="sessionstart-control-btn sessionstart-reset-btn" 
          onClick={resetTimer}
        >
          ⏹ Reset
        </button>
        <button 
          className="sessionstart-control-btn sessionstart-distraction-btn" 
          onClick={handleDistraction}
        >
          📱 Distraction ({distractionCount})
        </button>
        <button 
          className="sessionstart-control-btn sessionstart-complete-btn" 
          onClick={handleSessionComplete}
        >
          ✅ Complete
        </button>
      </div>

      <div className="sessionstart-stats-bar">
        <div className="sessionstart-stat-item">
          <div className="sessionstart-stat-value">{Math.floor((focusDuration * 60 - timeLeft) / 60)}m</div>
          <div className="sessionstart-stat-label">Elapsed</div>
        </div>
        <div className="sessionstart-stat-item">
          <div className="sessionstart-stat-value">{pausedTimes.length}</div>
          <div className="sessionstart-stat-label">Pauses</div>
        </div>
        <div className="sessionstart-stat-item">
          <div className="sessionstart-stat-value">{distractionCount}</div>
          <div className="sessionstart-stat-label">Distractions</div>
        </div>
      </div>

      {/* Session Complete Modal */}
      {showCompleteModal && (
        <div className="sessionstart-modal-overlay">
          <div className="sessionstart-modal-content">
            <h2 className="sessionstart-modal-title">🎉 Session Complete!</h2>
            <p className="sessionstart-modal-message">
              Great work! You focused for {Math.floor((focusDuration * 60 - timeLeft) / 60)} minutes.
            </p>
            
            <div className="sessionstart-rating-section">
              <label>How productive did you feel? (1-10)</label>
              <div className="sessionstart-rating-slider">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={productivityRating}
                  onChange={(e) => setProductivityRating(parseInt(e.target.value))}
                />
                <span className="sessionstart-rating-value">{productivityRating}</span>
              </div>
            </div>

            <div className="sessionstart-notes-section">
              <label>Session Notes (optional)</label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="How did this session go? Any insights?"
                maxLength={500}
              />
            </div>

            <div className="sessionstart-modal-actions">
              <button 
                className="sessionstart-control-btn play-btn" 
                onClick={completeSession}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Complete Session'}
              </button>
              <button 
                className="sessionstart-control-btn" 
                onClick={() => setShowCompleteModal(false)}
              >
                Continue Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionStart;