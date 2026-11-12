import React from 'react';

const CapacityBar = ({ value = 0, label, showTicks = false }) => {
  const numericValue = Math.max(0, Math.min(100, Number(value) || 0));

  let color = 'var(--status-active, #22C55E)';
  let statusZone = 'nominal';
  if (numericValue < 40) {
    color = 'var(--status-critical, #EF4444)';
    statusZone = 'critical';
  } else if (numericValue < 70) {
    color = 'var(--status-warning, #F0A93A)';
    statusZone = 'warning';
  }

  return (
    <div className={`capacity-bar-container ${statusZone}`}>
      <div className="capacity-bar-header">
        {label && <span className="capacity-bar-label">{label}</span>}
        <span className="capacity-bar-value mono-val" style={{ color }}>{numericValue}%</span>
      </div>
      <div className="capacity-bar-track">
        <div
          className="capacity-bar-fill"
          style={{
            width: `${numericValue}%`,
            backgroundColor: color,
          }}
        />
        {showTicks && (
          <div className="capacity-bar-ticks">
            <span className="tick-mark" style={{ left: '40%' }} title="Critical threshold (40%)" />
            <span className="tick-mark" style={{ left: '70%' }} title="Warning threshold (70%)" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CapacityBar;
