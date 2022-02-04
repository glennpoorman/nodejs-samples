moreauth
--------

Try It
------

Start the server by running "node" or "npm start" from the command line.

Point your web browser to "http://localhost:3000". This samples behaves identically to the
previous sample in every way. All of the changes involved code cleanup in both the server
and client that involved use of some popular frameworks.

What's Different?
-----------------

* "server/config.js". Added an additional configuration object for each additional authorization
  server containing the data required for authorization.

* "server/oauth.js". Several modifications to handle additional authorization servers.

  1. Added internal functions for redirecting to the authorization endpoint for each of the
     supported authorization servers (GitHug, Google, Facebook, Forge). Each of the four
     supported servers pass along a "state" property in their redirect that contains the name
     of the authorization server ("github", "google", "facebook", "forge"). This state parameter
     will be passed through to the redirect url if/when authentication is successful.

  2. Modified "authorize" to parse the query parameter from the incoming request fetching the
     specified authorization server and then calling the appropriate function for authorization
     based on the server name.

  3. Added internal functions for sending the request to exchange the authorization code for
     an access token and for fetching the user id. Added a function for each of the supported
     authorization servers since the request parameters vary from server to server.

  4. The "sendToken" function parses the "state" query parameter passed through from the redirect
     to fetch the name of the authorization server to use and calls the appropriate function for
     that server.

* New images have been added to the client to represent login buttons for Google, Facebook,
  and Forge.

* "public/styles.css". New styles were added for the additional login buttons in order to show
  the appropriate image for each.

* "public/login.js". Code to setup the DOM for the login page was modified to create three
  additional login buttons (Google, Facebook, Forge).
