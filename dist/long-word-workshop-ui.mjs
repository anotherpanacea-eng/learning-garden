import {LONG_WORD_SOURCE,LONG_WORD_GROWN_UP} from './long-word-workshop-content.mjs';
import * as C from './long-word-workshop-core.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=x=>typeof x==='string'?x:'';
const p=x=>`<p>${esc(text(x))}</p>`;
const json=x=>{try{return JSON.stringify(x,null,2);}catch{return '';}};
const button=(action,label,attrs='',disabled=false)=>`<button type="button" data-lww-action="${action}" ${attrs}${disabled?' disabled':''}>${esc(label)}</button>`;
const read=(kind,label)=>`<button type="button" class="lww-read" data-lww-read="${kind}" data-speak="">${esc(label)}</button>`;
const notice=(c,key='unavailable')=>`<aside class="lww-notice">${p(c[key]||LONG_WORD_SOURCE.copy[key]||LONG_WORD_SOURCE.copy.unavailable)}<a href="#notes">${esc(c.notes||LONG_WORD_SOURCE.copy.notes)}</a></aside>`;
let locals=new WeakMap();
export function resetLongWordView(){locals=new WeakMap();}
function local(state,owner=''){
 let l=locals.get(state);
 if(!l||l.root!==state.longWordWorkshop||l.owner!==owner){l={root:state.longWordWorkshop,owner,panels:[],steps:{},selected:null,message:'',stamp:false};locals.set(state,l);}
 return l;
}
function panel(l,id,label,body){return `<details data-lww-panel="${esc(id)}"${l.panels.includes(id)?' open':''}><summary>${esc(label)}</summary>${body}</details>`;}
const copy=v=>v.status==='new'?LONG_WORD_SOURCE.copy:(v.source?.copy??{});
const playable=e=>e?.status==='ready'&&e.draftStatus==='ready'&&e.helpStatus==='ready';
const ordered=(s,order)=>(order??[]).map(id=>s.pieces.find(x=>x.id===id)?.text??id).join('');
function example(l,key,title,steps,c){
 const n=Math.min(l.steps[key]??1,steps.length);
 return `<section class="lww-example" data-lww-example="${esc(key)}" tabindex="-1"><h3>${esc(title)}</h3><ol>${steps.slice(0,n).map(t=>`<li>${esc(t)}</li>`).join('')}</ol>${button('step',c.nextStep,`data-lww-key="${esc(key)}"`,n>=steps.length)}</section>`;
}
function checkBody(check,c,kind){
 if(!check)return p(c.uncheckedKeep);
 if(kind==='word')return `<p class="lww-letter-text">${esc(check.text)}</p><p>${esc(c.printedWord)}: ${esc(check.target)}</p>${p(check.feedback)}`;
 if(kind==='glossary')return p(check.summary)+(check.notice?p(check.notice):'')+(check.rows??[]).map(row=>`<p><strong>${esc(row.before)}</strong> → ${esc(row.chosen??'—')}</p>${p(row.feedback)}`).join('');
 return (check.feedback??[]).map(p).join('');
}
function draftBody(s,k,kind,c){
 if(kind==='word')return `<p class="lww-letter-text">${esc(ordered(s,k.order))}</p>`;
 if(kind==='glossary')return (s.lines??[]).map(line=>{const selected=k.picks?.[line.id],choice=line.choices.find(x=>x.id===selected);return selected!=null&&!choice?p(line.before)+`<pre>${esc(json(selected))}</pre>`:p(line.frame[0]+(choice?.text??line.flagged)+line.frame[1]);}).join('');
 return p(s.choices.find(x=>x.id===k.work?.choice)?.text??c.jobIncomplete);
}
function keeps(e,l,kind,c,interactive=true){
 if(!e?.record)return '';
 return ['first','latest'].map(edition=>{
  const k=e.record[edition+'Kept'];if(k==null)return '';
  const body=e[edition+'Status']==='ready'?draftBody(e.source,k,kind,c)+checkBody(k.check,c,kind)+(interactive?button('restore-'+kind,kind==='word'?c.restoreWord:kind==='glossary'?c.restoreGlossary:c.putBack,`data-lww-edition="${edition}"`):''):notice(c)+`<pre>${esc(json(k))}</pre>`;
  return interactive?panel(l,kind+'-'+e.id+'-'+edition,c[edition],body):`<details><summary>${esc(c[edition]||LONG_WORD_SOURCE.copy[edition])}</summary>${body}</details>`;
 }).join('');
}
function wordPage(v,l,c){
 const e=v.currentWord;
 const picker=`<label>${esc(c.wordPicker)}<select data-lww-word-picker>${v.words.map(w=>`<option value="${esc(w.id)}"${e?.id===w.id?' selected':''}>${esc(w.source?.text??w.id)}</option>`).join('')}</select></label>`;
 if(!playable(e))return picker+notice(c)+(v.wordsPartial?notice(c,'partialNotice'):'');
 const s=e.source,r=e.record,index=v.words.indexOf(e),selected=r.order.indexOf(l.selected),key='word-'+e.id;
 return `<section class="lww-word"><div class="lww-picker">${picker}<div class="lww-actions">${button('previous-word',c.previousWord,'',index<=0)}${button('next-word',c.nextWord,'',index>=v.words.length-1)}</div></div><div class="lww-workbench"><article class="lww-paper"><h2 id="lww-task" tabindex="-1">${esc(s.text)}</h2>${p(s.meaning)}${p(s.sentence)}${read('sentence',c.hearSentence)}${p(s.clue)}</article><section class="lww-building"><h3>${esc(c.yourWord)}</h3><div class="lww-rail" role="group" aria-label="${esc(c.yourWord)}">${r.order.map((id,i)=>button('select-piece',s.pieces.find(x=>x.id===id)?.text??id,`class="lww-piece" data-lww-piece="${esc(id)}" aria-pressed="${l.selected===id}" aria-label="${esc(s.pieces.find(x=>x.id===id)?.text??id)}, ${i+1}"`)).join('')||`<p>${esc(c.wordEmpty)}</p>`}</div><div class="lww-actions">${button('left',c.moveLeft,'',selected<=0)}${button('right',c.moveRight,'',selected<0||selected>=r.order.length-1)}${button('remove',c.putBack,'',selected<0)}</div><h3>${esc(c.pieces)}</h3><div class="lww-pieces">${s.pieces.map(x=>button('append',x.text,`class="lww-piece" data-lww-piece="${esc(x.id)}"`,r.order.includes(x.id))).join('')}</div>${button('clear-word',c.clearWord,'',r.order.length===0)}<div class="lww-actions lww-commit">${button('check-word',c.compareWord,'',e.checkStatus==='unreadable')}${button('keep-word',c.keepWord,'',e.latestStatus==='unreadable')}</div>${e.currentCheck?`<aside class="lww-feedback" id="lww-feedback" role="status" tabindex="-1">${checkBody(e.currentCheck,c,'word')}</aside>`:''}</section></div>${e.partial?notice(c,'partialNotice'):''}<div class="lww-actions">${button('word-help',c.example,`aria-expanded="${l.panels.includes(key)}"`,e.helpStatus==='unreadable')}</div>${l.panels.includes(key)?example(l,key,s.example.title,s.example.steps,c):''}${keeps(e,l,'word',c)}${panel(l,'overview',c.overview,`<div class="lww-actions">${v.words.map(w=>button('word',w.source?.text??w.id,`data-lww-word="${esc(w.id)}"`)).join('')}</div>`)}${p(c.partsNote)}${s.id==='algorithm'?p(c.wholeWordNote):''}</section>`;
}
function glossaryPage(v,l,c){
 const e=v.glossary,lines=e?.source?.lines??[],line=v.currentLine?.source??v.currentLine;
 if(!playable(e)||!line)return notice(c);
 const r=e.record,choice=line.choices.find(x=>x.id===r.picks[line.id]),index=lines.findIndex(x=>x.id===line.id),key='line-'+line.id,opaque=!e.playable.some(x=>x.id===line.id),hasPlayable=e.playable.length>0;
 return `<section class="lww-glossary"><label>${esc(c.sentencePicker)}<select data-lww-line-picker>${lines.map(x=>`<option value="${esc(x.id)}"${x.id===line.id?' selected':''}>${esc(x.title)}</option>`).join('')}</select></label><div class="lww-actions">${button('previous-line',c.previousSentence,'',index<=0)}${button('next-line',c.nextSentence,'',index>=lines.length-1)}</div><article class="lww-paper"><h2 id="lww-task" tabindex="-1">${esc(line.title)}</h2>${p(line.before)}<p><strong>${esc(line.flagged)}</strong></p>${p(c.leaveAsPrinted)}<div class="lww-choices">${line.choices.map(x=>button('glossary-choice',x.text,`data-lww-choice="${esc(x.id)}" aria-pressed="${r.picks[line.id]===x.id}"`,opaque)).join('')}</div><h3>${esc(c.yourVersion)}</h3>${opaque?`<pre>${esc(json(r.picks[line.id]))}</pre>${notice(c)}`:p(line.frame[0]+(choice?.text??line.flagged)+line.frame[1])}${p(line.hint)}</article><div class="lww-actions lww-commit">${button('check-glossary',c.compareGlossary,'',opaque||!hasPlayable||e.checkStatus==='unreadable')}${button('keep-glossary',c.keepGlossary,'',opaque||!hasPlayable||e.latestStatus==='unreadable')}</div>${hasPlayable&&e.currentCheck?`<aside id="lww-feedback" class="lww-feedback" role="status" tabindex="-1">${checkBody(e.currentCheck,c,'glossary')}</aside>`:''}${e.partial?notice(c,'partialNotice'):''}${button('line-help',c.example,`aria-expanded="${!opaque&&l.panels.includes(key)}"`,opaque)}${!opaque&&l.panels.includes(key)?example(l,key,c.optionalHelp,line.example,c):''}${keeps(e,l,'glossary',c,!opaque&&hasPlayable)}</section>`;
}
function jobsPage(v,l,c){
 const e=v.currentJob;
 if(!e)return `<section><h2 id="lww-task" tabindex="-1">${esc(c.jobPicker)}</h2><div class="lww-job-picker">${v.jobs.map(x=>button('job',x.source?.title??x.id,`data-lww-job="${esc(x.id)}"`)).join('')}${button('glossary',c.glossaryTitle)}</div>${v.jobsPartial?notice(c,'partialNotice'):''}</section>`;
 if(!playable(e)||e.helpStatus!=='ready')return notice(c)+button('jobs',c.jobPicker);
 const s=e.source,r=e.record,key='job-'+e.id,lead=s.teach?.[0];
 return `<section class="lww-job"><h2 id="lww-task" tabindex="-1">${esc(s.title)}</h2><article class="lww-paper">${p(lead?.text)}${(s.steps??[]).length?`<ol>${s.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`:''}${p(s.prompt)}${read('prompt',c.hearPrompt)}<div class="lww-choices">${s.choices.map(x=>button('answer',x.text,`data-lww-choice="${esc(x.id)}" aria-pressed="${r.work.choice===x.id}"`)).join('')}</div>${button('clear-job',c.putBack,'',r.work.choice===null)}</article><div class="lww-actions lww-commit">${button('check-job',c.compare,'',e.checkStatus==='unreadable')}${button('keep-job',c.keep,'',e.latestStatus==='unreadable')}${button('skip',c.skip)}</div>${e.currentCheck?`<aside id="lww-feedback" class="lww-feedback" role="status" tabindex="-1">${checkBody(e.currentCheck,c,'job')}</aside>`:''}<div class="lww-actions">${button('hint',c.optionalHelp)}${button('job-help',c.example,`aria-expanded="${l.panels.includes(key)}"`)}</div>${r.help.hint?p(s.hint):''}${l.panels.includes(key)?(s.teach??[]).map(t=>example(l,key+'-'+t.id,t.title,t.steps,c)).join(''):''}${e.partial?notice(c,'partialNotice'):''}${keeps(e,l,'job',c)}${button('jobs',c.jobPicker)}</section>`;
}
export function longWordPage(state,owner=''){
 const v=C.longWordView(state),l=local(state,owner),c=copy(v),s=v.status==='new'?LONG_WORD_SOURCE:v.source;
 const heading=`<header class="lww-heading"><a href="#words">${esc(c.wordGarden||LONG_WORD_SOURCE.copy.wordGarden)}</a><h1>${esc(s?.title||LONG_WORD_SOURCE.title)}</h1></header>`;
 if(v.status==='unsupported')return `<section class="lww-room" data-long-word-root>${heading}${notice(c,'unknownVersion')}</section>`;
 const arrival=v.view==='arrival'||v.status==='new';
 const instruction=v.view==='glossary'?c.glossaryInstruction:c.instruction;
 const body=arrival?`<section class="lww-arrival"><div class="lww-quiet-rail" aria-hidden="true"></div><h2 id="lww-task" tabindex="-1">${esc(s?.teaching?.title)}</h2><ol>${(s?.teaching?.steps??[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>`:v.view==='words'?wordPage(v,l,c):v.view==='glossary'?glossaryPage(v,l,c):jobsPage(v,l,c);
 return `<section class="lww-room" data-long-word-root>${heading}<nav class="lww-ways" aria-label="${esc(s?.title)}">${button('words',c.words)}${button('glossary',c.glossary)}${button('jobs',c.jobs)}</nav><p data-lww-saving></p>${!arrival?`<div class="lww-instruction">${p(instruction)}${read('instruction',c.hearInstruction)}</div>`:''}${body}<p id="lww-status" role="status" tabindex="-1">${esc(l.message)}</p>${l.stamp?`<p class="lww-stamp">${esc(c.keepAcknowledgment)}</p>`:''}${panel(l,'story',c.storyLabel,p(s?.story?.short)+read('story',c.hearStory))}${p(c.application)}<footer>${[['#library/endings','endingsShelf'],['#library/spellings','stainedMap'],['#library/word-list','wordListShelf'],['#science','waterLab'],['#words','wordGarden'],['#notes','notes']].map(([href,key])=>`<a href="${href}">${esc(c[key]||LONG_WORD_SOURCE.copy[key])}</a>`).join('')}</footer></section>`;
}
export function longWordNotes(state){
 if(!Object.hasOwn(state,'longWordWorkshop'))return '';
 const v=C.longWordView(state),c=copy(v),entries=[...(v.words??[]).map(e=>[e,'word']),...(v.glossary?[[v.glossary,'glossary']]:[]),...(v.jobs??[]).map(e=>[e,'job'])];
 return `<details class="panel" data-long-word-notes><summary>${esc(v.source?.title||LONG_WORD_SOURCE.title)}</summary>${LONG_WORD_GROWN_UP.slice(0,2).map(p).join('')}${entries.filter(([e])=>e.record).map(([e,kind])=>`<section><h3>${esc(e.source?.text??e.source?.title??(kind==='glossary'?c.glossaryTitle:e.id))}</h3>${playable(e)?draftBody(e.source,e.record,kind,c):notice(c)}${e.currentCheck?checkBody(e.currentCheck,c,kind):''}${keeps(e,null,kind,c,false)}${e.helpStatus==='ready'?`<p>Requested help: ${esc(json(e.record.help))}</p>`:''}</section>`).join('')}<details><summary>Full retained long-word work</summary><pre>${esc(json(state.longWordWorkshop))}</pre></details><a href="#library/long-words">${esc(LONG_WORD_SOURCE.title)}</a></details>`;
}
export const longWordEntry=()=>`<a class="secondary" href="#library/long-words">${esc(LONG_WORD_SOURCE.title)}</a>`;
export function longWordSpeech(state,kind){
 const v=C.longWordView(state),s=v.status==='new'?LONG_WORD_SOURCE:v.source;
 if(kind==='story')return text(s?.story?.short);
 if(kind==='instruction')return text(v.view==='glossary'?s?.copy?.glossaryInstruction:s?.copy?.instruction);
 if(kind==='sentence'&&v.view==='words'&&playable(v.currentWord))return text(v.currentWord.source.sentence);
 if(kind==='prompt'&&v.view==='jobs'&&playable(v.currentJob))return text(v.currentJob.source.prompt);
 return '';
}
export function bindLongWord(state,ctx={}){
 const root=document.querySelector('[data-long-word-root]');if(!root)return;
 const owner=ctx.explorerId?.()??'',l=local(state,owner),owned=state.longWordWorkshop,material=json(owned),options={canExport:ctx.canExport};
 const visible=el=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';
 const film=()=>!!document.querySelector('dialog.welcome-film[open]')||[...document.querySelectorAll('.film-stage,.film-overlay')].some(el=>!el.closest('[hidden],[inert]')&&visible(el));
 const live=(el,disclosure=false)=>root.isConnected&&root===document.querySelector('[data-long-word-root]')&&el.isConnected&&root.contains(el)&&!el.disabled&&!document.hidden&&!el.closest(disclosure?'[hidden],[inert]':'[hidden],[inert],details:not([open])')&&visible(el)&&location.hash==='#library/long-words'&&(!ctx.notebook||ctx.notebook()===state)&&(ctx.explorerId?.()??'')===owner&&ctx.isActive?.()!==false&&state.longWordWorkshop===owned&&json(owned)===material&&locals.get(state)===l&&!film();
 const remember=()=>{const open=[...root.querySelectorAll('[data-lww-panel][open]')].map(el=>el.dataset.lwwPanel);l.panels=[...l.panels.filter(x=>!['story','overview'].includes(x)&&!x.includes('-first')&&!x.includes('-latest')),...open];};
 const redraw=(focus='#lww-task',after)=>{remember();after?.();ctx.stopSpeech?.();ctx.render?.();const next=document.querySelector('[data-long-word-root]');const target=next?.querySelector(focus)??next?.querySelector('#lww-task')??next?.querySelector('#lww-status');target?.focus();};
 const commit=(fn,{keep=false,after,focus='#lww-task'}={})=>{
  const result=fn(),v=C.longWordView(state),c=copy(v);
  if(!result.ok){l.message=c[result.error==='unavailable'?'unavailable':'refusal']||LONG_WORD_SOURCE.copy.refusal;return redraw('#lww-status');}
  l.root=state.longWordWorkshop;l.stamp=keep;l.message=keep?c.keepAcknowledgment:'';const saved=result.changed===false?null:ctx.save?.();if(saved?.enabled===false||saved?.ok===false)l.message=saved.message||'';
  redraw(keep||l.message?'#lww-status':focus,after);
 };
 const navigate=(kind,id)=>commit(()=>kind==='word'?C.openLongWord(state,id,options):C.selectLongLine(state,id,options),{after:()=>{l.selected=null;}});
 for(const [selector,kind] of [['[data-lww-word-picker]','word'],['[data-lww-line-picker]','line']])root.querySelector(selector)?.addEventListener('change',event=>{if(live(event.currentTarget))navigate(kind,event.currentTarget.value);});
 root.querySelectorAll('[data-lww-action]').forEach(el=>el.addEventListener('click',()=>{
  if(!live(el))return;
  const a=el.dataset.lwwAction,v=C.longWordView(state),e=v.currentWord,j=v.currentJob,g=v.glossary,line=v.currentLine?.source??v.currentLine,c=copy(v);
  if(['words','glossary','jobs'].includes(a))return commit(()=>C.openLongWordSection(state,a,options),{after:()=>{l.selected=null;}});
  if(a==='word')return navigate('word',el.dataset.lwwWord);
  if(a==='job')return commit(()=>C.openLongJob(state,el.dataset.lwwJob,options));
  if(['previous-word','next-word'].includes(a)){const index=v.words.indexOf(e)+(a==='next-word'?1:-1);if(v.words[index])return navigate('word',v.words[index].id);return;}
  if(['previous-line','next-line'].includes(a)){const lines=g.source.lines,index=lines.findIndex(x=>x.id===line?.id)+(a==='next-line'?1:-1);if(lines[index])return navigate('line',lines[index].id);return;}
  if(a==='select-piece'){l.selected=el.dataset.lwwPiece;l.stamp=false;l.message='';return redraw();}
  if(a==='append')return commit(()=>C.appendLongPiece(state,e?.id,el.dataset.lwwPiece,options),{after:()=>{l.selected=el.dataset.lwwPiece;}});
  if(a==='left'||a==='right')return commit(()=>C.moveLongPiece(state,e?.id,l.selected,a==='left'?-1:1,options));
  if(a==='remove')return commit(()=>C.removeLongPiece(state,e?.id,l.selected,options),{after:()=>{l.selected=null;}});
  if(a==='clear-word')return commit(()=>C.clearLongWord(state,e?.id,options),{after:()=>{l.selected=null;}});
  if(a==='glossary-choice')return commit(()=>C.setLongGlossaryChoice(state,line?.id,el.dataset.lwwChoice,options));
  if(a==='answer'||a==='clear-job')return commit(()=>C.answerLongJob(state,j?.id,a==='clear-job'?null:el.dataset.lwwChoice,options));
  if(a==='hint')return commit(()=>C.useLongJobHelp(state,j?.id,'hint',options));
  if(a==='skip')return commit(()=>C.skipLongJob(state,j?.id,options));
  if(a.startsWith('check-')||a.startsWith('keep-')||a.startsWith('restore-')){
   const [op,kind]=a.split('-'),fn=op+(kind==='word'?'LongWord':kind==='job'?'LongJob':'LongGlossary'),args=[state];if(kind!=='glossary')args.push(kind==='word'?e?.id:j?.id);if(op==='restore')args.push(el.dataset.lwwEdition);args.push(options);
   return commit(()=>C[fn](...args),{keep:op==='keep',focus:op==='check'?'#lww-feedback':'#lww-task',after:()=>{if(op==='restore')l.selected=null;}});
  }
  if(['word-help','line-help','job-help'].includes(a)){
   const key=a==='word-help'?'word-'+e.id:a==='line-help'?'line-'+line.id:'job-'+j.id;
   if(l.panels.includes(key)){l.panels=l.panels.filter(x=>x!==key);l.stamp=false;return redraw();}
   const fn=()=>a==='word-help'?C.useLongWordHelp(state,e.id,options):a==='line-help'?C.useLongGlossaryHelp(state,line.id,options):C.useLongJobHelp(state,j.id,'example',options);
   return commit(fn,{after:()=>{l.panels.push(key);l.steps[key]=1;if(a==='job-help')for(const t of j.source.teach)l.steps[key+'-'+t.id]=1;},focus:'[data-lww-example]'});
  }
  if(a==='step'){const key=el.dataset.lwwKey;let steps=key==='word-'+e?.id?e.source.example.steps:key==='line-'+line?.id?line.example:j?.source.teach.find(t=>'job-'+j.id+'-'+t.id===key)?.steps;if(!steps)return;l.steps[key]=Math.min((l.steps[key]??1)+1,steps.length);l.stamp=false;return redraw('[data-lww-example]');}
 }));
 root.querySelectorAll('[data-lww-panel]').forEach(el=>el.addEventListener('toggle',()=>{if(!live(el,true)||el.open===l.panels.includes(el.dataset.lwwPanel))return;l.panels=l.panels.filter(x=>x!==el.dataset.lwwPanel);if(el.open)l.panels.push(el.dataset.lwwPanel);l.stamp=false;root.querySelector('.lww-stamp')?.remove();}));
 root.querySelectorAll('a').forEach(el=>el.addEventListener('click',event=>{if(!live(el)){event.preventDefault();event.stopImmediatePropagation();return;}l.stamp=false;l.message='';}));
 root.querySelectorAll('[data-lww-read]').forEach(el=>el.addEventListener('click',event=>{const utterance=live(el)?longWordSpeech(state,el.dataset.lwwRead):'';if(!utterance){event.preventDefault();event.stopImmediatePropagation();return;}l.stamp=false;root.querySelector('.lww-stamp')?.remove();el.dataset.speak=utterance;},{capture:true}));
}
