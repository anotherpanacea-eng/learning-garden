import {SKY_SHAPES,SKY_COPY as T,SKY_PANELS,SKY_GROWNUP,skyShape,changePrompt} from './sky-notes-content.mjs';
import {skyView,skyMonthDays,hemisphereView,saveSkyNote,setHemisphere,localCivilDate,validCivilDate,validMonth,moonArt} from './sky-notes-core.mjs';
import {hearButton} from './play-media.mjs';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const monthLabel=month=>validMonth(month)?`${MONTHS[Number(month.slice(5,7))-1]} ${Number(month.slice(0,4))}`:'';
// Weekday from the calendar date alone, never the device time zone.
function weekday(iso){const d=new Date(0);d.setUTCFullYear(Number(iso.slice(0,4)),Number(iso.slice(5,7))-1,Number(iso.slice(8)));return WEEKDAYS[d.getUTCDay()];}
const dateLine=iso=>`Today on this device: ${weekday(iso)}, ${MONTHS[Number(iso.slice(5,7))-1]} ${Number(iso.slice(8))}`;
const label=code=>skyShape(code)?.label??'';
// Status lines are transient codes mapped to copy, never saved prose.
const NOTICES={saved:T.saved,same:T.same,noChoice:T.noChoice,dateChanged:T.dateChanged,full:T.full,notKept:T.notKept,hemisphere:T.hemisphereSaved};
let visit=null;
export function resetSkyNotesView(){visit=null;}
function session(state,owner){
 if(!visit||visit.state!==state||visit.owner!==owner)visit={state,owner,date:localCivilDate(),draft:null,drift:false,month:null,notice:''};
 return visit;
}
function status(s){const text=NOTICES[s.notice]??'';return `<p id="sky-status" class="sky-status${text?'':' sr-only'}" role="status" aria-live="polite" tabindex="-1"${text?' data-sky-say':''}>${esc(text)}</p>`;}
function choices(s,v,hemisphere){
 const picked=s.draft??v.entry?.shape??null;
 return `<div class="sky-choices" role="group" aria-labelledby="sky-title">${SKY_SHAPES.map(({code,label})=>`<button type="button" class="sky-choice secondary" data-sky-shape="${code}" aria-pressed="${picked===code}"${picked===code?' data-sky-say-pressed':''}>${moonArt(code,hemisphere)}<span>${esc(label)}</span></button>`).join('')}</div>`;
}
function strip(state,s,v,hemisphere){
 const months=v.months,current=v.today?.slice(0,7)??null;
 if(!months.length)return `<section class="sky-strip" aria-labelledby="sky-month-title"><h2 id="sky-month-title">${esc(T.title)}</h2><p>${esc(T.noNotes)}</p></section>`;
 const shown=months.includes(s.month)?s.month:current&&months.includes(current)?current:months.at(-1);s.month=shown;
 const at=months.indexOf(shown),days=skyMonthDays(state,shown);
 const nav=(which,text,disabled)=>`<button type="button" class="secondary" data-sky-month="${which}"${disabled?' disabled':''}>${esc(text)}</button>`;
 return `<section class="sky-strip" aria-labelledby="sky-month-title"><h2 id="sky-month-title" tabindex="-1">${esc(monthLabel(shown))}</h2>${v.entries.length?'':`<p>${esc(T.noNotes)}</p>`}<ol class="sky-days">${days.map(d=>d.shape?`<li class="sky-day sky-day-noted" aria-label="${d.day}: ${esc(label(d.shape))}">${moonArt(d.shape,hemisphere,'sky-day-moon')}<span aria-hidden="true">${d.day}</span></li>`:`<li class="sky-day" aria-label="${d.day}: ${esc(T.emptyDay)}"><span class="sky-day-empty" aria-hidden="true"></span><span aria-hidden="true">${d.day}</span></li>`).join('')}</ol><div class="sky-actions">${nav('earlier',T.earlier,at<=0)}${nav('later',T.later,at>=months.length-1)}${current?nav('this',T.thisMonth,shown===current):''}</div></section>`;
}
function panels(){return `<section class="sky-panels" aria-label="Three things Dot noticed">${SKY_PANELS.map(p=>`<article class="sky-panel">${moonArt(p.code,'north','sky-panel-moon')}<div><h3 data-sky-say>${esc(p.title)}</h3><p data-sky-say>${esc(p.body)}</p></div></article>`).join('')}</section>`;}
function hemisphereSetting(h){
 const b=(value,text)=>`<button type="button" class="secondary" data-sky-hemisphere="${value}" aria-pressed="${h.effective===value}">${esc(text)}</button>`;
 return `<fieldset class="sky-hemisphere"><legend>${esc(T.hemisphereLabel)}</legend><div class="sky-actions">${b('north',T.north)}${b('south',T.south)}</div><p data-sky-say>${esc(T.hemisphereHelp)}</p></fieldset>`;
}
export function skyNotesEntry(){return `<aside class="wt-entry sky-entry"><div><h2>${esc(T.entryTitle)}</h2><p>${esc(T.entryBody)}</p></div><a class="secondary" href="#almanac/sky">${esc(T.entryTitle)}</a></aside>`;}
export function skyNotesPage(state,owner){
 const s=session(state,owner),v=skyView(state,s.date),h=hemisphereView(state),hemisphere=h.effective;
 let today='';
 if(v.status==='unsupported')today=`<p class="sky-unavailable">${esc(T.unavailable)}</p>`;
 else if(!v.todayValid)today=`<p class="sky-unavailable" data-sky-say>${esc(T.noDate)}</p>`;
 else today=`<p class="sky-date" data-sky-say><strong>${esc(dateLine(v.today))}</strong></p>${choices(s,v,hemisphere)}<p class="sky-help" data-sky-say>${esc(T.growing)}</p>${v.entry?`<p data-sky-say>${esc(changePrompt(label(v.entry.shape)))}</p>`:''}<div class="sky-actions"><button type="button" class="primary" data-sky-save${s.drift?' disabled':''}>${esc(T.save)}</button><button type="button" class="secondary" data-sky-refresh>${esc(T.refresh)}</button></div>`;
 return `<div class="sky-page" data-sky-root><header class="sky-header"><a class="back" href="#almanac">Keeper’s Pages</a><p class="sky-eyebrow">${esc(T.eyebrow)}</p><h1 id="sky-title" tabindex="-1">${esc(T.title)}</h1><p data-sky-say>${esc(T.intro)}</p><p class="sky-safety" data-sky-say><strong>${esc(T.safety)}</strong></p><div data-sky-hear>${hearButton(T.intro,T.hear)}</div></header><section class="sky-today" aria-labelledby="sky-title">${today}${status(s)}</section>${strip(state,s,v,hemisphere)}${panels()}${hemisphereSetting(h)}<footer class="sky-links"><a href="#almanac/weather">Weather notes</a><a href="#almanac">Keeper’s Pages</a></footer></div>`;
}
// Built from the page as it is now, at the moment Hear is tapped.
function spokenPage(root){
 const parts=[];
 for(const node of root.querySelectorAll('[data-sky-say],[data-sky-say-pressed]')){
  if(node.closest('[hidden]'))continue;
  const text=(node.matches('[data-sky-say-pressed]')?node.querySelector('span')?.textContent:node.textContent)?.trim();
  if(text)parts.push(text);
 }
 return parts.join(' ');
}
export function bindSkyNotes(state,ctx){
 const root=document.querySelector('[data-sky-root]');if(!root)return;
 const owner=ctx.explorerId(),s=session(state,owner),options={canExport:ctx.canExport};
 const live=()=>root.isConnected&&location.hash==='#almanac/sky'&&ctx.explorerId()===owner&&ctx.notebook()===state&&ctx.isActive?.()!==false;
 const stop=()=>ctx.stopSpeech?.();
 const refresh=target=>{ctx.render();ctx.focus?.(target);};
 const on=(selector,fn)=>root.querySelectorAll(selector).forEach(b=>b.addEventListener('click',()=>{if(live())fn(b);}));
 // Speech is rebuilt on each tap so it never reads a status from before the last action.
 root.querySelector('[data-sky-hear]')?.addEventListener('click',e=>{const button=e.target.closest('[data-speak]');if(button&&live())button.dataset.speak=spokenPage(root);},{capture:true});
 on('[data-sky-shape]',b=>{stop();s.draft=b.dataset.skyShape;s.notice=s.drift?'dateChanged':'';refresh(`[data-sky-shape="${b.dataset.skyShape}"]`);});
 on('[data-sky-refresh]',()=>{stop();s.date=localCivilDate();s.draft=null;s.drift=false;s.month=null;s.notice='';refresh('.sky-date');});
 on('[data-sky-month]',b=>{const v=skyView(state,s.date),months=v.months,at=months.indexOf(s.month),which=b.dataset.skyMonth;
  s.month=which==='this'?v.today?.slice(0,7)??s.month:months[Math.max(0,Math.min(months.length-1,at+(which==='earlier'?-1:1)))]??s.month;refresh(`[data-sky-month="${which}"]:not([disabled]),#sky-month-title`);});
 on('[data-sky-save]',()=>{
  stop();const today=localCivilDate();
  if(!validCivilDate(s.date)||today!==s.date){s.drift=true;s.notice='dateChanged';refresh('#sky-status');return;}
  const v=skyView(state,s.date),code=s.draft??null;
  if(!code){s.notice=v.entry?'same':'noChoice';refresh('#sky-status');return;}
  const before=state.sky,result=saveSkyNote(state,s.date,code,{...options,today});
  if(result===false){s.notice=!v.entry&&!v.canAppend?'full':'notKept';refresh('#sky-status');return;}
  if(state.sky!==before)ctx.save();s.notice=result==='same'?'same':'saved';s.draft=null;s.month=s.date.slice(0,7);refresh('#sky-status');
 });
 on('[data-sky-hemisphere]',b=>{
  stop();const before=state.hemisphere,result=setHemisphere(state,b.dataset.skyHemisphere,options);
  if(result===false){s.notice='notKept';refresh('#sky-status');return;}
  if(result==='same')return;
  if(state.hemisphere!==before)ctx.save();s.notice='hemisphere';refresh(`[data-sky-hemisphere="${b.dataset.skyHemisphere}"]`);
 });
}
export function skyNotesNotes(state){
 const skyOwn=Object.hasOwn(state,'sky'),hemiOwn=Object.hasOwn(state,'hemisphere');
 if(!skyOwn&&!hemiOwn)return '';
 const v=skyView(state,null),h=hemisphereView(state);
 const range=v.entries.length?`${v.entries[0].date} to ${v.entries.at(-1).date}`:'none';
 const raw=value=>{try{return JSON.stringify(value,null,2)??String(value);}catch{return 'Earlier value retained in the notebook.';}};
 return `<section class="sky-notes"><h2>Sky notes</h2><p>${esc(SKY_GROWNUP.about)}</p><p>Readable notes: ${v.entries.length} dates (${v.readableCount} readable entries). Date range: ${esc(range)}.${v.status==='unsupported'?' This earlier sky notebook cannot be opened here and is unavailable; its original stays in your notes.':''}${v.unreadableCount?` Unavailable entries: ${v.unreadableCount}, kept as they were.`:''}</p>${v.entries.length?`<ul>${v.entries.map(e=>`<li>${esc(e.date)}: ${esc(label(e.shape))}</li>`).join('')}</ul>`:''}<p>Moon picture setting: ${h.effective==='south'?'south of the equator':'north of the equator'}${h.present&&!h.supported?' (an earlier unreadable value is kept)':''}.</p><p>${esc(SKY_GROWNUP.names)}</p><p>${esc(SKY_GROWNUP.quarter)}</p>${skyOwn&&(v.unreadableCount||v.status==='unsupported')?`<details><summary>Original sky entries, including unavailable values</summary><pre>${esc(raw(state.sky))}</pre></details>`:''}${hemiOwn&&!h.supported?`<details><summary>Original moon picture setting</summary><pre>${esc(raw(state.hemisphere))}</pre></details>`:''}</section>`;
}
// End of the Grown-up notes section.
