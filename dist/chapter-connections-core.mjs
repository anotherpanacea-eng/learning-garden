// A source-owned reading companion. Connections are annotations, never literary grades.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const object=x=>x!==null&&typeof x==='object'&&(Object.getPrototypeOf(x)===Object.prototype||Object.getPrototypeOf(x)===null);
const fields=(x,ks)=>object(x)&&ks.every(k=>own(x,k));
const text=(x,max=1500)=>typeof x==='string'&&x.trim().length>0&&Array.from(x).length<=max;
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const dense=(a,min,max,check)=>Array.isArray(a)&&a.length>=min&&a.length<=max&&Array.from({length:a.length},(_,i)=>own(a,i)&&check(a[i])).every(Boolean);
const unique=a=>new Set(a).size===a.length;
const reserved=new Set(['__proto__','prototype',...Object.getOwnPropertyNames(Object.prototype)]);
const id=x=>text(x,80)&&/^[\x20-\x7e]+$/.test(x)&&!reserved.has(x);
const kind=x=>['question','echo','change','other'].includes(x);
const title=x=>text(x,200);
const fragment=x=>text(x,80)&&/^[a-zA-Z0-9._-]+$/.test(x)&&!['.','..'].includes(x);
const quoteShape=(s,q)=>fields(q,['id','chapterId','title','blocks','joins','context','glossary'])&&id(q.id)&&id(q.chapterId)&&s.chapters.some(c=>c.id===q.chapterId)&&title(q.title)&&dense(q.blocks,1,8,p=>text(p))&&dense(q.joins,q.blocks.length-1,q.blocks.length-1,p=>['paragraph','omission'].includes(p))&&text(q.context)&&dense(q.glossary,0,12,g=>fields(g,['word','meaning'])&&text(g.word,80)&&text(g.meaning,500));
export function validChapterSource(s){
 try{
  if(!fields(s,['v','model','id','title','book','intro','notice','adultNote','credit','chapters','quotes','invitations','examples','demo'])||s.v!==1||s.model!=='chapter-connections-v1'||!id(s.id)||!title(s.title)||!['intro','notice','adultNote','credit'].every(k=>text(s[k])))return false;
  const b=s.book;
  if(!fields(b,['title','author','year','ebookNumber','editionDate'])||!title(b.title)||!title(b.author)||!integer(b.year,1,9999)||!integer(b.ebookNumber,1,9999999)||typeof b.editionDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(b.editionDate))return false;
  if(!dense(s.chapters,3,40,c=>fields(c,['id','number','title','mapLabel','fragment','summary','noticeQuestion','furtherQuestion'])&&id(c.id)&&integer(c.number,1,999)&&title(c.title)&&text(c.mapLabel,40)&&fragment(c.fragment)&&['summary','noticeQuestion','furtherQuestion'].every(k=>text(c[k])))||!unique(s.chapters.map(c=>c.id))||!unique(s.chapters.map(c=>c.number)))return false;
  const chapter=x=>s.chapters.some(c=>c.id===x);
  if(!dense(s.quotes,0,40,q=>quoteShape(s,q))||!unique(s.quotes.map(q=>q.id)))return false;
  const quote=x=>s.quotes.some(q=>q.id===x);
  if(!dense(s.invitations,1,6,p=>text(p))||!dense(s.examples,1,6,e=>fields(e,['title','left','right','kind','quoteIds','text'])&&title(e.title)&&id(e.left)&&id(e.right)&&e.left!==e.right&&chapter(e.left)&&chapter(e.right)&&kind(e.kind)&&dense(e.quoteIds,0,s.quotes.length,q=>id(q)&&quote(q))&&unique(e.quoteIds)&&text(e.text)))return false;
  const d=s.demo;
  if(!fields(d,['title','chapters','steps'])||!title(d.title)||!dense(d.chapters,3,6,c=>fields(c,['id','title','text'])&&id(c.id)&&title(c.title)&&text(c.text))||!unique(d.chapters.map(c=>c.id)))return false;
  const demoChapter=x=>d.chapters.some(c=>c.id===x);
  return dense(d.steps,1,6,p=>fields(p,['text','left','right'])&&text(p.text)&&(p.left===null&&p.right===null||id(p.left)&&id(p.right)&&p.left!==p.right&&demoChapter(p.left)&&demoChapter(p.right)));
 }catch{return false;}
}
const connection=(s,row)=>fields(row,['left','right','kind'])&&id(row.left)&&id(row.right)&&row.left!==row.right&&s.chapters.some(c=>c.id===row.left)&&s.chapters.some(c=>c.id===row.right)&&kind(row.kind);
const same=(row,left,right,k)=>fields(row,['left','right','kind'])&&row.kind===k&&((row.left===left&&row.right===right)||(row.left===right&&row.right===left));
export function findChapterConnection(w,left,right,k){
 try{if(!fields(w,['connections'])||!Array.isArray(w.connections)||!id(left)||!id(right)||left===right||!kind(k))return -1;return w.connections.findIndex(row=>same(row,left,right,k));}catch{return -1;}
}
export function readChapterWork(s,w){
 const unavailable=(preview=null,rows=[])=>({status:'unavailable',work:w,preview,rows});
 try{
  if(!validChapterSource(s))return unavailable();
  const chapter=x=>s.chapters.some(c=>c.id===x),side=x=>x===null||id(x)&&chapter(x);
  const preview={selected:object(w)&&own(w,'selected')&&id(w.selected)&&chapter(w.selected)?w.selected:s.chapters[0].id,left:object(w)&&own(w,'left')&&side(w.left)?w.left:null,right:object(w)&&own(w,'right')&&side(w.right)?w.right:null,kind:object(w)&&own(w,'kind')&&kind(w.kind)?w.kind:null,referenceShown:object(w)&&own(w,'referenceShown')&&typeof w.referenceShown==='boolean'?w.referenceShown:null,teachingSeen:object(w)&&own(w,'teachingSeen')&&integer(w.teachingSeen,0,s.demo.steps.length)?w.teachingSeen:null};
  const rows=object(w)&&own(w,'connections')&&Array.isArray(w.connections)?Array.from(w.connections,(raw,index)=>({index,raw,readable:connection(s,raw)})):[];
  const max=4*s.chapters.length*(s.chapters.length-1)/2;
  const valid=fields(w,['v','selected','left','right','kind','connections','referenceShown','teachingSeen'])&&w.v===1&&id(w.selected)&&chapter(w.selected)&&side(w.left)&&side(w.right)&&(w.kind===null||kind(w.kind))&&dense(w.connections,0,max,row=>connection(s,row))&&unique(w.connections.map(row=>JSON.stringify([[row.left,row.right].sort(),row.kind])))&&typeof w.referenceShown==='boolean'&&integer(w.teachingSeen,0,s.demo.steps.length);
  return valid?{status:'ready',work:w,preview,rows}:unavailable(preview,rows);
 }catch{return unavailable();}
}
export const validChapterWork=(s,w)=>readChapterWork(s,w).status==='ready';
export function newChapterWork(s){return validChapterSource(s)?{v:1,selected:s.chapters[0].id,left:null,right:null,kind:null,connections:[],referenceShown:false,teachingSeen:0}:null;}
export function changeChapterWork(s,w,action,value){
 try{
  if(!validChapterWork(s,w))return null;
  const next=structuredClone(w),chapter=x=>id(x)&&s.chapters.some(c=>c.id===x);
  if(action==='select'){if(!chapter(value))return null;next.selected=value;}
  else if(action==='pinleft'||action==='pinright'){if(value!==null&&!chapter(value))return null;next[action==='pinleft'?'left':'right']=value;}
  else if(action==='kind'){if(value!==null&&!kind(value))return null;next.kind=value;}
  else if(action==='connect'){
   if(next.left===null||next.right===null||next.left===next.right||!kind(next.kind)||findChapterConnection(next,next.left,next.right,next.kind)>=0)return null;
   next.connections.push({left:next.left,right:next.right,kind:next.kind});
  }else if(action==='focus'||action==='remove'){
   if(!fields(value,['left','right','kind']))return null;
   const at=findChapterConnection(next,value.left,value.right,value.kind);if(at<0)return null;
   if(action==='focus'){const row=next.connections[at];next.left=row.left;next.right=row.right;next.kind=row.kind;}else next.connections.splice(at,1);
  }else if(action==='reference')next.referenceShown=true;
  else if(action==='teaching')next.teachingSeen=Math.min(s.demo.steps.length,next.teachingSeen+1);
  else return null;
  return next;
 }catch{return null;}
}
const mapNumber=r=>object(r)&&own(r,'id')&&typeof r.id==='string'&&/^chapter-map-[1-9][0-9]{0,5}$/.test(r.id)?Number(r.id.slice(12)):null;
export function chapterMapsView(book){
 try{
  if(!object(book))return {status:'unavailable',items:[],canKeep:false};
  if(!own(book,'chapterMaps'))return {status:'absent',items:[],canKeep:true};
  if(!Array.isArray(book.chapterMaps))return {status:'unavailable',items:[],canKeep:false};
  const counts=new Map();let max=0;
  for(const row of book.chapterMaps){const n=mapNumber(row);if(n!==null){max=Math.max(max,n);counts.set(n,(counts.get(n)||0)+1);}}
  const items=Array.from(book.chapterMaps,(raw,index)=>{const n=mapNumber(raw),viewable=n!==null&&counts.get(n)===1&&fields(raw,['source'])&&validChapterSource(raw.source),view=viewable?readChapterWork(raw.source,own(raw,'work')?raw.work:undefined):null;return {id:n===null?null:raw.id,index,raw,viewable,readable:viewable&&view.status==='ready',view};});
  return {status:'ready',items,canKeep:max<999999};
 }catch{return {status:'unavailable',items:[],canKeep:false};}
}
export function keepChapterMap(book,source,work,options={}){
 try{
  if(!validChapterWork(source,work)||typeof options.canExport!=='function'||options.template!==undefined&&!object(options.template))return false;
  const view=chapterMapsView(book);if(!view.canKeep)return false;
  const n=view.items.reduce((max,item)=>Math.max(max,mapNumber(item.raw)??0),0)+1,id=`chapter-map-${n}`;
  const candidate=structuredClone(book),records=view.status==='absent'?[]:candidate.chapterMaps,record=options.template===undefined?{}:structuredClone(options.template);
  record.id=id;record.source=structuredClone(source);record.work=structuredClone(work);records.push(record);candidate.chapterMaps=records;
  if(!recoveryFitsProgressLimits(candidate))return false;
  const proposal=structuredClone(records);
  if(options.canExport(candidate)!==true)return false;
  book.chapterMaps=proposal;return id;
 }catch{return false;}
}
const origin='https://www.gutenberg.org';
export function chapterURL(s,chapterId){try{if(!validChapterSource(s))return null;const c=s.chapters.find(c=>c.id===chapterId);return c?`${origin}/cache/epub/${s.book.ebookNumber}/pg${s.book.ebookNumber}-images.html#${c.fragment}`:null;}catch{return null;}}
export function chapterSourceURL(s){return validChapterSource(s)?`${origin}/ebooks/${s.book.ebookNumber}`:null;}
export const chapterLicenseURL=()=>`${origin}/policy/license.html`;

