import {FIELD_MISSIONS,FIELD_OUTCOMES,fieldMission} from './field-kit-content.mjs';
import {fieldKitView,recordFieldOutcome,recoverFieldKit} from './field-kit-core.mjs';
import {hearButton} from './play-media.mjs';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let turn={state:null,explorerId:null,missionId:null,page:'before',together:false,narration:false,selected:null};
export function resetFieldKitTurn(){turn={state:null,explorerId:null,missionId:null,page:'before',together:false,narration:false,selected:null};}
function currentTurn(state,missionId,explorerId){
 if(turn.state!==state||turn.explorerId!==explorerId||turn.missionId!==missionId)turn={state,explorerId,missionId,page:'before',together:false,narration:false,selected:null};
 return turn;
}
const support=()=>[...(turn.together?['read-together']:[]),...(turn.narration?['narration']:[])];
const outcomeLabel=code=>FIELD_OUTCOMES[code]||'Earlier outcome';
const historyRow=({entry})=>`<article class="field-entry" data-field-entry="${entry.id}"><h3>${esc(entry.mission.title)}</h3><p><strong>Adult-reported offscreen: ${esc(outcomeLabel(entry.outcome))}</strong></p><p data-field-reply>${esc(entry.response)}</p>${entry.support.length?`<p class="tiny">Support used: ${entry.support.map(esc).join(', ')}.</p>`:''}</article>`;
function history(view,missionId=null){
 const entries=missionId?view.entries.filter(({entry})=>entry.mission.id===missionId):view.entries;
 return entries.length?`<details class="field-history"><summary>Earlier Field Kit choices (${entries.length})</summary>${entries.map(historyRow).join('')}</details>`:'';
}
function older(view){
 const raw=view.unsupported?view.rawRoot:view.rawEntries.length||view.recovered!==null?{entries:view.rawEntries.map(x=>({reason:x.reason,original:x.entry})),recovered:view.recovered}:null;
 return raw===null?'':`<details class="field-earlier"><summary>Earlier records kept for recovery</summary><p>These records were not changed or used as a current outcome.</p><pre>${esc(JSON.stringify(raw,null,2))}</pre></details>`;
}
function index(state,unknown='',explorerId=null){
 const view=fieldKitView(state);currentTurn(state,'index',explorerId);
 return `<div class="field-kit" data-field-root data-field-index><a class="back" href="#home">Back to the garden</a><h1 id="field-title" tabindex="-1">The Field Kit</h1>${unknown?`<p class="field-status" role="status" data-field-unknown>That card is not in this kit. The five open cards are below.</p>`:''}<p>Five small missions use real materials or a real view beside our picture games. An adult and child can read a card together, try it later or choose Not today.</p><p>The screen never receives a measurement, photo, place or result. Only an adult can report an offscreen outcome.</p><div class="field-index-grid">${FIELD_MISSIONS.map(m=>`<article class="field-index-card"><h2>${esc(m.title)}</h2><p>Beside ${esc(m.host)}</p><a class="secondary" href="#field/${m.id}">Open this card</a></article>`).join('')}</div>${view.unsupported?`<section class="field-status" role="status"><h2>An earlier Field Kit record is kept</h2><p>This version cannot open that record here. It remains in your notes download.</p><button type="button" data-field-recover>Keep earlier record and continue</button></section>`:''}${history(view)}${older(view)}<p><a href="#notes">Grown-up notes</a></p></div>`;
}
const speakText=m=>[m.title,m.purpose,m.materials,...m.steps,m.safety,m.contrast].join(' ');
function card(state,mission,explorerId){
 const view=fieldKitView(state),t=currentTurn(state,mission.id,explorerId),selected=t.selected===null?null:view.entries.find(({entry})=>entry.id===t.selected)?.entry||null;
 const exhausted=view.maxId===Number.MAX_SAFE_INTEGER;
 const oldest=view.entries.length>=24?view.entries[0].entry:null;
 const outcomeControls=view.unsupported?'<p class="field-status" role="status">This earlier Field Kit version is unavailable. Keep its record and continue from the kit index.</p><button type="button" class="secondary" data-field-recover>Keep earlier record and continue</button>':exhausted?'<p class="field-status" role="status">This Field Kit record has no safe number for another choice. Earlier records remain available in Grown-up notes.</p>':`<p>Only an adult chooses what happened away from this screen.</p>${oldest?`<p class="field-cap" role="status">This choice will remove the oldest readable entry: ${esc(oldest.mission.title)} (${esc(outcomeLabel(oldest.outcome))}). Earlier records kept for recovery remain untouched.</p>`:''}<div class="field-outcomes">${Object.entries(FIELD_OUTCOMES).map(([code,label])=>`<button type="button" class="${code==='not-today'?'secondary':'primary'}" data-field-outcome="${code}">Adult: ${esc(label)}</button>`).join('')}</div>`;
 return `<div class="field-kit" data-field-root data-field-card="${mission.id}"><a class="back field-no-print" href="#field">Back to Field Kit</a><header class="field-card-header"><p class="field-eyebrow">Field Kit card</p><h1 id="field-title" tabindex="-1">${esc(mission.title)}</h1><p>Beside <a href="${mission.hostHash}">${esc(mission.host)}</a></p><p>${esc(mission.purpose)}</p></header><nav class="field-tabs field-no-print" aria-label="Card parts"><button type="button" data-field-page="before" aria-pressed="${t.page==='before'}">Before: read the card</button><button type="button" data-field-page="after" aria-pressed="${t.page==='after'}">After: adult choice</button></nav><div class="field-card-main"${t.page==='after'?' hidden':''}><section><h2>What you need</h2><p>${esc(mission.materials)}</p></section><section><h2>Try it together</h2><ol>${mission.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p>Try it together when you like; there is no timer.</p></section><section class="field-safety"><h2>Stay safe</h2><p>${esc(mission.safety)}</p></section><section><h2>Picture and real world</h2><p>${esc(mission.contrast)}</p><p>${esc(mission.missing)}</p></section><div class="field-drawing"><strong>Draw or write on paper if you like.</strong></div></div><div class="field-after field-no-print"${t.page==='before'?' hidden':''}><h2>What happened away from the screen?</h2>${selected?`<section class="field-selected" data-field-entry="${selected.id}"><p><strong>Adult-reported offscreen: ${esc(outcomeLabel(selected.outcome))}</strong></p><p data-field-reply>${esc(selected.response)}</p></section><button type="button" class="secondary" data-field-retry>Try this card again</button>`:outcomeControls}</div>${selected?'':`<div class="field-support field-no-print"><button type="button" class="secondary" data-field-together aria-pressed="${t.together}">We read it together</button><span data-field-narration>${hearButton(speakText(mission),'Hear this card')}</span><p class="tiny">Reading together and local narration are optional. The card works without audio.</p></div>`}<button type="button" class="secondary field-no-print" data-field-print>Print this card</button>${history(view,mission.id)}${older(view)}<p class="field-no-print"><a href="#notes">Grown-up notes</a></p><p class="field-status field-no-print" data-field-status role="status" tabindex="-1"></p></div>`;
}
export function fieldKitPage(state,slug='',explorerId=null){
 if(!slug)return index(state,'',explorerId);
 const mission=fieldMission(slug);
 if(!mission)return index(state,slug,explorerId);
 return card(state,mission,explorerId);
}
export function fieldKitEntry(missionId){const m=fieldMission(missionId);return m?`<aside class="field-entry-link"><h2>Try it away from the screen</h2><p>${esc(m.title)} is a real-world card beside this picture game.</p><a class="secondary" href="#field/${m.id}">Open the Field Kit card</a></aside>`:'';}
export function fieldKitNotes(state){if(!Object.hasOwn(state,'fieldKit'))return '';const view=fieldKitView(state);return `<details class="panel" data-field-notes><summary>Field Kit: adult-reported offscreen choices</summary><p>These are adult-reported offscreen choices, not measurements or attainment. No physical result, writing, weather word or location is held here.</p>${view.unsupported?'<p>The earlier Field Kit format is kept but unavailable here.</p>':history(view)}${older(view)}<pre>${esc(JSON.stringify(state.fieldKit,null,2))}</pre></details>`;}
export function bindFieldKit(state,ctx){
 const root=document.querySelector('[data-field-root]');if(!root)return;
 const missionId=root.dataset.fieldCard||'index',explorerId=ctx.explorerId?.()??null;
 const t=currentTurn(state,missionId,explorerId);
 const refresh=(selector='#field-title',save=false)=>{if(save)ctx.save();ctx.render();ctx.focus?.(selector);};
 const status=message=>{const target=root.querySelector('[data-field-status]');if(target){target.textContent=message;target.focus();}};
 root.querySelectorAll('[data-field-page]').forEach(b=>b.addEventListener('click',()=>{t.page=b.dataset.fieldPage;refresh(`[data-field-page="${t.page}"]`);}));
 root.querySelector('[data-field-together]')?.addEventListener('click',()=>{t.together=!t.together;refresh('[data-field-together]');});
 root.addEventListener('garden-speech-start',e=>{if(!e.target.closest('[data-field-narration]')||!root.isConnected||location.hash!==`#field/${missionId}`||(ctx.explorerId?.()??null)!==explorerId||t.selected!==null)return;t.narration=true;});
 root.querySelector('[data-field-print]')?.addEventListener('click',()=>window.print());
 root.querySelectorAll('[data-field-outcome]').forEach(b=>b.addEventListener('click',()=>{
  if(t.selected!==null)return;
  const entry=recordFieldOutcome(state,missionId,b.dataset.fieldOutcome,support());
  if(!entry){status('This choice cannot be saved. Earlier records remain available.');return;}
  t.selected=entry.id;t.page='after';refresh('[data-field-reply]',true);
 }));
 root.querySelector('[data-field-retry]')?.addEventListener('click',()=>{t.selected=null;t.together=false;t.narration=false;t.page='before';refresh('[data-field-page="before"]');});
 root.querySelector('[data-field-recover]')?.addEventListener('click',()=>{if(recoverFieldKit(state))refresh('#field-title',true);});
}
