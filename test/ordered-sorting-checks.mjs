import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {orderedSources,orderedTests} from '../dist/ordered-sorting-content.mjs';
import * as O from '../dist/ordered-sorting-core.mjs';
import {orderedPage} from '../dist/ordered-sorting-ui.mjs';

let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(x,m)=>{assert.ok(x,m);checks++;};
const clone=structuredClone;
const state=()=>initializeExplorerState(freshState());
// Execute the application's actual notes envelope, including its real metadata overhead.
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const notesReport=new Function('recommendations','explorerStore',app.split('\n').find(l=>l.startsWith('function notesReport('))+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'gold',symbol:'leaf'}});
let preflights=0;const fits=s=>{preflights++;return prepareProgressImport(JSON.stringify(notesReport(s),null,2)).ok;};
const work=s=>O.orderedView(s).case.work;
const begun=(caseId='large-first')=>{const s=state();ok(O.startOrdered(s,caseId,fits));return s;};
const configure=(s,p)=>{for(const row of ['first','second'])for(const field of ['test','not','basket'])ok(O.editOrdered(s,row,field,p[row][field],fits));ok(O.editOrdered(s,'otherwise','basket',p.otherwise,fits));};
const configured=(caseId='large-first')=>{const s=begun(caseId);configure(s,work(s).source.requestProgram);return s;};
const finish=s=>{let count=0;while(work(s).trace?.phase!=='sent'&&count<5){const v=O.orderedView(s).case;ok(O.stepOrdered(s,fits,v.needsEviction?v.oldest.run.id:null));count++;}ok(count<=4);return {run:O.orderedView(s).case.result,count};};
const row=(test,basket,not=false)=>({test,not,basket});
const oracleTest=(r,p)=>{const [feature,value]=r.test.split('-');const yes=p[feature]===value;return r.not?!yes:yes;};
const oracle=(p,c)=>oracleTest(p.first,c)?p.first.basket:p.second.test!=='off'&&oracleTest(p.second,c)?p.second.basket:p.otherwise;

