import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../Navbar";
import { fetchJobsAndInternships } from "../../../../services/api";
import "./index.css";

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("savedInternships")) || []
  );
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

  const toggleSave = (job) => {
    const updated = saved.find((s) => s.job_id === job.job_id)
      ? saved.filter((s) => s.job_id !== job.job_id)
      : [...saved, job];

    setSaved(updated);
    localStorage.setItem("savedInternships", JSON.stringify(updated));
  };

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

    alert(`Application submitted for ${selectedJob.job_title}`);
    closeModal();
  };

  // Filtered internships
  const filtered = internships.filter(
    (job) =>
      (!filters.role ||
        job.job_title.toLowerCase().includes(filters.role.toLowerCase())) &&
      (!filters.company ||
        job.employer_name.toLowerCase().includes(filters.company.toLowerCase())) &&
      (!filters.location ||
        job.job_city?.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.mode || job.job_employment_type === filters.mode)
  );

  return (
    <div>
      <Navbar />
      <div className="internship-list">
        <h2>Internship Opportunities</h2>

        {/* Filters */}
        <div className="filters">
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
            <option value="FULLTIME">Full-time</option>
            <option value="PARTTIME">Part-time</option>
            <option value="CONTRACTOR">Contractor</option>
          </select>
        </div>

        {/* Internship Cards */}
        <ul>
          {filtered.map((job) => (
            <li key={job.job_id} className="internship-card">
              <Link
                to={`/career/internships/details/${job.job_id}`}
                state={{ job }}
              >
                <h3>{job.job_title}</h3>
                <p>
                  {job.employer_name} | {job.job_city}, {job.job_country}
                </p>
                <p>
                  <strong>Type:</strong> {job.job_employment_type}
                </p>
              </Link>

              <div className="card-actions">
                <button
                  onClick={() => toggleSave(job)}
                  className={
                    saved.find((s) => s.job_id === job.job_id) ? "saved" : "save-btn"
                  }
                >
                  {saved.find((s) => s.job_id === job.job_id) ? "★ Saved" : "☆ Save"}
                </button>

                <button className="apply-btn" onClick={() => openApplyModal(job)}>
                  Apply
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Apply for {selectedJob?.job_title}</h3>
            <form onSubmit={handleSubmit} className="apply-form">
              {error && <p className="error-msg">{error}</p>}

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleFormChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleFormChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleFormChange}
              />
              <textarea
                name="coverLetter"
                placeholder="Cover Letter (Optional)"
                value={formData.coverLetter}
                onChange={handleFormChange}
              ></textarea>
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
      )}
    </div>
  );
};

export default InternshipList;
