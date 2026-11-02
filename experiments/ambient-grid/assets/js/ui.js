/* Dev2Done isolated hero comparison UI. */
(() => {
  'use strict';
  const header=document.querySelector('.site-header');
  if(header){
    let pending=false;
    function sync(){header.classList.toggle('is-scrolled',window.scrollY>30);pending=false}
    sync();
    window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(sync)}},{passive:true});
  }
  const menu=document.querySelector('.menu-button');
  const nav=document.getElementById('main-nav');
  if(menu&&nav){
    const close=()=>{nav.classList.remove('is-open');header?.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');};
    menu.addEventListener('click',()=>{const on=nav.classList.toggle('is-open');header?.classList.toggle('menu-open',on);menu.setAttribute('aria-expanded',String(on));menu.setAttribute('aria-label',on?'Close menu':'Open menu')});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!menu.contains(e.target))close()});
  }
  const trial=document.getElementById('trial-dialog');
  if(trial){
    document.querySelectorAll('[data-open-trial]').forEach(b=>b.addEventListener('click',()=>trial.showModal?.()));
    trial.querySelectorAll('[data-close-trial]').forEach(b=>b.addEventListener('click',()=>trial.close()));
    trial.addEventListener('click',e=>{if(e.target===trial)trial.close()});
  }
})();
