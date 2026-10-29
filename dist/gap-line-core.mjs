import {gapLineSource} from './gap-line-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>x!==null&&typeof x==='object'&&Object.hasOwn(x,k);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const fields=(x,ks)=>obj(x)&&ks.every(k=>own(x,k));
const positive=x=>Number.isSafeInteger(x)&&x>0;
const code=x=>typeof x==='string'&&/^[\x20-\x7e]{1,80}$/.test(x)&&!['__proto__','prototype','constructor','toString','valueOf'].includes(x);
const text=(x,n)=>typeof x==='string'&&x.trim().length>0&&x.length<=n&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x);
const dense=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const unique=(xs,key='id')=>new Set(xs.map(x=>x?.[key])).size===xs.length;
const half=x=>Number.isInteger(x)&&x>=-20&&x<=20;
const result=(ok,changed=false,codeValue=ok?'unchanged':'unreadable')=>({ok,changed,code:codeValue});
export const gapSupportFlags=['clue','narration','together'];
export const gapTeachingFlags=['crossing','sameBelow','halves'];
const fresh=ks=>Object.fromEntries(ks.map(k=>[k,false]));
const flags=(x,ks)=>fields(x,ks)&&ks.every(k=>typeof x[k]==='boolean');
const caseOf=(s,id)=>s.cases.find(c=>c.id===id);
const validPlan=(p,c)=>fields(p,['endHalf','split','showMove'])&&half(p.endHalf)&&p.endHalf%c.stepHalf===0&&typeof p.split==='boolean'&&typeof p.showMove==='boolean';
const feedbackKeys=['endMeets','endDifferent','lengthMatches','lengthDifferent'];
export function validGapSource(s){
 if(!fields(s,['id','version','title','origin','notice','model','cases','feedback'])||!code(s.id)||!positive(s.version)||!text(s.title,160)||!text(s.origin,160)||!text(s.notice,1800)||!fields(s.model,['id','minHalf','maxHalf'])||!code(s.model.id)||!half(s.model.minHalf)||!half(s.model.maxHalf)||s.model.minHalf>=0||s.model.maxHalf<=0||!dense(s.cases,1,6)||!unique(s.cases)||!fields(s.feedback,feedbackKeys)||!feedbackKeys.every(k=>text(s.feedback[k],1200)))return false;
 return s.cases.every(c=>fields(c,['id','title','fromHalf','toHalf','stepHalf','initial','prompt','clue','guided','explanation','reasonPrompt'])&&code(c.id)&&text(c.title,160)&&half(c.fromHalf)&&half(c.toHalf)&&[1,2].includes(c.stepHalf)&&c.fromHalf%c.stepHalf===0&&c.toHalf%c.stepHalf===0&&validPlan(c.initial,c)&&text(c.prompt,1000)&&text(c.clue,600)&&dense(c.guided,0,3)&&c.guided.every(t=>text(t,600))&&text(c.explanation,1400)&&text(c.reasonPrompt,1000));
}
function helpersView(s){return Object.fromEntries(gapTeachingFlags.map(k=>{const h=own(s.helpers,k)?s.helpers[k]:null;return [k,fields(h,['title','steps'])&&text(h.title,160)&&dense(h.steps,1,3)&&h.steps.every(t=>fields(t,['caseId','plan','text'])&&!!caseOf(s,t.caseId)&&validPlan(t.plan,caseOf(s,t.caseId))&&text(t.text,1000))?h:null];}));}
function validObservation(e,c,after){return fields(e,['endResult','lengthResult','supportBefore','teachingBefore','afterFeedback'])&&validPlan(e,c)&&['meets','different'].includes(e.endResult)&&['matches','different'].includes(e.lengthResult)&&flags(e.supportBefore,gapSupportFlags)&&flags(e.teachingBefore,gapTeachingFlags)&&e.afterFeedback===after;}
function validRecord(e,s){const c=caseOf(s,e?.caseId);return fields(e,['caseId','compareCount','first'])&&!!c&&positive(e.compareCount)&&e.compareCount<=1e9&&validObservation(e.first,c,false)&&(e.compareCount===1?!own(e,'latest'):own(e,'latest')&&validObservation(e.latest,c,true));}
function section(value,present,validate){
 if(!present)return {status:'ready',readable:[],unreadable:[]};
 if(!dense(value,0,200000))return {status:'unreadable',readable:[],unreadable:[]};
 const counts=new Map();for(const e of value)if(obj(e)&&own(e,'caseId'))counts.set(e.caseId,(counts.get(e.caseId)||0)+1);
 const readable=[],unreadable=[];for(const e of value)(validate(e)&&counts.get(e.caseId)===1?readable:unreadable).push(e);
 return {status:'ready',readable,unreadable};
}
export function readGapLine(state){
 if(!own(state,'gapLine'))return {status:'missing',root:null};const r=state.gapLine;
 if(!fields(r,['kind','version'])||r.kind!=='signed-gap-ruler'||r.version!==1)return {status:'unsupported',root:r};
 if(!own(r,'source')||!validGapSource(r.source))return {status:'unreadable',root:r};
 const s=r.source;return {status:'ready',root:r,source:s,helpers:helpersView(s),modelSupported:s.model.id==='signed-gap-ruler-v1'&&s.model.minHalf===-20&&s.model.maxHalf===20,teachingReadable:flags(r.teaching,gapTeachingFlags),drafts:section(r.drafts,own(r,'drafts'),e=>fields(e,['caseId'])&&!!caseOf(s,e.caseId)&&validPlan(e,caseOf(s,e.caseId))),observations:section(r.observations,own(r,'observations'),e=>validRecord(e,s)),support:section(r.support,own(r,'support'),e=>fields(e,['caseId'])&&!!caseOf(s,e.caseId)&&flags(e,gapSupportFlags))};
}
const entry=(s,id)=>s.readable.find(e=>e.caseId===id)||null;
const bad=(s,id)=>s.status!=='ready'||s.unreadable.some(e=>obj(e)&&e.caseId===id);
const samePlan=(a,b)=>a.endHalf===b.endHalf&&a.split===b.split&&a.showMove===b.showMove;
const sameFlags=(a,b,ks)=>ks.every(k=>a[k]===b[k]);
export function gapCaseView(stateOrView,id){
 const v=stateOrView?.status&&own(stateOrView,'root')?stateOrView:readGapLine(stateOrView);if(v.status!=='ready')return {status:v.status};const c=caseOf(v.source,id);if(!c)return {status:'missing'};
 const draft=entry(v.drafts,id),record=entry(v.observations,id),latest=record?.latest||record?.first||null;
 const draftReadable=!bad(v.drafts,id),recordReadable=!bad(v.observations,id),supportReadable=!bad(v.support,id),plan=draftReadable?(draft||c.initial):null;
 const support=supportReadable?(entry(v.support,id)||{caseId:id,...fresh(gapSupportFlags)}):null,teaching=v.teachingReadable?v.root.teaching:null;
 const draftState=!draftReadable?'unreadable':draft?'present':'missing',recordState=!recordReadable?'unreadable':record?'present':'missing',supportState=!supportReadable?'unreadable':entry(v.support,id)?'present':'missing';
 return {status:draftReadable&&recordReadable&&supportReadable&&v.teachingReadable?'ready':'unreadable',case:c,draft,effectiveDraft:plan,plan,record,first:record?.first||null,latest,support,teaching,teachingReadable:v.teachingReadable,draftState,recordState,supportState,sectionStates:{draft:draftState,record:recordState,support:supportState,teaching:v.teachingReadable?'ready':'unreadable'},draftReadable,recordReadable,supportReadable,modelSupported:v.modelSupported,suppliedStart:!draft&&draftReadable,draftStatus:!draftReadable||!recordReadable?'unreadable':!latest?'uncompared':samePlan(plan,latest)?'compared':'changed',contextChanged:latest&&support&&teaching?!sameFlags(latest.supportBefore,support,gapSupportFlags)||!sameFlags(latest.teachingBefore,teaching,gapTeachingFlags):false};
}
export function gapMeasure(c,plan){if(!validPlan(plan,c))return null;const changeHalf=plan.endHalf-c.fromHalf,lengthHalf=Math.abs(changeHalf),zeroInside=c.fromHalf*plan.endHalf<0,split=plan.split&&zeroInside;return {pieceCount:lengthHalf/c.stepHalf,lengthHalf,changeHalf,zeroInside,startPartHalf:split?Math.abs(c.fromHalf):null,endPartHalf:split?Math.abs(plan.endHalf):null};}
export function gapAssessment(c,plan){if(!validPlan(plan,c))return null;return {endResult:plan.endHalf===c.toHalf?'meets':'different',lengthResult:Math.abs(plan.endHalf-c.fromHalf)===Math.abs(c.toHalf-c.fromHalf)?'matches':'different'};}
export function gapFeedback(source,record){return [source.feedback[record.endResult==='meets'?'endMeets':'endDifferent'],source.feedback[record.lengthResult==='matches'?'lengthMatches':'lengthDifferent']];}
export function gapHelperOverlap(view,id,teachingBefore){const own=[],unknown=[];for(const k of gapTeachingFlags)if(teachingBefore?.[k]===true){if(!view.helpers?.[k])unknown.push(k);else if(view.helpers[k].steps.some(t=>t.caseId===id))own.push(k);}return {own,unknown};}
function commit(state,root,gate){try{const candidate=structuredClone(state);candidate.gapLine=root;if(typeof gate!=='function'||!recoveryFitsProgressLimits(candidate)||gate(candidate)!==true)return result(false,false,'report-safety');state.gapLine=root;return result(true,true,'changed');}catch{return result(false,false,'report-safety');}}
export function createGapLine(state,gate){const v=readGapLine(state);if(v.status==='ready')return result(true);if(v.status!=='missing')return result(false,false,v.status);return commit(state,{kind:'signed-gap-ruler',version:1,source:structuredClone(gapLineSource),drafts:[],observations:[],support:[],teaching:fresh(gapTeachingFlags)},gate);}
function ready(state){const v=readGapLine(state);return v.status!=='ready'?result(false,false,v.status):!v.modelSupported?result(false,false,'unsupported-model'):v;}
function replace(list,id,e){const i=list.findIndex(x=>obj(x)&&x.caseId===id);if(i<0)list.push(e);else list[i]=e;}
function edit(state,id,change,gate){const v=ready(state);if(!v.root)return v;const c=gapCaseView(v,id);if(!c.case)return result(false,false,'invalid-choice');if(!c.draftReadable)return result(false,false,'unreadable');const plan=change(c.plan,c.case);if(!plan)return result(false,false,'invalid-choice');if(!validPlan(plan,c.case))return result(false,false,'capacity');if(samePlan(plan,c.plan))return result(true);const r=structuredClone(v.root);if(!own(r,'drafts'))r.drafts=[];replace(r.drafts,id,{...(c.draft?structuredClone(c.draft):{}),caseId:id,endHalf:plan.endHalf,split:plan.split,showMove:plan.showMove});return commit(state,r,gate);}
export function moveGapEnd(state,id,delta,gate){return edit(state,id,(p,c)=>[1,-1].includes(delta)?{...p,endHalf:p.endHalf+delta*c.stepHalf}:null,gate);}
export function setGapPresentation(state,id,key,value,gate){if(!['split','showMove'].includes(key)||typeof value!=='boolean')return result(false,false,'invalid-choice');return edit(state,id,p=>({...p,[key]:value}),gate);}
export function compareGapLine(state,id,gate){
 const v=ready(state);if(!v.root)return v;const c=gapCaseView(v,id);if(c.status!=='ready')return result(false,false,c.status==='missing'?'invalid-choice':'unreadable');const p=c.plan;
 const supportBefore=Object.fromEntries(gapSupportFlags.map(k=>[k,c.support[k]])),teachingBefore=Object.fromEntries(gapTeachingFlags.map(k=>[k,c.teaching[k]])),last=c.latest;
 if(last&&samePlan(last,p)&&sameFlags(last.supportBefore,supportBefore,gapSupportFlags)&&sameFlags(last.teachingBefore,teachingBefore,gapTeachingFlags))return result(true);
 if(c.record?.compareCount>=1e9)return result(false,false,'compare-count-cap');
 const saved={endHalf:p.endHalf,split:p.split,showMove:p.showMove,...gapAssessment(c.case,p),supportBefore,teachingBefore,afterFeedback:!!c.record};
 const r=structuredClone(v.root);if(!own(r,'observations'))r.observations=[];replace(r.observations,id,c.record?{...structuredClone(c.record),compareCount:c.record.compareCount+1,latest:saved}:{caseId:id,compareCount:1,first:saved});return commit(state,r,gate);
}
export function noteGapSupport(state,id,flag,gate){const v=ready(state);if(!v.root)return v;if(!caseOf(v.source,id)||!gapSupportFlags.includes(flag))return result(false,false,'invalid-choice');if(bad(v.support,id))return result(false,false,'unreadable');const current=entry(v.support,id);if(current?.[flag]===true)return result(true);const r=structuredClone(v.root);if(!own(r,'support'))r.support=[];replace(r.support,id,{...(current?structuredClone(current):{caseId:id,...fresh(gapSupportFlags)}),[flag]:true});return commit(state,r,gate);}
export function noteGapTeaching(state,helper,gate){const v=ready(state);if(!v.root)return v;if(!gapTeachingFlags.includes(helper))return result(false,false,'invalid-choice');if(!v.helpers[helper])return result(false,false,'missing-helper');if(!obj(v.root.teaching)||typeof v.root.teaching[helper]!=='boolean')return result(false,false,'unreadable');if(v.root.teaching[helper]===true)return result(true);const r=structuredClone(v.root);r.teaching[helper]=true;return commit(state,r,gate);}
