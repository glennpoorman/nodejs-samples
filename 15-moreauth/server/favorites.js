const fs = require('fs');
const path = require('path');
const { readJson, writeJson } = require('./utilities');

// Utility goes through the quotes in the given quotes array and determines the next available id
// that can be used.
//
function nextId(quotes)
{
  return quotes.reduce((high, curr) => (curr.id > high) ? curr.id : high, 0) + 1;
};

// Utility fetches our movie token cookie from the incoming request. If we find it, we strip the
// user id from the end of the cookie and use that id to create the user's favorites data filename.
//
function favoritesFile(req)
{
  const movieToken = req.cookies['movie-quote-token'];
  if (movieToken)
  {
    const userId = movieToken.split('.').pop();
    return path.join(__dirname, `${userId}.json`);
  }
}

// Send the list of favorite quotes back in the body of the given response.
//
exports.sendFavorites = async (req, res) => {

  try {
    const quotes = await readJson(favoritesFile(req));
    res.status(200).json(quotes);
  } catch(e) {
    res.status(200).json([]);
  }
};

// Parse a quote object from the request body and add the new quote to the favorites file.
//
exports.addFavorite = async (req, res) => {

  try {

    const quoteObj = req.body;
    if (!quoteObj.quote || !quoteObj.film) {
      throw new Error('ERROR: invalid quote');
    }

    let quotes = [];
    const theFile = favoritesFile(req);
    if (fs.existsSync(theFile))
      quotes = await readJson(theFile);

    if (quotes.find((q) => (q.quote == quoteObj.quote && q.film == quoteObj.film))) {
      res.status(400).json({ error : 'ERROR: already a favorite quote' });
    } else {
      quoteObj.id = nextId(quotes);
      quotes.push(quoteObj);
      await writeJson(theFile, quotes, { spaces : 2 });
      res.status(201).json(quoteObj);
    }
  } catch(e) {
    res.status(500).json({ error : 'ERROR: writing favorites data' });
  }
};

// Called to process a DELETE request in order to delete a quote from the favorites list.
// favorites list.
//
exports.deleteFavorite = async (req, res) => {

  try {

    const theFile = favoritesFile(req);
    if (!fs.existsSync(theFile)) {
      throw new Error('ERROR: file does not exist.');
    }

    const id = parseInt(req.query.id);
    if (isNaN(id)) {
      throw new Error('ERROR: bad id specification');
    }

    let quotes = await readJson(theFile);
    const ix = quotes.findIndex(quoteObj => (quoteObj.id === id));
    if (ix < 0) {
      throw new Error('ERROR: id out of range');
    }

    quotes.splice(ix, 1);
    await writeJson(theFile, quotes, { spaces : 2 });
    res.status(200).json({ message : 'Quote successfully remove' });
  } catch(e) {
    res.status(500).json({ error : 'ERROR: writing favorites data' });
  }
};
