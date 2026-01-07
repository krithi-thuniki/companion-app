import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const FinanceLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="finance-landing">
      <h1>Finance & Lifestyle</h1>
      <p>
        A smart way to balance your health, spending, and daily habits —
        designed for modern living.
      </p>

      <div className="finance-cards">
  {/* Card 1 → Diet Tracker */}
  <div className="finance-card" onClick={() => navigate("diet")}>
    <h2>🍎 Diet Tracker</h2>
    <p>
      Track meals, calories, and nutrition to build healthy eating habits effortlessly.
    </p>
    <button>Explore Diet</button>
  </div>

  {/* Card 2 → Expense Tracker */}
  <div className="finance-card" onClick={() => navigate("expenses")}>
    <h2>💰 Expense Tracker</h2>
    <p>
      Monitor daily expenses, categorize spending, and stay within budget.
    </p>
    <button>View Expenses</button>
  </div>

  {/* Card 3 → Highlight Card */}
  <div className="finance-card finance-highlight">
    <h2>💜 A Balanced Lifestyle</h2>
    <p>
      Finance & Lifestyle helps you make smarter decisions by combining health tracking and financial awareness in one powerful platform.
    </p>
    <button onClick={() => navigate("/")}>Get Started</button>
  </div>

  {/* Card 4 → Daily Lifestyle Tracker */}
  <div className="finance-card">
    <h2>🧘 Daily Lifestyle Tracker</h2>
    <p>
      Maintain a balanced lifestyle by tracking daily routines such as meals, hydration, and activity levels all in one place.
    </p>
  </div>

  {/* Card 5 → Expense Categories & Reports */}
  <div className="finance-card">
    <h2>💳 Expense Categories & Reports</h2>
    <p>
      Automatically organize expenses into categories like food, travel, shopping, and bills to give you a clear understanding of your spending patterns.
    </p>
  </div>
</div>



    </div>
  );
};

export default FinanceLanding;
