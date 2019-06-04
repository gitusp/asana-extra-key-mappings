(() => {
  // Thanks https://hackernoon.com/functional-javascript-resolving-promises-sequentially-7aac18c4431e
  const promiseSerial = funcs =>
    funcs.reduce(
      (promise, func) =>
        promise.then(result =>
          func().then(Array.prototype.concat.bind(result))
        ),
      Promise.resolve([])
    );

  const extractIdRegExp = /pot.*_(\d*)/;

  let isTabPressed = false;

  const baseUrl = "https://app.asana.com/api/1.0/";

  // TODO: Get access token from configuration.
  const getAuthHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`
  });

  const focusTask = () => {
    const focused = document.querySelector(".ItemRow--focused");
    if (focused) return;

    const item =
      document.querySelector(".ItemRow--highlighted") ||
      document.querySelector(".ItemRow");
    item && item.click();
  };

  const selectTask = () => {
    const active =
      document.querySelector(".ItemRow--focused") ||
      document.querySelector(".ItemRow--highlighted");
    if (!active) return;
    if (active.dataset.selected) {
      delete active.dataset.selected;
    } else {
      active.dataset.selected = true;
    }
  };

  const unselectTasks = () => {
    document
      .querySelectorAll("[data-selected]")
      .forEach(e => delete e.dataset.selected);
  };

  const getSelectedTids = () =>
    Array.from(document.querySelectorAll("[data-selected]")).map(
      e => e.querySelector("textarea").id.match(extractIdRegExp)[1]
    );

  const setDependency = () => {
    const focused = document.querySelector(".ItemRow--focused textarea");
    if (!focused) return;

    const tids = getSelectedTids();
    if (tids.length === 0) return;

    const activeTid = focused.id.match(extractIdRegExp)[1];

    // Set the tasks as the active tasks' dependencies;
    fetch(`${baseUrl}tasks/${activeTid}/addDependencies`, {
      headers: getAuthHeader(),
      method: "POST",
      body: JSON.stringify({ data: { dependencies: tids } })
    }).then(res => {
      if (res.status >= 400) {
        console.error(res);
        alert("Something went wrong.");
      } else {
        unselectTasks();
      }
    });
  };

  const setSubtasks = () => {
    const focused = document.querySelector(".ItemRow--focused textarea");
    if (!focused) return;

    const tids = getSelectedTids().reverse();
    if (tids.length === 0) return;

    const activeTid = focused.id.match(extractIdRegExp)[1];

    const tasks = tids.map(tid => () =>
      fetch(`${baseUrl}tasks/${tid}/setParent`, {
        headers: getAuthHeader(),
        method: "POST",
        body: JSON.stringify({ data: { parent: activeTid } })
      })
    );

    promiseSerial(tasks).then(responses => {
      let succeeded = true;
      responses.forEach(res => {
        if (res.status >= 400) {
          console.error(res);
          alert("Something went wrong.");
          succeeded = false;
        }
      });
      if (succeeded) {
        unselectTasks();
      }
    });
  };

  const injectCSS = () => {
    const style = document.createElement("style");
    style.innerHTML =
      ".ItemRow[data-selected] { background-color: #fffede !important; }";
    document.querySelector("head").appendChild(style);
  };

  injectCSS();

  document.addEventListener("keydown", e => {
    switch (e.key) {
      case "Tab":
        isTabPressed = true;
        break;
      case "e":
        isTabPressed && focusTask();
        break;
      case "v":
        isTabPressed && selectTask();
        break;
      case "Escape":
        unselectTasks();
        break;
      case ">":
        isTabPressed && setSubtasks();
        break;
      case ".":
        isTabPressed && setDependency();
        break;
    }
  });

  document.addEventListener("keyup", e => {
    switch (e.key) {
      case "Tab":
        isTabPressed = false;
        break;
    }
  });
})();
