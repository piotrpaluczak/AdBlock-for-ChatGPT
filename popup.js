const toggle = document.getElementById("enabled");
const stateLabel = document.getElementById("enabled-state");

function renderState(isOn) {
  toggle.checked = isOn;
  toggle.setAttribute("aria-checked", isOn ? "true" : "false");
  stateLabel.textContent = isOn ? "On" : "Off";
}

async function init() {
  const { enabled = true } = await chrome.storage.sync.get({ enabled: true });
  renderState(enabled !== false);
}

toggle.addEventListener("change", async () => {
  const isOn = toggle.checked;
  renderState(isOn);
  await chrome.storage.sync.set({ enabled: isOn });
});

init();
