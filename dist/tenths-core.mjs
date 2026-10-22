import {tenthsCases,tenthsNames} from './tenths-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),copy=structuredClone;
const own=(x,k)=>Object.hasOwn(x,k),safe=n=>Number.isSafeInteger(n)&&n>0;
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x)&&new TextEncoder().encode(x).length<=max;
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,79}$/.test(x);
const list=(a,p,max)=>Array.isArray(a)&&a.length<=max&&a.every(p)&&new Set(a).size===a.length;
const selected=a=>list(a,n=>Number.isInteger(n)&&n>=0&&n<10,10);
const support=a=>list(a,x=>['help','narrationRequested','together','feedback'].includes(x),4);
export function validTenthsSource(s){return object(s)&&s.version===1&&id(s.id)&&id(s.wholeId)&&text(s.title,160)&&text(s.request,400)&&text(s.wholeLabel,160)&&s.partCount===10&&Number.isInteger(s.targetTenths)&&s.targetTenths>=0&&s.targetTenths<=10&&['fraction','decimal'].includes(s.form);}
function validCheck(c,s){return object(c)&&safe(c.id)&&selected(c.selected)&&support(c.support)&&typeof c.familiar==='boolean'&&typeof c.priorExposureUnknown==='boolean'&&c.practiceOnly===true&&typeof c.matches==='boolean'&&c.matches===(c.selected.length===s.targetTenths)&&text(c.feedbackText,800);}
function validWork(w,key){
 if(!object(w)||!validTenthsSource(w.source)||w.source.id!==key||!selected(w.selected)||!support(w.support)||typeof w.helpOpen!=='boolean'||typeof w.familiar!=='boolean'||!safe(w.nextCheckId)||!Array.isArray(w.checks)||w.checks.length>4||!w.checks.every(c=>validCheck(c,w.source)))return false;
 let previous=0;for(const c of w.checks){if(c.id<=previous||c.id>=w.nextCheckId)return false;previous=c.id;}
 if(!(w.feedbackId===null||w.checks.some(c=>c.id===w.feedbackId)))return false;
 const k=w.kept;if(k!==null&&(!object(k)||!selected(k.selected)||!support(k.support)||typeof k.familiar!=='boolean'||typeof k.priorExposureUnknown!=='boolean'||!(k.latestCheck===null||validCheck(k.latestCheck,w.source))))return false;
 return true;
}
export function tenthsView(state){
 if(!own(state,'tenthsTable'))return {status:'missing',root:null,readable:[],unreadable:[],work:null};
 const root=state.tenthsTable;
 if(!object(root)||root.version!==1||!id(root.currentCase)||!object(root.cases)||!list(root.shownValues,n=>Number.isInteger(n)&&n>=0&&n<=10,11))return {status:'recovery',root,readable:[],unreadable:[],work:null};
 const readable=[],unreadable=[];for(const [key,work] of Object.entries(root.cases))(validWork(work,key)?readable:unreadable).push({id:key,work});
 return {status:'ready',root,readable,unreadable,work:readable.find(x=>x.id===root.currentCase)?.work||null};
}
const freshWork=(source,familiar=false)=>({source:copy(source),selected:[],support:[],helpOpen:false,familiar,checks:[],nextCheckId:1,feedbackId:null,kept:null});
const mark=(w,key)=>{if(!w.support.includes(key))w.support.push(key);};
const shown=(r,n)=>{if(!r.shownValues.includes(n))r.shownValues.push(n);};
const fits=(state,root,canExport)=>{const candidate={...state,tenthsTable:root};return recoveryFitsProgressLimits(candidate)&&canExport(candidate);};
export function startTenths(state,caseId,canExport=()=>true){
 const view=tenthsView(state);if(view.status==='recovery')return false;
 if(view.status==='ready'&&own(view.root.cases,caseId)){
  const existing=view.readable.find(x=>x.id===caseId);if(!existing)return false;view.root.currentCase=caseId;existing.work.familiar=true;return true;
 }
 const source=tenthsCases.find(x=>x.id===caseId);if(!source||!validTenthsSource(source))return false;
 const root=view.status==='missing'?{version:1,currentCase:caseId,cases:{},shownValues:[]}:copy(view.root);
 root.currentCase=caseId;root.cases[caseId]=freshWork(source,root.shownValues.includes(source.targetTenths)||own(root,'recovered'));
 if(!fits(state,root,canExport))return false;state.tenthsTable=root;return true;
}
function active(state){const v=tenthsView(state);return v.status==='ready'&&v.work?v:null;}
export function toggleTenthsPart(state,n){const v=active(state);if(!v||!Number.isInteger(n)||n<0||n>9)return false;const a=v.work.selected,i=a.indexOf(n);if(i>=0)a.splice(i,1);else a.push(n);v.work.feedbackId=null;return true;}
export function clearTenths(state){const v=active(state);if(!v)return false;v.work.selected=[];v.work.feedbackId=null;return true;}
export function supportTenths(state,kind){const v=active(state);if(!v||!['help','narrationRequested','together'].includes(kind))return false;mark(v.work,kind);if(kind==='help'){v.work.helpOpen=true;shown(v.root,4);shown(v.root,10);}return true;}
export function checkTenths(state){
 const v=active(state);if(!v||v.work.nextCheckId>=Number.MAX_SAFE_INTEGER)return false;
 const w=v.work,n=w.selected.length,target=w.source.targetTenths,matches=n===target;
 const feedbackText=`${matches?'This amount matches the request.':'This amount is different from the request. You can change it or keep it.'} Selected: ${tenthsNames(n)}. Requested: ${tenthsNames(target)}.${target===10?' Ten tenths make one whole.':target===0?' No parts selected is zero.':''}`;
 const check={id:w.nextCheckId,selected:[...w.selected],support:[...w.support],familiar:w.familiar||v.root.shownValues.includes(target),priorExposureUnknown:own(v.root,'recovered'),practiceOnly:true,matches,feedbackText};
 if(!validCheck(check,w.source))return false;
 w.nextCheckId++;w.checks.push(check);if(w.checks.length>4)w.checks.shift();w.feedbackId=check.id;mark(w,'feedback');shown(v.root,n);shown(v.root,target);return true;
}
export function keepTenths(state){const v=active(state);if(!v)return false;const w=v.work;w.kept={selected:[...w.selected],support:[...w.support],familiar:w.familiar||v.root.shownValues.includes(w.source.targetTenths),priorExposureUnknown:own(v.root,'recovered'),latestCheck:w.checks.length?copy(w.checks.at(-1)):null};return true;}
export function recoverTenths(state,canExport=()=>true){
 const v=tenthsView(state);if(v.status==='missing'||v.status==='ready'&&!v.unreadable.length)return false;
 const source=tenthsCases[0];if(!validTenthsSource(source))return false;
 const root={version:1,currentCase:source.id,cases:{[source.id]:freshWork(source,true)},shownValues:[],recovered:copy(state.tenthsTable)};
 if(!fits(state,root,canExport))return false;state.tenthsTable=root;return true;
}
