const Application = require("../models/application");
const Opportunity = require("../models/opportunity");

exports.getBadges = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const apps = await Application.find({ user: userId }).populate("opportunity").lean();

    const badges = [];
    if (apps.length > 0) badges.push("🎉 First Application");

    const dataCount = apps.filter(a => /data/i.test(a.opportunity?.title || "")).length;
    if (dataCount >= 5) badges.push("📊 Data Enthusiast");

    const uniqueCompanies = new Set(apps.map(a => a.opportunity?.company)).size;
    if (uniqueCompanies >= 10) badges.push("🌍 Explorer");

    res.json({ ok: true, badges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
