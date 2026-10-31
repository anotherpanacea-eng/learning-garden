// Spec331: supplied spelling, owned snapshots and partial-letter recovery.
import {makeEndingsShelfSource} from './endings-shelf-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {stainedMapRows,stainedMapCards,validStainedJob,validStainedWork,sameStainedWork,stainedJobResult} from './stained-map-core.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),clone=structuredClone;
const id=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(x)&&!['constructor','prototype','toString','valueOf'].includes(x);
const text=x=>typeof x==='string'&&[...x].length<=4000,list=x=>Array.isArray(x)&&x.length<=64;
const named=x=>object(x)&&id(x.id)&&text(x.text);
const help=x=>object(x)&&typeof x.hint==='boolean'&&typeof x.example==='boolean';
function sized(x){try{return object(x)&&new TextEncoder().encode(JSON.stringify(x)).length<=96*1024;}catch{return false;}}
const sourceBase=s=>sized(s)&&s.format===1&&id(s.id);
export const endingsViews=Object.freeze(['letter','pairs','practice']);
export const endingsCards=stainedMapCards;
export const endingsRows=stainedMapRows;
export const validEndingsJob=s=>validStainedJob(s)&&s.kind==='choice'&&object(s.copy)&&text(s.copy.incomplete)&&text(s.copy.partDifferent);
export const endingsPairs=s=>stainedMapRows(s?.pairs,x=>['front','back','spoken'].every(k=>text(x[k])));
export function endingsLetterSource(s){
 if(!sourceBase(s)||!object(s.letter)||!id(s.letter.id)||!list(s.letter.segments)||!object(s.copy)||!['incomplete','different','fit','partialFit','partial','empty'].every(k=>text(s.copy[k])))return null;
 const raw=s.letter,rawTrays=list(raw.trays)?raw.trays:[],trays=stainedMapRows(rawTrays,t=>list(t.choices)).map(t=>({...t,choices:stainedMapRows(t.choices,named)}));
 const refs=new Set(raw.segments.filter(x=>object(x)&&own(x,'gapId')&&!own(x,'text')&&id(x.gapId)).map(x=>x.gapId));
 const gaps=stainedMapRows(raw.gaps,g=>['prefix','complete','note','different'].every(k=>text(g[k]))&&id(g.trayId)&&id(g.key));
 const parts=gaps.flatMap(g=>{const tray=trays.find(t=>t.id===g.trayId);return refs.has(g.id)&&tray?.choices.some(c=>c.id===g.key)?[{...g,choices:tray.choices}]:[];});
 const segments=raw.segments.map(x=>object(x)&&own(x,'text')&&!own(x,'gapId')&&text(x.text)?{text:x.text}:object(x)&&own(x,'gapId')&&!own(x,'text')&&parts.some(g=>g.id===x.gapId)?{gapId:x.gapId}:{unavailable:true});
 const partial=!list(raw.gaps)||parts.length!==raw.gaps.length||!list(raw.trays)||trays.length!==rawTrays.length||segments.some(x=>x.unavailable)||trays.some(t=>t.choices.length!==rawTrays.find(raw=>raw.id===t.id)?.choices.length);
 return parts.length?{id:raw.id,kind:'letter',parts,segments,copy:s.copy,partial}:null;
}
const pick=(w,k)=>own(w.placements,k)?w.placements[k]:null;
export const validEndingsLetterWork=(s,w)=>!!s&&object(w)&&object(w.placements)&&s.parts.every(g=>!own(w.placements,g.id)||w.placements[g.id]===null||g.choices.some(c=>c.id===w.placements[g.id]));
export const sameEndingsLetterWork=(s,a,b)=>validEndingsLetterWork(s,a)&&validEndingsLetterWork(s,b)&&s.parts.every(g=>(pick(a,g.id)??null)===(pick(b,g.id)??null));
export const endingsWord=(s,g,ending)=>g.prefix+(ending?ending.text:s.copy.empty);
const feedback=x=>Array.isArray(x)&&x.length<=128&&x.every(t=>typeof t==='string'&&[...t].length<=16000);
const validWork=(s,w)=>s?.kind==='letter'?validEndingsLetterWork(s,w):validStainedWork(s,w);
const sameWork=(s,a,b)=>s?.kind==='letter'?sameEndingsLetterWork(s,a,b):sameStainedWork(a,b);
const validCheck=(s,c)=>object(c)&&validWork(s,c.work)&&['incomplete','different','fit'].includes(c.outcome)&&feedback(c.feedback)&&c.supported===true&&c.guided===true&&(s.kind==='letter'||help(c.help));
export const validEndingsKeep=(s,k)=>object(k)&&validWork(s,k.work)&&(s.kind==='letter'||help(k.help))&&(k.check===null||validCheck(s,k.check)&&sameWork(s,k.work,k.check.work));
const field=(r,k,test)=>!own(r,k)?'missing':test(r[k])?'ready':'unreadable';
function entry(source,record,present){
 const status=!source?'unavailable':!present?'missing':!object(record)?'unreadable':'ready';
 if(status!=='ready')return {status,source,record:present?record:null,draftStatus:'missing',helpStatus:'missing',checksStatus:'missing',firstStatus:'missing',latestStatus:'missing',last:null,earlier:false,partial:false};
 const draftStatus=field(record,'work',w=>validWork(source,w)),helpStatus=source.kind==='letter'?'missing':field(record,'help',help),checksStatus=field(record,'checks',Array.isArray);
 const checks=checksStatus==='ready'?record.checks.filter(c=>validCheck(source,c)):[],last=checks.at(-1)??null;
 return {status,source,record,draftStatus,helpStatus,checksStatus,firstStatus:field(record,'firstKept',k=>k===null||validEndingsKeep(source,k)),latestStatus:field(record,'latestKept',k=>k===null||validEndingsKeep(source,k)),last,earlier:!!last&&draftStatus==='ready'&&!sameWork(source,last.work,record.work),partial:checksStatus==='ready'&&checks.length!==record.checks.length};
}
export function endingsShelfView(state){
 if(!object(state)||!own(state,'endingsShelf'))return {status:'new',root:null,source:null,view:'choose',letter:null,pairs:[],cards:[],jobs:[],current:null};
 const r=state.endingsShelf;
 if(!object(r)||r.v!==1)return {status:'unsupported',root:r,source:null,view:'choose',letter:null,pairs:[],cards:[],jobs:[],current:null};
 const source=sourceBase(r.source)?r.source:null,offered=source?stainedMapRows(source.jobs,validEndingsJob):[],keys=offered.map(j=>j.id);
 if(object(r.items))for(const key of Object.keys(r.items))if(id(key)&&!keys.includes(key))keys.push(key);
 const jobs=keys.map(key=>{const present=object(r.items)&&own(r.items,key),raw=present?r.items[key]:null,s=present?(object(raw)&&validEndingsJob(raw.source)&&raw.source.id===key?raw.source:null):offered.find(j=>j.id===key),view=entry(s,raw,present);if(own(r,'items')&&!object(r.items))view.status='unreadable';return {id:key,...view};});
 return {status:'ready',root:r,source,view:endingsViews.includes(r.view)?r.view:'choose',letter:entry(endingsLetterSource(source),r.letter,own(r,'letter')),pairs:endingsPairs(source),cards:endingsCards(source),jobs,current:jobs.find(j=>j.id===r.currentId)??null};
}
const failure=error=>({ok:false,error});
function mutate(state,fn,options={}){
 if(!object(state)||typeof options.canExport!=='function')return failure('capacity');
 try{const candidate=clone(state);if(!own(candidate,'endingsShelf'))candidate.endingsShelf={v:1,source:makeEndingsShelfSource(),view:'letter',currentId:null,items:{}};
  const r=candidate.endingsShelf;if(!object(r)||r.v!==1)return failure('unavailable');const result=fn(r,candidate);if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(candidate))return failure('capacity');const proposal=clone(r);if(options.canExport(candidate)!==true)return failure('capacity');state.endingsShelf=proposal;return result;
 }catch{return failure('capacity');}
}
function draft(source,r){
 if(!object(r))return false;
 if(!own(r,'work'))r.work=source.kind==='letter'?{placements:Object.fromEntries(source.parts.map(g=>[g.id,null]))}:{choice:null};
 if(!validWork(source,r.work))return false;
 if(source.kind!=='letter'){if(!own(r,'help'))r.help={hint:false,example:false};if(!help(r.help))return false;}return true;
}
export function openEndingsTable(state,view,options){return mutate(state,(r,candidate)=>{
 if(!endingsViews.includes(view))return failure('selection');const v=endingsShelfView(candidate);
 if(view==='letter'){const s=v.letter.source;if(!s)return failure('unavailable');if(!own(r,'letter'))r.letter={work:{placements:Object.fromEntries(s.parts.map(g=>[g.id,null]))},checks:[],firstKept:null,latestKept:null};if(!draft(s,r.letter))return failure('unavailable');}
 if(view==='pairs'&&!v.pairs.length)return failure('unavailable');
 if(view==='practice'&&!v.jobs.length)return failure('unavailable');r.view=view;return {ok:true};
 },options);}
