const Profile = require("../models/Profile");

exports.saveProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { age, gender, height, weight, activity } = req.body;

    if (!age || !height || !weight) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { age, gender, height, weight, activity },
      { new: true, upsert: true }
    );

    res.json(updatedProfile);
  } catch (err) {
    console.error("❌ Save profile error:", err);
    res.status(500).json({ message: "Server error saving profile" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.findOne({ user: userId });
    res.json(profile);
  } catch (err) {
    console.error("❌ Get profile error:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};
