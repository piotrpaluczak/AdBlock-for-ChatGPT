async function migrateEnabledToLocal() {
  const local = await chrome.storage.local.get("enabled");
  if ("enabled" in local) return;

  const synced = await chrome.storage.sync.get("enabled");
  if (!("enabled" in synced)) return;

  await chrome.storage.local.set({ enabled: synced.enabled });
  await chrome.storage.sync.remove("enabled");
}

chrome.runtime.onInstalled.addListener(async (details) => {
  await migrateEnabledToLocal();

  if (details.reason === "install") {
    await chrome.tabs.create({
      url: chrome.runtime.getURL("thank-you.html"),
      active: true,
    });
  }

  const tabs = await chrome.tabs.query({
    url: ["https://chatgpt.com/*"],
  });

  await Promise.all(
    tabs
      .filter((tab) => tab.id != null)
      .map((tab) => chrome.tabs.reload(tab.id))
  );
});
