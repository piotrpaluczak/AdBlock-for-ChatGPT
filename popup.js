const checkbox = document.getElementById("enabled");

async function init() {
  const { enabled = true } = await chrome.storage.sync.get({ enabled: true });
  checkbox.checked = enabled !== false;
}

checkbox.addEventListener("change", async () => {
  await chrome.storage.sync.set({ enabled: checkbox.checked });
});

init();
