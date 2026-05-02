import { Link } from 'react-router-dom';
import { Shield, Activity, Map as MapIcon, BarChart3, Lock } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container header-container">
          <div className="brand">
            <Shield className="brand-icon" size={32} />
            <span className="brand-text">National Crime Analytics</span>
          </div>
          <nav className="landing-nav">
            <Link to="/dashboard" className="btn btn-primary">
              <Lock size={16} /> Secure Login
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-container">
            <div className="hero-content">
              <span className="badge-gov">Government Authorized Portal</span>
              <h1 className="hero-title">Data-Driven Security Intelligence</h1>
              <p className="hero-subtitle">
                Advanced analytics platform providing state-wise insights, geospatial crime mapping, and historical trend analysis for law enforcement agencies across India.
              </p>
              <div className="hero-actions">
                <Link to="/dashboard" className="btn btn-primary btn-lg">Access Dashboard</Link>
                <button className="btn btn-secondary btn-lg">Request Authorization</button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="glass-card mockup">
                <div className="mockup-header">
                  <div className="dots"><span></span><span></span><span></span></div>
                </div>
                <div className="mockup-body">
                  <div className="mockup-chart">
                    <div className="bar" style={{height: '60%'}}></div>
                    <div className="bar" style={{height: '80%'}}></div>
                    <div className="bar" style={{height: '40%'}}></div>
                    <div className="bar" style={{height: '100%'}}></div>
                    <div className="bar" style={{height: '70%'}}></div>
                  </div>
                  <div className="mockup-stats">
                    <div className="m-stat"></div>
                    <div className="m-stat"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features bg-surface">
          <div className="container">
            <div className="section-header text-center">
              <h2>Core Capabilities</h2>
              <p className="text-muted">Comprehensive tools for comprehensive analysis</p>
            </div>
            
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper"><MapIcon size={24} /></div>
                <h3>Choropleth Mapping</h3>
                <p>Visualize crime intensity across all Indian states and Union Territories with interactive heatmaps.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon-wrapper"><Activity size={24} /></div>
                <h3>Trend Analysis</h3>
                <p>Track historical crime data from 2015-2023 to identify patterns and forecast potential hotspots.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrapper"><BarChart3 size={24} /></div>
                <h3>Category Distribution</h3>
                <p>Break down incidents by category including theft, assault, cybercrime, and fraud for targeted action.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container footer-container">
          <div className="footer-brand">
            <Shield size={20} className="text-muted" />
            <span className="text-muted text-sm">© 2026 National Crime Records Bureau Data Analytics.</span>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
