use-require
-----------

Outputs two strings "Hello from NodeJS!" and "Goodbye from NodeJS!" to the command line.
Introduces use of the "require" function.

Try It
------

Run the sample using the "node" command.

  C:\NodeJS\02-use-require>node use-require
  Hello from NodeJS!
  Goodbye from NodeJS!

  C:\NodeJS\02-use-require>

What's Different?
-----------------

* "hello-goodbye.js" is an added file that is NOT our main JS file. This file (or "module")
  contains definitions for two functions "sayHello" and "sayGoodbye". These functions are
  specified as "exports" from this module.

* "use-require.js" is the main program. This program uses the "require" function to load the module
  "hello-goodbye". The return value from the call to "require" is the loaded modules "exports"
  object and through that object, we call the modules exported functions.

IMPORTANT: CommonJS vs ES
-------------------------
NodeJS defaults to using what are called CommonJS modules. In recent years, the trend has moved
toward using ES modules. Both are simply files containing JavaScript code but the syntax for export
and import of these modules are different. At the time of writing, ES modules were considered
experimental in NodeJS. Since then they have become fully supported and I will likely repurpose
all of these samples to use ES modules. For now, however, the modules are CommonJS.