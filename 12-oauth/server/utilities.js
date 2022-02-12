const fs = require('fs');
const jsonfile = require('jsonfile');
const path = require('path');
const util = require('util');

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
exports.send404 = (res) => exports.sendJSON(res, 404, { error : '404 page not found' });

// Helper utility to fetch data from a request or response body.
//
exports.getBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString('utf8');
    })
    .on('end', () => {
      resolve(body);
    })
    .on('error', () => {
      reject(Error('Error parsing request body'));
    });
  });

// Promise version of "fs.readFile".
//
exports.readFile = util.promisify(fs.readFile);

// Promise version of "jsonfile.readFile".
//
exports.readJson = util.promisify(jsonfile.readFile);

// Promise version of "jsonfile.writeFile".
//
exports.writeJson = util.promisify(jsonfile.writeFile);

// Send the contents of the given file in the body of the given response.
//
exports.sendFile = async (req, res) => {
  try {
    const filename = (req.url === '/') ? 'index.html' : req.url;
    const contents = await exports.readFile(path.join('public', filename));
    exports.sendResponse(res, 200, path.extname(filename).slice(1), contents);
  } catch(e) {
    exports.send404(res);
  }
};

// Send a response specifically designed to cause the calling browser to redirect
// to another page/URL. This is done by writing the location into the request
// header.
//
exports.redirectTo = (res, url) => {
  res.writeHead(302, {'Location' : url});
  res.end();
};

// Set a cookie header in the given response so that when returned, the cookie
// will automatically get set in the browser document.
//
exports.setCookie = (res, name, value) => {

  res.setHeader('Set-Cookie', `${name}=${value}; Path=/`);

  // Note that with no expiration, the cookie we set expires when the browser
  // is closed. We could just as easily apply an expiration here which would
  // make the cookie valid as long as we want or until such time that the user
  // explicitly logs out.
  //
  // For example, if we'd wanted to set the cookie to expire one day from now,
  // we could have written.
  //
  //   var t = new Date(Date.now() + 86400000); // 1 day in milliseconds.
  //   var c = name + '=' + value + ";expires=" + t.toUTCString() + '; Path=/';
  //   res.setHeader('Set-Cookie', c);
};

// Function converts an input Javascript object into a URL query string and
// returns the resulting string. A query string consists of a collection of
// name values pairs separated by an ampersand. So an incoming object that
// looked like:
//
//   {
//     first_name : 'Glenn',
//     middle_name : 'Matthew',
//     last_name  : 'Poorman
//   }
//
// Would come out the other end looking like:
//
//   'first_name=Glenn&middle_name=Matthew&last_name=Poorman'
//
// We start by converting the object into an array of just the key names
// by calling the "Object.keys" function. Using the object above as an
// example, this would turn the incoming object into the following array:
//
//   ['first_name', 'middle_name', 'last_name']
//
// We then call the "reduce" function on the resulting array. The "reduce"
// function collapses an array down to a single value by calling a user
// defined function to build up the result. The user defined function is
// called for each element in the array and for each call, the first function
// parameter is the value that we build up and the second is the array element.
// We pass an empty array "[]" as the default value for the "query" parameter
// and then build up from there.
//
// Our function to call for each key looks as follows:
//
//   (query,key) => [...query, `${key}=${encodeURIComponent(jsObj[key])}`]
//
// So assuming the "query" parameter is an array, we use the spread "..."
// syntax to break it up into its individual elements. We then use the array
// syntax "[]" to put it back together but add one additional element and
// that is the name=value pair for this element. So using the object above
// as an example again, this function would be called three times and each
// call would return the following:
//
//   ['first_name=Glenn']
//   ['first_name=Glenn', 'middle_name=Matthew']
//   ['first_name=Glenn', 'middle_name=Matthew', 'last_name=Poorman']
//
// The final array is also the final output from the call to "reduce". At
// that point, we combine the final array into a single string by calling
// the "join" function and specifying that the character '&' be used as a
// separator. This results in the string:
//
//   'first_name=Glenn&middle_name=Matthew&last_name=Poorman'
//
// Note the call to "encodeURIComponent" for each value added to the array
// to make sure the string is suitable to be used as a URL query string.
//
exports.makeQuery = (jsObj) =>
  Object.keys(jsObj).reduce((query, key) =>
    [...query, `${key}=${encodeURIComponent(jsObj[key])}`]
  , []).join('&');
