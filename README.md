# DevKit — Free Developer Tools

A fast, minimal, fully static collection of developer utilities. No backend, no build step, no tracking.

## Tools

- **JSON Formatter & Validator** — beautify, minify, validate
- **Base64 Encode / Decode** — UTF-8 safe, URL-safe variant
- **URL Encode / Decode** — component & full-URI modes
- **Timestamp Converter** — Unix ⇄ human-readable, any timezone
- **UUID v4 Generator** — bulk, cryptographically random
- **Regex Tester** — live highlighting, capture groups, all flags
- **Text Case Converter** — camelCase, snake_case, PascalCase, kebab, CONSTANT, etc.

## Features

- Dark mode by default, light theme toggle (saved to `localStorage`)
- Mobile-first responsive layout
- One-click copy & download everywhere
- Auto-format / live output as you type (debounced)
- Keyboard shortcuts (`Ctrl/⌘+Enter` to process)
- Helpful error messages with line/column for JSON
- Zero external dependencies — pure HTML / CSS / vanilla JS
- Per-page SEO (title, meta description, OG tags, JSON-LD)

## Run locally

Just open `index.html` in a browser. That's it.

For a tiny local server (recommended so relative paths behave like production):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new repo and push these files to the default branch.
2. In the repo, go to **Settings → Pages**.
3. Set **Source: Deploy from a branch**, pick `main` (or `master`) and `/ (root)`.
4. Save. Your site is live at `https://<user>.github.io/<repo>/` in ~1 minute.

No build step, no GitHub Actions, no configuration file required.

## Folder structure

```
.
├── index.html
├── favicon.svg
├── README.md
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── common.js     # theme, clipboard, toast, shortcuts
│       └── partials.js   # shared header/footer renderer
└── tools/
    ├── json-formatter.html
    ├── base64.html
    ├── url-encoder.html
    ├── timestamp.html
    ├── uuid.html
    ├── regex.html
    └── case-converter.html
```

## License

MIT — fork it, host it, customize it. It's yours.
