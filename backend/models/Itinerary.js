const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    destination: {
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
  },
  {
    timestamps: true,
  }
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;

