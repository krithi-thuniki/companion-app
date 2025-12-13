const Journal = require("../models/journal");

// 📖 Get all journals for logged-in user
exports.getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(journals);
  } catch (err) {
    console.error("Error fetching journals:", err);
    res.status(500).json({ message: "Server error fetching journals" });
  }
};

// 💾 Save or update journal for a date
exports.saveJournal = async (req, res) => {
  try {
    const { date, text, mood } = req.body;
    if (!date || !text) {
      return res.status(400).json({ message: "Date and text are required" });
    }

    let journal = await Journal.findOne({ user: req.user.id, date });

    if (journal) {
      journal.text = text;
      journal.mood = mood;
      await journal.save();
    } else {
      journal = await Journal.create({
        user: req.user.id,
        date,
        text,
        mood,
      });
    }

    res.json(journal);
  } catch (err) {
    console.error("Error saving journal:", err);
    res.status(500).json({ message: "Server error saving journal" });
  }
};

// ❌ Delete single journal by date
exports.deleteJournal = async (req, res) => {
  try {
    const date = req.params.date;
    await Journal.findOneAndDelete({ user: req.user.id, date });
    res.json({ message: "Journal deleted" });
  } catch (err) {
    console.error("Error deleting journal:", err);
    res.status(500).json({ message: "Server error deleting journal" });
  }
};

// ⚠️ Delete all journals for the user
exports.clearAllJournals = async (req, res) => {
  try {
    await Journal.deleteMany({ user: req.user.id });
    res.json({ message: "All journals cleared" });
  } catch (err) {
    console.error("Error clearing journals:", err);
    res.status(500).json({ message: "Server error clearing journals" });
  }
};
