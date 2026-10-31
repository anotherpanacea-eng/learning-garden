import {marketSignsCollection,marketSignsCopy as T,marketEndingCollection} from './market-signs-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(o,k)=>Object.hasOwn(o,k),copy=structuredClone;
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const id=x=>typeof x==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(x);
const text=x=>typeof x==='string'&&[...x].length<=4000;
const texts=(a,max=16)=>Array.isArray(a)&&a.length<=max&&a.every(text);
const rows=(a,max=16)=>Array.isArray(a)&&a.length<=max&&a.every(x=>object(x)&&id(x.id)&&text(x.text))&&new Set(a.map(x=>x.id)).size===a.length;
const ids=a=>Array.isArray(a)&&a.every(id)&&new Set(a).size===a.length;
const help=x=>object(x)&&typeof x.hint==='boolean'&&typeof x.example==='boolean';
const card=x=>object(x)&&id(x.id)&&['title','text','example'].every(k=>text(x[k]))&&texts(x.steps,4);
export const readableMarketCards=a=>Array.isArray(a)&&a.length<=16?a.filter(card):[];
export function validMarketPrefix(s){
 if(!object(s)||!rows(s.prefixes,16)||!rows(s.parts,64)||!s.prefixes.every(p=>text(p.label)&&text(p.meaning))||!Array.isArray(s.joins)||s.joins.length>256)return false;
 const p=s.prefixes.map(x=>x.id),b=s.parts.map(x=>x.id),seen=new Set(),pairs=new Set();
 return s.joins.every(j=>{if(!object(j)||!id(j.id)||seen.has(j.id)||!p.includes(j.prefixId)||!b.includes(j.partId)||!text(j.meaning))return false;const pair=JSON.stringify([j.prefixId,j.partId]);if(pairs.has(pair))return false;seen.add(j.id);pairs.add(pair);return true;});
}
export function marketBook(s){
 if(!object(s)||!Array.isArray(s.pages)||s.pages.length>16)return null;
 const pageCounts=new Map(),entryCounts=new Map();
 for(const p of s.pages){if(!object(p))continue;if(id(p.id))pageCounts.set(p.id,(pageCounts.get(p.id)||0)+1);if(Array.isArray(p.entries))for(const e of p.entries)if(object(e)&&id(e.id))entryCounts.set(e.id,(entryCounts.get(e.id)||0)+1);}
 const pages=s.pages.filter(p=>object(p)&&id(p.id)&&pageCounts.get(p.id)===1&&Array.isArray(p.entries)&&p.entries.length<=64).map(p=>({id:p.id,source:p,entries:p.entries.filter(e=>object(e)&&id(e.id)&&entryCounts.get(e.id)===1&&text(e.word)&&text(e.definition))}));
 return {pages,entries:pages.flatMap(p=>p.entries.map(e=>({...e,pageId:p.id})))};
}
const emptyPrefix=()=>({prefixId:null,partId:null,kept:[]});
const defaultBook=book=>({pageId:book.pages.find(p=>p.entries.length)?.id??null,targetId:null,last:null});
export function validMarketPrefixDraft(s,d){
 if(!validMarketPrefix(s)||!object(d)||!(d.prefixId===null||id(d.prefixId))||!(d.partId===null||id(d.partId))||!Array.isArray(d.kept)||d.kept.length>256)return false;
 const seen=new Set();return d.kept.every(k=>{if(!object(k)||!s.prefixes.some(p=>p.id===k.prefixId)||!s.parts.some(p=>p.id===k.partId))return false;const key=JSON.stringify([k.prefixId,k.partId]);if(seen.has(key))return false;seen.add(key);return true;});
}
function validBookDraft(book,d){
 if(!book||!object(d)||!(d.pageId===null||id(d.pageId))||!(d.targetId===null||id(d.targetId)))return false;
 return d.last===null||object(d.last)&&id(d.last.pageId)&&id(d.last.targetId)&&['fit','different'].includes(d.last.outcome);
}
export function validMarketJob(s){
 if(!object(s)||s.v!==1||!id(s.id)||!['choice','match','order'].includes(s.kind)||!['title','prompt','hint','example','explanation'].every(k=>text(s[k]))||own(s,'tag')&&!text(s.tag)||!rows(s.parts)||!rows(s.choices)||!texts(s.steps,4)||!Array.isArray(s.teach)||s.teach.length>16||!s.teach.every(card)||!object(s.different)||Object.values(s.different).some(x=>!text(x)))return false;
 const p=s.parts.map(x=>x.id),c=s.choices.map(x=>x.id);
 if(s.kind==='choice')return c.length>0&&c.includes(s.key);
 if(s.kind==='order')return p.length>0&&ids(s.key)&&s.key.length===p.length&&s.key.every(k=>p.includes(k));
 return p.length>0&&c.length>0&&object(s.key)&&p.every(k=>own(s.key,k)&&c.includes(s.key[k]));
}
export function validMarketWork(s,w){
 if(!validMarketJob(s)||!object(w))return false;
 const p=s.parts.map(x=>x.id),c=s.choices.map(x=>x.id);
 if(s.kind==='choice')return w.choice===null||c.includes(w.choice);
 if(s.kind==='order')return ids(w.order)&&w.order.length===p.length&&w.order.every(k=>p.includes(k));
 return object(w.placements)&&Object.entries(w.placements).every(([k,v])=>p.includes(k)&&(v===null||c.includes(v)));
}
export function sameMarketWork(a,b){
 if(!object(a)||!object(b))return false;
 if(own(a,'choice')||own(b,'choice'))return own(a,'choice')&&own(b,'choice')&&a.choice===b.choice;
 if(own(a,'order')||own(b,'order'))return Array.isArray(a.order)&&Array.isArray(b.order)&&a.order.length===b.order.length&&a.order.every((k,i)=>k===b.order[i]);
 if(!object(a.placements)||!object(b.placements))return false;
 return [...new Set([...Object.keys(a.placements),...Object.keys(b.placements)])].every(k=>(a.placements[k]??null)===(b.placements[k]??null));
}
const validCheck=(s,c)=>object(c)&&validMarketWork(s,c.work)&&help(c.help)&&['incomplete','different','fit'].includes(c.outcome)&&c.supported===true&&c.guided===true&&Array.isArray(c.feedback)&&c.feedback.length<=12&&c.feedback.every(t=>typeof t==='string'&&[...t].length<=16000);
export const validMarketSnapshot=(s,k)=>object(k)&&validMarketWork(s,k.work)&&help(k.help)&&(k.check===null||validCheck(s,k.check)&&sameMarketWork(k.work,k.check.work));
export const validMarketRecord=r=>object(r)&&validMarketJob(r.source)&&validMarketWork(r.source,r.work)&&help(r.help)&&Array.isArray(r.checks)&&r.checks.length<=12&&r.checks.every(c=>validCheck(r.source,c))&&Number.isSafeInteger(r.count)&&r.count>=r.checks.length&&r.count<=1000000;
const rootOK=r=>object(r)&&r.v===1&&object(r.source);
function ownJobs(r){
 const a=r.source.jobs;if(!Array.isArray(a)||a.length>64)return [];
 const counts=new Map();for(const s of a)if(object(s)&&id(s.id))counts.set(s.id,(counts.get(s.id)||0)+1);
 return a.filter(s=>validMarketJob(s)&&counts.get(s.id)===1);
}
export function marketSignsView(state){
 if(!own(state,'signs'))return {status:'new',root:null,record:null,records:[],jobs:[],practiceGroup:'prefix',endings:marketEndingView(state)};
 const r=state.signs;if(!rootOK(r))return {status:'unsupported',root:r,record:null,records:[],jobs:[],practiceGroup:'prefix',endings:marketEndingView(state)};
 const records=object(r.records)&&Object.keys(r.records).length<=64?Object.entries(r.records).map(([key,value])=>({id:key,readable:id(key)&&validMarketRecord(value)&&value.source.id===key,record:value})):[];
 const practiceGroup=r.practiceGroup==='endings'?'endings':'prefix',endings=marketEndingView(state);
 const current=records.find(x=>x.id===r.currentId&&x.readable),prefixSource=validMarketPrefix(r.source.prefix)?r.source.prefix:null,book=marketBook(r.source.dictionary);
 const prefixDraft=prefixSource?(own(r,'prefix')?validMarketPrefixDraft(prefixSource,r.prefix)?r.prefix:null:emptyPrefix()):null;
 const dictionaryDraft=book?(own(r,'dictionary')?validBookDraft(book,r.dictionary)?r.dictionary:null:defaultBook(book)):null;
 return {status:'ready',root:r,record:practiceGroup==='endings'?endings.record:current?.record??null,practiceGroup,endings,records,jobs:ownJobs(r),prefixSource,prefixDraft,book,dictionaryDraft,view:['prefix','dictionary','practice','endings'].includes(r.view)?r.view:'choose'};
}
const failure=error=>({ok:false,error});
function mutate(state,fn,options={}){
 try{
  if(typeof options.canExport!=='function')return failure('unexportable');
  const next=copy(state);if(!own(next,'signs'))next.signs={v:1,source:marketSignsCollection(),view:'choose',currentId:null,records:{}};
  if(!rootOK(next.signs))return failure('unavailable');
  const result=fn(next.signs,next);if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(next)||!options.canExport(next))return failure('unexportable');
  state.signs=next.signs;return result;
 }catch{return failure('unexportable');}
}
export function openMarketBench(state,view,options){if(view==='choose'&&object(state)&&!own(state,'signs'))return {ok:true,changed:false};return mutate(state,r=>{
 if(view==='endings'){const created=!own(r,'endings');ensureEndings(r);if(r.view==='endings'&&!created)return {ok:true,changed:false};r.view='endings';return {ok:true};}
 if(!['choose','prefix','dictionary','practice'].includes(view))return failure('selection');let created=false;
 if(view==='prefix'){if(!validMarketPrefix(r.source.prefix))return failure('unavailable');if(!own(r,'prefix')){r.prefix=emptyPrefix();created=true;}if(!validMarketPrefixDraft(r.source.prefix,r.prefix))return failure('unavailable');}
 if(view==='dictionary'){const book=marketBook(r.source.dictionary);if(!book)return failure('unavailable');if(!own(r,'dictionary')){r.dictionary=defaultBook(book);created=true;}if(!validBookDraft(book,r.dictionary))return failure('unavailable');}
 if(r.view===view&&!created)return {ok:true,changed:false};r.view=view;return {ok:true};
 },options);}
