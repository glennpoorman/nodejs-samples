// The functions in this file are client-side utilities designed to dynamically create the DOM
// elements required for our app to work and to send HTTP requests to interact with the movie
// quote server.

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
