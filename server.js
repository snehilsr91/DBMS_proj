const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');

require('dotenv').config();

const app = express();

// Use express.json() for parsing JSON data
app.use(express.json());  // Add this line to parse JSON bodies

// You can still use bodyParser for urlencoded form data if needed
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use('/', routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
