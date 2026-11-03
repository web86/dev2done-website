/* Dev2Done static website — no frameworks, cookies, API calls or build step. */
(() => {
  'use strict';

  // Only English exists in the first release. To add a language later:
  // 1. Upload the translated HTML at /ru/index.html, /tr/index.html, /zh/index.html.
  // 2. Add the language code to AVAILABLE_LOCALES below.
  // 3. Include this same JS and absolute /assets/ references in translated pages.
  const AVAILABLE_LOCALES = ['en'];
  const LOCALE_ROOTS = { en: '/', ru: '/ru/', tr: '/tr/', zh: '/zh/' };

  function chooseLocale(code) {
    const lang = String(code || '').toLowerCase();
    if (/^ru(?:-|$)/.test(lang)) return 'ru';
    if (/^tr(?:-|$)/.test(lang)) return 'tr';
    // Match only Simplified Chinese. zh-TW/HK/MO and ambiguous 'zh' fall back to English.
    if (/^(zh-cn|zh-hans|zh-sg)(?:-|$)/.test(lang)) return 'zh';
    if (/^en(?:-|$)/.test(lang)) return 'en';
    return null;
  }

  function detectLanguage() {
    // Auto-redirect only on the English root, never on explicit translated URLs.
    const path = window.location.pathname;
    if (path !== '/' && path !== '/index.html') return;
    const override = new URLSearchParams(window.location.search).get('lang');
    if (override && AVAILABLE_LOCALES.includes(chooseLocale(override))) return;
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
    for (const language of languages) {
      const chosen = chooseLocale(language);
      if (AVAILABLE_LOCALES.includes(chosen) && chosen !== 'en') {
        window.location.replace(LOCALE_ROOTS[chosen] + window.location.search + window.location.hash);
        return;
      }
      if (AVAILABLE_LOCALES.includes(chosen)) return;
    }
  }
  detectLanguage();

  function onReady() {
    const header = document.querySelector('.site-header');
    if (header) {
      let scheduled = false;
      const syncHeader = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 30);
        scheduled = false;
      };
      syncHeader();
      window.addEventListener('scroll', () => {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(syncHeader);
      }, {passive:true});
    }
    const trialDialog = document.getElementById('trial-dialog');
    if (trialDialog) {
      document.querySelectorAll('[data-open-trial]').forEach(button => button.addEventListener('click', () => {
        if (typeof trialDialog.showModal === 'function') trialDialog.showModal();
      }));
      trialDialog.querySelectorAll('[data-close-trial]').forEach(control => control.addEventListener('click', () => trialDialog.close()));
      trialDialog.addEventListener('click', event => { if (event.target === trialDialog) trialDialog.close(); });
    }
    const menu = document.querySelector('.menu-button');
    const nav = document.getElementById('main-nav');
    if (menu && nav) {
      const closeMenu = () => { document.querySelector('.site-header')?.classList.remove('menu-open'); nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open menu'); };
      menu.addEventListener('click', () => {
        const opened = nav.classList.toggle('is-open'); document.querySelector('.site-header')?.classList.toggle('menu-open', opened);
        menu.setAttribute('aria-expanded', String(opened));
        menu.setAttribute('aria-label', opened ? 'Close menu' : 'Open menu');
      });
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
      document.addEventListener('click', e => { if (!nav.contains(e.target) && !menu.contains(e.target)) closeMenu(); });
    }

    // The two roles show different synthetic views of exactly the same project.
    const roleTabs = [...document.querySelectorAll('.role-tab')];
    const rolePanels = [...document.querySelectorAll('.role-panel')];
    function selectRole(role, focus = false) {
      roleTabs.forEach(tab => {
        const active = tab.dataset.role === role;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        if (active && focus) tab.focus();
      });
      rolePanels.forEach(panel => { panel.hidden = panel.id !== 'panel-' + role; });
    }
    roleTabs.forEach((tab, i) => {
      tab.addEventListener('click', () => selectRole(tab.dataset.role));
      tab.addEventListener('keydown', e => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const next = roleTabs[(i + (e.key === 'ArrowRight' ? 1 : roleTabs.length - 1)) % roleTabs.length];
        selectRole(next.dataset.role, true);
      });
    });

    // The product showcase uses accessible tabs with six static HTML/CSS infographics.
    const capabilityTabs = [...document.querySelectorAll('.sc-tab')];
    const capabilityPanels = [...document.querySelectorAll('.sc-panel')];
    function selectCapability(index, focus = false) {
      if (index < 0 || index >= capabilityTabs.length) return;
      capabilityTabs.forEach((tab,i) => {
        const active = i === index;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        if (active && focus) tab.focus();
      });
      capabilityPanels.forEach((panel,i) => { panel.hidden = i !== index; });
    }
    capabilityTabs.forEach((tab,index) => {
      tab.addEventListener('click', () => selectCapability(index));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % capabilityTabs.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + capabilityTabs.length) % capabilityTabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = capabilityTabs.length - 1;
        else return;
        event.preventDefault();
        selectCapability(next, true);
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady, {once:true});
  else onReady();
})();
