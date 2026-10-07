const STYLE_ID = "adblock-for-chatgpt-style";
const AD_CSS = "div._AkrYjetK7b { display: none !important; }";

function enableBlocking() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = AD_CSS;
  document.documentElement.appendChild(style);
}

function disableBlocking() {
  const style = document.getElementById(STYLE_ID);
  if (style) style.remove();
}

function applyEnabled(enabled) {
  if (enabled) {
    enableBlocking();
  } else {
    disableBlocking();
  }
}

chrome.storage.sync.get({ enabled: true }, (result) => {
  applyEnabled(result.enabled !== false);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync" || !changes.enabled) return;
  applyEnabled(changes.enabled.newValue !== false);
});
