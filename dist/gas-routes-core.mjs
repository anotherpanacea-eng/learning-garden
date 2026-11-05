// Source-owned paths and explicit guide choices; Keep is the only notebook write.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {gasCases,gasSource} from './gas-routes-content.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,keys)=>object(x)&&keys.every(k=>own(x,k));
const range=(x,min,max)=>Number.isFinite(x)&&x>=min&&x<=max;
const integer=(x,min,max)=>Number.isInteger(x)&&range(x,min,max);
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&[...x].length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const safeId=x=>typeof x==='string'&&/^[\x21-\x7e]{1,80}$/.test(x)&&!reserved.has(x);
const list=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const unique=x=>new Set(x).size===x.length;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
export function validGasSource(s){
 try{
 if(!fields(s,['v','model','id','title','context','notice','returnQuestion','loopNote','gas','world','nodes','legs','methods','gradientNote','transportNote','teaching'])||s.v!==1||s.model!=='gas-route-v1'||!safeId(s.id)||!text(s.title,160)||!['context','notice','returnQuestion','loopNote','gradientNote','transportNote'].every(k=>text(s[k],1500)))return false;
 if(!fields(s.gas,['label','symbol'])||!text(s.gas.label,160)||!['circle','diamond'].includes(s.gas.symbol)||!fields(s.world,['width','height'])||!integer(s.world.width,1000,2000)||!integer(s.world.height,300,1000))return false;
 const r=s.world.width*.045,margin=1.2*r;
 if(!list(s.nodes,2,8)||!s.nodes.every(n=>fields(n,['id','label','art','x','y','description'])&&safeId(n.id)&&text(n.label,160)&&text(n.description,1500)&&['outside','sac','blood','cell'].includes(n.art)&&range(n.x,margin,s.world.width-margin)&&range(n.y,margin,s.world.height-margin))||!unique(s.nodes.map(n=>n.id)))return false;
 for(let i=0;i<s.nodes.length;i++)for(let j=i+1;j<s.nodes.length;j++)if(distance(s.nodes[i],s.nodes[j])<3*r)return false;
 if(!list(s.methods,1,6)||!s.methods.every(m=>fields(m,['id','label','description'])&&safeId(m.id)&&text(m.label,160)&&text(m.description,1500))||!unique(s.methods.map(m=>m.id)))return false;
 if(!list(s.legs,s.nodes.length-1,s.nodes.length-1)||!s.legs.every((l,i)=>fields(l,['id','from','to','methodId','text'])&&safeId(l.id)&&l.from===s.nodes[i].id&&l.to===s.nodes[i+1].id&&s.methods.some(m=>m.id===l.methodId)&&text(l.text,1500))||!unique(s.legs.map(l=>l.id)))return false;
 for(let i=0;i<s.legs.length;i++)for(let j=0;j<s.nodes.length;j++)if(j!==i&&j!==i+1&&segmentDistance(s.nodes[j],s.nodes[i],s.nodes[i+1])<margin)return false;
 return list(s.teaching,1,8)&&s.teaching.every(t=>text(t,1500));
 }catch{return false;}
}
export function validGasWork(s,w){
 try{return validGasSource(s)&&fields(w,['v','at','seen','guide','referenceShown','exampleSeen'])&&w.v===1&&s.nodes.some(n=>n.id===w.at)&&list(w.seen,1,s.nodes.length)&&w.seen.every(id=>s.nodes.some(n=>n.id===id))&&unique(w.seen)&&w.seen.includes(w.at)&&list(w.guide,0,s.legs.length)&&w.guide.every(g=>fields(g,['legId','methodId'])&&s.legs.some(l=>l.id===g.legId)&&s.methods.some(m=>m.id===g.methodId))&&unique(w.guide.map(g=>g.legId))&&typeof w.referenceShown==='boolean'&&integer(w.exampleSeen,0,s.teaching.length);}catch{return false;}
}
export function newGasWork(s){if(!validGasSource(s))return null;return {v:1,at:s.nodes[0].id,seen:[s.nodes[0].id],guide:[],referenceShown:false,exampleSeen:0};}
export function changeGasWork(s,w,action,value){
 if(!validGasWork(s,w))return null;
 try{const next=structuredClone(w);
 switch(action){
 case 'station':if(!s.nodes.some(n=>n.id===value))return null;next.at=value;if(!next.seen.includes(value))next.seen.push(value);break;
 case 'label':{if(!fields(value,['legId','methodId'])||!s.legs.some(l=>l.id===value.legId)||!s.methods.some(m=>m.id===value.methodId))return null;const existing=next.guide.find(g=>g.legId===value.legId);if(existing)existing.methodId=value.methodId;else next.guide.push({legId:value.legId,methodId:value.methodId});break;}
 case 'remove':if(!next.guide.some(g=>g.legId===value))return null;next.guide=next.guide.filter(g=>g.legId!==value);break;
 case 'reference':next.referenceShown=true;break;
 case 'example':next.exampleSeen=Math.min(s.teaching.length,next.exampleSeen+1);break;
 default:return null;
 }
 return validGasWork(s,next)?next:null;
 }catch{return null;}
}
export function gasLegGeometry(s,legId){
 if(!validGasSource(s))return null;const index=s.legs.findIndex(l=>l.id===legId);if(index<0)return null;
 const a=s.nodes[index],b=s.nodes[index+1],d=distance(a,b),ux=(b.x-a.x)/d,uy=(b.y-a.y)/d,radius=s.world.width*.045;
 const start={x:a.x+ux*radius,y:a.y+uy*radius},end={x:b.x-ux*radius,y:b.y-uy*radius},headLength=Math.min(s.world.width*.018,.45*radius),headWidth=Math.min(s.world.width*.012,.30*radius),base={x:end.x-ux*headLength,y:end.y-uy*headLength};
 return {start,end,head:[{...end},{x:base.x-uy*headWidth/2,y:base.y+ux*headWidth/2},{x:base.x+uy*headWidth/2,y:base.y-ux*headWidth/2}],strokeWidth:s.world.width/250,radius,fontSize:s.world.width/16,headLength,headWidth};
}
const guideNumber=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^gas-guide-[1-9][0-9]{0,5}$/.test(r.id)?Number(r.id.slice(10)):null;
export function gasGuidesView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'gasGuides'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.gasGuides))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;for(const raw of book.gasGuides){const n=guideNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
 const items=Array.from(book.gasGuides,(raw,index)=>{const n=guideNumber(raw);return {raw,index,id:n===null?null:raw.id,readable:n!==null&&counts.get(n)===1&&fields(raw,['source','work'])&&validGasWork(raw.source,raw.work)};});
 return {status:'ready',items,canKeep:max<999999};
}
export const lastGasGuide=book=>gasGuidesView(book).items.findLast(item=>item.readable)??null;
export function keepGasGuide(book,source,work,options={}){
 if(!validGasWork(source,work)||typeof options?.canExport!=='function')return false;
 const view=gasGuidesView(book);if(!view.canKeep)return false;
 try{const max=view.items.reduce((n,item)=>Math.max(n,guideNumber(item.raw)??0),0),id=`gas-guide-${max+1}`,candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.gasGuides;
 records.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.gasGuides=records;
 if(!recoveryFitsProgressLimits(candidate))return false;
 const proposal=structuredClone(records);
 if(options.canExport(candidate)!==true)return false;
 book.gasGuides=proposal;return id;
 }catch{return false;}
}
