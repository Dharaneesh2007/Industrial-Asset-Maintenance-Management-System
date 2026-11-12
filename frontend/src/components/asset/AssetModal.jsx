import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAsset } from '../../store/slices/assetSlice';

const AssetModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.assets);

  const [formData, setFormData] = useState({
    assetTag: '',
    name: '',
    category: 'MANUFACTURING',
    installDate: '',
    purchasePrice: '',
    lifespanYears: '',
  });

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lifespan = parseInt(formData.lifespanYears, 10) || 0;
    const payload = {
      ...formData,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      lifespanYears: lifespan,
      expectedLifespanYears: lifespan,
    };
    const res = await dispatch(createAsset(payload));
    if (!res.error) {
      setFormData({
        assetTag: '',
        name: '',
        category: 'MANUFACTURING',
        installDate: '',
        purchasePrice: '',
        lifespanYears: '',
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Register New Asset</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="asset-form">
          <div className="form-group">
            <label htmlFor="assetTag">Asset Tag</label>
            <input
              id="assetTag"
              type="text"
              name="assetTag"
              value={formData.assetTag}
              onChange={handleChange}
              placeholder="e.g. CNC-202"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Main Milling Station"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="MANUFACTURING">MANUFACTURING</option>
              <option value="LOGISTICS">LOGISTICS</option>
              <option value="UTILITIES">UTILITIES</option>
              <option value="FACILITIES">FACILITIES</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="installDate">Install Date</label>
            <input
              id="installDate"
              type="date"
              name="installDate"
              value={formData.installDate}
              onChange={handleChange}
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
            <label htmlFor="purchasePrice">Purchase Price</label>
            <input
              id="purchasePrice"
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="e.g. 50000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lifespanYears">Lifespan Years</label>
            <input
              id="lifespanYears"
              type="number"
              name="lifespanYears"
              value={formData.lifespanYears}
              onChange={handleChange}
              placeholder="e.g. 10"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="primary-btn">
              {loading ? 'Saving...' : 'Save Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetModal;
