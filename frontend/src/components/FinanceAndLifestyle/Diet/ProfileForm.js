import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const ProfileForm = ({ setProfile }) => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("sedentary");
  const [loading, setLoading] = useState(false);

  // ✅ Load saved profile from backend when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          const { age, gender, height, weight, activity } = res.data;
          setAge(age || "");
          setGender(gender || "male");
          setHeight(height || "");
          setWeight(weight || "");
          setActivity(activity || "sedentary");
          setProfile(res.data);
        }
      } catch (err) {
        console.error("❌ Fetch profile error:", err);
      }
    };

    fetchProfile();
  }, [setProfile]);

  // ✅ Save or update profile in MongoDB
  const handleSave = async () => {
    if (!age || !height || !weight) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/profile",
        { age, gender, height, weight, activity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(res.data);
      alert("✅ Profile saved successfully!");
    } catch (err) {
      console.error("❌ Save profile error:", err);
      alert("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="diet-container">
        <h2>👤 Your Profile</h2>
        <div className="diet-form">
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <select value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly Active</option>
            <option value="moderate">Moderately Active</option>
            <option value="active">Very Active</option>
          </select>
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
