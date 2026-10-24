import {shuttersSource} from './shutters-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const text=x=>typeof x==='string'&&x.length>0&&x.length<=1600;
const copy=x=>structuredClone(x);
const sum=xs=>xs.reduce((a,b)=>a+b,0);
const numbers=(xs,max)=>Array.isArray(xs)&&xs.length<=max&&xs.every((n,i)=>int(n,1,max)&&(i===0||xs[i-1]<n));
export const SHUTTERS_BYTES=256*1024;
const bytes=x=>new TextEncoder().encode(JSON.stringify(x)??'').length;
export const freshShutters=()=>({version:1,current:null,earlier:[],notes:[],lesson:null});
export function validShuttersSource(s){
 return obj(s)&&s.model==='shutters-v1'&&text(s.id)&&[6,9].includes(s.size)&&s.switchAt===6&&['title','rule','won','blocked'].every(k=>text(s[k]))&&Array.isArray(s.frames)&&s.frames.length===4&&s.frames.every(f=>obj(f)&&numbers(f.open,s.size)&&f.open.length>0&&numbers(f.selected,s.size)&&f.selected.every(n=>f.open.includes(n))&&Array.isArray(f.faces)&&[1,2].includes(f.faces.length)&&f.faces.every(n=>int(n,1,6))&&text(f.text));
}
export function shutterWays(open,target){
 if(!numbers(open,9)||!int(target,1,12))return [];
 const ways=[];
 for(let mask=1;mask<(1<<open.length);mask++){
  const tiles=open.filter((_,i)=>mask&(1<<i));if(sum(tiles)===target)ways.push(tiles);
 }
 return ways.sort((a,b)=>{for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;});
}
export const shutterDice=open=>sum(open)<=6?1:2;
export function shuttersPosition(g){
 if(!obj(g)||!validShuttersSource(g.source)||!Array.isArray(g.moves)||g.moves.length>18||!numbers(g.selected,g.source.size)||!Array.isArray(g.support)||g.support.length>12||!g.support.every(text)||typeof g.noteKept!=='boolean')return null;
 let open=Array.from({length:g.source.size},(_,i)=>i+1),phase='roll',faces=[],target=null;
 for(const m of g.moves){
  if(!obj(m))return null;
  if(m.kind==='roll'){
   if(phase!=='roll'||!Array.isArray(m.faces)||m.faces.length!==shutterDice(open)||!m.faces.every(n=>int(n,1,6)))return null;
   faces=[...m.faces];target=sum(faces);phase=shutterWays(open,target).length?'choose':'blocked';
  }else if(m.kind==='close'){
   if(phase!=='choose'||!numbers(m.tiles,g.source.size)||!m.tiles.length||m.tiles.some(n=>!open.includes(n))||sum(m.tiles)!==target)return null;
   open=open.filter(n=>!m.tiles.includes(n));phase=open.length?'roll':'won';
  }else return null;
 }
 if(g.selected.some(n=>!open.includes(n))||(phase!=='choose'&&g.selected.length))return null;
 return {open,phase,faces,target,selectedTotal:sum(g.selected),dice:shutterDice(open)};
}
export function newShutters(size=6){const source=shuttersSource(size);return source?{source,moves:[],selected:[],support:[],noteKept:false}:null;}
export function shuttersView(state){
 if(!Object.hasOwn(state,'shutters'))return {absent:true,unsupported:false,root:null,current:null};
 const r=state.shutters;
 if(!obj(r)||r.version!==1||!Array.isArray(r.earlier)||!Array.isArray(r.notes)||!(r.current===null||obj(r.current)))return {absent:false,unsupported:true,root:r,current:null};
 return {absent:false,unsupported:false,root:r,current:shuttersPosition(r.current)?r.current:null};
}
export const readableShutterNote=n=>obj(n)&&typeof n.text==='string'&&n.text.length<=1000&&shuttersPosition(n.game)!==null;
function commit(state,change,canExport){
 const c=copy(state),view=shuttersView(c);if(view.unsupported)return false;
 if(view.absent)c.shutters=freshShutters();
 if(change(c.shutters)===false)return false;
 if((bytes(c.shutters)>SHUTTERS_BYTES&&bytes(c.shutters)>bytes(state.shutters))||!recoveryFitsProgressLimits(c)||typeof canExport!=='function'||!canExport(c))return false;
 state.shutters=c.shutters;return true;
}
export function startShutters(state,size,canExport){
 const game=newShutters(size),v=shuttersView(state);if(!game)return false;
 if(v.unsupported){
  const c=copy(state);c.shutters={...freshShutters(),current:game,retained:copy(state.shutters)};
  if(bytes(c.shutters)>SHUTTERS_BYTES||!recoveryFitsProgressLimits(c)||typeof canExport!=='function'||!canExport(c))return false;
  state.shutters=c.shutters;return true;
 }
 return commit(state,r=>{
  if(r.current!==null&&r.earlier.filter(g=>shuttersPosition(g)).length>=64)return false;
  const familiar=g=>shuttersPosition(g)&&g.source.size===size&&g.support.some(s=>['explanation','explanation-before'].includes(s));
  if(validShuttersSource(r.lesson?.source)&&r.lesson.source.size===size||familiar(r.current)||r.earlier.some(familiar)||r.notes.some(n=>readableShutterNote(n)&&familiar(n.game)))game.support.push('explanation-before');
  if(r.current!==null)r.earlier.push(copy(r.current));r.current=game;
 },canExport);
}
export function rollShutters(state,canExport,random=Math.random){
 return commit(state,r=>{
  const g=r.current,p=shuttersPosition(g);if(!p||p.phase!=='roll')return false;
  const faces=Array.from({length:p.dice},()=>{const n=random();return Math.floor(Math.min(0.9999999999999999,Math.max(0,Number.isFinite(n)?n:0))*6)+1;});
  g.moves.push({kind:'roll',faces});return shuttersPosition(g)!==null;
 },canExport);
}
export function selectShutter(state,n,canExport){return commit(state,r=>{
 const g=r.current,p=shuttersPosition(g);if(!p||p.phase!=='choose'||!p.open.includes(n))return false;
 g.selected=g.selected.includes(n)?g.selected.filter(x=>x!==n):[...g.selected,n].sort((a,b)=>a-b);
},canExport);}
export function clearShutters(state,canExport){return commit(state,r=>{const g=r.current,p=shuttersPosition(g);if(!p||p.phase!=='choose')return false;g.selected=[];},canExport);}
export function closeShutters(state,canExport){return commit(state,r=>{
 const g=r.current,p=shuttersPosition(g);if(!p||p.phase!=='choose'||!g.selected.length||p.selectedTotal!==p.target)return false;
 g.moves.push({kind:'close',tiles:[...g.selected]});g.selected=[];return shuttersPosition(g)!==null;
},canExport);}
const support=(g,tag)=>{if(g.support.includes(tag))return true;if(g.support.length>=12)return false;g.support.push(tag);return true;};
export function showShutterWays(state,canExport){return commit(state,r=>shuttersPosition(r.current)?.phase==='choose'&&support(r.current,'combinations'),canExport);}
export function explainShutters(state,step,canExport){
 if(!int(step,0,3))return false;
 return commit(state,r=>{
  if(!shuttersPosition(r.current)||!support(r.current,'explanation'))return false;
  if(r.lesson!==null&&(!validShuttersSource(r.lesson?.source)||!int(r.lesson.step,0,3)))r.earlier.push({lesson:copy(r.lesson)});
  r.lesson={source:copy(r.current.source),step};
 },canExport);
}
export function keepShutterNote(state,value,canExport){
 if(typeof value!=='string'||value.length>1000)return false;
 return commit(state,r=>{
  const g=r.current,p=shuttersPosition(g);if(!p||!['won','blocked'].includes(p.phase)||g.noteKept||r.notes.filter(readableShutterNote).length>=24)return false;
  r.notes.push({text:value,game:copy(g)});g.noteKept=true;
 },canExport);
}
export function resumeShutters(state,index,canExport){return commit(state,r=>{
 if(!int(index,0,r.earlier.length-1)||!shuttersPosition(r.earlier[index]))return false;
 const prior=r.current;r.current=copy(r.earlier[index]);if(prior===null)r.earlier.splice(index,1);else r.earlier[index]=prior;
},canExport);}
export function removeShutterRecord(state,kind,index,canExport){
 if(!['earlier','notes'].includes(kind))return false;
 return commit(state,r=>{const xs=r[kind];if(!int(index,0,xs.length-1)||!(kind==='earlier'?shuttersPosition(xs[index]):readableShutterNote(xs[index])))return false;xs.splice(index,1);},canExport);
}
