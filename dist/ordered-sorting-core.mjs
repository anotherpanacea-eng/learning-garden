import {orderedSources,orderedTests} from './ordered-sorting-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

const copy=structuredClone,own=(x,k)=>Object.hasOwn(x,k),object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const reserved=['__proto__','constructor','prototype','toString','valueOf'];
const id=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(x)&&!reserved.includes(x);
const text=x=>typeof x==='string'&&x.trim().length>0&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x)&&new TextEncoder().encode(x).length<=800;
const safe=x=>Number.isSafeInteger(x)&&x>0;
const tests=new Map(orderedTests.map(t=>[t.id,t]));
const supportKeys=['learn','guided','hint','example','skip','contrast','comparison','together','audio'];
const replyKeys=['match','mismatch','firstMatch','overlap','finite','equivalent','notReply'];
const pages=['build','step','compare','history'];
const sizeOf=x=>{try{return new TextEncoder().encode(JSON.stringify(x)).length;}catch{return Infinity;}};
const parcel=(s,k)=>s.parcels.find(p=>p.id===k),basket=(s,k)=>s.baskets.find(b=>b.id===k);
const validCard=p=>object(p)&&id(p.id)&&text(p.title)&&['small','large'].includes(p.size)&&['blue','yellow'].includes(p.wrap)&&['star','circle','square'].includes(p.stamp);
const cardsValid=ps=>Array.isArray(ps)&&ps.length>=1&&ps.length<=12&&ps.every(validCard)&&new Set(ps.map(p=>p.id)).size===ps.length;
const linesValid=xs=>Array.isArray(xs)&&xs.length>=1&&xs.length<=8&&xs.every(text);
const supportValid=s=>object(s)&&supportKeys.every(k=>typeof s[k]==='boolean');
const predictionValid=(s,p)=>p===null||p==='unsure'||!!basket(s,p);
const freshSupport=()=>Object.fromEntries(supportKeys.map(k=>[k,false]));
export function validOrderedProgram(s,p,allowIncomplete=false){
 if(!object(s)||!Array.isArray(s.baskets)||!object(p)||!object(p.first)||!object(p.second))return false;
 for(const [name,r] of [['first',p.first],['second',p.second]]){
  if(typeof r.not!=='boolean'||!(tests.has(r.test)||(name==='second'&&r.test==='off')||(allowIncomplete&&r.test===null)))return false;
  if(!(!!basket(s,r.basket)||(r.basket===null&&(allowIncomplete||name==='second'&&r.test==='off'))))return false;
 }
 return !!basket(s,p.otherwise)||(allowIncomplete&&p.otherwise===null);
}
export function validOrderedSource(s){
 if(!object(s)||s.version!==1||!id(s.id)||!text(s.title)||!text(s.request)||!Array.isArray(s.baskets)||s.baskets.length!==3||!s.baskets.every(b=>object(b)&&id(b.id)&&text(b.label))||new Set(s.baskets.map(b=>b.id)).size!==3||!cardsValid(s.parcels)||!validOrderedProgram(s,s.requestProgram))return false;
 if(!linesValid(s.learn)||!linesValid(s.guided)||![s.hint,s.start,s.skip].every(text)||!object(s.text)||!replyKeys.every(k=>text(s.text[k])))return false;
 const e=s.example;
 return object(e)&&validOrderedProgram(s,e.program)&&cardsValid(e.parcels)&&Array.isArray(e.steps)&&e.steps.length>=1&&e.steps.length<=12&&e.steps.every(x=>object(x)&&e.parcels.some(p=>p.id===x.parcelId)&&text(x.text))&&sizeOf(s)<=32*1024;
}
export function orderedPredicate(test,not,p){const t=tests.get(test);return t&&typeof not==='boolean'&&validCard(p)?(not?p[t.feature]!==t.value:p[t.feature]===t.value):null;}
function observation(row,r,p){const t=tests.get(r.test);return {kind:'test',row,test:r.test,feature:t.feature,value:t.value,not:r.not,observed:p[t.feature],yes:orderedPredicate(r.test,r.not,p)};}
function route(s,p,card){
 const steps=[observation('first',p.first,card)];let branch,second;
 if(steps[0].yes){branch='first';second='not-tested';}
 else if(p.second.test==='off'){branch='otherwise';second='off';}
 else {steps.push(observation('second',p.second,card));branch=steps[1].yes?'second':'otherwise';second='tested';}
 const actualBasket=branch==='otherwise'?p.otherwise:p[branch].basket;
 steps.push({kind:'choose',branch,basket:actualBasket,second});return {steps,actualBasket,branch};
}
export function orderedOutcome(s,p,parcelId){
 if(!validOrderedSource(s)||!validOrderedProgram(s,p))return null;const card=parcel(s,parcelId);if(!card)return null;
 const out=route(s,p,card),requestedBasket=route(s,s.requestProgram,card).actualBasket;
 return {...out,requestedBasket,matches:out.actualBasket===requestedBasket};
}
export function orderedOverlap(s,p){if(!validOrderedSource(s)||!validOrderedProgram(s,p,true)||!tests.has(p.first.test)||!tests.has(p.second.test))return null;return s.parcels.find(card=>orderedPredicate(p.first.test,p.first.not,card)&&orderedPredicate(p.second.test,p.second.not,card))||null;}
const testStepValid=x=>object(x)&&x.kind==='test'&&['first','second'].includes(x.row)&&tests.has(x.test)&&x.feature===tests.get(x.test).feature&&x.value===tests.get(x.test).value&&typeof x.not==='boolean'&&typeof x.yes==='boolean'&&({size:['small','large'],wrap:['blue','yellow'],stamp:['star','circle','square']}[x.feature]).includes(x.observed);
const choiceValid=(s,x)=>object(x)&&x.kind==='choose'&&['first','second','otherwise'].includes(x.branch)&&!!basket(s,x.basket)&&['not-tested','off','tested'].includes(x.second);
// Observations and outcomes are checked for readable shape, never regraded from a later rule or catalog.
function stepsValid(s,steps,phase){
 if(!Array.isArray(steps)||steps.length<1||steps.length>3||!testStepValid(steps[0])||steps[0].row!=='first')return false;
 if(phase==='first')return steps.length===1;
 if(phase==='second')return steps.length===2&&testStepValid(steps[1])&&steps[1].row==='second';
 if(!['chosen','sent'].includes(phase)||!choiceValid(s,steps.at(-1)))return false;
 return steps.length===2||steps.length===3&&testStepValid(steps[1])&&steps[1].row==='second';
}
function traceValid(t){return t===null||object(t)&&validOrderedSource(t.source)&&validOrderedProgram(t.source,t.program)&&!!parcel(t.source,t.parcelId)&&predictionValid(t.source,t.prediction)&&['first','second','chosen','sent'].includes(t.phase)&&stepsValid(t.source,t.steps,t.phase)&&(t.phase==='chosen'||t.phase==='sent'?!!basket(t.source,t.actualBasket):t.actualBasket===null);}
function runValid(r){return object(r)&&safe(r.id)&&validOrderedSource(r.source)&&validOrderedProgram(r.source,r.program)&&!!parcel(r.source,r.parcelId)&&predictionValid(r.source,r.prediction)&&stepsValid(r.source,r.steps,'sent')&&!!basket(r.source,r.actualBasket)&&!!basket(r.source,r.requestedBasket)&&typeof r.matches==='boolean'&&supportValid(r.support);}
function comparisonValid(c){
 if(!object(c)||!validOrderedSource(c.source)||!validOrderedProgram(c.source,c.program)||!Array.isArray(c.rows)||c.rows.length!==c.source.parcels.length||!Number.isInteger(c.matchCount)||c.matchCount<0||c.matchCount>c.rows.length)return false;
 const ids=new Set();for(const r of c.rows){if(!object(r)||!parcel(c.source,r.parcelId)||ids.has(r.parcelId)||!basket(c.source,r.actualBasket)||!basket(c.source,r.requestedBasket)||typeof r.matches!=='boolean')return false;ids.add(r.parcelId);}
 return c.matchCount===c.rows.filter(r=>r.matches).length;
}
function workValid(w){return object(w)&&validOrderedSource(w.source)&&validOrderedProgram(w.source,w.program,true)&&!!parcel(w.source,w.selectedParcel)&&pages.includes(w.page)&&predictionValid(w.source,w.prediction)&&supportValid(w.support)&&Number.isInteger(w.learnSeen)&&w.learnSeen>=0&&w.learnSeen<=w.source.learn.length&&typeof w.folded==='boolean'&&Number.isInteger(w.helpStage)&&w.helpStage>=0&&w.helpStage<=3&&Array.isArray(w.runs)&&safe(w.nextRun);}
function records(w){const readable=[],unreadable=[],ids=new Map();for(const run of w.runs)if(safe(run?.id))ids.set(run.id,(ids.get(run.id)||0)+1);for(const [index,run] of w.runs.entries()){if(runValid(run)&&ids.get(run.id)===1&&run.id<w.nextRun)readable.push({index,run});else unreadable.push({index,run});}return {readable,unreadable};}
export function orderedCaseView(w){
 if(!workValid(w))return {status:'recovery',work:w,readable:[],unreadable:[],traceStatus:'recovery',resultAvailable:false,result:null,comparisonStatus:'recovery',comparisonAvailable:false};
 const r=records(w),traceStatus=traceValid(w.trace)?'ready':'recovery',firstKept=runValid(w.firstKept)?w.firstKept:null;
 const last=w.runs.at(-1),t=w.trace;
 const result=traceStatus==='ready'&&t?.phase==='sent'&&runValid(last)&&last.id===w.currentResultId&&r.readable.at(-1)?.index===w.runs.length-1&&last.parcelId===t.parcelId&&JSON.stringify(last.source)===JSON.stringify(t.source)&&JSON.stringify(last.program)===JSON.stringify(t.program)?last:null;
 const comparisonStatus=w.comparison===null?'missing':comparisonValid(w.comparison)?'ready':'recovery';
 const history=w.historyId===null?null:(firstKept?.id===w.historyId?firstKept:r.readable.find(x=>x.run.id===w.historyId)?.run||null);
 return {status:'ready',work:w,...r,firstKept,traceStatus,resultAvailable:!!result,result,needsEviction:r.readable.length>=8,oldest:r.readable[0]||null,comparisonStatus,comparisonAvailable:comparisonStatus==='ready',history};
}
export function orderedView(state,caseId){
 if(!own(state,'orderedSorting'))return {status:'missing',root:null,currentCaseId:null,cases:{},case:null};
 const root=state.orderedSorting;if(!object(root)||root.version!==1||!id(root.currentCaseId)||!object(root.cases))return {status:'recovery',root,currentCaseId:null,cases:{},case:null};
 const cases=Object.fromEntries(Object.entries(root.cases).filter(([k])=>id(k)).map(([k,w])=>[k,orderedCaseView(w)]));
 return {status:'ready',root,currentCaseId:root.currentCaseId,cases,case:cases[caseId||root.currentCaseId]||null};
}
const freshProgram=()=>({first:{test:null,not:false,basket:null},second:{test:null,not:false,basket:null},otherwise:null});
const freshWork=s=>({source:copy(s),program:freshProgram(),selectedParcel:s.parcels[0].id,page:'build',prediction:null,trace:null,currentResultId:null,support:freshSupport(),learnSeen:1,folded:false,helpStage:0,runs:[],firstKept:null,nextRun:1,comparison:null,historyId:null});
function fits(state,root,canExport){try{const candidate=copy(state);candidate.orderedSorting=copy(root);return recoveryFitsProgressLimits(candidate)&&typeof canExport==='function'&&canExport(candidate)===true;}catch{return false;}}
function commit(state,root,canExport){if(!fits(state,root,canExport))return false;state.orderedSorting=root;return true;}
export function startOrdered(state,caseId,canExport){
 const v=orderedView(state);if(v.status==='recovery'||!id(caseId))return false;
 const source=orderedSources.find(s=>s.id===caseId),root=v.status==='missing'?{version:1,currentCaseId:caseId,cases:{}}:copy(v.root);
 if(!own(root.cases,caseId)){if(!source||!validOrderedSource(source))return false;root.cases[caseId]=freshWork(source);}
 root.currentCaseId=caseId;return commit(state,root,canExport);
}
export const chooseOrderedCase=startOrdered;
function change(state,canExport,fn){const v=orderedView(state),cv=v.case;if(v.status!=='ready'||cv?.status!=='ready'||cv.traceStatus!=='ready')return false;const root=copy(v.root),w=root.cases[root.currentCaseId];if(fn(w,cv)===false)return false;return commit(state,root,canExport);}
const reset=w=>{w.trace=null;w.prediction=null;w.currentResultId=null;};
export function editOrdered(state,row,field,value,canExport){return change(state,canExport,w=>{
 if(row==='otherwise'){if(field!=='basket'||value!==null&&!basket(w.source,value))return false;w.program.otherwise=value;}
 else {if(!['first','second'].includes(row)||!['test','not','basket'].includes(field))return false;
 if(field==='test'&&!(value===null||tests.has(value)||row==='second'&&value==='off')||field==='not'&&typeof value!=='boolean'||field==='basket'&&value!==null&&!basket(w.source,value))return false;
 w.program[row][field]=value;}reset(w);
 });}
