// To start with, we need the "http" module which supports many features of the HTTP protocol. Note
// that this module isn't included in "package.json". By itself, Node already provides many commonly
// used modules so you don't need to install them on a project by project basis. The "http" module
// is one of those modules. We do, however, still need to call "require" to load it.
//
const http = require('http');

// Call the function to create an HTTP server. As the only parameter, we pass in a callback that is
// called whenever an HTTP request of any kind is made to the server.
//
const server = http.createServer((req, res) => {

  // The first thing our callback will do is to write the request type and url out to the console.
  //
  console.log(`${req.method} request posted for \"${req.url}\"`);

  // Now we need to send back a response which is something that is expected from every HTTP request.
  // The bare minimum response should include a status code, a content type header, and the response
  // body. Here we do this in three separate steps and then wrap up with a call to "end" telling the
  // server that the response is complete and can be sent.
  //
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.write('Hello from your first NodeJS server.');
  res.end();

  // Some more alternate syntax. We could have sent the identical response using only two lines of
  // code and actually this is the syntax you'll see more often than not. You can combine the status
  // code and header into a single call to "writeHead" which takes the code as an argument followed
  // by an object containing any number of headers. Lastly, the "end" function can optionally take
  // the response body as an argument.
  //
  // Using that information, we could reduce the code above to look like:
  //
  //   res.writeHead(200, {'Content-Type' : 'text/plain'});
  //   res.end('Hello from your first NodeJS server.');
});

// Run the server and listen on port 3000 for any requests.
//
// You can test this by running the following command on the command line:
//
//   node server.js
//
// Then you can fire up your browser and point it to the following url:
//
//   http://localhost:3000
//
// Afterward make sure to note both the output to your browser and also to the command line window
// (console) where you fired up the server.
//
server.listen(3000, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }

  console.log('Server is listening on port: 3000');
});
