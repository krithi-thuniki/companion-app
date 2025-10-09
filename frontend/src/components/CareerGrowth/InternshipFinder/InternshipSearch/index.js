import React, { useState, useEffect } from "react";
import Navbar from "../../../Navbar";
import { fetchJobsAndInternships } from "../../../../services/api"; // optional API for suggestions
import "./index.css";

const InternshipSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("searchHistory")) || []
  );
  const [suggestions, setSuggestions] = useState([]);
  const [internships, setInternships] = useState([]);

  // Load internships for search suggestions
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchJobsAndInternships("internship", 1);
      setInternships(data);
    };
    loadData();
  }, []);

  // Update suggestions as user types
  useEffect(() => {
    if (!keyword) {
      setSuggestions([]);
      return;
    }
    const filtered = internships.filter((job) =>
      job.job_title.toLowerCase().includes(keyword.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5)); // max 5 suggestions
  }, [keyword, internships]);

  const handleSearch = (term) => {
    if (!term) return;
    const updatedHistory = [term, ...history.filter((h) => h !== term)];
    setHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    setKeyword("");
    setSuggestions([]);
    alert(`Search triggered for "${term}"`); // replace with actual search navigation
  };

  const deleteHistoryItem = (term) => {
    const updatedHistory = history.filter((h) => h !== term);
    setHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <div>
      <Navbar />
      <div className="internship-search">
        <h2>Search Internships</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search internships..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button onClick={() => handleSearch(keyword)}>Search</button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="suggestions">
            <h4>Suggestions:</h4>
            <ul>
              {suggestions.map((job) => (
                <li key={job.job_id} onClick={() => handleSearch(job.job_title)}>
                  🔹 {job.job_title} ({job.employer_name})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Search History */}
        {history.length > 0 && (
          <div className="recommendations">
            <h4>
              Recent Searches
              <button className="clear-history-btn" onClick={clearHistory}>
                Clear All
              </button>
            </h4>
            <ul>
              {history.map((h, i) => (
                <li key={i}>
                  <span onClick={() => handleSearch(h)}>🔎 {h}</span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteHistoryItem(h)}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipSearch;
