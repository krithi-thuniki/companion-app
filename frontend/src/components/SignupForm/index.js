import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (password !== confirmPassword) return toast.error("Passwords do not match!");

    // Basic password strength check (optional)
    if (password.length < 6) return toast.error("Password should be at least 6 characters.");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        // NOTE: route changed to /register to match controller file naming style
        // if your existing route is /signup keep it as /signup. Adjust here accordingly.
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password, name, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      // save token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      toast.success("Signup successful!");

      // navigate after brief pause (only UI, server already returned token)
      setTimeout(() => navigate("/home"), 800);
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="login-container">
        <div className="login-form-container">
          <h1 className="login-title">Hello, Friend!</h1>
          <p className="login-title1">Create your account</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span
                className="eye-icon"
                onClick={() => setShowConfirmPassword((s) => !s)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="signup-text">
              Already have an account?{" "}
              <span className="signup-link" onClick={() => navigate("/login")}>
                Login
              </span>
            </p>
          </form>
        </div>

        <div className="welcome-container">
          <h2 className="welcome-title">Glad to see you!</h2>
          <p className="welcome-quote">
            This is the first step towards something amazing!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
