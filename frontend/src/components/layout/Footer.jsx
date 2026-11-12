import React from 'react';

const Footer = () => {
  return (
    <footer className="scada-footer" role="contentinfo">
      <div className="scada-footer-left">
        <span className="footer-status-dot"></span>
        <span className="footer-brand">AssetArc Enterprise Engine © 2026</span>
        <span className="footer-divider">|</span>
        <span className="footer-item">
          <svg className="footer-lock-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          TLS 1.3 Encrypted
        </span>
      </div>
      <div className="scada-footer-right">
        <span className="footer-item">Cluster: <strong className="mono-val text-cyan">US-East-Telemetry</strong></span>
        <span className="footer-divider">•</span>
        <span className="footer-item">API Health: <strong className="mono-val text-green">99.99%</strong></span>
        <span className="footer-divider">•</span>
        <span className="footer-item">Sync Rate: <strong className="mono-val text-cyan">500ms</strong></span>
      </div>
    </footer>
  );
};

export default Footer;
