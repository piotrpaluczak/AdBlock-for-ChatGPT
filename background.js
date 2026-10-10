chrome.runtime.onInstalled.addListener(async () => {
  const tabs = await chrome.tabs.query({
    url: ["https://chatgpt.com/*", "https://chat.openai.com/*"],
  });

  await Promise.all(
    tabs
      .filter((tab) => tab.id != null)
      .map((tab) => chrome.tabs.reload(tab.id))
  );
});
