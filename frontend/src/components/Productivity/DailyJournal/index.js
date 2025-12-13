import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import "./index.css";

const API_BASE = "http://localhost:5000";

const DailyJournal = () => {
  const todayISO = new Date().toISOString().split("T")[0];
  const [entries, setEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [text, setText] = useState("");
  const [mood, setMood] = useState("🙂");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Fetch all journal entries (✅ merged fix)
  const fetchJournals = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/journal`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();

      // ✅ Merge instead of replace
      setEntries((prev) => {
        const updated = { ...prev };
        data.forEach((e) => {
          updated[e.date] = { text: e.text, mood: e.mood };
        });
        return updated;
      });
    } catch (err) {
      console.error("⚠️ Error fetching journals:", err);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  // 💾 Save or update entry
  const saveEntry = async () => {
    if (text.trim() === "") {
      alert("Please write something before saving.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/journal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ date: selectedDate, text, mood }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("❌ Failed to save:", data);
        alert("Failed to save entry. Check backend logs.");
        return;
      }

      console.log("✅ Journal saved:", data);

      // 🟢 Merge the saved entry locally instead of refetching everything
      setEntries((prev) => ({
        ...prev,
        [data.date]: { text: data.text, mood: data.mood },
      }));

      // Reset form
      setSelectedDate(todayISO);
      setText("");
      setMood("🙂");
    } catch (err) {
      console.error("⚠️ Error saving entry:", err);
    }
  };

  // ❌ Delete a single entry
  const deleteEntry = async (dateKey) => {
    if (!window.confirm(`Delete entry for ${dateKey}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/journal/${dateKey}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        // ✅ Remove deleted entry from local state
        setEntries((prev) => {
          const updated = { ...prev };
          delete updated[dateKey];
          return updated;
        });
      } else {
        console.error("❌ Failed to delete entry:", await res.text());
      }
    } catch (err) {
      console.error("⚠️ Error deleting entry:", err);
    }
  };

  // ⚠️ Clear all entries
  const clearAllEntries = async () => {
    if (!window.confirm("⚠️ This will delete ALL your journal entries. Continue?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/journal`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        setEntries({});
        setSelectedDate(todayISO);
        setText("");
        setMood("🙂");
      } else {
        console.error("❌ Failed to clear entries:", await res.text());
      }
    } catch (err) {
      console.error("⚠️ Error clearing entries:", err);
    }
  };

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  const displayedEntries = Object.entries(entries)
    .filter(([date, entry]) => {
      const q = (searchTerm || "").toLowerCase();
      if (!q) return true;
      return (
        date.includes(q) ||
        entry.mood.toLowerCase().includes(q) ||
        entry.text.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div>
      <Navbar />
      <div className="page-content">
        <div className="journal-container">
          <h1>📝 Daily Journal</h1>
          <p>Write short notes, reflections or gratitude.</p>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
              <option>🙂 Happy</option>
              <option>😐 Neutral</option>
              <option>😔 Sad</option>
              <option>😡 Angry</option>
              <option>😴 Tired</option>
              <option>😍 Excited</option>
            </select>
            <button onClick={saveEntry}>💾 Save Entry</button>
            <button
              onClick={clearAllEntries}
              style={{ marginLeft: "auto", background: "#ff6b6b", color: "white" }}
            >
              🗑️ Clear All
            </button>
          </div>

          <textarea
            rows={6}
            placeholder="How was your day?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div style={{ marginTop: 8 }}>
            ✍️ {charCount} characters | {wordCount} words
          </div>

          <div style={{ marginTop: 14 }}>
            <input
              type="text"
              placeholder="🔍 Search by date, mood or text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
          </div>

          <div className="past-entries" style={{ marginTop: 18 }}>
            <h2>📖 Journal History</h2>
            {displayedEntries.length === 0 ? (
              <p>No entries found.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {displayedEntries.map(([date, entry]) => (
                  <li
                    key={date}
                    style={{ background: "#f8f9ff", margin: "8px 0", padding: 12, borderRadius: 8 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <strong>{new Date(date).toDateString()}</strong>{" "}
                        <span style={{ color: "#666" }}>[{entry?.mood || "🙂"}]</span>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => {
                            setSelectedDate(date);
                            setText(entry?.text || "");
                            setMood(entry?.mood || "🙂");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteEntry(date)}
                          style={{ background: "#ff6b6b", color: "white" }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{entry?.text || ""}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyJournal;
