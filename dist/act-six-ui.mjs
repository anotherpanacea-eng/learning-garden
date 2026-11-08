// Spec 606 · Act VI opening: Nuria's letter, the exchange (chapter 1, with a sorting game) and the three Ways (chapter 2,
// with a which-Way puzzle and keeping the exchange plan). The games are play for this visit only; only the plan is saved.
import {actSixContent as C} from './act-six-content.mjs';
import {actSixChapters,actSixView,startActSix,keepExchangePlan} from './act-six-core.mjs';
import {waysMap} from './act-six-art.mjs';
import {setActTwoFrameAmount} from './act-two-core.mjs';
import {guides} from './companions.mjs';
import {courierPresets,postCourierIdentity} from './post-office-content.mjs';
import {hearButton,stopSpeech} from './play-media.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich=x=>esc(x).replace(/\*([^*]+)\*/g,'<em>$1</em>');
const button=(attrs,label,primary=false)=>`<button type="button" class="${primary?'primary':'secondary'}" ${attrs}>${esc(label)}</button>`;
const link=(href,label,primary=false)=>`<a class="${primary?'primary':'secondary'}" href="${esc(href)}">${esc(label)}</a>`;
const heading=text=>`<h1 id="act-six-heading" tabindex="-1">${esc(text)}</h1>`;
// The guide and courier names, as Act III resolves them; an unrecognized saved choice gets the plain role name.
function named(state,line){
 const guide=(guides.find(g=>g.id===state.garden?.guide)||guides[0]).name,courier=courierPresets.some(p=>p.id===state.postOffice?.courier)?`the ${postCourierIdentity(state).title.toLowerCase()}`:'the courier';
 return line.replaceAll('{guide}',()=>guide).replace(/(^|[.!?]\s+)\{courier\}/g,(_,prefix)=>prefix+courier[0].toUpperCase()+courier.slice(1)).replaceAll('{courier}',()=>courier);
}
const reading=(state,lines)=>`<div class="a6-reading" data-act-six-read>${lines.map(x=>`<p>${rich(named(state,x))}</p>`).join('')}</div>`;
const hear=()=>hearButton('',C.ui.hear,'en');
// This visit's play: the sorting piles and the chosen Way. Never saved; a new explorer or a reset starts fresh.
const fresh=owner=>({owner,sort:{},checked:false,way:null,notice:'',route:null,mapShown:false});
let visit=fresh(undefined);
export function resetActSixView(){visit=fresh(undefined);}
const play=owner=>{if(visit.owner!==owner)visit=fresh(owner);return visit;};

