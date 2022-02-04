// Obviously putting all of your code in one file isn't very practical. Using Node you can
// split your code into multiple files/modules and then control what functionality is exported
// from your module for consumption by other modules.
//
// Just the way client side scripts can always access the global scope using the "document"
// object, JS code in node can access the scope of the current module using the "module"
// object. One of the most important properties on the module object is the "exports" object.
// You can define the exports object to be whatever you want but you must do this bearing in
// mind that when this module is loaded into another module, that object will be the only
// doorway into whatever you want exported.
//
// For example, you can load up a module with as much code as you like but let's say your
// only reference to the exports object sets it equal to a string.
//
//   module.exports = "Some useless text!";
//
// Then if and when this module was loaded into another module, that string would be the
// only thing the other module had access to.
//
// It's more likely that your going to set the exports object equal to either a function or
// an object containing many functions.
//
// Here we set the exports object equal to an object containing two function properties.
//
module.exports = {

  sayHello () {
    console.log('Hello from NodeJS!');
  },

  sayGoodbye () {
    console.log('Goodbye from NodeJS!');
  }
};

// Note some alternate syntax you'll see used for the same purpose.
//
// Since the exports object defaults to an empty object, you can simply create the function
// properties directly as shown below.
//
//   module.exports.sayHello = () => {
//     console.log('Hello from NodeJS!');
//   }
//
//   module.exports.sayGoodbye = () => {
//     console.log('Goodbye from NodeJS!');
//   }
//
// Taking that a little further, when assigning properties to the exports object, you can
// leave off the "module" object and simply write:
//
//   exports.sayHello = () => {
//     console.log('Hello from NodeJS!');
//   }
//
//   exports.sayGoodbye = () => {
//     console.log('Goodbye from NodeJS!');
//   }
//
// BE CAREFUL using the global "exports" variable though as you can get into trouble depending
// on how you use it. To understand why, you have to understand that while "module.exports" and
// "exports" reference the same object, they are two separate variables. What Node essentially
// does is introduce the following invisible line of code at the start of each module.
//
//   const exports = module.exports = {};
//
// So now you have two variables referencing the same object. Changing the contents of that object
// through either variable is fine but if you re-assign one of the variables, you'll be left with
// two variables referencing two different objects. The only object that is actually exported from
// your module, however, is "module.exports". What this means is that if you were to create a new
// module and put the following line of code in it:
//
//   exports = { sayHello () { console.log('Hello'); } };
//
// That object would NOT actually be exported as the "exports" variable now references a different
// object than "module.exports". On the other hand though, both of the two lines of code below are
// equivalent:
// 
//   exports.sayHello = () => { console.log('Hello'); } );
//   module.exports.sayHello = () => { console.log('Hello'); } );
//
// Lastly we can use a little bit of newer syntactic sugar. The arrow syntax was introduced in ES6
// which allows you to leave the curly braces off a one line function and a return is implied. That
// means we can simplify this code down to:
//
//   exports.sayHello = () => console.log('Hello from NodeJS!');
//   exports.sayGoodbye = () => console.log('Goodbye from NodeJS!');
