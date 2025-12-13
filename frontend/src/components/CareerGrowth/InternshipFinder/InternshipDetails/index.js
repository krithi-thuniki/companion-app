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

  // ✅ Load internship details if not passed through navigation
  useEffect(() => {
    if (!job) {
      const saved = JSON.parse(localStorage.getItem("savedInternships")) || [];
      const found = saved.find((item) => item.job_id === internshipId);
      setJob(found || null);
    }
  }, [internshipId, job]);

  // ✅ Apply to internship — create application in MongoDB
  const apply = async () => {
    if (!job) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to apply for this internship.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newApplication = {
        item: {
          id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          type: job.job_employment_type,
          location: `${job.job_city}, ${job.job_country}`,
          description: job.job_description,
          url: job.job_apply_link,
        },
        status: "Applied",
      };

      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newApplication),
      });

      const data = await res.json();

      if (res.ok || data.ok) {
        alert(`✅ Application submitted for ${job.job_title}`);
        setStatus("Applied");
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
        <h2>{job.job_title}</h2>
        <p>
          <strong>Company:</strong> {job.employer_name}
        </p>
        <p>
          <strong>Location:</strong> {job.job_city}, {job.job_country}
        </p>
        <p>
          <strong>Type:</strong> {job.job_employment_type}
        </p>
        <p>
          <strong>Posted:</strong>{" "}
          {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
        </p>
        <a href={job.job_apply_link} target="_blank" rel="noreferrer">
          🔗 View More Details
        </a>
        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={apply} disabled={status === "Applied" || loading}>
          {loading
            ? "Submitting..."
            : status === "Applied"
            ? "✅ Applied"
            : "Apply Now"}
        </button>
      </div>
    </div>
  );
};

export default InternshipDetails;
