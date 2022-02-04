// Function displays the current time in the element with id "clock".
//
function displayTime()
{
  var clock = document.getElementById("clock"); // Find the element with the id "clock".
  var now = new Date();                         // Get the current time.

  clock.innerHTML = now.toLocaleTimeString();   // Set the clock element to display the time.
  setTimeout(displayTime, 1000);                // set a timer to do it all again in 1 second.
}

// Make the initial call on document load.
//
window.onload = displayTime;
