import React, { useState } from "react";
import Navbar from "../../Navbar";
import "./index.css";

const ProfileForm = ({ setProfile }) => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("sedentary");

  const handleSave = () => {
    if (!age || !height || !weight) {
      alert("Please fill all fields");
      return;
    }

    setProfile({ age: +age, gender, height: +height, weight: +weight, activity });
  };

  return (
    <div>
      <Navbar />
      <div className="diet-container">
        <h2>👤 Your Profile</h2>
        <div className="diet-form">
          <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} />
          <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
          <select value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly Active</option>
            <option value="moderate">Moderately Active</option>
            <option value="active">Very Active</option>
          </select>
          <button onClick={handleSave}>Save Profile</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
