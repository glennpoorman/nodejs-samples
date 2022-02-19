serve-static-files
------------------

This sample takes the previous idea of sending back an HTML a step further and, instead, is setup
to handle requests for all manner of static files such as css, js, html, or image files.

Try It
------

Again start the server by running "node" or "npm start" from the command line.

Note that "server.js" has moved into the "server" sub-folder. For the server to work though, you
need to run node from the top level folder which means you need to run:

  C:\NodeJS\07-server-static-file>node server\server.js

At this point (and with the rest of the samples), it's probably best just to use "npm start".

The best way to see this particular sample in action is to test via a web browser. Consider the
following HTML:

  <html>
    <head>
      <title>Test Page</title>
      <link rel=stylesheet type="text/css" href="styles.css">
      <script src="scripts.js"></script>
    </head>
    <body>
      <p>
        Some text.
        <img src="image.jpg">
      </p>
    </body>
  </html>

Like the previous sample, a GET request to "/" or "/index.html" will return the HTML file "index.html".
A web browser, however, will process the HTML displaying the results in the browser. Additionally, some
of the tags in the HTML (link, script, and img) will cause your browser to generate additional GET
requests for the contents of the respective style sheet, JavaScript, and image files. The resulting
output in your console window would then look like:

  GET request posted for "/"
  GET request posted for "/styles.css"
  GET request posted for "/scripts.js"
  GET request posted for "/image.jpg"
  GET request posted for "/favicon.ico"

You can, of course, still test the sample using "Postman". The problem is that "Postman" doesn't
do any additional processing. So to see the different types of file requests, you'd have to
generate different GET requests manually.

Also note that we've added a "favicon.ico" file to the "public" folder which means we are now
officially answering that request.

What's Different?
-----------------

* "server/utilities.js". A new file was created and added to a folder called "server". This file
  contains several utility functions that will span several samples.

  The utility "sendResponse" combines the "writeHead" method for writing the status code and the
  "end" method to send the response along with response body data allowing the caller to send a
  response in a one line call. The header in the response will be set to be the content type.
  The content type will be determined by an input file extension.

  The utility "sendJSON" hard codes the "json" content type and also does the conversion to a
  JSON string for you.

  The utility "send404" sends back a standard 404 resource not found error.

  The utility "sendFile" reads the contents of a file specified in the incoming request url and
  sends the file contents back in the given response.

* "server/server.js". This file has been moved to the "server" folder and uses the new utilities.

  The new "server/utilities" module is loaded into the main "server/server.js" file.

  We still make sure the incoming request is a GET request but we now treat every url as a valid
  request for a file.

  For GET requests, we call the new utility "sendFile" to send the file contents back to the caller
  using the file suffix to determine the content type. If the file doesn't exist, we send back a 
  standard 404 message.

  For any other type of request, we send back a standard 404 message.

* "public" folder. We've created a new folder where all of our client files will live. This includes
  the main "index.html" file as well as the other static supporting files ("css", "js", images, etc).
  This folder will be invisible to the client. Requests for static assets will automatically be
  routed into the new sub-folder.
