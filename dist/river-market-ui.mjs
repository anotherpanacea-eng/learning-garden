import {riverMarketText as T} from './river-market-content.mjs';
import * as core from './river-market-core.mjs';
import {hearButton,localVoices} from './play-media.mjs';
// The River Market at #mercado: arrival, La carga and Mi cuaderno (spec 324), and El camino (spec 328).
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Authored text may carry <i> for names and Spanish words; everything else is escaped.
const rich=x=>esc(x).replace(/&lt;(\/?)i&gt;/g,'<$1i>');
const plain=x=>String(x??'').replace(/<\/?i>/g,'');
const button=(action,label,extra='')=>`<button type='button' data-river-action='${action}'${extra}>${rich(label)}</button>`;
const es=(x,tag='span')=>`<${tag} lang='es'>${rich(x)}</${tag}>`;
let views=new WeakMap();
// View state only: which errand is shown, and each errand's reading place, reset when that errand's try changes.
function local(state,owner){let v=views.get(state);if(!v||v.owner!==owner){v={owner,shown:'',cuaderno:false,boat:false,per:{}};views.set(state,v);}
 for(const k of core.ERRANDS){const tryId=state.spanish?.errands?.[k]?.tryId??0;if(!v.per[k]||v.per[k].tryId!==tryId)v.per[k]={tryId,picked:'',sentence:-1,words:false,lines:null,line:null,again:false};}
 return v;}
