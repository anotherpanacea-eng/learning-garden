// Structural maps describe supplied memberships, never suspense or comprehension.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,ks)=>object(x)&&ks.every(k=>own(x,k));
const text=(x,max=1500)=>typeof x==='string'&&x.trim().length>0&&Array.from(x).length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>text(x,80)&&/^[\x20-\x7e]+$/.test(x)&&!reserved.has(x);
const dense=(xs,min,max,test)=>Array.isArray(xs)&&xs.length>=min&&xs.length<=max&&Array.from({length:xs.length},(_,i)=>own(xs,i)&&test(xs[i])).every(Boolean);
const unique=xs=>new Set(xs).size===xs.length;
const permutation=(xs,scenes)=>dense(xs,scenes.length,scenes.length,x=>id(x)&&scenes.some(s=>s.id===x))&&unique(xs);
function narrative(s,max=12){
 if(!fields(s,['title','threads','scenes'])||!text(s.title,160)||!dense(s.threads,2,2,t=>fields(t,['id','label','symbol'])&&id(t.id)&&text(t.label,160)&&['stripe','dots'].includes(t.symbol))||!unique(s.threads.map(t=>t.id))||!unique(s.threads.map(t=>t.symbol)))return false;
 return dense(s.scenes,3,max,c=>fields(c,['id','title','threadIds','paragraphs'])&&id(c.id)&&text(c.title,160)&&dense(c.threadIds,1,2,t=>s.threads.some(x=>x.id===t))&&unique(c.threadIds)&&dense(c.paragraphs,1,4,p=>text(p)))&&unique(s.scenes.map(c=>c.id))&&s.threads.every(t=>s.scenes.some(c=>c.threadIds.length===1&&c.threadIds[0]===t.id));
}
export function validThreadSource(s){
 try{return fields(s,['v','model','id','title','context','task','notice','returnQuestion','definitions','threads','scenes','startOrder','authorOrder','writerNote','demo','teaching'])&&s.v===1&&s.model==='two-threads-v1'&&id(s.id)&&['context','task','notice','returnQuestion','writerNote'].every(k=>text(s[k]))&&narrative(s)&&dense(s.definitions,1,12,d=>fields(d,['term','meaning'])&&text(d.term,160)&&text(d.meaning))&&permutation(s.startOrder,s.scenes)&&permutation(s.authorOrder,s.scenes)&&narrative(s.demo,6)&&dense(s.teaching,1,6,t=>fields(t,['text','order'])&&text(t.text)&&permutation(t.order,s.demo.scenes));}catch{return false;}
}
export function validThreadWork(s,w){try{return validThreadSource(s)&&fields(w,['v','order','referenceShown','teachingSeen'])&&w.v===1&&permutation(w.order,s.scenes)&&typeof w.referenceShown==='boolean'&&Number.isSafeInteger(w.teachingSeen)&&w.teachingSeen>=0&&w.teachingSeen<=s.teaching.length;}catch{return false;}}
export function newThreadWork(s){return validThreadSource(s)?{v:1,order:[...s.startOrder],referenceShown:false,teachingSeen:0}:null;}
export function changeThreadWork(s,w,action,value){
 try{
  if(!validThreadWork(s,w))return null;
  const next=structuredClone(w);
  if(action==='move'){
   if(!fields(value,['sceneId','delta'])||![-1,1].includes(value.delta))return null;
   const at=next.order.indexOf(value.sceneId),to=at+value.delta;
   if(at<0||to<0||to>=next.order.length)return null;
   [next.order[at],next.order[to]]=[next.order[to],next.order[at]];
  }else if(action==='reference')next.referenceShown=true;
  else if(action==='teaching')next.teachingSeen=Math.min(s.teaching.length,next.teachingSeen+1);
  else return null;
  return next;
 }catch{return null;}
}
export function threadMap(s,order){
 try{
  if(!narrative(s)||!permutation(order,s.scenes))return null;
  const scenes=order.map(id=>s.scenes.find(c=>c.id===id));
  return s.threads.map(t=>{
   const positions=scenes.flatMap((c,i)=>c.threadIds.includes(t.id)?[i+1]:[]),returns=[];
   for(let i=1;i<positions.length;i++){
    const from=positions[i-1],to=positions[i];if(to-from<=1)continue;
    returns.push({from,to,gap:to-from-1,fromId:scenes[from-1].id,toId:scenes[to-1].id,fromTitle:scenes[from-1].title,toTitle:scenes[to-1].title});
   }
   return {id:t.id,label:t.label,symbol:t.symbol,positions,returns};
  });
 }catch{return null;}
}
// Echoes are optional annotations. Their readers never decide whether an older reading order is valid.
const echoLens=x=>['words','image','idea'].includes(x);
const echoDefault=()=>({v:1,left:null,right:null,lens:null,links:[],referenceShown:false,teachingSeen:0});
export function readThreadEchoStudy(s){
 try{
  if(!validThreadSource(s))return {status:'unavailable',study:null};
  if(!own(s,'echoStudy'))return {status:'absent',study:null};
  const e=s.echoStudy,cardId=x=>e.cards.some(c=>c.id===x);
  const anchored=c=>{if(!fields(c,['id','sceneId','paragraphIndex','text'])||!id(c.id)||!id(c.sceneId)||!Number.isInteger(c.paragraphIndex)||c.paragraphIndex<0||!text(c.text))return false;const scene=s.scenes.find(p=>p.id===c.sceneId);return !!scene&&c.paragraphIndex<scene.paragraphs.length&&scene.paragraphs[c.paragraphIndex].includes(c.text);};
  if(!fields(e,['v','title','notice','invitations','cards','references','demo'])||e.v!==1||!text(e.title,160)||!text(e.notice)||!dense(e.invitations,1,6,p=>fields(p,['id','prompt'])&&id(p.id)&&text(p.prompt))||!unique(e.invitations.map(p=>p.id))||!dense(e.cards,4,12,anchored)||!unique(e.cards.map(c=>c.id))||!dense(e.references,1,6,r=>fields(r,['title','left','right','lens','text'])&&text(r.title,160)&&id(r.left)&&id(r.right)&&r.left!==r.right&&cardId(r.left)&&cardId(r.right)&&echoLens(r.lens)&&text(r.text))||!fields(e.demo,['title','text','first','second','steps'])||!text(e.demo.title,160)||!text(e.demo.text)||!text(e.demo.first)||!text(e.demo.second)||e.demo.first===e.demo.second||!e.demo.text.includes(e.demo.first)||!e.demo.text.includes(e.demo.second)||!dense(e.demo.steps,1,4,p=>text(p)))return {status:'unavailable',study:null};
  return {status:'ready',study:e};
 }catch{return {status:'unavailable',study:null};}
}
const echoIdentity=(row,left,right,lens)=>fields(row,['left','right','lens'])&&row.lens===lens&&((row.left===left&&row.right===right)||(row.left===right&&row.right===left));
export function findThreadEchoLink(echoes,left,right,lens){
 try{if(!object(echoes)||!own(echoes,'links')||!Array.isArray(echoes.links)||!id(left)||!id(right)||left===right||!echoLens(lens))return -1;return echoes.links.findIndex(row=>echoIdentity(row,left,right,lens));}catch{return -1;}
}
export function readThreadEchoWork(s,w){
 const unavailable=(stored=false,echoes=null,rows=[],preview=null)=>({status:'unavailable',echoes,stored,rows,preview});
 try{
  if(!validThreadWork(s,w))return unavailable();
  const source=readThreadEchoStudy(s),stored=own(w,'echoes');
  if(source.status==='absent')return stored?unavailable(true,w.echoes):{status:'absent',echoes:null,stored:false,rows:[],preview:null};
  if(source.status!=='ready')return unavailable(stored,stored?w.echoes:null);
  const e=stored?w.echoes:echoDefault(),study=source.study,cardId=x=>study.cards.some(c=>c.id===x),side=x=>x===null||cardId(x),link=row=>fields(row,['left','right','lens'])&&id(row.left)&&id(row.right)&&row.left!==row.right&&cardId(row.left)&&cardId(row.right)&&echoLens(row.lens);
  const rows=object(e)&&own(e,'links')&&Array.isArray(e.links)?Array.from(e.links,(raw,index)=>({index,raw,readable:link(raw)})):[];
  const preview=object(e)?{left:own(e,'left')&&side(e.left)?e.left:null,right:own(e,'right')&&side(e.right)?e.right:null,lens:own(e,'lens')&&echoLens(e.lens)?e.lens:null}:null;
  const max=3*study.cards.length*(study.cards.length-1)/2;
  const valid=fields(e,['v','left','right','lens','links','referenceShown','teachingSeen'])&&e.v===1&&side(e.left)&&side(e.right)&&(e.lens===null||echoLens(e.lens))&&dense(e.links,0,max,link)&&unique(e.links.map(r=>JSON.stringify([[r.left,r.right].sort(),r.lens])))&&typeof e.referenceShown==='boolean'&&Number.isSafeInteger(e.teachingSeen)&&e.teachingSeen>=0&&e.teachingSeen<=study.demo.steps.length;
  return valid?{status:'ready',echoes:e,stored,rows,preview}:unavailable(stored,e,rows,preview);
 }catch{return unavailable(!!w&&object(w)&&own(w,'echoes'));}
}
export function changeThreadEcho(s,w,action,value){
 try{
  const view=readThreadEchoWork(s,w),source=readThreadEchoStudy(s);if(view.status!=='ready'||source.status!=='ready')return null;
  const next=structuredClone(w),e=structuredClone(view.echoes),study=source.study,cardId=x=>study.cards.some(c=>c.id===x);
  if(action==='setleft'||action==='setright'){if(value!==null&&!cardId(value))return null;e[action==='setleft'?'left':'right']=value;}
  else if(action==='lens'){if(value!==null&&!echoLens(value))return null;e.lens=value;}
  else if(action==='connect'){
   if(e.left===null||e.right===null||e.left===e.right||!echoLens(e.lens)||findThreadEchoLink(e,e.left,e.right,e.lens)>=0)return null;
   e.links.push({left:e.left,right:e.right,lens:e.lens});
  }else if(action==='focus'||action==='remove'){
   if(!fields(value,['left','right','lens']))return null;const at=findThreadEchoLink(e,value.left,value.right,value.lens);if(at<0)return null;
   if(action==='focus'){const row=e.links[at];e.left=row.left;e.right=row.right;e.lens=row.lens;}else e.links.splice(at,1);
  }else if(action==='reference')e.referenceShown=true;
  else if(action==='teaching')e.teachingSeen=Math.min(study.demo.steps.length,e.teachingSeen+1);
  else return null;
  next.echoes=e;return next;
 }catch{return null;}
}

