import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));

      toast.success("Password reset successful! Please login with new password.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      toast.error("Email not found. Please register first.");
    }
  };

  return (
    <div className="forgot-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="forgot-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleReset}>
          <div className="input-group1">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group1">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="reset-btn">Reset Password</button>
        </form>

        <p>
          Remembered your password?{" "}
          <span
            style={{ cursor: "pointer", color: "#6c63ff", textDecoration: "underline" }}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
