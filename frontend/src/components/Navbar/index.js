import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // ✅ Updated logout to call backend API
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      // Always clear storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("name"); // or "currentUser" if used
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>MyApp</h2>
      </div>

      <ul className="navbar-main">
        {/* Academic Tools */}
        <li>
          <button onClick={() => toggleMenu("academic")}>Academic Tools ▼</button>
          {activeMenu === "academic" && (
            <ul className="submenu">
              <li><Link to="/academic/smart-notes">Smart Notes</Link></li>
              <li><Link to="/academic/assignment-tracker">Deadline Tracker</Link></li>
              <li><Link to="/academic/peer-learning">Peer Learning</Link></li>
              <li><Link to="/academic/faqs">FAQs / Activity Tracker</Link></li>
            </ul>
          )}
        </li>

        {/* Productivity */}
        <li>
          <button onClick={() => toggleMenu("productivity")}>Productivity ▼</button>
          {activeMenu === "productivity" && (
            <ul className="submenu">
              <li><Link to="/productivity/pomodoro">Pomodoro</Link></li>
              <li><Link to="/productivity/daily-journal">Daily Journal</Link></li>
            </ul>
          )}
        </li>

        {/* Finance & Lifestyle */}
        <li>
          <button onClick={() => toggleMenu("finance")}>Finance & Lifestyle ▼</button>
          {activeMenu === "finance" && (
            <ul className="submenu">
              <li><Link to="/finance/shared-expenses">Shared Expense Tracker</Link></li>
              <li><Link to="/finance/diet">Diet / Healthy Eating</Link></li>
            </ul>
          )}
        </li>

        {/* Career & Skill Growth */}
        <li>
          <button onClick={() => toggleMenu("career-growth")}>Career & Skill Growth ▼</button>
          {activeMenu === "career-growth" && (
            <ul className="submenu">
              <li><Link to="/career-growth/resume-builder">Resume Builder</Link></li>
              <li><Link to="/career-growth/internship-finder">Internship Finder</Link></li>
              <li><Link to="/career-growth/skill-tracker">Skill Progress Tracker</Link></li>
            </ul>
          )}
        </li>
      </ul>

      <div className="navbar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          Logout →
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
