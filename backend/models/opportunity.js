const mongoose = require("mongoose");

const OpportunitySchema = new mongoose.Schema({
  _id: { type: String }, // use external id as _id for deduplication
  title: String,
  company: String,
  type: String,
  location: String,
  mode: String,
  description: String,
  url: String,
  published_at: Date,
}, { timestamps: true });

module.exports = mongoose.model("Opportunity", OpportunitySchema);
