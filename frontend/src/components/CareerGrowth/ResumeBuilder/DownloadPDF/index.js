import React from "react";
import Navbar from "../../../Navbar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./index.css";

const DownloadPDF = () => {
  const handleDownload = () => {
    const resumeData = JSON.parse(localStorage.getItem("resumeData")) || {};
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

  return (
    <>
      <Navbar />
      <div className="resume-container">
        <div className="resume-card">
          <h2 className="resume-title">Download Resume</h2>
          <button className="btn-submit" onClick={handleDownload}>
            Download as PDF
          </button>
        </div>
      </div>
    </>
  );
};

export default DownloadPDF;
