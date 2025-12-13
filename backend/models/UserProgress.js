// models/UserProgress.js
const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    nutrition: {
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 },
    },
    waterIntake: { type: Number, default: 0 },
    activityLevel: { type: String, default: "low" },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProgress", userProgressSchema);
