import {makeEndingsShelfSource,endingsShelfCopy as T} from './endings-shelf-content.mjs';
import * as C from './endings-shelf-core.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=(x,read=false)=>`<p${read?' data-es-read':''}>${esc(x)}</p>`;
const text=x=>typeof x==='string'?x:'';
const paragraphs=x=>Array.isArray(x)?x.filter(y=>typeof y==='string'):[];
const button=(action,label,attrs='',disabled=false)=>`<button type="button" data-es-action="${action}" ${attrs}${disabled?' disabled':''}>${esc(label)}</button>`;
const speakButton=(kind,label)=>`<button type="button" data-speak="" data-es-speak="${kind}" class="secondary">${esc(label)}</button>`;
const chosen=value=>T.chosen.replace('{ending}',()=>value);
const placement=(w,id)=>Object.hasOwn(w.placements,id)?w.placements[id]:null;
let views=new WeakMap();
export function resetEndingsShelfView(){views=new WeakMap();}
function local(state,owner){let l=views.get(state);if(!l||l.owner!==owner||l.root!==state.endingsShelf){l={owner,root:state.endingsShelf,gap:null,pair:null,sides:{},steps:{},panels:[],longer:false,inspect:null,notice:'',noticePage:null};views.set(state,l);}return l;}
const pageKey=v=>v.view==='practice'?'practice/'+(v.current?.id??''):v.view;
const panel=(l,id,title,body)=>`<details data-es-panel="${esc(id)}"${l.panels.includes(id)?' open':''}><summary>${esc(title)}</summary>${body}</details>`;
const notice=message=>`<aside class="es-notice">${p(message)}<a href="#notes">${esc(T.notes)}</a></aside>`;
const picked=(g,w)=>g.choices.find(c=>c.id===placement(w,g.id));
function envelope(){return `<svg class="es-envelope" viewBox="0 0 440 145" aria-hidden="true"><path d="M20 12h400v122H20z" fill="#e6eaf0" stroke="#57718c" stroke-width="3"/><path d="m20 12 200 83L420 12M20 134l142-74m258 74L278 60" fill="none" stroke="#8c9db1" stroke-width="2"/><path d="M198 88q22-13 44 0v31q-22 11-44 0z" fill="#b6a7c7"/><path d="m211 99 9 10 10-10" fill="none" stroke="#263b52" stroke-width="3"/></svg>`;}
function letterPaper(s,w,selected=null,interactive=false){return `<div class="es-paper"><div class="es-letter">${s.segments.map(segment=>{
 if(Object.hasOwn(segment,'text'))return esc(segment.text);
 if(segment.unavailable)return `<span class="es-unavailable">${esc(text(s.copy.unavailableWord))}</span>`;
 const gap=s.parts.find(g=>g.id===segment.gapId),ending=picked(gap,w),word=C.endingsWord(s,gap,ending);
 return interactive?button('select',word,`data-es-gap="${esc(gap.id)}" aria-pressed="${selected===gap.id}"`):`<span class="es-kept-word">${esc(word)}</span>`;
 }).join('')}</div></div>`;}
function workReadout(s,w){
 if(s.kind==='choice')return p(s.choices.find(c=>c.id===w.choice)?.text??T.unselected);
 return `${letterPaper(s,w)}<dl class="es-readout">${s.parts.map(g=>`<div><dt>${esc(C.endingsWord(s,g,null))}</dt><dd>${esc(chosen(picked(g,w)?.text??T.unselected))}</dd></div>`).join('')}</dl>`;
}
function results(e){return e.last?`<aside id="es-feedback" class="es-feedback" tabindex="-1">${e.earlier?p(T.earlier):''}${e.last.feedback.map(x=>p(x)).join('')}</aside>`:'';}
function keeps(e,l){return ['first','latest'].map(edition=>{
 const k=e.record[edition+'Kept'];if(e[edition+'Status']==='missing'||k===null)return '';
 if(e[edition+'Status']!=='ready')return notice(T.unsupportedRecord);
 return panel(l,'keep-'+edition,edition==='first'?T.firstKept:T.latestKept,`${button('inspect',T.inspectSnapshot,`data-es-edition="${edition}"`)}${l.inspect===edition?`${workReadout(e.source,k.work)}${k.check?k.check.feedback.map(x=>p(x)).join(''):p(T.unchecked)}`:''}${button('restore',T.restoreSnapshot,`data-es-edition="${edition}"`)}`);
 }).join('');}
