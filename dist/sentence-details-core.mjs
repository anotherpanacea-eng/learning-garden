import {detailCopy as copy,detailTeaching,detailModel,detailScenes,detailScene} from './sentence-details-content.mjs';

const own=(o,k)=>Object.hasOwn(o,k);
const plain=o=>o!==null&&typeof o==='object'&&[Object.prototype,null].includes(Object.getPrototypeOf(o));
const fields=(o,names)=>plain(o)&&Reflect.ownKeys(o).length===names.length&&names.every(k=>own(o,k)&&'value' in Object.getOwnPropertyDescriptor(o,k));
const known=id=>typeof id==='string'&&detailScenes.some(s=>s.id===id);
const anchorFor=(id,anchor)=>anchor===null||detailScene(id).entities.some(e=>e.id===anchor);
// Validate every draft, including those not on screen. A view never repairs or materializes one.
function valid(state){
 try{
  if(!plain(state)||!['caseId','drafts'].every(k=>own(state,k)&&'value' in Object.getOwnPropertyDescriptor(state,k)))return false;
  if(!known(state.caseId)||!plain(state.drafts))return false;
  for(const id of Reflect.ownKeys(state.drafts)){
   if(!known(id)||!('value' in Object.getOwnPropertyDescriptor(state.drafts,id)))return false;
   const d=state.drafts[id];
   if(!fields(d,['anchor','previous'])||!anchorFor(id,d.anchor))return false;
   if(d.previous!==null&&(!fields(d.previous,['anchor'])||!anchorFor(id,d.previous.anchor)))return false;
  }
  return true;
 }catch{return false;}
}
const draft=state=>own(state.drafts,state.caseId)?state.drafts[state.caseId]:{anchor:null,previous:null};
export const initialDetails=()=>({caseId:detailScenes[0].id,drafts:{}});
export function changeDetails(state,action,value){
 if(!valid(state))return null;
 try{
  const current=draft(state);
  if(action==='scene'){
   if(!known(value)||value===state.caseId)return null;
   const next=structuredClone(state);next.caseId=value;return next;
  }
  let nextDraft;
  if(action==='attach'){
   if(typeof value!=='string'||!anchorFor(state.caseId,value)||value===current.anchor)return null;
   nextDraft={anchor:value,previous:{anchor:current.anchor}};
  }else if(action==='remove'){
   if(current.anchor===null)return null;
   nextDraft={anchor:null,previous:{anchor:current.anchor}};
  }else if(action==='undo'){
   if(current.previous===null)return null;
   nextDraft={anchor:current.previous.anchor,previous:null};
  }else return null;
  const next=structuredClone(state);next.drafts[state.caseId]=nextDraft;return next;
 }catch{return null;}
}
export function detailsPresentation(state){
 if(!valid(state))return null;
 const scene=detailScene(state.caseId),current=draft(state),trial=current.anchor===null?null:scene.trials[current.anchor];
 const tokens=trial?trial.tokens:scene.base;
 return {scene,anchor:current.anchor,tokens,sentence:tokens.map(t=>t.text).join(''),meaning:trial?trial.meaning:copy.separateMeaning,sceneNote:trial?trial.sceneNote:'',purposeNote:trial?trial.purposeNote:'',canUndo:current.previous!==null};
}
const page=(value,length)=>Number.isFinite(value)?Math.max(0,Math.min(length-1,Math.trunc(value))):0;
export function detailsNarration(state,view={}){
 const p=detailsPresentation(state);if(!p)return null;
 const {scene}=p,parts=[`${copy.scene}: ${scene.title}`,scene.context,copy.sceneNotice,`${copy.purpose}: ${scene.purpose}`,`${copy.detail}: ${scene.clause}`,`${copy.sentence}: ${p.sentence}`];
 if(p.anchor!==null)parts.push(`${copy.pointsTo}: ${scene.entities.find(e=>e.id===p.anchor).label}`,`${copy.meaning}: ${p.meaning}`,`${copy.sceneNote}: ${p.sceneNote}`,`${copy.purposeNote}: ${p.purposeNote}`);
 else parts.push(copy.noDetail,copy.leftWaiting,`${copy.meaning}: ${copy.separateMeaning}`);
 if(view?.teachingOpen===true){const i=page(view.teachingPage,detailTeaching.length);parts.push(`${copy.teachingCount} ${i+1} of ${detailTeaching.length}`,detailTeaching[i]);}
 if(view?.modelOpen===true){const i=page(view.modelPage,detailModel.length);parts.push(`${copy.modelCount} ${i+1} of ${detailModel.length}`,detailModel[i].title,detailModel[i].text);}
 return parts.join(' ');
}
export function detailsAnnouncement(state,action){
 const p=detailsPresentation(state);if(!p)return null;
 if(action==='scene')return copy.sceneAnnouncement.replace('{title}',p.scene.title);
 if(action==='attach')return p.anchor===null?null:copy.attachedAnnouncement.replace('{noun}',p.scene.entities.find(e=>e.id===p.anchor).label);
 if(action==='remove')return copy.removedAnnouncement;
 if(action==='undo')return copy.undoAnnouncement;
 return null;
}
