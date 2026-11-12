import React from 'react';
import CapacityBar from '../common/CapacityBar';

const AssetDetailsModal = ({ isOpen, asset, onClose }) => {
  if (!isOpen || !asset) {
    return null;
  }

  const health = Number(asset.currentHealth ?? asset.health ?? 0);
  const id = Number(asset.id) || 1;

  let vibration = 0.15;
  if (health > 80) {
    vibration = (0.01 + (id % 5) * 0.005).toFixed(3);
  } else if (health > 60) {
    vibration = (0.08).toFixed(2);
  } else {
    vibration = (0.15).toFixed(2);
  }

  let temperature = 110.8;
  if (health > 80) {
    temperature = (40 + (id % 10) * 0.8).toFixed(1);
  } else if (health > 60) {
    temperature = (75.5).toFixed(1);
  } else {
    temperature = (110.8).toFixed(1);
  }

  const statusClass = (asset.currentStatus || 'ACTIVE').toLowerCase();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content asset-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Asset Details: {asset.assetTag}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="asset-details-body">
          <div className="status-header">
            <span className="status-title">Current Status:</span>
            <span className={`status-badge ${statusClass}`}>
              {asset.currentStatus}
            </span>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Asset Tag</span>
              <span className="detail-value">{asset.assetTag}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Name</span>
              <span className="detail-value">{asset.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Category</span>
              <span className="detail-value">{asset.category}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Installation Date</span>
              <span className="detail-value">{asset.installDate}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Purchase Price</span>
              <span className="detail-value">
                ${Number(asset.purchasePrice || 0).toLocaleString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Expected Lifespan</span>
              <span className="detail-value">
                {asset.expectedLifespanYears ?? asset.lifespanYears ?? 0} years
              </span>
            </div>
          </div>

          <div className="condition-monitoring-section">
            <h3>Condition Monitoring</h3>
            <div className="condition-health">
              <span className="condition-label">Health Score</span>
              <CapacityBar value={health} />
            </div>

            <div className="telemetry-grid">
              <div className="telemetry-item">
                <span className="telemetry-label">Vibration</span>
                <span className="telemetry-val">{vibration} mm/s</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Temperature</span>
                <span className="telemetry-val">{temperature} °C</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsModal;
