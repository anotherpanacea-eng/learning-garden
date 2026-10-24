import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
import {rowsSource} from '../dist/ribbon-rows-content.mjs';
import {ROWS_BYTES,rowMoves,afterRowMove,validRowsSource,rowsPosition,newRowsGame,takeRows,brambleRowMove,dealRows,rowsView,startRows,chooseRow,chooseRowCount,clearRowDraft,moveRows,explainRows,keepRowNote,resumeRows,removeRowRecord,readableRowNote} from '../dist/ribbon-rows-core.mjs';
import {rowsPage,resetRowsVisit,rowsNotes} from '../dist/ribbon-rows-ui.mjs';
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(a,m)=>{assert.ok(a,m);checks++;};
const admit=s=>prepareProgressImport(JSON.stringify({...s,title:'Synthetic notebook'},null,2)).ok;
// Independent recursive game tree. No equality/mirroring expression in this oracle.
const memo=new Map();function wins(a,b){const key=`${a},${b}`;if(memo.has(key))return memo.get(key);let win=false;for(let n=1;n<=a;n++)if(!wins(a-n,b))win=true;for(let n=1;n<=b;n++)if(!wins(a,b-n))win=true;memo.set(key,win);return win;}
function at(a,b,dial='plan'){
 const g=newRowsGame({start:[7,7],first:'bramble',dial});
 // Construct a legal path with Bramble to move, except terminal. Zero row endpoints are reachable in one move with child first.
 if(a===7&&b===7)return g;
 g.first='child';
 if(a!==7&&b===7)g.moves=[{who:'child',row:0,take:7-a}];
 else if(a===7&&b!==7)g.moves=[{who:'child',row:1,take:7-b}];
 else {g.first='bramble';g.moves=[{who:'bramble',row:0,take:7-a},{who:'child',row:1,take:7-b}];}
 return g;
}
for(let a=0;a<=7;a++)for(let b=0;b<=7;b++){
 eq(wins(a,b),a!==b,'all64 positions vs independent oracle');
 const legal=[];for(let row=0;row<2;row++)for(let take=1;take<=[a,b][row];take++)legal.push({row,take});eq(rowMoves([a,b]),legal,'order and complete legal moves');
 if(a+b===0)continue;
 for(const dial of ['sleepy','attention','plan']){
  const g=at(a,b,dial);eq(rowsPosition(g).left,[a,b]);eq(rowsPosition(g).turn,'bramble');
  const best=brambleRowMove(g,()=>.5);ok(legal.some(m=>m.row===best.row&&m.take===best.take));
  const next=afterRowMove([a,b],best);
  if(dial==='plan'){const winning=legal.filter(m=>{const x=afterRowMove([a,b],m);return !wins(...x);});eq(best,winning[0]??legal[0],'exact plan choice and fallback');if(wins(a,b))ok(!wins(...next),'plan leaves recursively losing position');}
  if(dial==='attention'&&(a===0||b===0))eq(next,[0,0],'immediate ending');
  if(dial==='sleepy'||dial==='attention'&&a>0&&b>0)for(let i=0;i<legal.length;i++)eq(brambleRowMove(g,()=> (i+.5)/legal.length),legal[i],'each uniform random bin');
 }
}
eq(dealRows(()=>0),[1,1]);eq(dealRows(()=>1),[7,7]);eq(dealRows(()=>NaN),[1,1]);eq(dealRows(()=>-1),[1,1]);for(let i=0;i<7;i++)eq(dealRows(()=>(i+.5)/7),[i+1,i+1]);
const seq=[0,.999];eq(dealRows(()=>seq.shift()),[1,7],'separate deal samples');
for(const bad of [[0,1],[1,8],[1],[1,2,3],[1.5,2]])eq(newRowsGame({start:bad}),null);
ok(validRowsSource(rowsSource()));let p=[3,3];for(const [i,f] of rowsSource().frames.entries()){if(i===0)eq(f.rows,[3,3]);for(const m of f.moves){const next=afterRowMove(f.rows,m);ok(next,'authored move legal individually');}let left=f.rows;for(const m of f.moves){left=afterRowMove(left,m);ok(left);}if(i===3)eq(left,[0,0],'final explanation ending');}
const s=freshState();ok(rowsView(s).absent);rowsPage(s,'synthetic');ok(!Object.hasOwn(s,'ribbonRows'),'render absent root pure');
ok(startRows(s,{},admit));ok(chooseRow(s,0,admit));ok(chooseRowCount(s,2,admit));eq(s.ribbonRows.current.draft,{row:0,take:2});eq(restoreState(JSON.stringify(s)).ribbonRows,s.ribbonRows);
ok(chooseRow(s,0,admit));eq(s.ribbonRows.current.draft.take,2,'same row preserves count');ok(chooseRow(s,1,admit));eq(s.ribbonRows.current.draft.take,null,'switch row clears count');ok(clearRowDraft(s,admit));eq(s.ribbonRows.current.draft,{row:null,take:null});
let before=structuredClone(s);ok(!chooseRowCount(s,1,admit));ok(!moveRows(s,'child',admit));eq(s,before);
ok(chooseRow(s,0,admit));ok(chooseRowCount(s,2,admit));ok(moveRows(s,'child',admit));eq(rowsPosition(s.ribbonRows.current).left,[3,3]);eq(s.ribbonRows.current.draft,{row:null,take:null});before=structuredClone(s);ok(!moveRows(s,'child',admit));ok(!chooseRow(s,1,admit));eq(s,before,'cannot play again on Bramble turn');ok(moveRows(s,'bramble',admit,()=>0));
for(const first of ['child','bramble'])for(const dial of ['sleepy','attention','plan']){
 const t=freshState();ok(startRows(t,{start:[1,1],first,dial},admit));
 while(!rowsPosition(t.ribbonRows.current).winner){const p=rowsPosition(t.ribbonRows.current);if(p.turn==='child'){const row=p.left[0]?0:1;ok(chooseRow(t,row,admit));ok(chooseRowCount(t,1,admit));}ok(moveRows(t,p.turn,admit,()=>0));}
 eq(rowsPosition(t.ribbonRows.current).winner,first==='child'?'bramble':'child');ok(!moveRows(t,'bramble',admit));ok(keepRowNote(t,'<i>A new plan</i>',admit));ok(!keepRowNote(t,'again',admit));ok(readableRowNote(t.ribbonRows.notes[0]));
 const n=t.ribbonRows.current.moves.length;ok(explainRows(t,0,admit));eq(t.ribbonRows.current.explanationAt,n,'help after ending distinguishable');
}
before=structuredClone(s.ribbonRows.current);for(let i=0;i<4;i++)ok(explainRows(s,i,admit));eq(s.ribbonRows.current.moves,before.moves);eq(s.ribbonRows.current.draft,before.draft);eq(s.ribbonRows.current.explanationAt,before.moves.length);ok(startRows(s,{},admit));ok(s.ribbonRows.current.support.includes('explanation-before'));ok(resumeRows(s,0,admit));eq(s.ribbonRows.current.moves,before.moves);
s.games={future:'Synthetic old pile'};s.shutters={version:99,raw:'Synthetic box'};const siblings=structuredClone([s.games,s.shutters]);ok(startRows(s,{},admit));eq([s.games,s.shutters],siblings,'other Games Table roots unchanged');
s.ribbonRows.current.source.title='Frozen older title <svg onload="x">';s.ribbonRows.current.source.rule='An older rule statement.';ok(rowsPosition(s.ribbonRows.current));before=structuredClone(s);resetRowsVisit();const html=rowsPage(s,'synthetic');eq(s,before,'render does not repair');ok(html.includes('&lt;svg')&&!html.includes('<svg onload'),'source escaped');ok(rowsNotes(s).includes('not a math level'));
for(const mutate of [g=>g.moves.push({who:'bramble',row:0,take:1}),g=>g.draft={row:null,take:1},g=>g.draft={row:8,take:null},g=>g.draft={row:0,take:8},g=>g.start=[0,1],g=>g.support=['same','same'],g=>g.first='other',g=>g.dial='other',g=>g.explanationAt=15]){const g=newRowsGame();mutate(g);eq(rowsPosition(g),null);}
const terminal=newRowsGame({start:[1,1]});terminal.moves=[{who:'child',row:0,take:1},{who:'bramble',row:1,take:1}];eq(rowsPosition(terminal).winner,'bramble');const bad=structuredClone(terminal);bad.moves.push({who:'child',row:1,take:1});eq(rowsPosition(bad),null);bad.moves=terminal.moves;bad.draft={row:0,take:null};eq(rowsPosition(bad),null);
const future={version:99,raw:{work:'Synthetic future record'}};s.ribbonRows=future;ok(startRows(s,{},admit));eq(s.ribbonRows.retained,future);s.ribbonRows.current.source.model='future-rows';const raw=structuredClone(s.ribbonRows.current);ok(startRows(s,{},admit));eq(s.ribbonRows.earlier.at(-1),raw);ok(!removeRowRecord(s,'earlier',0,admit),'unreadable record not discarded');
s.ribbonRows.lesson={future:'Synthetic lesson'};ok(explainRows(s,0,admit));eq(s.ribbonRows.earlier.at(-1),{lesson:{future:'Synthetic lesson'}});
before=structuredClone(s);const identity=s.ribbonRows;ok(!chooseRow(s,0,()=>false));eq(s,before,'actual export rejection atomic');eq(s.ribbonRows,identity,'identity preserved after refusal');
s.padding='x'.repeat(5*1024*1024);before=structuredClone(s);ok(!chooseRow(s,0,()=>true));eq(s,before);delete s.padding;
s.ribbonRows.padding='x'.repeat(ROWS_BYTES);before=structuredClone(s);ok(!startRows(s,{},admit));eq(s,before,'no growth over root budget');s.ribbonRows.earlier=[newRowsGame(),newRowsGame()];ok(removeRowRecord(s,'earlier',0,admit));ok(resumeRows(s,0,admit),'non-growing recovery above cap');
const cap=freshState();ok(startRows(cap,{},admit));cap.ribbonRows.earlier=Array.from({length:64},()=>newRowsGame());before=structuredClone(cap);ok(!startRows(cap,{},admit));eq(cap,before);cap.ribbonRows.earlier=[];cap.ribbonRows.current.support=Array.from({length:12},(_,i)=>`other-${i}`);before=structuredClone(cap);ok(!explainRows(cap,0,admit));eq(cap,before);
cap.ribbonRows.current=structuredClone(terminal);cap.ribbonRows.notes=Array.from({length:24},()=>({text:'Synthetic note',game:terminal}));before=structuredClone(cap);ok(!keepRowNote(cap,'another',admit));eq(cap,before);ok(removeRowRecord(cap,'notes',0,admit));ok(keepRowNote(cap,'room now',admit));
const imported=prepareProgressImport(JSON.stringify({...s,title:'Synthetic notebook'},null,2));ok(imported.ok);eq(imported.state.ribbonRows,s.ribbonRows,'actual transfer preserves raw siblings and oversize non-growing state');
console.log(`Ribbon Rows: ${checks} assertions passed.`);
