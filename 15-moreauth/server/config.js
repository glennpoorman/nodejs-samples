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
  },

  google : {

    authorizeEndpoint : 'https://accounts.google.com/o/oauth2/v2/auth',
    getTokenEndpoint : 'https://www.googleapis.com/oauth2/v4/token',
    userIdEndpoint : 'https://www.googleapis.com/oauth2/v3/userinfo',
    credentials : {
      clientId : '959078872917-saukhj6liilvq7kfudhum95s7m6qoq4p.apps.googleusercontent.com',
      clientSecret : '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',
      grantType : 'authorization_code',
      redirectUri : 'http://localhost:3000/oauth/code'
    }
  },

  facebook : {

    authorizeEndpoint : 'https://www.facebook.com/v12.0/dialog/oauth',
    getTokenEndpoint : 'https://graph.facebook.com/v12.0/oauth/access_token',
    userIdEndpoint : 'https://graph.facebook.com/me',
    credentials : {
      clientId : '466405378347985',
      clientSecret : 'e031eccb0e39f3751a6ee9b631bb0584',
      redirectUri : 'http://localhost:3000/oauth/code'
    }
  },

  forge : {

    authorizeEndpoint : 'https://developer.api.autodesk.com/authentication/v1/authorize',
    getTokenEndpoint : 'https://developer.api.autodesk.com/authentication/v1/gettoken',
    userIdEndpoint : 'https://developer.api.autodesk.com/userprofile/v1/users/@me',
    credentials : {
      clientId : 'kv3c8LacvzmuKdiFpXz36Gr4VAgB0pYS',
      clientSecret : 'rXmTWlG4xWKfmE3b',
      grantType : 'authorization_code',
      redirectUri : 'http://localhost:3000/oauth/code'
    }
  }
};
