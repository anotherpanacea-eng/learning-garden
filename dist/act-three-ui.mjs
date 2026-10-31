import {actThreeContent as C} from './act-three-content.mjs';
import {actTwoContent} from './act-two-content.mjs';
import {actThreeChapters,actThreeView,actThreeCandidates,startActThree,offerActThree,sendActThree,revealWaysPage} from './act-three-core.mjs';
import {actTwoView,setActTwoFrameAmount,setActTwoPageAmount} from './act-two-core.mjs';
import {guides} from './companions.mjs';
import {courierPresets,postCourierIdentity} from './post-office-content.mjs';
import {hearButton,stopSpeech} from './play-media.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich=x=>esc(x).replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/¡Pan, cestas, miel!/g,'<span lang="es">¡Pan, cestas, miel!</span>').replace(/\bCarrizo\b/g,'<span lang="es">Carrizo</span>');
const button=(attrs,text,primary=false)=>`<button type="button" class="${primary?'primary':'secondary'}" ${attrs}>${esc(text)}</button>`;
const link=(href,text,primary=false)=>`<a class="${primary?'primary':'secondary'}" href="${esc(href)}">${esc(text)}</a>`;
const heading=text=>`<h1 id="act-three-heading" tabindex="-1">${esc(text)}</h1>`;
const back=()=>link('#almanac/beyond',C.ui.back);
const pageKey=({part,chapter})=>part+':'+(chapter||'');
const hear=()=>hearButton('',C.ui.hear,'en');
let visits=new WeakMap();
export function resetActThreeView(){visits=new WeakMap();}
function visit(state,owner){let v=visits.get(state);if(!v||v.owner!==owner){v={owner,selected:{},notice:''};visits.set(state,v);}return v;}
export function actThreeRoute(hash){
 if(hash==='#almanac/both-ways')return {part:'ending'};
 if(hash==='#almanac/the-ways')return {part:'page'};
 if(hash==='#almanac/beyond')return {part:'hub'};
 if(hash.startsWith('#almanac/beyond/')){const key=hash.slice('#almanac/beyond/'.length);return actThreeChapters.includes(key)?{part:'chapter',chapter:key}:{part:'hub'};}
 return null;
}
function names(state,line){const guide=(guides.find(g=>g.id===state.garden?.guide)||guides[0]).name,courier=courierPresets.some(p=>p.id===state.postOffice?.courier)?`the ${postCourierIdentity(state).title.toLowerCase()}`:'the courier';return line.replaceAll('{guide}',()=>guide).replace(/(^|[.!?]\s+)\{courier\}/g,(_,prefix)=>prefix+courier[0].toUpperCase()+courier.slice(1)).replaceAll('{courier}',()=>courier);}
const reading=(state,lines)=>`<div class="a3-reading" data-act-three-read>${lines.map(line=>`<p>${rich(names(state,line))}</p>`).join('')}</div>`;
function amounts(v,kind){const key=kind==='page'?'pageAmount':'frameAmount',bad=v[key+'Status']==='unreadable';return `<div class="a3-controls" role="group" aria-label="${esc(kind==='page'?C.page.title:C.title)}">${(kind==='page'?['short','longer','original']:['short','longer']).map(k=>button(`data-a3-${kind}-amount="${k}" aria-pressed="${v[key]===k}"${bad?' disabled':''}`,C.ui[k])).join('')}</div>${bad?`<p role="status">${esc(C.messages.badPreference)}</p>`:''}`;}
function candidateLabel(chapter,c){const r=c.ref;return chapter==='market'?C.candidate.market.replace('{tryId}',r.tryId).replace('{amount}',r.amount==='longer'?'a longer note':'short sentences'):chapter==='seeds'?C.candidate.seeds.replace('{visitId}',r.visitId).replace('{edition}',r.edition==='first'?'first kept':'latest kept'):chapter==='route'?C.candidate.route.replace('{title}',()=>c.label):C.candidate.letters.replace('{label}',()=>c.label);}
function icon(chapter){const paths={market:'M5 20h30l-5 9H11ZM20 5v15M20 6l12 10H20Z',seeds:'M20 31V14M20 22C3 23 5 9 7 8c10 0 14 6 13 14ZM20 15c0-9 6-13 13-12 0 9-4 15-13 12Z',route:'M20 5a14 14 0 1 0 0 28 14 14 0 0 0 0-28ZM20 11v9l7 4',letters:'M5 10h30v21H5ZM5 10l15 12 15-12'};return `<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="${paths[chapter]}"/></svg>`;}
function progress(v){const unknown=v.contributionsStatus==='unreadable'||v.endedStatus==='unreadable';return `<div class="a3-next">${v.contributionsStatus==='unreadable'?'':`<p class="a3-count">${esc(C.ui.count.replace('{n}',v.count))}</p>`}${v.ended?link('#almanac/both-ways',C.ui.replay,true):v.canSend?button('data-a3-send',C.ui.send,true):`<p>${esc(unknown?C.messages.unreadableAct:C.ui.beforeSend)}</p>`}</div>`;}
function hub(state,v){
 if(!v.started&&v.startedStatus==='unreadable')return `${heading(C.title)}<p>${esc(C.messages.unreadableAct)}</p>`;
 if(!v.started)return `${heading(C.title)}${amounts(v,'frame')}${reading(state,[C.hook,...C.opening[v.frameAmount]])}${hear()}${v.canStart?button('data-a3-start',C.ui.start,true):`${reading(state,[C.messages.unreached])}${actTwoView(state).letterReady?link('#almanac/upstream-letter',actTwoContent.ui.openLetter,true):''}`}`;
 return `${heading(C.title)}<p class="a3-question">${esc(C.question)}</p>${amounts(v,'frame')}${reading(state,C.opening[v.frameAmount])}${hear()}<p>${esc(C.ui.how)}</p><nav class="a3-river" aria-label="${esc(C.title)}">${actThreeChapters.map(key=>`<a href="#almanac/beyond/${key}" class="a3-stop a3-stop-${key}"${v.chapterStatus[key]==='ready'?' data-offered':''}>${icon(key)}<span>${esc(C.chapters[key].title)}</span>${v.chapterStatus[key]==='ready'?`<small>${esc(C.messages.offered.replace('{kind}',C.kinds[key]))}</small>`:''}</a>`).join('')}</nav>${progress(v)}`;
}
function chapterPage(state,v,key,s){
 const c=C.chapters[key],source=v.sources[key];let offer;
 if(v.chapterStatus[key]==='ready')offer=`<p class="a3-kept">${esc(c.kept)}</p><p>${esc(C.messages.offered.replace('{kind}',C.kinds[key]))}</p>`;
 else if(v.chapterStatus[key]==='unreadable')offer=`<p>${esc(C.messages.badReceipt)}</p>`;
 else if(!v.canOffer)offer=`<p>${esc(C.messages.unreadableAct)}</p>`;
 else if(source.candidates.length){
  if(!Object.hasOwn(s.selected,key))s.selected[key]=source.candidates[0].key;
  const selected=s.selected[key],missing=!source.candidates.some(x=>x.key===selected);
  offer=`<label class="sr-only" for="act-three-candidate">${esc(C.ui.fromWork)}</label><select id="act-three-candidate" aria-describedby="act-three-selection" data-a3-candidate="${key}">${missing?`<option value="" selected disabled>${esc(C.messages.missing)}</option>`:''}${source.candidates.map(x=>`<option value="${esc(x.key)}"${x.key===selected?' selected':''}>${esc(candidateLabel(key,x))}</option>`).join('')}</select><p class="a3-selection" id="act-three-selection">${esc(missing?C.messages.missing:candidateLabel(key,source.candidates.find(x=>x.key===selected)))}</p>${button(`data-a3-offer="${key}"`,c.offer,true)}`;
 }else offer=`<p>${esc(C.messages.noWork.replace('{activity}',C.activities[key]))}</p>`;
 return `${back()}${heading(c.title)}${amounts(v,'frame')}<div class="a3-chapter"><section class="a3-story">${reading(state,c[v.frameAmount])}${hear()}${c.keeperNote?`<details class="a3-note"><summary>Keeper's note</summary>${reading(state,[c.keeperNote])}</details>`:''}</section><section class="a3-work" id="act-three-offer" tabindex="-1"><h2>${esc(C.ui.fromWork)}</h2><p data-act-three-read>${esc(c.intro)}</p>${c.hostHref?link(c.hostHref,c.hostLabel):''}${offer}${source.retainedUnreadable?`<p>${esc(C.messages.unreadableWork)}</p>`:''}</section></div>`;
}
const art=()=>`<figure class="a3-ending-picture"><img src="./act-three-ending.svg" width="840" height="400" alt="${esc(C.ending.alt)}"></figure>`;
function endingPage(state,v){return !v.ended?`${heading(C.ending.title)}<p>${esc(C.messages.unreached)}</p>`:`${heading(C.ending.title)}${art()}${amounts(v,'frame')}${reading(state,[...C.ending[v.frameAmount],...(v.season?[C.ending.seasons[v.season]]:[])])}${hear()}<div class="a3-controls">${v.pageVisible?link('#almanac/the-ways',C.ui.reveal,true):button('data-a3-reveal',C.ui.reveal,true)}</div>`;}
function waysPage(state,v){
 if(!v.pageReady)return `${heading(C.page.title)}<p>${esc(C.messages.unreached)}</p>`;
 if(!v.pageVisible)return `${heading(C.page.title)}${button('data-a3-reveal',C.ui.reveal,true)}`;
 return `${heading(C.page.title)}${reading(state,[C.page.reveal])}${amounts(v,'page')}<article class="a3-page-leaf" data-a3-page-leaf><span class="a3-edge">${esc(C.page.edge)}</span>${v.pageAmount==='original'?`<blockquote data-act-three-read>${rich(C.page.original[0])}</blockquote>`:reading(state,C.page[v.pageAmount])}</article>${reading(state,C.page.after)}${hear()}`;
}
export function actThreeInvitation(state,{blocked=false}={}){const v=actThreeView(state);return v.canStart||v.started?`<aside class="a3-invitation" data-keeper-story${blocked?' hidden':''}><div class="a3-controls">${link('#almanac/beyond',C.ui.start,true)}${v.ended?link('#almanac/both-ways',C.ui.replay):''}${v.pageReady?link('#almanac/the-ways',C.ui.reveal):''}</div></aside>`:'';}
export function actThreeReturn(state,chapter){return actThreeView(state).started&&actThreeChapters.includes(chapter)?`<aside class="a3-return">${link('#almanac/beyond/'+chapter,C.ui.return)}</aside>`:'';}
export function actThreePage(state,{part='hub',chapter=null,owner=null,blocked=false}={}){
 const v=actThreeView(state),s=visit(state,owner),notice=s.noticePage===pageKey({part,chapter})?s.notice:'';let body;
 if(['unavailable','unreadable'].includes(v.status))body=`${heading(C.title)}<p>${esc(C.messages.unreadableAct)}</p>`;
 else if(part==='ending')body=endingPage(state,v);
 else if(part==='page')body=waysPage(state,v);
 else body=part==='chapter'&&actThreeChapters.includes(chapter)&&v.started?chapterPage(state,v,chapter,s):hub(state,v);
 return `<div class="act-three-page" data-act-three-root data-keeper-story lang="en"${blocked?' hidden':''}><p id="act-three-status" class="a3-status" role="status" aria-live="polite" tabindex="-1">${esc(notice)}</p>${body}<footer class="a3-controls">${part!=='hub'?back():''}${link('#almanac/keepers',C.ui.keepers)}${link('#explore',C.ui.explore)}</footer></div>`;
}
export function actThreeNotes(state){
 const v=actThreeView(state);if(v.status==='missing'&&!v.canStart)return '';
 const uncertain=['unavailable','unreadable'].includes(v.status)||!v.ended&&(v.startedStatus==='unreadable'||v.endedStatus==='unreadable'||v.contributionsStatus==='unreadable');
 const status=v.ended?`ended, Page 3 ${v.pageVisible?'read':'not yet read'}`:v.started?`started, ${v.count} of 4 chapters`:'not started';
 const rows=actThreeChapters.filter(key=>v.chapterStatus[key]!=='missing').map(key=>`<li>${esc(C.chapters[key].title)}<p>${esc(v.chapterStatus[key]==='ready'?C.messages.offered.replace('{kind}',C.kinds[key]):C.messages.badReceipt)}</p></li>`).join('');
 return `<details class="panel" data-act-three-notes><summary>${esc(C.title)}</summary><p>${esc(uncertain?C.messages.unreadableAct:C.notes.line.replace('{state}',status))}</p><p>${esc(C.notes.details)}</p>${rows?`<ul>${rows}</ul>`:''}</details>`;
}
export function bindActThree(state,ctx){
 const root=document.querySelector('[data-act-three-root]');if(!root)return;const owner=ctx.explorerId?.(),s=visit(state,owner),record=state.story,route=location.hash;
 const live=el=>root.isConnected&&document.querySelector('[data-act-three-root]')===root&&el.isConnected&&root.contains(el)&&!el.disabled&&!el.closest('[hidden],details:not([open])')&&visits.get(state)===s&&state.story===record&&(!ctx.notebook||ctx.notebook()===state)&&ctx.explorerId?.()===owner&&ctx.isActive?.()!==false&&location.hash===route&&!!actThreeRoute(route)&&!document.querySelector('dialog.welcome-film[open]');
 const focus=selector=>{if(ctx.focus)ctx.focus(selector);else document.querySelector(selector)?.focus();};
 const status=text=>{s.notice=text;s.noticePage=pageKey(actThreeRoute(route));const el=root.querySelector('#act-three-status');el.textContent=text;focus('#act-three-status');};
 const redraw=(destination,target)=>{stopSpeech();const result=ctx.save?.();s.notice=result?.enabled===false||result?.ok===false?result.message||'':'';s.noticePage=pageKey(actThreeRoute(destination||route));const next=s.notice?'#act-three-status':target||'#act-three-heading';
  if(destination&&destination!==location.hash){window.addEventListener('hashchange',()=>{if(ctx.explorerId?.()===owner&&ctx.isActive?.()!==false&&location.hash===destination)focus(next);},{once:true});location.hash=destination;}
  else{ctx.render();focus(next);}
 };
 const commit=(fn,destination=null,target)=>{if(fn()!==true)return status(C.messages.refused);redraw(destination,target);};
 const on=(selector,fn)=>root.querySelectorAll(selector).forEach(el=>el.addEventListener('click',()=>{if(live(el))fn(el);}));
 const options={canExport:ctx.canExport};
 on('[data-a3-start]',()=>{if(!actThreeView(state).canStart)return status(C.messages.unreached);commit(()=>startActThree(state,options));});
 root.querySelectorAll('[data-a3-candidate]').forEach(el=>el.addEventListener('change',()=>{if(!live(el))return;const key=el.dataset.a3Candidate;s.selected[key]=el.value;const candidate=actThreeCandidates(state,key).find(c=>c.key===el.value);root.querySelector('#act-three-selection').textContent=candidate?candidateLabel(key,candidate):C.messages.missing;}));
 on('[data-a3-offer]',el=>{const key=el.dataset.a3Offer,v=actThreeView(state);if(v.chapterStatus[key]==='ready')return status(C.messages.offered.replace('{kind}',C.kinds[key]));if(!v.canOffer||v.chapterStatus[key]==='unreadable')return status(C.messages.badReceipt);
  const selected=root.querySelector('[data-a3-candidate]')?.value;if(!actThreeCandidates(state,key).some(c=>c.key===selected))return status(C.messages.missing);s.selected[key]=selected;commit(()=>offerActThree(state,key,selected,options),null,'#act-three-offer');
 });
 on('[data-a3-send]',()=>{if(!actThreeView(state).canSend)return status(C.ui.beforeSend);commit(()=>sendActThree(state,new Date().getMonth(),options),'#almanac/both-ways');});
 on('[data-a3-reveal]',()=>{if(!actThreeView(state).pageReady)return status(C.messages.unreached);commit(()=>revealWaysPage(state,options),'#almanac/the-ways');});
 for(const [kind,setter] of [['frame',setActTwoFrameAmount],['page',setActTwoPageAmount]])on(`[data-a3-${kind}-amount]`,el=>{const v=actThreeView(state),key=kind==='page'?'pageAmount':'frameAmount';if(v[key+'Status']==='unreadable')return status(C.messages.badPreference);commit(()=>setter(state,el.getAttribute(`data-a3-${kind}-amount`),options),null,`[data-a3-${kind}-amount="${el.getAttribute(`data-a3-${kind}-amount`)}"]`);});
 root.querySelectorAll('[data-speak]').forEach(el=>el.addEventListener('click',e=>{if(!live(el)){e.preventDefault();e.stopImmediatePropagation();return;}el.dataset.speak=[...root.querySelectorAll('[data-act-three-read]')].filter(x=>x.getClientRects().length&&getComputedStyle(x).visibility!=='hidden').map(x=>x.innerText).join(' ').replaceAll('[smudged]','a smudged word');},{capture:true}));
}
