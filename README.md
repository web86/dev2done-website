# Dev2Done static website

This repository contains the extracted contents of `archive.zip` plus a first-paint loader and static screenshots of the two live demo perspectives.

## Publish
Upload `index.html` and `assets/` into the document root of `dev2done.web86.site`.
The `experiments/` folder is optional and retained from the original archive.
No Node, package manager, database or build step is required. `archive.zip` remains as the original backup.

## Demo
The hero displays a real screenshot (main.webp), while the section below switches between developer (dev.webp) and client (client.webp) screenshots of the same demo project. No iframe or nested scrollbar is used.

Each screenshot links to the corresponding live demo on app.dev2done.web86.site in a new tab. The generic demo selection page is https://app.dev2done.web86.site/demo.

The 3 WebP images must be present in assets/img/ before publishing this branch. They are supplied separately as part of the accompanying static-image package.

## Loader
Critical inline CSS and a tiny inline script prevent unstyled content flashes. The loader exits on window load, with a 2.5-second failsafe and reduced-motion support.

This change does not deploy anything or modify the app repository.