export function marketPrefixResult(source,draft){
 if(!validMarketPrefixDraft(source,draft))return null;
 const p=source.prefixes.find(p=>p.id===draft.prefixId),b=source.parts.find(b=>b.id===draft.partId);if(!p||!b)return {kind:'incomplete'};
 const join=source.joins.find(j=>j.prefixId===p.id&&j.partId===b.id),letter=p.text.at(-1);
 return {kind:join?'supplied':'discovery',label:p.text+b.text,prefix:p,part:b,meaning:join?.meaning??null,boundary:join&&letter&&letter===b.text[0]?letter:null};
}
export function setMarketPrefix(state,change,options){return mutate(state,r=>{
 const s=r.source.prefix;if(!validMarketPrefix(s))return failure('unavailable');if(!own(r,'prefix'))r.prefix=emptyPrefix();const d=r.prefix;if(!validMarketPrefixDraft(s,d))return failure('unavailable');
 if(change.clear===true){d.prefixId=null;d.partId=null;}
 else if(own(change,'pair')){const k=change.pair;if(!object(k)||!d.kept.some(x=>x.prefixId===k.prefixId&&x.partId===k.partId))return failure('selection');d.prefixId=k.prefixId;d.partId=k.partId;}
 else if(own(change,'prefixId')){if(change.prefixId!==null&&!s.prefixes.some(p=>p.id===change.prefixId))return failure('selection');d.prefixId=change.prefixId;}
 else if(own(change,'partId')){if(change.partId!==null&&!s.parts.some(p=>p.id===change.partId))return failure('selection');d.partId=change.partId;}
 else return failure('selection');r.view='prefix';return {ok:true};
 },options);}
