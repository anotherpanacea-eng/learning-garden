import {puppets,settings,actions,props,invitationById,audienceQuestions} from './loft-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),int=(x,a=0,b=1000000000)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const keys=(x,list)=>object(x)&&Object.keys(x).sort().join(',')===list.split(',').sort().join(',');
const catalogs={actor:puppets,place:settings,action:actions,prop:props};
export const validScene=f=>keys(f,'actor,place,action,prop')&&Object.entries(catalogs).every(([k,items])=>items.some(x=>x.id===f[k]));
export function validShow(s){return keys(s,'id,invitation,frames,selected,mode,stage,question,spotlight,changes,shared,heard')&&int(s.id,1)&&!!invitationById(s.invitation)&&Array.isArray(s.frames)&&s.frames.length===3&&s.frames.every(validScene)&&int(s.selected,0,2)&&['edit','perform','audience'].includes(s.mode)&&int(s.stage,0,2)&&int(s.question,0,audienceQuestions.length-1)&&(s.spotlight===null||int(s.spotlight,0,2))&&int(s.changes)&&typeof s.shared==='boolean'&&typeof s.heard==='boolean';}
export function validLoft(l){return keys(l,'version,nextId,draft,shelf')&&l.version===1&&int(l.nextId,1)&&Array.isArray(l.shelf)&&l.shelf.length<=12&&l.shelf.every(s=>validShow(s)&&s.id<l.nextId)&&new Set(l.shelf.map(s=>s.id)).size===l.shelf.length&&(l.draft===null||validShow(l.draft)&&l.draft.id<l.nextId);}
const fresh=()=>({version:1,nextId:1,draft:null,shelf:[]});
// Present-invalid/future work is retained exactly and cannot be edited by this version.
export const loftState=state=>!Object.hasOwn(state,'loft')?fresh():validLoft(state.loft)?state.loft:null;
function change(state,fn){const l=loftState(state);if(!l)return false;const next=structuredClone(l);if(!fn(next)||!validLoft(next))return false;state.loft=next;return true;}
function shelve(l){if(!l.draft)return;l.shelf=l.shelf.filter(s=>s.id!==l.draft.id);l.shelf.push(structuredClone(l.draft));l.shelf=l.shelf.slice(-12);}
export function startShow(state,id){return change(state,l=>{const idea=invitationById(id);if(!idea||l.nextId>=1000000000)return false;shelve(l);l.draft={id:l.nextId++,invitation:id,frames:structuredClone(idea.frames),selected:0,mode:'edit',stage:0,question:(l.nextId-2)%audienceQuestions.length,spotlight:null,changes:0,shared:false,heard:false};return true;});}
export function chooseScene(state,index){return change(state,l=>{const d=l.draft;if(!d||!int(index,0,2)||d.mode!=='edit')return false;d.selected=index;return true;});}
export function setScenePart(state,part,value){return change(state,l=>{const d=l.draft;if(!d||d.mode!=='edit'||!Object.hasOwn(catalogs,part)||!catalogs[part].some(x=>x.id===value)||d.frames[d.selected][part]===value||d.changes>=1000000000)return false;d.frames[d.selected][part]=value;d.changes++;d.shared=false;return true;});}
export function moveScene(state,delta){return change(state,l=>{const d=l.draft;if(!d||d.mode!=='edit'||![-1,1].includes(delta)||!int(d.selected+delta,0,2)||d.changes>=1000000000)return false;const target=d.selected+delta;[d.frames[d.selected],d.frames[target]]=[d.frames[target],d.frames[d.selected]];d.selected=target;d.changes++;d.shared=false;return true;});}
export function performShow(state){return change(state,l=>{if(!l.draft)return false;l.draft.mode='perform';l.draft.stage=0;l.draft.spotlight=null;return true;});}
export function stepShow(state,delta){return change(state,l=>{const d=l.draft;if(!d||d.mode!=='perform'||![-1,1].includes(delta)||!int(d.stage+delta,0,2))return false;d.stage+=delta;return true;});}
export function meetAudience(state){return change(state,l=>{const d=l.draft;if(!d||d.mode!=='perform'||d.stage!==2)return false;d.mode='audience';d.shared=true;d.spotlight=null;shelve(l);return true;});}
export function spotlightScene(state,index){return change(state,l=>{const d=l.draft;if(!d||d.mode!=='audience'||!int(index,0,2))return false;d.spotlight=index;d.stage=index;return true;});}
export function nextAudienceQuestion(state){return change(state,l=>{const d=l.draft;if(!d||d.mode!=='audience')return false;d.question=(d.question+1)%audienceQuestions.length;return true;});}
export function chooseAudienceQuestion(state,index){return change(state,l=>{const d=l.draft;if(!d||d.mode!=='audience'||!int(index,0,audienceQuestions.length-1))return false;d.question=index;return true;});}
export function reviseShow(state,index){return change(state,l=>{const d=l.draft;if(!d||!int(index??d.stage,0,2))return false;d.selected=index??d.stage;d.mode='edit';return true;});}
export function reopenShow(state,id){return change(state,l=>{const saved=l.shelf.find(s=>s.id===id);if(!saved||l.draft?.id===id)return false;const next=structuredClone(saved);shelve(l);l.draft=next;l.draft.mode='edit';l.draft.selected=0;return true;});}
export function noteLoftAudio(state){return change(state,l=>{if(!l.draft)return false;l.draft.heard=true;return true;});}
