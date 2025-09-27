import React, { useState } from "react";
import "./login.css"; 

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email entered: ${email}`); 
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Hospital Management System</h2>
        <p className="login-subtitle">Sign in to your account</p>

        <label className="login-label">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            <a href="mailto:receptionist@hospital.com">
              receptionist@hospital.com
            </a>
          </p>
          <p>
            <strong className="demo-role">Doctor:</strong>{" "}
            <a href="mailto:doctor@hospital.com">doctor@hospital.com</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;