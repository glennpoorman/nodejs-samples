// Note that his module no longer requires any of our own utilities as we are using "Express"
// to handle the HTTP work. We still, however, need the "movie-quotes" module.
//
const movieQuotes = require('popular-movie-quotes');

// Function is called to send back a random movie quote in the given response.
//
exports.sendQuote = (req, res) => {

  const randomQuote = movieQuotes.getSomeRandom(1)[0];

  const outputQuote = {
    quote : `\"${randomQuote.quote}\"`,
    film : randomQuote.movie
  };

  // Here we use two new methods provided by "Express". The "status" method sets the
  // status code on the outgoing response. The "json" method assumes we're setting the
  // response body using a JSON object and automatically sets the content type and
  // stringifies the JSON object for us.
  //
  res.status(200).json(outputQuote);
};
