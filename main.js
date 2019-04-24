(() => {
  let isTabPressed = false;

  document.addEventListener("keydown", e => {
    switch (e.key) {
      case "Tab":
        isTabPressed = true;
        break;
      case "e":
        isTabPressed && selectTask();
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

  const selectTask = () => {
    const focused = document.querySelector(".ItemRow--focused");
    if (focused) return;

    const item =
      document.querySelector(".ItemRow--highlighted") ||
      document.querySelector(".ItemRow");
    item && item.click();
  };
})();
