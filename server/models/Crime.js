const mongoose = require('mongoose');

const crimeSchema = new mongoose.Schema({
  state: { type: String, required: true, index: true },
  year: { type: Number, required: true, index: true },
  murder: { type: Number, default: 0 },
  attemptToMurder: { type: Number, default: 0 },
  rape: { type: Number, default: 0 },
  kidnapping: { type: Number, default: 0 },
  dacoity: { type: Number, default: 0 },
  robbery: { type: Number, default: 0 },
  burglary: { type: Number, default: 0 },
  theft: { type: Number, default: 0 },
  autoTheft: { type: Number, default: 0 },
  riots: { type: Number, default: 0 },
  cheating: { type: Number, default: 0 },
  arson: { type: Number, default: 0 },
  hurt: { type: Number, default: 0 },
  dowryDeaths: { type: Number, default: 0 },
  totalCrimes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Crime', crimeSchema);
