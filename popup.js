const toggle = document.getElementById("enabled");
const stateLabel = document.getElementById("enabled-state");
const blockedCount = document.getElementById("blocked-count");

function renderState(isOn) {
  toggle.checked = isOn;
  toggle.setAttribute("aria-checked", isOn ? "true" : "false");
  stateLabel.textContent = isOn ? "On" : "Off";
}

function renderBlockedCount(count) {
  if (typeof count !== "number" || count < 0) {
    blockedCount.textContent = "—";
    blockedCount.dataset.empty = "true";
    return;
  }

  blockedCount.textContent = String(count);
  blockedCount.dataset.empty = "false";
}

async function loadBlockedCount() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab?.id == null) {
      renderBlockedCount(null);
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "GET_BLOCKED_COUNT",
    });
    renderBlockedCount(response?.count);
  } catch {
    // No content script (not ChatGPT, or page not ready yet).
    renderBlockedCount(null);
  }
}

async function init() {
  const { enabled = true } = await chrome.storage.sync.get({ enabled: true });
  renderState(enabled !== false);
  await loadBlockedCount();
}

toggle.addEventListener("change", async () => {
  const isOn = toggle.checked;
  renderState(isOn);
  await chrome.storage.sync.set({ enabled: isOn });
  // Give the content script a moment to apply/clear markers.
  setTimeout(loadBlockedCount, 50);
});

init();
