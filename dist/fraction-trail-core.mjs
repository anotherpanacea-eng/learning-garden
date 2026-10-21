import {trailCases,trailCase,trailPages,trailHelpTopics,trailExample} from './fraction-trail-content.mjs';
const clone=x=>JSON.parse(JSON.stringify(x)),obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),keys=(x,ks)=>obj(x)&&Object.keys(x).sort().join(',')===ks.slice().sort().join(','),same=(a,b)=>a===b||Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>same(x,b[i]))||obj(a)&&obj(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&same(a[k],b[k]));
export const trailKinds=['spaces','stop','reading'];
export const trailSupport=['visualModel','suppliedInitialPartition','handling','suppliedPartition','example','units','boundaries','changedWhole','currentPreparation','narration','together',...trailKinds.map(k=>`feedback:${k}`)];
const list=(x,allow)=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(allow);
const supports=x=>list(x,s=>trailSupport.includes(s));
const validCuts=x=>Array.isArray(x)&&x.every((v,i)=>Number.isInteger(v)&&v>0&&v<12&&(!i||x[i-1]<v));
export function trailBoundaries(cuts){return [0,...cuts,12,...cuts.map(x=>x+12),24];}
export function parseTrailReading(raw){
 if(typeof raw!=='string'||raw.length>24)return null;
 const s=raw.trim(),m=/^([0-9]+)(?: *\/ *([0-9]+))?$/.exec(s);
 if(!m)return null;const numerator=Number(m[1]),denominator=m[2]===undefined?1:Number(m[2]);
 return Number.isInteger(numerator)&&numerator<=48&&Number.isInteger(denominator)&&denominator>=1&&denominator<=24?{numerator,denominator}:null;
}
function model(source,cuts,markerIndex,readingText){
 const boundaries=trailBoundaries(cuts),first=[0,...cuts,12],intervals=first.slice(1).map((x,i)=>x-first[i]),spaceCount=intervals.length,equalSpaces=intervals.every(x=>x===intervals[0]),spaceCountMatches=source.allowedSpaces.includes(spaceCount),partitionMatches=spaceCountMatches&&equalSpaces,flagTicks=markerIndex===null?null:boundaries[markerIndex],pointMatches=flagTicks!==null&&flagTicks*source.target.denominator===source.target.numerator*12,reading=parseTrailReading(readingText);
 return {boundaries,intervals,spaceCount,equalSpaces,spaceCountMatches,partitionMatches,flagTicks,pointMatches,ready:partitionMatches&&pointMatches,reading};
}
function outcome(kind,s){const m=model(s.source,s.cuts,s.markerIndex,s.readingText);return kind==='spaces'?{spaceCountMatches:m.spaceCountMatches,equalSpaces:m.equalSpaces}:kind==='stop'?{flagPresent:s.markerIndex!==null,pointMatches:m.pointMatches,partitionMatches:m.partitionMatches}:{readingMatches:!!m.reading&&m.flagTicks!==null&&m.reading.numerator*12===m.flagTicks*m.reading.denominator};}
function freshCase(source){return {source:clone(source),cuts:[...source.initialCuts],markerIndex:null,readingText:'',helpTopic:null,exampleStep:0,support:['visualModel',...(source.initialCuts.length?['suppliedInitialPartition']:[])],checkedKinds:{spaces:false,stop:false,reading:false},currentFeedback:{spaces:null,stop:null,reading:null},inputError:null,history:[],nextCheckId:1,kept:null,familiar:false};}
const fresh=()=>({version:1,currentCase:trailCases[0].id,page:'build',cases:{[trailCases[0].id]:freshCase(trailCases[0])}});
function validSource(s){const c=trailCase(s?.id);return !!c&&keys(s,Object.keys(c))&&typeof s.title==='string'&&typeof s.request==='string'&&same({...s,title:c.title,request:c.request},c);}
const validModel=s=>validCuts(s.cuts)&&(s.markerIndex===null||Number.isInteger(s.markerIndex)&&s.markerIndex>=0&&s.markerIndex<trailBoundaries(s.cuts).length)&&typeof s.readingText==='string'&&s.readingText.length<=24;
const snapshot=w=>({source:clone(w.source),cuts:[...w.cuts],markerIndex:w.markerIndex,readingText:w.readingText,support:[...w.support]});
function validSnapshot(s,w){return validSource(s.source)&&s.source.id===w.source.id&&same(s.source,w.source)&&validModel(s)&&supports(s.support)&&s.support.every(k=>w.support.includes(k))&&s.support.includes('visualModel')&&(!s.source.initialCuts.length||s.support.includes('suppliedInitialPartition'));}
function relevant(kind,a,b){return same(a.cuts,b.cuts)&&(kind==='spaces'||a.markerIndex===b.markerIndex)&&(kind!=='reading'||a.readingText===b.readingText);}
const workKeys=['source','cuts','markerIndex','readingText','helpTopic','exampleStep','support','checkedKinds','currentFeedback','inputError','history','nextCheckId','kept','familiar'];
function validWork(w,id,unknown){
 if(!keys(w,workKeys)||w.source?.id!==id||!validSnapshot(w,w)||!(w.helpTopic===null||trailHelpTopics.includes(w.helpTopic))||!Number.isInteger(w.exampleStep)||w.exampleStep<0||w.exampleStep>4||typeof w.familiar!=='boolean'||!keys(w.checkedKinds,trailKinds)||!keys(w.currentFeedback,trailKinds)||!trailKinds.every(k=>typeof w.checkedKinds[k]==='boolean')||!(w.inputError===null||['Start the flag before checking its reading.','Enter a whole number or a fraction such as 1/2.'].includes(w.inputError))||!Array.isArray(w.history)||w.history.length>24||!Number.isInteger(w.nextCheckId)||w.nextCheckId<1)return false;
 if(w.exampleStep>0&&!w.support.includes('example')||w.helpTopic&&!w.support.includes(w.helpTopic==='changed-whole'?'changedWhole':w.helpTopic)||w.inputError==='Start the flag before checking its reading.'&&w.markerIndex!==null||w.inputError==='Enter a whole number or a fraction such as 1/2.'&&(w.markerIndex===null||parseTrailReading(w.readingText)))return false;
 let previous=0,previousSnapshot=null;const seen=new Set();
 for(const h of w.history){
  if(!keys(h,['id','kind','source','cuts','markerIndex','readingText','support','outcomes','familiar','checkedPreviously','priorExposureUnknown'])||!Number.isInteger(h.id)||h.id<=previous||h.id>=w.nextCheckId||!trailKinds.includes(h.kind)||!validSnapshot(h,w)||typeof h.familiar!=='boolean'||typeof h.checkedPreviously!=='boolean'||h.priorExposureUnknown!==unknown||!same(h.outcomes,outcome(h.kind,h))||h.kind==='reading'&&(h.markerIndex===null||!parseTrailReading(h.readingText))||!h.checkedPreviously&&seen.has(h.kind)||h.checkedPreviously&&!h.support.includes(`feedback:${h.kind}`)||!h.checkedPreviously&&h.support.includes(`feedback:${h.kind}`))return false;
  if(h.id===1&&h.checkedPreviously||previousSnapshot&&(!previousSnapshot.support.every(s=>h.support.includes(s))||previousSnapshot.familiar&&!h.familiar)||h.id===previous+1&&previous>0&&h.checkedPreviously!==seen.has(h.kind)&&w.history[0].id===1)return false;
  for(const k of trailKinds){if(seen.has(k)&&!h.support.includes(`feedback:${k}`))return false;if(w.nextCheckId<=25&&h.support.includes(`feedback:${k}`)!==seen.has(k))return false;}
  if(w.nextCheckId<=25&&h.id!==previous+1||h.familiar&&!w.familiar)return false;
  if(!h.checkedPreviously&&!seen.has(h.kind)&&h.id!==1&&w.history.length===w.nextCheckId-1&&w.history.some(p=>p.id<h.id&&p.kind===h.kind))return false;
  previous=h.id;previousSnapshot=h;seen.add(h.kind);
 }
 if(w.nextCheckId!==previous+1||w.history.length<Math.min(24,w.nextCheckId-1))return false;
 for(const k of trailKinds){const latest=w.history.filter(h=>h.kind===k).at(-1),selector=w.currentFeedback[k];if(w.checkedKinds[k]!==!!latest||w.support.includes(`feedback:${k}`)!==!!latest||selector!==null&&(!latest||selector!==latest.id||!relevant(k,latest,w)))return false;}
 if(w.kept!==null){const k=w.kept;if(!keys(k,['source','cuts','markerIndex','readingText','support','ready','priorExposureUnknown'])||!validSnapshot(k,w)||k.priorExposureUnknown!==unknown||k.ready!==model(k.source,k.cuts,k.markerIndex,k.readingText).ready)return false;}
 return true;
}
export function validTrail(root){
 if(!obj(root)||!keys(root,['version','currentCase','page','cases',...(Object.hasOwn(root,'recovered')?['recovered']:[])])||root.version!==1||!trailCase(root.currentCase)||!trailPages.includes(root.page)||!obj(root.cases)||!Object.hasOwn(root.cases,root.currentCase))return false;
 return Object.entries(root.cases).every(([id,w])=>!!trailCase(id)&&validWork(w,id,Object.hasOwn(root,'recovered')));
}
export function trailState(state){return !Object.hasOwn(state,'fractionTrail')?fresh():validTrail(state.fractionTrail)?state.fractionTrail:null;}
export function trailView(state){const root=trailState(state);if(!root)return {unsupported:true,raw:state.fractionTrail};const w=root.cases[root.currentCase],m=model(w.source,w.cuts,w.markerIndex,w.readingText);return {unsupported:false,root,case:w,source:w.source,...m,feedback:Object.fromEntries(trailKinds.map(k=>[k,w.history.find(h=>h.id===w.currentFeedback[k])||null])),kept:w.kept,priorExposureUnknown:Object.hasOwn(root,'recovered')};}
function change(state,fn){const root=trailState(state);if(!root||!fn(root,root.cases[root.currentCase]))return false;state.fractionTrail=root;return true;}
const support=(w,s)=>{if(!w.support.includes(s))w.support.push(s);};
const clear=w=>{w.currentFeedback={spaces:null,stop:null,reading:null};w.inputError=null;};
const clearFlagFeedback=w=>{w.currentFeedback.stop=null;w.currentFeedback.reading=null;w.inputError=null;};
function partition(w,cuts){w.cuts=cuts;w.markerIndex=null;clear(w);}
export function chooseTrailCase(state,id){return change(state,r=>{const c=trailCase(id);if(!c)return false;if(r.cases[id])r.cases[id].familiar=true;else r.cases[id]=freshCase(c);r.currentCase=id;r.cases[id].inputError=null;return true;});}
export function setTrailPage(state,page){return change(state,(r,w)=>{if(!trailPages.includes(page))return false;r.page=page;w.inputError=null;return true;});}
export function toggleTrailCut(state,tick){return change(state,(r,w)=>{if(!Number.isInteger(tick)||tick<1||tick>11)return false;support(w,'handling');partition(w,w.cuts.includes(tick)?w.cuts.filter(x=>x!==tick):[...w.cuts,tick].sort((a,b)=>a-b));return true;});}
export function startTrailFlag(state){return change(state,(r,w)=>{support(w,'handling');w.markerIndex=0;clearFlagFeedback(w);return true;});}
export function moveTrailFlag(state,direction){return change(state,(r,w)=>{const i=w.markerIndex;if(i===null||![-1,1].includes(direction)||i+direction<0||i+direction>=trailBoundaries(w.cuts).length)return false;support(w,'handling');w.markerIndex+=direction;clearFlagFeedback(w);return true;});}
export function setTrailReading(state,text){return change(state,(r,w)=>{if(typeof text!=='string')return false;w.readingText=text.slice(0,24);w.currentFeedback.reading=null;w.inputError=null;return true;});}
export function checkTrail(state,kind){return change(state,(r,w)=>{if(!trailKinds.includes(kind))return false;if(kind==='reading'&&(w.markerIndex===null||!parseTrailReading(w.readingText))){w.inputError=w.markerIndex===null?'Start the flag before checking its reading.':'Enter a whole number or a fraction such as 1/2.';return true;}const h={id:w.nextCheckId++,kind,...snapshot(w),outcomes:outcome(kind,w),familiar:w.familiar,checkedPreviously:w.checkedKinds[kind],priorExposureUnknown:Object.hasOwn(r,'recovered')};w.history.push(h);while(w.history.length>24){const at=w.history.findIndex((x,i)=>w.history.some((y,j)=>j>i&&x.kind===y.kind));w.history.splice(at,1);}w.checkedKinds[kind]=true;w.currentFeedback[kind]=h.id;w.inputError=null;support(w,`feedback:${kind}`);return true;});}
export function prepareTrailPartition(state,n){return change(state,(r,w)=>{if(![2,3,4,6].includes(n))return false;support(w,'suppliedPartition');partition(w,Array.from({length:n-1},(_,i)=>(i+1)*12/n));return true;});}
export function prepareTrailTogether(state){return change(state,(r,w)=>{support(w,'currentPreparation');support(w,'together');const n=w.source.allowedSpaces[0];partition(w,Array.from({length:n-1},(_,i)=>(i+1)*12/n));w.markerIndex=w.source.target.numerator*n/w.source.target.denominator;return true;});}
export function useTrailSupport(state,kind){return change(state,(r,w)=>{if(!trailSupport.includes(kind)||kind.startsWith('feedback:')||['visualModel','suppliedInitialPartition'].includes(kind))return false;support(w,kind);return true;});}
export function setTrailHelp(state,topic){return change(state,(r,w)=>{if(topic!==null&&!trailHelpTopics.includes(topic))return false;w.helpTopic=topic;w.inputError=null;if(topic)support(w,topic==='changed-whole'?'changedWhole':topic);return true;});}
export function stepTrailExample(state){return change(state,(r,w)=>{support(w,'example');w.helpTopic='example';w.exampleStep=Math.min(trailExample.steps.length,w.exampleStep+1);w.inputError=null;return true;});}
export function keepTrail(state){return change(state,(r,w)=>{w.kept={...snapshot(w),ready:model(w.source,w.cuts,w.markerIndex,w.readingText).ready,priorExposureUnknown:Object.hasOwn(r,'recovered')};w.inputError=null;return true;});}
export function recoverTrail(state){if(!Object.hasOwn(state,'fractionTrail')||validTrail(state.fractionTrail))return false;const old=clone(state.fractionTrail),r=fresh();r.recovered=old;state.fractionTrail=r;return true;}
export const trailExposureFacts=()=>[];
