query-delete
------------

This sample extends the "movie-quotes" app once again. The page displays the random quote and the
favorites list just like the previous sample. In addition now, there is a "Delete" button added to
each item in the favorites list and selecting that button will delete that quote from the list.

Under the covers, we introduce query parameters. In order to delete the quote from the favorites
list, we send a DELETE request to the server and add the id of the quote to delete as a query
parameter on the url. This, of course, means we also introduce an id to the quote itself. When a
quote is added to the favorites list, we'll add an "id" field to the object. When added as a
favorite, the id is sent back to the client and used as part of the id on the DOM element. Later
if and when the quote is selected to delete, we parse the id from the id of the DOM element and
use it in our DELETE request to delete the quote from the favorites list.

Try It
------

Start the server by running "node" or "npm start" from the command line.

Point your web browser to "http://localhost:3000". Note the web page is virtually identical to the
previous sample except that all of the favorites in the favorites list have a small "Delete" button
on the right side of the item. Selecting that butotn will remove that favorite quote from the list.

What's Different?
-----------------

* "server/favorites.js". The "addFavorite" function, in addition to adding a quote to the favorites
  list, now also assigns an id to the quote by simply determining the highest id in the existing list
  of favorites and adding one.

  The new "deleteFavorite" function parses the incoming request and looks for the id of the quote to
  delete as a query parameter. The favorites file is then loaded, the quote is deleted, and the
  remaining favorites are written back to disk.

* "server/server.js". Code was added to look for a DELETE request to "/favorite-quotes" and call the new
  utility to delete a quote from the favorites list.

* "public/scripts.js". The layout of each favorite in the DOM has been tweaked. An additional layer
  was added so that we can add a "Delete" button to each favorite quote.

  The utility that adds the DOM elements for a favorite quote now uses the server-assigned id from
  the quote for the id of the DOM element.

  When "Delete" is clicked, a new function is called that gets the id of the quote to delete from
  the DOM element and then sends an HTTP request to the server to delete the quote from the
  favorites list. Upon successful deletion, the item is also removed from the DOM.
