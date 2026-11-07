import {moonlightCopy as T,moonlightPlaces} from './moonlight-content.mjs';
import {createMoonlight,changeMoonlight,moonlightModel,moonlightNarration} from './moonlight-core.mjs';
import {moonArt,hemisphereView} from './sky-notes-core.mjs';
import {hearButton} from './play-media.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let visit=null,rendering=0;
function identify(book,owner){if(visit&&(visit.book!==book||visit.owner!==owner)){visit=null;rendering++;}return visit;}
export function resetMoonlight(){visit=null;rendering++;}
export function moonlightActive(book,owner){return !!(visit?.active&&visit.book===book&&visit.owner===owner);}
export function openMoonlight(book,owner){if(!identify(book,owner))visit={book,owner,active:false,work:createMoonlight(hemisphereView(book).effective)};visit.active=true;}
export function closeMoonlight(){if(visit)visit.active=false;rendering++;}
export function moonlightEntry(){return `<aside class="ml-entry"><strong>${esc(T.title)}</strong><button type="button" class="secondary" data-moonlight-entry>${esc(T.entry)}</button></aside>`;}
const button=(action,label,extra='')=>`<button type="button" class="secondary" data-ml-action="${action}"${extra}>${esc(label)}</button>`;
const ball=`<svg data-ml-space-ball viewBox="0 0 28 28" aria-hidden="true" focusable="false"><circle class="sky-moon-dark" cx="14" cy="14" r="14"/><path class="sky-moon-lit" d="M14 0 A14 14 0 0 1 14 28 Z"/><circle class="sky-moon-edge" cx="14" cy="14" r="13" fill="none"/></svg>`;
function board(m){
 const nodes=moonlightPlaces.map(p=>{const angle=p.index*Math.PI/4,x=170+112*Math.cos(angle),y=170-112*Math.sin(angle),style=`left:${x/3.4}%;top:${y/3.4}%`;
 return m.showingExample?`<span class="ml-orbit-place${p.index===m.position?' ml-chosen':''}" style="${style}">${ball}</span>`:`<button type="button" class="ml-orbit-place${p.index===m.position?' ml-chosen':''}" style="${style}" data-ml-place="${p.index}" aria-label="${esc(p.location)}" aria-pressed="${p.index===m.position}">${ball}</button>`;}).join('');
 return `<figure class="ml-orbit"><h2>${esc(T.above)}</h2><div class="ml-board" data-ml-board role="group" aria-label="${esc(T.orbitDescription)}"><svg class="ml-map" viewBox="0 0 340 340" aria-hidden="true" focusable="false"><circle class="ml-orbit-ring" cx="170" cy="170" r="112"/><path data-ml-view-line class="ml-view-guide" d="M170 170 L${m.point.x} ${m.point.y}"/><circle class="ml-earth" cx="170" cy="170" r="22"/><path class="ml-orbit-arrow" d="M307.16 133.25 A142 142 0 0 0 292.98 99 M294 109 L292.98 99 L303 101"/><path data-ml-sunlight class="ml-sun-rays" d="M335 140 H315 L321 136 M315 140 L321 144 M335 170 H315 L321 166 M315 170 L321 174 M335 200 H315 L321 196 M315 200 L321 204"/></svg><span class="ml-earth-label">Earth</span>${nodes}</div><figcaption><p class="ml-selected">${esc(T.placeTemplate.replace('{label}',m.showingExample?T.example:T.selected).replace('{location}',m.location))}</p><p>${esc(T.sunlight)}</p><p>${esc(T.places)}</p><p>${esc(T.viewLine)}</p><p>${esc(T.orbitMotion)}</p></figcaption></figure>`;
}
function earthView(m){
 if(!m.phase)return `<section class="ml-earth-view" data-ml-earth-view aria-labelledby="ml-earth-title"><h2 id="ml-earth-title">${esc(T.earthView)}</h2><p class="ml-hidden">${esc(T.hidden)}</p></section>`;
 const p=m.phase;
 return `<section class="ml-earth-view" data-ml-earth-view aria-labelledby="ml-earth-title"><h2 id="ml-earth-title">${esc(T.earthView)}</h2><div class="ml-views">${m.orientations.map(o=>`<article class="ml-view"><h3>${esc(T[o])}</h3>${p.code==='new'?`<svg class="ml-phase" data-ml-new viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle class="sky-moon-dark" cx="24" cy="24" r="20"/><circle class="sky-moon-edge" cx="24" cy="24" r="20" fill="none" stroke-width="2"/></svg>`:moonArt(p.code,o,'ml-phase')}<h3>${esc(p.name)}</h3><p>${esc(p.amount)}</p><p>${esc(p.description)}</p></article>`).join('')}</div><p>${esc(T.orientation)}</p></section>`;
}
export function moonlightPage(book,owner){
 const s=identify(book,owner);if(!s?.active)return '';rendering++;
 const m=moonlightModel(s.work),teaching=m.showingExample;
 const controls=teaching?`<div class="ml-actions">${button('step',T.previousStep,` data-ml-step="${m.step-1}"${m.step===0?' disabled':''}`)}${button('step',T.nextStep,` data-ml-step="${m.step+1}"${m.step===3?' disabled':''}`)}${button('explore',T.explore)}</div>`:`<div class="ml-invitation"><p id="ml-task">${esc(m.invitation)}</p>${button('invitation',T.another)}</div><div class="ml-actions">${button('previous',T.previous)}${button('next',T.next)}${button('reveal',m.phase?T.hide:T.show)}${m.phase?button('flip',T.flip):''}${button('teaching',T.teaching)}</div>`;
 return `<div class="ml-page" data-moonlight-root><header class="ml-header"><div class="ml-actions">${button('back',T.back)}<span data-ml-hear>${hearButton('',T.hear)}</span></div><h1 id="moonlight-title" tabindex="-1">${esc(T.title)}</h1>${teaching?'':`<p>${esc(T.opening)}</p>`}<p class="ml-visit">${esc(T.visit)}</p></header>${teaching?`<section class="ml-lesson"><p>${esc(T.example)} · ${esc(T.stepTemplate.replace('{number}',m.step+1))}</p><h2 id="ml-task" tabindex="-1">${esc(m.teaching.title)}</h2><p>${esc(m.teaching.text)}</p></section>`:''}${controls}<div class="ml-pair">${board(m)}${earthView(m)}</div><aside class="ml-model-notice"><p>${esc(T.model)}</p><p>${esc(T.tilt)}</p></aside><footer class="ml-return"><p>${esc(T.returnPrompt)}</p>${button('back',T.back)}</footer><details class="ml-grownup"><summary>${esc(T.grownupLabel)}</summary><p>${esc(T.grownup)}</p></details></div>`;
}
// Controls belong to the exact rendered visit. Removal retires a control even
// when it is inserted back before the next click (drain observer records first).
export function bindMoonlight(book,ctx){
 const root=document.querySelector('[data-moonlight-root]'),owner=ctx.explorerId(),s=identify(book,owner);if(!root||!s?.active)return;
 const generation=rendering,work=s.work,bytes=JSON.stringify(work),controls=[...root.querySelectorAll('button,a,summary')],retired=new WeakSet();
 const chain=node=>{const a=[];for(let n=node;n;n=n.parentNode)a.push(n);return a;},chains=new Map(controls.map(b=>[b,chain(b)]));
 const retire=records=>{for(const r of records)for(const removed of r.removedNodes)for(const b of controls)if(chains.get(b).includes(removed)||removed.contains?.(b))retired.add(b);};
 const observer=new MutationObserver(records=>{retire(records);if(!root.isConnected)observer.disconnect();});observer.observe(document,{subtree:true,childList:true});
 const attached=b=>{retire(observer.takeRecords());const old=chains.get(b),now=chain(b);return old&&old.length===now.length&&old.every((n,i)=>n===now[i])&&!retired.has(b);};
 const visible=b=>{for(let n=b;n?.nodeType===1;n=n.parentElement){if(n.hidden||n.inert||n.getAttribute('aria-hidden')==='true')return false;const c=getComputedStyle(n);if(c.display==='none'||c.visibility==='hidden'||c.visibility==='collapse')return false;}return b.getClientRects().length>0;};
 const live=b=>visit===s&&s.active&&generation===rendering&&s.work===work&&JSON.stringify(s.work)===bytes&&ctx.notebook()===book&&ctx.explorerId()===owner&&ctx.isActive?.()!==false&&location.hash==='#almanac/sky'&&root===document.querySelector('[data-moonlight-root]')&&root.isConnected&&root.contains(b)&&attached(b)&&visible(b)&&!b.disabled&&!b.closest('[disabled]');
 const signatures=new Map(controls.map(b=>[b,[b.dataset.mlAction,b.dataset.mlPlace,b.dataset.mlStep,b.getAttribute('href')].join('|')]));
 const stop=()=>ctx.stopSpeech?.();
 for(const b of controls)b.addEventListener('click',e=>{
  if(!live(b)||signatures.get(b)!==[b.dataset.mlAction,b.dataset.mlPlace,b.dataset.mlStep,b.getAttribute('href')].join('|')){e.preventDefault();e.stopImmediatePropagation();return;}
  if(b.matches('[data-speak]')){stop();b.dataset.speak=moonlightNarration(work);return;}
  if(b.matches('summary'))return;
  e.preventDefault();const action=b.dataset.mlAction;
  if(action==='back'){stop();closeMoonlight();observer.disconnect();if(ctx.onReturn)ctx.onReturn();else{ctx.render();ctx.focus?.('[data-moonlight-entry]');}return;}
  const isPlace=b.hasAttribute('data-ml-place'),value=isPlace?Number(b.dataset.mlPlace):action==='step'?Number(b.dataset.mlStep):undefined;
  const next=changeMoonlight(work,isPlace?'position':action,value);if(!next)return;
  stop();s.work=next;observer.disconnect();const focus=isPlace?`[data-ml-place="${value}"]`:action==='teaching'?'#ml-task':action==='explore'?'#moonlight-title':action==='step'?'#ml-task':`[data-ml-action="${action}"]`;ctx.render();ctx.focus?.(focus);
 },{capture:true});
}
