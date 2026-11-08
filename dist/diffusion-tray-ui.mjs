import {depthWindowPage,bindDepthWindow,resetDepthWindow} from './depth-window-ui.mjs';
import {gasDiffusionInvitation} from './gas-routes-ui.mjs';
import {waterPhasePage,bindWaterPhase,leaveWaterPhaseFilm} from './water-phase.mjs';
import {diffusionCases,diffusionSource} from './diffusion-tray-content.mjs';
import {newDiffusionWork,advanceDiffusionWork,revealDiffusionExample,validDiffusionWork,diffusionCounts,diffusionRunsView,lastDiffusionRun,keepDiffusionRun} from './diffusion-tray-core.mjs';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(attrs,label,primary=false)=>`<button type="button" class="${primary?'primary':'secondary'}" ${attrs}>${esc(label)}</button>`;
const seed=()=>crypto.getRandomValues(new Uint32Array(1))[0]||1;
let visit=null,bindingGeneration=0,retireDepthHost=()=>{};
export function resetDiffusionTray(){bindingGeneration++;retireDepthHost();visit=null;resetDepthWindow();}
function state(book,owner){
 if(!visit||visit.book!==book||visit.owner!==owner){resetDiffusionTray();visit={book,owner,mode:'legacy',depthReturn:'legacy',screen:'draft',active:null,slots:new Map(),first:new Map(),readonly:new Map(),next:1,card:null,shelfPage:null,draftPage:0,chooser:false,gasReturnOpen:false};}
 return visit;
}
function makeSlot(source,work){return {source:structuredClone(source),work:structuredClone(work||newDiffusionWork(source)),marker:source.particles[0].id,turn:0,status:'',limits:false,animate:false};}
function addDraft(v,source){const key=`draft-${v.next++}`;v.slots.set(key,makeSlot(source));v.active=key;v.screen='draft';return key;}
function choose(v,id){if(!v.first.has(id))v.first.set(id,addDraft(v,diffusionSource(id,seed())));v.active=v.first.get(id);v.screen='draft';}
const slot=v=>v.screen==='card'?v.readonly.get(v.card):v.slots.get(v.active);
const net=c=>c.net===0?'Net cumulative change: zero. Both crossing counts are shown separately.':`Net cumulative change: ${Math.abs(c.net)} ${Math.abs(c.net)===1?'marker':'markers'} ${c.net>0?'left to right':'right to left'}`;
const boundary=s=>s.kinds.map(k=>`<p>${esc(k.label)}: crossing ${k.canCross?'allowed':'not allowed'} in this model</p>`).join('');
const limits=(s,open=false)=>`<details data-dt-source${open?' open':''}><summary>Source and model limits</summary><p>${esc(s.notice)}</p><p>${esc(s.ruleNotice)}</p></details>`;
function point(i,step,side){const cell=(37*i+11*step)%64;return [(side==='left'?10:330)+52+28*(cell%8)+(i*3+step*2)%7-3,74+36*Math.floor(cell/8)+(i*5+step*3)%7-3];}
function drawing(s,animate){const source=s.source,w=s.work;return `<figure class="dt-picture"><svg data-dt-model viewBox="0 0 640 400" role="img" aria-labelledby="dt-svg-title dt-svg-desc"><title id="dt-svg-title">Two equal-volume model spaces at step ${w.steps}</title><desc id="dt-svg-desc">Symbols stand for dissolved particles, not molecules drawn to scale. The outlined marker is followed in the text below. Positions and paths are illustrative.</desc><rect class="dt-space" x="10" y="40" width="300" height="320" rx="12"/><rect class="dt-space" x="330" y="40" width="300" height="320" rx="12"/><path class="dt-boundary" d="M320 40V360"/><text x="160" y="25" text-anchor="middle">Left space</text><text x="480" y="25" text-anchor="middle">Right space</text><text x="320" y="389" text-anchor="middle">Model boundary</text>${source.particles.map((p,i)=>{const side=w.current.find(x=>x.id===p.id).side,prior=w.previous.find(x=>x.id===p.id).side,[x,y]=point(i,w.steps,side),[px,py]=point(i,Math.max(0,w.steps-1),prior),kind=source.kinds.find(k=>k.id===p.kindId),selected=p.id===s.marker;return `<g data-dt-particle="${esc(p.id)}" data-dt-side="${side}" data-dt-previous-side="${prior}" class="dt-particle dt-${kind.symbol}${animate?' dt-move':''}" transform="translate(${x} ${y})" style="--dt-dx:${px-x}px;--dt-dy:${py-y}px">${kind.symbol==='circle'?'<circle r="6"/>':'<path d="M0 -6 6 0 0 6 -6 0Z"/>'}${selected?`<circle class="dt-ring" r="12"/><text class="dt-marker-label" x="14" y="-12">${i+1}</text>`:''}</g>`;}).join('')}</svg><figcaption>Snapshot at step ${w.steps}. Real particle motion continues between our snapshots.</figcaption></figure>`;}
function currentCounts(s){return `<div data-dt-counts class="dt-counts">${diffusionCounts(s.source,s.work).map(c=>`<p><strong>${esc(c.label)}</strong><br>Left ${c.left} · Right ${c.right}</p>`).join('')}</div>`;}
function crossingTable(s){return `<section data-dt-crossings><h3>Crossings in both directions</h3><p>Subtract opposite-direction crossing counts to find the net change.</p>${diffusionCounts(s.source,s.work).map(c=>`<section class="dt-crossing-kind"><h4>${esc(c.label)}</h4><dl><div><dt>Starting left / right</dt><dd>${c.initialLeft} / ${c.initialRight}</dd></div><div><dt>Current left / right</dt><dd>${c.left} / ${c.right}</dd></div><div><dt>Last step left → right</dt><dd>${c.lastLeftToRight}</dd></div><div><dt>Last step right → left</dt><dd>${c.lastRightToLeft}</dd></div><div><dt>Cumulative left → right</dt><dd>${c.leftToRight}</dd></div><div><dt>Cumulative right → left</dt><dd>${c.rightToLeft}</dd></div></dl><p>${esc(net(c))}</p></section>`).join('')}</section>`;}
function activePage(s,readonly=false){
 const animate=s.animate&&!readonly&&s.work.steps>0;s.animate=false;
 const p=s.source.particles.find(p=>p.id===s.marker)||s.source.particles[0],index=s.source.particles.indexOf(p),kind=s.source.kinds.find(k=>k.id===p.kindId),side=s.work.current.find(x=>x.id===p.id).side;
 return `<h2 id="dt-title" tabindex="-1">Starting setup: ${esc(s.source.title)}</h2><p>${esc(s.source.context)}</p>${readonly?'<p class="dt-note">Kept snapshot · these counts and shown explanations stay unchanged. A new trial restarts the same setup.</p>':''}<nav class="dt-actions" aria-label="Model turns">${['Picture and step','Crossings'].map((t,i)=>button(`data-dt-turn="${i}" aria-current="${s.turn===i?'step':'false'}"`,t,s.turn===i)).join('')}</nav>${currentCounts(s)}${s.work.steps===0?'<p>Starting snapshot: no model step has been advanced.</p>':''}<div class="dt-actions">${readonly?'':button(`data-dt-step${s.work.steps>=1000000?' disabled':''}`,'Advance one step',true)}${button('data-dt-follow','Follow another marker')}${readonly?'':button('data-dt-keep','Keep this snapshot',true)}</div><p id="dt-status" role="status" tabindex="-1">${esc(s.status)}</p>${drawing(s,animate)}<p class="dt-follow">Following marker ${index+1} · ${esc(p.id)} · ${esc(kind.label)} · ${side} space.</p><label class="dt-select">Choose a marker <select data-dt-marker>${s.source.particles.map((x,i)=>`<option value="${esc(x.id)}"${x.id===p.id?' selected':''}>${i+1} · ${esc(x.id)} · ${esc(s.source.kinds.find(k=>k.id===x.kindId).label)}</option>`).join('')}</select></label>${s.turn===1?crossingTable(s):''}<div class="dt-key">${boundary(s.source)}</div><section class="dt-teaching"><h3>Explore the explanation</h3>${s.source.teaching.slice(0,s.work.exampleSeen).map(t=>`<p>${esc(t)}</p>`).join('')}${readonly?'':button(`data-dt-example${s.work.exampleSeen>=s.source.teaching.length?' disabled':''}`,s.work.exampleSeen===0?'Show part of the explanation':s.work.exampleSeen>=s.source.teaching.length?'Explanation shown':'Next part')}</section>${limits(s.source,s.limits)}${button('data-dt-new-trial','New trial from this setup')}<p>Another trial can take a different path from the same starting setup. Earlier drafts stay here during this visit, and short outcomes can repeat.</p>`;
}
function shelf(v){
 const view=diffusionRunsView(v.book),total=view.items.length;
 if(v.shelfPage===null)v.shelfPage=Math.floor((view.items.findLast(x=>x.readable)?.index??Math.max(0,total-1))/8);
 v.shelfPage=Math.max(0,Math.min(v.shelfPage,Math.max(0,Math.ceil(total/8)-1)));const start=v.shelfPage*8;
 return `<h2 id="dt-title" tabindex="-1">Kept runs</h2><p>Frozen snapshots, not scores.</p>${!view.canKeep?`<p>${view.status==='unavailable'?'This saved format stays unchanged in Notes.':'No new run number is available.'} Local exploration remains open. This saved collection cannot accept another run here.</p>`:''}${total?`<p>Runs ${start+1}–${Math.min(start+8,total)} of ${total}</p><ol start="${start+1}" class="dt-shelf">${view.items.slice(start,start+8).map(x=>`<li>${x.readable?button(`data-dt-card="${esc(x.id)}"`,`Run ${x.index+1} · ${x.raw.source.title}`):'<p>Unavailable here. Its original stays unchanged in Notes.</p>'}</li>`).join('')}</ol><div class="dt-actions">${button(`data-dt-page="-1"${!start?' disabled':''}`,'Previous runs')}${button(`data-dt-page="1"${start+8>=total?' disabled':''}`,'Next runs')}</div>`:view.canKeep?'<p>Keep a snapshot to leave a run here; the starting snapshot is welcome too.</p>':''}`;
}
function drafts(v){const entries=[...v.slots],total=entries.length;v.draftPage=Math.max(0,Math.min(v.draftPage,Math.max(0,Math.ceil(total/8)-1)));const start=v.draftPage*8;return `<h2 id="dt-title" tabindex="-1">Draft runs</h2><p>These local trials wait only during this visit.</p><p>Drafts ${total?start+1:0}–${Math.min(start+8,total)} of ${total}</p><ol start="${start+1}" class="dt-shelf">${entries.slice(start,start+8).map(([key,s],i)=>`<li>${button(`data-dt-draft="${key}"`,`Draft ${start+i+1} · ${s.source.title} · step ${s.work.steps}`)}</li>`).join('')}</ol><div class="dt-actions">${button(`data-dt-draft-page="-1"${!start?' disabled':''}`,'Previous drafts')}${button(`data-dt-draft-page="1"${start+8>=total?' disabled':''}`,'Next drafts')}</div>`;}
export function diffusionTrayPage(book,owner){
 const v=state(book,owner);
 if(v.mode==='depth')return `<section data-dt-depth-host class="dw-host"><header>${button('data-dt-depth-back',v.depthReturn==='tray'?'Back to Diffusion Tray':'Back to ice and warmth')}</header>${depthWindowPage(book,owner)}</section>`;
 if(v.mode==='legacy')return `<div data-dt-host>${button('data-dt-enter','Diffusion Tray')}${button('data-dt-depth-enter','Depth Window · water pressure')}${waterPhasePage(book,owner)}${gasDiffusionInvitation(book,{open:v.gasReturnOpen})}</div>`;
 let body;
 if(v.screen==='shelf')body=shelf(v);
 else if(v.screen==='drafts')body=drafts(v);
 else if(v.screen==='card'){
  const item=diffusionRunsView(book).items.find(x=>x.id===v.card&&x.readable);
  if(item){if(!v.readonly.has(item.id)||v.readonly.get(item.id).raw!==item.raw||v.readonly.get(item.id).rawSource!==item.raw.source||v.readonly.get(item.id).rawWork!==item.raw.work){const s=makeSlot(item.raw.source,item.raw.work);s.raw=item.raw;s.rawSource=item.raw.source;s.rawWork=item.raw.work;v.readonly.set(item.id,s);}body=`<p class="dt-run-label">Run ${item.index+1}</p>`+activePage(slot(v),true);}
  else body='<h2 id="dt-title" tabindex="-1">This run is unavailable here</h2><p>Its original stays unchanged in Notes. Other kept runs and local drafts remain open.</p>';
 }else{if(!slot(v))choose(v,'left');body=activePage(slot(v));}
 return `<div data-dt-root class="dt-page"><header><div class="dt-actions">${button('data-dt-legacy','Back to ice and warmth')}${button('data-dt-depth-enter','Depth Window · water pressure')}${button('data-dt-drafts','Draft runs')}${button('data-dt-shelf','Kept runs')}${button('data-dt-hear data-speak=""','Hear this page')}</div><h1>Diffusion Tray</h1><p>The town collection needs a clear picture of particles spreading.</p></header>${body}${gasDiffusionInvitation(book,{open:v.gasReturnOpen})}<details data-dt-chooser${v.chooser?' open':''}><summary>Choose another starting setup</summary><p>Each setup’s first draft waits here during this visit.</p><div class="dt-actions">${diffusionCases.map(c=>button(`data-dt-case="${esc(c.id)}"`,c.title)).join('')}</div></details><p class="dt-leaving">Unkept draft runs wait during this visit. Leaving or reloading loses drafts that have not been kept.</p></div>`;
}
function visibleSpeech(root){
 function read(n){if(n.nodeType===3)return n.textContent+' ';if(n.nodeType!==1||n.matches('svg,select,[hidden],[aria-hidden="true"],.speech-controls,nav,.dt-leaving'))return '';if(n.matches('button'))return n.matches('[data-dt-card],[data-dt-draft],[data-dt-case]')?n.textContent+' ':'';if(n.tagName==='DETAILS'&&!n.open)return '';return [...n.childNodes].map(read).join(' ');}
 return read(root).replace(/\s+/g,' ').trim();
}
// New host navigation cannot revive after its node or an ancestor is retired.
function depthHostGuard(root,valid,stop,nodes){
 const controls=[root,...nodes.filter(Boolean)],chains=new Map(),retired=new WeakSet();let disconnected=false;
 const chain=n=>{const out=[];for(;n;n=n.parentNode)out.push(n);return out;};for(const n of controls)chains.set(n,chain(n));
 const audit=records=>{for(const r of records){if(r.target.closest?.('.speech-controls,drawn-howto'))continue;if(r.type==='attributes'){for(const n of controls)if(chains.get(n).includes(r.target))retired.add(n);}else for(const removed of r.removedNodes)for(const n of controls)if(chains.get(n).includes(removed)||removed.contains?.(n))retired.add(n);}};
 const disconnect=()=>{disconnected=true;observer.disconnect();};retireDepthHost=disconnect;
 const observer=new MutationObserver(records=>{audit(records);if(!root.isConnected||!valid()||retired.has(root)){stop();disconnect();}});observer.observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','inert','aria-hidden','style','class']});
 return n=>{audit(observer.takeRecords());if(disconnected||!valid()||!root.isConnected||!root.contains(n)||n.disabled||retired.has(n))return false;const old=chains.get(n),now=chain(n);if(!old||old.length!==now.length||!old.every((x,i)=>x===now[i]))return false;for(let p=n;p?.nodeType===1;p=p.parentElement){const css=getComputedStyle(p);if(p.hidden||p.inert||p.getAttribute('aria-hidden')==='true'||css.display==='none'||['hidden','collapse'].includes(css.visibility))return false;if(p.tagName==='DETAILS'&&!p.open&&p!==n&&!p.querySelector(':scope>summary')?.contains(n))return false;}return n.getClientRects().length>0;};
}
export function bindDiffusionTray(book,ctx){
 retireDepthHost();const generation=++bindingGeneration;
 const owner=()=>typeof ctx.explorerId==='function'?ctx.explorerId():ctx.explorerId,v=state(book,owner()),{mode,screen,active,card}=v,held=slot(v),source=held?.source,raw=screen==='card'?diffusionRunsView(book).items.find(x=>x.id===card&&x.readable)?.raw:null;
 const rawSource=raw?.source,rawWork=raw?.work;
 const rootSelector=mode==='depth'?'[data-dt-depth-host]':mode==='legacy'?'[data-dt-host]':'[data-dt-root]',root=document.querySelector(rootSelector);if(!root)return;
 const content='[data-dt-step],[data-dt-follow],[data-dt-marker],[data-dt-turn],[data-dt-example],[data-dt-new-trial],[data-dt-keep],[data-dt-source]';
 const live=n=>generation===bindingGeneration&&document.querySelector(rootSelector)===root&&visit===v&&owner()===v.owner&&(typeof ctx.notebook==='function'?ctx.notebook():ctx.notebook)===book&&ctx.isActive()&&window.location.hash==='#science/ice'&&root.isConnected&&n.isConnected&&root.contains(n)&&v.mode===mode&&v.screen===screen&&v.active===active&&v.card===card&&(!(n.matches(content)||(n.matches('[data-dt-hear]')&&held&&(screen!=='card'||raw)))||slot(v)===held&&held?.source===source&&(screen!=='card'||diffusionRunsView(book).items.some(x=>x.id===card&&x.readable&&x.raw===raw&&x.raw.source===rawSource&&x.raw.work===rawWork)));
 const stop=()=>{ctx.stopSpeech?.();ctx.stopSound?.();},redraw=(target='#dt-title')=>{ctx.render();ctx.focus(target);};
 if(mode==='depth'){
  const back=root.querySelector('[data-dt-depth-back]'),accepts=depthHostGuard(root,()=>live(root),stop,[back]);
  back?.addEventListener('click',()=>{if(!accepts(back))return;stop();v.mode=v.depthReturn;redraw('[data-dt-depth-enter]');});
  bindDepthWindow(book,{notebook:ctx.notebook,explorerId:owner,isActive:()=>live(root),render:ctx.render,focus:ctx.focus,stopSpeech:ctx.stopSpeech,stopSound:ctx.stopSound});return;
 }
 const depthEntry=root.querySelector('[data-dt-depth-enter]');
 if(depthEntry){const accepts=depthHostGuard(root,()=>live(root),stop,[depthEntry]);depthEntry.addEventListener('click',()=>{if(!accepts(depthEntry))return;stop();if(mode==='legacy')leaveWaterPhaseFilm(book,v.owner);v.depthReturn=mode;v.mode='depth';redraw('#dw-heading');});}
 // Install before the legacy binder, also directly on controls that may later detach.
 const guard=n=>{const parent=n.parentNode;['click','change','input','toggle'].forEach(type=>n.addEventListener(type,e=>{if(!live(n)||n.parentNode!==parent){e.preventDefault();e.stopImmediatePropagation();}},{capture:true}));};
 guard(root);root.querySelectorAll('button,select,input,textarea,details,[data-speak],a').forEach(guard);
 const on=(sel,fn)=>root.querySelectorAll(sel).forEach(n=>n.addEventListener('click',()=>{if(!live(n)||n.disabled)return;stop();fn(n);}));
 const gasReturn=root.querySelector('[data-gas-diffusion-return]');gasReturn?.addEventListener('toggle',()=>{if(live(gasReturn)){stop();v.gasReturnOpen=gasReturn.open;}});
 if(mode==='legacy'){
  on('[data-dt-enter]',()=>{leaveWaterPhaseFilm(book,v.owner);v.mode='tray';if(!v.active)choose(v,'left');redraw();});
  bindWaterPhase(book,{...ctx,isActive:()=>live(root)&&v.mode==='legacy'});return;
 }
 on('[data-dt-legacy]',()=>{v.mode='legacy';redraw('[data-dt-enter]');});
 on('[data-dt-shelf]',()=>{v.screen='shelf';redraw();});
 on('[data-dt-drafts]',()=>{v.screen='drafts';redraw();});
 on('[data-dt-case]',n=>{choose(v,n.dataset.dtCase);redraw();});
 on('[data-dt-draft]',n=>{if(!v.slots.has(n.dataset.dtDraft))return;v.active=n.dataset.dtDraft;v.screen='draft';redraw();});
 on('[data-dt-card]',n=>{v.card=n.dataset.dtCard;v.screen='card';redraw();});
 on('[data-dt-page]',n=>{v.shelfPage+=Number(n.dataset.dtPage);redraw();});
 on('[data-dt-draft-page]',n=>{v.draftPage+=Number(n.dataset.dtDraftPage);redraw();});
 on('[data-dt-turn]',n=>{held.turn=Number(n.dataset.dtTurn);redraw();});
 on('[data-dt-follow]',()=>{const ps=held.source.particles,i=ps.findIndex(p=>p.id===held.marker);held.marker=ps[(i+1)%ps.length].id;redraw('[data-dt-follow]');});
 const marker=root.querySelector('[data-dt-marker]');marker?.addEventListener('change',()=>{if(!live(marker))return;if(held.source.particles.some(p=>p.id===marker.value)){stop();held.marker=marker.value;redraw('[data-dt-marker]');}});
 on('[data-dt-step]',()=>{if(screen!=='draft')return;const next=advanceDiffusionWork(held.source,held.work);if(next){held.work=next;held.animate=true;held.status=next.steps>=1000000?(diffusionRunsView(book).canKeep?'This trial has reached the supported step limit. Keep this snapshot or start a new trial from the same setup.':'This trial has reached the supported step limit. Local exploration stays open; start a new trial from the same setup. This saved collection cannot accept another run here.'):'';}redraw(held.work.steps>=1000000?'[data-dt-new-trial]':'[data-dt-step]');});
 on('[data-dt-example]',()=>{if(screen!=='draft')return;const next=revealDiffusionExample(held.source,held.work);if(next)held.work=next;redraw(held.work.exampleSeen>=held.source.teaching.length?'[data-dt-keep]':'[data-dt-example]');});
 on('[data-dt-new-trial]',()=>{const next=structuredClone(held.source);next.seed=seed();addDraft(v,next);redraw();});
 on('[data-dt-keep]',()=>{
  if(screen!=='draft'||!validDiffusionWork(held.source,held.work))return;
  const id=keepDiffusionRun(book,held.source,held.work,{canExport:ctx.canExport});
  if(!id){const view=diffusionRunsView(book);held.status=view.status==='unavailable'?'This saved format cannot accept another run. Its original stays unchanged in Notes. Your draft is still here.':!view.canKeep?'No new run number is available. Kept records stay unchanged in Notes. Your draft is still here.':'This snapshot has not been kept. Earlier runs stay unchanged in Notes. Your draft is still here for this visit.';}
  else{const saved=ctx.save();held.status=saved?.enabled===false?'This run is kept in this open page, but saving is off. Download Grown-up notes before closing to bring it back.':saved?.ok===false?'This run is kept in this open page, but device storage did not save. Download Grown-up notes before closing to bring it back.':'This snapshot is kept. Find it in Kept runs.';const kept=makeSlot(held.source,held.work);kept.status=held.status;kept.turn=held.turn;kept.marker=held.marker;kept.limits=held.limits;kept.raw=diffusionRunsView(book).items.find(x=>x.id===id)?.raw;kept.rawSource=kept.raw?.source;kept.rawWork=kept.raw?.work;v.readonly.set(id,kept);v.card=id;v.screen='card';v.shelfPage=null;}
  redraw('#dt-status');
 });
 for(const [selector,set] of [['[data-dt-source]',open=>{held.limits=open;}],['[data-dt-chooser]',open=>{v.chooser=open;}]]){const n=root.querySelector(selector);n?.addEventListener('toggle',()=>{if(live(n)){stop();set(n.open);}});}
 const hear=root.querySelector('[data-dt-hear]');hear?.addEventListener('click',()=>{if(live(hear)&&(!held||!raw||screen!=='card'||diffusionRunsView(book).items.some(x=>x.id===card&&x.readable&&x.raw===raw&&x.raw.source===rawSource&&x.raw.work===rawWork)))hear.dataset.speak=visibleSpeech(root);},{capture:true});
}

