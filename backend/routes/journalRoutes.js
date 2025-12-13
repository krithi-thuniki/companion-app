const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const journalController = require("../controllers/journalController");

// 🧾 Fetch all journals
router.get("/", protect, journalController.getJournals);

// 💾 Create or update a journal
router.post("/", protect, journalController.saveJournal);

// ❌ Delete single journal by date
router.delete("/:date", protect, journalController.deleteJournal);

// ⚠️ Delete all journals
router.delete("/", protect, journalController.clearAllJournals);

module.exports = router;
