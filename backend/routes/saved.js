const router = require("express").Router();
const ctrl = require("../controllers/savedController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Apply protection so req.user.id is accessible
router.get("/", protect, ctrl.listSaved);
router.post("/", protect, ctrl.saveItem);
router.delete("/:id", protect, ctrl.removeSaved);

module.exports = router;
