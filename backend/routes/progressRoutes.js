// routes/progressRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getProgress, saveProgress } = require("../controllers/progressController");

router.get("/", protect, getProgress);
router.post("/", protect, saveProgress);

module.exports = router;
