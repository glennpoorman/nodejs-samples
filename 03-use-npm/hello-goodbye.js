// Just like our own modules, third party modules installed via "npm install" are loaded via the
// "require" function. Note that we don't use the same relative path syntax here that we used in
// the previous sample as the "node_modules" folder is one of the default search paths.
//
const movieQuotes = require('popular-movie-quotes');

// The exports object looks pretty much the same as in the previous sample except that we added an
// additional function "sayRandomQuote" which does exactly what it sounds like. It calls into the
// "popular-movie-quotes" module to generate a random movie quote and writes it out to the console.
//
module.exports = {

  sayHello () {
    console.log('Hello from NodeJS!');
  },

  sayGoodbye () {
    console.log('Goodbye from NodeJS!');
  },

  sayRandomQuote () {

    // Fetch a random quote from the module.
    //
    let q = movieQuotes.getSomeRandom(1)[0];

    // Write the quoute and the movie it came from to the console.
    //
    // NOTE the use of template literals (template strings) here. By enclosing a string in backticks,
    // we can make substitutions using the ${} syntax. We use this below to first write a string
    // surrounded by double quotes and using the ${} to substitute the quote from the object we
    // just obtained. Similarly, the second line writes a string beginning with a dash and a space
    // and then substitutes in the movie title the quote came from.
    //
    console.log(`\"${q.quote}\"`);
    console.log(`- ${q.movie}`);
  }
}
