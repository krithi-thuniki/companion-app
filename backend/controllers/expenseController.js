const Expense = require("../models/Expense");

// ✅ Fetch all expenses for a user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("getExpenses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add new expense
exports.addExpense = async (req, res) => {
  try {
    const { person, amount, category } = req.body;
    if (!person || !amount)
      return res.status(400).json({ message: "Person and amount are required" });

    const expense = await Expense.create({
      user: req.user.id,
      person,
      amount,
      category,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error("addExpense error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!expense) return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("deleteExpense error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Clear all user expenses
exports.clearAllExpenses = async (req, res) => {
  try {
    await Expense.deleteMany({ user: req.user.id });
    res.json({ success: true });
  } catch (err) {
    console.error("clearAllExpenses error:", err);
    res.status(500).json({ message: "Server error" });
  }

};
