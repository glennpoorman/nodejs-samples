// The functions in this file are client-side utilities designed to dynamically create the DOM
// elements required for our app to work and to send HTTP requests to interact with the movie
// quote server.
//
// In addition to the random quote from the last sample, this sample adds a "favorites" list and
// an "Add to Favorites" button that will add the current favorite quote to the favorites list.
//
// In the previous sample, the elements needed for the quote were contained in the div element
// with the id "app". Since we're going to add an additional container for a favorites list,
// this sample will add another layer (a sub div) to the main container for the quote and then
// another sub div for the favorites list. So now the fully formed HTML with both the random
// quote and favorites list will look like:
//
//   <div id='app'>
//     <header>Movie Quotes</header>
//     <div class='app-container'>
//       <div id='id-quote' class='quote-container movie-quote'>
//         <div>The quote</div>
//         <div>Film name</div>
//       </div>
//       <button>Next Quote</button>
//       <button>Add to Favorites</button>
//     </div>
//     <div id='favorites-container' class='app-container'>
//       <h2>Favorites</h2>
//       <div class='quote-container favorite-quote'>
//         <div>The quote</div>
//         <div>Film name</div>
//       </div>
//       <div class='quote-container favorite-quote'>
//         <div>The quote</div>
//         <div>Film name</div>
//       </div>
//         :
//       <div class='quote-container favorite-quote'>
//         <div>The quote</div>
//         <div>Film name</div>
//       </div>
//     </div>
//   </div>

// This function is called to create and arrange the elements needed for this app to work.
//
function setupQuoteDOM() {

  // Fetch the main "app" element from the document.
  //
  var app = document.getElementById('app');

  // Create a header element for the app title.
  //
  app.appendChild(document.createElement('header')).innerHTML = 'Movie Quotes';

  // Create the sub container for the random quote display and set its class name.
  //
  var cnt = app.appendChild(document.createElement('div'));
  cnt.className = 'app-container';

  // Create the elements for the random quote display.
  //
  var quoteDiv = cnt.appendChild(document.createElement('div'));
  quoteDiv.id = 'id-quote';
  quoteDiv.className = 'quote-container movie-quote';
  quoteDiv.appendChild(document.createElement('div'));
  quoteDiv.appendChild(document.createElement('div'));

  // Create the button to fetch a new quote.
  //
  var getButton = cnt.appendChild(document.createElement('button'));
  getButton.innerHTML = 'Next Quote';
  getButton.onclick = getQuoteHTTP;

  // Additionally add the button "Add to Favorites" allowing the current random quote to be
  // added to the favorites list.
  //
  var favButton = cnt.appendChild(document.createElement('button'));
  favButton.innerHTML = 'Add to Favorites';
  favButton.onclick = postFavoriteHTTP;
}

// This utility function adds the elements to a container to represent a "favorite" quote in the
// favorites list. We do this when populating the entire list and also when adding a new favorite
// so it gets called from two places.
//
function addFavoriteDOM(container, quoteObj) {

  // Create the container for the entire quote and set its class name.
  //
  var quoteDiv = container.appendChild(document.createElement('div'));
  quoteDiv.className = 'quote-container favorite-quote';

  // Create the child containers for the actual quote text and also the film the quote came from
  // and set the text using the input quote.
  //
  quoteDiv.appendChild(document.createElement('div')).innerHTML = quoteObj.quote;
  quoteDiv.appendChild(document.createElement('div')).innerHTML = quoteObj.film;
}

// This function (called when the "Next Quote" button is pushed) sends an HTTP request to the
// server for a random quote and displays it in the DOM.
//
function getQuoteHTTP() {

  var quoteDiv = document.getElementById('id-quote');

  var req = new XMLHttpRequest();
  req.open('GET', '/movie-quote', true);
  req.onload = function() {
    if (this.status == 200) {
      var quoteObj = JSON.parse(this.responseText);
      quoteDiv.childNodes[0].innerHTML = quoteObj.quote;
      quoteDiv.childNodes[1].innerHTML = quoteObj.film;
    }
  };
  req.send();
}

// This function (called on document load) sends an HTTP request to the server for all of the
// current favorite quotes and displays them in the favorites list.
//
function getFavoritesHTTP() {

  // Fetch the main "app" element from the document.
  //
  var app = document.getElementById('app');

  // Add a sub container that will hold the favorites list and set the class name and id.
  //
  var cnt = app.appendChild(document.createElement('div'));
  cnt.className = 'app-container';
  cnt.id = 'favorites-container';

  // Add a header and title to the container.
  //
  var hdr = cnt.appendChild(document.createElement('h2'));
  hdr.innerHTML = 'Favorites';

  // Make the GET request for the favorites. On successful return, loop through the favorites and
  // add the DOM elements for each one to the favorites list.
  //
  var req = new XMLHttpRequest();
  req.open('GET', '/favorite-quotes', true);
  req.onload = function() {
    if (this.status == 200) {
      var quotes = JSON.parse(this.responseText);
      quotes.forEach(function(quoteObj) {
        addFavoriteDOM(cnt, quoteObj);
      });
    }
  };
  req.send();
}

// This function (called when "Add to Favorites" button is clicked) sends an HTTP request to the
// server to add (post) the current random quote to the list of favorite quotes.
//
function postFavoriteHTTP() {

  // Fetch the favorite quotes container element.
  //
  var cnt = document.getElementById('favorites-container');

  // Create a new quote object by fetching the random quote container and then getting the text
  // from the two child elements.
  //
  var quoteObj = {
    quote : document.getElementById('id-quote').childNodes[0].innerHTML,
    film : document.getElementById('id-quote').childNodes[1].innerHTML
  };

  // Make the POST request to the server to add the quote object to the favorites list. On
  // successful return, fetch the quote from the body of the response (should be identical to the
  // one we sent in) and add that quote to the favorites list.
  //
  var req = new XMLHttpRequest();
  req.open('POST', '/favorite-quotes', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.onload = function() {
    if (this.status == 201) {
      addFavoriteDOM(cnt, JSON.parse(this.responseText));
    }
  };
  req.send(JSON.stringify(quoteObj));
}

// Called when the HTML page is full loaded.
//
window.onload = function() {

  // Setup random quote DOM elements.
  //
  setupQuoteDOM();

  // Get and display the first random quote.
  //
  getQuoteHTTP();

  // Get and display the list of favorite quotes.
  //
  getFavoritesHTTP();
}
