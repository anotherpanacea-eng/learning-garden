import {taskSource,writingTasks} from './writing-table-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.hasOwn(x,k),clone=x=>structuredClone(x);
const placed=(w,k)=>own(w.placements,k)?w.placements[k]:null;
const id=x=>typeof x==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(x);
const text=x=>typeof x==='string'&&Array.from(x).length<=4000;
const integer=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const ids=xs=>Array.isArray(xs)&&xs.length<=12&&xs.every(id)&&new Set(xs).size===xs.length;
const parts=(xs,max=12)=>Array.isArray(xs)&&xs.length>0&&xs.length<=max&&xs.every(x=>object(x)&&id(x.id)&&text(x.text))&&new Set(xs.map(x=>x.id)).size===xs.length;
const lines=xs=>Array.isArray(xs)&&xs.length<=12&&xs.every(text);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function validWritingSource(s){
 if(!object(s)||s.v!==1||!id(s.id)||!id(s.family)||!['sort','order','break','choice','tap'].includes(s.kind)||!['title','reader','prompt','hint','example'].every(k=>text(s[k]))||!lines(s.teach)||!parts(s.parts,s.kind==='tap'?32:12)||!Array.isArray(s.choices)||s.choices.length>12||s.choices.length&&!parts(s.choices))return false;
 if(['after','changes'].some(k=>own(s,k)&&!text(s[k]))||own(s,'steps')&&(!lines(s.steps)||s.steps.length>3))return false;
 if(!object(s.feedback)||!text(s.feedback.fit)||!text(s.feedback.general)||!object(s.feedback.different)||Object.values(s.feedback.different).some(x=>!text(x)))return false;
 const p=s.parts.map(x=>x.id),c=s.choices.map(x=>x.id);
 if(s.kind==='choice'&&own(s,'preview')&&(own(s,'after')||!object(s.preview)||Object.keys(s.preview).length!==c.length||!c.every(k=>own(s.preview,k)&&text(s.preview[k]))))return false;
 if(s.kind==='tap'){const taps=s.parts.filter(p=>p.tap===true).map(p=>p.id);return taps.length>0&&taps.length<=12&&ids(s.key)&&s.key.length>0&&s.key.every(k=>taps.includes(k))&&text(s.feedback.missing);}
 if(s.kind==='sort')return c.length>0&&object(s.key)&&p.every(k=>own(s.key,k)&&c.includes(s.key[k]));
 if(s.kind==='order')return ids(s.key)&&s.key.length===p.length&&s.key.every(k=>p.includes(k));
 return typeof s.key==='string'&&(s.kind==='break'?p.slice(1):c).includes(s.key);
}
// Optional Red Pencil display hints never change ordinary source/work readability.
const plain=x=>object(x)&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const revisionPacket=s=>object(s)&&own(s,'bench')&&s.bench==='revision'&&own(s,'redPencil')&&plain(s.redPencil)&&own(s.redPencil,'v')&&s.redPencil.v===1?s.redPencil:null;
export function writingNoticePreview(s,w){
 try{
  const packet=revisionPacket(s);
  if(!packet||s.kind!=='sort'||!validWritingWork(s,w)||!own(packet,'keepId')||!own(packet,'asideId')||!id(packet.keepId)||!id(packet.asideId)||packet.keepId===packet.asideId)return null;
  const keep=s.choices.find(h=>h.id===packet.keepId),aside=s.choices.find(h=>h.id===packet.asideId);if(!keep||!aside)return null;
  const group=h=>({id:h.id,text:h.text,parts:s.parts.filter(p=>placed(w,p.id)===h.id)});
  return {keep:group(keep),aside:group(aside),waiting:s.parts.filter(p=>!placed(w,p.id)),other:s.choices.filter(h=>h.id!==keep.id&&h.id!==aside.id).map(group)};
 }catch{return null;}
}
export function writingOtherReader(state,s){
 const absent={status:'absent'};
 try{
  const packet=revisionPacket(s),link=packet&&own(packet,'otherReader')&&packet.otherReader;
  if(!plain(link)||!own(link,'taskId')||!own(link,'label')||!id(link.taskId)||typeof link.label!=='string'||!link.label.trim()||Array.from(link.label).length>160)return absent;
  const target={taskId:link.taskId,label:link.label},view=writingView(state);
  if(view.status==='unsupported')return {status:'unavailable',...target};
  const records=state?.writingDesk?.records;
  if(object(records)&&own(records,link.taskId))return {status:validWritingRecord(records[link.taskId])?'ready':'unavailable',...target};
  return writingTasks.some(t=>t.id===link.taskId)?{status:'ready',...target}:absent;
 }catch{return absent;}
}
export function writingRevisionDestinationLabel(s,headingId){
 try{
  const heading=s?.choices?.find(h=>h.id===headingId);if(!heading)return null;
  const packet=revisionPacket(s),labels=packet&&own(packet,'destinationLabels')&&packet.destinationLabels,label=plain(labels)&&own(labels,headingId)?labels[headingId]:null;
  return typeof label==='string'&&label.trim()&&Array.from(label).length<=160?label:`Choose: ${heading.text}`;
 }catch{return null;}
}

