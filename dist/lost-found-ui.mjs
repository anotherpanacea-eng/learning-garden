// Spec 333: the Lost and Found Board at #post/lost-and-found.
import {lostFoundCopy as T,makeLadderSource} from './lost-found-content.mjs';
import * as C from './lost-found-core.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const md=x=>esc(x).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
const p=(x,cls='')=>`<p${cls?` class="${cls}"`:''}>${md(x)}</p>`;
const button=(action,label,attrs='',disabled=false,cls='secondary')=>`<button type="button" class="${cls}" data-lf-action="${action}" ${attrs}${disabled?' disabled':''}>${label}</button>`;
const ROUTE='#post/lost-and-found';
let views=new WeakMap();
export function resetLostFoundView(){views=new WeakMap();}
function local(state,owner){let l=views.get(state);if(!l||l.owner!==owner){l={owner,open:false,step:0,steps:false,worked:false,whyOpen:[],list:false,confirm:null,line:'',lineKind:'',lastResult:null,notice:'',announce:''};views.set(state,l);}return l;}
const notice=m=>`<aside class="lf-notice">${p(m)}<a href="#notes">${esc(T.notesLink)}</a></aside>`;
function shed(){return `<svg class="lf-shed" viewBox="0 0 220 120" role="img" aria-label="${esc('The shed by the mill')}"><path d="M10 110h200" stroke="#3e4a3a" stroke-width="3"/><path d="M30 110V60l45-30 45 30v50z" fill="#c8a46a" stroke="#4a3a22" stroke-width="3"/><rect x="62" y="74" width="26" height="36" fill="#7a5530" stroke="#4a3a22" stroke-width="2"/><path d="M150 110V40h40v70z" fill="#d9d2c2" stroke="#4a4a4a" stroke-width="3"/><path d="M170 40l-26-26M170 40l26-26M170 40l-26 26M170 40l26 26" stroke="#6b5530" stroke-width="5" stroke-linecap="round"/><circle cx="170" cy="40" r="5" fill="#4a3a22"/><path d="M128 110l10-56M140 110l10-56M130 98h12M132 86h12M134 74h12M136 62h12" stroke="#8a6a3a" stroke-width="3"/></svg>`;}
function teaching(l,started){
 const n=Math.min(l.step,T.steps.length-1);
 return `<section class="lf-steps" id="lf-steps" tabindex="-1"><ol>${T.steps.slice(0,n+1).map(s=>`<li>${md(s)}</li>`).join('')}</ol><div class="lf-actions">${n<T.steps.length-1?button('step',esc(T.next),'',false,'primary'):button('start',esc(T.startSorting),'',false,'primary')}</div></section>`;
}
function sortRound(r,s,round,l,live){
 const skipped=r.skipped.includes(round),list=s.sentences.filter(x=>x.round===round);
 return `<section class="lf-round" data-lf-round="${round}">${skipped?p(T.skipped,'lf-note'):''}<ul class="lf-sentences">${list.map(x=>{
  const chosen=Object.hasOwn(r.sort,x.id)?r.sort[x.id]:skipped?x.sort:null,done=chosen!==null,open=skipped||l.whyOpen.includes(x.id);
  return `<li class="lf-sentence" id="lf-s-${esc(x.id)}"><p><strong>${esc(x.writer)}</strong>: ${md(x.text)}</p><div class="lf-actions" role="group" aria-label="${esc(x.writer)}">${['saw','think'].map(k=>button('sort',esc(T[k]),`data-lf-sentence="${esc(x.id)}" data-lf-choice="${k}" aria-pressed="${chosen===k}"`,!live||done)).join('')}${done&&!open?button('why',esc(T.why),`data-lf-sentence="${esc(x.id)}"`,!live):''}</div>${open?`<p class="lf-why" id="lf-why-${esc(x.id)}" tabindex="-1">${md(x.why)}</p>`:''}</li>`;}).join('')}</ul>${!skipped&&!C.roundSorted(r,round)?button('skip',esc(T.skip),'',!live):''}</section>`;
}
function clueCards(r,s){
 const open=C.activeClues(s,r.round).filter(c=>s.sentences.some(x=>x.clue===c.id&&(Object.hasOwn(r.sort,x.id)||r.skipped.includes(x.round))));
 return `<section class="lf-clues"><h3>${esc(T.clues)}</h3>${p(T.cluesRule)}<ol>${open.map(c=>`<li class="lf-clue">${md(c.text)}</li>`).join('')}</ol></section>`;
}
function grid(r,s,kind,l,live){
 const cols=kind==='t'?s.things:s.places;
 const table=`<table class="lf-grid"><thead><tr><th scope="col"><span class="lf-sr">${esc(T.answerStep)}</span></th>${cols.map(c=>`<th scope="col">${esc(c.label)}</th>`).join('')}</tr></thead><tbody>${s.rows.map(row=>`<tr><th scope="row">${esc(row.label)}</th>${cols.map(c=>{const cell=`${kind}:${row.id}:${c.id}`,m=r.marks[cell]??null;return `<td>${button('mark',m?esc(T.marks[m]):'',`data-lf-cell="${cell}" aria-label="${esc(T.listRow.replace('{row}',row.label).replace('{thing}',c.label))}: ${esc(m?T.marks[m]:T.notSure)}"`,!live,'lf-cell')}</td>`;}).join('')}</tr>`).join('')}</tbody></table>`;
 const list=`<div class="lf-list">${s.rows.flatMap(row=>cols.map(c=>{const cell=`${kind}:${row.id}:${c.id}`,m=r.marks[cell]??null,name=`lf-${cell.replace(/:/g,'-')}`;return `<fieldset><legend>${esc(T.listRow.replace('{row}',row.label).replace('{thing}',c.label))}</legend>${[['yes',T.marks.yes],['no',T.marks.no],['',T.notSure]].map(([v,lab])=>`<label><input type="radio" name="${name}" data-lf-list="${cell}" value="${v}"${(m??'')===v?' checked':''}${live?'':' disabled'}> ${esc(lab)}</label>`).join('')}</fieldset>`;})).join('')}</div>`;
 const confirm=l.confirm===kind?`<div class="lf-confirm" role="group">${p(T.clearAsk)}<div class="lf-actions">${button('clear-yes',esc(T.clearYes),`data-lf-grid="${kind}"`)}${button('clear-no',esc(T.clearNo),`data-lf-grid="${kind}"`)}</div></div>`:'';
 return `<div class="lf-grid-block">${l.list?list:`<div class="lf-grid-wrap">${table}</div>`}<div class="lf-actions">${button('clear',esc(T.clear),`data-lf-grid="${kind}"`,!live)}</div>${confirm}</div>`;
}
function tellYet(r,s,live){
 if(!C.roundSorted(r,1))return '';
 const ans=r.tellYet,way=ans==='yes'?C.anotherWay(s,r.answer):null;
 return `<section class="lf-tell"><h3>${esc(T.tellQuestion)}</h3><div class="lf-actions">${button('tell',esc(T.tellYes),`data-lf-choice="yes" aria-pressed="${ans==='yes'}"`,!live||ans!==null)}${button('tell',esc(T.tellNot),`data-lf-choice="not-yet" aria-pressed="${ans==='not-yet'}"`,!live||ans!==null)}</div>${ans==='not-yet'?p(T.tellNotLine):''}${ans==='yes'?p(T.tellYesLine.replace('{arrangement}',C.arrangementText(s,way))):''}${ans&&r.round===1?button('next-clue',esc(T.nextClue),'',!live,'primary'):''}</section>`;
}
function answer(r,s,l,live){
 if(!C.roundSorted(r,r.round))return '';
 const a=r.answer??{},sel=(row,slot)=>{const list=slot===0?s.things:s.places,v=Array.isArray(a[row.id])?a[row.id][slot]:null,label=(slot===0?T.thingLabel:T.placeLabel).replace('{row}',row.label);return `<label>${esc(label)}<select data-lf-answer="${esc(row.id)}" data-lf-slot="${slot}"${live?'':' disabled'}><option value="">${esc(T.choose)}</option>${list.map(x=>`<option value="${esc(x.id)}"${v===x.id?' selected':''}>${esc(x.label)}</option>`).join('')}</select></label>`;};
 const canReveal=r.revealSeen||r.round===2&&l.lastResult==='fits';
 return `<section class="lf-answer"><h3>${esc(T.answerStep)}</h3>${s.rows.map(row=>`<div class="lf-answer-row">${sel(row,0)}${sel(row,1)}</div>`).join('')}<div class="lf-actions">${button('check',esc(T.check),'',!live,'primary')}</div><p class="lf-line" id="lf-line" tabindex="-1">${esc(l.line)}</p>${canReveal&&!r.revealSeen?button('reveal',esc(T.reveal),'',!live,'primary'):''}${r.revealSeen?reveal(r,s,live):''}</section>`;
}
function reveal(r,s,live){
 const lb=s.lookingBack,chosen=lb.choices.find(c=>c.id===r.lookingBack);
 return `<section class="lf-reveal" id="lf-reveal" tabindex="-1">${s.reveal.map(x=>`<blockquote>${md(x)}</blockquote>`).join('')}<h3>${md(lb.question)}</h3><div class="lf-actions">${lb.choices.map(c=>button('look-back',esc(c.label),`data-lf-choice="${esc(c.id)}" aria-pressed="${r.lookingBack===c.id}"`,!live)).join('')}</div>${chosen?p(chosen.response):''}</section>`;
}
export const lostFoundEntry=()=>`<a class="secondary" href="${ROUTE}">${esc(T.hubLink)}</a>`;
export function lostFoundSummary(v){const c=v.cases[0],status=c.status==='solved'?'solved':c.status==='started'?'started':'not started';return T.grownUpLine.replace('{status}',status).replace('{help}',c.record?.skipped?.length?T.withHelp:'');}
export function lostFoundPage(state,owner=''){
 const v=C.lostFoundView(state),l=local(state,owner),header=`<header class="page-heading"><a class="back" href="#post"><span aria-hidden="true">←</span> Post office</a><h1>${esc(T.title)}</h1></header>`;
 if(v.status==='unsupported')return `<section class="lf-board" data-lost-found-root>${header}${notice(T.unknownVersion)}</section>`;
 const c=v.cases[0],s=c.source,intro=v.status==='new'?T.firstVisit.map(x=>p(x)).join(''):p(T.laterVisit);
 const board=`<div class="lf-notes">${button('open',`<strong>${esc(s.title)}</strong> <span class="lf-status">${esc(T.status[c.status==='unreadable'?'started':c.status])}</span>`,`aria-pressed="${l.open}"`,false,'lf-note-card')}</div>`;
 let body='';
 if(l.open){
  if(c.status==='unreadable'||c.kept&&!c.writable)body=`<section class="lf-mystery">${p(T.unreadable,'lf-unavailable')}</section>`;
  else{
   const r=c.record,live=!!r;
   body=`<section class="lf-mystery"><h2 id="lf-task" tabindex="-1">${esc(s.title)}</h2>${shed()}${p(s.note)}${!r||l.steps?teaching(l,!!r):button('reopen',esc(T.reopenSteps))}`;
   if(r){
    body+=[1,2].filter(n=>n<=r.round).map(n=>sortRound(r,s,n,l,live)).join('')+clueCards(r,s);
    if(l.worked&&r.round===1)body+=`<aside class="lf-worked">${p(s.worked)}</aside>`;
    body+=`<section class="lf-grids">${p(T.cellHelp,'tiny')}<div class="lf-actions">${button('list',esc(T.listMode),`aria-pressed="${l.list}"`)}</div>${grid(r,s,'t',l,live)}${grid(r,s,'p',l,live)}</section>`;
    body+=tellYet(r,s,live)+answer(r,s,l,live);
   }
   body+='</section>';
  }
 }
 const grown=`<details class="lf-grownups"><summary>For grown-ups</summary><ul>${T.grownUps.map(x=>`<li>${md(x)}</li>`).join('')}</ul>${p(lostFoundSummary(v))}${p(T.invitation)}</details>`;
 return `<section class="lf-board" data-lost-found-root>${header}<section class="lf-arrival">${intro}</section>${board}${body}<p id="lf-status" class="lf-status lf-notice" tabindex="-1">${esc(l.notice)}</p><p class="lf-announce" role="status" aria-live="polite">${esc(l.announce)}</p>${grown}</section>`;
}
export function lostFoundNotes(state){
 if(!state||typeof state!=='object'||!Object.hasOwn(state,'mysteries'))return '';
 let raw='';try{raw=JSON.stringify(state.mysteries,null,2)??'';}catch{raw='';}
 const v=C.lostFoundView(state);
 return `<details class="panel" data-lost-found-notes><summary>${esc(T.title)}</summary>${v.status==='unsupported'?p(T.unknownVersion):p(lostFoundSummary(v))}<details><summary>Full retained Lost and Found work</summary><pre>${esc(raw)}</pre></details><a href="${ROUTE}">${esc(T.title)}</a></details>`;
}
export function bindLostFound(state,ctx={}){
 const root=document.querySelector('[data-lost-found-root]');if(!root)return;
 const owner=ctx.explorerId?.()??'',l=local(state,owner),owned=state.mysteries,material=JSON.stringify(owned),options={canExport:ctx.canExport};
 const live=el=>root.isConnected&&root===document.querySelector('[data-lost-found-root]')&&root.contains(el)&&el.isConnected&&!el.disabled&&!el.closest('[hidden],details:not([open])')&&el.getClientRects().length>0&&location.hash===ROUTE&&(!ctx.notebook||ctx.notebook()===state)&&(ctx.explorerId?.()??'')===owner&&ctx.isActive?.()!==false&&state.mysteries===owned&&JSON.stringify(owned)===material&&views.get(state)===l&&!document.querySelector('dialog.welcome-film[open]');
 const redraw=selector=>{ctx.stopSpeech?.();ctx.render?.();const next=document.querySelector('[data-lost-found-root]'),el=selector&&next?.querySelector(selector);(el&&!el.disabled&&el.getClientRects().length?el:next?.querySelector('#lf-task')??next?.querySelector('h1'))?.focus?.();};
 const commit=(fn,after,selector)=>{const result=fn();if(!result.ok){l.notice=result.error==='capacity'?T.capacity:T.unreadable;return redraw('#lf-status');}const saved=result.changed===false?null:ctx.save?.();after?.(result);if(saved&&(saved.enabled===false||saved.ok===false)&&saved.message)l.notice=saved.message;redraw(selector);};
 const s=()=>C.lostFoundView(state).cases[0].source;
 root.querySelectorAll('[data-lf-action]').forEach(el=>el.addEventListener('click',()=>{
  if(!live(el))return;const a=el.dataset.lfAction;l.notice='';l.announce='';
  if(a==='open'){l.open=!l.open;return redraw(l.open?'#lf-task':'[data-lf-action="open"]');}
  if(a==='step'){l.step++;return redraw('[data-lf-action="step"],[data-lf-action="start"]');}
  if(a==='reopen'){l.steps=true;l.step=0;return redraw('#lf-steps');}
  if(a==='start'){if(C.lostFoundView(state).cases[0].kept){l.steps=false;return redraw('#lf-task');}return commit(()=>C.startLadder(state,options),()=>{l.steps=false;l.worked=true;},'.lf-sentence [data-lf-action="sort"]');}
  if(a==='sort'){const sid=el.dataset.lfSentence;return commit(()=>C.sortSentence(state,sid,el.dataset.lfChoice,options),()=>{if(!l.whyOpen.includes(sid))l.whyOpen.push(sid);},`#lf-why-${sid}`);}
  if(a==='why'){const sid=el.dataset.lfSentence;return commit(()=>C.openWhy(state,sid,options),()=>{if(!l.whyOpen.includes(sid))l.whyOpen.push(sid);},`#lf-why-${sid}`);}
  if(a==='skip')return commit(()=>C.sortForMe(state,options),null,'.lf-round:last-of-type .lf-note');
  if(a==='mark'){const cell=el.dataset.lfCell,r=C.lostFoundView(state).cases[0].record;return commit(()=>C.setMark(state,cell,C.nextMark(r.marks[cell]),options),null,`[data-lf-cell="${cell}"]`);}
  if(a==='list'){l.list=!l.list;return redraw('[data-lf-action="list"]');}
  if(a==='clear'){l.confirm=el.dataset.lfGrid;return redraw(`[data-lf-action="clear-no"][data-lf-grid="${l.confirm}"]`);}
  if(a==='clear-no'){const g=l.confirm;l.confirm=null;return redraw(`[data-lf-action="clear"][data-lf-grid="${g}"]`);}
  if(a==='clear-yes'){const g=el.dataset.lfGrid;return commit(()=>C.clearMarks(state,g,options),()=>{l.confirm=null;},`[data-lf-action="clear"][data-lf-grid="${g}"]`);}
  if(a==='tell')return commit(()=>C.answerTellYet(state,el.dataset.lfChoice,options),null,'[data-lf-action="next-clue"]');
  if(a==='next-clue')return commit(()=>C.nextClue(state,options),()=>{l.line='';l.lastResult=null;},'[data-lf-round="2"] [data-lf-action="sort"]');
  if(a==='check')return commit(()=>C.checkLadder(state,options),res=>{const src=s();l.lastResult=res.result;l.line=res.result==='fits'?T.fits:res.result==='missing'?T.missing:res.result==='duplicate'?T.duplicate:T.broken.replace('{clue}',res.clue.text.replace(/\.$/,''));l.announce=l.line;},'#lf-line');
  if(a==='reveal')return commit(()=>C.seeReveal(state,options),null,'#lf-reveal');
  if(a==='look-back')return commit(()=>C.lookBack(state,el.dataset.lfChoice,options),null,`[data-lf-action="look-back"][data-lf-choice="${el.dataset.lfChoice}"]`);
 }));
 root.querySelectorAll('[data-lf-answer]').forEach(el=>el.addEventListener('change',()=>{if(!live(el))return;l.notice='';const row=el.dataset.lfAnswer,slot=Number(el.dataset.lfSlot);commit(()=>C.setAnswer(state,row,slot,el.value||null,options),()=>{l.line='';l.lastResult=null;},`[data-lf-answer="${row}"][data-lf-slot="${slot}"]`);}));
 root.querySelectorAll('[data-lf-list]').forEach(el=>el.addEventListener('change',()=>{if(!live(el))return;const cell=el.dataset.lfList;commit(()=>C.setMark(state,cell,el.value||null,options),null,`[data-lf-list="${cell}"][value="${el.value}"]`);}));
}
