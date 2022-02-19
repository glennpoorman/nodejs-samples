use-npm
-------

Outputs three strings to the command line. The first and third strings are "Hello from NodeJS!" and
"Goodbye from NodeJS!". The middle string is a random quote from a movie.

The point of this is to introduce using the Node Package Manager (npm) to install and manage third
party modules and also to run scripts. In this sample, we are using a third party package called
"popular-movie-quotes" to do some of the work for us.

Try It
------

First simply try running the main program and note the errors that occur.

  C:\NodeJS\03-use-npm>node use-npm
  internal/modules/cjs/loader.js:968
    throw err;
    ^

  Error: Cannot find module 'popular-movie-quotes'
  Require stack:
  - C:\NodeJS\03-use-npm\hello-goodbye.js
  - C:\NodeJS\03-use-npm\use-npm.js
      at Function.Module._resolveFilename (internal/modules/cjs/loader.js:965:15)
      at Function.Module._load (internal/modules/cjs/loader.js:841:27)
      at Module.require (internal/modules/cjs/loader.js:1025:19)
      at require (internal/modules/cjs/helpers.js:72:18)
      at Object.<anonymous> (C:\NodeJS\03-use-npm\hello-goodbye.js:5:21)
      at Module._compile (internal/modules/cjs/loader.js:1137:30)
      at Object.Module._extensions..js (internal/modules/cjs/loader.js:1157:10)
      at Module.load (internal/modules/cjs/loader.js:985:32)
      at Function.Module._load (internal/modules/cjs/loader.js:878:14)
      at Module.require (internal/modules/cjs/loader.js:1025:19) {
    code: 'MODULE_NOT_FOUND',
    requireStack: [
      'C:\\NodeJS\\03-use-npm\\hello-goodbye.js',
      'C:\\NodeJS\\03-use-npm\\use-npm.js'
    ]
  }

  C:\NodeJS\03-use-npm>

This error occurs because one of our modules contains a call to "require" specifying a third party
module called "popular-movie-quotes" that is not currently residing in the folder. In order to make
sure that you have all of the required third party modules before running the sample, you simply run
the command "npm install" as follows:

  C:\NodeJS\03-use-npm>npm install
  npm WARN use-npm@1.0.0 No repository field.

  added 1 package from 1 contributor and audited 1 package in 0.325s
  found 0 vulnerabilities

  C:\NodeJS\03-use-npm>

Note that running the install creates a folder called "node_modules" where all installed modules will
go along with any dependencies they might have. In this case, only the "popular-movie-quotes" module
is installed but it's not uncommon to see other modules installed that you did not reference directly.
This occurs when the modules you do reference have their own dependencies on other modules. In words,
"npm install" makes sure that you have everything you need to run successfully. The idea here is that
you never have to save these third party modules or commit them to your source repository. As long as
your project knows what it needs, you can rely on "npm install" to get it for you when you need it (more
on this in a minute).

So with that done, try running the main program again and you should see:

  C:\NodeJS\03-use-npm>node use-npm
  Hello from NodeJS!
  "It is impossible to manufacture or imitate love"
  - Harry Potter and the Half-Blood Prince
  Goodbye from NodeJS!

  C:\NodeJS\03-use-npm>

What's Different?
-----------------

* "package.json" is where we keep track of the needs of our project. If you look at this file,
  you'll see some general information about the project as well as a list of project dependencies.
  For new projects, you don't have to create this file by hand. You can simply run the following
  command:

    C:\NodeJS\03-use-npm>npm init

  Running that command will ask a series of questions and then generate the initial file. Once the
  file is created, you can add dependencies by running the "npm" command for each dependency and
  instructing the command to not only to install the dependency but to save the dependency information
  in your "package.json" file. For example, to add the "popular-movie-quotes" dependency to this
  sample, I ran the following on the command line:

    C:\NodeJS\03-use-npm>npm install popular-movie-quotes --save

  With that command, the module was installed under "node_modules" and the dependency info was saved
  in "package.json". The beauty now is that I can delete "node_modules" but because the dependency
  info is saved in "package.json", I can retrieve my dependencies any time by simply running
  "npm install" with no other arguments.

* "hello-goodbye.js" was modified. In addition to exporting the same two functions as in the
  previous sample, we are also exporting a third function called "sayRandomQuote". This function
  executes code from the "popular-movie-quotes" module so the very first line of this file now
  contains a "require" function call to load the "popular-movie-quotes" module.

* "use-npm.js" is the main program. All three functions exported from "hello-goodbye" are called.

* A note about scripts.

  In the "package.json" file, you can also add scripts which are commands that can be run. You can
  use scripts to do things like run your program in a testing environment, start up a server, pretty
  much anything you can think of. Most scripts added to a "package.json" are run by running the
  command "npm run {script-name}". In our case, we added the script "start". The "start" script is
  a special script to npm allowing us to leave off the "run" portion of the command and simply
  type "npm start".

    C:\NodeJS\03-use-npm>npm start

    > use-npm@1.0.0 start C:\NodeJS\03-use-npm
    > node use-npm.js

    Hello from NodeJS!
    "This meeting of The Losers Club has officially begun."
    - It Chapter Two
    Goodbye from NodeJS!

    C:\NodeJS\03-use-npm>

  This isn't really very helpful for this particular case but later on we'll use scripts for some
  functionality that's a bit more useful.