export function keepMarketSign(state,options){return mutate(state,r=>{
 const s=r.source.prefix,d=r.prefix;if(!validMarketPrefixDraft(s,d))return failure('unavailable');const result=marketPrefixResult(s,d);if(result.kind==='incomplete')return failure('incomplete');
 if(d.kept.some(x=>x.prefixId===d.prefixId&&x.partId===d.partId))return {ok:true,changed:false};if(d.kept.length>=256)return failure('full');d.kept.push({prefixId:d.prefixId,partId:d.partId});return {ok:true};
 },options);}
export function setMarketBook(state,change,options){return mutate(state,r=>{
 const book=marketBook(r.source.dictionary);if(!book)return failure('unavailable');if(!own(r,'dictionary'))r.dictionary=defaultBook(book);const d=r.dictionary;if(!validBookDraft(book,d))return failure('unavailable');
 if(own(change,'pageId')){if(change.pageId!==null&&!book.pages.some(p=>p.id===change.pageId))return failure('selection');d.pageId=change.pageId;}
 else if(own(change,'targetId')){if(change.targetId!==null&&!book.entries.some(e=>e.id===change.targetId))return failure('selection');d.targetId=change.targetId;}
 else return failure('selection');r.view='dictionary';return {ok:true};
 },options);}
export function checkMarketPage(state,options){return mutate(state,r=>{
 const book=marketBook(r.source.dictionary),d=r.dictionary;if(!validBookDraft(book,d))return failure('unavailable');const e=book.entries.find(e=>e.id===d.targetId),page=book.pages.find(p=>p.id===d.pageId);if(!e||!page||!page.entries.length)return failure('incomplete');
 d.last={pageId:d.pageId,targetId:d.targetId,outcome:e.pageId===d.pageId?'fit':'different'};return {ok:true};
 },options);}
