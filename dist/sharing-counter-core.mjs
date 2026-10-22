import {SHARING_CASES,SHARING_PAGES,SHARING_SUPPORT,SHARING_EXAMPLE,sharingCaseById} from './sharing-counter-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const keys=(x,required,optional=[])=>object(x)&&required.every(k=>Object.hasOwn(x,k))&&Object.keys(x).every(k=>required.includes(k)||optional.includes(k));
const integer=(n,max)=>Number.isInteger(n)&&n>=0&&n<=max;
const clone=x=>JSON.parse(JSON.stringify(x));
function same(a,b){if(a===b)return true;if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i]));return object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&same(a[k],b[k]));}
const supportValid=s=>object(s)&&s.visual===true&&Object.entries(s).every(([k,v])=>SHARING_SUPPORT.includes(k)&&v===true);
const indices=(a,max)=>Array.isArray(a)&&a.length<=max+1&&a.every(n=>integer(n,max))&&new Set(a).size===a.length;
export function sharingPieces(model){if(!object(model)||!Array.isArray(model.cuts)||!Array.isArray(model.selected))return [];const bounds=[0,...model.cuts,12];return bounds.slice(0,-1).map((start,index)=>({index,start,end:bounds[index+1],width:bounds[index+1]-start,selected:model.selected.includes(index)}));}
export function sharingTray(model){return 12-model.groups.reduce((sum,n)=>sum+n,0);}
export function sharingCanPackGroups(model){return object(model)&&Array.isArray(model.groups)&&model.groups.length===4&&model.groups.every(n=>n===3);}
function modelValid(c,m){if(c.kind==='loaf')return keys(m,['cuts','selected'])&&Array.isArray(m.cuts)&&m.cuts.length<=11&&m.cuts.every((n,i)=>integer(n,11)&&n>0&&(i===0||n>m.cuts[i-1]))&&indices(m.selected,m.cuts.length);return keys(m,['groups','selected'])&&Array.isArray(m.groups)&&m.groups.length===4&&m.groups.every(n=>integer(n,12))&&sharingTray(m)>=0&&indices(m.selected,3)&&(m.selected.length===0||sharingCanPackGroups(m));}
const partitionAllowed=(c,count)=>c.id==='half-parcel'?[2,4].includes(count):count===c.shares;
export function sharingAssessment(c,m){
 const loaf=c.kind==='loaf',parts=loaf?sharingPieces(m).map(p=>p.width):m.groups,shareCount=parts.length,selectedCount=m.selected.length;
 const equalSizes=parts[0]>0&&parts.every(n=>n===parts[0]),allAccounted=loaf||sharingTray(m)===0,shareCountFit=partitionAllowed(c,shareCount);
 const selectedAmount=loaf?sharingPieces(m).filter(p=>p.selected).reduce((s,p)=>s+p.width,0):m.selected.reduce((s,i)=>s+m.groups[i],0);
 const portionFit=c.family==='repair'?selectedCount===c.packed:loaf?selectedAmount*c.target.denominator===12*c.target.numerator:selectedCount===c.packed;
 return {shareCount,selectedCount,shareCountFit,equalSizes,allAccounted,portionFit,fit:shareCountFit&&equalSizes&&allAccounted&&portionFit};
}
// Saved copies keep their own wording; only the request's arithmetic must still match, so a copy edit cannot lock saved work.
const SEMANTIC=['id','modelId','kind','family','shares','packed','target','whole','initialModel'],sourceValid=(c,s)=>object(s)&&['title','reader','reason','request'].every(k=>typeof s[k]==='string')&&SEMANTIC.every(k=>same(s[k],c[k]));
// Saved results are checked for their counts and outcomes, not re-graded, so changing how results are computed or shaped cannot lock saved work.
const assessmentValid=a=>object(a)&&integer(a.shareCount,12)&&integer(a.selectedCount,12)&&['shareCountFit','equalSizes','allAccounted','portionFit','fit'].every(k=>typeof a[k]==='boolean');
function snapshotValid(c,s){return keys(s,['source','model','assessment','support','familiar','practice','visual'])&&sourceValid(c,s.source)&&modelValid(c,s.model)&&assessmentValid(s.assessment)&&supportValid(s.support)&&typeof s.familiar==='boolean'&&s.practice===true&&s.visual===true;}
function keptValid(c,s){return keys(s,['source','model','assessment','support','familiar','practice','visual'],['latestCheck'])&&snapshotValid(c,Object.fromEntries(Object.entries(s).filter(([k])=>k!=='latestCheck')))&&(!Object.hasOwn(s,'latestCheck')||snapshotValid(c,s.latestCheck));}
const MESSAGES=['','cuts-returned','partition-returned','groups-returned','checked'];
function workValid(c,w){return keys(w,['source','model','support','seen','familiar','exampleStep','checks','kept','message'])&&sourceValid(c,w.source)&&modelValid(c,w.model)&&supportValid(w.support)&&w.seen===true&&typeof w.familiar==='boolean'&&(w.exampleStep===null||integer(w.exampleStep,2))&&(w.exampleStep===null||w.support.workedExample===true||w.support.equivalence===true)&&Array.isArray(w.checks)&&w.checks.length<=24&&w.checks.every(s=>snapshotValid(c,s))&&(w.kept===null||keptValid(c,w.kept))&&MESSAGES.includes(w.message)&&(w.message!=='checked'||w.checks.length>0&&same(w.checks.at(-1).source,w.source)&&same(w.checks.at(-1).model,w.model));}
function valid(r){return keys(r,['version','currentCase','page','cases'],['recovered'])&&r.version===1&&SHARING_PAGES.includes(r.page)&&object(r.cases)&&Object.keys(r.cases).length<=6&&Object.entries(r.cases).every(([id,w])=>{const c=sharingCaseById(id);return c&&workValid(c,w);})&&(r.currentCase===null||sharingCaseById(r.currentCase)&&Object.hasOwn(r.cases,r.currentCase))&&(r.page==='choose'||r.currentCase!==null);}
const fresh=()=>({version:1,currentCase:null,page:'choose',cases:{}});
// Validation and views do not attach a root, record an answer or register exposure.
export function sharingState(state){return state.sharingCounter===undefined?fresh():valid(state.sharingCounter)?state.sharingCounter:null;}
export function ensureSharing(state){if(state.sharingCounter===undefined)state.sharingCounter=fresh();return sharingState(state);}
export function recoverSharing(state){if(state.sharingCounter===undefined||sharingState(state))return false;const original=state.sharingCounter,cases=Object.entries(object(original?.cases)?original.cases:{}).filter(([id,w])=>sharingCaseById(id)&&workValid(sharingCaseById(id),w));state.sharingCounter={...fresh(),cases:clone(Object.fromEntries(cases)),recovered:original};return true;}
function change(state,fn){const r=sharingState(state);if(!r)return false;const next=clone(r),result=fn(next);if(result===false||!valid(next))return false;state.sharingCounter=next;return result??true;}
const work=r=>r.currentCase?r.cases[r.currentCase]:null;
const current=(r)=>({c:sharingCaseById(r.currentCase),w:work(r)});
const newWork=c=>({source:clone(c),model:clone(c.initialModel),support:{visual:true},seen:true,familiar:false,exampleStep:null,checks:[],kept:null,message:''});
export function chooseSharingCase(state,id){const c=sharingCaseById(id);if(!c)return false;return change(state,r=>{if(Object.hasOwn(r.cases,id))r.cases[id].familiar=true;else r.cases[id]=newWork(c);r.currentCase=id;r.page='make';});}
export function nextSharingCase(state){const r=sharingState(state);if(!r)return false;return chooseSharingCase(state,SHARING_CASES[(SHARING_CASES.findIndex(c=>c.id===r.currentCase)+1)%SHARING_CASES.length].id);}
export function setSharingPage(state,page){if(!SHARING_PAGES.includes(page))return false;return change(state,r=>{if(page!=='choose'&&!work(r))return false;r.page=page;});}
const manipulated=w=>{w.support.manipulation=true;if(w.message!=='cuts-returned'&&w.message!=='partition-returned'&&w.message!=='groups-returned')w.message='';};
export function toggleSharingCut(state,coordinate){if(!integer(coordinate,11)||coordinate===0)return false;return change(state,r=>{const {c,w}=current(r);if(!w||c.family!=='repair')return false;w.message=w.model.selected.length?'cuts-returned':'';w.model.selected=[];const i=w.model.cuts.indexOf(coordinate);if(i<0)w.model.cuts.push(coordinate);else w.model.cuts.splice(i,1);w.model.cuts.sort((a,b)=>a-b);manipulated(w);});}
export function joinSharingLoaf(state){return change(state,r=>{const {c,w}=current(r);if(!w||c.family!=='repair'||w.model.cuts.length===0)return false;w.message=w.model.selected.length?'cuts-returned':'';w.model={cuts:[],selected:[]};manipulated(w);});}
export function setSharingPartition(state,count){if(![2,4].includes(count))return false;return change(state,r=>{const {c,w}=current(r);if(!w||c.family!=='compare')return false;const cuts=count===2?[6]:[3,6,9];if(same(w.model.cuts,cuts))return false;w.message=w.model.selected.length?'partition-returned':'';w.model={cuts,selected:[]};manipulated(w);});}
function toggle(a,index){const at=a.indexOf(index);if(at<0)a.push(index);else a.splice(at,1);a.sort((a,b)=>a-b);}
export function toggleSharingPiece(state,index){if(!integer(index,11))return false;return change(state,r=>{const {c,w}=current(r);if(!w||c.kind!=='loaf'||index>w.model.cuts.length)return false;toggle(w.model.selected,index);w.message='';manipulated(w);});}
function returnGroups(w){w.message=w.model.selected.length?'groups-returned':'';w.model.selected=[];}
export function moveSharingBun(state,index,direction){if(!integer(index,3)||!['in','out'].includes(direction))return false;return change(state,r=>{const {c,w}=current(r);if(!w||c.kind!=='basket'||direction==='in'&&sharingTray(w.model)===0||direction==='out'&&w.model.groups[index]===0)return false;returnGroups(w);w.model.groups[index]+=direction==='in'?1:-1;manipulated(w);});}
export function shareSharingRound(state){return change(state,r=>{const {c,w}=current(r);if(!w||c.kind!=='basket'||sharingTray(w.model)<4)return false;returnGroups(w);w.model.groups=w.model.groups.map(n=>n+1);manipulated(w);});}
export function toggleSharingGroup(state,index){if(!integer(index,3))return false;return change(state,r=>{const {c,w}=current(r);if(!w||c.kind!=='basket'||!sharingCanPackGroups(w.model))return false;toggle(w.model.selected,index);w.message='';manipulated(w);});}
export function requestSharingSupport(state,kind){if(!SHARING_SUPPORT.includes(kind)||kind==='visual'||kind==='manipulation'||kind==='checkFeedback')return false;return change(state,r=>{const {c,w}=current(r);if(!w||kind==='equivalence'&&c.id!=='half-parcel'||kind==='workedExample'&&c.kind!=='basket')return false;w.support[kind]=true;if(['workedExample','equivalence'].includes(kind)&&w.exampleStep===null)w.exampleStep=0;});}
export function stepSharingExample(state,delta){if(![-1,1].includes(delta))return false;return change(state,r=>{const {c,w}=current(r);if(!w||!(c.kind==='basket'||c.id==='half-parcel'))return false;w.support[c.kind==='basket'?'workedExample':'equivalence']=true;w.exampleStep=Math.max(0,Math.min(2,(w.exampleStep??0)+delta));});}
const snapshot=(c,w)=>({source:clone(w.source),model:clone(w.model),assessment:sharingAssessment(c,w.model),support:clone(w.support),familiar:w.familiar,practice:true,visual:true});
export function checkSharing(state){return change(state,r=>{const {c,w}=current(r);if(!w)return false;if(w.checks.length)w.familiar=true;const s=snapshot(c,w);w.checks.push(s);w.support.checkFeedback=true;w.checks=w.checks.slice(-24);w.message='checked';return clone(s);});}
export function keepSharing(state){return change(state,r=>{const {c,w}=current(r);if(!w)return false;w.kept=snapshot(c,w);if(w.checks.length)w.kept.latestCheck=clone(w.checks.at(-1));return clone(w.kept);});}
export function sharingFeedback(c,a){const messages=[];if(!a.shareCountFit)messages.push(`This request needs ${c.shares} equal shares.`);if(!a.equalSizes)messages.push(c.kind==='loaf'?'The pieces have different widths. Move the cuts to make equal shares.':'The four supplied groups need the same nonzero number of buns.');if(!a.allAccounted)messages.push('Some buns are still in the tray. Share all twelve into the groups.');if(!a.portionFit)messages.push(c.family==='repair'||c.kind==='basket'?`Pack ${c.packed===1?'one complete share':'three complete shares'} for this request.`:'The packed amount does not match the requested part of this whole yet.');return a.fit?'This pictured parcel fits the request. You can keep this draft or change it.':messages.join(' ');}
const fractionWords=(n,d)=>`${n} of ${d} equal shares`;
export function sharingDisplayedFactPairs(state,context='current'){
 const r=sharingState(state);if(!r||!['current','notes'].includes(context))return [];
 if(context==='notes'){
  // Expanded notes show the actual stored group arrays, not a guessed fact from
  // co-occurring numbers or from a support flag whose example is not present.
  const displayedModels=Object.values(r.cases).flatMap(w=>[w.model,...w.checks.map(s=>s.model),w.kept?.model,w.kept?.latestCheck?.model]);
  return displayedModels.some(sharingCanPackGroups)?[[4,3]]:[];
 }
 const w=work(r),c=sharingCaseById(r.currentCase);if(!w||r.page==='choose'||c.kind!=='basket')return [];
 const pairs=[];if(sharingCanPackGroups(w.model)||r.page==='keep'&&w.kept&&sharingCanPackGroups(w.kept.model))pairs.push([4,3]);
 if(w.support.workedExample&&w.exampleStep>=1)pairs.push([...SHARING_EXAMPLE.fact]);return pairs;
}
export function sharingView(state){const r=sharingState(state);if(!r)return null;const {c,w}=current(r);if(!w)return {case:null,work:null,factPairs:[]};const assessment=sharingAssessment(c,w.model),pieces=c.kind==='loaf'?sharingPieces(w.model):[],tray=c.kind==='basket'?sharingTray(w.model):null;
 const selectedAmount=c.kind==='loaf'?pieces.filter(p=>p.selected).reduce((s,p)=>s+p.width,0):w.model.selected.reduce((s,i)=>s+w.model.groups[i],0);
 const validPartition=assessment.equalSizes&&assessment.shareCountFit&&assessment.allAccounted;
 const fraction=validPartition?{numerator:w.model.selected.length,denominator:c.kind==='loaf'?pieces.length:4,words:fractionWords(w.model.selected.length,c.kind==='loaf'?pieces.length:4),notation:`${w.model.selected.length}/${c.kind==='loaf'?pieces.length:4}`}:null;
 const message=w.message==='checked'?sharingFeedback(c,assessment):w.message==='cuts-returned'?'The packed pieces returned to the loaf before its cuts changed.':w.message==='partition-returned'?'The packed pieces returned to the loaf before the shares changed.':w.message==='groups-returned'?'All packed groups returned before the buns moved. Check the whole grouping again.':'';
 return {case:c,work:w,model:w.model,pieces,assessment,tray,selectedCount:w.model.selected.length,selectedAmount,fraction,linePosition:c.kind==='loaf'&&validPartition?selectedAmount/12:null,partitionLabel:c.kind==='basket'?validPartition?'four equal groups of three':'four supplied group mats':assessment.equalSizes&&assessment.shareCountFit?`${pieces.length} equal shares`:`${pieces.length} ${assessment.equalSizes?'pieces':'unequal pieces'}`,canPackGroups:c.kind==='basket'&&sharingCanPackGroups(w.model),message,factPairs:sharingDisplayedFactPairs(state)};
}
