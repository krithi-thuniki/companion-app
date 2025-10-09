// src/components/CareerGrowth/ResumeBuilder/index.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Navbar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import {
  FaFileAlt,
  FaEye,
  FaDownload,
  FaHome,
  FaSun,
  FaMoon,
  FaEnvelopeOpen,
  FaTrophy,
  FaCodeBranch,
  FaSearch,
  FaLightbulb,
  FaPalette,
} from "react-icons/fa";
import "./index.css";

const templates = ["modern", "classic", "creative"];

const ResumeBuilder = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [resumeData, setResumeData] = useState({});
  const [template, setTemplate] = useState("modern");
  const [coverLetter, setCoverLetter] = useState("");
  const [atsKeywords, setAtsKeywords] = useState("");
  const [bulletSuggestion, setBulletSuggestion] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("resumeData")) || {};
    setResumeData({
      name: data.name || "John Doe",
      email: data.email || "john@example.com",
      phone: data.phone || "123-456-7890",
      education: data.education || ["B.Tech in CSE"],
      experience: data.experience || ["Software Engineer at Infosys"],
      skills: data.skills || ["React", "Node.js", "CSS"],
      projects: data.projects || ["Portfolio Website", "Finance Tracker App"],
      achievements: data.achievements || ["AWS Certified", "Hackathon Winner"],
    });
  }, []);

  // ✅ PDF Export
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Resume", 14, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${resumeData.name}`, 14, 30);
    doc.text(`Email: ${resumeData.email}`, 14, 40);
    doc.text(`Phone: ${resumeData.phone}`, 14, 50);

    doc.autoTable({
      startY: 60,
      head: [["Section", "Details"]],
      body: [
        ["Education", resumeData.education?.join("\n") || ""],
        ["Experience", resumeData.experience?.join("\n") || ""],
        ["Skills", resumeData.skills?.join(", ") || ""],
        ["Projects", resumeData.projects?.join("\n") || ""],
        ["Achievements", resumeData.achievements?.join("\n") || ""],
      ],
      theme: "grid",
    });

    doc.save(`${resumeData.name}_Resume.pdf`);
  };

  // ✅ DOCX Export
  const handleDownloadDocx = () => {
    const content = `
Resume
------
Name: ${resumeData.name}
Email: ${resumeData.email}
Phone: ${resumeData.phone}

Education:
${resumeData.education?.join("\n")}

Experience:
${resumeData.experience?.join("\n")}

Skills:
${resumeData.skills?.join(", ")}

Projects:
${resumeData.projects?.join("\n")}

Achievements:
${resumeData.achievements?.join("\n")}
    `;
    const blob = new Blob([content], { type: "application/msword" });
    saveAs(blob, "resume.docx");
  };

  // ✅ Cover Letter Generator
  const handleCoverLetter = () => {
    const skillsText = Array.isArray(resumeData.skills)
      ? resumeData.skills.join(", ")
      : "";
    const text = `
Dear Hiring Manager,

I am excited to apply for this position. With my background in ${
      resumeData.experience?.[0] || "Software Engineering"
    }, and skills in ${skillsText}, 
I am confident I can contribute effectively to your team.

Thank you for considering my application.

Sincerely,
${resumeData.name}
    `;
    setCoverLetter(text.trim());
  };

  // ✅ Bullet Point Helper
  const suggestBullet = () => {
    setBulletSuggestion(
      "Use numbers & outcomes. Example: 'Increased system efficiency by 30% through React optimization.'"
    );
  };

  // ✅ ATS Keyword Matcher
  const matchedSkills = atsKeywords
    ? resumeData.skills?.filter((s) =>
        atsKeywords.toLowerCase().includes(s.toLowerCase())
      )
    : [];

  return (
    <>
      <Navbar />
      <div className={`resume-container ${darkMode ? "dark" : ""} ${template}`}>
        {/* Header */}
        <div className="header-section">
          <h2 className="resume-title">📄 Resume Builder</h2>
          <p className="resume-subtitle">Professional resume toolkit 🚀</p>
        </div>

        {/* Template Selector */}
        <div className="template-selector">
          <FaPalette /> Choose Template:{" "}
          {templates.map((temp) => (
            <button
              key={temp}
              className={`template-btn ${template === temp ? "active" : ""}`}
              onClick={() => setTemplate(temp)}
            >
              {temp.charAt(0).toUpperCase() + temp.slice(1)}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="nav-links">
          <Link to="/career/resume-builder/form" className="nav-card">
            <FaFileAlt /> Fill Resume Form
          </Link>
          <Link to="/career/resume-builder/preview" className="nav-card">
            <FaEye /> Preview Resume
          </Link>
          <button onClick={handleDownloadPDF} className="nav-card">
            <FaDownload /> Export PDF
          </button>
          <button onClick={handleDownloadDocx} className="nav-card">
            <FaDownload /> Export DOCX
          </button>
        </div>

        {/* Tools */}
        <h3 className="extra-title">✨ Resume Tools</h3>
        <div className="extra-tools">
          {/* Projects */}
          <div className="tool-card">
            <FaCodeBranch className="icon-lg" />
            <h4>Projects</h4>
            <ul>{resumeData.projects?.map((proj, i) => <li key={i}>{proj}</li>)}</ul>
          </div>

          {/* Achievements */}
          <div className="tool-card">
            <FaTrophy className="icon-lg" />
            <h4>Achievements</h4>
            <ul>{resumeData.achievements?.map((ach, i) => <li key={i}>{ach}</li>)}</ul>
          </div>

          {/* ATS Helper */}
          <div className="tool-card">
            <FaSearch className="icon-lg" />
            <h4>ATS Tailoring</h4>
            <textarea
              placeholder="Paste job description here..."
              value={atsKeywords}
              onChange={(e) => setAtsKeywords(e.target.value)}
            />
            {atsKeywords && (
              <p className="ats-tip">
                ✅ Matched Skills: {matchedSkills.join(", ") || "No direct matches"}
              </p>
            )}
          </div>

          {/* Cover Letter */}
          <div className="tool-card">
            <FaEnvelopeOpen className="icon-lg" />
            <h4>Cover Letter Generator</h4>
            <button onClick={handleCoverLetter}>Generate</button>
            {coverLetter && (
              <textarea
                value={coverLetter}
                readOnly
                style={{ height: "150px", marginTop: "10px" }}
              />
            )}
          </div>

          {/* Bullet Helper */}
          <div className="tool-card">
            <FaLightbulb className="icon-lg" />
            <h4>Bullet Point Helper</h4>
            <button onClick={suggestBullet}>Suggest Format</button>
            {bulletSuggestion && <p className="bullet-tip">{bulletSuggestion}</p>}
          </div>
        </div>

        {/* Controls */}
        <div className="footer-controls">
          <button onClick={() => setDarkMode(!darkMode)} className="toggle-btn">
            {darkMode ? <FaSun /> : <FaMoon />}{" "}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <Link to="/home" className="home-btn">
            <FaHome /> Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default ResumeBuilder;