const initialWork=s=>s.kind==='choice'?{choice:null}:s.kind==='order'?{order:s.parts.map(p=>p.id)}:{placements:Object.fromEntries(s.parts.map(p=>[p.id,null]))};
export function openMarketJob(state,jobId,options){return mutate(state,r=>{
 if(!id(jobId))return failure('selection');if(!own(r,'records'))r.records={};if(!object(r.records)||Object.keys(r.records).length>64)return failure('unavailable');
 if(own(r.records,jobId)){if(!validMarketRecord(r.records[jobId])||r.records[jobId].source.id!==jobId)return failure('unavailable');}
 else{if(Object.keys(r.records).length>=64)return failure('full');const source=ownJobs(r).find(s=>s.id===jobId);if(!source)return failure('selection');r.records[jobId]={source:copy(source),work:initialWork(source),help:{hint:false,example:false},checks:[],count:0};}
 if(r.currentId===jobId&&r.view==='practice'&&r.practiceGroup!=='endings')return {ok:true,changed:false};r.currentId=jobId;if(own(r,'practiceGroup'))r.practiceGroup='prefix';r.view='practice';return {ok:true};
 },options);}
export function nextMarketJob(state,options){
 const v=marketSignsView(state);if(v.status==='unsupported')return failure('unavailable');
 const root=v.root,jobs=root?ownJobs(root):marketSignsCollection().jobs;
 const prefix=jobs.filter(s=>!root?.records||!own(root.records,s.id)||validMarketRecord(root.records[s.id])&&root.records[s.id].source.id===s.id).map(s=>({group:'prefix',id:s.id}));
 const e=marketEndingView(state),ending=e.jobs.filter(s=>!e.root?.records||!own(e.root.records,s.id)||validMarketEndingRecord(e.root.records[s.id])&&e.root.records[s.id].source.id===s.id).map(s=>({group:'endings',id:s.id}));
 const all=[...prefix,...ending];if(!all.length)return mutate(state,r=>{if(r.practiceGroup==='endings'&&endingRootOK(r.endings))r.endings.currentId=null;else r.currentId=null;r.view='practice';return {ok:true};},options);
 const group=v.practiceGroup??'prefix',current=group==='endings'?e.root?.currentId:root?.currentId,at=all.findIndex(x=>x.group===group&&x.id===current),next=all[(at+1)%all.length];
 return next.group==='endings'?openMarketEndingJob(state,next.id,options):openMarketJob(state,next.id,options);
}
function editJob(state,fn,options){return mutate(state,(r,next)=>{const record=marketSignsView(next).record;if(!record)return failure('unavailable');const out=fn(record);return out.ok&&(r.practiceGroup==='endings'?validMarketEndingRecord(record):validMarketRecord(record))?out:out.ok?failure('unavailable'):out;},options);}
export function setMarketWork(state,action,options){return editJob(state,r=>{
 const s=r.source,w=r.work;
 if(s.kind==='choice'){if(action.choice!==null&&!s.choices.some(c=>c.id===action.choice))return failure('selection');w.choice=action.choice;}
 else if(s.kind==='match'){if(!s.parts.some(p=>p.id===action.partId)||action.destinationId!==null&&!s.choices.some(c=>c.id===action.destinationId))return failure('selection');w.placements[action.partId]=action.destinationId;}
 else{const at=w.order.indexOf(action.partId),to=at+action.direction;if(at<0||![-1,1].includes(action.direction)||to<0||to>=w.order.length)return failure('selection');[w.order[at],w.order[to]]=[w.order[to],w.order[at]];}
 return {ok:true};
 },options);}
