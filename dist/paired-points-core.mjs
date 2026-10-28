import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {pairedSource} from './paired-points-content.mjs';

const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.hasOwn(x,k);
const clone=x=>structuredClone(x);
const dense=(x,max=Infinity)=>Array.isArray(x)&&x.length<=max&&Object.keys(x).length===x.length&&Array.from(x).every((_,i)=>own(x,i));
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&x.length<=max;
const reserved=new Set(['__proto__','constructor','prototype','toString','valueOf']);
const code=x=>text(x,80)&&/^[\x20-\x7e]+$/.test(x)&&!reserved.has(x);
const MAX_ID=1e9,SUPPORT=['worked','patterns','narration','together','feedback'];
const sheetId=x=>typeof x==='string'&&/^paired-points-[1-9]\d{0,9}$/.test(x)&&Number(x.slice(14))<=MAX_ID;
const coordinate=(n,max)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
const axis=a=>object(a)&&Number.isSafeInteger(a.max)&&a.max>0&&a.max<=20&&text(a.label,160);

// Helpers are deliberately outside base-source validation: an old damaged example
// cannot close otherwise readable plotting, comparisons or kept work.
export function readableSource(s){
 if(!object(s)||!Number.isSafeInteger(s.version)||s.version<1||!code(s.id)||!text(s.title,160)||!text(s.origin,160)||!text(s.notice,600)||!text(s.context,600)||!object(s.axes)||!axis(s.axes.x)||!axis(s.axes.y)||!dense(s.datasets,3)||!s.datasets.length)return false;
 const cases=new Set();
 return s.datasets.every(c=>{
  if(!object(c)||!code(c.id)||cases.has(c.id)||!text(c.title,160)||!dense(c.rows,8)||!c.rows.length)return false;
  cases.add(c.id);const rows=new Set();
  return c.rows.every(r=>{if(!object(r)||!code(r.id)||rows.has(r.id)||!coordinate(r.x,s.axes.x.max)||!coordinate(r.y,s.axes.y.max))return false;rows.add(r.id);return true;});
 });
}
export const sourceCase=(source,caseId)=>readableSource(source)?source.datasets.find(c=>c.id===caseId)||null:null;
export function workedExample(source,caseId){
 const dataset=sourceCase(source,caseId),entries=source?.examples?.worked;
 if(!dataset||!dense(entries))return null;
 const found=entries.filter(e=>object(e)&&e.caseId===caseId);if(found.length!==1)return null;
 const e=found[0];return code(e.rowId)&&dataset.rows.some(r=>r.id===e.rowId)&&dense(e.steps,8)&&e.steps.length>0&&e.steps.every(s=>object(s)&&['origin','across','point'].includes(s.stage)&&text(s.text,600))?e:null;
}
export function patternExample(source){
 const p=source?.examples?.patterns;
 if(!readableSource(source)||!object(p)||!dense(p.caseIds,3)||!p.caseIds.length||!dense(p.paragraphs,8)||!p.paragraphs.length)return null;
 return new Set(p.caseIds).size===p.caseIds.length&&p.caseIds.every(id=>source.datasets.some(c=>c.id===id))&&p.paragraphs.every(p=>text(p,1000))?p:null;
}
export function validPlacements(source,caseId,placements){
 const c=sourceCase(source,caseId);return !!c&&dense(placements,c.rows.length)&&placements.every(p=>object(p)&&coordinate(p.x,source.axes.x.max)&&coordinate(p.y,source.axes.y.max));
}
const readableSupport=s=>object(s)&&SUPPORT.every(k=>own(s,k)&&typeof s[k]==='boolean');
const freshSupport=()=>Object.fromEntries(SUPPORT.map(k=>[k,false]));
export const readableCheck=(check,source,caseId)=>object(check)&&check.version===1&&validPlacements(source,caseId,check.placements)&&typeof check.complete==='boolean'&&dense(check.matches,check.placements.length)&&check.matches.length===check.placements.length&&check.matches.every(x=>typeof x==='boolean')&&readableSupport(check.supportBefore);
export const readableKeep=(kept,source,caseId)=>object(kept)&&kept.version===1&&validPlacements(source,caseId,kept.placements)&&readableSupport(kept.support);
const keptPresent=s=>object(s)&&own(s,'kept')&&s.kept!==null;
const sheetFormat=s=>object(s)&&s.kind==='paired-points'&&s.version===1&&sheetId(s.id);
const draft=s=>sheetFormat(s)&&!!sourceCase(s.source,s.caseId)&&validPlacements(s.source,s.caseId,s.placements)&&readableSupport(s.support);
function desk(state){
 if(!object(state))return {status:'unsupported',raw:null};
 if(!own(state,'pairedPoints'))return {status:'absent',raw:[]};
 return {status:Array.isArray(state.pairedPoints)?'ready':'unsupported',raw:state.pairedPoints};
}
function idCounts(raw){const counts=new Map();if(Array.isArray(raw))for(const s of raw)if(object(s)&&own(s,'id')&&sheetId(s.id))counts.set(s.id,(counts.get(s.id)||0)+1);return counts;}
function nextId(raw){
 if(!dense(raw)||raw.length>=24)return null;let n=1;
 for(const s of raw)if(object(s)&&own(s,'id')&&sheetId(s.id))n=Math.max(n,Number(s.id.slice(14))+1);
 return n<=MAX_ID?`paired-points-${n}`:null;
}
function uniqueSheet(state,id){
 const r=desk(state);if(r.status!=='ready'||!sheetId(id))return null;
 const found=r.raw.filter(s=>object(s)&&own(s,'id')&&s.id===id);return found.length===1&&sheetFormat(found[0])?found[0]:null;
}
function sheetData(s){
 const source=readableSource(s?.source)?s.source:null,dataset=sourceCase(source,s?.caseId);
 const kept=dataset&&readableKeep(s?.kept,source,s.caseId)?s.kept:null,blocked=keptPresent(s);
 const readable=sheetFormat(s)&&!!dataset&&(!!kept||!blocked&&draft(s));
 return {source,case:dataset,kept,unreadableKept:blocked&&!kept,placements:kept?.placements||(!blocked&&dataset&&validPlacements(source,s?.caseId,s?.placements)?s.placements:null),support:kept?.support||(!blocked&&readableSupport(s?.support)?s.support:null),readable:!!readable,mutable:!!readable&&!blocked};
}
function checkStatus(s){
 if(!object(s)||!own(s,'checks'))return 'ready';
 if(Array.isArray(s.checks)&&s.checks.length>=8)return 'capacity';
 return dense(s.checks)?'ready':'malformed';
}
export function pairedView(state,id=null){
 const r=desk(state),raw=Array.isArray(r.raw)?r.raw:[],counts=idCounts(raw),sheet=uniqueSheet(state,id),data=sheetData(sheet);
 const sheets=raw.map((s,index)=>{const id=object(s)&&own(s,'id')&&sheetId(s.id)?s.id:null,ambiguous=!!id&&counts.get(id)>1,d=sheetData(s);return {...d,id,index,ambiguous,readable:d.readable&&!ambiguous,mutable:d.mutable&&!ambiguous,keptPresent:keptPresent(s)};});
 return {status:r.status,raw:r.raw,sheets,sheet,...data,checks:data.source&&sheet&&Array.isArray(sheet.checks)?sheet.checks.filter(c=>readableCheck(c,data.source,sheet.caseId)):[],checkStatus:checkStatus(sheet),canCreate:r.status!=='unsupported'&&nextId(raw)!==null,canRevise:!!data.kept&&r.status==='ready'&&nextId(raw)!==null,next:data.case&&data.placements?data.case.rows[data.placements.length]||null:null,unreadableCount:sheets.filter(s=>!s.readable).length};
}

