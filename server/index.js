require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const jwt = require('jsonwebtoken');

const Crime = require('./models/Crime');
const User = require('./models/User');
const { protect } = require('./middleware/auth');

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const PORT = process.env.PORT || 3001;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('MongoDB Connected');
  
  // Seed Database if Empty
  const count = await Crime.countDocuments();
  if (count === 0) {
    console.log('Crime collection is empty. Seeding from CSV...');
    const datasetPath = path.join(__dirname, '../public/crime_dataset.csv');
    const crimes = [];
    
    fs.createReadStream(datasetPath)
      .pipe(csv())
      .on('data', (data) => {
        crimes.push({
          state: data['STATE/UT'],
          year: parseInt(data['YEAR']),
          murder: parseInt(data['MURDER'] || 0),
          attemptToMurder: parseInt(data['ATTEMPT TO MURDER'] || 0),
          rape: parseInt(data['RAPE'] || 0),
          kidnapping: parseInt(data['KIDNAPPING & ABDUCTION'] || 0),
          dacoity: parseInt(data['DACOITY'] || 0),
          robbery: parseInt(data['ROBBERY'] || 0),
          burglary: parseInt(data['BURGLARY'] || 0),
          theft: parseInt(data['THEFT'] || 0),
          autoTheft: parseInt(data['AUTO THEFT'] || 0),
          riots: parseInt(data['RIOTS'] || 0),
          cheating: parseInt(data['CHEATING'] || 0),
          arson: parseInt(data['ARSON'] || 0),
          hurt: parseInt(data['HURT/GREVIOUS HURT'] || 0),
          dowryDeaths: parseInt(data['DOWRY DEATHS'] || 0),
          totalCrimes: parseInt(data['TOTAL IPC CRIMES'] || 0)
        });
      })
      .on('end', async () => {
        try {
          await Crime.insertMany(crimes);
          console.log(`Seeded ${crimes.length} records successfully.`);
        } catch (err) {
          console.error('Error seeding data', err);
        }
      });
  }
})
.catch(err => console.error('MongoDB connection error:', err));


// --- AUTHENTICATION ROUTES ---

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, password });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// --- CRIME DATA ROUTES (Protected) ---

// Utility to build query match object
const buildMatchQuery = (req) => {
  const { startYear, endYear, state, state2, search } = req.query;
  let match = {};
  
  if (startYear || endYear) {
    match.year = {};
    if (startYear) match.year.$gte = parseInt(startYear);
    if (endYear) match.year.$lte = parseInt(endYear);
  }
  
  if (search) {
    // Overrides specific state matching if searching globally
    match.state = new RegExp(search, 'i');
  } else if (state && state !== 'All') {
    if (state2 && state2 !== 'All') {
      // Comparison mode: match either state (case-insensitive regex for robust matching)
      match.$or = [
        { state: new RegExp('^' + state + '$', 'i') },
        { state: new RegExp('^' + state2 + '$', 'i') }
      ];
    } else {
      match.state = new RegExp('^' + state + '$', 'i');
    }
  }
  return match;
};

