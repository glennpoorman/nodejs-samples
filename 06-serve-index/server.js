// In addition to the "http" module, this sample will also need the "fs" module where "fs" stands
// for "file system". These are standard utilities for reading/writing files and is also a standard
// module in Node (which means no install is required).
//
const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {

  console.log(`${req.method} request posted for \"${req.url}\"`);

  // In this sample we still only respond to GET requests but in addition to responding to the
  // url "/", we also respond to the url "/index.html" which points directly to the file we're
  // going to return.
  //
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {

    // Instead of sending specific HTML back to the client, we're going to assume that there is a
    // file in the same folder as our server called "index.html" and we're going to send back the
    // contents of that file. There's no magic call to send a file back though so we'll need to use
    // a utility from the "fs" module to read the file and send the contents back in the response.
    //
    // Go ahead and call the "readFile" function on "index.html" and specify the callback function
    // to be called when the operation finishes. Note the two different possible responses here.
    //
    // 1. If an error happens, we send back the 404 page not found error just like we do for any
    //    unhandled requests.
    //
    // 2. If the file is read successfully, our response looks very much like the response from the
    //    previous sample except instead of a bunch of write calls containing explicit HTML, we're
    //    making just one call sending back the entire contents of the file.
    //
    fs.readFile('index.html', (err, contents) => {
      if (err) {
        res.writeHead(404, { 'Content-Type' : 'text/json' });
        res.end(JSON.stringify({ error: 'Error: 404 page not found' }));
      } else {
        res.writeHead(200, { 'Content-Type' : 'text/html' });
        res.end(contents);
      }
    });

  // Any other type of request sends back a 404 page not found error.
  //
  } else {
    res.writeHead(404, { 'Content-Type' : 'text/json' });
    res.end(JSON.stringify({ error : 'Error: 404 page not found' }));
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
