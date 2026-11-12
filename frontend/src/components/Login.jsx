import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUsername = username.trim().replace(/<[^>]*>?/gm, '');

    if (!cleanUsername) {
      setValidationError('Username is required');
      return;
    }
    if (!password) {
      setValidationError('Password is required');
      return;
    }
    if (password.length < 8) {
      setPasswordError('Password does not meet the 8-character requirement');
      setValidationError('Password does not meet the 8-character requirement');
      return;
    }

    setValidationError('');
    setPasswordError('');
    dispatch(login({ username: cleanUsername, password }));
  };

  const displayedError = validationError || passwordError || error;

  return (
    <div className="login-container auth-page-container">
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
          <span className="brand-version-badge">OPS V2.8</span>
          <span className="auth-top-tag">INDUSTRIAL TELEMETRY PLATFORM</span>
        </div>
        <div className="auth-top-right">
          <div className="mesh-status-pill">
            <span className="mesh-dot-pulse"></span>
            <span className="mesh-text">Mesh: <strong className="text-green">Online (12ms)</strong></span>
          </div>
          <span className="active-node-tag">Active Node: <strong className="mono-val">#US-EAST-01</strong></span>
        </div>
      </div>

      {/* Live Facility Feed Industrial Background */}
      <div className="auth-background" aria-hidden="true">
        <div className="auth-bg-feed" />
        <div className="auth-bg-overlay" />
      </div>

      <div className="auth-card-center-wrapper">
        <form className="login-form instrument-panel-card login-card" onSubmit={handleSubmit}>
          <div className="auth-header">
            <div className="auth-logo-badge">
              <svg className="lightning-icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span className="brand-name">AssetArc</span>
              <span className="status-indicator-dot" title="Live Telemetry Link Active" />
            </div>
            <h1>AssetArc Login</h1>
            <p className="auth-subtitle">
              Sign in to monitor your equipment fleet.
            </p>

            {/* Clean subtle gradient divider */}
            <div className="auth-divider-line" aria-hidden="true" />
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

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper input-with-icon">
              <svg className="field-lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (validationError) setValidationError('');
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group password-group">
            <div className="form-label-row">
              <label htmlFor="password">Password</label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="label-link-forgot">Forgot password?</a>
            </div>
            <div className="input-wrapper input-with-icon password-input-wrapper">
              <svg className="field-lead-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationError) setValidationError('');
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Enter password"
                autoComplete="current-password"
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
            <span className={`hint ${password.length >= 8 ? 'valid' : ''}`}>
              <span className="hint-icon">{password.length >= 8 ? '✓' : '○'}</span>
              <span>Password must be at least 8 characters</span>
            </span>
          </div>

          <div className="auth-checkbox-row">
            <label className="custom-checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="checkbox-text">Keep me signed in</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-btn submit-auth-btn gradient-btn"
            aria-label="Login"
          >
            {loading ? (
              <span className="btn-loading-content">
                <span className="btn-spinner"></span>
                Logging in...
              </span>
            ) : (
              'Log in'
            )}
          </button>

          <div className="auth-switch-link">
            <span>Don't have an account? </span>
            <Link to="/register" className="auth-nav-link">
              Register here
            </Link>
          </div>
        </form>

        <div className="card-encryption-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>TLS 1.3 256 Bit Encrypted Channel · SOC2 Type II</span>
        </div>
      </div>

      <div className="auth-bottom-scada-footer">
        <div className="footer-left">
          <span className="footer-status-dot"></span>
          <span>AssetArc Enterprise Engine © 2026</span>
          <span className="footer-divider">|</span>
          <span>TLS 1.3 Verified</span>
          <span className="footer-divider">·</span>
          <span>Cluster: <strong className="text-cyan">US East-Telemetry</strong></span>
        </div>
        <div className="footer-right">
          <span className="footer-status-dot green"></span>
          <span>API Health: <strong className="text-green">99.99%</strong></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
