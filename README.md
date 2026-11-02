# Dev2Done static website

This repository contains the extracted contents of `archive.zip` plus a first-paint loader and embedded live demos.

## Publish
Upload `index.html` and `assets/` into the document root of `dev2done.web86.site`.
The `experiments/` folder is optional and retained from the original archive.
No Node, package manager, database or build step is required. `archive.zip` remains as the original backup.

## Demo
The landing page loads two separate iframe views lazily and preserves their state when toggled.
The standalone demo is at https://app.dev2done.web86.site/demo .
The two frames use the supplied project UUID `19fe7520-ef15-51ae-ae94-3a582ed5474e`.

**Important:** if the application uses `X-Frame-Options: DENY` or `SAMEORIGIN`, or restrictive CSP `frame-ancestors`, the application must separately permit embedding of *only public demo routes* by `https://dev2done.web86.site`. Never relax headers for authenticated admin/workspace routes. A forbidden frame cannot be fixed from the static site; a direct demo link is present as a fallback.

## Loader
Critical inline CSS and a tiny inline script prevent unstyled content flashes. The loader exits on window load, with a 2.5-second failsafe and reduced-motion support.

This change does not deploy anything or modify the app repository.
