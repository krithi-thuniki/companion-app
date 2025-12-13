// backend/routes/groups.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // ✅ fixed import
const Group = require("../models/group");

// ✅ Get all groups
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find().populate("created_by members", "name email");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create a new group
router.post("/", protect, async (req, res) => {
  try {
    const { name, description } = req.body;

    const group = new Group({
      name,
      description,
      created_by: req.user.id, // ✅ matches schema
      members: [req.user.id],
    });

    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Join a group
router.post("/:id/join", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (group.members.includes(req.user.id))
      return res.status(400).json({ error: "Already a member" });

    group.members.push(req.user.id);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Leave a group
router.delete("/:id/leave", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    group.members = group.members.filter(
      (m) => m.toString() !== req.user.id.toString()
    );
    await group.save();
    res.json({ message: "Left group successfully", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
