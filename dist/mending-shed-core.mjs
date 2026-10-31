// Spec 332: the Mending Shed's saved root, Check rules and Shape Bench tries.
import {mendingCopy,pileCards,chips,checkLines,predictChips,actions,samples,outcomeChip,resultLines} from './mending-shed-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),clone=structuredClone;
const id=x=>typeof x==='string'&&/^[a-z0-9-]{1,40}$/.test(x);
const label=x=>typeof x==='string'&&x.length>=1&&x.length<=200;
const count=x=>Number.isInteger(x)&&x>=0&&x<=9999;
const stamp=x=>typeof x==='string'&&x.length>=1&&x.length<=40;
const chip=x=>object(x)&&id(x.id)&&label(x.label);
const named=x=>object(x)&&id(x.id)&&label(x.text);
const lineIds=Object.freeze({objectInMaterials:'object-in-materials',materialInObject:'material-in-object',objectEmpty:'object-empty',wrongObject:'wrong-object',wrongMaterial:'wrong-material',materialsEmpty:'materials-empty',missingMaterial:'missing-material',right:'right'});
export const benches=Object.freeze(['pile','shapes']);
function validTray(t){return Array.isArray(t)&&t.length>=2&&t.length<=12&&t.every(chip)&&new Set(t.map(c=>c.id)).size===t.length;}
function validCheck(c,tray){
 if(!object(c)||!Array.isArray(c.materials)||!named(c.line))return false;
 const inTray=x=>chip(x)&&tray.some(t=>t.id===x.id),ids=c.materials.map(m=>m?.id);
 return (c.object===null||inTray(c.object))&&c.materials.every(inTray)&&new Set(ids).size===ids.length&&!(c.object&&ids.includes(c.object.id));
}
const validTry=t=>object(t)&&chip(t.predicted)&&chip(t.shown)&&label(t.result)&&label(t.prediction);
function evidence(r,n,ok,extra=[]){
 if(!count(r[n])||typeof r.supported!=='boolean'||!stamp(r.at))return false;
 const keys=['first','latest',...extra];
 if(r[n]===0)return keys.every(k=>r[k]===null);
 return ok(r.first)&&ok(r.latest)&&extra.every(k=>r[k]===null||ok(r[k]));
}
export const validPileRecord=r=>object(r)&&label(r.card)&&validTray(r.tray)&&evidence(r,'checks',c=>validCheck(c,r.tray),['sortedCheck']);
export const validShapeCell=r=>object(r)&&label(r.action)&&evidence(r,'tries',validTry);
const validSample=r=>object(r)&&label(r.sample)&&object(r.actions);
const validTaught=t=>object(t)&&typeof t.pile==='boolean'&&typeof t.shapes==='boolean';
const contentTray=c=>c.tray.map(k=>({id:k,label:chips[k].label}));
// A kept card stays checkable only while its kept tray can still express a right answer under the current rules.
function checkable(card,record){
 if(!card)return false;if(!record)return true;
 const kept=new Set(record.tray.map(c=>c.id));
 return record.tray.every(c=>chips[c.id])&&[card.object,...card.needs].every(k=>kept.has(k));
}
export function mendingShedView(state){
 const blank={status:'new',root:null,taught:{pile:false,shapes:false},taughtStatus:'ready',pileStatus:'ready',shapesStatus:'ready',cards:[],samples:[],actions:[],sorted:0,tried:0,helped:false};
 const present=object(state)&&own(state,'mendingShed'),r=present?state.mendingShed:null;
 if(present&&(!object(r)||r.v!==1))return {...blank,status:'unsupported',root:r};
 const taughtStatus=!r||!own(r,'taught')?'ready':validTaught(r.taught)?'ready':'unreadable',taught=taughtStatus==='ready'&&r&&own(r,'taught')?r.taught:{pile:false,shapes:false};
 const pileStatus=!r||!own(r,'pile')||object(r.pile)?'ready':'unreadable',shapesStatus=!r||!own(r,'shapes')||object(r.shapes)?'ready':'unreadable';
 const pile=pileStatus==='ready'&&r&&object(r.pile)?r.pile:{},shapes=shapesStatus==='ready'&&r&&object(r.shapes)?r.shapes:{};
 const cardIds=[...pileCards.map(c=>c.id),...Object.keys(pile).filter(k=>!pileCards.some(c=>c.id===k))];
 const cards=cardIds.map(key=>{
  const content=pileCards.find(c=>c.id===key)??null,kept=own(pile,key),raw=kept?pile[key]:null;
  const status=pileStatus!=='ready'||!id(key)?'unreadable':!kept?'new':validPileRecord(raw)?'ready':'unreadable',record=status==='ready'?raw:null;
  const editable=pileStatus==='ready'&&status!=='unreadable'&&checkable(content,record);
  return {id:key,content,status,record,raw,label:record?record.card:content?.label??key,tray:record?record.tray:content?contentTray(content):[],editable,sorted:!!record?.sortedCheck,guided:key==='metal-bucket'};
 });
 const sampleIds=[...samples.map(s=>s.id),...Object.keys(shapes).filter(k=>!samples.some(s=>s.id===k))];
 const actionIds=[...actions.map(a=>a.id)];
 for(const k of sampleIds){const s=shapes[k];if(validSample(s))for(const a of Object.keys(s.actions))if(!actionIds.includes(a))actionIds.push(a);}
 const cellOf=(sid,aid)=>{
  const content=samples.find(s=>s.id===sid)&&actions.find(a=>a.id===aid),sr=own(shapes,sid)?shapes[sid]:undefined;
  if(sr!==undefined&&(!validSample(sr)||!id(sid))||!id(aid))return {status:'unreadable',record:null,editable:false};
  const kept=sr!==undefined&&own(sr.actions,aid),raw=kept?sr.actions[aid]:null,status=shapesStatus!=='ready'?'unreadable':!kept?'new':validShapeCell(raw)?'ready':'unreadable';
  return {status,record:status==='ready'?raw:null,editable:shapesStatus==='ready'&&status!=='unreadable'&&!!content,actionLabel:status==='ready'?raw.action:null};
 };
 const sampleRows=sampleIds.map(sid=>{const content=samples.find(s=>s.id===sid)??null,sr=shapes[sid],kept=validSample(sr);
  return {id:sid,content,label:kept?sr.sample:content?.label??sid,status:own(shapes,sid)&&(!kept||!id(sid))?'unreadable':'ready',cells:Object.fromEntries(actionIds.map(a=>[a,cellOf(sid,a)]))};});
 const actionRows=actionIds.map(aid=>{const content=actions.find(a=>a.id===aid)??null;let kept=null;for(const s of sampleRows)if(s.cells[aid].actionLabel){kept=s.cells[aid].actionLabel;break;}return {id:aid,content,label:kept??content?.label??aid};});
 const sorted=cards.filter(c=>c.content&&c.sorted).length;
 const tried=sampleRows.filter(s=>s.content).reduce((n,s)=>n+actions.filter(a=>s.cells[a.id].record?.tries>0).length,0);
 const helped=cards.some(c=>c.record?.supported)||sampleRows.some(s=>Object.values(s.cells).some(c=>c.record?.supported));
 return {status:r?'ready':'new',root:r,taught,taughtStatus,pileStatus,shapesStatus,cards,samples:sampleRows,actions:actionRows,sorted,tried,helped};
}
const failure=error=>({ok:false,error});
// Every unreadable part of a view, so a write can prove it leaves readable work readable.
function unreadable(v){const out=new Set();if(v.status==='unsupported')out.add('root');if(v.taughtStatus!=='ready')out.add('taught');for(const c of v.cards)if(c.status==='unreadable')out.add('card:'+c.id);for(const s of v.samples){if(s.status==='unreadable')out.add('sample:'+s.id);for(const [a,c] of Object.entries(s.cells))if(c.status==='unreadable')out.add(`cell:${s.id}:${a}`);}return out;}
function mutate(state,fn,options={}){
 if(!object(state)||typeof options.canExport!=='function')return failure('capacity');
 try{const candidate=clone(state);if(!own(candidate,'mendingShed'))candidate.mendingShed={v:1,taught:{pile:false,shapes:false},pile:{},shapes:{}};
  const r=candidate.mendingShed;if(!object(r)||r.v!==1)return failure('unavailable');const result=fn(r,candidate);if(!result.ok||result.changed===false)return result;
  const before=unreadable(mendingShedView(state));for(const k of unreadable(mendingShedView(candidate)))if(!before.has(k))return failure('unavailable');
  if(!recoveryFitsProgressLimits(candidate))return failure('capacity');const proposal=clone(r);if(options.canExport(candidate)!==true)return failure('capacity');state.mendingShed=proposal;return result;
 }catch{return failure('capacity');}
}
const now=()=>new Date().toISOString();
const cap=n=>Math.min(9999,n+1);
export function startMendingBench(state,bench,options){return mutate(state,r=>{
 if(!benches.includes(bench))return failure('selection');if(!own(r,'taught'))r.taught={pile:false,shapes:false};if(!validTaught(r.taught))return failure('unavailable');
 if(r.taught[bench])return {ok:true,changed:false};r.taught[bench]=true;return {ok:true};
},options);}
const titleCase=s=>s.charAt(0).toUpperCase()+s.slice(1);
const joinAnd=list=>list.length<2?list.join(''):list.slice(0,-1).join(', ')+' and '+list.at(-1);
// Work is {object: chipId|null, materials:[chipId]}, each id from the tray shown.
export function mendingCheck(card,tray,work){
 if(!object(work)||!Array.isArray(work.materials))return null;
 const byId=Object.fromEntries(tray.map(c=>[c.id,c])),o=work.object??null,m=work.materials;
 if(o!==null&&!byId[o]||m.some(k=>!byId[k])||new Set(m).size!==m.length||o!==null&&m.includes(o))return null;
 if(m.some(k=>!chips[k])||o!==null&&!chips[o])return null;
 const kind=k=>chips[k].kind,ok=new Set([...card.needs,...card.also]),objectLabel=byId[card.object]?.label??chips[card.object].label;
 const line=key=>({id:lineIds[key],text:checkLines[key].replace('{Object}',titleCase(objectLabel))});
 let result;
 if(m.some(k=>kind(k)==='object'))result=line('objectInMaterials');
 else if(o!==null&&kind(o)==='material')result=line('materialInObject');
 else if(o===null)result=line('objectEmpty');
 else if(o!==card.object)result=line('wrongObject');
 else if(m.some(k=>!ok.has(k)))result=line('wrongMaterial');
 else if(!m.length)result=line('materialsEmpty');
 else if(card.needs.some(k=>!m.includes(k)))result=line('missingMaterial');
 else result={id:lineIds.right,text:checkLines.right.replace('{object}',byId[o].label).replace('{materials}',joinAnd(m.map(k=>byId[k].label)))};
 return {object:o===null?null:clone(byId[o]),materials:m.map(k=>clone(byId[k])),line:result};
}
export const rightCheck=c=>c?.line?.id===lineIds.right;
function pileEntry(r,key,candidate){
 const v=mendingShedView(candidate),c=v.cards.find(x=>x.id===key);
 if(!c||!c.content||!c.editable)return null;
 if(!own(r,'pile'))r.pile={};
 if(!own(r.pile,key))r.pile[key]={card:c.content.label,tray:contentTray(c.content),first:null,latest:null,sortedCheck:null,checks:0,supported:false,at:now()};
 return {record:r.pile[key],card:c.content};
}
export function checkMendingCard(state,key,work,options){return mutate(state,(r,candidate)=>{
 if(!id(key))return failure('selection');const e=pileEntry(r,key,candidate);if(!e)return failure('unavailable');
 const check=mendingCheck(e.card,e.record.tray,work);if(!check)return failure('selection');
 const rec=e.record;if(rec.first===null)rec.first=clone(check);rec.latest=clone(check);
 if(rec.sortedCheck===null&&rightCheck(check))rec.sortedCheck=clone(check);rec.checks=cap(rec.checks);rec.at=now();
 return {ok:true,check,right:rightCheck(check)};
},options);}
export function shapeTry(sample,action,predictId){
 const outcome=sample?.outcomes?.[action?.id],predict=predictChips.find(p=>p.id===predictId);if(!outcome||!predict)return null;
 const shownChip=predictChips.find(p=>p.id===outcomeChip[outcome]);
 return {predicted:{id:predict.id,label:predict.label},shown:{id:outcome,label:shownChip.label},result:resultLines[outcome].replace('{sample}',sample.material),prediction:outcomeChip[outcome]===predict.id?mendingCopy.matched:mendingCopy.surprise};
}
function cellEntry(r,sid,aid,candidate){
 const v=mendingShedView(candidate),s=v.samples.find(x=>x.id===sid),cell=s?.cells[aid];
 if(!s||!s.content||!cell||!cell.editable)return null;const action=actions.find(a=>a.id===aid);
 if(!own(r,'shapes'))r.shapes={};if(!own(r.shapes,sid))r.shapes[sid]={sample:s.content.label,actions:{}};
 const sr=r.shapes[sid];if(!own(sr.actions,aid))sr.actions[aid]={action:action.label,first:null,latest:null,tries:0,supported:false,at:now()};
 return {record:sr.actions[aid],sample:s.content,action};
}
export function letGoMendingShape(state,sid,aid,predictId,options){return mutate(state,(r,candidate)=>{
 if(!id(sid)||!id(aid))return failure('selection');if(!predictChips.some(p=>p.id===predictId))return failure('selection');
 const e=cellEntry(r,sid,aid,candidate);if(!e)return failure('unavailable');const t=shapeTry(e.sample,e.action,predictId);if(!t)return failure('unavailable');
 const rec=e.record;if(rec.first===null)rec.first=clone(t);rec.latest=clone(t);rec.tries=cap(rec.tries);rec.at=now();return {ok:true,try:t};
},options);}
// Opening a ladder rung marks the current item supported, and may write a support-only record.
export function supportMending(state,target,options){return mutate(state,(r,candidate)=>{
 const e=target?.bench==='pile'&&id(target.card)?pileEntry(r,target.card,candidate):target?.bench==='shapes'&&id(target.sample)&&id(target.action)?cellEntry(r,target.sample,target.action,candidate):null;
 if(!e)return failure('unavailable');if(e.record.supported)return {ok:true,changed:false};e.record.supported=true;e.record.at=now();return {ok:true};
},options);}
export function mendingShedSummary(v){
 const fill=(s,n)=>s.replace('{n}',String(n));
 return {pile:fill(mendingCopy.pileProgress,v.sorted),shapes:fill(mendingCopy.shapesProgress,v.tried),grownUp:mendingCopy.grownUpLine.replace('{n}',String(v.sorted)).replace('{m}',String(v.tried)).replace('{help}',v.helped?mendingCopy.withHelp:'')};
}
