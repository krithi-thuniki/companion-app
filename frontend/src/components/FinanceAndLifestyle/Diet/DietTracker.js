import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Diet from "./index"; // Dashboard
import LogMeals from "./LogMeals";
import Analysis from "./Analysis";
import WeeklyReports from "./WeeklyReports";
import Suggestions from "./Suggestions";
import ProfileForm from "./ProfileForm";

const DietTracker = () => {
  // 🔹 Shared global states for diet tracking
  const [nutrition, setNutrition] = useState({ protein: 0, carbs: 0, fats: 0 });
  const [weeklyMeals, setWeeklyMeals] = useState([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [activityLevel, setActivityLevel] = useState("low");
  const [profile, setProfile] = useState(null);

  return (
    <Routes>
      {/* Dashboard (default index route) */}
<Route index element={<Diet />} />

      {/* Profile Form to set user details */}
      <Route path="profile" element={<ProfileForm setProfile={setProfile} />} />

      {/* Log Meals updates nutrition + weekly meals */}
      <Route
        path="log-meals"
        element={
          <LogMeals
            setNutrition={setNutrition}
            setWeeklyMeals={setWeeklyMeals}
            setWaterIntake={setWaterIntake}
            setActivityLevel={setActivityLevel}
          />
        }
      />

      {/* Nutrition breakdown */}
      <Route path="analysis" element={<Analysis nutrition={nutrition} />} />

      {/* Weekly calories report (compares with profile TDEE) */}
      <Route
        path="weekly-reports"
        element={<WeeklyReports weeklyMeals={weeklyMeals} profile={profile} />}
      />

      {/* Healthy suggestions */}
      <Route
        path="suggestions"
        element={
          <Suggestions
            nutrition={nutrition}
            waterIntake={waterIntake}
            activityLevel={activityLevel}
          />
        }
      />
    </Routes>
  );
};

export default DietTracker;
