import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedules } from '../../store/slices/maintenanceSlice';
import { fetchAssets } from '../../store/slices/assetSlice';
import ScheduleMaintenanceModal from './ScheduleMaintenanceModal';
import LogMaintenanceModal from './LogMaintenanceModal';
import AssetDetailsModal from '../asset/AssetDetailsModal';
import EmptyState from '../common/EmptyState';

const MaintenanceScheduler = () => {
  const dispatch = useDispatch();
  const { schedules, loading, error } = useSelector((state) => state.maintenance);
  const { items: assets } = useSelector((state) => state.assets);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isAssetDetailsOpen, setIsAssetDetailsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSchedules());
    dispatch(fetchAssets({ page: 0, size: 100 }));
  }, [dispatch]);

  const canSchedule = true; // All authenticated users can schedule tasks
  const isTechnician = user?.role === 'MAINTENANCE_TECHNICIAN';

  const handleOpenComplete = (task) => {
    setSelectedTask(task);
    setIsLogModalOpen(true);
  };

  const handleViewAssetDetails = (task) => {
    const asset =
      task.asset ||
      assets.find((a) => a.id === task.assetId || a.assetTag === task.assetTag) || {
        assetTag: task.assetTag || 'Unknown',
        name: task.assetName || task.assetTag || 'Asset',
        currentStatus: 'ACTIVE',
        currentHealth: 100,
      };
    setSelectedAsset(asset);
    setIsAssetDetailsOpen(true);
  };

  const [statusFilter, setStatusFilter] = useState('ALL');

  const scheduleList = schedules || [];
  const pendingSchedules = scheduleList.filter((s) => !s.status || s.status === 'PENDING');
  const activeCount = pendingSchedules.length;
  const criticalCount = pendingSchedules.filter((s) => (s.priority || '').toUpperCase() === 'CRITICAL').length;
  const nextPlannedDate = pendingSchedules.length > 0 ? (pendingSchedules[0].plannedDate || 'Upcoming') : 'None';
  const pendingApprovalsCount = 0;

  const filteredSchedules = scheduleList.filter((s) => {
    const tag = (s.asset?.assetTag || s.assetTag || '').toLowerCase();
    const type = (s.maintenanceType || s.type || '').toLowerCase();
    const matchesSearch = !searchTerm || tag.includes(searchTerm.toLowerCase()) || type.includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || (s.priority || '').toUpperCase() === priorityFilter;
    const taskStatus = s.status || 'PENDING';
    const matchesStatus = statusFilter === 'ALL' || taskStatus === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="page-container maintenance-page bento-maint-page">
      <div className="page-header bento-header-bar">
        <div>
          <div className="scada-mesh-badge">
            <span className="pulse-cyan-dot"></span> Dispatch & interventions
          </div>
          <h1>Maintenance Schedule</h1>
          <p className="page-subtitle">Preventative and corrective interventions tracking across all active equipment.</p>
        </div>
        {canSchedule && (
          <button
            className="add-btn primary-btn"
            onClick={() => setIsScheduleModalOpen(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Schedule Task
          </button>
        )}
      </div>

      {/* Top 4 Bento Stat Cards with bottom accent borders */}
      <div className="maintenance-stat-grid bento-maint-grid">
        <div className="maint-accent-card bento-card bento-accent-card cyan-border">
          <div className="card-label">Active tasks</div>
          <div className="card-val mono-val">{activeCount}</div>
          <div className="card-sub">Under active service</div>
          <div className="accent-bar cyan"></div>
        </div>
        <div className="maint-accent-card bento-card bento-accent-card amber-border">
          <div className="card-label">Critical priority</div>
          <div className="card-val mono-val text-amber">{criticalCount}</div>
          <div className="card-sub">{criticalCount === 0 ? 'Zero pending criticals' : 'Immediate attention required'}</div>
          <div className="accent-bar amber"></div>
        </div>
        <div className="maint-accent-card bento-card bento-accent-card green-border">
          <div className="card-label">Next planned</div>
          <div className="card-val mono-val text-green text-sm-val">{nextPlannedDate}</div>
          <div className="card-sub">{nextPlannedDate === 'None' ? 'All systems nominal' : 'Next scheduled window'}</div>
          <div className="accent-bar green"></div>
        </div>
        <div className="maint-accent-card bento-card bento-accent-card purple-border">
          <div className="card-label">Pending approvals</div>
          <div className="card-val mono-val">{pendingApprovalsCount}</div>
          <div className="card-sub">Standard workflow</div>
          <div className="accent-bar purple"></div>
        </div>
      </div>

      {/* Interventions Queue Section Bento Card */}
      <div className="dashboard-card queue-card bento-card bento-queue-card">
        <div className="queue-header-bar">
          <div className="queue-title-group">
            <span className="queue-title">Scheduled interventions queue</span>
            <span className="queue-count-pill mono-val">{filteredSchedules.length} tasks</span>
          </div>
          <div className="header-action-group">
            <select
              className="queue-search-input queue-filter-select"
              style={{ background: '#0a0d13', border: '1px solid var(--border-hairline)', borderRadius: '6px', padding: '6px 10px', color: '#e8ecf1' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending only</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <select
              className="queue-search-input queue-filter-select"
              style={{ background: '#0a0d13', border: '1px solid var(--border-hairline)', borderRadius: '6px', padding: '6px 10px', color: '#e8ecf1' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <div className="queue-search-box bento-search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C8896" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                placeholder="Search tasks by asset tag or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="queue-search-input"
              />
            </div>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading loading-state" data-testid="loader">
            Loading schedules...
          </div>
        ) : filteredSchedules.length === 0 ? (
          <EmptyState
            message="No maintenance tasks found for the current filters"
            ctaText={canSchedule ? 'Schedule Task' : undefined}
            onCtaClick={canSchedule ? () => setIsScheduleModalOpen(true) : undefined}
          />
        ) : (
          <div className="table-responsive bento-table-wrap">
            <table className="data-table scada-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Planned date</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule, idx) => {
                  const tag = schedule.asset?.assetTag || schedule.assetTag || 'N/A';
                  const priority = schedule.priority || 'MEDIUM';
                  const rowKey = schedule.id ? `sched-${schedule.id}` : `sched-idx-${idx}`;
                  const isCompleted = schedule.status === 'COMPLETED';
                  const isCancelled = schedule.status === 'CANCELLED';

                  return (
                    <tr key={rowKey}>
                      <td>
                        <span className="asset-tag-badge mono-val">{tag}</span>
                      </td>
                      <td>
                        <span className="category-tag">{schedule.maintenanceType || schedule.type}</span>
                      </td>
                      <td className="mono-val date-val">{schedule.plannedDate}</td>
                      <td>
                        <span className={`priority-badge-cyber ${priority.toLowerCase()}`}>
                          <span className="badge-dot">●</span> {priority}
                        </span>
                      </td>
                      <td className="actions-cell">
                        {isCompleted ? (
                          <span
                            className="status-badge-completed mono-val"
                            style={{
                              color: '#10b981',
                              background: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid rgba(16, 185, 129, 0.35)',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              display: 'inline-block',
                            }}
                          >
                            ✓ COMPLETED
                          </span>
                        ) : isCancelled ? (
                          <span
                            className="status-badge-cancelled mono-val"
                            style={{
                              color: '#9ca3af',
                              background: 'rgba(156, 163, 175, 0.15)',
                              border: '1px solid rgba(156, 163, 175, 0.35)',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              display: 'inline-block',
                            }}
                          >
                            CANCELLED
                          </span>
                        ) : isTechnician ? (
                          <button
                            className="complete-btn"
                            onClick={() => handleOpenComplete(schedule)}
                          >
                            Complete Task
                          </button>
                        ) : (
                          <button
                            className="view-btn"
                            onClick={() => handleViewAssetDetails(schedule)}
                          >
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ScheduleMaintenanceModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      <LogMaintenanceModal
        isOpen={isLogModalOpen}
        task={selectedTask}
        onClose={() => {
          setIsLogModalOpen(false);
          setSelectedTask(null);
        }}
      />

      <AssetDetailsModal
        isOpen={isAssetDetailsOpen}
        asset={selectedAsset}
        onClose={() => {
          setIsAssetDetailsOpen(false);
          setSelectedAsset(null);
        }}
      />
    </div>
  );
};

export default MaintenanceScheduler;
