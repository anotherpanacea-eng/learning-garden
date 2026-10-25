// Drawn how-tos: a short pencil drawing that plays through once, then can be stepped with Back and Next.
// Watching records nothing. Pages include drawnHowtoTag(id); the element builds and cleans up itself.
// Each picture is a small module of its own, fetched the first time its how-to opens.
import {drawnHowto,howtoForPage} from './drawn-howtos-content.mjs';

export const REST_MS=650;
// Each step draws in one to two seconds, scaled by how much pencil it uses.
export const stepMs=strokes=>Math.min(1800,Math.max(900,Math.round(strokes.reduce((n,s)=>n+s[2],0)*1.1)));

// Playback as a pure state change. `playing` means steps keep following one another;
// `drawn` means the current step's strokes are complete.
export function howtoNext(s,action,count){
 const last=count-1;
 switch(action){
  case 'open':case 'again':return {step:0,playing:!s.reduced,drawn:!!s.reduced,reduced:!!s.reduced};
  case 'drawn':return {...s,drawn:true,playing:s.playing&&s.step<last};
  case 'advance':return s.playing&&s.drawn&&s.step<last?{...s,step:s.step+1,drawn:false}:s;
  case 'next':return s.step<last?{...s,step:s.step+1,playing:false,drawn:!!s.reduced}:{...s,playing:false,drawn:true};
  case 'back':return s.step>0?{...s,step:s.step-1,playing:false,drawn:true}:{...s,playing:false,drawn:true};
  case 'pause':return {...s,playing:false};
  case 'play':return s.step===last&&s.drawn?s:s.drawn?{...s,playing:true,step:s.step+1,drawn:s.reduced}:{...s,playing:true};
  default:return s;
 }
}

export const loadArt=id=>import(`./drawn-howtos/${id}.mjs`).then(m=>m.default);
export const drawnHowtoTag=id=>drawnHowto(id)?`<drawn-howto data-how="${id}"></drawn-howto>`:'';
// Pages without their own tag get their how-to just after the page heading.
export function offerHowto(main,hash){const h=howtoForPage(hash),title=main.querySelector('h1');if(!h||!title||main.querySelector('drawn-howto'))return;
 const box=title.parentElement,isHeading=box!==main&&(box.tagName==='HEADER'||/heading/.test(box.className));
 const after=isHeading?box:title.nextElementSibling?.tagName==='P'?title.nextElementSibling:title;after.insertAdjacentHTML('afterend',drawnHowtoTag(h.id));}
// Some benches redraw their own part of the page; offer the how-to again if a redraw removed it.
export function keepOfferingHowto(main,page){let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;offerHowto(main,page());});}).observe(main,{childList:true,subtree:true});}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;

function picture(h,a){return `<svg class="dh-picture" viewBox="-6 -6 ${a.width+12} ${a.height+12}" style="max-width:${Math.round((a.width+12)*1.25)}px" role="img" aria-label="${esc(h.alt)}">${a.steps.map((step,i)=>`<g data-dh-step="${i}" visibility="hidden">${step.map(([kind,d,len])=>kind[0]==='w'||kind==='bg'?`<path class="dh-${kind}" d="${d}"/>`:`<path class="dh-${kind}" d="${d}" data-len="${len}"/>`).join('')}</g>`).join('')}</svg>`;}

