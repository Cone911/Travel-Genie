const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const popularSearchSchema = new Schema({
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  search_count: {
    type: Number,
    default: 0 
  },
  likes: [likeSchema], 
});

const PopularSearch = mongoose.model('PopularSearch', popularSearchSchema);

module.exports = PopularSearch;