export function actSixRoute(hash){
 if(hash==='#almanac/opening-ways'||hash.startsWith('#almanac/opening-ways/')){const id=hash.split('/')[2];return actSixChapters.includes(id)?{part:'chapter',chapter:id}:{part:'hub'};}
 return null;
}
function amounts(v){const bad=v.frameAmountStatus==='unreadable';return `<div class="a6-controls" role="group" aria-label="${esc(C.title)}">${['short','longer'].map(x=>button(`data-a6-frame-amount="${x}" aria-pressed="${v.frameAmount===x}"${bad?' disabled':''}`,C.ui[x])).join('')}</div>${bad?`<p role="status">${esc(C.messages.badPreference)}</p>`:''}`;}
const status=text=>`<p id="act-six-status" class="a6-status" role="status" aria-live="polite" tabindex="-1">${esc(text)}</p>`;
const jobs=(state,list,extra='')=>`<section aria-labelledby="a6-jobs-title"><h2 id="a6-jobs-title">${esc(C.ui.jobsTitle)}</h2><p>${esc(C.ui.jobsIntro)}</p><ul class="a6-jobs">${extra}${list.map(j=>`<li><span class="a6-tier">${esc(j.tier)}</span>${j.href?`<a href="${esc(j.href)}">${esc(j.host)}</a>`:`<span data-a6-off-screen>${esc(C.ui.offScreen)}</span>`}${reading(state,[j.line])}</li>`).join('')}</ul></section>`;
const note=text=>`<details class="a6-note"><summary>Keeper's note</summary><p data-act-six-read>${esc(text)}</p></details>`;
function hub(state,v){
 if(!v.started)return `${heading(C.title)}<p>${esc(C.messages.unreached)}</p>${v.canStart?button('data-a6-start',C.ui.start,true):''}`;
 return `${heading(C.title)}<p class="a6-question">${esc(C.question)}</p>${amounts(v)}<section class="a6-letter" aria-labelledby="a6-letter-title"><h2 id="a6-letter-title">${esc(C.letter.title)}</h2>${reading(state,C.letter[v.frameAmount])}</section>${reading(state,[C.hook,...C.opening[v.frameAmount]])}${hear()}<nav aria-label="${esc(C.ui.chapters)}" class="a6-controls">${link('#almanac/opening-ways/exchange',C.exchange.title,true)}${link('#almanac/opening-ways/routes',C.routes.title,true)}</nav>${v.plan?`<p class="a6-kept">${esc(v.plan==='small'?C.routes.keep.yoursSmall:C.routes.keep.yours)}</p>`:''}`;
}
function exchange(state,v,p){
 const X=C.exchange,S=X.sort,solved=p.checked&&S.items.every(i=>p.sort[i.id]===i.way);
 const goods=S.items.map(i=>{const wrong=p.checked&&p.sort[i.id]!==i.way;return `<div class="a6-good" data-a6-good="${i.id}" role="group" aria-labelledby="a6-good-${i.id}"><strong id="a6-good-${i.id}">${esc(i.label)}</strong>${['up','down'].map(w=>button(`data-a6-sort="${i.id}:${w}" aria-pressed="${p.sort[i.id]===w}"`,S[w],p.sort[i.id]===w)).join('')}${wrong?`<p class="a6-hint" data-act-six-read>${esc(i.hint)}</p>`:''}</div>`;}).join('');
 const result=solved?`<p class="a6-kept" data-act-six-read>${esc(S.kept)}</p>`:p.checked?`<p data-act-six-read>${esc(S.notYet)}</p>`:'';
 return `${link('#almanac/opening-ways',C.ui.back)}${heading(X.title)}${amounts(v)}${reading(state,X[v.frameAmount])}${hear()}${note(X.keeperNote)}<section class="a6-sort" id="a6-sort" tabindex="-1" aria-labelledby="a6-sort-title"><h2 id="a6-sort-title">${esc(S.title)}</h2><p class="a6-tier">Sprout</p>${reading(state,[S.prompt])}${goods}${button('data-a6-sort-check',C.ui.check,true)}<div id="a6-sort-result" tabindex="-1">${result}</div></section>${jobs(state,X.jobs)}`;
}
function routes(state,v,p){
 const R=C.routes,K=R.keep,way=R.ways.find(w=>w.id===p.way);
 const result=way?`<p class="${way.feedback?'':'a6-kept'}" data-act-six-read>${esc(way.feedback||R.puzzle.kept)}</p>`:'';
 const kept=v.planStatus==='unreadable'?`<p data-a6-plan-unreadable>${esc(C.messages.unreadablePlan)}</p>`:v.plan?`<p class="a6-kept" data-act-six-read>${esc(v.plan==='small'?K.yoursSmall:K.yours)}</p>${v.plan==='small'?reading(state,[K.smaller]):''}${reading(state,[K.kept])}`:`${v.earlierPlan?`<p>${esc(C.messages.earlierPlan)}</p>`:''}${p.notice==='later'?reading(state,[K.later]):''}`;
 const keepButtons=v.canKeepPlan?`<div class="a6-controls">${button('data-a6-plan="full"',K.choices.keep,v.plan!=='full')}${button('data-a6-plan="small"',K.choices.smaller)}${v.plan?'':button('data-a6-plan="later"',K.choices.later)}</div>`:'';
 return `${link('#almanac/opening-ways',C.ui.back)}${heading(R.title)}${amounts(v)}${waysMap(R.scene,R.caption,{chosen:p.way,settled:p.mapShown})}${reading(state,R[v.frameAmount])}${hear()}${note(R.keeperNote)}<section class="a6-ways" id="a6-ways" tabindex="-1" aria-labelledby="a6-ways-title"><h2 id="a6-ways-title">${esc(R.puzzle.title)}</h2><p class="a6-tier">Sprout</p>${reading(state,[R.puzzle.prompt])}<ul>${R.ways.map(w=>`<li><button type="button" class="${p.way===w.id?'primary':'secondary'}" data-a6-way-choice="${w.id}" aria-pressed="${p.way===w.id}"><strong>${esc(w.label)}</strong><span>${esc(w.about)}</span></button></li>`).join('')}</ul><div id="a6-way-result" tabindex="-1">${result}</div></section>${jobs(state,R.jobs)}<section class="a6-keep" id="a6-keep" tabindex="-1" aria-labelledby="a6-keep-title"><h2 id="a6-keep-title">${esc(K.title)}</h2><p>${esc(K.prompt)}</p>${keepButtons}<div id="a6-keep-result" tabindex="-1">${kept}</div></section>`;
}
export function actSixPage(state,{part='hub',chapter:id=null,owner=null,blocked=false}={}){
 const v=actSixView(state),p=play(owner);let body;
 if(['unavailable','unreadable'].includes(v.status)||!v.started&&v.startedStatus==='unreadable')body=`${heading(C.title)}<p>${esc(C.messages.unreadableAct)}</p>`;
 else if(part==='chapter'&&v.started&&id==='exchange')body=exchange(state,v,p);
 else if(part==='chapter'&&v.started&&id==='routes')body=routes(state,v,p);
 else body=hub(state,v);
 const here=typeof location==='undefined'?null:location.hash;
 return `<div class="act-six-page" data-act-six-root data-keeper-story lang="en"${blocked?' hidden':''}>${status(p.route===here?p.notice==='later'?'':p.notice:'')}${body}<footer class="a6-controls">${link('#almanac/keepers',C.ui.keepers)}${link('#explore',C.ui.explore)}</footer></div>`;
}
// Continue the story: under the Act V ending and on the Keeper's Pages, once a project is bound.
export function actSixInvitation(state,{blocked=false}={}){
 const v=actSixView(state);if(!v.canStart&&!v.started)return '';
 return `<aside class="a6-invitation" data-act-six-root data-keeper-story lang="en"${blocked?' hidden':''}>${status('')}<div class="a6-controls">${v.started?link('#almanac/opening-ways',C.ui.start,true):button('data-a6-start',C.ui.start,true)}</div></aside>`;
}
export function actSixNotes(state){
 const v=actSixView(state);if(v.status==='missing'&&!v.canStart)return '';
 const bad=['unavailable','unreadable'].includes(v.status)||v.startedStatus==='unreadable';
 const text=!v.started?'not started':`started, ${v.planStatus==='unreadable'?'an exchange plan this version cannot read':v.plan==='full'?'an exchange plan kept':v.plan==='small'?'a smaller exchange plan kept':v.earlierPlan?'an exchange plan from an earlier version':'no exchange plan kept yet'}`;
 return `<details class="panel" data-act-six-notes><summary>${esc(C.title)}</summary><p>${esc(bad?C.messages.unreadableAct:C.notes.line.replace('{state}',text))}</p><p>${esc(C.notes.details)}</p></details>`;
}
export function bindActSix(state,ctx){
 const root=document.querySelector('[data-act-six-root]');if(!root)return;
 const owner=ctx.explorerId?.(),record=state.story,route=location.hash,p=play(owner);
 const live=el=>root.isConnected&&el.isConnected&&root.contains(el)&&!el.disabled&&state.story===record&&(!ctx.notebook||ctx.notebook()===state)&&ctx.explorerId?.()===owner&&ctx.isActive?.()!==false&&location.hash===route&&!document.querySelector('dialog.welcome-film[open]');
 const focus=selector=>ctx.focus?ctx.focus(selector):document.querySelector(selector)?.focus();
 const options={canExport:ctx.canExport};
 function commit(fn,destination=null,target='#act-six-heading'){
  if(fn()!==true){p.notice=C.messages.refused;p.route=route;const el=root.querySelector('#act-six-status');if(el)el.textContent=C.messages.refused;return focus('#act-six-status');}
  stopSpeech();const saved=ctx.save?.(),text=saved?.enabled===false||saved?.ok===false?saved.message||'':'';p.notice=text;p.route=destination||route;
  const next=text?'#act-six-status':target;
  if(destination&&destination!==location.hash){window.addEventListener('hashchange',()=>{if(ctx.explorerId?.()===owner&&location.hash===destination)focus(next);},{once:true});location.hash=destination;}
  else{ctx.render();focus(next);}
 }
 // Play for this visit only: re-render and keep focus where the explorer is.
 const replay=target=>{stopSpeech();ctx.render();focus(target);};
 const on=(selector,fn)=>root.querySelectorAll(selector).forEach(el=>el.addEventListener('click',e=>{if(!live(el)){e.stopImmediatePropagation();return;}fn(el);}));
 // Read-aloud speaks the visible prose only, captured when Hear is pressed, as in Acts IV and V.
 root.querySelectorAll('[data-speak]').forEach(el=>el.addEventListener('click',e=>{if(!live(el)){e.preventDefault();e.stopImmediatePropagation();return;}el.dataset.speak=[...root.querySelectorAll('[data-act-six-read]')].filter(x=>x.getClientRects().length&&getComputedStyle(x).visibility!=='hidden'&&!x.closest('details:not([open])')).map(x=>x.innerText).join(' ');},{capture:true}));
 // The map animates when the chapter is entered; later renders in this visit show it settled.
 if(root.querySelector('[data-a6-map]'))p.mapShown=true;
 on('[data-a6-start]',()=>commit(()=>startActSix(state,options),'#almanac/opening-ways'));
 on('[data-a6-sort]',el=>{const [good,way]=el.getAttribute('data-a6-sort').split(':');p.sort[good]=way;p.checked=false;replay(`[data-a6-sort="${good}:${way}"]`);});
 on('[data-a6-sort-check]',()=>{p.checked=true;replay('#a6-sort-result');});
 on('[data-a6-way-choice]',el=>{p.way=el.getAttribute('data-a6-way-choice');replay('#a6-way-result');});
 on('[data-a6-plan]',el=>{const plan=el.getAttribute('data-a6-plan');if(plan==='later'){p.notice='later';p.route=route;return replay('#a6-keep-result');}p.notice='';commit(()=>keepExchangePlan(state,plan,options),null,'#a6-keep-result');});
 on('[data-a6-frame-amount]',el=>{const value=el.getAttribute('data-a6-frame-amount');commit(()=>setActTwoFrameAmount(state,value,options),null,`[data-a6-frame-amount="${value}"]`);});
}
