// Information required for authorization.
//
exports.config = {

  redirectUri : 'http://localhost:3000/oauth/code',

  github : {

    authorizeEndpoint : 'https://github.com/login/oauth/authorize',
    getTokenEndpoint : 'https://github.com/login/oauth/access_token',
    userIdEndpoint : 'https://api.github.com/user',
    credentials : {
      clientId : '',
      clientSecret : ''
    }
  },

  google : {

    authorizeEndpoint : 'https://accounts.google.com/o/oauth2/v2/auth',
    getTokenEndpoint : 'https://www.googleapis.com/oauth2/v4/token',
    userIdEndpoint : 'https://www.googleapis.com/oauth2/v3/userinfo',
    credentials : {
      clientId : '',
      clientSecret : '',
      responseType : 'code',
      scope : 'openid email',
      grantType : 'authorization_code'
    }
  },

  facebook : {

    authorizeEndpoint : 'https://www.facebook.com/v12.0/dialog/oauth',
    getTokenEndpoint : 'https://graph.facebook.com/v12.0/oauth/access_token',
    userIdEndpoint : 'https://graph.facebook.com/me',
    credentials : {
      clientId : '',
      clientSecret : ''
    }
  },

  forge : {

    authorizeEndpoint : 'https://developer.api.autodesk.com/authentication/v1/authorize',
    getTokenEndpoint : 'https://developer.api.autodesk.com/authentication/v1/gettoken',
    userIdEndpoint : 'https://developer.api.autodesk.com/userprofile/v1/users/@me',
    credentials : {
      clientId : '',
      clientSecret : '',
      responseType : 'code',
      grantType : 'authorization_code'
    }
  }
};
