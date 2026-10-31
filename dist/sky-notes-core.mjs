// Spec 323 sky notes: the `sky` and `hemisphere` roots, read and written only here.
// Follows spec 281's weather writer rule for rule, with its own date helpers so nothing is imported from weather-tally-*.
import {SKY_CODES,skyShape} from './sky-notes-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.hasOwn(x,k);
const clone=x=>structuredClone(x);
export const SKY_CAPACITY=1098;
const leap=y=>y%4===0&&(y%100!==0||y%400===0);
export function daysInMonth(year,month){if(!Number.isSafeInteger(year)||year<1||year>9999||!Number.isSafeInteger(month)||month<1||month>12)return 0;return month===2?(leap(year)?29:28):[4,6,9,11].includes(month)?30:31;}
export function validMonth(month){return typeof month==='string'&&/^\d{4}-\d{2}$/.test(month)&&daysInMonth(Number(month.slice(0,4)),Number(month.slice(5,7)))>0;}
export function validCivilDate(date){if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!validMonth(date.slice(0,7)))return false;const day=Number(date.slice(8));return day>=1&&day<=daysInMonth(Number(date.slice(0,4)),Number(date.slice(5,7)));}
// Local calendar components, never UTC ISO truncation.
export function localCivilDate(date=new Date()){
 try{const y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();if(!Number.isSafeInteger(y)||y<1||y>9999)return null;const iso=`${String(y).padStart(4,'0')}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;return validCivilDate(iso)?iso:null;}catch{return null;}
}
export const readableSkyEntry=e=>object(e)&&own(e,'date')&&validCivilDate(e.date)&&own(e,'shape')&&!!skyShape(e.shape);
function skyRead(state){
 const present=object(state)&&own(state,'sky'),raw=present?state.sky:null,status=!present?'absent':Array.isArray(raw)?'ready':'unsupported';
 const readable=[],last=new Map();
 if(Array.isArray(raw))for(let index=0;index<raw.length;index++){const e=raw[index];if(readableSkyEntry(e)){readable.push(e);last.set(e.date,{entry:e,index});}}
 const selected=[...last.values()].sort((a,b)=>a.entry.date.localeCompare(b.entry.date));
 return {status,raw,readable,selected};
}
// Months to show: readable months up to the rendered device month, plus that month. Later imported months stay raw.
export function skyMonths(state,todayISO){
 const current=validCivilDate(todayISO)?todayISO.slice(0,7):null,months=new Set(skyRead(state).selected.map(x=>x.entry.date.slice(0,7)));
 if(current)months.add(current);
 return [...months].filter(m=>!current||m<=current).sort();
}
export function skyView(state,todayISO=localCivilDate()){
 const r=skyRead(state),todayValid=validCivilDate(todayISO),today=todayValid?todayISO:null,selected=today?r.selected.find(x=>x.entry.date===today):null;
 return {status:r.status,today,todayValid,entry:selected?.entry||null,index:selected?.index??null,entries:r.selected.map(x=>x.entry),readableCount:r.readable.length,unreadableCount:Array.isArray(r.raw)?r.raw.length-r.readable.length:0,months:skyMonths(state,today),canWrite:r.status!=='unsupported'&&todayValid,canAppend:r.status!=='unsupported'&&r.readable.length<SKY_CAPACITY};
}
export function skyMonthDays(state,month){
 if(!validMonth(month))return [];const byDate=new Map(skyRead(state).selected.map(x=>[x.entry.date,x.entry.shape]));
 return Array.from({length:daysInMonth(Number(month.slice(0,4)),Number(month.slice(5,7)))},(_,i)=>{const date=`${month}-${String(i+1).padStart(2,'0')}`;return {day:i+1,date,shape:byDate.get(date)??null};});
}
export function hemisphereView(state){const present=object(state)&&own(state,'hemisphere'),raw=present?state.hemisphere:undefined;return {present,raw,effective:raw==='south'?'south':'north',supported:raw==='north'||raw==='south'};}
// Every write proposes one owning root against a clone of the whole notebook, then commits only the captured proposal.
// The report probe runs after capture, so a callback that mutates the candidate never commits.
function write(state,key,fn,options={}){
 if(!object(state))return false;
 try{
  const candidate=clone(state),before=JSON.stringify(own(candidate,key)?candidate[key]:undefined),result=fn(candidate);
  if(result===false)return false;
  const after=own(candidate,key)?candidate[key]:undefined;if(before===JSON.stringify(after))return 'same';
  const proposal=clone(after);
  if(!recoveryFitsProgressLimits(candidate)||typeof options?.canExport==='function'&&options.canExport(candidate)!==true)return false;
  state[key]=proposal;return true;
 }catch{return false;}
}
// Returns true (written), 'same' (no-op, no preflight), or false (refused; nothing changed).
export function saveSkyNote(state,renderedISO,code,options={}){
 const today=own(options,'today')?options.today:localCivilDate();
 if(!validCivilDate(renderedISO)||!validCivilDate(today)||today!==renderedISO||!skyShape(code))return false;
 const v=skyView(state,today);if(v.status==='unsupported')return false;
 if(v.entry?.shape===code)return 'same';
 return write(state,'sky',c=>{
  const r=skyView(c,today);
  if(r.entry){c.sky[r.index].shape=code;return true;}
  if(!r.canAppend)return false;if(!own(c,'sky'))c.sky=[];c.sky.push({date:today,shape:code});return true;
 },options);
}
export function setHemisphere(state,value,options={}){
 if(value!=='north'&&value!=='south')return false;
 if(hemisphereView(state).effective===value)return 'same';
 return write(state,'hemisphere',c=>{c.hemisphere=value;return true;},options);
}
// Pictures: a 48 px disk centered at (24,24), radius 20. The lit part is drawn with absolute M and A commands only.
// The southern picture mirrors the northern one left to right: x becomes 48 - x and every arc's sweep flag flips.
const RIGHT_HALF='M24 4 A20 20 0 0 1 24 44',BACK_UP=(rx,sweep)=>` A${rx} 20 0 0 ${sweep} 24 4 Z`;
const NORTH={
 'thin-growing':RIGHT_HALF+BACK_UP(14,0),
 'half-growing':RIGHT_HALF+' Z',
 'fat-growing':RIGHT_HALF+BACK_UP(14,1),
 'full':'M24 4 A20 20 0 1 1 24 44 A20 20 0 1 1 24 4 Z',
};
export function mirrorPath(d){
 return d.replace(/M(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/g,(_,x,y)=>`M${48-Number(x)} ${y}`)
  .replace(/A(\d+(?:\.\d+)?) (\d+(?:\.\d+)?) (\d) (\d) (\d) (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/g,(_,rx,ry,rot,large,sweep,x,y)=>`A${rx} ${ry} ${rot} ${large} ${sweep==='1'?0:1} ${48-Number(x)} ${y}`);
}
const shrink={'fat-shrinking':'fat-growing','half-shrinking':'half-growing','thin-shrinking':'thin-growing'};
export function moonPath(code,hemisphere='north'){
 if(!skyShape(code)||code==='not-seen')return null;
 const north=NORTH[code]??mirrorPath(NORTH[shrink[code]]);
 return hemisphere==='south'&&code!=='full'?mirrorPath(north):north;
}
export function moonArt(code,hemisphere='north',className='sky-moon'){
 if(code==='not-seen')return `<svg class="${className}" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle class="sky-moon-unseen" cx="24" cy="24" r="20" fill="none" stroke-width="2.5" stroke-dasharray="5 4"/></svg>`;
 const d=moonPath(code,hemisphere);if(!d)return '';
 return `<svg class="${className}" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle class="sky-moon-dark" cx="24" cy="24" r="20"/><path class="sky-moon-lit" d="${d}"/><circle class="sky-moon-edge" cx="24" cy="24" r="20" fill="none" stroke-width="2"/></svg>`;
}
export {SKY_CODES};
