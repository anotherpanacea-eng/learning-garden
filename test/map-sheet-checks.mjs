// Synthetic map work only; no real locations or learner records.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {readFileSync} from 'node:fs';
import * as m from '../dist/map-sheet-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
import {noteLegacyExposure} from '../dist/broad-core.mjs';
import {noteGardenFactExposure} from '../dist/garden-core.mjs';
import {notePendingBrambleFactExposure,startAdaptiveRival,generateRivalTask} from '../dist/post-rival.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {checkin} from '../dist/content.mjs';
import {storyNodes} from '../dist/story-content.mjs';
import {recordCourierDisplay} from '../dist/courier-estimates-core.mjs';
const copy=structuredClone;
export const mapReport=s=>({title:'After the Storm: observations',exportedAt:'2026-11-03T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
export const mapCanExport=s=>prepareProgressImport(JSON.stringify(mapReport(s),null,2)).ok;
export function mapDraft(id='wide'){return {source:m.mapSheetSource(id),key:20,inset:false,readbackShown:false,workedSeen:0,narration:false};}
export function mapNotebook(){const s=initializeExplorerState(freshState());s.syntheticOther={payload:'x'.repeat(512000),retained:{version:99,raw:['Synthetic sibling']}};return s;}
export function historicalMapSource(){
 const s=m.mapSheetSource('wide');s.id='earlier-map';s.title='Earlier <map> & "path"';s.purpose='A different frozen route.';s.route={from:'Gate',to:'Tower',lengthM:700};s.sheetWidthCm=7;s.otherWidthCm=14;s.keys=[7,5,10];s.features=[{id:'rill',label:'Earlier rill',widthM:21},{id:'crossing',label:'Earlier crossing',widthM:35}];s.readback={from:'Tower',to:'Gate',groundM:35};s.insetKey=5;s.unknownSource={retained:true};return s;
}
export function mapFixtures(){
 const base=mapNotebook(),history=copy(base),d=mapDraft();d.source=historicalMapSource();d.key=7;d.inset=true;d.readbackShown=true;d.workedSeen=2;
 const historicalId=m.keepMapSheet(history,d,{canExport:mapCanExport});history.mapSheets.push({kind:'future',v:9,id:'map-sheet-11',raw:'Synthetic unreadable sibling'});
 const brokenHelper=copy(history);brokenHelper.mapSheets[0].source.worked={steps:false};
 return {base,history,historicalId,brokenHelper};
}
// Trusted actual app helper, with its real dependencies and normalize=false seam.
function actualExposureOptions(){
 const body=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8').match(/function exposeStoryFacts\([\s\S]*?\n}\n/)[0];
 const actual=Function('noteLegacyExposure','noteGardenFactExposure','notePendingBrambleFactExposure','checkin',`return (${body});`)(noteLegacyExposure,noteGardenFactExposure,notePendingBrambleFactExposure,checkin);
 return {canExport:mapCanExport,exposeFacts:(pairs,target)=>actual({facts:pairs},null,target,true,false)};
}
export function runMapSheetChecks(){
 const eq=assert.deepEqual,ok=assert.ok,same=assert.equal;
 const refuse=(state,d,gate)=>{const before=copy(state),refs={...state};same(m.keepMapSheet(state,d,{canExport:gate}),false);eq(state,before);for(const k of Object.keys(refs))same(state[k],refs[k]);};
 // Independent rational oracle uses BigInts and no production arithmetic helpers.
 const oracle=(a,b)=>{let n=BigInt(a),d=BigInt(b),x=n,y=d;while(y){const r=x%y;x=y;y=r;}return {n:Number(n/x),d:Number(d/x)};};
 const lengths={10:[60,'60'],20:[30,'30'],50:[12,'12']};
 for(const id of ['wide','small']){
  const s=m.mapSheetSource(id),original=copy(s);ok(m.validMapSource(s));ok(m.mapWorked(s));
  same(s.route.lengthM,600);eq(s.features.map(f=>f.widthM),[24,15]);same(s.readback.groundM,150);
  for(const key of s.keys){
   const d={...mapDraft(id),key},g=m.sheetGeometry(d),width=id==='wide'?30:12;
   eq(g.routeCm,oracle(600,key));same(m.formatMapRatio(g.routeCm),lengths[key][1]);same(g.fits,600<=width*key);same(g.paperEnd,40+14*width);same(g.routeEnd,40+14*Math.min(lengths[key][0],width));eq(g.spareCm,oracle(width*key-600,key));
   for(const f of s.features){eq(m.divideMap(f.widthM,key),oracle(f.widthM,key));eq(m.divideMap(f.widthM,s.insetKey),oracle(f.widthM,s.insetKey));}
   eq(m.divideMap(s.readback.groundM,key),oracle(150,key));eq(m.divideMap(key,s.insetKey),oracle(key,5));
  }
  eq(s,original);s.features[0].widthM=1;eq(m.mapSheetSource(id),original,'factory sources independent');
 }
 for(const [n,d,result] of [[24,50,'0.48'],[15,20,'0.75'],[21,7,'3'],[1,3,'1/3'],[7,5,'1.4'],[5,7,'5/7'],[-1,8,'-0.125'],[0,7,'0']])same(m.formatMapRatio(m.divideMap(n,d)),result);
 same(m.mapSheetSource('missing'),null);
 assert.throws(()=>m.divideMap(1,0),RangeError);assert.throws(()=>m.formatMapRatio({n:1,d:0}),RangeError);
 {const d=mapDraft(),s=mapNotebook();d.source.worked={steps:['Earlier teaching.'],factsByStep:[[]]};d.workedSeen=3;ok(m.validMapWork(d));ok(m.keepMapSheet(s,d,{canExport:mapCanExport}));same(s.mapSheets[0].workedSeen,3,'shorter retained helper does not rewrite historic disclosure');}
 {const d=mapDraft();d.source=historicalMapSource();d.key=7;d.inset=true;d.readbackShown=true;d.workedSeen=2;const before=copy(d),r=m.resizeMapWork(d);ok(m.validMapWork(r));same(r.source.sheetWidthCm,14);same(r.source.otherWidthCm,7);same(r.source.resizedFromWidthCm,7);same(r.source.title,'Same route · 14 centimeter sheet');same(r.source.purpose,'Fit the Gate-to-Tower path on 14 centimeters of usable paper.');same(r.key,7);same(r.source.route.lengthM,700);eq(r.source.features,d.source.features);eq(r.source.worked,d.source.worked);eq(d,before);same(m.sheetGeometry(r).viewportCm,30);same(m.sheetGeometry(r).routeCm.n,100);r.source.route.from='Other';eq(d,before);}
 for(const edit of [s=>s.v=2,s=>s.id='__proto__',s=>s.keys=[7,7],s=>s.keys=Array(2),s=>s.keys=[0],s=>s.keys=[101],s=>s.features=[],s=>s.features.push(copy(s.features[0])),s=>s.features[0].widthM=.5,s=>s.route.lengthM=20001,s=>s.readback.groundM=0,s=>s.detailWidthCm=101,s=>s.insetKey=0,s=>s.purpose='',s=>s.route.from='x'.repeat(161)]){const s=m.mapSheetSource('wide');edit(s);ok(!m.validMapSource(s));}
 for(const value of [null,0,30,101,1.5,'12']){const s=m.mapSheetSource('wide');s.otherWidthCm=value;ok(m.validMapSource(s));same(m.mapOtherWidth(s),null);same(m.resizeMapWork({...mapDraft(),source:s}),null);}
 for(const edit of [s=>delete s.worked,s=>s.worked.steps=[],s=>s.worked.factsByStep=[],s=>s.worked.factsByStep[0]=[[0,2]],s=>s.worked.factsByStep[0]=[[2,3],[3,2]],s=>s.worked.factsByStep=Array(3)]){const d=mapDraft();edit(d.source);ok(m.validMapSource(d.source));same(m.mapWorked(d.source),null);d.workedSeen=8;ok(m.validMapWork(d),'broken helper isolates main view');ok(m.keepMapSheet(mapNotebook(),d,{canExport:mapCanExport}));}
 {const d=mapDraft();eq(m.mapDisplayPairs(d,{page:0,mutable:true}),[[1,10]]);d.inset=true;eq(m.mapDisplayPairs(d,{page:1,mutable:true}),[[1,10],[1,5],[3,5],[4,5]]);eq(m.mapDisplayPairs(d,{page:2,mutable:true}),[[1,10]]);d.readbackShown=true;eq(m.mapDisplayPairs(d,{page:2,mutable:true}),[[1,10]]);d.key=10;eq(m.mapDisplayPairs(d,{page:1,mutable:false}),[[1,10],[1,5],[3,5],[2,5]]);d.key=50;eq(m.mapDisplayPairs(d,{page:1,mutable:false}),[[1,5],[3,5],[5,10]]);}
 {const d=mapDraft();d.source=historicalMapSource();d.key=7;eq(m.mapDisplayPairs(d,{page:2,mutable:false}),[[1,7]]);d.readbackShown=true;eq(m.mapDisplayPairs(d,{page:2,mutable:false}),[[1,7],[5,7]],'historical readback operands');d.source.insetKey=7;d.inset=true;eq(m.mapDisplayPairs(d,{page:1,mutable:false}),[[1,7],[3,7],[5,7]],'equal inset deduplicates');d.source.insetKey=14;eq(m.mapDisplayPairs(d,{page:1,mutable:false}),[[1,7],[3,7],[5,7],[2,7]],'farther ratio reciprocal qualifies actual factors');d.source.worked.factsByStep=[[[2,3]],[[3,4]],[[5,6]]];d.workedSeen=2;eq(m.mapDisplayPairs(d,{page:0,mutable:true,workedOpen:true,step:1}),[[1,7],[1,5],[1,10],[3,4]]);eq(m.mapDisplayPairs(d,{page:0,mutable:false,workedOpen:true}),[[1,7],[2,3],[3,4]]);eq(m.mapDisplayPairs(d,{page:0,mutable:false,workedOpen:false}),[[1,7]]);eq(m.mapDisplayPairs(d,{page:2,mutable:false,workedOpen:true}),[[1,7],[5,7]],'other turns hide worked prose');}
 {const f=mapFixtures();ok(m.mapSheetsView(f.history).items[0].readable);ok(!m.mapSheetsView(f.history).items[1].readable);ok(m.mapSheetsView(f.brokenHelper).items[0].readable);const result=prepareProgressImport(JSON.stringify(mapReport(f.history),null,2));ok(result.ok);eq(result.state.mapSheets,f.history.mapSheets);same(result.state.syntheticOther.payload.length,512000);ok(mapCanExport(result.state));}
 {const state=mapNotebook(),d=mapDraft(),before=copy(state),refs={...state};same(m.mapSheetsView(state).status,'absent');ok(m.mapSheetsView(state).canKeep);eq(state,before);for(const gate of [undefined,null,()=>false,()=>1,()=>{throw Error('Synthetic refusal');}])refuse(state,d,gate);same(m.keepMapSheet(state,d,{canExport:mapCanExport}),'map-sheet-1');for(const k of Object.keys(refs))same(state[k],refs[k]);const saved=copy(state.mapSheets);d.source.route.lengthM=1;eq(state.mapSheets,saved);}
 for(const raw of [null,false,4,'Earlier format',{v:99}]){const state=mapNotebook();state.mapSheets=raw;same(m.mapSheetsView(state).status,'unsupported');refuse(state,mapDraft(),mapCanExport);}
 for(const raw of [Array(1),Object.assign([],{extra:true}),Object.defineProperty([],'hidden',{value:true}),Object.assign([],{[Symbol('Synthetic')]:true})]){const state=mapNotebook();state.mapSheets=raw;ok(!m.mapSheetsView(state).canKeep);same(m.keepMapSheet(state,mapDraft(),{canExport:mapCanExport}),false);same(state.mapSheets,raw);}
 {const state=mapNotebook();m.keepMapSheet(state,mapDraft(),{canExport:mapCanExport});state.mapSheets.push(copy(state.mapSheets[0]),{v:99,id:'map-sheet-17'});ok(m.mapSheetsView(state).items.slice(0,2).every(i=>i.ambiguous&&!i.readable));same(m.keepMapSheet(state,mapDraft(),{canExport:mapCanExport}),'map-sheet-18');while(state.mapSheets.length<24)ok(m.keepMapSheet(state,mapDraft(),{canExport:mapCanExport}));refuse(state,mapDraft(),mapCanExport);state.mapSheets.push(null);same(m.mapSheetsView(state).items.length,25);ok(m.mapSheetsView(state).items[3].readable);}
 {const state=mapNotebook();state.mapSheets=[{id:'map-sheet-999999',v:99}];refuse(state,mapDraft(),mapCanExport);}
 {const state=mapNotebook(),before=copy(state);same(m.keepMapSheet(state,mapDraft(),{canExport(c){c.mapSheets=[];c.syntheticOther=null;c.injected=true;return true;}}),'map-sheet-1');same(state.mapSheets.length,1);eq(state.syntheticOther,before.syntheticOther);same(state.injected,undefined);}
 {const state=mapNotebook();state.syntheticOther.payload='';const candidate=copy(state);m.keepMapSheet(candidate,mapDraft(),{canExport:()=>true});const padding=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(candidate,null,2)).length-40;state.syntheticOther.payload='x'.repeat(padding);candidate.syntheticOther.payload=state.syntheticOther.payload;ok(recoveryFitsProgressLimits(candidate));ok(!mapCanExport(candidate));refuse(state,mapDraft(),mapCanExport);}
 same(recordCourierDisplay,m.recordGivenMath,'two concrete callers share exactly the extracted transaction');
 const options=actualExposureOptions();
 const pending=()=>{const s=mapNotebook(),v=startPostOffice(s,deliveries[0].id);startAdaptiveRival(s);v.rival.task=generateRivalTask('multiply',3,5,0);s.broad.raw=[{v:99,raw:['Synthetic retained history']}];s.broad.drafts.matching={question:{fact:[3,5]},attempts:[],opaque:true};s.broad.drafts.other={question:{fact:[5,7]},attempts:[]};s.garden.visits.push({id:'future-visit',entrance:'future',v:99,drafts:{raw:'retained'}});return s;};
 {const s=pending(),before=copy(s),refs={...s},d=mapDraft();d.inset=true;const pairs=m.mapDisplayPairs(d,{page:1,mutable:true});ok(m.recordGivenMath(s,pairs,options).changed);ok(s.broad.seenFacts.includes('3x5'));ok(s.broad.drafts.matching.knownFact);same(s.broad.drafts.other.knownFact,undefined);ok(s.postOffice.visits[0].rival.priorFactShown);eq(s.broad.raw,before.broad.raw);eq(s.garden.visits,before.garden.visits);same(s.syntheticOther,refs.syntheticOther);eq(s.baseline.observations,before.baseline.observations);const post=copy(s.postOffice);delete post.visits[0].rival.priorFactShown;eq(post,before.postOffice);const once=copy(s);eq(m.recordGivenMath(s,pairs,options),{ok:true,changed:false});eq(s,once);}
 {const s=pending(),before=copy(s);ok(m.recordGivenMath(s,[[3,5]],{...options,canExport(c){c.broad.seenFacts=[];c.mapSheets=['Wrong owner'];c.syntheticOther=null;c.postOffice=null;return true;}}).ok);ok(s.broad.seenFacts.includes('3x5'));ok(s.postOffice.visits[0].rival.priorFactShown);eq(s.syntheticOther,before.syntheticOther);same(s.mapSheets,undefined);}
 for(const damage of [s=>delete s.baseline,s=>s.broad.seenFacts='Unreadable']){const s=pending();damage(s);const before=copy(s),refs={...s};eq(m.recordGivenMath(s,[[3,5]],options),{ok:false,changed:false});eq(s,before);for(const k of Object.keys(refs))same(s[k],refs[k]);}
 {const s=pending(),before=copy(s);for(const opts of [{},{canExport:()=>true},{exposeFacts:()=>{}},{...options,canExport:()=>false},{...options,exposeFacts:()=>{throw Error('Synthetic helper failure');}}]){eq(m.recordGivenMath(s,[[3,5]],opts),{ok:false,changed:false});eq(s,before);}eq(m.recordGivenMath(s,[],{}),{ok:true,changed:false});}
 {const s=mapNotebook(),d=mapDraft();d.source.keys=[4];d.source.readback.groundM=24;d.key=4;d.readbackShown=true;s.baseline.draft={questionId:'fact-a',attempts:[],opaque:true};const before=copy(s.baseline);ok(m.recordGivenMath(s,m.mapDisplayPairs(d,{page:2,mutable:false}),options).ok);eq(s.baseline,{...before,draft:{...before.draft,exposed:true}});const nonmatching=mapNotebook();nonmatching.baseline.draft={questionId:'fact-b',attempts:[]};const old=copy(nonmatching.baseline);m.recordGivenMath(nonmatching,m.mapDisplayPairs(d,{page:2,mutable:false}),options);eq(nonmatching.baseline,old);}
 {const node=Object.values(storyNodes).find(n=>n.facts?.some(p=>p.every(x=>Number.isInteger(x)&&x>=2&&x<=12)));ok(node);const [a,b]=node.facts.find(p=>p.every(x=>Number.isInteger(x)&&x>=2&&x<=12));const s=mapNotebook(),d=mapDraft();d.source.keys=[b];d.key=b;d.source.features=[{id:'synthetic-feature',label:'Synthetic feature',widthM:a*b}];s.garden.visits.push({id:'synthetic-visit',entrance:node.entrance,drafts:{[node.id]:{attempts:[],opaque:true},unknown:{raw:'Retain synthetic unknown draft'}}});const before=copy(s.garden);ok(m.recordGivenMath(s,m.mapDisplayPairs(d,{page:1,mutable:false}),options).ok);const v=s.garden.visits.at(-1);ok(v.drafts[node.id].knownFact);eq(v.drafts.unknown,before.visits.at(-1).drafts.unknown);delete v.drafts[node.id].knownFact;eq(s.garden,before);}
 {const s=pending();s.syntheticOther.payload='';const candidate=copy(s);ok(m.recordGivenMath(candidate,[[3,5]],{...options,canExport:()=>true}).changed);const padding=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(candidate,null,2)).length-40;s.syntheticOther.payload='x'.repeat(padding);candidate.syntheticOther.payload=s.syntheticOther.payload;ok(recoveryFitsProgressLimits(candidate));ok(!mapCanExport(candidate));const before=copy(s),refs={...s};eq(m.recordGivenMath(s,[[3,5]],options),{ok:false,changed:false});eq(s,before);for(const k of Object.keys(refs))same(s[k],refs[k]);}
 console.log('Map sheet: exact arithmetic, geometry, frozen history, ownership, transfer and actual exposure checks passed.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runMapSheetChecks();
