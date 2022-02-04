oauth
-----

This sample extends the "movie-quotes" sample and provides a "Login" button requiring
users to authenticate before being allowed to access the movie quotes app and favorites
list. Instead of implementing authentication and maintaining user information, we'll use
an external authorization server to do user authorization via OAuth2.

OAuth2 is the industry standard authorization protocol. Using OAuth2, an authorization
server (Facebook, Google, etc) can be used to allow a third party application (like our
movie quotes app) access to resources on behalf of an authorized user. Before we dig much
further into OAuth2, it's important to note the distinction between authorization and
authentication. We'll be throwing both words around and they are often confused with one
another. Authentication refers to the act of verifying who a user is (asking for a login
name, password, and verifying that they match what the server has on record). Authorization
means getting permission to access resources on behalf of that user. While OAuth2 is a 
full blown authorization protocol, it's not uncommon for third party applications to use
an OAuth2 server strictly for authentication. In other words, verifying who a user is
just to let them in the door but not actually accessing anything that belongs to them.

OAuth2 provides both "two-legged" and "three-legged" authorization.

1. Two-legged authorization is used when an application needs to call APIs on an authorization
   or resource server but doesn't need to access any resources that require the explicit
   permission of a given user. In that case, the client application would quietly authorize
   itself using a client id and client secret assigned by the authorization server at the
   time the application is registered (more on that in a minute). The end user doesn't need
   to be aware of the authorization or provide any credentials for the application to do what
   it needs to do. This kind of flow is called "two-legged" because the client application and
   the authorization server are the two "legs".

2. Three-legged authorization is used when an application needs to access resources belonging
   to a specific user and that user must explicitly provide authorization. This is typically
   done by redirecting the user to a login page on the authorization server which then prompts
   for credentials. Once the user is successfully logged in, they are redirected back to the
   applicaton which has now been granted access to resouces owned by that user. This kind of
   flow is called "three-legged" because the server application, the authorization server, and
   the end user make up the three "legs".

