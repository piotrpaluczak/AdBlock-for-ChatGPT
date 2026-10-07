chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query(
    { url: ["https://chatgpt.com/*", "https://chat.openai.com/*"] },
    (tabs) => {
      for (const tab of tabs) {
        if (tab.id != null) chrome.tabs.reload(tab.id);
      }
    }
  );
});
