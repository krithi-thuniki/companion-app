const mongoose = require("mongoose");

const SavedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  opportunity: { type: String, ref: "Opportunity", required: true }, // use opportunity _id (string)
  createdAt: { type: Date, default: Date.now },
});

SavedSchema.index({ user: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model("Saved", SavedSchema);
