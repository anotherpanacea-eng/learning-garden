import {makeWordListShelfSource,wordListShelfCopy as T} from './word-list-shelf-content.mjs';
import * as C from './word-list-shelf-core.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const str=x=>typeof x==='string'?x:'';
const sourceText=x=>typeof x==='string'&&[...x].length<=4000?x:'';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const p=x=>`<p>${esc(str(x))}</p>`;
const picked=(placements,id)=>Object.hasOwn(placements,id)?placements[id]:null;
const button=(action,label,attrs='',disabled=false)=>`<button type="button" data-wls-action="${action}" ${attrs}${disabled?' disabled':''}>${esc(label)}</button>`;
const read=(kind,label,disabled=false)=>`<button type="button" class="wls-read" data-speak="" data-wls-read="${kind}"${disabled?' disabled':''}>${esc(label)}</button>`;
const notice=x=>`<aside class="wls-notice">${p(x)}<a href="#notes">${esc(T.notes)}</a></aside>`;
const json=x=>{try{return JSON.stringify(x,null,2);}catch{return T.unavailable;}};
let locals=new WeakMap();
export function resetWordListShelfView(){locals=new WeakMap();}
function local(state,owner){
 let l=locals.get(state);
 if(!l||l.owner!==owner||l.root!==state.wordListShelf){l={owner,root:state.wordListShelf,word:null,panels:typeof matchMedia==='function'&&matchMedia('(min-width:700px)').matches?['overview']:[],shelfVisited:object(state.wordListShelf)&&Object.hasOwn(state.wordListShelf,'shelf'),steps:{},message:'',messageView:null,stamp:false};locals.set(state,l);}
 return l;
}
function panel(l,id,label,body){return `<details data-wls-panel="${esc(id)}"${l.panels.includes(id)?' open':''}><summary>${esc(label)}</summary>${body}</details>`;}
const currentWord=(e,l)=>e?.source?.words.find(w=>w.id===l.word)??e?.source?.words[0]??null;
const stepCount=(l,key,total)=>Math.min(l.steps[key]??1,total);
function example(title,steps,l,key,lead=''){
 const n=stepCount(l,key,steps.length);
 return `<section class="wls-example" data-wls-example="${esc(key)}" tabindex="-1"><h3>${esc(title)}</h3>${lead?p(lead):''}<ol>${steps.slice(0,n).map(t=>`<li>${esc(t)}</li>`).join('')}</ol><div class="wls-actions">${button('step-back',T.stepBack,`data-wls-example-key="${esc(key)}"`,n===0)}${button('step',T.step,`data-wls-example-key="${esc(key)}"`,n===steps.length)}</div></section>`;
}
function shelfArt(){return `<svg class="wls-art" viewBox="0 0 540 210" aria-hidden="true"><path d="M15 15h510v170H15z" fill="#b77b42" stroke="#6b4a36" stroke-width="8"/><path d="M22 73h495M22 129h495M22 182h495" stroke="#6b4a36" stroke-width="9"/><path d="m35 31 77 5m20-6 100 6m35-7 80 6m34-6 105 5m-444 61 160 7m60-7 90 6m-304 51 145 7m50-8 190 8" fill="none" stroke="#d6a771" stroke-width="3"/><path d="m42 44 42-4 3 28-42 4zM99 35l49 5-3 29-49-5zM160 43h52v27h-52z" fill="#245d7d"/><path d="m243 39 53-4 3 34-53 4zM321 39l41 4-3 27-41-4zM388 35h53v34h-53zM454 44l41-5 4 30-41 5z" fill="#194f46"/><path d="M42 101h59v23H42zm83-5 55 5-2 25-55-5zm85 2h48v26h-48zm78 0 59-4 2 29-59 4zm88-5h50v31h-50zm76 9 42-4 2 25-42 4z" fill="#fffef8"/><path d="M42 150h88v26H42zm115-5 76 4-2 26-76-4zm111 5h75v26h-75zm102-5 115 4-1 26-115-4z" fill="#733c66"/><path d="M5 187h530v16H5z" fill="#6b4a36"/></svg>`;}
function shelfPockets(s,placements,interactive=false){
 return `<div class="wls-pockets">${s.trays.map((tray,i)=>`<section class="wls-pocket wls-pocket-${i%5}"><h3>${esc(tray.label)}</h3>${p(tray.description)}<div class="wls-spines">${s.words.filter(w=>picked(placements,w.id)===tray.id).map(w=>interactive?button('select',w.text,`data-wls-word="${esc(w.id)}"`):`<span>${esc(w.text)}</span>`).join('')}</div></section>`).join('')}</div>`;
}
function placementsReadout(s,placements){
 return `<dl class="wls-readout">${s.words.map(w=>{const choice=picked(placements,w.id),tray=s.trays.find(t=>t.id===choice);return `<div><dt>${esc(w.text)}</dt><dd>${esc(tray?.label??(choice===null?T.unplaced:json(choice)))}</dd></div>`;}).join('')}</dl>`;
}
function checkSummary(c,copy){
 if(sourceText(c?.summary))return c.summary;
 if(!c)return '';
 const key=c.coverage==='partial'?'partial'+c.status[0].toUpperCase()+c.status.slice(1):c.status==='listed'?'listedSummary':c.status;
 return sourceText(copy?.[key]);
}
function keptFeedback(row){
 const name=sourceText(row.word)||row.id,tray=sourceText(row.trayLabel);
 return `<div class="wls-kept-feedback"><p><strong>${esc(name)}</strong>${tray?' · '+esc(tray):''}</p>${p(row.feedback)}</div>`;
}
function shelfKeeps(e,l){return ['first','latest'].map(edition=>{
 const k=e.record[edition+'Kept'];if(!Object.hasOwn(e.record,edition+'Kept')||e[edition+'Status']==='missing'||k===null)return '';
 if(e[edition+'Status']!=='ready')return notice(T.unavailable);
 return panel(l,'shelf-'+edition,edition==='first'?T.first:T.latest,`${placementsReadout(e.source,k.placements)}${k.check?p(checkSummary(k.check,e.source.copy))+k.check.rows.map(keptFeedback).join(''):''}${button('restore-shelf',T.reopen,`data-wls-edition="${edition}"`)}`);
}).join('');}
function shelfPage(v,l){
 const e=v.shelf;
 if(e?.status!=='ready'||e.draftStatus!=='ready')return notice(T.unavailable);
 const s=e.source,r=e.record,w=currentWord(e,l),isPlayable=e.playable.some(x=>x.id===w?.id),index=s.words.indexOf(w);
 const value=picked(r.placements,w.id),row=e.last&&!e.earlier?e.last.rows.find(x=>x.id===w.id):null;
 const waiting=s.words.filter(x=>!s.trays.some(t=>t.id===picked(r.placements,x.id)));
 const full=shelfPockets(s,r.placements,true)+(waiting.length?`<section class="wls-table-words"><h3>${esc(T.picker)}</h3><div>${waiting.map(x=>button('select',x.text,`data-wls-word="${esc(x.id)}"`)).join('')}</div></section>`:'');
 const shelfExample=object(v.source?.example)&&sourceText(v.source.example.title)&&Array.isArray(v.source.example.steps)&&v.source.example.steps.length<=64&&v.source.example.steps.every(t=>typeof t==='string'&&[...t].length<=4000)?v.source.example:null;
 return `${!e.playable.length?notice(T.unavailable):''}<div class="wls-workspace"><section class="wls-active"><div class="wls-word-nav"><label>${esc(T.picker)}<select data-wls-picker>${s.words.map(x=>`<option value="${esc(x.id)}"${w.id===x.id?' selected':''}>${esc(x.text)}</option>`).join('')}</select></label><div class="wls-actions">${button('previous',T.previous,'',index===0)}${button('next',T.next,'',index===s.words.length-1)}</div></div><article class="wls-paper"><h2 id="wls-task" tabindex="-1">${esc(w.text)}</h2>${w.sentence===null?p(T.contextUnavailable):p(w.sentence)}${read('sentence',T.readSentence,w.sentence===null)}<ul class="wls-clues">${w.clues.map(c=>`<li>${esc(c.note)}</li>`).join('')}</ul></article><div class="wls-trays" role="group" aria-label="${esc(T.instruction)}">${s.trays.map(t=>button('place',t.label,`data-wls-tray="${esc(t.id)}" aria-pressed="${value===t.id}"`,!isPlayable)).join('')}</div>${button('clear',T.clear,'',!isPlayable||value===null)}${!isPlayable?notice(T.partial)+p(json(value)):''}${row?`<p class="wls-word-feedback">${esc(row.feedback)}</p>`:''}<div class="wls-actions wls-commit">${button('check-shelf',T.check,'',!e.playable.length||e.checksStatus==='unreadable')}${button('keep-shelf',T.keep,'',!e.playable.length||e.latestStatus==='unreadable')}</div>${e.last&&!e.earlier?`<aside id="wls-feedback" class="wls-feedback" tabindex="-1" role="status">${p(checkSummary(e.last,e.source.copy))}${e.last.coverage==='partial'?p(e.last.notice):''}</aside>`:''}${e.partial?notice(T.partial):''}<div class="wls-actions">${button('contrast',T.contrast,`aria-expanded="${l.panels.includes('contrast')}"`,!sourceText(v.source?.contrast))}${button('shelf-example',T.example,`aria-expanded="${l.panels.includes('shelf-example')}"`,!shelfExample)}</div>${l.panels.includes('contrast')?`<section class="wls-example" id="wls-contrast" tabindex="-1">${p(sourceText(v.source.contrast))}</section>`:''}${l.panels.includes('shelf-example')&&shelfExample?example(shelfExample.title,shelfExample.steps,l,'shelf'):''}${shelfKeeps(e,l)}</section><aside class="wls-shelf-side">${panel(l,'overview',T.overview,full)}</aside></div>`;
}
function jobKeeps(e,l){return ['first','latest'].map(edition=>{
 const k=e.record[edition+'Kept'];if(!Object.hasOwn(e.record,edition+'Kept')||e[edition+'Status']==='missing'||k===null)return '';
 if(e[edition+'Status']!=='ready')return notice(T.unavailable);
 const choice=e.source.choices.find(c=>c.id===k.work.choice);
 return panel(l,e.id+'-'+edition,edition==='first'?T.first:T.latest,`${choice?p(choice.text):p(T.jobIncomplete)}${k.check?k.check.feedback.map(p).join(''):''}${button('restore-job',T.jobReopen,`data-wls-edition="${edition}"`)}`);
}).join('');}
function jobsPage(v,l){
 const picker=`<div class="wls-job-picker" role="group" aria-label="${esc(T.jobs)}">${v.jobs.map(e=>button('job',e.source?.title??e.id,`data-wls-job="${esc(e.id)}" aria-pressed="${v.current?.id===e.id}"`,['unavailable','unreadable'].includes(e.status))).join('')}</div>${v.jobsPartial?notice(T.partial):''}`;
 const e=v.current;if(!e)return `<h2 id="wls-task" tabindex="-1">${esc(T.jobs)}</h2>${picker}`;
 if(e.status!=='ready'||e.draftStatus!=='ready'||e.helpStatus!=='ready')return picker+notice(T.unavailable);
 const s=e.source,r=e.record;
 return `<section class="wls-job"><h2 id="wls-task" tabindex="-1">${esc(s.title)}</h2>${picker}<div class="wls-paper">${p(s.prompt)}${read('question',T.readPrompt)}${s.steps.length?`<ol>${s.steps.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`:''}<div class="wls-choices">${s.choices.map(c=>button('answer',c.text,`data-wls-choice="${esc(c.id)}" aria-pressed="${r.work.choice===c.id}"`)).join('')}</div>${button('clear-job',T.clear,'',r.work.choice===null)}</div><div class="wls-actions">${button('hint',T.hint)}${button('job-example',T.example)}${button('skip',T.skip)}</div>${r.help.hint?`<p id="wls-hint" class="wls-hint" tabindex="-1">${esc(s.hint)}</p>`:''}${r.help.example?s.teach.map(card=>example(card.title,card.steps,l,'job-'+s.id+'-'+card.id,card.text)).join(''):''}<div class="wls-actions wls-commit">${button('check-job',T.jobCheck,'',e.checksStatus==='unreadable')}${button('keep-job',T.jobKeep,'',e.latestStatus==='unreadable')}</div>${e.last&&!e.earlier?`<aside id="wls-feedback" class="wls-feedback" tabindex="-1" role="status">${e.last.feedback.map(p).join('')}</aside>`:''}${e.partial?notice(T.partial):''}${jobKeeps(e,l)}</section>`;
}
export function wordListShelfPage(state,owner=''){
 const v=C.wordListShelfView(state),l=local(state,owner),source=v.status==='new'?makeWordListShelfSource():v.source;
 const heading=`<header class="wls-heading"><a href="#words">Word Garden</a><h1>${esc(T.title)}</h1></header>`;
 if(v.status==='unsupported')return `<section class="wls-room" data-word-list-shelf-root>${heading}${notice(T.unavailable)}</section>`;
 const body=v.view==='shelf'?shelfPage(v,l):v.view==='jobs'||v.current?jobsPage(v,l):`<section class="wls-arrival"><div>${shelfArt()}</div><h2 id="wls-task" tabindex="-1">${esc(T.shelf)}</h2>${p(sourceText(source?.story?.short))}</section>`;
 const story=source?.story;
 return `<section class="wls-room" data-word-list-shelf-root>${heading}<nav class="wls-ways" aria-label="${esc(T.title)}">${button('shelf',T.shelf,`aria-pressed="${v.view==='shelf'}"`)}${button('jobs',T.jobs,`aria-pressed="${v.view==='jobs'||!!v.current}"`)}</nav><p data-wls-saving></p>${v.view==='shelf'?`<div class="wls-instruction">${p(sourceText(source?.copy?.instruction))}${read('instruction',T.readInstruction,!sourceText(source?.copy?.instruction))}</div>`:''}${body}<p id="wls-status" role="status" tabindex="-1">${esc(l.messageView===v.view?l.message:'')}</p>${l.stamp?`<p class="wls-stamp">${esc(T.stamp)}</p>`:''}${panel(l,'story',T.readStory,`${p(sourceText(story?.short))}${read('story',T.readStory,!sourceText(story?.short))}${p(sourceText(story?.longer))}`)}${v.view==='shelf'?p(sourceText(source?.invitation)):''}${p(T.footer)}<footer><a href="#words">Word Garden</a><a href="#library/spellings">The Stained Map</a><a href="#library/endings">The Endings Shelf</a><a href="#library/copy">Pip's Copy</a><a href="#notes">${esc(T.notes)}</a></footer></section>`;
}
function notesKeeps(e,shelf=false){
 if(!e?.record)return '';
 return ['first','latest'].map(edition=>{
  const k=e.record[edition+'Kept'];if(!Object.hasOwn(e.record,edition+'Kept')||e[edition+'Status']==='missing'||k===null)return '';
  if(e[edition+'Status']!=='ready')return notice(T.unavailable);
  const body=shelf?placementsReadout(e.source,k.placements):p(e.source.choices.find(c=>c.id===k.work.choice)?.text??T.jobIncomplete);
  const result=shelf?(k.check?p(checkSummary(k.check,e.source.copy))+k.check.rows.map(keptFeedback).join(''):''):k.check?.feedback.map(p).join('')??'';
  return `<details><summary>${esc(edition==='first'?T.first:T.latest)}</summary>${body}${result}</details>`;
 }).join('');
}
export function wordListShelfNotes(state){
 if(!Object.hasOwn(state,'wordListShelf'))return '';
 const v=C.wordListShelfView(state),e=v.shelf;
 const shelf=e?.draftStatus==='ready'?`${placementsReadout(e.source,e.record.placements)}${e.last&&!e.earlier?p(checkSummary(e.last,e.source.copy)):''}${e.partial?notice(T.partial):''}<p>Comparison requested: ${e.record.help.includes('contrast')?'yes':'no'}. Example requested: ${e.record.help.includes('example')?'yes':'no'}.</p>${notesKeeps(e,true)}`:e?.status==='missing'?'':p(T.unavailable);
 const jobs=v.jobs.filter(j=>j.stored).map(j=>`<section><h3>${esc(j.source?.title??j.id)}</h3>${j.draftStatus==='ready'?p(j.source.choices.find(c=>c.id===j.record.work.choice)?.text??T.jobIncomplete):p(T.unavailable)}${j.last&&!j.earlier?j.last.feedback.map(p).join(''):''}${j.helpStatus==='ready'?`<p>Hint requested: ${j.record.help.hint?'yes':'no'}. Example requested: ${j.record.help.example?'yes':'no'}.</p>`:''}${j.partial?notice(T.partial):''}${notesKeeps(j)}</section>`).join('');
 return `<details class="panel" data-word-list-shelf-notes><summary>${esc(T.title)}</summary><p>Visible spelling clues and supplied choices are supported word study, not independent spelling or a reading level.</p>${shelf}${jobs}<details><summary>Full retained word-list work</summary><pre>${esc(json(state.wordListShelf))}</pre></details><a href="#library/word-list">${esc(T.title)}</a></details>`;
}
export const wordListShelfEntry=()=>`<a class="secondary" href="#library/word-list">${esc(T.title)}</a>`;
export function wordListShelfSpeech(state,kind,key){
 const v=C.wordListShelfView(state),s=v.status==='new'?makeWordListShelfSource():v.source;
 if(kind==='story')return sourceText(s?.story?.short);
 if(kind==='instruction')return sourceText(s?.copy?.instruction);
 if(kind==='sentence')return sourceText(v.shelf?.source?.words.find(w=>w.id===key)?.sentence);
 if(kind==='question')return sourceText(v.current?.source?.prompt).replace(/_{2,}/g,' blank ');
 return '';
}
export function bindWordListShelf(state,ctx={}){
 const root=document.querySelector('[data-word-list-shelf-root]');if(!root)return;
 const owner=ctx.explorerId?.()??'',l=local(state,owner),owned=state.wordListShelf,material=JSON.stringify(owned),options={canExport:ctx.canExport};
 const live=el=>root.isConnected&&root===document.querySelector('[data-word-list-shelf-root]')&&root.contains(el)&&el.isConnected&&!el.disabled&&!el.closest('[hidden],details:not([open])')&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden'&&location.hash==='#library/word-list'&&(!ctx.notebook||ctx.notebook()===state)&&(ctx.explorerId?.()??'')===owner&&ctx.isActive?.()!==false&&state.wordListShelf===owned&&JSON.stringify(owned)===material&&locals.get(state)===l&&!document.querySelector('dialog.welcome-film[open]');
 const remember=()=>{l.panels=[...l.panels.filter(x=>['contrast','shelf-example'].includes(x)),...[...root.querySelectorAll('[data-wls-panel][open]')].map(e=>e.dataset.wlsPanel)];};
 const redraw=(selector='#wls-task',after)=>{
  remember();after?.();ctx.stopSpeech?.();ctx.render?.();
  const next=document.querySelector('[data-word-list-shelf-root]'),requested=next?.querySelector(selector),fallback=next?.querySelector('[data-wls-picker]')??next?.querySelector('#wls-task');
  (requested&&!requested.disabled&&requested.getClientRects().length?requested:fallback)?.focus();
 };
 const commit=(fn,{message='',focus='#wls-task',after}={})=>{
  const result=fn();
  if(!result.ok){l.message=result.error==='capacity'?T.refused:T.unavailable;l.messageView=C.wordListShelfView(state).view;return redraw('#wls-status');}
  l.root=state.wordListShelf;const saved=result.changed===false?null:ctx.save?.();
  l.message=[message,saved?.enabled===false||saved?.ok===false?saved.message||'':''].filter(Boolean).join(' ');l.messageView=C.wordListShelfView(state).view;
  redraw(message?'#wls-status':focus,after);
 };
 root.querySelector('[data-wls-picker]')?.addEventListener('change',event=>{
  const el=event.currentTarget;if(!live(el))return;
  if(!C.wordListShelfView(state).shelf?.source?.words.some(w=>w.id===el.value))return;
  l.word=el.value;l.stamp=false;redraw('[data-wls-picker]');
 });
 root.querySelectorAll('[data-wls-action]').forEach(el=>el.addEventListener('click',()=>{
  if(!live(el))return;
  const a=el.dataset.wlsAction,v=C.wordListShelfView(state),e=v.shelf,w=currentWord(e,l),job=v.current;
  if(a==='shelf')return commit(()=>C.openWordListShelf(state,options),{after:()=>{if(!l.shelfVisited&&typeof matchMedia==='function'&&matchMedia('(min-width:700px)').matches)l.panels.push('overview');l.shelfVisited=true;l.stamp=false;}});
  if(a==='jobs')return commit(()=>C.openWordListJobs(state,options),{after:()=>{l.stamp=false;}});
  if(a==='job')return commit(()=>C.openWordListJob(state,el.dataset.wlsJob,options),{after:()=>{l.stamp=false;}});
  if(a==='select'){if(!e?.source?.words.some(x=>x.id===el.dataset.wlsWord))return;l.word=el.dataset.wlsWord;l.stamp=false;return redraw('[data-wls-picker]');}
  if(a==='previous'||a==='next'){if(!w)return;const at=e.source.words.indexOf(w);l.word=e.source.words[Math.max(0,Math.min(e.source.words.length-1,at+(a==='next'?1:-1)))].id;l.stamp=false;return redraw('[data-wls-picker]');}
  if(a==='place'||a==='clear')return commit(()=>C.placeWordListCard(state,w?.id,a==='clear'?null:el.dataset.wlsTray,options),{focus:a==='clear'?'[data-wls-picker]':`[data-wls-tray="${el.dataset.wlsTray}"]`,after:()=>{l.stamp=false;}});
  if(a==='check-shelf')return commit(()=>C.checkWordListShelf(state,options),{focus:'#wls-feedback'});
  if(a==='keep-shelf')return commit(()=>C.keepWordListShelf(state,options),{message:T.kept,after:()=>{l.stamp=true;}});
  if(a==='restore-shelf')return commit(()=>C.restoreWordListShelf(state,el.dataset.wlsEdition,options),{after:()=>{l.stamp=false;}});
  if(a==='contrast'||a==='shelf-example'){
   const key=a==='contrast'?'contrast':'shelf-example',opening=!l.panels.includes(key),flag=a==='contrast'?'contrast':'example';
   if(!opening){l.panels=l.panels.filter(x=>x!==key);return redraw();}
   return commit(()=>C.useWordListShelfHelp(state,flag,options),{focus:a==='contrast'?'#wls-contrast':'[data-wls-example="shelf"]',after:()=>{l.panels.push(key);if(flag==='example')l.steps.shelf=1;}});
  }
  if(a==='answer'||a==='clear-job')return commit(()=>C.answerWordListJob(state,job?.id,a==='clear-job'?null:el.dataset.wlsChoice,options),{focus:a==='clear-job'?'[data-wls-action="answer"]':`[data-wls-choice="${el.dataset.wlsChoice}"]`});
  if(a==='hint')return commit(()=>C.useWordListJobHelp(state,job?.id,'hint',options),{focus:'#wls-hint'});
  if(a==='job-example')return commit(()=>C.useWordListJobHelp(state,job?.id,'example',options),{focus:'[data-wls-example]',after:()=>{for(const card of job.source.teach)l.steps['job-'+job.id+'-'+card.id]=1;}});
  if(a==='check-job')return commit(()=>C.checkWordListJob(state,job?.id,options),{focus:'#wls-feedback'});
  if(a==='keep-job')return commit(()=>C.keepWordListJob(state,job?.id,options),{message:T.jobKept});
  if(a==='restore-job')return commit(()=>C.restoreWordListJob(state,job?.id,el.dataset.wlsEdition,options));
  if(a==='skip')return commit(()=>C.skipWordListJob(state,job?.id,options));
  if(a==='step'||a==='step-back'){
   const key=el.dataset.wlsExampleKey,card=key==='shelf'?v.source?.example:job?.source.teach.find(c=>'job-'+job.id+'-'+c.id===key);
   if(!card||!Array.isArray(card.steps))return;
   l.steps[key]=Math.max(0,Math.min(card.steps.length,stepCount(l,key,card.steps.length)+(a==='step'?1:-1)));
   return redraw(`[data-wls-example="${key}"]`);
  }
 }));
 root.querySelectorAll('[data-wls-read]').forEach(el=>el.addEventListener('click',event=>{
  if(!live(el)){event.preventDefault();event.stopImmediatePropagation();return;}
  const e=C.wordListShelfView(state).shelf,utterance=wordListShelfSpeech(state,el.dataset.wlsRead,currentWord(e,l)?.id);
  if(!utterance){event.preventDefault();event.stopImmediatePropagation();return;}
  el.dataset.speak=utterance;
 },{capture:true}));
}
