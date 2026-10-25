import {pileSource,pileDials} from './seed-pile-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const text=(x,n=1600)=>typeof x==='string'&&x.length>0&&x.length<=n;
const integer=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const copy=x=>structuredClone(x);
export const MAX_GAMES_BYTES=256*1024;
const gamesBytes=r=>new TextEncoder().encode(JSON.stringify(r)).length;
const fitsGames=r=>gamesBytes(r)<=MAX_GAMES_BYTES;
export const freshGames=()=>({version:1,current:null,earlier:[],notes:[],lesson:null});
export function validPileSource(s){return object(s)&&s.model==='seed-pile-v1'&&text(s.id,80)&&text(s.title)&&text(s.rule)&&[2,3].includes(s.maxTake)&&typeof s.lastLoses==='boolean'&&text(s.childWin)&&text(s.brambleWin)&&Array.isArray(s.frames)&&s.frames.length===4&&s.frames.every(f=>object(f)&&integer(f.pile,1,30)&&text(f.text));}
export function pilePosition(g){
 if(!object(g)||!validPileSource(g.source)||!integer(g.start,5,30)||!['child','bramble'].includes(g.first)||!text(g.dial,80)||!Array.isArray(g.moves)||g.moves.length>30||!Array.isArray(g.support)||g.support.length>12||!g.support.every(s=>text(s,80))||typeof g.noteKept!=='boolean')return null;
 let left=g.start,turn=g.first,winner=null;
 for(const m of g.moves){
  if(winner||!object(m)||m.who!==turn||!integer(m.take,1,Math.min(left,g.source.maxTake)))return null;
  left-=m.take;
  if(!left)winner=g.source.lastLoses?(turn==='child'?'bramble':'child'):turn;
  else turn=turn==='child'?'bramble':'child';
 }
 return {left,turn,winner};
}
export function losingPile(n,maxTake,lastLoses){
 if(!integer(n,0,30)||![2,3].includes(maxTake)||typeof lastLoses!=='boolean')return null;
 const win=[lastLoses];
 for(let p=1;p<=n;p++)win[p]=Array.from({length:Math.min(p,maxTake)},(_,i)=>i+1).some(t=>!win[p-t]);
 return !win[n];
}
export function brambleTake(g,random=Math.random){
 const p=pilePosition(g);if(!p||p.winner||p.turn!=='bramble')return null;
 const takes=Array.from({length:Math.min(p.left,g.source.maxTake)},(_,i)=>i+1);
 if(g.dial==='plan')return takes.find(t=>losingPile(p.left-t,g.source.maxTake,g.source.lastLoses))??takes[0];
 if(g.dial==='attention'){
  const immediate=takes.find(t=>g.source.lastLoses?p.left-t===1:p.left-t===0);
  if(immediate)return immediate;
 }
 const r=random();return takes[Math.min(takes.length-1,Math.max(0,Math.floor((Number.isFinite(r)?r:0)*takes.length)))];
}
export function newPileGame({variant='pile',start=13,first='child',dial='attention',support=[]}={}){
 if(!pileDials.some(d=>d[0]===dial))return null;
 const g={source:pileSource(variant),start,first,dial,moves:[],support:[...support],noteKept:false};return pilePosition(g)?g:null;
}
export function takePile(g,who,take){const p=pilePosition(g);if(!p||p.winner||p.turn!==who||!integer(take,1,Math.min(p.left,g.source.maxTake)))return null;const next=copy(g);next.moves.push({who,take});return next;}
export function gamesView(state){
 if(!Object.hasOwn(state,'games'))return {absent:true,unsupported:false,root:null,current:null};
 const r=state.games;
 if(!object(r)||r.version!==1||!Array.isArray(r.earlier)||!Array.isArray(r.notes)||!(r.current===null||object(r.current)))return {absent:false,unsupported:true,root:r,current:null};
 return {absent:false,unsupported:false,root:r,current:pilePosition(r.current)?r.current:null};
}
export function readablePileNote(n){return object(n)&&typeof n.text==='string'&&n.text.length<=1000&&pilePosition(n.game)!==null;}
function commit(state,change,canExport){
 const c=copy(state);const v=gamesView(c);
 if(v.unsupported)return false;
 if(v.absent)c.games=freshGames();
 if(change(c.games)===false)return false;
 const after=gamesBytes(c.games),before=gamesBytes(state.games);
 if((after>MAX_GAMES_BYTES&&after>before)||!recoveryFitsProgressLimits(c)||typeof canExport!=='function'||!canExport(c))return false;
 state.games=c.games;return true;
}
export function startPile(state,setup,canExport){
 const v=gamesView(state),prior=v.root?.lesson?.source,target=pileSource(setup?.variant||'pile');
 const sameRule=source=>validPileSource(source)&&source.maxTake===target?.maxTake&&source.lastLoses===target?.lastLoses;
 const explained=g=>pilePosition(g)&&sameRule(g.source)&&g.support.some(tag=>['explanation','explanation-before'].includes(tag));
 const familiar=!v.unsupported&&(sameRule(prior)||explained(v.current)||v.root?.earlier.some(explained)||v.root?.notes.some(n=>readablePileNote(n)&&explained(n.game)));
 const game=newPileGame({...setup,support:familiar?['explanation-before']:[]});if(!game)return false;
 if(v.unsupported){
  const c=copy(state);c.games={...freshGames(),retained:copy(state.games),current:game};
  if(!fitsGames(c.games)||!recoveryFitsProgressLimits(c)||typeof canExport!=='function'||!canExport(c))return false;
  state.games=c.games;return true;
 }
 return commit(state,r=>{if(r.earlier.filter(x=>pilePosition(x)).length>=64)return false;if(r.current!==null)r.earlier.push(copy(r.current));r.current=game;},canExport);
}
export function movePile(state,who,take,canExport,random=Math.random){
 return commit(state,r=>{if(!pilePosition(r.current))return false;const chosen=who==='bramble'?brambleTake(r.current,random):take;const next=takePile(r.current,who,chosen);if(!next)return false;r.current=next;},canExport);
}
export function explainPile(state,variant,step,canExport){
 if(!integer(step,0,3))return false;
 return commit(state,r=>{
  const source=validPileSource(r.current?.source)?copy(r.current.source):pileSource(variant);
  if(!source)return false;if(r.lesson!==null&&!validPileSource(r.lesson?.source))r.earlier.push({lesson:copy(r.lesson)});r.lesson={source,step};
  if(pilePosition(r.current)&&!r.current.support.includes('explanation')){if(r.current.support.length>=12)return false;r.current.support.push('explanation');}
 },canExport);
}
export function keepPileNote(state,value,canExport){
 if(typeof value!=='string'||value.length>1000)return false;
 return commit(state,r=>{if(!pilePosition(r.current)||r.current.noteKept||r.notes.filter(readablePileNote).length>=24)return false;r.notes.push({text:value,game:copy(r.current)});r.current.noteKept=true;},canExport);
}
export function resumePile(state,index,canExport){
 return commit(state,r=>{if(!integer(index,0,r.earlier.length-1)||!pilePosition(r.earlier[index]))return false;const prior=r.current;r.current=copy(r.earlier[index]);if(prior===null)r.earlier.splice(index,1);else r.earlier[index]=prior;},canExport);
}
export function removePileRecord(state,kind,index,canExport){
 if(!['earlier','notes'].includes(kind))return false;
 return commit(state,r=>{const xs=r[kind];if(!integer(index,0,xs.length-1)||!(kind==='notes'?readablePileNote(xs[index]):pilePosition(xs[index])))return false;xs.splice(index,1);},canExport);
}
