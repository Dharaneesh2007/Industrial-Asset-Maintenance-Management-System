import React from 'react';

const StatusDonut = ({ data = [] }) => {
  const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0) || 5;

  const cx = 100;
  const cy = 100;
  const outerRadius = 80;
  const innerRadius = 56;

  let accumulatedAngle = -Math.PI / 2;

  const slices = data.map((item) => {
    const value = Number(item.value) || 0;
    const fraction = total > 0 ? value / total : 0;
    const angle = fraction * 2 * Math.PI;

    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angle;
    accumulatedAngle = endAngle;

    if (fraction >= 0.9999) {
      return {
        ...item,
        path: `M ${cx} ${cy - outerRadius} A ${outerRadius} ${outerRadius} 0 1 1 ${cx - 0.01} ${cy - outerRadius} L ${cx - 0.01} ${cy - innerRadius} A ${innerRadius} ${innerRadius} 0 1 0 ${cx} ${cy - innerRadius} Z`,
      };
    }

    if (fraction <= 0) {
      return { ...item, path: '' };
    }

    const x1 = cx + outerRadius * Math.cos(startAngle);
    const y1 = cy + outerRadius * Math.sin(startAngle);
    const x2 = cx + outerRadius * Math.cos(endAngle);
    const y2 = cy + outerRadius * Math.sin(endAngle);

    const x3 = cx + innerRadius * Math.cos(endAngle);
    const y3 = cy + innerRadius * Math.sin(endAngle);
    const x4 = cx + innerRadius * Math.cos(startAngle);
    const y4 = cy + innerRadius * Math.sin(startAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');

    return {
      ...item,
      path,
    };
  });

  const activeItem = data.find(d => d.label === 'ACTIVE') || { value: 1 };
  const maintItem = data.find(d => d.label === 'UNDER_MAINTENANCE') || { value: 0 };
  const decommItem = data.find(d => d.label === 'DECOMMISSIONED') || { value: 4 };

  const activeVal = Number(activeItem.value) || 0;
  const maintVal = Number(maintItem.value) || 0;
  const decommVal = Number(decommItem.value) || 0;

  const activePct = total > 0 ? Math.round((activeVal / total) * 100) : 20;
  const maintPct = total > 0 ? Math.round((maintVal / total) * 100) : 0;
  const decommPct = total > 0 ? Math.round((decommVal / total) * 100) : 80;

  return (
    <div className="status-donut-container scada-donut-layout">
      <div className="donut-center-graphic">
        <div className="donut-graphic-wrapper">
          <svg
            viewBox="0 0 200 200"
            className="donut-svg glowing-donut"
            width="170"
            height="170"
            aria-label="Asset Status Distribution Donut Chart"
          >
            <defs>
              <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {total === 0 ? (
              <circle
                cx={cx}
                cy={cy}
                r={(outerRadius + innerRadius) / 2}
                fill="transparent"
                stroke="#232A36"
                strokeWidth={outerRadius - innerRadius}
              />
            ) : (
              slices.map((slice, index) =>
                slice.path ? (
                  <path
                    key={slice.label || index}
                    d={slice.path}
                    fill={slice.color}
                    stroke="#0A0E14"
                    strokeWidth="2"
                    className="donut-slice"
                  />
                ) : null
              )
            )}
            <circle cx={cx} cy={cy} r={innerRadius - 2} fill="#0A0E14" />
            <text x={cx} y={cy - 2} textAnchor="middle" fill="#FFFFFF" fontSize="26" fontWeight="700" className="mono-val">
              {total}
            </text>
            <text x={cx} y={cy + 16} textAnchor="middle" fill="#7C8896" fontSize="9" fontWeight="600" letterSpacing="0.08em">
              Total assets
            </text>
          </svg>
        </div>
      </div>

      {/* 3 Status Readout Pillars */}
      <div className="scada-donut-legend-grid">
        <div className="donut-legend-box active-box">
          <div className="legend-box-top">
            <span className="legend-bullet green">•</span>
            <span className="legend-name">Active</span>
          </div>
          <span className="legend-main-val mono-val">{activeVal}</span>
          <span className="legend-sub-pct mono-val">{activePct}% fleet</span>
        </div>

        <div className="donut-legend-box maint-box">
          <div className="legend-box-top">
            <span className="legend-bullet amber">•</span>
            <span className="legend-name">Under maintenance</span>
          </div>
          <span className="legend-main-val mono-val">{maintVal}</span>
          <span className="legend-sub-pct mono-val">{maintPct}% idle</span>
        </div>

        <div className="donut-legend-box decomm-box">
          <div className="legend-box-top">
            <span className="legend-bullet red">•</span>
            <span className="legend-name">Decommissioned</span>
          </div>
          <span className="legend-main-val mono-val">{decommVal}</span>
          <span className="legend-sub-pct mono-val">{decommPct}% stored</span>
        </div>
      </div>

      {/* Facility Sub-Units */}
      <div className="facility-subunits-panel">
        <div className="subunits-header">
          <span className="subunits-title">Facility sub-units</span>
        </div>
        <div className="subunit-item">
          <div className="subunit-row">
            <span className="subunit-name">Turbine Generation Array (Site A)</span>
            <span className="subunit-val text-green mono-val">98.4% Normal</span>
          </div>
          <div className="subunit-track">
            <div className="subunit-fill green" style={{ width: '98.4%' }}></div>
          </div>
        </div>

        <div className="subunit-item">
          <div className="subunit-row">
            <span className="subunit-name">Primary Cooler & Exhaust Tower</span>
            <span className="subunit-val text-amber mono-val">67.0% Warning</span>
          </div>
          <div className="subunit-track">
            <div className="subunit-fill amber" style={{ width: '67%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDonut;
