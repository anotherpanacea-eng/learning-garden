import {ratioBarsSource} from './ratio-bars-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>x!==null&&typeof x==='object'&&Object.hasOwn(x,k);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const fields=(x,ks)=>obj(x)&&ks.every(k=>own(x,k));
const positive=x=>Number.isSafeInteger(x)&&x>0;
const code=x=>typeof x==='string'&&/^[\x20-\x7e]{1,80}$/.test(x)&&!['__proto__','prototype','constructor','toString','valueOf'].includes(x);
const text=(x,n)=>typeof x==='string'&&x.trim().length>0&&x.length<=n&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x);
const dense=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const unique=(xs,key='id')=>new Set(xs.map(x=>x?.[key])).size===xs.length;
const bounded=(x,max)=>Number.isInteger(x)&&x>=0&&x<=max;
const result=(ok,changed=false,codeValue=ok?'unchanged':'unreadable')=>({ok,changed,code:codeValue});
export const ratioSupportFlags=['clue','narration','together'];
export const ratioTeachingFlags=['whole','share','three'];
const fresh=ks=>Object.fromEntries(ks.map(k=>[k,false]));
const flags=(x,ks)=>fields(x,ks)&&ks.every(k=>typeof x[k]==='boolean');
const caseOf=(s,id)=>s.cases.find(c=>c.id===id);
const validReference=(c,r)=>r===null||r==='whole'||c.ingredientIds.includes(r);
const validPlan=(p,c)=>fields(p,['blocks','unit','reference'])&&dense(p.blocks,c.ingredientIds.length,c.ingredientIds.length)&&p.blocks.every(n=>bounded(n,12))&&(p.unit===null||positive(p.unit)&&p.unit<=20)&&validReference(c,p.reference);
const feedbackKeys=['ratioSame','ratioDifferent','referenceFits','referenceDifferent','amountFits','amountDifferent'];
export function validRatioSource(s){
 if(!fields(s,['id','version','title','origin','notice','model','ingredients','cases','feedback'])||!code(s.id)||!positive(s.version)||!text(s.title,160)||!text(s.origin,160)||!text(s.notice,1000)||!fields(s.model,['id','maxBlocks','maxUnit'])||!code(s.model.id)||!positive(s.model.maxBlocks)||s.model.maxBlocks>12||!positive(s.model.maxUnit)||s.model.maxUnit>20||!dense(s.ingredients,1,4)||!unique(s.ingredients)||!dense(s.cases,1,6)||!unique(s.cases)||!fields(s.feedback,feedbackKeys)||!feedbackKeys.every(k=>text(s.feedback[k],1200)))return false;
 if(!s.ingredients.every(i=>fields(i,['id','label','pattern'])&&code(i.id)&&i.id!=='whole'&&text(i.label,160)&&['dots','stripes','crosshatch','chevrons'].includes(i.pattern)))return false;
 const ids=new Set(s.ingredients.map(i=>i.id));
 return s.cases.every(c=>fields(c,['id','title','ingredientIds','ratio','given','initial','prompt','clue','guided','explanation','reasonPrompt'])&&code(c.id)&&text(c.title,160)&&dense(c.ingredientIds,2,3)&&new Set(c.ingredientIds).size===c.ingredientIds.length&&c.ingredientIds.every(id=>ids.has(id))&&dense(c.ratio,c.ingredientIds.length,c.ingredientIds.length)&&c.ratio.every(n=>positive(n)&&n<=12)&&fields(c.given,['amount','reference'])&&positive(c.given.amount)&&c.given.amount<=720&&c.given.reference!==null&&validReference(c,c.given.reference)&&validPlan(c.initial,c)&&text(c.prompt,1000)&&text(c.clue,600)&&dense(c.guided,0,3)&&c.guided.every(t=>text(t,600))&&text(c.explanation,1200)&&text(c.reasonPrompt,1000));
}
function helpersView(s){return Object.fromEntries(ratioTeachingFlags.map(k=>{const h=own(s.helpers,k)?s.helpers[k]:null;return [k,fields(h,['title','steps'])&&text(h.title,160)&&dense(h.steps,1,3)&&h.steps.every(t=>fields(t,['caseId','plan','text'])&&!!caseOf(s,t.caseId)&&validPlan(t.plan,caseOf(s,t.caseId))&&text(t.text,1000))?h:null];}));}
function validObservation(e,c,after){return fields(e,['ratio','referenceStatus','amountStatus','supportBefore','teachingBefore','afterFeedback'])&&validPlan(e,c)&&e.unit!==null&&e.reference!==null&&e.blocks.some(n=>n>0)&&['same','different'].includes(e.ratio)&&['fits','different'].includes(e.referenceStatus)&&['fits','different'].includes(e.amountStatus)&&flags(e.supportBefore,ratioSupportFlags)&&flags(e.teachingBefore,ratioTeachingFlags)&&e.afterFeedback===after;}
function validRecord(e,s){const c=caseOf(s,e?.caseId);return fields(e,['caseId','compareCount','first'])&&!!c&&positive(e.compareCount)&&e.compareCount<=1e9&&validObservation(e.first,c,false)&&(e.compareCount===1?!own(e,'latest'):own(e,'latest')&&validObservation(e.latest,c,true));}
function section(value,present,validate){
 if(!present)return {status:'ready',readable:[],unreadable:[]};
 if(!dense(value,0,200000))return {status:'unreadable',readable:[],unreadable:[]};
 const counts=new Map();for(const e of value)if(obj(e)&&own(e,'caseId'))counts.set(e.caseId,(counts.get(e.caseId)||0)+1);
 const readable=[],unreadable=[];for(const e of value)(validate(e)&&counts.get(e.caseId)===1?readable:unreadable).push(e);
 return {status:'ready',readable,unreadable};
}
export function readRatioBars(state){
 if(!own(state,'ratioBars'))return {status:'missing',root:null};const r=state.ratioBars;
 if(!fields(r,['kind','version'])||r.kind!=='ratio-bars'||r.version!==1)return {status:'unsupported',root:r};
 if(!own(r,'source')||!validRatioSource(r.source))return {status:'unreadable',root:r};
 const s=r.source;return {status:'ready',root:r,source:s,helpers:helpersView(s),modelSupported:s.model.id==='equal-ratio-blocks-v1'&&s.model.maxBlocks===12&&s.model.maxUnit===20,teachingReadable:flags(r.teaching,ratioTeachingFlags),drafts:section(r.drafts,own(r,'drafts'),e=>fields(e,['caseId'])&&!!caseOf(s,e.caseId)&&validPlan(e,caseOf(s,e.caseId))),observations:section(r.observations,own(r,'observations'),e=>validRecord(e,s)),support:section(r.support,own(r,'support'),e=>fields(e,['caseId'])&&!!caseOf(s,e.caseId)&&flags(e,ratioSupportFlags))};
}
const entry=(s,id)=>s.readable.find(e=>e.caseId===id)||null;
const bad=(s,id)=>s.status!=='ready'||s.unreadable.some(e=>obj(e)&&e.caseId===id);
const samePlan=(a,b)=>a.unit===b.unit&&a.reference===b.reference&&a.blocks.length===b.blocks.length&&a.blocks.every((n,i)=>n===b.blocks[i]);
export function ratioCaseView(stateOrView,id){
 const v=stateOrView?.status&&own(stateOrView,'root')?stateOrView:readRatioBars(stateOrView);if(v.status!=='ready')return {status:v.status};const c=caseOf(v.source,id);if(!c)return {status:'missing'};
 const draft=entry(v.drafts,id),record=entry(v.observations,id),latest=record?.latest||record?.first||null;
 const draftReadable=!bad(v.drafts,id),recordReadable=!bad(v.observations,id),supportReadable=!bad(v.support,id),plan=draftReadable?(draft||c.initial):null;
 return {status:draftReadable&&recordReadable&&supportReadable&&v.teachingReadable?'ready':'unreadable',case:c,ingredients:c.ingredientIds.map(id=>v.source.ingredients.find(i=>i.id===id)),draft,effectiveDraft:plan,plan,record,first:record?.first||null,latest,support:supportReadable?(entry(v.support,id)||{caseId:id,...fresh(ratioSupportFlags)}):null,teaching:v.teachingReadable?v.root.teaching:null,teachingReadable:v.teachingReadable,draftState:!draftReadable?'unreadable':draft?'present':'missing',recordState:!recordReadable?'unreadable':record?'present':'missing',supportState:!supportReadable?'unreadable':entry(v.support,id)?'present':'missing',draftReadable,recordReadable,supportReadable,modelSupported:v.modelSupported,suppliedStart:!draft&&draftReadable,draftStatus:!draftReadable||!recordReadable?'unreadable':!latest?'uncompared':samePlan(plan,latest)?'compared':'changed'};
}
export function ratioAmounts(c,plan){if(!validPlan(plan,c)||plan.unit===null)return null;const shares=plan.blocks.map(n=>n*plan.unit),total=shares.reduce((a,b)=>a+b,0),amount=r=>r==='whole'?total:r===null?null:shares[c.ingredientIds.indexOf(r)];return {shares,total,sourceAmount:amount(c.given.reference),markerAmount:amount(plan.reference)};}
export function ratioAssessment(c,plan){if(!validPlan(plan,c)||!plan.blocks.some(n=>n>0)||plan.unit===null||plan.reference===null)return null;return {ratio:plan.blocks.every((n,i)=>n*c.ratio[0]===plan.blocks[0]*c.ratio[i])?'same':'different',referenceStatus:plan.reference===c.given.reference?'fits':'different',amountStatus:ratioAmounts(c,plan).sourceAmount===c.given.amount?'fits':'different'};}
export function ratioFeedback(source,c,record){const label=r=>r==='whole'?'whole':source.ingredients.find(i=>i.id===r)?.label||r;const substitute=t=>t.replaceAll('{recorded reference}',label(record.reference)).replaceAll('{given amount}',String(c.given.amount)).replaceAll('{source reference}',label(c.given.reference));return [source.feedback[record.ratio==='same'?'ratioSame':'ratioDifferent'],source.feedback[record.referenceStatus==='fits'?'referenceFits':'referenceDifferent'],source.feedback[record.amountStatus==='fits'?'amountFits':'amountDifferent']].map(substitute);}
export function ratioHelperOverlap(view,id,teachingBefore){const own=[],unknown=[];for(const k of ratioTeachingFlags)if(teachingBefore?.[k]===true){if(!view.helpers?.[k])unknown.push(k);else if(view.helpers[k].steps.some(t=>t.caseId===id))own.push(k);}return {own,unknown};}
function commit(state,root,gate){try{const candidate=structuredClone(state);candidate.ratioBars=root;if(typeof gate!=='function'||!recoveryFitsProgressLimits(candidate)||gate(candidate)!==true)return result(false,false,'report-safety');state.ratioBars=root;return result(true,true,'changed');}catch{return result(false,false,'report-safety');}}
export function createRatioBars(state,gate){const v=readRatioBars(state);if(v.status==='ready')return result(true);if(v.status!=='missing')return result(false,false,v.status);return commit(state,{kind:'ratio-bars',version:1,source:structuredClone(ratioBarsSource),drafts:[],observations:[],support:[],teaching:fresh(ratioTeachingFlags)},gate);}
function ready(state){const v=readRatioBars(state);return v.status!=='ready'?result(false,false,v.status):!v.modelSupported?result(false,false,'unsupported-model'):v;}
function replace(list,id,e){const i=list.findIndex(x=>obj(x)&&x.caseId===id);if(i<0)list.push(e);else list[i]=e;}
function edit(state,id,change,gate){const v=ready(state);if(!v.root)return v;const c=ratioCaseView(v,id);if(!c.case)return result(false,false,'invalid-choice');if(!c.draftReadable)return result(false,false,'unreadable');const plan=change(c.plan,c.case);if(!plan)return result(false,false,'invalid-choice');if(!validPlan(plan,c.case))return result(false,false,'capacity');if(samePlan(plan,c.plan))return result(true);const r=structuredClone(v.root);if(!own(r,'drafts'))r.drafts=[];replace(r.drafts,id,{...(c.draft?structuredClone(c.draft):{}),caseId:id,blocks:[...plan.blocks],unit:plan.unit,reference:plan.reference});return commit(state,r,gate);}
export function adjustRatioBlocks(state,id,index,delta,gate){return edit(state,id,p=>{if(!Number.isInteger(index)||index<0||index>=p.blocks.length||![1,-1].includes(delta))return null;const blocks=[...p.blocks];blocks[index]+=delta;return {...p,blocks};},gate);}
export function setRatioUnit(state,id,unit,gate){if(unit!==null&&(!positive(unit)||unit>20))return result(false,false,'invalid-choice');return edit(state,id,p=>({...p,unit}),gate);}
export function setRatioReference(state,id,reference,gate){return edit(state,id,(p,c)=>validReference(c,reference)?{...p,reference}:null,gate);}
export function compareRatioBars(state,id,gate){
 const v=ready(state);if(!v.root)return v;const c=ratioCaseView(v,id);if(c.status!=='ready')return result(false,false,c.status==='missing'?'invalid-choice':'unreadable');const p=c.plan;if(!p.blocks.some(n=>n>0))return result(false,false,'empty-blocks');if(p.unit===null)return result(false,false,'missing-unit');if(p.reference===null)return result(false,false,'missing-reference');
 const supportBefore=Object.fromEntries(ratioSupportFlags.map(k=>[k,c.support[k]])),teachingBefore=Object.fromEntries(ratioTeachingFlags.map(k=>[k,c.teaching[k]])),last=c.latest;
 if(last&&samePlan(last,p)&&ratioSupportFlags.every(k=>last.supportBefore[k]===supportBefore[k])&&ratioTeachingFlags.every(k=>last.teachingBefore[k]===teachingBefore[k]))return result(true);
 if(c.record?.compareCount>=1e9)return result(false,false,'compare-count-cap');
 const saved={blocks:[...p.blocks],unit:p.unit,reference:p.reference,...ratioAssessment(c.case,p),supportBefore,teachingBefore,afterFeedback:!!c.record};
 const r=structuredClone(v.root);if(!own(r,'observations'))r.observations=[];replace(r.observations,id,c.record?{...structuredClone(c.record),compareCount:c.record.compareCount+1,latest:saved}:{caseId:id,compareCount:1,first:saved});return commit(state,r,gate);
}
export function noteRatioSupport(state,id,flag,gate){const v=ready(state);if(!v.root)return v;if(!caseOf(v.source,id)||!ratioSupportFlags.includes(flag))return result(false,false,'invalid-choice');if(bad(v.support,id))return result(false,false,'unreadable');const current=entry(v.support,id);if(current?.[flag]===true)return result(true);const r=structuredClone(v.root);if(!own(r,'support'))r.support=[];replace(r.support,id,{...(current?structuredClone(current):{caseId:id,...fresh(ratioSupportFlags)}),[flag]:true});return commit(state,r,gate);}
export function noteRatioTeaching(state,helper,gate){const v=ready(state);if(!v.root)return v;if(!ratioTeachingFlags.includes(helper))return result(false,false,'invalid-choice');if(!v.helpers[helper])return result(false,false,'missing-helper');if(!obj(v.root.teaching)||typeof v.root.teaching[helper]!=='boolean')return result(false,false,'unreadable');if(v.root.teaching[helper]===true)return result(true);const r=structuredClone(v.root);r.teaching[helper]=true;return commit(state,r,gate);}
