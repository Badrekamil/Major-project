const API_BASE = "https://major-project-qz0z.onrender.com/api";

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res, fallbackMsg) => {
  if (!res.ok) {
    let msg = fallbackMsg;
    try {
      const body = await res.json();
      msg = body.message || fallbackMsg;
    } catch (_) { /* response wasn't JSON */ }
    throw new Error(msg);
  }
  return res.json();
};

const buildQueryParams = (params) => {
  const query = new URLSearchParams();
  if (params.startYear) query.append('startYear', params.startYear);
  if (params.endYear) query.append('endYear', params.endYear);
  if (params.state) query.append('state', params.state);
  if (params.state2) query.append('state2', params.state2);
  if (params.search) query.append('search', params.search);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  return query.toString();
};

export const loginUser = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(res, 'Login failed');
};

export const registerUser = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(res, 'Registration failed');
};

export const fetchStatesSummary = async (params) => {
  const res = await fetch(`${API_BASE}/states-summary?${buildQueryParams(params)}`, { headers: getHeaders() });
  return handleResponse(res, 'Failed to fetch summary');
};

export const fetchYearlyTrends = async (params) => {
  const res = await fetch(`${API_BASE}/yearly-trends?${buildQueryParams(params)}`, { headers: getHeaders() });
  return handleResponse(res, 'Failed to fetch trends');
};

export const fetchCrimeTypes = async (params) => {
  const res = await fetch(`${API_BASE}/crime-types?${buildQueryParams(params)}`, { headers: getHeaders() });
  return handleResponse(res, 'Failed to fetch crime types');
};

export const fetchTopStates = async (params) => {
  const res = await fetch(`${API_BASE}/top-states?${buildQueryParams(params)}`, { headers: getHeaders() });
  return handleResponse(res, 'Failed to fetch top states');
};

export const fetchFullDataset = async (params) => {
  const res = await fetch(`${API_BASE}/crimes?${buildQueryParams(params)}`, { headers: getHeaders() });
  return handleResponse(res, 'Failed to fetch full dataset');
};

