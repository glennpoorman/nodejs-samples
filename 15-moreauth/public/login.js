// The functions in this file are client-side utilities designed to dynamically create
// the DOM elements required for user login on the main login page.

// Redirect to the "/oauth" endpoint when the login button is pushed.
//
function getAuthCode() {

  // Note that in this sample, we fetch the id from the button that was pushed to get
  // here and pass it along to the server as a query parameter named "authServer".
  // The server will use that parameter to determine which authorization server to use
  // for user authorization.
  //
  window.location = '/oauth?authServer=' + $(this).prop('id');
}

// This function is called to create and arrange the elements needed for the user login
// to display and work propertly.
//
function setupLoginDOM() {

  // Fetch the container element for the login elements and add a header with the title.
  //
  var cnt = $('#login').append('<header>Movie Quotes</header>');

  // Create a sub-element for the login button.
  //
  var subCnt = $('<div>', { class : 'login-container'}).appendTo(cnt);

  // Create a header element with a label and append it to the container.
  //
  $('<h4>').html('Login with')
    .appendTo(subCnt);

  // Create the buttons for the four possible authorization servers the user can
  // use to login. Note that we set an id for each button matching the identifier
  // the server expects to identify the authorization server to use.
  //
  $('<button>', { id : 'github', click : getAuthCode })
    .appendTo(subCnt);
  $('<button>', { id : 'google', click : getAuthCode })
    .appendTo(subCnt);
  $('<button>', { id : 'facebook', click : getAuthCode })
    .appendTo(subCnt);
  $('<button>', { id : 'forge', click : getAuthCode })
    .appendTo(subCnt);
}

// Called when the HTML page is fully loaded.
//
$(function() {

  setupLoginDOM();
});