{
 const s=state(),before=clone(s);eq(O.orderedView(s).status,'missing');eq(s,before,'reading allocates no optional root');
 for(const source of orderedSources){ok(O.validOrderedSource(source));eq(source.parcels.length,12);eq(new Set(source.parcels.map(p=>`${p.size}/${p.wrap}/${p.stamp}`)).size,12);ok(source.learn.length>1);ok(source.guided.length>1);ok(source.example.parcels.length>=2);for(const step of source.example.steps)ok(source.example.parcels.some(p=>p.id===step.parcelId));}
 eq(orderedTests.length,7);ok(!O.startOrdered(s,'constructor',fits));eq(s,before);
}
// Independent finite oracle covers predicate, NOT, both orders, off and all destination tuples.
{
 const source=orderedSources[0],options=orderedTests.flatMap(t=>[row(t.id,'cart'),row(t.id,'cart',true)]);let outcomes=0;
 for(const a of options)for(const b of [...options,row('off',null)])for(const first of ['cart','lantern','leaf'])for(const second of ['cart','lantern','leaf'])for(const otherwise of ['cart','lantern','leaf']){
  const p={first:{...a,basket:first},second:{...b,basket:b.test==='off'?null:second},otherwise};
  for(const card of source.parcels){const result=O.orderedOutcome(source,p,card.id);eq(result.actualBasket,oracle(p,card));eq(result.requestedBasket,card.size==='large'?'cart':card.stamp==='star'?'lantern':'leaf');if(oracleTest(p.first,card)){eq(result.steps.length,2);eq(result.steps[1].second,'not-tested');ok(!result.steps.some(x=>x.row==='second'));}outcomes++;}
 }
 eq(outcomes,68040);
}
for(const source of orderedSources){
 const s=configured(source.id);ok(O.prepareOrderedDisplay(s,fits).ok);ok(work(s).support.learn&&work(s).support.guided);
 const initialProgram=clone(work(s).program);for(let i=1;i<source.learn.length;i++)ok(O.learnOrdered(s,'next',fits));eq(work(s).learnSeen,source.learn.length);ok(O.learnOrdered(s,'fold',fits));ok(work(s).folded);ok(O.learnOrdered(s,'unfold',fits));ok(!work(s).folded);
 for(const kind of ['hint','example','skip']){ok(O.helpOrdered(s,fits));ok(work(s).support[kind]);}eq(work(s).program,initialProgram,'help never rewrites a program');ok(O.helpOrdered(s,fits));eq(work(s).helpStage,1);
 ok(O.supportOrdered(s,'together',fits));ok(O.supportOrdered(s,'audio',fits));
 ok(O.selectOrderedParcel(s,'large-blue-star',fits));ok(O.predictOrdered(s,'unsure',fits));ok(O.stepOrdered(s,fits));eq(work(s).runs.length,0);ok(!O.predictOrdered(s,'cart',fits));const partial=clone(work(s).trace);ok(O.pageOrdered(s,'compare',fits));eq(work(s).trace,partial);ok(O.chooseOrderedCase(s,source.id==='large-first'?'star-first':'large-first',fits));ok(O.chooseOrderedCase(s,source.id,fits));eq(work(s).trace,partial);
 const imported=prepareProgressImport(JSON.stringify(notesReport(s),null,2));ok(imported.ok);eq(imported.state.orderedSorting,s.orderedSorting);const frozenSource=clone(work(s).trace.source);work(s).source.request='A later changed request';eq(work(s).trace.source,frozenSource,'first read owns source');
 const out=finish(s).run;ok(out);eq(out.prediction,'unsure');ok(out.support.audio&&out.support.skip);eq(out.source,frozenSource);eq(O.orderedView(s).case.result.id,out.id);
 const recorded=clone(out);ok(O.restartOrdered(s,fits));ok(O.compareOrdered(s,fits));eq(work(s).comparison.matchCount,12);eq(O.orderedView(s).case.readable[0].run,recorded);ok(work(s).support.comparison);
 ok(O.historyOrdered(s,out.id,fits));eq(O.orderedView(s).case.history,recorded);eq(O.prepareOrderedDisplay(s,()=>false),{ok:true,changed:false},'history reveals no new live teaching');
}
{
 const s=configured();ok(O.selectOrderedParcel(s,'large-blue-star',fits));eq(finish(s).count,3,'first Yes has read, choose, send');const first=clone(O.orderedView(s).case.result);eq(first.actualBasket,'cart');
 ok(O.swapOrdered(s,fits));eq(work(s).program.first.test,'stamp-star');eq(work(s).program.first.basket,'lantern');eq(work(s).trace,null);eq(work(s).currentResultId,null);eq(work(s).prediction,null);eq(O.orderedView(s).case.readable[0].run,first);eq(finish(s).run.actualBasket,'lantern');
 ok(O.selectOrderedParcel(s,'small-yellow-square',fits));eq(finish(s).count,4,'tested second row has four presses');eq(O.orderedView(s).case.result.actualBasket,'leaf');
 const trace=clone(work(s).trace);ok(O.pageOrdered(s,'build',fits));eq(work(s).trace,trace);ok(O.editOrdered(s,'second','not',true,fits));ok(O.swapOrdered(s,fits));eq(work(s).program.first.not,true,'swap moves full negated tuple');
 ok(O.editOrdered(s,'second','test','off',fits));ok(!O.swapOrdered(s,fits));
}
{
 const s=configured('not-blue');ok(O.selectOrderedParcel(s,'small-blue-star',fits));eq(finish(s).count,3,'off second row is skipped');eq(O.orderedView(s).case.result.steps.at(-1).second,'off');ok(O.compareOrdered(s,fits));eq(work(s).comparison.matchCount,12);
 configure(s,{first:row('wrap-blue','lantern'),second:row('off','cart',true),otherwise:'leaf'});ok(O.compareOrdered(s,fits));eq(work(s).comparison.matchCount,12,'positive form is equivalent despite ignored second settings');ok(O.editOrdered(s,'first','not',true,fits));ok(O.compareOrdered(s,fits));eq(work(s).comparison.matchCount,0,'NOT without destination swap differs on all cards');
}
{
 const s=configured();ok(O.contrastOrdered(s,fits));ok(work(s).support.contrast);eq(work(s).selectedParcel,'large-blue-star');
 ok(O.editOrdered(s,'first','test','size-small',fits));ok(O.editOrdered(s,'second','test','size-large',fits));const prior=clone(work(s));eq(O.orderedOverlap(work(s).source,work(s).program),null);ok(O.contrastOrdered(s,fits));eq(work(s).selectedParcel,prior.selectedParcel);eq(work(s).program,prior.program);
}
// Supported historical sources may use their own IDs, labels, partial cards and outcomes.
{
 const s=configured(),w=work(s);w.source.id='old-case';w.source.title='Older title';w.source.parcels=[{...w.source.parcels[0],id:'old-parcel'}];w.selectedParcel='old-parcel';w.source.future={retained:'synthetic'};ok(O.validOrderedSource(w.source));ok(O.compareOrdered(s,fits));eq(work(s).comparison.rows.length,1);eq(work(s).comparison.source.parcels.length,1);finish(s);
 const r=work(s).runs[0];r.actualBasket='leaf';r.requestedBasket='cart';r.matches=true;r.steps[0].yes=!r.steps[0].yes;eq(O.orderedView(s).case.readable.length,1,'historical outcomes remain shape checked, not regraded');
 work(s).comparison.rows[0].actualBasket='leaf';work(s).comparison.rows[0].matches=false;work(s).comparison.matchCount=0;eq(O.orderedView(s).case.comparisonStatus,'ready');
 const imported=prepareProgressImport(JSON.stringify(notesReport(s),null,2));ok(imported.ok);eq(imported.state.orderedSorting,s.orderedSorting);
}
// Keyed teaching replies render from each recorded source, with evidence-specific triggers.
{
 const keys=['match','mismatch','firstMatch','overlap','finite','equivalent','notReply'];
 const mark=(w,prefix)=>{for(const key of keys)w.source.text[key]=`${prefix} ${key} retained reply`;};
 const contains=(html,reply,message)=>ok(html.includes(reply),message);
 const absent=(html,reply,message)=>ok(!html.includes(reply),message);
 for(const source of orderedSources){
  const s=configured(source.id);mark(work(s),`Frozen ${source.id}`);
  ok(O.selectOrderedParcel(s,source.id==='not-blue'?'large-yellow-star':'large-blue-star',fits));
  const {run}=finish(s);ok(run.matches);eq(run.steps.at(-1).second,'not-tested');
  ok(O.pageOrdered(s,'step',fits));let html=orderedPage(s);
  contains(html,run.source.text.match,`${source.id} shows its recorded match reply`);
  contains(html,run.source.text.firstMatch,`${source.id} explains an untested second row`);
  if(source.id==='not-blue'){
   contains(html,run.source.text.notReply,'active NOT gets its own saved explanation');
   absent(html,run.source.text.overlap,'off second row has no overlap reply');
  }else {
   const card=run.source.parcels.find(p=>p.id===run.parcelId);ok(oracleTest(run.program.first,card)&&oracleTest(run.program.second,card));
   contains(html,run.source.text.overlap,`${source.id} explains both matching tests`);
   absent(html,run.source.text.notReply,'positive program has no NOT reply');
  }
  absent(html,run.source.text.mismatch,'fitting result does not show mismatch reply');
  absent(html,run.source.text.finite,'one fitting card does not prove whole-source agreement');
  ok(O.compareOrdered(s,fits));const comparison=clone(work(s).comparison);eq(comparison.matchCount,comparison.rows.length);
  mark(work(s),`Current ${source.id}`);
  html=orderedPage(s);
  contains(html,run.source.text.firstMatch,'current result keeps the frozen first-match reply');
  for(const key of keys)absent(html,work(s).source.text[key],`current source ${key} does not replace recorded result wording`);
  ok(O.historyOrdered(s,run.id,fits));html=orderedPage(s);contains(html,run.source.text.firstMatch,'selected history keeps the recorded first-match reply');
  for(const key of keys)absent(html,work(s).source.text[key],`current source ${key} does not replace selected history wording`);
  ok(O.pageOrdered(s,'compare',fits));html=orderedPage(s);
  contains(html,comparison.source.text.finite,`${source.id} complete comparison names its finite scope`);
  contains(html,comparison.source.text.equivalent,`${source.id} comparison permits equivalent programs`);
  if(source.id==='not-blue')contains(html,comparison.source.text.notReply,'NOT comparison keeps its source reply');
  else absent(html,comparison.source.text.notReply,'unrelated positive requests get no NOT tip');
  for(const key of keys)absent(html,work(s).source.text[key],`current source ${key} does not replace recorded comparison wording`);
  ok(O.editOrdered(s,'first','basket',source.id==='star-first'?'cart':'lantern',fits));
  finish(s);ok(O.pageOrdered(s,'step',fits));const differing=O.orderedView(s).case.result;ok(!differing.matches);
  html=orderedPage(s);contains(html,differing.source.text.mismatch,`${source.id} differing route has its own source reply`);absent(html,differing.source.text.match,'differing route does not claim a match');
  ok(O.compareOrdered(s,fits));ok(O.pageOrdered(s,'compare',fits));const differs=work(s).comparison;ok(differs.matchCount<differs.rows.length);html=orderedPage(s);
  absent(html,differs.source.text.finite,'partial agreement does not receive the all-cards reply');contains(html,differs.source.text.equivalent,'comparison keeps equivalence invitation even when current routes differ');
 }
 // The positive alternate still compares with the saved NOT request. An off row's waiting NOT is inactive.
 const s=configured('not-blue');mark(work(s),'Positive alternate');
 configure(s,{first:row('wrap-blue','lantern'),second:row('off','cart',true),otherwise:'leaf'});
 ok(O.selectOrderedParcel(s,'small-blue-star',fits));finish(s);ok(O.pageOrdered(s,'step',fits));let html=orderedPage(s);
 absent(html,work(s).source.text.notReply,'NOT on an off second row does not explain a positive run');
 absent(html,work(s).source.text.overlap,'off second row is never an overlap');
 ok(O.compareOrdered(s,fits));const comparison=clone(work(s).comparison);eq(comparison.matchCount,12);mark(work(s),'Changed alternate');ok(O.pageOrdered(s,'compare',fits));html=orderedPage(s);
 contains(html,comparison.source.text.notReply,'positive alternate comparison retains request-owned NOT explanation');
 contains(html,comparison.source.text.equivalent,'positive alternate comparison gives source-owned equivalence reply');
 contains(html,comparison.source.text.finite,'positive alternate agrees on all supplied cards');
 absent(html,work(s).source.text.notReply,'positive alternate does not borrow the changed live request reply');
 // A negated active second row can overlap even though the first match leaves it untested.
 const negated=configured('large-first');mark(work(negated),'Negated overlap');ok(O.editOrdered(negated,'second','not',true,fits));ok(O.selectOrderedParcel(negated,'large-blue-circle',fits));const negatedRun=finish(negated).run;eq(negatedRun.steps.at(-1).second,'not-tested');ok(O.pageOrdered(negated,'step',fits));html=orderedPage(negated);
 contains(html,negatedRun.source.text.notReply,'an active second NOT has a saved explanation even when first match short-circuits');contains(html,negatedRun.source.text.overlap,'overlap reply accounts for negated tests');
 // An Otherwise result has no first-match or overlapping-test explanation.
 const other=configured('large-first');mark(work(other),'Otherwise route');ok(O.selectOrderedParcel(other,'small-yellow-square',fits));finish(other);ok(O.pageOrdered(other,'step',fits));html=orderedPage(other);
 absent(html,work(other).source.text.firstMatch,'Otherwise does not claim the first rule matched');absent(html,work(other).source.text.overlap,'non-overlap parcel does not get priority explanation');
}
// Unsupported harmless case keys remain raw without holding healthy siblings closed.
{
 const s=configured();s.orderedSorting.cases['future note']={raw:'retained future case'};
 eq(O.orderedView(s).status,'ready');eq(O.orderedView(s).case.status,'ready');ok(!Object.hasOwn(O.orderedView(s).cases,'future note'));
 ok(O.supportOrdered(s,'together',fits));ok(O.chooseOrderedCase(s,'not-blue',fits));eq(s.orderedSorting.cases['future note'],{raw:'retained future case'});
 const imported=prepareProgressImport(JSON.stringify(notesReport(s),null,2));ok(imported.ok);eq(imported.state.orderedSorting.cases['future note'],{raw:'retained future case'});
}
// Every sibling is isolated; a current result never borrows an older run.
{
 const s=configured();finish(s);O.restartOrdered(s,fits);finish(s);work(s).runs.at(-1).actualBasket='unreadable-basket';let v=O.orderedView(s).case;eq(v.readable.length,1);eq(v.unreadable.length,1);ok(!v.resultAvailable);ok(O.restartOrdered(s,fits));eq(work(s).runs.at(-1).actualBasket,'unreadable-basket');
 finish(s);work(s).currentResultId=work(s).runs[0].id;ok(!O.orderedView(s).case.resultAvailable,'current ID pointing at an older healthy run is unavailable');work(s).currentResultId=999;ok(!O.orderedView(s).case.resultAvailable);work(s).currentResultId='malformed';work(s).historyId={raw:'selected'};eq(O.orderedView(s).case.status,'ready');ok(!O.orderedView(s).case.resultAvailable);eq(O.orderedView(s).case.history,null);work(s).comparison={later:'raw'};eq(O.orderedView(s).case.comparisonStatus,'recovery');ok(O.editOrdered(s,'first','not',true,fits));
 work(s).trace={later:'raw'};const raw=clone(s.orderedSorting);eq(O.orderedView(s).case.traceStatus,'recovery');ok(!O.restartOrdered(s,fits));eq(s.orderedSorting,raw);ok(O.chooseOrderedCase(s,'not-blue',fits));eq(O.orderedView(s).case.status,'ready');eq(s.orderedSorting.cases['large-first'].trace,{later:'raw'});
 s.orderedSorting.cases['star-first']={version:99,raw:'keep'};ok(O.chooseOrderedCase(s,'star-first',fits));eq(O.orderedView(s).case.status,'recovery');ok(O.chooseOrderedCase(s,'not-blue',fits));
 for(const rawRoot of [null,7,{version:2,cases:{future:'raw'}}]){const t=state();t.orderedSorting=rawRoot;eq(O.orderedView(t).status,'recovery');const before=clone(t);ok(!O.startOrdered(t,'large-first',fits));eq(t,before);const imported=prepareProgressImport(JSON.stringify(notesReport(t),null,2));ok(imported.ok);eq(imported.state.orderedSorting,rawRoot);}
}
// First kept, eight recent and raw siblings survive confirmed single-row eviction.
{
 const s=configured();for(let i=0;i<8;i++){finish(s);O.restartOrdered(s,fits);}const first=clone(work(s).firstKept);eq(O.orderedView(s).case.readable.length,8);
 O.stepOrdered(s,fits);O.stepOrdered(s,fits);O.stepOrdered(s,fits);const before=clone(s);ok(!O.stepOrdered(s,fits));eq(s,before);ok(!O.stepOrdered(s,fits,true),'confirmation names the exact oldest run');eq(s,before);ok(O.stepOrdered(s,fits,O.orderedView(s).case.oldest.run.id));eq(O.orderedView(s).case.readable.length,8);eq(work(s).firstKept,first);
 work(s).runs.splice(1,0,{id:100,raw:'keep'});work(s).runs.push({...clone(work(s).runs.at(-1)),id:101},{...clone(work(s).runs.at(-1)),id:102});work(s).nextRun=103;
 const readable=O.orderedView(s).case.readable.length;ok(readable>8);O.restartOrdered(s,fits);finish(s);eq(O.orderedView(s).case.readable.length,readable,'oversized import removes only one before appending one');ok(work(s).runs.some(r=>r.raw==='keep'));eq(work(s).firstKept,first);
 work(s).firstKept={raw:'unreadable first'};O.restartOrdered(s,fits);finish(s);eq(work(s).firstKept,{raw:'unreadable first'});
}
// Refusals leave the whole notebook untouched, and preflights receive a detached candidate.
{
 const s=configured();const mutations=[cb=>O.editOrdered(s,'first','not',true,cb),cb=>O.swapOrdered(s,cb),cb=>O.selectOrderedParcel(s,'small-blue-circle',cb),cb=>O.predictOrdered(s,'unsure',cb),cb=>O.pageOrdered(s,'step',cb),cb=>O.restartOrdered(s,cb),cb=>O.supportOrdered(s,'audio',cb),cb=>O.learnOrdered(s,'fold',cb),cb=>O.helpOrdered(s,cb),cb=>O.contrastOrdered(s,cb),cb=>O.compareOrdered(s,cb),cb=>O.historyOrdered(s,null,cb),cb=>O.stepOrdered(s,cb),cb=>O.startOrdered(s,'star-first',cb)];
 for(const mutate of mutations){const before=clone(s);ok(!mutate(()=>false));eq(s,before);}
 const before=clone(s);ok(!O.supportOrdered(s,'audio',candidate=>{candidate.postOffice.changed='synthetic';candidate.orderedSorting.cases['large-first'].program.otherwise='leaf';return false;}));eq(s,before);
 const oldPost=clone(s.postOffice);ok(O.supportOrdered(s,'audio',candidate=>{candidate.postOffice.changed='synthetic';return fits(candidate);}));eq(s.postOffice,oldPost,'commit touches only the ordered root');
 O.stepOrdered(s,fits);O.stepOrdered(s,fits);O.stepOrdered(s,fits);const chosen=clone(s);ok(!O.stepOrdered(s,()=>false));eq(s,chosen);
 work(s).nextRun=Number.MAX_SAFE_INTEGER;const max=clone(s);ok(!O.stepOrdered(s,fits));eq(s,max);
}
// All three cases at full retention with comparisons fit the actual formatted export/import.
{
 const s=state();for(const source of orderedSources){ok(O.startOrdered(s,source.id,fits));configure(s,source.requestProgram);for(let i=0;i<10;i++){O.selectOrderedParcel(s,source.parcels[i%12].id,fits);finish(s);}ok(O.compareOrdered(s,fits));}
 const raw=JSON.stringify(notesReport(s),null,2);ok(new TextEncoder().encode(raw).length<MAX_IMPORT_BYTES);const imported=prepareProgressImport(raw);ok(imported.ok);eq(imported.state.orderedSorting,s.orderedSorting);
 for(const source of orderedSources){const v=O.orderedView(imported.state,source.id).case;eq(v.readable.length,8);ok(v.firstKept);eq(v.work.comparison.rows.length,12);}
 const t=configured();O.stepOrdered(t,fits);O.stepOrdered(t,fits);O.stepOrdered(t,fits);const expected=clone(t);ok(O.stepOrdered(expected,fits));const bytes=x=>new TextEncoder().encode(JSON.stringify(notesReport(x),null,2)).length;const added=bytes(expected)-bytes(t);t.padding='x'.repeat(MAX_IMPORT_BYTES-bytes(t)-Math.floor(added/2));ok(fits(t));const before=clone(t);ok(!O.stepOrdered(t,fits),'actual notes overhead blocks an oversized final append');eq(t,before);
 console.log(`Full three-case formatted notes: ${new TextEncoder().encode(raw).length} bytes.`);
}
{const s=state();s.sortingDesk={raw:'older desk'};s.willowDoubleCheck={raw:'older double'};const old=clone({sortingDesk:s.sortingDesk,willowDoubleCheck:s.willowDoubleCheck,postOffice:s.postOffice});ok(O.startOrdered(s,'large-first',fits));ok(O.supportOrdered(s,'together',fits));eq({sortingDesk:s.sortingDesk,willowDoubleCheck:s.willowDoubleCheck,postOffice:s.postOffice},old,'old desks and post office are untouched');}
ok(preflights>100,'all successful mutations use actual report/import preflight');


// Ambiguous duplicate IDs stay raw rather than becoming newly eligible for
// eviction after the other duplicate leaves the readable history window.
{
 const s=configured();for(let i=0;i<8;i++){finish(s);O.restartOrdered(s,fits);}
 const duplicate=clone(work(s).runs[0]);work(s).runs.splice(1,0,duplicate);
 eq(O.orderedView(s).case.readable.length,7);eq(O.orderedView(s).case.unreadable.length,2);
 const rawPair=clone(work(s).runs.filter(r=>r.id===duplicate.id));
 finish(s);O.restartOrdered(s,fits);finish(s);
 eq(work(s).runs.filter(r=>r.id===duplicate.id),rawPair,'both ambiguous original slots remain raw after a new Send and a capped eviction');
 eq(O.orderedView(s).case.readable.length,8);eq(O.orderedView(s).case.unreadable.length,2);
 const imported=prepareProgressImport(JSON.stringify(notesReport(s),null,2));ok(imported.ok);eq(imported.state.orderedSorting,s.orderedSorting);
}

console.log(`${checks} ordered sorting source, finite-oracle, traces, help, historical preservation and atomic preflight checks passed.`);
