import React, { useState } from 'react';
import './beds.css';

const initialBedsData = [
  {
    name: 'Ward A',
    beds: [
      { id: 101, occupied: true },
      { id: 102, occupied: false },
      { id: 103, occupied: false },
      { id: 104, occupied: false },
    ],
  },
  {
    name: 'Ward B',
    beds: [
      { id: 201, occupied: true },
      { id: 202, occupied: false },
      { id: 203, occupied: false },
      { id: 204, occupied: false },
    ],
  },
  {
    name: 'Ward C',
    beds: [
      { id: 301, occupied: false },
      { id: 302, occupied: false },
      { id: 303, occupied: false },
      { id: 304, occupied: false },
    ],
  },
];

function BedStatus({ bed, onToggle }) {
  return (
    <div
      className={`bed-card ${bed.occupied ? 'occupied' : 'unoccupied'}`}
      onClick={onToggle}
      title={bed.occupied ? 'Click to de-allocate' : 'Click to allocate'}
    >
      <div className="bed-icon">🛏️</div>
      <div className="bed-info">
        <span className="bed-number">{bed.id}</span>
        <span className="bed-status">{bed.occupied ? 'Occupied' : 'Available'}</span>
      </div>
    </div>
  );
}

function WardSection({ ward, onToggleBed }) {
  const occupiedCount = ward.beds.filter(b => b.occupied).length;
  return (
    <div className="ward-section">
      <div className="ward-header">
        <span className="ward-title">{ward.name}</span>
        <span className="ward-occupancy">{occupiedCount}/{ward.beds.length} occupied</span>
      </div>
      <div className="ward-beds">
        {ward.beds.map((bed, idx) => (
          <BedStatus
            key={bed.id}
            bed={bed}
            onToggle={() => onToggleBed(ward.name, idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default function BedsDashboard() {
  const [wards, setWards] = useState(initialBedsData);

  // Calculate stats
  const allBeds = wards.flatMap(ward => ward.beds);
  const totalBeds = allBeds.length;
  const occupiedBeds = allBeds.filter(b => b.occupied).length;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  // Toggle bed allocation
  function handleToggleBed(wardName, bedIdx) {
    setWards(prev =>
      prev.map(ward =>
        ward.name === wardName
          ? {
              ...ward,
              beds: ward.beds.map((bed, idx) =>
                idx === bedIdx ? { ...bed, occupied: !bed.occupied } : bed
              ),
            }
          : ward
      )
    );
  }

  return (
    <div className="dashboard-wrap">
      <h2 className="dashboard-title">Bed Allocation</h2>
      <div className="dashboard-stats">
        <div className="stat-card total">
          <div className="stat-label">Total Beds</div>
          <div className="stat-value">{totalBeds}</div>
        </div>
        <div className="stat-card occupied">
          <div className="stat-label">Occupied</div>
          <div className="stat-value">{occupiedBeds}</div>
        </div>
        <div className="stat-card rate">
          <div className="stat-label">Occupancy Rate</div>
          <div className="stat-value">
            <span className="dot-green"></span>
            {occupancyRate}%
          </div>
        </div>
      </div>

      <div className="wards-wrap">
        {wards.map(ward => (
          <WardSection key={ward.name} ward={ward} onToggleBed={handleToggleBed} />
        ))}
      </div>

      <div className="legend-wrap">
        <div className="legend-item">
          <span className="legend-dot-green"></span> Green: Unoccupied
        </div>
        <div className="legend-item">
          <span className="legend-dot-red"></span> Red: Occupied
        </div>
        <div className="legend-item">
          <span className="legend-icon">🛏️</span> Click icon: Allocate / De-allocate
        </div>
      </div>
    </div>
  );
}
