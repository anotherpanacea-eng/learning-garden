import {groupCopy as copy,groupScene,groupScenes,groupTeaching} from './sentence-groups-content.mjs';

const own=(object,key)=>Object.hasOwn(object,key);
const plain=value=>value!==null&&typeof value==='object'&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
const fields=(value,names)=>plain(value)&&Reflect.ownKeys(value).length===names.length&&names.every(key=>own(value,key)&&'value' in Object.getOwnPropertyDescriptor(value,key));
const wording=value=>fields(value,['attached','commas'])&&typeof value.attached==='boolean'&&typeof value.commas==='boolean'&&(value.attached||!value.commas);
const fresh=()=>({attached:false,commas:false,marked:[],checked:false,shown:false,helpSeen:false,teachingSeen:false,previous:null});
function validDraft(value,scene){
 if(!fields(value,['attached','commas','marked','checked','shown','helpSeen','teachingSeen','previous']))return false;
 if(!wording({attached:value.attached,commas:value.commas})||!['checked','shown','helpSeen','teachingSeen'].every(key=>typeof value[key]==='boolean'))return false;
 if(!Array.isArray(value.marked)||Reflect.ownKeys(value.marked).length!==value.marked.length+1)return false;
 const seen=new Set();
 for(let index=0;index<value.marked.length;index++){
  const item=Object.getOwnPropertyDescriptor(value.marked,index);
  if(!item||!('value' in item)||seen.has(item.value)||!scene.members.some(member=>member.id===item.value))return false;
  seen.add(item.value);
 }
 return value.previous===null||wording(value.previous);
}
function valid(work){
 try{
  if(!fields(work,['caseId','page','beforeHelp','teachingStep','drafts'])||!groupScene(work.caseId)||!['message','meaning','teaching'].includes(work.page)||!['message','meaning'].includes(work.beforeHelp)||!Number.isInteger(work.teachingStep)||work.teachingStep<0||work.teachingStep>=groupTeaching.length||!plain(work.drafts))return false;
  return Reflect.ownKeys(work.drafts).every(id=>{const scene=groupScene(id);return scene&&'value' in Object.getOwnPropertyDescriptor(work.drafts,id)&&validDraft(work.drafts[id],scene);});
 }catch{return false;}
}
const draft=work=>own(work.drafts,work.caseId)?work.drafts[work.caseId]:fresh();
export const initialGroups=()=>({caseId:groupScenes[0].id,page:'message',beforeHelp:'message',teachingStep:0,drafts:{}});

export function changeGroups(work,action,value){
 if(!valid(work))return null;
 try{
  const current=draft(work),next=structuredClone(work);
  const update=change=>{next.drafts[work.caseId]={...structuredClone(current),...change};return next;};
  if(action==='scene'){
   if(!groupScene(value))return null;
   next.caseId=value;next.page='message';return next;
  }
  if(action==='teaching-step'){
   if(work.page!=='teaching'||![1,-1].includes(value))return null;
   const step=Math.max(0,Math.min(groupTeaching.length-1,work.teachingStep+value));
   if(step===work.teachingStep)return null;
   next.teachingStep=step;return next;
  }
  if(action==='teaching-close'){
   if(work.page!=='teaching')return null;
   next.page=work.beforeHelp;return next;
  }
  if(work.page==='teaching')return null;
  if(action==='teaching-open'){
   next.beforeHelp=work.page;next.page='teaching';return update({teachingSeen:true});
  }
  if(action==='page'){
   if(!['message','meaning'].includes(value))return null;
   next.page=value;
   return value==='meaning'?update({shown:true,helpSeen:true}):next;
  }
  if(action==='mark'){
   if(work.page!=='message'||!groupScene(work.caseId).members.some(member=>member.id===value))return null;
   const marked=current.marked.includes(value)?current.marked.filter(id=>id!==value):[...current.marked,value];
   return update({marked,checked:false});
  }
  if(action==='check'){
   next.page='meaning';return update({checked:true,shown:true,helpSeen:true});
  }
  let change;
  if(action==='attach'){
   if(current.attached)return null;
   change={attached:true,commas:false};
  }else if(action==='remove'){
   if(!current.attached)return null;
   change={attached:false,commas:false};
  }else if(action==='commas'){
   if(!current.attached)return null;
   change={attached:true,commas:!current.commas};
  }else if(action==='undo'){
   if(current.previous===null)return null;
   change={...current.previous};
  }else return null;
  next.page='message';
  return update({...change,checked:false,shown:false,previous:action==='undo'?null:{attached:current.attached,commas:current.commas}});
 }catch{return null;}
}

export function groupsPresentation(work){
 if(!valid(work))return null;
 const scene=groupScene(work.caseId),current=draft(work),form=!current.attached?'plain':current.commas?'extra':'identify',model=scene.forms[form];
 const match=current.marked.length===model.reference.length&&model.reference.every(id=>current.marked.includes(id)),editing=work.page==='message';
 return {scene,work:structuredClone(current),form,message:model.sentence,marked:[...current.marked],reference:[...model.reference],status:model.status,explanation:model.explanation,canUndo:editing&&current.previous!==null,canAttach:editing&&!current.attached,canRemove:editing&&current.attached,canCommas:editing&&current.attached,verdict:current.checked?(match?copy.matched:copy.compare):null};
}

const labels=(members,ids)=>{
 const names=members.filter(member=>ids.includes(member.id)).map(member=>member.label);
 return names.length<2?names[0]||copy.noneMarked:names.length===2?names.join(' and '):`${names.slice(0,-1).join(', ')}, and ${names.at(-1)}`;
};
export function groupsNarration(work,ui={}){
 const p=groupsPresentation(work);if(!p)return null;
 const parts=[];
 if(work.page==='teaching'){
  const card=groupTeaching[work.teachingStep];
  parts.push(copy.teachingCount.replace('{n}',work.teachingStep+1)+'.',card.title,card.intro,...card.facts,...card.blocks.map(block=>block.text));
 }else{
  parts.push(copy.tab+'.',copy.label,p.scene.story,p.scene.factsIntro,...p.scene.facts,`${copy.sentence}: ${p.message}`,`${copy.yourMarks}: ${labels(p.scene.members,p.marked)}.`);
  if(work.page==='meaning'){
   parts.push(`${copy.messageIncludes}: ${labels(p.scene.members,p.reference)}.`,p.explanation);
   if(p.verdict)parts.push(p.verdict);
  }else parts.push(copy.hint);
 }
 if(ui?.talkOpen===true)parts.push(copy.talk);
 if(ui?.grownupOpen===true)parts.push(copy.grownup);
 return parts.join(' ');
}
