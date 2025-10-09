const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "..", "data.json");

function readStore() {
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify({ saved: [], applications: [] }, null, 2));
  }
  const raw = fs.readFileSync(STORE_PATH, "utf-8");
  try {
    const data = JSON.parse(raw);
    if (!data.saved) data.saved = [];
    if (!data.applications) data.applications = [];
    return data;
  } catch {
    return { saved: [], applications: [] };
  }
}

function writeStore(next) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(next, null, 2));
}

module.exports = { readStore, writeStore };