const stepCount=(l,id,fallback=0)=>Object.hasOwn(l.steps,id)?l.steps[id]:fallback;
function worked(card,l,requested=false,jobId=null){const key=jobId?JSON.stringify([jobId,card.id]):card.id,n=Math.min(stepCount(l,key,requested?1:0),card.steps.length);return `<section class="${requested?'es-worked':'es-teaching'}" tabindex="-1">${requested?`<h3>${esc(card.title)}</h3>`:''}${p(card.text,true)}${p(card.example,true)}<ol>${card.steps.slice(0,n).map(step=>`<li data-es-read>${esc(step)}</li>`).join('')}</ol><div class="es-actions">${button('step-back',T.previous,`data-es-card="${esc(card.id)}"`,n===0)}${button('step',T.nextStep,`data-es-card="${esc(card.id)}"`,n===card.steps.length)}</div></section>`;}
const teaching=(cards,l)=>cards.map(card=>panel(l,'teach-'+card.id,card.title,worked(card,l))).join('');
const controls=e=>`<div class="es-actions es-commit">${button('check',T.check,'',e.checksStatus==='unreadable')}${button('keep',T.keep,'',e.latestStatus==='unreadable')}</div>`;
function letter(v,l){
 const e=v.letter;if(!e||e.status!=='ready'||e.draftStatus!=='ready')return notice(T.unsupportedRecord);
 const s=e.source,w=e.record.work,g=s.parts.find(g=>g.id===l.gap)??s.parts[0],choice=picked(g,w);
 return `<section><h2 id="es-task" tabindex="-1">${esc(T.letterTitle)}</h2>${p(text(s.copy.instruction),true)}<div class="es-workspace"><div class="es-letter-side">${letterPaper(s,w,g.id,true)}${envelope()}</div><div class="es-current"><label>${esc(T.picker)}<select data-es-picker>${s.parts.map(gap=>`<option value="${esc(gap.id)}"${gap.id===g.id?' selected':''}>${esc(C.endingsWord(s,gap,null))}</option>`).join('')}</select></label><div class="es-word">${esc(C.endingsWord(s,g,choice))}</div><aside class="es-clue"><strong>${esc(T.clue)}</strong>${p(g.note,true)}</aside>${p(chosen(choice?.text??T.unselected))}<div class="es-tray" role="group" aria-label="${esc(T.letterTitle)}">${g.choices.map(c=>button('place',c.text,`data-es-choice="${esc(c.id)}" aria-pressed="${c.id===choice?.id}"`)).join('')}</div><div class="es-actions">${button('put-back',T.putBack,'',!choice)}${button('previous',T.previous,'',s.parts.indexOf(g)===0)}${button('next',T.next,'',s.parts.indexOf(g)===s.parts.length-1)}</div></div></div><div class="es-placements">${s.parts.map(gap=>button('select',C.endingsWord(s,gap,picked(gap,w))+' — '+chosen(picked(gap,w)?.text??T.unselected),`data-es-gap="${esc(gap.id)}" aria-pressed="${gap.id===g.id}"`)).join('')}</div>${s.partial||e.partial?notice(text(s.copy.partial)):''}${controls(e)}${results(e)}${keeps(e,l)}<div class="es-letter-read">${p(text(s.copy.letterReadIntro))}${speakButton('letter',T.letterRead)}</div></section>`;
}
function pairs(v,l){
 const pair=v.pairs.find(p=>p.id===l.pair)??v.pairs[0];if(!pair)return notice(T.unavailableSelection);
 const flipped=Object.hasOwn(l.sides,pair.id)&&l.sides[pair.id];
 return `<section><h2 id="es-task" tabindex="-1">${esc(T.pairsTitle)}</h2><label>${esc(T.pairPicker)}<select data-es-pair-picker>${v.pairs.map(x=>`<option value="${esc(x.id)}"${x.id===pair.id?' selected':''}>${esc(x.front)}</option>`).join('')}</select></label><div class="es-pair-table"><button class="es-pair-card" type="button" data-es-action="turn" aria-label="${esc((flipped?T.turnBack:T.turn)+': '+(flipped?pair.back:pair.front))}"><span>${esc(flipped?pair.back:pair.front)}</span><span class="es-fold" aria-hidden="true"></span></button>${flipped?p(pair.spoken,true):''}<div class="es-actions">${button('turn',flipped?T.turnBack:T.turn)}${button('pair-previous',T.previous,'',v.pairs.indexOf(pair)===0)}${button('pair-next',T.next,'',v.pairs.indexOf(pair)===v.pairs.length-1)}</div></div>${v.pairsPartial?notice(T.unavailableSelection):''}${pair.id==='visible'?panel(l,'visible-fact',T.fact,p(text(v.source?.copy?.visibleNote))):''}</section>`;
}
function practice(v,l){
 const shelf=`<div class="es-jobs" role="group" aria-label="${esc(T.practiceTitle)}">${v.jobs.map(j=>button('job',j.source?.title??T.practiceTitle,`data-es-job="${esc(j.id)}" aria-pressed="${v.current?.id===j.id}"`,['unavailable','unreadable'].includes(j.status))).join('')}</div>${v.jobsPartial?notice(T.unavailableSelection):''}`;
 const e=v.current;if(!e)return `<h2 id="es-task" tabindex="-1">${esc(T.practiceTitle)}</h2>${shelf}`;
 if(e.status!=='ready'||e.draftStatus!=='ready'||e.helpStatus!=='ready')return shelf+notice(T.unsupportedRecord);
 const s=e.source,r=e.record,w=r.work;
 return `<section><h2 id="es-task" tabindex="-1">${esc(s.title)}</h2>${shelf}${s.parts.length?`<ul>${s.parts.map(part=>`<li data-es-read>${esc(part.text)}</li>`).join('')}</ul>`:''}${p(s.prompt,true)}${s.steps.length?`<ol>${s.steps.map(step=>`<li data-es-read>${esc(step)}</li>`).join('')}</ol>`:''}<div class="es-tray es-choices">${s.choices.map(c=>button('answer',c.text,`data-es-choice="${esc(c.id)}" aria-pressed="${w.choice===c.id}"`)).join('')}</div>${button('put-back',T.putBack,'',w.choice===null)}<div class="es-actions">${button('hint',T.hint)}${button('example',T.example)}${button('skip',T.skip)}</div>${r.help.hint?`<p id="es-hint" tabindex="-1" data-es-read>${esc(s.hint)}</p>`:''}${r.help.example?s.teach.map(card=>worked(card,l,true,s.id)).join(''):''}${controls(e)}${results(e)}${keeps(e,l)}${e.partial?notice(T.unavailableSelection):''}</section>`;
}
export const endingsShelfEntry=()=>`<a class="secondary" href="#library/endings">${esc(T.title)}</a>`;
export function endingsShelfPage(state,owner=''){
 const v=C.endingsShelfView(state),l=local(state,owner),source=v.status==='new'?makeEndingsShelfSource():v.source;
 const header=`<header class="es-heading"><a href="#words">${esc(T.wordGarden)}</a><h1>${esc(T.title)}</h1></header>`;
 if(v.status==='unsupported')return `<section class="es-room" data-endings-shelf-root>${header}${notice(T.unsupported)}</section>`;
 const story=source?.story,body=v.view==='letter'?letter(v,l):v.view==='pairs'?pairs(v,l):v.view==='practice'?practice(v,l):`<section class="es-arrival"><h2 id="es-task" tabindex="-1">${esc(T.title)}</h2>${envelope()}${p(text(story?.hook),true)}</section>`;
 const storyBody=story?`${p(T.fiction)}<div class="es-actions">${button('short','Short',`aria-pressed="${!l.longer}"`)}${button('longer','Longer',`aria-pressed="${l.longer}"`)}</div>${paragraphs(story[l.longer?'longer':'short']).map(x=>p(x,true)).join('')}`:notice(T.unavailableSelection);
 return `<section class="es-room" data-endings-shelf-root>${header}<nav class="es-ways" aria-label="${esc(T.title)}">${C.endingsViews.map(view=>button('table',T[view==='letter'?'letterTitle':view==='pairs'?'pairsTitle':'practiceTitle'],`data-es-table="${view}" aria-pressed="${v.view===view}"`)).join('')}</nav>${p(text(source?.copy?.reminder),true)}<p data-es-saving class="es-saving"></p>${body}<p id="es-status" role="status" tabindex="-1">${esc(l.noticePage===pageKey(v)?l.notice:'')}</p>${speakButton('prompt',T.wordRead)}${v.view!=='practice'?teaching(v.status==='new'?C.endingsCards(source):v.cards,l)+(v.cardsPartial?notice(T.unavailableSelection):''):''}${panel(l,'story',T.fiction,storyBody)}${panel(l,'grownups','For grown-ups',p(T.adultLine)+p(T.adultDetails))}<footer><a href="#library/spellings">The Stained Map</a><a href="#notes">${esc(T.notes)}</a></footer></section>`;
}
export function endingsShelfNotes(state){
 if(!Object.hasOwn(state,'endingsShelf'))return '';const v=C.endingsShelfView(state),entries=[{label:T.letterTitle,...v.letter},...v.jobs.map(j=>({label:j.source?.title??T.practiceTitle,...j}))];
 return `<details class="panel" data-endings-shelf-notes><summary>${esc(T.title)}: supplied spelling work</summary>${p(T.adultLine)}${p(T.adultDetails)}${v.status!=='ready'?p(T.unsupported):entries.filter(e=>e.record).map(e=>`<section><h3>${esc(e.label)}</h3>${e.draftStatus==='ready'?workReadout(e.source,e.record.work):p(T.unsupportedRecord)}${e.last?e.last.feedback.map(x=>p(x)).join(''):p(T.unchecked)}${e.helpStatus==='ready'?p(`Hint requested: ${e.record.help.hint?'yes':'no'}. Example requested: ${e.record.help.example?'yes':'no'}.`):''}${['first','latest'].map(k=>e[k+'Status']==='ready'&&e.record[k+'Kept']?p(k==='first'?T.firstKept:T.latestKept):'').join('')}</section>`).join('')}<details><summary>Full retained endings work</summary><pre>${esc(JSON.stringify(state.endingsShelf,null,2))}</pre></details><a href="#library/endings">${esc(T.title)}</a></details>`;
}
export function bindEndingsShelf(state,ctx={}){
 const root=document.querySelector('[data-endings-shelf-root]');if(!root)return;
 const owner=ctx.explorerId?.()??'',l=local(state,owner),owned=state.endingsShelf,material=JSON.stringify(owned),options={canExport:ctx.canExport};
 const live=el=>root.isConnected&&root===document.querySelector('[data-endings-shelf-root]')&&root.contains(el)&&el.isConnected&&!el.disabled&&!el.closest('[hidden],details:not([open])')&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden'&&location.hash==='#library/endings'&&(!ctx.notebook||ctx.notebook()===state)&&(ctx.explorerId?.()??'')===owner&&ctx.isActive?.()!==false&&state.endingsShelf===owned&&JSON.stringify(owned)===material&&views.get(state)===l&&!document.querySelector('dialog.welcome-film[open]');
 const remember=()=>{l.panels=[...root.querySelectorAll('[data-es-panel][open]')].map(e=>e.dataset.esPanel);};
 const redraw=(selector='#es-task')=>{remember();ctx.stopSpeech?.();ctx.render?.();const next=document.querySelector('[data-endings-shelf-root]'),requested=next?.querySelector(selector),fallback=next?.querySelector('.es-worked')??next?.querySelector('[data-es-picker]')??next?.querySelector('#es-task');(requested&&!requested.disabled&&requested.getClientRects().length?requested:fallback)?.focus();};
 const commit=(fn,message='',selector='#es-task')=>{const result=fn();if(!result.ok){l.notice=result.error==='capacity'?T.refused:T.unavailableSelection;l.noticePage=pageKey(C.endingsShelfView(state));return redraw('#es-status');}l.root=state.endingsShelf;const saved=result.changed===false?null:ctx.save?.();l.notice=[message,saved?.enabled===false||saved?.ok===false?saved.message||'':''].filter(Boolean).join(' ');l.noticePage=pageKey(C.endingsShelfView(state));redraw(message?'#es-status':selector);};
 root.querySelectorAll('[data-es-picker],[data-es-pair-picker]').forEach(el=>el.addEventListener('change',()=>{if(!live(el))return;const v=C.endingsShelfView(state),pair=el.hasAttribute('data-es-pair-picker');if(!(pair?v.pairs:v.letter?.source?.parts??[]).some(x=>x.id===el.value))return;l[pair?'pair':'gap']=el.value;redraw(pair?'[data-es-pair-picker]':'[data-es-picker]');}));
 root.querySelectorAll('[data-es-action]').forEach(el=>el.addEventListener('click',()=>{
  if(!live(el))return;const action=el.dataset.esAction,v=C.endingsShelfView(state),job=v.view==='practice',e=job?v.current:v.letter,s=e?.source,g=s?.kind==='letter'?(s.parts.find(g=>g.id===l.gap)??s.parts[0]):null;
  if(action==='table'){l.inspect=null;return commit(()=>C.openEndingsTable(state,el.dataset.esTable,options));}
  if(action==='job'){l.inspect=null;return commit(()=>C.openEndingsJob(state,el.dataset.esJob,options));}
  if(action==='select'){if(!s?.parts.some(g=>g.id===el.dataset.esGap))return;l.gap=el.dataset.esGap;return redraw('[data-es-picker]');}
  if(action==='previous'||action==='next'){if(!g)return;l.gap=s.parts[Math.max(0,Math.min(s.parts.length-1,s.parts.indexOf(g)+(action==='next'?1:-1)))].id;return redraw('[data-es-picker]');}
  if(action==='place'||action==='answer'||action==='put-back'){const choice=action==='put-back'?null:el.dataset.esChoice;return commit(()=>job?C.answerEndingsJob(state,s.id,choice,options):C.placeEndingsWord(state,g.id,choice,options),'',action==='put-back'?(job?'[data-es-action="answer"]':'[data-es-picker]'):`[data-es-action="${action}"][data-es-choice="${choice}"]`);}
  if(action==='check')return commit(()=>job?C.checkEndingsJob(state,s.id,options):C.checkEndingsLetter(state,options),'','#es-feedback');
  if(action==='keep')return commit(()=>job?C.keepEndingsJob(state,s.id,options):C.keepEndingsLetter(state,options),T.kept);
  if(action==='restore')return commit(()=>job?C.restoreEndingsJob(state,s.id,el.dataset.esEdition,options):C.restoreEndingsLetter(state,el.dataset.esEdition,options),T.copied);
  if(action==='inspect'){l.inspect=el.dataset.esEdition;return redraw(`[data-es-panel="keep-${l.inspect}"] summary`);}
  if(action==='hint'||action==='example')return commit(()=>C.useEndingsHelp(state,s.id,action,options),'',action==='hint'?'#es-hint':'.es-worked');
  if(action==='skip'){const at=v.jobs.findIndex(j=>j.id===s.id),next=[...v.jobs.slice(at+1),...v.jobs.slice(0,at+1)].find(j=>['ready','missing'].includes(j.status)&&j.draftStatus!=='unreadable'&&j.helpStatus!=='unreadable');if(next)return commit(()=>C.openEndingsJob(state,next.id,options));return;}
  if(action==='turn'){const pair=v.pairs.find(p=>p.id===l.pair)??v.pairs[0];if(!pair)return;l.sides[pair.id]=!(Object.hasOwn(l.sides,pair.id)&&l.sides[pair.id]);return redraw('.es-pair-card');}
  if(action==='pair-next'||action==='pair-previous'){const pair=v.pairs.find(p=>p.id===l.pair)??v.pairs[0];if(!pair)return;l.pair=v.pairs[Math.max(0,Math.min(v.pairs.length-1,v.pairs.indexOf(pair)+(action==='pair-next'?1:-1)))].id;return redraw('[data-es-pair-picker]');}
  if(action==='short'||action==='longer'){l.longer=action==='longer';return redraw(`[data-es-action="${action}"]`);}
  if(action==='step'||action==='step-back'){const cards=job?s?.teach:v.status==='new'?C.endingsCards(makeEndingsShelfSource()):v.cards,card=cards?.find(c=>c.id===el.dataset.esCard);if(!card)return;const key=job&&e.record.help.example?JSON.stringify([s.id,card.id]):card.id;l.steps[key]=Math.max(0,Math.min(card.steps.length,stepCount(l,key,job&&e.record.help.example?1:0)+(action==='step'?1:-1)));const available=action==='step'?l.steps[key]<card.steps.length:l.steps[key]>0;return redraw(job&&e.record.help.example?`[data-es-action="${action}"][data-es-card="${card.id}"]:not(:disabled)`:available?`[data-es-panel="teach-${card.id}"] [data-es-action="${action}"]`:`[data-es-panel="teach-${card.id}"] .es-teaching`);}
 }));
 root.querySelectorAll('[data-es-speak]').forEach(el=>el.addEventListener('click',event=>{
  if(!live(el)){event.preventDefault();event.stopImmediatePropagation();return;}
  const v=C.endingsShelfView(state);
  if(el.dataset.esSpeak==='letter'){const s=v.letter?.source;if(!s){event.preventDefault();event.stopImmediatePropagation();return;}el.dataset.speak=text(s.copy.letterReadIntro)+' '+s.segments.map(segment=>Object.hasOwn(segment,'text')?segment.text:segment.gapId?text(s.copy.spokenGap):'').join('');}
  else el.dataset.speak=[...root.querySelectorAll('[data-es-read]')].filter(e=>!e.closest('details:not([open])')&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').map(e=>e.innerText).join(' ');
 },{capture:true}));
}