// A report gate receives a disposable whole-notebook candidate. The only committed
// value is the owning proposal captured before invoking that external callback.
function write(state,change,options={}){
 if(!object(state)||typeof options?.canExport!=='function')return false;
 try{
  const candidate=clone(state),r=desk(candidate);if(r.status==='unsupported'||!dense(r.raw))return false;
  const before=JSON.stringify(own(candidate,'pairedPoints')?candidate.pairedPoints:undefined),result=change(candidate);if(result===false)return false;
  const after=candidate.pairedPoints;if(before===JSON.stringify(after))return result??true;
  if(!dense(after))return false;const proposal=clone(after);
  if(!recoveryFitsProgressLimits(candidate)||options.canExport(candidate)!==true)return false;
  state.pairedPoints=proposal;return result??true;
 }catch{return false;}
}
function addSheet(candidate,source,caseId,placements,support,revisedFrom=null){
 const r=desk(candidate),id=nextId(r.raw);if(r.status==='unsupported'||!id)return false;
 const sheet={kind:'paired-points',version:1,id,source:clone(source),caseId,placements:clone(placements),support:clone(support),checks:[],kept:null};
 if(!draft(sheet))return false;
 if(revisedFrom!==null)sheet.revisedFrom=revisedFrom;
 if(!own(candidate,'pairedPoints'))candidate.pairedPoints=[];candidate.pairedPoints.push(sheet);return id;
}
export function createPairedChart(state,source,caseId,options={}){
 if(!sourceCase(source,caseId))return false;
 return write(state,c=>addSheet(c,source,caseId,[],freshSupport()),options);
}
function mutableChange(state,id,change,options){
 return write(state,c=>{const s=uniqueSheet(c,id);return s&&!keptPresent(s)&&draft(s)?change(s):false;},options);
}
export function placePairedPoint(state,id,x,y,options={}){
 return mutableChange(state,id,s=>{const c=sourceCase(s.source,s.caseId);if(s.placements.length>=c.rows.length||!coordinate(x,s.source.axes.x.max)||!coordinate(y,s.source.axes.y.max))return false;s.placements.push({x,y});return true;},options);
}
export function undoPairedPoint(state,id,options={}){return mutableChange(state,id,s=>{if(s.placements.length)s.placements.pop();return true;},options);}
export function usePairedSupport(state,id,key,options={}){
 if(!SUPPORT.includes(key)||key==='feedback')return false;
 return mutableChange(state,id,s=>{if(key==='worked'&&!workedExample(s.source,s.caseId)||key==='patterns'&&!patternExample(s.source))return false;s.support[key]=true;return true;},options);
}
export function checkPairedChart(state,id,options={}){
 return mutableChange(state,id,s=>{
  if(checkStatus(s)!=='ready'||!s.placements.length)return false;
  if(!own(s,'checks'))s.checks=[];const rows=sourceCase(s.source,s.caseId).rows;
  s.checks.push({version:1,placements:clone(s.placements),complete:s.placements.length===rows.length,matches:s.placements.map((p,i)=>p.x===rows[i].x&&p.y===rows[i].y),supportBefore:clone(s.support)});s.support.feedback=true;return true;
 },options);
}
export function keepPairedChart(state,id,options={}){return mutableChange(state,id,s=>{s.kept={version:1,placements:clone(s.placements),support:clone(s.support)};return true;},options);}
export function revisePairedChart(state,id,options={}){
 return write(state,c=>{const s=uniqueSheet(c,id);if(!s||!readableKeep(s.kept,s.source,s.caseId))return false;return addSheet(c,s.source,s.caseId,s.kept.placements,s.kept.support,id);},options);
}
