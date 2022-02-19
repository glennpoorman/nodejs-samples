const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const { logRequest, validateCookie } = require('./utilities');
const { sendQuote } = require('./movieQuote');
const { sendFavorites, addFavorite, deleteFavorite } = require('./favorites');
const { authorize, sendToken } = require('./oauth');

// Create the express app.
//
const app = express();

// Setup our middleware.
//
app.use(logRequest);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(validateCookie);

// Setup our routes for this sample.
//
app.get('/oauth', authorize);
app.get('/oauth/code', sendToken);
app.get('/movie-quote', sendQuote);
app.get('/favorite-quotes', sendFavorites);
app.post('/favorite-quotes', addFavorite);
app.delete('/favorite-quotes', deleteFavorite);

// Run the server and listen on port 3000 for any requests.
//
app.listen(3000, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }

  console.log('Server is listening on port: 3000');
});
