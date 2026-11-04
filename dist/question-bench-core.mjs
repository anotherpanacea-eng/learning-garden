// Visit-local inquiry plans; only explicit Keep appends to the notebook.
import {questionSource,questionCases} from './question-bench-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export {questionSource,questionCases};
const own=(x,key)=>Object.hasOwn(x,key);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,keys)=>object(x)&&keys.every(key=>own(x,key));
const clone=structuredClone;
export const questionLength=text=>typeof text==='string'?[...text].length:0;
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&questionLength(x)<=max;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>typeof x==='string'&&/^[\x21-\x7e]{1,80}$/.test(x)&&!reserved.has(x);
const list=(x,min,max)=>Array.isArray(x)&&x.length>=min&&x.length<=max&&Array.from({length:x.length},(_,i)=>own(x,i)).every(Boolean);
const named=x=>fields(x,['id','label'])&&id(x.id)&&text(x.label,160);
const unique=x=>new Set(x).size===x.length;
function sourceValid(s){
 if(!fields(s,['v','model','id','title','wonder','origin','notice','methodNotice','focusLabel','contextLabel','focus','contexts','questions','ways','teaching','glossary'])||s.v!==1||s.model!=='question-bench-v1'||!id(s.id))return false;
 if(!['title','focusLabel','contextLabel'].every(k=>text(s[k],160))||!['wonder','origin','notice','methodNotice'].every(k=>text(s[k],1000)))return false;
 if(![s.focus,s.contexts].every(xs=>list(xs,1,4)&&xs.every(named)&&unique(xs.map(x=>x.id))))return false;
 if(!list(s.questions,s.focus.length*s.contexts.length,s.focus.length*s.contexts.length))return false;
 const pairs=new Set();
 for(const q of s.questions){
  if(!fields(q,['focusId','contextId','text'])||!s.focus.some(f=>f.id===q.focusId)||!s.contexts.some(c=>c.id===q.contextId)||!text(q.text,1000))return false;
  const pair=JSON.stringify([q.focusId,q.contextId]);if(pairs.has(pair))return false;pairs.add(pair);
 }
 if(!list(s.ways,1,6)||!s.ways.every(w=>named(w)&&fields(w,['icon','can','limit'])&&['watch','compare','research','ask','card'].includes(w.icon)&&text(w.can,1000)&&text(w.limit,1000))||!unique(s.ways.map(w=>w.id)))return false;
 return list(s.teaching,1,5)&&s.teaching.every(t=>text(t,1000))&&list(s.glossary,1,6)&&s.glossary.every(g=>fields(g,['term','meaning'])&&text(g.term,80)&&text(g.meaning,1000));
}
export function validQuestionSource(source){try{return sourceValid(source);}catch{return false;}}
export function validQuestionWork(source,work){
 try{
  return validQuestionSource(source)&&fields(work,['v','wording','focusId','contextId','wayIds','customQuestion','exampleSeen','reflectionShown'])&&work.v===1&&['pieces','own'].includes(work.wording)&&
   (work.focusId===null||source.focus.some(f=>f.id===work.focusId))&&(work.contextId===null||source.contexts.some(c=>c.id===work.contextId))&&
   list(work.wayIds,0,source.ways.length)&&unique(work.wayIds)&&work.wayIds.every(w=>source.ways.some(x=>x.id===w))&&typeof work.customQuestion==='string'&&questionLength(work.customQuestion)<=600&&
   Number.isInteger(work.exampleSeen)&&work.exampleSeen>=0&&work.exampleSeen<=source.teaching.length&&typeof work.reflectionShown==='boolean';
 }catch{return false;}
}
export function newQuestionWork(source){return validQuestionSource(source)?{v:1,wording:'pieces',focusId:null,contextId:null,wayIds:[],customQuestion:'',exampleSeen:0,reflectionShown:false}:null;}
export function questionText(source,work){
 if(!validQuestionWork(source,work))return null;
 if(work.wording==='own')return work.customQuestion;
 return source.questions.find(q=>q.focusId===work.focusId&&q.contextId===work.contextId)?.text??null;
}
export function changeQuestionWork(source,work,action,value){
 if(!validQuestionWork(source,work))return null;
 try{
  const next=clone(work);
  switch(action){
   case 'wording':next.wording=value;break;
   case 'focus':next.focusId=value;break;
   case 'context':next.contextId=value;break;
   case 'way':if(!source.ways.some(w=>w.id===value))return null;next.wayIds=next.wayIds.includes(value)?next.wayIds.filter(w=>w!==value):[...next.wayIds,value];break;
   case 'question':next.customQuestion=value;break;
   case 'example':next.exampleSeen=Math.min(source.teaching.length,next.exampleSeen+1);break;
   case 'reflection':next.reflectionShown=!next.reflectionShown;break;
   default:return null;
  }
  return validQuestionWork(source,next)?next:null;
 }catch{return null;}
}
const cardNumber=raw=>object(raw)&&own(raw,'id')&&typeof raw.id==='string'&&/^question-card-[1-9][0-9]{0,5}$/.test(raw.id)?Number(raw.id.slice(14)):null;
export function questionCardsView(state){
 if(!object(state))return {status:'unavailable',items:[],canKeep:false};
 if(!own(state,'questionCards'))return {status:'absent',items:[],canKeep:true};
 if(!Array.isArray(state.questionCards))return {status:'unavailable',items:[],canKeep:false};
 const counts=new Map();let max=0;
 for(const raw of state.questionCards){const n=cardNumber(raw);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
 const items=Array.from(state.questionCards,(raw,index)=>{
  const n=cardNumber(raw),readable=n!==null&&counts.get(n)===1&&fields(raw,['source','work'])&&validQuestionWork(raw.source,raw.work);
  return {raw,index,id:n===null?null:raw.id,readable};
 });
 return {status:'ready',items,canKeep:max<999999};
}
export const lastQuestionCard=state=>questionCardsView(state).items.findLast(item=>item.readable)??null;
export function keepQuestionCard(state,source,work,options={}){
 if(!validQuestionWork(source,work)||typeof options?.canExport!=='function')return false;
 const view=questionCardsView(state);if(!view.canKeep)return false;
 try{
  const max=view.items.reduce((n,item)=>Math.max(n,cardNumber(item.raw)??0),0),newId=`question-card-${max+1}`;
  const candidate=clone(state),cards=view.status==='absent'?[]:candidate.questionCards;
  cards.push({id:newId,source:clone(source),work:clone(work)});candidate.questionCards=cards;
  if(!recoveryFitsProgressLimits(candidate))return false;
  // The export probe is disposable: it cannot modify the committed proposal.
  const proposal=clone(cards);
  if(options.canExport(candidate)!==true)return false;
  state.questionCards=proposal;return newId;
 }catch{return false;}
}
