const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const itinerariesCtrl = require('../controllers/itineraries');

// All paths start with /api/itineraries

// Index functionality
router.get('/', ensureLoggedIn, itinerariesCtrl.index);

// Show functionality.
router.get('/:itineraryId', ensureLoggedIn, itinerariesCtrl.show);

// Create functionality.
router.post('/', ensureLoggedIn, itinerariesCtrl.create);

// Delete functionality.
router.delete('/:itineraryId', ensureLoggedIn, itinerariesCtrl.delete);

module.exports = router;
