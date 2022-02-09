const saveOptions = () => {
  const disableCtrlEnter =
    document.getElementById("disable-ctrl-enter").checked;
  chrome.storage.sync.set(
    {
      disableCtrlEnter,
    },
    () => {
      const s = document.getElementById("status");
      s.textContent = "Options saved.";
      setTimeout(function () {
        s.textContent = "";
      }, 750);
    }
  );
};

const restoreOptions = () => {
  chrome.storage.sync.get(
    {
      disableCtrlEnter: false,
    },
    (items) => {
      document.getElementById("disable-ctrl-enter").checked =
        items.disableCtrlEnter;
    }
  );
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
