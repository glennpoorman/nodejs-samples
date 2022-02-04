const http = require('http');
const { send404, sendFile } = require('./utilities');
const { sendQuote } = require('./movieQuote');
const { sendFavorites, addFavorite, deleteFavorite } = require('./favorites');

const server = http.createServer((req, res) => {

  console.log(`${req.method} request posted for \"${req.url}\"`);

  // Now that we're adding query parameters to the url, it's not enough to branch based on the
  // url. We need to parse out some bits to separate the route from the query parameters. We
  // do this here by using the incoming url and host to create a URL object.
  //
  const url = new URL(req.url, `http://${req.headers.host}/`);

  // Save the url/route. This is now what we'll branch on below.
  //
  const route = url.pathname;

  // Process GET requests.
  //
  if (req.method === 'GET') {

    // A GET request to "/movie-quote" generates and returns a new quote.
    //
    if (route === '/movie-quote') {
      sendQuote(req, res);

    // A GET request to "/favorite-quotes" will return a list of favorite quotes.
    //
    } else if (route === '/favorite-quotes') {
      sendFavorites(req, res);

    // For any other GET request, continue to treat it as a request for a static file.
    //
    } else {
      sendFile(req, res);
    }

  // A POST request to "/favorite-quotes" adds the quote in the request to the favorites list.
  //
  } else if (req.method === 'POST' && route === '/favorite-quotes') {
    addFavorite(req, res);

  // A DELETE request to "/favorite-quotes" deletes a favorite quote from the favorites list. It
  // is assumed that the id/index of the favorite to delete is passed in the request as a query
  // parameter and will therefore be part of the url. Check the beginning of the called function
  // to see how this parameter is parsed.
  //
  } else if (req.method === 'DELETE' && route === '/favorite-quotes') {
    deleteFavorite(req, res);

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
