const movieQuotes = require('popular-movie-quotes');

// Function is called to send back a random movie quote in the given response.
//
exports.sendQuote = (req, res) => {

  const randomQuote = movieQuotes.getSomeRandom(1)[0];

  const outputQuote = {
    quote : `\"${randomQuote.quote}\"`,
    film : randomQuote.movie
  };

  res.status(200).json(outputQuote);
};
