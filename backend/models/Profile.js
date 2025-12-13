const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  activity: { type: String, enum: ["sedentary", "light", "moderate", "active"], default: "sedentary" },
});

module.exports = mongoose.model("Profile", profileSchema);
