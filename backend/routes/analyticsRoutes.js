const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const Task = require("../models/Task");

// Get date range based on `range`
function getStartDate(range) {
  const now = new Date();
  switch (range) {
    case "7d": return new Date(now.setDate(now.getDate() - 7));
    case "30d": return new Date(now.setDate(now.getDate() - 30));
    case "90d": return new Date(now.setDate(now.getDate() - 90));
    case "1y": return new Date(now.setFullYear(now.getFullYear() - 1));
    default: return new Date(now.setDate(now.getDate() - 7));
  }
}

// Format daily focus time
function groupByDay(sessions) {
  const result = {};
  sessions.forEach(session => {
    if (!session.startedAt) return;
    const day = new Date(session.startedAt).toLocaleString('en-US', { weekday: 'short' });
    const minutes = session.actualDuration || session.plannedDuration || 0;
    result[day] = (result[day] || 0) + minutes;
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    hours: parseFloat(((result[day] || 0) / 60).toFixed(2))
  }));
}

// Categorize tasks
function taskCategories(tasks) {
  const count = {};
  tasks.forEach(task => {
    const category = task.category || "Other";
    count[category] = (count[category] || 0) + 1;
  });

  const total = tasks.length || 1;
  const colorMap = {
    Work: "#8B5CF6",
    Personal: "#06B6D4",
    Learning: "#10B981",
    Health: "#F59E0B",
    Finance: "#F43F5E"
  };

  return Object.entries(count).map(([name, value]) => ({
    name,
    value: Math.round((value / total) * 100),
    color: colorMap[name] || "#A3A3A3"
  }));
}

// Weekly progress by ISO week number
function getISOWeek(date) {
  const temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
  const week1 = new Date(temp.getFullYear(), 0, 4);
  return 1 + Math.round(((temp - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

function getWeeklyStats(sessions, tasks) {
  const result = {};

  sessions.forEach(s => {
    const week = `Week ${getISOWeek(new Date(s.startedAt))}`;
    result[week] = result[week] || { focus: 0, tasks: 0 };
    result[week].focus += s.actualDuration || s.plannedDuration || 0;
  });

  tasks.forEach(t => {
    if (t.completed && t.completedAt) {
      const week = `Week ${getISOWeek(new Date(t.completedAt))}`;
      result[week] = result[week] || { focus: 0, tasks: 0 };
      result[week].tasks += 1;
    }
  });

  return Object.entries(result).map(([week, data]) => ({
    week,
    focus: Math.round(data.focus / 60),
    tasks: data.tasks
  }));
}

function calculateStreak(sessions) {
  const focusedDates = new Set(
    sessions.map(s => new Date(s.startedAt).toISOString().split("T")[0])
  );

  let streak = 0;
  let day = new Date();
  while (true) {
    const dateStr = day.toISOString().split("T")[0];
    if (focusedDates.has(dateStr)) {
      streak++;
      day.setDate(day.getDate() - 1);
    } else break;
  }

  return streak;
}

function productivityScore(sessions, tasks) {
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.actualDuration || s.plannedDuration || 0), 0);
  const completed = tasks.filter(t => t.completed).length;
  return Math.min(100, Math.round((totalMinutes / 60 + completed) / 2));
}

// 🚀 Main route
router.get("/", async (req, res) => {
  try {
    const { userId, range = "7d" } = req.query;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const start = getStartDate(range);

    const sessions = await Session.find({ userId, startedAt: { $gte: start } });
    const tasks = await Task.find({ userID: userId });

    res.json({
      focusTimeTrend: groupByDay(sessions),
      taskCategories: taskCategories(tasks),
      weeklyStats: getWeeklyStats(sessions, tasks),
      totalFocusHours: Math.round(sessions.reduce((sum, s) => sum + (s.actualDuration || s.plannedDuration || 0), 0) / 60),
      productivityScore: productivityScore(sessions, tasks),
      currentStreak: calculateStreak(sessions),
      completedTasks: tasks.filter(t => t.completed).length
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
