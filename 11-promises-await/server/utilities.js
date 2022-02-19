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
exports.send404 = (res) => exports.sendJSON(res, 404, { error : 'Not found' });

// The utility to read a request/response body from a given request has been re-written
// to use a JavaScript "Promise". Promises provide a much cleaner way to work with
// asynchronous functions and were created in response to what is commonly referred to
// as "callback hell" when one operation involves calling several asynchronous functions
// that take callbacks and you end up with something that looks like:
//
//   functionA(arg1, (errA, dataA) => {
//     if (errA) {
//     } else {
//       functionB(dataA, (errB, dataB) => {
//         if (errB) {
//         } else {
//           functionC(dataB, (errC, dataC) => {
//             if (errC) {
//             } else {
//               ...
//             }
//           }
//         }
//       }
//     }
//   });
//
// If all of the functions above were coded to return a JS "Promise, that same code could
// be re-written to look more like:
//
//   functionA(arg1)
//     .then((dataA) => {
//       return functionB(dataA);
//     })
//     .then((dataB) => {
//       return functionC(dataB);
//     })
//     .then((dataC) => {
//       ...
//     })
//     .catch((err) => {
//       ...
//     });
//
// To take that a step further and clean it up even more, ES2017 introduced the "async"
// and "await" keyworks. In JS, a function decorated with the "async" keyword can call
// asynchronous functions using the "await" keyword so that the code flow looks more
// a simple chain of synchronous function calls. The whole thing can be wrapped in a
// try/catch block and the catch block is where any errors will go. So that reduces the
// code above to:
//
//   async function myFunction(arg1)
//   {
//     try
//     {
//       const dataA = await functionA(arg1);
//       const dataB = await functionB(dataA);
//       const dataC = await functionC(dataB);
//       ...
//     }
//     catch (e)
//     {
//       ...
//     }
//   }
//
// So to make our "getBody" function use a "Promise" is simple. First we make sure
// that the "getBody" function returns a "Promise" so we new one up right in the
// return statement. The argument to the promise constructor is a callback function
// that takes two arguments. One is a function to call if our operation is successful
// (to resolve the promise) and the other is a function to call when our operation
// fails (to reject the promise). So here, the body of the function we pass into the
// promise constructor looks virtually identical to our "getBody" function from the
// the previous sample with two exceptions. Where we use to call the old input callback
// function upon success, we now call "resolve" with the request/response body. Next
// if an error occurs, we now call "reject" and pass the error object as a parameter.
//
// Now the "getBody" function is promise-ready and can be used using either of the cleaner
// syntax workflows outlined above.
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

// In addition to writing your own functions to return promises, Javascript provides a
// utility to create promise-ready version of existing functions that use the standard
// JS callbacks format. Take the function "fs.readFile" as an example. This follows the
// convention of taking in a series of arguments ending with an error-first callback:
//
//   fs.readFile(filename, (err, contents) => {
//     ...
//   });
//
// It would be nice to use functions like "readFile" using the promise syntax. The
// function "util.promisify" makes that possible by wrapping any function that follows
// the common callback style in a "Promise" and returning the new function.
//
//   const rf = util.promisify(fs.readFile);
//   rf.(filename)
//     .then((contents) {
//       ...
//     }
//     .catch((err) {
//       ...
//     });
//
// Or ...
//
//   const rf = util.promisify(rs.readFile);
//   const contents = await rf(filename);
//
// By itself, this doesn't clean up the code a ton but strung together with
// several other asynchronous calls and you have some much more readable code.

// Below we are going to create promise-ready versions of several utility functions
// we use throughout these samples. These will come in especially handy when were
// performing operations like interacting with the favorites file where we have two
// or three asynchronous calls in one place.

// Promise version of "fs.readFile".
//
exports.readFile = util.promisify(fs.readFile);

// Promise version of "jsonfile.readFile".
//
exports.readJson = util.promisify(jsonfile.readFile);

// Promise version of "jsonfile.writeFile".
//
exports.writeJson = util.promisify(jsonfile.writeFile);

// The "sendfile" function sends the contents of the given file in the body of the
// given response and has been part of our utilities since the sample where we started
// sending static files back to the client.
//
// Here we re-write the utility to use the new promise-based syntax for interacting
// with the promise-ready version of the "fs.readFile" function. There were two options
// on how to interact with these functions. The first is the classic promise interaction
// use the ".then" and ".catch" functions.
//
//   exports.sendFile = async (req, res) => {
//     const filename = (req.url === '/') ? 'index.html' : req.url;
//     exports.readFile(path.join('public', filename))
//       .then((contents) => {
//         exports.sendResponse(res, 200, path.extname(filename).slice(1), contents);
//       })
//       .catch((err) => {
//         exports.send404(res);
//       });
//   };
//
// The second is the code we ultimately use here which uses the "async" and "await"
// keywords introduced in ES2017.
//
// Now, in a function like this that only makes one call to an asynchrounous function,
// the change in syntax doesn't really help us out at all. The lines of code between the
// three difference approaches (the old error-first callback approach, the .then, approach,
// and the async/await approach) are virtually identical. But if you take a look at code
// that makes multiple calls (like the "addFavorite" function), the two promise-based
// approaches clean the code up considerably.
//
// Below we ultimately settle on the async/await approach. Note that every call to an
// asynchronous function contains the keyword "await" which will wait for the call to
// complete before moving on. The "async" keyword is applied to this whole function
// stating that this is an asynchronous function. Note that use of the "await" keyword
// is ONLY allowed in functions marked as "async".
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
// response. If the incoming error object is an instance of our custom HttpError class,
// we use the code stored in the object as the Http code. Otherwise we send the error
// back as a 500 server error.
// 
exports.sendError = (res, err) => {
  if (err instanceof exports.HttpError) {
    exports.sendJSON(res, err.code, { error : err.message });
  } else {
    exports.sendJSON(res, 500, { error : err.message });
  }
}
