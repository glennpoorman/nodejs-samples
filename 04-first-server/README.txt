first-server
------------

This sample is our first real web server. The server runs and waits for any web request and
responds by sending back the simple text string "Hello from your first NodeJS server."

Try It
------

Start the server by running the "node" command and specifying the server file:

  C:\NodeJS\04-first-server>node server
  Server is listening on port: 3000

Now the server is running and waiting for requests. There are a couple of ways you can test the
server out.

1. Via your web browser. Fire up your favorite web browser and point to the following url:

     http://localhost:3000

   Your browser should come back with a completely empty page only displaying a single text string
   at the top that reads:

     Hello from your first NodeJS server.

   Now take a look back at the console window where you started the server and note the display of
   the following lines:

     GET request posted for "/"
     GET request posted for "/favicon.ico"

2. You can also use any of the clients out there designed for testing web services. For example, you
   can download and install Google's "Postman". Inside "Postman" you can send a simple "GET" request
   to "localhost:3000" and note that the same text string as above is returned and displayed in the
   response section.

   In this case, your server only displays one request in the command line window:

     GET request posted for "/"

When you are finished testing, you can kill your server by going back to the command line where you
started it and simply doing a Ctl-C.

A note about "favicon.ico"
--------------------------

When you point most (if not all) modern web browsers to a web page, the browser automatically
generates two GET requests. The first is for the page you said you wanted to view. The second is for
"favicon.ico". What is happening in the second request is that the browser is looking for a small
icon file that any web page may optionally provide. If that file is found, the browser will display
the contents as a tiny icon next to the web page title. If the file isn't found, there's no harm
done and the browser will merrily move on. In our case, we're responding to all requests with a
simple text string. The browser, however, will be smart enough to realize that the response to
"favicon.ico" is not icon data and simply discard it.

What's Different?
-----------------

* "server.js" is our main server file and will remain so for the rest of the samples. Inside that
  file we will create a server object and then run that server telling it where to wait for requests
  and what to do with them when it gets them. When any type of request comes in, we respond with a
  single plain text string.

* "package.json". While this sample doesn't technically have any dependencies, we have introduced a
  very handy tool called "nodemon". Using "nodemon" to start the server, we can leave it running,
  make edits to any and all server files, and nodemon will restart the server making sure that it is
  always running the very latest changes/saves.

  To use "nodemon", it has to be installed. Since it is listed in the "package.json" file as a
  dependency, you can do this by simply running "npm install".

  Use of "nodemon" is defined as a script in "package.json". So to run your server using "nodemon",
  you simply need only the following command at the command line:

    C:\NodeJS\04-first-server>npm start

    > first-server@1.0.0 start C:\NodeJS\04-first-server
    > nodemon server.js

    [nodemon] 2.0.15
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,json
    [nodemon] starting `node server.js`
    Server is listening on port: 3000

  At this point your server is running exactly is it did using the "node" command except that any
  time a file in your folder is edited and saved, "nodemon" will automatically stop and restart your
  server. Essentially making any work session a "run and forget" session.

  This probably doesn't seem like much at first but after the 10th time you're wondering why a
  change you made isn't working only to discover it is because you neglected to re-start your
  server, this tool begins to look more and more attractive.

  One last thing to point out. If you look at "nodemon" in your "package.json" file, you'll note
  that it is listed as a "devDepencency". These dependencies are slightly different in that they are
  only required for development, are not needed to run your finished server, and do not need to be
  deployed with your server. To install and save a module as a "devDependency" you only need to
  slighly modify the save parameter on your "npm install" command. For example, to install "nodemon"
  for this sample I ran the following command:

    C:\NodeJS\04-first-server>npm install nodemon --save-dev
