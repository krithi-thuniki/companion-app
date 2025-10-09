const { aggregate } = require("../services/sources");

exports.search = async (req, res) => {
  try {
    const { q = "", type = "", location = "", mode = "", limit = 50 } = req.query;
    const data = await aggregate({ q, type, location, mode, limit });
    res.json({ ok: true, count: data.length, results: data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: "Failed to load opportunities" });
  }
};

exports.details = async (req, res) => {
  // NOTE: external APIs don't give stable item-by-id fetch,
  // so front-end should pass the full item in state or refetch list and pick by id.
  // Here we simply re-query and find by id if needed.
  const { id = "" } = req.params;
  const { q = "" } = req.query;
  try {
    const data = await aggregate({ q, limit: 200 });
    const found = data.find(x => x.id === id);
    if (!found) return res.status(404).json({ ok: false, message: "Not found" });
    res.json({ ok: true, item: found });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: "Failed to load detail" });
  }
};
