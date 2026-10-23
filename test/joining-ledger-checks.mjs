import assert from 'node:assert/strict';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {joiningView,startJoiningOrder,joinOrders,keepJoiningDraft,setJoiningTotal,checkJoiningTotal,moveJoiningOne,openJoiningHelp} from '../dist/joining-orders-core.mjs';
import {bundleQuestionExposure} from '../dist/bundle-broad-exposure.mjs';
import {joiningLedgerPage,resetJoiningLedger} from '../dist/joining-ledger-ui.mjs';
import {freshLedger,moveLedger,ledgerSourceExamples,ledgerResultExample,recordLedgerDisplay,startLedgerCase} from '../dist/joining-ledger-core.mjs';

const fresh=()=>initializeExplorerState(freshState()),copy=structuredClone;
const report=s=>({title:'After the Storm: observations',exportedAt:'2026-10-22T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
const canExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const nbytes=s=>new TextEncoder().encode(s).length;
const actions=['join','separate','wrap','unwrap','place-ones','lift-ones','place-tens','lift-tens'];
let checks=0;
const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const ok=(a,m)=>{assert.ok(a,m);checks++;};
{
 const s=fresh(),prior=copy(s);
 eq(joiningLedgerPage(s,'explorer-1').includes('Start this order'),true,'direct entry has open numeric Start');
 eq(s,prior,'chooser creates no source/root');
 eq(startLedgerCase(s,'full-frame-orders',canExport),{ok:true,changed:true});
 eq(s.joiningOrders.shownBundleExamples,['bundle:0:2:4','bundle:0:1:7']);
 eq(joiningView(s).work.history,[]);
 eq(joiningView(s).work.model.joined,false,'ledger Start does not move saved Join counters');
 const saved=copy(s.joiningOrders);
 {
  resetJoiningLedger();
  let html=joiningLedgerPage(s,'explorer-1');
  eq((html.match(/class="ledger-mark /g)||[]).length,41,'only one current countable picture is in rendered HTML');
  ok(html.includes(saved.cases['full-frame-orders'].source.request.replaceAll("'",'&#39;')),'frozen request is visible in disclosure');
 }
 eq(s.joiningOrders,saved,'render is read-only');
}
for(const source of [
 {id:'steady-orders',dot:13,total:37},
 {id:'full-frame-orders',dot:17,total:41}
]){
 const reached=new Map(),start=freshLedger(),queue=[start];
 while(queue.length){
  const state=queue.shift(),key=JSON.stringify(state);if(reached.has(key))continue;reached.set(key,state);
  for(const action of actions){const next=moveLedger(state,source,action);if(next)queue.push(next);}
 }
 eq(reached.size,source.id==='steady-orders'?4:5,'all finite reachable math states');
 const joined=moveLedger(start,source,'join');
 ok(joined,'Join is open');eq(moveLedger(joined,source,'separate').stage,'separate');
 if(source.id==='full-frame-orders'){
  const wrapped=moveLedger(joined,source,'wrap');ok(wrapped,'11 ones can wrap');
  eq(moveLedger(wrapped,source,'separate'),null,'cannot silently discard a wrapped ten');
  eq(moveLedger(wrapped,source,'unwrap').stage,'joined','Unwrap is the explicit reverse');
  eq(moveLedger(joined,source,'place-ones'),null,'11 cannot occupy one digit cell');
  const ones=moveLedger(wrapped,source,'place-ones');
  eq(moveLedger(ones,source,'unwrap'),null,'cannot unwrap while a written digit stays');
  const finished=moveLedger(ones,source,'place-tens');
  eq(moveLedger(finished,source,'lift-ones'),null,'ones cannot lift before tens');
  eq(moveLedger(moveLedger(finished,source,'lift-tens'),source,'lift-ones').onesPlaced,false);
 }else{
  eq(moveLedger(joined,source,'wrap'),null,'seven ones cannot wrap');
  const ones=moveLedger(joined,source,'place-ones');ok(ones);
  const finished=moveLedger(ones,source,'place-tens');ok(finished);
  eq(moveLedger(finished,source,'separate'),null,'written cells block Separate');
 }
 const s=fresh();startJoiningOrder(s,source.id);joinOrders(s);moveJoiningOne(s,'pip',true);setJoiningTotal(s,' 36 ');checkJoiningTotal(s);keepJoiningDraft(s);openJoiningHelp(s,'help');setJoiningTotal(s,'not yet');const oldWork=copy(joiningView(s).work);
 const operand=ledgerSourceExamples(joiningView(s).source);
 eq(recordLedgerDisplay(s,operand,canExport),{ok:true,changed:true});
 eq(recordLedgerDisplay(s,operand,canExport),{ok:true,changed:false},'repeat display needs no write');
 eq(joiningView(s).work,oldWork,'ledger display does not rewrite Join work');
 eq(recordLedgerDisplay(s,[ledgerResultExample(joiningView(s).source)],canExport),{ok:true,changed:true});
 eq(bundleQuestionExposure(s,{params:{type:'bundle',hundreds:0,tens:source.total===37?3:4,ones:source.total===37?7:1}}).familiar,true);
 ok(canExport(s),'bounded signatures round-trip through the actual import validator');
 const previous=copy(s.joiningOrders);s.joiningOrders.cases[source.id].source.title='Earlier saved title';s.joiningOrders.cases[source.id].source.request='Earlier saved request for these same counters.';
 resetJoiningLedger();const html=joiningLedgerPage(s,'explorer-1');
 ok(html.includes('Earlier saved title')&&html.includes('Earlier saved request'),'older source words win over current catalog');
 eq(s.joiningOrders.shownBundleExamples,previous.shownBundleExamples);
}
{
 const s=fresh(),question={params:{type:'bundle',hundreds:0,tens:2,ones:4}},other={params:{type:'bundle',hundreds:0,tens:2,ones:5}};
 s.broad.drafts['activity:synthetic']={question,attempts:[3],input:'3',familiar:false};
 s.broad.drafts['activity:other']={question:other,attempts:[25],input:'25',familiar:false};const unrelated=copy(s.broad.drafts['activity:other']);
 const before=copy(s.broad.drafts['activity:synthetic']);
 eq(startLedgerCase(s,'steady-orders',canExport).ok,true);
 eq(s.broad.drafts['activity:synthetic'].familiar,true,'only matching waiting question gains familiarity');
 eq(s.broad.drafts['activity:synthetic'].attempts,before.attempts,'existing answer is never regraded');
 eq(s.broad.drafts['activity:synthetic'].input,before.input);
 eq(bundleQuestionExposure(s,other).familiar,false);eq(s.broad.drafts['activity:other'],unrelated,'unrelated waiting params and response stay byte-identical');
}
for(const raw of [null,[],{version:99,original:'<fictional>'}]){
 const s=fresh();s.joiningOrders=raw;const before=copy(s);
 eq(startLedgerCase(s,'steady-orders',canExport).ok,false,'unreadable root cannot be replaced');
 eq(joiningLedgerPage(s,'explorer-1').includes('unfamiliar format'),true);
 eq(s,before,'raw root and siblings remain unchanged');
 eq(prepareProgressImport(JSON.stringify(report(s),null,2)).state.joiningOrders,raw);
}
{
 const s=fresh();s.syntheticPadding='';s.broad.drafts['activity:synthetic']={question:{params:{type:'bundle',hundreds:0,tens:2,ones:4}},attempts:[3],input:'3',familiar:false};
 const baseline=nbytes(JSON.stringify(report(s),null,2));
 const candidate=copy(s);startLedgerCase(candidate,'steady-orders',()=>true);
 const delta=nbytes(JSON.stringify(report(candidate),null,2))-baseline;
 s.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-baseline-delta+8);
 ok(canExport(s),'original full report is still importable');
 const before=copy(s);
 eq(startLedgerCase(s,'steady-orders',canExport).ok,false,'actual wrapper refuses a new near-cap Start');
 eq(s,before,'refusal keeps root absence and all unknown siblings');
}
console.log('Joining ledger source: '+checks+' focused assertions passed.');
