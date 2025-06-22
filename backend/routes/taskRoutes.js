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
  const { description, quadrant, userID } = req.body;

  if (!description || !quadrant || !userID) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newTask = new Task({ description, quadrant, userID });
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
router.put("/:id", async (req, res) => {
  try {
    const { quadrant } = req.body;
    const { id } = req.params;
    
    if (!quadrant) {
      return res.status(400).json({ message: 'Quadrant is required' });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id }, 
      { quadrant },
      { new: true }
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
