import assert from 'node:assert/strict';
import * as C from '../dist/comparing-orders-core.mjs';
import {renderComparison,comparisonNotes,commitComparison,preflightComparisonDisplay} from '../dist/comparing-orders-ui.mjs';
import {noteComparisonDisplay,bundleQuestionExposure} from '../dist/bundle-broad-exposure.mjs';
import {freshState} from '../dist/core.mjs';
import {ensureBroad} from '../dist/broad-core.mjs';

const copy=structuredClone,options={canExport:()=>true,recordDisplay:noteComparisonDisplay};
const source=C.freshComparisonRoot().source;
assert.equal(source.pip-source.other,12);
assert.deepEqual(source.choiceOrder.compare,['both','extra','remaining']);
assert.deepEqual(source.choiceOrder.return,['extra','start','remaining']);
const blank=freshState();assert.equal(blank.comparisonSupplies,undefined);assert.deepEqual(renderComparison(blank).examples,[]);assert.doesNotMatch(renderComparison(blank).html,/data-comparison-counter|two tens/);

const state=freshState();ensureBroad(state);const q={params:{type:'bundle',hundreds:0,tens:2,ones:3}};
state.broad.drafts['checkin:number-foundation']={question:copy(q),attempts:[],input:'old',model:{type:'counters',count:3},familiar:false,priorExposureUnknown:false};
assert.equal(commitComparison(state,C.startComparison,options),true);
assert.deepEqual(state.comparisonSupplies.shownBundleExamples,['bundle:0:2:3','bundle:0:1:1']);
assert.equal(state.broad.drafts['checkin:number-foundation'].familiar,true);
assert.equal(state.broad.drafts['checkin:number-foundation'].input,'old');
assert.equal(bundleQuestionExposure(state,q).familiar,true);
assert.equal((renderComparison(state).html.match(/data-comparison-counter/g)||[]).length,34);
assert.equal((renderComparison(state).html.match(/data-comparison-ten/g)||[]).length,3);
assert.deepEqual(C.comparisonDisplaySignatures(state.comparisonSupplies),['bundle:0:2:3','bundle:0:1:1']);

for(const mode of ['compare','return']){
 const s={comparisonSupplies:C.freshComparisonRoot()};C.switchComparison(s,mode);
 const seen=new Set(),queue=[s],actions=['add-ten','add-one','undo-ten','undo-one'];
 while(queue.length){const current=queue.shift(),m=C.comparisonView(current).work.model,k=JSON.stringify(m);if(seen.has(k))continue;seen.add(k);
  const pic=renderComparison(current).html;assert.equal((pic.match(/data-comparison-counter/g)||[]).length,mode==='compare'?34:23);
  if(mode==='compare')assert.equal((pic.match(/data-origin="pip"/g)||[]).length,23);
  else assert.equal((pic.match(/data-origin="pip"/g)||[]).length+(pic.match(/data-origin="store"/g)||[]).length,23);
  for(const a of actions){const next=copy(current),before=copy(next),ok=C.moveComparison(next,a);if(ok)queue.push(next);else assert.deepEqual(next,before);}
 }
 assert.equal(seen.size,4);
}

C.setComparisonRaw(state,' 012 ');C.selectComparisonMeaning(state,'extra');C.checkComparison(state);
let w=C.comparisonView(state).work,h=w.checks.at(-1);
assert.deepEqual([h.numberMatches,h.meaningMatches,h.modelComplete],[true,true,false]);
assert.equal(h.support.includes('feedback'),false);
assert.equal(C.keepComparison(state),true);const kept=copy(w.kept);assert.equal(C.keepComparison(state),false,'one kept copy does not silently overwrite');
C.moveComparison(state,'add-ten');C.moveComparison(state,'add-one');assert.equal(C.modelComplete('compare',w.model),true);
assert.equal(C.modelCount('compare',w.model),11);assert.match(renderComparison(state).html,/Earlier picture at this check/);
assert.deepEqual(w.checks[0],h);assert.deepEqual(w.kept,kept);
C.checkComparison(state);assert.deepEqual([w.checks.at(-1).numberMatches,w.checks.at(-1).meaningMatches,w.checks.at(-1).modelComplete],[true,true,true]);
assert.equal(C.keepComparison(state,true),true);assert.notDeepEqual(w.kept,kept);
C.switchComparison(state,'return');w=C.comparisonView(state).work;assert.equal(w.raw,'');assert.equal(w.familiar,true);
C.setComparisonRaw(state,'12');C.selectComparisonMeaning(state,'extra');C.checkComparison(state);
assert.deepEqual([w.checks[0].numberMatches,w.checks[0].meaningMatches,w.checks[0].modelComplete],[true,false,false]);
C.moveComparison(state,'add-one');assert.deepEqual(C.comparisonDisplaySignatures(state.comparisonSupplies),['bundle:0:2:3','bundle:0:2:2']);
C.moveComparison(state,'add-ten');assert.equal(C.modelComplete('return',w.model),true);assert.equal(C.modelCount('return',w.model),11);
assert.deepEqual(C.comparisonDisplaySignatures(state.comparisonSupplies),['bundle:0:2:3','bundle:0:1:2','bundle:0:1:1']);
C.selectComparisonMeaning(state,'remaining');C.checkComparison(state);assert.deepEqual([w.checks.at(-1).numberMatches,w.checks.at(-1).meaningMatches,w.checks.at(-1).modelComplete],[true,true,true]);
assert.equal((renderComparison(state).html.match(/data-comparison-counter/g)||[]).length,23);

