import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const Navbar = () => {
  const navigate = useNavigate();

  // Logout handler
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
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      {/* LEFT LOGO */}
      <div className="navbar-logo">
        <h2>MyApp</h2>
      </div>

      {/* MAIN NAVIGATION */}
      <ul className="navbar-main">
        <li>
          <Link to="/academic" className="nav-item">
            Academic Tools
          </Link>
        </li>

        <li>
          <Link to="/productivity" className="nav-item">
            Productivity
          </Link>
        </li>

        <li>
          <Link to="/finance" className="nav-item">
            Finance & Lifestyle
          </Link>
        </li>

        <li>
          <Link to="/career-growth" className="nav-item">
            Career & Skill Growth
          </Link>
        </li>
      </ul>

      {/* LOGOUT BUTTON */}
      <div className="navbar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          Logout →
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
