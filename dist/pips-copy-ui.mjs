import {actThreeView} from './act-three-core.mjs';
import {pipsSpellingReference,stageSpellingReference} from './message-spelling-core.mjs';
import {makePipsCopySource,pipsCopyCopy as T} from './pips-copy-content.mjs';
import * as C from './pips-copy-core.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=(x,read=false)=>`<p${read?' data-pc-read':''}>${esc(x)}</p>`;
const text=x=>typeof x==='string'?x:'';
const paragraphs=x=>Array.isArray(x)?x.filter(y=>typeof y==='string'):[];
const button=(action,label,attrs='',disabled=false)=>`<button type="button" data-pc-action="${action}" ${attrs}${disabled?' disabled':''}>${esc(label)}</button>`;
const speakButton=(kind,label)=>`<button type="button" data-speak="" data-pc-speak="${kind}" class="secondary">${esc(label)}</button>`;
const chosen=value=>T.chosen.replace('{word}',()=>value);
const placement=(w,id)=>Object.hasOwn(w.placements,id)?w.placements[id]:null;
let views=new WeakMap();
export function resetPipsCopyView(){views=new WeakMap();}
function local(state,owner){let l=views.get(state);if(!l||l.owner!==owner||l.root!==state.pipsCopy){l={owner,root:state.pipsCopy,gap:null,steps:{},panels:[],notice:'',noticePage:null,deck:'postcard',pageThree:{gap:null,steps:{},panels:[],notice:'',noticePage:null}};views.set(state,l);}return l;}
const pageVisible=state=>actThreeView(state).pageVisible;
const selectedDeck=(state,l)=>{if(l.deck==='page-three'&&!pageVisible(state))l.deck='postcard';return l.deck;};
const turn=l=>l.deck==='page-three'?l.pageThree:l;
const view=(state,l)=>C.pipsCopyView(state,l.deck==='page-three'?'page-three':undefined);
const pageKey=v=>v.view==='practice'?'practice/'+(v.current?.id??''):v.view;
const panel=(l,id,title,body)=>`<details data-pc-panel="${esc(id)}"${l.panels.includes(id)?' open':''}><summary>${esc(title)}</summary>${body}</details>`;
const notice=message=>`<aside class="pc-notice">${p(message)}<a href="#notes">${esc(T.notes)}</a></aside>`;
const picked=(g,w)=>g.choices.find(c=>c.id===placement(w,g.id));
function landscape(){return `<svg class="pc-landscape" viewBox="0 0 440 155" aria-hidden="true"><path d="M0 0h440v155H0z" fill="#d9edf1"/><path d="m0 88 84-65 104 75 75-53 177 47v63H0z" fill="#a6c5b4"/><path d="m0 116 97-43 89 55 125-64 129 46v45H0z" fill="#5d8e83"/><path d="M198 87c70 14-16 26 24 40s40 8 60 28" fill="none" stroke="#fffdf5" stroke-width="20"/><path d="M198 87c70 14-16 26 24 40s40 8 60 28" fill="none" stroke="#237e95" stroke-width="12"/><path d="M49 112v-24h28v24m-34-24 20-17 20 17" fill="#fffdf5" stroke="#223d59" stroke-width="3"/><path d="m343 114 7-39 7 39m-26-11 19-26 19 26" fill="#d9edf1" stroke="#223d59" stroke-width="3"/></svg>`;}
function postcardPaper(s,w,selected=null,interactive=false,original=false){return `<div class="pc-paper${s.reference?' pc-library-paper':''}">${s.reference?'<div class="pc-library-edge" aria-hidden="true"></div>':landscape()}<div class="pc-message">${s.segments.map(segment=>{
 if(Object.hasOwn(segment,'text'))return esc(segment.text);
 if(segment.unavailable)return `<span class="pc-unavailable">${esc(text(s.copy.unavailableWord)||T.unavailableWord)}</span>`;
 const slot=s.parts.find(g=>g.id===segment.slotId),choice=picked(slot,w),word=original?slot.original:C.pipsWord(s,slot,choice);
 return interactive?button('select',word+(!choice?' · '+T.unchosen:''),`data-pc-gap="${esc(slot.id)}" aria-pressed="${selected===slot.id}"`):`<span class="pc-kept-word">${esc(word)}</span>`;
 }).join('')}</div></div>`;}
