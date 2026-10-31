import {makeBeatBenchSource} from './beat-bench-content.mjs';
import * as C from './beat-bench-core.mjs';
const own=(x,k)=>x!==null&&typeof x==='object'&&Object.hasOwn(x,k);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=x=>typeof x==='string'&&[...x].length<=4000?x:'';
const p=x=>`<p>${esc(text(x))}</p>`;
const retainedText=x=>typeof x==='string'&&[...x].length<=16000?x:'';
const fp=x=>`<p>${esc(retainedText(x))}</p>`;
const json=x=>{try{return JSON.stringify(x,null,2);}catch{return '';}};
const button=(action,label,attrs='',disabled=false)=>`<button type="button" data-bb-action="${action}" ${attrs}${disabled?' disabled':''}>${esc(label)}</button>`;
const tabs=[['fer','Word beats'],['meanings','Meaning flips'],['letters','Letter clues'],['wall','The ough wall'],['practice','Sign jobs']];
const missing='This earlier card stays in Notes. Choose another card or bench.';
const rootUnavailable='These earlier Beat Bench pages stay in Notes. Other Word Garden rooms are open.';
const notice=(message=missing)=>`<aside class="bb-notice">${p(message)}<a href="#notes">Grown-up notes</a></aside>`;
let locals=new WeakMap();
export function resetBeatBenchView(){locals=new WeakMap();}
function local(state,owner=''){
 let l=locals.get(state);
 if(!l||l.root!==state.beatBench||l.owner!==owner){l={root:state.beatBench,owner,panels:[],steps:Object.create(null),part:Object.create(null),letter:null,flipped:false,message:'',messagePage:null,chooser:null,review:null};locals.set(state,l);}
 return l;
}
const pageKey=v=>v.view+'/'+(v.current?.id??'');
const panel=(l,id,title,body)=>`<details data-bb-panel="${esc(id)}"${l?.panels.includes(id)?' open':''}><summary>${esc(title)}</summary>${body}</details>`;
const playable=e=>e?.status==='ready'&&e.draftStatus==='ready'&&e.helpStatus==='ready';
const pick=(w,k)=>own(w?.placements,k)?w.placements[k]:null;
const highlighted=(word,range)=>{const chars=[...word];return esc(chars.slice(0,range.start).join(''))+`<strong><u>${esc(chars.slice(range.start,range.end).join(''))}</u></strong>`+esc(chars.slice(range.end).join(''));};
function art(id,alt){
 const start='<svg viewBox="0 0 240 128" aria-hidden="true" focusable="false"><rect x="1" y="1" width="238" height="126" rx="12" fill="#f5eedc"/>';
 const paths={
 'word-cards':'<path d="M28 38q38-14 76 0v65q-38-14-76 0zm76 0q38-14 76 0v65q-38-14-76 0z" fill="#fffdf5" stroke="#315a69" stroke-width="3"/><rect x="136" y="17" width="68" height="40" rx="4" fill="#c5dcd4" stroke="#315a69" stroke-width="3"/><path d="M145 30h49m-49 12h38M42 51h44m-44 12h44m-44 12h35m29-24h28m-28 12h28" stroke="#315a69" stroke-width="3"/>',
 'returned-book':'<path d="M52 83V42h65v53H65q-13 0-13-12z" fill="#b9d5ca" stroke="#315a69" stroke-width="3"/><path d="M65 95q-12-12 0-17h52M135 55h57m-16-17 17 17-17 17" fill="none" stroke="#315a69" stroke-width="5"/><path d="M48 104h78" stroke="#b77e58" stroke-width="6"/>',
 'chair-cloth':'<path d="M62 32h65v49H62zm0 49h78v15H62zm0 15v20m65-20v20" fill="#c69a6f" stroke="#704d35" stroke-width="4"/><path d="m78 47 15 9-7 12 18 7" fill="none" stroke="#fffdf5" stroke-width="5"/><path d="m157 35 50 8-8 56-50-8z" fill="#9bbfd1" stroke="#315a69" stroke-width="3"/><path d="m165 45 31 5m-33 9 31 5m-33 9 31 5" stroke="#fffdf5" stroke-width="3"/>',
 'leaving-job':'<path d="M30 73h88v10H30zm12 10v28m64-28v28M45 32h40v31H45z" fill="#b9d5ca" stroke="#315a69" stroke-width="3"/><circle cx="153" cy="33" r="12" fill="#d9b28b"/><path d="m153 48-5 35m5-25 27 12m-30 10-17 29m16-29 23 28M184 42h32m-10-9 10 9-10 9" fill="none" stroke="#315a69" stroke-width="7"/>',
 'signature':'<path d="M46 22h118v88H46z" fill="#fffdf5" stroke="#315a69" stroke-width="3"/><path d="M60 42h82m-82 15h82m-82 25q12-19 14-4t15-4 18 1 23-5" fill="none" stroke="#315a69" stroke-width="3"/><path d="m179 24 12 6-31 61-13 10 1-17z" fill="#b77e58" stroke="#315a69" stroke-width="3"/>',
 'hen-house':'<path d="m40 57 43-35 43 35v52H40z" fill="#c69a6f" stroke="#704d35" stroke-width="3"/><path d="M65 109V72h35v37" fill="#704d35"/><ellipse cx="169" cy="87" rx="27" ry="20" fill="#fffdf5" stroke="#315a69" stroke-width="3"/><circle cx="188" cy="65" r="13" fill="#fffdf5" stroke="#315a69" stroke-width="3"/><path d="m200 64 12 6-13 4m-13-23 4-9 6 10" fill="#b77e58"/><path d="M160 104v12m19-12v12" stroke="#704d35" stroke-width="3"/><circle cx="191" cy="63" r="2" fill="#315a69"/>',
 'shared-shop':'<path d="M55 50h130v62H55z" fill="#fffdf5" stroke="#315a69" stroke-width="3"/><path d="m46 50 17-27h114l17 27z" fill="#a8c9bf" stroke="#315a69" stroke-width="3"/><path d="M70 65h28v25H70zm65 0h28v25h-28zm-28 0h18v47h-18z" fill="#b9d5e2" stroke="#315a69" stroke-width="3"/><circle cx="28" cy="80" r="9" fill="#d9b28b"/><circle cx="212" cy="80" r="9" fill="#d9b28b"/><path d="M28 92v25m0-16 17-5m167-4v25m0-16-17-5" stroke="#315a69" stroke-width="6"/>',
 'parcel':'<path d="m61 50 60-25 61 25v52l-61 23-60-23z" fill="#c69a6f" stroke="#704d35" stroke-width="3"/><path d="m61 50 60 25 61-25m-61 25v50m-32-88 61 25v27" fill="none" stroke="#f8f2dc" stroke-width="8"/><path d="m31 71 19 0m-24 14h24" stroke="#315a69" stroke-width="4"/>'
 };
 return `<figure class="bb-picture">${own(paths,id)?start+paths[id]+'</svg>':''}<figcaption>${esc(text(alt))}</figcaption></figure>`;
}
function worked(card,l,key){
 const n=Math.min(own(l.steps,key)?l.steps[key]:0,card.steps.length);
 return `<section class="bb-teaching" data-bb-teaching="${esc(key)}" tabindex="-1"><h3>${esc(card.title)}</h3>${p(card.text)}${p(card.example)}<ol>${card.steps.slice(0,n).map(t=>`<li>${esc(t)}</li>`).join('')}</ol><div class="bb-actions">${button('step-back','Previous example part',`data-bb-card="${esc(key)}"`,n===0)}${button('step','Next example part',`data-bb-card="${esc(key)}"`,n===card.steps.length)}</div></section>`;
}
function workReadout(s,w){
 if(!s||!w)return notice();
 if(s.kind==='choice'){const chosen=s.choices.find(c=>c.id===w.choice);return chosen?p(chosen.text):p(s.copy.incomplete);}
 return `<dl class="bb-record">${s.parts.map(part=>`<div><dt>${esc(part.text)}</dt><dd>${esc(s.choices.find(c=>c.id===pick(w,part.id))?.text??'Not chosen yet')}</dd></div>`).join('')}</dl>`;
}
function feedback(c){return c?`<div data-bb-stored-feedback>${Array.isArray(c.feedback)?c.feedback.map(fp).join(''):fp(c.summary)}${Array.isArray(c.rows)?c.rows.map(row=>`<p><strong>${esc(text(row.word)||text(row.id))}</strong>: ${esc(retainedText(row.feedback))}</p>`).join(''):''}${c.notice?fp(c.notice):''}</div>`:'';}
function keptCases(e,l,interactive=true){
 if(!e?.record)return '';
 return ['first','latest'].map(edition=>{
  const k=e.record[edition+'Kept'];if(k==null)return '';
  const body=e[edition+'Status']==='ready'?workReadout(e.source,k.work)+p(`Hint requested: ${k.help.hint?'yes':'no'}. Example requested: ${k.help.example?'yes':'no'}.`)+feedback(k.check)+(interactive?button('restore-case','Use this version',`data-bb-edition="${edition}"`):''):notice('This earlier kept version stays in Notes. You can still try another choice.');
  return panel(l,'case-'+e.id+'-'+edition,edition==='first'?'First kept version':'Latest kept version',body);
 }).join('');
}
function casePicker(v,l,group,fold=true){
 const entries=v.groups?.[group]??[],selected=v.current?.id??'';
 const options=rows=>rows.filter(e=>e.source).map(e=>`<option value="${esc(e.id)}"${selected===e.id?' selected':''}>${esc(e.source.title)}</option>`).join(''),earlier=entries.filter(e=>e.stored&&!e.offered);
 const picker=`<label>Choose a card<select data-bb-case-picker><option value=""${!selected?' selected':''}${selected?' disabled':''}>Choose a card</option>${options(entries.filter(e=>e.offered))}${earlier.length?`<optgroup label="Earlier cards">${options(earlier)}</optgroup>`:''}</select></label>${entries.some(e=>!e.source)?notice():''}`;
 return fold?panel(l,'chooser-'+group,'Choose a card',picker):picker;
}
function casePage(v,l){
 const group=v.view,e=l.chooser===group?null:v.current,entries=v.groups?.[group]??[];
 const navigation=`<div class="bb-actions bb-card-nav">${button('previous-case','Previous card','',!entries.some(e=>e.source))}${button('next-case','Next card','',!entries.some(e=>e.source))}</div>`;
 if(!e)return `<section><h2 id="bb-task" tabindex="-1">${esc(tabs.find(x=>x[0]===group)?.[1]??'Choose a card')}</h2>${p('Choose a card to return to. Your earlier work is still here.')}${casePicker(v,l,group,false)}${navigation}</section>`;
 if(!playable(e))return `<h2 id="bb-task" tabindex="-1">${esc(e.source?.title??'Earlier card')}</h2>${notice()}${casePicker(v,l,group,false)}${navigation}${keptCases(e,l,false)}`;
 const s=e.source,r=e.record,chosen=s.kind==='choice'?s.choices.find(c=>c.id===r.work.choice):null;
 const partId=own(l.part,e.id)?l.part[e.id]:s.parts[0]?.id,part=s.parts.find(x=>x.id===partId)??s.parts[0];
 const word=s.section==='fer'?`<p class="bb-word" data-bb-whole-word>${highlighted(s.word,s.stress)}</p><div class="bb-stress-note">${p(s.stress.note)}</div><p class="bb-construction">${esc(s.base)} + ${esc(s.ending)}</p>`:s.section==='meanings'?`<p class="bb-word" data-bb-whole-word>${esc(s.word)}</p>`:'';
 const matchChoice=s.kind==='match'?s.choices.find(c=>c.id===pick(r.work,part?.id)):null;
 const readout=chosen?`<p data-bb-chosen>${esc((s.section==='fer'?'Your chosen letters: ':s.section==='meanings'?'Your chosen meaning: ':'Your choice: ')+chosen.text+'.')}</p>`:matchChoice?`<p data-bb-chosen>${esc(part.text+': '+matchChoice.text)}</p>`:'';
 const match=s.kind==='match'?`<label>Choose a statement<select data-bb-part-picker>${s.parts.map(x=>`<option value="${esc(x.id)}"${x.id===part?.id?' selected':''}>${esc(x.text)}</option>`).join('')}</select></label><p class="bb-statement" data-bb-statement>${esc(part?.text)}</p>`:'';
 const controls=s.choices.map(c=>button('answer',c.text,`data-bb-choice="${esc(c.id)}" aria-pressed="${(s.kind==='choice'?r.work.choice:pick(r.work,part?.id))===c.id}"`)).join('');
 const review=l.review==='case-'+e.id;
 const checked=e.last?`<aside id="bb-feedback" class="bb-feedback" role="status" tabindex="-1">${e.earlier?p('Compared before your last change.'):''}${!e.earlier&&chosen&&s.section==='fer'?p(e.last.outcome==='fit'?'This matches our printed form.':'These letters differ from our printed form.'):''}${!e.earlier&&chosen&&s.section==='meanings'?p(e.last.outcome==='fit'?'This matches the meaning in our picture.':'This suggests another reading.'):''}${feedback(e.last)}</aside>`:'';
 const teaches=s.teach.map(card=>panel(l,'teach-'+s.id+'-'+card.id,card.title,worked(card,l,JSON.stringify([s.id,card.id])))).join('');
 return `<section class="bb-case">${casePicker(v,l,group)}<div class="bb-turn"><article class="bb-paper${review?' bb-review':''}"><p class="bb-context">${esc(s.contextLabel)}</p><h2 id="bb-task" tabindex="-1">${esc(s.title)}</h2>${word}${art(s.pictureId,s.pictureAlt)}${p(s.prompt)}<div class="bb-guide">${s.section==='fer'?p('Read the whole word together. Try both letter cards. The bold part is a written guide to stress.'):s.section==='meanings'?p('Read this spelling and its picture. Which meaning does it show most clearly here?'):''}${p(s.guide)}</div>${s.steps.length?`<ol class="bb-guided-steps">${s.steps.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`:''}<div class="bb-editing">${match}<div class="bb-choices" role="group" aria-label="${esc(s.kind==='match'?part?.text:s.prompt)}">${controls}</div>${button('clear-case',s.kind==='match'?'Put this statement back':'Put this choice back','',(s.kind==='choice'?r.work.choice:pick(r.work,part?.id))==null)}<div class="bb-actions bb-commit">${button('check-case','Compare','',e.checksStatus==='unreadable')}</div></div>${readout}${checked}<div class="bb-actions">${button('keep-case','Keep this version','',e.latestStatus==='unreadable')}${review?button('edit-case','Try another choice'):''}</div></article></div>${navigation}<div class="bb-actions">${button('hint','A hint')}${button('example','Read an example')}${button('skip','Skip for now')}</div>${r.help.hint?`<aside id="bb-hint" tabindex="-1" class="bb-hint">${p(s.hint)}</aside>`:''}${r.help.example?`<aside id="bb-example" tabindex="-1" class="bb-hint">${p(s.example)}</aside>`:''}${panel(l,'teaching-'+s.id,'Explore the teaching cards',teaches)}${e.retainedUnreadable?notice('These earlier comparisons stay in Notes. You can still keep an unchecked choice.'):''}${keptCases(e,l)}${group==='fer'&&v.lookalikes?.length?panel(l,'lookalikes','Offer and suffer',v.lookalikes.map(x=>`<h3>${esc(x.word)} → ${esc(x.form)}</h3>${p(x.note)}`).join('')):''}</section>`;
}
function lettersPage(v,l){
 const cards=v.letters??[],card=cards.find(x=>x.id===l.letter)??cards[0];
 if(!card)return `<h2 id="bb-task" tabindex="-1">Letter clues</h2>${notice('This earlier reading card stays in Notes but cannot be shown here.')}`;
 return `<section class="bb-letters"><label>Choose a word<select data-bb-letter-picker>${cards.map(x=>`<option value="${esc(x.id)}"${x.id===card.id?' selected':''}>${esc(x.word)}</option>`).join('')}</select></label><article class="bb-paper"><p class="bb-context">A true thing about language</p><h2 id="bb-task" tabindex="-1">Letter clues</h2><p class="bb-word" data-bb-letter-word>${highlighted(card.word,card.pair)}</p>${p(card.sentence)}${button('turn-letter','Turn this card',`aria-expanded="${l.flipped}"`)}${l.flipped?`<aside class="bb-hint" data-bb-letter-note>${p(card.note)}</aside>`:''}</article><div class="bb-actions">${button('previous-letter','Previous word')}${button('next-letter','Next word')}</div>${panel(l,'letters-teaching','A clue for ie and ei',(v.cards??[]).filter(c=>c.id==='card13').map(c=>worked(c,l,JSON.stringify(['letters',c.id]))).join(''))}</section>`;
}
function placements(s,ps){return s?`<dl class="bb-record">${s.words.map(w=>{const value=pick({placements:ps},w.id),tray=s.trays.find(t=>t.id===value);return `<div><dt>${esc(w.text)}</dt><dd>${esc(tray?.label??(value===null?'Not placed yet':'Earlier placement'))}</dd></div>`;}).join('')}</dl>`:'';}
function wallKeeps(e,l,interactive=true){return !e?.record?'':['first','latest'].map(edition=>{const k=e.record[edition+'Kept'];if(k==null)return '';return panel(l,'wall-'+edition,edition==='first'?'First kept version':'Latest kept version',e[edition+'Status']==='ready'?placements(e.source,k.placements)+p(`Requested help: ${k.helpBefore.join(', ')||'none'}.`)+feedback(k.check)+(interactive?button('restore-wall','Use these placements',`data-bb-edition="${edition}"`)+p('This changes the placements only. Your help and chosen word stay as they are.'):''):notice('This earlier kept arrangement stays in Notes. You can still arrange and compare.'));}).join('');}
function wallPage(v,l){
 const e=v.wall,s=e?.source,r=e?.record;
 if(!s||e?.status!=='ready')return `<h2 id="bb-task" tabindex="-1">The ough wall</h2>${notice('These earlier wall choices stay in Notes. Other cards and benches are open.')}`;
 const word=s.words.find(w=>w.id===r?.currentWordId),can=e.draftStatus==='ready',active=word&&e.playable.some(w=>w.id===word.id),value=word&&can?pick({placements:r.placements},word.id):null;
 const picker=`<label>Choose a word<select data-bb-word-picker><option value=""${!word?' selected':''}${word?' disabled':''}>Choose a word</option>${s.words.map(w=>`<option value="${esc(w.id)}"${word?.id===w.id?' selected':''}>${esc(w.text)}</option>`).join('')}</select></label>`;
 const navigation=`<div class="bb-actions">${button('previous-word','Previous word')}${button('next-word','Next word')}</div>`;
 const help=v.source?.wall?.help,review=l.review==='wall';
 const body=!word?`<h2 id="bb-task" tabindex="-1">The ough wall</h2>${p('Choose a word to return to. Your arrangement is still here.')}`:`<article class="bb-paper${review?' bb-review':''}"><h2 id="bb-task" tabindex="-1" class="bb-word">${esc(word.text)}</h2>${p(word.sentence)}<div class="bb-wall-editing">${word.clues.map(c=>p(c.note)).join('')}<div class="bb-trays" role="group" aria-label="Choose an anchor">${s.trays.map(t=>button('place',t.label,`data-bb-tray="${esc(t.id)}" aria-pressed="${value===t.id}"`,!active)).join('')}</div>${button('clear-wall','Not placed yet','',!active||value===null)}${!active?notice('This earlier placement stays in Notes. Other cards are ready to move.'):''}<div class="bb-actions bb-commit">${button('check-wall','Compare with these groups','',!can||!e.playable.length||e.checksStatus==='unreadable')}</div></div>${e.last?`<aside id="bb-feedback" class="bb-feedback" role="status" tabindex="-1">${e.earlier?p('Compared before your last change.'):''}${feedback(e.last)}</aside>`:''}<div class="bb-actions">${button('keep-wall','Keep this arrangement','',!can||!e.playable.length||e.latestStatus==='unreadable')}${review?button('edit-wall','Try another arrangement'):''}</div></article>`;
 return `<section class="bb-wall">${picker}${body}${navigation}${panel(l,'wall-instructions','About these groups',p('Say these words together if you like. Try groups with endings that rhyme. The notes show this collection\'s printed groups. You can keep another arrangement.')+s.trays.map(t=>`<h3>${esc(t.label)}</h3>${p(t.description)}`).join(''))}${panel(l,'wall-overview','The whole wall',placements(s,r?.placements??{}))}<div class="bb-actions">${button('wall-hint','A hint','',!can||!text(help?.hint).trim())}${button('wall-example','Read an example','',!can||!text(help?.example).trim())}</div>${can&&r.help.includes('hint')?`<aside id="bb-hint" class="bb-hint" tabindex="-1">${p(help?.hint)}</aside>`:''}${can&&r.help.includes('example')?`<aside id="bb-example" class="bb-hint" tabindex="-1">${p(help?.example)}</aside>`:''}${e.partial?notice('This shows the readable part of your earlier wall. Nothing has been removed from Notes.'):''}${wallKeeps(e,l,can)}${panel(l,'wall-teaching','One string, several families',(v.cards??[]).filter(c=>c.id==='card15').map(c=>worked(c,l,JSON.stringify(['wall',c.id]))).join(''))}</section>`;
}
export function beatBenchPage(state,owner=''){
 const savedView=C.beatBenchView(state),l=local(state,owner),v=savedView.view==='choose'&&l.chooser?{...savedView,view:l.chooser,current:null}:savedView,s=v.status==='new'?makeBeatBenchSource():v.source;
 const header=`<header class="bb-heading"><a href="#words">Word Garden</a><h1>${esc(text(s?.title)||'The Beat Bench')}</h1></header>`;
 if(v.status==='unsupported')return `<section class="bb-room" data-beat-bench-root>${header}${notice(rootUnavailable)}</section>`;
 const body=v.view==='letters'?lettersPage(v,l):v.view==='wall'?wallPage(v,l):['fer','meanings','practice'].includes(v.view)?casePage(v,l):`<section class="bb-arrival"><h2 id="bb-task" tabindex="-1">A place for word discoveries</h2>${art('word-cards','An open book beside two printed letter cards.')}${p(v.status==='new'?'The librarian is writing to the library downriver. Try word cards, look for letter clues, and make meanings clear.':s?.story?.hook)}${(v.cards??[]).map(c=>panel(l,'arrival-'+c.id,c.title,worked(c,l,JSON.stringify(['arrival',c.id])))).join('')}</section>`;
 return `<section class="bb-room" data-beat-bench-root>${header}<nav class="bb-tabs" aria-label="The Beat Bench">${tabs.map(([id,label])=>button('bench',label,`data-bb-view="${id}" aria-pressed="${v.view===id}"`)).join('')}</nav><p data-bb-saving></p>${body}<p id="bb-status" role="status" tabindex="-1">${esc(l.messagePage===pageKey(savedView)?l.message:'')}</p>${v.view!=='choose'?button('back','Back to the benches'):''}${panel(l,'story','A story from Willowbank',p(s?.story?.short)+p(s?.story?.longer)+p(s?.story?.note))}${panel(l,'paper','Try a paper library notice',p(s?.offscreen?.text))}<p class="bb-dictionary">Rules usually work. A dictionary has the last word.</p><footer><a href="#words/signs">Market Signs</a><a href="#library/word-list">The Word List Shelf</a><a href="#words">Word Garden</a><a href="#notes">Grown-up notes</a></footer></section>`;
}
function notesCases(v){return (v.cases??[]).filter(e=>e.stored||e.record).map(e=>`<section data-bb-notes-case="${esc(e.id)}"><h3>${esc(e.source?.title??e.id)}</h3>${e.source?p(e.source.prompt)+p(e.source.guide):notice()}<h4>Current work</h4>${e.draftStatus==='ready'?workReadout(e.source,e.record.work):notice()}${e.helpStatus==='ready'?p(`Hint requested: ${e.record.help.hint?'yes':'no'}. Example requested: ${e.record.help.example?'yes':'no'}.`):p('Earlier help details stay in the full retained work.')}<h4>Retained comparisons</h4>${(e.checks??[]).map(c=>workReadout(e.source,c.work)+p(`Hint requested: ${c.help.hint?'yes':'no'}. Example requested: ${c.help.example?'yes':'no'}.`)+feedback(c)).join('')}${e.retainedUnreadable||e.checksStatus==='unreadable'?p('Some earlier comparisons stay in the full retained work.'):''}${keptCases(e,null,false)}</section>`).join('');}
export function beatBenchNotes(state){
 if(!own(state,'beatBench'))return '';
 const v=C.beatBenchView(state),e=v.wall;
 const wall=e?.record?`<section data-bb-notes-wall><h3>The ough wall</h3>${e.source?e.source.words.map(w=>p(w.text+' — '+(w.sentence??''))).join(''):notice()}<h4>Current arrangement</h4>${e.draftStatus==='ready'?placements(e.source,e.record.placements):p('Earlier placements stay in the full retained work.')}${Array.isArray(e.record.help)?p('Requested help: '+e.record.help.filter(x=>typeof x==='string').join(', ')):p('Earlier help details stay in the full retained work.')}<h4>Retained comparisons</h4>${(e.checks??[]).map(c=>placements(e.source,c.placements)+p('Requested help: '+c.helpBefore.join(', '))+feedback(c)).join('')}${e.retainedUnreadable||e.checksStatus==='unreadable'?p('Some earlier comparisons stay in the full retained work.'):''}${wallKeeps(e,null,false)}</section>`:'';
 return `<details class="panel" data-beat-bench-notes><summary>The Beat Bench: supported word study</summary>${p(v.source?.grownup)}${v.status==='unsupported'?notice(rootUnavailable):notesCases(v)+wall}<details><summary>Full retained Beat Bench work</summary><pre>${esc(json(state.beatBench))}</pre></details><a href="#library/beat">The Beat Bench</a></details>`;
}
export const beatBenchEntry=()=>'<a class="secondary" href="#library/beat">The Beat Bench: word stress and spelling</a>';
export function bindBeatBench(state,ctx={}){
 const root=document.querySelector('[data-beat-bench-root]');if(!root)return;
 const owner=ctx.explorerId?.()??'',l=local(state,owner),owned=state.beatBench,material=json(owned),options={canExport:ctx.canExport};
 const visible=el=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden'&&getComputedStyle(el).display!=='none';
 const film=()=>!!document.querySelector('dialog.welcome-film[open]')||[...document.querySelectorAll('.film-stage,.film-overlay')].some(el=>!el.closest('[hidden],[inert]')&&visible(el));
 const live=el=>root.isConnected&&root===document.querySelector('[data-beat-bench-root]')&&el.isConnected&&root.contains(el)&&!el.disabled&&!document.hidden&&!el.closest('[hidden],[inert],details:not([open])')&&visible(el)&&location.hash==='#library/beat'&&(!ctx.notebook||ctx.notebook()===state)&&(ctx.explorerId?.()??'')===owner&&ctx.isActive?.()!==false&&state.beatBench===owned&&json(owned)===material&&locals.get(state)===l&&!film();
 const remember=()=>{l.panels=[...root.querySelectorAll('[data-bb-panel][open]')].map(el=>el.dataset.bbPanel);};
 const focusVisible=selector=>{
  const next=document.querySelector('[data-beat-bench-root]'),target=next?.querySelector(selector)??next?.querySelector('#bb-task');if(!target)return;
  const sticky=document.querySelector('header.garden-header'),height=sticky&&getComputedStyle(sticky).position==='sticky'?sticky.getBoundingClientRect().bottom:100;
  target.style.scrollMarginTop=Math.max(100,height+16)+'px';target.focus({preventScroll:true});
  if(selector==='#bb-feedback'){const task=next.querySelector('#bb-task'),top=task?.getBoundingClientRect().top??0,bottom=target.getBoundingClientRect().bottom;if(top<height||bottom>innerHeight)task?.scrollIntoView({block:'start',behavior:'instant'});}
  else if(target.getBoundingClientRect().top<height||target.getBoundingClientRect().bottom>innerHeight)target.scrollIntoView({block:'start',behavior:'instant'});
 };
 const redraw=(selector='#bb-task',after)=>{remember();after?.();ctx.stopSpeech?.();ctx.render?.();focusVisible(selector);};
 const commit=(fn,{message='',focus='#bb-task',after}={})=>{
  const result=fn();if(!result.ok){l.message=result.error==='capacity'?'This change could not fit in Notes. Your earlier work is still here.':result.error==='collection'?(C.beatBenchView(state).view==='wall'?'This wall has many earlier help notes. They stay in Notes; try another card.':'These earlier cards stay in Notes. Choose another saved card or bench.'):missing;l.messagePage=pageKey(C.beatBenchView(state));return redraw('#bb-status');}
  l.root=state.beatBench;const saved=result.changed===false?null:ctx.save?.();l.message=[message,saved?.enabled===false||saved?.ok===false?saved.message||'':''].filter(Boolean).join(' ');l.messagePage=pageKey(C.beatBenchView(state));redraw(l.message?'#bb-status':focus,after);
 };
 const chooseCase=id=>{if(!id)return;commit(()=>C.openBeatCase(state,id,options),{after:()=>{l.chooser=null;l.review=null;l.panels=l.panels.filter(id=>!id.startsWith('chooser-'));}});};
 root.querySelector('[data-bb-case-picker]')?.addEventListener('change',e=>{if(live(e.currentTarget)&&e.currentTarget.value)chooseCase(e.currentTarget.value);});
 root.querySelector('[data-bb-part-picker]')?.addEventListener('change',e=>{if(!live(e.currentTarget))return;const current=C.beatBenchView(state).current;if(current?.source.parts.some(p=>p.id===e.currentTarget.value)){l.part[current.id]=e.currentTarget.value;redraw('[data-bb-part-picker]');}});
 root.querySelector('[data-bb-letter-picker]')?.addEventListener('change',e=>{if(live(e.currentTarget)&&C.beatBenchView(state).letters.some(c=>c.id===e.currentTarget.value)){l.letter=e.currentTarget.value;l.flipped=false;redraw('[data-bb-letter-picker]');}});
 root.querySelector('[data-bb-word-picker]')?.addEventListener('change',e=>{if(live(e.currentTarget)&&e.currentTarget.value){l.review=null;commit(()=>C.selectBeatWallWord(state,e.currentTarget.value,options));}});
 root.querySelectorAll('[data-bb-action]').forEach(el=>el.addEventListener('click',()=>{
  if(!live(el))return;const a=el.dataset.bbAction,readView=C.beatBenchView(state),v=readView.view==='choose'&&l.chooser?{...readView,view:l.chooser,current:null}:readView,e=v.current,s=e?.source,w=v.wall?.source?.words.find(w=>w.id===v.wall.record?.currentWordId);
  if(a==='bench'||a==='back')return commit(()=>C.openBeatBench(state,a==='back'?'choose':el.dataset.bbView,options),{after:()=>{l.chooser=null;l.review=null;}});
  if(a==='previous-case'||a==='next-case'){const entries=(v.groups?.[v.view]??[]).filter(x=>x.source),at=l.chooser===v.view?-1:entries.findIndex(x=>x.id===e?.id);if(entries.length)chooseCase(entries[at<0?(a==='next-case'?0:entries.length-1):(at+(a==='next-case'?1:-1)+entries.length)%entries.length].id);return;}
  if(a==='answer'||a==='clear-case'){const part=s?.kind==='match'?(s.parts.find(p=>p.id===(own(l.part,e.id)?l.part[e.id]:null))??s.parts[0])?.id:null;return commit(()=>C.answerBeatCase(state,e?.id,a==='clear-case'?null:el.dataset.bbChoice,part,options),{focus:a==='answer'?`[data-bb-choice="${el.dataset.bbChoice}"]`:'#bb-task'});}
  if(a==='hint'||a==='example')return commit(()=>C.useBeatHelp(state,e?.id,a,options),{focus:a==='hint'?'#bb-hint':'#bb-example'});
  if(a==='check-case')return commit(()=>C.checkBeatCase(state,e?.id,options),{focus:'#bb-feedback',after:()=>{l.review='case-'+e.id;}});
  if(a==='edit-case'){l.review=null;return redraw('#bb-task');}
  if(a==='keep-case')return commit(()=>C.keepBeatCase(state,e?.id,options),{message:'This version is in your Notes. You can try another.'});
  if(a==='restore-case')return commit(()=>C.restoreBeatCase(state,e?.id,el.dataset.bbEdition,options));
  if(a==='skip')return commit(()=>C.skipBeatCase(state,e?.id,options),{message:'Your choice stays here. Choose another card or come back.',after:()=>{l.chooser=s?.section;}});
  if(a==='turn-letter'){l.flipped=!l.flipped;return redraw('[data-bb-action="turn-letter"]');}
  if(a==='previous-letter'||a==='next-letter'){const cards=v.letters??[],at=Math.max(0,cards.findIndex(c=>c.id===l.letter));if(cards.length){l.letter=cards[(at+(a==='next-letter'?1:-1)+cards.length)%cards.length].id;l.flipped=false;redraw('#bb-task');}return;}
  if(a==='previous-word'||a==='next-word'){l.review=null;const words=v.wall?.source?.words??[],at=words.findIndex(x=>x.id===w?.id);if(words.length)commit(()=>C.selectBeatWallWord(state,words[at<0?(a==='next-word'?0:words.length-1):(at+(a==='next-word'?1:-1)+words.length)%words.length].id,options));return;}
  if(a==='place'||a==='clear-wall')return commit(()=>C.placeBeatWallCard(state,w?.id,a==='clear-wall'?null:el.dataset.bbTray,options),{focus:a==='place'?`[data-bb-tray="${el.dataset.bbTray}"]`:'#bb-task'});
  if(a==='wall-hint'||a==='wall-example')return commit(()=>C.useBeatWallHelp(state,a==='wall-hint'?'hint':'example',options),{focus:a==='wall-hint'?'#bb-hint':'#bb-example'});
  if(a==='check-wall')return commit(()=>C.checkBeatWall(state,options),{focus:'#bb-feedback',after:()=>{l.review='wall';}});
  if(a==='edit-wall'){l.review=null;return redraw('#bb-task');}
  if(a==='keep-wall')return commit(()=>C.keepBeatWall(state,options),{message:'Your arrangement is kept. You can try another.'});
  if(a==='restore-wall')return commit(()=>C.restoreBeatWall(state,el.dataset.bbEdition,options));
  if(a==='step'||a==='step-back'){
   let key;try{key=JSON.parse(el.dataset.bbCard);}catch{return;}if(!Array.isArray(key)||key.length!==2)return;
   const cards=key[0]===e?.id?s.teach:v.cards,card=cards?.find(c=>c.id===key[1]);if(!card)return;
   const address=el.dataset.bbCard,n=own(l.steps,address)?l.steps[address]:0;l.steps[address]=Math.max(0,Math.min(card.steps.length,n+(a==='step'?1:-1)));return redraw(`[data-bb-teaching='${address.replace(/'/g,'\\\'')}']`);
  }
 }));
 const active=root.querySelector('.bb-tabs [aria-pressed="true"]');if(active){const nav=active.parentElement,rect=active.getBoundingClientRect(),nr=nav.getBoundingClientRect();if(rect.left<nr.left)nav.scrollLeft-=nr.left-rect.left;else if(rect.right>nr.right)nav.scrollLeft+=rect.right-nr.right;}
}
