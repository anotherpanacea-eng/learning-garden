// Spec 334: grading, shape validation and preflighted writes for the designTable root.
import {designItems,designBrief} from './design-table-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),clone=structuredClone;
const id=x=>typeof x==='string'&&/^[a-z0-9-]{1,40}$/.test(x);
const text=x=>typeof x==='string'&&x.length>=1&&x.length<=300;
const count=x=>Number.isInteger(x)&&x>=0&&x<=9999;
const SUPPORT=['none','hint','example'];
export const STATIONS=Object.freeze(['bags','brief']);
export const itemById=k=>designItems.find(x=>x.id===k)||null;
// Shape validation: never against today's catalog.
const optOk=(x,flips=false)=>object(x)&&id(x.id)&&text(x.label)&&(!own(x,'flip')||flips&&(object(x.flip)&&(id(x.flip.id)&&text(x.flip.label)&&Object.keys(x.flip).length===2||text(x.flip.line)&&Object.keys(x.flip).length===1)));
const listOk=(l,flips=false)=>Array.isArray(l)&&l.length<=12&&l.every(x=>optOk(x,flips))&&new Set(l.map(x=>x.id)).size===l.length;
const lineOk=x=>object(x)&&id(x.id)&&text(x.text);
const sameFlip=(a,b)=>a===undefined||b===undefined?a===b:a.id===b.id&&a.label===b.label&&a.line===b.line;
// A chosen or placed entry must be a well-formed copy of an entry in the record's own list.
const has=(list,x)=>optOk(x,true)&&list.some(y=>y.id===x.id&&y.label===x.label&&sameFlip(y.flip,x.flip));
const placedOk=(p,items,slots)=>Array.isArray(p)&&p.length<=12&&p.every(e=>object(e)&&has(items,e.item)&&has(slots,e.slot));
function answerOk(a,r){
 if(!object(a)||!lineOk(a.line))return false;
 if(a.choice!==null&&!has(r.options,a.choice))return false;
 if(a.entry!==null&&!(Number.isInteger(a.entry)&&a.entry>=0&&a.entry<=99))return false;
 return a.placed===null||placedOk(a.placed,r.options,r.slots);
}
export function validItem(r){
 if(!object(r)||!text(r.prompt)||!(r.explanation===null||text(r.explanation))||!listOk(r.options)||!listOk(r.slots)||!id(r.rev))return false;
 if(!count(r.tries)||!SUPPORT.includes(r.support)||typeof r.at!=='string')return false;
 for(const k of ['first','latest','rightAnswer'])if(r[k]!==null&&!answerOk(r[k],r))return false;
 return r.tries===0?r.first===null&&r.latest===null&&r.rightAnswer===null:r.first!==null&&r.latest!==null;
}
const sides=r=>[...r.tray,...r.tray.filter(t=>object(t.flip)&&own(t.flip,'id')).map(t=>t.flip)];
function briefOk(b,r){
 if(!object(b)||!lineOk(b.line)||!placedOk(b.placed,sides(r),r.slots))return false;
 return Array.isArray(b.flipped)&&b.flipped.every(k=>r.tray.some(t=>t.id===k&&own(t,'flip')))&&new Set(b.flipped).size===b.flipped.length;
}
export function validBrief(r){
 if(!object(r)||!listOk(r.tray,true)||!listOk(r.slots)||!id(r.rev)||!count(r.checks)||typeof r.at!=='string')return false;
 if(new Set(sides(r).map(x=>x.id)).size!==sides(r).length)return false;
 for(const k of ['first','latest','rightBrief'])if(r[k]!==null&&!briefOk(r[k],r))return false;
 return r.checks===0?r.first===null&&r.latest===null&&r.rightBrief===null:r.first!==null&&r.latest!==null;
}
const sameIds=(a,b)=>a.length===b.length&&a.every(x=>b.some(y=>y.id===x.id));
// A kept record still means the same question only while its ids and grading revision match the module.
export function itemCurrent(r,item=itemById(r?.id)){return !!item&&r.rev===item.rev&&sameIds(r.options,item.options)&&sameIds(r.slots,item.slots||[]);}
export function briefCurrent(r){
 const b=designBrief;if(r.rev!==b.rev||!sameIds(r.slots,b.slots)||!sameIds(r.tray,b.tray))return false;
 return b.tray.every(t=>{const k=r.tray.find(x=>x.id===t.id);return own(t,'flip')===own(k,'flip')&&(!own(t,'flip')||own(t.flip,'id')===own(k.flip,'id')&&(!own(t.flip,'id')||t.flip.id===k.flip.id));});
}
// The view of the saved root.
export function designView(state){
 const present=object(state)&&own(state,'designTable'),root=present?state.designTable:null;
 if(present&&(!object(root)||root.v!==1))return {status:'unsupported',root};
 const taughtOk=!root||!own(root,'taught')||object(root.taught)&&Object.values(root.taught).every(x=>typeof x==='boolean');
 const items=root&&object(root.items)?root.items:{},itemsRaw=!!root&&own(root,'items')&&!object(root.items);
 const briefs=root&&object(root.briefs)?root.briefs:{},briefsRaw=!!root&&own(root,'briefs')&&!object(root.briefs);
 const view={status:root?'ready':'new',root,taught:{bags:taughtOk&&root?.taught?.bags===true,brief:taughtOk&&root?.taught?.brief===true},taughtOk,items:{},brief:null};
 for(const item of designItems){
  const kept=own(items,item.id),raw=kept?items[item.id]:null,readable=kept&&validItem(raw);
  view.items[item.id]={item,kept,record:readable?raw:null,status:itemsRaw||kept&&!readable?'unreadable':!kept?'new':'kept',writable:!itemsRaw&&(!kept||readable&&itemCurrent({...raw,id:item.id},item))};
 }
 const kept=own(briefs,designBrief.id),raw=kept?briefs[designBrief.id]:null,readable=kept&&validBrief(raw);
 view.brief={kept,record:readable?raw:null,status:briefsRaw||kept&&!readable?'unreadable':!kept?'new':'kept',writable:!briefsRaw&&(!kept||readable&&briefCurrent(raw))};
 return view;
}
export const tried=r=>!!r&&(r.tries>0||r.checks>0);
export function progress(view,station){
 if(view.status==='unsupported')return 0;
 let n=designItems.filter(x=>x.station===station&&tried(view.items[x.id].record)).length;
 if(station==='brief'&&tried(view.brief.record))n++;
 return n;
}
export const withHelp=view=>view.status!=='unsupported'&&Object.values(view.items).some(v=>v.record&&v.record.support!=='none');
// Grading with the current module.
export function gradeChoice(item,choiceId){const opt=item.options.find(x=>x.id===choiceId);if(!opt)return null;return {right:choiceId===item.right,line:{id:choiceId,text:item.lines[choiceId]}};}
// A5's field: null means not an answer (empty, decimal, negative or above 99) and writes nothing.
export function parseEntry(raw){const s=String(raw??'').trim();return /^\d{1,2}$/.test(s)?Number(s):null;}
export function gradeNumber(item,entry){const k=entry===item.answer?'right':item.notes[entry]||'other';return {right:k==='right',line:{id:k,text:item.lines[k]}};}
// placed: {optionId: slotId}.
export function gradeTags(item,placed){
 const l=k=>({right:k==='right',line:{id:k,text:item.lines[k]}});
 if(own(placed,item.single))return l('single-winner');
 const filled=new Set(Object.values(placed));if(item.slots.some(s=>!filled.has(s.id)))return l('empty');
 if(Object.entries(placed).some(([t,s])=>item.key[t]!==s))return l('wrong');
 return l('right');
}
export function gradeFrame(item,placed){
 const by=Object.fromEntries(Object.entries(placed).map(([c,g])=>[g,c]));
 if(!by.for||!by.data)return {right:false,line:{id:'empty',text:item.lines.empty}};
 if(item.pairs[by.for]!==by.data)return {right:false,line:{id:'mismatch',text:item.lines.mismatch}};
 return {right:true,line:{id:`right-${by.for}`,text:item.readBack[by.for]}};
}
export function gradeSort(item,placed){
 const l=k=>({right:k==='right',line:{id:k,text:item.lines[k]}});
 if(item.options.some(c=>!own(placed,c.id)))return l('unsorted');
 if(item.options.some(c=>item.key[c.id]!==placed[c.id]))return l('wrong');
 return l('right');
}
// The brief board: board {tileId: slotId} by tray id, flipped [tileId]. Returns the line and which placed vague tiles flip.
export const sideOf=(tile,flipped)=>flipped.includes(tile.id)&&object(tile.flip)&&own(tile.flip,'id')?tile.flip:tile;
export function gradeBrief(board,flipped){
 const b=designBrief,placed=b.tray.filter(t=>own(board,t.id)).map(t=>({tile:t,side:sideOf(t,flipped),slot:board[t.id]}));
 const l=(k,extra={})=>({right:k==='right',line:{id:k,text:b.lines[k]},...extra});
 // Every placed vague tile flips after the check, whichever line wins.
 const vague=placed.filter(p=>b.vague.includes(p.side.id)),flip=vague.map(p=>p.tile.id);
 if(placed.some(p=>p.side.id===b.solution))return l('solution',{flip});
 if(vague.length)return l(vague[0].side.id,{flip});
 if(placed.some(p=>b.belongs[p.side.id]==='musts'&&p.slot==='limits'||b.belongs[p.side.id]==='limits'&&p.slot==='musts'))return l('swap');
 if(placed.some(p=>b.belongs[p.side.id]!==p.slot))return l('wrong');
 const used=s=>placed.filter(p=>p.slot===s).length;
 if(b.slots.some(s=>used(s.id)<b.room[s.id]))return l('room');
 return l('right');
}
// Writes.
const failure=error=>({ok:false,error});
function mutate(state,fn,options={}){
 if(!object(state)||typeof options.canExport!=='function')return failure('capacity');
 try{const candidate=clone(state);if(!own(candidate,'designTable'))candidate.designTable={v:1,taught:{bags:false,brief:false},items:{},briefs:{}};
  const root=candidate.designTable;if(!object(root)||root.v!==1)return failure('unavailable');
  for(const k of ['items','briefs'])if(!own(root,k))root[k]={};else if(!object(root[k]))return failure('unavailable');
  const result=fn(root);if(!result.ok||result.changed===false)return result;
  if(!recoveryFitsProgressLimits(candidate))return failure('capacity');const proposal=clone(root);if(options.canExport(candidate)!==true)return failure('capacity');state.designTable=proposal;return result;
 }catch{return failure('capacity');}
}
const now=()=>new Date().toISOString();
const bump=n=>Math.min(9999,n+1);
export function startStation(state,station,options){
 if(!STATIONS.includes(station))return failure('selection');
 return mutate(state,root=>{
  if(!own(root,'taught'))root.taught={};if(!object(root.taught)||!Object.values(root.taught).every(x=>typeof x==='boolean'))return failure('unavailable');
  if(root.taught[station]===true)return {ok:true,changed:false};root.taught[station]=true;return {ok:true};
 },options);
}
const newRecord=item=>({prompt:item.prompt,explanation:item.explanation,options:clone(item.options),slots:clone(item.slots||[]),first:null,latest:null,rightAnswer:null,rev:item.rev,tries:0,support:'none',at:now()});
function itemWrite(state,itemId,fn,options){
 const item=itemById(itemId);if(!item)return failure('selection');
 return mutate(state,root=>{
  if(own(root.items,itemId)){const r=root.items[itemId];if(!validItem(r)||!itemCurrent(r,item))return failure('unavailable');return fn(r,item);}
  const r=newRecord(item),res=fn(r,item);if(res.ok&&res.changed!==false)root.items[itemId]=r;return res;
 },options);
}
const keptOpt=(r,k)=>clone(r.options.find(x=>x.id===k));
const keptSlot=(r,k)=>clone(r.slots.find(x=>x.id===k));
function record(r,answer,grade){
 if(r.first===null)r.first=clone(answer);r.latest=clone(answer);if(grade.right&&r.rightAnswer===null)r.rightAnswer=clone(answer);
 r.tries=bump(r.tries);r.at=now();return {ok:true,right:grade.right,line:answer.line};
}
// kind-specific answer: choice id, a whole number, or a placement map {optionId: slotId}.
export function answerItem(state,itemId,value,options){
 return itemWrite(state,itemId,(r,item)=>{
  let grade,answer;
  if(item.kind==='choice'){grade=gradeChoice(item,value);if(!grade)return failure('selection');answer={choice:keptOpt(r,value),entry:null,placed:null,line:grade.line};}
  else if(item.kind==='number'){if(!Number.isInteger(value)||value<0||value>99)return failure('selection');grade=gradeNumber(item,value);answer={choice:null,entry:value,placed:null,line:grade.line};}
  else{
   if(!object(value)||!Object.entries(value).every(([k,s])=>item.options.some(x=>x.id===k)&&item.slots.some(x=>x.id===s)))return failure('selection');
   grade=item.kind==='tags'?gradeTags(item,value):item.kind==='frame'?gradeFrame(item,value):gradeSort(item,value);
   answer={choice:null,entry:null,placed:r.options.filter(x=>own(value,x.id)).map(x=>({item:keptOpt(r,x.id),slot:keptSlot(r,value[x.id])})),line:grade.line};
  }
  return record(r,answer,grade);
 },options);
}
// Opening rung 1 or 2 raises support through preflight before its text shows.
export function openRung(state,itemId,rung,options){
 const item=itemById(itemId);if(!item?.ladder||![1,2].includes(rung))return failure('selection');
 const level=rung===1?'hint':'example';
 return itemWrite(state,itemId,r=>{if(SUPPORT.indexOf(r.support)>=SUPPORT.indexOf(level))return {ok:true,changed:false};r.support=level;r.at=now();return {ok:true};},options);
}
// Check my brief: records the board exactly as submitted, then names which vague tiles flip.
export function checkBrief(state,board,flipped,options){
 const b=designBrief;
 if(!object(board)||!Array.isArray(flipped)||!flipped.every(k=>b.vague.includes(k))||new Set(flipped).size!==flipped.length)return failure('selection');
 if(!Object.entries(board).every(([k,s])=>b.tray.some(t=>t.id===k)&&b.slots.some(x=>x.id===s)))return failure('selection');
 for(const s of b.slots)if(Object.values(board).filter(x=>x===s.id).length>b.room[s.id])return failure('selection');
 if(flipped.includes('nice')&&own(board,'nice'))return failure('selection');
 return mutate(state,root=>{
  let r=root.briefs[b.id];const fresh=!own(root.briefs,b.id);
  if(fresh)r={tray:clone(b.tray),slots:clone(b.slots),rev:b.rev,first:null,latest:null,rightBrief:null,checks:0,at:now()};
  else if(!validBrief(r)||!briefCurrent(r))return failure('unavailable');
  const grade=gradeBrief(board,flipped);
  const after=[...new Set([...flipped,...(grade.flip||[])])];
  const order=k=>{const i=b.cardOrder.indexOf(k);return i<0?99:i;};
  const placed=b.tray.filter(t=>own(board,t.id)).map(t=>({side:sideOf(t,flipped),slot:board[t.id]}))
   .sort((x,y)=>b.slots.findIndex(s=>s.id===x.slot)-b.slots.findIndex(s=>s.id===y.slot)||order(x.side.id)-order(y.side.id))
   .map(p=>({item:clone(sides(r).find(x=>x.id===p.side.id)),slot:clone(r.slots.find(x=>x.id===p.slot))}));
  const brief={placed,flipped:after,line:{id:grade.line.id,text:b.lines[grade.line.id]}};
  if(r.first===null)r.first=clone(brief);r.latest=clone(brief);if(grade.right&&r.rightBrief===null)r.rightBrief=clone(brief);
  r.checks=bump(r.checks);r.at=now();if(fresh)root.briefs[b.id]=r;
  return {ok:true,right:grade.right,line:brief.line,returned:grade.flip||[],flipped:after};
 },options);
}
// The read-back, from the kept right brief: the brief card's words in slot order.
export function briefReadBack(r,card){
 const rb=r.rightBrief;if(!rb)return null;
 return r.slots.map(s=>{const items=rb.placed.filter(p=>p.slot.id===s.id).map(p=>p.item.label.charAt(0).toLowerCase()+p.item.label.slice(1));const c=card[s.id];return {label:c?c.label:s.label,text:items.join(' · ')+(c?.end??'')};});
}
