import './StateRankingWidgets.css';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StateRankingWidgets = ({ highest, lowest }) => {
  if (!highest || !lowest) return null;

  const formatNum = (num) => new Intl.NumberFormat('en-IN').format(num);

  return (
    <div className="ranking-widgets-container">
      <Card title="Top 5 Highest Crime States" className="ranking-card highest-crime">
        <ul className="ranking-list">
          {highest.map((item, index) => (
            <li key={item.state} className="ranking-item">
              <span className="rank-num">{index + 1}</span>
              <span className="state-name">{item.state}</span>
              <span className="crime-count text-danger">
                {formatNum(item.totalCrimes)} <TrendingUp size={14} />
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Top 5 Lowest Crime States" className="ranking-card lowest-crime">
        <ul className="ranking-list">
          {lowest.map((item, index) => (
            <li key={item.state} className="ranking-item">
              <span className="rank-num">{index + 1}</span>
              <span className="state-name">{item.state}</span>
              <span className="crime-count text-success">
                {formatNum(item.totalCrimes)} <TrendingDown size={14} />
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
