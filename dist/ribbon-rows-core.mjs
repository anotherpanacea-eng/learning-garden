import {rowsSource} from './ribbon-rows-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const int=(x,a,b)=>Number.isSafeInteger(x)&&x>=a&&x<=b;
const text=(x,n=1600)=>typeof x==='string'&&x.length>0&&x.length<=n;
const copy=x=>structuredClone(x);
const rows=(xs,low=0)=>Array.isArray(xs)&&[2,3].includes(xs.length)&&xs.every(n=>int(n,low,7));
const actor=x=>['child','bramble'].includes(x);
const dial=x=>['sleepy','attention','plan'].includes(x);
const empty=()=>({row:null,take:null});
export const ROWS_BYTES=256*1024;
const bytes=x=>new TextEncoder().encode(JSON.stringify(x)??'').length;
export const freshRows=()=>({version:1,current:null,earlier:[],notes:[],lesson:null});
export function rowMoves(left){return rows(left)?left.flatMap((n,row)=>Array.from({length:n},(_,i)=>({row,take:i+1}))):[];}
export function afterRowMove(left,m){if(!rows(left)||!obj(m)||!int(m.row,0,left.length-1)||!int(m.take,1,left[m.row]))return null;const next=[...left];next[m.row]-=m.take;return next;}
export const rowsModelCount=s=>s?.model==='ribbon-rows-v1'?2:s?.model==='ribbon-rows-three-v1'?3:null;
export function validRowsSource(s){
 const count=rowsModelCount(s);
 return obj(s)&&count!==null&&text(s.id,80)&&['title','rule','childWin','brambleWin'].every(k=>text(s[k]))&&(count===2||rows(s.practiceStart,1)&&s.practiceStart.length===3)&&Array.isArray(s.frames)&&s.frames.length===(count===2?4:6)&&s.frames.every(f=>{
  if(!obj(f)||!rows(f.rows)||f.rows.length!==count||!text(f.text)||!Array.isArray(f.moves)||f.moves.length>2)return false;
  let left=f.rows;for(const m of f.moves){if(!actor(m?.who))return false;left=afterRowMove(left,m);if(!left)return false;}return true;
 });
}
export function bundleCounts(left){return rows(left)?[4,2,1].map(size=>({size,count:left.filter(n=>(n&size)!==0).length})):[];}
export const pairedBundles=left=>rows(left)&&bundleCounts(left).every(c=>c.count%2===0);
export function rowsPosition(g){
 if(!obj(g)||!validRowsSource(g.source)||!rows(g.start,1)||g.start.length!==rowsModelCount(g.source)||!actor(g.first)||!dial(g.dial)||!Array.isArray(g.moves)||g.moves.length>7*g.start.length||!obj(g.draft)||!Array.isArray(g.support)||g.support.length>12||new Set(g.support).size!==g.support.length||!g.support.every(t=>text(t,80))||typeof g.noteKept!=='boolean'||Object.hasOwn(g,'explanationAt')&&!int(g.explanationAt,0,g.moves.length)||rowsModelCount(g.source)===3&&Object.hasOwn(g,'bundlesAt')&&!int(g.bundlesAt,0,g.moves.length))return null;
 let left=[...g.start],turn=g.first,winner=null;
 for(const m of g.moves){
  if(winner||!obj(m)||m.who!==turn)return null;
  left=afterRowMove(left,m);if(!left)return null;
  if(left.every(n=>n===0))winner=turn;else turn=turn==='child'?'bramble':'child';
 }
 const d=g.draft;
 if(d.row===null){if(d.take!==null)return null;}
 else if(winner||turn!=='child'||!int(d.row,0,left.length-1)||left[d.row]===0||d.take!==null&&!int(d.take,1,left[d.row]))return null;
 return {left,turn,winner};
}
export function newRowsGame({start=[5,3],first='child',dial='attention',support=[]}={}){const g={source:rowsSource(start?.length),start:copy(start),first,dial,moves:[],draft:empty(),support:[...support],noteKept:false};return rowsPosition(g)?g:null;}
export function takeRows(g,who,row,take){const p=rowsPosition(g);if(!p||p.winner||p.turn!==who||!afterRowMove(p.left,{row,take}))return null;const next=copy(g);next.moves.push({who,row,take});next.draft=empty();return next;}
export const randomFraction=random=>{const n=random();return Math.min(0.9999999999999999,Math.max(0,Number.isFinite(n)?n:0));};
export const dealRows=(random=Math.random,count=2)=>[2,3].includes(count)?Array.from({length:count},()=>1+Math.floor(randomFraction(random)*7)):null;
export function brambleRowMove(g,random=Math.random){
 const p=rowsPosition(g);if(!p||p.winner||p.turn!=='bramble')return null;const legal=rowMoves(p.left);
 if(g.dial==='plan')return legal.find(m=>{const a=afterRowMove(p.left,m);return pairedBundles(a);})??legal[0];
 if(g.dial==='attention'){const win=legal.find(m=>afterRowMove(p.left,m).every(n=>n===0));if(win)return win;}
 return legal[Math.floor(randomFraction(random)*legal.length)];
}
export function rowsView(state){
 if(!Object.hasOwn(state,'ribbonRows'))return {absent:true,unsupported:false,root:null,current:null};
 const r=state.ribbonRows;if(!obj(r)||r.version!==1||!Array.isArray(r.earlier)||!Array.isArray(r.notes)||!(r.current===null||obj(r.current)))return {absent:false,unsupported:true,root:r,current:null};
 return {absent:false,unsupported:false,root:r,current:rowsPosition(r.current)?r.current:null};
}
export const readableRowNote=n=>obj(n)&&typeof n.text==='string'&&n.text.length<=1000&&!!rowsPosition(n.game)?.winner;
export const readableRowsLesson=l=>obj(l)&&validRowsSource(l.source)&&int(l.step,0,l.source.frames.length-1);
function commit(state,change,canExport){
 const c=copy(state),v=rowsView(c);if(v.unsupported)return false;if(v.absent)c.ribbonRows=freshRows();if(change(c.ribbonRows)===false)return false;
 if((bytes(c.ribbonRows)>ROWS_BYTES&&bytes(c.ribbonRows)>bytes(state.ribbonRows))||!recoveryFitsProgressLimits(c)||typeof canExport!=='function'||!canExport(c))return false;
 state.ribbonRows=c.ribbonRows;return true;
}
export function startRows(state,setup,canExport){
 const v=rowsView(state),g=newRowsGame({...setup,support:[]});if(!g)return false;
 if(v.unsupported){const c=copy(state);c.ribbonRows={...freshRows(),current:g,retained:copy(state.ribbonRows)};if(bytes(c.ribbonRows)>ROWS_BYTES||!recoveryFitsProgressLimits(c)||typeof canExport!=='function'||!canExport(c))return false;state.ribbonRows=c.ribbonRows;return true;}
 return commit(state,r=>{
  if(r.current!==null&&r.earlier.filter(x=>rowsPosition(x)).length>=64)return false;
  const same=x=>rowsPosition(x)&&x.source.model===g.source.model;
  const familiar=x=>same(x)&&x.support.some(t=>['explanation','explanation-before'].includes(t));
  const bundled=x=>same(x)&&x.support.some(t=>['bundles','bundles-before'].includes(t));
  if(readableRowsLesson(r.lesson)&&r.lesson.source.model===g.source.model||familiar(r.current)||r.earlier.some(familiar)||r.notes.some(n=>readableRowNote(n)&&familiar(n.game)))g.support.push('explanation-before');
  if(rowsModelCount(g.source)===3&&(bundled(r.current)||r.earlier.some(bundled)||r.notes.some(n=>readableRowNote(n)&&bundled(n.game))))g.support.push('bundles-before');
  if(r.current!==null)r.earlier.push(copy(r.current));r.current=g;
 },canExport);
}
export function chooseRow(state,row,canExport){return commit(state,r=>{const g=r.current,p=rowsPosition(g);if(!p||p.winner||p.turn!=='child'||!int(row,0,p.left.length-1)||!p.left[row])return false;if(g.draft.row!==row)g.draft={row,take:null};},canExport);}
export function chooseRowCount(state,take,canExport){return commit(state,r=>{const g=r.current,p=rowsPosition(g);if(!p||p.winner||p.turn!=='child'||g.draft.row===null||!int(take,1,p.left[g.draft.row]))return false;g.draft.take=take;},canExport);}
export function clearRowDraft(state,canExport){return commit(state,r=>{const g=r.current,p=rowsPosition(g);if(!p||p.winner||p.turn!=='child')return false;g.draft=empty();},canExport);}
export function moveRows(state,who,canExport,random=Math.random){return commit(state,r=>{const g=r.current;if(!rowsPosition(g))return false;const m=who==='bramble'?brambleRowMove(g,random):g.draft;const next=m&&takeRows(g,who,m.row,m.take);if(!next)return false;r.current=next;},canExport);}
export function explainRows(state,step,canExport){
 return commit(state,r=>{const g=r.current;if(!rowsPosition(g)||!int(step,0,g.source.frames.length-1))return false;
  if(!g.support.includes('explanation')){if(g.support.length>=12)return false;g.support.push('explanation');g.explanationAt=g.moves.length;}
  if(r.lesson!=null&&!readableRowsLesson(r.lesson))r.earlier.push({lesson:copy(r.lesson)});
  r.lesson={source:copy(g.source),step};
 },canExport);
}
export function keepRowNote(state,value,canExport){if(typeof value!=='string'||value.length>1000)return false;return commit(state,r=>{const g=r.current;if(!rowsPosition(g)?.winner||g.noteKept||r.notes.filter(readableRowNote).length>=24)return false;r.notes.push({text:value,game:copy(g)});g.noteKept=true;},canExport);}
export function resumeRows(state,index,canExport){return commit(state,r=>{if(!int(index,0,r.earlier.length-1)||!rowsPosition(r.earlier[index]))return false;const prior=r.current;r.current=copy(r.earlier[index]);if(prior===null)r.earlier.splice(index,1);else r.earlier[index]=prior;},canExport);}
export function removeRowRecord(state,kind,index,canExport){if(!['earlier','notes'].includes(kind))return false;return commit(state,r=>{const xs=r[kind];if(!int(index,0,xs.length-1)||!(kind==='earlier'?rowsPosition(xs[index]):readableRowNote(xs[index])))return false;xs.splice(index,1);},canExport);}

export function showRowBundles(state,canExport){return commit(state,r=>{const g=r.current;if(!rowsPosition(g)||rowsModelCount(g.source)!==3)return false;if(!g.support.includes('bundles')){if(g.support.length>=12)return false;g.support.push('bundles');g.bundlesAt=g.moves.length;}},canExport);}
export function practiceRows(source){if(!validRowsSource(source))return null;const g=newRowsGame({start:rowsModelCount(source)===3?copy(source.practiceStart):[5,3],dial:'plan',support:['explanation']});g.source=copy(source);return g;}
