import React, { useEffect, useState } from "react";
import Navbar from "../../../Navbar";
import "./index.css";

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);

  // ✅ Load tracker applications on mount
  useEffect(() => {
    const tracker = JSON.parse(localStorage.getItem("tracker")) || [];

    // Remove duplicates
    const uniqueMap = new Map();
    tracker.forEach((app) => {
      if (!uniqueMap.has(app.job_id)) uniqueMap.set(app.job_id, app);
    });

    const cleanedApps = Array.from(uniqueMap.values());
    localStorage.setItem("tracker", JSON.stringify(cleanedApps));
    setApplications(cleanedApps);
  }, []);

  // ✅ Update job status
  const updateStatus = (id, newStatus) => {
    const updated = applications.map((app) =>
      app.job_id === id ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    localStorage.setItem("tracker", JSON.stringify(updated));
  };

  // ✅ Delete job
  const deleteJob = (id) => {
    const updated = applications.filter((app) => app.job_id !== id);
    setApplications(updated);
    localStorage.setItem("tracker", JSON.stringify(updated));
  };

  return (
    <div>
      <Navbar />
      <div className="application-tracker">
        <h2 className="tracker-title">📊 Application Tracker</h2>

        {applications.length === 0 ? (
          <div className="empty-state">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076502.png"
              alt="No Applications"
              className="empty-img"
            />
            <p>No applications yet. Start applying and track them here!</p>
          </div>
        ) : (
          <ul className="application-list">
            {applications.map((app) => (
              <li key={app.job_id} className="application-card">
                <div className="application-details">
                  <h3 className="job-title">{app.job_title}</h3>
                  <p className="company-name">{app.employer_name}</p>
                  <p className="location">
                    {app.job_city}, {app.job_country}
                  </p>

                  {app.name && <p><strong>Applicant:</strong> {app.name}</p>}
                  {app.email && <p><strong>Email:</strong> {app.email}</p>}
                  {app.phone && <p><strong>Phone:</strong> {app.phone}</p>}
                  {app.resumeName && <p><strong>Resume:</strong> {app.resumeName}</p>}

                  <span
                    className={`status-tag ${app.status
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="actions">
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.job_id, e.target.value)}
                  >
                    <option>Applied</option>
                    <option>Interview Scheduled</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>
                  <button className="delete-btn" onClick={() => deleteJob(app.job_id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracker;
