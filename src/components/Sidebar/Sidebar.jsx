import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <aside className={`sidebar-container ${isOpen ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <ShieldAlert className="brand-icon" size={28} />
        {isOpen && <span className="brand-text">CrimeAnalytics</span>}
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={20} />
          {isOpen && <span>Overview</span>}
        </NavLink>
        <NavLink to="/dashboard/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={20} />
          {isOpen && <span>Reports</span>}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/dashboard/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          {isOpen && <span>Settings</span>}
        </NavLink>
        <a href="#" onClick={handleLogout} className="nav-item text-danger">
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
