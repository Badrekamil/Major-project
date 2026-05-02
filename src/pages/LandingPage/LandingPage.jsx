import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, BarChart2, Map, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="nav-logo">
          <Shield size={28} className="logo-icon" />
          <span>CrimeAnalytics</span>
        </div>
        <div className="nav-actions">
          {user ? (
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="landing-main">
        <div className="hero-section">
          <h1>National Crime Data Intelligence</h1>
          <p>
            An advanced, government-grade analytics platform designed to monitor, 
            visualize, and predict state-wise security trends across the country.
          </p>
          <div className="hero-actions">
            {user ? (
              <button className="btn-large" onClick={() => navigate('/dashboard')}>
                Access Dashboard <ArrowRight size={20} />
              </button>
            ) : (
              <button className="btn-large" onClick={() => navigate('/login')}>
                Get Started Securely <Lock size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Map size={24} /></div>
            <h3>Choropleth Mapping</h3>
            <p>Interactive geographic visualization showing regional intensity and distribution of incidents.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><BarChart2 size={24} /></div>
            <h3>Historical Analytics</h3>
            <p>Compare state metrics and identify multi-year trends with real-time dynamic rendering.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Shield size={24} /></div>
            <h3>Secure Platform</h3>
            <p>Protected API endpoints with JWT authentication and granular role-based access control.</p>
          </div>
        </div>
      </main>
      
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} National Crime Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
