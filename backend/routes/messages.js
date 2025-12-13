// backend/routes/messages.js
const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const { protect } = require("../middleware/authMiddleware"); // ✅ fixed import

// ✅ Get messages of a specific group
router.get("/:groupId", protect, async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await Message.find({ group: groupId })
      .sort({ createdAt: 1 })
      .lean();

    res.json(
      messages.map((m) => ({
        id: m._id,
        groupId: m.group,
        userId: m.user,
        senderName: m.senderName,
        text: m.text,
        createdAt: m.createdAt,
      }))
    );
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
