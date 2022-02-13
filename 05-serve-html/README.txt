serve-html
----------

This sample, like the previous sample, starts a server and waits for requests. In this sample we
only process a GET request to the url "/". In response to that request, we send back some hard coded
HTML in the response. For any other type of request, we send back a standard 404 error meaning the
page/resource was not found.

A note about errors
-------------------

This is the first sample that returns an error. Error codes are split into groups where:

* 1xx information response - the request was received, continuing processing.
* 2xx successful – the request was successfully received, understood, and accepted
* 3xx redirection – further action needs to be taken in order to complete the request
* 4xx client error – the request contains bad syntax or cannot be fulfilled
* 5xx server error – the server failed to fulfil an apparently valid request

Here we return a 404 which is the standard code for when a requested resource is not found. You
can get a break down of the different codes in the following Wikipedia article.

* https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

Try It
------

Start the server by running the "node" command and specifying the server file:

  C:\NodeJS\05-serve-html>node server
  Server is listening on port: 3000

Or by installing "nodemon" via "npm install" and then starting the server with the command:

    C:\NodeJS\05-serve-html>npm start

    > serve-html@1.0.0 start C:\NodeJS\05-serve-html
    > nodemon server.js

    [nodemon] 2.0.15
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,json
    [nodemon] starting `node server.js`
    Server is listening on port: 3000

With the server running, you can (again) test it either via a web browser or through a web services
test client like "Postman". In either case, you'll see the following HTML returned.

  <html>
    <head>
      <title>Hello HTML</title>
    </head>
    <body>
      <h1>Hello HTML!</h1>
      <p>Here we have a NODE server serving up some real HTML to your browser.</p>
    </body>
  </html>

What's Different?
-----------------

* "server.js". We start by making our server just a bit more rugged by making sure only to process
  a GET request to the url "/". For any other type of request or any other url, we send back a
  standard 404 resource not found error response.

  In response to a good GET request, we start by using "writeHead" to set the status code to 200(OK)
  and the content type to html as opposed to plain text.

  Multiple calls to "res.write" are made to send back several lines of HTML. These could have been
  consolidated into a single call to "res.write" or even passed as a parameter to "res.end". Your
  choice. I liked the way this read in the code.

  For any other request besides GET to "/", a standard 404 error response is sent back.
