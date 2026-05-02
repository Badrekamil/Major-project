import { useState } from 'react';
import { Filter, SlidersHorizontal, ArrowRightLeft } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './FilterBar.css';

const STATES = [
  "A & N Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", 
  "D & N Haveli", "Daman & Diu", "Delhi UT", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", 
  "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", 
  "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const FilterBar = ({ 
  selectedState, setSelectedState, 
  compareState, setCompareState, isCompareMode, setIsCompareMode,
  yearRange, setYearRange 
}) => {
  
  const handleSliderChange = (value) => {
    setYearRange(value);
  };

  return (
    <div className="filter-bar">
      <div className="filter-title">
        <Filter size={18} />
        <span>Data Controls</span>
      </div>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label>Primary State / UT</label>
          <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="filter-select">
            <option value="All">National Overview (All India)</option>
            {STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="filter-group compare-toggle-group">
          <button 
            className={`compare-toggle-btn ${isCompareMode ? 'active' : ''}`}
            onClick={() => setIsCompareMode(!isCompareMode)}
            disabled={selectedState === 'All'}
            title={selectedState === 'All' ? "Select a primary state first to compare" : "Toggle Comparison Mode"}
          >
            <ArrowRightLeft size={14} /> Compare
          </button>
        </div>

        {isCompareMode && (
          <div className="filter-group slide-in">
            <label>Compare With</label>
            <select value={compareState} onChange={(e) => setCompareState(e.target.value)} className="filter-select compare-select">
              <option value="All">Select State to Compare...</option>
              {STATES.filter(s => s !== selectedState).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-group slider-group">
          <div className="slider-header">
            <label><SlidersHorizontal size={14} /> Year Range</label>
            <span className="slider-values">{yearRange[0]} - {yearRange[1]}</span>
          </div>
          <div className="slider-wrapper">
            <Slider 
              range 
              min={2001} 
              max={2012} 
              step={1} 
              value={yearRange} 
              onChange={handleSliderChange}
              allowCross={false}
              marks={{2001: '2001', 2012: '2012'}}
              styles={{
                track: { backgroundColor: 'var(--color-accent)' },
                handle: { borderColor: 'var(--color-accent)', backgroundColor: 'white', opacity: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
