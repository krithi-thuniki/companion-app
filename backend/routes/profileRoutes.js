const express = require("express");
const router = express.Router();
const { saveProfile, getProfile } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Save or update user profile
router.post("/", protect, saveProfile);

// ✅ Get current user's profile
router.get("/", protect, getProfile);

module.exports = router;
