const express = require("express");
const router = express.Router();
const {
  getExpenses,
  addExpense,
  deleteExpense,
  clearAllExpenses, // ✅ use same name as controller
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

// ✅ All routes require authentication
router.route("/")
  .get(protect, getExpenses)
  .post(protect, addExpense);

router.route("/:id").delete(protect, deleteExpense);

// ✅ Clear all user expenses
router.route("/clear/all").delete(protect, clearAllExpenses);

module.exports = router;
