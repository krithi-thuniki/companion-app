import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../../../Navbar";
import "./index.css";

const API = "http://localhost:5000/api/applications";

const InternshipDetails = () => {
  const { internshipId } = useParams();
  const location = useLocation();
  const [job, setJob] = useState(location.state?.job || null);
  const [status, setStatus] = useState("Not Applied");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    university: "",
    degree: "",
    graduationYear: "",
    skills: "",
    portfolio: "",
    availability: "",
    coverLetter: "",
    resume: null,
  });

  // Load internship details if not passed through navigation
  useEffect(() => {
    if (!job) {
      const saved = JSON.parse(localStorage.getItem("savedInternships")) || [];
      const found = saved.find((item) => item.job_id === internshipId);
      setJob(found || null);
    }
  }, [internshipId, job]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit application
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!job) return;

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in to apply for this internship.");
    return;
  }

  if (!formData.name || !formData.email || !formData.phone || !formData.resume) {
    setError("Please fill in all required fields and attach your resume.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) payload.append(key, formData[key]);
    });

const opportunityId =
  job?.id ||
  job?.job_id ||
  internshipId; // fallback from URL

if (!opportunityId) {
  setError("Invalid opportunity. Please refresh the page.");
  setLoading(false);
  return;
}


payload.append(
  "item",
  JSON.stringify({
    opportunityId: String(opportunityId), // ✅ ALWAYS EXISTS NOW
    title: job.job_title || job.title,
    company: job.employer_name || job.company,
    type: job.job_employment_type || job.type,
    location: job.job_city
      ? `${job.job_city}, ${job.job_country}`
      : job.location,
    description: job.job_description || job.description,
    url: job.job_apply_link || job.url,
  })
);





    const res = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });

    const data = await res.json();

    if (res.ok || data.ok) {
      alert(`✅ Application submitted for ${job.job_title}`);
      setStatus("Applied");
      setShowModal(false);
    } else {
      console.error("❌ Application error:", data);
      setError(data.error || "Failed to submit application.");
    }
  } catch (err) {
    console.error("❌ Network or server error:", err);
    setError("Failed to submit application. Please try again.");
  } finally {
    setLoading(false);
  }
};


  if (!job) return <p>Loading internship details...</p>;

  return (
    <div>
      <Navbar />
      <div className="internship-details">
        <h2 className="title">{job.job_title}</h2>

        <div className="meta">
          <span className="company">{job.employer_name}</span>
          <span className="type">{job.job_employment_type}</span>
        </div>

        <div className="info">
          <p>
            <strong>📍 Location:</strong> {job.job_city}, {job.job_country}
          </p>
          <p>
            <strong>🗓 Posted:</strong>{" "}
            {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
          </p>
        </div>

        <a
          href={job.job_apply_link}
          target="_blank"
          rel="noreferrer"
          className="external-link"
        >
          🔗 View Full Internship Description
        </a>

        {error && <p className="error">{error}</p>}

        
        {/* Application Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Apply for {job.job_title}</h3>
              <form className="apply-form" onSubmit={handleSubmit}>
                {error && <p className="error-msg">{error}</p>}

                <div className="form-grid">
                  <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} />
                  <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} />
                  <input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} />
                  <input type="text" name="university" placeholder="University / College" value={formData.university} onChange={handleChange} />
                  <input type="text" name="degree" placeholder="Degree (e.g. B.Tech, MSc CS)" value={formData.degree} onChange={handleChange} />
                  <input type="text" name="graduationYear" placeholder="Graduation Year" value={formData.graduationYear} onChange={handleChange} />
                  <input type="text" name="skills" placeholder="Key Skills (React, Python, SQL)" value={formData.skills} onChange={handleChange} />
                  <input type="url" name="portfolio" placeholder="LinkedIn / Portfolio URL" value={formData.portfolio} onChange={handleChange} />
                  <select name="availability" value={formData.availability} onChange={handleChange}>
                    <option value="">Availability</option>
                    <option value="Immediate">Immediate</option>
                    <option value="1 Month">1 Month</option>
                    <option value="3 Months">3 Months</option>
                  </select>
                </div>

                <textarea name="coverLetter" placeholder="Why should we hire you? (Short answer)" value={formData.coverLetter} onChange={handleChange} />

                <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} />

                <div className="form-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetails;
