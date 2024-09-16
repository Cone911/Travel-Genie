const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySegmentSchema = new Schema(
  {
    itinerary_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Itinerary',
      required: true
    },
    day_number: {
      type: Number,
      required: true,
      min: 1
    },
    description: {
      type: String,
      required: true
    },
    image_url: {
      type: String,
      default: 'https://i.imgur.com/AGoG1hS.png'
    }
  },
  {
    timestamps: true, 
  }
);

const ItinerarySegment = mongoose.model('ItinerarySegment', itinerarySegmentSchema);

module.exports = ItinerarySegment;
