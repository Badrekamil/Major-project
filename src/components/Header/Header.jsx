import { useState, useEffect } from 'react';
import { Menu, Search, Bell, UserCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputValue) {
        setSearchParams(params => {
          params.set('search', inputValue);
          return params;
        });
      } else {
        setSearchParams(params => {
          params.delete('search');
          return params;
        });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, setSearchParams]);
  
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="icon-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          <Menu size={24} />
        </button>
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search state (e.g. Uttar Pradesh)..." 
            className="search-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>
      
      <div className="header-right">
        <button className="icon-btn notification-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        <div className="user-profile">
          <UserCircle size={28} className="user-avatar" />
          <div className="user-info">
            <span className="user-name">{user?.username || 'Guest'}</span>
            <span className="user-role">System Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
