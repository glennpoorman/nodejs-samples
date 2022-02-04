users
-----
The previous sample added authorization to the "movie-quotes" sample so that in order to
interact with our server, you needed to login and identify yourself. Once you were logged
in though, you still interacted with the same hard coded JSON file (favorites.json) which
contained all the favorite quotes. In a much more realistic world, we would keep each user's
favorites data private to that user and each user would only see the favorites that they
themselves selected.

Behind the scenes, when our server interacts with an authorization server to obtain an access
token, we add one additonal request. This requests sends that access token back to the server
and asks for the user information associated with that token. The unique id returned from the
authorization server is then appended to the cookie sent back to the client. When subsequent
calls are then made to fetch the favorites list, add a new favorite, or delete a favorite, we
strip that user id from the end of the cookie and use it to identify the users data file (as
opposed to hard coding the name and location of the file).

Try It
------

Register the sample application with GitHub. Fill in the client id and client secret properties
in "server/config.js". 

Start the server by running "node" or "npm start" from the command line.

Point your web browser to "http://localhost:3000". Visually this sample behaves identical to
the previous sample except that upon first run, the favorites list is likely empty. In this
sample, the server is coded to keep a favorites list per user. So when you login, a new list
is create associated with your unique user id and someone else logging in with a different
account will see their own favorites list.

What's Different?
-----------------

* "server/config.js". Added a "userIdEndpoint" which is an endpoint that we can post a GET
  request to to obtain detailed information for a given user.

* "server/utilities.js". Added a "Promise" version of the function "https.request" so that
  we can can send HTTP requests in the same style that we're reading request/response bodies
  and reading/writing files.

  Added a "Promise" version of the function "https.get". The "https.get" function is simply
  a short-hand that automatically sets the request method to GET, calls "https.request" to
  create the request, and automatically calls the "end" method to send the request.

  Added utility "parseCookies" which takes an http request and parses the cookies embedded
  in the request (if there are any) into list of cookie values indexed by the cookie names.

* "server/oauth.js". With the new promise based request function in place, the "sendToken"
  function was marked as "async" and re-written to use the new utilities.

  Also in "sendToken", an additional GET request to the authorization server was added.
  After the authorization code is exchanged for an access token, we also use that access token
  to call back into the authorization server and ask for info on the user who authorized the
  token. From that bundle of information, we extract the unique user id and append it to the
  cookie returned to the client. In consequent interaction with the favorites data, we'll use
  that user id in the cookie to make sure we reference the correct file.

* "server/favorites.js". Added utility function "favoritesFile". This function takes an incoming
  request, parses the cookies from the request, and looks for a movie token cookie. If we find
  it, we strip the user id off the end of the cookie and use it to create the user's favorites
  data file name.

  "sendFavorites" is modified to access a user-specific data file creating the filename by
  parsing the user id from the cookie embedded in the incoming request. That user's favorites
  file is then used explicitly and if the file doesn't exist yet, we just send back an empty
  list.

  "addFavorite" is also modified to access the user-specific data file. In this case if the
  file doesn't exist, it gets created. You can see this by looking in the "server" folder
  after adding some favorites and seeing a JSON file with a numeric filename.

  "deleteFavorite" is also modified to access the user-specific data file. Here if the data
  file doesn't exist, we send back an error right away. Otherwise we proceed as we did in
  previous samples operating on the user's data.

  Note that we didn't have to do anything to send the cookie back to the server when making
  requests to the favorites routes. That is something the browser takes care of automatically.