function workReadout(s,w){
 if(s.kind==='choice')return p(s.choices.find(c=>c.id===w.choice)?.text??T.unchosen);
 return `${postcardPaper(s,w)}<dl class="pc-readout">${s.parts.map(g=>`<div><dt>${esc(g.original)}</dt><dd>${esc(chosen(picked(g,w)?.text??T.unchosen))}</dd></div>`).join('')}</dl>`;
}
function results(e){return e.last?`<aside id="pc-feedback" class="pc-feedback" role="status" tabindex="-1">${e.earlier?p(T.unchecked):e.last.feedback.map(x=>p(x)).join('')}</aside>`:'';}
function keeps(e,l){return ['first','latest'].map(edition=>{
 const k=e.record[edition+'Kept'];if(e[edition+'Status']==='missing'||k===null)return '';
 if(e[edition+'Status']!=='ready')return notice(T.unavailableSelection);
 return panel(l,'keep-'+edition,edition==='first'?T.first:T.latest,`${workReadout(e.source,k.work)}${k.check?k.check.feedback.map(x=>p(x)).join(''):p(T.unchecked)}${button('restore',T.reopen,`data-pc-edition="${edition}"`)}`);
 }).join('');}
const stepCount=(l,id,fallback=0)=>Object.hasOwn(l.steps,id)?l.steps[id]:fallback;
function worked(card,l,requested=false,jobId=null){const key=jobId?JSON.stringify([jobId,card.id]):card.id,n=Math.min(stepCount(l,key,requested?1:0),card.steps.length);return `<section data-pc-worked-card="${esc(card.id)}" class="${requested?'pc-worked':'pc-teaching'}" tabindex="-1">${requested?`<h3>${esc(card.title)}</h3>`:''}${p(card.text,true)}${p(card.example,true)}<ol>${card.steps.slice(0,n).map(step=>`<li data-pc-read>${esc(step)}</li>`).join('')}</ol><div class="pc-actions">${button('step-back',T.stepBack,`data-pc-card="${esc(card.id)}"`,n===0)}${button('step',T.step,`data-pc-card="${esc(card.id)}"`,n===card.steps.length)}</div></section>`;}
const teaching=(cards,l,requested=false)=>cards.map(card=>panel(l,'teach-'+card.id,requested?T.example:card.title,worked(card,l,requested))).join('');
const controls=e=>`<div class="pc-actions pc-commit">${button('check',T.check,'',e.checksStatus==='unreadable')}${button('keep',T.keep,'',e.latestStatus==='unreadable')}</div>`;
function postcard(v,l,state){
 const e=v.postcard;if(e?.status==='missing')return arrival(v.source);if(!e||e.status!=='ready'||e.draftStatus!=='ready')return notice(T.unavailableSelection);
 const s=e.source,w=e.record.work,g=s.parts.find(g=>g.id===l.gap)??s.parts[0],choice=picked(g,w);
 const ref=pipsSpellingReference(state,g.id);
 const reference=ref?`<details class="pc-teaching"><summary>Show Pip's example</summary><p>Pip's example, not your answer</p><p><strong>${esc(ref.word)}</strong> · ${esc(ref.label)}</p><p>${esc(ref.clue)}</p>${button('carry','Use this clue in a message')}</details>`:'';
 const context=g.context?`<p class="pc-sentence">${esc(g.context.before)}<strong>${esc(C.pipsWord(s,g,choice))}</strong>${esc(g.context.after)}</p>`:p(T.contextUnavailable);
 return `<section><h2 id="pc-task" tabindex="-1">${esc(T.postcardTitle)}</h2><div class="pc-workspace"><div class="pc-postcard-side"><h3>${esc(T.currentTitle)}</h3>${postcardPaper(s,w,g.id,true)}${panel(l,'original',T.originalTitle,postcardPaper(s,w,null,false,true))}</div><div class="pc-current"><label>${esc(T.picker)}<select data-pc-picker>${s.parts.map(slot=>`<option value="${esc(slot.id)}"${slot.id===g.id?' selected':''}>${esc(slot.label)}</option>`).join('')}</select></label>${context}<aside class="pc-clue">${p(g.clue,true)}</aside>${p(choice?chosen(choice.text):T.unchosen)}<div class="pc-tray" role="group" aria-label="${esc(g.label)}">${g.choices.map(c=>button('place',text(c.label)||c.text,`data-pc-choice="${esc(c.id)}" aria-pressed="${c.id===choice?.id}"`)).join('')}</div><div class="pc-actions">${button('put-back',T.putBack,'',!choice)}${button('previous',T.previous,'',s.parts.indexOf(g)===0)}${button('next',T.next,'',s.parts.indexOf(g)===s.parts.length-1)}</div>${controls(e)}${results(e)}${reference}${teaching(v.cards,l,true)}${v.cardsPartial?notice(T.unavailableSelection):''}</div></div>${s.partial||e.partial?notice(text(s.copy.partial)):''}${keeps(e,l)}<div class="pc-postcard-read">${p(text(s.copy.readIntro)||T.readIntro)}${speakButton('postcard',T.readPostcard)}</div></section>`;
}
function practice(v,l){
 const shelf=`<div class="pc-jobs" role="group" aria-label="${esc(T.practiceTitle)}">${v.jobs.map(j=>button('job',j.source?.title??T.practiceTitle,`data-pc-job="${esc(j.id)}" aria-pressed="${v.current?.id===j.id}"`,['unavailable','unreadable'].includes(j.status))).join('')}</div>${v.jobsPartial?notice(T.unavailableSelection):''}`;
 const e=v.current;if(!e)return `<h2 id="pc-task" tabindex="-1">${esc(T.practiceTitle)}</h2>${shelf}`;
 if(e.status!=='ready'||e.draftStatus!=='ready'||e.helpStatus!=='ready')return shelf+notice(T.unavailableSelection);
 const s=e.source,r=e.record,w=r.work;
 return `<section><h2 id="pc-task" tabindex="-1">${esc(s.title)}</h2>${shelf}${s.parts.length?`<ul>${s.parts.map(part=>`<li data-pc-read>${esc(part.text)}</li>`).join('')}</ul>`:''}${p(s.prompt,true)}${s.steps.length?`<ol>${s.steps.map(step=>`<li data-pc-read>${esc(step)}</li>`).join('')}</ol>`:''}<div class="pc-tray pc-choices">${s.choices.map(c=>button('answer',c.text,`data-pc-choice="${esc(c.id)}" aria-pressed="${w.choice===c.id}"`)).join('')}</div>${button('put-back',T.putBack,'',w.choice===null)}<div class="pc-actions">${button('hint',T.hint)}${button('example',T.example)}${button('skip',T.skip)}</div>${r.help.hint?`<p id="pc-hint" tabindex="-1" data-pc-read>${esc(s.hint)}</p>`:''}${r.help.example?s.teach.map(card=>worked(card,l,true,s.id)).join(''):''}${controls(e)}${results(e)}${keeps(e,l)}${e.partial?notice(T.unavailableSelection):''}</section>`;
}
function arrival(source){return `<section class="pc-arrival"><h2 id="pc-task" tabindex="-1">${esc(T.postcardTitle)}</h2>${landscape()}${p(text(source?.story?.hook),true)}</section>`;}
function pageCopy(v,l){
 const e=v.postcard,c=v.source?.copy;
 if(!c||!e||e.status!=='ready'||e.draftStatus!=='ready')return notice(text(c?.referenceUnavailable)||'This earlier page copy cannot open here. The postcard and other jobs are still open. The earlier material stays in your notes.');
 const s=e.source,w=e.record.work,g=s.parts.find(x=>x.id===l.gap)??s.parts[0],choice=picked(g,w),ref=s.reference;
 const context=g.context?`<p class="pc-sentence">${esc(g.context.before)}<strong>${esc(C.pipsWord(s,g,choice))}</strong>${esc(g.context.after)}</p>`:p(text(c.contextUnavailable));
 return `<section class="pc-page-copy"><h2 id="pc-task" tabindex="-1">${esc(text(c.title))}</h2><label>${esc(T.picker)}<select data-pc-picker>${s.parts.map(slot=>`<option value="${esc(slot.id)}"${slot.id===g.id?' selected':''}>${esc(slot.label)}</option>`).join('')}</select></label>${p(text(c.instruction),true)}<div class="pc-page-compare"><section class="pc-reference" aria-labelledby="pc-reference-title"><h3 id="pc-reference-title">${esc(text(c.referenceTitle))}</h3><p class="pc-source-sentence" data-pc-read>${esc(g.referenceText)}</p>${speakButton('source',text(c.readSource))}</section><section aria-labelledby="pc-context-title"><h3 id="pc-context-title">${esc(text(c.contextTitle))}</h3>${p(text(c.contextNote))}${context}</section></div><aside class="pc-clue">${p(g.clue,true)}</aside><div class="pc-tray" role="group" aria-label="${esc(g.label)}">${g.choices.map(x=>button('place',text(x.label)||x.text,`data-pc-choice="${esc(x.id)}" aria-pressed="${x.id===choice?.id}"`)).join('')}</div><div class="pc-actions">${button('put-back',T.putBack,'',!choice)}${button('previous',T.previous,'',s.parts.indexOf(g)===0)}${button('next',T.next,'',s.parts.indexOf(g)===s.parts.length-1)}</div>${controls(e)}${results(e)}${s.partial||e.partial?notice(text(c.partial)):''}${panel(l,'page-reference',text(c.fullReferenceTitle),`<h3>${esc(text(c.referenceTitle))}</h3>${p(text(c.caption).replace('{title}',()=>ref.title))}${paragraphs(ref.paragraphs).map(x=>p(x,true)).join('')}`)}${panel(l,'page-version',text(c.fullCopyTitle),`<h3>${esc(text(c.currentTitle))}</h3>${postcardPaper(s,w)}`)}${panel(l,'page-original',text(c.originalTitle),postcardPaper(s,w,null,false,true))}${teaching(v.cards,l,true)}${keeps(e,l)}${panel(l,'new-use',text(c.newUseTitle),p(text(c.newUsePrompt),true)+p(text(c.newUseContrast),true)+p(text(c.returnPrompt),true))}<div class="pc-postcard-read">${p(text(c.readIntro))}${speakButton('postcard',text(c.readCopy))}</div></section>`;
}
export const pipsCopyEntry=()=>`<a class="secondary" href="#library/copy">${esc(T.title)}</a>`;
export function pipsCopyPage(state,owner=''){
 const outer=local(state,owner),deck=selectedDeck(state,outer),l=turn(outer),v=view(state,outer),isPage=deck==='page-three',source=v.status==='new'&&!isPage?makePipsCopySource():v.source;
 const header=`<header class="pc-heading"><a href="#words">${esc(T.wordGarden)}</a><h1>${esc(T.title)}</h1></header>`;
 // A future child is local to its deck; legacy controls stay available below.
 const legacy=C.pipsCopyView(state);if(legacy.status==='unsupported')return `<section class="pc-room" data-pips-copy-root>${header}${notice(T.unsupported)}</section>`;
 const story=source?.story,copy=source?.copy;
 const body=isPage?pageCopy(v,l):v.view==='postcard'?postcard(v,l,state):v.view==='practice'?practice(v,l):arrival(source);
 const storyBody=story?`${paragraphs(story.short).map(x=>p(x,true)).join('')}${paragraphs(story.longer).map(x=>p(x,true)).join('')}`:notice(T.unavailableSelection);
 return `<section class="pc-room${isPage?' pc-page-deck':''}" data-pips-copy-root>${header}<nav class="pc-ways" aria-label="${esc(T.title)}">${C.pipsViews.map(k=>button('table',k==='postcard'?T.postcardTitle:T.practiceTitle,`data-pc-table="${k}" aria-pressed="${!isPage&&v.view===k}"`)).join('')}${pageVisible(state)?button('page-table','Copy the third page',`aria-pressed="${isPage}"`):''}</nav><p data-pc-saving class="pc-saving"></p>${body}<p id="pc-status" role="status" tabindex="-1">${esc(l.noticePage===pageKey(v)?l.notice:'')}</p>${speakButton('prompt',T.readPrompt)}${!isPage&&v.view==='choose'?teaching(v.status==='new'?C.pipsCards(source):v.cards,l)+(v.cardsPartial?notice(T.unavailableSelection):''):''}${!isPage&&v.view!=='practice'?p(T.teachingNote):''}${panel(l,'story',isPage?text(copy?.storyTitle):T.story,storyBody)}${panel(l,'grownups',T.grownups,p(isPage?text(copy?.adultLine):T.adultLine)+p(isPage?text(copy?.adultDetails):T.adultDetails)+(isPage?p(text(copy?.adultNote)):''))}<footer><a href="#words">${esc(T.wordGarden)}</a><a href="#library/spellings">${esc(T.stainedMap)}</a><a href="#library/endings">${esc(T.endingsShelf)}</a><a href="#notes">${esc(T.notes)}</a></footer></section>`;
}
function pageCopyNotes(state){
 const parent=state.pipsCopy;if(!parent||typeof parent!=='object'||!Object.hasOwn(parent,'pageThree'))return '';
 if(!pageVisible(state))return p('Earlier page-copy work is retained in the full notes download.');
 const v=C.pipsCopyView(state,'page-three'),e=v.postcard,c=v.source?.copy;
 if(v.status!=='ready'||!e||e.status!=='ready'||e.draftStatus!=='ready')return p('This earlier page copy cannot open here. The postcard and other jobs are still open. The earlier material stays in your notes.');
 return `<section data-pc-page-notes><h3>${esc(text(c?.title))}</h3>${p(text(c?.adultLine))}${workReadout(e.source,e.record.work)}${e.last&&!e.earlier?e.last.feedback.map(x=>p(x)).join(''):p(T.unchecked)}</section>`;
}
export function pipsCopyNotes(state){
 if(!Object.hasOwn(state,'pipsCopy'))return '';const v=C.pipsCopyView(state),entries=[{label:T.postcardTitle,...v.postcard},...v.jobs.map(j=>({label:j.source?.title??T.practiceTitle,...j}))];
 return `<details class="panel" data-pips-copy-notes><summary>${esc(T.title)}: supplied spelling work</summary>${p(T.adultLine)}${p(T.adultDetails)}${v.status!=='ready'?p(T.unsupported):entries.filter(e=>e.record!==null||e.status==='unreadable').map(e=>`<section><h3>${esc(e.label)}</h3>${e.draftStatus==='ready'?workReadout(e.source,e.record.work):p(T.unavailableSelection)}${e.last&&!e.earlier?e.last.feedback.map(x=>p(x)).join(''):p(T.unchecked)}${e.helpStatus==='ready'?p(`Hint requested: ${e.record.help.hint?'yes':'no'}. Example requested: ${e.record.help.example?'yes':'no'}.`):''}${['first','latest'].map(k=>e[k+'Status']==='ready'&&e.record[k+'Kept']?p((k==='first'?T.first:T.latest)+': '+(e.record[k+'Kept'].check?.outcome??T.unchecked)):'').join('')}</section>`).join('')}${pageCopyNotes(state)}<details><summary>Full retained pips work</summary><pre>${esc(JSON.stringify(state.pipsCopy,null,2))}</pre></details><a href="#library/copy">${esc(T.title)}</a></details>`;
}
export function bindPipsCopy(state,ctx={}){
 const root=document.querySelector('[data-pips-copy-root]');if(!root)return;
 const owner=ctx.explorerId?.()??'',outer=local(state,owner),deck=selectedDeck(state,outer),l=turn(outer),owned=state.pipsCopy,material=JSON.stringify(owned),legacyOptions={canExport:ctx.canExport},options=deck==='page-three'?{...legacyOptions,deck}:legacyOptions;
 const live=el=>root.isConnected&&root===document.querySelector('[data-pips-copy-root]')&&root.contains(el)&&el.isConnected&&!el.disabled&&!el.closest('[hidden],details:not([open])')&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden'&&location.hash==='#library/copy'&&(!ctx.notebook||ctx.notebook()===state)&&(ctx.explorerId?.()??'')===owner&&ctx.isActive?.()!==false&&state.pipsCopy===owned&&JSON.stringify(owned)===material&&views.get(state)===outer&&outer.deck===deck&&(deck!=='page-three'||pageVisible(state))&&!document.querySelector('dialog.welcome-film[open]');
 const remember=()=>{l.panels=[...root.querySelectorAll('[data-pc-panel][open]')].map(e=>e.dataset.pcPanel);};
 const redraw=(selector='#pc-task')=>{remember();ctx.stopSpeech?.();ctx.render?.();const next=document.querySelector('[data-pips-copy-root]'),requested=next?.querySelector(selector),fallback=next?.querySelector('.pc-worked')??next?.querySelector('[data-pc-picker]')??next?.querySelector('#pc-task');(requested&&!requested.disabled&&requested.getClientRects().length?requested:fallback)?.focus();};
 const commit=(fn,message='',selector='#pc-task',accepted=null)=>{const result=fn();if(!result.ok){l.notice=result.error==='capacity'?T.refused:T.unavailableSelection;l.noticePage=pageKey(view(state,outer));return redraw('#pc-status');}outer.root=state.pipsCopy;accepted?.();const target=turn(outer);const saved=result.changed===false?null:ctx.save?.();target.notice=[message,saved?.enabled===false||saved?.ok===false?saved.message||'':''].filter(Boolean).join(' ');target.noticePage=pageKey(view(state,outer));redraw(message?'#pc-status':selector);};
 root.querySelectorAll('[data-pc-picker]').forEach(el=>el.addEventListener('change',()=>{if(!live(el))return;const v=view(state,outer);if(!(v.postcard?.source?.parts??[]).some(x=>x.id===el.value))return;l.gap=el.value;redraw('[data-pc-picker]');}));
 root.querySelectorAll('[data-pc-action]').forEach(el=>el.addEventListener('click',()=>{
  if(!live(el))return;const action=el.dataset.pcAction,v=view(state,outer),job=v.view==='practice',e=job?v.current:v.postcard,s=e?.source,g=s?.kind==='postcard'?(s.parts.find(g=>g.id===l.gap)??s.parts[0]):null;
  if(action==='carry'){if(deck==='page-three')return;const ref=pipsSpellingReference(state,g?.id);if(ref&&stageSpellingReference(state,owner,ref)){ctx.stopSpeech?.();location.hash='#post/messages/carry';}return;}
  if(action==='table'){return commit(()=>C.openPipsTable(state,el.dataset.pcTable,legacyOptions),'','#pc-task',()=>{outer.deck='postcard';});}
  if(action==='page-table'){if(!pageVisible(state))return;return commit(()=>C.openPipsTable(state,'postcard',{...legacyOptions,deck:'page-three'}),'','#pc-task',()=>{outer.deck='page-three';});}
  if(action==='job'){return commit(()=>C.openPipsJob(state,el.dataset.pcJob,options));}
  if(action==='select'){if(!s?.parts.some(g=>g.id===el.dataset.pcGap))return;l.gap=el.dataset.pcGap;return redraw('[data-pc-picker]');}
  if(action==='previous'||action==='next'){if(!g)return;l.gap=s.parts[Math.max(0,Math.min(s.parts.length-1,s.parts.indexOf(g)+(action==='next'?1:-1)))].id;return redraw('[data-pc-picker]');}
  if(action==='place'||action==='answer'||action==='put-back'){const choice=action==='put-back'?null:el.dataset.pcChoice;return commit(()=>job?C.answerPipsJob(state,s.id,choice,options):C.placePipsWord(state,g.id,choice,options),'',action==='put-back'?(job?'[data-pc-action="answer"]':'[data-pc-picker]'):`[data-pc-action="${action}"][data-pc-choice="${choice}"]`);}
  if(action==='check')return commit(()=>job?C.checkPipsJob(state,s.id,options):C.checkPipsPostcard(state,options),'','#pc-feedback');
  if(action==='keep')return commit(()=>job?C.keepPipsJob(state,s.id,options):C.keepPipsPostcard(state,options),T.kept);
  if(action==='restore')return commit(()=>job?C.restorePipsJob(state,s.id,el.dataset.pcEdition,options):C.restorePipsPostcard(state,el.dataset.pcEdition,options),T.reopened);
  if(action==='hint'||action==='example')return commit(()=>C.usePipsHelp(state,s.id,action,options),'',action==='hint'?'#pc-hint':'.pc-worked');
  if(action==='skip'){const at=v.jobs.findIndex(j=>j.id===s.id),next=[...v.jobs.slice(at+1),...v.jobs.slice(0,at+1)].find(j=>['ready','missing'].includes(j.status)&&j.draftStatus!=='unreadable'&&j.helpStatus!=='unreadable');if(next)return commit(()=>C.openPipsJob(state,next.id,options));return;}
  if(action==='step'||action==='step-back'){const cards=job?s?.teach:v.status==='new'?C.pipsCards(makePipsCopySource()):v.cards,card=cards?.find(c=>c.id===el.dataset.pcCard);if(!card)return;const requested=job?e.record.help.example:v.view==='postcard',key=job&&requested?JSON.stringify([s.id,card.id]):card.id;l.steps[key]=Math.max(0,Math.min(card.steps.length,stepCount(l,key,requested?1:0)+(action==='step'?1:-1)));const available=action==='step'?l.steps[key]<card.steps.length:l.steps[key]>0;return redraw(available?`[data-pc-action="${action}"][data-pc-card="${card.id}"]`:`[data-pc-worked-card="${card.id}"]`);}
 }));
 root.querySelectorAll('[data-pc-speak]').forEach(el=>el.addEventListener('click',event=>{
  if(!live(el)){event.preventDefault();event.stopImmediatePropagation();return;}
  const v=view(state,outer);
  if(el.dataset.pcSpeak==='source'){const source=v.postcard?.source,g=source?.parts.find(x=>x.id===l.gap)??source?.parts[0];if(deck!=='page-three'||!g?.referenceText){event.preventDefault();event.stopImmediatePropagation();return;}el.dataset.speak=g.referenceText;}
  else if(el.dataset.pcSpeak==='postcard'){const s=v.postcard?.source;if(!s){event.preventDefault();event.stopImmediatePropagation();return;}el.dataset.speak=(text(s.copy.readIntro)||T.readIntro)+' '+s.segments.map(segment=>Object.hasOwn(segment,'text')?segment.text:segment.slotId?'blank':'').join('');}
  else el.dataset.speak=[...root.querySelectorAll('[data-pc-read]')].filter(e=>!e.closest('details:not([open])')&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').map(e=>e.innerText.replace(/_{2,}/g,' blank ')).join(' ');
 },{capture:true}));
}
