import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import ReceptionistDashboard from "./components/ReceptionistDashboard";
import Patients from "./components/Patients";
import Doctors from "./components/Doctors";
import Beds from "./components/Beds";
import Appointments from "./components/Appointments";
import "./App.css";

function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ReceptionistDashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/beds" element={<Beds />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
