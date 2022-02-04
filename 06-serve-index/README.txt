serve-index
-----------

This sample, like the previous sample, waits for a GET request. Here a url of either "/index.html"
or "/" is considered a valid request. For either request, we return HTML like we did in the previous
sample except in this sample, the HTML is contained in the file "index.html" and we simply open
that file, read the entirety of the contents, and send those contents back in the response.

Try It
------

Start the server by running "node" or "npm start" from the command line.

With the server running, you can test by pointing your browser to "http://localhost:3000" or by
using a test client to send a GET request to the same url. Note that you can also specify the
url "http://localhost:3000/index.html".

The data send back in the response should be the HTML contents of the file "index.html".

What's different?
-----------------

* "server.js". We start by requiring the module "fs" for file system operations. This is another
  standard Node module so it doesn't require any special installation.

  In response to the GET request, instead of sending back hard coded HTML, we try to open the file
  "index.html" we assume to be located in the same folder as our server code. If we can't read the
  file, we send back a 404 error. If we can read the file, we send the entirety of the file contents
  back in the response body as html.
