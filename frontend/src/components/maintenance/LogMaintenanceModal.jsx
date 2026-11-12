import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { completeTask, clearMaintenanceError, fetchSchedules } from '../../store/slices/maintenanceSlice';
import { fetchAssets } from '../../store/slices/assetSlice';

const LogMaintenanceModal = ({ isOpen, task, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.maintenance);

  const [workDescription, setWorkDescription] = useState('');
  const [costIncurred, setCostIncurred] = useState('');

  const handleClose = () => {
    dispatch(clearMaintenanceError());
    onClose();
  };

  if (!isOpen || !task) {
    return null;
  }

  const assetName = task.asset?.name || task.assetName || 'Unknown Asset';
  const assetTag = task.asset?.assetTag || task.assetTag || 'N/A';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(
      completeTask({
        scheduleId: task.id,
        workDescription,
        costIncurred: parseFloat(costIncurred) || 0,
        technicianId: user?.id || 2,
      })
    );

    if (!res.error) {
      setWorkDescription('');
      setCostIncurred('');
      dispatch(fetchAssets({ page: 0, size: 100 }));
      dispatch(fetchSchedules());
      handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Complete Maintenance Task</h2>
          <button className="close-btn" onClick={handleClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="task-asset-info">
          <div className="info-row">
            <span className="info-label">Asset:</span>
            <strong>{assetName}</strong> ({assetTag})
          </div>
          <div className="info-row">
            <span className="info-label">Type:</span>
            <span>{task.maintenanceType}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="log-maintenance-form">
          <div className="form-group">
            <label htmlFor="workDescription">Work Description</label>
            <textarea
              id="workDescription"
              rows={4}
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              placeholder="Describe the maintenance work performed..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="costIncurred">Cost Incurred ($)</label>
            <input
              id="costIncurred"
              type="number"
              step="0.01"
              value={costIncurred}
              onChange={(e) => setCostIncurred(e.target.value)}
              placeholder="Total cost of parts and labor"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="complete-btn">
              {loading ? 'Submitting...' : 'Submit Completion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogMaintenanceModal;
