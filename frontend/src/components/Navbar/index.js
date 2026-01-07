import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

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
      localStorage.removeItem("currentUser");
      navigate("/login");
    }
  };

  // Handle protected navigation
  const handleProtectedNav = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate("/login", { state: { from: path } });
    }
  };

  // Navigate to login
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div 
        className="navbar-logo" 
        onClick={() => navigate("/")} 
        style={{ cursor: "pointer" }}
      >
        <h2>MyApp</h2>
      </div>

      <ul className="navbar-main">
        <li>
          <span
            className="nav-item"
            onClick={() => handleProtectedNav("/academic")}
            style={{ cursor: "pointer" }}
          >
            Academic Tools
          </span>
        </li>
        <li>
          <span
            className="nav-item"
            onClick={() => handleProtectedNav("/productivity")}
            style={{ cursor: "pointer" }}
          >
            Productivity
          </span>
        </li>
        <li>
          <span
            className="nav-item"
            onClick={() => handleProtectedNav("/finance")}
            style={{ cursor: "pointer" }}
          >
            Finance & Lifestyle
          </span>
        </li>
        <li>
          <span
            className="nav-item"
            onClick={() => handleProtectedNav("/career")}
            style={{ cursor: "pointer" }}
          >
            Career & Skill Growth
          </span>
        </li>
      </ul>

      <div className="navbar-logout">
        {/* Login button always visible */}
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        {/* Logout button visible only when logged in */}
        {isLoggedIn && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
