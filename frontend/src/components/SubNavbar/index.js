import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./index.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* LEFT LOGO */}
      <div className="navbar-logo" onClick={() => navigate("/home")}>
        MyApp
      </div>

      {/* CENTER LINKS */}
      <div className="navbar-links">
        <NavLink to="/productivity/pomodoro">Pomodoro</NavLink>
        <NavLink to="/productivity/daily-journal">Daily Journal</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
