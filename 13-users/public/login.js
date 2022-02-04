// The functions in this file are client-side utilities designed to dynamically create
// the DOM elements required for user login on the main login page.

// Redirect to the "/oauth" endpoint when the login button is pushed.
//
function getAuthCode() {

  window.location = '/oauth';
}

// This function is called to create and arrange the elements needed for the user login
// to display and work propertly.
//
function setupLoginDOM() {

  // Fetch the container element for the login elements.
  //
  var cnt = document.getElementById('login');

  // Create a header element for the app title.
  //
  cnt.appendChild(document.createElement('header')).innerHTML = 'Movie Quotes';

  // Create a sub-element for the login button.
  //
  var subCnt = cnt.appendChild(document.createElement('div'));
  subCnt.className = 'login-container';

  // Create a header element with a title and append it to the container.
  //
  subCnt.appendChild(document.createElement('h4')).innerHTML = 'Login with';

  // Create a button append it to the container. The button will be a login button whose style
  // is setup to display animage that can be clicked to login.
  //
  subCnt.appendChild(document.createElement('button')).onclick = getAuthCode;
}

// Called when the HTML page is fully loaded.
//
window.onload = function(e) {

  setupLoginDOM();
}