const Base=typeof HTMLElement==='undefined'?class{}:HTMLElement;
class DrawnHowto extends Base{
 connectedCallback(){if(this.ready)return;this.ready=true;const h=drawnHowto(this.dataset.how);if(!h)return;this.how=h;this.token=0;this.anims=[];
  this.innerHTML=`<button type="button" class="soft-button dh-open" aria-expanded="false">${esc(h.button)}</button>`;
  this.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!this.contains(b))return;if(b.classList.contains('dh-open'))this.load();else if(b.dataset.dh)this.act(b.dataset.dh);});}
 disconnectedCallback(){this.stop();}
 stop(){clearTimeout(this.rest);this.rest=null;this.token++;for(const a of this.anims||[])a.cancel();this.anims=[];}
 // A failed fetch leaves the button in place to try again.
 load(){const b=this.querySelector('.dh-open');if(this.art)return this.open();if(b.getAttribute('aria-busy'))return;b.setAttribute('aria-busy','true');
  loadArt(this.how.id).then(art=>{b.removeAttribute('aria-busy');if(!this.isConnected)return;this.art=art;this.open();},()=>b.removeAttribute('aria-busy'));}
 open(){const h=this.how,openButton=this.querySelector('.dh-open');openButton.hidden=true;openButton.setAttribute('aria-expanded','true');
  this.insertAdjacentHTML('beforeend',`<div class="dh-panel" role="group" aria-label="${esc(h.title)}">${picture(h,this.art)}<p class="dh-caption" aria-live="polite"></p><div class="dh-controls"><button type="button" data-dh="back">Back</button><button type="button" data-dh="toggle"></button><button type="button" data-dh="next">Next</button><span class="dh-count"></span></div><ol class="dh-all" hidden>${h.steps.map(s=>`<li>${esc(s.caption)}</li>`).join('')}</ol><div class="dh-controls"><button type="button" data-dh="again">Watch again</button><button type="button" data-dh="close">Close</button></div></div>`);
  this.state=howtoNext({reduced:reducedMotion()},'open',h.steps.length);this.show(true);this.querySelector(this.state.reduced?'[data-dh="next"]':'[data-dh="toggle"]').focus();}
 close(){this.stop();this.querySelector('.dh-panel')?.remove();const b=this.querySelector('.dh-open');b.hidden=false;b.setAttribute('aria-expanded','false');b.focus();}
 act(kind){if(kind==='close')return this.close();const before=this.state,n=this.how.steps.length;
  if(kind==='toggle')kind=before.playing?'pause':'play';
  if(kind==='pause'){clearTimeout(this.rest);this.rest=null;for(const a of this.anims)a.pause();this.state=howtoNext(before,'pause',n);return this.controls();}
  if(kind==='play'&&!before.drawn&&this.anims.length){this.state=howtoNext(before,'play',n);for(const a of this.anims)a.play();return this.controls();}
  this.stop();this.state=howtoNext(before,kind,n);this.show(kind==='again'||this.state.step!==before.step&&!this.state.drawn);}
 // Show finished steps whole, hide later ones, and draw the current step unless it is already drawn.
 show(animate){const {step,drawn}=this.state,groups=[...this.querySelectorAll('[data-dh-step]')],token=++this.token;this.anims=[];
  groups.forEach((g,i)=>{g.setAttribute('visibility',i>step?'hidden':'visible');for(const p of g.querySelectorAll('path')){p.style.strokeDasharray='';p.style.strokeDashoffset='';p.style.opacity='';}});
  if(animate&&!drawn&&typeof Element.prototype.animate==='function'){const strokes=this.art.steps[step],ms=stepMs(strokes),total=strokes.reduce((n,s)=>n+s[2],0)||1;let at=0;
   for(const p of groups[step].querySelectorAll('path')){const len=Number(p.dataset.len||0);
    if(!len){this.anims.push(p.animate([{opacity:0},{opacity:1}],{duration:ms*.4,fill:'both'}));continue;}
    p.style.strokeDasharray=`${len+2} ${len+2}`;this.anims.push(p.animate([{strokeDashoffset:len+1},{strokeDashoffset:0}],{duration:Math.max(60,ms*len/total),delay:ms*at/total,fill:'both',easing:'ease-in-out'}));at+=len;}
   Promise.all(this.anims.map(a=>a.finished)).then(()=>{if(token===this.token)this.drawn();},()=>{});}
  else if(!drawn||this.state.playing)queueMicrotask(()=>{if(token===this.token)this.drawn();});
  this.controls();}
 drawn(){this.state=howtoNext(this.state,'drawn',this.how.steps.length);this.controls();
  if(this.state.playing){const token=this.token;this.rest=setTimeout(()=>{if(token!==this.token)return;this.rest=null;const before=this.state.step;this.state=howtoNext(this.state,'advance',this.how.steps.length);this.show(this.state.step!==before);},REST_MS);}}
 controls(){const {step,playing,drawn}=this.state,n=this.how.steps.length,last=step===n-1&&drawn,q=s=>this.querySelector(s);
  const caption=q('.dh-caption'),text=this.how.steps[step].caption;if(caption.textContent!==text)caption.textContent=text;
  q('.dh-count').textContent=`Step ${step+1} of ${n}`;q('[data-dh="back"]').disabled=step===0;q('[data-dh="next"]').disabled=last;
  const toggle=q('[data-dh="toggle"]'),next=q('[data-dh="next"]'),stranded=[toggle,next].includes(document.activeElement);toggle.textContent=playing?'Pause':'Play';toggle.disabled=last;q('.dh-all').hidden=!last;
  if(stranded&&document.activeElement.disabled)q('[data-dh="again"]').focus();}
}
if(typeof customElements!=='undefined'&&!customElements.get('drawn-howto'))customElements.define('drawn-howto',DrawnHowto);
