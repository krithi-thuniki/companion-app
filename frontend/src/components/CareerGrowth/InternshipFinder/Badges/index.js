import React, { useEffect, useState } from "react";
import Navbar from "../../../Navbar";
import "./index.css";

const Badges = () => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    // Get tracker data safely
    const tracker = JSON.parse(localStorage.getItem("tracker")) || [];
    let earned = [];

    // 1. First Application Badge
    if (tracker.length > 0) {
      earned.push("🎉 First Application");
    }

    // 2. Data Enthusiast Badge - When at least 5 applications contain "data" in job title
    const dataApplications = tracker.filter(
      (t) => t?.job_title && t.job_title.toLowerCase().includes("data")
    );

    if (dataApplications.length >= 5) {
      earned.push("📊 Data Enthusiast");
    }

    // 3. Explorer Badge - When user has applied to at least 10 jobs
    if (tracker.length >= 10) {
      earned.push("🌍 Explorer");
    }

    // Update state with earned badges
    setBadges(earned);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="badges">
        <h2>🏆 Your Badges</h2>
        {badges.length === 0 ? (
          <p>No badges earned yet.</p>
        ) : (
          <ul>
            {badges.map((badge, index) => (
              <li key={index}>{badge}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Badges;
