// The module "jsonfile" is another third party module and provides some simple functions
// specifically designed to read and write JSON files. The functions "readFile" and "writeFile"
// wrap the functions of the same name if the "fs" module but take care of parsing and/or
// stringifying your data into and out of JSON format.
//
const jsonfile = require('jsonfile');
const path = require('path');
const { sendJSON, getBody } = require('./utilities');

// Local JSON file will hold the list of favorite quotes.
//
const favoritesFile = path.join(__dirname, 'favorites.json');

// Send the list of favorite quotes back in the body of the given response. We do this by reading
// the entirety of the favorites JSON file and then return the array of quote objects as a JSON
// string.
//
exports.sendFavorites = (req, res) =>

  // Read the entire favorites file.
  //
  jsonfile.readFile(favoritesFile, (err, quotes) => {

    // If an error occurs, send back an empty array. Otherwise assume the contents of the JSON
    // file is an array of quote objects and send that back in the response.
    //
    if (err) {
      sendJSON(res, 200, []);
    } else {
      sendJSON(res, 200, quotes);
    }
  });


// Parse a quote object from the request body and add the new quote to the favorites file. Here
// we use the "getBody" utility to piece together the entirety of the request body into a single
// chunk of text data. We assume that data is a quote object in JSON format and parse it into a
// real quote object, read the quotes file, add the new one to the array, and write it all back
// to disk.
//
exports.addFavorite = (req, res) =>

  // Call our utility to receive the body of the given request and pass in a callback to be called
  // once all of the data has been received.
  //
  getBody(req, (err, body) => {

    // Send back an error code if the request body is not successfully read.
    //
    if (err) {
      sendJSON(res, 500, { error : 'writing favorites data' });
    } else {

      // Create a quote object from the body. Make sure the object contains the two properties
      // "quote" and "film" and that those properties have values.
      //
      const quoteObj = JSON.parse(body);
      if (!quoteObj.quote || !quoteObj.film) {
        sendJSON(res, 400, { error : 'invalid quote' });

      // The quote object is valid. Read all of the quotes from the favorites file. If the quote
      // is not already in the favorites list, add the new quote to the array. Then turn around
      // and write it all back to disk overwriting the existing file.
      //
      } else {
        jsonfile.readFile(favoritesFile, (err, quotes) => {
          quotes = quotes || [];
          if (quotes.find((q) => (q.quote == quoteObj.quote && q.film == quoteObj.film))) {
            sendJSON(res, 400, { error : 'already a favorite quote' });
          } else {
            quotes.push(quoteObj);
            jsonfile.writeFile(favoritesFile, quotes, { spaces : 2 }, (err) => {
              if (err) {
                sendJSON(res, 500, { error : 'writing favorites data' });
              } else {
                sendJSON(res, 201, quoteObj);
              }
            });
          }
        });
      }
    }
  });
