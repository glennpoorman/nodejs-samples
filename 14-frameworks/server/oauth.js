const superagent = require('superagent');
const { makeQuery } = require('./utilities');
const { config : { github } } = require('./config');

// Redirect the client to the authorization server for user authorization.
//
exports.authorize = (req, res) => {

  const credentials = {
    client_id : github.credentials.clientId,
    redirect_uri : github.credentials.redirectUri
  };

  // Note below that we've replaced use of our old "redirectTo" utility with a call to the
  // "redirect" method on the response provided by "Express".
  //
  const urlStr = `${github.authorizeEndpoint}?${makeQuery(credentials)}`;
  res.redirect(urlStr);
};

// GET request sent by the authorization server, parse the authorization code from the
// incoming request body and POST a request to the authorization server to exchange that
// code for an access token and return the token as a cookie.
//
// This function is quite a bit different than before. Here we use the "superagent" framework
// for sending HTTP requests. The "body-parser" middleware still comes into play as well
// collecting response bodies before getting into any of our callback code.
//
exports.sendToken = async (req, res) => {

  try
  {
    // There is a LOT going on here so let's break it down.
    //
    // We call "superagent.post" to send a POST request to the "getTokenEndpoint" in order
    // to exchange our authorization code for an access token.
    //
    // The call to ".type" specifies that the content type is "application/x-www-form-urlencoded"
    // as opposed to the default "application/json".
    //
    // The call to ".set" sets the header property "Accept" to make sure the response is in
    // the form of a JSON object.
    //
    // The ".send" call fills in the request body data. Note that we never parsed the incoming
    // url to get the authorization code. Again, the "body-parser" module took care of this
    // for us allowing us to simply access the code via "req.query.code".
    //
    // When using the "await" keyword in an "async" function, the return value from all of
    // this is a response. We know that "body-parser" will kick in and assemble the entire
    // response in the "body" property before control ever gets back to us so note in the
    // return that we use object destructuring to create a local variable "access_token"
    // that will be the equivalent of "res.body.access_token".
    //
    const { body : { access_token } } = await superagent.post(github.getTokenEndpoint)
      .type('form')
      .set('Accept', 'application/json')
      .send({
        client_id : github.credentials.clientId,
        client_secret : github.credentials.clientSecret,
        code : req.query.code
      });

    // With the access token in hand from the previous request, we use "superagent" again
    // to make a GET request to fetch the user information associated with this access token.
    //
    // Again safe in the knowled ge that "body-parser" has collected the entire response
    // before we get back here, we use object destructuring again to create a local variable
    // "id" equivalent to "res.body.id".
    //
    const { body : { id } } = await superagent.get(github.userIdEndpoint)
      .set('User-Agent', 'movie-quotes')
      .set('Authorization', `token ${access_token}`)
      .set('Accept', 'application/json');

    // With the access token and user id in hand, set the cookie on the response. Note
    // that instead of our utility for this, we use the "express" method "cookie" to
    // set the cookie data. Lastly we call the "redirect" function to send the caller
    // back to the main page.
    //
    res.cookie('movie-quote-token', `${access_token}.${id}`).redirect('/');
  }
  catch (err)
  {
    res.status(500).json({ error : 'getting access token' });
  }
};