export function diffusionCellInvitation(book,{open=false}={}){
 const last=lastDiffusionRun(book),view=diffusionRunsView(book),link='<a data-dt-return href="#science/ice">Ice and warmth → Diffusion Tray → Kept runs</a>';
 if(!last){const text=view.status==='unavailable'?'Local particle trials are open. The saved collection’s original format stays in Notes and cannot accept new runs here.':!view.canKeep?'Local particle trials are open. No new run number is available. Kept records stay unchanged in Notes.':'Make a particle snapshot in Ice and warmth → Diffusion Tray. A starting snapshot is welcome too.';return `<details data-dt-cell-return${open?' open':''}><summary>Compare a membrane’s role with a particle model</summary><p>${text}</p><p>${link}</p></details>`;}
 const {raw,index}=last,s=raw.source,w=raw.work;
 return `<details data-dt-cell-return${open?' open':''}><summary>Run ${index+1} · ${esc(s.title)}: compare a membrane’s role</summary><p>${esc(s.context)}</p><p>${esc(s.notice)}</p><p>${w.steps===0?'Starting snapshot: no model step has been advanced.':`Kept snapshot at step ${w.steps}. Real particle motion continues between our snapshots.`}</p>${boundary(s)}${diffusionCounts(s,w).map(c=>`<p><strong>${esc(c.label)}</strong>: left ${c.left}, right ${c.right}. Cumulative crossings: ${c.leftToRight} left → right; ${c.rightToLeft} right → left. ${esc(net(c))}</p>`).join('')}<p>In Cell Studio, explore the membrane role beside a selected cell. Compare it with this kept model.</p><blockquote>${esc(s.membraneRole)}</blockquote><p>How is our invented boundary like that role, and how is it different? Can this invented boundary tell us which real substances cross a living cell membrane?</p><details><summary>Frozen source rule</summary><p>${esc(s.ruleNotice)}</p></details><p>${link}</p></details>`;
}