Consider you're browsing videos on YouTube and you see one that you want to share on your
Facebook timeline. You hit the "Share on Facebook" button at which point you're prompted to
login to Facebook (unless you're already logged in). Once you're logged in, the YouTube app
has permission to access your Facebook timeline and add a post to it.

In this sample, we'll take a first pass at OAuth2 using an authorization server strictly for
authentication. In other words, we'll ask anyone attempting to use the movie quotes app to
login at which point we'll allow them to generate quotes and add to the favorites list but
we won't be accessing any of their resources on the authorization server. Since these samples
are all posted to GitHub, we'll use GitHub as our authorization server. Since we require a 
user to login, we'll be using three-legged authorization.

The typical OAuth2 authorization flow looks as follows:

  1. Client app redirects to authorization server.
  2. User provides credentials for authentication.
  3. On success, authorization server redirects back to client app with an authorization code.
  4. Client application uses code to ask authorization server for access token.
  5. Access can be used to access resources on behalf of user.

What this app does
------------------

Any application that wants to use an external authorization server must register with that
server. This is a one time registration that the app developer does and is generally done
through a web portal. There is no standard and they all handle it a little differently so
we'll focus on GitHub since that's the server we're using for this sample.

  1. Login to GitHub.
  2. In the menu under your profile picture, select "Settings".
  3. Scroll down and, at the bottom of the left pane, select "Developer Settings".
  4. Select "OAuth Apps".
  5. Any apps you've already registered will be shown.
  6. In the upper left corner, select "New OAuth App".
  7. Fill in the application name "movie-quotes".
  8. Fill in the Homepage URL "http://localhost:3000".
  9. Fill in the Authorization callback URL "http://localhost:3000/oauth/code"
 10. Click the "Register application" button.
 11. On the next page, make a note of the Client ID.
 12. Click "Generate a new client secret" (you may need to re-enter password).
 13. Make a note of the generated client secret.
 14. Make sure the app is saved/updated in the web portal.

When the movie quotes app is run, the following steps occur before the user is allowed
into the app.

  1. The main page checks the user login status by attempting to locate an access token
     in a document cookie unique to this application (more on this later). If no such
     cookie exists or has expired, the user is redirected to a login page.

  2. On the login page, user selects the login button which redirects the user to a new
     route added to the movie quotes app "http://localhost:3000/oauth".

  3. The new "oauth" route redirects to the GitHub authorization endpoint passing along
     the client id and redirect url as query parameters. The client id was issued when
     the app was registered and the redirect url must match the url registered with the
     app as the "Authorization callback URL". If the query parameters are correct, the
     GitHub endpoint authenticates the user (prompts for id/password).

  4. Upon successful authentication, GitHub redirects to the redirect url we provided and
     passes along an authorization code in a query parameter. The redirect url is another
     new route added to the movie quotes app "http://localhost:3000/oauth/code".

  5. The new "oauth/code" route sends a POST request containing the authorization code,
     our client id, and our client secret back to GitHub in order to exchange the
     authorization code for an access token. Upon successful completion of that request,
     our server returns the access token to the client (browser) setting it as a cookie
     on the web page (the cookie we looked for in step #1).

  6. We look for that cookie any time the browser is directed to "http://localhost:3000"
     in order to determined if the user is logged in. That way don't re-authenticate
     every time you point your browser to that page within a session. Right now, the cookie
     expires when you close your browser. You could add an expiration date to the cookie
     so that it remains valid longer.

  7. The "Logout" button on the main quotes page essentially logs the user out by locating
     the cookie in the web page and marking it as expired.

Try It
------

Before you can run this app, you need to register with GitHub. I had originally intended to
provide information such that you could use the sample I registered but opted to have the
reader do this for two reasons. The first is that it's good practice. The second is that it
required me to submit the client id and secret which, while harmless in this sample, should
never be done. So before you run anything, follow the instructions above on registering the
sample with GitHub and then fill in the client id and secret in "server/config.js".

Start the server by running "node" or "npm start" from the command line.

Point your web browser to "http://localhost:3000". In this case, instead of going directly to
the movie quotes page, a login page is displayed with a single "Login with GitHub" button. In
order to proceed, the user must have a valid GitHub login/account and must login to GitHub.
Upon successful login, the browser proceeds to the same quotes page as was displayed in the
previous sample. In this case, however, there is also a "Logout" button over on the right side
of the quote which will log the user out and direct the browser to return to the original login
page.

What's Different?
-----------------

* "server/utilities.js". The new "redirectTo" utility sends a response specifically designed
  to cause the caller to redirect to another page/URL. We use this function in two places while
  authorizing. Once when redirecting to the authorization server to get an authorization code
  and again after we get the token when we redirect the caller to the main quotes page and set
  the cookie on the web page.

  The new "setCookie" utility writes a cookie name and data into a response header so that the
  cookie is recorded into the calling client's web document.

  The new "makeQuery" utility takes a Javascript object and returns a URL query string based
  on the key/value pairs in the original object.

* "server/config.js". This file contains an informational object "config" which contains all
  of the data necessary for authorization. The data includes the URLs to send our authorization
  requests to as well as information obtained when we registered our app (the client id and
  the client secret).

* "server/oauth.js". This file is newly added to handle all authorization routes.

  The "authorize" function is called when a GET request is sent to "/oauth". This is the
  function that packages up the app credentials and redirects to the authorization server in
  order to prompt for user credentials. A redirect URL "/oauth/code" is specified to be called
  upon successful authorization.

  The "sendToken" function is called when a GET request is sent to "/oauth/code" (called from
  the authorization server upon successful user authorization). This function parses the
  incoming authorization code sent from the authorization server and then makes a POST request
  to the authorization server to exchange the code for an access token. If the exchange is
  successful, we redirect the client back to the main page and set the token as a cookie on the
  web page.

* "server/server.js". Code was added to handle GET requests for "/oauth" and "/oauth/code".

* "public/login.html". A new HTML file. the main "index.html" will redirect here if the user
  is not currently logged in. This page will present a "login" button allowing the user to
  login using GitHub.

* "public/login.js". This file is loaded into "login.html" when the page is loaded. The script
  sets up the DOM with the button used to login to GitHub. The script also contains the function
  called when the login buttin is pushed. That function redirects the browser to the "/oauth"
  route which will cause the server to start communicating with the authorization server.

* "public/scripts.js". This is still the file used for scripting the main quotes page.

  Added the "loggedIn" function which looks through all of the cookies set on the document,
  checks if any of them are our "movie-quote-token" cookie, and returns true if that cookie
  is found signaling that the user is logged in.

  Added the "logout" function. The function logs the user out by locating our movie quote
  token and marking it as expired making it no longer valid.

  In the function "setupQuoteDOM", we add a "Logout" button which, when pressed, will call
  our newly added "logout" function to log the user out and redirect back to the login page.

  In the load function "window.onload", we now call our new utility to see if the user is
  logged in. If they are, we go ahead and display the quotes elements. If they are not, we
  redirect the browser to the login page.
