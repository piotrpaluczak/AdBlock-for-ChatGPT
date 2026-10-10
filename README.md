# AdBlock for ChatGPT

A free, privacy-friendly Chrome extension that hides ads in ChatGPT chats.

Works on [chatgpt.com](https://chatgpt.com) and [chat.openai.com](https://chat.openai.com).

> **License note:** The source is public for transparency and personal use, but **commercial use is not allowed**. See [License](#license).

## Features

- Hides sponsored / promoted ad units in ChatGPT conversations
- Simple on/off toggle in the extension popup
- Language-independent detection (structural DOM fingerprints, not locale-specific text)
- No tracking, no analytics, no remote code
- Manifest V3

## Install

### Chrome Web Store

Coming soon — once published, the store link will be here.

### From source (developer mode)

For personal / non-commercial use only:

1. Clone this repository:
   ```bash
   git clone https://github.com/piotrpaluczak/AdBlock-for-ChatGPT.git
   ```
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the project folder
5. Open ChatGPT with the extension enabled

After install, a thank-you page opens and any open ChatGPT tabs are reloaded so the content script can attach.

## Usage

1. Open ChatGPT in Chrome
2. Click the extension icon
3. Toggle **Block ads** on or off

Your preference is stored locally via `chrome.storage`.

## Privacy

- Only permission used: `storage` (to remember the enabled state)
- Host access limited to ChatGPT domains
- No data collection, no accounts, no external requests from the extension

## Project structure

```
├── manifest.json      # Extension manifest (MV3)
├── background.js      # Service worker (install / reload)
├── content.js         # Ad detection and hiding on ChatGPT pages
├── popup.html / .js   # Popup UI and toggle
├── thank-you.html     # Post-install page
└── icons/             # Extension icons
```

## Contributing

Bug reports and pull requests are welcome — especially when ChatGPT changes its ad markup and selectors need updating.

By contributing, you agree that your contributions are licensed under the same terms as this project.

## Support

This extension is free for personal use. If you find it useful, you can [buy me a coffee](https://buymeacoffee.com/piotrpaluczak).

## License

This project is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE).

**Allowed (examples):**

- Personal use
- Private study, hobby projects, and testing
- Viewing the source for transparency / security review
- Non-commercial forks and modifications under the same license

**Not allowed (examples):**

- Selling the extension or using it in a commercial product
- Publishing this extension (or a modified version) to the Chrome Web Store or other extension stores for commercial purposes
- Any other commercial use of the code without prior written permission

For commercial licensing, contact the author.
