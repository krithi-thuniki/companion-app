import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import Navbar from "../../../Navbar";
import "./index.css";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

const Analysis = ({ nutrition = { protein: 0, carbs: 0, fats: 0 } }) => {
  // Destructure safely
  const { protein = 0, carbs = 0, fats = 0 } = nutrition;

  const data = [
    { name: "Protein", value: protein },
    { name: "Carbs", value: carbs },
    { name: "Fats", value: fats },
  ];

  const isEmpty = protein === 0 && carbs === 0 && fats === 0;

  return (
    <div>
      <Navbar />
      <div className="diet-container">
        <h2>📊 Nutrition Analysis</h2>

        {isEmpty ? (
          <p style={{ color: "white", textAlign: "center" }}>
            No nutrition data available. Please add meals to see analysis.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} dataKey="value" outerRadius={120} label>
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Analysis;
