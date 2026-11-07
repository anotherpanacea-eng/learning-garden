import {hingeCases,hingeCopy as copy} from './hinge-content.mjs';
import {HINGE_DRAW as D,hingeCase,createHinge,hingeModel,changeHingeTurn,changeHingeArm,turnWholeHinge,resetHinge,hingeExample} from './hinge-core.mjs';
import {hearButton} from './play-media.mjs';
import {createSharedTurn} from './shared-turn-core.mjs';
import {sharedTurnCopy} from './shared-turn-content.mjs';
import {sharedTurnPage,bindSharedTurn} from './shared-turn-ui.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=x=>Number(x.toFixed(6)),pt=p=>p.map(num).join(' '),points=ps=>ps.map(p=>p.map(num).join(',')).join(' ');
const size=n=>['','Short','Medium','Long'][n];
let visit=null,generation=0;
export function resetHingeVisit(){visit=null;generation++;}
function current(notebook,owner){
 if(!visit||visit.notebook!==notebook||visit.owner!==owner)visit={notebook,owner,caseId:'same-turn',cases:new Map(),tool:'turn',example:false,frame:0,pending:'',sharedWork:null,sharedActive:false,sharedFolds:null,restoreFolds:null};
 if(!visit.cases.has(visit.caseId))visit.cases.set(visit.caseId,{material:createHinge(visit.caseId),card:false,compare:false});
 return visit;
}
const button=(action,label,{disabled=false,attrs=''}={})=>`<button type="button" data-hinge-action="${action}"${disabled?' disabled':''} ${attrs}>${esc(label)}</button>`;
const p=text=>`<p data-hinge-read>${esc(text)}</p>`;
function ray(g,side,ghost=false){
 const r=g[side],w=ghost?(side==='gold'?3:2):(side==='gold'?8:4);
 return `<g class="hinge-ray ${side}${ghost?' hinge-ghost-ray':''}" data-hinge-ray="${side}"><line data-hinge-solid x1="${D.cx}" y1="${D.cy}" x2="${num(r.solid[0])}" y2="${num(r.solid[1])}" stroke-width="${w}" stroke-linecap="butt"${side==='blue'&&!ghost?' stroke-dasharray="7 3"':''}/><line data-hinge-tail x1="${num(r.solid[0])}" y1="${num(r.solid[1])}" x2="${num(r.tip[0])}" y2="${num(r.tip[1])}" stroke-width="1.2" stroke-dasharray="2 2" stroke-linecap="butt"/><polygon data-hinge-arrow points="${points(r.head)}"/></g>`;
}
function sweep(g,marker,ghost=false){
 if(!g.sweep.segments.length)return '';
 const path=`M${pt(g.sweep.from)} `+g.sweep.segments.map(s=>`A${D.radius} ${D.radius} 0 ${s.large} ${s.sweep} ${pt(s.to)}`).join(' ');
 return `<path class="hinge-sweep${ghost?' hinge-ghost-sweep':''}" data-hinge-sweep="${g.sweep.kind}" d="${path}" fill="none" stroke-linecap="butt" marker-end="url(#${marker})"/>`;
}
function layer(g,id,{ghost=false,card=false}={}){return `${card?`<polygon class="hinge-card" data-hinge-card points="${points(g.card)}"/>`:''}<g ${ghost?'data-hinge-overlay':'data-hinge-main'}>${ray(g,'gold',ghost)}${ray(g,'blue',ghost)}${sweep(g,id,ghost)}${g.rightMark?`<polyline class="hinge-right-mark" data-hinge-right-mark points="${points(g.rightMark)}" fill="none"/>`:''}</g>`;}
function figure(g,id,label,{card=false,overlay=null}={}){
 const marker=`hinge-${id}-arrow`,ghost=`hinge-${id}-ghost-arrow`,pose=g.pose,mode=pose.opening===0?'Coincident rays · No turn':pose.opening===360?'Coincident rays · One full turn':'Follow the marked counterclockwise sweep';
 const title=`${label}. Selected counterclockwise turn ${pose.opening} degrees. Gold wide starting arm: ${size(pose.goldLength).toLowerCase()}; blue narrow dashed moving arm: ${size(pose.blueLength).toLowerCase()}. Starting direction ${pose.tilt} degrees counterclockwise from the right. ${mode}.${g.coincident?` ${copy.coincident}`:''}${card?' A separate quarter-turn card is shown.':''}${overlay?' A dashed reference is rigidly aligned to this starting ray.':''}`;
 return `<figure class="hinge-figure" data-hinge-figure="${id}"><h3 data-hinge-read>${esc(label)}</h3><svg viewBox="0 0 260 260" role="img" aria-labelledby="hinge-${id}-title" data-hinge-opening="${pose.opening}" data-hinge-tilt="${pose.tilt}" data-hinge-gold="${pose.goldLength}" data-hinge-blue="${pose.blueLength}"><title id="hinge-${id}-title">${esc(title)}</title><defs><marker id="${marker}" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#69466b"/></marker><marker id="${ghost}" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#344b52"/></marker></defs><circle cx="130" cy="130" r="111" class="hinge-board-ring"/>${layer(g,marker,{card})}${overlay?layer(overlay,ghost,{ghost:true}):''}<circle cx="130" cy="130" r="4" class="hinge-pin"/></svg><figcaption><p class="hinge-measure" data-hinge-read>Selected turn <strong>${pose.opening}°</strong></p><p class="hinge-sweep-label" data-hinge-read>${esc(mode)}</p>${g.coincident?p(copy.coincident):''}<p data-hinge-read>Gold: ${size(pose.goldLength)} · Blue: ${size(pose.blueLength)}</p><p class="hinge-orientation" data-hinge-read>Starting direction: ${pose.tilt}° from right</p></figcaption></figure>`;
}
function controls(v,e,m){
 let body='';
 if(v.tool==='turn')body=`<h3>Turn the blue arm</h3><div class="hinge-control-grid">${button('more','Turn more +5°',{disabled:!m.canMore})}${button('back','Turn back −5°',{disabled:!m.canBack})}${button('quarter-more','Turn more +90°',{disabled:!m.canQuarterMore})}${button('quarter-back','Turn back −90°',{disabled:!m.canQuarterBack})}</div><p>Quarter-turn steps move a whole 90°. A step that would go past this model’s limit is unavailable.</p>`;
 if(v.tool==='arms')body=`<h3>Change visible arm lengths</h3><div class="hinge-arm-controls"><p>Gold starting arm · ${size(e.material.goldLength)}</p><div class="hinge-control-grid">${button('gold-less','Gold shorter',{disabled:!m.canGoldShorter})}${button('gold-more','Gold longer',{disabled:!m.canGoldLonger})}</div><p>Blue moving arm · ${size(e.material.blueLength)}</p><div class="hinge-control-grid">${button('blue-less','Blue shorter',{disabled:!m.canBlueShorter})}${button('blue-more','Blue longer',{disabled:!m.canBlueLonger})}</div></div>`;
 if(v.tool==='picture')body=`<h3>Turn both arms together</h3><div class="hinge-control-grid">${button('turn','Turn whole picture')}${button('reset','Reset this hinge')}</div><p>The whole picture turns 15° counterclockwise. The selected turn from gold to blue stays the same.</p>`;
 return `<div class="hinge-tool-tabs" role="group" aria-label="Choose what to change">${[['turn','Turn'],['arms','Arm lengths'],['picture','Whole picture']].map(([id,title])=>button('tool',title,{attrs:`data-hinge-tool="${id}" aria-pressed="${v.tool===id}"`})).join('')}</div><section class="hinge-controls" aria-label="${v.tool==='turn'?'Turn controls':v.tool==='arms'?'Arm-length controls':'Whole-picture controls'}">${body}</section>`;
}
function comparison(m){const relation=m.relation==='same'?'Same selected turn':`My selected turn is ${m.relation}`;return `<section class="hinge-comparison" aria-labelledby="hinge-comparison"><h3 id="hinge-comparison" tabindex="-1" data-hinge-read>${relation}</h3>${p(`Reference: ${m.reference.pose.opening}°. ${m.reference.typeText}`)}${p(`My hinge: ${m.working.pose.opening}°. ${m.working.typeText}`)}${p(copy.overlay)}${m.sameEndingDirection&&m.relation!=='same'?p('After lining up the starting rays, the moving rays point the same way. Their selected sweeps are still different.'):''}${p(m.case.explanation)}</section>`;}
function liveBoard(v,e){const m=hingeModel(e.material);return `<h2 id="hinge-title" tabindex="-1" data-hinge-read>${esc(m.case.request)}</h2><div class="hinge-workbench"><div class="hinge-material"><div class="hinge-figures">${figure(m.reference,'reference','Reference')}${figure(m.working,'working','My hinge',{card:e.card,overlay:e.compare?m.overlay:null})}</div><p class="hinge-ray-key" data-hinge-read>Gold: wide solid starting arm. Blue: narrow dashed moving arm. Curved arrow: selected turn.</p>${p(copy.lengths)}</div><div class="hinge-toolbox">${controls(v,e,m)}<div class="hinge-actions">${button('card',e.card?'Hide quarter-turn card':'Show quarter-turn card',{attrs:`aria-pressed="${e.card}"`})}${button('compare','Compare turns')}${button('example','Show an example')}${hearButton('','Hear this hinge')}</div>${e.card?p(copy.card):''}</div></div><p class="hinge-units" data-hinge-read>${esc(copy.units)}</p>${e.compare?comparison(m):''}`;}
function exampleBoard(v){const f=hingeExample(v.frame);return `<h2 id="hinge-title" tabindex="-1" data-hinge-read>${esc(f.title)}</h2><p class="hinge-example-label" data-hinge-read>Worked example, not your hinge. Part ${v.frame+1} of 5.</p><div class="hinge-actions">${button('previous','Previous example part',{disabled:v.frame===0})}${button('next','Next example part',{disabled:v.frame===4})}${button('close','Return to my hinge')}${hearButton('','Hear this example')}</div>${p(f.text)}<div class="hinge-figures">${figure(f.reference,'example-reference','Example reference')}${figure(f.working,'example-working','Example working hinge')}</div>`;}
// A local binding retires original controls on removal or visibility changes.
function bindingGuard(root,valid){
 const controls=[root,...root.querySelectorAll('button,input,select,summary,a,details,#shared-turn-status')],retired=new WeakSet(),chains=new Map();
 const chain=n=>{const out=[];for(;n;n=n.parentNode)out.push(n);return out;};controls.forEach(n=>chains.set(n,chain(n)));
 const retire=records=>{for(const r of records){if(r.type==='attributes'){for(const n of controls)if(chains.get(n).includes(r.target))retired.add(n);continue;}for(const removed of r.removedNodes)for(const n of controls)if(chains.get(n).includes(removed)||removed.contains?.(n))retired.add(n);}};
 const observer=new MutationObserver(records=>{retire(records);if(!root.isConnected)observer.disconnect();});observer.observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','inert','aria-hidden','style','class']});
 return n=>{retire(observer.takeRecords());if(!valid()||!root.isConnected||!root.contains(n)||retired.has(n))return false;const old=chains.get(n),now=chain(n);if(!old||old.length!==now.length||!old.every((p,i)=>p===now[i]))return false;for(let p=n;p?.nodeType===1;p=p.parentElement){if(p.hidden||p.inert||p.getAttribute('aria-hidden')==='true')return false;const c=getComputedStyle(p);if(c.display==='none'||c.visibility==='hidden'||c.visibility==='collapse')return false;}return n.getClientRects().length>0;};
}
const sharedEntry=()=>`<aside class="shared-turn-entry"><h2>${esc(sharedTurnCopy.title)}</h2><p>${esc(sharedTurnCopy.entryIntro)}</p><button type="button" data-shared-turn-entry>Share a turn</button></aside>`;
export function hingePage(notebook,owner){const v=current(notebook,owner);generation++;if(v.sharedActive)return sharedTurnPage(v.sharedWork);const e=v.cases.get(v.caseId);return `<section class="panel hinge-bench" data-hinge-root data-hinge-view="${v.example?'example':'live'}"><header class="hinge-header"><div><h1>${esc(copy.title)}</h1><p data-hinge-read>The miller is planning a turning sign. Explore different turns with this made-up pointer model.</p></div><nav aria-label="Bench exits"><a href="#workshop">Workshop</a><a href="#notes">Grown-up notes</a></nav></header>${sharedEntry()}<label class="hinge-case-label">Choose a hinge <select data-hinge-case>${hingeCases.map(c=>`<option value="${c.id}"${c.id===v.caseId?' selected':''}>${esc(c.title)}</option>`).join('')}</select></label>${v.example?exampleBoard(v):liveBoard(v,e)}<p class="hinge-status" role="status" aria-live="polite" aria-atomic="true"></p><p class="hinge-visit">Settings last for this visit. They are not added to your notes.</p><a class="hinge-copy-link" href="#workshop/copy-frame">Explore rectangles with four right angles</a><details class="hinge-about"><summary>About this model</summary>${p(copy.opening)}${p(copy.direction)}${p(copy.notice)}</details><details class="hinge-about hinge-grownups"><summary>For grown-ups</summary>${p(copy.visit)}${p(copy.parent)}</details></section>`;}
export function bindHinge(notebook,ctx){
 if(visit?.sharedActive){
  const v=visit,token=generation,root=document.querySelector('[data-shared-turn-root]');if(!root)return;
  const live=bindingGuard(root,()=>visit===v&&v.sharedActive&&generation===token&&root===document.querySelector('[data-shared-turn-root]')&&location.hash==='#workshop/hinge'&&ctx.notebook()===notebook&&ctx.explorerId()===v.owner&&(!ctx.isActive||ctx.isActive()));
  bindSharedTurn(v.sharedWork,{live,change:next=>{v.sharedWork=next;},render:ctx.render,focus:ctx.focus,stopSpeech:ctx.stopSpeech,stopSound:ctx.stopSound,back:()=>{v.sharedActive=false;v.restoreFolds=v.sharedFolds;ctx.render();ctx.focus?.('[data-shared-turn-entry]');}});return;
 }

 const root=document.querySelector('[data-hinge-root]');if(!root||!visit)return;
 const v=visit,token=generation,owner=v.owner,id=v.caseId,e=v.cases.get(id),material=e.material,example=v.example,frame=v.frame,tool=v.tool;
 const live=()=>generation===token&&!v.sharedActive&&root.isConnected&&document.querySelector('[data-hinge-root]')===root&&location.hash==='#workshop/hinge'&&visit===v&&v.caseId===id&&v.cases.get(id)===e&&e.material===material&&v.example===example&&v.frame===frame&&v.tool===tool&&(!ctx.isActive||ctx.isActive())&&ctx.notebook()===notebook&&ctx.explorerId()===owner;
 if(v.restoreFolds){root.querySelectorAll('details.hinge-about').forEach((d,i)=>{d.open=!!v.restoreFolds[i];});v.restoreFolds=null;}
 const nodeLive=bindingGuard(root,live);
 // Direct capture also guards Hear after a control is moved out of this root.
 for(const n of root.querySelectorAll('button,input,select,a,summary')){
  const guard=event=>{if(!nodeLive(n)||n.disabled){event.preventDefault();event.stopImmediatePropagation();return;}
   if(event.type==='click'&&n.matches('[data-speak]'))n.dataset.speak=[...root.querySelectorAll('[data-hinge-read]')].filter(x=>x.getClientRects().length&&getComputedStyle(x).visibility!=='hidden'&&!x.closest('details:not([open])')).map(x=>x.textContent.trim()).join(' ');
  };n.addEventListener('click',guard,{capture:true});if(n.matches('input,select'))n.addEventListener('change',guard,{capture:true});
 }
 root.querySelector('[data-shared-turn-entry]')?.addEventListener('click',event=>{if(!nodeLive(event.currentTarget))return;ctx.stopSpeech?.();ctx.stopSound?.();v.sharedWork??=createSharedTurn();v.sharedFolds=[...root.querySelectorAll('details.hinge-about')].map(d=>d.open);v.pending='';v.sharedActive=true;ctx.render();ctx.focus?.('#shared-turn-title');});
 const stop=()=>{ctx.stopSpeech?.();ctx.stopSound?.();};
 if(v.pending)requestAnimationFrame(()=>requestAnimationFrame(()=>{if(nodeLive(root)){root.querySelector('.hinge-status').textContent=v.pending;v.pending='';}}));
 function redraw(selector='#hinge-title'){ctx.render();const target=document.querySelector(selector),node=target&&!target.disabled?target:document.querySelector('#hinge-title');if(node){node.focus({preventScroll:true});const b=node.getBoundingClientRect();if(b.top<0||b.bottom>innerHeight)node.scrollIntoView({block:'nearest'});}}
 function edit(next,action){if(!next)return;stop();e.material=next;e.compare=false;const m=hingeModel(next);if(action==='reset')e.card=false;
  v.pending=action==='turn'?`Both arms turned together. Selected turn stays ${next.opening}°.`:action==='reset'?'Hinge returned to this case’s starting settings.':action.startsWith('gold')||action.startsWith('blue')?`${action.startsWith('gold')?'Gold':'Blue'} visible arm is now ${size(action.startsWith('gold')?next.goldLength:next.blueLength).toLowerCase()}. Selected turn stays ${next.opening}°.`:`Selected turn is now ${next.opening}°. Visible arm lengths stay the same.`;
  let focus=action;const counterparts={more:['canMore','back'],back:['canBack','more'],'quarter-more':['canQuarterMore','quarter-back'],'quarter-back':['canQuarterBack','quarter-more'],'gold-less':['canGoldShorter','gold-more'],'gold-more':['canGoldLonger','gold-less'],'blue-less':['canBlueShorter','blue-more'],'blue-more':['canBlueLonger','blue-less']};if(counterparts[action]&&!m[counterparts[action][0]])focus=counterparts[action][1];redraw(`[data-hinge-action="${focus}"]`);
 }
 root.querySelector('[data-hinge-case]').addEventListener('change',event=>{if(!live()||!hingeCase(event.target.value))return;stop();v.caseId=event.target.value;v.example=false;v.frame=0;v.pending='';if(!v.cases.has(v.caseId))v.cases.set(v.caseId,{material:createHinge(v.caseId),card:false,compare:false});redraw('[data-hinge-case]');});
 root.querySelectorAll('[data-hinge-action]').forEach(b=>b.addEventListener('click',()=>{
  if(!live()||b.disabled)return;const a=b.dataset.hingeAction;
  if(!example&&['more','back','quarter-more','quarter-back'].includes(a)){edit(changeHingeTurn(material,{more:5,back:-5,'quarter-more':90,'quarter-back':-90}[a]),a);return;}
  if(!example&&/^(gold|blue)-(less|more)$/.test(a)){const [side,change]=a.split('-');edit(changeHingeArm(material,side,change==='more'?1:-1),a);return;}
  if(!example&&a==='turn'){edit(turnWholeHinge(material),a);return;}if(!example&&a==='reset'){edit(resetHinge(material),a);return;}
  if(!example&&a==='tool'&&['turn','arms','picture'].includes(b.dataset.hingeTool)){stop();v.tool=b.dataset.hingeTool;redraw(`[data-hinge-tool="${v.tool}"]`);return;}
  if(!example&&a==='card'){stop();e.card=!e.card;v.pending=e.card?'Quarter-turn card shown. It marks 90°, separately from your selected sweep.':'Quarter-turn card hidden.';redraw('[data-hinge-action="card"]');return;}
  if(!example&&a==='compare'){stop();e.compare=true;v.pending='Reference aligned without changing its lengths or turn.';redraw('#hinge-comparison');return;}
  if(!example&&a==='example'){stop();v.example=true;v.frame=0;v.pending='Worked example, not your hinge. Part 1 of 5.';redraw();return;}
  if(example&&a==='close'){stop();v.example=false;v.pending='Your hinge restored with the same settings.';redraw('[data-hinge-action="example"]');return;}
  if(example&&['previous','next'].includes(a)){const next=frame+(a==='next'?1:-1);if(!hingeExample(next))return;stop();v.frame=next;v.pending=`Worked example, not your hinge. Part ${next+1} of 5.`;redraw(next===0?'[data-hinge-action="next"]':next===4?'[data-hinge-action="previous"]':`[data-hinge-action="${a}"]`);}
 }));

}
