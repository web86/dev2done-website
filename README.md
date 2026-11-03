# Dev2Done static website

The public landing site is plain HTML, CSS and vanilla JavaScript. No build tool, database or translation service is required. It uses the original design, Ambient Grid hero, real product screenshots, six interactive capability diagrams, AI-agent presentation and branding showcase.

## Language pages

| Locale | URL | File |
| --- | --- | --- |
| English | `/` | `index.html` |
| Russian | `/ru/` | `ru/index.html` |
| Turkish | `/tr/` | `tr/index.html` |
| Simplified Chinese | `/zh-cn/` | `zh-cn/index.html` |

All pages use shared, root-relative paths under `/assets/`. The language dropdown is in the main header, works on mobile and desktop, and is keyboard-accessible using native `<details>` and `<summary>`.

The browser's preferred locale is considered only when opening the English **root URL**. The user's last explicit language choice, when storage is available, takes precedence over the browser locale. Deep links to `/ru/`, `/tr/`, or `/zh-cn/` are never redirected, and selected language switches preserve the current section anchor. Browser preference for Traditional Chinese does not force Simplified Chinese. English is the default for unsupported languages.

The switcher keeps `Dev2Done` as the product name and does not translate screenshots; the 4 translated HTML pages include navigation, metadata, alt text, tabs, diagrams, agent showcase, branding, trial notice, pricing, FAQ and footer. Each page contains its own canonical and hreflang alternate tags. Existing `noindex, nofollow` is **intentionally preserved**; review it separately when the site is ready for indexing.

**To edit text:** edit the corresponding HTML page directly, keeping its identifiers, anchors and shared script references unchanged. New text must be translated in all 4 versions. `assets/js/site.js` contains language detection and interactions; `assets/css/languages.css` styles the switcher.

## Deployment on Jino

Upload `index.html`, the three language folders (`ru/`, `tr/`, `zh-cn/`) and shared `assets/` into the document root of `dev2done.web86.site`. Uploading only `index.html` will leave language links broken. All three translated directories need directory-index handling (`index.html`).

`experiments/` is optional. `archive.zip` is retained as the original imported archive.

## Demo

The hero contains `assets/img/main.webp`. The comparison section switches between `dev.webp` and `client.webp`; each is linked to the corresponding live demo on `app.dev2done.web86.site` in a separate tab. There are no iframes or nested scrollbars.

## Loader

Critical inline CSS and JavaScript prevent flashes of unstyled content. The loader exits after page load, has a 2.5-second fallback and respects reduced motion. Localization does not add any external runtime requests.

Nothing in this repository deploys the site to Jino or changes the application itself.
