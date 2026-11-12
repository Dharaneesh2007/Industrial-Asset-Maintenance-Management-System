import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAssets } from '../store/slices/assetSlice';

const HealthMonitor = () => {
  const dispatch = useDispatch();
  const { items: assets, error } = useSelector((state) => state.assets);
  const [isStreaming, setIsStreaming] = useState(true);
  const [packetCount, setPacketCount] = useState(1420);

  useEffect(() => {
    if (!assets || assets.length === 0) {
      dispatch(fetchAssets({ page: 0, size: 100 }));
    }
  }, [dispatch, assets]);

  useEffect(() => {
    if (!isStreaming) return;
    const timer = setInterval(() => {
      setPacketCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 1500);
    return () => clearInterval(timer);
  }, [isStreaming]);

  return (
    <div className="page-container health-monitor-page bento-health-page">
      <div className="page-header bento-header-bar">
        <div>
          <div className="scada-mesh-badge">
            <span className="pulse-green-dot"></span> Real-time telemetry feed
          </div>
          <h1>Live condition monitoring</h1>
          <p className="page-subtitle">
            High-frequency sensor metrics, vibration spectrums, and thermal readouts across connected assets.
          </p>
        </div>
        <div className="header-action-group">
          <button
            className="secondary-btn export-btn"
            onClick={() => alert('Calibrating active telemetry node probes... OK [Nominal]')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0 2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
            Sensor Calibration
          </button>
          <button
            className="secondary-btn export-btn"
            onClick={() => alert('Exporting real-time telemetry log...')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export Log
          </button>
          <button
            className={`pause-stream-btn ${!isStreaming ? 'paused' : ''}`}
            onClick={() => setIsStreaming(!isStreaming)}
          >
            {isStreaming ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                Pause Stream
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                Resume Stream
              </>
            )}
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Top 4 Bento Telemetry Stat Meters */}
      <div className="telemetry-stat-strip bento-telemetry-meters">
        <div className="telemetry-meter-card bento-card bento-meter-card">
          <div className="meter-label">Overall health</div>
          <div className="meter-val-row">
            <span className="meter-val mono-val text-green">94%</span>
            <span className="meter-sub">Nominal fleet avg</span>
          </div>
          <div className="meter-progress-track">
            <div className="meter-progress-fill green" style={{ width: '94%' }}></div>
          </div>
        </div>

        <div className="telemetry-meter-card bento-card bento-meter-card">
          <div className="meter-label">Peak vibration</div>
          <div className="meter-val-row">
            <span className="meter-val mono-val text-cyan">1.24 <small>mm/s</small></span>
            <span className="meter-sub">Asset CNC-001</span>
          </div>
          <div className="meter-progress-track">
            <div className="meter-progress-fill cyan" style={{ width: '42%' }}></div>
          </div>
        </div>

        <div className="telemetry-meter-card bento-card bento-meter-card">
          <div className="meter-label">Max bearing temp</div>
          <div className="meter-val-row">
            <span className="meter-val mono-val text-amber">68.4 <small>°C</small></span>
            <span className="meter-sub">Asset TURB-99</span>
          </div>
          <div className="meter-progress-track">
            <div className="meter-progress-fill amber" style={{ width: '68%' }}></div>
          </div>
        </div>

        <div className="telemetry-meter-card bento-card bento-meter-card">
          <div className="meter-label">Packet ingestion</div>
          <div className="meter-val-row">
            <span className="meter-val mono-val text-purple">{packetCount} <small>pkts/s</small></span>
            <span className="meter-sub">12ms ingest latency</span>
          </div>
          <div className="meter-progress-track">
            <div className="meter-progress-fill purple" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* 2-Column Bento Telemetry Dashboard Grid */}
      <div className="telemetry-dashboard-grid bento-telemetry-grid">
        {/* Left Column: 2x2 Bento Metric Panels */}
        <div className="telemetry-sensor-grid bento-sensors-deck">
          {/* Sensor Card 1: RMS Vibration */}
          <div className="dashboard-card sensor-panel-card bento-card">
            <div className="sensor-panel-header">
              <div>
                <span className="sensor-asset-tag mono-val">[ CNC-001 ]</span>
                <h3>RMS vibration spectrum</h3>
              </div>
              <span className="sensor-status-badge green">● NOMINAL</span>
            </div>
            <div className="waveform-container bento-inner-canvas">
              <svg className="waveform-svg" viewBox="0 0 300 80">
                <path
                  d="M0,40 Q25,10 50,40 T100,40 T150,40 T200,40 T250,40 T300,40"
                  fill="none"
                  stroke="#FF6B00"
                  strokeWidth="2.5"
                  className="animated-wave"
                />
                <path
                  d="M0,40 Q25,25 50,40 T100,40 T150,40 T200,40 T250,40 T300,40"
                  fill="none"
                  stroke="rgba(255, 107, 0, 0.25)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className="sensor-metric-footer">
              <div>
                <span className="metric-caption">Peak velocity</span>
                <div className="metric-val mono-val text-cyan">1.24 mm/s</div>
              </div>
              <div className="metric-right">
                <span className="metric-caption">Warning limit</span>
                <div className="metric-val mono-val text-dim">4.50 mm/s</div>
              </div>
            </div>
          </div>

          {/* Sensor Card 2: Bearing Temperature */}
          <div className="dashboard-card sensor-panel-card bento-card">
            <div className="sensor-panel-header">
              <div>
                <span className="sensor-asset-tag mono-val">[ TURB-99 ]</span>
                <h3>Bearing temperature range</h3>
              </div>
              <span className="sensor-status-badge amber">● ELEVATED</span>
            </div>
            <div className="temp-gauge-container bento-inner-canvas">
              <div className="temp-readout-center">
                <span className="temp-big-val mono-val text-amber">68.4°C</span>
                <span className="temp-sub-label">Sensor Probe #2</span>
              </div>
              <div className="temp-bar-wrapper">
                <div className="temp-bar-fill" style={{ width: '68.4%' }}></div>
              </div>
            </div>
            <div className="sensor-metric-footer">
              <div>
                <span className="metric-caption">Ambient temp</span>
                <div className="metric-val mono-val text-dim">24.2 °C</div>
              </div>
              <div className="metric-right">
                <span className="metric-caption">Critical threshold</span>
                <div className="metric-val mono-val text-red">95.0 °C</div>
              </div>
            </div>
          </div>

          {/* Sensor Card 3: Hydraulic Pressure */}
          <div className="dashboard-card sensor-panel-card bento-card">
            <div className="sensor-panel-header">
              <div>
                <span className="sensor-asset-tag mono-val">[ HYD-400 ]</span>
                <h3>Hydraulic pressure system</h3>
              </div>
              <span className="sensor-status-badge green">● STEADY</span>
            </div>
            <div className="pressure-readout-container bento-inner-canvas">
              <div className="pressure-display">
                <span className="pressure-val mono-val text-green">220</span>
                <span className="pressure-unit">PSI</span>
              </div>
              <span className="pressure-sub">Loop A Operating Range</span>
            </div>
            <div className="sensor-metric-footer">
              <div>
                <span className="metric-caption">Minimum baseline</span>
                <div className="metric-val mono-val text-dim">180 PSI</div>
              </div>
              <div className="metric-right">
                <span className="metric-caption">Relief valve cap</span>
                <div className="metric-val mono-val text-dim">250 PSI</div>
              </div>
            </div>
          </div>

          {/* Sensor Card 4: Angular Velocity */}
          <div className="dashboard-card sensor-panel-card bento-card">
            <div className="sensor-panel-header">
              <div>
                <span className="sensor-asset-tag mono-val">[ PUMP-12 ]</span>
                <h3>Rotor angular velocity</h3>
              </div>
              <span className="sensor-status-badge cyan">● OPTIMAL</span>
            </div>
            <div className="pressure-readout-container bento-inner-canvas">
              <div className="pressure-display">
                <span className="pressure-val mono-val text-cyan">2,840</span>
                <span className="pressure-unit">RPM</span>
              </div>
              <span className="pressure-sub">Synchronous drive locked</span>
            </div>
            <div className="sensor-metric-footer">
              <div>
                <span className="metric-caption">Rated target</span>
                <div className="metric-val mono-val text-dim">2,850 RPM</div>
              </div>
              <div className="metric-right">
                <span className="metric-caption">Slip variance</span>
                <div className="metric-val mono-val text-green">-0.35%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Packet Ingestion Terminal Bento Card */}
        <div className="dashboard-card ingestion-terminal-card bento-card bento-terminal-card">
          <div className="card-top-header">
            <div>
              <h2>Live packet ingestion</h2>
              <span className="card-subheading">Raw UDP telemetry stream from edge gateways</span>
            </div>
            <span className="status-indicator-badge live-mesh-badge">
              <span className="pulse-green-dot"></span> 100 Hz
            </span>
          </div>

          <div className="terminal-console-body">
            <div className="terminal-row">
              <span className="term-time mono-val">[10:48:12.401]</span>
              <span className="term-src text-cyan">GW-01:</span>
              <span className="term-msg">INGEST CNC-001 pktsz=64B crc=OK vib=1.24 temp=42.1</span>
            </div>
            <div className="terminal-row">
              <span className="term-time mono-val">[10:48:12.189]</span>
              <span className="term-src text-amber">GW-02:</span>
              <span className="term-msg">INGEST TURB-99 pktsz=64B crc=OK temp=68.4 status=WARN</span>
            </div>
            <div className="terminal-row">
              <span className="term-time mono-val">[10:48:11.954]</span>
              <span className="term-src text-cyan">GW-01:</span>
              <span className="term-msg">INGEST HYD-400 pktsz=48B crc=OK psi=220 flow=34.2</span>
            </div>
            <div className="terminal-row">
              <span className="term-time mono-val">[10:48:11.620]</span>
              <span className="term-src text-cyan">GW-03:</span>
              <span className="term-msg">INGEST PUMP-12 pktsz=64B crc=OK rpm=2840 load=72%</span>
            </div>
            <div className="terminal-row">
              <span className="term-time mono-val">[10:48:11.201]</span>
              <span className="term-src text-green">SYS:</span>
              <span className="term-msg">Heartbeat verified across 4 edge gateways · Sync locked</span>
            </div>
            <div className="terminal-row">
              <span className="term-time mono-val">[10:48:10.887]</span>
              <span className="term-src text-cyan">GW-01:</span>
              <span className="term-msg">INGEST CNC-001 pktsz=64B crc=OK vib=1.23 temp=42.0</span>
            </div>
            <div className="terminal-row">
              <span className="term-time mono-val">[10:48:10.512]</span>
              <span className="term-src text-amber">GW-02:</span>
              <span className="term-msg">INGEST TURB-99 pktsz=64B crc=OK temp=68.2 status=WARN</span>
            </div>
          </div>

          <div className="terminal-footer-status">
            <span className="term-stat-item">Buffer: <strong className="mono-val text-green">98% free</strong></span>
            <span className="term-stat-item">Dropped: <strong className="mono-val">0 pkts</strong></span>
            <span className="term-stat-item">Sync: <strong className="mono-val text-cyan">LOCKED</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMonitor;
