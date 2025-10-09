const express = require("express");
const router = express.Router();
const Message = require("../../models/message");
const { authMiddleware } = require("../../middleware/auth");

// Get messages of a group
router.get("/:groupId", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await Message.find({ group: groupId })
      .sort({ createdAt: 1 })
      .lean();

    res.json(
      messages.map(m => ({
        id: m._id,
        groupId: m.group,
        userId: m.user,
        senderName: m.senderName,
        text: m.text,
        createdAt: m.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
