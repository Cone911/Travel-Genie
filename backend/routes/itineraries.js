const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const itinerariesCtrl = require('../controllers/itineraries');

// All paths start with /api/itineraries

// Index functionality
router.get('/', ensureLoggedIn, itinerariesCtrl.index);

// Fetch all itineraries marked as "public"
router.get('/public', itinerariesCtrl.getPublicItineraries);

// Show functionality.
router.get('/:itineraryId', ensureLoggedIn, itinerariesCtrl.show);

// Create functionality.
router.post('/', ensureLoggedIn, itinerariesCtrl.create);

// Delete functionality.
router.delete('/:itineraryId', ensureLoggedIn, itinerariesCtrl.delete);

// Update the entire itinerary (including public/private status)
router.put('/:itineraryId', ensureLoggedIn, itinerariesCtrl.update);

// Update a specific segment functionality
router.put('/:itineraryId/segments/:dayNumber', ensureLoggedIn, itinerariesCtrl.updateSegment);

// Update Like/Unlike an itinerary
router.put('/:itineraryId/like', ensureLoggedIn, itinerariesCtrl.toggleLike);

module.exports = router;
