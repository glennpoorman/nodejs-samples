const fs = require('fs');
const path = require('path');
const { sendJSON, getBody, readJson, writeJson, parseCookies } = require('./utilities');

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
  const cookies = parseCookies(req);
  const movieToken = cookies['movie-quote-token'];

  if (movieToken)
  {
    const userId = movieToken.split('.').pop();
    return path.join(__dirname, `${userId}.json`);
  }
}

// Send the list of favorite quotes back in the body of the given response.
//
// Note that instead of a hard coded favorites file name, we call our utility to parse
// the user id from the incoming request and create the file name based on that id. If
// we fail to parse the id from the request or if the file doesn't exist, we just let
// the call to "readJson" throw an exception and we simply return an empty list.
//
exports.sendFavorites = async (req, res) => {

  try {
    const quotes = await readJson(favoritesFile(req));
    sendJSON(res, 200, quotes);
  } catch(e) {
    sendJSON(res, 200, []);
  }
};

// Parse a quote object from the request body and add the new quote to the favorites file.
//
// Again note that instead of the hard coded favorites file name, we call the utility to
// parse the user id from the incoming request and create the file name based on that id.
//
exports.addFavorite = async (req, res) => {

  try {
    const body = await getBody(req);
    const quoteObj = JSON.parse(body);
    if (!quoteObj.quote || !quoteObj.film) {
      throw new Error('invalid quote');
    }

    // Initialize the quotes list to be an empty array and then call the utility to fetch
    // the user's filename based on the user id in the incoming request. If that file exists
    // on disk, read the contents into the local quotes array. Otherwise, the local array
    // stays empty.
    //
    let quotes = [];
    const theFile = favoritesFile(req);
    if (fs.existsSync(theFile))
      quotes = await readJson(theFile);

    // Now go through the same steps we did before to parse the incoming quote from the
    // request, add it to the local array, and then output the array back to the file on
    // disk. Note that, again, we are using the file created from the incoming user id
    // if that file didn't already exist, we'll be creating it here.
    //
    if (quotes.find((q) => (q.quote == quoteObj.quote && q.film == quoteObj.film))) {
      sendJSON(res, 400, { error : 'already a favorite quote' });
    } else {
      quoteObj.id = nextId(quotes);
      quotes.push(quoteObj);
      await writeJson(theFile, quotes, { spaces : 2 });
      sendJSON(res, 201, quoteObj);
    }
  } catch(e) {
    sendJSON(res, 500, { error : 'writing favorites data' });
  }
};

// Called to process a DELETE request in order to delete a quote from the favorites list.
// favorites list.
//
// Again note that instead of the hard coded favorites file name, we call the utility to
// parse the user id from the incoming request and create the file name based on that id.
//
exports.deleteFavorite = async (req, res) => {

  try {

    // Here we'll start by calling the utility to create the user filename. Before we do
    // anything else, check to see that the file exists and throw an exception if it doesn't.
    // There's no point in doing anything else if the file isn't there.
    //
    const theFile = favoritesFile(req);
    if (!fs.existsSync(theFile)) {
      throw new Error('file does not exist.');
    }

    const url = new URL(req.url, `http://${req.headers.host}/`);
    const id = parseInt(url.searchParams.get('id'));
    if (isNaN(id)) {
      throw new Error('bad id specification');
    }

    let quotes = await readJson(theFile);
    const ix = quotes.findIndex(quoteObj => (quoteObj.id === id));
    if (ix < 0) {
      throw new Error('id out of range');
    }

    // Note that after the deletion, we use the user-specified filename to write the
    // data back to disk.
    //
    quotes.splice(ix, 1);
    await writeJson(theFile, quotes, { spaces : 2 });
    sendJSON(res, 200, { message : 'Quote successfully removed' });
  } catch(e) {
    sendJSON(res, 500, { error : 'writing favorites data' });
  }
};
