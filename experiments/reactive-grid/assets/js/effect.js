/* Reactive Grid (original implementation for Dev2Done).
   Inspiration: https://animorio.com/en/animations/grid-background-that-lights-up-around-the-pointer/
   No source code or libraries from the reference demo are included. */
(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  const canvas = document.querySelector('[data-reactive-grid]');
  if (!hero || !canvas) return;
  const ctx = canvas.getContext('2d', { alpha:true });
  if(!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer:fine)');
  const motion=()=>!reduced.matches&&fine.matches;
  const CELL = 48;
  const RADIUS = 250;
  const cells = new Map();
  const ripples = [];
  let width=0, height=0, dpr=1, rect=null, visible=true, raf=0, last=0;
  let pointer=false, touched=false;
  let target={x:0,y:0}, glow={x:0,y:0};
  let lastRayAt=0, rays=[];
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const key=(x,y)=>x+':'+y;
  const color=(a)=>`rgba(126,148,255,${clamp(a,0,1)})`;
  function ignite(x,y,energy=1){
    const c=Math.floor(x/CELL),r=Math.floor(y/CELL);
    for(const [dx,dy,k] of [[0,0,1],[1,0,.34],[-1,0,.34],[0,1,.34],[0,-1,.34]]){
      const cx=c+dx,cy=r+dy;
      if(cx<0||cy<0||cx*CELL>width||cy*CELL>height)continue;
      const id=key(cx,cy);cells.set(id,{x:cx*CELL,y:cy*CELL,e:Math.max(energy*k,cells.get(id)?.e||0)});
    }
  }
  function resize(){
    rect=hero.getBoundingClientRect();
    width=rect.width;height=rect.height;
    dpr=Math.min(devicePixelRatio||1,1.7);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(!touched){target={x:width*.64,y:Math.min(height*.38,330)};glow={...target};ignite(target.x,target.y,.76)}
    if(reduced.matches)render(0,0);
  }
  function move(e){
    if(e.pointerType==='touch')return;
    if(!rect)rect=hero.getBoundingClientRect();
    target={x:clamp(e.clientX-rect.left,0,width),y:clamp(e.clientY-rect.top,0,height)};
    pointer=true;touched=true;
    if(reduced.matches){glow={...target};render(0,0)}
  }
  function pulse(e){
    const r=hero.getBoundingClientRect();
    const x=clamp(e.clientX-r.left,0,width),y=clamp(e.clientY-r.top,0,height);
    target={x,y};glow={x,y};touched=true;pointer=true;
    if(motion()){ripples.push({x,y,age:0});ignite(x,y,1)}
    else {ignite(x,y,.9);render(0,0)}
  }
  function render(dt,time){
    ctx.clearRect(0,0,width,height);
    // Broad, very dim light behind the fine linework.
    const halo=ctx.createRadialGradient(glow.x,glow.y,0,glow.x,glow.y,RADIUS*1.9);
    halo.addColorStop(0,'rgba(79,96,220,.145)');halo.addColorStop(.38,'rgba(60,81,184,.069)');halo.addColorStop(1,'rgba(42,65,145,0)');
    ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
    // Light individual fine grid lines, maximum brightness at the pointer.
    const left=Math.max(0,Math.floor((glow.x-RADIUS)/CELL)*CELL),right=Math.min(width,glow.x+RADIUS);
    const top=Math.max(0,Math.floor((glow.y-RADIUS)/CELL)*CELL),bottom=Math.min(height,glow.y+RADIUS);
    ctx.lineWidth=1;
    for(let x=left;x<=right;x+=CELL){
      const fall=Math.max(0,1-Math.abs(x-glow.x)/RADIUS);
      if(fall<=0)continue;
      const g=ctx.createLinearGradient(0,glow.y-RADIUS,0,glow.y+RADIUS);
      g.addColorStop(0,color(0));g.addColorStop(.5,color(.23*fall));g.addColorStop(1,color(0));
      ctx.strokeStyle=g;ctx.beginPath();ctx.moveTo(x+.5,glow.y-RADIUS);ctx.lineTo(x+.5,glow.y+RADIUS);ctx.stroke();
    }
    for(let y=top;y<=bottom;y+=CELL){
      const fall=Math.max(0,1-Math.abs(y-glow.y)/RADIUS);
      if(fall<=0)continue;
      const g=ctx.createLinearGradient(glow.x-RADIUS,0,glow.x+RADIUS,0);
      g.addColorStop(0,color(0));g.addColorStop(.5,color(.23*fall));g.addColorStop(1,color(0));
      ctx.strokeStyle=g;ctx.beginPath();ctx.moveTo(glow.x-RADIUS,y+.5);ctx.lineTo(glow.x+RADIUS,y+.5);ctx.stroke();
    }
    for(const [id,c] of cells){
      c.e*=Math.exp(-dt*1.22);
      if(c.e<.018){cells.delete(id);continue}
      ctx.fillStyle=color(.12*c.e*c.e);ctx.fillRect(c.x+1,c.y+1,CELL-2,CELL-2);
      ctx.strokeStyle=color(.28*c.e);ctx.strokeRect(c.x+.5,c.y+.5,CELL,CELL);
    }
    for(let i=ripples.length-1;i>=0;i--){
      const ring=ripples[i];ring.age+=dt;
      if(ring.age>1.25){ripples.splice(i,1);continue}
      const progress=ring.age/1.25,rr=progress*RADIUS*1.65;
      ctx.strokeStyle=color(.35*(1-progress));ctx.lineWidth=1.6;
      ctx.beginPath();ctx.arc(ring.x,ring.y,rr,0,Math.PI*2);ctx.stroke();
      if(Math.random()<.25){const angle=Math.random()*Math.PI*2;ignite(ring.x+rr*Math.cos(angle),ring.y+rr*Math.sin(angle),.45*(1-progress))}
    }
    if(!reduced.matches){
      if(time-lastRayAt>4200){lastRayAt=time;rays.push({horizontal:Math.random()>.5,offset:Math.floor(Math.random()*(height/CELL))*CELL,progress:-230});}
      for(let i=rays.length-1;i>=0;i--){
        const ray=rays[i];ray.progress+=dt*450;
        const extent=ray.horizontal?width:height;
        if(ray.progress>extent+250){rays.splice(i,1);continue}
        const grad=ray.horizontal?ctx.createLinearGradient(ray.progress-150,0,ray.progress,0):ctx.createLinearGradient(0,ray.progress-150,0,ray.progress);
        grad.addColorStop(0,color(0));grad.addColorStop(.7,color(.15));grad.addColorStop(1,color(.35));
        ctx.strokeStyle=grad;ctx.lineWidth=1.2;ctx.beginPath();
        if(ray.horizontal){ctx.moveTo(ray.progress-150,ray.offset+.5);ctx.lineTo(ray.progress,ray.offset+.5)}
        else{ctx.moveTo(ray.offset+.5,ray.progress-150);ctx.lineTo(ray.offset+.5,ray.progress)}ctx.stroke();
      }
    }
  }
  function frame(time){
    if(!visible||document.hidden){raf=0;return}
    const dt=Math.min(.05,Math.max(0,(time-last)/1000||.016));last=time;
    const smooth=1-Math.pow(.075,dt*6);
    glow.x+=(target.x-glow.x)*smooth;glow.y+=(target.y-glow.y)*smooth;
    if(motion() && pointer) ignite(glow.x,glow.y,.88);
    render(dt,time);
    if(motion())raf=requestAnimationFrame(frame);else raf=0;
  }
  function start(){if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}}
  hero.addEventListener('pointermove',move,{passive:true});
  hero.addEventListener('pointerleave',()=>{pointer=false});
  hero.addEventListener('pointerdown',pulse,{passive:true});
  window.addEventListener('resize',()=>{resize();start()},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&visible)start()});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else if(raf){cancelAnimationFrame(raf);raf=0}},{threshold:0}).observe(hero);
  reduced.addEventListener('change',()=>{if(!motion()){if(raf)cancelAnimationFrame(raf);raf=0;render(0,0)}else start()});
  resize();start();
})();
