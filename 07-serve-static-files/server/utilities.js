// The extra modules required for these utilities. Note that "path" is yet another standard Node
// module so no additional installation is required.
//
const fs = require('fs');
const path = require('path');

// Define an object where the properties are the various file extensions we'll work with in this
// sample and the corresponding values are the MIME types.
//
// A MIME type is a standard string to describe the content type in a request. These types were
// originally created to allow documents other than plain text to be attached to an email message
// where MIME stands for "Multipurpose Internet Mail Extension".
//
// Note that if you can manage to find a complete list of MIME types, you'll see that it is quite
// long. We're only covering what we need for these particular samples.
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

// Write and end the given response. We use the code and the extension to write the content type
// header and we pass the data along in the call to "end".
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
exports.send404 = (res) => exports.sendJSON(res, 404, { error : 'Not found' });

// Assume the incoming request refers to a static file and send the contents of that file in the
// body of the given response. As in the previous sample, the file is opened, read, and the contents
// are sent in the response body using the other utilities defined in this module.
//
// Note that we've moved the 'index.html' file and its related files into the "public" folder. This
// will be a convention we continue to use in the rest of the samples. The client doesn't need to
// know this, however, so we'll take the url for any file GET requests we get and prepend the
// "public" folder onto that url.
//
exports.sendFile = (req, res) => {

  // As is common among web servers, we will assume that a request coming for "/" is a request
  // for the file "index.html". Any other request is left alone.
  //
  const filename = (req.url === '/') ? 'index.html' : req.url;

  // Read the file and send back the contents in the body of the response.
  //
  fs.readFile(path.join('public', filename), (err, contents) => {
      if (err) {
        exports.send404(res);
      } else {
        exports.sendResponse(res, 200, path.extname(filename).slice(1), contents);
      }
  });
};
