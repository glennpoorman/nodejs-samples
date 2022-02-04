// The functions in this file are client-side utilities designed to dynamically create the DOM
// elements required for our app to work and to send HTTP requests to interact with the movie
// quote server. You can get as carried away as you want with regards to what is hard coded into
// the HTML and what is created on the fly.
//
// The fully created HTML for getting movie quotes looks as follows:
//
//   <div id='app'>
//     <header>Movie Quotes</header>
//     <div class='app-container'>
//       <div id='id-quote' class='movie-quote'>
//         <div>The quote</div>
//         <div>File name</div>
//       </div>
//       <button>Next Quote</button>
//     </div>
//   </div>
//
// Note that the HTML only contains the initial div element with nothing inside. I chose to only
// require the single div element in the HTML and let the scripts take care of creating the rest
// on document load. You could have just as easily put everything right in the HTML and only put
// the callback here in the script file.
//
// Also note a completely optional naming convention that I used here. I added DOM to the end of
// function names that are primarily designed to interact with the DOM and added HTTP to the end
// of function names that are designed to send HTTP requests.

// This function is called to create and arrange the elements needed for this app to work.
//
function setupQuoteDOM() {

  // Fetch the main "app" element from the document.
  //
  var app = document.getElementById('app');

  // Create a header element for the app title.
  //
  app.appendChild(document.createElement('header')).innerHTML = 'Movie Quotes';

  // Create the container element for the quote and button.
  //
  var cnt = app.appendChild(document.createElement('div'));
  cnt.className = 'app-container';

  // Create the DIV element to hold the quote. Assign it the id "id-quote" and the class name
  // "main-quote". Add it as a child element to the container.
  //
  var quoteDiv = cnt.appendChild(document.createElement('div'));
  quoteDiv.id = 'id-quote';
  quoteDiv.className = 'movie-quote';

  // Create two child div elements and append them to the quote container. One element is for the
  // actual quote text and the other is for the name of the film the quote came from.
  //
  quoteDiv.appendChild(document.createElement('div'));
  quoteDiv.appendChild(document.createElement('div'));

  // Create the button that the user will be able to push to get a new quote. Add it as a child
  // element to the container and setup its label and click callback.
  //
  var getButton = cnt.appendChild(document.createElement('button'));
  getButton.innerHTML = 'Next Quote';
  getButton.onclick = getQuoteHTTP;
}

// This function is set as the callback when the next quote button is clicked. This function sends
// the request to the server to send back a random quote. Upon successful completion of this
// request, the quote is displayed in the DOM element with the id "id-quote".
//
// Note that we use raw Ajax to make this request. Ajax is the shorthand name for Asynchronous
// JavaScript. These are the vanilla JavaScript utilities for sending HTTP requests to a web
// server.
//
function getQuoteHTTP() {

  // Fetch the quote container via its id.
  //
  var quoteDiv = document.getElementById('id-quote');

  // XMLHttpRequest is the raw Ajax request. We create that here and set it up such it will send
  // a GET request to the "/movie-quote" route under our server.
  //
  var req = new XMLHttpRequest();
  req.open('GET', '/movie-quote', true);

  // Setup a function to be called when the request is answered. Upon completion of the request,
  // the request "onload" callback is called. Here we want to make sure we got a good status back
  // (200 = OK). Assuming we have a good status, we display the resulting quote.
  //
  req.onload = function() {
    if (this.status == 200) {

      // Parse the quote object from the response text.
      //
      var quoteObj = JSON.parse(this.responseText);

      // Set the text contents of the first and second child nodes in the quote container to be
      // the quote text and the name of the film the quote came from.
      //
      quoteDiv.childNodes[0].innerHTML = quoteObj.quote;
      quoteDiv.childNodes[1].innerHTML = quoteObj.film;
    }
  };

  // Send the request.
  //
  req.send();
}

// The "window.onload" function is called when the HTML page is finished loading. Here we make sure
// that the elements needed for our app to work are setup properly and then we make the initial
// request for our first quote.
//
window.onload = function() {

  // Call the function to make sure the elements we need are created and setup.
  //
  setupQuoteDOM();

  // Call "getQuoteHTTP" directly so that the page will wake up with the initial quote already
  // displayed.
  //
  getQuoteHTTP();
}
