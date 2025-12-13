const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMeals, addMeal, deleteMeal, clearMeals } = require("../controllers/mealController");

// Protected routes
router.get("/", protect, getMeals);
router.post("/", protect, addMeal);
router.delete("/:id", protect, deleteMeal);
router.delete("/clear/all", protect, clearMeals);

module.exports = router;
