import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

// 🔥 Calculate TDEE using Mifflin-St Jeor equation
const calcTDEE = ({ age, gender, height, weight, activity }) => {
  if (!age || !gender || !height || !weight) return null;

  let bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const factors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  return Math.round(bmr * (factors[activity] || 1.2));
};

const WeeklyReports = ({ profile }) => {
  const [weeklyMeals, setWeeklyMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch meals from backend (MongoDB)
  useEffect(() => {
    const fetchMeals = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token found — please log in first.");
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/meals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWeeklyMeals(res.data);
      } catch (err) {
        console.error("❌ Fetch meals error:", err.response?.data || err.message);
        alert("Failed to load weekly report.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  // 📊 Group meals by day
  const dailyTotals = {};
  weeklyMeals.forEach((meal) => {
    if (!meal.date || !meal.calories) return;
    const day = new Date(meal.date).toLocaleDateString("en-US", { weekday: "short" });
    if (!dailyTotals[day]) dailyTotals[day] = 0;
    dailyTotals[day] += meal.calories;
  });

  const reports = Object.keys(dailyTotals).map((day) => ({
    day,
    calories: dailyTotals[day],
  }));

  const avgCalories = reports.length
    ? reports.reduce((a, b) => a + b.calories, 0) / reports.length
    : 0;

  const tdee = profile ? calcTDEE(profile) : null;

  // ✅ Dietician-style note
  let status = "";
  if (tdee) {
    if (avgCalories < tdee - 200) {
      status =
        "⚠️ You are under-eating compared to your needs. Consider slightly bigger portions.";
    } else if (avgCalories > tdee + 200) {
      status =
        "⚠️ You are eating more than needed. The foods are healthy, but portions may be large. Try reducing rice/chapati amounts or cooking with less oil.";
    } else {
      status = "✅ Excellent! Your calorie intake matches your body’s needs.";
    }
  }

  return (
    <div>
      <div className="diet-container">
        <h2>📅 Weekly Report</h2>

        {loading ? (
          <p>Loading your weekly data...</p>
        ) : (
          <>
            {/* 👤 Profile Summary */}
            {profile && (
              <div className="profile-summary">
                <h3>👤 Profile Summary</h3>
                <p>Age: {profile.age}</p>
                <p>Gender: {profile.gender}</p>
                <p>Height: {profile.height} cm</p>
                <p>Weight: {profile.weight} kg</p>
                <p>Activity Level: {profile.activity}</p>
              </div>
            )}

            {/* 🍽️ Meals Report */}
            {reports.length === 0 ? (
              <p>No meals recorded for this week.</p>
            ) : (
              <>
                <table className="diet-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Calories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r, i) => (
                      <tr key={i}>
                        <td>{r.day}</td>
                        <td>{r.calories.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p>📊 Average daily calories: {avgCalories.toFixed(2)}</p>

                {tdee && (
                  <div className="dietician-note">
                    <p>🔥 Your TDEE: {tdee} kcal</p>
                    <p>🧑‍⚕️ Dietician’s Note: {status}</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WeeklyReports;
