const fs = require('fs');
const path = require('path');

// Define an object where the properties are the various file extensions we'll work with in this
// sample and the corresponding values are the MIME types.
//
const mimeTypes = {
  'css'  : 'text/css',
  'ico'  : 'image/x-icon',
  'jpg'  : 'image/jpg',
  'js'   : 'application/javascript',
  'json' : 'application/json',
  'html' : 'text/html',
  'png'  : 'image/png',
  'txt'  : 'text/plain'
};

// Write and end the given response.
//
exports.sendResponse = (res, code, ext, data) => {
  res.writeHead(code, { 'Content-Type' : mimeTypes[ext] });
  res.end(data);
};

// Write and send a json response converting the given object to JSON format.
//
exports.sendJSON = (res, code, data) => exports.sendResponse(res, code, 'json', JSON.stringify(data));

// Write and send a standard 404 page not found response.
//
exports.send404 = (res) => exports.sendJSON(res, 404, { error : 'Error: 404 page not found' });

// Send the contents of the given file in the body of the given response.
//
exports.sendFile = (req, res) => {
  const filename = (req.url === '/') ? 'index.html' : req.url;
  fs.readFile(path.join('public', filename), (err, contents) => {
      if (err) {
        exports.send404(res);
      } else {
        exports.sendResponse(res, 200, path.extname(filename).slice(1), contents);
      }
  });
};

// This is a helper utility for fetching data from a request or response body. At the time
// a request or response is first received, the entire body may not be fully available yet.
// So we need to set an event handling function for the "data" event. This event may be fired
// several times depending on the size of the request body so we need to keep chunking the data
// together as those events are received. When we finally get the "end" event, we will then
// know that we have the entire body and we can call the specified callback function with
// the result.
//
// Note the signature of the callback function.
//
//   cb(err, data)
//
// This is a common Node.js callback style referred to as "error-first callbacks" where the
// signature takes an error object as the first argument followed by the data. If the error
// object is non-null, then an error occurred. Otherwise the data object contains the results.
// You'll see this style of callback in most asynchronous function calls.
//
exports.getBody = (req, cb) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString('utf8');
  })
  .on('end', () => {
    cb(null, body);
  })
  .on('error', () => {
    cb(Error('Error parsing request body'));
  });
};
