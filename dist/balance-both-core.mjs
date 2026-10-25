import {bothCases,bothSource,bothPages,bothInputMessage} from './balance-both-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const clone=x=>structuredClone(x),obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b,str=(x,n=2000)=>typeof x==='string'&&x.length<=n;
const id=x=>str(x,80)&&/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(x)&&!['constructor','prototype','__proto__'].includes(x);
const relation=x=>['equal','left','right'].includes(x),bool=x=>typeof x==='boolean',nullableBool=x=>x===null||bool(x);
const flags=['learn','guided','hint','example','skip','reveal','together','audio'];
const support=x=>obj(x)&&flags.every(k=>bool(x[k]));
const draft=x=>str(x,12)&&/^[0-9 ]*$/.test(x);
const pair=p=>Array.isArray(p)&&p.length===2&&p.every(n=>int(n,0,99));
const lines=x=>Array.isArray(x)&&x.length<=12&&x.every(l=>obj(l)&&str(l.text)&&Array.isArray(l.facts)&&l.facts.length<=12&&l.facts.every(pair));
export const validBothLive=x=>obj(x)&&['left','right'].every(k=>obj(x[k])&&int(x[k].parcels,0,5)&&int(x[k].units,0,20)&&int(x[k].bags,0,3));
function liveFor(s,x){return validBothLive(x)&&['left','right'].every(k=>x[k].parcels+x[k].bags<=5&&x[k].units+x[k].bags*s.bagUnits<=20);}
export function validBothSource(s){return obj(s)&&s.version===1&&id(s.id)&&str(s.title,160)&&s.title.length>0&&str(s.question,1000)&&int(s.parcelMass,1,12)&&int(s.bagUnits,0,4)&&liveFor(s,s.start)&&lines(s.learn)&&s.learn.length>0&&lines(s.guided)&&str(s.hint)&&lines(s.example)&&str(s.suggested)&&str(s.skip);}
const modelShape=(m,max=80)=>obj(m)&&int(m.left,0,max)&&int(m.right,0,max)&&relation(m.relation);
const operations=['parcel-pair','unit-pair','open-left','open-right','parcel-left','parcel-right','unit-left','unit-right','share'];
const op=x=>obj(x)&&operations.includes(x.kind)&&(x.kind!=='share'||int(x.groups,2,5));
const row=x=>obj(x)&&validBothSource(x.source)&&liveFor(x.source,x.before)&&liveFor(x.source,x.after)&&op(x.operation)&&modelShape(x.model)&&str(x.feedback);
const input=x=>obj(x)&&validBothLive(x.live)&&draft(x.draft)&&draft(x.raw)&&Array.isArray(x.moves)&&x.moves.length<=64&&x.moves.every(row)&&int(x.learnSeen,1,12)&&bool(x.folded)&&int(x.helpStage,0,3)&&support(x.support)&&(x.groups===undefined||int(x.groups,2,5));
// Historical relation/value results are admitted by shape, never recomputed.
export function validBothCheck(c){return obj(c)&&['proposal','arrangement','skipped'].includes(c.kind)&&validBothSource(c.source)&&input(c.input)&&liveFor(c.source,c.input.live)&&modelShape(c.model)&&nullableBool(c.valueMatch)&&bool(c.isolated)&&(c.proposal===null||int(c.proposal,0,99))&&(c.proposedModel===null||modelShape(c.proposedModel,515))&&['value-fits','pan-total','several-parcels','try-substitution','arrangement','skipped'].includes(c.code)&&str(c.feedback);}
export function validBothWork(w){return obj(w)&&validBothSource(w.source)&&liveFor(w.source,w.live)&&bothPages.includes(w.page)&&(w.inspection===null||int(w.inspection,0,w.moves?.length-1))&&draft(w.draft)&&int(w.learnSeen,1,w.source.learn.length)&&bool(w.folded)&&int(w.helpStage,0,3)&&support(w.support)&&Array.isArray(w.moves)&&w.moves.length<=64&&w.moves.every(row)&&Array.isArray(w.checks)&&w.checks.length<=8&&w.checks.every(validBothCheck)&&(w.firstKept===null||validBothCheck(w.firstKept))&&str(w.feedback)&&(w.groups===undefined||int(w.groups,2,5))&&(w.keptView===undefined||['latest','first'].includes(w.keptView)||int(w.keptView,0,7));}
const wrapper=s=>obj(s?.balanceBoth)&&s.balanceBoth.version===1&&obj(s.balanceBoth.cases)&&str(s.balanceBoth.currentId,80);
export function bothView(state){
 const base={root:state?.balanceBoth,work:null,cases:bothCases.map(s=>({id:s.id,title:s.title}))};
 if(!Object.hasOwn(state,'balanceBoth'))return {...base,status:'missing'};
 if(!wrapper(state))return {...base,status:'unavailable'};
 const r=state.balanceBoth,cases=base.cases.map(c=>({...c,unreadable:Object.hasOwn(r.cases,c.id)&&!validBothWork(r.cases[c.id])}));
 for(const [key,w] of Object.entries(r.cases))if(id(key)&&!bothCases.some(c=>c.id===key))cases.push({id:key,title:validBothWork(w)?`Saved case: ${w.source.title}`:`Unreadable saved case: ${key}`,unreadable:!validBothWork(w)});
 const w=Object.hasOwn(r.cases,r.currentId)?r.cases[r.currentId]:null;
 return {...base,status:'ready',cases,work:validBothWork(w)?w:null};
}
const fits=(s,o)=>recoveryFitsProgressLimits(s)&&(!o.canExport||o.canExport(s)===true);
function qualify(s,o){const facts=bothFacts(s);if(facts.length)o.exposeFacts?.(facts,s);}
function change(state,fn,o={},exposure=false){try{if(Object.hasOwn(state,'balanceBoth')&&!wrapper(state))return false;const candidate=clone(state),result=fn(candidate);if(!result||!wrapper(candidate))return false;
 const facts=exposure?bothFacts(candidate):[];if(facts.length)o.exposeFacts?.(facts,candidate);if(!fits(candidate,o))return false;
 // The deterministic host helper is preflighted on the complete changed clone.
 // Apply it synchronously before committing this subtree, retaining host references.
 if(facts.length)o.exposeFacts?.(facts,state);state.balanceBoth=candidate.balanceBoth;return result;
 }catch{return false;}}
