// initialize the header with the current directory name
var header = document.getElementById("header");

// get the text of the header
header.textContent = header.textContent.slice(9, -1);

// if the title is empty, set it to ~
if (header.textContent == "") {
  header.textContent = "~";
}

// if there is something that has more then 40 characters, cut it off
var a = document.querySelectorAll("a");
for (strings in a) {
  if (a[strings].textContent.length > 40) {
    a[strings].textContent = a[strings].textContent.slice(0, 40) + "...";
  }
}
