const jsonfile = require('jsonfile');
const util = require('util');

// Promise version of "jsonfile.readFile".
//
exports.readJson = util.promisify(jsonfile.readFile);

// Promise version of "jsonfile.writeFile".
//
exports.writeJson = util.promisify(jsonfile.writeFile);

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
