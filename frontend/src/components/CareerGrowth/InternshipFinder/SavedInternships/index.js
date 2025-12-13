import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../Navbar";
import { FaRegBookmark } from "react-icons/fa";
import "./index.css";

const SavedInternships = () => {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/saved", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setSaved(data.items || []);
        } else {
          console.error("❌ Failed to load saved internships:", data.error);
        }
      })
      .catch((err) => console.error("❌ Error fetching saved internships:", err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="saved-internships">
        <div className="saved-header">
          <FaRegBookmark className="bookmark-icon" />
          <h2>Saved Internships</h2>
        </div>

        {saved.length === 0 ? (
          <div className="empty-state">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076502.png"
              alt="No Saved Internships"
              className="empty-img"
            />
            <p>
              You haven't saved any internships yet. Start exploring and save
              the ones you like!
            </p>
            <Link to="/career/internships" className="explore-btn">
              Explore Internships
            </Link>
          </div>
        ) : (
          <ul className="saved-list">
            {saved.map((job) => (
              <li key={job._id || job.job_id} className="saved-card">
                <div className="card-content">
                  <div>
                    <h3>{job.title || job.job_title}</h3>
                    <p className="company">
                      {job.company || job.employer_name}
                    </p>
                    <p className="location">
                      {job.location
                        ? job.location
                        : `${job.job_city || ""}, ${job.job_country || ""}`}
                    </p>
                  </div>
                  <Link
                    to={`/career/internships/details/${job.opportunityId || job.job_id}`}
                    state={{ job }}
                    className="details-btn"
                  >
                    View Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SavedInternships;
