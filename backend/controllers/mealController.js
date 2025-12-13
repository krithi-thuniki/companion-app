const Meal = require("../models/Meal");

// ✅ Get all meals for a user
exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(meals);
  } catch (err) {
    console.error("getMeals error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add a new meal
exports.addMeal = async (req, res) => {
  try {
    const { meal, calories, protein, carbs, fats } = req.body;
    if (!meal || !calories)
      return res.status(400).json({ message: "Missing required fields" });

    const newMeal = await Meal.create({
      user: req.user.id,
      meal,
      calories,
      protein,
      carbs,
      fats,
    });

    res.status(201).json(newMeal);
  } catch (err) {
    console.error("addMeal error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete a specific meal
exports.deleteMeal = async (req, res) => {
  try {
    await Meal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Meal deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Clear all meals for a user
exports.clearMeals = async (req, res) => {
  try {
    await Meal.deleteMany({ user: req.user.id });
    res.json({ message: "All meals cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
