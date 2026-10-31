// Spec 334: the Design Table at #workshop/design, stations 2 (Two bags, one test) and 3 (Write the brief).
import {designTableCopy as T,designItems,designBrief} from './design-table-content.mjs';
import * as C from './design-table-core.mjs';
import {guides} from './companions.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const md=x=>esc(x).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
const p=(x,cls='',attrs='')=>`<p${cls?` class="${cls}"`:''}${attrs?' '+attrs:''}>${md(x)}</p>`;
const btn=(action,label,attrs='',{disabled=false,cls='secondary'}={})=>`<button type="button" class="${cls}" data-dt-action="${action}" ${attrs}${disabled?' disabled':''}>${label}</button>`;
const ROUTE='#workshop/design';
const own=(x,k)=>x!==null&&typeof x==='object'&&Object.hasOwn(x,k);
const guide=state=>(guides.find(g=>g.id===state?.garden?.guide)||guides[0]).name;
let views=new WeakMap();
export function resetDesignTableView(){views=new WeakMap();}
function local(state,owner){let l=views.get(state);if(!l||l.owner!==owner){l={owner,station:null,teachOpen:{bags:false,brief:false},worked:{bags:0,brief:0},tries:0,totals:false,pick:{},placed:{},a5:'',ladder:{},lines:{},board:null,flipped:[],briefLine:null,mary:false,notice:'',announce:''};views.set(state,l);}return l;}
const label=k=>p(T.labels[k],'dt-label');
function bags(){return `<svg class="dt-bags" viewBox="0 0 240 110" role="img" aria-label="${esc(T.stations.bags)}"><path d="M10 104h220" stroke="#3e4a3a" stroke-width="3"/><path d="M28 50h70v52H28z" fill="#8a5a32" stroke="#4a3a22" stroke-width="3"/><path d="M28 50q35-26 70 0" fill="#9c6a3c" stroke="#4a3a22" stroke-width="3"/><path d="M46 50q17-38 34 0" fill="none" stroke="#4a3a22" stroke-width="4"/><circle cx="63" cy="70" r="5" fill="#d9c27a" stroke="#4a3a22" stroke-width="2"/><path d="M136 46h84l-10 56h-64z" fill="#d6b06c" stroke="#6a4e22" stroke-width="3"/><path d="M140 60h76M143 74h70M146 88h64M156 46v56M178 46v56M200 46v56" stroke="#8c6a2e" stroke-width="2"/><path d="M150 46q28-40 56 0" fill="none" stroke="#6a4e22" stroke-width="4"/></svg>`;}
function teachCard(state,v,station,l){
 const t=T.teach[station],show=!v.taught[station]||l.teachOpen[station];
 if(!show)return `<div class="dt-actions">${btn('reopen',esc(T.reopen),`data-dt-station="${station}"`)}</div>`;
 const n=l.worked[station];
 return `<section class="dt-teach" id="dt-teach-${station}" tabindex="-1">${label('science')}${p(t.text)}${n?`<ol class="dt-steps">${t.steps.slice(0,n).map(s=>`<li>${md(s)}</li>`).join('')}</ol>`:''}<div class="dt-actions">${n<t.steps.length?btn('show-me',esc(T.showMe),`data-dt-station="${station}"`):''}${btn('start',esc(T.start),`data-dt-station="${station}"`,{cls:'primary'})}</div></section>`;
}
const terms=station=>`<details class="dt-terms" data-dt-terms="${station}"><summary>${esc(T.keyTerms)}</summary><dl>${T.terms.map(([k,d])=>`<dt>${esc(k)}</dt><dd>${esc(d)}</dd>`).join('')}</dl></details>`;
function rainTable(l){
 const R=T.rain,row=r=>`<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`;
 return `<section class="dt-rain"><div class="dt-table-box" tabindex="0" role="region" aria-label="${esc(R.caption)}"><table><caption>${esc(R.caption)}</caption><thead><tr>${R.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${R.tries.slice(0,l.tries).map(row).join('')}${l.totals?`<tr class="dt-total"><th scope="row">${esc(R.total[0])}</th><td>${esc(R.total[1])}</td><td>${esc(R.total[2])}</td></tr>`:''}</tbody></table></div>
 <div class="dt-actions">${l.tries<3?btn('rain',esc(R.run),'',{cls:'primary'}):p(R.done,'dt-done','id="dt-rain-done" tabindex="-1"')}${l.tries===3&&!l.totals?btn('totals',esc(R.totals)):''}</div>${l.totals?p(R.carry,'dt-carry','id="dt-carry" tabindex="-1"'):''}</section>`;
}
// What the item shows: the kept record's own copy when there is one.
const shown=(vi)=>vi.record?{prompt:vi.record.prompt,explanation:vi.record.explanation,options:vi.record.options,slots:vi.record.slots}:{prompt:vi.item.prompt,explanation:vi.item.explanation,options:vi.item.options,slots:vi.item.slots||[]};
function placedView(vi,l){
 const id=vi.item.id;if(!l.placed[id]){const latest=vi.record?.latest;l.placed[id]=latest?.placed?Object.fromEntries(latest.placed.map(e=>[e.item.id,e.slot.id])):{};}
 return l.placed[id];
}
function lineFor(vi,l){const v=l.lines[vi.item.id];if(v)return v;const k=vi.record?.latest?.line;return k?{id:k.id,text:k.text}:null;}
function readOnlyItem(vi){
 const r=vi.record,s=shown(vi),latest=r.latest;
 let body=`<h3>${md(s.prompt)}</h3>`;
 if(s.options.length&&!s.slots.length)body+=`<ul class="dt-kept">${s.options.map(o=>`<li${latest?.choice?.id===o.id?' class="dt-chosen"':''}>${esc(o.label)}</li>`).join('')}</ul>`;
 if(latest?.entry!=null)body+=p(`${T.fieldLabel}: ${latest.entry}`);
 if(latest?.placed)body+=`<ul class="dt-kept">${latest.placed.map(e=>`<li>${esc(T.placedName.replace('{tile}',e.item.label).replace('{slot}',e.slot.label))}</li>`).join('')}</ul>`;
 if(latest)body+=p(latest.line.text,'dt-line');
 if(r.rightAnswer&&s.explanation)body+=`<h4>${esc(T.whyHeading)}</h4>${p(s.explanation)}`;
 return body;
}
function placement(vi,l,s,max){
 const id=vi.item.id,placed=placedView(vi,l),pick=l.pick[id];
 const tray=s.options.filter(o=>!own(placed,o.id)).map(o=>`<li>${btn('pick',`${esc(o.label)}${pick===o.id?` <span class="dt-picked">(${esc(T.pickedUp)})</span>`:''}`,`data-dt-item="${id}" data-dt-opt="${o.id}" aria-pressed="${pick===o.id}"`,{cls:'dt-tile'})}</li>`).join('');
 const slots=s.slots.map(sl=>{const here=s.options.filter(o=>placed[o.id]===sl.id);
  return `<li class="dt-slot"><span class="dt-slot-name">${esc(sl.label)}</span><ul>${here.map(o=>`<li>${btn('unplace',esc(o.label),`data-dt-item="${id}" data-dt-opt="${o.id}" aria-label="${esc(T.placedName.replace('{tile}',o.label).replace('{slot}',sl.label))}"`,{cls:'dt-tile dt-placed'})}</li>`).join('')}</ul>${btn('place',`${esc(sl.label)}`,`data-dt-item="${id}" data-dt-slot="${sl.id}"`,{disabled:!pick,cls:'dt-slot-button'})}</li>`;}).join('');
 return `<ul class="dt-tray" aria-label="${esc(s.prompt)}">${tray}</ul><ul class="dt-slots">${slots}</ul>`;
}
function itemSection(state,v,id,l){
 const vi=v.items[id],item=vi.item;
 if(vi.status==='unreadable')return `<section class="dt-item" data-dt-item-root="${id}">${p(T.unreadable,'dt-unavailable')}</section>`;
 if(vi.kept&&!vi.writable)return `<section class="dt-item dt-readonly" data-dt-item-root="${id}">${readOnlyItem(vi)}</section>`;
 const s=shown(vi),r=vi.record,line=lineFor(vi,l);
 let body=`<h3 id="dt-q-${id}" tabindex="-1">${md(s.prompt)}</h3>`;
 if(id==='bags-unfair')body=p(T.unfairScene,'dt-scene')+body;
 if(item.guided)body+=p(item.step,'dt-step');
 if(item.kind==='choice')body+=`<div class="dt-choices" role="group" aria-label="${esc(s.prompt)}">${s.options.map(o=>btn('choose',esc(o.label),`data-dt-item="${id}" data-dt-choice="${o.id}" aria-pressed="${r?.latest?.choice?.id===o.id}"`)).join('')}</div>`;
 if(item.kind==='number')body+=`<form class="dt-number" data-dt-form="${id}"><label for="dt-entry-${id}">${esc(T.fieldLabel)}</label><input id="dt-entry-${id}" data-dt-entry="${id}" inputmode="numeric" autocomplete="off" value="${esc(l.a5)}"><button type="submit" class="primary" data-dt-action="check-number" data-dt-item="${id}"${l.a5.trim()?'':' disabled'}>${esc(T.check)}</button></form>`;
 if(item.kind==='tags'||item.kind==='sort')body+=placement(vi,l,s,item.kind==='tags'?1:0)+`<div class="dt-actions">${btn('check',esc(T.check),`data-dt-item="${id}"`,{cls:'primary'})}</div>`;
 if(item.kind==='frame'){const placed=placedView(vi,l);
  body+=`<div class="dt-frame">${s.slots.map(g=>`<div class="dt-gap" role="group" aria-label="${esc(g.label)}"><span class="dt-gap-name">${esc(g.label)}</span>${item.gaps[g.id].map(c=>{const o=s.options.find(x=>x.id===c);return btn('chip',esc(o.label),`data-dt-item="${id}" data-dt-opt="${c}" data-dt-slot="${g.id}" aria-pressed="${placed[c]===g.id}"`,{cls:'dt-chip'});}).join('')}</div>`).join('')}</div><div class="dt-actions">${btn('check',esc(T.check),`data-dt-item="${id}"`,{cls:'primary'})}</div>`;}
 body+=`<p class="dt-line" id="dt-line-${id}" tabindex="-1">${line?esc(line.text):''}</p>`;
 if(item.explanation&&r?.rightAnswer)body+=`<section class="dt-why"><h4>${esc(T.whyHeading)}</h4>${item.kind==='number'?p(item.steps):''}${p(r.explanation)}</section>`;
 if(item.ladder){const rung=l.ladder[id]||0;
  body+=`<div class="dt-ladder">${rung>=1?p(item.hint,'dt-hint',`id="dt-hint-${id}" tabindex="-1"`):''}${rung>=2?p(item.stuckLine,'dt-hint',`id="dt-example-${id}" tabindex="-1"`):''}<div class="dt-actions">${rung===0?btn('rung',esc(T.stuck),`data-dt-item="${id}" data-dt-rung="1"`):rung===1?btn('rung',esc(T.example),`data-dt-item="${id}" data-dt-rung="2"`):''}${rung>=1?btn('skip',esc(T.skip),`data-dt-item="${id}"`):''}</div></div>`;}
 return `<section class="dt-item" data-dt-item-root="${id}">${item.model?label('model'):''}${body}</section>`;
}
// The brief board.
function boardView(vb,l){
 if(l.board)return;const latest=vb.record?.latest;l.board={};l.flipped=latest?[...latest.flipped]:[];
 if(!latest)return;
 for(const e of latest.placed){const t=vb.record.tray.find(x=>x.id===e.item.id||own(x.flip,'id')&&x.flip.id===e.item.id);if(!t)continue;const returned=designBrief.vague.includes(t.id)&&e.item.id===t.id&&l.flipped.includes(t.id);if(!returned)l.board[t.id]=e.slot.id;}
}
function readBack(r){const rows=C.briefReadBack(r,T.briefCard);return rows?`<section class="dt-brief-card" id="dt-brief-card" tabindex="-1"><h3>${esc(T.yourBrief)}</h3><dl>${rows.map(x=>`<dt>${esc(x.label)}</dt><dd>${esc(x.text)}</dd>`).join('')}</dl></section>`:'';}
const mary=()=>`<section class="dt-mary" id="dt-mary" tabindex="-1">${label('history')}${T.mary.map(x=>p(x)).join('')}</section>`;
function briefSection(v,l){
 const vb=v.brief,b=designBrief;
 if(vb.status==='unreadable')return `<section class="dt-brief">${p(T.unreadable,'dt-unavailable')}</section>`;
 if(vb.kept&&!vb.writable){const r=vb.record,latest=r.latest;
  return `<section class="dt-brief dt-readonly"><ul class="dt-kept">${(latest?.placed||[]).map(e=>`<li>${esc(T.placedName.replace('{tile}',e.item.label).replace('{slot}',e.slot.label))}</li>`).join('')}</ul>${latest?p(latest.line.text,'dt-line'):''}${readBack(r)}</section>`;}
 boardView(vb,l);const r=vb.record,pick=l.pick.brief,board=l.board,flipped=l.flipped;
 // A kept brief shows its own tray, slots, flip sides and order; the module only grades.
 const trayList=r?r.tray:b.tray,slotList=r?r.slots:b.slots;
 const tile=(t,placedIn)=>{const side=C.sideOf(t,flipped),niceFlipped=t.id==='nice'&&flipped.includes('nice');
  const name=placedIn?T.placedName.replace('{tile}',side.label).replace('{slot}',slotList.find(s=>s.id===placedIn).label):side.label;
  const main=placedIn?btn('unplace',esc(side.label),`data-dt-item="brief" data-dt-opt="${t.id}" aria-label="${esc(name)}"`,{cls:'dt-tile dt-placed'}):btn('pick',`${esc(side.label)}${pick===t.id?` <span class="dt-picked">(${esc(T.pickedUp)})</span>`:''}`,`data-dt-item="brief" data-dt-opt="${t.id}" aria-pressed="${pick===t.id}"`,{cls:'dt-tile',disabled:niceFlipped});
  const flip=b.vague.includes(t.id)&&!flipped.includes(t.id)?btn('flip',esc(T.flip),`data-dt-opt="${t.id}"`,{cls:'dt-flip'}):'';
  return `<li class="dt-tile-row${niceFlipped?' dt-nice':''}">${main}${flip}${niceFlipped?p(t.flip.line,'dt-flip-line'):''}</li>`;};
 const tray=trayList.filter(t=>!own(board,t.id)).map(t=>tile(t,null)).join('');
 const slots=slotList.map(s=>{const here=trayList.filter(t=>board[t.id]===s.id),full=here.length>=b.room[s.id];
  return `<li class="dt-slot" data-dt-brief-slot="${s.id}"><span class="dt-slot-name">${esc(s.label)}</span><ul>${here.map(t=>tile(t,s.id)).join('')}</ul>${btn('place',esc(s.label),`data-dt-item="brief" data-dt-slot="${s.id}"`,{disabled:!pick||full,cls:'dt-slot-button'})}</li>`;}).join('');
 const line=l.briefLine||(r?.latest?{id:r.latest.line.id,text:r.latest.line.text}:null);
 return `<section class="dt-brief"><ul class="dt-slots dt-board">${slots}</ul><ul class="dt-tray">${tray}</ul><div class="dt-actions">${btn('check-brief',esc(T.checkBrief),'',{cls:'primary'})}</div><p class="dt-line" id="dt-line-brief" tabindex="-1">${line&&line.id!=='right'?esc(line.text):''}</p>${r?.rightBrief?readBack(r)+mary():''}</section>`;
}
function station(state,v,st,l){
 const head=`<h2 id="dt-station" tabindex="-1">${esc(T.stations[st])}</h2>${label('model')}`;
 if(st==='bags')return `<section class="dt-station" data-dt-station-root="bags">${head}${teachCard(state,v,'bags',l)}${terms('bags')}${bags()}${rainTable(l)}${['bags-guided','bags-tags','bags-frame','bags-improve','bags-unfair'].map(id=>itemSection(state,v,id,l)).join('')}<h3 class="dt-practice">${esc(T.practice)}</h3>${['a4','a5','a6'].map(id=>itemSection(state,v,id,l)).join('')}</section>`;
 const showMary=l.mary&&!v.brief.record?.rightBrief;
 return `<section class="dt-station" data-dt-station-root="brief">${head}${teachCard(state,v,'brief',l)}${terms('brief')}${briefSection(v,l)}${v.brief.record?.rightBrief?'':`<div class="dt-actions">${btn('mary',esc(T.maryButton),`aria-expanded="${showMary}"`)}</div>`}${showMary?mary():''}${itemSection(state,v,'brief-guided',l)}<h3 class="dt-practice">${esc(T.practice)}</h3>${['a7','a8'].map(id=>itemSection(state,v,id,l)).join('')}</section>`;
}
export function designTableSummary(v){const help=C.withHelp(v);return T.grown.line.replace('{n}',C.progress(v,'bags')).replace('{m}',C.progress(v,'brief')).replace('{help}',help?T.grown.withHelp:'');}
export function designTablePage(state,owner=''){
 const v=C.designView(state),l=local(state,owner),header=`<header class="page-heading"><a class="back" href="#workshop"><span aria-hidden="true">←</span> Workshop</a><h1>${esc(T.title)}</h1></header>`;
 const tail=`<p id="dt-status" class="dt-notice" tabindex="-1">${esc(l.notice)}</p><p class="dt-announce" role="status" aria-live="polite">${esc(l.announce)}</p>`;
 if(v.status==='unsupported')return `<section class="dt-room" data-design-table-root>${header}<aside class="dt-notice">${p(T.unknownVersion)}<a href="#notes">${esc(T.notesLink)}</a></aside>${tail}</section>`;
 const intro=v.status==='new'?p(T.firstVisit.replaceAll('{guide}',guide(state))):p(T.laterVisit);
 const entries=`<div class="dt-entries">${C.STATIONS.map(st=>btn('station',`<strong>${esc(T.stations[st])}</strong> <span class="dt-progress">${esc(T.progress[st].replace('{n}',C.progress(v,st)))}</span>`,`data-dt-station="${st}" aria-pressed="${l.station===st}"`,{cls:'dt-entry'})).join('')}</div>`;
 const grown=`<details class="dt-grownups"><summary>For grown-ups</summary>${p(`**${T.grown.teachesLabel}:** ${T.grown.teaches}`)}${p(`**${T.grown.claimsLabel}:** ${T.grown.claims}`)}${p(`**${T.grown.historyLabel}:** ${T.grown.history}`)}${p(designTableSummary(v))}</details>`;
 return `<section class="dt-room" data-design-table-root>${header}<section class="dt-arrival">${intro}</section>${entries}${l.station?station(state,v,l.station,l):''}${tail}${grown}</section>`;
}
export function designTableNotes(state){
 if(!state||typeof state!=='object'||!Object.hasOwn(state,'designTable'))return '';
 let raw='';try{raw=JSON.stringify(state.designTable,null,2)??'';}catch{raw='';}
 let line='';try{const v=C.designView(state);line=v.status==='unsupported'?T.unknownVersion:designTableSummary(v);}catch{line=T.unknownVersion;}
 return `<details class="panel" data-design-table-notes><summary>${esc(T.title)}</summary>${p(line)}<details><summary>Full retained Design Table work</summary><pre>${esc(raw)}</pre></details><a href="${ROUTE}">${esc(T.title)}</a></details>`;
}
export function designTableEntry(){return `<a class="button secondary" href="${ROUTE}">${esc(T.title)}</a>`;}
export function bindDesignTable(state,ctx={}){
 const root=document.querySelector('[data-design-table-root]');if(!root)return;
 const owner=ctx.explorerId?.()??'',l=local(state,owner),owned=state.designTable,material=JSON.stringify(owned),options={canExport:ctx.canExport};
 const live=el=>root.isConnected&&root===document.querySelector('[data-design-table-root]')&&root.contains(el)&&el.isConnected&&!el.disabled&&!el.closest('[hidden],details:not([open])')&&el.getClientRects().length>0&&location.hash===ROUTE&&(!ctx.notebook||ctx.notebook()===state)&&(ctx.explorerId?.()??'')===owner&&ctx.isActive?.()!==false&&state.designTable===owned&&JSON.stringify(owned)===material&&views.get(state)===l&&!document.querySelector('dialog.welcome-film[open]');
 const redraw=selector=>{ctx.stopSpeech?.();ctx.render?.();const next=document.querySelector('[data-design-table-root]'),el=selector&&next?.querySelector(selector);(el&&!el.disabled&&el.getClientRects().length?el:next?.querySelector('#dt-station')??next?.querySelector('h1'))?.focus?.();};
 const commit=(fn,after,selector)=>{const result=fn();if(!result.ok){l.notice=result.error==='capacity'?T.capacity:T.unreadable;l.announce=l.notice;return redraw('#dt-status');}const saved=result.changed===false?null:ctx.save?.();after?.(result);if(saved&&(saved.enabled===false||saved.ok===false)&&saved.message)l.notice=saved.message;redraw(typeof selector==='function'?selector(result):selector);};
 const item=id=>C.itemById(id);
 const answered=(id)=>res=>{l.lines[id]={id:res.line.id,text:res.line.text};l.announce=res.line.text;};
 const next=id=>{const ids=designItems.map(x=>x.id),i=ids.indexOf(id);return ids[i+1]?`#dt-q-${ids[i+1]}`:'#dt-station';};
 const placeIn=(map,id,opt,slot,max)=>{if(max)for(const [k,s] of Object.entries(map))if(s===slot&&k!==opt)delete map[k];map[opt]=slot;};
 root.querySelectorAll('[data-dt-action]').forEach(el=>el.addEventListener('click',ev=>{
  if(el.type==='submit')return;if(!live(el))return;const a=el.dataset.dtAction,id=el.dataset.dtItem,st=el.dataset.dtStation;l.notice='';l.announce='';
  if(a==='station'){l.station=l.station===st?null:st;return redraw(l.station?'#dt-station':`[data-dt-action="station"][data-dt-station="${st}"]`);}
  if(a==='reopen'){l.teachOpen[st]=true;l.worked[st]=0;return redraw(`#dt-teach-${st}`);}
  if(a==='show-me'){l.worked[st]=Math.min(T.teach[st].steps.length,l.worked[st]+1);return redraw(l.worked[st]<T.teach[st].steps.length?`[data-dt-action="show-me"][data-dt-station="${st}"]`:`[data-dt-action="start"][data-dt-station="${st}"]`);}
  if(a==='start'){if(C.designView(state).taught[st]){l.teachOpen[st]=false;return redraw('#dt-station');}return commit(()=>C.startStation(state,st,options),()=>{l.teachOpen[st]=false;},'#dt-station');}
  if(a==='rain'){const t=T.rain.tries[l.tries];l.tries=Math.min(3,l.tries+1);const h=T.rain.headers;l.announce=`${h[0]} ${t[0]}. ${h[1]}: ${t[1]}. ${h[2]}: ${t[2]}.`;return redraw(l.tries<3?'[data-dt-action="rain"]':'#dt-rain-done');}
  if(a==='totals'){l.totals=true;l.announce=`${T.rain.total.join('. ')}.`;return redraw('#dt-carry');}
  if(a==='choose')return commit(()=>C.answerItem(state,id,el.dataset.dtChoice,options),answered(id),`#dt-line-${id}`);
  if(a==='pick'){l.pick[id]=l.pick[id]===el.dataset.dtOpt?undefined:el.dataset.dtOpt;return redraw(`[data-dt-action="pick"][data-dt-item="${id}"][data-dt-opt="${el.dataset.dtOpt}"]`);}
  if(a==='place'){const opt=l.pick[id];if(!opt)return;const slot=el.dataset.dtSlot;
   if(id==='brief'){l.board[opt]=slot;}else placeIn(placedMap(id),id,opt,slot,item(id).kind==='tags');
   l.pick[id]=undefined;return redraw(`[data-dt-action="unplace"][data-dt-item="${id}"][data-dt-opt="${opt}"]`);}
  if(a==='unplace'){const opt=el.dataset.dtOpt;if(id==='brief')delete l.board[opt];else delete placedMap(id)[opt];return redraw(`[data-dt-action="pick"][data-dt-item="${id}"][data-dt-opt="${opt}"]`);}
  if(a==='chip'){const map=placedMap(id),opt=el.dataset.dtOpt,slot=el.dataset.dtSlot;for(const [k,s] of Object.entries(map))if(s===slot)delete map[k];map[opt]=slot;return redraw(`[data-dt-action="chip"][data-dt-item="${id}"][data-dt-opt="${opt}"]`);}
  if(a==='check')return commit(()=>C.answerItem(state,id,{...placedMap(id)},options),answered(id),`#dt-line-${id}`);
  if(a==='rung'){const rung=Number(el.dataset.dtRung);return commit(()=>C.openRung(state,id,rung,options),()=>{l.ladder[id]=rung;},rung===1?`#dt-hint-${id}`:`#dt-example-${id}`);}
  if(a==='skip'){delete l.ladder[id];delete l.pick[id];delete l.lines[id];delete l.placed[id];if(id==='a5')l.a5='';return redraw(next(id));}
  if(a==='flip'){const k=el.dataset.dtOpt;if(!l.flipped.includes(k))l.flipped.push(k);if(k==='nice'){delete l.board.nice;if(l.pick.brief==='nice')l.pick.brief=undefined;}const t=designBrief.tray.find(x=>x.id===k);l.announce=t.flip.line??t.flip.label;return redraw(k==='nice'?'.dt-nice .dt-flip-line':`[data-dt-opt="${k}"]`);}
  if(a==='check-brief'){const board={...l.board},flipped=[...l.flipped];
   return commit(()=>C.checkBrief(state,board,flipped,options),res=>{for(const k of res.returned)delete l.board[k];if(l.board.nice&&res.flipped.includes('nice'))delete l.board.nice;l.flipped=[...res.flipped];l.pick.brief=undefined;l.briefLine={id:res.line.id,text:res.line.text};l.announce=res.right?T.yourBrief:res.line.text;},res=>res.right?'#dt-brief-card':'#dt-line-brief');}
  if(a==='mary'){l.mary=!l.mary;return redraw(l.mary?'#dt-mary':'[data-dt-action="mary"]');}
 }));
 function placedMap(id){if(!l.placed[id]){const vi=C.designView(state).items[id];l.placed[id]=vi.record?.latest?.placed?Object.fromEntries(vi.record.latest.placed.map(e=>[e.item.id,e.slot.id])):{};}return l.placed[id];}
 root.querySelectorAll('[data-dt-entry]').forEach(el=>el.addEventListener('input',()=>{l.a5=el.value;const b=el.form?.querySelector('[data-dt-action="check-number"]');if(b)b.disabled=!el.value.trim();}));
 root.querySelectorAll('[data-dt-form]').forEach(form=>form.addEventListener('submit',ev=>{ev.preventDefault();const b=form.querySelector('[data-dt-action="check-number"]');if(!b||!live(b))return;const id=form.dataset.dtForm,it=item(id);l.notice='';l.announce='';
  const entry=C.parseEntry(l.a5);if(entry===null){l.lines[id]={id:'whole',text:it.lines.whole};l.announce=it.lines.whole;return redraw(`#dt-line-${id}`);}
  commit(()=>C.answerItem(state,id,entry,options),answered(id),`#dt-line-${id}`);}));
}
