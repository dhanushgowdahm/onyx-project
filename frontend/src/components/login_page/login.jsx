// frontend/src/components/login_page/login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "./login.css";

function LoginPage() {
  const navigate = useNavigate();
  // Use 'username' to match the Django backend expectation
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to hold error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // The URL to your Django token endpoint
      const response = await axios.post(
        "http://127.0.0.1:8000/api/api/token/",
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true, // Important to send cookies
        }
      );

      // Login successful - Django returns JWT tokens only
      console.log("Login successful:", response.data);

      // Store tokens for API authentication
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Decode JWT token to extract user role
        const token = response.data.access;
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        const userRole = payload.role;
        
        console.log('Decoded user role:', userRole);
        
        // Navigate to appropriate React route based on role
        if (userRole === 'receptionist') {
          navigate('/receptionist');
        } else if (userRole === 'doctor') {
          navigate('/doctor');
        } else if (userRole === 'admin') {
          navigate('/admin'); // In case admin exists
        } else {
          setError('Unknown user role: ' + userRole);
        }
      } else {
        setError('No access token received');
      }

    } catch (err) {
      // Handle login errors
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password. Please try again.");
      } else {
        setError("An error occurred during login. Please try again later.");
        console.error("Login error:", err);
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Hospital Management System</h2>
        <p className="login-subtitle">Sign in to your account</p>

        {/* Display error message if it exists */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Change label and input to handle 'Username' instead of 'Email' */}
        <label className="login-label">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
          required
        />

        <label className="login-label">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />

        <button type="submit" className="login-button">
          Sign In
        </button>

        <div className="demo-box">
          <p>
            <strong>Demo Credentials:</strong>
          </p>
          <p>
            <strong className="demo-role">Receptionist:</strong>{" "}
            <span>reception_user / password123</span>
          </p>
          <p>
            <strong className="demo-role">Doctor:</strong> <span>doctor_user / password123</span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;