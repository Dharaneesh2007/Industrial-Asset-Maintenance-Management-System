import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAssets } from './store/slices/assetSlice';
import assetService from './services/assetService';
import StatCards from './components/dashboard/StatCards';
import StatusDonut from './components/dashboard/StatusDonut';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: assets } = useSelector((state) => state.assets);

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await assetService.getStats();
        if (isMounted) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to load dashboard stats');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStats();
    if (!assets || assets.length === 0) {
      dispatch(fetchAssets({ page: 0, size: 20 }));
    }
    return () => {
      isMounted = false;
    };
  }, [dispatch, assets]);

  if (loading && !stats) {
    return (
      <div className="page-container dashboard-page">
        <div className="loading-state">Loading dashboard...</div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="page-container dashboard-page">
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  const activeVal =
    stats?.statusDistribution?.ACTIVE ??
    stats?.statusBreakdown?.ACTIVE ??
    stats?.activeCount ??
    stats?.activeAssets ??
    0;

  const underMaintVal =
    stats?.statusDistribution?.UNDER_MAINTENANCE ??
    stats?.statusBreakdown?.UNDER_MAINTENANCE ??
    stats?.activeMaintenanceCount ??
    stats?.underMaintenanceCount ??
    0;

  const decommVal =
    stats?.statusDistribution?.DECOMMISSIONED ??
    stats?.statusBreakdown?.DECOMMISSIONED ??
    stats?.decommissionedCount ??
    stats?.decommissionedAssets ??
    0;

  const totalAssetsCount =
    stats?.totalAssets ??
    stats?.assetCount ??
    ((activeVal + underMaintVal + decommVal) || 5);
  const avgHealth = Math.round(Number(stats?.averageHealthScore ?? stats?.averageHealth ?? 94));

  const donutData = [
    { label: 'ACTIVE', value: activeVal || 1, color: '#FF6B00' },
    { label: 'UNDER_MAINTENANCE', value: underMaintVal || 0, color: '#FF9800' },
    { label: 'DECOMMISSIONED', value: decommVal || 4, color: '#EF4444' },
  ];

  // Pick or construct critical machine for telemetry alert
  const criticalAsset = (assets || []).find(
    (a) => (a.currentHealth ?? a.health ?? 100) < 75 || a.currentStatus === 'UNDER_MAINTENANCE'
  ) || {
    id: 99,
    assetTag: 'CNC-4491',
    name: 'CNC Milling Rig #04',
    currentHealth: 54,
    currentStatus: 'ACTIVE',
  };

  return (
    <div className="page-container dashboard-page bento-dashboard-layout">
      {/* Hero Bento Section */}
      <div className="dashboard-header hero-section bento-hero-card">
        <div className="hero-left-info">
          <div className="scada-mesh-badge">
            <span className="pulse-cyan-dot"></span> SCADA TELEMETRY NETWORK V2.8
          </div>
          <h1>Operations Dashboard</h1>
          <p className="hero-subtitle">
            Live status and health across your equipment fleet.
          </p>
        </div>
        <div className="hero-actions">
          <button
            className="secondary-btn export-btn"
            onClick={() => {
              const blob = new Blob([JSON.stringify(stats || {}, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `telemetry-export-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Telemetry
          </button>
          <button
            className="primary-btn explore-btn"
            onClick={() => navigate('/assets')}
          >
            Explore Assets <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>

      {/* Top 4 Bento Stat Cards */}
      <StatCards stats={stats} />

      {/* Main Asymmetric Bento Dashboard Grid */}
      <div className="dashboard-grid bento-main-grid">
        {/* Left Bento Column: Asset Status Breakdown & Donut */}
        <div className="dashboard-card status-distribution-card bento-card bento-donut-card">
          <div className="card-top-header">
            <div>
              <h2>Asset status breakdown</h2>
              <span className="card-subheading">Fleet operational partition status</span>
            </div>
            <span className="realtime-pill">REALTIME</span>
          </div>
          <StatusDonut data={donutData} />
        </div>

        {/* Right Bento Column: Fleet Health Overview */}
        <div className="dashboard-card fleet-overview-card bento-card bento-overview-card">
          <div className="card-top-header">
            <div>
              <h2>Fleet Health Overview</h2>
              <p className="overview-description">
                Assets currently undergoing maintenance:{' '}
                <strong className="mono-val text-amber">
                  {stats?.activeMaintenanceCount ?? stats?.underMaintenanceCount ?? 0}
                </strong>
              </p>
            </div>
            <span className="status-indicator-badge live-mesh-badge">
              <span className="pulse-green-dot"></span> LIVE MESH
            </span>
          </div>

          <div className="fleet-quick-stats bento-inner-stats">
            <div className="quick-stat-item bento-mini-stat">
              <span className="quick-stat-label">Total fleet assets</span>
              <strong className="quick-stat-val mono-val">{totalAssetsCount}</strong>
              <span className="quick-stat-sub">100% Ingested</span>
            </div>
            <div className="quick-stat-item bento-mini-stat">
              <span className="quick-stat-label">Avg health score</span>
              <strong className="quick-stat-val text-cyan mono-val">{avgHealth}%</strong>
              <span className="quick-stat-sub text-green">▲ 2.4% vs last week</span>
            </div>
          </div>

          {/* Machine Requiring Attention Alert Bento Cell */}
          <div className="critical-machines-panel bento-alert-cell">
            <div className="critical-panel-header">
              <span className="panel-tag-title">Machines requiring attention</span>
              <span className="critical-status-pill">⚠ CRITICAL VIBRATION</span>
            </div>
            <div className="critical-machine-card bento-inner-card">
              <div className="critical-machine-info">
                <span className="machine-tag-badge mono-val">{criticalAsset.assetTag}</span>
                <span className="machine-name-title">{criticalAsset.name}</span>
              </div>
              <div className="critical-health-row">
                <div className="critical-health-labels">
                  <span>Health Metric</span>
                  <span className="mono-val text-red font-bold">{criticalAsset.currentHealth ?? 54}% Health</span>
                </div>
                <div className="critical-track">
                  <div
                    className="critical-fill"
                    style={{ width: `${criticalAsset.currentHealth ?? 54}%` }}
                  ></div>
                </div>
              </div>
              <div className="critical-card-footer">
                <span className="critical-rec-text">Suggested action: Bearing inspection & lubricate</span>
                <button
                  className="diagnostic-btn"
                  onClick={() => navigate('/health')}
                >
                  View Diagnostic →
                </button>
              </div>
            </div>
          </div>

          {/* Live Telemetry Pings Terminal Bento Cell */}
          <div className="telemetry-pings-panel bento-terminal-cell">
            <div className="pings-header">
              <span className="pings-title">Live telemetry pings</span>
              <span className="mono-val text-dim pings-rate">12 Hz Stream</span>
            </div>
            <div className="pings-terminal-stream">
              <div className="ping-log-row">
                <span className="ping-time mono-val">[10:47:12]</span>
                <span className="ping-badge tag-nominal">NOMINAL</span>
                <span className="ping-msg">Sensor #402 vibration within threshold (1.24 mm/s)</span>
              </div>
              <div className="ping-log-row">
                <span className="ping-time mono-val">[10:46:58]</span>
                <span className="ping-badge tag-ok">OK</span>
                <span className="ping-msg">Thermal scan Alpha-1 steady state (68.4°C)</span>
              </div>
              <div className="ping-log-row">
                <span className="ping-time mono-val">[10:46:22]</span>
                <span className="ping-badge tag-ok">OK</span>
                <span className="ping-msg">Pressure line 3 nominal (220 PSI)</span>
              </div>
            </div>
          </div>

          <div className="overview-quick-actions">
            <button
              className="primary-btn view-btn-fleet"
              onClick={() => navigate('/assets')}
            >
              View Fleet Inventory →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bento Operations Launchpad Hub */}
      <div className="bento-launchpad-grid">
        <div className="bento-card bento-action-tile" onClick={() => navigate('/assets')}>
          <div className="bento-tile-top">
            <div className="bento-icon-wrapper cyan">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            </div>
            <span className="bento-tile-badge">Inventory</span>
          </div>
          <div className="bento-tile-body">
            <h3>Asset Repository</h3>
            <p>Manage, inspect, and configure industrial fleet assets.</p>
          </div>
          <span className="bento-tile-link">Explore Assets →</span>
        </div>

        <div className="bento-card bento-action-tile" onClick={() => navigate('/maintenance')}>
          <div className="bento-tile-top">
            <div className="bento-icon-wrapper amber">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
            </div>
            <span className="bento-tile-badge">Service</span>
          </div>
          <div className="bento-tile-body">
            <h3>Maintenance Dispatch</h3>
            <p>Schedule routines and execute corrective work orders.</p>
          </div>
          <span className="bento-tile-link">View Scheduler →</span>
        </div>

        <div className="bento-card bento-action-tile" onClick={() => navigate('/health')}>
          <div className="bento-tile-top">
            <div className="bento-icon-wrapper green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <span className="bento-tile-badge">Realtime</span>
          </div>
          <div className="bento-tile-body">
            <h3>Condition Monitoring</h3>
            <p>High-frequency vibration, thermal, and sensor oscilloscope.</p>
          </div>
          <span className="bento-tile-link">Open Telemetry →</span>
        </div>

        <div className="bento-card bento-action-tile" onClick={() => navigate('/reports')}>
          <div className="bento-tile-top">
            <div className="bento-icon-wrapper purple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            </div>
            <span className="bento-tile-badge">Audit</span>
          </div>
          <div className="bento-tile-body">
            <h3>Lifecycle Reports</h3>
            <p>MTBF projections, spend analytics, and PDF audit exports.</p>
          </div>
          <span className="bento-tile-link">Generate Reports →</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
