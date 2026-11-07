import {riddleSizes,ownRiddle} from './riddles-content.mjs';
import {riddleState,riddleView,openRiddle,chooseSize,nextRiddle,replaceRawRiddle,pickChoice,askClue,showAnswer,riddleSummary,commitRiddles} from './riddles-core.mjs';
import {dot} from './broad-art.mjs';
import {hearButton} from './play-media.mjs';
import {createMagpiePictures} from './magpie-pictures-core.mjs';
import {magpiePicturesPage,bindMagpiePictures} from './magpie-pictures-ui.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const intro='The storm blew the library’s riddle cards into the hedge. Dot is pulling them out one at a time. Read a riddle, then pick the answer you think fits.';
const header=`<div class="page-heading"><a class="back" href="#home"><span aria-hidden="true">←</span> Back to the garden</a><h1>Riddles in the Hedge</h1><p>${esc(intro)}</p>${hearButton(intro,'Hear how to play')}</div>`;
function sizePicker(r){
 return `<fieldset class="riddle-sizes"><legend>Which riddle cards?</legend><div class="riddle-size-grid">${riddleSizes.map(s=>`<button type="button" class="riddle-size ${r.size===s.id?'selected':''}" data-riddle-size="${s.id}" aria-pressed="${r.size===s.id}">${esc(s.label)}</button>`).join('')}</div><p class="tiny">Every riddle is open. Change this any time. The card you have out stays as it is.</p></fieldset>`;
}
function riddleCard(open){
 const {current:c,card,choices}=open,done=c.outcome!==null,answer=choices.find(ch=>ch.code===card.answer),last=c.picks.at(-1),missed=last&&last!==card.answer?choices.find(ch=>ch.code===last):null;
 const spoken=`${card.prompt} Is it ${choices.map(ch=>ch.text).join(', or ')}?`;
 const status=c.outcome==='solved'?`<div class="riddle-result" role="status">${dot('cheer')}<div><h3 id="riddle-result-title" tabindex="-1">Yes! ${esc(answer.text)}.</h3><p>${esc(card.why)}</p>${hearButton(`${answer.text}. ${card.why}`,'Hear why it fits')}</div></div>`
  :c.outcome==='shown'?`<div class="riddle-result" role="status">${dot('point')}<div><h3 id="riddle-result-title" tabindex="-1">Here is the answer: ${esc(answer.text)}.</h3><p>${esc(card.why)}</p>${hearButton(`${answer.text}. ${card.why}`,'Hear why it fits')}</div></div>`
  :missed?`<div class="riddle-nudge" role="status">${dot('puzzled')}<div><p id="riddle-nudge" tabindex="-1">${esc(missed.nudge)} Try another answer.</p>${hearButton(missed.nudge,'Hear Dot’s thought')}</div></div>`:'';
 const place=card.place;
 return `<section class="riddle-card" aria-labelledby="riddle-prompt"><p class="riddle-kicker">A riddle card</p><h2 id="riddle-prompt" tabindex="-1">${esc(card.prompt)}</h2>${hearButton(spoken,'Hear the riddle and answers')}
 <div class="riddle-choices" role="group" aria-label="Choose an answer">${choices.map(ch=>{const tried=c.picks.includes(ch.code),fits=ch.code===card.answer;return `<button type="button" class="riddle-choice ${tried?'tried':''} ${done&&fits?'fits':''}" data-riddle-choice="${ch.code}" ${done||tried?'disabled':''}>${esc(ch.text)}${tried&&!fits?'<span class="riddle-tag"> (not this one)</span>':''}</button>`;}).join('')}</div>
 ${status}
 ${done?'':`<div class="riddle-help">${c.clue?`<div class="riddle-clue" tabindex="-1"><strong>Dot’s clue</strong><p>${esc(card.clue)}</p>${hearButton(card.clue,'Hear the clue')}</div>`:'<button type="button" class="secondary" data-riddle-clue>Ask Dot for a clue</button>'}<button type="button" class="text-button" data-riddle-show>Show the answer</button><button type="button" class="secondary" data-riddle-put-back>Put this card back</button></div>`}
 ${done?`<div class="riddle-after"><button type="button" class="primary" data-riddle-next>Pull out another riddle</button>${place?`<a class="secondary" href="${place.href}">${esc(place.label)}</a>`:''}${card.strand==='spanish'?'<a class="secondary" href="#mercado">The River Market (Spanish)</a>':''}</div>`:''}
 </section>`;
}
const freshVisit=(state=null,owner=null)=>({state,owner,work:null,active:false,frame:null,fold:false,restoreFold:null,focusEntry:false});
let visit=freshVisit(),generation=0;
export function resetMagpiePicturesVisit(){visit=freshVisit();generation++;}
function activeVisit(state,owner){if(visit.state!==state||visit.owner!==owner)visit=freshVisit(state,owner);}
function parentFrame(){return {root:visit.state.riddles,raw:JSON.stringify(visit.state.riddles),present:Object.hasOwn(visit.state,'riddles')};}
const sameFrame=(a,b)=>!!a&&a.root===b.root&&a.raw===b.raw&&a.present===b.present;
function retireChangedFrame(){if(!visit.active||sameFrame(visit.frame,parentFrame()))return false;visit.active=false;visit.frame=null;visit.fold=false;visit.restoreFold=null;visit.focusEntry=true;return true;}
const magpieEntry=()=>`<section class="magpie-entry"><h2>The magpie's pictures</h2><p>Visit a make-believe party. What pictures do the guests' sayings make?</p><button type="button" class="secondary" data-magpie-entry>Explore the magpie's pictures</button></section>`;
function bindingGuard(root,valid){
 const controls=[root,...root.querySelectorAll('button,select,summary,a,details')],retired=new WeakSet(),chains=new Map();
 const chain=n=>{const out=[];for(;n;n=n.parentNode)out.push(n);return out;};controls.forEach(n=>chains.set(n,chain(n)));
 const retire=records=>{for(const r of records){if(r.type==='attributes'){for(const n of controls)if(chains.get(n).includes(r.target))retired.add(n);continue;}for(const removed of r.removedNodes)for(const n of controls)if(chains.get(n).includes(removed)||removed.contains?.(n))retired.add(n);}};
 const observer=new MutationObserver(records=>{retire(records);if(!root.isConnected)observer.disconnect();});observer.observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','inert','aria-hidden','style','class']});
 return n=>{retire(observer.takeRecords());if(!valid()||!root.isConnected||!root.contains(n)||retired.has(n))return false;const old=chains.get(n),now=chain(n);if(!old||old.length!==now.length||!old.every((p,i)=>p===now[i]))return false;for(let p=n;p?.nodeType===1;p=p.parentElement){if(p.hidden||p.inert||p.getAttribute('aria-hidden')==='true')return false;const c=getComputedStyle(p);if(c.display==='none'||c.visibility==='hidden'||c.visibility==='collapse')return false;}return n.getClientRects().length>0;};
}
export function riddlesPage(state,{owner=null,child=false}={}){
 activeVisit(state,owner);generation++;
 if(child){retireChangedFrame();if(visit.active)return magpiePicturesPage(visit.work);}
 const entry=child?magpieEntry():'';
 const fold=child&&visit.restoreFold===true?' open':'';
 const v=riddleView(state),r=v.root;if(v.status==='recovery')return `<div class="riddles" data-riddle-root>${header}<section class="panel"><p>This riddle notebook uses a format this version cannot read. Its saved work is kept. <a href="#notes">Download your notes</a> before changing versions. The rest of the garden is open.</p></section>${entry}</div>`;
 const open=openRiddle(state);let body;
 if(!open)body=`<section class="riddle-card riddle-empty">${dot('wave')}<div><h2>A riddle card is waiting in the hedge</h2><p>There is no hurry, and no score. Guess, ask for a clue, or just enjoy the answer.</p><button type="button" class="primary" data-riddle-next>Pull out a riddle</button></div></section>`;
 else if(!open.card)body=`<section class="riddle-card riddle-empty">${dot('puzzled')}<div><h2>This earlier riddle card is unavailable</h2><p>This version cannot read that card's own words and choices. Its complete original value remains in your notes. Other riddle cards are still open.</p><details data-riddle-recover${fold}><summary>Keep this earlier card and pull another</summary><p>The earlier card will be retained unchanged as raw work. Download notes first if you want another copy.</p><button type="button" class="primary" data-riddle-confirm-recover>Confirm and pull another card</button><button type="button" class="secondary" data-riddle-cancel-recover>Cancel</button></details></div></section>`;
 else body=riddleCard(open);
 return `<div class="riddles" data-riddle-root>${header}${sizePicker(r)}${body}<aside class="riddle-own"><h2>A riddle of your own</h2><p>${esc(ownRiddle)}</p>${hearButton(ownRiddle,'Hear this idea')}</aside>${entry}<p id="riddle-status" role="status" tabindex="-1"></p></div>`;
}
export function riddlesEntry(){return '<section class="word-home-invite riddle-home-invite"><h2>Riddle cards are caught in the hedge.</h2><p>Pull one out, read the clues, and pick the answer that fits. Ask Dot for a clue whenever you like.</p><a class="primary" href="#riddles">Solve a riddle</a></section>';}
export function riddlesNotes(state){
 if(!Object.hasOwn(state,'riddles'))return '';const r=riddleState(state);
 if(!r)return '<section class="panel"><h2>Riddles in the Hedge</h2><p>Unsupported riddle notebook kept unchanged in the notes download. Riddle actions are paused.</p></section>';
 const s=riddleSummary(r);
 return `<details class="panel"><summary>Riddles in the Hedge: cards and picks</summary><p>Riddles are for fun. Picks were made with any amount of talk or help, so these lines are not a reading or reasoning assessment.</p><p>Different readable riddle cards pulled out: ${s.met}.</p><p>Fitting answer on the first pick, without a clue: ${s.first}. Found after other picks, without a clue: ${s.later}. Found after Dot’s clue: ${s.clue}. Answer shown: ${s.shown}. Moved on before finishing: ${s.skipped}.</p><p>${s.legacy} earlier code-only round(s) are included in those historical counts without reconstructing their wording or answer. ${s.unavailable} earlier item(s) are unavailable here and remain unchanged in the download.</p><p>Card choice: ${esc(riddleSizes.find(x=>x.id===r.size).label)}.</p><a href="#riddles">Visit Riddles in the Hedge</a></details>`;
}
export function bindRiddles(state,ctx){
 const {save,render,focus,canExport,explorerId}=ctx;
 const boundVisit=visit,token=generation,route=location.hash,owner=()=>explorerId?.()??boundVisit.owner;
 const contextLive=()=>visit===boundVisit&&token===generation&&visit.state===state&&owner()===visit.owner&&(!ctx.notebook||ctx.notebook()===state)&&(!ctx.isActive||ctx.isActive())&&location.hash===route;
 const redraw=target=>{ctx.stopSpeech?.();ctx.stopSound?.();render();focus?.(target);};
 if(visit.active){
  const scope=document.querySelector('[data-magpie-root]');if(!scope)return;
  const valid=bindingGuard(scope,()=>contextLive()&&document.querySelector('[data-magpie-root]')===scope);
  const live=n=>{if(!valid(n))return false;if(retireChangedFrame()){redraw('[data-magpie-entry]');return false;}return visit.active;};
  bindMagpiePictures(visit.work,{live,change:next=>{visit.work=next;},render,focus,stopSpeech:ctx.stopSpeech,stopSound:ctx.stopSound,back:()=>{visit.active=false;visit.restoreFold=visit.fold;visit.frame=null;redraw('[data-magpie-entry]');}});return;
 }
 const scope=document.querySelector('[data-riddle-root]');if(!scope)return;
 const bound=parentFrame(),valid=bindingGuard(scope,()=>contextLive()&&document.querySelector('[data-riddle-root]')===scope);
 const live=n=>valid(n)&&!visit.active&&sameFrame(bound,parentFrame());
 // Shared voice preferences have their own live guard. These are the controls
 // present in this parent render, whose listeners must not revive later.
 const controls=new Set(scope.querySelectorAll('button,a,summary,select'));
 for(const n of controls)n.addEventListener('click',e=>{if(!live(n)||n.disabled){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
 if(visit.focusEntry&&contextLive()){visit.focusEntry=false;focus?.('[data-magpie-entry]');}
 const recovery=scope.querySelector('[data-riddle-recover]');
 let rootRef=state.riddles,usedRecover=!recovery?.open,confirmRoot=recovery?.open?state.riddles:null;
 visit.restoreFold=null;
 const status=message=>{const p=scope.querySelector('#riddle-status');if(p){p.textContent=message;p.focus();}};
 const act=(n,fn,target)=>{if(location.hash!=='#riddles'||!live(n)||state.riddles!==rootRef)return false;const result=commitRiddles(state,fn,canExport);if(result===false){status('This change cannot be saved as a readable notes download. Earlier work is unchanged. Download notes or use a separate explorer.');return false;}rootRef=state.riddles;save();redraw(typeof target==='function'?target(result):target);return true;};
 scope.querySelector('[data-magpie-entry]')?.addEventListener('click',e=>{const n=e.currentTarget;if(location.hash!=='#riddles'||!live(n))return;visit.work??=createMagpiePictures();visit.frame=parentFrame();visit.fold=!!recovery?.open;visit.active=true;redraw('#magpie-title');});
 scope.querySelectorAll('[data-riddle-size]').forEach(n=>n.onclick=()=>act(n,c=>chooseSize(c,n.dataset.riddleSize),`[data-riddle-size="${n.dataset.riddleSize}"]`));
 scope.querySelectorAll('[data-riddle-next],[data-riddle-put-back]').forEach(n=>n.onclick=()=>act(n,c=>nextRiddle(c),'#riddle-prompt'));
 scope.querySelectorAll('[data-riddle-choice]').forEach(n=>n.onclick=()=>act(n,c=>pickChoice(c,n.dataset.riddleChoice),result=>result.fits?'#riddle-result-title':'#riddle-nudge'));
 scope.querySelector('[data-riddle-clue]')?.addEventListener('click',e=>act(e.currentTarget,askClue,'.riddle-clue'));
 scope.querySelector('[data-riddle-show]')?.addEventListener('click',e=>act(e.currentTarget,showAnswer,'#riddle-result-title'));
 recovery?.addEventListener('toggle',()=>{if(location.hash!=='#riddles'||!live(recovery))return;if(!recovery.open){usedRecover=true;confirmRoot=null;}else{usedRecover=false;confirmRoot=state.riddles;}});
 scope.querySelector('[data-riddle-cancel-recover]')?.addEventListener('click',e=>{if(location.hash!=='#riddles'||!live(e.currentTarget))return;usedRecover=true;confirmRoot=null;recovery.open=false;focus?.('.riddle-card h2');});
 scope.querySelector('[data-riddle-confirm-recover]')?.addEventListener('click',e=>{if(location.hash!=='#riddles'||!live(e.currentTarget)||usedRecover||!recovery.open||confirmRoot!==state.riddles)return;usedRecover=true;act(e.currentTarget,replaceRawRiddle,'#riddle-prompt');});
}
