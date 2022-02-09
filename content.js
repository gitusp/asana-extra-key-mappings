const main = document.createElement("script");
main.src = chrome.extension.getURL("main.js");
document.body.appendChild(main);

chrome.storage.sync.get(
  {
    disableCtrlEnter: false,
  },
  (items) => {
    if (items.disableCtrlEnter) {
      document.body.addEventListener("keydown", (e) => {
        if (e.code === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.stopPropagation();
        }
      });
    }
  }
);
