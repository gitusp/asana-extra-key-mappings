const main = document.createElement("script");
main.src = chrome.extension.getURL("main.js");
document.body.appendChild(main);