// Optional source-local references are derived without changing the frozen raw source.
const dense=(xs,min,max)=>Array.isArray(xs)&&xs.length>=min&&xs.length<=max&&Array.from({length:xs.length},(_,i)=>own(xs,i)).every(Boolean);
const display=(x,max)=>typeof x==='string'&&x.trim().length>0&&Array.from(x).length<=max;
const researchPacket=s=>object(s)&&own(s,'research')&&object(s.research)&&own(s.research,'v')&&s.research.v===1&&Array.isArray(s.research.cards)&&s.research.cards.length>=1&&s.research.cards.length<=6?s.research:null;
export function writingResearchCards(s){
 const r=researchPacket(s);if(!r)return [];
 return r.cards.filter(c=>object(c)&&['id','title','origin','notice','lines'].every(k=>own(c,k))&&id(c.id)&&r.cards.filter(x=>object(x)&&x.id===c.id).length===1&&display(c.title,160)&&display(c.origin,1000)&&display(c.notice,1000)&&dense(c.lines,1,8)&&c.lines.every(l=>object(l)&&own(l,'id')&&own(l,'text')&&id(l.id)&&display(l.text,4000))&&new Set(c.lines.map(l=>l.id)).size===c.lines.length);
}
export function writingReferences(s,noteId){
 const none={status:'none',refs:[]},unavailable={status:'unavailable',refs:[]};
 if(!object(s)||!own(s,'research'))return none;
 const r=researchPacket(s);if(!r)return unavailable;
 if(!own(r,'links'))return none;
 if(!object(r.links)||Object.keys(r.links).length>44)return unavailable;
 if(!own(r.links,noteId))return none;
 const links=r.links[noteId];if(!dense(links,1,3))return unavailable;
 const cards=writingResearchCards(s),refs=[];
 for(const link of links){
  if(!object(link)||!own(link,'cardId')||!own(link,'lineIds')||!id(link.cardId)||!dense(link.lineIds,1,8)||!link.lineIds.every(id)||new Set(link.lineIds).size!==link.lineIds.length)return unavailable;
  const card=cards.find(c=>c.id===link.cardId);
  if(!card||link.lineIds.some(k=>!card.lines.some(l=>l.id===k))||refs.some(x=>x.card.id===card.id))return unavailable;
  refs.push({card,lineIds:[...link.lineIds],lineNumbers:link.lineIds.map(k=>card.lines.findIndex(l=>l.id===k)+1)});
 }
 return {status:'ready',refs};
}
// Roles only label supplied strips. Missing/future metadata cannot close an ordinary draft.
export function writingQuoteRole(s,partId){
 try{
  if(!object(s)||!own(s,'bench')||s.bench!=='point-quote'||s.kind!=='order'||!Array.isArray(s.parts))return null;
  const part=s.parts.find(p=>object(p)&&p.id===partId);
  return part&&own(part,'role')&&['point','quote','explanation'].includes(part.role)?part.role:null;
 }catch{return null;}
}
export function writingQuoteReturn(state){
 try{
  const view=writingView(state);
  if(!view.record||state.writingDesk.currentId==='quote-build'||!own(state.writingDesk.records,'quote-build'))return null;
  const r=state.writingDesk.records['quote-build'];
  if(!validWritingRecord(r)||!own(r.source,'bench')||r.source.bench!=='point-quote'||r.source.kind!=='order')return null;
  const linked=['firstKept','latestKept'].some(k=>own(r,k)&&validWritingSnapshot(r.source,r[k])&&r[k].work.order.some(partId=>writingReferences(r.source,partId).status==='ready'));
  return linked?{id:'quote-build',title:r.source.title,reader:r.source.reader}:null;
 }catch{return null;}
}
export function validWritingWork(s,w){
 if(!validWritingSource(s)||!object(w))return false;
 const p=s.parts.map(x=>x.id);
 if(s.kind==='tap')return ids(w.taps)&&w.taps.every(k=>s.parts.some(p=>p.id===k&&p.tap===true));
 if(s.kind==='sort')return object(w.placements)&&Object.entries(w.placements).every(([k,v])=>p.includes(k)&&(v===null||s.choices.some(x=>x.id===v)));
 if(s.kind==='order')return ids(w.order)&&w.order.length===p.length&&w.order.every(k=>p.includes(k));
 return s.kind==='break'?(w.boundary===null||p.slice(1).includes(w.boundary)):(w.choice===null||s.choices.some(x=>x.id===w.choice));
}
const help=h=>object(h)&&['hint','example','narration','together'].every(k=>typeof h[k]==='boolean');
const validCheck=(s,c)=>object(c)&&validWritingWork(s,c.work)&&help(c.help)&&['fit','different','incomplete'].includes(c.outcome)&&c.supported===true&&c.guided===true&&Array.isArray(c.feedback)&&c.feedback.length<=14&&c.feedback.every(x=>typeof x==='string'&&Array.from(x).length<=16000);
export const validWritingRecord=r=>object(r)&&validWritingSource(r.source)&&validWritingWork(r.source,r.work)&&help(r.help)&&Array.isArray(r.checks)&&r.checks.length<=24&&r.checks.every(c=>validCheck(r.source,c))&&integer(r.count,r.checks.length,1000000);
export const validWritingSnapshot=(s,k)=>object(k)&&validWritingWork(s,k.work)&&help(k.help)&&(k.check===null||validCheck(s,k.check)&&sameWritingWork(k.work,k.check.work));
const rootShape=r=>object(r)&&r.v===1&&object(r.records)&&Object.keys(r.records).length<=64&&typeof r.currentId==='string';
export function writingView(state){
 const r=state?.writingDesk;
 if(!state||!own(state,'writingDesk'))return {status:'new',record:null,records:[],familiar:false};
 if(!rootShape(r))return {status:'unsupported',record:null,records:[],familiar:false};
 const records=Object.entries(r.records).map(([key,value])=>({id:key,readable:id(key)&&validWritingRecord(value),title:validWritingRecord(value)?value.source.title:null}));
 const record=id(r.currentId)&&own(r.records,r.currentId)&&validWritingRecord(r.records[r.currentId])?r.records[r.currentId]:null;
 const familiar=!!record&&Object.entries(r.records).some(([key,x])=>key!==r.currentId&&validWritingRecord(x)&&x.source.family===record.source.family);
 return {status:'ready',record,records,familiar};
}
function initialWork(s){
 return s.kind==='tap'?{taps:[]}:s.kind==='sort'?{placements:Object.fromEntries(s.parts.map(x=>[x.id,null]))}:s.kind==='order'?{order:s.parts.map(x=>x.id)}:s.kind==='break'?{boundary:null}:{choice:null};
}
const fail=error=>({ok:false,error});
function change(state,mutate,options={}){
 try{
  const next=clone(state),result=mutate(next);if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(next)||options.canExport&&!options.canExport(next))return fail('unexportable');
  state.writingDesk=next.writingDesk;return result;
 }catch{return fail('unexportable');}
}
function edit(state,mutate,options){return change(state,next=>{const r=writingView(next).record;if(!r)return fail('unavailable');const result=mutate(r);return !result.ok||validWritingRecord(r)?result:fail('unavailable');},options);}
export function openWritingTask(state,taskId,options){return change(state,next=>{
 if(!id(taskId))return fail('selection');
 if(!own(next,'writingDesk'))next.writingDesk={v:1,currentId:'',records:{}};
 const r=next.writingDesk;if(!rootShape(r))return fail('unavailable');
 if(own(r.records,taskId)){
  if(!validWritingRecord(r.records[taskId]))return fail('unavailable');
  if(r.currentId===taskId)return {ok:true,changed:false};
 }else{
  if(Object.keys(r.records).length>=64)return fail('full');
  const source=taskSource(taskId);if(!validWritingSource(source))return fail('selection');
  r.records[taskId]={source,work:initialWork(source),help:{hint:false,example:false,narration:false,together:false},checks:[],count:0};
 }
 r.currentId=taskId;return {ok:true};
 },options);}
