// If Node < 18, uncomment next 2 lines
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const REMOTEOK = "https://remoteok.com/api";
const REMOTIVE = "https://remotive.com/api/remote-jobs";
const ARBEITNOW = "https://arbeitnow.com/api/job-board-api";

const toTitle = (s) => (s || "").trim();
const toMode = (remote, location) => {
  if (remote === true) return "remote";
  if (typeof location === "string" && /remote/i.test(location)) return "remote";
  return "onsite";
};

function detectTypeFromTitle(title, tags = []) {
  const t = (title || "").toLowerCase();
  const joined = Array.isArray(tags) ? tags.join(" ").toLowerCase() : "";
  if (t.includes("intern") || t.includes("internship") || joined.includes("intern")) return "internship";
  return "job";
}

function normalizeRemotive(j) {
  return {
    id: `remotive_${j.id}`,
    provider: "remotive",
    type: detectTypeFromTitle(j.title, j.tags),
    title: toTitle(j.title),
    company: j.company_name,
    location: j.candidate_required_location || "Remote",
    mode: toMode(true, j.candidate_required_location),
    description: j.description || "",
    url: j.url,
    salaryMin: null,
    salaryMax: null,
    currency: null,
    publishedAt: j.publication_date,
    tags: j.tags || [],
  };
}

function normalizeRemoteOK(j) {
  return {
    id: `remoteok_${j.id}`,
    provider: "remoteok",
    type: detectTypeFromTitle(j.position, j.tags),
    title: toTitle(j.position),
    company: j.company,
    location: j.location || "Remote",
    mode: toMode(true, j.location),
    description: j.description || "",
    url: j.url,
    salaryMin: null,
    salaryMax: null,
    currency: null,
    publishedAt: j.date,
    tags: j.tags || [],
  };
}

function normalizeArbeitnow(j) {
  return {
    id: `arbeitnow_${j.slug}`,
    provider: "arbeitnow",
    type: detectTypeFromTitle(j.title, j.tags),
    title: toTitle(j.title),
    company: j.company_name,
    location: j.location || j.country || "",
    mode: toMode(j.remote, j.location),
    description: j.description || "",
    url: j.url,
    salaryMin: null,
    salaryMax: null,
    currency: null,
    publishedAt: j.created_at || j.updated_at || null,
    tags: j.tags || [],
  };
}

async function fetchRemotive(q = "") {
  const url = q ? `${REMOTIVE}?search=${encodeURIComponent(q)}` : REMOTIVE;
  const res = await fetch(url);
  const json = await res.json();
  return (json?.jobs || []).map(normalizeRemotive);
}

async function fetchRemoteOK(q = "") {
  const res = await fetch(REMOTEOK, { headers: { "User-Agent": "Mozilla/5.0" } });
  const json = await res.json();
  // First element is meta, remove it
  const items = Array.isArray(json) ? json.slice(1) : [];
  const filtered = q ? items.filter(j => `${j.position} ${j.company} ${j.tags?.join(" ")}`.toLowerCase().includes(q.toLowerCase())) : items;
  return filtered.map(normalizeRemoteOK);
}

async function fetchArbeitnow(q = "") {
  const res = await fetch(ARBEITNOW);
  const json = await res.json();
  const items = json?.data || [];
  const filtered = q ? items.filter(j => `${j.title} ${j.company_name} ${j.tags?.join(" ")}`.toLowerCase().includes(q.toLowerCase())) : items;
  return filtered.map(normalizeArbeitnow);
}

async function aggregate({ q = "", type = "", location = "", mode = "", limit = 50 } = {}) {
  const [a, b, c] = await Promise.allSettled([
    fetchRemotive(q),
    fetchRemoteOK(q),
    fetchArbeitnow(q)
  ]);

  const all = []
    .concat(a.value || [])
    .concat(b.value || [])
    .concat(c.value || []);

  // basic filters
  const filtered = all.filter(item => {
    const okType = !type ? true : item.type === type;
    const okLoc = !location ? true : (item.location || "").toLowerCase().includes(location.toLowerCase());
    const okMode = !mode ? true : item.mode === mode;
    return okType && okLoc && okMode;
  });

  // sort by date desc if available
  filtered.sort((x, y) => new Date(y.publishedAt || 0) - new Date(x.publishedAt || 0));

  return filtered.slice(0, Number(limit) || 50);
}

module.exports = { aggregate };
