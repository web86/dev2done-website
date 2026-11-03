/* Dev2Done static website — independent localized HTML pages, no build step. */
(() => {
  'use strict';

  // Languages are complete static HTML documents, not runtime translated fragments.
  const LOCALE_ROOTS = { en: '/', ru: '/ru/', tr: '/tr/', zh: '/zh-cn/' };
  const STORAGE_KEY = 'dev2done-language';

  function normalizeLocale(code) {
    const language = String(code || '').trim().toLowerCase().replace(/_/g, '-');
    if (/^ru(?:-|$)/.test(language)) return 'ru';
    if (/^tr(?:-|$)/.test(language)) return 'tr';
    if (/^(zh-cn|zh-hans|zh-sg)(?:-|$)/.test(language)) return 'zh';
    if (/^en(?:-|$)/.test(language)) return 'en';
    return null;
  }

  function savedLocale() {
    try { const value = localStorage.getItem(STORAGE_KEY); return LOCALE_ROOTS[value] ? value : null; }
    catch (_) { return null; }
  }

  function rememberLocale(locale) {
    try { localStorage.setItem(STORAGE_KEY, locale); } catch (_) { /* Private browsing may block storage. */ }
  }

  function detectLanguage() {
    // Respect explicit /ru/, /tr/, and /zh-cn/ links. Detect only on the English root.
    if (!['/', '/index.html'].includes(window.location.pathname)) return;
    const parameters = new URLSearchParams(window.location.search);
    const explicit = normalizeLocale(parameters.get('lang'));
    if (explicit) {
      rememberLocale(explicit);
      if (explicit !== 'en') window.location.replace(LOCALE_ROOTS[explicit] + window.location.hash);
      return;
    }
    let preferred = savedLocale();
    if (!preferred) {
      const languages = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
      for (const language of languages) {
        preferred = normalizeLocale(language);
        if (preferred) break;
      }
    }
    if (preferred && preferred !== 'en') {
      window.location.replace(LOCALE_ROOTS[preferred] + window.location.hash);
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
    const languageSwitcher = document.getElementById('language-switcher');
    if (languageSwitcher) {
      languageSwitcher.querySelectorAll('[data-lang-code]').forEach(link => {
        link.addEventListener('click', event => {
          const locale = link.dataset.langCode;
          if (!LOCALE_ROOTS[locale]) return;
          rememberLocale(locale);
          event.preventDefault();
          const url = new URL(LOCALE_ROOTS[locale], window.location.origin);
          url.hash = window.location.hash;
          window.location.assign(url.href);
        });
      });
      document.addEventListener('click', event => {
        if (!languageSwitcher.contains(event.target)) languageSwitcher.open = false;
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && languageSwitcher.open) {
          languageSwitcher.open = false;
          languageSwitcher.querySelector('summary')?.focus();
        }
      });
    }
    const menu = document.querySelector('.menu-button');
    const nav = document.getElementById('main-nav');
    if (menu && nav) {
      const closeMenu = () => { document.querySelector('.site-header')?.classList.remove('menu-open'); nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', document.documentElement.dataset.menuOpenLabel || 'Open menu'); };
      menu.addEventListener('click', () => {
        const opened = nav.classList.toggle('is-open'); document.querySelector('.site-header')?.classList.toggle('menu-open', opened);
        menu.setAttribute('aria-expanded', String(opened));
        menu.setAttribute('aria-label', opened ? (document.documentElement.dataset.menuCloseLabel || 'Close menu') : (document.documentElement.dataset.menuOpenLabel || 'Open menu'));
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
