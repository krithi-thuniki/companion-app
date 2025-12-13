// backend/models/pomodoroSession.js
const mongoose = require("mongoose");

const pomodoroSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  actionType: {
    type: String,
    enum: ["start", "pause", "reset", "sessionComplete"],
    required: true,
  },
  isWork: { type: Boolean },
  workTime: { type: Number },   // seconds
  breakTime: { type: Number },  // seconds
  cycles: { type: Number },
  dailyMinutes: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PomodoroSession", pomodoroSessionSchema);
