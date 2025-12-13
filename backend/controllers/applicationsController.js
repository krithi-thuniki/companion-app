const Application = require("../models/application");
const Opportunity = require("../models/opportunity");
const User = require("../models/user");

/**
 * 📋 List all applications for the logged-in user
 */
exports.listApplications = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const apps = await Application.find({ user: userId })
      .populate({ path: "opportunity", model: "Opportunity" })
      .sort({ createdAt: -1 })
      .lean();

    const items = apps.map((a) => ({
      id: a._id,
      opportunityId: a.opportunity?._id || a.opportunity,
      status: a.status,
      created_at: a.createdAt,
      title: a.opportunity?.title,
      company: a.opportunity?.company,
      type: a.opportunity?.type,
      location: a.opportunity?.location,
    }));

    res.json({ ok: true, items });
  } catch (err) {
    console.error("❌ listApplications error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * 📝 Create a new application (internship apply)
 */
exports.createApplication = async (req, res) => {
  try {
    const item = req.body.item || req.body;
    const {
      id,
      title,
      company,
      type,
      location,
      mode,
      description,
      url,
      publishedAt,
    } = item;

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!id) return res.status(400).json({ error: "Opportunity id required" });

    // ✅ Upsert (insert or update) the related opportunity
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
        published_at: publishedAt ? new Date(publishedAt) : undefined,
      },
      { upsert: true }
    );

    // ✅ Prevent duplicate application
    const existing = await Application.findOne({ user: userId, opportunity: id });
    if (existing) {
      return res.json({
        ok: true,
        message: "Application already exists",
        item: {
          id: existing._id,
          opportunityId: id,
          status: existing.status,
          createdAt: existing.createdAt,
        },
      });
    }

    const status = req.body.status || "Applied";
    const app = await Application.create({
      user: userId,
      opportunity: id,
      status,
    });

    res.json({
      ok: true,
      item: {
        id: app._id,
        opportunityId: id,
        status,
        createdAt: app.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ createApplication error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🔄 Update application status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await Application.updateOne({ _id: id }, { status });

    res.json({
      ok: true,
      updated:
        result.modifiedCount ||
        result.nModified ||
        (result.acknowledged ? 1 : 0),
    });
  } catch (err) {
    console.error("❌ updateStatus error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * ❌ Delete an application
 */
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Application.deleteOne({ _id: id });

    res.json({
      ok: true,
      deleted:
        result.deletedCount ||
        result.nDeleted ||
        (result.acknowledged ? 1 : 0),
    });
  } catch (err) {
    console.error("❌ deleteApplication error:", err);
    res.status(500).json({ error: err.message });
  }
};
