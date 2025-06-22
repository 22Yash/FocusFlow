import React, { useEffect, useState } from "react";
import "./FocusSession.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '@clerk/clerk-react';

function FocusSession() {
  const [tasks, setTasks] = useState([]);
  const [selectedSessionType, setSelectedSessionType] = useState("deep-work");
  const [selectedDurationTime,setSelectedDurationTime] = useState("90")
  const [selectedTask, setSelectedTask] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();
  const userID = user?.id;

  const handleStart = () => {
    navigate("/sessionstart", {
      state: {
        task: selectedTask,
        time: selectedDurationTime,
      },
    });
  };
  

  useEffect(() => {

    const fetchTasks = async () => {
      if (!userID) return;
      try {
        const res = await axios.get("http://localhost:5000/api/tasks",{
          params:{userID}
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
        <h1>🎯 Focus Session</h1>
        <p>Start your productive focus session</p>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label 
          >Select Task</label>
          <select 
          id="task-select" 
          className="form-control"
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}>
            <option value="">Choose a task...</option>
            {tasks.map((task) => {
              
              return (
                <option key={task._id} value={task.description}>
                  {task.description}
                </option>
              );
            })}
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
              <div className="duration">25 + 5 min</div>
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
            className={`duration-btn ${
              selectedDurationTime === "15" ? "selected" : ""
            }`}
            onClick={() => setSelectedDurationTime("15")}
            
            data-duration="15">
              15
            </button>
            <button 
            className={`duration-btn ${
              selectedDurationTime === "25" ? "selected" : ""
            }`}
            onClick={() => setSelectedDurationTime("25")} 
            data-duration="25">
              25
            </button>
            <button 
            className={`duration-btn ${
              selectedDurationTime === "45" ? "selected" : ""
            }`}
            onClick={() => setSelectedDurationTime("45")}
             data-duration="45">
              45
            </button>
            <button 
            className={`duration-btn ${
              selectedDurationTime === "90" ? "selected" : ""
            }`}
            onClick={() => setSelectedDurationTime("90")} data-duration="90">
              90
            </button>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Current Mood</label>
          <div className="mood-rating">
            <div className="mood-item" data-mood="1">
              <span className="mood-emoji">😴</span>
              <span className="mood-label">Tired</span>
            </div>
            <div className="mood-item" data-mood="2">
              <span className="mood-emoji">😐</span>
              <span className="mood-label">Okay</span>
            </div>
            <div className="mood-item selected" data-mood="3">
              <span className="mood-emoji">😊</span>
              <span className="mood-label">Good</span>
            </div>
            <div className="mood-item" data-mood="4">
              <span className="mood-emoji">🤩</span>
              <span className="mood-label">Great</span>
            </div>
            <div className="mood-item" data-mood="5">
              <span className="mood-emoji">🚀</span>
              <span className="mood-label">Energized</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>Environment</label>
          <div className="environment-grid">
            <div className="environment-card selected" data-environment="quiet">
              <div className="environment-icon">🤫</div>
              <div className="environment-name">Quiet</div>
            </div>
            <div className="environment-card" data-environment="music">
              <div className="environment-icon">🎵</div>
              <div className="environment-name">Music</div>
            </div>
            <div className="environment-card" data-environment="nature">
              <div className="environment-icon">🌿</div>
              <div className="environment-name">Nature</div>
            </div>
            <div className="environment-card" data-environment="cafe">
              <div className="environment-icon">☕</div>
              <div className="environment-name">Café</div>
            </div>
            <div className="environment-card" data-environment="rain">
              <div className="environment-icon">🌧️</div>
              <div className="environment-name">Rain</div>
            </div>
            <div className="environment-card" data-environment="office">
              <div className="environment-icon">🏢</div>
              <div className="environment-name">Office</div>
            </div>
          </div>
        </div>
      </div>

      <button className="start-button" onClick={handleStart}>
        Start Focus Session
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
