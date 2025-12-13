// backend/controllers/pomodoroController.js
const PomodoroSession = require("../models/pomodoroSession");

// 🧾 Log a Pomodoro action
exports.logAction = async (req, res) => {
  try {
    const { actionType, isWork, workTime, breakTime, cycles, dailyMinutes } = req.body;

    // ✅ Basic validation
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized: missing user" });
    }
    if (!actionType) {
      return res.status(400).json({ success: false, message: "Missing actionType" });
    }

    // 🛠 Debug logging (for server console)
    console.log("Pomodoro logAction:", {
      user: req.user.id,
      actionType,
      isWork,
      workTime,
      breakTime,
      cycles,
      dailyMinutes,
    });

    // ✅ Create and save new log
    const newLog = await PomodoroSession.create({
      user: req.user.id, // set by auth middleware
      actionType,
      isWork,
      workTime,
      breakTime,
      cycles,
      dailyMinutes,
    });

    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    console.error("❌ Error logging Pomodoro action:", error);
    res.status(500).json({
      success: false,
      message: "Failed to log Pomodoro action",
      error: error.message,
    });
  }
};

// 📜 Get user’s Pomodoro history
exports.getUserHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized: missing user" });
    }

    const logs = await PomodoroSession.find({ user: req.user.id }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("❌ Error fetching Pomodoro history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Pomodoro history",
      error: error.message,
    });
  }
};
