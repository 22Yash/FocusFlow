const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  quadrant: {
    type: String,
    required: true,
    enum: ['DO', 'SCHEDULE', 'DELEGATE', 'DELETE']
  },
  userID: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Work'
  },
  priority: {
    type: String,
    default: 'Medium',
    enum: ['Low', 'Medium', 'High']
  },
  estimatedTime: {
    type: Number,
    default: 60 // in minutes
  },
  dueDate: {
    type: Date,
    default: null
  },
  tags: [{
    type: String
  }],
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Index for better query performance
taskSchema.index({ userID: 1, completed: 1 });
taskSchema.index({ userID: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);