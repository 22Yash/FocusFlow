// routes/sessions.js
const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// Heartbeat - update progress
router.put("/:id/heartbeat", async (req, res) => {
  try {
    const { currentDuration, isActive, distractionCount, pausedTimes } = req.body;

    await Session.findByIdAndUpdate(req.params.id, {
      actualDuration: currentDuration,
      distractionCount,
      pausedTimes,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Heartbeat error:", err);
    res.status(500).json({ success: false });
  }
});

// Pause session
router.put("/:id/pause", async (req, res) => {
  try {
    const { pausedAt } = req.body;
    const session = await Session.findById(req.params.id);
    session.pausedTimes.push({ pausedAt });
    await session.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Pause error:", err);
    res.status(500).json({ success: false });
  }
});

// Resume session
router.put("/:id/resume", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    const lastPause = session.pausedTimes[session.pausedTimes.length - 1];
    if (lastPause && !lastPause.resumedAt) {
      lastPause.resumedAt = new Date().toISOString();
    }
    await session.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Resume error:", err);
    res.status(500).json({ success: false });
  }
});

// Reset session
router.put("/:id/reset", async (req, res) => {
  try {
    await Session.findByIdAndUpdate(req.params.id, {
      actualDuration: 0,
      distractionCount: 0,
      pausedTimes: [],
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ success: false });
  }
});

// Log distraction
router.put("/:id/distraction", async (req, res) => {
  try {
    const { distractionCount } = req.body;
    await Session.findByIdAndUpdate(req.params.id, { distractionCount });
    res.json({ success: true });
  } catch (err) {
    console.error("Distraction error:", err);
    res.status(500).json({ success: false });
  }
});

// Complete session
router.put("/:id/complete", async (req, res) => {
  try {
    const {
      endedAt,
      actualDuration,
      completionStatus,
      productivityRating,
      notes,
      pausedTimes,
      distractionCount,
    } = req.body;

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      {
        endedAt,
        actualDuration,
        status: completionStatus,
        productivityRating,
        notes,
        pausedTimes,
        distractionCount,
      },
      { new: true }
    );

    res.json({ success: true, session });
  } catch (err) {
    console.error("Complete error:", err);
    res.status(500).json({ success: false });
  }
});


// Start a new session
router.post("/start", async (req, res) => {
  try {
    const {
      userId,
      sessionType,
      plannedDuration,
      linkedTaskId,
      environment,
      mood,
      startedAt,
    } = req.body;

    const newSession = new Session({
      userId,
      sessionType,
      plannedDuration,
      linkedTaskId,
      environment,
      mood,
      startedAt,
      distractionCount: 0,
      pausedTimes: [],
      status: "in-progress",
    });

    const savedSession = await newSession.save();

    res.status(201).json({ success: true, session: savedSession });
  } catch (error) {
    console.error("Failed to start session:", error);
    res.status(500).json({ success: false, message: "Failed to start session" });
  }
});


router.post('/seed', async (req, res) => {
  try {
    await Session.insertMany(req.body); // Receive an array of sessions
    res.status(201).json({ message: 'Mock sessions inserted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to insert mock data' });
  }
});

module.exports = router;

module.exports = router;