const characterRoles=['supports','complicates','context'];
const characterRole=x=>characterRoles.includes(x);
const pair=(claimId,quoteId)=>JSON.stringify([claimId,quoteId]);
export function readCharacterStudy(s){
 const unavailable=()=>({status:'unavailable'});
 try{
  if(!validChapterSource(s))return unavailable();
  if(!own(s,'characterStudy'))return {status:'absent'};
  const p=s.characterStudy;
  if(!fields(p,['v','title','notice','roles','roleHelp','cases','claims','cards','references','demo','returnPrompt'])||p.v!==1||!title(p.title)||!text(p.notice)||!text(p.returnPrompt)||!fields(p.roles,characterRoles)||!fields(p.roleHelp,characterRoles)||!characterRoles.every(r=>text(p.roles[r],100)&&text(p.roleHelp[r],300)))return unavailable();
  if(!dense(p.claims,1,16,c=>fields(c,['id','text'])&&id(c.id)&&text(c.text))||!unique(p.claims.map(c=>c.id))||!dense(p.cards,1,16,q=>quoteShape(s,q))||!unique(p.cards.map(q=>q.id)))return unavailable();
  const claim=x=>id(x)&&p.claims.some(c=>c.id===x),card=x=>id(x)&&p.cards.some(q=>q.id===x);
  if(!dense(p.cases,1,4,c=>fields(c,['id','title','context','claimIds','cardIds'])&&id(c.id)&&title(c.title)&&text(c.context)&&dense(c.claimIds,1,4,claim)&&unique(c.claimIds)&&dense(c.cardIds,2,8,card)&&unique(c.cardIds))||!unique(p.cases.map(c=>c.id))||!p.claims.every(c=>p.cases.filter(k=>k.claimIds.includes(c.id)).length===1)||!p.cards.every(q=>p.cases.some(k=>k.cardIds.includes(q.id))))return unavailable();
  if(!dense(p.references,1,16,r=>{
   if(!fields(r,['claimId','title','placements','limit'])||!claim(r.claimId)||!title(r.title)||!text(r.limit))return false;
   const c=p.cases.find(c=>c.claimIds.includes(r.claimId));
   return dense(r.placements,1,8,q=>fields(q,['quoteId','role','comment'])&&id(q.quoteId)&&c.cardIds.includes(q.quoteId)&&characterRole(q.role)&&text(q.comment))&&unique(r.placements.map(q=>q.quoteId));
  })||!unique(p.references.map(r=>r.claimId))||!p.claims.every(c=>p.references.some(r=>r.claimId===c.id)))return unavailable();
  const d=p.demo;
  if(!fields(d,['title','chapters','steps'])||!title(d.title)||!dense(d.chapters,3,6,c=>fields(c,['id','title','text'])&&id(c.id)&&title(c.title)&&text(c.text,4000))||!unique(d.chapters.map(c=>c.id))||!dense(d.steps,1,6,t=>fields(t,['title','text','chapterIds'])&&title(t.title)&&text(t.text)&&dense(t.chapterIds,1,d.chapters.length,c=>id(c)&&d.chapters.some(k=>k.id===c))&&unique(t.chapterIds)))return unavailable();
  return {status:'ready',study:p};
 }catch{return unavailable();}
}
const readablePlacement=(p,row)=>{
 if(!fields(row,['claimId','quoteId','role'])||!id(row.claimId)||!id(row.quoteId)||!characterRole(row.role))return false;
 const c=p.cases.find(c=>c.claimIds.includes(row.claimId));return !!c&&c.cardIds.includes(row.quoteId);
};
export function readCharacterWork(s,w){
 let stored=false,raw;
 const unavailable=(rows=[])=>({status:'unavailable',characters:raw,stored,rows});
 try{
  stored=object(w)&&own(w,'characters');raw=stored?w.characters:undefined;
  const source=readCharacterStudy(s);
  if(source.status==='absent')return stored?unavailable():{status:'absent',characters:undefined,stored:false,rows:[]};
  if(source.status!=='ready')return unavailable();
  const p=source.study;
  if(!stored)return {status:'ready',characters:{v:1,caseId:p.cases[0].id,claimId:null,quoteId:p.cases[0].cardIds[0],placements:[],referenceShown:false,teachingSeen:0},stored:false,rows:[]};
  const rows=object(raw)&&own(raw,'placements')&&Array.isArray(raw.placements)?Array.from(raw.placements,(row,index)=>({index,raw:row,readable:readablePlacement(p,row)})):[];
  if(!fields(raw,['v','caseId','claimId','quoteId','placements','referenceShown','teachingSeen']))return unavailable(rows);
  const c=p.cases.find(c=>c.id===raw.caseId),max=p.cases.reduce((n,c)=>n+c.claimIds.length*c.cardIds.length,0);
  const valid=raw.v===1&&id(raw.caseId)&&c&&(raw.claimId===null||id(raw.claimId)&&c.claimIds.includes(raw.claimId))&&id(raw.quoteId)&&c.cardIds.includes(raw.quoteId)&&dense(raw.placements,0,max,r=>readablePlacement(p,r))&&unique(raw.placements.map(r=>pair(r.claimId,r.quoteId)))&&typeof raw.referenceShown==='boolean'&&integer(raw.teachingSeen,0,p.demo.steps.length);
  return valid?{status:'ready',characters:raw,stored:true,rows}:unavailable(rows);
 }catch{return unavailable();}
}
export function changeCharacterWork(s,w,action,value){
 try{
  if(!validChapterWork(s,w))return null;
  const view=readCharacterWork(s,w);if(view.status!=='ready')return null;
  const p=readCharacterStudy(s).study,next=structuredClone(w),c=structuredClone(view.characters);
  const current=p.cases.find(k=>k.id===c.caseId);
  if(action==='case'){
   const chosen=id(value)&&p.cases.find(k=>k.id===value);if(!chosen)return null;
   if(c.caseId!==value){c.caseId=value;c.claimId=null;c.quoteId=chosen.cardIds[0];}
  }else if(action==='claim'){if(!id(value)||!current.claimIds.includes(value))return null;c.claimId=value;}
  else if(action==='quote'){if(!id(value)||!current.cardIds.includes(value))return null;c.quoteId=value;}
  else if(action==='mark'||action==='clear'){
   if(c.claimId===null||action==='mark'&&!characterRole(value))return null;
   const at=c.placements.findIndex(r=>pair(r.claimId,r.quoteId)===pair(c.claimId,c.quoteId));
   if(action==='clear'){if(at<0)return null;c.placements.splice(at,1);}
   else if(at<0)c.placements.push({claimId:c.claimId,quoteId:c.quoteId,role:value});else c.placements[at].role=value;
  }else if(action==='focus'){
   if(!fields(value,['claimId','quoteId']))return null;
   const r=c.placements.find(r=>r.claimId===value.claimId&&r.quoteId===value.quoteId);if(!r)return null;
   c.caseId=p.cases.find(k=>k.claimIds.includes(r.claimId)).id;c.claimId=r.claimId;c.quoteId=r.quoteId;
  }else if(action==='reference')c.referenceShown=true;
  else if(action==='teaching')c.teachingSeen=Math.min(p.demo.steps.length,c.teachingSeen+1);
  else return null;
  next.characters=c;return next;
 }catch{return null;}
}
