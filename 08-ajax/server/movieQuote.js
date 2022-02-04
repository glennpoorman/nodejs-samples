// Load the third party "popular-movie-quotes" module as we'll need it to generate the actual quote.
// We'll also need our own "sendJSON" and "send404" utilities to send responses back to the client.
//
const movieQuotes = require('popular-movie-quotes');
const { sendJSON, send404 } = require('./utilities');

// Function is called to send back a random movie quote in the given response.
//
exports.sendQuote = (req, res) => {

    // Start by fetching a random quote from the "popular-movie-quotes" module.
    //
    const randomQuote = movieQuotes.getSomeRandom(1)[0];

    // Our original spec to the client was that movie quotes would be returned as JSON
    // objects containing two properties. One property would be named "quote" and contain
    // the actual quote enclosed in double quotes. The other property would be named
    // "film" and contain the film name (not in quotes).
    //
    // Originally we used a third party package called "movie-quotes" that return the
    // random quote in the form of a single string that we had to parse to create the
    // object that the client was expecting. I've since changed these samples to use
    // a different quite generator. This one returns the quotes as JSON objects but the
    // definition of these objects differs from our original spec. This is handy though
    // as it demonstrates that things can change under the covers but you can still
    // make sure that your original spec is honored so that your client still works.
    //
    // So here we create an output quote object using the properties from the object we
    // just retrieved from the "popular-movie-quotes" module. Note that we force the quote
    // to be enclosed in double quotes as it does not come from the external module that way.
    //
    const outputQuote = {
      quote : `\"${randomQuote.quote}\"`,
      film : randomQuote.movie
    };

    // Send the object back as JSON.
    //
    sendJSON(res, 200, outputQuote);
};
