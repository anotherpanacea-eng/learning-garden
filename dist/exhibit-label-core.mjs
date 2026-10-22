import {labelCases} from './exhibit-label-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),clone=structuredClone;
const bytes=x=>new TextEncoder().encode(x).length;
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(x);
const prose=(x,limit)=>typeof x==='string'&&x.length>0&&bytes(x)<=limit&&!/[\x00-\x1f\x7f]/.test(x);
const roles=['object','use','claim'],supportCodes=['help','example','together','narrationRequested','visitorAsked'];
const order=x=>Array.isArray(x)&&x.length===3&&new Set(x).size===3&&x.every(k=>roles.includes(k));
const wording=x=>x==='broad'||x==='careful';
const support=x=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(k=>supportCodes.includes(k));

export function validLabelSource(s){
 if(!object(s)||s.version!==1||s.model!=='three-sentence-label-v1'||!id(s.id)||!prose(s.title,240)||!prose(s.readerRequest,800)||!object(s.sourceCard)||!object(s.sentences)||!object(s.sentences.claim)||!order(s.initialOrder)||!wording(s.initialWording)||!object(s.copy)||!object(s.visitor)||!object(s.visitor.openings)||!object(s.visitor.claims))return false;
 if(!['objectNumber','date','materials','alt','credit','assetId'].every(k=>prose(s.sourceCard[k],240))||!prose(s.sourceCard.recordUrl,300)||!prose(s.sourceCard.sharedNote,800))return false;
 if(!['object','use'].every(k=>prose(s.sentences[k],800))||!['broad','careful'].every(k=>prose(s.sentences.claim[k],800)))return false;
 if(!['instruction','help','draftWarning','carefulNotice','earlierResponse','humanRead'].every(k=>prose(s.copy[k],800))||!roles.every(k=>prose(s.visitor.openings[k],800))||!['broad','careful'].every(k=>prose(s.visitor.claims[k],800)))return false;
 return Array.isArray(s.modelFrames)&&s.modelFrames.length>=1&&s.modelFrames.length<=3&&s.modelFrames.every(f=>object(f)&&prose(f.text,800)&&prose(f.caption,800))&&bytes(JSON.stringify(s))<=12*1024;
}
export function validLabelSnapshot(s){return object(s)&&validLabelSource(s.source)&&order(s.order)&&wording(s.wording)&&support(s.support);}
const snapshot=w=>clone({source:w.source,order:w.order,wording:w.wording,support:w.support});
export const labelSnapshot=snapshot;
export const labelSentence=(s,role)=>role==='claim'?s.source.sentences.claim[s.wording]:s.source.sentences[role];
export const labelText=s=>s.order.map(role=>labelSentence(s,role)).join(' ');
export const labelSpeech=s=>(s.wording==='broad'?s.source.copy.draftWarning+' ':'')+labelText(s);
export const sameLabel=(a,b)=>a===b||Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>sameLabel(x,b[i]))||object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>own(b,k)&&sameLabel(a[k],b[k]));
const sameDraft=(a,b)=>order(a?.order)&&order(b?.order)&&a.order.every((x,i)=>x===b.order[i])&&a.wording===b.wording;
export function validLabelResponse(r){
 if(!object(r)||!validLabelSnapshot(r.snapshot)||!prose(r.openingText,800)||!prose(r.claimText,800))return false;
 const s=r.snapshot.source;return r.openingText===s.visitor.openings[r.snapshot.order[0]]&&r.claimText===s.visitor.claims[r.snapshot.wording];
}
function caseView(w,key){
 if(!object(w)||!validLabelSnapshot(w)||w.source.id!==key)return null;
 const response=w.lastResponse===null?null:validLabelResponse(w.lastResponse)&&sameLabel(w.lastResponse.snapshot.source,w.source)?w.lastResponse:null;
 const kept=w.kept===null?null:object(w.kept)&&validLabelSnapshot(w.kept.snapshot)&&(w.kept.response===null||validLabelResponse(w.kept.response)&&sameLabel(w.kept.response.snapshot.source,w.kept.snapshot.source)&&sameDraft(w.kept.response.snapshot,w.kept.snapshot))?w.kept:null;
 return {work:w,response,responseUnreadable:own(w,'lastResponse')&&w.lastResponse!==null&&!response,currentResponse:response&&sameDraft(response.snapshot,w)?response:null,kept,keptUnreadable:own(w,'kept')&&w.kept!==null&&!kept};
}
export function labelView(state,key=null){
 if(!own(state,'exhibitLabels'))return {status:'missing',cases:[],unreadable:[],selected:null};
 const root=state.exhibitLabels;if(!object(root)||root.version!==1||!object(root.cases))return {status:'recovery',root,cases:[],unreadable:[],selected:null};
 const cases=[],unreadable=[];for(const [name,w] of Object.entries(root.cases)){const v=id(name)&&caseView(w,name);if(v)cases.push({id:name,...v});else unreadable.push({id:name,raw:w});}
 return {status:'ready',root,cases,unreadable,selected:id(key)&&own(root.cases,key)?cases.find(c=>c.id===key)||null:null};
}
function fits(state,root,canExport){try{const candidate={...state,exhibitLabels:root};return recoveryFitsProgressLimits(candidate)&&canExport(candidate)===true;}catch{return false;}}
const fresh=()=>({version:1,cases:{}});
export function startLabel(state,key,canExport=()=>true){
 const v=labelView(state,key);if(v.status==='recovery'||!id(key)||v.unreadable.some(c=>c.id===key))return false;
 if(v.selected)return true;
 const source=labelCases.find(c=>c.id===key);if(!source)return false;
 const root=v.status==='missing'?fresh():clone(v.root);
 root.cases[key]={source:clone(source),order:[...source.initialOrder],wording:source.initialWording,support:[],lastResponse:null,kept:null};
 if(!fits(state,root,canExport))return false;state.exhibitLabels=root;return true;
}
function change(state,key,fn,canExport){const v=labelView(state,key);if(!v.selected)return false;const root=clone(v.root),w=root.cases[key];if(fn(w,v.selected)===false||!caseView(w,key)||!fits(state,root,canExport))return false;state.exhibitLabels=root;return true;}
export function moveLabel(state,key,role,delta,canExport=()=>true){return change(state,key,w=>{const from=w.order.indexOf(role),to=from+delta;if(![-1,1].includes(delta)||from<0||to<0||to>2)return false;[w.order[from],w.order[to]]=[w.order[to],w.order[from]];},canExport);}
export function wordLabel(state,key,value,canExport=()=>true){return change(state,key,w=>{if(!wording(value))return false;w.wording=value;},canExport);}
export function supportLabel(state,key,code,canExport=()=>true){return change(state,key,w=>{if(!supportCodes.includes(code))return false;if(!w.support.includes(code))w.support.push(code);},canExport);}
export function askLabel(state,key,canExport=()=>true){return change(state,key,(w,v)=>{
 if(!w.support.includes('visitorAsked'))w.support.push('visitorAsked');
 if(v.responseUnreadable){if(own(w,'earlierRawResponses')&&!Array.isArray(w.earlierRawResponses))return false;if(!Array.isArray(w.earlierRawResponses))w.earlierRawResponses=[];w.earlierRawResponses.push(clone(w.lastResponse));}
 const s=snapshot(w);w.lastResponse={snapshot:s,openingText:s.source.visitor.openings[s.order[0]],claimText:s.source.visitor.claims[s.wording]};
},canExport);}
export function keepLabel(state,key,replace=false,canExport=()=>true){return change(state,key,(w,v)=>{if(v.keptUnreadable||own(w,'kept')&&w.kept!==null&&!replace)return false;w.kept={snapshot:snapshot(w),response:v.currentResponse?clone(v.currentResponse):null};},canExport);}
export function recoverLabels(state,canExport=()=>true){if(!own(state,'exhibitLabels'))return false;const root={...fresh(),retainedRaw:clone(state.exhibitLabels)};if(!fits(state,root,canExport))return false;state.exhibitLabels=root;return true;}