export function openEndingsJob(state,key,options){return mutate(state,r=>{
 if(!id(key))return failure('selection');if(!own(r,'items'))r.items={};if(!object(r.items))return failure('unavailable');
 if(!own(r.items,key)){const source=sourceBase(r.source)?stainedMapRows(r.source.jobs,validEndingsJob).find(j=>j.id===key):null;if(!source)return failure('unavailable');r.items[key]={source:clone(source),work:{choice:null},help:{hint:false,example:false},checks:[],firstKept:null,latestKept:null};}
 const item=r.items[key];if(!object(item)||!validEndingsJob(item.source)||item.source.id!==key||!draft(item.source,item))return failure('unavailable');r.view='practice';r.currentId=key;return {ok:true};
 },options);}
function edit(state,kind,key,fn,options){return mutate(state,(r,candidate)=>{
 const v=endingsShelfView(candidate),e=kind==='letter'?v.letter:v.jobs.find(j=>j.id===key);
 if(!e||e.status!=='ready'||e.draftStatus!=='ready'||kind!=='letter'&&e.helpStatus!=='ready')return failure('unavailable');return fn(e.record,e.source,r);
 },options);}
export function placeEndingsWord(state,key,ending,options){return edit(state,'letter',null,(r,s)=>{
 const g=s.parts.find(g=>g.id===key);if(!g||ending!==null&&!g.choices.some(c=>c.id===ending))return failure('selection');r.work.placements[key]=ending;return {ok:true};
 },options);}
