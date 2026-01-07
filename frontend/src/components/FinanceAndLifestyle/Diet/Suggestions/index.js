import React from "react";
import "./index.css";

const Suggestions = ({
  nutrition = { protein: 0, carbs: 0, fats: 0 },
  waterIntake = 0,
  activityLevel = "low",
}) => {
  const tips = [];

  // check protein
  if (nutrition.protein < 50) {
    tips.push("🥩 Increase protein intake for better muscle health.");
  } else {
    tips.push("✅ Good protein levels!");
  }

  // check carbs
  if (nutrition.carbs > 250) {
    tips.push("🍞 Reduce carbs a little to balance energy levels.");
  } else {
    tips.push("🍎 Carbs are in a healthy range.");
  }

  // check fats
  if (nutrition.fats > 70) {
    tips.push("🥓 Limit fat intake to avoid excess calories.");
  } else {
    tips.push("🥑 Your fat intake looks healthy.");
  }

  // water intake
  if (waterIntake < 2) {
    tips.push("💧 Drink at least 2-3 liters of water daily.");
  } else {
    tips.push("✅ Hydration looks good.");
  }

  // activity
  if (activityLevel === "low") {
    tips.push("🚶 Add more walking or light exercise.");
  } else if (activityLevel === "medium") {
    tips.push("🏃 Keep your activity level steady.");
  } else {
    tips.push("🔥 Great! High activity level.");
  }

  return (
    <>
      <div className="diet-container">
        <h2>💡 Personalized Healthy Suggestions</h2>
        <ul className="diet-list">
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Suggestions;
