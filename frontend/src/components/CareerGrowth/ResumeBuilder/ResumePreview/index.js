import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../Navbar";
import html2pdf from "html2pdf.js";
import "./index.css";

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    linkedin: "",
    education: ""
  });

  const [sections, setSections] = useState([]);
  const formPanelRef = useRef(null);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedResume = localStorage.getItem("resumeData");
    const savedSections = localStorage.getItem("resumeSections");

    if (savedResume) setResumeData(JSON.parse(savedResume));
    if (savedSections) setSections(JSON.parse(savedSections));
  }, []);

  const handleChange = (e) => {
    setResumeData({
      ...resumeData,
      [e.target.name]: e.target.value
    });
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  const addSection = () => {
    setSections([...sections, { heading: "", content: "" }]);
    // Scroll to bottom so buttons remain visible
    setTimeout(() => {
      if (formPanelRef.current) {
        formPanelRef.current.scrollTop = formPanelRef.current.scrollHeight;
      }
    }, 100);
  };

  const saveResume = () => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    localStorage.setItem("resumeSections", JSON.stringify(sections));
    alert("Resume saved successfully!");
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      setResumeData({
        name: "",
        role: "",
        email: "",
        phone: "",
        linkedin: "",
        education: ""
      });
      setSections([]);
      localStorage.removeItem("resumeData");
      localStorage.removeItem("resumeSections");
    }
  };

  const downloadPDF = () => {
    html2pdf()
      .from(document.getElementById("resume"))
      .set({
        filename: "Resume.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4" }
      })
      .save();
  };

  return (
    <>
      <Navbar />

      <div className="builder-container">
        {/* LEFT SIDE — FORM */}
        <div className="form-panel" ref={formPanelRef}>
          <h2>Resume Details</h2>

          <input name="name" placeholder="Full Name" onChange={handleChange} value={resumeData.name} />
          <input name="role" placeholder="Role" onChange={handleChange} value={resumeData.role} />
          <input name="email" placeholder="Email" onChange={handleChange} value={resumeData.email} />
          <input name="phone" placeholder="Phone" onChange={handleChange} value={resumeData.phone} />
          <input name="linkedin" placeholder="LinkedIn" onChange={handleChange} value={resumeData.linkedin} />
          <textarea
            name="education"
            placeholder="Education"
            onChange={handleChange}
            value={resumeData.education}
          />

          <button onClick={addSection} className="add-section-btn" style={{ marginTop: "10px" }}>
            ➕ Add Section
          </button>

          {sections.map((section, index) => (
            <div key={index} className="dynamic-section">
              <input
                placeholder="Section Heading"
                value={section.heading}
                onChange={(e) =>
                  handleSectionChange(index, "heading", e.target.value)
                }
              />
              <textarea
                placeholder="Section Content"
                value={section.content}
                onChange={(e) =>
                  handleSectionChange(index, "content", e.target.value)
                }
              />
            </div>
          ))}

          {/* Left-side buttons: Save, Download PDF, Clear All */}
          <div style={{ marginTop: "10px" }}>
            <button onClick={saveResume} style={{ marginRight: "10px" }}>
              💾 Save Resume
            </button>
            <button onClick={downloadPDF} style={{ marginRight: "10px" }}>
              📄 Download PDF
            </button>
            <button onClick={clearAll} style={{ marginRight: "10px" }}>
              🗑 Clear All
            </button>
          </div>
        </div>

        {/* RIGHT SIDE — LIVE PREVIEW */}
        <div className="preview-panel">
          <div className="resume-card" id="resume">
            {resumeData.name && (
              <>
                <h1>{resumeData.name}</h1>
                <p className="role">{resumeData.role}</p>
                <p className="contact">
                  {resumeData.email} | {resumeData.phone} | {resumeData.linkedin}
                </p>

                <section>
                  <h3>Education</h3>
                  <p>{resumeData.education || "Education details go here"}</p>
                </section>

                {sections.map((section, index) => (
                  <section key={index}>
                    <h3>{section.heading || "Section Heading"}</h3>
                    <p>{section.content || "Section content goes here"}</p>
                  </section>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeBuilder;
