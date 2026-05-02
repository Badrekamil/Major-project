import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../../components/Filters/FilterBar';
import { Card, StatWidget } from '../../components/UI/Card';
import { StateRankingWidgets } from '../../components/UI/StateRankingWidgets';
import ChoroplethMap from '../../components/Map/ChoroplethMap';
import { CrimeTrendChart, StateComparisonChart, CategoryPieChart } from '../../components/Charts/Charts';
import { AlertOctagon, CheckCircle, Shield, TrendingUp } from 'lucide-react';
import { 
  fetchStatesSummary, 
  fetchYearlyTrends, 
  fetchCrimeTypes, 
  fetchTopStates 
} from '../../services/api';
import './DashboardOverview.css';

const DashboardOverview = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const [selectedState, setSelectedState] = useState('All');
  const [compareState, setCompareState] = useState('All');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [yearRange, setYearRange] = useState([2001, 2012]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [summaryData, setSummaryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [rankingData, setRankingData] = useState({ highest: [], lowest: [] });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          startYear: yearRange[0],
          endYear: yearRange[1],
          state: selectedState,
          state2: isCompareMode ? compareState : undefined,
          search: searchQuery || undefined
        };

        const [summary, trends, types, topStates] = await Promise.all([
          fetchStatesSummary(params),
          fetchYearlyTrends(params),
          fetchCrimeTypes(params),
          fetchTopStates({ startYear: yearRange[0], endYear: yearRange[1] })
        ]);

        console.log('Search Results - Summary Data:', summary); // Debug log

        setSummaryData(summary);
        setTrendData(trends);
        setCategoryData(types);
        setRankingData(topStates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedState, compareState, isCompareMode, yearRange, searchQuery]);

  // Handle case where compare mode is toggled off
  useEffect(() => {
    if (!isCompareMode) setCompareState('All');
  }, [isCompareMode]);

  // Compute KPIs
  const totalCrimes = summaryData.reduce((acc, curr) => acc + curr.totalCrimes, 0);
  const totalMurder = summaryData.reduce((acc, curr) => acc + curr.murder, 0);
  const totalTheft = summaryData.reduce((acc, curr) => acc + curr.theft, 0);
  
  // Highest crime state for KPI widget
  const highestCrimeState = rankingData.highest.length > 0 ? rankingData.highest[0].state : 'N/A';

  return (
    <div className="dashboard-overview">
      <div className="page-header">
        <h1 className="page-title">National Crime Overview</h1>
        <p className="page-subtitle">Interactive analysis of recorded incidents across India.</p>
      </div>

      <FilterBar 
        selectedState={selectedState} 
        setSelectedState={setSelectedState}
        compareState={compareState}
        setCompareState={setCompareState}
        isCompareMode={isCompareMode}
        setIsCompareMode={setIsCompareMode}
        yearRange={yearRange}
        setYearRange={setYearRange}
      />

      {error && <div className="error-banner">Error loading data: {error}</div>}

      <div className="kpi-grid">
        <StatWidget 
          title={isCompareMode ? "Total Crimes (Selected)" : "Total Recorded Incidents"} 
          value={loading ? "..." : totalCrimes.toLocaleString('en-IN')} 
          icon={AlertOctagon} 
          trend="up" 
        />
        <StatWidget 
          title="Total Thefts" 
          value={loading ? "..." : totalTheft.toLocaleString('en-IN')} 
          icon={CheckCircle} 
        />
        <StatWidget 
          title="Total Murders" 
          value={loading ? "..." : totalMurder.toLocaleString('en-IN')} 
          icon={Shield} 
        />
        <StatWidget 
          title={selectedState === 'All' ? "Highest Crime State" : "Selected State"} 
          value={loading ? "..." : (selectedState === 'All' ? highestCrimeState : selectedState)} 
          icon={TrendingUp} 
        />
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Processing Dataset...</p>
        </div>
      ) : summaryData.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
          <h3>No results found</h3>
          <p>We couldn't find any crime data matching your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="charts-grid-main">
            <div className="map-section">
              <Card title="Crime Intensity Heatmap (Choropleth)" noPadding>
                <ChoroplethMap data={summaryData} startYear={yearRange[0]} endYear={yearRange[1]} />
              </Card>
            </div>
            <div className="pie-section">
              <Card title={isCompareMode ? "Combined Category Distribution" : "Crime Category Distribution"}>
                <CategoryPieChart data={categoryData} />
              </Card>
            </div>
          </div>

          <div className="charts-grid-secondary">
            <Card title={isCompareMode ? `Crime Trends: ${selectedState} vs ${compareState}` : "Yearly Crime Trends"}>
              <CrimeTrendChart 
                data={trendData} 
                isCompareMode={isCompareMode && compareState !== 'All'} 
                state1={selectedState}
                state2={compareState}
              />
            </Card>
            <Card title={isCompareMode || selectedState !== 'All' ? "State-wise Metrics" : "State-wise Comparison (Top 10)"}>
              <StateComparisonChart data={summaryData} />
            </Card>
          </div>

          {selectedState === 'All' && !isCompareMode && (
            <StateRankingWidgets highest={rankingData.highest} lowest={rankingData.lowest} />
          )}
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
