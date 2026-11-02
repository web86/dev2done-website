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

    const steps = [
      {tag:'New request',title:'It starts with a simple idea.',description:'Your client describes what they need in their own words. Dev2Done keeps the request in the project, ready for clarification and planning.',example:'“We need a contact form that works well on phones.”'},
      {tag:'Clarification',title:'Turn questions into clarity.',description:'Ask what matters, discuss the details, and attach examples — all in the task instead of scattered messages.',example:'“Should we include a phone field? Where should new submissions go?”'},
      {tag:'Scope approved',title:'Agree on what will be built.',description:'The client approves the requirements before the team starts. Scope approval is recorded separately from the eventual acceptance of work.',example:'✓ Requirements approved by the client'},
      {tag:'In progress',title:'Move work forward.',description:'Developers manage their work, estimates, internal notes, and assignments while the client follows understandable project progress.',example:'Contact form · Implementation in progress · 6.5 hours estimated'},
      {tag:'Client review',title:'Make feedback part of delivery.',description:'Send completed work back for client review. They can accept it or request changes without starting another email thread.',example:'“Looks great. Please update the button text and we’re ready.”'},
      {tag:'Completed',title:'Know when a task is truly done.',description:'The result is accepted, the task history stays available, and everyone can see what was agreed and delivered.',example:'✓ Contact form · Done'}
    ];
    const stepButtons = [...document.querySelectorAll('.step-item')];
    const fields = {
      count:document.getElementById('step-counter'), tag:document.getElementById('step-tag'),
      title:document.getElementById('step-title'), description:document.getElementById('step-description'),
      example:document.getElementById('step-example')
    };
    function setStep(index, focus = false) {
      const item = steps[index];
      if (!item) return;
      stepButtons.forEach((button,i)=>{
        const active = i === index;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
        if (active && focus) button.focus();
      });
      if (fields.count) fields.count.textContent = `STEP ${String(index + 1).padStart(2,'0')} / 06`;
      if (fields.tag) fields.tag.textContent = item.tag;
      if (fields.title) fields.title.textContent = item.title;
      if (fields.description) fields.description.textContent = item.description;
      if (fields.example) fields.example.textContent = item.example;
    }
    stepButtons.forEach((button,i)=>{
      button.addEventListener('click',()=>setStep(i));
      button.addEventListener('keydown',e=>{
        if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) return;
        e.preventDefault();
        const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
        setStep((i + dir + steps.length) % steps.length,true);
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady, {once:true});
  else onReady();
})();
