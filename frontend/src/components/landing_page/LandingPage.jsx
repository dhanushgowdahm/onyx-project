import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import {
  FaUser,
  FaCalendarAlt,
  FaBed,
  FaUserShield,
  FaStethoscope,
  FaClock,
} from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    // Navigate to Django admin page
    window.open('http://localhost:8000/admin/', '_blank');
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">MediCare HMS</div>
        <div className="nav-buttons">
          <button className="login-btn" onClick={handleLoginClick}>Login</button>
          <button className="register-btn" onClick={handleRegisterClick}>Admin</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>
          Smart Hospital Management <br />
          <span>Made Simple</span>
        </h1>
        <p>
          Streamline patient care, manage doctors, allocate beds, and book
          appointments with our premium, easy-to-use hospital management system.
        </p>
        <div className="hero-buttons">
          <button className="get-started" onClick={handleRegisterClick}>Get Started</button>
          <button className="login-secondary" onClick={handleLoginClick}>Login</button>
        </div>
      </section>

      {/* Section Title visible on scroll start */}
      <section className="intro-section">
        <h2>Everything You Need</h2>
        <p>Comprehensive tools for modern healthcare management</p>
      </section>

      {/* Feature Boxes appear only after scroll */}
      <section className="features">
        <div className="feature-grid">
          <div className="feature-card">
            <FaUser className="feature-icon" />
            <h3>Patient Management</h3>
            <p>
              Register and manage patient records with ease. Track medical
              history and personal information.
            </p>
          </div>

          <div className="feature-card">
            <FaStethoscope className="feature-icon" />
            <h3>Doctor Portal</h3>
            <p>
              Dedicated dashboard for doctors to manage patients, prescriptions,
              and appointments.
            </p>
          </div>

          <div className="feature-card">
            <FaBed className="feature-icon" />
            <h3>Bed Allocation</h3>
            <p>
              Visual bed management system with real-time status updates and
              quick allocation.
            </p>
          </div>

          <div className="feature-card">
            <FaCalendarAlt className="feature-icon" />
            <h3>Appointment Booking</h3>
            <p>
              Schedule and manage appointments with doctors based on
              availability.
            </p>
          </div>

          <div className="feature-card">
            <FaUserShield className="feature-icon" />
            <h3>Role-Based Access</h3>
            <p>
              Secure dashboards for patients, doctors, and receptionists with
              appropriate permissions.
            </p>
          </div>

          <div className="feature-card">
            <FaClock className="feature-icon" />
            <h3>Real-Time Updates</h3>
            <p>
              Stay informed with instant notifications and live status updates
              across the system.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
