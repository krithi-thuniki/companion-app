const Saved = require("../models/saved");
const Opportunity = require("../models/opportunity");

exports.listSaved = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const saved = await Saved.find({ user: userId }).populate("opportunity").lean();
    const items = saved.map(s => ({
      id: s._id,
      opportunity_id: s.opportunity?._id || null,
      title: s.opportunity?.title,
      company: s.opportunity?.company,
      type: s.opportunity?.type,
      location: s.opportunity?.location,
      url: s.opportunity?.url,
    }));
    res.json({ ok: true, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.saveItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id, title, company, type, location, mode, description, url, publishedAt } = req.body;
    if (!id) return res.status(400).json({ error: "Opportunity id required" });

    await Opportunity.updateOne(
      { _id: id },
      {
        _id: id,
        title, company, type, location, mode, description, url,
        published_at: publishedAt ? new Date(publishedAt) : undefined
      },
      { upsert: true }
    );

    await Saved.updateOne(
      { user: userId, opportunity: id },
      { user: userId, opportunity: id },
      { upsert: true }
    );

    res.json({ ok: true, message: "Saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.removeSaved = async (req, res) => {
  try {
    const { id } = req.params; // id is saved document id
    const result = await Saved.deleteOne({ _id: id });
    res.json({ ok: true, deleted: result.deletedCount || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
