const http = require('http');
const { send404, sendFile } = require('./utilities');
const { sendQuote } = require('./movieQuote');
const { sendFavorites, addFavorite } = require('./favorites');

const server = http.createServer((req, res) => {

  console.log(`${req.method} request posted for \"${req.url}\"`);

  // Process GET requests.
  //
  if (req.method === 'GET') {

    // A GET request to "/movie-quote" still generates and returns a new quote.
    //
    if (req.url === '/movie-quote') {
      sendQuote(req, res);

    // A GET request to "/favorite-quotes" will return a list of all quotes that have been
    // saved into the favorites list.
    //
    } else if (req.url === '/favorite-quotes') {
      sendFavorites(req, res);

    // For any other GET request, continue to treat it as a request for a static file.
    //
    } else {
      sendFile(req, res);
    }

  // If a POST request is sent to "/favorite-quotes", we will assume the body of the request
  // contains a quote object and we'll add it to the favorites list.
  //
  } else if (req.method === 'POST' && req.url === '/favorite-quotes') {
      addFavorite(req, res);

  // Any other type of request sends back a 404 page not found error.
  //
  } else {
    send404(res);
  }
});

// Run the server and listen on port 3000 for any requests.
//
server.listen(3000, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }

  console.log('Server is listening on port: 3000');
});