export function marketJobResult(s,w){
 if(!validMarketWork(s,w))return null;
 const incomplete=s.kind==='choice'?w.choice===null:s.kind==='match'?s.parts.some(p=>(w.placements[p.id]??null)===null):false;
 const fit=!incomplete&&(s.kind==='choice'?w.choice===s.key:s.kind==='order'?w.order.every((k,i)=>k===s.key[i]):s.parts.every(p=>w.placements[p.id]===s.key[p.id]));
 const feedback=incomplete?[T.incomplete]:fit?[s.explanation]:[s.kind==='choice'?s.different[w.choice]:s.different.general,s.explanation].filter(x=>typeof x==='string');feedback.push(T.editable);
 return {outcome:incomplete?'incomplete':fit?'fit':'different',feedback};
}
export function checkMarketJob(state,options){return editJob(state,r=>{
 if(r.count>=1000000)return failure('full');const result=marketJobResult(r.source,r.work);const check={work:copy(r.work),help:copy(r.help),...result,supported:true,guided:true};r.checks.push(check);if(r.checks.length>12)r.checks=[r.checks[0],...r.checks.slice(-11)];r.count++;return {ok:true};
 },options);}
export function showMarketHelp(state,kind,options){return editJob(state,r=>{if(!['hint','example'].includes(kind))return failure('selection');if(r.help[kind])return {ok:true,changed:false};r.help[kind]=true;return {ok:true};},options);}
export function keepMarketVersion(state,options){return editJob(state,r=>{
 const last=r.checks.at(-1),snapshot={work:copy(r.work),help:copy(r.help),check:last&&sameMarketWork(last.work,r.work)?copy(last):null};if(!own(r,'firstKept'))r.firstKept=copy(snapshot);r.latestKept=snapshot;return {ok:true};
 },options);}

