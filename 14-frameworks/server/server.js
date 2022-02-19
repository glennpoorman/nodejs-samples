// Note some changes in the modules we're loading now. The "express" module is a popular framework
// for handling requests on the server and also for setting up routes. The "body-parser" module
// chunks incoming request body data and makes the entirety of the request body available via the
// "body" property. The "cookie-parser" module parses any cookies in incoming request headers and
// creates an object on the request available via the "cookies" property. All of these modules need
// to be installed and saved in "package.json" before they can be used.
//
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const { logRequest, validateCookie } = require('./utilities');
const { sendQuote } = require('./movieQuote');
const { sendFavorites, addFavorite, deleteFavorite } = require('./favorites');
const { authorize, sendToken } = require('./oauth');

// The "express" module exports a single function that is called to create the express app object.
// We'll use this instead of the HTTP server we used in previous samples.
//
const app = express();

// We can use "app.use" to "install" middleware functions into Express. These are functions that
// will be called on all incoming requests. The format of the function is:
//
//     f(req, res, next)
//
// Where "req" is the incoming request, "res" is the response, and "next" is called to pass control
// to the next link in the execution chain. It is imperative that any middleware functions call
// "next" otherwise the whole chain breaks down.
//
// 1. We first install our new "logRequest" utility. In all of our previous samples, we provided
//    our own routing mechanism and output text to the console stating what requests were coming
//    in. Express is handling all of the routing now but I like the console output so I created
//    a middleware function in order to keep it alive.
//
// 2. Next we install the "bodyParser.json()" function which will make make sure that the request
//    body is fully received and converted to JSON before getting to our code to handle the routes.
//
// 3. Next we install the "cookie-parser" function which which will make sure that any cookies
//    embedded into an incoming request's headers are parsed and converted into an object on the
//    request.
//
// 4. Lastly we tell express to look in the "public" folder for any incoming static file requests
//    and send the files back from there.
//
//    PLEASE NOTE: If the folder contains the file "index.html" and a request comes in for "/",
//                 Express will automatically serve the "index.html" file. Most Express tutorials
//                 will instruct you to explicitly write this request using a line like:
//
//                   app.get('/', (req, res) => res.sendFile(... path to index.html ...));
//
//                 If you set up the the static files folder using "express.static" though and
//                 that's where your "index.html" lives, then that step is not necessary and will
//                 end up being a NO-OP anyway.
//
app.use(logRequest);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

// Here we use our re-written "validateCookie" utility as middleware. Placement here is very
// important.
//
// 1. This line MUST come after the line that installs the "cookie-parser" middleware. That
//    way we can write the validation code assuming that the cookies have already been parsed
//    and are accesible directly via the "req.cookies" property.
//
// 2. This line MUST also come after the "express.static" installation. The function itself
//    was written so that some routes are exempt from authorization (see the commens in the
//    function). But we also want to make sure we're not doing validation for each and every
//    request that comes in for a static file. By installing our validation middleware AFTER
//    the "express.static" middleware, we ensure that any processing of static files is done
//    prior and we don't have to worry about it.
//
// NOTE: There is an alternative approach to controlling exactly which routes middleware is
//       applied to. We could skip the "app.use" call entirely and install the middleware
//       directly in the route setup below. Consider the "/movie-quote" route. We could have
//       just as easily written it as:
//
//         app.get('/movie-quote', validateCookie, sendRoute);
//
//       This specifies what functions are called to handle the route and in what order.
//       It's not a bad solution and it does work. But this is a simple sample. That approach
//       presumes that anyone and everyone who ever addes additional routes to a program will
//       also remember to add the call to validate. Plus, depending on what other kinds of
//       pre-processing you want to do on various routes, this approach can get very busy
//       very fast.
//
app.use(validateCookie);

// Here we setup our routes. The express app has functions for all of the different request
// methods. Here we call the appropriately named method for the routes we previously handled
// in the big "if" statement.
//
app.get('/oauth', authorize);
app.get('/oauth/code', sendToken);
app.get('/movie-quote', sendQuote);
app.get('/favorite-quotes', sendFavorites);
app.post('/favorite-quotes', addFavorite);
app.delete('/favorite-quotes', deleteFavorite);

// Run the server and listen on port 3000 for any requests.
//
app.listen(3000, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }

  console.log('Server is listening on port: 3000');
});
