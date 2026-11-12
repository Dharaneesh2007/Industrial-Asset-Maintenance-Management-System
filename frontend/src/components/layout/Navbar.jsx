import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Navbar = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { items: assets, totalElements } = useSelector((state) => state.assets);
  const { schedules } = useSelector((state) => state.maintenance);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const canAccessReports = user.role === 'ASSET_MANAGER' || user.role === 'SYSTEM_ADMIN';
  const assetCount = totalElements !== undefined && totalElements !== 0 ? totalElements : (assets?.length || 0);
  const maintCount = schedules ? schedules.filter((s) => !s.status || s.status === 'PENDING').length : 0;
  const userInitial = user.username ? user.username.charAt(0).toUpperCase() : 'U';
  const formattedRole = user.role ? user.role.replace(/_/g, ' ') : 'SYSTEM ADMIN';

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link to="/" className="sidebar-brand-link">
            <div className="brand-logo-row">
              <div className="brand-icon-box">
                <svg
                  className="signal-glyph"
                  width="18"
                  height="18"
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
              <span className="brand-title">AssetArc</span>
            </div>
            <span className="version-tag">TELEMETRY OPS V2.8</span>
          </Link>
        </div>

        <nav className="sidebar-nav" role="navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Home</span>
          </NavLink>

          <NavLink to="/assets" className={({ isActive }) => (isActive ? 'active' : '')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>Assets</span>
            <span className="nav-badge">{assetCount}</span>
          </NavLink>

          <NavLink to="/maintenance" className={({ isActive }) => (isActive ? 'active' : '')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span>Maintenance</span>
            <span className="nav-badge">{maintCount}</span>
          </NavLink>

          <NavLink to="/health" className={({ isActive }) => (isActive ? 'active' : '')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span>Health</span>
          </NavLink>

          {canAccessReports && (
            <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Reports</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="mesh-status">
            <span className="mesh-dot-pulse"></span>
            <span>Mesh Online · 12ms</span>
          </div>
          <div className="role-tag role-tag-mono">[ {formattedRole} ]</div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-right">
            <div className="user-profile-badge">
              <div className="user-avatar-circle">{userInitial}</div>
              <span className="user-greeting">Welcome, {user.username}</span>
            </div>

            <button onClick={handleLogout} className="logout-btn" title="Logout session">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {children ? (
          <main className="page-content">{children}</main>
        ) : null}
      </div>
    </>
  );
};

export default Navbar;
