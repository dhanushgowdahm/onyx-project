import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaBed, FaCalendarAlt } from "react-icons/fa";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">
      <h2 className="page-title">Receptionist Dashboard</h2>

      <div className="dashboard-layout">
        {/* Quick Actions */}
        <div className="card">
          <h3 className="card-title">Quick Actions</h3>
          <p className="card-subtitle">Perform common tasks quickly</p>

          <button className="action-btn active" onClick={() => navigate("/patients")}>
            <FaUserPlus /> Register Patient
          </button>
          <button className="action-btn" onClick={() => navigate("/beds")}>
            <FaBed /> Allocate Bed
          </button>
          <button className="action-btn" onClick={() => navigate("/appointments")}>
            <FaCalendarAlt /> Book Appointment
          </button>
        </div>

        {/* Bed Status */}
        <div className="card">
          <h3 className="card-title">Bed Status Overview</h3>
          <p className="card-subtitle">Current ward and bed availability</p>

          <div className="ward">
            <p className="ward-title">Ward A</p>
            <div className="bed-grid">
              <span className="bed occupied">101</span>
              <span className="bed available">102</span>
              <span className="bed available">103</span>
              <span className="bed available">104</span>
            </div>
          </div>

          <div className="ward">
            <p className="ward-title">Ward B</p>
            <div className="bed-grid">
              <span className="bed available">201</span>
              <span className="bed available">202</span>
              <span className="bed occupied">203</span>
              <span className="bed available">204</span>
            </div>
          </div>

          <div className="ward">
            <p className="ward-title">Ward C</p>
            <div className="bed-grid">
              <span className="bed available">301</span>
              <span className="bed available">302</span>
              <span className="bed available">303</span>
              <span className="bed available">304</span>
            </div>
          </div>

          <div className="legend">
            <span className="dot available-dot"></span> Available
            <span className="dot occupied-dot"></span> Occupied
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="card">
          <h3 className="card-title">Upcoming Appointments</h3>
          <p className="card-subtitle">
            Today's and tomorrow's scheduled appointments
          </p>

          <div className="appointments">
            <p className="appt-date">Today (Dec 15)</p>

            <div className="appt-item">
              <div>
                <p className="appt-name">John Smith</p>
                <p className="appt-doctor">Dr. Emily Wilson</p>
              </div>
              <p className="appt-time">10:00</p>
            </div>

            <div className="appt-item">
              <div>
                <p className="appt-name">Sarah Johnson</p>
                <p className="appt-doctor">Dr. Robert Davis</p>
              </div>
              <p className="appt-time">14:30</p>
            </div>

            <p className="appt-date">Tomorrow (Dec 16)</p>

            <div className="appt-item">
              <div>
                <p className="appt-name">Michael Brown</p>
                <p className="appt-doctor">Dr. Emily Wilson</p>
              </div>
              <p className="appt-time">09:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
