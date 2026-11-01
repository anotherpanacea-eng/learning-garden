import {soundMessageCopy as T} from './word-room-sounds-content.mjs';
import {soundMessagesView,enterSoundMessages,leaveSoundMessages,chooseSoundCase,actSoundCase,currentComparison,soundKeep} from './word-room-sounds-core.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,label,extra='')=>`<button type="button" data-wrs-action="${action}" ${extra}>${esc(label)}</button>`;
const names=['First place','Middle place','Last place'];
const path={
  cap342:'<path d="M270 50v130m0-65h-65" fill="none" stroke="#ba865e" stroke-width="10"/><path d="M71 115q1-64 83-64 73 0 81 64Z" fill="#dfb553"/><path d="M73 114q-26 11-35 32 77 8 151-16l45-15" fill="#69a7ab"/><path d="M152 53v58m-40-48q-16 22-17 48" fill="none"/>',
  cot342:'<path d="m44 105 204-25 25 43-203 26Z" fill="#8db9ad"/><path d="m49 105 20 55m-7-8 183-23m-9-48 13 65M68 147l-13 23m193-44 19 25" fill="none" stroke-width="7"/><path d="m65 102 48-6 11 25-49 6Z" fill="#fffdf3"/>',
  map342:'<path d="m53 61 66-17 76 18 67-16v111l-67 16-76-18-66 17Z" fill="#f9e9ba"/><path d="M119 45v109m76-92v110" fill="none"/><path d="m76 132 49-28 49 16 63-41" fill="none" stroke="#b44e40" stroke-width="4" stroke-dasharray="6 6"/><path d="m215 100 12-23 13 19m-17-10v25" fill="none" stroke="#397958" stroke-width="5"/><path d="m146 81 15-13 16 14v17h-31Z" fill="#69a7ab"/>',
};
const svg=(body,alt,cls='')=>`<svg class="wrs-picture ${cls}" viewBox="0 0 320 200" role="img" aria-label="${esc(alt)}"><path d="M8 10h304v180H8Z" fill="#eaf4ef"/><path d="M8 174h304v16H8Z" fill="#ba865e"/><g stroke="#183430" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
const picture=(w,oldPicture)=>Object.hasOwn(path,w.art)?svg(path[w.art],w.alt):oldPicture(w,true);
function messagePicture(m){
 if(m.art!=='show-message342'||typeof m.alt!=='string'||!m.alt||m.alt.length>4000)return `<p>Picture unavailable. ${typeof m.alt==='string'&&m.alt.length<=4000?esc(m.alt):'Read the note together.'}</p>`;
 return svg('<ellipse cx="69" cy="167" rx="49" ry="14" fill="#dfb553"/><ellipse cx="73" cy="147" rx="26" ry="22" fill="#a8a6b0"/><path d="m46 128 5-17 15 12 16-8 9 21Z" fill="#a8a6b0"/><circle cx="60" cy="132" r="2"/><circle cx="78" cy="132" r="2"/><path d="M97 159q38 3 20-31" fill="none" stroke-width="7"/><path d="m140 89 115-9 23 37-115 10Z" fill="#8db9ad"/><path d="m146 94 17 54m92-67 14 54m-108-8-13 23m121-32 13 23" fill="none" stroke-width="6"/><path d="M169 86q5-28 30-28 23 0 25 27l-34 6Z" fill="#dfb553"/><path d="m169 85-18 13 40-7" fill="#69a7ab"/><path d="M230 149h64v31q-31 11-64 0Z" fill="#b7c9ca"/><ellipse cx="262" cy="149" rx="32" ry="9" fill="#dfe9e4"/><path d="m250 150-2-43 18-8 11 49" fill="#f9e9ba"/><path d="m255 113 14 16m-15 3 15-3" fill="none" stroke="#b44e40"/>',m.alt,'wrs-message-picture');
}
function icon(position){return `<span class="wrs-icon" aria-hidden="true">${[0,1,2].map(i=>`<span class="${i===position?'wrs-changed':''}">${i+1}</span>`).join('')}</span>`;}
function chooser(v){
 return `<h2 id="wr-task" tabindex="-1">Choose a label game</h2><p>${esc(T.story)}</p><p>${esc(T.chooser)}</p><div class="wrs-cases">${v.cases.map(x=>x.source?`<article>${icon(x.source.position)}<h3>${esc(x.source.title)}</h3>${x.earlier?'<p>Earlier label</p>':''}<div class="wrs-modes">${['listen','read'].map(mode=>`<button type="button" data-wrs-case="${esc(x.id)}" data-wrs-mode="${mode}">${mode==='listen'?'Listen and build':'Look and read'}</button>`).join('')}</div></article>`:`<article><p>${esc(T.unavailable)}</p></article>`).join('')}</div>${v.complete?'<p class="wr-ready">Our labels are ready to revisit. What shall we read together?</p>':''}`;
}
function keeps(w){
 return `<details class="wrs-keeps"><summary>Our kept labels</summary>${[['firstKept','First kept label','restoreFirst'],['latestKept','Latest kept label','restoreLatest']].map(([key,title,action])=>{
  if(!Object.hasOwn(w,key))return '';
  const k=w[key];return soundKeep(k)?`<div class="wrs-kept"><h3>${title}</h3><p class="wrs-kept-letters">${k.slots.map(l=>esc(l??'empty')).join(' · ')}</p>${button(action,'Use these kept letters')}</div>`:`<p>${esc(T.unavailable)}</p>`;
 }).join('')||'<p>No label kept yet.</p>'}</details>`;
}
const wordLabel=w=>`<p class="wrs-whole-word" data-wrs-word>${esc(w.label)}</p>`;
function pairView(w){
 const p=w.page==='example'?w.source.example:w.source;
 return `<h2 id="wr-task" tabindex="-1">${esc(w.page==='example'?p.title:'Change one sound')}</h2><div class="wrs-pair">${[p.left,p.right].map((word,side)=>`<div class="${w.frame===(side===0?0:2)?'wrs-current-side':''}" aria-label="${esc(word.label)}: three letter places"><div class="wrs-print-places">${word.letters.map((l,i)=>`<span class="${w.frame===1&&i===p.position?'wrs-changed':''}">${esc(l)}</span>`).join('')}</div></div>`).join('')}</div><p class="wrs-step" data-wrs-step>${esc(p.frames[w.frame])}</p><div class="wr-actions">${button('prev','Previous step',w.frame===0?'disabled':'')}${button('next','Next step',w.frame===2?'disabled':'')}${button('back','Back to my label')}</div>`;
}
function work(w,oldPicture){
 if(w.page==='setup')return `<h2 id="wr-task" tabindex="-1">Your partner’s turn</h2><div class="wrs-pass">${icon(null)}<p>${esc(T.setup)}</p>${button('partner','Show partner card','class="wr-primary"')}</div>`;
 if(w.page==='partner')return `<h2 id="wr-task" tabindex="-1">For the reading partner</h2><div class="wrs-pass">${wordLabel(w.source.right)}<p>${esc(w.source.right.guidance)}</p>${button('hidePartner','Hide card and build','class="wr-primary"')}</div>`;
 if(['example','contrast'].includes(w.page))return pairView(w);
 if(w.page==='comparison'){
  const c=currentComparison(w);
  return `<h2 id="wr-task" tabindex="-1">Compare my label</h2>${c?`<div class="wrs-comparison"><div><h3>Your label</h3><p class="wrs-kept-letters">${c.slots.map(l=>esc(l??'empty')).join(' · ')}</p></div><div><h3>Our card</h3>${wordLabel(w.source.right)}</div></div><p>${esc(T[c.result])}</p>`:`<p>${esc(T.unavailable)}</p>`}${button('back','Back to my label')}`;
 }
 const r=w.source.right,visible=w.mode==='read'||w.help.word;
 return `<h2 id="wr-task" tabindex="-1">${w.mode==='read'?'Look and read':'Build the label'}</h2><p class="wrs-instruction">${esc(w.mode==='read'?T.read:T.build)}</p><div class="wrs-stage">${visible?wordLabel(r):''}${w.help.picture?`<figure>${picture(r,oldPicture)}<figcaption>${esc(r.meaning)}</figcaption></figure>`:''}${w.mode==='listen'?`<div class="wrs-label" role="group" aria-label="Three letter places">${w.slots.map((l,i)=>`<button type="button" id="wrs-place-${i}" data-wrs-action="place" data-wrs-value="${i}" aria-pressed="${w.place===i}" aria-label="${names[i]}: ${esc(l??'empty')}"><span>${i+1}</span><strong>${esc(l??'·')}</strong></button>`).join('')}</div><div class="wrs-bank" role="group" aria-label="Letter bank">${w.source.alphabet.map(l=>button('letter',l,`data-wrs-value="${esc(l)}"`)).join('')}</div><div class="wr-edit">${button('clearPlace','Clear this place')}${button('clear','Clear label')}${w.slots.every(l=>l===null)?button('base','Start with the first word'):''}</div>`:button('build','Build this label','class="wr-primary"')}</div><div class="wr-actions wrs-primary-actions">${w.mode==='listen'?`${button('keep','Keep my label','class="wr-primary"')}${button('compare','Compare my label')}`:''}${!visible?button('word','Show word'):''}${!w.help.picture?button('picture','Show picture'):''}</div><div class="wr-help">${button('contrast','Change one sound')}${button('example','Show an example')}</div>${keeps(w)}`;
}
function message(m){
 if(!m)return `<h2 id="wr-task" tabindex="-1">The show message</h2><p>${esc(T.unavailable)}</p>${button('caseBack','Back to my label')}`;
 let end=0,passage='';for(const t of m.tokens){passage+=esc(m.text.slice(end,t.start))+`<span class="${t.role==='target'?'wr-target':''}" data-wrs-token="${t.role}">${esc(t.text)}</span>`;end=t.end;}passage+=esc(m.text.slice(end));
 return `<h2 id="wr-task" tabindex="-1">${esc(m.title)}</h2><p>Underlined words are our prop labels, including an earlier one. Your partner can read any words with you.</p><div class="wrs-message">${messagePicture(m)}<p class="wr-passage">${passage}</p><p class="wr-discuss">${esc(m.prompt)}</p></div><div class="wr-actions">${button('caseBack','Back to my label')}<a href="#loft">Make another scene in Story Loft</a></div>`;
}
export function soundMessagesPage(book,oldPicture){
 const v=soundMessagesView(book);
 if(!v.active)return '';
 const content=v.page==='message'?message(v.message):v.page==='case'?(v.current?work(v.current.record,oldPicture):`<h2 id="wr-task" tabindex="-1">An earlier label</h2><p>${esc(T.unavailable)}</p>${button('choose','Choose another game')}`):chooser(v);
 return `<section class="wr-room wrs-room" data-word-room-root data-wr-sounds-active><header class="wr-header">${button('leave','Back to prop labels')}<div><h1>${esc(T.title)}</h1></div></header>${content}<p id="wr-status" role="status" aria-live="polite" aria-atomic="true" tabindex="-1"></p><nav class="wrs-bottom" aria-label="Sound label games">${v.page!=='choose'?button('choose','Choose another game'):''}${v.page!=='message'?button('message','Read the show message'):''}<a href="#notes">Grown-up notes</a></nav><p class="wrs-reminder">${esc(T.reminder)}</p><details class="wrs-grownup"><summary>For grown-ups</summary><p>${esc(T.grownup)}</p></details></section>`;
}
export const soundMessagesEntry=()=>button('enter',T.entry,'class="wr-primary"');
export function soundMessagesNotes(book){
 if(!book?.wordRoom||!Object.hasOwn(book.wordRoom,'soundMessages'))return '';
 const v=soundMessagesView(book),helpNames={partnerCard:'Partner card',word:'Word',picture:'Picture',example:'Example',contrast:'Sound comparison',base:'Starting word'};
 if(v.status!=='ready')return `<details class="panel"><summary>Sound-changing prop labels</summary><p>${esc(T.unavailable)}</p></details>`;
 return `<details class="panel"><summary>Sound-changing prop labels</summary><p>${esc(T.notes)}</p><p>Shared show message: ${v.root.sharedHelp.message?'opened':'not opened here'}.</p>${v.cases.filter(x=>x.record).map(x=>`<section><h3>${esc(x.source.title)}</h3><p>Waiting letters: ${x.record.slots.map(l=>esc(l??'empty')).join(' · ')}.</p><p>Task-local help: ${Object.entries(helpNames).filter(([k])=>x.record.help[k]).map(([,title])=>title).join(', ')||'none disclosed in this case'}.</p>${[['firstKept','First kept'],['latestKept','Latest kept']].map(([key,title])=>Object.hasOwn(x.record,key)?`<p>${title}: ${soundKeep(x.record[key])?x.record[key].slots.map(l=>esc(l??'empty')).join(' · '):'earlier material unavailable'}.</p>`:'').join('')}</section>`).join('')}</details>`;
}
export function bindSoundMessages(book,ctx,root,events){
 const owner=ctx.explorerId(),initialRoot=book.wordRoom;
 const owned=()=>root.isConnected&&document.querySelector('[data-word-room-root]')===root&&ctx.notebook()===book&&ctx.explorerId()===owner&&ctx.isActive()&&location.hash==='#words/props';
 const live=el=>owned()&&book.wordRoom===initialRoot&&el.isConnected&&root.contains(el)&&!el.closest('details:not([open])')&&(!root.querySelector('dialog[open]')||!!el.closest('dialog[open]'));
 const say=msg=>{if(!owned())return;const n=root.querySelector('#wr-status');if(n){n.textContent=msg;n.focus();}};
 const run=(el,fn,focus='#wr-task')=>{
  if(!live(el))return;
  const result=fn({canExport:ctx.canExport,isCurrent:()=>live(el)});
  if(!result.ok){if(result.error!=='stale')say(result.error==='capacity'?T.capacity:T.unavailable);return;}
  const saved=result.changed===false?null:ctx.save();
  if(!owned())return;
  const note=saved?.ok===false?'Kept in this tab, but browser saving failed. Download Grown-up notes before leaving.':saved?.enabled===false?'Kept in this tab; browser saving is off. Download Grown-up notes before leaving.':'';
  ctx.render();if(ctx.notebook()!==book||ctx.explorerId()!==owner||!ctx.isActive()||location.hash!=='#words/props')return;
  const next=document.querySelector('[data-word-room-root]');if(!next)return;
  const status=next.querySelector('#wr-status');if(status)status.textContent=[result.notice==='kept'?T.kept:'',note].filter(Boolean).join(' ');
  if(focus==='place')focus='#wrs-place-'+(soundMessagesView(book).current?.record.place??0);
  (next.querySelector(focus)||next.querySelector('#wr-task'))?.focus();
 };
 root.querySelectorAll('[data-wrs-case]').forEach(el=>el.addEventListener('click',()=>run(el,o=>chooseSoundCase(book,el.dataset.wrsCase,el.dataset.wrsMode,o)),{signal:events.signal}));
 root.querySelectorAll('[data-wrs-action]').forEach(el=>el.addEventListener('click',()=>{
  const action=el.dataset.wrsAction;
  if(action==='enter')return run(el,o=>enterSoundMessages(book,o));
  if(action==='leave')return run(el,o=>leaveSoundMessages(book,o));
  const value=action==='place'?Number(el.dataset.wrsValue):el.dataset.wrsValue;
  run(el,o=>actSoundCase(book,action,value,o),['place','letter','clearPlace','clear','base'].includes(action)?'place':'#wr-task');
 },{signal:events.signal}));
 window.addEventListener('hashchange',()=>{if(location.hash!=='#words/props')events.abort();},{signal:events.signal});
 ctx.stopSpeech?.();
}
