// We've added a new utility file in the "server" folder called "movieQuote".
//
const http = require('http');
const { send404, sendFile } = require('./utilities');
const { sendQuote } = require('./movieQuote');

const server = http.createServer((req, res) => {

  console.log(`${req.method} request posted for \"${req.url}\"`);

  // Process GET requests.
  //
  if (req.method === 'GET') {

    // While our previous sample treated the incoming url as a filename, we're really free to treat
    // these urls anyway we see fit. In other words, while pointing your browser to something like
    // "/some-name/another-name" implies a folder structure, it's really just text that the server
    // is free to treat however we want. We call these urls "routes".
    //
    // In addition to serving a standard set of static files (html, js, css, etc), this server is
    // also designed to respond to a GET request to "/movie-quote" by generating a random movie
    // quote and sending it back in the response.
    //
    // So start by examining the incoming url and if it is the "/movie-quote" url, then go ahead
    // and call our utility to send back the quote.
    //
    if (req.url === '/movie-quote') {
      sendQuote(req, res);

    // For any other GET request, continue to treat it as a request for a static file.
    //
    } else {
      sendFile(req, res);
    }

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
