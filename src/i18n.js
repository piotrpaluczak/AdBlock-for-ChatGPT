const I18N_LINK_MARKER = "\uE000";

function applyI18n(root = document) {
  root.documentElement.lang = chrome.i18n.getUILanguage();

  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const linkEl = el.querySelector("[data-i18n-link]");

    if (el.tagName === "TITLE") {
      const message = chrome.i18n.getMessage(key);
      if (message) root.title = message;
      return;
    }

    if (linkEl) {
      const linkText = chrome.i18n.getMessage(linkEl.dataset.i18nLink);
      const message = chrome.i18n.getMessage(key, [I18N_LINK_MARKER]);
      if (!linkText || !message) return;

      linkEl.textContent = linkText;

      const markerAt = message.indexOf(I18N_LINK_MARKER);
      if (markerAt === -1) {
        el.textContent = message;
        return;
      }

      const before = message.slice(0, markerAt);
      const after = message.slice(markerAt + I18N_LINK_MARKER.length);

      el.replaceChildren();
      if (before) el.append(before);
      el.append(linkEl);
      if (after) el.append(after);
      return;
    }

    const message = chrome.i18n.getMessage(key);
    if (!message) return;
    el.textContent = message;
  });
}

applyI18n();
