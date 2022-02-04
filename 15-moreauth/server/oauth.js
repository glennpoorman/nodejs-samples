const superagent = require('superagent');
const { makeQuery } = require('./utilities');
const { config : { github, google, facebook, forge } } = require('./config');

// Internal function sets up url string to redirect to GitHub for an authorization code.
//
// Note the added and hard coded "state" property will be passed through to the redirect
// uri upon successful user authentication.
//
function authorizeGithub()
{
  const credentials = {
    client_id : github.credentials.clientId,
    redirect_uri : github.credentials.redirectUri,
    state : 'github'
  };
  return `${github.authorizeEndpoint}?${makeQuery(credentials)}`;
}

// Internal function sets up url string to redirect to Google for an authorization code.
//
// Note the added and hard coded "state" property will be passed through to the redirect
// uri upon successful user authentication.
//
function authorizeGoogle()
{
  const credentials = {
    response_type : 'code',
    client_id : google.credentials.clientId,
    redirect_uri : google.credentials.redirectUri,
    scope : 'openid email',
    state : 'google'
  };
  return `${google.authorizeEndpoint}?${makeQuery(credentials)}`;
}

// Internal function sets up url string to redirect to Facebook for an authorization code.
//
// Note the added and hard coded "state" property will be passed through to the redirect
// uri upon successful user authentication.
//
function authorizeFacebook()
{
  const credentials = {
    client_id : facebook.credentials.clientId,
    redirect_uri : facebook.credentials.redirectUri,
    state : 'facebook'
  };
  return `${facebook.authorizeEndpoint}?${makeQuery(credentials)}`;
}

// Internal function sets up url string to redirect to Forge for an authorization code.
//
// Note the added and hard coded "state" property will be passed through to the redirect
// uri upon successful user authentication.
//
function authorizeForge()
{
  const credentials = {
    client_id : forge.credentials.clientId,
    response_type : 'code',
    redirect_uri : forge.credentials.redirectUri,
    state : 'forge'
  };
  return `${forge.authorizeEndpoint}?${makeQuery(credentials)}`;
}

// The "authorize" function now parses the name of the authorization server to
// use from the incoming query parameters and calls the appropriate function
// based on that parameter.
//
exports.authorize = (req, res) => {

  let urlStr = '/';
  switch (req.query.authServer)
  {
    case 'github':
      urlStr = authorizeGithub();
      break;
    case 'google':
      urlStr = authorizeGoogle();
      break;
    case 'facebook':
      urlStr = authorizeFacebook();
      break;
    case 'forge':
      urlStr = authorizeForge();
      break;
    default:
      res.status(500).json({ error : 'ERROR: bad authorization server' });
      break;
  }

  res.redirect(urlStr);
};

// GitHub specific function sends a POST request to exchange the given authorization
// code for an access token. Upon successful completion, the funciton also sets a
// get request to fetch the id of the currently logged in user. The access token and
// user id are concatenated into a token string that will be sent back as a document
// cookie.
//
async function tokenGitHub(authCode) {

  const { body : { access_token } } = await superagent.post(github.getTokenEndpoint)
    .type('form')
    .set('Accept', 'application/json')
    .send({
      client_id : github.credentials.clientId,
      client_secret : github.credentials.clientSecret,
      code : authCode
    });

  const { body : { id } } = await superagent.get(github.userIdEndpoint)
    .set('User-Agent', 'movie-quotes')
    .set('Authorization', `token ${access_token}`)
    .set('Accept', 'application/json');

  return `${access_token}.${id}`;
};

// Google specific function sends a POST request to exchange the given authorization
// code for an access token. Upon successful completion, the funciton also sets a
// get request to fetch the id of the currently logged in user. The access token and
// user id are concatenated into a token string that will be sent back as a document
// cookie.
//
async function tokenGoogle(authCode) {

  const { body : { access_token } } = await superagent.post(google.getTokenEndpoint)
    .type('form')
    .set('Accept', 'application/json')
    .send({
      grant_type : google.credentials.grantType,
      client_id : google.credentials.clientId,
      client_secret : google.credentials.clientSecret,
      redirect_uri : google.credentials.redirectUri,
      code : authCode
    });

  const { body : { sub } } = await superagent.get(google.userIdEndpoint)
    .set('Authorization', `Bearer ${access_token}`)
    .set('Accept', 'application/json');

  return `${access_token}.${sub}`;
};

// Facebook specific function sends a POST request to exchange the given authorization
// code for an access token. Upon successful completion, the funciton also sets a
// get request to fetch the id of the currently logged in user. The access token and
// user id are concatenated into a token string that will be sent back as a document
// cookie.
//
async function tokenFacebook(authCode) {

  const { body : { access_token } } = await superagent.post(facebook.getTokenEndpoint)
    .type('form')
    .set('Accept', 'application/json')
    .send({
      client_id : facebook.credentials.clientId,
      client_secret : facebook.credentials.clientSecret,
      redirect_uri : facebook.credentials.redirectUri,
      code : authCode
    });

  const { res : { text } } = await superagent.get(facebook.userIdEndpoint)
    .query({ 'access_token' : `${access_token}`})
    .set('Accept', 'application/json');

  const uid = JSON.parse(text).id;
  return `${access_token}.${uid}`;
};

// Forge specific function sends a POST request to exchange the given authorization
// code for an access token. Upon successful completion, the funciton also sets a
// get request to fetch the id of the currently logged in user. The access token and
// user id are concatenated into a token string that will be sent back as a document
// cookie.
//
async function tokenForge(authCode) {

  const { body : { access_token } } = await superagent.post(forge.getTokenEndpoint)
    .type('form')
    .send({
      code : authCode,
      client_id : forge.credentials.clientId,
      client_secret : forge.credentials.clientSecret,
      grant_type : forge.credentials.grantType,
      redirect_uri : forge.credentials.redirectUri
    });

  const { body : { userId } } = await superagent.get(forge.userIdEndpoint)
    .set('Authorization', `Bearer ${access_token}`);

  return `${access_token}.${userId}`;
};

// GET request sent by the authorization server, parse the authorization code from the
// incoming request body and POST a request to the authorization server to exchange that
// code for an access token and return the token as a cookie.

// GET request sent by the authorization server. First we parse the "state" parameter
// from the incoming request (passed through from the authorize function) and use that
// to determine which authorization server was used. Then we parse the "code" parameter
// (the authorization code) and call the appropriate function to fetch the cookie string
// which is sent back and set as a cookie on the web document.
//
exports.sendToken = async (req, res) => {

  try
  {
    let token = '';
    switch (req.query.state) {
      case 'github':
        token = await tokenGitHub(req.query.code);
        break;
      case 'google':
        token = await tokenGoogle(req.query.code);
        break;
      case 'facebook':
        token = await tokenFacebook(req.query.code);
        break;
      case 'forge':
        token = await tokenForge(req.query.code);
        break;
      default:
        res.status(500).json({ error : 'ERROR: bad authorization server' });
        break;
    }

    res.cookie('movie-quote-token', token).redirect('/');
  }
  catch (err)
  {
    res.status(500).json({ error : 'ERROR: getting access token' });
  }
};
