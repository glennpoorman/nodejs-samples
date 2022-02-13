const jsonfile = require('jsonfile');
const util = require('util');

// Promise version of "jsonfile.readFile".
//
exports.readJson = util.promisify(jsonfile.readFile);

// Promise version of "jsonfile.writeFile".
//
exports.writeJson = util.promisify(jsonfile.writeFile);

// HttpError class extends the standard Error class.
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
    res.status(err.code).json({ error : err.message });
  } else {
    res.status(500).json({ error : err.message });
  }
}

// Function converts an input Javascript object into a URL query string and
// returns the resulting string.
//
exports.makeQuery = (jsObj) =>
  Object.keys(jsObj).reduce((query, key) =>
    [...query, `${key}=${encodeURIComponent(jsObj[key])}`]
  , []).join('&');

// This new utility simply logs info from an incoming request to the console. We did this in
// all of our previous samples in the callback function that was executed for every incoming
// request. In this sample, the "Express" module handles all of our routing. I liked seeing
// what all the requests were coming in though so using "Express", we can install this function
// as a "middleware" function to be run on all incoming requests.
//
// Note the function signature (req, res, next). The first two arguments are the same as what
// has been our standard route handling (the request followed by the response). The third
// argument is called to pass execution on to the next link in the execution chain. Calling
// this function keeps the chain moving and it is absolutely CRUCIAL that this be done in order
// to make sure execution continues.
//
exports.logRequest = (req, res, next) => {
  console.log(`${req.method} request posted for \"${req.url}\"`);
  next();
};
