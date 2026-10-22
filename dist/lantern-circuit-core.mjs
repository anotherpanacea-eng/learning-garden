import {circuitCases,circuitLinks} from './lantern-circuit-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),copy=structuredClone;
const bytes=x=>new TextEncoder().encode(x).length,id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(x);
const line=(x,max=1200)=>typeof x==='string'&&x.trim()!==''&&bytes(x)<=max&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x);
export const validCircuitMask=m=>Number.isInteger(m)&&m>=0&&m<=15;
// Only four fixed external links exist. Same-contact wire paths bypass the filament.
export function circuitStatus(mask){if(!validCircuitMask(mask))return null;return (mask&5)===5||(mask&10)===10?'bypass':mask===6||mask===9?'glow':'open';}
export function validCircuitSource(s){
 if(!object(s)||s.version!==1||s.model!=='four-links-one-filament-v1'||!id(s.id)||!line(s.title,160)||!line(s.request)||!validCircuitMask(s.initialMask)||!object(s.copy)||!object(s.example))return false;
 const c=s.copy;
 if(!['reference','idea','contacts','limit','help','talk'].every(k=>line(c[k]))||!object(c.status)||!object(c.loop)||!object(c.wireLabels))return false;
 if(!['open','glow','bypass'].every(k=>object(c.status[k])&&line(c.status[k].title)&&line(c.status[k].text)&&line(c.loop[k]))||!circuitLinks.every(k=>line(c.wireLabels[k.key])))return false;
 const frames=s.example.frames;
 try{return Array.isArray(frames)&&frames.length===3&&frames.every(f=>object(f)&&validCircuitMask(f.mask)&&line(f.caption))&&bytes(JSON.stringify(s))<=32*1024;}catch{return false;}
}
const validSnapshot=(s,key)=>object(s)&&validCircuitSource(s.source)&&s.source.id===key&&validCircuitMask(s.mask);
function readWork(w,key){
 if(!validSnapshot(w,key)||!['learn','connect','kept'].includes(w.page)||!own(w,'kept'))return null;
 const kept=w.kept===null?null:validSnapshot(w.kept,key)?w.kept:null;
 return {work:w,kept,keptUnreadable:w.kept!==null&&!kept};
}
export function circuitView(state){
 if(!own(state,'lanternCircuits'))return {status:'missing',readable:[],unreadable:[]};
 const root=state.lanternCircuits;
 if(!object(root)||root.version!==1||!(root.current===null||id(root.current))||!object(root.cases))return {status:'recovery',root,readable:[],unreadable:[]};
 const readable=[],unreadable=[];
 for(const [key,w]of Object.entries(root.cases)){const v=id(key)&&readWork(w,key);(v?readable:unreadable).push(v?{id:key,...v}:{id:key,raw:w});}
 return {status:'ready',root,readable,unreadable,...(readable.find(x=>x.id===root.current)||{})};
}
const fresh=()=>({version:1,current:null,cases:{}});
function fits(state,root,canExport){try{const candidate={...state,lanternCircuits:root};return recoveryFitsProgressLimits(candidate)&&canExport(candidate)===true;}catch{return false;}}
export function startCircuit(state,key,canExport=()=>true){
 const v=circuitView(state);if(v.status==='recovery'||!id(key))return false;
 const root=v.status==='missing'?fresh():copy(v.root);
 if(own(root.cases,key)){if(!readWork(root.cases[key],key))return false;}
 else{const source=circuitCases.find(s=>s.id===key);if(!source||!validCircuitSource(source))return false;root.cases[key]={source:copy(source),page:'learn',mask:source.initialMask,kept:null};}
 root.current=key;if(!fits(state,root,canExport))return false;state.lanternCircuits=root;return true;
}
function change(state,fn,canExport){const v=circuitView(state);if(!v.work)return false;const root=copy(v.root),w=root.cases[root.current];if(fn(w,v)===false||!readWork(w,root.current)||!fits(state,root,canExport))return false;state.lanternCircuits=root;return true;}
export function setCircuitPage(state,page,canExport=()=>true){if(!['learn','connect','kept'].includes(page))return false;return change(state,w=>{w.page=page;},canExport);}
export function setCircuitLink(state,key,present,canExport=()=>true){const link=circuitLinks.find(l=>l.key===key);if(!link||typeof present!=='boolean')return false;return change(state,w=>{w.mask=present?w.mask|link.bit:w.mask&~link.bit;},canExport);}
export function keepCircuit(state,replace=false,canExport=()=>true){return change(state,(w,v)=>{if(v.keptUnreadable||w.kept!==null&&replace!==true)return false;w.kept=copy({source:w.source,mask:w.mask});},canExport);}
export function recoverCircuits(state,canExport=()=>true){if(!own(state,'lanternCircuits'))return false;const root={...fresh(),retainedRaw:copy(state.lanternCircuits)};if(!fits(state,root,canExport))return false;state.lanternCircuits=root;return true;}
