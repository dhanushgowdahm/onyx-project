import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/api/token/",
        { username, password },
        { withCredentials: true }
      );

      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        const token = response.data.access;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userRole = payload.role;

        setTimeout(() => {
          if (userRole === "receptionist") {
            navigate("/receptionist");
          } else if (userRole === "doctor") {
            navigate("/doctor");
          } else if (userRole === "admin") {
            navigate("/admin");
          } else {
            setError("Unknown user role: " + userRole);
          }
        }, 1000); // short delay for smooth transition
      } else {
        setError("No access token received");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password. Please try again.");
      } else {
        setError("An error occurred during login. Please try again later.");
        console.error("Login error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card animate-pop" onSubmit={handleSubmit}>
        <h2 className="login-title">Hospital Management System</h2>
        <p className="login-subtitle">Sign in to your account</p>

        {error && (
          <div className="error-box">
            <FaExclamationCircle className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <label className="login-label">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
          required
          style={{width:330}}
        />

        <label className="login-label">Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
            style={{width:330}}

          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="toggle-password"
            role="button"
            tabIndex={0}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? <div className="spinner"></div> : "Sign In"}
        </button>

        <div className="demo-box">
          <p><strong>Demo Credentials:</strong></p>
          <p><strong className="demo-role">Receptionist:</strong> reception_user / mahadeva2003</p>
          <p><strong className="demo-role">Doctor:</strong> doctor_user / dhanush2003</p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
