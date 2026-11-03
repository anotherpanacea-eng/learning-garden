import {actFourContent as C} from './act-four-content.mjs';
import {actFourView,actFourCandidates,startActFour,revealHarvestPage,offerActFour} from './act-four-core.mjs';
import {setActTwoFrameAmount,setActTwoPageAmount} from './act-two-core.mjs';
import {guides} from './companions.mjs';
import {hearButton,stopSpeech} from './play-media.mjs';
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
function visit(state,owner){let s=visits.get(state);if(!s||s.owner!==owner){s={owner,selected:null,notice:'',noticePage:''};visits.set(state,s);}return s;}
export function actFourRoute(hash){
 if(hash==='#almanac/fine-harvest')return {part:'page'};
 if(hash==='#almanac/two-stories/account')return {part:'chapter',chapter:'account'};
 if(hash==='#almanac/two-stories'||hash.startsWith('#almanac/two-stories/'))return {part:'hub'};
 return null;
}
function amounts(v,kind){const k=kind==='page'?'pageAmount':'frameAmount',bad=v[k+'Status']==='unreadable';return `<div class="a4-controls" role="group" aria-label="${esc(kind==='page'?C.page.title:C.title)}">${(kind==='page'?['short','longer','original']:['short','longer']).map(x=>button(`data-a4-${kind}-amount="${x}" aria-pressed="${v[k]===x}"${bad?' disabled':''}`,C.ui[x])).join('')}</div>${bad?`<p role="status">${esc(C.messages.badPreference)}</p>`:''}`;}
const status=s=>`<p id="act-four-status" class="a4-status" role="status" aria-live="polite" tabindex="-1">${esc(s)}</p>`;
function hub(state,v){
 if(!v.started)return `${heading(C.title)}<p>${esc(C.messages.unreached)}</p>${v.canStart?button('data-a4-start',C.ui.start,true):''}`;
 return `${heading(C.title)}<p class="a4-question">${esc(C.question)}</p>${amounts(v,'frame')}${reading(state,[C.hook,...C.opening[v.frameAmount]])}<aside class="a4-guess">${reading(state,C.guideGuess)}</aside>${hear()}<nav class="a4-controls" aria-label="${esc(C.title)}">${link('#almanac/two-stories/account',C.chapter.title,true)}</nav><p>${esc(C.ui.later)}</p>${v.pageVisible?link('#almanac/fine-harvest',C.ui.reread):button('data-a4-reveal',C.ui.reveal)}`;
}
function page(state,v){
 if(!v.pageVisible)return `${heading(C.page.title)}<p>${esc(C.messages.unreached)}</p>${v.started?button('data-a4-reveal',C.ui.reveal,true):''}`;
 return `${heading(C.page.title)}${reading(state,[C.page.reveal])}${amounts(v,'page')}<article class="a4-page-leaf" data-a4-page-leaf><span class="a4-edge">${esc(C.page.edge)}</span>${reading(state,C.page[v.pageAmount])}</article>${hear()}<div class="a4-controls">${link('#almanac/two-stories',C.ui.village,true)}</div>`;
}
function chapter(state,v,s){
 const source=v.sources.account;let offer;
 if(v.chapterStatus.account==='ready')offer=`<p class="a4-kept">${esc(C.chapter.kept)}</p><p>${esc(C.messages.offered)}</p><aside class="a4-guess">${reading(state,C.guideChecking)}</aside>`;
 else if(v.chapterStatus.account==='unreadable')offer=`<p>${esc(C.messages.badReceipt)}</p>`;
 else if(!v.canOffer)offer=`<p>${esc(C.messages.unreadableAct)}</p>`;
 else if(source.candidates.length){
  if(s.selected===null)s.selected=source.candidates[0].key;
  const missing=!source.candidates.some(c=>c.key===s.selected);
  offer=`<label for="act-four-candidate">${esc(C.ui.fromWork)}</label><select id="act-four-candidate" data-a4-candidate aria-describedby="act-four-selection">${missing?`<option value="" selected disabled>${esc(C.messages.missing)}</option>`:''}${source.candidates.map(c=>`<option value="${esc(c.key)}"${c.key===s.selected?' selected':''}>${esc(c.label)}</option>`).join('')}</select><p id="act-four-selection" class="a4-selection">${esc(missing?C.messages.missing:source.candidates.find(c=>c.key===s.selected).label)}</p>${button('data-a4-offer',C.chapter.offer,true)}`;
 }else offer=`<p>${esc(C.messages.noWork)}</p>`;
 return `${link('#almanac/two-stories',C.ui.back)}${heading(C.chapter.title)}${amounts(v,'frame')}<div class="a4-chapter"><section>${reading(state,C.chapter[v.frameAmount])}${hear()}<details class="a4-note"><summary>Keeper's note</summary>${reading(state,[C.chapter.keeperNote])}</details></section><section class="a4-work" id="act-four-offer" tabindex="-1"><h2>${esc(C.ui.fromWork)}</h2><p data-act-four-read>${esc(C.chapter.intro)}</p>${link(C.chapter.hostHref,C.chapter.hostLabel)}${offer}${source.retainedUnreadable?`<p>${esc(C.messages.unreadableWork)}</p>`:''}</section></div>`;
}
export function actFourPage(state,{part='hub',owner=null,blocked=false}={}){
 const v=actFourView(state),s=visit(state,owner);let body;
 if(['unavailable','unreadable'].includes(v.status)||!v.started&&v.startedStatus==='unreadable')body=`${heading(C.title)}<p>${esc(C.messages.unreadableAct)}</p>`;
 else if(part==='page')body=page(state,v);
 else body=part==='chapter'&&v.started?chapter(state,v,s):hub(state,v);
 return `<div class="act-four-page" data-act-four-root data-keeper-story lang="en"${blocked?' hidden':''}>${status(s.noticePage===part?s.notice:'')}${body}<footer class="a4-controls">${link('#almanac/keepers',C.ui.keepers)}${link('#explore',C.ui.explore)}</footer></div>`;
}
export function actFourInvitation(state,{blocked=false}={}){
 const v=actFourView(state);if(!v.canStart&&!v.started)return '';
 return `<aside class="a4-invitation" data-act-four-root data-keeper-story lang="en"${blocked?' hidden':''}>${status('')}<div class="a4-controls">${v.started?link('#almanac/two-stories',C.ui.start,true):button('data-a4-start',C.ui.start,true)}${v.pageVisible?link('#almanac/fine-harvest',C.ui.reread):''}${link('#home',C.ui.pause)}</div></aside>`;
}
export function actFourReturn(state){return actFourView(state).started?`<aside class="a4-return">${link('#almanac/two-stories/account',C.ui.return)}</aside>`:'';}
export function actFourNotes(state){
 const v=actFourView(state);if(v.status==='missing'&&!v.canStart)return '';
 const bad=['unavailable','unreadable'].includes(v.status)||v.startedStatus==='unreadable'||v.contributionsStatus==='unreadable',text=!v.started?'not started':`started, Page 4 ${v.pageVisible?'read':'not yet read'}, chapter 1 ${v.chapterStatus.account==='ready'?'has work':'has no work yet'}`;
 return `<details class="panel" data-act-four-notes><summary>${esc(C.title)}</summary><p>${esc(bad?C.messages.unreadableAct:C.notes.line.replace('{state}',text))}</p><p>${esc(C.notes.details)}</p>${v.chapterStatus.account==='unreadable'?`<p>${esc(C.messages.badReceipt)}</p>`:''}</details>`;
}
export function bindActFour(state,ctx){
 const root=document.querySelector('[data-act-four-root]');if(!root)return;
 const owner=ctx.explorerId?.(),s=visit(state,owner),record=state.story,route=location.hash;
 const live=el=>root.isConnected&&el.isConnected&&root.contains(el)&&document.querySelector('[data-act-four-root]')===root&&!el.disabled&&!el.closest('[hidden],details:not([open])')&&visits.get(state)===s&&state.story===record&&(!ctx.notebook||ctx.notebook()===state)&&ctx.explorerId?.()===owner&&ctx.isActive?.()!==false&&location.hash===route&&!document.querySelector('dialog.welcome-film[open]');
 const focus=selector=>ctx.focus?ctx.focus(selector):document.querySelector(selector)?.focus();
 const message=text=>{s.notice=text;s.noticePage=actFourRoute(route)?.part||'invitation';const el=root.querySelector('#act-four-status');el.textContent=text;focus('#act-four-status');};
 const options={canExport:ctx.canExport};
 function commit(fn,destination=null,target='#act-four-heading'){
  if(fn()!==true)return message(C.messages.refused);
  stopSpeech();const saved=ctx.save?.();s.notice=saved?.enabled===false||saved?.ok===false?saved.message||'':'';s.noticePage=actFourRoute(destination||route)?.part||'invitation';
  const next=s.notice?'#act-four-status':target;
  if(destination&&destination!==location.hash){window.addEventListener('hashchange',()=>{if(ctx.explorerId?.()===owner&&ctx.isActive?.()!==false&&location.hash===destination)focus(next);},{once:true});location.hash=destination;}
  else{ctx.render();focus(next);}
 }
 const on=(selector,fn)=>root.querySelectorAll(selector).forEach(el=>el.addEventListener('click',()=>{if(live(el))fn(el);}));
 on('[data-a4-start]',()=>{if(!actFourView(state).canStart)return message(C.messages.unreached);commit(()=>startActFour(state,options),'#almanac/fine-harvest');});
 on('[data-a4-reveal]',()=>{if(!actFourView(state).started)return message(C.messages.unreached);commit(()=>revealHarvestPage(state,options),'#almanac/fine-harvest');});
 root.querySelectorAll('[data-a4-candidate]').forEach(el=>el.addEventListener('change',()=>{if(!live(el))return;s.selected=el.value;const selected=actFourCandidates(state,'account').find(c=>c.key===el.value);root.querySelector('#act-four-selection').textContent=selected?.label||C.messages.missing;}));
 on('[data-a4-offer]',()=>{const v=actFourView(state);if(!v.canOffer||v.chapterStatus.account==='unreadable')return message(C.messages.badReceipt);const key=root.querySelector('[data-a4-candidate]')?.value;if(!actFourCandidates(state,'account').some(c=>c.key===key))return message(C.messages.missing);s.selected=key;commit(()=>offerActFour(state,'account',key,options),null,'#act-four-offer');});
 for(const [kind,setter] of [['frame',setActTwoFrameAmount],['page',setActTwoPageAmount]])on(`[data-a4-${kind}-amount]`,el=>{const value=el.getAttribute(`data-a4-${kind}-amount`);commit(()=>setter(state,value,options),null,`[data-a4-${kind}-amount="${value}"]`);});
 root.querySelectorAll('[data-speak]').forEach(el=>el.addEventListener('click',e=>{if(!live(el)){e.preventDefault();e.stopImmediatePropagation();return;}el.dataset.speak=[...root.querySelectorAll('[data-act-four-read]')].filter(x=>x.getClientRects().length&&getComputedStyle(x).visibility!=='hidden').map(x=>x.innerText).join(' ');},{capture:true}));
}
