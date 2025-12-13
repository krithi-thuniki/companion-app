// backend/routes/pomodoro.js
const express = require("express");
const router = express.Router();
const { logAction, getUserHistory } = require("../controllers/pomodoroController");
const { protect } = require("../middleware/authMiddleware"); // ✅ now correctly matches export

// 🧾 Log a Pomodoro action
router.post("/log", protect, logAction);

// 📜 Get user's Pomodoro history
router.get("/history", protect, getUserHistory);

module.exports = router;
