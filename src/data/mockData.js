// Mock data for India State-wise Crime Analysis
export const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir"
];

export const YEARS = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];

export const CRIME_CATEGORIES = [
  { name: "Theft", color: "#f59e0b" },
  { name: "Assault", color: "#ef4444" },
  { name: "Cybercrime", color: "#3b82f6" },
  { name: "Fraud", color: "#8b5cf6" },
  { name: "Other", color: "#64748b" }
];

// Generate consistent random data
const generateStateData = () => {
  const data = [];
  STATES.forEach(state => {
    // Base rate varies by state pseudo-randomly based on name length/chars
    const baseRate = (state.length * 500) + (state.charCodeAt(0) * 100);
    
    YEARS.forEach(year => {
      // Trend factor: slightly increasing or decreasing randomly over years
      const yearIdx = YEARS.indexOf(year);
      const trend = 1 + (yearIdx * 0.05) * (state.length % 2 === 0 ? 1 : -1);
      
      const totalCrimes = Math.floor(baseRate * trend * (0.8 + Math.random() * 0.4));
      
      // Breakdown by category
      const theft = Math.floor(totalCrimes * 0.4);
      const assault = Math.floor(totalCrimes * 0.25);
      const cybercrime = Math.floor(totalCrimes * 0.15 * (1 + (yearIdx * 0.2))); // Cybercrime increases more recently
      const fraud = Math.floor(totalCrimes * 0.1);
      const other = totalCrimes - (theft + assault + cybercrime + fraud);

      data.push({
        state,
        year,
        totalCrimes,
        solvedCases: Math.floor(totalCrimes * (0.6 + Math.random() * 0.3)), // 60-90% solved rate
        categories: {
          Theft: theft,
          Assault: assault,
          Cybercrime: cybercrime,
          Fraud: fraud,
          Other: other
        }
      });
    });
  });
  return data;
};

export const crimeData = generateStateData();

// Helper to get aggregated data for a specific year range
export const getAggregatedData = (startYear, endYear) => {
  const filtered = crimeData.filter(d => parseInt(d.year) >= parseInt(startYear) && parseInt(d.year) <= parseInt(endYear));
  
  const stateMap = {};
  
  filtered.forEach(record => {
    if (!stateMap[record.state]) {
      stateMap[record.state] = { 
        state: record.state, 
        totalCrimes: 0,
        solvedCases: 0,
        categories: { Theft: 0, Assault: 0, Cybercrime: 0, Fraud: 0, Other: 0 }
      };
    }
    stateMap[record.state].totalCrimes += record.totalCrimes;
    stateMap[record.state].solvedCases += record.solvedCases;
    stateMap[record.state].categories.Theft += record.categories.Theft;
    stateMap[record.state].categories.Assault += record.categories.Assault;
    stateMap[record.state].categories.Cybercrime += record.categories.Cybercrime;
    stateMap[record.state].categories.Fraud += record.categories.Fraud;
    stateMap[record.state].categories.Other += record.categories.Other;
  });

  return Object.values(stateMap);
};

// Helper for yearly trend for a state (or national if state='All')
export const getYearlyTrend = (state, startYear, endYear) => {
  const filtered = crimeData.filter(d => parseInt(d.year) >= parseInt(startYear) && parseInt(d.year) <= parseInt(endYear));
  
  const yearMap = {};
  YEARS.filter(y => parseInt(y) >= parseInt(startYear) && parseInt(y) <= parseInt(endYear)).forEach(y => {
    yearMap[y] = { year: y, totalCrimes: 0, solvedCases: 0 };
  });

  filtered.forEach(record => {
    if (state === "All" || record.state === state) {
      if (yearMap[record.year]) {
        yearMap[record.year].totalCrimes += record.totalCrimes;
        yearMap[record.year].solvedCases += record.solvedCases;
      }
    }
  });

  return Object.values(yearMap);
};

export const getCategoryDistribution = (state, startYear, endYear) => {
  const aggData = getAggregatedData(startYear, endYear);
  const data = state === "All" ? aggData : aggData.filter(d => d.state === state);
  
  const totals = { Theft: 0, Assault: 0, Cybercrime: 0, Fraud: 0, Other: 0 };
  
  data.forEach(d => {
    totals.Theft += d.categories.Theft;
    totals.Assault += d.categories.Assault;
    totals.Cybercrime += d.categories.Cybercrime;
    totals.Fraud += d.categories.Fraud;
    totals.Other += d.categories.Other;
  });

  return Object.keys(totals).map(k => ({
    name: k,
    value: totals[k],
    color: CRIME_CATEGORIES.find(c => c.name === k)?.color
  }));
};
