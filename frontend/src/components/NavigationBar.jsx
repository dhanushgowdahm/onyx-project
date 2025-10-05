import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import "./NavigationBar.css";

function NavigationBar({ role = "receptionist" }) {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await authAPI.getUserInfo();
        console.log('User info received:', info); // Debug log
        setUserInfo(info);
      } catch (error) {
        console.error('Error fetching user info:', error);
        // If there's an auth error, the handleResponse function will redirect to login
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

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

  const getWelcomeMessage = () => {
    if (loading) {
      return "Loading...";
    }
    
    if (userInfo) {
      console.log('Building welcome message with:', {
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        username: userInfo.username
      }); // Debug log
      
      // Priority order: full name -> first name only -> username
      let displayName = userInfo.username;
      
      if (userInfo.first_name && userInfo.last_name) {
        displayName = `${userInfo.first_name} ${userInfo.last_name}`;
      } else if (userInfo.first_name) {
        displayName = userInfo.first_name;
      } else if (userInfo.last_name) {
        displayName = userInfo.last_name;
      }
      
      if (role === "doctor") {
        return `Welcome, Dr. ${displayName}`;
      }
      return `Welcome, ${displayName}`;
    }
    
    return role === "doctor" ? "Welcome, Doctor" : "Welcome, User";
  };

  return (
    <header className="navbar">
      <h2 className="logo">Hospital Management</h2>
      <nav className="nav-menu">
        {role === "doctor" ? renderDoctorNavigation() : renderReceptionistNavigation()}
      </nav>
      <div className="user-info">
        <span>{getWelcomeMessage()}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default NavigationBar;
