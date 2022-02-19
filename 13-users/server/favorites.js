const fs = require('fs');
const path = require('path');
const { sendJSON, getBody, readJson, writeJson, HttpError, sendError, validateCookie } = require('./utilities');

// Utility goes through the quotes in the given quotes array and determines the next available id
// that can be used.
//
function nextId(quotes)
{
  return quotes.reduce((high, curr) => (curr.id > high) ? curr.id : high, 0) + 1;
};

// Utility parses the cookies from the incoming request and then explicitly looks for our
// movie token cookie. If we find it, we strip the user id from the end of the cookie and
// use that id to create the user's favorites data filename.
//
function favoritesFile(req)
{
  // Note that "validateCookie" will throw an exception if the cookie does not exist
  // but we can rely on the caller to catch it.
  const movieToken = validateCookie(req);

  const userId = movieToken.split('.').pop();
  return path.join(__dirname, `${userId}.json`);
}

// Send the list of favorite quotes back in the body of the given response.
//
exports.sendFavorites = async (req, res) => {

  try {

    validateCookie(req);

    // Note that instead of a hard coded favorites file name, we call our utility
    // to parse the user id from the incoming request and create the file name based
    // on that id.
    //
    const theFile = favoritesFile(req);
  
    if (fs.existsSync(theFile)) {
      const quotes = await readJson(theFile);
      sendJSON(res, 200, quotes);
    } else {
      sendJSON(res, 200, []);
    }
  } catch(e) {
    sendError(res, e);
  }
};

// Parse a quote object from the request body and add the new quote to the favorites file.
//
exports.addFavorite = async (req, res) => {

  try {

    validateCookie(req);

    const body = await getBody(req);
    const quoteObj = JSON.parse(body);
    if (!quoteObj.quote || !quoteObj.film) {
      throw new HttpError(400, 'Invalid quote');
    }

    let quotes = [];

    // Again note that instead of the hard coded favorites file name, we call the utility to
    // parse the user id from the incoming request and create the file name based on that id.
    //
    const theFile = favoritesFile(req);
    if (fs.existsSync(theFile))
      quotes = await readJson(theFile);

    if (quotes.find((q) => (q.quote == quoteObj.quote && q.film == quoteObj.film))) {
      throw new HttpError(403, 'Duplicate quote');
    } else {
      quoteObj.id = nextId(quotes);
      quotes.push(quoteObj);
      await writeJson(theFile, quotes, { spaces : 2 });
      sendJSON(res, 201, quoteObj);
    }
  } catch(e) {
    sendError(res, e);
  }
};

// Called to process a DELETE request in order to delete a quote from the favorites list.
// favorites list.
//
exports.deleteFavorite = async (req, res) => {

  try {

    validateCookie(req);

    // Again note that instead of the hard coded favorites file name, we call the utility to
    // parse the user id from the incoming request and create the file name based on that id.
    //
    const theFile = favoritesFile(req);

    const url = new URL(req.url, `http://${req.headers.host}/`);
    const id = parseInt(url.searchParams.get('id'));
    if (isNaN(id)) {
      throw new HttpError(400, 'Bad id specification');
    }

    let quotes = await readJson(theFile);
    const ix = quotes.findIndex(quoteObj => (quoteObj.id === id));
    if (ix < 0) {
      throw new HttpError(400, 'Id out of range');
    }

    // Note that after the deletion, we use the user-specified filename to write the
    // data back to disk.
    //
    quotes.splice(ix, 1);
    await writeJson(theFile, quotes, { spaces : 2 });
    sendJSON(res, 200, { message : 'Quote successfully removed' });
  } catch(e) {
    sendError(res, e);
  }
};
