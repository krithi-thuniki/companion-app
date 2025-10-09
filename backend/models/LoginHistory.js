const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  usernameAttempt: { type: String },
  success: { type: Boolean, default: false },
  reason: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  loginTime: { type: Date, default: Date.now },
  logoutTime: { type: Date },
});

module.exports = mongoose.model("LoginHistory", loginHistorySchema);
