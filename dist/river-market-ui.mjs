import {riverMarketText as T} from './river-market-content.mjs';
import * as core from './river-market-core.mjs';
import {hearButton,localVoices} from './play-media.mjs';
// The River Market at #mercado: arrival, La carga and Mi cuaderno (spec 324).
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Authored text may carry <i> for names and Spanish words; everything else is escaped.
const rich=x=>esc(x).replace(/&lt;(\/?)i&gt;/g,'<$1i>');
const plain=x=>String(x??'').replace(/<\/?i>/g,'');
const button=(action,label,extra='')=>`<button type='button' data-river-action='${action}'${extra}>${rich(label)}</button>`;
const es=(x,tag='span')=>`<${tag} lang='es'>${rich(x)}</${tag}>`;
let views=new WeakMap();
function local(state,owner){let v=views.get(state);const tryId=state.spanish?.errands?.carga?.tryId??0;if(!v||v.owner!==owner||v.tryId!==tryId){v={owner,tryId,picked:'',sentence:-1,words:false,cuaderno:false,lines:null,nudge:'',boat:false,again:false};views.set(state,v);}return v;}
const labelText=k=>T.labels[k]||T.labels.none;
function amountControl(view){
 const locked=!!view.carga;
 return `<div class='river-amount' role='group' aria-labelledby='river-amount-q'><p id='river-amount-q'>${esc(T.amountQuestion)}</p>${['short','longer'].map(a=>button(`amount-${a}`,T.amounts[a],` aria-pressed='${view.amount===a}'`)).join('')}${locked?`<p class='river-locked'>${esc(T.amountLocked)}</p>`:''}</div>`;
}
function note(e,v){
 const s=e.source,meaning=e.support.meaning;
 return `<section class='river-note' aria-labelledby='river-note-title'><h3 id='river-note-title'>${es(s.title)}</h3><div class='river-sentences'>${s.sentences.map((x,i)=>`<p class='river-sentence${v.sentence===i?' river-current':''}' data-river-sentence='${i}'>${es(x.es)}${meaning?`<span class='river-gloss'>${rich(x.en)}</span>`:''}</p>`).join('')}</div>
 <div class='river-support'>${button('meaning',T.meaning,` aria-pressed='${meaning}'`)}${button('words',T.wordByWord,` aria-pressed='${v.words}'`)}${hearButton(s.sentences.map(x=>plain(x.es)).join(' '),T.hear,'es')}${v.sentence<0?button('one',T.oneAtATime):`${v.sentence<s.sentences.length-1?button('next',T.nextSentence):''}${button('stop-one',T.stop)}`}</div>
 <p class='river-novoice' data-river-novoice hidden>${esc(T.noVoice)}</p>
 ${v.words?`<ul class='river-words'>${s.words.map(w=>`<li>${es(w.es)} ${esc(w.en)}</li>`).join('')}</ul>`:''}
 <p class='river-notes-links'>${button('note-sounds',T.grammar.sounds.title)}${button('note-articles',T.grammar.articles.title)}</p></section>`;
}
function scene(e,v){
 const s=e.source,p=e.task.placements,on=s.items.filter(i=>p[i.id]===null),picked=v.picked;
 const off=e.state==='done'?' disabled':'';
 const item=i=>{const at=p[i.id],placed=at!==null,place=s.places.find(x=>x.id===at),name=placed?`${i.label}, at ${place.label}`:i.label;
  return `<button type='button' class='river-item river-${i.kind}' data-river-item='${i.id}' aria-pressed='${picked===i.id}' aria-label='${esc(name)}' lang='es'${off}>${esc(i.label)}${picked===i.id?` <span class='river-marker' lang='en'>${esc(T.pickedUp)}</span>`:''}</button>`;};
 return `<section class='river-task' aria-labelledby='river-task-title'><h3 id='river-task-title' tabindex='-1'>${esc(s.prompt)}</h3>
 <div class='river-scene'>${landingArt()}<div class='river-places'>${s.places.map(x=>`<div class='river-place'><button type='button' class='river-building' data-river-place='${x.id}' lang='es'${off}>${esc(x.label)}</button><div class='river-placed'>${s.items.filter(i=>p[i.id]===x.id).map(item).join('')}</div></div>`).join('')}</div>
 <div class='river-landing'>${on.map(item).join('')}</div></div>
 ${e.state==='done'?'':button('done',T.doneButton)}</section>`;
}
function landingArt(){return `<svg class='river-art' viewBox='0 0 320 90' aria-hidden='true'><path d='M0 70Q80 60 160 70T320 70V90H0Z' class='river-water'/><path d='M40 58H150L135 70H55Z' class='river-boat'/><path d='M95 58V24L125 50H95' class='river-sail'/><path d='M170 62H310V70H170Z' class='river-dock'/></svg>`;}
function marisol(e,ids,meaning){return core.cargaLines(e,ids).map(l=>`<p class='river-line'>${es(`«${l.es}»`)}${meaning?`<span class='river-gloss'>${rich(l.en)}</span>`:''}</p>`).join('');}
function question(e,v){
 const q=e.source.question,a=e.answer,last=a?.picks.at(-1),meaning=e.support.meaning,nudge=last?q.choices.find(c=>c.id===last)?.nudge:'';
 return `<section class='river-question' aria-labelledby='river-q-title'><h3 id='river-q-title' tabindex='-1'>${es(q.es)}</h3>${meaning?`<p class='river-gloss'>${esc(q.en)}</p>`:''}<p class='river-notes-links'>${button('note-hay',T.grammar.hay.title)}</p>
 <div class='river-choices'>${q.choices.map(c=>`<button type='button' data-river-choice='${c.id}' aria-pressed='${last===c.id}' lang='es'${e.state==='done'?' disabled':''}>${esc(c.es)}</button>`).join('')}</div>${nudge?`<p class='river-nudge'>${rich(nudge)}</p>`:''}</section>`;
}
function grammarNote(key){const g=T.grammar[key];return `<details class='river-grammar' data-river-grammar='${key}'><summary>${esc(g.title)}</summary><p>${rich(g.text)}</p></details>`;}
function cuaderno(view){
 const e=view.carga;
 const body=e?`<h3>${es(e.source.title)}</h3><ul class='river-words'>${e.source.phrasebook.map(w=>`<li>${es(w.es)} ${esc(w.en)}</li>`).join('')}</ul>`:`<p>${esc(T.phrasebookEmpty)}</p>`;
 return `<section class='river-cuaderno'><h2 id='river-cuaderno-title' tabindex='-1'>${esc(T.phrasebookLink)}</h2>${body}${['articles','hay','sounds'].map(grammarNote).join('')}${button('cuaderno-close',T.phrasebookBack)}</section>`;
}
export function riverMarketPage(state,owner=''){
 const view=core.riverMarketView(state),v=local(state,owner);
 const head=`<header class='river-heading'><h1 id='river-title' tabindex='-1'>${esc(T.homeLink)}</h1></header>`;
 const status=`<p class='river-status' id='river-status' role='status' aria-live='polite'></p>`;
 if(view.status==='unsupported'||view.status==='unavailable')return `<section class='river-page' data-river-root>${head}<p>${esc(view.status==='unsupported'?T.unknownVersion:T.unavailable)}</p><a href='#notes'>${esc(T.notesLink)}</a>${status}</section>`;
 if(v.cuaderno)return `<section class='river-page' data-river-root>${head}${cuaderno(view)}${status}</section>`;
 const e=view.carga,arrival=`<p class='river-arrival'>${rich(view.status==='new'?T.opening:T.later)}</p>`;
 const entry=`<section class='river-errands' aria-labelledby='river-errands-title'><h2 id='river-errands-title'>${esc(T.errands)}</h2><div class='river-entry'>${button('open',`<i>La carga</i>`)}<span class='river-label'>${esc(labelText(view.label))}</span>${e?.support.meaning?`<span class='river-helped'>${esc(T.helped)}</span>`:''}</div></section>`;
 let errand='';
 if(view.cargaPresent&&!e)errand=`<p>${esc(T.unavailable)}</p>${view.canStartAgain?button('again',T.startAgain):''}`;
 else if(e){
  const submitted=e.taskEvidence.firstSubmission!==null,lines=v.lines;
  errand=`<div class='river-errand'>${note(e,v)}${scene(e,v)}<div class='river-replies'>${lines?marisol(e,lines,e.support.meaning):''}</div>${submitted?question(e,v):''}
  ${e.state==='done'?`${v.boat?`<p class='river-line'>${es(`«${T.boatLine.es}»`)}${e.support.meaning?`<span class='river-gloss'>${rich(T.boatLine.en)}</span>`:''}</p>`:''}`:''}
  ${v.again?`<p>${esc(T.startedAgain)}</p>`:''}${view.canStartAgain?button('again',T.startAgain):''}</div>`;
 }
 return `<section class='river-page' data-river-root>${head}${arrival}${amountControl(view)}${entry}${errand}<p>${button('cuaderno',T.phrasebookLink)}</p><aside class='river-invitation'><p>${esc(T.invitation)}</p></aside>${status}</section>`;
}
export function riverMarketNotes(state){
 let view;try{view=core.riverMarketView(state);}catch{return '';}
 if(!state||typeof state!=='object'||!Object.hasOwn(state,'spanish'))return '';
 let raw;try{raw=JSON.stringify(state.spanish,null,2);}catch{raw='Original data remains in the full notebook download.';}
 const e=view.carga,word=e?.state==='done'?'done':view.cargaPresent?'started':'not started';
 return `<details class='panel'><summary>The River Market (Spanish)</summary><p>River Market (Spanish): La carga ${esc(word)}${e?.support.meaning?', with English help':''}.</p><p>${rich(T.notesDetails)}</p><details><summary>Saved data</summary><pre>${esc(raw)}</pre></details></details>`;
}
let controller;
export function bindRiverMarket(state,ctx={}){
 controller?.abort();controller=new AbortController();const signal=controller.signal;
 const root=document.querySelector('[data-river-root]');if(!root)return;
 const owner=ctx.explorerId?.()??'',route='#mercado',v=local(state,owner),ownedRoot=state.spanish;
 const owned=()=>root.isConnected&&document.querySelector('[data-river-root]')===root&&(!ctx.notebook||ctx.notebook()===state)&&(ctx.explorerId?.()??'')===owner&&(!ctx.isActive||ctx.isActive())&&state.spanish===ownedRoot;
 const live=el=>owned()&&location.hash===route&&el.isConnected&&root.contains(el);
 const options={canExport:ctx.canExport};
 const say=message=>{const n=document.querySelector('#river-status');if(n)n.textContent=message;};
 const stop=()=>ctx.stopSpeech?.();
 function redraw(target,message=''){ctx.render?.();const next=document.querySelector('[data-river-root]');if(!next||location.hash!==route)return;say(message);const f=next.querySelector(target)||next.querySelector('#river-title');f?.focus({preventScroll:true});}
 function write(fn){const result=fn();if(!result.ok){say(result.error==='unavailable'?T.unavailable:T.capacity);return null;}if(result.changed!==false)ctx.save?.();return result;}
 try{if(!localVoices(window.speechSynthesis?.getVoices?.()||[],'es').length)root.querySelector('[data-river-novoice]')?.removeAttribute('hidden');}catch{}
 // Narration is recorded as support before speech starts; a refused write stops it.
 root.addEventListener('click',ev=>{const b=ev.target.closest?.('[data-speak-lang="es"]');if(!b||!live(b))return;if(!core.riverMarketView(state).carga)return;if(!write(()=>core.useRiverSupport(state,'narration',options)))ev.stopPropagation();},{capture:true,signal});
 root.addEventListener('click',ev=>{
  const el=ev.target.closest?.('[data-river-action],[data-river-item],[data-river-place],[data-river-choice]');if(!el||!live(el))return;
  const view=core.riverMarketView(state),e=view.carga;
  if(el.dataset.riverItem){const id=el.dataset.riverItem;if(e.task.placements[id]!==null){stop();if(!write(()=>core.placeItem(state,id,null,options)))return;}v.picked=v.picked===id?'':id;return redraw(`[data-river-item='${id}']`);}
  if(el.dataset.riverPlace){if(!v.picked)return;const id=v.picked;stop();if(!write(()=>core.placeItem(state,id,el.dataset.riverPlace,options)))return;v.picked='';return redraw(`[data-river-item='${id}']`);}
  if(el.dataset.riverChoice){stop();const r=write(()=>core.answerCarga(state,el.dataset.riverChoice,options));if(!r)return;
   if(core.riverMarketView(state).carga?.state==='done'&&core.riverMarketView(state).boatLinePending&&write(()=>core.seeBoatLine(state,options)))v.boat=true;
   const now=core.riverMarketView(state).carga,nudge=now.source.question.choices.find(c=>c.id===el.dataset.riverChoice)?.nudge;
   return redraw(`[data-river-choice='${el.dataset.riverChoice}']`,plain(nudge));}
  const a=el.dataset.riverAction;
  if(a==='amount-short'||a==='amount-longer'){const amount=a.slice(7);if(!write(()=>core.setRiverAmount(state,amount,options)))return;return redraw(`[data-river-action='${a}']`);}
  if(a==='open'){if(!write(()=>core.openCarga(state,options)))return;v.again=false;return redraw('#river-note-title');}
  if(a==='meaning'){if(!e.support.meaning&&!write(()=>core.useRiverSupport(state,'meaning',options)))return;return redraw("[data-river-action='meaning']");}
  if(a==='words'){if(!e.support.meaning&&!write(()=>core.useRiverSupport(state,'meaning',options)))return;v.words=!v.words;return redraw("[data-river-action='words']");}
  if(a==='one'){if(!e.support.oneAtATime&&!write(()=>core.useRiverSupport(state,'oneAtATime',options)))return;v.sentence=0;return redraw("[data-river-action='next']");}
  if(a==='next'){v.sentence=Math.min(v.sentence+1,e.source.sentences.length-1);return redraw(v.sentence<e.source.sentences.length-1?"[data-river-action='next']":"[data-river-action='stop-one']");}
  if(a==='stop-one'){v.sentence=-1;return redraw("[data-river-action='one']");}
  if(a==='done'){stop();const r=write(()=>core.submitCarga(state,options));if(!r)return;if(r.incomplete)return say(T.stillOnLanding);
   v.lines=r.outcome.all?['all']:r.outcome.lines;const lines=core.cargaLines(core.riverMarketView(state).carga,v.lines).map(l=>l.es).join(' ');
   if(core.riverMarketView(state).carga?.state==='done'&&core.riverMarketView(state).boatLinePending&&write(()=>core.seeBoatLine(state,options)))v.boat=true;
   return redraw('#river-q-title',lines);}
  if(a==='again'){stop();if(!write(()=>core.startCargaAgain(state,options)))return;const nv=local(state,owner);nv.again=true;return redraw('#river-note-title');}
  // Mi cuaderno and its Details notes show English, so meaning support is recorded first.
  if(a==='cuaderno'||a.startsWith('note-')){stop();if(e&&!e.support.meaning&&!write(()=>core.useRiverSupport(state,'meaning',options)))return;v.cuaderno=true;ctx.render?.();const next=document.querySelector('[data-river-root]');const key=a.slice(5);const d=key&&next?.querySelector(`[data-river-grammar='${key}']`);if(d)d.open=true;(d?.querySelector('summary')||next?.querySelector('#river-cuaderno-title'))?.focus({preventScroll:true});return;}
  if(a==='cuaderno-close'){v.cuaderno=false;return redraw('#river-note-title');}
 },{signal});
}
