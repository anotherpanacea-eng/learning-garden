import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshState,restoreState} from '../dist/core.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
import {rowsSource} from '../dist/ribbon-rows-content.mjs';
import {rowsPosition,rowMoves,afterRowMove,newRowsGame,brambleRowMove,takeRows,bundleCounts,pairedBundles,startRows,chooseRow,chooseRowCount,moveRows,explainRows,showRowBundles,practiceRows,readableRowsLesson,resumeRows,keepRowNote,dealRows,ROWS_BYTES} from '../dist/ribbon-rows-core.mjs';
import {rowsPage,rowsBundleTable,resetRowsVisit} from '../dist/ribbon-rows-ui.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
const admit=s=>prepareProgressImport(JSON.stringify({...s,title:'Synthetic notebook'},null,2)).ok;
const old=JSON.parse(fs.readFileSync(new URL('./fixtures/ribbon-rows-two-v1.json',import.meta.url),'utf8'));
const memo=new Map();function win(p){const k=p.join(',');if(memo.has(k))return memo.get(k);let v=false;for(let r=0;r<3;r++)for(let t=1;t<=p[r];t++){const q=[...p];q[r]-=t;if(!win(q))v=true;}memo.set(k,v);return v;}
function at(p,dial){const changed=p.map((x,r)=>({row:r,take:7-x})).filter(m=>m.take);const g=newRowsGame({start:[7,7,7],first:changed.length%2?'child':'bramble',dial});let who=g.first;g.moves=changed.map(m=>{const q={...m,who};who=who==='child'?'bramble':'child';return q;});return g;}
for(let a=0;a<8;a++)for(let b=0;b<8;b++)for(let c=0;c<8;c++){
 const p=[a,b,c],counts=[4,2,1].map(size=>p.reduce((total,x)=>total+Math.floor(x/size)%2,0));eq(bundleCounts(p).map(c=>c.count),counts,'division-based decomposition');eq(pairedBundles(p),!win(p),'independent recursive oracle all512');
 const legal=[];for(let row=0;row<3;row++)for(let take=1;take<=p[row];take++)legal.push({row,take});eq(rowMoves(p),legal);
 if(!a&&!b&&!c)continue;
 for(const dial of ['sleepy','attention','plan']){
  const g=at(p,dial);eq(rowsPosition(g).left,p);eq(rowsPosition(g).turn,'bramble');
  const m=brambleRowMove(g,()=>.5);ok(legal.some(x=>x.row===m.row&&x.take===m.take));
  if(dial==='plan'){const expected=legal.find(m=>!win(afterRowMove(p,m)))??legal[0];eq(m,expected,'every strong reply vs recursion');}
  if(dial==='attention'&&p.filter(Boolean).length===1)eq(afterRowMove(p,m),[0,0,0]);
  if(dial==='sleepy'||dial==='attention'&&p.filter(Boolean).length>1)for(let i=0;i<legal.length;i++)eq(brambleRowMove(g,()=>(i+.5)/legal.length),legal[i]);
 }
}
const expected=[[[1,2,4],[]],[[1,2,4],[{who:'child',row:2,take:1}]],[[1,2,3],[{who:'child',row:0,take:1},{who:'bramble',row:2,take:1}]],[[3,5,7],[{who:'child',row:0,take:1}]],[[1,1,2],[{who:'child',row:2,take:2}]],[[1,2,3],[]]];
for(const [i,f] of rowsSource(3).frames.entries()){eq([f.rows,f.moves],expected[i],'literal teaching frame');let p=f.rows;for(const m of f.moves){p=afterRowMove(p,m);ok(p);}
 if(i>0&&i<5)ok(pairedBundles(p));}
