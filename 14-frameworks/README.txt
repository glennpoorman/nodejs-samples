frameworks
----------
Everything we've done so far has been great for getting a better understanding of how the various
pieces work (Node, Ajax, etc) to make a web server. If you go look at some real code though, it's
very likely you'll find widespread use of various 3rd party frameworks designed to make the web
developer's life just a little easier. The choice of frameworks to use is plentiful and appears
to grow every day. It's entirely likely that by the time anyone but me gets around to reading any
of this, some of the frameworks we're about to discuss have already become obsolete and several newer
hipper frameworks have been born. At their core though, they all try to achieve the same goal. Wrap
the core technologies with quicker and easier APIs allowing developers to get their work out to
market faster.

So here we take the previous sample and see what it looks like re-writing code on both the server
and client side using some of the more popular frameworks. From a user perspective, this sample
hasn't changed at all. Under the hood though, we've re-written quite a bit of code.

Try It
------

Start the server by running "npm start" from the command line.

Point your web browser to "http://localhost:3000". This samples behaves identically to the
previous sample in every way. All of the changes involved code cleanup in both the server
and client that involved use of some popular frameworks.

Frameworks
----------

On the server, we've installed and made use of the frameworks "express", "body-parser", and
"superagent".

"Express" is a framework for node that provides a very clean and easy to read methods for setting
up a server app, providing much of the default workflows that every server needs, and for setting
up routes to handle common and custom HTTP requests.

The "body-parser" framework is useful when dealing with the body of request. This framework is
middleware design to work with "Express" replacing our old "getBody" function. Using "body-parser",
the entirety of the request body is collected before we even get into our route handling code and
is made avialable to our code via a property on the incoming request called "body".

The "cookie-parser" is another express middleware framework takes any incoming cookies in a request
and turns then into a cookies object where the cookie name can be used to index the cookie value
thus replacing our "parseCookies" utility introduced earlier.

"SuperAgent" is a small promise-based HTTP request library. The API is very clean and makes
sending any kind of HTTP request much easier to code and to follow.

The last framework we introduce is "jQuery" on the client side. jQuery has been around a long time
and while it is used to simplify just about every aspect of the JavaScript language, the place
where it is especially useful is working with the HTML DOM and also interacting with Ajax. For more
complex client side code, jQuery has been replaced by much more powerful frameworks such as Angular.js
and React. jQuery still has its place though as it is exceptionally easy to learn and deploy making
it incredibly useful for rapid prototyping and small samples such as these. The other area where
jQuery really excels is in hiding the idiosyncrasies of various browsers. The creators of jQuery
have gone to great pains to make sure their library works with different versions of the most
commonly used browsers (i.e. Chrome, Edge, Firefox, IE, Safari, Opera).

What's Different?
-----------------

* "package.json". The dependencies "body-parser", "express", and "superagent" have been added and
  will be installed when you run "npm install" for this sample.

* "server/server.js". This file changes quite a bit. We no longer create an HTTP server via
  "createServer" but instead we call "express()" to create and return an Express/server/app object.
   The resulting "app" object contains several methods for setting up routes.

  The first thing we do is make several calls to "app.use" to setup any middleware functions we
  want to use. These functions will be called on all incoming requests to perform whatever task
  they are design to perform and then pass control along to the next link in the chain which could
  be another middleware function or our final route handling code.

    1. The first call inserts a logging function of our own making to log info about the incoming
       request to the console. We've done this all of our samples thus far but since Express is
       now handling the routing, we had to add our own middleware for this.

    2. Next we insert the function "bodyParser.json()" which will make sure the entirety of the
       request body is received and converted into a JSON object before moving on. That object
       will be available along the rest of the chain via the "body" property.

    3. Next we insert the function "cookieParser()" which will look for any cookies embedded in
       an incoming request header, parse the cookies, and make them available via the "cookies"
       property on the request.

    4. Lastly we tall Express that any incoming requests for static files should look in the
       "public" folder when trying to locate the files and send them back.

  With only our specific routes left, we set those up by calling methods on the app object named
  after the request types. So for a GET request to "/movie-quote", we call "app.get()" specifying
  our route as the first argument and the function that should be called to handle the request as
  the second argument. Note that we also make calls to "app.post()" and "app.delete()" to handle
  the POST and DELETE requests we're interested in.

  Lastly, we setup a route for a GET request to "/" and specifically setup that request to return
  "public/index.html". Note that the "sendFile" we call here is NOT our utility from the previous
  samples but is a method on the request added by "Express".

* "server/utilities.js". Most of the utilities in this file were design to ease the task of sending
  various types of responses back to the client. Since Express provides so many methods on both
  requests and responses that perform those same tasks, we can remove ours. The only utilities left
  then are our promise-based methods to read/write Json files to/from disk, our utility to turn a
  JSON object into a url query string, and the utility to validate the incoming cookie.

  Note that the cookie validation function no longer calls our old "parseCookies" function to get
  the cookies from the request header. Now we can assume that the "cookie-parser" middleware has
  already done this and we can access the cookies via the "cookies" property on the request.

* "server/movieQuote.js". This file is mostly the same but has some subtle simplifications. Express
  introduces several utilities for working with requests and responses that clean things up and
  remove the need for some of our earlier utilities. Here we use the "status" method to set a code
  on a response and we use the "json" method which assumes we're filling in the response body with
  a JSON object will set the content type automatically.

* "server/favorites.js". The crux of the code in this file is the same but both the body-parse and
  Express frameworks allow for some cleanup.

  First, all of the responses use Express methods as opposed to our old utilities to set the
  response data and to send.

  Second, the "addFavorite" function is written to assume that the "body-parser" middleware has
  already received the entirety of the request body. That means we're able to remove the call to
  our old "getBody" utility and simply reference the "body" property on the incoming request.

  Similarly in "deleteFavorite", we no longer have to parse the incoming request to fetch the
  "id" query parameter and can instead go right to it using the "query.id" parameter directly
  on the request.

* "server/oauth.js". The function "authorize" has only one change and that is to use the Express
  "redirect" function directly on the response to redirect the caller to another url as opposed
  to our old "redirectTo" utility.

  The function "sendToken" changes quite a bit. Here we use the "superagent" framework to send
  additional HTTP requests to Forge. This framework cleans up the sending of these requests quite
  a lot. It is also promise based which makes the code flow much more readable.

* "public/login.js" and "public/scripts.js". The client side scripts have been completely re-written
  to use jQuery to interact with the DOM and with Ajax. Without going into what jQuery is or how to
  use it, I will say that the biggest bonus in using jQuery is the "selector" syntax allowing you
  to quickly fetch items by id, by class, by name, etc. Also the syntax for sending Ajax calls as
  opposed to directly working with the XMLHttpRequest class. The jQuery function $.ajax() does most
  of the heavy lifting here but we also make use of the the shorthand functions $.get() and $.post().

* "public/jquery.js". The client side jQuery file "jquery.js" has been downloaded and now resides
  in our public folder next to the other JS files.

* "public/login.html" and "public/index.html". Our two client side HTML files must load up the jQuery
  file "jquery.js" file before loading up their respective JS files "login.js" and "scripts.js".
