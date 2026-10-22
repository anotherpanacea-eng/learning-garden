import {hundredthsCases,hundredthsName,relation} from './hundredths-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),copy=structuredClone;
const safe=n=>Number.isSafeInteger(n)&&n>0;
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x)&&new TextEncoder().encode(x).length<=max;
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,79}$/.test(x);
const amount=n=>Number.isInteger(n)&&n>=0&&n<=100;
const support=a=>Array.isArray(a)&&a.length<=4&&a.every(x=>typeof x==='string'&&['help','narrationRequested','together','feedback'].includes(x))&&new Set(a).size===a.length;
const choice=x=>x===null||['less','same','greater'].includes(x);
const response=(x,s)=>object(x)&&(s.kind==='build'?amount(x.amount)&&!own(x,'choice'):choice(x.choice)&&!own(x,'amount'));
const equal=(a,b,s)=>s.kind==='build'?a.amount===b.amount:a.choice===b.choice;
export function validHundredthsSource(s){return object(s)&&s.version===1&&id(s.id)&&id(s.wholeId)&&text(s.title,160)&&text(s.request,400)&&text(s.wholeLabel,160)&&text(s.help,800)&&s.partCount===100&&((s.kind==='build'&&amount(s.target)&&!own(s,'left')&&!own(s,'right'))||(s.kind==='compare'&&amount(s.left)&&amount(s.right)&&!own(s,'target')));}
function sameSource(a,b){return ['version','id','wholeId','title','request','wholeLabel','help','partCount','kind',...(b.kind==='build'?['target']:['left','right'])].every(k=>a[k]===b[k]);}
function validCheck(c,s){return object(c)&&safe(c.id)&&validHundredthsSource(c.source)&&sameSource(c.source,s)&&response(c.response,s)&&support(c.support)&&typeof c.familiar==='boolean'&&c.priorExposureUnknown===true&&c.practiceOnly===true&&typeof c.feedbackShown==='boolean'&&text(c.feedbackText,800)&&['matches','different'].includes(c.outcome)&&c.outcome===outcome(c.response,s);}
function validKeep(k,s){return k===null||object(k)&&response(k.response,s)&&support(k.support)&&typeof k.familiar==='boolean'&&k.priorExposureUnknown===true&&(k.latestCheck===null||validCheck(k.latestCheck,s));}
function validWork(w,key){
 if(!object(w)||!validHundredthsSource(w.source)||w.source.id!==key||!response(w.response,w.source)||!support(w.support)||typeof w.helpOpen!=='boolean'||w.helpOpen&&!w.support.includes('help')||typeof w.sourceShown!=='boolean'||typeof w.familiar!=='boolean'||!safe(w.nextCheckId)||!Array.isArray(w.checks)||w.checks.length>4||!w.checks.every(c=>validCheck(c,w.source))||!validKeep(w.kept,w.source))return false;
 let previous=0;for(const c of w.checks){if(c.id<=previous||c.id>=w.nextCheckId)return false;previous=c.id;}
 return w.feedbackId===null||w.checks.some(c=>c.id===w.feedbackId&&equal(c.response,w.response,w.source));
}
export function hundredthsView(state){
 if(!own(state,'hundredthsBridge'))return {status:'missing',root:null,readable:[],unreadable:[],work:null};
 const root=state.hundredthsBridge;
 if(!object(root)||root.version!==1||!id(root.currentCase)||!object(root.cases))return {status:'recovery',root,readable:[],unreadable:[],work:null};
 const readable=[],unreadable=[];for(const [key,work] of Object.entries(root.cases))(validWork(work,key)?readable:unreadable).push({id:key,work});
 return {status:'ready',root,readable,unreadable,work:readable.find(x=>x.id===root.currentCase)?.work||null};
}
const freshWork=(source,familiar=false)=>({source:copy(source),response:source.kind==='build'?{amount:0}:{choice:null},support:[],helpOpen:false,sourceShown:false,familiar,checks:[],nextCheckId:1,feedbackId:null,kept:null});
const mark=(w,key)=>{if(!w.support.includes(key))w.support.push(key);};
const fits=(state,root,canExport)=>{const candidate={...state,hundredthsBridge:root};return recoveryFitsProgressLimits(candidate)&&canExport(candidate);};
export function startHundredths(state,caseId,canExport=()=>true){
 const v=hundredthsView(state);if(v.status==='recovery')return false;
 if(v.status==='ready'&&own(v.root.cases,caseId)){const previous=v.readable.find(x=>x.id===caseId);if(!previous)return false;v.root.currentCase=caseId;previous.work.familiar=true;return true;}
 const source=hundredthsCases.find(x=>x.id===caseId);if(!source||!validHundredthsSource(source))return false;
 const root=v.status==='missing'?{version:1,currentCase:caseId,cases:{}}:copy(v.root);
 root.currentCase=caseId;root.cases[caseId]=freshWork(source,own(root,'recovered'));
 const candidate=copy(root);candidate.cases[caseId].sourceShown=true;
 if(!fits(state,root,canExport)||!fits(state,candidate,canExport))return false;state.hundredthsBridge=root;return true;
}
function active(state){const v=hundredthsView(state);return v.status==='ready'&&v.work?v:null;}
export function moveHundredths(state,step){const v=active(state);if(!v||v.work.source.kind!=='build'||![-10,-1,1,10].includes(step))return false;const n=v.work.response.amount+step;if(!amount(n))return false;v.work.response.amount=n;v.work.feedbackId=null;return true;}
export function clearHundredths(state){const v=active(state);if(!v||v.work.source.kind!=='build')return false;v.work.response.amount=0;v.work.feedbackId=null;return true;}
export function chooseHundredths(state,value){const v=active(state);if(!v||v.work.source.kind!=='compare'||!['less','same','greater'].includes(value))return false;v.work.response.choice=value;v.work.feedbackId=null;return true;}
export function supportHundredths(state,kind){const v=active(state);if(!v||!['help','narrationRequested','together'].includes(kind))return false;mark(v.work,kind);if(kind==='help')v.work.helpOpen=true;return true;}
export function markHundredthsDisplayed(state){const v=active(state);if(!v)return false;let changed=false;if(!v.work.sourceShown){v.work.sourceShown=true;changed=true;}const c=v.work.checks.find(x=>x.id===v.work.feedbackId);if(c&&!c.feedbackShown){c.feedbackShown=true;changed=true;}return changed;}
export function outcome(r,s){return (s.kind==='build'?r.amount===s.target:r.choice!==null&&r.choice===relation(s.left,s.right))?'matches':'different';}
function feedback(r,s){
 if(s.kind==='build'){
  const n=r.amount,correct=n===s.target;
  let target=hundredthsName(s.target);
  if(s.target===30)target+=' = 3/10 = 0.3. The whole square stayed the same size';
  if(s.target===35)target+=' = 0.30 + 0.05. Three rows and five small parts make this amount';
  return `${correct?'This amount matches the request.':'This amount differs from the request. You can revise or keep it.'} Selected: ${hundredthsName(n)}. Requested: ${target}.`;
 }
 const a=s.left,b=s.right,rn=relation(a,b),phrase=rn==='same'?'the same amount':rn==='less'?'less than':'greater than';
 let detail=a===30&&b===30?'0.3 and 0.30 name the same amount on the same whole.':a===35&&b===30?'0.35 is five hundredths more than 0.30.':a===35&&b===40?'0.35 is five hundredths less than 0.40.':'';
 return `${r.choice===rn?'Your chosen relation fits these pictures.':'Your chosen relation differs from these pictures. You can revise or keep it.'} First: ${a}/100. Second: ${b}/100. The first is ${phrase} the second. ${detail}`.trim();
}
export function checkHundredths(state){
 const v=active(state);if(!v||v.work.nextCheckId>=Number.MAX_SAFE_INTEGER||v.work.source.kind==='compare'&&v.work.response.choice===null)return false;
 const w=v.work,s=w.source,c={id:w.nextCheckId,source:copy(s),response:copy(w.response),support:[...w.support],familiar:w.familiar||w.checks.length>0,priorExposureUnknown:true,practiceOnly:true,outcome:outcome(w.response,s),feedbackText:feedback(w.response,s),feedbackShown:false};
 if(!validCheck(c,s))return false;w.nextCheckId++;w.checks.push(c);if(w.checks.length>4)w.checks.shift();w.feedbackId=c.id;mark(w,'feedback');return true;
}
export function keepHundredths(state){const v=active(state);if(!v)return false;const w=v.work;w.kept={response:copy(w.response),support:[...w.support],familiar:w.familiar||w.checks.length>0,priorExposureUnknown:true,latestCheck:w.checks.length?copy(w.checks.at(-1)):null};return true;}
export function recoverHundredths(state,canExport=()=>true){
 const v=hundredthsView(state);if(v.status==='missing'||v.status==='ready'&&!v.unreadable.length)return false;
 const source=hundredthsCases[0];if(!validHundredthsSource(source))return false;
 const root={version:1,currentCase:source.id,cases:{[source.id]:freshWork(source,true)},recovered:copy(state.hundredthsBridge)};
 const candidate=copy(root);candidate.cases[source.id].sourceShown=true;
 if(!fits(state,root,canExport)||!fits(state,candidate,canExport))return false;state.hundredthsBridge=root;return true;
}
export function hundredthsFacts(state){
 const v=active(state);if(!v||!v.work.sourceShown)return [];
 const w=v.work,facts=[[10,10]],counts=w.source.kind==='build'?[w.response.amount]:[w.source.left,w.source.right];
 // Only the active board or frozen, displayed words can supply the row fact.
 const feedback=w.checks.find(c=>c.id===w.feedbackId&&c.feedbackShown)?.feedbackText||'';
 if(counts.some(n=>n>=30&&n<40)||w.source.kind==='build'&&w.helpOpen&&w.source.help.includes('Three rows cover 30/100')||feedback.includes('Three rows and five small parts'))facts.push([3,10]);
 return facts;
}
