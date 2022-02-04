NodeJS Samples

After an accelerated "boot camp" attended by several members of the Factory team last year, it
occurred to me that one issue I've had with attempting to learn programming in the web world was
the overwhelming amount of info you need to soak up just to get started. It seems like most
tutorials can't even get off the ground without having you install a dozen or so frameworks and
never taking the time to go into what they all do.

The instructor in our short boot camp did a good job of focusing in purely on server side JavaScript
and we learned a lot but there was still a lot of "setup" that I didn't really understand and would
go back to frequently just trying to mimic what was there in the class.

So I decided to go back to absolute basics and provide a set of samples that quite literally start
with nothing except the "Node" environment itself along with vanilla JavaScript, HTML, and CSS. The
samples start with nothing more than the proverbial "Hello World!" sample and slowly add on to the
point where you have a functioning (albeit very simple) web app and you understand all of the pieces
being used to make it work.

These samples ultimately end up providing both server and client side work although the focus is
mostly on client side JavaScript in the Node environment. There is a sister set of samples where we
dive into using React for client side work (cleverly titled "react-samples").

NodeJS
------
Very simply, Node.js provides a hosting environment for JavaScript programs. Where as JS used
to be a client-side scripting language that would only run in a web browser, Node provides an
environment allowing JS programs to be run on their own. This allows developers to write JS
programs to be run server side as well as client side.

Installation
------------
You can install Node.js by pointing your browser to http://www.nodejs.org, downloading, and
then installing the current version.

Console
-------
Before we get into the samples, you can see Node.js operate in its simplest form by opening
a command prompt and typing "node". This will put you into the Node console. Once you're in
the console, start typing JS code and see what happens. You should see the same behavior you
would see when typing JS code into the console of your favorite web browser's developer tools.
When you're finished, you can get out by typing ".exit".

  C:\NodeJS>node
  > var a = 'Apples';
  undefined
  > var o = 'Oranges';
  undefined
  > console.log(a + ' and ' + o);
  Apples and Oranges
  undefined
  > .exit

  C:\NodeJS>

Note that the command to exit was preceeded by a period. This is a convention for special
Node commands. To see the list of these commands you can type ".help" in a Node session.

How to go through the samples
-----------------------------
The samples here are geared mostly toward developing web servers but we'll start with just
a little bit of basic Node.js.

The best way to go through the samples is to go through each of the numbered folders in order and,
in each folder, start with the README.txt file. The README file gives an overview of what the
samples does, an explanation of how to run the sample, and a list of the new and/or changed files
from the previous sample along with a very high level description of the change. For more details
on the change, you go to the file/code comments. This high level list simply saves you from looking
for changes in files that haven't changed.

Again, the specifics of the changes and how the code works will be explained in the code comments.
New things will be heavily commented in the. In an effort to avoid a mile high pile of comments in
the later samples, detailed comments on code that was already explained in a previous sample will
be removed or simplified down to just a line or two. In other words, if you see some code you don't
understand and it isn't commented or the comments are vague, chances are it was introduced in an
earlier sample and was heavily commented there.

To start with though, always sue the "What's Diferent?" section in the README to zoom in on the
specific changes for any particular sample.

Files in this folder
--------------------
In addition to the README.txt in the main folder and the numbered sample folders, you will also
note the files "clean.cmd" and "install.cmd". Starting in the sample "use-npm", we will discuss
and use the Node Package Manager to install modules needed to run each sample. Once you understand
what this does and how it works, you can simply run the file "install.cmd" which will go through
each of the numbered sample folders and run "npm install" to perform the necessary installations.
Similarly, the file "clean.cmd" will go through each of the sample folders and remove the extra
stuff created on install thus cleaning up the folder.

What's Covered/Language Updates
-------------------------------
These samples assume some knowledge of JavaScript, HTML, and CSS. Node itself doesn't introduce any
syntax that is peculiar to Node. In other words, everything you see is vanilla JavaScript, HTML, and
CSS.

Writing server code in Node means you always have the luxury of using the latest and greatest
language enhancements supported by the latest version of Node. Any client side code we write will
be somewhat restricted as the client code needs to run on older browsers that may not be up to
date with the latest changes.

While these samples aren't meant to cover the JavaScript language, I will sometimes point out some
particularly interesting new new pieces of syntax. There are also some sections where I put very
heavy comments on some JS syntax just for my own benefit so I won't forget how that code works six
months from now.
