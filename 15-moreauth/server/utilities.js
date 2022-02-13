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

// Utility simply logs info from an incoming request to the console. We install this
// as a middleware function in "Express" which will be called for all incoming requests.
//
exports.logRequest = (req, res, next) => {
  console.log(`${req.method} request posted for \"${req.url}\"`);
  next();
};
