const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quadrant: { type: String, enum: ["do", "schedule", "delegate", "eliminate"], required: true },
  createdAt: { type: Date, default: Date.now },
  userID: { type: String, required: true },
});

module.exports = mongoose.model("Task", TaskSchema);
