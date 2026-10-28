import {feedingBoardSource} from './feeding-board-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

const own=(x,k)=>x!==null&&typeof x==='object'&&Object.hasOwn(x,k);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const fields=(x,ks)=>obj(x)&&ks.every(k=>own(x,k));
const positive=x=>Number.isSafeInteger(x)&&x>0;
const code=x=>typeof x==='string'&&/^[\x20-\x7e]{1,80}$/.test(x)&&!['__proto__','prototype','constructor','toString','valueOf'].includes(x);
const text=(x,n)=>typeof x==='string'&&x.trim().length>0&&x.length<=n&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x);
const dense=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const unique=(xs,key='id')=>new Set(xs.map(x=>x?.[key])).size===xs.length;
const art=x=>fields(x,['kind','version','description'])&&code(x.kind)&&positive(x.version)&&text(x.description,600);
const result=(ok,changed=false,codeValue=ok?'unchanged':'unreadable')=>({ok,changed,code:codeValue});
export const feedingSupportFlags=['clue','example','source','narration','together'];
const freshSupport=()=>Object.fromEntries(feedingSupportFlags.map(k=>[k,false]));
const flags=x=>fields(x,feedingSupportFlags)&&feedingSupportFlags.every(k=>typeof x[k]==='boolean');
const outcome=x=>['fits','other'].includes(x);
function reference(x){if(!fields(x,['title','publisher','url'])||!text(x.title,300)||!text(x.publisher,160)||!text(x.url,1500)||!/^https?:\/\/[^\s<>"'`\\]+$/u.test(x.url))return false;try{return ['http:','https:'].includes(new URL(x.url).protocol);}catch{return false;}}
export function validFeedingSource(s){
 if(!fields(s,['id','version','title','origin','notice','baskets','animals','contrasts'])||!code(s.id)||!positive(s.version)||!text(s.title,160)||!text(s.origin,160)||!text(s.notice,1000)||!dense(s.baskets,1,3)||!dense(s.animals,1,14)||!dense(s.contrasts,0,4))return false;
 if(!s.baskets.every(b=>fields(b,['id','label','meaning'])&&code(b.id)&&text(b.label,160)&&text(b.meaning,160))||!unique(s.baskets))return false;
 const baskets=new Set(s.baskets.map(b=>b.id));
 if(!s.animals.every(a=>fields(a,['id','name','scientificName','foods','usualDiet','basketId','guided','feedback','hint','sourceNote','reference','art'])&&code(a.id)&&text(a.name,160)&&text(a.scientificName,160)&&dense(a.foods,1,6)&&unique(a.foods)&&a.foods.every(f=>fields(f,['id','label','kind','art'])&&code(f.id)&&text(f.label,160)&&['plant','animal'].includes(f.kind)&&art(f.art))&&text(a.usualDiet,1000)&&baskets.has(a.basketId)&&dense(a.guided,0,3)&&a.guided.every(t=>text(t,600))&&dense(a.feedback,1,3)&&a.feedback.length===baskets.size&&unique(a.feedback,'basketId')&&a.feedback.every(f=>fields(f,['basketId','outcome','code','text'])&&baskets.has(f.basketId)&&outcome(f.outcome)&&code(f.code)&&text(f.text,1000))&&a.feedback.filter(f=>f.outcome==='fits').length===1&&text(a.hint,600)&&text(a.sourceNote,1000)&&reference(a.reference)&&art(a.art)))return false;
 const ids=new Set(s.animals.map(a=>a.id));
 if(!s.contrasts.every(c=>fields(c,['id','title','animalIds','prompt','options','hint'])&&code(c.id)&&text(c.title,160)&&dense(c.animalIds,2,2)&&new Set(c.animalIds).size===2&&c.animalIds.every(i=>ids.has(i))&&text(c.prompt,1000)&&text(c.hint,1000)&&dense(c.options,3,3)&&unique(c.options)&&c.options.every(o=>fields(o,['id','text','outcome','code','feedback'])&&code(o.id)&&text(o.text,1000)&&outcome(o.outcome)&&code(o.code)&&text(o.feedback,1000))&&c.options.filter(o=>o.outcome==='fits').length===1))return false;
 return unique([...s.animals,...s.contrasts]);
}
function helpersView(s){const h=obj(s.helpers)?s.helpers:{},ids=new Set(s.animals.map(a=>a.id));return {
 teaching:dense(h.teaching,1,3)&&h.teaching.every(t=>fields(t,['animalIds','text'])&&dense(t.animalIds,1,14)&&new Set(t.animalIds).size===t.animalIds.length&&t.animalIds.every(i=>ids.has(i))&&text(t.text,1000))?h.teaching:null,
 workedExample:fields(h.workedExample,['animalId','steps'])&&ids.has(h.workedExample.animalId)&&dense(h.workedExample.steps,1,3)&&h.workedExample.steps.every(t=>text(t,600))?h.workedExample:null,
 glossary:dense(h.glossary,1,4)&&h.glossary.every(g=>fields(g,['term','text'])&&text(g.term,80)&&text(g.text,600))?h.glossary:null
};}
const cases=s=>[...s.animals,...s.contrasts];
const caseOf=(s,id)=>cases(s).find(c=>c.id===id);
const isSort=(s,id)=>s.animals.some(a=>a.id===id);
function validDraft(e,s,kind){const field=kind==='sort'?'basketId':'choiceId',c=caseOf(s,e?.caseId);return fields(e,['caseId',field])&&c&&(kind==='sort'?isSort(s,c.id)&&s.baskets.some(b=>b.id===e[field]):!isSort(s,c.id)&&c.options.some(o=>o.id===e[field]));}
function validCheck(c,s,id,kind,after){const field=kind==='sort'?'basketId':'choiceId';return fields(c,[field,'outcome','feedbackCode','supportBefore','teachingBefore','afterFeedback'])&&validDraft({caseId:id,[field]:c[field]},s,kind)&&outcome(c.outcome)&&code(c.feedbackCode)&&flags(c.supportBefore)&&typeof c.teachingBefore==='boolean'&&c.afterFeedback===after;}
function validRecord(e,s,kind){return fields(e,['caseId','checkCount','first'])&&positive(e.checkCount)&&e.checkCount<=1e9&&validCheck(e.first,s,e.caseId,kind,false)&&(e.checkCount===1?!own(e,'latest'):own(e,'latest')&&validCheck(e.latest,s,e.caseId,kind,true));}
function section(value,present,validate){
 if(!present)return {status:'ready',readable:[],unreadable:[]};
 if(!dense(value,0,200000))return {status:'unreadable',readable:[],unreadable:[]};
 const counts=new Map();for(const e of value)if(obj(e)&&own(e,'caseId'))counts.set(e.caseId,(counts.get(e.caseId)||0)+1);
 const readable=[],unreadable=[];for(const e of value)(validate(e)&&counts.get(e.caseId)===1?readable:unreadable).push(e);
 return {status:'ready',readable,unreadable};
}
export function readFeedingBoard(state){
 if(!own(state,'feedingBoard'))return {status:'missing',root:null};
 const r=state.feedingBoard;if(!fields(r,['kind','version'])||r.kind!=='feeding-board'||r.version!==1)return {status:'unsupported',root:r};
 if(!own(r,'source')||!validFeedingSource(r.source))return {status:'unreadable',root:r};
 const s=r.source,d=obj(r.draft)?r.draft:null,draftPresent=own(r,'draft');
 return {status:'ready',root:r,source:s,helpers:helpersView(s),
 sorts:section(r.sorts,own(r,'sorts'),e=>validRecord(e,s,'sort')),
 ideas:section(r.ideas,own(r,'ideas'),e=>validRecord(e,s,'idea')),
 support:section(r.support,own(r,'support'),e=>fields(e,['caseId'])&&!!caseOf(s,e.caseId)&&flags(e)),
 draftSorts:draftPresent&&!d?{status:'unreadable',readable:[],unreadable:[]}:section(d?.sorts,!!d&&own(d,'sorts'),e=>validDraft(e,s,'sort')),
 draftIdeas:draftPresent&&!d?{status:'unreadable',readable:[],unreadable:[]}:section(d?.ideas,!!d&&own(d,'ideas'),e=>validDraft(e,s,'idea'))};
}
const entry=(s,id)=>s.readable.find(e=>e.caseId===id)||null;
const bad=(s,id)=>s.status!=='ready'||s.unreadable.some(e=>obj(e)&&e.caseId===id);
export function feedingCaseView(stateOrView,id){
 const v=stateOrView?.status&&own(stateOrView,'root')?stateOrView:readFeedingBoard(stateOrView);
 if(v.status!=='ready')return {status:v.status};const c=caseOf(v.source,id);if(!c)return {status:'missing'};
 const kind=isSort(v.source,id)?'sort':'idea',records=kind==='sort'?v.sorts:v.ideas,drafts=kind==='sort'?v.draftSorts:v.draftIdeas;
 const record=entry(records,id),draft=entry(drafts,id),latest=record?.latest||record?.first||null,field=kind==='sort'?'basketId':'choiceId';
 return {status:bad(records,id)||bad(drafts,id)||bad(v.support,id)||typeof v.root.teaching!=='boolean'?'unreadable':'ready',case:c,kind,draft,record,latest,support:entry(v.support,id)||{caseId:id,...freshSupport()},draftReadable:!bad(drafts,id),recordReadable:!bad(records,id),supportReadable:!bad(v.support,id),draftStatus:!draft?(record?'waiting':'unchecked'):!record?'unchecked':draft[field]===latest[field]?'checked':'changed'};
}
function commit(state,root,canExport){
 try{const candidate=structuredClone(state);candidate.feedingBoard=root;if(typeof canExport!=='function'||!recoveryFitsProgressLimits(candidate)||canExport(candidate)!==true)return result(false,false,'report-safety');state.feedingBoard=root;return result(true,true,'changed');}catch{return result(false,false,'report-safety');}
}
export function createFeedingBoard(state,canExport){const v=readFeedingBoard(state);if(v.status==='ready')return result(true);if(v.status!=='missing')return result(false,false,v.status);return commit(state,{kind:'feeding-board',version:1,source:structuredClone(feedingBoardSource),draft:{sorts:[],ideas:[]},sorts:[],ideas:[],support:[],teaching:false},canExport);}
function ready(state){const v=readFeedingBoard(state);return v.status==='ready'?v:result(false,false,v.status);}
function replace(list,id,e){const i=list.findIndex(x=>obj(x)&&x.caseId===id);if(i<0)list.push(e);else list[i]=e;}
function setDraft(state,id,value,kind,canExport){
 const v=ready(state);if(!v.root)return v;const c=caseOf(v.source,id),sec=kind==='sort'?v.draftSorts:v.draftIdeas;
 if(bad(sec,id))return result(false,false,'unreadable');if(!c||isSort(v.source,id)!==(kind==='sort'))return result(false,false,'invalid-choice');
 const field=kind==='sort'?'basketId':'choiceId',e={...(entry(sec,id)||{}),caseId:id,[field]:value};if(!validDraft(e,v.source,kind))return result(false,false,'invalid-choice');if(entry(sec,id)?.[field]===value)return result(true);
 const r=structuredClone(v.root);if(!own(r,'draft'))r.draft={};const name=kind==='sort'?'sorts':'ideas';if(!own(r.draft,name))r.draft[name]=[];replace(r.draft[name],id,e);return commit(state,r,canExport);
}
export const setSortDraft=(state,id,basketId,canExport)=>setDraft(state,id,basketId,'sort',canExport);
export const setIdeaDraft=(state,id,choiceId,canExport)=>setDraft(state,id,choiceId,'idea',canExport);
function check(state,id,kind,canExport){
 const v=ready(state);if(!v.root)return v;const c=feedingCaseView(v,id);if(c.status==='unreadable')return result(false,false,'unreadable');if(c.status!=='ready'||c.kind!==kind)return result(false,false,'invalid-choice');
 const field=kind==='sort'?'basketId':'choiceId';if(!c.draft)return result(false,false,'missing-draft');
 const before=Object.fromEntries(feedingSupportFlags.map(k=>[k,c.support[k]])),last=c.latest;
 if(last&&last[field]===c.draft[field]&&last.teachingBefore===v.root.teaching&&feedingSupportFlags.every(k=>last.supportBefore[k]===before[k]))return result(true);
 if(c.record?.checkCount>=1e9)return result(false,false,'check-count-cap');
 const choice=kind==='sort'?c.case.feedback.find(f=>f.basketId===c.draft[field]):c.case.options.find(o=>o.id===c.draft[field]);if(!choice)return result(false,false,'invalid-choice');
 const saved={...(c.record?.latest?structuredClone(c.record.latest):{}),[field]:c.draft[field],outcome:choice.outcome,feedbackCode:choice.code,supportBefore:before,teachingBefore:v.root.teaching,afterFeedback:!!c.record},r=structuredClone(v.root),name=kind==='sort'?'sorts':'ideas';if(!own(r,name))r[name]=[];
 const rec=c.record?{...structuredClone(c.record),checkCount:c.record.checkCount+1,latest:saved}:{caseId:id,checkCount:1,first:saved};replace(r[name],id,rec);return commit(state,r,canExport);
}
export const checkSort=(state,id,canExport)=>check(state,id,'sort',canExport);
export const checkIdea=(state,id,canExport)=>check(state,id,'idea',canExport);
export function noteFeedingSupport(state,id,flag,canExport){
 const v=ready(state);if(!v.root)return v;if(bad(v.support,id))return result(false,false,'unreadable');if(!caseOf(v.source,id)||!feedingSupportFlags.includes(flag))return result(false,false,'invalid-choice');
 const current=entry(v.support,id);if(current?.[flag]===true)return result(true);const r=structuredClone(v.root);if(!own(r,'support'))r.support=[];replace(r.support,id,{...(current?structuredClone(current):{caseId:id,...freshSupport()}),[flag]:true});return commit(state,r,canExport);
}
export function noteFeedingTeaching(state,canExport){const v=ready(state);if(!v.root)return v;if(typeof v.root.teaching!=='boolean')return result(false,false,'unreadable');if(v.root.teaching)return result(true);const r=structuredClone(v.root);r.teaching=true;return commit(state,r,canExport);}