app.get('/api/crimes', /* protect, */ async (req, res) => {
  try {
    const match = buildMatchQuery(req);
    // Add pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const crimes = await Crime.find(match).skip(skip).limit(limit).sort({ year: -1, state: 1 });
    const total = await Crime.countDocuments(match);
    
    res.json({ data: crimes, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/states-summary', /* protect, */ async (req, res) => {
  try {
    const match = buildMatchQuery(req);
    const summary = await Crime.aggregate([
      { $match: match },
      { $group: {
          _id: '$state',
          totalCrimes: { $sum: '$totalCrimes' },
          murder: { $sum: '$murder' },
          rape: { $sum: '$rape' },
          theft: { $sum: '$theft' },
          robbery: { $sum: '$robbery' }
      }},
      { $project: { state: '$_id', totalCrimes: 1, murder: 1, rape: 1, theft: 1, robbery: 1, _id: 0 } },
      { $sort: { state: 1 } }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/yearly-trends', /* protect, */ async (req, res) => {
  try {
    const match = buildMatchQuery(req);
    const { state, state2 } = req.query;
    const isCompareMode = state && state !== 'All' && state2 && state2 !== 'All';

    let trends;
    if (isCompareMode) {
      // Group by year and state
      const rawTrends = await Crime.aggregate([
        { $match: match },
        { $group: {
            _id: { year: '$year', state: '$state' },
            totalCrimes: { $sum: '$totalCrimes' }
        }},
        { $sort: { '_id.year': 1 } }
      ]);
      
      // Pivot data for Recharts: { year, StateA: val, StateB: val }
      const pivot = {};
      rawTrends.forEach(item => {
        const y = item._id.year.toString();
        const s = item._id.state; // Actual name in DB
        if (!pivot[y]) pivot[y] = { year: y };
        pivot[y][s] = item.totalCrimes;
      });
      trends = Object.values(pivot);
    } else {
      trends = await Crime.aggregate([
        { $match: match },
        { $group: {
            _id: '$year',
            totalCrimes: { $sum: '$totalCrimes' },
            murder: { $sum: '$murder' },
            rape: { $sum: '$rape' },
            theft: { $sum: '$theft' }
        }},
        { $project: { year: { $toString: '$_id' }, totalCrimes: 1, murder: 1, rape: 1, theft: 1, _id: 0 } },
        { $sort: { year: 1 } }
      ]);
    }
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/crime-types', /* protect, */ async (req, res) => {
  try {
    const match = buildMatchQuery(req);
    const totals = await Crime.aggregate([
      { $match: match },
      { $group: {
          _id: null,
          Theft: { $sum: '$theft' },
          Burglary: { $sum: '$burglary' },
          Robbery: { $sum: '$robbery' },
          Murder: { $sum: '$murder' },
          Rape: { $sum: '$rape' },
          Kidnapping: { $sum: '$kidnapping' },
          Riots: { $sum: '$riots' },
          Cheating: { $sum: '$cheating' },
          TotalIPC: { $sum: '$totalCrimes' }
      }}
    ]);

    if (totals.length === 0) return res.json([]);

    const t = totals[0];
    const trackedSum = t.Theft + t.Burglary + t.Robbery + t.Murder + t.Rape + t.Kidnapping + t.Riots + t.Cheating;
    const Other = (t.TotalIPC - trackedSum > 0) ? (t.TotalIPC - trackedSum) : 0;

    const formatted = [
      { name: 'Theft', value: t.Theft, color: '#f59e0b' },
      { name: 'Burglary', value: t.Burglary, color: '#8b5cf6' },
      { name: 'Robbery', value: t.Robbery, color: '#10b981' },
      { name: 'Violent (Murder/Rape)', value: t.Murder + t.Rape, color: '#ef4444' },
      { name: 'Kidnapping', value: t.Kidnapping, color: '#f43f5e' },
      { name: 'Riots', value: t.Riots, color: '#f97316' },
      { name: 'Cheating', value: t.Cheating, color: '#06b6d4' },
      { name: 'Other IPC', value: Other, color: '#64748b' }
    ].filter(item => item.value > 0);

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/top-states', /* protect, */ async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    let match = {};
    if (startYear || endYear) {
      match.year = {};
      if (startYear) match.year.$gte = parseInt(startYear);
      if (endYear) match.year.$lte = parseInt(endYear);
    }

    const summary = await Crime.aggregate([
      { $match: match },
      { $group: { _id: '$state', totalCrimes: { $sum: '$totalCrimes' } } },
      { $sort: { totalCrimes: -1 } }
    ]);

    const formatted = summary.map(s => ({ state: s._id, totalCrimes: s.totalCrimes }));

    res.json({
      highest: formatted.slice(0, 5),
      lowest: formatted.slice(-5).reverse()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Production Backend server running on http://localhost:${PORT}`);
});
