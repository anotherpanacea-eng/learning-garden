import {mixingTableSource} from './mixing-table-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>x!==null&&typeof x==='object'&&Object.hasOwn(x,k);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const fields=(x,ks)=>obj(x)&&ks.every(k=>own(x,k));
const positive=x=>Number.isSafeInteger(x)&&x>0;
const code=x=>typeof x==='string'&&/^[\x20-\x7e]{1,80}$/.test(x)&&!['__proto__','prototype','constructor','toString','valueOf'].includes(x);
const text=(x,n)=>typeof x==='string'&&x.trim().length>0&&x.length<=n&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x);
const dense=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const unique=(xs,key='id')=>new Set(xs.map(x=>x?.[key])).size===xs.length;
const count=x=>Number.isInteger(x)&&x>=0&&x<=24;
const counts=x=>fields(x,['a','b'])&&count(x.a)&&count(x.b);
const comparison=x=>['same','different'].includes(x);
const outcomeCodes=['same-fit','same-miss','different-fit','different-miss'];
const result=(ok,changed=false,codeValue=ok?'unchanged':'unreadable')=>({ok,changed,code:codeValue});
export const mixingSupportFlags=['clue','example','groups','table','narration','together'];
const freshSupport=()=>Object.fromEntries(mixingSupportFlags.map(k=>[k,false]));
const flags=x=>fields(x,mixingSupportFlags)&&mixingSupportFlags.every(k=>typeof x[k]==='boolean');
export function validMixingSource(s){
 if(!fields(s,['id','version','title','origin','notice','model','pairs','cases'])||!code(s.id)||!positive(s.version)||!text(s.title,160)||!text(s.origin,160)||!text(s.notice,1000)||!fields(s.model,['id','maxPerIngredient'])||!code(s.model.id)||!positive(s.model.maxPerIngredient)||s.model.maxPerIngredient>24||!dense(s.pairs,1,3)||!unique(s.pairs)||!dense(s.cases,1,8)||!unique(s.cases))return false;
 if(!s.pairs.every(p=>fields(p,['id','ingredients'])&&code(p.id)&&dense(p.ingredients,2,2)&&unique(p.ingredients)&&p.ingredients.every(i=>fields(i,['id','label','pattern','rgb'])&&code(i.id)&&text(i.label,160)&&['dots','stripes','crosshatch','chevrons'].includes(i.pattern)&&dense(i.rgb,3,3)&&i.rgb.every(n=>Number.isInteger(n)&&n>=0&&n<=255))))return false;
 const ids=new Set(s.pairs.map(p=>p.id));
 return s.cases.every(c=>fields(c,['id','title','pairId','sample','initial','goal','prompt','clue','guided','feedback','explanation','reasonPrompt'])&&code(c.id)&&text(c.title,160)&&ids.has(c.pairId)&&counts(c.sample)&&c.sample.a>0&&c.sample.b>0&&counts(c.initial)&&fields(c.goal,['comparison'])&&comparison(c.goal.comparison)&&['a','b'].every(k=>!own(c.goal,k)||count(c.goal[k]))&&text(c.prompt,1000)&&text(c.clue,600)&&dense(c.guided,0,3)&&c.guided.every(t=>text(t,600))&&fields(c.feedback,outcomeCodes)&&outcomeCodes.every(k=>text(c.feedback[k],1200))&&text(c.explanation,1200)&&text(c.reasonPrompt,1000));
}
function helpersView(s){
 const h=obj(s.helpers)?s.helpers:{},ids=new Set(s.pairs.map(p=>p.id)),valid=h=>fields(h,['title','steps'])&&text(h.title,160)&&dense(h.steps,1,3)&&h.steps.every(t=>fields(t,['pairId','diagrams','text'])&&ids.has(t.pairId)&&text(t.text,1000)&&dense(t.diagrams,1,2)&&t.diagrams.every(d=>counts(d)&&d.a+d.b>0&&text(d.label,160)));
 return {teaching:valid(h.teaching)?h.teaching:null,example:valid(h.example)?h.example:null};
}
const caseOf=(s,id)=>s.cases.find(c=>c.id===id);
const validDraft=(e,s)=>fields(e,['caseId','a','b'])&&!!caseOf(s,e.caseId)&&counts(e);
function validPaint(p,c,after){return fields(p,['a','b','comparison','goal','feedbackCode','supportBefore','teachingBefore','afterFeedback'])&&counts(p)&&p.a+p.b>0&&comparison(p.comparison)&&['fits','try-again'].includes(p.goal)&&own(c.feedback,p.feedbackCode)&&p.feedbackCode===p.comparison+'-'+(p.goal==='fits'?'fit':'miss')&&flags(p.supportBefore)&&typeof p.teachingBefore==='boolean'&&p.afterFeedback===after;}
function validRecord(e,s){const c=caseOf(s,e?.caseId);return fields(e,['caseId','paintCount','first'])&&!!c&&positive(e.paintCount)&&e.paintCount<=1e9&&validPaint(e.first,c,false)&&(e.paintCount===1?!own(e,'latest'):own(e,'latest')&&validPaint(e.latest,c,true));}
function section(value,present,validate){
 if(!present)return {status:'ready',readable:[],unreadable:[]};
 if(!dense(value,0,200000))return {status:'unreadable',readable:[],unreadable:[]};
 const counts=new Map();for(const e of value)if(obj(e)&&own(e,'caseId'))counts.set(e.caseId,(counts.get(e.caseId)||0)+1);
 const readable=[],unreadable=[];for(const e of value)(validate(e)&&counts.get(e.caseId)===1?readable:unreadable).push(e);
 return {status:'ready',readable,unreadable};
}
export function readMixingTable(state){
 if(!own(state,'mixingTable'))return {status:'missing',root:null};
 const r=state.mixingTable;if(!fields(r,['kind','version'])||r.kind!=='mixing-table'||r.version!==1)return {status:'unsupported',root:r};
 if(!own(r,'source')||!validMixingSource(r.source))return {status:'unreadable',root:r};
 const s=r.source;return {status:'ready',root:r,source:s,helpers:helpersView(s),modelSupported:s.model.id==='toy-scoop-rgb-v1'&&s.model.maxPerIngredient===24,
 drafts:section(r.drafts,own(r,'drafts'),e=>validDraft(e,s)),observations:section(r.observations,own(r,'observations'),e=>validRecord(e,s)),support:section(r.support,own(r,'support'),e=>fields(e,['caseId'])&&!!caseOf(s,e.caseId)&&flags(e))};
}
const entry=(s,id)=>s.readable.find(e=>e.caseId===id)||null;
const bad=(s,id)=>s.status!=='ready'||s.unreadable.some(e=>obj(e)&&e.caseId===id);
export function mixingCaseView(stateOrView,id){
 const v=stateOrView?.status&&own(stateOrView,'root')?stateOrView:readMixingTable(stateOrView);
 if(v.status!=='ready')return {status:v.status};const c=caseOf(v.source,id);if(!c)return {status:'missing'};
 const draft=entry(v.drafts,id),record=entry(v.observations,id),latest=record?.latest||record?.first||null;
 const draftReadable=!bad(v.drafts,id),recordReadable=!bad(v.observations,id),supportReadable=!bad(v.support,id),amounts=draftReadable?{a:(draft||c.initial).a,b:(draft||c.initial).b}:null;
 return {status:draftReadable&&recordReadable&&supportReadable&&typeof v.root.teaching==='boolean'?'ready':'unreadable',case:c,pair:v.source.pairs.find(p=>p.id===c.pairId),draft,counts:amounts,suppliedStart:!draft&&draftReadable,record,latest,support:supportReadable?(entry(v.support,id)||{caseId:id,...freshSupport()}):null,draftState:!draftReadable?'unreadable':draft?'present':'missing',recordState:!recordReadable?'unreadable':record?'present':'missing',supportState:!supportReadable?'unreadable':entry(v.support,id)?'present':'missing',draftReadable,recordReadable,supportReadable,modelSupported:v.modelSupported,draftStatus:!draftReadable||!recordReadable?'unreadable':!latest?'unpainted':amounts.a===latest.a&&amounts.b===latest.b?'painted':'changed'};
}
export function mixingColor(pair,a,b){if(!count(a)||!count(b)||a+b===0)return null;return pair.ingredients[0].rgb.map((v,i)=>Math.round((a*v+b*pair.ingredients[1].rgb[i])/(a+b)));}
export function mixingGroups(c,a,b){const n=Math.min(Math.floor(a/c.sample.a),Math.floor(b/c.sample.b));return {count:n,a:a-n*c.sample.a,b:b-n*c.sample.b};}
export function mixingTableRows(c){return [1,2,3,4].filter(n=>c.sample.a*n<=24&&c.sample.b*n<=24).map(n=>({a:c.sample.a*n,b:c.sample.b*n,multiplier:n}));}
function commit(state,root,canExport){try{const candidate=structuredClone(state);candidate.mixingTable=root;if(typeof canExport!=='function'||!recoveryFitsProgressLimits(candidate)||canExport(candidate)!==true)return result(false,false,'report-safety');state.mixingTable=root;return result(true,true,'changed');}catch{return result(false,false,'report-safety');}}
export function createMixingTable(state,canExport){const v=readMixingTable(state);if(v.status==='ready')return result(true);if(v.status!=='missing')return result(false,false,v.status);return commit(state,{kind:'mixing-table',version:1,source:structuredClone(mixingTableSource),drafts:[],observations:[],support:[],teaching:false},canExport);}
function ready(state){const v=readMixingTable(state);return v.status!=='ready'?result(false,false,v.status):!v.modelSupported?result(false,false,'unsupported-model'):v;}
function replace(list,id,e){const i=list.findIndex(x=>obj(x)&&x.caseId===id);if(i<0)list.push(e);else list[i]=e;}
export function adjustMixingDraft(state,id,field,delta,canExport){
 const v=ready(state);if(!v.root)return v;if(!caseOf(v.source,id)||!['a','b'].includes(field)||![1,-1].includes(delta))return result(false,false,'invalid-choice');if(bad(v.drafts,id))return result(false,false,'unreadable');
 const c=mixingCaseView(v,id),next=c.counts[field]+delta;if(!count(next))return result(false,false,'capacity');const r=structuredClone(v.root);if(!own(r,'drafts'))r.drafts=[];replace(r.drafts,id,{...(c.draft?structuredClone(c.draft):{}),caseId:id,...c.counts,[field]:next});return commit(state,r,canExport);
}
export function paintMixingStripe(state,id,canExport){
 const v=ready(state);if(!v.root)return v;const c=mixingCaseView(v,id);if(c.status!=='ready')return result(false,false,c.status==='missing'?'invalid-choice':'unreadable');const {a,b}=c.counts;if(a+b===0)return result(false,false,'empty-pot');
 const before=Object.fromEntries(mixingSupportFlags.map(k=>[k,c.support[k]])),last=c.latest;
 if(last&&last.a===a&&last.b===b&&last.teachingBefore===v.root.teaching&&mixingSupportFlags.every(k=>last.supportBefore[k]===before[k]))return result(true);
 if(c.record?.paintCount>=1e9)return result(false,false,'paint-count-cap');
 const comparisonValue=a*c.case.sample.b===b*c.case.sample.a?'same':'different',g=c.case.goal,goal=comparisonValue===g.comparison&&['a','b'].every(k=>!own(g,k)||g[k]===c.counts[k])?'fits':'try-again';
 const saved={...(c.record?.latest?structuredClone(c.record.latest):{}),a,b,comparison:comparisonValue,goal,feedbackCode:comparisonValue+'-'+(goal==='fits'?'fit':'miss'),supportBefore:before,teachingBefore:v.root.teaching,afterFeedback:!!c.record};
 const r=structuredClone(v.root);if(!own(r,'observations'))r.observations=[];replace(r.observations,id,c.record?{...structuredClone(c.record),paintCount:c.record.paintCount+1,latest:saved}:{caseId:id,paintCount:1,first:saved});return commit(state,r,canExport);
}
export function noteMixingSupport(state,id,flag,canExport){const v=ready(state);if(!v.root)return v;if(!caseOf(v.source,id)||!mixingSupportFlags.includes(flag))return result(false,false,'invalid-choice');if(bad(v.support,id))return result(false,false,'unreadable');const current=entry(v.support,id);if(current?.[flag]===true)return result(true);const r=structuredClone(v.root);if(!own(r,'support'))r.support=[];replace(r.support,id,{...(current?structuredClone(current):{caseId:id,...freshSupport()}),[flag]:true});return commit(state,r,canExport);}
export function noteMixingTeaching(state,canExport){const v=ready(state);if(!v.root)return v;if(typeof v.root.teaching!=='boolean')return result(false,false,'unreadable');if(v.root.teaching)return result(true);const r=structuredClone(v.root);r.teaching=true;return commit(state,r,canExport);}
