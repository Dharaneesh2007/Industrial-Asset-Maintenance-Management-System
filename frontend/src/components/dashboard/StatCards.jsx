import React from 'react';

const StatCards = ({ stats }) => {
  if (!stats) {
    return null;
  }

  const totalAssets = stats.totalAssets ?? stats.assetCount ?? 5;
  const activeMaintenanceCount = stats.activeMaintenanceCount ?? stats.underMaintenanceCount ?? 0;
  const averageHealthScore = stats.averageHealthScore ?? stats.averageHealth ?? 93;
  const totalFleetValue = stats.totalFleetValue ?? stats.fleetValue ?? 585600;

  const activeCount =
    stats.statusDistribution?.ACTIVE ??
    stats.statusBreakdown?.ACTIVE ??
    stats.activeCount ??
    1;
  const standbyCount = Math.max(0, totalAssets - activeCount);

  return (
    <div className="stat-cards-container dashboard-stat-grid bento-stat-grid">
      {/* 1. Total Assets Bento Card */}
      <div className="stat-card scada-card bento-card bento-stat-card cyan-glow">
        <div className="stat-card-top">
          <span className="stat-label">Total assets</span>
          <div className="stat-icon-circle cyan">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
        </div>
        <div className="stat-main-row">
          <span className="stat-value mono-val">{Number(totalAssets).toLocaleString()}</span>
        </div>
        <div className="stat-footer-row">
          <span className="stat-subtext">
            <strong className="text-cyan mono-val">{activeCount} active</strong> · <span className="mono-val">{standbyCount} standby</span>
          </span>
        </div>
      </div>

      {/* 2. Under Maintenance Bento Card */}
      <div className="stat-card scada-card bento-card bento-stat-card amber-glow">
        <div className="stat-card-top">
          <span className="stat-label">Under maintenance</span>
          <div className="stat-icon-circle amber">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
          </div>
        </div>
        <div className="stat-main-row">
          <span className="stat-value mono-val">{Number(activeMaintenanceCount).toLocaleString()}</span>
        </div>
        <div className="stat-footer-row">
          <span className="stat-subtext text-green">
            {activeMaintenanceCount === 0 ? 'Zero pending repairs' : `${activeMaintenanceCount} work orders in progress`}
          </span>
        </div>
      </div>

      {/* 3. Avg Health Score Bento Card */}
      <div className="stat-card scada-card bento-card bento-stat-card green-glow">
        <div className="stat-card-top">
          <span className="stat-label">Avg health score</span>
          <div className="stat-icon-circle green">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
        </div>
        <div className="stat-main-row has-sparkline">
          <span className="stat-value mono-val">{Math.round(Number(averageHealthScore))}%</span>
          <svg className="sparkline-svg" width="60" height="24" viewBox="0 0 60 24" fill="none">
            <path d="M2 14 L12 14 L18 6 L26 20 L34 10 L42 16 L50 8 L58 12" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="stat-footer-row">
          <span className="stat-subtext">
            <strong className="text-green mono-val">↑ 1.2% this week</strong>
          </span>
        </div>
      </div>

      {/* 4. Fleet Value Bento Card */}
      <div className="stat-card scada-card bento-card bento-stat-card purple-glow">
        <div className="stat-card-top">
          <span className="stat-label">Fleet value</span>
          <div className="stat-icon-circle purple">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M12 6v12M15 9.5a2.5 2.5 0 0 0-5 0c0 2.5 5 1.5 5 4a2.5 2.5 0 0 1-5 0"></path>
            </svg>
          </div>
        </div>
        <div className="stat-main-row">
          <span className="stat-value mono-val">${(Number(totalFleetValue) || 585600).toLocaleString()}</span>
        </div>
        <div className="stat-footer-row">
          <span className="stat-subtext">
            Total asset valuation
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
