// In addition to "http", also load our utilities defined in "server/utilities.js".
//
const http = require('http');
const { send404, sendFile } = require('./utilities');

const server = http.createServer((req, res) => {

  console.log(`${req.method} request posted for \"${req.url}\"`);

  // We still only process GET requests but no longer look at the url here as we'll now attempt
  // to honor requests for any file.
  //
  if (req.method === 'GET') {

    // Call our utility to send the requested file back in the response.
    //
    sendFile(req, res);

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