ok(!pairedBundles([1,1,2]));ok(!pairedBundles([3,3,2]));ok(pairedBundles([1,2,3]));
eq(dealRows(()=>0,3),[1,1,1]);eq(dealRows(()=>1,3),[7,7,7]);eq(dealRows(()=>NaN,3),[1,1,1]);eq(dealRows(()=>0,4),null);
const s=freshState();s.ribbonRows={version:1,current:structuredClone(old),earlier:[],notes:[],lesson:{source:structuredClone(old.source),step:3}};const frozen=structuredClone(s.ribbonRows);resetRowsVisit();rowsPage(s,'synthetic');eq(s.ribbonRows,frozen,'old two-row view exact');eq(restoreState(JSON.stringify(s)).ribbonRows,frozen);
ok(startRows(s,{start:[1,2,4],dial:'plan'},admit));eq(s.ribbonRows.earlier[0],old);eq(s.ribbonRows.current.support,[],'two-row explanation not three-row familiarity');const before=structuredClone(s);ok(!showRowBundles(s,()=>false));eq(s,before);ok(showRowBundles(s,admit));eq(s.ribbonRows.current.bundlesAt,0);ok(chooseRow(s,2,admit));ok(chooseRowCount(s,1,admit));ok(moveRows(s,'child',admit));eq(rowsPosition(s.ribbonRows.current).left,[1,2,3]);ok(showRowBundles(s,admit));eq(s.ribbonRows.current.bundlesAt,0,'first exposure timing retained');
const current=structuredClone(s.ribbonRows.current);for(let step=0;step<6;step++)ok(explainRows(s,step,admit));eq(s.ribbonRows.current.moves,current.moves);eq(s.ribbonRows.current.draft,current.draft);ok(readableRowsLesson(s.ribbonRows.lesson));ok(!explainRows(s,6,admit));
const practice=practiceRows(s.ribbonRows.lesson.source);eq(practice.start,[1,2,4]);eq(practice.source,s.ribbonRows.lesson.source);eq(practice.dial,'plan');ok(rowsPosition(practice));const custom=structuredClone(practice.source);custom.practiceStart=[3,5,7];eq(practiceRows(custom).start,[3,5,7],'own-source practice start');
ok(startRows(s,{start:[5,3]},admit));eq(s.ribbonRows.current.support,[],'three-row explanation is not two-row familiarity');ok(!s.ribbonRows.current.support.includes('bundles-before'));ok(startRows(s,{start:[1,2,4]},admit));ok(s.ribbonRows.current.support.includes('explanation-before'));ok(s.ribbonRows.current.support.includes('bundles-before'));ok(resumeRows(s,0,admit));eq(s.ribbonRows.current,old,'resume legacy two-row draft exact');
const transfer=prepareProgressImport(JSON.stringify({...s,title:'Synthetic notebook'},null,2));ok(transfer.ok);eq(transfer.state.ribbonRows,s.ribbonRows);
const ended=newRowsGame({start:[7,7,7]});let g=ended,who='child';for(let row=0;row<3;row++)for(let i=0;i<7;i++){g=takeRows(g,who,row,1);ok(g);who=who==='child'?'bramble':'child';}eq(g.moves.length,21);eq(rowsPosition(g).winner,'child');eq(takeRows(g,'bramble',0,1),null);const extra=structuredClone(g);extra.moves.push({who:'bramble',row:0,take:1});eq(rowsPosition(extra),null);
s.ribbonRows.current=g;ok(showRowBundles(s,admit));eq(s.ribbonRows.current.bundlesAt,21);ok(keepRowNote(s,'Synthetic ending note',admit));resetRowsVisit();const html=rowsPage(s,'synthetic');ok(html.includes('bundle picture opened after the ending'),'history timing is honest');
for(const change of [g=>g.start=[1,2],g=>g.source.practiceStart=[1,2],g=>g.source.frames[0].rows=[1,2],g=>g.source.frames.pop(),g=>g.bundlesAt=22,g=>g.draft={row:3,take:null}]){const t=newRowsGame({start:[1,2,4]});change(t);eq(rowsPosition(t),null);}
const legacy=structuredClone(old);legacy.bundlesAt='an older harmless field';ok(rowsPosition(legacy),'legacy interpreter ignores newly named harmless fields');legacy.start=[1,2,4];eq(rowsPosition(legacy),null,'two-row model never becomes three');
const cap=freshState();ok(startRows(cap,{start:[1,2,4]},admit));cap.ribbonRows.current.support=Array.from({length:12},(_,i)=>`unknown-${i}`);let snapshot=structuredClone(cap);ok(!showRowBundles(cap,admit));eq(cap,snapshot,'support cap refusal atomic');cap.ribbonRows.current.support=[];cap.ribbonRows.padding='x'.repeat(ROWS_BYTES);snapshot=structuredClone(cap);ok(!showRowBundles(cap,admit));eq(cap,snapshot,'byte cap refusal atomic');
const table=rowsBundleTable([7,6,5]);ok(table.includes('2 bundles'));ok(table.includes('1 unpaired'));ok(table.includes('7 = 4 + 2 + 1'));ok(!table.includes('<script'));
console.log(`Three-row Ribbon Rows: ${n} assertions passed.`);
