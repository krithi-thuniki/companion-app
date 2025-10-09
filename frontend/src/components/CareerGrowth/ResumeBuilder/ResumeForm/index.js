import React, { useState } from "react";
import Navbar from "../../../Navbar";
import "./index.css";

const ResumeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: [""],
    experience: [""],
    skills: "",
    projects: [""],
    achievements: [""],
  });

  const handleChange = (e, index, field) => {
    if (["education", "experience", "projects", "achievements"].includes(field)) {
      const list = [...formData[field]];
      list[index] = e.target.value;
      setFormData({ ...formData, [field]: list });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleAdd = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleRemove = (field, index) => {
    const list = [...formData[field]];
    list.splice(index, 1);
    setFormData({ ...formData, [field]: list });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Resume Data:", formData);
    // Add PDF generation or save functionality here
  };

  return (
    <div className="resume-container">
      <Navbar />
      <div className="resume-card">
        <h2 className="resume-title">Build Your Resume</h2>
        <form className="resume-form" onSubmit={handleSubmit}>
          {/* Name, Email, Phone */}
          <div className="input-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
          </div>

          {/* Education */}
          <h3>Education</h3>
          <div className="dynamic-section">
            {formData.education.map((edu, idx) => (
              <div key={idx} className="dynamic-field">
                <textarea
                  value={edu}
                  onChange={(e) => handleChange(e, idx, "education")}
                  placeholder="Enter education details"
                />
                <button type="button" className="remove-btn" onClick={() => handleRemove("education", idx)}>Remove</button>
              </div>
            ))}
            <button type="button" className="add-btn" onClick={() => handleAdd("education")}>Add Education</button>
          </div>

          {/* Experience */}
          <h3>Experience</h3>
          <div className="dynamic-section">
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="dynamic-field">
                <textarea
                  value={exp}
                  onChange={(e) => handleChange(e, idx, "experience")}
                  placeholder="Enter experience details"
                />
                <button type="button" className="remove-btn" onClick={() => handleRemove("experience", idx)}>Remove</button>
              </div>
            ))}
            <button type="button" className="add-btn" onClick={() => handleAdd("experience")}>Add Experience</button>
          </div>

          {/* Skills */}
          <h3>Skills</h3>
          <div className="input-group">
            <textarea
              className="skills-textarea"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Enter your skills, separated by commas"
              rows={3}
            />
          </div>

          {/* Projects */}
          <h3>Projects</h3>
          <div className="dynamic-section">
            {formData.projects.map((proj, idx) => (
              <div key={idx} className="dynamic-field">
                <textarea
                  value={proj}
                  onChange={(e) => handleChange(e, idx, "projects")}
                  placeholder="Enter project details"
                />
                <button type="button" className="remove-btn" onClick={() => handleRemove("projects", idx)}>Remove</button>
              </div>
            ))}
            <button type="button" className="add-btn" onClick={() => handleAdd("projects")}>Add Project</button>
          </div>

          {/* Achievements */}
          <h3>Achievements</h3>
          <div className="dynamic-section">
            {formData.achievements.map((ach, idx) => (
              <div key={idx} className="dynamic-field">
                <textarea
                  value={ach}
                  onChange={(e) => handleChange(e, idx, "achievements")}
                  placeholder="Enter achievement details"
                />
                <button type="button" className="remove-btn" onClick={() => handleRemove("achievements", idx)}>Remove</button>
              </div>
            ))}
            <button type="button" className="add-btn" onClick={() => handleAdd("achievements")}>Add Achievement</button>
          </div>

          {/* Submit */}
          <button type="submit" className="btn-submit">Save Resume</button>
        </form>
      </div>
    </div>
  );
};

export default ResumeForm;
