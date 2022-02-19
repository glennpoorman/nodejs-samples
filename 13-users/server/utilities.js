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
class HttpError extends Error
{
  constructor(code, msg)
  {
    super(msg);
    this.code = code;
  }
}
exports.HttpError = HttpError;

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

  var list = {};

  req.headers.cookie && req.headers.cookie.split(';').forEach((cookie) => {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
};

// Function parses all cookie values from the incoming request and looks to see if the
// list contains one of our movie quotes cookies. If so, the cookie value is returned.
// Otherwise an exception is thrown.
//
exports.validateCookie = (req) => {

  const cookies = exports.parseCookies(req);
  const movieToken = cookies['movie-quote-token'];
  if (!movieToken)
  {
    throw new HttpError(401, 'Unauthorized');
  }
  return movieToken;
}
