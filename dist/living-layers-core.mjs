// Structural snapshot validation never grades a child's chosen order.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {layerCases,layerSource} from './living-layers-content.mjs';
const own=(x,key)=>Object.hasOwn(x,key);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,keys)=>object(x)&&keys.every(key=>own(x,key));
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&[...x].length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const safeId=x=>typeof x==='string'&&/^[\x21-\x7e]{1,80}$/.test(x)&&!reserved.has(x);
const list=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const unique=x=>new Set(x).size===x.length;
const arts=['heartCell','heartTissue','heart','circulation','person','leafCell','mesophyll','leaf','shoot','plant'];
export function validLayerSource(source){
 try{
  if(!fields(source,['v','model','id','title','context','notice','partDirection','wholeDirection','partConnector','wholeConnector','plantReturnNote','nodes','trayIds','teaching'])||source.v!==1||source.model!=='living-layers-v1'||!safeId(source.id))return false;
  if(!['title','partDirection','wholeDirection','partConnector','wholeConnector'].every(key=>text(source[key],160))||!['context','notice','plantReturnNote'].every(key=>text(source[key],1500)))return false;
  if(!list(source.nodes,2,8)||!source.nodes.every(n=>fields(n,['id','label','kind','levelLabel','role','art','others'])&&safeId(n.id)&&text(n.label,160)&&text(n.levelLabel,160)&&['cell','tissue','organ','system','organism'].includes(n.kind)&&text(n.role,1500)&&arts.includes(n.art)&&list(n.others,0,4)&&n.others.every(o=>fields(o,['label','role'])&&text(o.label,160)&&text(o.role,1500)))||!unique(source.nodes.map(n=>n.id)))return false;
  if(!list(source.trayIds,source.nodes.length,source.nodes.length)||!unique(source.trayIds)||!source.trayIds.every(id=>source.nodes.some(n=>n.id===id)))return false;
  return list(source.teaching,1,8)&&source.teaching.every(t=>fields(t,['text','art'])&&text(t.text,1500)&&['none','yeast'].includes(t.art));
 }catch{return false;}
}
export function validLayerWork(source,work){
 try{return validLayerSource(source)&&fields(work,['v','direction','order','exampleSeen','comparisonShown'])&&work.v===1&&['part-to-whole','whole-to-part'].includes(work.direction)&&list(work.order,0,source.nodes.length)&&unique(work.order)&&work.order.every(id=>source.nodes.some(n=>n.id===id))&&Number.isInteger(work.exampleSeen)&&work.exampleSeen>=0&&work.exampleSeen<=source.teaching.length&&typeof work.comparisonShown==='boolean';}catch{return false;}
}
export function newLayerWork(source){return validLayerSource(source)?{v:1,direction:'part-to-whole',order:[],exampleSeen:0,comparisonShown:false}:null;}
export function changeLayerWork(source,work,action,value){
 if(!validLayerWork(source,work))return null;
 try{
  const next=structuredClone(work),index=next.order.indexOf(value);
  switch(action){
   case 'add':if(!source.nodes.some(n=>n.id===value)||index!==-1)return null;next.order.push(value);break;
   case 'remove':if(index===-1)return null;next.order.splice(index,1);break;
   case 'earlier':case 'later':{
    const target=index+(action==='earlier'?-1:1);if(index===-1||target<0||target>=next.order.length)return null;
    [next.order[index],next.order[target]]=[next.order[target],next.order[index]];break;
   }
   case 'direction':if(!['part-to-whole','whole-to-part'].includes(value))return null;next.direction=value;break;
   case 'example':next.exampleSeen=Math.min(source.teaching.length,next.exampleSeen+1);break;
   case 'compare':next.comparisonShown=true;break;
   default:return null;
  }
  return validLayerWork(source,next)?next:null;
 }catch{return null;}
}
const guideNumber=raw=>object(raw)&&own(raw,'id')&&typeof raw.id==='string'&&/^layer-guide-[1-9][0-9]{0,5}$/.test(raw.id)?Number(raw.id.slice(12)):null;
export function layerGuidesView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'layerGuides'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.layerGuides))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of book.layerGuides){const n=guideNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
 const items=Array.from(book.layerGuides,(raw,index)=>{
  const n=guideNumber(raw),readable=n!==null&&counts.get(n)===1&&fields(raw,['source','work'])&&validLayerWork(raw.source,raw.work);
  return {raw,index,id:n===null?null:raw.id,readable};
 });
 return {status:'ready',items,canKeep:max<999999};
}
export const lastLayerGuide=book=>layerGuidesView(book).items.findLast(item=>item.readable)??null;
export function keepLayerGuide(book,source,work,options={}){
 if(!validLayerWork(source,work)||typeof options?.canExport!=='function')return false;
 const view=layerGuidesView(book);if(!view.canKeep)return false;
 try{
  const max=view.items.reduce((n,item)=>Math.max(n,guideNumber(item.raw)??0),0),newId=`layer-guide-${max+1}`;
  const candidate=structuredClone(book),guides=view.status==='absent'?[]:candidate.layerGuides;
  guides.push({id:newId,source:structuredClone(source),work:structuredClone(work)});candidate.layerGuides=guides;
  if(!recoveryFitsProgressLimits(candidate))return false;
  // Preflight owns a disposable candidate, never the already-cloned proposal.
  const proposal=structuredClone(guides);
  if(options.canExport(candidate)!==true)return false;
  book.layerGuides=proposal;return newId;
 }catch{return false;}
}
