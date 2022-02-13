const { getBody, makeQuery, redirectTo, sendJSON, setCookie, httpsRequest, httpsGet } = require('./utilities');
const { config : { github } } = require('./config');

// Redirect the client to the authorization server for user authorization.
//
exports.authorize = (req, res) => {

  const credentials = {
    client_id : github.credentials.clientId,
    redirect_uri : github.credentials.redirectUri
  };

  const urlStr = `${github.authorizeEndpoint}?${makeQuery(credentials)}`;
  redirectTo(res, urlStr);
};

// GET request sent by the authorization server, parse the authorization code from the
// incoming request body and POST a request to the authorization server to exchange that
// code for an access token and return the token as a cookie.
//
// In this sample we add one extra step. After exchanging the authorization token for an
// access token, we make one additional call to the authorization server to fetch the user
// data associated with the access token and return the user id as part of the cookie.
//
// Note that we've added a promise-ready version of "https.request" to our "utilities" module
// and also a promise-ready version of the "https.get" function. We use both of those functions
// here which makes the code read much cleaner. To that end, this entire function is marked
// with the "async" keyword.
//
exports.sendToken = async (req, res) => {

  try
  {
    const url = new URL(req.url, `http://${req.headers.host}/`);

    const postOptions = {
      method : 'POST',
      headers : { 'Content-Type' : 'application/x-www-form-urlencoded', 'Accept' : 'application/json' }
    };

    const postData = {
      client_id : github.credentials.clientId,
      client_secret : github.credentials.clientSecret,
      code : url.searchParams.get('code')
    };

    // Make the asynchronous call to the promise-ready request function to post the
    // request exchanging the authorization code for the access token. Upon completion,
    // call the asynchronous function to fetch the response body and parse the string
    // into the token object.
    //
    const postRes = await httpsRequest(github.getTokenEndpoint, postOptions, makeQuery(postData));
    const tokenBody = await getBody(postRes);
    const tokenObj = JSON.parse(tokenBody);

    // With the access token returned, here we make a new HTTP get request to the
    // authorization server. This request passes the access token in as a header and
    // asks the server to return an object containing all of the user data pertaining
    // to the owner of that token.
    //
    // NOTE: Some of the requirements for these requests vary from server to server.
    //       In this case, GitHub requires the "User-Agent" header containing the name
    //       of the app as well as the specific format of the "Authorization" header.
    //       Read the documentation for the specific servers you use to make sure you
    //       have the requests exactly correct.
    //
    const getOptions = { headers : { 'User-Agent' : 'movie-quotes',
                                     'Authorization' : `token ${tokenObj.access_token}`,
                                     'Accept' : 'application/json'}};
    const getRes = await httpsGet(github.userIdEndpoint, getOptions);
    const idBody = await getBody(getRes);
    const idObj = JSON.parse(idBody);

    // Return the cookie. In this sample, the cookie is the access token plus the unique
    // user id returned from the authorization server separated with a period '.'. Later
    // when we need to access the user's personal favorites list, we'll access the cookie
    // in the incoming requests, strip off the user id, and use that id to reference the
    // appropriate favorites data.
    //
    setCookie(res, 'movie-quote-token', `${tokenObj.access_token}.${idObj.id}`);
    redirectTo(res, '/');
  }
  catch (e)
  {
    sendJSON(res, 500, { error : e.message });
  }
};
