const express = require("express");
const router = express.Router();
const {
  listApplications,
  createApplication,
  updateStatus,
  deleteApplication,
} = require("../controllers/applicationsController");
const { protect } = require("../middleware/authMiddleware");

// ✅ List all applications for the logged-in user
router.get("/", protect, listApplications);

// ✅ Create a new application (used in InternshipDetails.jsx)
router.post("/", protect, createApplication);

// ✅ Update status (used in ApplicationTracker.jsx)
router.patch("/:id", protect, updateStatus);

// ✅ Delete an application
router.delete("/:id", protect, deleteApplication);

module.exports = router;
