import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../Navbar";
import "./index.css";

const LogMeals = ({ setNutrition, setWeeklyMeals, setWaterIntake, setActivityLevel, waterIntake, activityLevel }) => {
  const [meal, setMeal] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all meals from MongoDB when page loads
  useEffect(() => {
    const fetchMealsFromDB = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/meals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMeals(res.data || []);

        // 🔹 Recalculate nutrition totals based on stored meals
        const totals = res.data.reduce(
          (acc, m) => ({
            protein: acc.protein + (m.protein || 0),
            carbs: acc.carbs + (m.carbs || 0),
            fats: acc.fats + (m.fats || 0),
          }),
          { protein: 0, carbs: 0, fats: 0 }
        );
        setNutrition(totals);

        // 🔹 Set weekly calorie summary
        const weekSummary = res.data.map((m) => ({
          day: new Date(m.date).toLocaleDateString("en-US", { weekday: "short" }),
          cal: m.calories,
        }));
        setWeeklyMeals(weekSummary);
      } catch (err) {
        console.error("❌ Fetch meals error:", err);
      }
    };

    fetchMealsFromDB();
  }, [setNutrition, setWeeklyMeals]);

  // ✅ Fetch nutrition from Nutritionix + save to MongoDB
  const fetchNutrition = async () => {
    if (!meal.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }

      // 🥗 Get meal data from Nutritionix API
      const res = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query: meal },
        {
          headers: {
            "x-app-id": "07679c0c", // ⚠️ Replace with your own Nutritionix App ID
            "x-app-key": "547672dac5ff3a9e67c13c4775f1484c", // ⚠️ Replace with your own App Key
            "Content-Type": "application/json",
          },
        }
      );

      const food = res.data.foods[0];
      const newMeal = {
        meal: food.food_name,
        calories: food.nf_calories,
        protein: food.nf_protein,
        carbs: food.nf_total_carbohydrate,
        fats: food.nf_total_fat,
      };

      // ✅ Save meal to backend
      await axios.post("http://localhost:5000/api/meals", newMeal, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Update UI states
      setMeals((prev) => [...prev, newMeal]);

      // ✅ Update nutrition totals
      setNutrition((prev) => {
        const updated = {
          protein: prev.protein + newMeal.protein,
          carbs: prev.carbs + newMeal.carbs,
          fats: prev.fats + newMeal.fats,
        };

        // 🔹 Also send updated totals to backend progress
        updateUserProgress(updated);
        return updated;
      });

      // ✅ Update weekly meals
      setWeeklyMeals((prev) => [
        ...prev,
        {
          day: new Date().toLocaleDateString("en-US", { weekday: "short" }),
          cal: newMeal.calories,
        },
      ]);

      setMeal("");
    } catch (err) {
      console.error("❌ Nutritionix or DB error:", err.response?.data || err.message);
      alert("Failed to log meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send progress updates to backend
  const updateUserProgress = async (nutritionTotals) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:5000/api/progress",
        {
          nutrition: nutritionTotals,
          waterIntake,
          activityLevel,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Progress updated successfully");
    } catch (err) {
      console.error("❌ Failed to update progress:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="diet-container">
        <h2>🥗 Log Meals</h2>

        <div className="diet-form">
          <input
            type="text"
            placeholder="Enter meal (e.g. 2 eggs and rice)"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
          />
          <button onClick={fetchNutrition} disabled={loading}>
            {loading ? "Saving..." : "Add Meal"}
          </button>
        </div>

        <ul className="diet-list">
          {meals.length === 0 ? (
            <p style={{ color: "white", textAlign: "center" }}>No meals logged yet.</p>
          ) : (
            meals.map((m, i) => (
              <li key={i}>
                {m.meal} - {m.calories.toFixed(1)} cal | 🥩 {m.protein.toFixed(1)}g P | 🍞{" "}
                {m.carbs.toFixed(1)}g C | 🥑 {m.fats.toFixed(1)}g F
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default LogMeals;