// Ending sources are retained separately: reading this section never allocates it.
const endingRootOK=r=>object(r)&&r.v===1&&object(r.source)&&r.source.v===1;
const nonempty=x=>text(x)&&x.length>0;
export function validMarketEndingJob(s){
 return validMarketJob(s)&&nonempty(s.contextLabel)&&(!own(s,'tag')||nonempty(s.tagLabel))&&(s.kind!=='match'||object(s.matchCopy)&&['instruction','destinationPrompt','destinationLabel'].every(k=>nonempty(s.matchCopy[k])));
}
export const validMarketEndingRecord=r=>validMarketRecord(r)&&validMarketEndingJob(r.source);
function endingJobs(r){
 const a=r.source.jobs;if(!Array.isArray(a)||a.length>32)return [];
 const counts=new Map();for(const s of a)if(object(s)&&id(s.id))counts.set(s.id,(counts.get(s.id)||0)+1);
 return a.filter(s=>validMarketEndingJob(s)&&counts.get(s.id)===1);
}
export function validMarketEndingSource(s){
 if(!object(s)||s.v!==1||!rows(s.roots,64)||!rows(s.endings,8)||!s.endings.every(e=>text(e.label))||!ids(s.tools)||s.tools.length>16||!Array.isArray(s.joins)||s.joins.length>64||!object(s.shelves)||!Array.isArray(s.hints)||s.hints.length>32)return false;
 const shelf=a=>Array.isArray(a)&&a.length<=16&&a.every(x=>object(x)&&id(x.id)&&text(x.word)&&text(x.note))&&new Set(a.map(x=>x.id)).size===a.length;
 if(!shelf(s.shelves.noRoot)||!shelf(s.shelves.odd))return false;
 const roots=new Set(s.roots.map(x=>x.id)),endings=new Set(s.endings.map(x=>x.id)),joins=new Set(),pairs=new Set(),hints=new Set();
 if(!s.joins.every(j=>{if(!object(j)||!id(j.id)||joins.has(j.id)||!roots.has(j.rootId)||!endings.has(j.endingId)||!s.tools.includes(j.toolId)||!text(j.word))return false;const pair=JSON.stringify([j.rootId,j.endingId]);if(pairs.has(pair))return false;joins.add(j.id);pairs.add(pair);return true;}))return false;
 return s.hints.every(h=>{if(!object(h)||!roots.has(h.rootId)||!s.tools.includes(h.toolId)||!text(h.text))return false;const key=JSON.stringify([h.rootId,h.toolId]);if(hints.has(key))return false;hints.add(key);return true;});
}
const emptyEndingDraft=()=>({rootId:null,endingId:null,toolId:null});
const endingTriple=(s,k)=>object(k)&&s.roots.some(r=>r.id===k.rootId)&&s.endings.some(e=>e.id===k.endingId)&&s.tools.includes(k.toolId);
export function validMarketEndingDraft(s,d){return validMarketEndingSource(s)&&object(d)&&['rootId','endingId','toolId'].every(k=>d[k]===null||(k==='rootId'?s.roots:k==='endingId'?s.endings:s.tools).some(x=>(typeof x==='string'?x:x.id)===d[k]));}
function validEndingKept(s,a){
 if(!Array.isArray(a)||a.length>256)return false;const seen=new Set();return a.every(k=>{if(!endingTriple(s,k))return false;const key=JSON.stringify([k.rootId,k.endingId,k.toolId]);if(seen.has(key))return false;seen.add(key);return true;});
}
export function marketEndingView(state){
 const r=state?.signs?.endings,base={root:r??null,source:null,benchSource:null,benchDraft:null,benchReadable:false,keptRows:[],jobs:[],records:[],record:null,cards:[],story:null,materialUnavailable:false};
 if(state&&own(state,'signs')&&!rootOK(state.signs))return {status:'unsupported',...base};
 if(!state?.signs||!own(state.signs,'endings'))return {status:'new',...base};
 if(!endingRootOK(r))return {status:'unsupported',...base,root:r};
 const s=r.source,benchSource=validMarketEndingSource(s)?s:null,draft=benchSource&&validMarketEndingDraft(s,r.draft)?r.draft:null;
 const records=object(r.records)&&Object.keys(r.records).length<=32?Object.entries(r.records).map(([key,value])=>({id:key,readable:id(key)&&validMarketEndingRecord(value)&&value.source.id===key,record:value})):[];
 const keptRows=Array.isArray(r.kept)?r.kept.map((k,index)=>{const roots=object(k)&&Array.isArray(s.roots)?s.roots.filter(x=>object(x)&&x.id===k.rootId):[],endings=object(k)&&Array.isArray(s.endings)?s.endings.filter(x=>object(x)&&x.id===k.endingId):[],root=roots[0],ending=endings[0],toolId=object(k)?k.toolId:null;return {index,rootText:text(root?.text)?root.text:null,endingText:text(ending?.text)?ending.text:null,toolId,readable:roots.length===1&&endings.length===1&&id(root.id)&&text(root.text)&&id(ending.id)&&text(ending.text)&&id(toolId)&&Array.isArray(s.tools)&&s.tools.filter(t=>t===toolId).length===1};}):[];
 const story=object(s.story)&&['hook','short','longer','note'].every(k=>text(s.story[k]))?s.story:null;
 const cardCounts=new Map();if(Array.isArray(s.cards))for(const c of s.cards)if(object(c)&&id(c.id))cardCounts.set(c.id,(cardCounts.get(c.id)||0)+1);
 const cards=readableMarketCards(s.cards).filter(c=>cardCounts.get(c.id)===1);
 return {status:'ready',...base,root:r,source:s,benchSource,benchDraft:draft,benchReadable:!!draft&&validEndingKept(s,r.kept),keptRows,jobs:endingJobs(r),records,record:records.find(x=>x.id===r.currentId&&x.readable)?.record??null,cards,story,materialUnavailable:!story||!Array.isArray(s.cards)||s.cards.length!==cards.length};
}
export function marketEndingTool(rootText,endingText,toolId){
 if(!text(rootText)||!text(endingText))return {ok:false,reason:'unavailable-bench'};
 let base=rootText,added=endingText,change='none';
 if(toolId==='just-add'){}
 else if(toolId==='drop-e'){if(!rootText.endsWith('e'))return {ok:false,reason:'drop-e'};base=rootText.slice(0,-1);change='drop-e';}
 else if(toolId==='y-to-i'){if(!rootText.endsWith('y'))return {ok:false,reason:'y-to-i'};base=rootText.slice(0,-1)+'i';change='y-to-i';}
 else if(toolId==='le-to-ly'){if(endingText!=='ly'||!rootText.endsWith('le'))return {ok:false,reason:'le-to-ly'};base=rootText.slice(0,-2);added='ly';change='le-to-ly';}
 else if(toolId==='ic-to-ically'){if(endingText!=='ly'||!rootText.endsWith('ic'))return {ok:false,reason:'ic-to-ically'};added='ally';}
 else return {ok:false,reason:'unavailable-tool'};
 return {ok:true,made:base+added,base,added,change};
}
export function marketEndingResult(source,draft){
 if(!validMarketEndingSource(source)||!validMarketEndingDraft(source,draft))return {kind:'unavailable',reason:'unavailable-bench'};
 const root=source.roots.find(x=>x.id===draft.rootId),ending=source.endings.find(x=>x.id===draft.endingId),toolId=draft.toolId,parts={root,ending,toolId};
 if(!root||!ending||!toolId)return {kind:'incomplete',...parts};
 const literal=marketEndingTool(root.text,ending.text,toolId),join=source.joins.find(j=>j.rootId===root.id&&j.endingId===ending.id),out={...parts,...literal,join};
 if(join){const expected=marketEndingTool(root.text,ending.text,join.toolId);if(!expected.ok)return {kind:'unavailable',...out,reason:expected.reason==='unavailable-tool'?'unavailable-tool':'stored-word'};if(expected.made!==join.word)return {kind:'unavailable',...out,reason:'stored-word'};}
 if(!literal.ok)return {kind:literal.reason==='unavailable-tool'?'unavailable':'cannot',...out};
 if(!join)return {kind:'discovery',...out};
 if(join.toolId===toolId)return {kind:'fit',...out};
 return {kind:'mismatch',...out,hint:source.hints.find(h=>h.rootId===root.id&&h.toolId===toolId)?.text??null};
}
function ensureEndings(r){if(!own(r,'endings'))r.endings={v:1,source:marketEndingCollection(),draft:emptyEndingDraft(),kept:[],currentId:null,records:{}};}
export function setMarketEnding(state,change,options){return mutate(state,(r,next)=>{
 ensureEndings(r);const v=marketEndingView(next);if(!v.benchReadable)return failure('unavailable');const s=v.benchSource,d=r.endings.draft;
 if(change.clear===true){d.rootId=null;d.endingId=null;d.toolId=null;}
 else if(own(change,'reopen')){if(!Number.isSafeInteger(change.reopen)||!v.keptRows[change.reopen]?.readable)return failure('selection');const k=r.endings.kept[change.reopen];d.rootId=k.rootId;d.endingId=k.endingId;d.toolId=k.toolId;}
 else{const key=['rootId','endingId','toolId'].find(k=>own(change,k));if(!key)return failure('selection');const value=change[key],offered=key==='rootId'?s.roots:key==='endingId'?s.endings:s.tools;if(value!==null&&!offered.some(x=>(typeof x==='string'?x:x.id)===value))return failure('selection');d[key]=value;}
 r.view='endings';return {ok:true};
 },options);}
