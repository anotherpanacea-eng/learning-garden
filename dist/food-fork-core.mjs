import {foodForkSource} from './food-fork-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),copy=structuredClone;
const bytes=x=>new TextEncoder().encode(x).length;
const safe=x=>Number.isSafeInteger(x)&&x>0;
const id=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(x);
const text=(x,n)=>typeof x==='string'&&x.trim().length>0&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x)&&bytes(x)<=n;
const support=x=>obj(x)&&['helpOpened','together','narrationRequested'].every(k=>typeof x[k]==='boolean');
const freshSupport=()=>({helpOpened:false,together:false,narrationRequested:false});
const cardIds=s=>new Set(s.cards.map(c=>c.id));
const credit=x=>obj(x)&&text(x.title,160)&&text(x.role,1000)&&typeof x.url==='string'&&x.url.length<=500&&/^https:\/\/[^\s<>"']+$/u.test(x.url);
const pair=(x,ids)=>obj(x)&&ids.has(x.food)&&ids.has(x.eater);
const feedback=x=>obj(x)&&['exact','different','unsure','incomplete'].every(k=>text(x[k],1000));
const slip=(x,ids)=>obj(x)&&text(x.text,1000)&&(x.expected===null||pair(x.expected,ids))&&feedback(x.feedback);
export function validForkSource(s){
 if(!obj(s)||s.version!==1||!id(s.id)||!Array.isArray(s.cards)||s.cards.length<1||s.cards.length>8||!Array.isArray(s.rows)||s.rows.length<1||s.rows.length>8||!obj(s.copy)||!Array.isArray(s.credits)||s.credits.length<1||s.credits.length>12)return false;
 if(!s.cards.every(c=>obj(c)&&id(c.id)&&text(c.label,160)&&text(c.scientificName,160)&&text(c.passage,1200)&&text(c.pictureText,1200)&&obj(c.drawing)&&safe(c.drawing.version)&&id(c.drawing.kind))||new Set(s.cards.map(c=>c.id)).size!==s.cards.length)return false;
 const ids=cardIds(s);
 if(!s.rows.every(r=>obj(r)&&id(r.id)&&text(r.prompt,400)&&slip(r.initial,ids)&&(!own(r,'closer')||slip(r.closer,ids)))||new Set(s.rows.map(r=>r.id)).size!==s.rows.length)return false;
 if(!['intro','legend','limit','stage','help','check','studyLimit'].every(k=>text(s.copy[k],1000))||!s.credits.every(credit))return false;
 try{return bytes(JSON.stringify(s))<=16*1024;}catch{return false;}
}
const rowOf=(s,rowId)=>s.rows.find(r=>r.id===rowId);
export const forkSlip=(s,row,view)=>view==='closer'&&row.closer?row.closer:row.initial;
const answer=(a,ids)=>obj(a)&&(a.food===null||ids.has(a.food))&&(a.eater===null||ids.has(a.eater))&&typeof a.notEnough==='boolean'&&(!a.notEnough||a.food===null&&a.eater===null);
const outcome=(o)=>obj(o)&&(o.outcome===null||typeof o.outcome==='boolean')&&text(o.feedback,1000);
function readableRows(c,s){const ids=cardIds(s);return s.rows.filter(r=>own(c.answers,r.id)&&answer(c.answers[r.id],ids)&&own(c.outcomes,r.id)&&outcome(c.outcomes[r.id]));}
function readableCheck(c,s){return obj(c)&&safe(c.id)&&['initial','closer'].includes(c.evidenceView)&&typeof c.closerSeen==='boolean'&&obj(c.answers)&&obj(c.outcomes)&&support(c.support)&&readableRows(c,s).length>0;}
function checksView(root){const readable=[],unreadable=[];let previous=0;for(const [index,check] of root.checks.entries()){if(readableCheck(check,root.source)&&check.id>previous&&check.id<root.nextCheck){readable.push({index,check,rows:readableRows(check,root.source)});previous=check.id;}else unreadable.push({index,check});}return {readable,unreadable};}
function validRoot(r){
 if(!obj(r)||r.version!==1||!validForkSource(r.source)||!['cards','build','kept'].includes(r.page)||!['initial','closer'].includes(r.evidenceView)||typeof r.closerSeen!=='boolean'||!obj(r.answers)||!Array.isArray(r.checks)||!safe(r.nextCheck)||!support(r.support))return false;
 return r.checks.every(c=>!obj(c)||!safe(c.id)||c.id<r.nextCheck);
}
export function forkView(state){
 if(!own(state,'foodFork'))return {status:'missing',root:null,readable:[],unreadable:[]};
 const root=state.foodFork;if(!validRoot(root))return {status:'recovery',root,readable:[],unreadable:[]};
 const checks=checksView(root);if(checks.readable.length>12)return {status:'recovery',root,readable:[],unreadable:[]};
 return {status:'ready',root,...checks};
}
const fresh=()=>({version:1,source:copy(foodForkSource),page:'cards',evidenceView:'initial',closerSeen:false,answers:{},checks:[],nextCheck:1,support:freshSupport()});
const fits=(state,root,canExport)=>{const candidate={...state,foodFork:root};try{return recoveryFitsProgressLimits(candidate)&&canExport(candidate);}catch{return false;}};
export function startFork(state,canExport=()=>true,replace=false){
 const v=forkView(state);if(v.status!=='missing'&&!replace)return false;
 const root=fresh();if(v.status!=='missing')root.retainedRaw=copy(state.foodFork);
 if(!validForkSource(root.source)||!fits(state,root,canExport))return false;
 state.foodFork=root;return true;
}
function change(state,mutate,canExport=()=>true){const v=forkView(state);if(v.status!=='ready')return false;const root=copy(v.root);if(mutate(root)===false||!fits(state,root,canExport))return false;state.foodFork=root;return true;}
export function setForkPage(state,page,canExport){return change(state,r=>{if(!['cards','build','kept'].includes(page))return false;r.page=page;},canExport);}
export function setForkEvidence(state,view,canExport){return change(state,r=>{if(!['initial','closer'].includes(view))return false;r.evidenceView=view;if(view==='closer')r.closerSeen=true;},canExport);}
export function setForkAnswer(state,rowId,part,value,canExport){return change(state,r=>{const row=rowOf(r.source,rowId),ids=cardIds(r.source);if(!row||own(r.answers,rowId)&&!answer(r.answers[rowId],ids))return false;const a=own(r.answers,rowId)?r.answers[rowId]:{food:null,eater:null,notEnough:false};if(part==='notEnough'){if(value!==true&&value!==false)return false;a.notEnough=value;if(value)a.food=a.eater=null;}else if(['food','eater'].includes(part)&&(value===null||ids.has(value))){a[part]=value;a.notEnough=false;}else return false;r.answers[rowId]=a;},canExport);}
export function setForkSupport(state,part,canExport){return change(state,r=>{if(!['helpOpened','together','narrationRequested'].includes(part))return false;r.support[part]=true;},canExport);}
export function assessForkRow(s,row,view,a){if(!validForkSource(s)||!rowOf(s,row.id)||!answer(a,cardIds(s)))return null;const slip=forkSlip(s,row,view);let kind,result=null;if(a.notEnough){kind='unsure';result=slip.expected===null;}else if(a.food===null||a.eater===null)kind='incomplete';else if(slip.expected&&a.food===slip.expected.food&&a.eater===slip.expected.eater){kind='exact';result=true;}else{kind='different';result=false;}return {outcome:result,feedback:slip.feedback[kind]};}
export function checkFork(state,canExport=()=>true){
 const v=forkView(state);if(v.status!=='ready'||v.root.nextCheck>=Number.MAX_SAFE_INTEGER)return false;
 const root=copy(v.root),answers={},outcomes={};for(const row of root.source.rows){if(!own(root.answers,row.id)||!answer(root.answers[row.id],cardIds(root.source)))continue;answers[row.id]=copy(root.answers[row.id]);outcomes[row.id]=assessForkRow(root.source,row,root.evidenceView,answers[row.id]);}
 if(!Object.keys(outcomes).length)return false;
 const check={id:root.nextCheck,evidenceView:root.evidenceView,closerSeen:root.closerSeen,answers,outcomes,support:copy(root.support)};
 if(v.readable.length>=12)root.checks.splice(v.readable[0].index,1);
 root.checks.push(check);root.nextCheck++;root.page='kept';if(!fits(state,root,canExport))return false;state.foodFork=root;return true;
}
export function forkLiveRow(view,row){
 if(view.status!=='ready')return {status:'unchecked'};const root=view.root,entry=view.readable.at(-1);if(!entry||entry.index!==root.checks.length-1)return {status:'unchecked'};
 const c=entry.check,id=row.id;if(c.evidenceView!==root.evidenceView||!own(c.answers,id)||!own(c.outcomes,id)||!own(root.answers,id))return {status:'unchecked'};
 const current=root.answers[id],saved=c.answers[id];if(!answer(current,cardIds(root.source))||!answer(saved,cardIds(root.source))||JSON.stringify(current)!==JSON.stringify(saved)||!outcome(c.outcomes[id]))return {status:'unchecked'};
 const recorded=c.outcomes[id],expected=assessForkRow(root.source,row,root.evidenceView,current);if(!expected||recorded.outcome!==expected.outcome)return {status:'recorded-only',recorded};
 return {status:'current',recorded,displayFeedback:expected.feedback,solid:recorded.outcome===true&&!current.notEnough&&current.food!==null&&current.eater!==null};
}
export const forkAnswer=(root,id)=>own(root.answers,id)&&answer(root.answers[id],cardIds(root.source))?root.answers[id]:null;
export const forkUnreadableAnswer=(root,id)=>own(root.answers,id)&&!answer(root.answers[id],cardIds(root.source));
