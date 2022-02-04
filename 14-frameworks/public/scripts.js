// The functions in this file are client-side utilities designed to dynamically create the DOM
// elements required for our app to work and to send HTTP requests to interact with the movie
// quote server.
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

// This function is called to create and arrange the elements needed for this app to work.
//
function setupQuoteDOM() {

  // Fetch the main "app" element from the document and add a header with the title.
  //
  var app = $('#app').append('<header>Movie Quotes</header>');

  // Create the sub container for the random quote display and set its class name.
  //
  var cnt = $('<div>', { class : 'app-container'})
    .appendTo(app);

  // Create the elements for the random quote display.
  //
  $('<div>', { id : 'id-quote', class : 'quote-container movie-quote' })
    .append($('<div>'))
    .append($('<div>'))
    .appendTo(cnt);

  // Create the button to fetch a new quote.
  //
  $('<button>', { click : getQuoteHTTP, html : 'Next Quote' })
    .appendTo(cnt);

  // Create the "Add to Favorites" button.
  //
  $('<button>', { click : postFavoriteHTTP, html : 'Add to Favorites' })
    .appendTo(cnt);

  // Create the "Logout" button.
  //
  $('<button>', { class : 'logout-button', click : logout, html : 'Logout' })
    .appendTo(cnt);
}

// This function adds the elements to a container to represent a "favorite" quote.
//
function addFavoriteDOM(container, quoteObj) {

  // Create the favorite quote container.
  //
  var fav = $('<div>', { id : 'favorite-quote-' + quoteObj.id, class : 'favorite-quote' })
    .append($('<button>', { html : 'Delete', click : deleteFavoriteHTTP }))
    .appendTo(container);

  // Create the underlying quote container and add the quote.
  //
  $('<div>', { class : 'quote-container'})
    .append($('<div>', { html : quoteObj.quote }))
    .append($('<div>', { html : quoteObj.film }))
    .appendTo(fav);
}

// This function (called when the "Next Quote" button is pushed) sends an HTTP request to the
// server for a random quote and displays it in the DOM.
//
function getQuoteHTTP() {

  $.get({
    url : '/movie-quote',
    success : function(res) {
      $('#id-quote').children()[0].innerHTML = res.quote;
      $('#id-quote').children()[1].innerHTML = res.film;
    }
  });
}

// This function (called on document load) sends an HTTP request to the server for all of the
// current favorite quotes and displays them in the favorites list.
//
function getFavoritesHTTP() {

  var app = $('#app');

  var cnt = $('<div>', { id : 'favorites-container', class : 'app-container' })
    .appendTo(app);

  cnt.append($('<h2>', { html : 'Favorites'}));

  $.get({
    url : '/favorite-quotes',
    success : function(res) {
      res.forEach(function(quoteObj) {
        addFavoriteDOM(cnt, quoteObj);
      });
    }
  });
}

// This function (called when "Add to Favorites" button is clicked) sends an HTTP request to the
// server to add (post) the current random quote to the list of favorite quotes.
//
function postFavoriteHTTP() {

  var cnt = $('#favorites-container');

  var quoteObj = {
    quote : $('#id-quote').children()[0].innerHTML,
    film : $('#id-quote').children()[1].innerHTML
  };

  $.post({
    url : '/favorite-quotes',
    contentType : 'application/json',
    data : JSON.stringify(quoteObj),
    success : function(res) {
      addFavoriteDOM(cnt, res);
    }
  });
}

// This function (called when the "Delete" button is clicked on an individual favorite) sends an
// HTTP request to the server to delete this favorite from the list.
//
function deleteFavoriteHTTP(e) {

  var quoteDiv = $(e.target).parent();
  var qid = parseInt(quoteDiv.attr('id').split('-')[2]);

  $.ajax({
    url : '/favorite-quotes?id=' + qid,
    type : 'DELETE',
    success : function(res) {
      quoteDiv.remove();
    }
  });
}

// Function checks to see if the user is logged in by looking for a document cookie
// named "movie-quote-token" and verifying the format.
//
function loggedIn() {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var ca = cookies[i].split('=');
    if (ca[0].trim() === 'movie-quote-token') {
      return true;
    }
  }
  return false;
}

// Function logs the user out by locating the "movie-quote-token" and marking it as
// expired/deleted.
//
function logout() {
  document.cookie = 'movie-quote-token=deleted; expires=' + new Date(0).toUTCString();
  window.location.replace('./login.html');
}

// Called when the HTML page is full loaded.
//
$(function() {

  if (!loggedIn()) {
    window.location.replace('./login.html');
  } else {

    setupQuoteDOM();
    getQuoteHTTP();
    getFavoritesHTTP();
  }
});