const workChange=(s,fn,o={},exposure=false)=>change(s,c=>{const w=bothView(c).work;return w?fn(w,c):false;},o,exposure);
export function startBoth(state,key,o={}){if(!id(key))return false;return change(state,c=>{c.balanceBoth??={version:1,currentId:'',cases:{}};const r=c.balanceBoth;if(Object.hasOwn(r.cases,key)){if(!validBothWork(r.cases[key]))return false;}else{const source=bothSource(key);if(!source)return false;r.cases[key]={source,live:clone(source.start),page:'balance',inspection:null,keptView:'latest',groups:2,draft:'',learnSeen:1,folded:false,helpStage:0,support:Object.fromEntries(flags.map(k=>[k,k==='learn'||k==='guided'&&source.guided.length>0])),moves:[],checks:[],firstKept:null,feedback:''};}r.currentId=key;return true;},o,true);}
export function bothModel(source,live,proposal=source?.parcelMass){if(!validBothSource(source)||!liveFor(source,live)||!int(proposal,0,99))return null;const totals=Object.fromEntries(['left','right'].map(k=>[k,(live[k].parcels+live[k].bags)*proposal+live[k].units+live[k].bags*source.bagUnits]));return {...totals,relation:totals.left===totals.right?'equal':totals.left>totals.right?'left':'right'};}
export function bothExpression(source,live,side){if(!validBothSource(source)||!liveFor(source,live)||!['left','right'].includes(side))return '';const s=live[side],parts=[];if(s.parcels)parts.push(`${s.parcels===1?'':s.parcels}P`);if(s.units)parts.push(String(s.units));if(s.bags)parts.push(`${s.bags}(P + ${source.bagUnits})`);return parts.join(' + ')||'0';}
export function bothSubstitution(source,value=source?.parcelMass){if(!validBothSource(source)||!int(value,0,99))return null;const expression=p=>{const parts=[];if(p.parcels)parts.push(p.parcels===1?String(value):`${p.parcels} × ${value}`);if(p.units)parts.push(String(p.units));if(p.bags)parts.push(`${p.bags} × (${value} + ${source.bagUnits})`);return parts.join(' + ')||'0';};return {left:expression(source.start.left),right:expression(source.start.right),model:bothModel(source,source.start,value)};}
export const bothRelationWords=r=>r==='equal'?'Both pans have the same model mass.':`The ${r} pan has greater model mass and is lower.`;
export function bothChange(source,live,operation){
 const refusal=feedback=>({ok:false,feedback});
 if(!validBothSource(source)||!liveFor(source,live)||!op(operation))return refusal('That move is unavailable. Your pans stay here.');
 const next={left:clone(live.left),right:clone(live.right)},{kind,groups}=operation,before=bothModel(source,live);let feedback='';
 if(kind==='share'){
  if(['left','right'].some(k=>next[k].bags))return refusal('Open the closed bags before making whole groups. Neither pan changed.');
  if(['left','right'].every(k=>next[k].parcels===0&&next[k].units===0))return refusal('The empty pans have no whole objects to share. Neither pan changed.');
  if(['left','right'].some(k=>next[k].parcels%groups||next[k].units%groups))return refusal(`The object counts cannot make ${groups} matching whole groups on each pan. No parcel or weight was split; neither pan changed.`);
  for(const k of ['left','right']){next[k].parcels/=groups;next[k].units/=groups;}
  feedback=`Each pan made ${groups} equal whole groups. Compare one group from each pan; the other ${groups-1} identical groups are set aside. No parcel was split.`;
 }else if(kind.startsWith('open-')){const k=kind.slice(5);if(!next[k].bags)return refusal(`There is no closed bag on the ${k} pan. Neither pan changed.`);next[k].bags--;next[k].parcels++;next[k].units+=source.bagUnits;feedback=`Opened one ${k} bag into one whole parcel and ${source.bagUnits} units. Its mass stays the same.`;
 }else{const [what,which]=kind.split('-'),field=what==='parcel'?'parcels':'units',targets=which==='pair'?['left','right']:[which];if(targets.some(k=>!next[k][field]))return refusal(`Remove only available loose ${field}. Open bags to reach their contents. Neither pan changed.`);for(const k of targets)next[k][field]--;feedback=which==='pair'?`Took one matching ${what} off each pan. Removing the same mass preserves the relation.`:`Took one ${what} off the ${which} pan only. This is a reversible one-pan experiment; Undo can restore it.`;}
 const model=bothModel(source,next);return {ok:true,live:next,before,model,feedback:`${feedback} ${bothRelationWords(model.relation)}${kind==='share'&&before.relation!=='equal'?' Sharing preserves the direction of the difference; it does not repair the earlier unequal balance.':''}`};
}
export function moveBoth(state,operation,o={}){let refusal={ok:false,feedback:'This saved case is view-only. Try notes or another place.'};const result=workChange(state,w=>{if(w.inspection!==null){refusal={ok:false,feedback:'Earlier line: return to the current picture before moving.'};return false;}if(w.moves.length>=64){refusal={ok:false,feedback:'This live path is full. Undo a move or return to start.'};return false;}const r=bothChange(w.source,w.live,operation);if(!r.ok){refusal=r;return false;}w.moves.push({source:clone(w.source),before:clone(w.live),after:clone(r.live),operation:clone(operation),model:clone(r.model),feedback:r.feedback});w.live=r.live;w.feedback=r.feedback;return r;},o);return result||refusal;}
export const undoBoth=(s,o={})=>workChange(s,w=>{if(w.inspection!==null||!w.moves.length)return false;w.live=clone(w.moves.pop().before);w.feedback='Last move undone. The preceding picture is current again.';return true;},o);
export const resetBoth=(s,o={})=>workChange(s,w=>{w.live=clone(w.source.start);w.moves=[];w.inspection=null;w.draft='';w.feedback='Returned to the starting pans. Earlier help and kept checks remain.';return true;},o);
export const setBothPage=(s,page,o={})=>bothPages.includes(page)&&workChange(s,w=>{w.page=page;return true;},o,true);
export const setBothInspection=(s,index,o={})=>workChange(s,w=>{if(index!==null&&!int(index,0,w.moves.length-1))return false;w.inspection=index;w.page='balance';return true;},o,true);
// A stale selection falls back to the latest readable check without repairing
// or rewriting the saved selection, source or historical observations.
export function selectedBothCheck(w){const latest=Array.isArray(w?.checks)?w.checks.findLast(validBothCheck)||null:null,key=w?.keptView??'latest';if(key==='first'&&validBothCheck(w?.firstKept))return w.firstKept;if(int(key,0,7)&&validBothCheck(w?.checks?.[key]))return w.checks[key];return latest;}
export const setBothKeptView=(s,key,o={})=>workChange(s,w=>{if(!(['latest','first'].includes(key)||int(key,0,7)))return false;const check=key==='first'?w.firstKept:key==='latest'?w.checks.at(-1):w.checks[key];if(!validBothCheck(check))return false;w.keptView=key;w.page='kept';return true;},o,true);
export const setBothGroups=(s,n,o={})=>int(n,2,5)&&workChange(s,w=>{w.groups=n;return true;},o);
export const setBothDraft=(s,raw,o={})=>draft(raw)&&workChange(s,w=>{w.draft=raw;return true;},o);
export const advanceBothLearn=(s,o={})=>workChange(s,w=>{if(w.learnSeen>=w.source.learn.length)return false;w.learnSeen++;w.support.learn=true;return true;},o,true);
export const setBothFolded=(s,folded,o={})=>bool(folded)&&workChange(s,w=>{w.folded=folded;if(!folded){w.support.learn=true;if(w.source.guided.length)w.support.guided=true;}return true;},o,true);
const snapshotInput=(w,raw=w.draft)=>({live:clone(w.live),draft:raw,raw,groups:w.groups??2,moves:clone(w.moves),learnSeen:w.learnSeen,folded:w.folded,helpStage:w.helpStage,support:clone(w.support)});
export const bothHelp=(s,o={})=>workChange(s,w=>{w.helpStage=w.helpStage===3?1:w.helpStage+1;w.support[w.helpStage===1?'hint':w.helpStage===2?'example':'skip']=true;w.feedback=w.helpStage===1?w.source.hint:w.helpStage===2?w.source.suggested:w.source.skip;
 if(w.helpStage===3){w.keptView='latest';const evicted=w.checks.length===8;w.checks=[...w.checks,{kind:'skipped',source:clone(w.source),input:snapshotInput(w),model:bothModel(w.source,w.live),valueMatch:null,isolated:bothIsolated(w.source,w.live),proposal:null,proposedModel:null,code:'skipped',feedback:w.source.skip}].slice(-8);if(evicted)w.feedback+=' The oldest readable check was removed; the first kept check remains.';}return true;},o,true);
