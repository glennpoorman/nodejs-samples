// The functions in this file are client-side utilities designed to dynamically create
// the DOM elements required for user login on the main login page.
//
// The fully created login container looks as follows:
//
//   <div id='login'>
//     <header>Movie Quotes</header>
//     <div class='login-container'>
//       <h4>Login with</h4>
//       <button class='login-button'></button>
//     </div>
//   </div>

// This function is set to be called when the login button pushed. The browser will
// be redirected to the "/oauth" route which will send the "/oauth" GET request to
// our server which will then start communicating with the authorization server for
// user authentication.
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

  // Create a button append it to the container. The button will be a login button whose
  // style is setup to display an image that can be clicked to login.
  //
  subCnt.appendChild(document.createElement('button')).onclick = getAuthCode;
}

// Called when the HTML page is fully loaded.
//
window.onload = function() {

  // Call the function to make sure the elements for login are created and setup.
  //
  setupLoginDOM();
}
