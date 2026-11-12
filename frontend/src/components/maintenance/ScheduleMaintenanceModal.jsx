import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSchedule, clearMaintenanceError, fetchSchedules } from '../../store/slices/maintenanceSlice';
import { fetchAssets } from '../../store/slices/assetSlice';

const ScheduleMaintenanceModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items: assets } = useSelector((state) => state.assets);
  const { loading, error } = useSelector((state) => state.maintenance);

  const todayDateStr = new Date().toISOString().split('T')[0];
  const [assetId, setAssetId] = useState('');
  const [plannedDate, setPlannedDate] = useState(todayDateStr);
  const [maintenanceType, setMaintenanceType] = useState('ROUTINE');
  const [priority, setPriority] = useState('MEDIUM');

  const handleClose = () => {
    dispatch(clearMaintenanceError());
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const eligibleAssets = (assets || []).filter(
    (asset) => asset.currentStatus !== 'DECOMMISSIONED'
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assetId) return;

    const res = await dispatch(
      createSchedule({
        assetId: parseInt(assetId, 10),
        plannedDate: plannedDate || new Date().toISOString().split('T')[0],
        maintenanceType,
        priority,
      })
    );

    if (!res.error) {
      setAssetId('');
      setPlannedDate(todayDateStr);
      setMaintenanceType('ROUTINE');
      setPriority('MEDIUM');
      dispatch(fetchAssets({ page: 0, size: 100 }));
      dispatch(fetchSchedules());
      handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Schedule Maintenance</h2>
          <button className="close-btn" onClick={handleClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-group">
            <label htmlFor="assetSelect">Asset</label>
            <select
              id="assetSelect"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              required
            >
              <option value="">-- Select an active asset --</option>
              {eligibleAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.assetTag} - {asset.name}
                </option>
              ))}
            </select>
            {eligibleAssets.length === 0 && (
              <p style={{ color: '#f59e0b', fontSize: '0.8rem', marginTop: '4px' }}>
                No active assets available. Please register or activate an asset first.
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="plannedDate">Planned Date</label>
            <input
              id="plannedDate"
              type="date"
              value={plannedDate}
              onChange={(e) => setPlannedDate(e.target.value)}
              onClick={(e) => e.target.showPicker?.()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.target.showPicker?.();
                }
              }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="maintenanceType">Maintenance Type</label>
            <select
              id="maintenanceType"
              value={maintenanceType}
              onChange={(e) => setMaintenanceType(e.target.value)}
              required
            >
              <option value="ROUTINE">ROUTINE</option>
              <option value="REPAIR">REPAIR</option>
              <option value="INSPECTION">INSPECTION</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="primary-btn">
              {loading ? 'Scheduling...' : 'Schedule Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMaintenanceModal;
