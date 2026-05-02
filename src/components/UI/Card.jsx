import './Card.css';

export const Card = ({ children, title, className = '', noPadding = false }) => {
  return (
    <div className={`card ${className}`}>
      {title && <div className="card-header"><h3 className="card-title">{title}</h3></div>}
      <div className={`card-content ${noPadding ? 'no-padding' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export const StatWidget = ({ title, value, icon: Icon, trend, trendValue }) => {
  const isPositiveTrend = trend === 'up';
  
  return (
    <Card className="stat-widget">
      <div className="stat-header">
        <h4 className="stat-title">{title}</h4>
        {Icon && <div className="stat-icon-wrapper"><Icon size={20} className="stat-icon" /></div>}
      </div>
      <div className="stat-body">
        <span className="stat-value">{value}</span>
      </div>
      {trendValue && (
        <div className={`stat-footer ${isPositiveTrend ? 'trend-up' : 'trend-down'}`}>
          <span className="trend-indicator">{isPositiveTrend ? '↑' : '↓'}</span>
          <span className="trend-text">{trendValue}</span>
        </div>
      )}
    </Card>
  );
};