const sheetNumber=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^thread-reading-[1-9][0-9]{0,5}$/.test(r.id)?Number(r.id.slice(15)):null;
export function threadSheetsView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'threadReadings'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(book.threadReadings))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of book.threadReadings){const n=sheetNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
 const items=Array.from(book.threadReadings,(raw,index)=>{const n=sheetNumber(raw);return {id:n===null?null:raw.id,index,raw,readable:n!==null&&counts.get(n)===1&&fields(raw,['source','work'])&&validThreadWork(raw.source,raw.work)};});
 return {status:'ready',items,canKeep:max<999999};
}
export function lastThreadReading(book){return threadSheetsView(book).items.filter(r=>r.readable).at(-1)??null;}
export function keepThreadReading(book,source,work,options={}){
 try{
  if(!validThreadWork(source,work)||typeof options?.canExport!=='function')return false;
  const view=threadSheetsView(book);if(!view.canKeep)return false;
  const n=view.items.reduce((max,r)=>Math.max(max,sheetNumber(r.raw)??0),0)+1,id=`thread-reading-${n}`;
  const candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.threadReadings;
  records.push({id,source:structuredClone(source),work:structuredClone(work)});candidate.threadReadings=records;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=structuredClone(records);
  if(options.canExport(candidate)!==true)return false;
  book.threadReadings=proposal;return id;
 }catch{return false;}
}
