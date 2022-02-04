// To access the functionality exported from any given module, that module must be loaded into the
// current module using the "require" function. The value returned from calling "require" on any
// given module will be the "module.exports" object from that module.
//
// The statement below loads the contents of "hello-goodbye.js" and sets the variable
// "hello-goodbye" to that module's exports object. Note that we use a relative path to the file
// and leave off the ".js" suffix (the suffix is optional).
//
const helloGoodbye = require('./hello-goodbye');

// Now we can access the functions we set as properties on the exports object in "hello-goodbye.js".
// Call both functions here.
//
helloGoodbye.sayHello();
helloGoodbye.sayGoodbye();

// Alternate syntax.
//
// We could have used object destructuring (ES6) to create variables for the two functions and
// written the "require" line as follows:
//
//   const { sayHello, sayGoodbye } = require('./hello-goodbye');
//
// Then our lines to call the functions would simply reference the local variables directly.
//
//   sayHello();
//   sayGoodbye();
