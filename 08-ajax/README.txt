ajax
----

This sample combines the "use-npm" sample (where we interacted with the external "popular-movie-quotes"
module) and the "serve-static-files" sample (that served up web pages and their supporting files). 
The idea here is to show some very simple client/server interaction before diving too far into some
more complex web applications.

What this sample does then is allow you to bring up a web page that displays a random movie quote.
Each time you click the button on the page, a new movie quote will be displayed. Pushing the button
executes some client side JavaScript code that uses vanilla Ajax (Asynchronous JavaScript) to send
HTTP requests. In this case, we send a GET request to "/movie-quote" and our server sends back a
response containing the quote which is then displayed on the page.

Try It
------

Start the server by running "node server" or "npm start" from the command line.

Point your web browser to "http://localhost:3000". Note the simple web page displayed containing
a single movie quote and a button underneath that reads "Next Quote". Now push the button and note
that the quote changes. Keep pushing the button and note that a new quote appears with each push.

Note that you can test the GET request that gets the quote using "Postman" by sending a GET request
to "http://localhost:3000/movie-quote". The interesting behavior in this particular sample though
is the interaction between client and server using Ajax so the "Postman" test is anti-climactic at
best.

What's Different?
-----------------

* "package.json". The installation of the "popular-movie-quotes" module has been added back to
  this file so that running "npm install" installs both "popular-movie-quotes" and "nodemon".

* "server/movieQuote.js". This is a new file and is meant to contain utilities used to interact
  with the "popular-movie-quotes" module installed by npm. In this case we have only one utility
  and that is the function called to respond to the GET request for a quote. We load up the third
  party module and call the function for a random quote. We then create an outgoing object using
  properties from the quote and send it back as JSON.

* "server/server.js". This file is modified so that we no longer assume that GET requests are only
  for static files. First we look for specific urls (or "routes") that we're interested in. In this
  case we look to see if the incoming url is "/movie-quote" and if it is, we call our utility to
  send back a random quote in the response. Any other GET request is still treated as a static file
  request.

* "public/index.html". The interesting changes in the "public" folder are the HTML and the scripts.
  First, note the simplicity of the HTML file. The only hard coded element now is a single div
  element with the id "app". We'll rely on scripts to create the rest of the elements needed to
  make the app work.

* "public/scripts.js". Our scripts file contains three functions.

  One function is called to create and setup the DOM elements needed for the app to work. Note
  that we could have hard coded all of this in the HTML and simply left the scripts to do only the
  event handling. Instead we chose to keep the HTML clean and leave the scripts in charge of
  making sure they will be able to run when called upon.

  The second function is the event handling function called when the "Next Quote" button is pushed.
  This is where we make raw Ajax calls to send our GET request to the server to fetch a new movie
  quote and then display the resulting quote in one of the DOM elements on the page thus displaying
  it for the user to see. The quote comes back in the form of an object with the actual quote
  portion and the film it came from as separate properties. Both portions are displayed but in
  separate containers so that their display can be controlled separately via styles.

  The last function is called automatically when the document is finished loading. This function
  first calls the function that sets up the DOM and then makes an initial call to the event
  handling function so that our app comes to life with the first quote displayed on the page.
  