const errandOf=(view,k)=>k==='camino'?view.camino:view.carga;
const labelOf=(view,k)=>k==='camino'?view.caminoLabel:view.label;
// On arrival, the first errand in list order that isn't done, or La carga when both are done.
const shownOf=(view,v)=>v.shown||core.ERRANDS.find(k=>labelOf(view,k)!=='done')||'carga';
const labelText=k=>T.labels[k]||T.labels.none;
function amountControl(view,k){
 const locked=!!errandOf(view,k);
 return `<div class='river-amount' role='group' aria-labelledby='river-amount-q'><p id='river-amount-q'>${esc(T.amountQuestion)}</p>${['short','longer'].map(a=>button(`amount-${a}`,T.amounts[a],` aria-pressed='${view.amount===a}'`)).join('')}${locked?`<p class='river-locked'>${esc(T.amountLocked)}</p>`:''}</div>`;
}
const NOTE_LINKS={carga:['sounds','articles'],camino:['directions']};
function note(e,v){
 const s=e.source,meaning=e.support.meaning;
 return `<section class='river-note' aria-labelledby='river-note-title'><h3 id='river-note-title' tabindex='-1'>${es(s.title)}</h3><div class='river-sentences'>${s.sentences.map((x,i)=>`<p class='river-sentence${v.sentence===i?' river-current':''}' data-river-sentence='${i}'>${es(x.es)}${meaning?`<span class='river-gloss'>${rich(x.en)}</span>`:''}</p>`).join('')}</div>
 <div class='river-support'>${button('meaning',T.meaning,` aria-pressed='${meaning}'`)}${button('words',T.wordByWord,` aria-pressed='${v.words}'`)}${hearButton(s.sentences.map(x=>plain(x.es)).join(' '),T.hear,'es')}${v.sentence<0?button('one',T.oneAtATime):`${v.sentence<s.sentences.length-1?button('next',T.nextSentence):''}${button('stop-one',T.stop)}`}</div>
 <p class='river-novoice' data-river-novoice hidden>${esc(T.noVoice)}</p>
 ${v.words?`<ul class='river-words'>${s.words.map(w=>`<li>${es(w.es)} ${esc(w.en)}</li>`).join('')}</ul>`:''}
 <p class='river-notes-links'>${NOTE_LINKS[e.source.errand].map(k=>button(`note-${k}`,teaching(e)[k].title)).join('')}</p></section>`;
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
 return `<section class='river-question' aria-labelledby='river-q-title'><h3 id='river-q-title' tabindex='-1'>${es(q.es)}</h3>${meaning?`<p class='river-gloss'>${esc(q.en)}</p>`:''}${e.source.errand==='carga'?`<p class='river-notes-links'>${button('note-hay',teaching(e).hay.title)}</p>`:''}
 <div class='river-choices'>${q.choices.map(c=>`<button type='button' data-river-choice='${c.id}' aria-pressed='${last===c.id}' lang='es'${e.state==='done'?' disabled':''}>${esc(c.es)}</button>`).join('')}</div>${nudge?`<p class='river-nudge'>${rich(nudge)}</p>`:''}</section>`;
}
// The errand's frozen notes; an older source without them falls back to the current copy.
const teaching=e=>e?.source?.grammar??T.grammar,boatLine=e=>e?.source?.boatLine??T.boatLine;
function grammarNote(key,e){const g=teaching(e)[key];return `<details class='river-grammar' data-river-grammar='${key}'><summary>${esc(g.title)}</summary><p>${rich(g.text)}</p></details>`;}
function cuaderno(view){
 const e=view.carga,c=view.camino,group=x=>`<h3>${es(x.source.title)}</h3><ul class='river-words'>${x.source.phrasebook.map(w=>`<li>${es(w.es)} ${esc(w.en)}</li>`).join('')}</ul>`;
 const body=e||c?`${e?group(e):''}${c?group(c):''}`:`<p>${esc(T.phrasebookEmpty)}</p>`;
 const directions=(c?.source.grammar??T.caminoGrammar).directions;
 return `<section class='river-cuaderno'><h2 id='river-cuaderno-title' tabindex='-1'>${esc(T.phrasebookLink)}</h2>${body}${['articles','hay','sounds'].map(k=>grammarNote(k,e)).join('')}<details class='river-grammar' data-river-grammar='directions'><summary>${esc(directions.title)}</summary><p>${rich(directions.text)}</p></details>${button('cuaderno-close',T.phrasebookBack)}</section>`;
}
// El camino's drawn map: the landing at the bottom, the river and bridge across the middle, the plaza above.
const SPOTS={muelle:[160,214],puente:[160,148],plaza:[160,92],panaderia:[56,60],cafe:[56,110],correos:[262,60]};
// Teo stands beside each place, never over a label.
const TEO={muelle:[56,0],puente:[0,-28],plaza:[64,0],panaderia:[64,0],correos:[0,38]};
function caminoMap(e){
 const s=e.source,at=e.task.at,[tx,ty]=SPOTS[at],label=id=>s.map.find(n=>n.id===id).label;
 const box=(id,w=96,h=36)=>{const [x,y]=SPOTS[id],words=label(id).split(' '),lines=words.length>2?[words.slice(0,2).join(' '),words.slice(2).join(' ')]:[label(id)];
  return `<g class='river-map-${id}'><rect x='${x-w/2}' y='${y-h/2}' width='${w}' height='${h}' rx='5' class='river-map-building'/><text x='${x}' y='${y+(lines.length>1?-3:4)}' text-anchor='middle' lang='es'>${lines.map((l,i)=>`<tspan x='${x}' dy='${i?13:0}'>${esc(l)}${i<lines.length-1?' ':''}</tspan>`).join('')}</text></g>`;};
 return `<svg class='river-map' viewBox='0 0 320 240' role='img' aria-labelledby='river-teo-place'>
 <rect x='0' y='132' width='320' height='32' class='river-water'/><rect x='122' y='128' width='76' height='40' class='river-bridge'/>
 <rect x='112' y='72' width='96' height='42' rx='8' class='river-map-plaza'/><rect x='118' y='200' width='84' height='26' class='river-dock'/>
 <text x='160' y='${SPOTS.plaza[1]-6}' text-anchor='middle' lang='es'>${esc(label('plaza'))}</text><text x='160' y='${SPOTS.puente[1]+4}' text-anchor='middle' lang='es' class='river-map-bridge-label'>${esc(label('puente'))}</text><text x='160' y='${SPOTS.muelle[1]+4}' text-anchor='middle' lang='es'>${esc(label('muelle'))}</text>
 ${box('panaderia')}${box('cafe')}${box('correos',104,44)}
 <g class='river-teo' transform='translate(${tx+TEO[at][0]},${ty+TEO[at][1]})'><circle r='9'/><text y='4' text-anchor='middle'>Teo</text></g></svg>`;
}
function teo(l,meaning){return `<p class='river-line'>${es(`«${l.es}»`)}${meaning?`<span class='river-gloss'>${rich(l.en)}</span>`:''}</p>`;}
function caminoTask(e,w){
 const s=e.source,k=e.task,f=s.feedback,meaning=e.support.meaning,place=s.map.find(n=>n.id===k.at).label;
 let lines='';
 if(k.at===s.goal)lines=teo(f.panaderia,meaning);
 else if(k.at===s.wrong)lines=`${teo(f.correos,meaning)}<p class='river-hint'>${rich(f.correos.hint)}</p>`;
 else if(w.line==='nothing')lines=`<p class='river-line'>${esc(f.nothing.lead)} ${es(`«${f.nothing.es}»`)}${meaning?` <span class='river-gloss'>${rich(f.nothing.en)}</span>`:''} ${esc(f.nothing.tail)}</p>`;
 else if(w.line==='stays')lines=`<p class='river-line'>${esc(f.stays.text)}</p>`;
 else if(k.moveCount===0)lines=teo(f.start,meaning);
 const moves=k.at===s.goal?'':`<div class='river-moves' role='group' aria-label='${esc(s.group)}'>${s.buttons.map(b=>`<button type='button' data-river-move='${b.id}' lang='es'>${esc(b.es)} <span aria-hidden='true'>${esc(b.arrow)}</span></button>`).join('')}</div>${k.at===s.back.from?button('back',s.back.label):''}`;
 return `<section class='river-task river-camino' aria-labelledby='river-task-title'><h3 id='river-task-title' tabindex='-1'>${esc(s.prompt)}</h3>
 <div class='river-walk'>${caminoMap(e)}<p class='river-teo-place' id='river-teo-place' tabindex='-1'>${rich(s.place.replace('{place}',`<i>${place}</i>`)).replace('<i>','<i lang=\'es\'>')}</p></div>
 <div class='river-replies'>${lines}</div>${moves}</section>`;
}
export function riverMarketPage(state,owner=''){
 const view=core.riverMarketView(state),v=local(state,owner);
 const head=`<header class='river-heading'><h1 id='river-title' tabindex='-1'>${esc(T.homeLink)}</h1></header>`;
 const status=`<p class='river-status' id='river-status' role='status' aria-live='polite'></p>`;
 if(view.status==='unsupported'||view.status==='unavailable')return `<section class='river-page' data-river-root>${head}<p>${esc(view.status==='unsupported'?T.unknownVersion:T.unavailable)}</p><a href='#notes'>${esc(T.notesLink)}</a>${status}</section>`;
 if(v.cuaderno)return `<section class='river-page' data-river-root>${head}${cuaderno(view)}${status}</section>`;
 const k=shownOf(view,v),w=v.per[k],e=view.carga,c=view.camino,arrival=`<p class='river-arrival'>${rich(view.status==='new'?T.opening:T.later)}</p>`;
 const row=(id,action,title,x,label)=>`<div class='river-entry'>${button(action,`<i>${title}</i>`,` aria-current='${k===id}'`)}<span class='river-label'>${esc(labelText(label))}</span>${x?.support.meaning?`<span class='river-helped'>${esc(T.helped)}</span>`:''}</div>`;
 const entry=`<section class='river-errands' aria-labelledby='river-errands-title'><h2 id='river-errands-title'>${esc(T.errands)}</h2>${row('carga','open','La carga',e,view.label)}${row('camino','open-camino','El camino',c,view.caminoLabel)}</section>`;
 let errand='';
 if(k==='camino'){
  if(view.caminoPresent&&!c)errand=`<p>${esc(T.unavailable)}</p>${button('again-camino',T.startAgain)}`;
  else if(c)errand=`<div class='river-errand'>${note(c,w)}${caminoTask(c,w)}${c.taskEvidence.firstArrival?question(c,w):''}${w.again?`<p>${esc(T.startedAgain)}</p>`:''}${button('again-camino',T.startAgain)}</div>`;
 }
 else if(view.cargaPresent&&!e)errand=`<p>${esc(T.unavailable)}</p>${view.canStartAgain?button('again',T.startAgain):''}`;
 else if(e){
  const submitted=e.taskEvidence.firstSubmission!==null,lines=w.lines;
  errand=`<div class='river-errand'>${note(e,w)}${scene(e,w)}<div class='river-replies'>${lines?marisol(e,lines,e.support.meaning):''}</div>${submitted?question(e,w):''}
  ${e.state==='done'?`${v.boat?`<p class='river-line'>${es(`«${boatLine(e).es}»`)}${e.support.meaning?`<span class='river-gloss'>${rich(boatLine(e).en)}</span>`:''}</p>`:''}`:''}
  ${w.again?`<p>${esc(T.startedAgain)}</p>`:''}${view.canStartAgain?button('again',T.startAgain):''}</div>`;
 }
 return `<section class='river-page' data-river-root>${head}${arrival}${amountControl(view,k)}${entry}${errand}<p>${button('cuaderno',T.phrasebookLink)}</p><aside class='river-invitation'><p>${rich(T.invitations[k])}</p></aside>${status}</section>`;
}
export function riverMarketNotes(state){
 let view;try{view=core.riverMarketView(state);}catch{return '';}
 if(!state||typeof state!=='object'||!Object.hasOwn(state,'spanish'))return '';
 let raw;try{raw=JSON.stringify(state.spanish,null,2);}catch{raw='Original data remains in the full notebook download.';}
 const part=(name,x,present)=>`${name} ${x?.state==='done'?'done':present?'started':'not started'}${x?.support.meaning?', with English help':''}`;
 return `<details class='panel'><summary>The River Market (Spanish)</summary><p>River Market (Spanish): ${esc(part('La carga',view.carga,view.cargaPresent))}. ${esc(part('El camino',view.camino,view.caminoPresent))}.</p><p>${rich(T.notesDetails)}</p><details><summary>Saved data</summary><pre>${esc(raw)}</pre></details></details>`;
}
let controller;
export function resetRiverMarketView(){views=new WeakMap();controller?.abort();controller=undefined;}
export function bindRiverMarket(state,ctx={}){
 controller?.abort();controller=new AbortController();const signal=controller.signal;
 const root=document.querySelector('[data-river-root]');if(!root)return;
 const owner=ctx.explorerId?.()??'',route='#mercado',v=local(state,owner);
 // The root this binding expects: advanced after its own writes, so an outside replacement is still refused.
 let ownedRoot=state.spanish;
 const owned=()=>root.isConnected&&document.querySelector('[data-river-root]')===root&&(!ctx.notebook||ctx.notebook()===state)&&(ctx.explorerId?.()??'')===owner&&(!ctx.isActive||ctx.isActive())&&state.spanish===ownedRoot;
 const live=el=>owned()&&location.hash===route&&el.isConnected&&root.contains(el);
 const options={canExport:ctx.canExport};
 const say=message=>{const n=document.querySelector('#river-status');if(n)n.textContent=message;};
 const stop=()=>ctx.stopSpeech?.();
 function redraw(target,message=''){ctx.render?.();const next=document.querySelector('[data-river-root]');if(!next||location.hash!==route)return;say(message);const f=next.querySelector(target)||next.querySelector('#river-title');f?.focus({preventScroll:true});}
 function write(fn){const result=fn();if(!result.ok){say(result.error==='unavailable'?T.unavailable:T.capacity);return null;}if(result.changed!==false){ownedRoot=state.spanish;ctx.save?.();}return result;}
 try{if(!localVoices(window.speechSynthesis?.getVoices?.()||[],'es').length)root.querySelector('[data-river-novoice]')?.removeAttribute('hidden');}catch{}
 // Narration is recorded as support before speech starts; a refused write stops it.
 root.addEventListener('click',ev=>{const b=ev.target.closest?.('[data-speak-lang="es"]');if(!b||!live(b))return;const view=core.riverMarketView(state),k=shownOf(view,v);if(!errandOf(view,k))return;if(!write(()=>core.useRiverSupport(state,'narration',options,k)))ev.stopPropagation();},{capture:true,signal});
 root.addEventListener('click',ev=>{
  const el=ev.target.closest?.('[data-river-action],[data-river-item],[data-river-place],[data-river-choice],[data-river-move]');if(!el||!live(el))return;
  const view=core.riverMarketView(state),k=shownOf(view,v),w=v.per[k],e=errandOf(view,k);
  const p=v.per.carga;
  if(el.dataset.riverItem){const id=el.dataset.riverItem;if(e.task.placements[id]!==null){stop();if(!write(()=>core.placeItem(state,id,null,options)))return;}p.picked=p.picked===id?'':id;return redraw(`[data-river-item='${id}']`);}
  if(el.dataset.riverPlace){if(!p.picked)return;const id=p.picked;stop();if(!write(()=>core.placeItem(state,id,el.dataset.riverPlace,options)))return;p.picked='';return redraw(`[data-river-item='${id}']`);}
  // One press is one move; Teo's place and line are announced after the write.
  if(el.dataset.riverMove||el.dataset.riverAction==='back'){const b=el.dataset.riverMove||'back';stop();const r=write(()=>core.moveTeo(state,b,options));if(!r)return;w.line=r.line;
   const now=core.riverMarketView(state).camino,f=now.source.feedback,place=now.source.map.find(n=>n.id===now.task.at).label;
   const heard=r.line==='nothing'?`${f.nothing.lead} «${f.nothing.es}» ${f.nothing.tail}`:r.line==='stays'?f.stays.text:r.line?`«${f[r.line].es}»`:'';
   return redraw(b==='back'?"[data-river-move='izquierda']":now.task.at===now.source.goal?'#river-teo-place':now.task.at===now.source.back.from?"[data-river-action='back']":`[data-river-move='${b}']`,`${now.source.place.replace('{place}',place)} ${heard}`.trim());}
  if(el.dataset.riverChoice&&k==='camino'){stop();if(!write(()=>core.answerCamino(state,el.dataset.riverChoice,options)))return;
   const nudge=core.riverMarketView(state).camino.source.question.choices.find(c=>c.id===el.dataset.riverChoice)?.nudge;
   return redraw(`[data-river-choice='${el.dataset.riverChoice}']`,plain(nudge));}
  if(el.dataset.riverChoice){stop();const r=write(()=>core.answerCarga(state,el.dataset.riverChoice,options));if(!r)return;
   if(core.riverMarketView(state).carga?.state==='done'&&core.riverMarketView(state).boatLinePending&&write(()=>core.seeBoatLine(state,options)))v.boat=true;
   const now=core.riverMarketView(state).carga,nudge=now.source.question.choices.find(c=>c.id===el.dataset.riverChoice)?.nudge;
   return redraw(`[data-river-choice='${el.dataset.riverChoice}']`,plain(nudge));}
  const a=el.dataset.riverAction;
  if(a==='amount-short'||a==='amount-longer'){const amount=a.slice(7);if(!write(()=>core.setRiverAmount(state,amount,options)))return;return redraw(`[data-river-action='${a}']`);}
  // Choosing an opened errand only switches the view; a first choice opens its note.
  if(a==='open'||a==='open-camino'){const id=a==='open'?'carga':'camino';if(!errandOf(view,id)&&!(id==='carga'?view.cargaPresent:view.caminoPresent)&&!write(()=>id==='carga'?core.openCarga(state,options):core.openCamino(state,options)))return;v.shown=id;v.per[id].again=false;return redraw(errandOf(core.riverMarketView(state),id)?'#river-note-title':`[data-river-action='${a}']`);}
  if(a==='meaning'){if(!e.support.meaning&&!write(()=>core.useRiverSupport(state,'meaning',options,k)))return;return redraw("[data-river-action='meaning']");}
  if(a==='words'){if(!e.support.meaning&&!write(()=>core.useRiverSupport(state,'meaning',options,k)))return;w.words=!w.words;return redraw("[data-river-action='words']");}
  if(a==='one'){if(!e.support.oneAtATime&&!write(()=>core.useRiverSupport(state,'oneAtATime',options,k)))return;w.sentence=0;return redraw("[data-river-action='next']");}
  if(a==='next'){w.sentence=Math.min(w.sentence+1,e.source.sentences.length-1);return redraw(w.sentence<e.source.sentences.length-1?"[data-river-action='next']":"[data-river-action='stop-one']");}
  if(a==='stop-one'){w.sentence=-1;return redraw("[data-river-action='one']");}
  if(a==='done'){stop();const r=write(()=>core.submitCarga(state,options));if(!r)return;if(r.incomplete)return say(T.stillOnLanding);
   p.lines=r.outcome.all?['all']:r.outcome.lines;const lines=core.cargaLines(core.riverMarketView(state).carga,p.lines).map(l=>l.es).join(' ');
   if(core.riverMarketView(state).carga?.state==='done'&&core.riverMarketView(state).boatLinePending&&write(()=>core.seeBoatLine(state,options)))v.boat=true;
   return redraw('#river-q-title',lines);}
  if(a==='again'){stop();if(!write(()=>core.startCargaAgain(state,options)))return;const nv=local(state,owner);nv.per.carga.again=true;return redraw('#river-note-title');}
  if(a==='again-camino'){stop();if(!write(()=>core.startCaminoAgain(state,options)))return;const nv=local(state,owner);nv.per.camino.again=true;return redraw('#river-note-title');}
  // Mi cuaderno and its Details notes show English, so meaning support is recorded first.
  if(a==='cuaderno'||a.startsWith('note-')){stop();if(!write(()=>core.useCuadernoSupport(state,options)))return;v.cuaderno=true;ctx.render?.();const next=document.querySelector('[data-river-root]');const key=a.slice(5);const d=key&&next?.querySelector(`[data-river-grammar='${key}']`);if(d)d.open=true;(d?.querySelector('summary')||next?.querySelector('#river-cuaderno-title'))?.focus({preventScroll:true});return;}
  if(a==='cuaderno-close'){v.cuaderno=false;return redraw('#river-note-title');}
 },{signal});
}
