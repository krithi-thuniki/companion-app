import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./index.css";

const toISO = (dateLike) => {
  // try to parse a variety of saved date keys and return ISO YYYY-MM-DD if possible
  const d = new Date(dateLike);
  if (!isNaN(d)) return d.toISOString().split("T")[0];
  return dateLike; // fallback (shouldn't happen for normal dates)
};

const loadAndNormalizeEntries = () => {
  const raw = JSON.parse(localStorage.getItem("journalEntries")) || {};
  const normalized = {};

  Object.entries(raw).forEach(([k, v]) => {
    const iso = toISO(k);
    // if there is collision (same ISO from two formats), prefer existing normalized value
    if (!normalized[iso]) {
      // ensure shape { text, mood }
      normalized[iso] = {
        text: v?.text ?? v, // handle if previous format stored string
        mood: v?.mood ?? (typeof v === "string" ? "🙂" : "🙂"),
      };
    }
  });

  return normalized;
};

const DailyJournal = () => {
  const todayISO = new Date().toISOString().split("T")[0];

  const [entries, setEntries] = useState(() => loadAndNormalizeEntries());
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [text, setText] = useState(entries[todayISO]?.text || "");
  const [mood, setMood] = useState(entries[todayISO]?.mood || "🙂");
  const [searchTerm, setSearchTerm] = useState("");

  // persist whenever entries change
  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  // keep editor synced when selectedDate or entries change
  useEffect(() => {
    setText(entries[selectedDate]?.text || "");
    setMood(entries[selectedDate]?.mood || "🙂");
  }, [selectedDate, entries]);

  // Save / update entry for selectedDate
  const saveEntry = () => {
    if (text.trim() === "") {
      alert("Please write something before saving.");
      return;
    }

    setEntries((prev) => ({
      ...prev,
      [selectedDate]: { text, mood },
    }));

    // optional UX: clear editor and go back to today
    setSelectedDate(todayISO);
    setText("");
    setMood("🙂");
  };

  const deleteEntry = (dateKey) => {
    if (!window.confirm(`Delete entry for ${dateKey}?`)) return;
    const updated = { ...entries };
    delete updated[dateKey];
    setEntries(updated);

    if (dateKey === selectedDate) {
      setSelectedDate(todayISO);
      setText("");
      setMood("🙂");
    }
  };

  const clearAllEntries = () => {
    if (!window.confirm("⚠️ This will delete ALL your journal entries. Continue?"))
      return;
    setEntries({});
    localStorage.removeItem("journalEntries");
    setSelectedDate(todayISO);
    setText("");
    setMood("🙂");
  };

  // counts
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  // Download TXT
  const downloadTXT = () => {
    if (Object.keys(entries).length === 0) {
      alert("No entries to download.");
      return;
    }
    let content = "";
    // sort ascending by date
    Object.entries(entries)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([date, entry]) => {
        content += `${date} [${entry?.mood || "🙂"}]\n${entry?.text || ""}\n\n`;
      });
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "journal.txt";
    link.click();
  };

  // Table PDF export
  const downloadTablePDF = () => {
    if (Object.keys(entries).length === 0) {
      alert("No entries to export.");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("📖 My Journal (Table View)", 14, 20);

    const rows = Object.entries(entries)
      .sort((a, b) => b[0].localeCompare(a[0])) // newest first
      .map(([date, entry]) => [
        date,
        entry?.mood || "🙂",
        entry?.text ? entry.text.replace(/\n/g, " ") : "",
      ]);

    autoTable(doc, {
      head: [["Date", "Mood", "Entry"]],
      body: rows,
      startY: 30,
      styles: { fontSize: 10, cellWidth: "wrap" },
      columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 20 }, 2: { cellWidth: 140 } },
    });

    doc.save("journal-table.pdf");
  };

  // Grouped PDF export (journal style)
  const downloadGroupedPDF = () => {
    if (Object.keys(entries).length === 0) {
      alert("No entries to export.");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("📑 My Journal (Grouped View)", 14, 20);

    let y = 30;
    const sorted = Object.entries(entries).sort((a, b) => b[0].localeCompare(a[0])); // newest first

    for (const [date, entry] of sorted) {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(40, 40, 150);
      // Format date for readability
      let pretty = date;
      try {
        pretty = new Date(date).toDateString();
      } catch (e) {}
      doc.text(pretty, 14, y);
      y += 8;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Mood: ${entry?.mood || "🙂"}`, 20, y);
      y += 8;

      const splitText = doc.splitTextToSize(entry?.text || "", 170);
      doc.text(splitText, 20, y);
      y += splitText.length * 6 + 10;
    }

    doc.save("journal-grouped.pdf");
  };

  // Filtered & sorted entries for display (newest first)
  const displayedEntries = Object.entries(entries)
    .filter(([date, entry]) => {
      const q = (searchTerm || "").toLowerCase();
      if (!q) return true;
      const dateMatch = date.includes(q);
      const moodMatch = (entry?.mood || "").toLowerCase().includes(q);
      const textMatch = (entry?.text || "").toLowerCase().includes(q);
      return dateMatch || moodMatch || textMatch;
    })
    .sort((a, b) => b[0].localeCompare(a[0]));

  // longest streak (consecutive ISO dates)
  const getStreak = () => {
    const keys = Object.keys(entries).map((k) => new Date(k)).filter((d) => !isNaN(d));
    if (!keys.length) return 0;
    const dates = keys.sort((a, b) => a - b);
    let streak = 1,
      maxStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 1;
      }
    }
    return maxStreak;
  };

  return (
    <div>
      <Navbar />
      <div className="page-content">
        <div className="journal-container">
          <h1>📝 Daily Journal</h1>
          <p>Write short notes, reflections or gratitude.</p>

          {/* Controls: date picker + mood */}
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
            <button onClick={clearAllEntries} style={{ marginLeft: "auto", background: "#ff6b6b", color: "white" }}>
              🗑️ Clear All
            </button>
          </div>

          <textarea
            rows={6}
            placeholder="How was your day? What did you learn or feel?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
            <div>✍️ {charCount} characters | {wordCount} words</div>
            <button onClick={downloadTXT}>⬇️ Download TXT</button>
            <button onClick={downloadTablePDF}>📄 Download Table PDF</button>
            <button onClick={downloadGroupedPDF}>📑 Download Grouped PDF</button>
            <div style={{ marginLeft: "auto", fontWeight: "600", color: "#5f2eea" }}>
              🔥 Longest Streak: {getStreak()} days
            </div>
          </div>

          {/* Search */}
          <div style={{ marginTop: 14 }}>
            <input
              type="text"
              placeholder="🔍 Search by date, mood or text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
          </div>

          {/* History */}
          <div className="past-entries" style={{ marginTop: 18 }}>
            <h2>📖 Journal History</h2>
            {displayedEntries.length === 0 ? (
              <p>No entries found.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {displayedEntries.map(([date, entry]) => {
                  const pretty = (() => {
                    try {
                      return new Date(date).toDateString();
                    } catch (e) {
                      return date;
                    }
                  })();
                  return (
                    <li key={date} style={{ background: "#f8f9ff", margin: "8px 0", padding: 12, borderRadius: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong>{pretty}</strong> <span style={{ color: "#666" }}>[{entry?.mood || "🙂"}]</span>
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
                          <button onClick={() => deleteEntry(date)} style={{ background: "#ff6b6b", color: "white" }}>
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{entry?.text || ""}</div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyJournal;