export function keepMarketEndingSign(state,options){return mutate(state,(r,next)=>{
 const v=marketEndingView(next);if(!v.benchReadable)return failure('unavailable');const result=marketEndingResult(v.benchSource,v.benchDraft);if(result.kind==='incomplete')return failure('incomplete');if(!['fit','mismatch','discovery'].includes(result.kind))return failure('unavailable');
 const e=r.endings,d=e.draft;if(e.kept.some(k=>k.rootId===d.rootId&&k.endingId===d.endingId&&k.toolId===d.toolId))return {ok:true,changed:false};if(e.kept.length>=256)return failure('full');e.kept.push({rootId:d.rootId,endingId:d.endingId,toolId:d.toolId});return {ok:true};
 },options);}
export function openMarketEndingJob(state,jobId,options){return mutate(state,r=>{
 if(!id(jobId))return failure('selection');ensureEndings(r);const e=r.endings;if(!endingRootOK(e))return failure('unavailable');if(!own(e,'records'))e.records={};if(!object(e.records)||Object.keys(e.records).length>32)return failure('unavailable');
 if(own(e.records,jobId)){if(!validMarketEndingRecord(e.records[jobId])||e.records[jobId].source.id!==jobId)return failure('unavailable');}
 else{if(Object.keys(e.records).length>=32)return failure('full');const source=endingJobs(e).find(s=>s.id===jobId);if(!source)return failure('selection');e.records[jobId]={source:copy(source),work:initialWork(source),help:{hint:false,example:false},checks:[],count:0};}
 if(e.currentId===jobId&&r.practiceGroup==='endings'&&r.view==='practice')return {ok:true,changed:false};e.currentId=jobId;r.practiceGroup='endings';r.view='practice';return {ok:true};
 },options);}
