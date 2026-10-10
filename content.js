const STYLE_ID = "adblock-for-chatgpt-style";

// Legacy hashed class + more stable attribute/class patterns used for ChatGPT ads.
const AD_CSS = `
div._AkrYjetK7b,
[data-sponsor="true"],
[data-sponsor-v2="true"],
[data-promoted="true"],
[aria-label="Sponsored"],
[aria-label="Advertisement"],
[aria-label="Sponsorowane"],
[aria-label="Reklama"],
[data-testid*="banner-ad"],
[data-testid*="sponsored"],
[class*="-sponsored-"],
[class*="-promoted-"],
[class*="sponsor-container"],
[class*="promoted-result"] {
  display: none !important;
}
`.trim();

function enableBlocking() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = AD_CSS;
  (document.documentElement || document.head).appendChild(style);
}

function disableBlocking() {
  document.getElementById(STYLE_ID)?.remove();
}

function applyEnabled(enabled) {
  if (enabled) {
    enableBlocking();
  } else {
    disableBlocking();
  }
}

async function init() {
  const { enabled = true } = await chrome.storage.sync.get({ enabled: true });
  applyEnabled(enabled !== false);
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync" || !changes.enabled) return;
  applyEnabled(changes.enabled.newValue !== false);
});

init();
