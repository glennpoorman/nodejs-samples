promises-await
--------------

This sample modified the "movie-quotes" app yet again. To a user running the sample, nothing has
changed from the previous sample. Under the hood, however, there is quite a bit of clean up.

It's in the nature of NodeJS server code to make calls to asynchronous functions. Functions for
reading/writing files, sending requests, parsing results, etc. When you get into operations that
require several of these calls, you get into what is commonly described as "callback hell".

Imagine a function of your own that makes three asynchronous calls using the standard error-first
callback mechanism.

  function myFunc(myArg)
  {
    functionA(myArg, (errA, dataA) => {
      if (errA) {
        ...
      } else {
        functionB(dataA, (errB, dataB) => {
          if (errB) {
            ...
          } else {
            functionC(dtaB, (errC, dataC) => {
              if (errC) {
                ...
              } else {
                ...
              }
            });
          }
        });
      }
    });
  }

JavaScript introduces an object called a "Promise" that was designed to make this kind of code
read much cleaner. Originally introduced as a third party module, the "Promise" is now natively
supported and when asynchronous functions are converted to return promises, this allows you to
re-write the code above to look as follows:

  function myFunc(myArg)
  {
    functionA(myArg)
      .then((dataA => {
        return functionB(dataA);
      })
      .then((dataB) => {
        return functionC(dataB);
      })
      .then((dataC) => {
        ...
      })
      .catch((err) => {
        ...
      });
  }

In ES2017, new syntax was introduced to JavaScript that allowed you to mark functions as
asynchronous using the keyword "async" and then use the keyword "await" when making calls
into asynchronous functions that return "Promise" objects. Using this new syntax, your
code ends up looking more like synchronous code and reads even cleaner still.

  async function myFunc(myArg)
  {
    try
    {
      const dataA = await functionA(myArg);
      const dataB = await functionA(dataA);
      const dataC = await functionA(dataB);
      ..
    }
    catch (err)
    {
      ...
    }
  }

Try It
------

Start the server by running "npm start" from the command line.

Point your web browser to "http://localhost:3000". Note the web page is identical to the previous
sample. All that's new in this sample is coding under the hood.

What's Different?
-----------------

* "server/utilities.js". The "getBody" function is re-written to create and return a JS
  "Promise" object. The changes the syntax of any callers of this function.

  The "util.promisify" function is used to create promise-ready versions of the functions
  "fs.readFile", "jsonfile.readFile", and "jsonfile.writeFile".

  The "sendFile" function is re-written to use the promise-ready version of "readFile" and
  introduces the "async" and "await" keywords.

  The "HttpError" class extends the standard "Error" class to take an Http error code in the
  constructor in addition to the descriptive message.

  The "sendError" function takes an error object and sends the error back in a response. If 
  the error object is an instance of the new HttpError class, we use the Http code stored in
  the error object. Otherwise we send back a 500 server error.

* "server/favorites.js". The functions "sendFavorites", "addFavorite", and "deleteFavorite"
  are all re-written to use the promise-ready versions of the functions "jsonfile.readFile",
  "jsonfile.writFile", and "getBody". All three functions are marked as "async" and use the
  "await" keyword to make their asynchronous calls.

  Note that the "addFavorite" function is especially cleaned up using the new syntax as it
  makes three difference asynchronous calls.

  Also note that we introduce using exceptions to report errors. Lines that previously sent 
  error codes in a response are now throwing exceptions. We still need to eventually return
  these errors in response codes though so any code that may throw an exception is wrapped
  in a try/catch and the catch block converts the caught error object into an Http response.
  