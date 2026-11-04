// Synthetic367 fixtures; no real learner records or observed delivery data.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
import * as e from '../dist/courier-estimates-core.mjs';
const copy=structuredClone;
export const estimateReport=s=>({title:'After the Storm: observations',exportedAt:'2026-11-03T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
export const estimateCanExport=s=>prepareProgressImport(JSON.stringify(estimateReport(s),null,2)).ok;
const options={canExport:estimateCanExport};
export function estimateDraft(id='orchard'){
 return {source:e.estimateSource(id),line:{start:2,rate:2},pin:null,recordId:'r1',requestX:4.5,result:null,support:{worked:false,gaps:false,rise:false,narration:false}};
}
export function estimateNotebook(){
 const s=initializeExplorerState(freshState());s.syntheticOther={payload:'x'.repeat(512000),retained:{version:99,raw:['Synthetic sibling']}};return s;
}
export function historicalEstimateSource(){
 const source=e.estimateSource('orchard');
 source.id='earlier-records';source.title='Earlier <rounds> & "records"';source.context='A different earlier frozen source.';
 source.axes={x:{label:'Earlier route · model blocks',max:1},y:{label:'Earlier time · minutes',max:3}};
 source.rows=[{id:'zero',x:0,y:1},{id:'edge',x:1,y:2}];source.starts=[0,1];source.rates=[0,1];source.requests=[0,0.5,1];
 source.teaching.questions=['Earlier ungraded question.'];source.unknownSource={retained:true};return source;
}
export function estimateFixtures(){
 const base=estimateNotebook(),history=copy(base),draft=estimateDraft();
 draft.source=historicalEstimateSource();draft.line={start:1,rate:1};draft.pin={start:0,rate:1};draft.recordId='zero';draft.requestX=1;
 draft.result={x:0.5,line:{start:0,rate:1},pin:null};draft.support.worked=true;
 const historicalId=e.keepEstimate(history,draft,options);
 history.courierEstimates.push({kind:'future',v:9,id:'estimate-11',raw:'Synthetic unreadable sibling'});
 const brokenHelper=copy(history);brokenHelper.courierEstimates[0].source.worked={v:1,rows:false};
 return {base,history,historicalId,brokenHelper};
}

export function runCourierEstimateChecks(){
 let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},same=(a,b,m)=>{assert.equal(a,b,m);n++;};
 const refusal=(s,d,gate,m)=>{const before=copy(s),refs={...s};same(e.keepEstimate(s,d,{canExport:gate}),false,m);eq(s,before,'refusal leaves every original value');for(const k of Object.keys(refs))same(s[k],refs[k],'refusal keeps original root reference '+k);};
 const nonowner=s=>Object.fromEntries(Object.entries(s).filter(([k])=>k!=='courierEstimates'));
 const expected={orchard:[5,7,6,9,9,12],library:[7,6,9,10,10,11]};
 for(const id of Object.keys(expected)){
  const s=e.estimateSource(id),original=copy(s);ok(e.validEstimateSource(s));ok(e.workedEstimate(s));
  eq(s.rows.map(r=>[r.x,r.y]),expected[id].map((y,i)=>[i+1,y]));eq(s.starts,[0,1,2,3,4,5,6]);eq(s.rates,[0,.5,1,1.5,2]);eq(s.requests,[4.5,10]);
  same(e.estimateRange(s,4.5),'inside');same(e.estimateRange(s,10),'outside');same(e.estimateRange(s,1),'edge');same(e.estimateRange(s,3),'observed');
  // Quarter-minute integer arithmetic is an independent oracle for every line.
  for(let b=0;b<=6;b++)for(let twiceRate=0;twiceRate<=4;twiceRate++){
   const line={start:b,rate:twiceRate/2};ok(e.validEstimateLine(s,line));
   ok(e.estimateValue(line,0)>=0&&e.estimateValue(line,10)<=28,'candidate endpoints fit fixed axes');
   for(const row of s.rows){const quarters=2*twiceRate*row.x+4*b;same(e.estimateValue(line,row.x)*4,quarters,'exact estimate in independent quarter units');same((row.y-e.estimateValue(line,row.x))*4,4*row.y-quarters,'signed gap is recorded minus estimated');}
   for(const twiceX of [9,20])same(e.estimateValue(line,twiceX/2)*4,twiceRate*twiceX+4*b,'exact request value');
  }
  for(const line of [{start:0,rate:0},{start:6,rate:2}])for(const x of [4.5,10]){
   const d=estimateDraft(id);d.pin=copy(line);d.result={x,line:copy(d.line),pin:copy(line)};const state=estimateNotebook();ok(typeof e.keepEstimate(state,d,options)==='string','boundary pinned line/result can be kept');
  }
  eq(s,original,'mathematical views do not move observations');
  s.rows[0].y=0;eq(e.estimateSource(id),original,'factory returns independent sources');
 }
 same(e.estimateSource('unknown'),null);
 {const s=e.estimateSource('orchard');eq(s.worked.rows.map(r=>r.y-e.estimateValue(s.worked.line,r.x)),[0,1,-1],'different example signed gaps');same(e.estimateValue({start:4,rate:1},4.5),8.5);same(e.estimateValue({start:5,rate:1},10),15);}
 {const s=estimateNotebook(),before=copy(s);eq(e.estimatesView(s).items,[]);same(e.estimatesView(s).status,'absent');ok(e.estimatesView(s).canKeep);eq(s,before,'views never initialize owner');for(const gate of [undefined,null,false,()=>false,()=>1,()=>{throw Error('Synthetic gate failure');}])refusal(s,estimateDraft(),gate,'literal true from callable gate required');}
 {const state=estimateNotebook(),other=nonowner(state),refs={...other},d=estimateDraft();d.pin={start:4,rate:1};d.result={x:4.5,line:{start:2,rate:2},pin:null};d.requestX=10;d.support.gaps=true;
  const frozen=copy(d),id=e.keepEstimate(state,d,options);same(id,'estimate-1');ok(e.readableEstimate(state.courierEstimates[0]),'different-result request is readable, not regraded');eq(state.courierEstimates[0],{...frozen,kind:'courier-estimate',v:1,id});eq(nonowner(state),other);for(const k of Object.keys(refs))same(state[k],refs[k],'non-owner reference retained');
  d.source.rows[0].y=0;d.line.rate=0;d.result.line.rate=0;eq(state.courierEstimates[0],{...frozen,kind:'courier-estimate',v:1,id},'Keep captures source, current line and independently used result');
  const old=copy(state.courierEstimates[0]);ok(typeof e.keepEstimate(state,estimateDraft('library'),options)==='string');eq(state.courierEstimates[0],old,'appending leaves earlier snapshot exact');
 }
 {const f=estimateFixtures();ok(e.estimatesView(f.history).items[0].readable);ok(!e.estimatesView(f.history).items[1].readable);ok(e.estimatesView(f.brokenHelper).items[0].readable,'broken optional example cannot close model');same(e.workedEstimate(f.brokenHelper.courierEstimates[0].source),null);const h=historicalEstimateSource();same(e.estimateRange(h,0),'edge');same(e.estimateRange(h,.5),'inside');ok(e.validEstimateSource(h),'smaller historical domain and changed arrays remain source-owned');
  const imported=prepareProgressImport(JSON.stringify(estimateReport(f.history),null,2));ok(imported.ok,'actual pretty-report import accepts retained histories');eq(imported.state.courierEstimates,f.history.courierEstimates);same(imported.state.syntheticOther.payload.length,512000);ok(estimateCanExport(imported.state));
 }
 for(const edit of [s=>s.v=2,s=>s.rows[0].x=Infinity,s=>s.rows[0].x=.25,s=>s.rows[0].y=-1,s=>s.rows.push(copy(s.rows[0])),s=>s.rows=Array(1),s=>s.axes.x.max=0,s=>s.axes.y.max=25,s=>s.starts=[0,0],s=>s.rates=[NaN],s=>s.requests=[10.5],s=>s.id='__proto__',s=>s.rows[0].id='constructor',s=>s.teaching.questions=[]]){
  const s=e.estimateSource('orchard');edit(s);ok(!e.validEstimateSource(s),'malformed base source is unavailable');
 }
 for(const edit of [s=>delete s.worked,s=>s.worked=null,s=>s.worked.rows[0].x=11,s=>s.worked.rows[0].y=29,s=>s.worked.line.rate=3,s=>s.worked.steps=[],s=>s.worked.axes.x.max=0]){
  const s=e.estimateSource('orchard');edit(s);ok(e.validEstimateSource(s));same(e.workedEstimate(s),null,'bad example is isolated from base source');
 }
 for(const edit of [d=>d.line.rate=3,d=>d.pin={},d=>d.recordId='missing',d=>d.requestX=0,d=>delete d.result,d=>d.result={x:0,line:d.line,pin:null},d=>delete d.support.rise,d=>d.support.worked='yes']){
  const state=estimateNotebook(),d=estimateDraft();edit(d);refusal(state,d,estimateCanExport,'malformed draft refuses without a write');
 }
 for(const raw of [null,false,4,'Synthetic earlier format',{v:99}]){const s=estimateNotebook();s.courierEstimates=raw;same(e.estimatesView(s).status,'unsupported');ok(!e.estimatesView(s).canKeep);refusal(s,estimateDraft(),estimateCanExport,'unsupported owner refuses append');ok(estimateCanExport(s),'bounded raw owner remains importable');}
 {const state=estimateNotebook();e.keepEstimate(state,estimateDraft(),options);state.courierEstimates.push(copy(state.courierEstimates[0]));const rows=e.estimatesView(state).items;ok(rows.every(x=>x.ambiguous&&!x.readable),'duplicate ids cannot be opened');same(e.keepEstimate(state,estimateDraft(),options),'estimate-2','ambiguous siblings do not block new unique snapshot');ok(e.estimatesView(state).items[2].readable);}
 for(const raw of [Array(1),Object.assign([],{extra:true}),Object.defineProperty([],'hidden',{value:true}),Object.assign([],{[Symbol('Synthetic')]:true})]){const state=estimateNotebook();state.courierEstimates=raw;const keys=Reflect.ownKeys(raw);ok(!e.estimatesView(state).canKeep);same(e.keepEstimate(state,estimateDraft(),options),false,'sparse and extra-own-key arrays cannot be appended');same(state.courierEstimates,raw,'original raw owner retained');eq(Reflect.ownKeys(raw),keys,'including non-JSON own keys');}
 {const state=estimateNotebook();state.courierEstimates=[{id:'estimate-17',kind:'future',unknown:true}];same(e.keepEstimate(state,estimateDraft(),options),'estimate-18','new ids advance over unreadable entries');while(state.courierEstimates.length<24)ok(typeof e.keepEstimate(state,estimateDraft(),options)==='string');refusal(state,estimateDraft(),estimateCanExport,'cap counts raw entries');state.courierEstimates.push(null);const before=copy(state);const view=e.estimatesView(state);same(view.items.length,25);ok(view.items[1].readable);eq(state,before,'over-cap owner never truncated');}
 {const state=estimateNotebook();state.courierEstimates=[{id:'estimate-999999',v:99}];refusal(state,estimateDraft(),estimateCanExport,'ID ceiling refuses without wrapping');}
 {const state=estimateNotebook(),other=copy(nonowner(state)),d=estimateDraft();ok(typeof e.keepEstimate(state,d,{canExport(candidate){candidate.courierEstimates=[];candidate.syntheticOther.payload='Synthetic callback change';candidate.extra=true;return true;}})==='string');eq(nonowner(state),other);same(state.courierEstimates.length,1);eq(state.courierEstimates[0].source,d.source,'captured owner wins over callback substitutions');}
 {const state=estimateNotebook(),d=estimateDraft();state.syntheticOther.payload='';const candidate=copy(state);ok(typeof e.keepEstimate(candidate,d,{canExport:()=>true})==='string');const padding=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(candidate,null,2)).length-40;state.syntheticOther.payload='x'.repeat(padding);candidate.syntheticOther.payload=state.syntheticOther.payload;ok(recoveryFitsProgressLimits(candidate),'raw candidate fits');ok(!estimateCanExport(candidate),'pretty report metadata crosses true import limit');refusal(state,d,estimateCanExport,'real report-only capacity refusal preserves work');}
 {const state=estimateNotebook(),d=estimateDraft();d.source.unknownSource={retained:['Synthetic source extension']};e.keepEstimate(state,d,options);state.courierEstimates[0].unknownItem={retained:true};const before=copy(state);e.estimatesView(state);eq(state,before,'read preserves all unknown source/item fields');const imported=prepareProgressImport(JSON.stringify(estimateReport(state),null,2));ok(imported.ok);eq(imported.state.courierEstimates,state.courierEstimates);}
 console.log(`Courier Estimates: ${n} arithmetic, source, history, ownership and report checks passed.`);return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runCourierEstimateChecks();
