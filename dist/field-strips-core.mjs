import {fieldStripsSource} from './field-strips-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>x!==null&&typeof x==='object'&&Object.hasOwn(x,k);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const fields=(x,ks)=>obj(x)&&ks.every(k=>own(x,k));
const positive=x=>Number.isSafeInteger(x)&&x>0;
const code=x=>typeof x==='string'&&/^[\x20-\x7e]{1,80}$/.test(x)&&!['__proto__','prototype','constructor','toString','valueOf'].includes(x);
const text=(x,n)=>typeof x==='string'&&x.trim().length>0&&x.length<=n&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x);
const dense=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const unique=(xs,key='id')=>new Set(xs.map(x=>x?.[key])).size===xs.length;
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const result=(ok,changed=false,codeValue=ok?'unchanged':'unreadable')=>({ok,changed,code:codeValue});
export const fieldSupportFlags=['clue','narration','together'];
export const fieldTeachingFlags=['equalParts','nested','equivalent'];
const fresh=ks=>Object.fromEntries(ks.map(k=>[k,false]));
const flags=(x,ks)=>fields(x,ks)&&ks.every(k=>typeof x[k]==='boolean');
const caseOf=(s,id)=>s.cases.find(c=>c.id===id);
const validPlan=(p,c)=>fields(p,['columnsTaken','rowsTaken'])&&integer(p.columnsTaken,0,c.columns)&&integer(p.rowsTaken,0,c.rows);
const feedbackKeys=['firstMatches','firstDifferent','secondMatches','secondDifferent','wholeMatches','wholeDifferent'];
export function validFieldSource(s){
 if(!fields(s,['id','version','title','origin','notice','model','cases','feedback'])||!code(s.id)||!positive(s.version)||!text(s.title,160)||!text(s.origin,160)||!text(s.notice,1800)||!fields(s.model,['id','maxColumns','maxRows'])||!code(s.model.id)||!integer(s.model.maxColumns,1,64)||!integer(s.model.maxRows,1,64)||!dense(s.cases,1,6)||!unique(s.cases)||!fields(s.feedback,feedbackKeys)||!feedbackKeys.every(k=>text(s.feedback[k],1200)))return false;
 return s.cases.every(c=>fields(c,['id','title','columns','rows','firstTaken','secondTaken','initial','prompt','clue','guided','explanation','reasonPrompt'])&&code(c.id)&&text(c.title,160)&&integer(c.columns,1,6)&&integer(c.rows,1,6)&&integer(c.firstTaken,0,c.columns)&&integer(c.secondTaken,0,c.rows)&&validPlan(c.initial,c)&&text(c.prompt,1000)&&text(c.clue,600)&&dense(c.guided,0,3)&&c.guided.every(t=>text(t,600))&&text(c.explanation,1400)&&text(c.reasonPrompt,1000));
}
function helpersView(s){return Object.fromEntries(fieldTeachingFlags.map(k=>{const h=own(s.helpers,k)?s.helpers[k]:null;return [k,fields(h,['title','steps'])&&text(h.title,160)&&dense(h.steps,1,3)&&h.steps.every(t=>fields(t,['caseId','plan','text'])&&!!caseOf(s,t.caseId)&&validPlan(t.plan,caseOf(s,t.caseId))&&text(t.text,1000))?h:null];}));}
function validObservation(e,c,after){return fields(e,['firstResult','secondResult','wholeResult','supportBefore','teachingBefore','afterFeedback'])&&validPlan(e,c)&&['matches','different'].includes(e.firstResult)&&['matches','different'].includes(e.secondResult)&&['matches','different'].includes(e.wholeResult)&&flags(e.supportBefore,fieldSupportFlags)&&flags(e.teachingBefore,fieldTeachingFlags)&&e.afterFeedback===after;}
function validRecord(e,s){const c=caseOf(s,e?.caseId);return fields(e,['caseId','compareCount','first'])&&!!c&&positive(e.compareCount)&&e.compareCount<=1e9&&validObservation(e.first,c,false)&&(e.compareCount===1?!own(e,'latest'):own(e,'latest')&&validObservation(e.latest,c,true));}
function section(value,present,validate){
 if(!present)return {status:'ready',readable:[],unreadable:[]};
 if(!dense(value,0,200000))return {status:'unreadable',readable:[],unreadable:[]};
 const counts=new Map();for(const e of value)if(obj(e)&&own(e,'caseId'))counts.set(e.caseId,(counts.get(e.caseId)||0)+1);
 const readable=[],unreadable=[];for(const e of value)(validate(e)&&counts.get(e.caseId)===1?readable:unreadable).push(e);
 return {status:'ready',readable,unreadable};
}
export function readFieldStrips(state){
 if(!own(state,'fieldStrips'))return {status:'missing',root:null};const r=state.fieldStrips;
 if(!fields(r,['kind','version'])||r.kind!=='nested-field-grid'||r.version!==1)return {status:'unsupported',root:r};
 if(!own(r,'source')||!validFieldSource(r.source))return {status:'unreadable',root:r};
 const s=r.source;return {status:'ready',root:r,source:s,helpers:helpersView(s),modelSupported:s.model.id==='nested-field-grid-v1'&&s.model.maxColumns===6&&s.model.maxRows===6,teachingReadable:flags(r.teaching,fieldTeachingFlags),teachingFlags:Object.fromEntries(fieldTeachingFlags.map(k=>[k,typeof r.teaching?.[k]==='boolean'?r.teaching[k]:null])),drafts:section(r.drafts,own(r,'drafts'),e=>fields(e,['caseId'])&&!!caseOf(s,e.caseId)&&validPlan(e,caseOf(s,e.caseId))),observations:section(r.observations,own(r,'observations'),e=>validRecord(e,s)),support:section(r.support,own(r,'support'),e=>fields(e,['caseId'])&&!!caseOf(s,e.caseId)&&flags(e,fieldSupportFlags))};
}
const entry=(s,id)=>s.readable.find(e=>e.caseId===id)||null;
const bad=(s,id)=>s.status!=='ready'||s.unreadable.some(e=>obj(e)&&e.caseId===id);
const samePlan=(a,b)=>a.columnsTaken===b.columnsTaken&&a.rowsTaken===b.rowsTaken;
const sameFlags=(a,b,ks)=>ks.every(k=>a[k]===b[k]);
export function fieldCaseView(stateOrView,id){
 const v=stateOrView?.status&&own(stateOrView,'root')?stateOrView:readFieldStrips(stateOrView);if(v.status!=='ready')return {status:v.status};const c=caseOf(v.source,id);if(!c)return {status:'missing'};
 const draft=entry(v.drafts,id),record=entry(v.observations,id),latest=record?.latest||record?.first||null;
 const draftReadable=!bad(v.drafts,id),recordReadable=!bad(v.observations,id),supportReadable=!bad(v.support,id),plan=draftReadable?(draft||c.initial):null;
 const support=supportReadable?(entry(v.support,id)||{caseId:id,...fresh(fieldSupportFlags)}):null,teaching=v.teachingReadable?v.root.teaching:null;
 const draftState=!draftReadable?'unreadable':draft?'present':'missing',recordState=!recordReadable?'unreadable':record?'present':'missing',supportState=!supportReadable?'unreadable':entry(v.support,id)?'present':'missing';
 return {status:draftReadable&&recordReadable&&supportReadable&&v.teachingReadable?'ready':'unreadable',case:c,draft,effectiveDraft:plan,plan,record,first:record?.first||null,latest,support,teaching,teachingReadable:v.teachingReadable,draftState,recordState,supportState,sectionStates:{draft:draftState,record:recordState,support:supportState,teaching:v.teachingReadable?'ready':'unreadable'},draftReadable,recordReadable,supportReadable,modelSupported:v.modelSupported,suppliedStart:!draft&&draftReadable,draftStatus:!draftReadable||!recordReadable?'unreadable':!latest?'uncompared':samePlan(plan,latest)?'compared':'changed',contextChanged:latest&&support&&teaching?!sameFlags(latest.supportBefore,support,fieldSupportFlags)||!sameFlags(latest.teachingBefore,teaching,fieldTeachingFlags):false};
}
export function fieldMeasure(c,plan){
 if(!validPlan(plan,c))return null;
 const cellCount=plan.columnsTaken*plan.rowsTaken,totalCells=c.columns*c.rows;
 let a=cellCount,b=totalCells;while(b){const next=a%b;a=b;b=next;}
 return {cellCount,totalCells,firstNumerator:plan.columnsTaken,firstDenominator:c.columns,secondNumerator:plan.rowsTaken,secondDenominator:c.rows,reducedNumerator:cellCount/a,reducedDenominator:totalCells/a,smaller:cellCount<plan.columnsTaken*c.rows};
}
export function fieldAssessment(c,plan){if(!validPlan(plan,c))return null;return {firstResult:plan.columnsTaken===c.firstTaken?'matches':'different',secondResult:plan.rowsTaken===c.secondTaken?'matches':'different',wholeResult:plan.columnsTaken*plan.rowsTaken===c.firstTaken*c.secondTaken?'matches':'different'};}
export function fieldFeedback(source,record){return ['first','second','whole'].map(k=>source.feedback[k+(record[k+'Result']==='matches'?'Matches':'Different')]);}
export function fieldHelperOverlap(view,id,teachingBefore){const own=[],unknown=[];for(const k of fieldTeachingFlags)if(teachingBefore?.[k]===true){if(!view.helpers?.[k])unknown.push(k);else if(view.helpers[k].steps.some(t=>t.caseId===id))own.push(k);}return {own,unknown};}
function commit(state,root,gate){try{const candidate=structuredClone(state);candidate.fieldStrips=root;if(typeof gate!=='function'||!recoveryFitsProgressLimits(candidate)||gate(candidate)!==true)return result(false,false,'report-safety');state.fieldStrips=root;return result(true,true,'changed');}catch{return result(false,false,'report-safety');}}
export function createFieldStrips(state,gate){const v=readFieldStrips(state);if(v.status==='ready')return result(true);if(v.status!=='missing')return result(false,false,v.status);return commit(state,{kind:'nested-field-grid',version:1,source:structuredClone(fieldStripsSource),drafts:[],observations:[],support:[],teaching:fresh(fieldTeachingFlags)},gate);}
function ready(state){const v=readFieldStrips(state);return v.status!=='ready'?result(false,false,v.status):!v.modelSupported?result(false,false,'unsupported-model'):v;}
function replace(list,id,e){const i=list.findIndex(x=>obj(x)&&x.caseId===id);if(i<0)list.push(e);else list[i]=e;}
function edit(state,id,change,gate){const v=ready(state);if(!v.root)return v;const c=fieldCaseView(v,id);if(!c.case)return result(false,false,'invalid-choice');if(!c.draftReadable)return result(false,false,'unreadable');const plan=change(c.plan,c.case);if(!plan)return result(false,false,'invalid-choice');if(!validPlan(plan,c.case))return result(false,false,'capacity');if(samePlan(plan,c.plan))return result(true);const r=structuredClone(v.root);if(!own(r,'drafts'))r.drafts=[];replace(r.drafts,id,{...(c.draft?structuredClone(c.draft):{}),caseId:id,columnsTaken:plan.columnsTaken,rowsTaken:plan.rowsTaken});return commit(state,r,gate);}
export function moveFieldSelection(state,id,key,delta,gate){if(!['columnsTaken','rowsTaken'].includes(key)||![1,-1].includes(delta))return result(false,false,'invalid-choice');return edit(state,id,p=>({...p,[key]:p[key]+delta}),gate);}
export function compareFieldStrips(state,id,gate){
 const v=ready(state);if(!v.root)return v;const c=fieldCaseView(v,id);if(c.status!=='ready')return result(false,false,c.status==='missing'?'invalid-choice':'unreadable');const p=c.plan;
 const supportBefore=Object.fromEntries(fieldSupportFlags.map(k=>[k,c.support[k]])),teachingBefore=Object.fromEntries(fieldTeachingFlags.map(k=>[k,c.teaching[k]])),last=c.latest;
 if(last&&samePlan(last,p)&&sameFlags(last.supportBefore,supportBefore,fieldSupportFlags)&&sameFlags(last.teachingBefore,teachingBefore,fieldTeachingFlags))return result(true);
 if(c.record?.compareCount>=1e9)return result(false,false,'compare-count-cap');
 const saved={columnsTaken:p.columnsTaken,rowsTaken:p.rowsTaken,...fieldAssessment(c.case,p),supportBefore,teachingBefore,afterFeedback:!!c.record};
 const r=structuredClone(v.root);if(!own(r,'observations'))r.observations=[];replace(r.observations,id,c.record?{...structuredClone(c.record),compareCount:c.record.compareCount+1,latest:saved}:{caseId:id,compareCount:1,first:saved});return commit(state,r,gate);
}
export function noteFieldSupport(state,id,flag,gate){const v=ready(state);if(!v.root)return v;if(!caseOf(v.source,id)||!fieldSupportFlags.includes(flag))return result(false,false,'invalid-choice');if(bad(v.support,id))return result(false,false,'unreadable');const current=entry(v.support,id);if(current?.[flag]===true)return result(true);const r=structuredClone(v.root);if(!own(r,'support'))r.support=[];replace(r.support,id,{...(current?structuredClone(current):{caseId:id,...fresh(fieldSupportFlags)}),[flag]:true});return commit(state,r,gate);}
export function noteFieldTeaching(state,helper,gate){const v=ready(state);if(!v.root)return v;if(!fieldTeachingFlags.includes(helper))return result(false,false,'invalid-choice');if(!v.helpers[helper])return result(false,false,'missing-helper');if(!obj(v.root.teaching)||typeof v.root.teaching[helper]!=='boolean')return result(false,false,'unreadable');if(v.root.teaching[helper]===true)return result(true);const r=structuredClone(v.root);r.teaching[helper]=true;return commit(state,r,gate);}
