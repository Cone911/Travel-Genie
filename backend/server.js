const path = require('path');
const express = require('express');
const logger = require('morgan');
const app = express();

require('dotenv').config();

// Connect to Database
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

console.log("Checking if my API is setup correctly: ", process.env.OPENAI_API_KEY);

app.use(logger('dev'));
// Serve static assets from the frontend's built code folder (dist)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
// Middleware to parse JSON
app.use(express.json());

// Middleware to check the request's headers for a JWT and
// verify that it's a valid.  If so, it will assign the
// user object in the JWT's payload to req.user
app.use(require('./middleware/checkToken'));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/itineraries', require('./routes/itineraries'));
const ensureLoggedIn = require('./middleware/ensureLoggedIn');
// Remember to use ensureLoggedIn middleware when mounting
// routes and/or within the route modules to protect routes
// that require a logged in user either
// For example:
// app.use('/api/posts', ensureLoggedIn, require('./routes/posts'));

// Use a "catch-all" route to deliver the frontend's production index.html
app.get('*', function (req, res) {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The express app is listening on ${port}`);
});