export function nextWritingTask(state,options){const at=writingTasks.findIndex(x=>x.id===state?.writingDesk?.currentId);return openWritingTask(state,writingTasks[(at+1)%writingTasks.length].id,options);}
export function setWritingMaterial(state,action,options){return edit(state,r=>{
 const s=r.source,w=r.work;if(!object(action))return fail('material');
 if(s.kind==='tap'){
  if(action.clear===true){if(!w.taps.length)return {ok:true,changed:false};w.taps=[];}
  else{if(!s.parts.some(p=>p.id===action.tap&&p.tap===true))return fail('material');const at=w.taps.indexOf(action.tap);if(at<0)w.taps.push(action.tap);else w.taps.splice(at,1);}
 }else if(s.kind==='sort'){
  if(!s.parts.some(x=>x.id===action.strip)||action.heading!==null&&!s.choices.some(x=>x.id===action.heading))return fail('material');
  if(placed(w,action.strip)===action.heading)return {ok:true,changed:false};
  w.placements[action.strip]=action.heading;
 }else if(s.kind==='order'){
  const at=w.order.indexOf(action.part),to=at+action.direction;
  if(at<0||![-1,1].includes(action.direction)||to<0||to>=w.order.length)return fail('material');
  [w.order[at],w.order[to]]=[w.order[to],w.order[at]];
 }else if(s.kind==='break'){
  if(action.boundary!==null&&!s.parts.slice(1).some(x=>x.id===action.boundary))return fail('material');
  if(w.boundary===action.boundary)return {ok:true,changed:false};w.boundary=action.boundary;
 }else{
  if(action.choice!==null&&!s.choices.some(x=>x.id===action.choice))return fail('material');
  if(w.choice===action.choice)return {ok:true,changed:false};w.choice=action.choice;
 }
 return {ok:true};
 },options);}
