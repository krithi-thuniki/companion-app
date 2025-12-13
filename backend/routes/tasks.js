const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // ✅ fixed import
const Task = require("../models/task");

// ✅ Get all tasks
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ deadline: 1 });
    res.json(tasks);
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Add new task
router.post("/", protect, async (req, res) => {
  const { text, deadline, priority } = req.body;
  if (!text || !deadline) {
    return res.status(400).json({ error: "Text and deadline are required" });
  }

  try {
    const task = new Task({
      user: req.user.id,
      text,
      deadline,
      priority,
      completed: false,
      reminded: false,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Toggle complete
router.put("/:id/toggle", protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error("❌ Error toggling task:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
