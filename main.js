(() => {
  let isTabPressed = false;

  const focusTask = () => {
    // Try new style task row at first.
    const cell =
      document.querySelector(".SpreadsheetCell--isHighlighted") ||
      document.querySelector(".SpreadsheetCell");
    if (cell) {
      cell.focus();
      return;
    }

    // Prevent focusing back to the head.
    const focused = document.querySelector(".ItemRow--focused");
    if (focused) return;

    // Try old style task row then.
    const row =
      document.querySelector(".ItemRow--highlighted") ||
      document.querySelector(".ItemRow");
    if (row) {
      row.click();
    }
  };

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "Tab":
        isTabPressed = true;
        break;
      case "e":
        isTabPressed && focusTask();
        break;
    }
  });

  document.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "Tab":
        isTabPressed = false;
        break;
    }
  });
})();
