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

// POST a new task
router.post("/", async (req, res) => {
  const { description, quadrant, userID , category ,priority ,estimatedTime ,dueDate ,tags } = req.body;

  if (!description || !quadrant || !userID ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Apply default values if any advanced fields are missing
  const taskData = {
    description,
    quadrant,
    userID,
    category: category || "Work",
    priority: priority || "Medium",
    estimatedTime: estimatedTime || 60,
    dueDate: dueDate || null,
    tags: Array.isArray(tags) ? tags : []
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

// DELETE a task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});



// PUT update a task's quadrant
// PUT update a task (partial or full)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: req.body }, // Accept any fields
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

module.exports = router;
