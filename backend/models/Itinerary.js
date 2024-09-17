const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const segmentSchema = new Schema({
  day_number: { type: Number, required: true },
  description: { type: String, required: true },
  image_url: { type: String, default: 'https://i.imgur.com/AGoG1hS.png' },
}, {
  timestamps: true,
});

// Define the Itinerary schema
const itinerarySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  days: { type: Number, required: true },
  adults: { type: Number, required: true },
  children: { type: Number, required: true },
  segments: [segmentSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Itinerary', itinerarySchema);



