// Spec 332: the Mending Shed page at #workshop/mending.
import {mendingCopy as T,teachCards,ladderExamples,pileCards,chips,predictChips,actions,samples} from './mending-shed-content.mjs';
import * as C from './mending-shed-core.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=(x,cls='')=>`<p${cls?` class="${cls}"`:''}>${esc(x)}</p>`;
const button=(action,label,attrs='',disabled=false,cls='secondary')=>`<button type="button" class="${cls}" data-ms-action="${action}" ${attrs}${disabled?' disabled':''}>${label}</button>`;
const joinAnd=list=>list.length<2?list.join(''):list.slice(0,-1).join(', ')+' and '+list.at(-1);
const ROUTE='#workshop/mending';
let views=new WeakMap();
export function resetMendingShedView(){views=new WeakMap();}
function fresh(owner,root){return {owner,root,bench:null,teach:{pile:false,shapes:false},steps:{pile:0,shapes:0},card:'metal-bucket',work:{},picked:null,line:{},sample:'clay',action:'squash',predict:null,tried:false,shown:null,rung:{},notice:'',announce:'',panels:[]};}
function local(state,owner){let l=views.get(state);if(!l||l.owner!==owner){l=fresh(owner,state.mendingShed);views.set(state,l);}if(l.root!==state.mendingShed){l.root=state.mendingShed;}return l;}
const notesLink=`<a href="#notes">${esc(T.notesLink)}</a>`;
const notice=message=>`<aside class="ms-notice">${p(message)}${notesLink}</aside>`;
// Drawn pictures: generic shapes, no photographs.
const pictures={
 bucket:'<path d="M22 22h56l-7 58H29z" fill="#c9b48d" stroke="#3d3a33" stroke-width="3"/><path d="M22 22q28-20 56 0" fill="none" stroke="#3d3a33" stroke-width="3"/><path d="M25 44h50M27 62h46" stroke="#3d3a33" stroke-width="2"/>',
 lantern:'<path d="M38 18h24l6 10H32z" fill="#7d8790" stroke="#2f3438" stroke-width="3"/><rect x="32" y="28" width="36" height="46" rx="4" fill="#f3e3a4" stroke="#2f3438" stroke-width="3"/><path d="M50 60v-16" stroke="#c4651f" stroke-width="5" stroke-linecap="round"/><path d="M28 74h44v8H28z" fill="#7d8790" stroke="#2f3438" stroke-width="3"/><path d="M42 18q8-14 16 0" fill="none" stroke="#2f3438" stroke-width="3"/>',
 sack:'<path d="M30 30q-12 50 6 52h28q18-2 6-52z" fill="#c8a86b" stroke="#4b3a22" stroke-width="3"/><path d="M34 30q16-10 32 0" fill="none" stroke="#4b3a22" stroke-width="3"/><circle cx="58" cy="62" r="5" fill="#fff" stroke="#4b3a22" stroke-width="2"/>',
 mailbag:'<rect x="20" y="34" width="60" height="44" rx="6" fill="#7b95b8" stroke="#2c3a4f" stroke-width="3"/><path d="M20 40h60v14H20z" fill="#8b5a36" stroke="#2c3a4f" stroke-width="2"/><path d="M28 34q22-30 44 0" fill="none" stroke="#8b5a36" stroke-width="4"/>',
 pane:'<rect x="22" y="18" width="56" height="64" fill="#d6ebf4" stroke="#355466" stroke-width="3"/><path d="M50 18v64M22 50h56" stroke="#355466" stroke-width="3"/><path d="M30 28l10-6M58 58l12-8" stroke="#fff" stroke-width="3"/>',
 rope:'<path d="M20 70q30-60 60 0" fill="none" stroke="#a88a55" stroke-width="10"/><path d="M26 58l6 4M34 46l6 4M44 38l6 2M56 38l4 4M64 46l4 6M72 58l4 6" stroke="#6b5530" stroke-width="2"/>',
 basket:'<path d="M18 40h64l-8 40H26z" fill="#c2a462" stroke="#5b4826" stroke-width="3"/><path d="M22 52h56M24 66h52M38 40l-4 40M50 40v40M62 40l4 40" stroke="#5b4826" stroke-width="2"/><path d="M30 40q20-34 40 0" fill="none" stroke="#5b4826" stroke-width="4"/>',
 slate:'<path d="M18 30l60-8 6 52-60 8z" fill="#66727d" stroke="#2c3238" stroke-width="3"/><circle cx="30" cy="36" r="3" fill="#2c3238"/><path d="M28 52l46-6" stroke="#8b96a0" stroke-width="2"/>',
 hinge:'<rect x="16" y="34" width="30" height="32" fill="#6c6f73" stroke="#2a2c2e" stroke-width="3"/><rect x="54" y="34" width="30" height="32" fill="#6c6f73" stroke="#2a2c2e" stroke-width="3"/><rect x="45" y="28" width="10" height="44" rx="4" fill="#4f5256" stroke="#2a2c2e" stroke-width="3"/><circle cx="28" cy="50" r="3" fill="#2a2c2e"/><circle cx="72" cy="50" r="3" fill="#2a2c2e"/>',
 spoon:'<ellipse cx="36" cy="40" rx="14" ry="18" fill="#c99b62" stroke="#5b4023" stroke-width="3"/><path d="M46 52l30 26" stroke="#5b4023" stroke-width="7" stroke-linecap="round"/><path d="M46 52l30 26" stroke="#c99b62" stroke-width="3" stroke-linecap="round"/>'
};
const tint={'metal-bucket':'#a9b2ba','wooden-bucket':'#c9b48d','plastic-bucket':'#6fb08c'};
function cardPicture(card,label){const art=(pictures[card?.picture]??pictures.sack).replace('#c9b48d',tint[card?.id]??'#c9b48d');return `<svg class="ms-picture" viewBox="0 0 100 100" role="img" aria-label="${esc(label)}">${art}</svg>`;}
const bar=(color,shape)=>{
 if(shape==='squash')return `<rect x="10" y="44" width="80" height="16" rx="6" fill="${color}" stroke="#2c2c2c" stroke-width="2"/>`;
 if(shape==='bend')return `<path d="M14 64q36-44 72 0" fill="none" stroke="${color}" stroke-width="14" stroke-linecap="round"/>`;
 if(shape==='twist')return `<rect x="22" y="30" width="56" height="40" rx="6" fill="${color}" stroke="#2c2c2c" stroke-width="2"/><path d="M28 34l44 32M28 50l30 18M44 32l28 20" stroke="#2c2c2c" stroke-width="2"/>`;
 if(shape==='stretch')return `<rect x="4" y="46" width="92" height="10" rx="5" fill="${color}" stroke="#2c2c2c" stroke-width="2"/>`;
 if(shape==='snaps')return `<g><rect x="12" y="36" width="34" height="26" rx="3" fill="${color}" stroke="#2c2c2c" stroke-width="2" transform="rotate(-8 29 49)"/><rect x="56" y="38" width="34" height="26" rx="3" fill="${color}" stroke="#2c2c2c" stroke-width="2" transform="rotate(10 73 51)"/></g>`;
 return `<rect x="22" y="36" width="56" height="28" rx="6" fill="${color}" stroke="#2c2c2c" stroke-width="2"/>`;
};
function samplePicture(sample,stage,label){
 const color=sample?.color??'#999',shape=stage;
 return `<svg class="ms-sample" viewBox="0 0 100 100" role="img" aria-label="${esc(label)}">${bar(color,shape)}</svg>`;
}
function teachCard(bench,l){
 const card=teachCards[bench],n=Math.min(l.steps[bench],card.steps.length);
 return `<section class="ms-teach" id="ms-teach-${bench}" tabindex="-1"><h3>${esc(T.scienceLabel)}</h3>${p(card.text)}${p(card.example,'ms-example')}<ol>${card.steps.slice(0,n).map(s=>`<li>${esc(s)}</li>`).join('')}</ol><div class="ms-actions">${button('show-me',esc(T.showMe),`data-ms-bench="${bench}"`,n>=card.steps.length)}${button('start',esc(T.start),`data-ms-bench="${bench}"`,false,'primary')}</div></section>`;
}
function ladder(bench,key,l,disabled){
 const rung=l.rung[key]??0,ex=ladderExamples[bench];
 return `<section class="ms-ladder" aria-label="${esc(T.stuck)}"><div class="ms-actions">${button('rung',esc(T.stuck),'data-ms-rung="1"',disabled||rung>=1)}${rung>=1?button('rung',esc(T.example),'data-ms-rung="2"',disabled||rung>=2):''}${rung>=1?button('skip',esc(T.skip),'',disabled):''}</div>${rung>=1?`<div class="ms-rung" id="ms-rung-1" tabindex="-1">${p(teachCards[bench].text)}</div>`:''}${rung>=2?`<div class="ms-rung" id="ms-rung-2" tabindex="-1"><strong>${esc(ex.title)}</strong>${p(ex.body)}${p(ex.start)}</div>`:''}</section>`;
}
const workOf=(l,key)=>l.work[key]??(l.work[key]={object:null,materials:[]});
function chipButton(c,attrs,picked){return button('chip',`${esc(c.label)}${picked?` <span class="ms-picked">${esc(T.pickedUp)}</span>`:''}`,`data-ms-chip="${esc(c.id)}" aria-pressed="${picked}" ${attrs}`);}
function rowsOf(c,check){return {object:check?.object??null,materials:check?.materials??[]};}
function keptRows(c){const k=c.record?.latest;if(!k)return '';const r=rowsOf(c,k);return `<dl class="ms-kept"><div><dt>${esc(T.rowObject)}</dt><dd>${esc(r.object?.label??'')}</dd></div><div><dt>${esc(T.rowMaterials)}</dt><dd>${esc(joinAnd(r.materials.map(m=>m.label)))}</dd></div></dl>${p(k.line.text)}`;}
function pileBench(v,l,readOnly){
 const c=v.cards.find(x=>x.id===l.card)??v.cards[0];
 const list=`<div class="ms-cards" role="group" aria-label="${esc(T.pileEntry)}">${v.cards.filter(x=>x.content||x.record||x.status==='unreadable').map(x=>button('card',`${cardPicture(x.content,'')}<span>${esc(x.label)}</span>`,`data-ms-card="${esc(x.id)}" aria-pressed="${x.id===c.id}"`,false,'ms-card')).join('')}</div>`;
 let body;
 if(c.status==='unreadable')body=p(T.unreadable,'ms-unavailable');
 else if(readOnly||!c.editable)body=`${cardPicture(c.content,c.label)}${keptRows(c)}`;
 else{
  const w=workOf(l,c.id),byId=Object.fromEntries(c.tray.map(x=>[x.id,x])),placed=new Set([w.object,...w.materials].filter(Boolean));
  const placedChip=(id,row)=>button('lift',esc(byId[id].label),`data-ms-chip="${esc(id)}" aria-label="${esc(T.placed.replace('{chip}',byId[id].label).replace('{row}',row))}"`);
  const row=(key,title,ids)=>`<div class="ms-row"><h4 id="ms-row-${key}">${esc(title)}</h4><div class="ms-row-chips">${ids.map(id=>placedChip(id,title)).join('')}</div>${button('place',esc(title),`data-ms-row="${key}" aria-describedby="ms-row-${key}"`,!l.picked,'ms-row-target')}</div>`;
  body=`<div class="ms-work">${cardPicture(c.content,c.label)}<div class="ms-rows">${c.guided?`<ol class="ms-guided">${T.guidedSteps.map(s=>`<li>${esc(s.replace(/^\d+\.\s*/,''))}</li>`).join('')}</ol>`:''}${row('object',T.rowObject,w.object?[w.object]:[])}${row('materials',T.rowMaterials,w.materials)}${c.content.needs.length>1?p(T.multiNote,'ms-note'):''}</div></div><div class="ms-tray" role="group" aria-label="${esc(c.label)}">${c.tray.filter(x=>!placed.has(x.id)).map(x=>chipButton(x,'',l.picked===x.id)).join('')}</div><div class="ms-actions">${button('check',esc(T.check),'',false,'primary')}</div><p class="ms-line" id="ms-line" tabindex="-1">${esc(l.line[c.id]??'')}</p>${ladder('pile',c.id,l,false)}`;
 }
 const sorted=v.cards.filter(x=>x.record?.sortedCheck);
 const board=`<section class="ms-board"><h3>${esc(T.board)}</h3>${sorted.length?`<ul>${sorted.map(x=>`<li><strong>${esc(x.label)}</strong>: ${esc(x.record.sortedCheck.object?.label??'')} · ${esc(joinAnd(x.record.sortedCheck.materials.map(m=>m.label)))}</li>`).join('')}</ul>`:''}</section>`;
 return `<section class="ms-bench" data-ms-bench-view="pile"><h2 id="ms-task" tabindex="-1">${esc(T.pileEntry)}</h2>${p(T.pilePrompt)}${list}<div class="ms-current"><h3>${esc(c.label)}</h3>${body}</div>${board}</section>`;
}
function shapesBench(v,l,readOnly){
 const s=samples.find(x=>x.id===l.sample),a=actions.find(x=>x.id===l.action),pick=(kind,list,cur)=>`<div class="ms-choices" role="group" aria-label="${esc(kind)}">${list.map(x=>button(kind,esc(x.label),`data-ms-id="${esc(x.id)}" aria-pressed="${x.id===cur}"`,readOnly)).join('')}</div>`;
 const row=v.samples.find(x=>x.id===l.sample),cell=row?.cells[l.action],editable=!readOnly&&!!cell?.editable;
 const stage=l.shown?l.shown.shown.id==='snaps'?'snaps':l.shown.shown.id==='keeps'?l.action:'rest':l.tried?l.action:'rest';
 const shownText=l.shown?`<div class="ms-result" id="ms-result" tabindex="-1">${p(l.shown.result)}${p(l.shown.prediction)}</div>`:'';
 const grid=`<div class="ms-grid-wrap" tabindex="0" role="region" aria-label="${esc(T.shapesEntry)}"><table class="ms-grid"><thead><tr><th scope="col"></th>${v.actions.map(x=>`<th scope="col">${esc(x.label)}</th>`).join('')}</tr></thead><tbody>${v.samples.filter(x=>x.content||Object.values(x.cells).some(c=>c.record||c.status==='unreadable')).map(x=>`<tr><th scope="row">${esc(x.label)}</th>${v.actions.map(a=>{const c=x.cells[a.id];return `<td>${c.status==='unreadable'?esc(T.unreadable):esc(c.record?.latest?.shown?.label??'')}</td>`;}).join('')}</tr>`).join('')}</tbody></table></div>`;
 return `<section class="ms-bench" data-ms-bench-view="shapes"><h2 id="ms-task" tabindex="-1">${esc(T.shapesEntry)}</h2>${p(T.shapesPrompt)}${pick('sample',samples,l.sample)}${l.sample==='willow-rod'?p(T.willowNote,'ms-note'):''}${pick('action',actions,l.action)}${pick('predict',predictChips,l.predict)}${cell?.status==='unreadable'?p(T.unreadable,'ms-unavailable'):''}<div class="ms-stage">${samplePicture(s,stage,s?.label??'')}</div><div class="ms-actions">${button('try',esc(T.tryIt),'',!editable||!l.predict||l.tried,'primary')}${button('let-go',esc(T.letGo),'',!editable||!l.tried,'primary')}</div>${shownText}${ladder('shapes',`${l.sample}/${l.action}`,l,!editable)}${grid}</section>`;
}
export const mendingShedEntry=()=>`<a href="${ROUTE}">${esc(T.title)}</a>`;
export function mendingShedPage(state,owner=''){
 const v=C.mendingShedView(state),l=local(state,owner),sum=C.mendingShedSummary(v),readOnly=v.status==='unsupported';
 const intro=v.status==='new'?T.firstVisit.map(x=>p(x)).join(''):p(T.laterVisit);
 const entries=`<nav class="ms-entries" aria-label="${esc(T.title)}">${['pile','shapes'].map(b=>`<div>${button('bench',esc(b==='pile'?T.pileEntry:T.shapesEntry),`data-ms-bench="${b}" aria-pressed="${l.bench===b}"`,readOnly)}${readOnly?'':p(b==='pile'?sum.pile:sum.shapes,'tiny')}</div>`).join('')}</nav>`;
 let body='';
 if(l.bench&&!readOnly){
  const b=l.bench,taught=v.taught[b],showTeach=!readOnly&&(l.teach[b]||!taught);
  body=`${showTeach?teachCard(b,l):''}${!readOnly&&taught&&!l.teach[b]?button('teach',esc(T.whatFor),`data-ms-bench="${b}"`):''}${b==='pile'?pileBench(v,l,readOnly):shapesBench(v,l,readOnly)}`;
 }
 const grown=`<details class="ms-grownups" data-ms-panel="grownups"${l.panels.includes('grownups')?' open':''}><summary>For grown-ups</summary>${p('What this teaches: '+T.teaches)}${p('What it does not claim: '+T.claims)}${readOnly?'':p(sum.grownUp)}</details>`;
 return `<section class="ms-shed" data-mending-shed-root><header class="page-heading"><a class="back" href="#workshop"><span aria-hidden="true">←</span> Workshop</a><h1>${esc(T.title)}</h1>${p(T.simplified,'ms-simplified')}</header>${readOnly?notice(T.unknownVersion):`<section class="ms-arrival"><p class="tiny">${esc(T.storyLabel)}</p>${intro}</section>`}${entries}${body}<p id="ms-status" class="ms-status ms-notice" tabindex="-1">${esc(l.notice)}</p><p class="ms-announce" role="status" aria-live="polite">${esc(l.announce)}</p>${grown}</section>`;
}
export function mendingShedNotes(state){
 if(!state||typeof state!=='object'||!Object.hasOwn(state,'mendingShed'))return '';
 let raw='';try{raw=JSON.stringify(state.mendingShed,null,2)??'';}catch{raw='';}
 const v=C.mendingShedView(state),sum=C.mendingShedSummary(v);
 return `<details class="panel" data-mending-shed-notes><summary>${esc(T.title)}</summary>${v.status==='unsupported'?p(T.unknownVersion):`${p(sum.grownUp)}${p('What this teaches: '+T.teaches)}${p('What it does not claim: '+T.claims)}`}<details><summary>Full retained Mending Shed work</summary><pre>${esc(raw)}</pre></details><a href="${ROUTE}">${esc(T.title)}</a></details>`;
}
export function bindMendingShed(state,ctx={}){
 const root=document.querySelector('[data-mending-shed-root]');if(!root)return;
 const owner=ctx.explorerId?.()??'',l=local(state,owner),owned=state.mendingShed,material=JSON.stringify(owned),options={canExport:ctx.canExport};
 const live=el=>root.isConnected&&root===document.querySelector('[data-mending-shed-root]')&&root.contains(el)&&el.isConnected&&!el.disabled&&!el.closest('[hidden],details:not([open])')&&el.getClientRects().length>0&&location.hash===ROUTE&&(!ctx.notebook||ctx.notebook()===state)&&(ctx.explorerId?.()??'')===owner&&ctx.isActive?.()!==false&&state.mendingShed===owned&&JSON.stringify(owned)===material&&views.get(state)===l&&!document.querySelector('dialog.welcome-film[open]');
 const remember=()=>{l.panels=[...root.querySelectorAll('[data-ms-panel][open]')].map(e=>e.dataset.msPanel);};
 const redraw=selector=>{remember();ctx.stopSpeech?.();ctx.render?.();const next=document.querySelector('[data-mending-shed-root]'),el=selector&&next?.querySelector(selector);(el&&!el.disabled&&el.getClientRects().length?el:next?.querySelector('#ms-task')??next?.querySelector('h1'))?.focus?.();};
 const commit=(fn,after,selector)=>{const result=fn();if(!result.ok){l.notice=result.error==='capacity'?T.capacity:T.unreadable;return redraw('#ms-status');}l.root=state.mendingShed;const saved=result.changed===false?null:ctx.save?.();after?.(result);if(saved&&(saved.enabled===false||saved.ok===false)&&saved.message)l.notice=[l.notice,saved.message].filter(Boolean).join(' ');redraw(selector);};
 root.querySelectorAll('[data-ms-panel]').forEach(el=>el.addEventListener('toggle',remember));
 root.querySelectorAll('[data-ms-action]').forEach(el=>el.addEventListener('click',()=>{
  if(!live(el))return;const action=el.dataset.msAction,v=C.mendingShedView(state);l.notice='';l.announce='';
  if(action==='bench'){l.bench=el.dataset.msBench;return redraw(`#ms-teach-${l.bench}`);}
  if(action==='teach'){l.teach[el.dataset.msBench]=true;l.steps[el.dataset.msBench]=0;return redraw(`#ms-teach-${el.dataset.msBench}`);}
  if(action==='show-me'){const b=el.dataset.msBench;l.steps[b]=Math.min(teachCards[b].steps.length,l.steps[b]+1);return redraw(`#ms-teach-${b} [data-ms-action="show-me"]`);}
  if(action==='start'){const b=el.dataset.msBench;if(v.taught[b]){l.teach[b]=false;return redraw('#ms-task');}return commit(()=>C.startMendingBench(state,b,options),()=>{l.teach[b]=false;},'#ms-task');}
  if(action==='card'){l.card=el.dataset.msCard;l.picked=null;return redraw(`[data-ms-card="${l.card}"]`);}
  const c=v.cards.find(x=>x.id===l.card);
  if(action==='chip'){l.picked=l.picked===el.dataset.msChip?null:el.dataset.msChip;return redraw(`[data-ms-action="chip"][data-ms-chip="${l.picked??el.dataset.msChip}"]`);}
  if(action==='place'){if(!c?.editable||!l.picked)return;const w=workOf(l,c.id),id=l.picked;w.materials=w.materials.filter(x=>x!==id);if(w.object===id)w.object=null;if(el.dataset.msRow==='object')w.object=id;else w.materials.push(id);l.picked=null;return redraw(`[data-ms-action="lift"][data-ms-chip="${id}"]`);}
  if(action==='lift'){if(!c?.editable)return;const w=workOf(l,c.id),id=el.dataset.msChip;if(w.object===id)w.object=null;w.materials=w.materials.filter(x=>x!==id);return redraw(`[data-ms-action="chip"][data-ms-chip="${id}"]`);}
  if(action==='check'){if(!c?.editable)return;const w=workOf(l,c.id);return commit(()=>C.checkMendingCard(state,c.id,w,options),r=>{l.line[c.id]=r.check.line.text;l.announce=r.check.line.text;},'#ms-line');}
  if(['sample','action','predict'].includes(action)){l[action]=el.dataset.msId;if(action!=='predict')l.predict=null;l.tried=false;l.shown=null;return redraw(`[data-ms-action="${action}"][data-ms-id="${el.dataset.msId}"]`);}
  if(action==='try'){l.tried=true;return redraw('[data-ms-action="let-go"]');}
  if(action==='let-go'){const {sample,action:act,predict}=l;return commit(()=>C.letGoMendingShape(state,sample,act,predict,options),r=>{l.shown=r.try;l.tried=false;l.announce=`${r.try.result} ${r.try.prediction}`;},'#ms-result');}
  const key=l.bench==='pile'?l.card:`${l.sample}/${l.action}`,target=l.bench==='pile'?{bench:'pile',card:l.card}:{bench:'shapes',sample:l.sample,action:l.action};
  if(action==='rung'){const n=Number(el.dataset.msRung);return commit(()=>C.supportMending(state,target,options),()=>{l.rung[key]=n;},`#ms-rung-${n}`);}
  if(action==='skip'){delete l.rung[key];if(l.bench==='pile'){delete l.work[l.card];delete l.line[l.card];l.picked=null;}else{l.predict=null;l.tried=false;l.shown=null;}return redraw('#ms-task');}
 }));
}
