// The functions in this file are client-side utilities designed to dynamically create the DOM
// elements required for our app to work and to send HTTP requests to interact with the movie
// quote server.
//
// In this sample, we add a "Delete" button to each quote that appears in the favorites list.
// Clicking the button will remove that particular quote from the list. To achieve this, we
// first added another layer to each favorite quote so that instead of just one container with
// the quote and film name, a favorite consists of an outer container which holds a button and
// an inner container which holds the quote data. So now the fully formed HTML looks more like:
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
//       <div class='favorite-quote'>
//         <button>Delete</button>
//         <div class='quote-container'>
//           <div>The quote</div>
//           <div>Film name</div>
//         </div>
//       </div>
//       <div class='favorite-quote'>
//         <button>Delete</button>
//         <div class='quote-container'>
//           <div>The quote</div>
//           <div>Film name</div>
//         </div>
//       </div>
//         :
//       <div class='favorite-quote'>
//         <button>Delete</button>
//         <div class='quote-container'>
//           <div>The quote</div>
//           <div>Film name</div>
//         </div>
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

  // Create the "Add to Favorites" button.
  //
  var favButton = cnt.appendChild(document.createElement('button'));
  favButton.innerHTML = 'Add to Favorites';
  favButton.onclick = postFavoriteHTTP;
}

// This function adds the elements to a container to represent a "favorite" quote.
//
function addFavoriteDOM(container, quoteObj) {

  // Create the favorite quote container. Note the addition of a unique id for the container
  // based on the id field from the quote itself.
  //
  var favoriteDiv = container.appendChild(document.createElement('div'));
  favoriteDiv.id = 'favorite-quote-' + quoteObj.id;
  favoriteDiv.className = 'favorite-quote';

  // Create the "Delete" button and set the function to delete this favorite quote from the list
  // to be called when the button is clicked.
  //
  var delButton = favoriteDiv.appendChild(document.createElement('button'));
  delButton.innerHTML = 'Delete';
  delButton.onclick = deleteFavoriteHTTP;

  // Create the quote container.
  //
  var quoteDiv = favoriteDiv.appendChild(document.createElement('div'));
  quoteDiv.className = 'quote-container';

  // Create the child containers for the quote text and the film the quote came from.
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

  var app = document.getElementById('app');

  var cnt = app.appendChild(document.createElement('div'));
  cnt.className = 'app-container';
  cnt.id = 'favorites-container';

  var hdr = cnt.appendChild(document.createElement('h2'));
  hdr.innerHTML = 'Favorites';

  var req = new XMLHttpRequest();
  req.open('GET', '/favorite-quotes', true);
  req.onload = function() {
    if (this.status == 200) {
      var quotes = JSON.parse(this.responseText);
      quotes.forEach(function(quoteObj, ix) {
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

  var cnt = document.getElementById('favorites-container');

  var quoteObj = {
    quote : document.getElementById('id-quote').childNodes[0].innerHTML,
    film : document.getElementById('id-quote').childNodes[1].innerHTML
  };

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

// This function (called when the "Delete" button is clicked on an individual favorite) sends an
// HTTP request to the server to delete this favorite from the list.
//
function deleteFavoriteHTTP(e) {

  // Fetch the favorites container. We'll need to access the child list in order to delete the
  // DOM elements of the selected quote.
  //
  var cnt = document.getElementById('favorites-container');

  // From the incoming event, we can get the element that generated the event (in this case, the
  // "Delete" button. Since we know how the items were constructed, we know that the immediate
  // parent of the button is the container that holds the entire quote.
  //
  var quoteDiv = e.srcElement.parentElement;

  // We know we used the id of the favorite quote in order to create the id of the quote
  // container. So here we can start with the id of the selected quote and work backwards to
  // arrive at the original quote id.
  //
  var qid = parseInt(quoteDiv.id.split('-')[2]);

  // Create and send our DELETE request to delete the favorite quote on the server. Note that we
  // send the id as a query parameter appending it to the url.
  //
  var req = new XMLHttpRequest();
  req.open('DELETE', '/favorite-quotes?id=' + qid, true);
  req.onload = function() {

    // If the request is successful, remove the child node from the favorites container.
    //
    if (this.status == 200) {
      cnt.removeChild(quoteDiv);
    }
  }
  req.send();
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
