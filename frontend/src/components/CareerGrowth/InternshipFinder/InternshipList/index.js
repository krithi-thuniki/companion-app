import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../Navbar";
import { fetchJobsAndInternships } from "../../../../services/api";
import "./index.css";

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    company: "",
    location: "",
    mode: "",
  });

  // Application modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
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

  const [error, setError] = useState("");

  // Load internships
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchJobsAndInternships("internship", 1);
      setInternships(data);
    };
    loadData();
  }, []);



  const openApplyModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      coverLetter: "",
      resume: null,
    });
    setError("");
  };
// Mark job as applied
const [appliedJobs, setAppliedJobs] = useState(
  JSON.parse(localStorage.getItem("appliedJobs")) || []
);



  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.resume) {
      setError("Please fill out all required fields and upload your resume.");
      return;
    }

    const existingApplications = JSON.parse(localStorage.getItem("applications")) || [];
    
    const newApplication = {
      jobId: selectedJob.job_id,
      job_id: selectedJob.job_id, // For tracker
      job_title: selectedJob.job_title,
      employer_name: selectedJob.employer_name,
      job_city: selectedJob.job_city,
      job_country: selectedJob.job_country,
      status: "Applied",
      appliedAt: new Date().toISOString(),
      resumeName: formData.resume.name,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      coverLetter: formData.coverLetter,
    };

    // Save full application details
    localStorage.setItem(
      "applications",
      JSON.stringify([...existingApplications, newApplication])
    );

    // Save minimal job details to tracker for ApplicationTracker
    const tracker = JSON.parse(localStorage.getItem("tracker")) || [];
    const jobExists = tracker.some((job) => job.job_id === selectedJob.job_id);
    if (!jobExists) {
      localStorage.setItem("tracker", JSON.stringify([...tracker, newApplication]));
    }

setShowSuccess(true);

setTimeout(() => {
  setShowSuccess(false);
}, 3000);

const updatedApplied = [...appliedJobs, selectedJob.job_id];
setAppliedJobs(updatedApplied);
localStorage.setItem("appliedJobs", JSON.stringify(updatedApplied));

closeModal();
  };

  // Filtered internships
  const filtered = internships.filter((job) =>
  (!filters.role ||
    job.job_title
      ?.toLowerCase()
      .includes(filters.role.toLowerCase())) &&

  (!filters.company ||
    job.employer_name
      ?.toLowerCase()
      .includes(filters.company.toLowerCase())) &&

  (!filters.location ||
    job.job_city
      ?.toLowerCase()
      .includes(filters.location.toLowerCase())) &&

  (!filters.mode ||
    job.job_employment_type
      ?.toLowerCase()
      .includes(filters.mode.toLowerCase()))
);
const handleSave = async (job) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to save internships");
    return;
  }

  const opportunityId = job.job_id || job.id;

  if (!opportunityId) {
    alert("❌ Opportunity ID not found. Cannot save this internship.");
    return;
  }

  const payload = {
    opportunityId,
    title: job.job_title || job.title,
    company: job.employer_name || job.company,
    location: job.job_city ? `${job.job_city}, ${job.job_country}` : job.location,
    type: job.job_employment_type || job.type,
    url: job.job_apply_link || job.url,
  };

  try {
    const res = await fetch("http://localhost:5000/api/saved", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to save internship");
    } else if (data.message === "Already saved") {
      alert("⭐ Internship already saved");
    } else {
      alert("✅ Internship saved");
    }
  } catch (error) {
    console.error("❌ Network error:", error);
    alert("Server error. Please try again later.");
  }
};


  return (
    <div>
      <Navbar />
      <div className="internship-list">
        <h2>Internship Opportunities</h2>
    <p className="subtitle">
  Search & apply to internships tailored for you
</p>

        {/* Filters */}
<div className="filters sticky">
          <input
            placeholder="Role"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          />
          <input
            placeholder="Company"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          />
          <input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          <select
  value={filters.mode}
  onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
>
  <option value="">Mode</option>
  <option value="full">Full-time</option>
  <option value="part">Part-time</option>
  <option value="contract">Contract</option>
</select>

        </div>

        {/* Internship Cards */}
        {/* Internship Cards */}
{filtered.length === 0 ? (
  <p className="empty">No internships match your filters.</p>
) : (
  <ul>
    {filtered.map((job) => (
      <li key={job.job_id} className="internship-card">
        <Link
          to={`/career/internships/details/${job.job_id}`}
          state={{ job }}
        >
          <h3>{job.job_title}</h3>

          <p className="company">{job.employer_name}</p>

          <p className="location">
            📍 {job.job_city}, {job.job_country}
          </p>

          <p>
            <strong>Type:</strong> {job.job_employment_type}
          </p>
        </Link>

        <div className="card-actions">
          <button
  type="button"
  onClick={(e) => {
    e.stopPropagation(); // ✅ ADD THIS
    handleSave(job);
  }}
  className="save-btn"
>
  ☆ Save
</button>






          <button
  className={
    appliedJobs.includes(job.job_id)
      ? "applied-btn"
      : "apply-btn"
  }
  onClick={() => openApplyModal(job)}
  disabled={appliedJobs.includes(job.job_id)}
>
  {appliedJobs.includes(job.job_id)
    ? "✔ Application Submitted"
    : "Apply"}
</button>

        </div>
      </li>
    ))}
  </ul>
)}

      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Apply for {selectedJob?.job_title}</h3>
            <form onSubmit={handleSubmit} className="apply-form">
              {error && <p className="error-msg">{error}</p>}

              <div className="form-grid">
  <input
    type="text"
    name="name"
    placeholder="Full Name *"
    value={formData.name}
    onChange={handleFormChange}
  />

  <input
    type="email"
    name="email"
    placeholder="Email Address *"
    value={formData.email}
    onChange={handleFormChange}
  />

  <input
    type="tel"
    name="phone"
    placeholder="Phone Number *"
    value={formData.phone}
    onChange={handleFormChange}
  />

  <input
    type="text"
    name="university"
    placeholder="University / College"
    value={formData.university}
    onChange={handleFormChange}
  />

  <input
    type="text"
    name="degree"
    placeholder="Degree (e.g. B.Tech, MSc CS)"
    value={formData.degree}
    onChange={handleFormChange}
  />

  <input
    type="text"
    name="graduationYear"
    placeholder="Graduation Year"
    value={formData.graduationYear}
    onChange={handleFormChange}
  />

  <input
    type="text"
    name="skills"
    placeholder="Key Skills (React, Python, SQL)"
    value={formData.skills}
    onChange={handleFormChange}
  />

  <input
    type="url"
    name="portfolio"
    placeholder="LinkedIn / Portfolio URL"
    value={formData.portfolio}
    onChange={handleFormChange}
  />

  <select
    name="availability"
    value={formData.availability}
    onChange={handleFormChange}
  >
    <option value="">Availability</option>
    <option value="Immediate">Immediate</option>
    <option value="1 Month">1 Month</option>
    <option value="3 Months">3 Months</option>
  </select>
</div>

<textarea
  name="coverLetter"
  placeholder="Why should we hire you? (Short answer)"
  value={formData.coverLetter}
  onChange={handleFormChange}
/>

<input
  type="file"
  name="resume"
  accept=".pdf,.doc,.docx"
  onChange={handleFormChange}
/>

              <div className="form-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}{showSuccess && (
  <div className="success-toast">
    ✅ Application submitted successfully!
  </div>
)}


    </div>
  );
};

export default InternshipList;
