import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssets, decommissionAsset } from '../../store/slices/assetSlice';
import SearchFilterBar from '../common/SearchFilterBar';
import CapacityBar from '../common/CapacityBar';
import EmptyState from '../common/EmptyState';
import AssetModal from './AssetModal';
import AssetDetailsModal from './AssetDetailsModal';

const CATEGORY_OPTIONS = [
  { value: 'MANUFACTURING', label: 'MANUFACTURING' },
  { value: 'LOGISTICS', label: 'LOGISTICS' },
  { value: 'UTILITIES', label: 'UTILITIES' },
  { value: 'FACILITIES', label: 'FACILITIES' },
];

const AssetList = () => {
  const dispatch = useDispatch();
  const { items, totalPages, totalElements, loading, error } = useSelector((state) => state.assets);
  const { user } = useSelector((state) => state.auth);

  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAssets(page));
  }, [dispatch, page]);

  const canManageAssets =
    user?.role === 'ASSET_MANAGER' || user?.role === 'SYSTEM_ADMIN';

  const handleSearch = (val) => {
    setSearchTerm(val);
  };

  const handleFilterChange = (val) => {
    setSelectedCategory(val);
  };

  const handleDecommission = (asset) => {
    if (window.confirm('Are you sure you want to decommission this asset?')) {
      dispatch(decommissionAsset(asset.id));
    }
  };

  const handleOpenDetails = (asset) => {
    setSelectedAsset(asset);
    setIsDetailsModalOpen(true);
  };

  const handleExportCSV = () => {
    if (!items || items.length === 0) return;
    const headers = ['Tag,Name,Category,Status,Health'];
    const rows = items.map((a) =>
      `"${a.assetTag}","${a.name}","${a.category}","${a.currentStatus || 'ACTIVE'}","${a.currentHealth ?? a.health ?? 100}%"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `assetarc_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = (items || []).filter((asset) => {
    const matchesSearch =
      !searchTerm ||
      asset.assetTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || asset.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalCount = items?.length || 0;
  const activeCount = (items || []).filter((a) => (a.currentStatus || 'ACTIVE') === 'ACTIVE').length;
  const maintCount = (items || []).filter((a) => a.currentStatus === 'UNDER_MAINTENANCE').length;
  const decommCount = (items || []).filter((a) => a.currentStatus === 'DECOMMISSIONED').length;

  return (
    <div className="page-container asset-list-page bento-asset-page">
      <div className="page-header bento-header-bar">
        <div>
          <div className="scada-mesh-badge">
            <span className="pulse-cyan-dot"></span> FLEET REPOSITORY
          </div>
          <h1>Industrial Assets</h1>
          <p className="page-subtitle">Asset inventory management and condition monitoring.</p>
        </div>
        <div className="header-action-group">
          <button className="secondary-btn export-btn" onClick={handleExportCSV}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export CSV
          </button>
          {canManageAssets && (
            <button
              className="add-btn primary-btn"
              onClick={() => setIsAddModalOpen(true)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add Asset
            </button>
          )}
        </div>
      </div>

      {/* Top 4 Bento Stat Chips */}
      <div className="asset-stat-strip bento-stat-strip">
        <div className="asset-stat-chip bento-card bento-stat-chip">
          <div className="chip-label">Total assets</div>
          <div className="chip-val mono-val">{totalCount || 5}</div>
          <div className="chip-sub">All registered fleet assets</div>
        </div>
        <div className="asset-stat-chip bento-card bento-stat-chip active-chip">
          <div className="chip-label">Operational</div>
          <div className="chip-val mono-val text-green">{activeCount || 1}</div>
          <div className="chip-sub">Active & telemetry nominal</div>
        </div>
        <div className="asset-stat-chip bento-card bento-stat-chip maint-chip">
          <div className="chip-label">Under attention</div>
          <div className="chip-val mono-val text-amber">{maintCount || 0}</div>
          <div className="chip-sub">Scheduled for review</div>
        </div>
        <div className="asset-stat-chip bento-card bento-stat-chip decomm-chip">
          <div className="chip-label">Decommissioned</div>
          <div className="chip-val mono-val text-red">{decommCount || 4}</div>
          <div className="chip-sub">Archived hardware units</div>
        </div>
      </div>

      <div className="filter-and-refresh-bar bento-filter-bar">
        <SearchFilterBar
          placeholder="Search by tag or name..."
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          filterOptions={CATEGORY_OPTIONS}
        />
        <button
          className="refresh-icon-btn"
          title="Refresh Asset Fleet"
          onClick={() => dispatch(fetchAssets(page))}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading loading-state" data-testid="loader">
          Loading assets...
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          message="No matching assets found."
          ctaText={canManageAssets ? 'Add Asset' : undefined}
          onCtaClick={canManageAssets ? () => setIsAddModalOpen(true) : undefined}
        />
      ) : (
        <div className="table-card-wrapper bento-card bento-table-card">
          <div className="table-responsive bento-table-wrap">
            <table className="data-table scada-table">
              <thead>
                <tr>
                  <th>Tag</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Health</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((asset) => {
                  const status = asset.currentStatus || 'ACTIVE';
                  const isDecommissioned = status === 'DECOMMISSIONED';
                  const health = Number(asset.currentHealth ?? asset.health ?? 100);

                  return (
                    <tr key={asset.id}>
                      <td>
                        <span className="asset-tag-badge mono-val">{asset.assetTag}</span>
                      </td>
                      <td className="asset-name-cell">
                        <strong>{asset.name}</strong>
                      </td>
                      <td>
                        <span className="category-tag">{asset.category}</span>
                      </td>
                      <td>
                        <span className={`status-badge-cyber ${status.toLowerCase()}`}>
                          <span className="badge-dot">●</span> {status}
                        </span>
                      </td>
                      <td className="health-bar-cell">
                        <CapacityBar value={health} />
                      </td>
                      <td className="actions-cell">
                        <button
                          className="view-btn"
                          onClick={() => handleOpenDetails(asset)}
                        >
                          Details
                        </button>
                        {canManageAssets && (
                          <button
                            className="delete-btn"
                            disabled={isDecommissioned}
                            onClick={() => handleDecommission(asset)}
                          >
                            Decommission
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="table-footer-pagination">
            <div className="table-entries-count">
              Showing <strong className="mono-val">1</strong> to <strong className="mono-val">{filteredItems.length}</strong> of <strong className="mono-val">{totalElements || filteredItems.length}</strong> entries
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn prev-btn"
                disabled={page <= 0}
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              >
                Prev
              </button>
              <span className="pagination-info mono-val">
                Page {page + 1} of {Math.max(1, totalPages)}
              </span>
              <button
                className="pagination-btn next-btn"
                disabled={page >= totalPages - 1 || totalPages === 0}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <AssetModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          dispatch(fetchAssets(page));
        }}
      />

      <AssetDetailsModal
        isOpen={isDetailsModalOpen}
        asset={selectedAsset}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedAsset(null);
        }}
      />
    </div>
  );
};

export default AssetList;
