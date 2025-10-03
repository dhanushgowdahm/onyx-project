import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar({ role = "receptionist" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Redirect to login page
    navigate('/login');
  };

  const renderReceptionistNavigation = () => (
    <>
      <NavLink to="/receptionist" end className="nav-link">
        <i className="fa fa-home"></i> Home
      </NavLink>
      <NavLink to="/patients" className="nav-link">
        <i className="fa fa-users"></i> Patients
      </NavLink>
      <NavLink to="/doctors" className="nav-link">
        <i className="fa fa-user-md"></i> Doctors
      </NavLink>
      <NavLink to="/beds" className="nav-link">
        <i className="fa fa-bed"></i> Beds
      </NavLink>
      <NavLink to="/appointments" className="nav-link">
        <i className="fa fa-calendar"></i> Appointments
      </NavLink>
    </>
  );

  const renderDoctorNavigation = () => (
    <>
      <NavLink to="/doctor" end className="nav-link">
        <i className="fa fa-home"></i> Dashboard
      </NavLink>
      <NavLink to="/doctor/patients" className="nav-link">
        <i className="fa fa-users"></i> My Patients
      </NavLink>
      <NavLink to="/doctor/appointments" className="nav-link">
        <i className="fa fa-calendar"></i> Appointments
      </NavLink>
      <NavLink to="/doctor/prescriptions" className="nav-link">
        <i className="fa fa-prescription-bottle"></i> Prescriptions
      </NavLink>
    </>
  );

  const getUserInfo = () => {
    if (role === "doctor") {
      return "Welcome, Dr. Emily Wilson";
    }
    return "Welcome, Alice Johnson";
  };

  return (
    <header className="navbar">
      <h2 className="logo">Hospital Management</h2>
      <nav className="nav-menu">
        {role === "doctor" ? renderDoctorNavigation() : renderReceptionistNavigation()}
      </nav>
      <div className="user-info">
        <span>{getUserInfo()}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default NavigationBar;
