const fs = require('fs');
const path = require('path');
const { sendJSON, getBody, readJson, writeJson } = require('./utilities');

// Local text file will hold the list of favorite quotes.
//
const favoritesFile = path.join(__dirname, 'favorites.json');

// Utility goes through the quotes in the given quotes array and determines the next available id
// that can be used.
//
function nextId(quotes)
{
  return quotes.reduce((high, curr) => (curr.id > high) ? curr.id : high, 0) + 1;
};

// Send the list of favorite quotes back in the body of the given response.
//
exports.sendFavorites = async (req, res) => {

  try {
    const quotes = await readJson(favoritesFile);
    sendJSON(res, 200, quotes);
  } catch(e) {
    sendJSON(res, 200, []);
  }
};

// Parse a quote object from the request body and add the new quote to the favorites file.
//
exports.addFavorite = async (req, res) => {

  try {
    const body = await getBody(req);
    const quoteObj = JSON.parse(body);
    if (!quoteObj.quote || !quoteObj.film) {
      throw new Error('invalid quote');
    }

    let quotes = [];
    if (fs.existsSync(favoritesFile))
      quotes = await readJson(favoritesFile);

    if (quotes.find((q) => (q.quote == quoteObj.quote && q.film == quoteObj.film))) {
      sendJSON(res, 400, { error : 'already a favorite quote' });
    } else {
      quoteObj.id = nextId(quotes);
      quotes.push(quoteObj);
      await writeJson(favoritesFile, quotes, { spaces : 2 });
      sendJSON(res, 201, quoteObj);
    }
  } catch(e) {
    sendJSON(res, 500, { error : 'writing favorites data' });
  }
};

// Called to process a DELETE request in order to delete a quote from the favorites list.
// favorites list.
//
exports.deleteFavorite = async (req, res) => {

  try {
    const url = new URL(req.url, `http://${req.headers.host}/`);
    const id = parseInt(url.searchParams.get('id'));
    if (isNaN(id)) {
      throw new Error('bad id specification');
    }

    let quotes = await readJson(favoritesFile);
    const ix = quotes.findIndex(quoteObj => (quoteObj.id === id));
    if (ix < 0) {
      throw new Error('id out of range');
    }

    quotes.splice(ix, 1);
    await writeJson(favoritesFile, quotes, { spaces : 2 });
    sendJSON(res, 200, { message : 'Quote successfully removed' });
  } catch(e) {
    sendJSON(res, 500, { error : 'writing favorites data' });
  }
};
