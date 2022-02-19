const http = require('http');

const server = http.createServer((req, res) => {

  console.log(`${req.method} request posted for \"${req.url}\"`);

  // The previous sample responded to every type of request to every url with a simple text string.
  // Ideally we want tighter control over what we respond to and what we don't. For this sample,
  // we're only interested in processing the GET request to the url "/" so we'll start by making
  // sure that is exactly what we have.
  //
  if (req.method === 'GET' && req.url === '/') {

    // The first part of the response is just like the previous sample where we set the status code
    // and content type. Here however, we'll do both with a single call to "writeHead" and we'll
    // also specify that our content type is html as opposed to just just plain text.
    //
    res.writeHead(200, { 'Content-Type' : 'text/html' });

    // The body of the response is going to be several lines of HTML. Here we make multiple calls to
    // "res.write" adding each line to the response body. Alternately we could have also put the
    // entirety of the HTML into one text string and made just one call to "res.write" or even
    // specified it as a parameter to "res.end". I chose multiple calls simply because I thought it
    // read better.
    //
    res.write('<html>');
    res.write('<head>');
    res.write('<title>Serve HTML</title>');
    res.write('</head>');
    res.write('<body>');
    res.write('<h1>Hello HTML!</h1>');
    res.write('<p>Here we have a NODE server serving up some real HTML to your browser.</p>');
    res.write('</body>');
    res.write('</html>');
    res.end();

  // If any other type of request comes in, we're going to send back a message with a 404 status
  // code. 404 is the standard message that means the requested page was not found. Note that as
  // with our other responses, we start by setting the status code and the content type header. In
  // the request body, we pass a JSON object containing an error message making sure the object is
  // stringified. 
  //
  // Note that while you might think its ok to process the requests we want and simply ignore the
  // rest, it's always a good idea to return a response all the time. Requests tend to go out to
  // lunch when no response is sent. You might not notice via your web browser when, for example,
  // the request for "favicon.ico" goes unanswered. If you try and send a bad request through a tool
  // like "Postman" for example, the bad request will hang and you'll need to cancel the request
  // manually.
  //
  } else {
    res.writeHead(404, { 'Content-Type' : 'text/json' });
    res.end(JSON.stringify({ error : 'Not found' }));
  }
});

// Run the server and listen on port 3000 for any requests.
//
server.listen(3000, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }

  console.log('Server is listening on port: 3000');
});