const historical=copy(state);historical.comparisonSupplies.source.text.returnPrompt='An earlier return question with different wording.';assert.match(renderComparison(historical).html,/earlier return question/);assert.equal(w.checks.at(-1).source.text.returnPrompt,source.text.returnPrompt);
const bad=copy(state),before=copy(bad);bad.comparisonSupplies.modes.return.checks.splice(0,0,{html:'<script>bad()</script>'});assert.match(renderComparison(bad).html,/unavailable/);assert.doesNotMatch(renderComparison(bad).html,/<script>/);const raw=copy(bad.comparisonSupplies.modes.return.checks[0]);C.checkComparison(bad);assert.deepEqual(bad.comparisonSupplies.modes.return.checks[0],raw);assert.ok(C.readableChecks(bad.comparisonSupplies.modes.return,'return').length>=2);
const sourceBad=copy(state);sourceBad.comparisonSupplies.source.text.returnPrompt={toString:null};assert.match(renderComparison(sourceBad).html,/cannot play/);assert.match(comparisonNotes(sourceBad),/&lt;|returnPrompt/);assert.deepEqual(state,before);

const capped=copy(state);C.switchComparison(capped,'compare');for(let i=0;i<10;i++)C.checkComparison(capped);assert.equal(C.readableChecks(C.comparisonView(capped).work,'compare').length,8);assert.equal(C.comparisonView(capped).work.currentFeedback,7);
const over=copy(capped);over.comparisonSupplies.modes.compare.checks.unshift({future:true});over.comparisonSupplies.modes.compare.checks.push(copy(over.comparisonSupplies.modes.compare.checks.at(-1)));assert.equal(C.readableChecks(over.comparisonSupplies.modes.compare,'compare').length,9);const oldRaw=copy(over.comparisonSupplies.modes.compare.checks[0]);assert.equal(C.checkComparison(over),false);assert.equal(C.checkComparison(over,true),true);assert.deepEqual(over.comparisonSupplies.modes.compare.checks[0],oldRaw);assert.equal(C.readableChecks(over.comparisonSupplies.modes.compare,'compare').length,9);assert.equal(over.comparisonSupplies.modes.compare.currentFeedback,over.comparisonSupplies.modes.compare.checks.length-1);

const refused=copy(state),snapshot=copy(refused);assert.equal(commitComparison(refused,x=>C.moveComparison(x,'undo-one'),{canExport:()=>false,recordDisplay:noteComparisonDisplay}),false);assert.deepEqual(refused,snapshot);
const missing=copy(state);missing.comparisonSupplies.shownBundleExamples=[];assert.equal(preflightComparisonDisplay(missing,C.comparisonDisplaySignatures(missing.comparisonSupplies),{canExport:()=>false,recordDisplay:noteComparisonDisplay}),false);assert.deepEqual(missing.comparisonSupplies.shownBundleExamples,[],'failed display does not mutate signatures');
const recovered={comparisonSupplies:{version:9,html:'<script>bad()</script>'}};const original=copy(recovered.comparisonSupplies);assert.equal(C.recoverComparison(recovered),true);assert.deepEqual(recovered.comparisonSupplies.retainedRaw,original);assert.equal(C.comparisonHistoryUnknown(recovered),true);assert.equal(C.comparisonView(recovered).work!==null,true);
console.log('Comparing Supply Orders source/core/integration checks passed.');