export function swapOrdered(state,canExport){return change(state,canExport,w=>{if(!tests.has(w.program.first.test)||!tests.has(w.program.second.test))return false;[w.program.first,w.program.second]=[w.program.second,w.program.first];reset(w);});}
export function selectOrderedParcel(state,parcelId,canExport){return change(state,canExport,w=>{if(!parcel(w.source,parcelId))return false;w.selectedParcel=parcelId;reset(w);});}
export function predictOrdered(state,prediction,canExport){return change(state,canExport,w=>{if(w.trace!==null||!predictionValid(w.source,prediction))return false;w.prediction=prediction;});}
export function pageOrdered(state,page,canExport){return change(state,canExport,w=>{if(!pages.includes(page))return false;w.page=page;});}
export function restartOrdered(state,canExport){return change(state,canExport,w=>reset(w));}
export function supportOrdered(state,kind,canExport){return change(state,canExport,w=>{if(!supportKeys.includes(kind))return false;w.support[kind]=true;});}
export function learnOrdered(state,action,canExport){return change(state,canExport,w=>{if(!['next','fold','unfold'].includes(action))return false;w.support.learn=true;if(action==='fold')w.folded=true;else {w.folded=false;if(action==='next')w.learnSeen=Math.min(w.source.learn.length,w.learnSeen+1);}});}
export function helpOrdered(state,canExport){return change(state,canExport,w=>{w.helpStage=w.helpStage>=3?1:w.helpStage+1;w.support[['hint','example','skip'][w.helpStage-1]]=true;});}
export function contrastOrdered(state,canExport){return change(state,canExport,w=>{if(!tests.has(w.program.first.test)||!tests.has(w.program.second.test))return false;const p=orderedOverlap(w.source,w.program);w.support.contrast=true;if(p){w.selectedParcel=p.id;reset(w);}});}
export function compareOrdered(state,canExport){return change(state,canExport,w=>{if(!validOrderedProgram(w.source,w.program))return false;const source=copy(w.source),program=copy(w.program);const rows=source.parcels.map(p=>{const o=orderedOutcome(source,program,p.id);return {parcelId:p.id,actualBasket:o.actualBasket,requestedBasket:o.requestedBasket,matches:o.matches};});w.comparison={source,program,rows,matchCount:rows.filter(r=>r.matches).length};w.support.comparison=true;});}
export function historyOrdered(state,runId,canExport){return change(state,canExport,(w,v)=>{if(runId!==null&&!(v.firstKept?.id===runId||v.readable.some(x=>x.run.id===runId)))return false;w.historyId=runId;w.page='history';});}
export function stepOrdered(state,canExport,confirmedEvictionId=null){return change(state,canExport,(w,v)=>{
 if(w.trace===null){if(!validOrderedProgram(w.source,w.program))return false;const source=copy(w.source),program=copy(w.program),p=parcel(source,w.selectedParcel);w.trace={source,program,parcelId:p.id,prediction:w.prediction,phase:'first',steps:[observation('first',program.first,p)],actualBasket:null};return;}
 const t=w.trace;if(t.phase==='sent')return false;
 if(t.phase==='first'){
  if(!t.steps[0].yes&&t.program.second.test!=='off'){t.steps.push(observation('second',t.program.second,parcel(t.source,t.parcelId)));t.phase='second';return;}
  const branch=t.steps[0].yes?'first':'otherwise';t.actualBasket=branch==='first'?t.program.first.basket:t.program.otherwise;t.steps.push({kind:'choose',branch,basket:t.actualBasket,second:t.steps[0].yes?'not-tested':'off'});t.phase='chosen';return;
 }
 if(t.phase==='second'){const branch=t.steps[1].yes?'second':'otherwise';t.actualBasket=branch==='second'?t.program.second.basket:t.program.otherwise;t.steps.push({kind:'choose',branch,basket:t.actualBasket,second:'tested'});t.phase='chosen';return;}
 if(t.phase!=='chosen'||v.needsEviction&&confirmedEvictionId!==v.oldest.run.id)return false;
 const used=new Set(w.runs.filter(object).map(r=>r.id));if(object(w.firstKept))used.add(w.firstKept.id);let next=w.nextRun;while(used.has(next)&&next<Number.MAX_SAFE_INTEGER)next++;if(next>=Number.MAX_SAFE_INTEGER)return false;
 const requestedBasket=route(t.source,t.source.requestProgram,parcel(t.source,t.parcelId)).actualBasket;
 const run={id:next,source:copy(t.source),program:copy(t.program),parcelId:t.parcelId,prediction:t.prediction,steps:copy(t.steps),actualBasket:t.actualBasket,requestedBasket,matches:t.actualBasket===requestedBasket,support:copy(w.support)};
 if(!runValid(run))return false;if(v.needsEviction)w.runs.splice(v.oldest.index,1);w.runs.push(run);if(w.firstKept===null)w.firstKept=copy(run);w.nextRun=next+1;w.currentResultId=next;w.historyId=next;t.phase='sent';
 });}
export function prepareOrderedDisplay(state,canExport){
 const v=orderedView(state),c=v.case,w=c?.work;
 if(v.status!=='ready'||c?.status!=='ready'||c.traceStatus!=='ready'||w.page==='history'||w.folded)return {ok:true,changed:false};
 const learn=w.learnSeen>0,guided=['build','step','compare'].includes(w.page);
 if((!learn||w.support.learn)&&(!guided||w.support.guided))return {ok:true,changed:false};
 const ok=change(state,canExport,x=>{if(learn)x.support.learn=true;if(guided)x.support.guided=true;});
 return {ok,changed:ok};
}
export function orderedBasketLabel(s,basketId){return basket(s,basketId)?.label||'basket';}
