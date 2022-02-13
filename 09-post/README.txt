post
----

This sample extends the previous "movie-quotes" app. In addition to displaying a random quote on
the page and allowing the user to press a button to display a new quote, the user can also push a
second button to add the current quote to a list of "Favorites". That list is always displayed on
the page.

Under the covers, we introduce an additional GET request (for getting the favorites list) and we
also introduce a POST request (for adding a favorite).

Try It
------

Start the server by running "npm start" from the command line.

Point your web browser to "http://localhost:3000". Note that the same web page is displayed
containing and single movie quote and a button allowing you to get a new quote. In addition, the
page also contains a "Favorites" list (I added a handful already) and an additional button allowing
you to add the current random quote to that list.

What's Different?
-----------------

* "package.json". A new third party module "jsonfile" was added. This module provides some simple
  wrappers over top of "fs.readFile" and "fs.writeFile" that read and write JSON files specifically.

  Also note the addition of a section "nodemonConfig". When we run our server and add quotes to
  the favorites list, the server code will edit the file "favorites.json" on disk. This edit will
  cause nodemon to restart which is unnecessary in this case. So in the config section, we specify
  that nodemon should ignore changes to any json files in the "server" folder.

* "server/favorites.json". This is a new JSON file where the favorites will be stored. This is
  strictly a server-side file. The client does not know or care how the favorites are stored just
  as long as requests to list them or add to them are honored.

* "server/utilities.js". A new utility "getBody" was added to receive the body of a request. In
  general, request or response bodies are streamed and received in chunks as we don't know how big
  they are so we need a utility to receive the pieces and put them all together so we can use the
  result.

* "server/favorites.js". This file contains new functions for getting a list of all the favorite
  quotes currently stored in the favorites file and also for adding a new quote to the favorites
  file.

* "server/server.js". Code was added to respond to an additional GET request sent to the route
  "/favorite-quotes" that will return the current list of favorites.

  Code was also added to respond to a POST request to "/favorite-quotes" that will add a quote
  to the current list of favorites.

* "public/scripts.js". The main div element with the id "app" now contains two sub elements. One
  container for the random quote display and a second for the favorites list.

  New functions are added for sending HTTP requests for getting the current list of favorite quotes
  and for adding a new quote to the list of favorite quotes.

  On page load, in addition to setting up the random quote DOM elements and getting the first
  quote, we also make a request to get the current favorite quotes and populate the new favorites
  list with the results.