export const revealBoth=(s,o={})=>workChange(s,w=>{w.support.reveal=true;return true;},o,true);
export const noteBothSupport=(s,kind,o={})=>['together','audio'].includes(kind)&&workChange(s,w=>{w.support[kind]=true;return true;},o,true);
export const bothInteger=raw=>draft(raw)&&/^[0-9]+$/.test(raw.trim())&&int(Number(raw.trim()),0,99)?Number(raw.trim()):null;
export function bothIsolated(source,live){const m=bothModel(source,live);return !!m&&m.relation==='equal'&&['left','right'].some(k=>{const a=live[k],b=live[k==='left'?'right':'left'];return a.parcels===1&&a.units===0&&a.bags===0&&b.parcels===0&&b.bags===0;});}
function residual(source,live,n){if(bothModel(source,live).relation!=='equal')return null;for(const k of ['left','right']){const a=live[k],b=live[k==='left'?'right':'left'];if(a.parcels>=2&&a.units===0&&a.bags===0&&b.parcels===0&&b.bags===0&&b.units===n)return a.parcels;}return null;}
export function checkBoth(state,request,o={}){
 const w=bothView(state).work,raw=request?.raw,kind=request?.kind;
 if(!w)return {recorded:false,feedback:'This saved case is view-only. Try notes or another place.'};
 if(!['proposal','arrangement'].includes(kind)||!draft(raw)||(raw.trim()===''?kind!=='arrangement':bothInteger(raw)===null))return {recorded:false,code:'input',feedback:bothInputMessage};
 const result=workChange(state,c=>{const proposal=raw.trim()===''?null:bothInteger(raw),model=bothModel(c.source,c.live),valueMatch=proposal===null?null:proposal===c.source.parcelMass,proposedModel=proposal===null?null:bothModel(c.source,c.source.start,proposal),start=bothModel(c.source,c.source.start);let code='arrangement',feedback='Arrangement kept. No value was proposed, so value-match remains unobserved.';
 if(proposal!==null){const n=residual(c.source,c.live,proposal);if(valueMatch){code='value-fits';feedback=`This P fits the original model. Substituting P = ${proposal} gives ${proposedModel.left} and ${proposedModel.right}: ${bothRelationWords(proposedModel.relation)}`;}else if(proposal===start.left||proposal===start.right){code='pan-total';feedback='That is a whole pan’s model mass. P names just one sealed parcel; loose units and other parcels count separately.';}else if(n){code='several-parcels';feedback=`Those units balance ${n} matching parcels. Share both sides into ${n} equal groups to find one parcel.`;}else{code='try-substitution';feedback=`Try this P in the starting relation. The two proposed totals are ${proposedModel.left} and ${proposedModel.right}: ${bothRelationWords(proposedModel.relation)} This idea differs from the source’s fixed parcel mass.`;}}
 if(start.relation!=='equal')feedback+=' This saved starting arrangement is not level under its fixed model mass; compare the model and proposed relation separately.';
 const record={kind,source:clone(c.source),input:snapshotInput(c,raw),model,valueMatch,isolated:bothIsolated(c.source,c.live),proposal,proposedModel,code,feedback};
 const evicted=c.checks.length===8;c.checks=[...c.checks,record].slice(-8);c.firstKept??=clone(record);c.draft=raw;c.feedback=feedback;c.page='kept';c.keptView='latest';return {recorded:true,...clone(record),evicted,feedback:feedback+(evicted?' The oldest readable check was removed; the first kept check remains.':'')};},o,true);
 return result||{recorded:false,feedback:'This check could not be saved. Your earlier work stays here; open notes or another place.'};
}
export function bothCheckMatches(w,c=w?.checks?.at(-1)){return !!c&&JSON.stringify(c.source)===JSON.stringify(w.source)&&JSON.stringify(c.input)===JSON.stringify(snapshotInput(w));}
function sourceProducts(s,value=s.parcelMass){const pairs=[];for(const k of ['left','right']){const p=s.start[k];if(p.parcels>1)pairs.push([p.parcels,value]);if(p.bags)pairs.push([p.bags,value+s.bagUnits]);}return pairs;}
// Only products in content actually visible on the selected page qualify facts.
export function bothFacts(state){const w=bothView(state).work;if(!w)return [];const pairs=[];
 if(w.page==='balance'&&w.inspection===null){if(!w.folded){for(const l of w.source.learn.slice(0,w.learnSeen))pairs.push(...l.facts);if(w.support.guided)for(const l of w.source.guided)pairs.push(...l.facts);}if(w.helpStage===2)for(const l of w.source.example)pairs.push(...l.facts);if(w.support.reveal)pairs.push(...sourceProducts(w.source));}
 if(w.page==='kept'){const c=selectedBothCheck(w);if(c&&c.proposal!==null)pairs.push(...sourceProducts(c.source,c.proposal));}
 return [...new Map(pairs.map(p=>[p.join('x'),p])).values()].map(p=>[...p]);}
export function prepareBothDisplay(state,o={}){try{if(!bothView(state).work)return {ok:true,changed:false};const candidate=clone(state);qualify(candidate,o);if(!fits(candidate,o))return {ok:false,changed:false};const before=JSON.stringify(state);qualify(state,o);return {ok:true,changed:JSON.stringify(state)!==before};}catch{return {ok:false,changed:false};}}
