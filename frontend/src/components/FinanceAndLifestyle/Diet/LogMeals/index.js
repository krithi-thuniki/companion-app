import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../../Navbar";
import "./index.css";

const LogMeals = ({ setNutrition, setWeeklyMeals, setWaterIntake, setActivityLevel }) => {
  const [meal, setMeal] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNutrition = async () => {
    if (!meal) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query: meal },
        {
          headers: {
            "x-app-id": "07679c0c",
            "x-app-key": "547672dac5ff3a9e67c13c4775f1484c",
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

      setMeals([...meals, newMeal]);

      // ✅ Update parent nutrition
      setNutrition((prev) => ({
        protein: prev.protein + newMeal.protein,
        carbs: prev.carbs + newMeal.carbs,
        fats: prev.fats + newMeal.fats,
      }));

      setWeeklyMeals((prev) => [
        ...prev,
        {
          day: new Date().toLocaleDateString("en-US", { weekday: "short" }),
          cal: newMeal.calories,
        },
      ]);

      setMeal("");
    } catch (err) {
      console.error(err);
      alert("Error fetching nutrition data.");
    }
    setLoading(false);
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
            {loading ? "Loading..." : "Add Meal"}
          </button>
        </div>

        <ul className="diet-list">
          {meals.map((m, i) => (
            <li key={i}>
              {m.meal} - {m.calories} cal | 🥩 {m.protein}g P | 🍞 {m.carbs}g C | 🥑 {m.fats}g F
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LogMeals;
