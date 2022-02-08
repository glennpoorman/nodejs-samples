// Information required for authorization.
//
exports.config = {
  github : {

    authorizeEndpoint : 'https://github.com/login/oauth/authorize',
    getTokenEndpoint : 'https://github.com/login/oauth/access_token',
    userIdEndpoint : 'https://api.github.com/user',
    credentials : {
      clientId : 'd5c7d869f0f9154f9d7e',
      clientSecret : '018ad4eb166c1287e66c02c48b8a6f7131e7a4a0',
      redirectUri : 'http://localhost:3000/oauth/code'
    }
  }
};
