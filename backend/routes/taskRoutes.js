const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET all tasks
router.get("/", async (req, res) => {
  const { userID } = req.query;

  if (!userID) {
    return res.status(400).json({ message: 'Missing userID' });
  }

  try {
    const tasks = await Task.find({ userID });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// GET task statistics (completed count, etc.)
router.get("/stats", async (req, res) => {
  const { userID, range } = req.query;

  if (!userID) {
    return res.status(400).json({ message: 'Missing userID' });
  }

  try {
    let dateFilter = {};
    const now = new Date();

    if (range === '7d') {
      dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (range === '30d') {
      dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
    } else if (range === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: startOfWeek } };
    }

    const completedTasks = await Task.countDocuments({ userID, completed: true, ...dateFilter });
    const totalTasks = await Task.countDocuments({ userID, ...dateFilter });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({ completedTasks, totalTasks, completionRate });
  } catch (error) {
    console.error("Error fetching task stats:", error);
    res.status(500).json({ message: 'Error fetching task statistics' });
  }
});

// POST a new task
router.post("/", async (req, res) => {
  let { description, quadrant, userID, category, priority, estimatedTime, dueDate, tags } = req.body;

  if (!description || !quadrant || !userID) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Normalize and validate quadrant
  const normalizedQuadrant = quadrant.toUpperCase();
  const allowedQuadrants = ['DO', 'SCHEDULE', 'DELEGATE', 'DELETE'];
  if (!allowedQuadrants.includes(normalizedQuadrant)) {
    return res.status(400).json({ message: 'Invalid quadrant value' });
  }

  const taskData = {
    description,
    quadrant: normalizedQuadrant,
    userID,
    category: category || "Work",
    priority: priority || "Medium",
    estimatedTime: estimatedTime || 60,
    dueDate: dueDate || null,
    tags: Array.isArray(tags) ? tags : [],
    completed: false,
    completedAt: null
  };

  try {
    const newTask = new Task(taskData);
    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT mark task as completed/uncompleted
router.put("/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const updateData = {
      completed: completed,
      completedAt: completed ? new Date() : null
    };

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task completion:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update a task
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.quadrant) {
      req.body.quadrant = req.body.quadrant.toUpperCase();
    }

    if (req.body.completed === true && req.body.completedAt === undefined) {
      req.body.completedAt = new Date();
    } else if (req.body.completed === false) {
      req.body.completedAt = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).end();
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
