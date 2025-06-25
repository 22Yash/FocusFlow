const mongoose = require("mongoose");

const pauseSchema = new mongoose.Schema({
  pausedAt: Date,
  resumedAt: Date,
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  sessionType: String,
  plannedDuration: Number, // in minutes
  linkedTaskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  environment: String,
  mood: Number,
  startedAt: Date,
  endedAt: Date,
  actualDuration: Number, // in minutes
  pausedTimes: [pauseSchema],
  distractionCount: { type: Number, default: 0 },
  productivityRating: Number,
  notes: String,
  status: { type: String, default: "in-progress" }, // completed / interrupted / abandoned
});

module.exports = mongoose.model("Session", sessionSchema);
