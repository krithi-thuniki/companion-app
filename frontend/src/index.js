import React from "react";
import ReactDOM from "react-dom/client";
import RoutesComponent from "./routes";  // ✅ Import routes.js
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RoutesComponent />   {/* ✅ Use your routes */}
  </React.StrictMode>
);
