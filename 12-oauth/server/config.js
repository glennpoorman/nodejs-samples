// The information below is information required for authorization. The URLs are the GitHub
// endpoints we need to send authorization requests to. The client id and client secret need
// to be obtained from the GitHub portal when the application is registered. Client secrets
// should never be submitted to a code repository unencrypted. to register the application
// with GitHub, follow these steps.
//
//  1. Login to GitHub.
//  2. In the menu under your profile picture, select "Settings".
//  3. Scroll down and, at the bottom of the left pane, select "Developer Settings".
//  4. Select "OAuth Apps".
//  5. Any apps you've already registered will be shown.
//  6. In the upper left corner, select "New OAuth App".
//  7. Fill in the application name "movie-quotes".
//  8. Fill in the Homepage URL "http://localhost:3000".
//  9. Fill in the Authorization callback URL "http://localhost:3000/oauth/code"
// 10. Click the "Register application" button.
// 11. On the next page, make a note of the Client ID.
// 12. Click "Generate a new client secret" (you may need to re-enter password).
// 13. Make a note of the generated client secret.
// 14. Make sure the app is saved/updated in the web portal.
//
// Note that the object is setup so that adding additional authentication sights (i.e. Google,
// Facebook, etc) would just be a matter of adding additional object inside the "config" object.
//
//   i.e. config.facebook, config.google, etc.
//
exports.config = {
  github : {

    authorizeEndpoint : 'https://github.com/login/oauth/authorize',
    getTokenEndpoint : 'https://github.com/login/oauth/access_token',
    credentials : {
      clientId : '',
      clientSecret : '',
      redirectUri : 'http://localhost:3000/oauth/code'
    }
  }
};
