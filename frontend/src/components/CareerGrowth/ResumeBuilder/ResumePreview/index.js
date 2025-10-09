import React, { useState } from "react";
import Navbar from "../../../Navbar";
import "./index.css";

const ResumePreview = () => {
  // Load resume data from localStorage
  const resumeData = JSON.parse(localStorage.getItem("resumeData")) || {};

  // Section toggle state
  const [sectionsOpen, setSectionsOpen] = useState({
    education: true,
    experience: true,
    skills: true,
    projects: true,
    achievements: true,
  });

  const toggleSection = (section) =>
    setSectionsOpen({ ...sectionsOpen, [section]: !sectionsOpen[section] });

  // Default skills if none provided
  const skillsList = resumeData.skills?.length
    ? resumeData.skills
    : ["HTML", "CSS", "JavaScript", "React JS", "Node JS"];

  return (
    <>
      <Navbar />
      <div className="resume-container">
        <div className="resume-card resume-preview">
          <h2 className="resume-title">👀 Resume Preview</h2>

          {/* Basic Info */}
          <div className="basic-info">
            <p>
              <strong>Name:</strong> {resumeData.name || "John Doe"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${resumeData.email || "john@example.com"}`}>
                {resumeData.email || "john@example.com"}
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a href={`tel:${resumeData.phone || "+1234567890"}`}>
                {resumeData.phone || "+1234567890"}
              </a>
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a
                href={resumeData.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
              >
                {resumeData.linkedin || "linkedin.com"}
              </a>
            </p>
          </div>

          {/* Education */}
          <div className="resume-section">
            <h3
              className="collapsible"
              onClick={() => toggleSection("education")}
            >
              🎓 Education {sectionsOpen.education ? "▲" : "▼"}
            </h3>
            <div className={`content ${sectionsOpen.education ? "open" : ""}`}>
              <ul>
                {resumeData.education?.map((edu, i) => (
                  <li key={i}>{edu}</li>
                )) || <li>B.Tech CSE - Example University</li>}
              </ul>
            </div>
          </div>

          {/* Experience */}
          <div className="resume-section">
            <h3
              className="collapsible"
              onClick={() => toggleSection("experience")}
            >
              💼 Experience {sectionsOpen.experience ? "▲" : "▼"}
            </h3>
            <div className={`content ${sectionsOpen.experience ? "open" : ""}`}>
              <ul>
                {resumeData.experience?.map((exp, i) => (
                  <li key={i}>{exp}</li>
                )) || <li>Internship at Example Company</li>}
              </ul>
            </div>
          </div>

          {/* Skills */}
          <div className="resume-section">
            <h3
              className="collapsible"
              onClick={() => toggleSection("skills")}
            >
              🛠 Skills {sectionsOpen.skills ? "▲" : "▼"}
            </h3>
            <div
              className={`content skills-content ${
                sectionsOpen.skills ? "open" : ""
              }`}
            >
              {skillsList.map((skill, i) => (
                <span key={i} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="resume-section">
            <h3
              className="collapsible"
              onClick={() => toggleSection("projects")}
            >
              📂 Projects {sectionsOpen.projects ? "▲" : "▼"}
            </h3>
            <div className={`content ${sectionsOpen.projects ? "open" : ""}`}>
              <ul>
                {resumeData.projects?.map((proj, i) => (
                  <li key={i}>
                    {proj.link ? (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {proj.name}
                      </a>
                    ) : (
                      proj.name
                    )}
                  </li>
                )) || <li>Example Project 1</li>}
              </ul>
            </div>
          </div>

          {/* Achievements */}
          <div className="resume-section">
            <h3
              className="collapsible"
              onClick={() => toggleSection("achievements")}
            >
              🏆 Achievements {sectionsOpen.achievements ? "▲" : "▼"}
            </h3>
            <div
              className={`content ${sectionsOpen.achievements ? "open" : ""}`}
            >
              <ul>
                {resumeData.achievements?.map((ach, i) => (
                  <li key={i}>{ach}</li>
                )) || <li>Example Achievement</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumePreview;
