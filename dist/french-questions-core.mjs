// Own-source conversations and immutable kept versions. Only Keep writes a notebook.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,keys)=>object(x)&&keys.every(k=>own(x,k));
const text=(x,max=1500)=>typeof x==='string'&&x.trim().length>0&&Array.from(x).length<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>text(x,80)&&!reserved.has(x);
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const dense=(xs,min,max,test)=>Array.isArray(xs)&&xs.length>=min&&xs.length<=max&&Array.from({length:xs.length},(_,i)=>own(xs,i)&&test(xs[i])).every(Boolean);
const phrase=x=>fields(x,['fr','en'])&&text(x.fr)&&text(x.en);
const question=x=>fields(x,['id','fr','en','reply'])&&id(x.id)&&text(x.fr)&&text(x.en)&&phrase(x.reply);
const parcel=x=>fields(x,['id','colour','room'])&&id(x.id)&&phrase(x.colour)&&phrase(x.room);
export function validQuestionSource(s){
 try{return fields(s,['v','id','title','titleMeaning','note','example','questions','parcels','targetId'])&&s.v===1&&id(s.id)&&text(s.title)&&text(s.titleMeaning)&&phrase(s.note)&&phrase(s.example)&&dense(s.questions,2,6,question)&&new Set(s.questions.map(q=>q.id)).size===s.questions.length&&dense(s.parcels,2,8,parcel)&&new Set(s.parcels.map(p=>p.id)).size===s.parcels.length&&id(s.targetId)&&s.parcels.some(p=>p.id===s.targetId);}catch{return false;}
}
export function validQuestionWork(s,w){
 try{return validQuestionSource(s)&&fields(w,['v','asked','selected','meaningShown','compared','speechRequests'])&&w.v===1&&dense(w.asked,0,32,k=>s.questions.some(q=>q.id===k))&&(w.selected===null||s.parcels.some(p=>p.id===w.selected))&&typeof w.meaningShown==='boolean'&&typeof w.compared==='boolean'&&integer(w.speechRequests,0,99);}catch{return false;}
}
export function newQuestionWork(s){return validQuestionSource(s)?{v:1,asked:[],selected:null,meaningShown:false,compared:false,speechRequests:0}:null;}
export function changeQuestionWork(s,w,action,value){
 try{
  if(!validQuestionWork(s,w))return null;
  const next=structuredClone(w);
  if(action==='ask'){if(next.asked.length>=32||!s.questions.some(q=>q.id===value))return null;next.asked.push(value);}
  else if(action==='select')next.selected=value;
  else if(action==='meaning')next.meaningShown=true;
  else if(action==='compare'){if(next.selected===null)return null;next.compared=true;}
  else if(action==='speech')next.speechRequests=Math.min(99,next.speechRequests+1);
  else return null;
  return validQuestionWork(s,next)?next:null;
 }catch{return null;}
}
export function compareQuestion(s,w){
 if(!validQuestionWork(s,w))return null;
 const target=s.parcels.find(p=>p.id===s.targetId),selected=w.selected===null?null:s.parcels.find(p=>p.id===w.selected);
 return {selected,target,matches:selected===null?null:selected.colour.fr===target.colour.fr&&selected.room.fr===target.room.fr};
}
const sheetNumber=x=>object(x)&&own(x,'id')&&integer(x.id,1,Number.MAX_SAFE_INTEGER)?x.id:null;
export function questionSheetsView(book){
 if(!object(book))return {status:'unavailable',items:[],canKeep:false};
 if(!own(book,'frenchQuestionSheets'))return {status:'absent',items:[],canKeep:true};
 const root=book.frenchQuestionSheets;
 if(!fields(root,['v','items'])||root.v!==1||!Array.isArray(root.items))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of root.items){const number=sheetNumber(raw);if(number!==null){max=Math.max(max,number);counts.set(number,(counts.get(number)||0)+1);}}
 const items=Array.from(root.items,(raw,index)=>{const number=sheetNumber(raw);return {id:number,index,raw,readable:number!==null&&counts.get(number)===1&&fields(raw,['v','source','work'])&&raw.v===1&&validQuestionWork(raw.source,raw.work)};});
 return {status:'ready',items,canKeep:own(root,'next')&&integer(root.next,1,Number.MAX_SAFE_INTEGER-1)&&root.next>max};
}
export function keepQuestionSheet(book,source,work,options={}){
 try{
  if(!validQuestionWork(source,work)||typeof options?.canExport!=='function')return false;
  const view=questionSheetsView(book);if(!view.canKeep)return false;
  const candidate=structuredClone(book),root=view.status==='absent'?{v:1,next:1,items:[]}:candidate.frenchQuestionSheets,id=root.next;
  root.items.push({v:1,id,source:structuredClone(source),work:structuredClone(work)});root.next=id+1;candidate.frenchQuestionSheets=root;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=structuredClone(root);
  if(options.canExport(candidate)!==true)return false;
  book.frenchQuestionSheets=proposal;return id;
 }catch{return false;}
}
