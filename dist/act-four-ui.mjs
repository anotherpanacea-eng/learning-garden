import {actFourContent as C} from './act-four-content.mjs';
import {actFourView,actFourCandidates,startActFour,revealHarvestPage,offerActFour,keepActFourPlan,endActFour,actFourMindChange} from './act-four-core.mjs';
import {setActTwoFrameAmount,setActTwoPageAmount} from './act-two-core.mjs';
import {actFiveInvitation} from './act-five-ui.mjs';
import {guides} from './companions.mjs';
import {hearButton,stopSpeech} from './play-media.mjs';
import {cornerScene} from './act-four-corner-art.mjs';
import {meetingScene} from './act-four-meeting-art.mjs';
import {gazetteScene} from './act-four-gazette-art.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich=x=>esc(x).replace(/\*([^*]+)\*/g,'<em>$1</em>');
const button=(attrs,label,primary=false)=>`<button type="button" class="${primary?'primary':'secondary'}" ${attrs}>${esc(label)}</button>`;
const link=(href,label,primary=false)=>`<a class="${primary?'primary':'secondary'}" href="${esc(href)}">${esc(label)}</a>`;
const heading=text=>`<h1 id="act-four-heading" tabindex="-1">${esc(text)}</h1>`;
const named=(state,text)=>text.replaceAll('{guide}',()=> (guides.find(g=>g.id===state.garden?.guide)||guides[0]).name);
const reading=(state,lines)=>`<div class="a4-reading" data-act-four-read>${lines.map(x=>`<p>${rich(named(state,x))}</p>`).join('')}</div>`;
const hear=()=>hearButton('',C.ui.hear,'en');
let visits=new WeakMap();
export function resetActFourView(){visits=new WeakMap();}
function visit(state,owner){let s=visits.get(state);if(!s||s.owner!==owner){s={owner,selected:{account:null,orchard:null,gazette:null},plan:undefined,worry:undefined,notice:'',noticePage:''};visits.set(state,s);}return s;}
// A notice belongs to the page it was raised on; the two chapters are different pages.
const noticeKey=r=>r?(r.part==='chapter'?`chapter:${r.chapter}`:r.part):'invitation';
export function actFourRoute(hash){
 if(hash==='#almanac/fine-harvest')return {part:'page'};
 if(hash==='#almanac/two-stories/account')return {part:'chapter',chapter:'account'};
 if(hash==='#almanac/two-stories/orchard')return {part:'chapter',chapter:'orchard'};
 if(hash==='#almanac/two-stories/gazette')return {part:'chapter',chapter:'gazette'};
 if(hash==='#almanac/two-stories/meeting')return {part:'chapter',chapter:'meeting'};
 if(hash==='#almanac/map-we-changed')return {part:'ending'};
 if(hash==='#almanac/two-stories'||hash.startsWith('#almanac/two-stories/'))return {part:'hub'};
 return null;
}
function amounts(v,kind){const k=kind==='page'?'pageAmount':'frameAmount',bad=v[k+'Status']==='unreadable';return `<div class="a4-controls" role="group" aria-label="${esc(kind==='page'?C.page.title:C.title)}">${(kind==='page'?['short','longer','original']:['short','longer']).map(x=>button(`data-a4-${kind}-amount="${x}" aria-pressed="${v[k]===x}"${bad?' disabled':''}`,C.ui[x])).join('')}</div>${bad?`<p role="status">${esc(C.messages.badPreference)}</p>`:''}`;}
const status=s=>`<p id="act-four-status" class="a4-status" role="status" aria-live="polite" tabindex="-1">${esc(s)}</p>`;
function hub(state,v){
 if(!v.started)return `${heading(C.title)}<p>${esc(C.messages.unreached)}</p>${v.canStart?button('data-a4-start',C.ui.start,true):''}`;
 return `${heading(C.title)}<p class="a4-question">${esc(C.question)}</p>${amounts(v,'frame')}${reading(state,[C.hook,...C.opening[v.frameAmount]])}<aside class="a4-guess">${reading(state,C.guideGuess)}</aside>${hear()}<nav class="a4-controls" aria-label="${esc(C.title)}">${link('#almanac/two-stories/account',C.chapter.title,true)}${link('#almanac/two-stories/orchard',C.orchard.title,true)}${link('#almanac/two-stories/gazette',C.gazette.title,true)}${link('#almanac/two-stories/meeting',C.meeting.title,true)}</nav>${v.ended?link('#almanac/map-we-changed',C.ending.reread,true):v.canEnd?button('data-a4-end',C.meeting.endOffer,true):`<p>${esc(C.meeting.needMore)}</p>`}<p>${esc(C.ui.later)}</p>${v.pageVisible?link('#almanac/fine-harvest',C.ui.reread):button('data-a4-reveal',C.ui.reveal)}`;
}
function page(state,v){
 if(!v.pageVisible)return `${heading(C.page.title)}<p>${esc(C.messages.unreached)}</p>${v.started?button('data-a4-reveal',C.ui.reveal,true):''}`;
 return `${heading(C.page.title)}${reading(state,[C.page.reveal])}${amounts(v,'page')}<article class="a4-page-leaf" data-a4-page-leaf><span class="a4-edge">${esc(C.page.edge)}</span>${reading(state,C.page[v.pageAmount])}</article>${hear()}<div class="a4-controls">${link('#almanac/two-stories',C.ui.village,true)}</div>`;
}
// The three reading chapters; anything else renders chapter 1, as before.
const offerChapter=id=>['orchard','gazette'].includes(id)?id:'account';
const candidateLabel=(id,c)=>!c?C.messages.missing:id==='orchard'?(c.caseLabel?C.orchard.candidate.replace('{case}',c.caseLabel):C.orchard.candidateEarlier):id==='gazette'?(c.packLabel?C.gazette.candidate.replace('{pack}',c.packLabel):C.gazette.candidateEarlier):c.label;
// Per-chapter copy: chapter 1 keeps its spec352 keys; chapter 2 (spec601) has its own block.
const chapterCopy=id=>id==='orchard'||id==='gazette'?C[id]:{...C.chapter,noWork:C.messages.noWork,offered:C.messages.offered,guideChecking:C.guideChecking,unreadableWork:C.messages.unreadableWork};
function chapter(state,v,s,id){
 const T=chapterCopy(id),source=v.sources[id];let offer;
 if(v.chapterStatus[id]==='ready')offer=`<p class="a4-kept">${esc(T.kept)}</p><p>${esc(T.offered)}</p><aside class="a4-guess">${reading(state,T.guideChecking)}</aside>`;
 else if(v.chapterStatus[id]==='unreadable')offer=`<p>${esc(C.messages.badReceipt)}</p>`;
 else if(!v.canOffer)offer=`<p>${esc(C.messages.unreadableAct)}</p>`;
 else if(source.candidates.length){
  const label=c=>candidateLabel(id,c);
  if(s.selected[id]===null)s.selected[id]=source.candidates[0].key;
  const missing=!source.candidates.some(c=>c.key===s.selected[id]);
  offer=`<label for="act-four-candidate">${esc(C.ui.fromWork)}</label><select id="act-four-candidate" data-a4-candidate data-a4-chapter="${id}" aria-describedby="act-four-selection">${missing?`<option value="" selected disabled>${esc(C.messages.missing)}</option>`:''}${source.candidates.map(c=>`<option value="${esc(c.key)}"${c.key===s.selected[id]?' selected':''}>${esc(label(c))}</option>`).join('')}</select><p id="act-four-selection" class="a4-selection">${esc(missing?C.messages.missing:label(source.candidates.find(c=>c.key===s.selected[id])))}</p>${button(`data-a4-offer data-a4-chapter="${id}"`,T.offer,true)}`;
 }else offer=`<p>${esc(T.noWork)}</p>`;
 const scene=id==='orchard'?cornerScene(C.orchard.scene,C.orchard.caption):id==='gazette'?gazetteScene(C.gazette):'';
 return `${link('#almanac/two-stories',C.ui.back)}${heading(T.title)}${amounts(v,'frame')}${scene}<div class="a4-chapter"><section>${reading(state,T[v.frameAmount])}${hear()}<details class="a4-note"><summary>Keeper's note</summary>${reading(state,[T.keeperNote])}</details></section><section class="a4-work" id="act-four-offer" tabindex="-1"><h2>${esc(C.ui.fromWork)}</h2><p data-act-four-read>${esc(T.intro)}</p>${link(T.hostHref,T.hostLabel)}${offer}${source.retainedUnreadable?`<p>${esc(T.unreadableWork)}</p>`:''}</section></div>`;
}
// Spec602 · chapter 4, the meeting board, and the ending.
const planName=id=>C.meeting.plans.find(p=>p.id===id)?.name||'';
const worryText=(plan,code)=>C.meeting.plans.find(p=>p.id===plan)?.worries.find(w=>w.id===code)?.text||C.meeting.earlierWorry;
function meeting(state,v,s){
 const M=C.meeting;
 const board=`<section class="a4-board" aria-labelledby="a4-board-heading"><h2 id="a4-board-heading">${esc(M.boardHeading)}</h2>${M.plans.map(p=>`<details class="a4-plan" data-a4-plan="${p.id}"><summary>${esc(p.name)}</summary><dl data-act-four-read><dt>${esc(M.what)}</dt><dd>${esc(p.what)}</dd><dt>${esc(M.costs)}</dt><dd>${esc(p.costs)}</dd><dt>${esc(M.protects)}</dt><dd>${esc(p.protects)}</dd></dl></details>`).join('')}</section>`;
 let keep;
 if(v.planStatus==='unreadable'||v.worryStatus==='unreadable')keep=`<p>${esc(C.messages.badReceipt)}</p>`;
 else if(v.ended)keep=`${kept(v)}<p>${esc(M.frozen)}</p>`;
 else if(!v.canKeepPlan)keep=`<p>${esc(C.messages.unreadableAct)}</p>`;
 else{
  const chosen=s.plan??v.plan??null,worry=s.worry!==undefined&&s.plan===chosen?s.worry:v.plan===chosen?v.worry:null;
  // A saved worry from another version stays a choice on its own plan, so keeping again unchanged keeps it.
  const earlier=p=>v.plan===p.id&&v.worry&&!p.worries.some(w=>w.id===v.worry)?`<label><input type="radio" name="a4-worry-${p.id}" value="${esc(v.worry)}"${p.id===chosen&&worry===v.worry?' checked':''}>${esc(M.earlierWorry)}</label>`:'';
  keep=`${v.plan?kept(v):''}<form class="a4-keep" data-a4-keep onsubmit="return false"><fieldset data-act-four-read><legend>${esc(M.prompt)}</legend>${M.plans.map(p=>`<label><input type="radio" name="a4-plan" value="${p.id}" data-a4-plan-choice${p.id===chosen?' checked':''}>${esc(p.name)}</label>`).join('')}</fieldset>${M.plans.map(p=>`<fieldset data-a4-worries="${p.id}" data-act-four-read${p.id===chosen?'':' hidden'}><legend>${esc(M.worryPrompt)}</legend><label><input type="radio" name="a4-worry-${p.id}" value=""${p.id!==chosen||worry===null?' checked':''}>${esc(M.noWorry)}</label>${p.worries.map(w=>`<label><input type="radio" name="a4-worry-${p.id}" value="${w.id}"${p.id===chosen&&worry===w.id?' checked':''}>${esc(w.text)}</label>`).join('')}${earlier(p)}</fieldset>`).join('')}${button('data-a4-keep-plan',v.plan?M.change:M.keep,true)}</form>`;
 }
 const end=v.canEnd?button('data-a4-end',M.endOffer,true):v.ended?link('#almanac/map-we-changed',C.ending.reread,true):'';
 return `${link('#almanac/two-stories',C.ui.back)}${heading(M.title)}${amounts(v,'frame')}${meetingScene(M.scene,M.caption)}<section>${reading(state,M[v.frameAmount])}<blockquote class="a4-bramble">${reading(state,[M.bramble])}</blockquote>${hear()}</section>${board}<section class="a4-work" id="act-four-offer" tabindex="-1"><h2>${esc(M.keepHeading)}</h2>${keep}<div class="a4-controls">${end}</div></section>`;
}
function kept(v){const M=C.meeting;return `<div class="a4-kept-plan" data-act-four-read><p class="a4-kept">${esc(v.worry?M.keptWorry:M.kept)}</p><p>${esc(M.yourPlan.replace('{plan}',planName(v.plan)))}</p>${v.worry?`<p>${esc(M.yourWorry.replace('{worry}',worryText(v.plan,v.worry)))}</p>`:''}</div>`;}
function ending(state,v){
 const E=C.ending;
 if(!v.ended)return `${heading(E.title)}<p>${esc(C.messages.unreached)}</p>`;
 // Only a recognized saved guide gets a personal tail; the shared-name fallback gets none (366).
 const who=E.mind[actFourMindChange(v)],g=guides.find(x=>x.id===state.garden?.guide)?.id;
 const almanac=E.almanac.replace('{plan}',planName(v.plan)||C.meeting.earlierPlan);
 return `${heading(E.title)}${meetingScene(E.scene,E.caption,{penciled:true,season:v.season})}${amounts(v,'frame')}<section class="a4-mind" aria-label="${esc(E.mindHeading)}"><h2>${esc(E.mindHeading)}</h2><p data-act-four-read><strong>${esc(who.speaker)}:</strong> “${esc(who.line)}”</p></section><aside class="a4-guess">${reading(state,[...E.guide,...(g?[E.tails[g]]:[])])}</aside>${reading(state,[...E[v.frameAmount],...(v.season?[E.seasons[v.season]]:[]),E.almanac.includes('{plan}')?almanac:E.almanac,E.between])}${hear()}${actFiveInvitation(state)}<div class="a4-controls">${link('#almanac/keepers',C.ui.keepers,true)}${link('#home',E.pause)}</div>`;
}
export function actFourPage(state,{part='hub',chapter:id='account',owner=null,blocked=false}={}){
 const v=actFourView(state),s=visit(state,owner);let body;
 if(['unavailable','unreadable'].includes(v.status)||!v.started&&v.startedStatus==='unreadable')body=`${heading(C.title)}<p>${esc(C.messages.unreadableAct)}</p>`;
 else if(part==='page')body=page(state,v);
 else if(part==='ending')body=ending(state,v);
 else body=part==='chapter'&&v.started?(id==='meeting'?meeting(state,v,s):chapter(state,v,s,offerChapter(id))):hub(state,v);
 return `<div class="act-four-page" data-act-four-root data-keeper-story lang="en"${blocked?' hidden':''}>${status(s.noticePage===noticeKey(part==='chapter'?{part,chapter:id==='meeting'?'meeting':offerChapter(id)}:{part})?s.notice:'')}${body}<footer class="a4-controls">${link('#almanac/keepers',C.ui.keepers)}${link('#explore',C.ui.explore)}</footer></div>`;
}
export function actFourInvitation(state,{blocked=false}={}){
 const v=actFourView(state);if(!v.canStart&&!v.started)return '';
 return `<aside class="a4-invitation" data-act-four-root data-keeper-story lang="en"${blocked?' hidden':''}>${status('')}<div class="a4-controls">${v.started?link('#almanac/two-stories',C.ui.start,true):button('data-a4-start',C.ui.start,true)}${v.pageVisible?link('#almanac/fine-harvest',C.ui.reread):''}${link('#home',C.ui.pause)}</div></aside>`;
}
export function actFourReturn(state,id='account'){return actFourView(state).started?`<aside class="a4-return">${link(`#almanac/two-stories/${offerChapter(id)}`,C.ui.return)}</aside>`:'';}
export function actFourNotes(state){
 const v=actFourView(state);if(v.status==='missing'&&!v.canStart)return '';
 const bad=['unavailable','unreadable'].includes(v.status)||v.startedStatus==='unreadable'||v.contributionsStatus==='unreadable',text=!v.started?'not started':`started, Page 4 ${v.pageVisible?'read':'not yet read'}, chapter 1 ${v.chapterStatus.account==='ready'?'has work':'has no work yet'}, chapter 2 ${v.chapterStatus.orchard==='ready'?'has work':'has no work yet'}, chapter 3 ${v.chapterStatus.gazette==='ready'?'has work':'has no work yet'}, ${v.plan?'a plan kept':'no plan kept yet'}${v.ended?', the meeting has ended':''}`;
 return `<details class="panel" data-act-four-notes><summary>${esc(C.title)}</summary><p>${esc(bad?C.messages.unreadableAct:C.notes.line.replace('{state}',text))}</p><p>${esc(C.notes.details)}</p>${['account','orchard','gazette'].some(c=>v.chapterStatus[c]==='unreadable')?`<p>${esc(C.messages.badReceipt)}</p>`:''}</details>`;
}
export function bindActFour(state,ctx){
 const root=document.querySelector('[data-act-four-root]');if(!root)return;
 const owner=ctx.explorerId?.(),s=visit(state,owner),record=state.story,route=location.hash;
 const live=el=>root.isConnected&&el.isConnected&&root.contains(el)&&document.querySelector('[data-act-four-root]')===root&&!el.disabled&&!el.closest('[hidden],details:not([open])')&&visits.get(state)===s&&state.story===record&&(!ctx.notebook||ctx.notebook()===state)&&ctx.explorerId?.()===owner&&ctx.isActive?.()!==false&&location.hash===route&&!document.querySelector('dialog.welcome-film[open]');
 const focus=selector=>ctx.focus?ctx.focus(selector):document.querySelector(selector)?.focus();
 const message=text=>{s.notice=text;s.noticePage=noticeKey(actFourRoute(route));const el=root.querySelector('#act-four-status');el.textContent=text;focus('#act-four-status');};
 const options={canExport:ctx.canExport};
 function commit(fn,destination=null,target='#act-four-heading'){
  if(fn()!==true)return message(C.messages.refused);
  stopSpeech();const saved=ctx.save?.();s.notice=saved?.enabled===false||saved?.ok===false?saved.message||'':'';s.noticePage=noticeKey(actFourRoute(destination||route));
  const next=s.notice?'#act-four-status':target;
  if(destination&&destination!==location.hash){window.addEventListener('hashchange',()=>{if(ctx.explorerId?.()===owner&&ctx.isActive?.()!==false&&location.hash===destination)focus(next);},{once:true});location.hash=destination;}
  else{ctx.render();focus(next);}
 }
 const on=(selector,fn)=>root.querySelectorAll(selector).forEach(el=>el.addEventListener('click',()=>{if(live(el))fn(el);}));
 on('[data-a4-start]',()=>{if(!actFourView(state).canStart)return message(C.messages.unreached);commit(()=>startActFour(state,options),'#almanac/fine-harvest');});
 on('[data-a4-reveal]',()=>{if(!actFourView(state).started)return message(C.messages.unreached);commit(()=>revealHarvestPage(state,options),'#almanac/fine-harvest');});
 root.querySelectorAll('[data-a4-candidate]').forEach(el=>el.addEventListener('change',()=>{if(!live(el))return;const id=offerChapter(el.dataset.a4Chapter);s.selected[id]=el.value;const selected=actFourCandidates(state,id).find(c=>c.key===el.value);root.querySelector('#act-four-selection').textContent=candidateLabel(id,selected);}));
 on('[data-a4-offer]',el=>{const id=offerChapter(el.dataset.a4Chapter),v=actFourView(state);if(!v.canOffer||v.chapterStatus[id]==='unreadable')return message(C.messages.badReceipt);const key=root.querySelector('[data-a4-candidate]')?.value;if(!actFourCandidates(state,id).some(c=>c.key===key))return message(C.messages.missing);s.selected[id]=key;commit(()=>offerActFour(state,id,key,options),null,'#act-four-offer');});
root.querySelectorAll('[data-a4-plan-choice]').forEach(el=>el.addEventListener('change',()=>{if(!live(el))return;s.plan=el.value;s.worry=null;root.querySelectorAll('[data-a4-worries]').forEach(f=>{f.hidden=f.dataset.a4Worries!==el.value;const none=f.querySelector('input[value=""]');if(none)none.checked=true;});}));
 root.querySelectorAll('[data-a4-worries] input').forEach(el=>el.addEventListener('change',()=>{if(!live(el))return;s.worry=el.value||null;}));
 on('[data-a4-keep-plan]',()=>{const v=actFourView(state);if(!v.canKeepPlan)return message(C.messages.unreadableAct);const plan=root.querySelector('[data-a4-plan-choice]:checked')?.value;if(!plan)return message(C.meeting.prompt);const worry=root.querySelector(`[data-a4-worries="${plan}"] input:checked`)?.value||null;s.plan=undefined;s.worry=undefined;commit(()=>keepActFourPlan(state,plan,worry,options),null,'#act-four-offer');});
 on('[data-a4-end]',()=>{if(!actFourView(state).canEnd)return message(C.meeting.needMore);commit(()=>endActFour(state,new Date().getMonth(),options),'#almanac/map-we-changed');});
 for(const [kind,setter] of [['frame',setActTwoFrameAmount],['page',setActTwoPageAmount]])on(`[data-a4-${kind}-amount]`,el=>{const value=el.getAttribute(`data-a4-${kind}-amount`);commit(()=>setter(state,value,options),null,`[data-a4-${kind}-amount="${value}"]`);});
 root.querySelectorAll('[data-speak]').forEach(el=>el.addEventListener('click',e=>{if(!live(el)){e.preventDefault();e.stopImmediatePropagation();return;}el.dataset.speak=[...root.querySelectorAll('[data-act-four-read]')].filter(x=>x.getClientRects().length&&getComputedStyle(x).visibility!=='hidden'&&!x.closest('details:not([open])')).map(x=>x.innerText).join(' ');},{capture:true}));
}
