const movieQuotes = require('popular-movie-quotes');
const { sendJSON, HttpError, sendError, validateCookie } = require('./utilities');

// Function is called to send back a random movie quote in the given response.
//
exports.sendQuote = (req, res) => {

  try {

    validateCookie(req);

    const randomQuote = movieQuotes.getSomeRandom(1)[0];

    const outputQuote = {
      quote : `\"${randomQuote.quote}\"`,
      film : randomQuote.movie
    };

    sendJSON(res, 200, outputQuote);
  } catch(e) {
    sendError(res, e);
  }
};
