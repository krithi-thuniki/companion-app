import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../../../Navbar";
import "./index.css";

const InternshipDetails = () => {
  const { internshipId } = useParams();
  const location = useLocation();
  const [job, setJob] = useState(location.state?.job || null);
  const [status, setStatus] = useState("Not Applied");

  useEffect(() => {
    if (!job) {
      const saved = JSON.parse(localStorage.getItem("savedInternships")) || [];
      const found = saved.find((item) => item.job_id === internshipId);
      setJob(found || null);
    }
  }, [internshipId, job]);

  const apply = () => {
    const tracker = JSON.parse(localStorage.getItem("tracker")) || [];
    tracker.push({ ...job, status: "Applied" });
    localStorage.setItem("tracker", JSON.stringify(tracker));
    setStatus("Applied");
  };

  if (!job) return <p>Loading internship details...</p>;

  return (
    <div>
      <Navbar />
      <div className="internship-details">
        <h2>{job.job_title}</h2>
        <p><strong>Company:</strong> {job.employer_name}</p>
        <p><strong>Location:</strong> {job.job_city}, {job.job_country}</p>
        <p><strong>Type:</strong> {job.job_employment_type}</p>
        <p><strong>Posted:</strong> {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}</p>
        <a href={job.job_apply_link} target="_blank" rel="noreferrer">🔗 View More Details</a>
        <br />
        <button onClick={apply} disabled={status === "Applied"}>
          {status === "Applied" ? "✅ Applied" : "Apply Now"}
        </button>
      </div>
    </div>
  );
};

export default InternshipDetails;
