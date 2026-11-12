import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('ASSET_MANAGER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (user) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]);

  // Validation Rules
  const isUsernameValid = /^[a-zA-Z0-9_]{4,20}$/.test(username.trim());
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Password Checklist Conditions
  const hasMin8 = password.length >= 8;
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUsername = username.trim().replace(/<[^>]*>?/gm, '');
    const cleanEmail = email.trim().replace(/<[^>]*>?/gm, '');

    if (!cleanUsername) {
      setValidationError('Username is required');
      return;
    }
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(cleanUsername)) {
      setValidationError('Username must be 4-20 alphanumeric characters or underscores');
      return;
    }
    if (!cleanEmail) {
      setValidationError('Email address is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setValidationError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setValidationError('Password is required');
      return;
    }
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }
    if (!hasUpperLower || !hasNumber || !hasSpecial) {
      setValidationError('Password must meet all security requirements');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    setValidationError('');
    const result = await dispatch(
      register({
        username: cleanUsername,
        email: cleanEmail,
        password,
        role,
      })
    );

    if (register.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  const displayedError = validationError || error;

  return (
    <div className="login-container register-container auth-page-container">
      {/* Top SCADA Status Bar */}
      <div className="auth-top-scada-bar">
        <div className="auth-top-left">
          <div className="brand-icon-box small">
            <svg
              className="signal-glyph"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12h3l3-8 4 16 3-10 2 5 2-3h3" />
            </svg>
          </div>
          <span className="brand-name">AssetArc</span>
          <span className="brand-version-badge">TELEMETRY OPS V2.8</span>
        </div>
        <div className="auth-top-right">
          <div className="mesh-status-pill">
            <span className="mesh-dot-pulse"></span>
            <span className="mesh-text">Telemetry Node Active <span className="mesh-ping">| 9ms Latency</span></span>
          </div>
        </div>
      </div>

      {/* Live Facility Feed Industrial Background */}
      <div className="auth-background" aria-hidden="true">
        <div className="auth-bg-feed" />
        <div className="auth-bg-overlay" />
      </div>

      <div className="auth-card-center-wrapper register-wrapper">
        <form className="login-form register-form instrument-panel-card" onSubmit={handleSubmit}>
          <div className="auth-header">
            <div className="auth-logo-badge">
              <svg className="lightning-icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span className="brand-name">AssetArc</span>
              <span className="status-indicator-dot" title="Live Link Active" />
            </div>
            <h1>AssetArc Register</h1>
            <p className="auth-subtitle">Register to monitor and manage your equipment fleet.</p>
          </div>

          {displayedError && (
            <div className="error-message" role="alert">
              <svg
                className="error-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{displayedError}</span>
            </div>
          )}

          {/* Username */}
          <div className="form-group">
            <label htmlFor="reg-username">Username <span className="text-cyan">*</span></label>
            <div className="input-wrapper input-with-icon">
              <svg className="field-lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                id="reg-username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="Choose a username"
                autoComplete="username"
                required
              />
            </div>
            {username.length > 0 && !isUsernameValid && (
              <small className="field-hint error">
                4-20 alphanumeric characters & underscores only
              </small>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email">Email address <span className="text-cyan">*</span></label>
            <div className="input-wrapper input-with-icon">
              <svg className="field-lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                id="reg-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="Enter your email address"
                autoComplete="email"
                required
              />
            </div>
            {email.length > 0 && !isEmailValid && (
              <small className="field-hint error">
                Please enter a valid email address
              </small>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password">Password <span className="text-cyan">*</span></label>
            <div className="input-wrapper input-with-icon password-input-wrapper">
              <svg className="field-lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="Choose a secure password"
                autoComplete="new-password"
                required
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex="-1"
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>

            {/* Password Requirements Box */}
            <div className="security-checklist-box">
              <div className="checklist-box-header">
                <span className="checklist-title">Password requirements</span>
              </div>
              <div className="password-conditions-checklist">
                <div className={`checklist-item ${hasMin8 ? 'valid' : 'invalid'}`}>
                  <span className="checklist-bullet">{hasMin8 ? '✓' : '○'}</span>
                  <span>Password must be at least 8 characters</span>
                </div>
                <div className={`checklist-item ${hasUpperLower ? 'valid' : 'invalid'}`}>
                  <span className="checklist-bullet">{hasUpperLower ? '✓' : '○'}</span>
                  <span>Uppercase & lowercase letters</span>
                </div>
                <div className={`checklist-item ${hasNumber ? 'valid' : 'invalid'}`}>
                  <span className="checklist-bullet">{hasNumber ? '✓' : '○'}</span>
                  <span>At least one number (0-9)</span>
                </div>
                <div className={`checklist-item ${hasSpecial ? 'valid' : 'invalid'}`}>
                  <span className="checklist-bullet">{hasSpecial ? '✓' : '○'}</span>
                  <span>At least one special character (!@#$%^&*)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="reg-confirm-password">Confirm password <span className="text-cyan">*</span></label>
            <div className="input-wrapper input-with-icon password-input-wrapper">
              <svg className="field-lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <input
                id="reg-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                tabIndex="-1"
              >
                {showConfirmPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {passwordMismatch && (
              <small className="field-hint error">Passwords do not match</small>
            )}
            {passwordsMatch && (
              <small className="field-hint success">Passwords match</small>
            )}
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="reg-role">Role <span className="text-cyan">*</span></label>
            <div className="input-wrapper">
              <select
                id="reg-role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="ASSET_MANAGER">Asset Manager (Full Fleet Control)</option>
                <option value="MAINTENANCE_TECHNICIAN">Maintenance Technician (Work Orders)</option>
                <option value="OPERATIONS_SUPERVISOR">Operations Supervisor (Telemetry & Logs)</option>
                { <option value="SYSTEM_ADMIN">System Administrator (Global Config)</option> }
                <option value="READ_ONLY_VIEWER">Read Only Viewer (Dashboard Only)</option>
              </select>
            </div>
          </div>

          {/* Legal Checkbox */}
          <div className="auth-checkbox-row">
            <label className="custom-checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="custom-checkbox-box"></span>
              <span className="checkbox-text">
                I agree to the <a href="#terms" onClick={(e) => e.preventDefault()} className="auth-inline-link">Terms of Service</a> and <a href="#privacy" onClick={(e) => e.preventDefault()} className="auth-inline-link">Privacy Policy</a>.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="primary-btn submit-auth-btn gradient-btn"
            aria-label="Register"
          >
            {loading ? (
              <span className="btn-loading-content">
                <span className="btn-spinner"></span>
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>

          <div className="auth-switch-link">
            <span>Already have an account? </span>
            <Link to="/login" className="auth-nav-link">
              Login here
            </Link>
          </div>
        </form>
      </div>

      <div className="auth-bottom-scada-footer">
        <div className="footer-left">
          <span className="footer-status-dot"></span>
          <span>AssetArc Enterprise Engine © 2026</span>
          <span className="footer-divider">|</span>
          <span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: 4 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            TLS 1.3 Encrypted
          </span>
          <span className="footer-divider">·</span>
          <span>Cluster: <strong className="text-cyan">US-East-Telemetry</strong></span>
        </div>
        <div className="footer-right">
          <span className="footer-status-dot green"></span>
          <span>API Health: <strong className="text-green">99.99%</strong></span>
        </div>
      </div>
    </div>
  );
};

export default Register;
