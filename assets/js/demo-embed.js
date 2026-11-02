/* Dev2Done demo embeds — real application, separate origin */
(()=>{'use strict';function init(){const stage=document.getElementById('live-demo-stage');if(!stage)return;
const tabs=[...stage.querySelectorAll('.role-tab')],button=document.getElementById('demo-fullscreen'),loaded={developer:false,client:false};
function begin(role){const f=document.getElementById('frame-'+role);if(!f||loaded[role])return;loaded[role]=true;
f.addEventListener('load',()=>f.closest('.demo-frame-panel')?.classList.add('is-loaded'),{once:true});f.src=f.dataset.src;}
function activate(){const role=tabs.find(t=>t.getAttribute('aria-selected')==='true')?.dataset.role||'developer';begin(role)}
const obs=new MutationObserver(activate);tabs.forEach(t=>obs.observe(t,{attributes:true,attributeFilter:['aria-selected']}));
const visibility=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting)){activate();visibility.disconnect()}},{rootMargin:'320px'});visibility.observe(stage);
function update(){const active=document.fullscreenElement===stage||stage.classList.contains('is-fullscreen-fallback');button?.setAttribute('aria-label',active?'Exit fullscreen demo':'Enter fullscreen demo');const span=button?.querySelector('span');if(span)span.textContent=active?'Exit fullscreen':'Fullscreen'}
async function toggle(){if(document.fullscreenElement===stage){await document.exitFullscreen();return}if(stage.classList.contains('is-fullscreen-fallback')){stage.classList.remove('is-fullscreen-fallback');document.body.classList.remove('demo-scroll-lock');update();return}
if(stage.requestFullscreen){try{await stage.requestFullscreen();update();return}catch(_){}}stage.classList.add('is-fullscreen-fallback');document.body.classList.add('demo-scroll-lock');update()}
button?.addEventListener('click',toggle);document.addEventListener('fullscreenchange',update);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&stage.classList.contains('is-fullscreen-fallback'))toggle()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();