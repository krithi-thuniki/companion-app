const Application = require("../models/application");
const Opportunity = require("../models/opportunity");
const User = require("../models/user");

exports.listApplications = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const apps = await Application.find({ user: userId })
      .populate({ path: "opportunity", model: "Opportunity" })
      .sort({ createdAt: -1 })
      .lean();

    const items = apps.map(a => ({
      id: a._id,
      opportunityId: a.opportunity?._id || a.opportunity,
      status: a.status,
      created_at: a.createdAt,
      title: a.opportunity?.title,
      company: a.opportunity?.company,
      type: a.opportunity?.type,
      location: a.opportunity?.location
    }));

    res.json({ ok: true, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.createApplication = async (req, res) => {
  try {
    const item = req.body.item || req.body;
    const { id, title, company, type, location, mode, description, url, publishedAt } = item;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!id) return res.status(400).json({ error: "Opportunity id required" });

    // upsert opportunity using external id as _id
    await Opportunity.updateOne(
      { _id: id },
      {
        _id: id,
        title,
        company,
        type,
        location,
        mode,
        description,
        url,
        published_at: publishedAt ? new Date(publishedAt) : undefined
      },
      { upsert: true }
    );

    const status = req.body.status || "Applied";
    const app = await Application.create({
      user: userId,
      opportunity: id,
      status,
    });

    res.json({
      ok: true,
      item: { id: app._id, opportunityId: id, status, createdAt: app.createdAt }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await Application.updateOne({ _id: id }, { status });
    res.json({ ok: true, updated: result.nModified || result.modifiedCount || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
