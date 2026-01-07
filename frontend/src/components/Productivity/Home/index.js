import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../SubNavbar";
import "./index.css";


const ProductivityHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="productivity-hero">
        {/* LEFT CONTENT */}
        <div className="hero-left">
          <h1>Smart Productivity for Students</h1>
          <p>
            Build focus, reflect daily, and stay consistent with productivity
            tools designed to improve learning efficiency and reduce burnout.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/productivity/pomodoro")}
            >
              Start Pomodoro
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/productivity/daily-journal")}
            >
              Write Journal
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE + FEATURES */}
        <div className="hero-right">
 

          <div className="features-box">
            <div className="feature">
              <span>⏱</span>
              <div>
                <h4>Pomodoro Focus</h4>
                <p>25-minute distraction-free study sessions</p>
              </div>
            </div>

            <div className="feature">
              <span>📝</span>
              <div>
                <h4>Daily Journal</h4>
                <p>Reflect, track progress, and build habits</p>
              </div>
            </div>

            <div className="feature">
              <span>🎯</span>
              <div>
                <h4>Goal Oriented</h4>
                <p>Designed specifically for student productivity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductivityHome;