export function showWritingHelp(state,kind,options){return edit(state,r=>{
 if(!['hint','example','narration','together'].includes(kind))return fail('selection');
 if(r.help[kind])return {ok:true,changed:false};r.help[kind]=true;return {ok:true};
 },options);}
export function writingResult(s,w){
 if(!validWritingWork(s,w))return null;
 let outcome='different',feedback=[];
 if(s.kind==='tap'){
  outcome=!w.taps.length?'incomplete':w.taps.length===s.key.length&&s.key.every(k=>w.taps.includes(k))?'fit':'different';
  for(const part of s.parts)if(w.taps.includes(part.id)&&!s.key.includes(part.id)&&own(s.feedback.different,part.id))feedback.push(s.feedback.different[part.id]);
  if(s.key.some(k=>!w.taps.includes(k)))feedback.push(s.feedback.missing);
 }else if(s.kind==='sort'){
  const pending=s.parts.filter(x=>!placed(w,x.id));
  outcome=pending.length?'incomplete':s.parts.every(x=>placed(w,x.id)===s.key[x.id])?'fit':'different';
  for(const part of s.parts){const selected=placed(w,part.id);if(selected&&selected!==s.key[part.id])feedback.push(['research','revision'].includes(s.bench)?`${part.text} ${own(s.feedback.different,part.id)?s.feedback.different[part.id]:`Under ${s.choices.find(x=>x.id===selected).text}; compare with ${s.choices.find(x=>x.id===s.key[part.id]).text}.`}`:`${part.text} Under ${s.choices.find(x=>x.id===selected).text}; this sentence is about ${s.choices.find(x=>x.id===s.key[part.id]).text}.`);}
 }else if(s.kind==='order')outcome=same(w.order,s.key)?'fit':'different';
 else{const picked=s.kind==='break'?w.boundary:w.choice;outcome=picked===null?'incomplete':picked===s.key?'fit':'different';if(outcome==='different'&&own(s.feedback.different,picked))feedback.push(s.feedback.different[picked]);}
 if(outcome==='fit')feedback.unshift(s.feedback.fit);
 else if(outcome==='incomplete')feedback.unshift(s.kind==='tap'?(s.bench==='research'?'No source cards are selected yet. You can keep this version or select some cards.':'No words are tapped yet. You can keep this version or tap some words.'):'Some parts are still waiting. You can keep this version or keep arranging.');
 else{feedback.push(s.feedback.general);if(s.feedback.general!=='Your draft is still here. You can change it.')feedback.push('Your draft is still here. You can change it.');}
 if(s.bench==='holding'&&feedback.at(-1)!=='Your draft is still here. You can change it.')feedback.push('Your draft is still here. You can change it.');
 return {outcome,feedback};
}
export function checkWritingTask(state,options){return edit(state,r=>{
 const result=writingResult(r.source,r.work),c={work:clone(r.work),help:clone(r.help),...result,supported:true,guided:true};
 r.checks.push(c);if(r.checks.length>24)r.checks.splice(1,r.checks.length-24);r.count=Math.min(1000000,r.count+1);return {ok:true,check:clone(c)};
 },options);}
