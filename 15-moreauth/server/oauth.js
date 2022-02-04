const superagent = require('superagent');
const { makeQuery } = require('./utilities');
const { config } = require('./config');

// Internal function sets up url string to redirect to GitHub for an authorization code.
//
// Note the added and hard coded "state" property will be passed through to the redirect
// uri upon successful user authentication.
//
function authorizeGithub()
{
  const credentials = {
    client_id : config.github.credentials.clientId,
    redirect_uri : config.redirectUri,
    state : 'github'
  };
  return `${config.github.authorizeEndpoint}?${makeQuery(credentials)}`;
}

// Internal function sets up url string to redirect to Google for an authorization code.
//
// Note the added and hard coded "state" property will be passed through to the redirect
// uri upon successful user authentication.
//
function authorizeGoogle()
{
  const credentials = {
    client_id : config.google.credentials.clientId,
    response_type : config.google.credentials.responseType,
    scope : config.google.credentials.scope,
    redirect_uri : config.redirectUri,
    state : 'google'
  };
  return `${config.google.authorizeEndpoint}?${makeQuery(credentials)}`;
}

// Internal function sets up url string to redirect to Facebook for an authorization code.
//
// Note the added and hard coded "state" property will be passed through to the redirect
// uri upon successful user authentication.
//
function authorizeFacebook()
{
  const credentials = {
    client_id : config.facebook.credentials.clientId,
    redirect_uri : config.redirectUri,
    state : 'facebook'
  };
  return `${config.facebook.authorizeEndpoint}?${makeQuery(credentials)}`;
}

// Internal function sets up url string to redirect to Forge for an authorization code.
//
// Note the added and hard coded "state" property will be passed through to the redirect
// uri upon successful user authentication.
//
function authorizeForge()
{
  const credentials = {
    client_id : config.forge.credentials.clientId,
    response_type : config.forge.credentials.responseType,
    redirect_uri : config.redirectUri,
    state : 'forge'
  };
  return `${config.forge.authorizeEndpoint}?${makeQuery(credentials)}`;
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

  const { body : { access_token } } = await superagent.post(config.github.getTokenEndpoint)
    .type('form')
    .set('Accept', 'application/json')
    .send({
      client_id : config.github.credentials.clientId,
      client_secret : config.github.credentials.clientSecret,
      code : authCode
    });

  const { body : { id } } = await superagent.get(config.github.userIdEndpoint)
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

  const { body : { access_token } } = await superagent.post(config.google.getTokenEndpoint)
    .type('form')
    .set('Accept', 'application/json')
    .send({
      grant_type : config.google.credentials.grantType,
      client_id : config.google.credentials.clientId,
      client_secret : config.google.credentials.clientSecret,
      redirect_uri : config.redirectUri,
      code : authCode
    });

  const { body : { sub } } = await superagent.get(config.google.userIdEndpoint)
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

  const { body : { access_token } } = await superagent.post(config.facebook.getTokenEndpoint)
    .type('form')
    .set('Accept', 'application/json')
    .send({
      client_id : config.facebook.credentials.clientId,
      client_secret : config.facebook.credentials.clientSecret,
      redirect_uri : config.redirectUri,
      code : authCode
    });

  const { res : { text } } = await superagent.get(config.facebook.userIdEndpoint)
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

  const { body : { access_token } } = await superagent.post(config.forge.getTokenEndpoint)
    .type('form')
    .send({
      code : authCode,
      client_id : config.forge.credentials.clientId,
      client_secret : config.forge.credentials.clientSecret,
      grant_type : config.forge.credentials.grantType,
      redirect_uri : config.redirectUri
    });

  const { body : { userId } } = await superagent.get(config.forge.userIdEndpoint)
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
