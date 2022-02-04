// The functions in this file are client-side utilities designed to dynamically create
// the DOM elements required for user login on the main login page.
//
// In this sample, we use jQuery to simplify our interactions with the DOM. jQuery has been around
// a long time and while it is used to simplify just about every aspect of the JavaScript language,
// it is especially useful when working with the HTML DOM and also interacting with Ajax. For more
// complex client side code, jQuery has pretty much been replaced by much more powerful frameworks
// such as Angular and React. jQuery still has its place though as it is exceptionally easy to
// learn and deploy making it incredibly useful for rapid prototyping and small samples/projects
// such as these. The other area where jQuery excels is in hiding the idiosyncrasies of various
// browsers allowing you to code once and work uniformly among different versions of different
// browsers.
//
// Note that the jQuery object "$" is used to wrap DOM elements and can be created in a number
// of ways such as:
//
//   $('<div>') - create a DIV element and return wrapped in a jQuery object.
//   $('#some-id') - get an element in the document with the id 'some-id'.
//   $('.some-class') - get all elements with class 'some-class'.
//   $(dom-el) - wrap native DOM element 'dom-el' with jQuery object.
//
// Also note that all Ajax interaction can be done via the $.ajax function. In addition, jQuery
// provides the $.get and $.post functions that simply call into $.ajax with the hard coded request
// types 'GET' and 'POST'.
//
// This is just the tip of the iceberg. I can't really do justice to what jQuery provides and
// consider it well beyond the scope of these samples.

// Redirect to the "/oauth" endpoint when the login button is pushed.
//
function getAuthCode() {

  window.location = '/oauth';
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

  // Create a the login button and append it to the container.
  //
  $('<button>', { click : getAuthCode })
    .appendTo(subCnt);
}

// Called when the HTML page is fully loaded.
//
$(function() {

  setupLoginDOM();
});