export function keepWritingTask(state,options){return edit(state,r=>{
 if(['firstKept','latestKept'].some(k=>own(r,k)&&!validWritingSnapshot(r.source,r[k])))return fail('kept-unavailable');
 const last=r.checks.at(-1),snapshot={work:clone(r.work),help:clone(r.help),check:last&&sameWritingWork(last.work,r.work)?clone(last):null};
 if(!own(r,'firstKept'))r.firstKept=clone(snapshot);
 r.latestKept={...(r.latestKept?clone(r.latestKept):{}),...snapshot};return {ok:true};
 },options);}
export function sameWritingWork(a,b){
 if(!object(a)||!object(b))return false;
 if(own(a,'taps')||own(b,'taps'))return Array.isArray(a.taps)&&Array.isArray(b.taps)&&same([...a.taps].sort(),[...b.taps].sort());
 if(own(a,'placements')||own(b,'placements'))return object(a.placements)&&object(b.placements)&&[...new Set([...Object.keys(a.placements),...Object.keys(b.placements)])].every(k=>placed(a,k)===placed(b,k));
 if(own(a,'order')||own(b,'order'))return Array.isArray(a.order)&&Array.isArray(b.order)&&same(a.order,b.order);
 if(own(a,'boundary')||own(b,'boundary'))return own(a,'boundary')&&own(b,'boundary')&&a.boundary===b.boundary;
 return own(a,'choice')&&own(b,'choice')&&a.choice===b.choice;
}
// No grading in previews: this always describes the exact supplied arrangement, including mistakes.
export function writingPreview(s,w){
 if(!validWritingWork(s,w))return [];
 if(s.bench==='point-quote'&&s.kind==='order')return [{heading:'Your paragraph',text:w.order.map(k=>s.parts.find(p=>p.id===k).text).join(' '),noteIds:[...w.order]}];
 if(s.bench==='point-quote'&&s.kind==='choice'&&!own(s,'preview')&&!s.after)return [{heading:'Your choice',text:s.choices.find(c=>c.id===w.choice)?.text||'No choice yet',noteIds:w.choice===null?[]:[w.choice]}];
 if(s.kind==='tap'&&s.bench==='research')return [{heading:'Selected source cards',text:s.parts.filter(p=>w.taps.includes(p.id)).map(p=>p.text).join('\n\n')||'No source cards are selected yet.',noteIds:s.parts.filter(p=>w.taps.includes(p.id)).map(p=>p.id)}];
 if(s.kind==='tap')return [{heading:'Text to read',text:s.parts.map(p=>p.text).join('')},{heading:'Tapped words',text:s.parts.filter(p=>w.taps.includes(p.id)).map(p=>p.text).join(', ')||'No words tapped yet.'}];
 if(s.kind==='choice'&&own(s,'preview'))return [{heading:'Text to read',text:w.choice===null?s.parts.map(p=>p.text).join(' '):s.preview[w.choice],...(['research','point-quote'].includes(s.bench)?{noteIds:w.choice===null?[]:[w.choice]}:{})}];
 if(s.kind==='sort'){const block=(heading,ps)=>({heading,text:ps.map(p=>p.text).join(' '),...(s.bench==='research'?{noteIds:ps.map(p=>p.id)}:{})});return [...s.choices.map(h=>block(h.text,s.parts.filter(p=>placed(w,p.id)===h.id))),block(s.bench==='research'?'Waiting notes':'Waiting strips',s.parts.filter(p=>!placed(w,p.id)))];}
 if(s.kind==='order')return w.order.map(k=>({heading:'',text:s.parts.find(p=>p.id===k).text}));
 if(s.kind==='break'){
  const at=w.boundary===null?-1:s.parts.findIndex(p=>p.id===w.boundary);
  return (at<0?[s.parts]:[s.parts.slice(0,at),s.parts.slice(at)]).map(ps=>({heading:'',text:ps.map(p=>p.text).join(' ')}));
 }
 if(s.after){const opener=s.choices.find(c=>c.id===w.choice)?.text;return [{heading:'First paragraph',text:s.parts.map(p=>p.text).join(' '),...(s.bench==='point-quote'?{noteIds:s.parts.map(p=>p.id)}:{})},{heading:'Next paragraph',text:opener?`${opener} ${s.after}`:`[Choose an opener] ${s.after}`,...(s.bench==='point-quote'?{noteIds:w.choice===null?[]:[w.choice]}:{})}];}
 return [{heading:'Text to read',text:s.parts.map(p=>p.text).join(' ')},{heading:'Your choice',text:s.choices.find(c=>c.id===w.choice)?.text||'No choice yet',...(s.bench==='research'?{noteIds:w.choice===null?[]:[w.choice]}:{})}];
}
