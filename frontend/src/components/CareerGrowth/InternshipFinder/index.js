import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaListUl, FaStar, FaChartLine, FaMedal } from "react-icons/fa";
import Navbar from "../../Navbar";
import "./index.css";

const InternshipFinder = () => {
  const features = [
    {
      icon: <FaSearch />,
      title: "Search",
      desc: "Find internships by role, skills, or location.",
      path: "/career/internships/search",
    },
    {
      icon: <FaListUl />,
      title: "Internship List",
      desc: "Browse curated internship opportunities.",
      path: "/career/internships/list",
    },
    {
      icon: <FaStar />,
      title: "Saved Internships",
      desc: "Bookmark and revisit your favorite internships.",
      path: "/career/internships/saved",
    },
    {
      icon: <FaChartLine />,
      title: "Application Tracker",
      desc: "Track your applications & status updates.",
      path: "/career/internships/tracker",
    },
    {
      icon: <FaMedal />,
      title: "Badges",
      desc: "Earn badges as you progress in your journey.",
      path: "/career/internships/badges",
    },
  ];

  return (
    <div>
      {/* Navbar stays fixed at the top */}
      <Navbar />

      {/* Main content pushed below navbar */}
      <div className="page-content">
        <div className="internship-finder">
          <h2>🚀 Internship Finder</h2>
          <p className="subtitle">
            Grow your career with internships tailored to your skills.
          </p>

          <div className="finder-grid">
            {features.map((feature, idx) => (
              <Link to={feature.path} key={idx} className="feature-card">
                <div className="icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipFinder;
