const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Like schema
const likeSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const segmentSchema = new Schema({
  day_number: { type: Number, required: true },
  description: { type: String, required: true },
  image_url: { type: String, default: 'https://i.postimg.cc/hGs6rcYX/Image-Placeholder.png' },
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
  is_public: { type: Boolean, default: true },
  likes: [likeSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Itinerary', itinerarySchema);