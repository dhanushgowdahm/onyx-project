// src/components/StatsCard.jsx
import React from "react";

export default function StatsCard({ title, value, icon }) {
  return (
    <div className="hd-stats-card">
      <div className="hd-stats-icon">{icon}</div>
      <div className="hd-stats-content">
        <div className="hd-stats-title">{title}</div>
        <div className="hd-stats-value">{value}</div>
      </div>
    </div>
  );
}