// controllers/progressController.js
const UserProgress = require("../models/UserProgress");

exports.getProgress = async (req, res) => {
  try {
    const progress = await UserProgress.findOne({ user: req.user.id });
    res.json(progress || {});
  } catch (err) {
    console.error("getProgress error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.saveProgress = async (req, res) => {
  try {
    const { nutrition, waterIntake, activityLevel } = req.body;

    const progress = await UserProgress.findOneAndUpdate(
      { user: req.user.id },
      { nutrition, waterIntake, activityLevel, lastUpdated: Date.now() },
      { new: true, upsert: true }
    );

    res.json(progress);
  } catch (err) {
    console.error("saveProgress error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
