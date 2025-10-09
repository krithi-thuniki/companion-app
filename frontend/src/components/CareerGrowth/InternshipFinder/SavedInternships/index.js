import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../Navbar";
import { FaRegBookmark } from "react-icons/fa";
import "./index.css";

const SavedInternships = () => {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("savedInternships")) || [];
    setSaved(data);
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
            <p>You haven't saved any internships yet. Start exploring and save the ones you like!</p>
            <Link to="/career/internships" className="explore-btn">
              Explore Internships
            </Link>
          </div>
        ) : (
          <ul className="saved-list">
            {saved.map((job) => (
              <li key={job.job_id} className="saved-card">
                <div className="card-content">
                  <div>
                    <h3>{job.job_title}</h3>
                    <p className="company">{job.employer_name}</p>
                    <p className="location">
                      {job.job_city}, {job.job_country}
                    </p>
                  </div>
                  <Link
                    to={`/career/internships/details/${job.job_id}`}
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
