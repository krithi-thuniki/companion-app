import React from "react";
import { useNavigate } from "react-router-dom";
import "./CareerHome.css";

const CareerHome = () => {
  const navigate = useNavigate();

  return (
    <div className="career-hero">
      {/* Text */}
      <div className="career-text">
        <h1>
          Career <span>Growth Platform</span>
        </h1>
        <p>
          Build resumes, preview profiles, and find internships — all in one
          place.
        </p>
      </div>

      {/* Cards */}
      <div className="career-cards">
        <div
          className="career-card left"
          onClick={() => navigate("/career/resume-builder/preview")}
        >
          <h3 className="card-title">Resume Preview</h3>
          <p className="card-desc">Professional resume layouts</p>
          <ul className="card-list">
            <li>Real-time preview</li>
            <li>Multiple templates</li>
          </ul>
        </div>

        <div
          className="career-card center"
          onClick={() => navigate("/career/resume-builder")}
        >
          <h3 className="card-title">Resume Builder</h3>
          <span className="card-badge">Most Used</span>
          <p className="card-desc">Create ATS-friendly resumes</p>
          <ul className="card-list">
            <li>Step-by-step form</li>
            <li>Live preview</li>
            <li>PDF & DOC export</li>
          </ul>
        </div>

        <div
          className="career-card right"
          onClick={() => navigate("/career/internships")}
        >
          <h3 className="card-title">Internship Finder</h3>
          <p className="card-desc">Search & track internships</p>
          <ul className="card-list">
            <li>Smart filters</li>
            <li>Application tracker</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CareerHome;
