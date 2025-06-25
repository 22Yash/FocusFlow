import React, { useEffect, useState } from "react";
import "./FocusSession.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '@clerk/clerk-react';

function FocusSession() {
  const [tasks, setTasks] = useState([]);
  const [selectedSessionType, setSelectedSessionType] = useState("deep-work");
  const [selectedDurationTime, setSelectedDurationTime] = useState("90");
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedMood, setSelectedMood] = useState(3);
  const [selectedEnvironment, setSelectedEnvironment] = useState("quiet");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useUser();
  const userID = user?.id;

  // Session type duration mapping
  const sessionDurations = {
    "pomodoro": "25",
    "deep-work": "90", 
    "sprint": "15",
    "custom": selectedDurationTime
  };

  const handleStart = async () => {
    // Validation
    if (!selectedTask) {
      alert("Please select a task before starting your focus session.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Create session in backend
      const sessionData = {
        userId: userID,
        sessionType: selectedSessionType,
        plannedDuration: parseInt(sessionDurations[selectedSessionType] || selectedDurationTime),
        linkedTaskId: selectedTaskId || null,
        environment: selectedEnvironment,
        mood: selectedMood,
        startedAt: new Date().toISOString()
      };

      const response = await axios.post("http://localhost:5000/api/sessions/start", sessionData);
      
      if (response.data.success) {
        // Navigate to session start with session ID
        navigate("/sessionstart", {
          state: {
            sessionId: response.data.session._id,
            task: selectedTask,
            taskId: selectedTaskId,
            time: sessionDurations[selectedSessionType] || selectedDurationTime,
            sessionType: selectedSessionType,
            environment: selectedEnvironment,
            mood: selectedMood
          },
        });
      }
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to start session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update duration when session type changes
  useEffect(() => {
    if (selectedSessionType !== "custom") {
      setSelectedDurationTime(sessionDurations[selectedSessionType]);
    }
  }, [selectedSessionType]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!userID) return;
      try {
        const res = await axios.get("http://localhost:5000/api/tasks", {
          params: { userID }
        });
        setTasks(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTasks();
  }, [userID]);

  return (
    <div className="focus-container">
      <div className="header">
        <h1><Link to="/">🎯</Link> Focus Session</h1>
        <p>Start your productive focus session</p>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Select Task</label>
          <select 
            id="task-select" 
            className="form-control"
            value={selectedTask}
            onChange={(e) => {
              const selectedOption = e.target.options[e.target.selectedIndex];
              setSelectedTask(e.target.value);
              setSelectedTaskId(selectedOption.dataset.taskId || "");
            }}
          >
            <option value="">Choose a task...</option>
            {tasks.map((task) => (
              <option 
                key={task._id} 
                value={task.description}
                data-task-id={task._id}
              >
                {task.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Session Type</label>
          <div className="session-type-grid">
            <div
              className={`session-type-card ${
                selectedSessionType === "pomodoro" ? "selected" : ""
              }`}
              onClick={() => setSelectedSessionType("pomodoro")}
            >
              <div className="icon">🍅</div>
              <div className="title">Pomodoro</div>
              <div className="duration">25 min</div>
            </div>
            <div
              className={`session-type-card ${
                selectedSessionType === "deep-work" ? "selected" : ""
              }`}
              onClick={() => setSelectedSessionType("deep-work")}
            >
              <div className="icon">🎯</div>
              <div className="title">Deep Work</div>
              <div className="duration">90 min</div>
            </div>
            <div
              className={`session-type-card ${
                selectedSessionType === "sprint" ? "selected" : ""
              }`}
              onClick={() => setSelectedSessionType("sprint")}
            >
              <div className="icon">⚡</div>
              <div className="title">Sprint</div>
              <div className="duration">15 min</div>
            </div>
            <div
              className={`session-type-card ${
                selectedSessionType === "custom" ? "selected" : ""
              }`}
              onClick={() => setSelectedSessionType("custom")}
            >
              <div className="icon">⚙️</div>
              <div className="title">Custom</div>
              <div className="duration">Your choice</div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Duration (minutes)</label>
          <div className="duration-selector">
            <button 
              className={`duration-btn ${selectedDurationTime === "15" ? "selected" : ""}`}
              onClick={() => setSelectedDurationTime("15")}
              disabled={selectedSessionType !== "custom"}
            >
              15
            </button>
            <button 
              className={`duration-btn ${selectedDurationTime === "25" ? "selected" : ""}`}
              onClick={() => setSelectedDurationTime("25")}
              disabled={selectedSessionType !== "custom"}
            >
              25
            </button>
            <button 
              className={`duration-btn ${selectedDurationTime === "45" ? "selected" : ""}`}
              onClick={() => setSelectedDurationTime("45")}
              disabled={selectedSessionType !== "custom"}
            >
              45
            </button>
            <button 
              className={`duration-btn ${selectedDurationTime === "90" ? "selected" : ""}`}
              onClick={() => setSelectedDurationTime("90")}
              disabled={selectedSessionType !== "custom"}
            >
              90
            </button>
          </div>
          {selectedSessionType === "custom" && (
            <input
              type="number"
              min="5"
              max="180"
              value={selectedDurationTime}
              onChange={(e) => setSelectedDurationTime(e.target.value)}
              className="custom-duration-input"
              placeholder="Custom duration"
            />
          )}
        </div>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Current Mood</label>
          <div className="mood-rating">
            {[
              { value: 1, emoji: "😴", label: "Tired" },
              { value: 2, emoji: "😐", label: "Okay" },
              { value: 3, emoji: "😊", label: "Good" },
              { value: 4, emoji: "🤩", label: "Great" },
              { value: 5, emoji: "🚀", label: "Energized" }
            ].map((mood) => (
              <div
                key={mood.value}
                className={`mood-item ${selectedMood === mood.value ? "selected" : ""}`}
                onClick={() => setSelectedMood(mood.value)}
                data-mood={mood.value}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Environment</label>
          <div className="environment-grid">
            {[
              { value: "quiet", icon: "🤫", name: "Quiet" },
              { value: "music", icon: "🎵", name: "Music" },
              { value: "nature", icon: "🌿", name: "Nature" },
              { value: "cafe", icon: "☕", name: "Café" },
              { value: "rain", icon: "🌧️", name: "Rain" },
              { value: "office", icon: "🏢", name: "Office" }
            ].map((env) => (
              <div
                key={env.value}
                className={`environment-card ${selectedEnvironment === env.value ? "selected" : ""}`}
                onClick={() => setSelectedEnvironment(env.value)}
                data-environment={env.value}
              >
                <div className="environment-icon">{env.icon}</div>
                <div className="environment-name">{env.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        className="start-button" 
        onClick={handleStart}
        disabled={isLoading || !selectedTask}
      >
        {isLoading ? "Starting..." : "Start Focus Session"}
      </button>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">7</span>
          <span className="stat-label">Day Streak</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">4.2h</span>
          <span className="stat-label">Today</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">89%</span>
          <span className="stat-label">Success Rate</span>
        </div>
      </div>
    </div>
  );
}

export default FocusSession;