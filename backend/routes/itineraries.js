const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const itinerariesCtrl = require('../controllers/itineraries');

// All paths start with /api/itineraries

// Index functionality
router.get('/', ensureLoggedIn, itinerariesCtrl.index);

// Create functionality.
router.post('/', ensureLoggedIn, itinerariesCtrl.create);

// Show functionality.
router.get('/:id', ensureLoggedIn, itinerariesCtrl.show);


module.exports = router;
