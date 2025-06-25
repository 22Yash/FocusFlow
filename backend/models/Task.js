const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  description: { type: String, required: true },

  quadrant: {
    type: String,
    enum: ["do", "schedule", "delegate", "eliminate"],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  userID: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: ["Work", "Personal", "Learning", "Health", "Finance"],
    default: "Work",
  },

  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },

  estimatedTime: {
    type: Number,
    default: 60, // in minutes
  },

  dueDate: {
    type: Date,
  },

  tags: {
    type: [String],
    default: [],
  },

  completed: {
    type: Boolean,
    default: false,
  },

  completedAt: {
    type: Date,
  },

  timeSpent: {
    type: Number, // in minutes
    default: 0,
  },
});

module.exports = mongoose.model("Task", TaskSchema);
