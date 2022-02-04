// Use object destructuring assignment to save the functions from the helloGoodbye exports object
// into local variables.
//
const { sayHello, sayGoodbye, sayRandomQuote } = require('./hello-goodbye');

// Now call the functions we imported above.
//
sayHello();
sayRandomQuote();
sayGoodbye();
