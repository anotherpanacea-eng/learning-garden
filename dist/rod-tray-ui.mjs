// Spec 344: the Rod Tray page at #desk/rods, its discovery card and its Grown-up notes block.
import {ROD_COPY as K} from './rod-tray-content.mjs';
import * as core from './rod-tray-core.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=x=>{try{return JSON.stringify(x,null,2);}catch{return '';}};
// Child text on screen keeps its minus signs; screen readers hear "take away" for the operation and "negative" for a value.
export const say=t=>esc(t).replace(/ − |−\$(\d+)|−(\d+)/g,(m,d,n)=>d?hid(m,`negative ${d} dollars`):n?hid(m,`negative ${n}`):` ${hid('−','take away')} `);
const p=(t,a='')=>`<p${a}>${say(t)}</p>`;
const btn=(t,a='',{primary=false,disabled=false,pressed=null}={})=>`<button type="button" class="${primary?'primary':'secondary'}" ${a}${pressed===null?'':` aria-pressed="${pressed}"`}${disabled?' disabled':''}>${esc(t)}</button>`;
const hid=(seen,said)=>`<span aria-hidden="true">${seen}</span><span class="sr-only">${said}</span>`;
// A true minus sign on screen; screen readers hear "negative".
export const rodNumber=n=>n<0?`−${-n}`:`${n}`;
export const rodSpoken=n=>n<0?`negative ${-n}`:`${n}`;
const num=n=>n<0?hid(rodNumber(n),rodSpoken(n)):`${n}`;
// The sentence read aloud with the two minus jobs named: "1 take away negative 3".
export const rodSentenceSpoken=c=>`${rodSpoken(c.start)} ${c.op==='add'?'plus':'take away'} ${rodSpoken(c.operand)}`;
// A written sentence such as 2 − (−4) read with both minus jobs named.
export const spokenText=x=>x.replace(/\(−(\d+)\)/g,'negative $1').replace(/ − /g,' take away ').replace(/ \+ /g,' plus ').replace(/−(\d+)/g,'negative $1');
const rodsWord=(n,kind)=>`${n} ${kind} ${n===1?'rod':'rods'}`;
export const trayText=t=>t.red===0&&t.black===0?K.empty:`${rodsWord(t.red,'red')}, ${rodsWord(t.black,'black')}.`;
const rods=(n,kind)=>Array.from({length:n},()=>`<span class="rt-rod rt-${kind}" aria-hidden="true">${kind==='red'?'+':'−'}</span>`).join('');
function trayPicture(t,id='rt-tray-text'){return `<div class="rt-tray"><div class="rt-rods" aria-hidden="true"><div class="rt-row">${rods(t.red,'red')}</div><div class="rt-row">${rods(t.black,'black')}</div></div><p class="rt-tray-text" id="${id}" tabindex="-1">${esc(trayText(t))}</p></div>`;}
let visits=new WeakMap();
export function resetRodTrayView(state){if(state&&typeof state==='object')visits.delete(state);else visits=new WeakMap();}
function visit(state,explorerId=''){let u=visits.get(state);if(!u||u.explorerId!==explorerId){u={explorerId,id:'cross-down',open:{},helperStep:0,teach:{},paired:null,notice:''};visits.set(state,u);}return u;}
const opened=(u,id)=>u.open[id]||(u.open[id]={hint:false,helper:false,line:false});
export function rodTrayEntry(){return `<aside class="rt-entry"><h3>${esc(K.title)}</h3>${p(K.entryText)}<a class="secondary" href="#desk/rods">${esc(K.entryLink)}</a></aside>`;}
// The number line from −12 to 12 with one arrow for the case's move.
function numberLine(c){
 const m=core.rodMove(c),x=n=>20+(n+12)*20,y=34,ticks=Array.from({length:25},(_,i)=>i-12);
 const caption=c.op==='add'?(c.operand>=0?K.arrows.addPositive(c.operand):K.arrows.addNegative(-c.operand)):(c.operand>=0?K.arrows.takePositive(c.operand):K.arrows.takeNegative(-c.operand));
 const svg=`<svg class="rt-line" viewBox="0 0 520 70" role="img" aria-label="${esc(`Number line from negative 12 to 12. Start at ${rodSpoken(m.from)}. Arrow to ${rodSpoken(m.to)}.`)}"><line x1="20" y1="${y}" x2="500" y2="${y}" class="rt-axis"/>${ticks.map(n=>`<line x1="${x(n)}" y1="${y-(n%5?4:8)}" x2="${x(n)}" y2="${y+(n%5?4:8)}" class="rt-tick"/>`).join('')}${[-10,-5,0,5,10].map(n=>`<text x="${x(n)}" y="${y+24}" text-anchor="middle">${rodNumber(n)}</text>`).join('')}<circle cx="${x(m.from)}" cy="${y}" r="6" class="rt-start"/><line x1="${x(m.from)}" y1="${y-16}" x2="${x(m.to)+(m.delta>0?-6:6)}" y2="${y-16}" class="rt-arrow"/><path d="M${x(m.to)} ${y-16} l${m.delta>0?-9:9} -6 v12 z" class="rt-head"/></svg>`;
 return `<section class="rt-help rt-numberline" id="rt-line-focus" tabindex="-1"><h3>${esc(K.ladder.line)}</h3>${p(K.lineCaption)}${svg}${p([caption,m.through?K.arrows.throughZero:''].filter(Boolean).join(' '),' class="rt-arrow-caption"')}</section>`;
}
function helperPanel(v,u,c){const h=v.source.helpers[c.helper],i=Math.min(u.helperStep,h.steps.length-1),s=h.steps[i];return `<section class="rt-help rt-helper" id="rt-helper-focus" tabindex="-1"><h3>${esc(K.ladder.helper)}: ${hid(esc(h.sentence),esc(spokenText(h.sentence)))}</h3>${p(K.helperCaption,' class="rt-caption"')}${trayPicture(s,'rt-helper-tray')}<ol start="${i+1}"><li>${say(s.text)}</li></ol><div class="rt-actions">${btn(K.previous,'data-rt-step="-1"',{disabled:i===0})}${btn(K.next,'data-rt-step="1"',{disabled:i===h.steps.length-1})}${btn(K.backToTray,'data-rt-back')}</div></section>`;}
function feedback(v,c,view){const k=view.check;if(!k||!view.draft)return p(K.beforeCheck,' class="rt-before"');const l=k.latest,d=view.draft;if(l.answer!==d.answer||l.red!==d.red||l.black!==d.black)return p(K.beforeCheck,' class="rt-before"');return `<div class="rt-feedback" id="rt-feedback" tabindex="-1">${p(core.rodSavedFeedback(v.source,c,l),' class="rt-said"')}${p(K.tellWhy,' class="rt-why"')}</div>`;}
function caseButtons(v,u){
 const b=c=>btn(c.title,`data-rt-case="${c.id}"`,{pressed:u.id===c.id});
 const cs=v.source.cases,pair=['take-black','take-red'];
 return `<nav class="rt-cases" aria-label="Rod Tray invitations">${cs.filter(c=>!pair.includes(c.id)).slice(0,3).map(b).join('')}${cs.some(c=>pair.includes(c.id))?`<div class="rt-contrast">${p(K.contrast,' class="rt-caption"')}<div class="rt-pair">${cs.filter(c=>pair.includes(c.id)).map(b).join('')}</div></div>`:''}${cs.filter(c=>!pair.includes(c.id)).slice(3).map(b).join('')}</nav>`;
}
function teachCards(v,u){return `<section class="rt-teach-list"><h2>Teach cards</h2>${core.TEACH_IDS.map(k=>{const t=v.source.teach[k],n=u.teach[k]||0;return `<details class="rt-teach" data-rt-teach="${k}"${n?' open':''}><summary>${esc(`${k}. ${t.title}`)}</summary>${n?`${p(t.text)}<p class="rt-label">${esc(K.workedLabel)}</p><ol id="rt-teach-${k}" tabindex="-1">${t.steps.slice(0,n).map(s=>`<li>${say(s)}</li>`).join('')}</ol>${n<t.steps.length?btn(K.nextStep,`data-rt-teach-next="${k}"`):''}`:''}</details>`;}).join('')}</section>`;}
function work(v,u){
 const view=core.rodCaseView(v,u.id),c=view.case;if(!c)return p(K.unreadable);
 const o=opened(u,c.id),t=view.draft,read=view.draftReadable;
 const operand=c.operand<0?rods(-c.operand,'black'):rods(c.operand,'red');
 const head=`<h2 id="rt-focus" tabindex="-1">${esc(c.title)}</h2>${p(c.prompt)}<p class="rt-sentence">${hid(esc(c.sentence),esc(rodSentenceSpoken(c)))}<span class="rt-operand" aria-hidden="true">${operand}</span></p>`;
 const guided=c.guided.length?`<ol class="rt-guided">${c.guided.map(s=>`<li>${say(s)}</li>`).join('')}</ol>`:'';
 if(!read)return `${head}${guided}${p(K.unreadable,' class="rt-notice"')}`;
 const B=K.buttons,full=t.red>=12||t.black>=12,limits=[full?K.full:'',t.red===0&&t.black>0?K.noRed:'',t.black===0&&t.red>0?K.noBlack:''].filter(Boolean);
 const paired=u.paired&&u.paired.id===c.id?`<div class="rt-paired" role="status">${u.paired.n?`<span class="rt-zeros" aria-hidden="true">${Array.from({length:u.paired.n},()=>'<span class="rt-zero">0</span>').join('')}</span>${p(K.paired,' class="rt-motion"')}${p(K.pairedStill(u.paired.n),' class="rt-still"')}`:p(K.noPairs)}</div>`:'';
 const controls=`<div class="rt-controls">${btn(B.addRed,'data-rt-act="addRed"',{disabled:t.red>=12})}${btn(B.addBlack,'data-rt-act="addBlack"',{disabled:t.black>=12})}${btn(B.takeRed,'data-rt-act="takeRed"',{disabled:t.red===0})}${btn(B.takeBlack,'data-rt-act="takeBlack"',{disabled:t.black===0})}${btn(B.addPair,'data-rt-act="addPair"',{disabled:full})}${btn(B.pairOff,'data-rt-act="pairOff"')}${btn(B.startAgain,'data-rt-act="startAgain"')}</div>${limits.map(l=>p(l,' class="rt-limit"')).join('')}`;
 const answer=`<div class="rt-answer" role="group" aria-labelledby="rt-answer-label"><p id="rt-answer-label" class="rt-label">${esc(K.answerLabel)}</p><div class="rt-stepper">${btn(K.oneLess,'data-rt-act="answerDown"',{disabled:t.answer===-12})}<output class="rt-value" id="rt-value" aria-live="polite">${t.answer===null?esc(K.noAnswer):num(t.answer)}</output>${btn(K.oneMore,'data-rt-act="answerUp"',{disabled:t.answer===12})}</div>${btn(K.check,'data-rt-check',{primary:true,disabled:t.answer===null||!view.checkReadable})}${view.checkReadable?'':p(K.unreadable,' class="rt-notice"')}</div>`;
 const helpOpen={hint:o.hint||view.support.hint===true,helper:o.helper||view.support.helper===true};
 const ladder=`<div class="rt-ladder">${o.hint?`<div class="rt-help" id="rt-hint-focus" tabindex="-1"><h3>${esc(K.ladder.hint)}</h3>${p(c.hint)}</div>`:''}${o.helper?helperPanel(v,u,c):''}${o.line?numberLine(c):''}<div class="rt-actions">${o.hint?'':btn(K.ladder.hint,'data-rt-help="hint"')}${!o.helper&&helpOpen.hint?btn(K.ladder.helper,'data-rt-help="helper"'):''}${!o.line&&helpOpen.helper?btn(K.ladder.line,'data-rt-help="line"'):''}</div></div>`;
 return `${head}<div class="rt-work"><div class="rt-left">${trayPicture(t)}${paired}${controls}</div><div class="rt-right">${guided}${answer}${feedback(v,c,view)}</div></div>${ladder}`;
}
// The legend names each sign; screen readers hear the sign's name.
const legendText=t=>esc(t).replace(/\((−|\+)\)/g,(m,g)=>hid(m,`(the ${g==='+'?'plus':'minus'} sign)`));
export function rodTrayPage(state,explorerId=''){
 const v=core.readRodTray(state),u=visit(state,explorerId);
 const top=`<h1 id="rt-heading" tabindex="-1">${esc(K.title)}</h1>${p(K.reason,' class="rt-reason"')}<p id="rt-status" class="rt-status${u.notice?'':' sr-only'}" role="status" tabindex="-1">${esc(u.notice)}</p>`;
 if(v.status!=='ready'&&v.status!=='missing')return `<div class="rt-page" data-rod-tray-view data-rt-closed>${top}${p(v.status==='unsupported'?K.unknownVersion:K.unreadable,' class="rt-notice"')}<p><a href="#notes">Grown-up notes</a></p></div>`;
 const legend=`<p class="rt-model">${esc(K.model)}</p><ul class="rt-legend"><li><span class="rt-rod rt-red" aria-hidden="true">+</span>${legendText(K.legendRed)}</li><li><span class="rt-rod rt-black" aria-hidden="true">−</span>${legendText(K.legendBlack)}</li></ul>`;
 return `<div class="rt-page" data-rod-tray-view>${top}<section class="rt-bench">${work(v,u)}${legend}</section>${caseButtons(v,u)}${teachCards(v,u)}<aside class="rt-offscreen"><p class="rt-label">with a grown-up</p>${p(K.offScreen)}</aside></div>`;
}
const flag=x=>x===true?'yes':x===false?'no':'unknown';
function snapshotNotes(v,c,x,label){const h=x.helpBefore,teach=core.TEACH_IDS.map(k=>`${k} ${flag(h.teach[k])}`).join(', ');return `<li><p><strong>${esc(label)}:</strong> ${esc(rodNumber(x.answer))}, ${x.matches?'matches':'does not match'}. Tray: ${esc(trayText(x))}</p><p>Help before this check: guided steps ${h.guided?'shown by design':'none'}; hint ${flag(h.hint)}; different example ${flag(h.helper)}; number line ${flag(h.line)}; teach cards ${esc(teach)}.</p><p class="rt-frozen">${esc(core.rodSavedFeedback(v.source,c,x))}</p></li>`;}
// Grown-up notes read only the retained source and the saved records, and write nothing.
export function rodTrayNotes(state){
 const v=core.readRodTray(state);if(v.status==='missing')return '';
 if(v.status!=='ready')return `<details class="panel rt-notes" data-rod-tray-notes><summary>${esc(K.notesHeading)}</summary>${p(v.status==='unsupported'?K.unknownVersion:K.unreadable)}<pre>${esc(json(v.root))}</pre></details>`;
 const rows=v.source.cases.map(c=>{const x=core.rodCaseView(v,c.id),raw=['drafts','checks','support'].flatMap(k=>v[k].unreadable.filter(e=>e?.caseId===c.id));
  const checks=!x.checkReadable?p('Checks: unreadable, kept as saved.'):x.check?`<p>Checks: ${x.check.count}.</p><ul>${snapshotNotes(v,c,x.check.first,'First check')}${x.check.count>1?snapshotNotes(v,c,x.check.latest,'Latest check'):''}</ul>`:p('Checks: none yet.');
  const help=`<p>Help opened: hint ${flag(x.support.hint)}; different example ${flag(x.support.helper)}; number line ${flag(x.support.line)}.</p>`;
  return `<li><h4 class="rt-frozen">${esc(c.title)}: ${esc(c.sentence)}</h4>${checks}${help}${raw.length?`<pre>${esc(json(raw))}</pre>`:''}</li>`;}).join('');
 const sectionRaw=['drafts','checks','support'].filter(k=>v[k].status!=='ready').map(k=>`<p>${k}: unreadable, kept as saved.</p><pre>${esc(json(v.root[k]))}</pre>`).join('');
 const teach=core.TEACH_IDS.map(k=>`${k} ${flag(v.teaching.flags[k])}`).join(', ');
 return `<details class="panel rt-notes" data-rod-tray-notes><summary>${esc(K.notesHeading)}</summary>${p(K.teaches)}${p(K.checkMeans)}${p(K.kept)}<p>Teach cards opened: ${esc(teach)}. A “no” means not recorded, not proof of an unaided answer.</p><ul>${rows}</ul>${sectionRaw}<a href="#desk/rods">${esc(K.title)}</a></details>`;
}
export function bindRodTray(state,{notebook=()=>state,explorerId=()=>'',isActive=()=>true,save,render,focus,canExport,stopSpeech}={}){
 const host=document.querySelector('[data-rod-tray-view]');if(!host||host.hasAttribute('data-rt-closed'))return;
 const u=visit(state,explorerId()),bound=explorerId();
 const live=el=>el.isConnected&&host.isConnected&&host.contains(el)&&!el.disabled&&notebook()===state&&explorerId()===bound&&isActive()&&location.hash==='#desk/rods'&&visits.get(state)===u;
 const usable=el=>{if(!live(el))return false;const scope=el.matches('summary')?el.parentElement?.parentElement:el;return !scope?.closest('details:not([open])');};
 const redraw=(target,write=false)=>{if(write)try{save?.();}catch{}stopSpeech?.();render?.();const next=document.querySelector('[data-rod-tray-view]');if(!next)return;let el=next.querySelector(target);if(!el||el.disabled)el=next.querySelector('#rt-tray-text')||next.querySelector('#rt-focus');for(let a=el?.matches('summary')?el.parentElement?.parentElement:el?.parentElement;a&&a!==next;a=a.parentElement)if(a.tagName==='DETAILS')a.open=true;if(focus&&el?.id)focus('#'+el.id);else el?.focus();};
 const refuse=r=>{u.notice=r.code==='report-safety'?K.refused:K.unreadable;redraw('#rt-status');};
 const on=(sel,fn)=>host.querySelectorAll(sel).forEach(el=>el.addEventListener('click',e=>{if(!usable(el)){e.preventDefault();e.stopImmediatePropagation();return;}fn(el,e);}));
 on('[data-rt-case]',el=>{u.id=el.dataset.rtCase;u.paired=null;u.helperStep=0;u.notice='';redraw('#rt-focus');});
 on('[data-rt-act]',el=>{const a=el.dataset.rtAct,r=core.rodAction(state,u.id,a,canExport);if(!r.ok&&['report-safety','unreadable','unsupported'].includes(r.code))return refuse(r);u.notice='';u.paired=a==='pairOff'&&r.ok?{id:u.id,n:r.paired||0}:null;redraw(`[data-rt-act="${a}"]`,r.changed);});
 on('[data-rt-check]',()=>{const r=core.rodCheck(state,u.id,canExport);if(!r.ok)return refuse(r);u.notice='';u.paired=null;redraw('#rt-feedback',r.changed);});
 on('[data-rt-help]',el=>{const k=el.dataset.rtHelp,r=core.rodSupport(state,u.id,k,canExport);if(!r.ok)return refuse(r);u.notice='';opened(u,u.id)[k]=true;if(k==='helper')u.helperStep=0;redraw(`#rt-${k}-focus`,r.changed);});
 on('[data-rt-step]',el=>{u.helperStep=Math.max(0,u.helperStep+Number(el.dataset.rtStep));redraw('#rt-helper-focus');});
 on('[data-rt-back]',()=>{opened(u,u.id).helper=false;redraw('#rt-tray-text');});
 host.querySelectorAll('[data-rt-teach] > summary').forEach(sum=>sum.addEventListener('click',e=>{e.preventDefault();if(!usable(sum))return;const k=sum.parentElement.dataset.rtTeach;if(u.teach[k]){u.teach[k]=0;redraw(`[data-rt-teach="${k}"] > summary`);return;}const r=core.rodTeaching(state,k,canExport);if(!r.ok)return refuse(r);u.notice='';u.teach[k]=1;redraw(`#rt-teach-${k}`,r.changed);}));
 on('[data-rt-teach-next]',el=>{const k=el.dataset.rtTeachNext;u.teach[k]++;redraw(`#rt-teach-${k}`);});
}
