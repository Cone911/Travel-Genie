const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    days: {
      type: Number,
      required: true
    },
    adults: {
      type: Number,
      required: true,
      min: 1
    },
    children: {
      type: Number,
      required: true,
      min: 0
    },
    segments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItinerarySegment'
    }]
  },
  {
    timestamps: true, 
  }
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;



