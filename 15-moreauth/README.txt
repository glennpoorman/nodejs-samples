moreauth
--------
We introduced authorization a couple of samples ago. It is not uncommon, however, to happen
upon a website that allows login via multiple OAuth2 servers. How often have you gone to a 
website that required an account and have seen "Login with Google", "Login with Facebook", and
maybe two or three other similar lines. This is usually a convenience that is added especially
when the app providing it doesn't really require any other acccess to those servers. In other
words, when the app doesn't care who authorized you. Just as long as somebody did. They are 
banking that if they put out a handful of the most popular sites, you're bound to already have
an account with at least one of them.

This sample, in addition to the login with GitHub, now offers options to login with Google,
Facebook, or Autodesk Forge (for any CAD people out there). Selecting any of the four will
redirect you to the appropriate login page and then, if you're successfully authorized, you
will be given access to the movie quotes app.

One important note to consider is that, if you have accounts on more than one of those servers,
each account will be considered a different user in the eyes of the movie quotes app. consider
the "users" sample where we queried the user id to determine where to store your favorites.
We'll continue to do that here but, of course, each server will provide a completely different
user id even though it's you logging into each one. This is by design and typical of this kind
of workflow.

Try It
------

The file "server/config.js" contains client id and secret information for all four of the
authorization servers. Just like the previous samples that used only GitHub, you can try
registering your own in order to familiarize yourself with the registration process. For
the various servers, you can visit the developer portals at the following urls.

1. https://www.github.com
2. https://developers.google.com/
3. https://developers.facebook.com/
4. https://forge.autodesk.com

If you're feeling adventerous, you might also look into some other OAuth2 providers and
experiment with expanding this sample. You can find a list (likely not complete) at:

  https://en.wikipedia.org/wiki/List_of_OAuth_providers

If you're curious about other sites that might not be in that list, you can simply do a 
Google search with the name of the server and "OAuth". You'll be surprised at how many
sites support authorization.

Start the server by running "npm start" from the command line.

Point your web browser to "http://localhost:3000". This samples behaves identically to the
previous sample in every way. All of the changes involved code cleanup in both the server
and client that involved use of some popular frameworks.

What's Different?
-----------------

* "server/config.js". Added an additional configuration object for each additional authorization
  server containing the data required for authorization. Also moved the "redirectUri" up to be
  a top level property since, in our case, it is the same for each server.

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
