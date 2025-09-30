import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login_page/login";
import Receptionist from "./components/receptionist";
import Doctor from "./components/doctor_page/doctor";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes - require authentication and specific roles */}
        <Route path="/receptionist" element={
          <ProtectedRoute requiredRole="receptionist">
            <Receptionist />
          </ProtectedRoute>
        } />
        
        <Route path="/doctor" element={
          <ProtectedRoute requiredRole="doctor">
            <Doctor />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
