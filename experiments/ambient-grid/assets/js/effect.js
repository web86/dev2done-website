/* Ambient grid (original independent implementation for Dev2Done).
   Inspiration: https://webdevpuneet.com/ui-snippets/animated-grid-background/ */
(() => {
  'use strict';
  const hero=document.querySelector('.hero'),spot=document.querySelector('.fx-spot');
  if(!hero||!spot)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(pointer:fine)');
  let rect, w=0,h=0,visible=true,raf=0,last=0,lastMove=0;
  let pos={x:0,y:0},target={x:0,y:0};
  function resize(){
    rect=hero.getBoundingClientRect();w=rect.width;h=rect.height;
    if(!lastMove){pos={x:w*.55,y:h*.34};target={...pos}}
    render();
  }
  function render(){
    const rad=window.innerWidth<=650?260:375;
    spot.style.transform=`translate3d(${(pos.x-rad).toFixed(2)}px,${(pos.y-rad).toFixed(2)}px,0)`;
  }
  function pointer(e){
    if(!fine.matches||e.pointerType==='touch'||reduced.matches)return;
    rect=hero.getBoundingClientRect();
    target.x=e.clientX-rect.left;target.y=e.clientY-rect.top;lastMove=performance.now();
  }
  function animate(t){
    if(!visible||document.hidden){raf=0;return}
    const dt=Math.min(.05,Math.max(0,(t-last)/1000||.016));last=t;
    if(t-lastMove>2300){
      target.x=w*(.50+.16*Math.sin(t*.00042));
      target.y=h*(.32+.095*Math.sin(t*.00057+1.1));
    }
    const k=1-Math.exp(-dt*4.8);
    pos.x+=(target.x-pos.x)*k;pos.y+=(target.y-pos.y)*k;
    render();raf=requestAnimationFrame(animate);
  }
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;}
  function start(){if(!raf&&!reduced.matches&&fine.matches&&visible){last=performance.now();raf=requestAnimationFrame(animate)}}
  hero.addEventListener('pointermove',pointer,{passive:true});
  hero.addEventListener('pointerleave',()=>{lastMove=0});
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else stop()},{threshold:0}).observe(hero);
  reduced.addEventListener('change',()=>{if(reduced.matches){stop();pos={x:w*.5,y:h*.32};render()}else start()});
  resize();if(reduced.matches||!fine.matches){pos={x:w*.5,y:h*.32};render()}else start();
})();
