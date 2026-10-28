import {WEATHER_CATEGORIES,PRACTICE_WEATHER_DAYS,weatherCategory} from './weather-tally-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.hasOwn(x,k);
const clone=x=>structuredClone(x);
const dense=(x,max)=>Array.isArray(x)&&x.length<=max&&Object.keys(x).length===x.length&&Array.from(x).every((_,i)=>own(x,i));
const text=(x,max)=>typeof x==='string'&&x.length>0&&x.length<=max;
const MONTH_NAMES=['January','February','March','April','May','June','July','August','September','October','November','December'];
const MAX_ID=1e9,SUPPORT=['teaching','narration','together','feedback'];
const reserved=new Set(['__proto__','constructor','prototype','toString','valueOf']);
const categoryCode=x=>text(x,80)&&/^[\x20-\x7e]+$/.test(x)&&!reserved.has(x);
const sheetId=id=>typeof id==='string'&&/^weather-tally-[1-9]\d{0,9}$/.test(id)&&Number(id.slice(14))<=MAX_ID;
export function daysInMonth(year,month){if(!Number.isSafeInteger(year)||year<1||year>9999||!Number.isSafeInteger(month)||month<1||month>12)return 0;return month===2?(year%4===0&&(year%100!==0||year%400===0)?29:28):[4,6,9,11].includes(month)?30:31;}
export function validMonth(month){if(typeof month!=='string'||!/^\d{4}-\d{2}$/.test(month))return false;return daysInMonth(Number(month.slice(0,4)),Number(month.slice(5,7)))>0;}
export function validCivilDate(date){if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!validMonth(date.slice(0,7)))return false;const day=Number(date.slice(8));return day>=1&&day<=daysInMonth(Number(date.slice(0,4)),Number(date.slice(5,7)));}
export function localCivilDate(date=new Date()){
 try{const y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();if(!Number.isSafeInteger(y)||y<1||y>9999)return null;const iso=`${String(y).padStart(4,'0')}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;return validCivilDate(iso)?iso:null;}catch{return null;}
}
export const readableWeatherEntry=e=>object(e)&&validCivilDate(e.date)&&!!weatherCategory(e.weather);
function weatherRead(state){
 const present=object(state)&&own(state,'weather'),raw=present?state.weather:null,status=!present?'absent':Array.isArray(raw)?'ready':'unsupported';
 const readable=[],last=new Map();if(Array.isArray(raw))raw.forEach((e,index)=>{if(readableWeatherEntry(e)){readable.push(e);last.set(e.date,{entry:e,index});}});
 const selected=[...last.values()].sort((a,b)=>a.entry.date.localeCompare(b.entry.date));
 return {status,raw,readable,selected};
}
export function weatherMonths(state){const months=new Map();for(const {entry} of weatherRead(state).selected){const month=entry.date.slice(0,7);months.set(month,(months.get(month)||0)+1);}return [...months].sort(([a],[b])=>b.localeCompare(a)).map(([month,count])=>({month,count}));}
export function weatherView(state,todayISO=localCivilDate()){
 const r=weatherRead(state),todayValid=validCivilDate(todayISO),today=todayValid?todayISO:null,selected=r.selected.find(x=>x.entry.date===today);
 return {status:r.status,today,todayValid,entry:selected?.entry||null,index:selected?.index??null,entries:r.selected.map(x=>x.entry),readableCount:r.readable.length,unreadableCount:Array.isArray(r.raw)?r.raw.length-r.readable.length:0,months:weatherMonths(state),canAppend:r.status!=='unsupported'&&r.readable.length<1098};
}
// Every local write proposes one owning root against the real entire notebook.
// Capture the proposal before the report callback; callback mutations never commit.
function write(state,key,fn,options={}){
 if(!object(state))return false;
 try{
  const candidate=clone(state),before=JSON.stringify(own(candidate,key)?candidate[key]:undefined),result=fn(candidate);
  if(result===false)return false;
  const after=own(candidate,key)?candidate[key]:undefined;if(before===JSON.stringify(after))return result??true;
  const proposal=clone(after);
  if(!recoveryFitsProgressLimits(candidate)||typeof options?.canExport==='function'&&options.canExport(candidate)!==true)return false;
  state[key]=proposal;return result??true;
 }catch{return false;}
}
export function saveWeatherNote(state,renderedISO,code,options={}){
 const today=own(options,'today')?options.today:localCivilDate();
 if(!validCivilDate(renderedISO)||!validCivilDate(today)||today!==renderedISO||!weatherCategory(code))return false;
 return write(state,'weather',c=>{
  const r=weatherView(c,today);if(r.status==='unsupported')return false;
  if(r.entry){if(r.entry.weather===code)return true;c.weather[r.index].weather=code;return true;}
  if(!r.canAppend)return false;if(!own(c,'weather'))c.weather=[];c.weather.push({date:today,weather:code});return true;
 },options);
}
export function practiceWeatherSource(){return {version:1,kind:'practice',id:'dots-practice-month',title:"Dot's practice month",month:null,categories:clone(WEATHER_CATEGORIES),days:PRACTICE_WEATHER_DAYS.map((weather,i)=>({day:i+1,date:null,weather}))};}
export function weatherMonthSource(state,month){
 if(!validMonth(month))return null;const days=weatherRead(state).selected.filter(x=>x.entry.date.startsWith(month+'-')).map(({entry})=>({day:Number(entry.date.slice(8)),date:entry.date,weather:entry.weather}));
 return days.length?{version:1,kind:'reported',id:`reported-${month}`,title:`Your notes for ${MONTH_NAMES[Number(month.slice(5,7))-1]} ${month.slice(0,4)}`,month,categories:clone(WEATHER_CATEGORIES),days}:null;
}
export function readableSource(s){
 if(!object(s)||!Number.isSafeInteger(s.version)||s.version<1||!['practice','reported'].includes(s.kind)||!text(s.id,160)||!text(s.title,160)||!dense(s.categories,5)||s.categories.length<1||!dense(s.days,31))return false;
 const codes=new Set();for(const c of s.categories){if(!object(c)||!categoryCode(c.code)||codes.has(c.code)||!text(c.label,160))return false;codes.add(c.code);}
 if(s.kind==='practice'?s.month!==null:!validMonth(s.month))return false;
 let prior=0;return s.days.every(d=>{if(!object(d)||!Number.isSafeInteger(d.day)||d.day<=prior||d.day>31||!codes.has(d.weather))return false;prior=d.day;return s.kind==='practice'?d.date===null:validCivilDate(d.date)&&d.date.slice(0,7)===s.month&&Number(d.date.slice(8))===d.day;});
}
export const validPlacements=(source,placements)=>readableSource(source)&&dense(placements,source.days.length)&&Array.from(placements).every(code=>source.categories.some(c=>c.code===code));
const readableSupport=s=>object(s)&&SUPPORT.every(k=>own(s,k)&&typeof s[k]==='boolean');
const freshSupport=()=>Object.fromEntries(SUPPORT.map(k=>[k,false]));
const countMap=(source,map)=>object(map)&&Object.keys(map).length===source.categories.length&&source.categories.every(c=>own(map,c.code)&&Number.isSafeInteger(map[c.code])&&map[c.code]>=0&&map[c.code]<=31);
export function tallyCounts(source,placements){if(!validPlacements(source,placements))return null;const counts=Object.fromEntries(source.categories.map(c=>[c.code,0]));for(const code of placements)counts[code]++;return counts;}
export const readableCheck=c=>object(c)&&c.version===1&&readableSource(c.source)&&validPlacements(c.source,c.placements)&&countMap(c.source,c.counts)&&countMap(c.source,c.expected)&&typeof c.complete==='boolean'&&typeof c.matches==='boolean'&&readableSupport(c.supportBefore);
export const readableKeep=k=>object(k)&&k.version===1&&readableSource(k.source)&&validPlacements(k.source,k.placements)&&countMap(k.source,k.counts)&&readableSupport(k.support);
const keptPresent=s=>object(s)&&own(s,'kept')&&s.kept!==null;
const draft=s=>object(s)&&s.kind==='weather-tally'&&s.version===1&&sheetId(s.id)&&readableSource(s.source)&&validPlacements(s.source,s.placements)&&readableSupport(s.support);
const sheetFormat=s=>object(s)&&s.kind==='weather-tally'&&s.version===1&&sheetId(s.id);
function desk(state){return !object(state)||!own(state,'dataDesk')?{status:'absent',raw:[]}:Array.isArray(state.dataDesk)?{status:'ready',raw:state.dataDesk}:{status:'unsupported',raw:[]};}
function idCounts(raw){const counts=new Map();for(const s of raw){if(object(s)&&own(s,'id')&&sheetId(s.id))counts.set(s.id,(counts.get(s.id)||0)+1);}return counts;}
function nextId(raw){
 if(raw.length>=24)return null;let n=1;const ids=new Set();
 for(const s of raw)if(object(s)&&own(s,'id')&&sheetId(s.id)){ids.add(s.id);n=Math.max(n,Number(s.id.slice(14))+1);}
 while(n<=MAX_ID&&ids.has(`weather-tally-${n}`))n++;return n<=MAX_ID?`weather-tally-${n}`:null;
}
function uniqueSheet(state,id){const r=desk(state);if(r.status!=='ready'||!sheetId(id))return null;const found=r.raw.filter(s=>object(s)&&own(s,'id')&&s.id===id);return found.length===1&&sheetFormat(found[0])?found[0]:null;}
export function tallyView(state,id=null){
 const r=desk(state),countsById=idCounts(r.raw),sheet=uniqueSheet(state,id),kept=readableKeep(sheet?.kept)?sheet.kept:null,blocked=keptPresent(sheet),mutable=!!sheet&&!blocked&&draft(sheet);
 const source=kept?.source||(readableSource(sheet?.source)?sheet.source:null),placements=kept?.placements||(source&&validPlacements(source,sheet?.placements)?sheet.placements:null);
 const counts=kept?.counts||(source&&placements?tallyCounts(source,placements):null);
 const sheets=r.raw.map((s,index)=>{
  const id=object(s)&&own(s,'id')?s.id:null,ambiguous=sheetId(id)&&(countsById.get(id)||0)>1,format=sheetFormat(s),frozen=readableKeep(s?.kept)?s.kept:null;
  return {id:sheetId(id)?id:null,index,source:frozen?.source||(readableSource(s?.source)?s.source:null),readable:!!format&&!ambiguous&&(!!frozen||!keptPresent(s)&&draft(s)),ambiguous:!!ambiguous,kept:keptPresent(s)};
 });
 return {status:r.status,sheets,sheet,source,placements,counts,checks:Array.isArray(sheet?.checks)?sheet.checks.filter(readableCheck):[],kept,unreadableKept:blocked&&!kept,mutable,canCreate:r.status!=='unsupported'&&nextId(r.raw)!==null,canRevise:!!kept&&r.status==='ready'&&nextId(r.raw)!==null,next:source&&placements?source.days[placements.length]||null:null,unreadableCount:sheets.filter(s=>!s.readable).length};
}
function addSheet(c,source,placements,support,revisedFrom=null){
 const r=desk(c);if(r.status==='unsupported')return false;const id=nextId(r.raw);if(!id)return false;
 const sheet={kind:'weather-tally',version:1,id,source:clone(source),placements:clone(placements),support:clone(support),checks:[],kept:null};if(revisedFrom!==null)sheet.revisedFrom=revisedFrom;
 if(!own(c,'dataDesk'))c.dataDesk=[];c.dataDesk.push(sheet);return id;
}
export function createWeatherTally(state,source,options={}){if(!readableSource(source))return false;return write(state,'dataDesk',c=>addSheet(c,source,[],freshSupport()),options);}
function mutableChange(state,id,fn,options){return write(state,'dataDesk',c=>{const s=uniqueSheet(c,id);if(!s||keptPresent(s)||!draft(s))return false;return fn(s);},options);}
export function placeWeatherMark(state,id,code,options={}){return mutableChange(state,id,s=>{if(s.placements.length>=s.source.days.length||!s.source.categories.some(c=>c.code===code))return false;s.placements.push(code);return true;},options);}
export function undoWeatherMark(state,id,options={}){return mutableChange(state,id,s=>{if(!s.placements.length)return true;s.placements.pop();return true;},options);}
export function useWeatherSupport(state,id,key,options={}){if(!SUPPORT.includes(key)||key==='feedback')return false;return mutableChange(state,id,s=>{s.support[key]=true;return true;},options);}
export function checkWeatherTally(state,id,options={}){
 return mutableChange(state,id,s=>{
  if(!own(s,'checks'))s.checks=[];if(!dense(s.checks,8)||s.checks.length>=8)return false;
  const counts=tallyCounts(s.source,s.placements),expected=tallyCounts(s.source,s.source.days.map(d=>d.weather)),complete=s.placements.length===s.source.days.length,matches=complete&&s.source.categories.every(c=>counts[c.code]===expected[c.code]);
  s.checks.push({version:1,source:clone(s.source),placements:clone(s.placements),counts,expected,complete,matches,supportBefore:clone(s.support)});s.support.feedback=true;return true;
 },options);
}
export function keepWeatherTally(state,id,options={}){return mutableChange(state,id,s=>{s.kept={version:1,source:clone(s.source),placements:clone(s.placements),counts:tallyCounts(s.source,s.placements),support:clone(s.support)};return true;},options);}
export function reviseWeatherTally(state,id,options={}){return write(state,'dataDesk',c=>{const s=uniqueSheet(c,id);if(!s||!readableKeep(s.kept))return false;return addSheet(c,s.kept.source,s.kept.placements,s.kept.support,id);},options);}
