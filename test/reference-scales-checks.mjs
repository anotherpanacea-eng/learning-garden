// Invented records only; independent expected outcomes for a finite numerical model.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as c from '../dist/compare-records-core.mjs';
import {referenceScaleSource} from '../dist/reference-scales-content.mjs';
import {compareDraft,compareNotebook,compareCanExport,compareReport,exposureOptions} from './compare-records-checks.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
import {compareNotes,comparePage,resetCompareVisit} from '../dist/compare-records-ui.mjs';
import {measuringDeskPage} from '../dist/measuring-desk-ui.mjs';
import {freshMeasurementRoot,measurementView} from '../dist/measuring-desk-core.mjs';
const clone=structuredClone;
export function referenceDraft(){return {...compareDraft('reference-scales'),referenceView:c.newReferenceView()};}
export function historicalReferenceSource(){
 const s=referenceScaleSource();s.id='earlier-scale-model';s.title='Earlier <model> & "scale"';s.axis={max:24,tick:4};
 s.groups=[{id:'copper',label:'Earlier second <scale>',records:[{id:'c1',value:8},{id:'c2',value:10},{id:'c3',value:12}]},{id:'blue',label:'Earlier first & scale',records:[{id:'b1',value:1},{id:'b2',value:2},{id:'b3',value:3}]}];
 const r=s.referenceScales;r.reference=3;r.adjustment={min:0,max:2};r.check={reference:9,groups:[{id:'blue',label:'Check first',records:[0,2,4,9].map((value,i)=>({id:`ch${i}`,value}))},{id:'copper',label:'Check second',records:[{id:'cc1',value:8},{id:'cc2',value:9},{id:'cc3',value:10}]}]};
 r.teaching={steps:['Earlier supplied example with its own arithmetic.'],factsByStep:[[[4,5]]]};r.unknown={retained:'Source-owned historical detail'};return s;
}
export function referenceFixtures(){
 const history=compareNotebook(),d=referenceDraft();d.source=historicalReferenceSource();d.referenceView={...c.newReferenceView(),referenceShown:true,adjustmentShown:true,adjustment:1,checkShown:true,unknown:{retained:true}};d.workingsShown=true;d.workedSeen=1;
 c.keepComparison(history,d,{canExport:compareCanExport});history.compareRecords.push({kind:'record-comparison',v:1,id:'comparison-2',source:{model:'reference-scales-v99'},raw:'Unopened future source'});
 c.keepComparison(history,d,{canExport:compareCanExport});return {history,draft:d};
}
export function runReferenceScaleChecks(){
 const eq=assert.deepEqual,ok=assert.ok,same=assert.equal;
 const source=referenceScaleSource(),work=referenceDraft(),original=clone(source),geometry=c.compareGeometry(source);
 ok(c.isReferenceScaleMode(source));ok(c.validReferenceScaleSource(source));ok(c.validReferenceScaleWork(work));
 eq(source.groups.map(g=>g.records.map(r=>r.value)),[[111,112,113],[94,100,106]]);
 for(const check of [false,true])for(let shift=-20;shift<=20;shift++){
  work.referenceView.adjustment=shift;const stage=c.referenceScaleStage(work,check),preview=c.referenceScalePreview(work,check),blue=check?[61,62,63]:[111,112,113],copper=check?[44,50,56]:[94,100,106];
  same(stage.reference,check?50:100);same(stage.groupId,'blue');same(stage.adjustment,shift);eq(stage.source.groups.map(g=>g.records.map(r=>r.value)),[blue,copper]);
  eq(preview.records.map(r=>r.value),blue.map(n=>n+shift));eq(preview.records.map(r=>r.id),stage.source.groups[0].records.map(r=>r.id));
  eq(preview.summary.mean,{n:(check?62:112)+shift,d:1});eq(preview.summary.median,preview.summary.mean);same(preview.summary.total,(check?186:336)+3*shift);same(preview.summary.range,2);
  const summaries=stage.source.groups.map(g=>c.recordSummary(g.records));eq(summaries.map(s=>[s.mean.n,s.mean.d,s.range]),check?[[62,1,2],[50,1,12]]:[[112,1,2],[100,1,12]]);
  eq(c.compareGeometry(work.source),geometry);eq(work.source,original);
 }
 const fresh=referenceScaleSource();fresh.referenceScales.check.groups[0].records[0].value=1;fresh.referenceScales.glossary[0].meaning='Changed';eq(referenceScaleSource(),original);eq(c.compareSource('reference-scales'),original);
 for(const shift of [-21,21,0.5,NaN]){const w=referenceDraft();w.referenceView.adjustment=shift;ok(!c.validCompareWork(w));same(c.referenceScalePreview(w),null);const s=compareNotebook(),before=clone(s);same(c.keepComparison(s,w,{canExport:compareCanExport}),false);eq(s,before);}
 const invalid=[s=>s.model='reference-scales-v2',s=>delete s.referenceScales,s=>s.referenceScales.v=2,s=>s.referenceScales.unit='minutes',s=>s.referenceScales.reference=151,s=>s.referenceScales.adjustment.min=-121,s=>s.referenceScales.adjustment.max=121,s=>s.referenceScales.adjustment.min=1,s=>s.referenceScales.adjustment.max=-1,s=>s.referenceScales.adjustment.min=-62,s=>s.referenceScales.check.reference=-1,s=>s.referenceScales.adjustableGroupId='missing',s=>s.referenceScales.check.groups[0].id='other',s=>s.referenceScales.check.groups[1].id='blue',s=>s.referenceScales.check.groups[0].records=Array(3),s=>s.referenceScales.check.groups[0].records[1].id='check-blue1',s=>s.referenceScales.check.groups[0].records[0].value=-1,s=>s.referenceScales.copy.intro='',s=>s.referenceScales.copy.reflection='x'.repeat(1001),s=>s.referenceScales.teaching.steps=[],s=>s.referenceScales.teaching.factsByStep[0]=[[0,2]],s=>s.referenceScales.teaching.factsByStep[0]=[[2,3],[3,2]],s=>s.referenceScales.glossary=[],s=>s.referenceScales.glossary[0].term='',s=>s.referenceScales.glossary[0].meaning='x'.repeat(1001)];
 for(const edit of invalid){const w=referenceDraft();edit(w.source);ok(!c.validCompareSource(w.source));ok(!c.validCompareWork(w));same(c.compareWorked(w.source),null);const s=compareNotebook(),before=clone(s);same(c.keepComparison(s,w,{canExport:compareCanExport}),false);eq(s,before);}
 for(const change of [w=>delete w.referenceView,w=>delete w.referenceView.checkShown,w=>w.referenceView.v=2,w=>w.referenceView.adjustmentShown=1]){const w=referenceDraft();change(w);ok(!c.validCompareWork(w));}
 {const w=referenceDraft();w.referenceView.referenceShown=false;w.referenceView.adjustmentShown=true;w.referenceView.checkShown=true;ok(c.validCompareWork(w),'panel history is not a consistency rule');}
 {const w=compareDraft();w.source.model='unrelated-future-mode';w.source.referenceScales={v:99};w.referenceView={unrelated:true};ok(c.validCompareWork(w),'legacy unknown fields retain old validity');}
 {const w=referenceDraft();w.source=historicalReferenceSource();ok(c.validCompareWork(w));const check=c.referenceScaleStage(w,true);eq(check.source.groups.map(g=>g.id),['blue','copper']);eq(check.source.groups.map(g=>g.label),['Check first','Check second']);same(check.reference,9);eq(c.referenceScalePreview(w,true).summary.mean,{n:15,d:4});eq(c.referenceScalePreview(w,true).summary.median,{n:3,d:1});same(c.referenceScaleStage(w).source.groups[0].label,'Earlier second <scale>');
  w.workingsShown=true;eq(c.compareDisplayPairs(w,{page:0,mutable:true}),[[3,10],[2,3]]);eq(c.compareDisplayPairs(w,{page:2,mutable:true}),[],'unopened check has no original arithmetic');
  w.referenceView.adjustmentShown=true;w.referenceView.adjustment=2;eq(c.compareDisplayPairs(w,{page:0,mutable:true}),[[3,10],[2,3]],'unrevealed main reference masks preview');
  w.referenceView.referenceShown=true;eq(c.compareDisplayPairs(w,{page:1,mutable:true}),[[3,10],[2,3],[3,4]]);
  w.referenceView.checkShown=true;eq(c.compareDisplayPairs(w,{page:2,mutable:true}),[[2,3],[3,9],[2,5]],'noninteger mean gives no pair; adjusted even median does');
  w.workingsShown=false;w.workedSeen=1;eq(c.compareDisplayPairs(w,{page:0,mutable:true,workedOpen:true,step:0}),[[4,5]]);eq(c.compareDisplayPairs(w,{page:0,mutable:false,workedOpen:true}),[[4,5]]);eq(c.compareDisplayPairs(w,{page:2,mutable:false,workedOpen:true}),[]);
 }
 {const options=exposureOptions(),w=referenceDraft();w.source=historicalReferenceSource();w.workingsShown=true;w.referenceView.checkShown=true;
  for(const page of [0,2]){const s=compareNotebook();s.broad.drafts.waiting={question:{fact:[2,3]},attempts:[],opaque:true};const baseline=clone(s.baseline),observations=clone(s.broad.observations);ok(c.recordGivenMath(s,c.compareDisplayPairs(w,{page,mutable:true}),options).ok);ok(s.broad.seenFacts.includes('2x3'));ok(s.broad.drafts.waiting.knownFact);eq(s.broad.drafts.waiting.attempts,[]);eq(s.baseline,baseline);eq(s.broad.observations,observations);}
  const hidden=compareNotebook(),before=clone(hidden);w.referenceView.checkShown=false;eq(c.recordGivenMath(hidden,c.compareDisplayPairs(w,{page:2,mutable:true}),options),{ok:true,changed:false});eq(hidden,before);
 }
 {const f=referenceFixtures(),raw=clone(f.history.compareRecords),view=c.compareRecordsView(f.history);eq(view.items.map(i=>i.readable),[true,false,true]);eq(view.items.map(i=>i.index),[0,1,2]);same(view.items[0].raw.source.title,view.items[2].raw.source.title);const report=JSON.stringify(compareReport(f.history),null,2),imported=prepareProgressImport(report);ok(imported.ok);eq(imported.state.compareRecords,raw);same(imported.state.syntheticOther.payload.length,512000);ok(compareCanExport(imported.state));eq(c.compareRecordsView(imported.state).items.map(i=>i.readable),[true,false,true]);
  const again=clone(view.items[0].raw);again.referenceView.adjustment=2;ok(c.keepComparison(f.history,again,{canExport:compareCanExport}));eq(f.history.compareRecords.slice(0,3),raw);eq(f.history.compareRecords[3].referenceView.unknown,{retained:true});
 }
 {const s=compareNotebook(),w=referenceDraft();while((s.compareRecords?.length||0)<24)ok(c.keepComparison(s,w,{canExport:compareCanExport}));const before=clone(s);same(c.keepComparison(s,w,{canExport:compareCanExport}),false);eq(s,before);}
 {const s=compareNotebook(),w=referenceDraft();s.syntheticOther.payload='';const candidate=clone(s);ok(c.keepComparison(candidate,w,{canExport:()=>true}));const padding=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(candidate,null,2)).length-40;s.syntheticOther.payload='x'.repeat(padding);candidate.syntheticOther.payload=s.syntheticOther.payload;ok(recoveryFitsProgressLimits(candidate));ok(!compareCanExport(candidate),'actual pretty report exceeds import limit');const before=clone(s),refs={...s};same(c.keepComparison(s,w,{canExport:compareCanExport}),false);eq(s,before);for(const key of Object.keys(refs))same(s[key],refs[key]);}
 {const s=compareNotebook(),w=referenceDraft();w.source=historicalReferenceSource();w.workingsShown=true;s.syntheticOther.payload='';s.broad.drafts.waiting={question:{fact:[2,3]},attempts:[]};const options=exposureOptions(),pairs=c.compareDisplayPairs(w,{page:0,mutable:true}),candidate=clone(s);ok(c.recordGivenMath(candidate,pairs,{...options,canExport:()=>true}).changed);const padding=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(candidate,null,2)).length-40;s.syntheticOther.payload='x'.repeat(padding);candidate.syntheticOther.payload=s.syntheticOther.payload;ok(recoveryFitsProgressLimits(candidate));ok(!compareCanExport(candidate));const before=clone(s),refs={...s};eq(c.recordGivenMath(s,pairs,options),{ok:false,changed:false});eq(s,before);for(const key of Object.keys(refs))same(s[key],refs[key]);}
 // Exercise the actual Notes renderer: panel choices are descriptive, and its
 // raw block keeps complete frozen sources even when their panels were closed.
 {const {history}=referenceFixtures();history.compareRecords[0].referenceView={...history.compareRecords[0].referenceView,referenceShown:false,adjustmentShown:false,adjustment:2,checkShown:false};
  const before=clone(history),refs={...history},html=compareNotes(history),summary=html.split('<details><summary>Original comparison notes')[0];
  assert.match(summary,/Comparison 1 · Earlier &lt;model&gt; &amp; &quot;scale&quot;/);assert.match(summary,/Reference panel: false; adjustment panel: false; adjustment: 2 g; check panel: false/);assert.match(summary,/Reference panel: true; adjustment panel: true; adjustment: 1 g; check panel: true/);assert.match(summary,/Panel flags retain chosen views, not proof/);assert.doesNotMatch(summary,/set aside:|purpose:|secondary workings disclosed:/);
  const encoded=html.match(/<pre>([\s\S]*?)<\/pre>/)[1],decoded=encoded.replace(/&(amp|lt|gt|quot|#39);/g,(_,key)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[key]));eq(JSON.parse(decoded),before.compareRecords,'actual Notes includes full historical and unavailable sources');
  eq(history,before);for(const key of Object.keys(refs))same(history[key],refs[key]);
 }
 // The later invitation is a read-only cross-owner connection. Its label uses
 // the raw slot number, including unreadable siblings and repeated titles.
 {const {history}=referenceFixtures();history.compareRecords.push({id:'comparison-8',kind:'record-comparison',v:1,source:{model:'reference-scales-v2'},raw:'Last unavailable reference'}, {...clone(compareDraft()),id:'comparison-9',kind:'record-comparison',v:1});
  const keeper=history.compareRecords[2],expectedLabel='Comparison 3 · Earlier &lt;model&gt; &amp; &quot;scale&quot;';
  resetCompareVisit();const chooser=comparePage(history,'synthetic-reference-owner');assert.match(chooser,/<button[^>]*data-cr-open="comparison-3"[^>]*>Comparison 3 · Earlier &lt;model&gt; &amp; &quot;scale&quot;<\/button>/);resetCompareVisit();same(keeper.source.title,history.compareRecords[0].source.title);
  for(const status of ['absent','ready','recovery']){
   const state=clone(history);if(status==='ready'){state.measurementNotes=freshMeasurementRoot();state.measurementNotes.draft.raw={first:'250',second:'250',gap:'50'};}else if(status==='recovery')state.measurementNotes={version:99,raw:'Unopened synthetic jug notebook'};
   same(measurementView(state).status,status);const before=clone(state),refs={...state},html=measuringDeskPage(state,'synthetic-reference-owner');
   assert.match(html,/data-reference-scale-entry href="#learn\/math\/compare-records"/);assert.match(html,/data-reference-scale-return href="#learn\/math\/compare-records"/);ok(html.includes(`<strong>${expectedLabel}</strong>`));assert.doesNotMatch(html,/<strong>Comparison (1|2|4|5) ·/);assert.match(html,/what matching entered jug readings show/);eq(state,before);for(const key of Object.keys(refs))same(state[key],refs[key]);
   const noArtifact=clone(state);noArtifact.compareRecords=noArtifact.compareRecords.filter(item=>!c.validReferenceScaleWork(item));const unkeptBefore=clone(noArtifact),invitation=measuringDeskPage(noArtifact,'synthetic-reference-owner');assert.match(invitation,/data-reference-scale-entry/);assert.doesNotMatch(invitation,/data-reference-scale-return|Bring your kept comparison/);eq(noArtifact,unkeptBefore);
  }
 }
 console.log('Reference Scales: both stages and all 41 adjustments, frozen sources, reserved-family isolation, actual given-math and pretty Notes capacity passed.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runReferenceScaleChecks();
