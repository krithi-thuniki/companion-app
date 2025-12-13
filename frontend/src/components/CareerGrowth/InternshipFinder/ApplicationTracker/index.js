import React, { useEffect, useState } from "react";
import Navbar from "../../../Navbar";
import "./index.css";

const API = "http://localhost:5000/api/applications";

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);

  // ✅ Load applications from MongoDB
  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data && Array.isArray(data)) {
          setApplications(data);
        } else if (data.items) {
          setApplications(data.items);
        }
      } catch (err) {
        console.error("❌ Error loading applications:", err);
      }
    };

    fetchApplications();
  }, []);

  // ✅ Update job status
  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id || app.id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  // ✅ Delete job
  const deleteJob = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications((prev) =>
        prev.filter((app) => app._id !== id && app.id !== id)
      );
    } catch (err) {
      console.error("❌ Failed to delete application:", err);
    }
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
              <li key={app._id || app.id} className="application-card">
                <div className="application-details">
                  <h3 className="job-title">{app.title || app.job_title}</h3>
                  <p className="company-name">
                    {app.company || app.employer_name}
                  </p>
                  <p className="location">
                    {app.location ||
                      `${app.job_city || ""}, ${app.job_country || ""}`}
                  </p>

                  {app.name && (
                    <p>
                      <strong>Applicant:</strong> {app.name}
                    </p>
                  )}
                  {app.email && (
                    <p>
                      <strong>Email:</strong> {app.email}
                    </p>
                  )}
                  {app.phone && (
                    <p>
                      <strong>Phone:</strong> {app.phone}
                    </p>
                  )}
                  {app.resumeName && (
                    <p>
                      <strong>Resume:</strong> {app.resumeName}
                    </p>
                  )}

                  <span
                    className={`status-tag ${
                      app.status?.replace(/\s+/g, "-").toLowerCase() || "pending"
                    }`}
                  >
                    {app.status || "Pending"}
                  </span>
                </div>

                <div className="actions">
                  <select
                    value={app.status || "pending"}
                    onChange={(e) =>
                      updateStatus(app._id || app.id, e.target.value)
                    }
                  >
                    {/* ✅ Matches backend enum now */}
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    className="delete-btn"
                    onClick={() => deleteJob(app._id || app.id)}
                  >
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
