Dev2Done — TWO INDEPENDENT HERO BACKGROUND EXPERIMENTS
===================================================

A — reactive-grid/
    Inspired by the visual idea of:
    https://animorio.com/en/animations/grid-background-that-lights-up-around-the-pointer/
    An original vanilla JS Canvas implementation (NO Animorio source files or GSAP).
    Highlights grid cells, leaves fading trails, shows ripple on click, with subtle occasional light rays.

B — ambient-grid/
    Inspired by the visual idea of:
    https://webdevpuneet.com/ui-snippets/animated-grid-background/
    An original CSS + vanilla JS implementation (NO external dependencies).
    Seamless grid pan, smooth follower light, subtle idle motion.

Both include the SAME Dev2Done dark Hero, original project preview, transparent-to-glass header,
mobile layout, and modal explaining that the Studio Trial is not active yet.
They contain only the Hero and a comparison section, NOT the entire production homepage.

TRY LOCALLY:
- Open compare-index.html, or each folder's index.html.
- Move the mouse over the hero; click anywhere in variant A for a light ring.
- Scroll to observe the navigation surface change.

DEPLOY TO JINO WITHOUT CHANGING YOUR EXISTING HOMEPAGE:
1. Back up existing dev2done.web86.site files.
2. Create $HOME/domains/dev2done.web86.site/experiments/
3. Copy the two folders reactive-grid/ and ambient-grid/ there.
4. Copy compare-index.html as experiments/index.html if desired.
5. Open https://dev2done.web86.site/experiments/
6. When you select an effect, later merge only that effect's CSS + JS into the main hero.
   Do not simply replace the main site's entire index.html with an experiment.

DEV NOTES:
- CSS files are included in both variants to run independently.
- No npm, Vite, Laravel, CDN, external fonts, API tokens, cookies, or build step.
- reduce-motion users have a nonmoving version; mobile coarse pointers use static light.
- References linked for design inspiration only; animation code authored separately.
- Temporary preview markup sets noindex/nofollow. Remove when appropriate for launch.
- Static HTML, CSS, and JS can be edited in the Jino file manager.
