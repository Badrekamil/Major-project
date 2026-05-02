import { useState, useEffect } from 'react';
import { fetchFullDataset } from '../../services/api';
import './Reports.css';
import { Download, Search } from 'lucide-react';

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [stateFilter, setStateFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');

  const STATES = [
    "A & N Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", 
    "D & N Haveli", "Daman & Diu", "Delhi UT", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", 
    "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", 
    "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const YEARS = Array.from({length: 12}, (_, i) => 2001 + i);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: 20,
          state: stateFilter === 'All' ? undefined : stateFilter,
          startYear: yearFilter === 'All' ? undefined : yearFilter,
          endYear: yearFilter === 'All' ? undefined : yearFilter
        };
        const res = await fetchFullDataset(params);
        setData(res.data);
        setTotalPages(res.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    // Implement debounce for search logic if it was calling API, 
    // but here we filter by State/Year via API, and we'll apply text search locally on the fetched page.
    loadData();
  }, [page, stateFilter, yearFilter]);

  const handleExport = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).filter(k => k !== '_id' && k !== '__v');
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => row[h]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `crime_reports_page_${page}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = data.filter(row => 
    row.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="reports-container">
      <div className="page-header">
        <h1 className="page-title">Detailed Reports</h1>
        <p className="page-subtitle">View, search, and export specific incident records.</p>
      </div>

      <div className="reports-controls">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by state..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select value={stateFilter} onChange={e => { setStateFilter(e.target.value); setPage(1); }}>
          <option value="All">All States</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={yearFilter} onChange={e => { setYearFilter(e.target.value); setPage(1); }}>
          <option value="All">All Years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <button onClick={handleExport} className="export-btn">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loading-state"><div className="spinner"></div></div>
        ) : (
          <table className="reports-table">
            <thead>
              <tr>
                <th>State</th>
                <th>Year</th>
                <th>Total Crimes</th>
                <th>Murder</th>
                <th>Rape</th>
                <th>Theft</th>
                <th>Robbery</th>
                <th>Kidnapping</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(row => (
                <tr key={row._id}>
                  <td>{row.state}</td>
                  <td>{row.year}</td>
                  <td className="font-semibold">{row.totalCrimes}</td>
                  <td>{row.murder}</td>
                  <td>{row.rape}</td>
                  <td>{row.theft}</td>
                  <td>{row.robbery}</td>
                  <td>{row.kidnapping}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Reports;
