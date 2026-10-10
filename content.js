const STYLE_ID = "adblock-for-chatgpt-style";
const HIDDEN_ATTR = "data-adblock-for-chatgpt-hidden";

// Attribute/class hooks (present or future) + our runtime hide marker.
// Primary detection is structural/JS and language-independent.
const AD_CSS = `
[${HIDDEN_ATTR}="1"],
div._AkrYjetK7b,
[data-sponsor="true"],
[data-sponsor-v2="true"],
[data-promoted="true"],
[data-testid*="banner-ad"],
[data-testid*="sponsored"],
[class*="-sponsored-"],
[class*="-promoted-"],
[class*="sponsor-container"],
[class*="promoted-result"] {
  display: none !important;
}
`.trim();

let enabled = false;
let observer = null;
let scanScheduled = false;

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = AD_CSS;
  (document.documentElement || document.head).appendChild(style);
}

function removeStyle() {
  document.getElementById(STYLE_ID)?.remove();
}

/** ChatGPT Bazaar ad unit — structural fingerprint, no locale strings. */
function isAdUnitRoot(el) {
  if (!(el instanceof Element)) return false;

  // Elevated product/ad card (not a normal <a>)
  if (!el.querySelector('div[role="link"]')) return false;

  // "…" ad options menu (aria is language-agnostic)
  if (!el.querySelector('button[aria-haspopup="menu"]')) return false;

  // Creative on OpenAI ads CDN and/or thumbs feedback row
  const hasCreative = !!el.querySelector(
    'img[src*="images.openai.com/static-rsc"]'
  );
  const fieldset = el.querySelector("fieldset");
  const hasFeedback =
    !!fieldset && fieldset.querySelectorAll("button").length >= 2;

  return hasCreative || hasFeedback;
}

function resolveHideTarget(adRoot) {
  const scope = adRoot.matches("[class*='scope-']")
    ? adRoot
    : adRoot.closest("[class*='scope-']");
  const base = scope && isAdUnitRoot(scope) ? scope : adRoot;

  // Prefer the empty turn-sibling wrapper so spacing disappears cleanly.
  const parent = base.parentElement;
  if (
    parent &&
    parent.childElementCount === 1 &&
    parent.parentElement?.hasAttribute("data-talvt-turn-state")
  ) {
    return parent;
  }
  return base;
}

function collectCandidateRoots(doc) {
  const roots = new Set();

  doc.querySelectorAll("[class*='scope-']").forEach((el) => {
    if (isAdUnitRoot(el)) roots.add(el);
  });

  doc.querySelectorAll('div[role="link"]').forEach((card) => {
    let node = card.parentElement;
    for (let i = 0; i < 10 && node; i++) {
      if (node.hasAttribute("data-talvt-turn-state")) break;
      if (isAdUnitRoot(node)) {
        roots.add(node);
        break;
      }
      node = node.parentElement;
    }
  });

  return roots;
}

function scanAndHide() {
  if (!enabled || !document.documentElement) return;

  for (const root of collectCandidateRoots(document)) {
    const target = resolveHideTarget(root);
    if (target.getAttribute(HIDDEN_ATTR) !== "1") {
      target.setAttribute(HIDDEN_ATTR, "1");
    }
  }
}

function scheduleScan() {
  if (!enabled || scanScheduled) return;
  scanScheduled = true;
  requestAnimationFrame(() => {
    scanScheduled = false;
    scanAndHide();
  });
}

function startObserver() {
  if (observer || !document.documentElement) return;

  observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList" && (m.addedNodes.length || m.removedNodes.length)) {
        scheduleScan();
        return;
      }
      if (m.type === "attributes") {
        scheduleScan();
        return;
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "role", "src", "style"],
  });
}

function stopObserver() {
  observer?.disconnect();
  observer = null;
}

function clearHiddenMarkers() {
  document
    .querySelectorAll(`[${HIDDEN_ATTR}="1"]`)
    .forEach((el) => el.removeAttribute(HIDDEN_ATTR));
}

function enableBlocking() {
  enabled = true;
  injectStyle();
  startObserver();
  scheduleScan();
}

function disableBlocking() {
  enabled = false;
  stopObserver();
  clearHiddenMarkers();
  removeStyle();
}

function applyEnabled(value) {
  if (value) {
    enableBlocking();
  } else {
    disableBlocking();
  }
}

async function init() {
  const { enabled: stored = true } = await chrome.storage.sync.get({
    enabled: true,
  });
  applyEnabled(stored !== false);
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync" || !changes.enabled) return;
  applyEnabled(changes.enabled.newValue !== false);
});

init();
