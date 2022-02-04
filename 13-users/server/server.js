const http = require('http');
const { send404, sendFile } = require('./utilities');
const { sendQuote } = require('./movieQuote');
const { sendFavorites, addFavorite, deleteFavorite } = require('./favorites');
const { authorize, sendToken } = require('./oauth');

const server = http.createServer((req, res) => {

  console.log(`${req.method} request posted for \"${req.url}\"`);

  // Parse the incoming url and save the route into its own string.
  //
  const url = new URL(req.url, `http://${req.headers.host}/`);
  const route = url.pathname;

  // Process GET requests.
  //
  if (req.method === 'GET') {

    // A GET request to "/oauth" will redirect to the authorization server where the user
    // will provide credentials and an authorization code will be sent to the redirect url.
    //
    if (route === '/oauth') {
      authorize(req, res);

    // A GET request from the authorization server to "/oauth/code" results in our app
    // exchanging an authorization code for an access token and sending it back to the
    // client as a cookie.
    //
    } else if (route === '/oauth/code') {
      sendToken(req, res);

    // A GET request to "/movie-quote" generates and returns a new quote.
    //
    } else if (route === '/movie-quote') {
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

  // A DELETE request to "/favorite-quotes" deletes a favorite quote from the favorites list.
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
