import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar" id="sidebar">
      <div className="logo-area">
        <div className="logo-icon">
          <i className="bi bi-journal-bookmark-fill" style={{ fontSize: 20, color: 'white' }}></i>
        </div>
        <div>
          <div className="logo-text">PaperVault</div>
          <div className="logo-sub">PREMIUM REPOSITORY</div>
        </div>
      </div>

      <div id="sidebarNav">
        <div className="nav-label">Main</div>
        <NavLink className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')} to="/dashboard">
          <i className="bi bi-grid-fill"></i> Dashboard
        </NavLink>
        <NavLink className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')} to="/upload">
          <i className="bi bi-cloud-arrow-up-fill"></i> Upload Paper
        </NavLink>

        <div className="nav-label">Library</div>
        <NavLink className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')} to="/bookmarks">
          <i className="bi bi-bookmark-heart-fill"></i> Saved
        </NavLink>
        <NavLink className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')} to="/downloads">
          <i className="bi bi-cloud-download-fill"></i> Downloads
        </NavLink>
        <NavLink className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')} to="/history">
          <i className="bi bi-clock-history"></i> View History
        </NavLink>

        <div className="nav-label">Account</div>
        <NavLink className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')} to="/profile">
          <i className="bi bi-person-badge-fill"></i> Profile
        </NavLink>
        <NavLink className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')} to="/settings">
          <i className="bi bi-gear-fill"></i> Settings
        </NavLink>

        {isAdmin && (
          <>
            <div className="nav-label">Admin</div>
            <NavLink className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')} to="/admin">
              <i className="bi bi-speedometer2"></i> Admin Panel
            </NavLink>
            <NavLink className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')} to="/admin/approvals">
              <i className="bi bi-check2-circle"></i> Approvals
            </NavLink>
            <NavLink className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')} to="/admin/users">
              <i className="bi bi-people-fill"></i> Users
            </NavLink>
          </>
        )}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i> Sign Out
      </button>
    </div>
  );
}
