const router = require("express").Router();
const ctrl = require("../controllers/badgeController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Protect route so req.user is available
router.get("/", protect, ctrl.getBadges);

module.exports = router;
