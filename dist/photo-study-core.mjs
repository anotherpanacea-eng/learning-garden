// Source-owned drawing geometry; explicit Keep is the only notebook write.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {photoStudySource} from './photo-study-content.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,keys)=>object(x)&&keys.every(k=>own(x,k));
const range=(x,min,max)=>Number.isFinite(x)&&x>=min&&x<=max;
const integer=(x,min,max)=>Number.isInteger(x)&&range(x,min,max);
const text=(x,max,empty=false)=>typeof x==='string'&&(empty||x.trim().length>0)&&[...x].length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const safeId=x=>typeof x==='string'&&/^[\x21-\x7e]{1,80}$/.test(x)&&!reserved.has(x);
const list=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const unique=x=>new Set(x).size===x.length;
const paper=p=>fields(p,['width','height'])&&integer(p.width,100,2000)&&integer(p.height,100,2000);
const point=(p,a)=>fields(a,['x','y'])&&integer(a.x,0,p.width)&&integer(a.y,0,p.height);
const fits=x=>new TextEncoder().encode(JSON.stringify(x)).length<=100000;
export function decodeStudyPoints(value){
 if(typeof value!=='string'||value.length>40000||! /^(?:0|[1-9][0-9]*),(?:0|[1-9][0-9]*)(?: (?:0|[1-9][0-9]*),(?:0|[1-9][0-9]*))*$/.test(value))return null;
 const pairs=value.split(' ');if(pairs.length>512)return null;
 const points=pairs.map(pair=>{const [x,y]=pair.split(',').map(Number);return {x,y};});
 return points.every(p=>integer(p.x,0,2000)&&integer(p.y,0,2000))?points:null;
}
export function encodeStudyPoints(points){
 if(!list(points,1,512)||!points.every(p=>point({width:2000,height:2000},p)))return null;
 return points.map(p=>`${p.x},${p.y}`).join(' ');
}
function drawing(p,d){
 if(!fields(d,['strokes','labels','caption'])||!list(d.strokes,0,128)||!unique(d.strokes.map(s=>s?.id))||!list(d.labels,0,32)||!unique(d.labels.map(l=>l?.id))||!text(d.caption,600,true))return false;
 let total=0;
 for(const s of d.strokes){if(!fields(s,['id','points'])||!safeId(s.id))return false;const pts=decodeStudyPoints(s.points);if(!pts||!pts.every(a=>point(p,a))||(total+=pts.length)>4000)return false;}
 return d.labels.every(l=>fields(l,['id','kind','text','at'])&&safeId(l.id)&&['notice','idea','question'].includes(l.kind)&&text(l.text,160,true)&&(l.at===null||point(p,l.at)));
}
function photo(p){return fields(p,['art','title','sourceTitle','caption','alt','credit','license','captureLabel','notice','zooms'])&&p.art==='onion120-v1'&&['title','sourceTitle','captureLabel'].every(k=>text(p[k],160))&&['caption','alt','credit','license','notice'].every(k=>text(p[k],1500))&&list(p.zooms,1,5)&&p.zooms.every(z=>range(z,1,8))&&unique(p.zooms)&&p.zooms.includes(1);}
export function validPhotoStudySource(s){
 try{if(!fields(s,['v','model','id','title','context','notice','returnQuestion','photo','photoView','paper','teaching','example'])||s.v!==1||s.model!=='photo-study-v1'||!safeId(s.id)||!text(s.title,160)||!['context','notice','returnQuestion'].every(k=>text(s[k],1500))||!photo(s.photo)||!paper(s.paper)||!list(s.teaching,1,8)||!s.teaching.every(t=>text(t,1500))||!fields(s.example,['paper'])||!paper(s.example.paper)||!drawing(s.example.paper,s.example)||!fields(s.photoView,['zoom','x','y'])||!s.photo.zooms.includes(s.photoView.zoom))return false;
 const H=.5/s.photoView.zoom;return range(s.photoView.x,H,1-H)&&range(s.photoView.y,H,1-H)&&fits({source:s});
 }catch{return false;}
}
export function validPhotoStudyWork(s,w){try{return validPhotoStudySource(s)&&fields(w,['v','strokes','labels','caption','exampleSeen'])&&w.v===1&&integer(w.exampleSeen,0,s.teaching.length)&&drawing(s.paper,w)&&fits({source:s,work:w});}catch{return false;}}
export function newPhotoStudyWork(s){const w={v:1,strokes:[],labels:[],caption:'',exampleSeen:0};return validPhotoStudyWork(s,w)?w:null;}
const nextId=(items,prefix)=>{const used=new Set(items.map(x=>x.id));let i=1;while(used.has(`${prefix}${i}`))i++;return `${prefix}${i}`;};
export function changePhotoStudyWork(s,w,action,value){
 if(!validPhotoStudyWork(s,w))return null;
 try{const next=structuredClone(w);let entry;
 switch(action){
 case 'addStroke':if(!fields(value,['points']))return null;next.strokes.push({id:nextId(next.strokes,'s'),points:value.points});break;
 case 'removeStroke':if(!next.strokes.some(x=>x.id===value))return null;next.strokes=next.strokes.filter(x=>x.id!==value);break;
 case 'addLabel':next.labels.push({id:nextId(next.labels,'l'),kind:value??'notice',text:'',at:null});break;
 case 'removeLabel':if(!next.labels.some(x=>x.id===value))return null;next.labels=next.labels.filter(x=>x.id!==value);break;
 case 'labelText':case 'labelKind':case 'placeLabel':
 if(!fields(value,['id'])||!(entry=next.labels.find(x=>x.id===value.id)))return null;
 if(action==='labelText'){if(!own(value,'text'))return null;entry.text=value.text;}
 else if(action==='labelKind'){if(!own(value,'kind'))return null;entry.kind=value.kind;}
 else {if(!own(value,'at'))return null;entry.at=structuredClone(value.at);}break;
 case 'caption':next.caption=value;break;
 case 'clear':next.strokes=[];next.labels=[];break;
 case 'example':next.exampleSeen=Math.min(s.teaching.length,next.exampleSeen+1);break;
 default:return null;
 }
 return validPhotoStudyWork(s,next)?next:null;
 }catch{return null;}
}
const studyNumber=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^photo-study-[1-9][0-9]{0,5}$/.test(r.id)?Number(r.id.slice(12)):null;
export function photoStudiesView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'photoStudies'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.photoStudies))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of book.photoStudies){const n=studyNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
 const items=Array.from(book.photoStudies,(raw,index)=>{const n=studyNumber(raw);return {raw,index,id:n===null?null:raw.id,readable:n!==null&&counts.get(n)===1&&fields(raw,['source','work'])&&validPhotoStudyWork(raw.source,raw.work)};});
 return {status:'ready',items,canKeep:max<999999};
}
export const lastPhotoStudy=book=>photoStudiesView(book).items.findLast(item=>item.readable)??null;
export function keepPhotoStudy(book,source,work,options={}){
 if(!validPhotoStudyWork(source,work)||typeof options?.canExport!=='function')return false;
 const view=photoStudiesView(book);if(!view.canKeep)return false;
 try{const max=view.items.reduce((n,item)=>Math.max(n,studyNumber(item.raw)??0),0),id=`photo-study-${max+1}`,candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.photoStudies;
 records.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.photoStudies=records;
 if(!recoveryFitsProgressLimits(candidate))return false;
 const proposal=structuredClone(records);
 if(options.canExport(candidate)!==true)return false;
 book.photoStudies=proposal;return id;
 }catch{return false;}
}
