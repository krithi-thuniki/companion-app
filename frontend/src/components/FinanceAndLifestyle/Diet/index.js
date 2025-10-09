import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Navbar";
import "./index.css";

const Diet = () => {
  return (
    <div>
      <Navbar />
      <div className="diet-container">
        <h1 className="diet-title">🍎 Healthy Eating & Diet Tracker</h1>
        <p className="diet-subtitle">
          Keep track of your meals, analyze nutrition, and get weekly insights.
        </p>

        <div className="diet-grid">
          <Link to="/finance/diet/profile" className="diet-card">
            <h3>👤 Profile</h3>
            <p>Set your age, gender, height, weight, and activity.</p>
          </Link>

          <Link to="/finance/diet/log-meals" className="diet-card">
            <h3>🥗 Log Meals</h3>
            <p>Record your daily food intake and calories.</p>
          </Link>

          <Link to="/finance/diet/analysis" className="diet-card">
            <h3>📊 Analysis</h3>
            <p>View nutrition breakdown and trends.</p>
          </Link>

          <Link to="/finance/diet/weekly-reports" className="diet-card">
            <h3>📅 Weekly Reports</h3>
            <p>Track your weekly progress and improvements.</p>
          </Link>

          <Link to="/finance/diet/suggestions" className="diet-card">
            <h3>💡 Suggestions</h3>
            <p>Get personalized healthy eating tips.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Diet;
