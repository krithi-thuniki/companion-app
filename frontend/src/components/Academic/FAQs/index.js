import React from "react";
import { NavLink, Link } from "react-router-dom";
import "../academic.css";

const FAQs = () => {
  return (
    <div>
    
    {/* 🔹 Replace Navbar with inline academic sub-navbar */}
    <nav className="sub-navbar">
      <div className="sub-nav-left">
        <Link to="/" className="sub-nav-logo">MyApp</Link>

        <NavLink
          id="tour-smart-notes"
          to="/academic/smart-notes"
          className={({ isActive }) => isActive ? "sub-nav-item active" : "sub-nav-item"}
        >Smart Notes</NavLink>

        <NavLink
          id="tour-deadline"
          to="/academic/assignment-tracker"
          className={({ isActive }) => isActive ? "sub-nav-item active" : "sub-nav-item"}
        >Deadline Tracker</NavLink>

        <NavLink
          id="tour-peer"
          to="/academic/peer-learning"
          className={({ isActive }) => isActive ? "sub-nav-item active" : "sub-nav-item"}
        >Peer Learning</NavLink>

        <NavLink
          id="tour-faq"
          to="/academic/faqs"
          className={({ isActive }) => isActive ? "sub-nav-item active" : "sub-nav-item"}
        >FAQs</NavLink>
      </div>
    </nav>
   </div>
  );
};

export default FAQs;
