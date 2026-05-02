import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Settings.css';
import { User, Lock, Moon, Sun, Save } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // In a real app, this would toggle a global class on the body/html
    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <div className="settings-container">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and system configuration.</p>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-card-header">
            <User size={20} />
            <h2>Profile Information</h2>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={user?.username || ''} disabled />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="admin@crimeportal.gov.in" />
            </div>
            <button className="settings-btn"><Save size={16} /> Save Changes</button>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <Lock size={20} />
            <h2>Security</h2>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button className="settings-btn"><Save size={16} /> Update Password</button>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            <h2>Preferences</h2>
          </div>
          <div className="settings-form">
            <div className="preference-item">
              <div>
                <strong>Dark Mode</strong>
                <p>Toggle dark mode appearance for the dashboard.</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