export function answerEndingsJob(state,key,choice,options){return edit(state,'job',key,(r,s)=>{
 if(choice!==null&&!s.choices.some(c=>c.id===choice))return failure('selection');r.work.choice=choice;return {ok:true};
 },options);}
export function endingsLetterResult(s,w){
 if(!validEndingsLetterWork(s,w))return null;
 const missing=s.parts.some(g=>(pick(w,g.id)??null)===null),different=s.parts.some(g=>(pick(w,g.id)??null)!==null&&pick(w,g.id)!==g.key),outcome=missing?'incomplete':different?'different':'fit';
 const lines=[outcome==='fit'&&s.partial?s.copy.partialFit:s.copy[outcome]];
 for(const g of s.parts)if((pick(w,g.id)??null)!==null&&pick(w,g.id)!==g.key)lines.push(endingsWord(s,g,null)+': '+g.different);
 if(s.partial)lines.push(s.copy.partial);return {outcome,feedback:lines};
}
function check(state,kind,key,options){return edit(state,kind,key,(r,s)=>{
 if(own(r,'checks')&&!Array.isArray(r.checks))return failure('unavailable');const result=kind==='letter'?endingsLetterResult(s,r.work):stainedJobResult(s,r.work);if(!result)return failure('unavailable');
 if(!own(r,'checks'))r.checks=[];r.checks.push({work:clone(r.work),...(kind==='letter'?{}:{help:clone(r.help)}),...result,supported:true,guided:true});return {ok:true,...result};
 },options);}
function keep(state,kind,key,options){return edit(state,kind,key,(r,s)=>{
 if(own(r,'latestKept')&&r.latestKept!==null&&!validEndingsKeep(s,r.latestKept))return failure('unavailable');const last=Array.isArray(r.checks)?r.checks.filter(c=>validCheck(s,c)).at(-1):null;
 const keep={work:clone(r.work),...(kind==='letter'?{}:{help:clone(r.help)}),check:validCheck(s,last)&&sameWork(s,last.work,r.work)?clone(last):null};
 if(!own(r,'firstKept')||r.firstKept===null)r.firstKept=clone(keep);r.latestKept=keep;return {ok:true};
 },options);}
function restore(state,kind,key,edition,options){return edit(state,kind,key,(r,s)=>{
 if(!['first','latest'].includes(edition))return failure('selection');const keep=r[edition+'Kept'];if(!validEndingsKeep(s,keep))return failure('unavailable');
 if(kind==='letter')for(const g of s.parts)r.work.placements[g.id]=clone(pick(keep.work,g.id)??null);
 else{r.work=clone(keep.work);for(const flag of ['hint','example'])r.help[flag] ||= keep.help[flag];}return {ok:true};
 },options);}
export function useEndingsHelp(state,key,flag,options){return edit(state,'job',key,r=>{
 if(!['hint','example'].includes(flag))return failure('selection');if(r.help[flag])return {ok:true,changed:false};r.help[flag]=true;return {ok:true};
 },options);}

export const checkEndingsLetter=(state,options)=>check(state,'letter',null,options);
export const checkEndingsJob=(state,key,options)=>check(state,'job',key,options);
export const keepEndingsLetter=(state,options)=>keep(state,'letter',null,options);
export const keepEndingsJob=(state,key,options)=>keep(state,'job',key,options);
export const restoreEndingsLetter=(state,edition,options)=>restore(state,'letter',null,edition,options);
export const restoreEndingsJob=(state,key,edition,options)=>restore(state,'job',key,edition,options);
