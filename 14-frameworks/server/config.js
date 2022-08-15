// Information required for authorization.
//
exports.config = {
  github : {

    authorizeEndpoint : 'https://github.com/login/oauth/authorize',
    getTokenEndpoint : 'https://github.com/login/oauth/access_token',
    userIdEndpoint : 'https://api.github.com/user',
    credentials : {
      clientId : process.env.MOVIE_QUOTES_ID,
      clientSecret : process.env.MOVIE_QUOTES_SECRET,
      redirectUri : 'http://localhost:3000/oauth/code'
    }
  }
};
