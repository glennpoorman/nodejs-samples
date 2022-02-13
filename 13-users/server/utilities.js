const fs = require('fs');
const https = require('https');
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
exports.send404 = (res) => exports.sendJSON(res, 404, { error : 'Not found' });

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

// HttpError class extends the standard Error class. In addition to the descriptive
// message, this class also takes an HTTP error code in the constructor.
//
exports.HttpError = class HttpError extends Error
{
  constructor(code, msg)
  {
    super(msg);
    this.code = code;
  }
}

// Functon takes an incoming error object and sends the error back in the incoming
// response.
// 
exports.sendError = (res, err) => {
  if (err instanceof HttpError) {
    exports.sendJSON(res, err.code, { error : err.message });
  } else {
    exports.sendJSON(res, 500, { error : err.message });
  }
}

// Send a response redirecting the caller to another url.
//
exports.redirectTo = (res, url) => {
  res.writeHead(302, {'Location' : url});
  res.end();
};

// Set a cookie header in the given response.
//
exports.setCookie = (res, name, value) => res.setHeader('Set-Cookie', `${name}=${value}; Path=/`);

// Function converts an input Javascript object into a URL query string and
// returns the resulting string.
//
exports.makeQuery = (jsObj) =>
  Object.keys(jsObj).reduce((query, key) =>
    [...query, `${key}=${encodeURIComponent(jsObj[key])}`]
  , []).join('&');

// Promise version of the "https.request" function.
//
exports.httpsRequest = (url, options, data) =>
  new Promise((resolve) => {
    const req = https.request(url, options, (res) => resolve(res));
    req.write(data);
    req.end();
  });

// Promise version of the "https.get" function.
//
// Note that we haven't used this function yet. The official descriptions explains that
// since most HTTP requests are GET requests anyway, this is simply a short-hand that
// automatically sets the request method to 'GET', calls "https.request", and automatically
// calls the "end" method to send the request.
//
exports.httpsGet = (url, options) =>
  new Promise((resolve) => {
    https.get(url, options, (res) => resolve(res));
  });

// Function gets the cookies string from a request header and converts the cookies into
// an array of cookie values indexed by cookie names.
//
exports.parseCookies = (req) => {

  // Start by creating the empty output list.
  //
  var list = {};

  // Now if the cookie property in the incoming request header is defined, then use the
  // split function to break multiple cookies (separated by ';') into an array of cookie
  // strings. Then call "forEach" so we can process each cookie string separately.
  //
  req.headers.cookie && req.headers.cookie.split(';').forEach((cookie) => {

    // Break the cookie into pars using '=' as the delimiter. Note that the value of a
    // cookie may contain additional '=' characters to we'll have to put the value back
    // together.
    //
    var parts = cookie.split('=');

    // Assuming the first item in the array of parts is the cookie name, remove it from
    // the array (by calling "shift") and use that name to index the outgoing list. For
    // the value, take the rest of the parts and put them back together replacing the '='
    // character we moved when we called "split" in the last statement.
    //
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  // Return the resulting list.
  //
  return list;
};
