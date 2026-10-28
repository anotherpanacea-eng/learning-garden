import assert from 'node:assert/strict';
import {freshState,recommendations,restoreStateResult} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {lanternCodeSource} from '../dist/lantern-codes-content.mjs';
import * as C from '../dist/lantern-codes-core.mjs';

let checks=0;
const ok=(value,label)=>{assert.ok(value,label);checks++;};
const eq=(actual,expected,label)=>{assert.deepEqual(actual,expected,label);checks++;};
const clone=structuredClone,source=clone(lanternCodeSource);
const seed=()=>initializeExplorerState(freshState());
// Match app.mjs notesReport with a fixed synthetic export time/profile.
const report=state=>({title:'After the Storm: observations',exportedAt:'2026-01-01T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(state),...state});
const serialize=state=>JSON.stringify(report(state),null,2);
const options={canExport:state=>prepareProgressImport(serialize(state)).ok};
const work=state=>C.codeView(state).work;
const accept=(result,label)=>{ok(result?.ok,label||result?.error);return result;};
function refuse(state,action,label){const before=clone(state);ok(!action().ok,label);eq(state,before,`${label}: exact atomic refusal`);}
function make(preset='blank'){const state=seed();accept(C.startCodes(state,preset,options));return state;}
function roundTrip(state,label){const before=clone(state.lanternCodes),result=prepareProgressImport(serialize(state));ok(result.ok,`${label}: actual formatted report imports`);eq(result.state.lanternCodes,before,`${label}: exact branch round trip`);eq(restoreStateResult(JSON.stringify(state)).state.lanternCodes,before,`${label}: generic restore is opaque`);return result.state;}
const ids=source.messages.map(m=>m.id);
const blank=()=>Object.fromEntries(ids.map(id=>[id,'']));
const longCount=pattern=>[...pattern].filter(c=>c==='L').length;
const observation=(pattern,rain)=>rain?'L'.repeat(longCount(pattern)):pattern;
const cost=(pattern,rules)=>{const longs=longCount(pattern),shorts=pattern.length-longs;return shorts*rules.short+longs*rules.long+Math.max(0,pattern.length-1)*rules.gap;};
const patterns=[];
function extend(prefix){if(prefix)patterns.push(prefix);if(prefix.length<5){extend(`${prefix}S`);extend(`${prefix}L`);}}
extend('');
eq(patterns.length,62,'enumerate every one-through-five-flash pattern');
ok(C.validCodeSource(source),'current reviewed source is structurally readable');
eq(source.rules,{maxFlashes:5,short:1,long:3,gap:1,rain:'long-only'},'new visits use reviewed model constants');
eq(ids,['safe','water','boards','help'],'current authored message identities');

// Independent long-count and arithmetic oracles, not production helper compositions.
for(const pattern of patterns){
  eq(C.observe(pattern,false),pattern,`clear preserves ${pattern}`);
  eq(C.observe(pattern,true),'L'.repeat(longCount(pattern)),`rain observation for ${pattern}`);
  eq(C.beats(pattern,source.rules),cost(pattern,source.rules),`sender beats for ${pattern}`);
  for(const rules of [{short:10,long:1,gap:0},{short:2,long:9,gap:10}])eq(C.beats(pattern,rules),cost(pattern,rules),'saved costs and gaps are used');
}
eq(C.beats('',source.rules),0,'no gap cost for empty pattern');
eq(C.beats('S',source.rules),1);eq(C.beats('L',source.rules),3);eq(C.beats('SL',source.rules),5);
const signatures=new Set(patterns.map(p=>C.observe(p,true)));
eq([...signatures].sort((a,b)=>a.length-b.length),['','L','LL','LLL','LLLL','LLLLL'],'no timing or missing-position evidence survives rain');

// 62 × 62 × 2 finite sender/receiver/weather matrix. Only one receiver entry is
// assigned, so an independent equality check establishes matching and precedence.
let pairs=0;
for(const sent of patterns)for(const received of patterns)for(const rain of [false,true]){
  const sender={safe:sent},card={water:received};
  const visible=observation(sent,rain),matches=visible!==''&&visible===observation(received,rain);
  const row=C.decode(source,sender,card,'safe',rain);
  eq(row.observed,visible,'independent pair observation');
  eq(row.candidates,matches?['water']:[],'independent pair candidate membership');
  eq(row.outcome,!visible?'invisible':matches?'read-other':'unlisted','independent pair result');
  const aligned=C.decode(source,sender,{safe:received},'safe',rain);
  eq(aligned.outcome,!visible?'invisible':matches?'read':'unlisted','identity determines read versus read-other');
  pairs++;
}
eq(pairs,7688,'complete paired-pattern/weather test space');

// Explicit whole-card fixtures exercise aggregation and all seven outcomes.
const fixtures=[
  {sent:{safe:''},card:null,rain:true,observed:'',candidates:[],outcome:'unassigned'},
  {sent:{safe:'SS'},card:null,rain:true,observed:'',candidates:[],outcome:'invisible'},
  {sent:{safe:'S'},card:null,rain:false,observed:'S',candidates:[],outcome:'no-card'},
  {sent:{safe:'L'},card:{safe:'S',water:'',boards:'',help:''},rain:false,observed:'L',candidates:[],outcome:'unlisted'},
  {sent:{safe:'SL'},card:{safe:'SL',water:'',boards:'',help:''},rain:false,observed:'SL',candidates:['safe'],outcome:'read'},
  {sent:{safe:'L'},card:{safe:'S',water:'L'},rain:false,observed:'L',candidates:['water'],outcome:'read-other'},
  {sent:{safe:'SL'},card:{safe:'LS',water:'SS',boards:'L',help:''},rain:true,observed:'L',candidates:['safe','boards'],outcome:'ambiguous'},
  {sent:{safe:'L'},card:{safe:'L',water:'SL',boards:'LS',help:'SSL'},rain:true,observed:'L',candidates:ids,outcome:'ambiguous'},
  {sent:{safe:'SS'},card:{safe:'S',water:'SS',boards:'',help:''},rain:true,observed:'',candidates:[],outcome:'invisible'},
];
for(const fixture of fixtures){
  const row=C.decode(source,fixture.sent,fixture.card,'safe',fixture.rain);
  eq(row,{id:'safe',observed:fixture.observed,candidates:fixture.candidates,outcome:fixture.outcome,feedback:source.copy.outcomes[fixture.outcome]},'explicit card/result fixture');
}
eq(new Set(fixtures.map(f=>f.outcome)).size,7,'every commissioned outcome covered');

for(const [preset,total,clearWorks,rainWorks]of [['a',12,true,false],['b',36,true,true]]){
  const p=source.presets.find(p=>p.id===preset).patterns;
  eq(C.assessDesign(source,p,false),{complete:true,works:clearWorks,totalBeats:total,views:ids.map(id=>p[id])},'clear reference comparison');
  eq(C.assessDesign(source,p,true),{complete:true,works:rainWorks,totalBeats:total,views:ids.map(id=>observation(p[id],true))},'rain reference comparison');
}
eq(C.assessDesign(source,{safe:'SL'},true),{complete:false,works:false,totalBeats:5,views:['L','','','']},'partial total never implies a complete successful code');
for(const rain of [false,true])ok(!C.assessDesign(source,{safe:'L',water:'L',boards:'LL',help:'LLL'},rain).works,'duplicate originals never form a robust design');

// Real operations distinguish blank sends, partial cards, and outdated agreements.
{
  const state=make(),initial=clone(state);
  refuse(state,()=>C.runCodeTest(state,'send',options),'blank Send refuses');
  eq(state,initial);
  accept(C.runCodeTest(state,'all',options));
  eq(work(state).tests[0].rows.map(r=>r.outcome),Array(4).fill('unassigned'),'all-message test records four blank rows without a card');
  accept(C.editCodes(state,'append','S',options));accept(C.runCodeTest(state,'send',options));
  eq(work(state).tests.at(-1).rows[0].outcome,'no-card');
  accept(C.shareCodes(state,options));const card=clone(work(state).card);
  accept(C.runCodeTest(state,'send',options));eq(work(state).tests.at(-1).rows[0].outcome,'read');
  accept(C.editCodes(state,'append','L',options));eq(work(state).card,card,'editing does not silently replace Dot card');
  accept(C.runCodeTest(state,'send',options));eq(work(state).tests.at(-1).rows[0].outcome,'unlisted');
  accept(C.editCodes(state,'select','water',options));accept(C.editCodes(state,'append','S',options));
  accept(C.runCodeTest(state,'send',options));eq(work(state).tests.at(-1).rows[0].outcome,'read-other','outdated card can read the other message');
  accept(C.editCodes(state,'rain',true,options));accept(C.runCodeTest(state,'all',options));
  eq(work(state).tests.at(-1).rows.map(r=>r.outcome),['unlisted','invisible','unassigned','unassigned'],'partial actual card remains distinct from matching reference card');
  accept(C.editCodes(state,'select','safe',options));accept(C.editCodes(state,'pop',null,options));
  eq(work(state).patterns.safe,'S');accept(C.editCodes(state,'clear',null,options));
  eq(work(state).patterns,{safe:'',water:'S',boards:'',help:''},'clear affects selected pattern only');
  roundTrip(state,'partial and outdated card tests');
}

// FullSource, outputs and supports are snapshots; later work never rewrites them.
{
  const state=make('b');accept(C.shareCodes(state,options));accept(C.editCodes(state,'rain',true,options));
  for(const help of ['help','example','audio','together','trace'])accept(C.supportCodes(state,help,options));
  accept(C.runCodeTest(state,'all',options));accept(C.keepCodes(state,options));
  const test=clone(work(state).tests[0]),kept=clone(work(state).kept[0]);
  ok(C.validCodeTest(test));ok(C.validKeptCode(kept));eq(test.rows.map(r=>r.outcome),Array(4).fill('read'));
  eq(test.helpBefore,['help','example','audio','together','trace']);
  accept(C.supportCodes(state,'trace',options));eq(work(state).support.length,5,'support is unique');
  accept(C.editCodes(state,'append','S',options));accept(C.shareCodes(state,options));
  work(state).source.messages[0].label='Earlier own wording';work(state).source.copy.outcomes.read='Earlier saved feedback';
  eq(work(state).tests[0],test,'test source/card/pattern/result/help freeze after editing');
  eq(work(state).kept[0],kept,'kept source/card/pattern/support freeze after editing');
  const beforeNew=clone(work(state)),oldKey=C.codeView(state).root.current;
  const next=accept(C.startCodes(state,'a',options));ok(next.key!==oldKey,'preset creates a separate visit');
  eq(C.codeView(state).root.visits[oldKey],beforeNew,'preset copy preserves earlier work');
  accept(C.resumeCodes(state,oldKey,options));eq(work(state),beforeNew);
  const restored=roundTrip(state,'frozen tests and keeps');
  eq(work(restored).tests[0],test);eq(work(restored).kept[0],kept);
  // A historical output is displayed as recorded, even if it disagrees with a
  // recomputed current result; structural reading never runs a fresh assessment.
  work(restored).tests[0].rows[0].feedback='Earlier recorded explanation';
  work(restored).tests[0].rows[0].outcome='unlisted';
  work(restored).tests[0].rows[0].candidates=[]; // Self-consistent earlier result, not today's recomputation.
  ok(C.validCodeTest(work(restored).tests[0]),'bounded historic outcome is not regraded');
  roundTrip(restored,'original recorded outcomes');
}

// Retired own-source IDs/counts/keys and computation constants remain usable.
for(const count of [1,3,8]){
  const state=make(),w=work(state);
  w.source.messages=Array.from({length:count},(_,i)=>({id:`earlier-${i}`,label:`Earlier message ${i}`}));
  w.source.id='earlier-source';w.source.title='Earlier code';
  w.source.rules={maxFlashes:8,short:10,long:2,gap:0,rain:'long-only'};
  w.source.presets=[{id:'earlier-preset',title:'Earlier comparison',patterns:{}}];
  w.patterns={};w.card=null;w.selected='earlier-0';
  ok(C.validCodeSource(w.source),'retired own-source count and preset key accepted');
  ok(C.validPatterns(w.source,w.patterns),'missing assigned entries are absent, not invalid');
  accept(C.editCodes(state,'append','S',options));accept(C.editCodes(state,'append','L',options));
  accept(C.shareCodes(state,options));accept(C.runCodeTest(state,'all',options));
  eq(work(state).tests[0].totalBeats,12,'saved costs and zero gap override current catalog');
  eq(work(state).tests[0].rows.length,count,'test size follows saved messages');
  eq(work(state).tests[0].rows[0].outcome,'read');
  eq(work(state).tests[0].rows.slice(1).map(r=>r.outcome),Array(count-1).fill('unassigned'));
  roundTrip(state,`retired ${count}-message source`);
  for(let i=0;i<6;i++)accept(C.editCodes(state,'append','L',options));
  eq(work(state).patterns['earlier-0'].length,8,'retired max-flash bound used');
  refuse(state,()=>C.editCodes(state,'append','S',options),'saved max-flash bound refuses ninth');
}
for(const change of [s=>s.messages=[],s=>s.messages=Array.from({length:9},(_,i)=>({id:`m-${i}`,label:'x'})),s=>s.messages[1].id=s.messages[0].id,s=>s.rules.maxFlashes=0,s=>s.rules.maxFlashes=9,s=>s.rules.short=0,s=>s.rules.long=11,s=>s.rules.gap=-1,s=>s.rules.gap=11,s=>s.rules.rain='future-mode',s=>s.model='future-model',s=>s.version=2]){
  const value=clone(source);change(value);ok(!C.validCodeSource(value),'unknown/unbounded model rejected for computation');
}
for(const value of [{safe:'X'},{safe:'SSSSSS'},{absent:'S'},[],null])ok(!C.validPatterns(source,value),'malformed patterns not editable');

// Each public mutator requires actual-report preflight; absence/refusal is atomic.
{
  const state=make('b');accept(C.shareCodes(state,options));
  const key=C.codeView(state).root.current;
  const actions=[
    o=>C.startCodes(state,'a',o),o=>C.resumeCodes(state,key,o),
    o=>C.editCodes(state,'page','compare',o),o=>C.editCodes(state,'select','water',o),
    o=>C.editCodes(state,'rain',true,o),o=>C.editCodes(state,'append','S',o),
    o=>C.editCodes(state,'pop',null,o),o=>C.editCodes(state,'clear',null,o),
    o=>C.shareCodes(state,o),o=>C.supportCodes(state,'audio',o),
    o=>C.runCodeTest(state,'send',o),o=>C.keepCodes(state,o),o=>C.removeCodes(state,key,true,o),
  ];
  for(const action of actions){refuse(state,()=>action({}),'missing preflight');refuse(state,()=>action({canExport:()=>false}),'rejected preflight');}
  const before=clone(state);let called=false;
  refuse(state,()=>C.editCodes(state,'rain',true,{canExport:candidate=>{called=true;eq(work(candidate).rain,true,'callback sees candidate');eq(state,before,'live state waits for candidate admission');return false;}}),'candidate preflight');ok(called);
  for(const action of [()=>C.editCodes(state,'page','unknown',options),()=>C.editCodes(state,'select','absent',options),()=>C.editCodes(state,'rain','true',options),()=>C.editCodes(state,'append','X',options),()=>C.supportCodes(state,'unknown',options),()=>C.runCodeTest(state,'unknown',options),()=>C.startCodes(state,'unknown',options),()=>C.resumeCodes(state,'absent',options)])refuse(state,action,'invalid operation');
}

// Exact shared byte boundary: an existing report fits, but a growing operation
// must refuse rather than evicting any record or dropping another destination.
{
  const state=make('b');state.syntheticPadding='';
  state.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(serialize(state)));
  eq(Buffer.byteLength(serialize(state)),MAX_IMPORT_BYTES);ok(options.canExport(state),'actual report at shared limit accepted');
  refuse(state,()=>C.keepCodes(state,options),'keep would exceed actual report limit');
  refuse(state,()=>C.runCodeTest(state,'all',options),'test would exceed actual report limit');
  refuse(state,()=>C.startCodes(state,'a',options),'new visit would exceed actual report limit');
}

// No rolling history; confirmed deletion names exactly one readable visit.
{
  const state=make('b');accept(C.shareCodes(state,options));
  for(let i=0;i<24;i++)accept(C.runCodeTest(state,i%2?'send':'all',options));
  for(let i=0;i<8;i++)accept(C.keepCodes(state,options));
  refuse(state,()=>C.runCodeTest(state,'all',options),'twenty-fifth test refuses');
  refuse(state,()=>C.keepCodes(state,options),'ninth keep refuses');
  const original=clone(work(state)),key=C.codeView(state).root.current;
  for(let i=1;i<8;i++)accept(C.startCodes(state,'a',options));
  eq(C.codeView(state).visits.length,8);eq(C.codeView(state).root.visits[key],original,'allocation never evicts completed work');
  refuse(state,()=>C.startCodes(state,'blank',options),'ninth visit refuses');
  refuse(state,()=>C.removeCodes(state,key,false,options),'cancelled removal');
  const serial=C.codeView(state).root.nextSerial,before=clone(C.codeView(state).root.visits);
  accept(C.removeCodes(state,key,true,options));delete before[key];
  eq(C.codeView(state).root.visits,before,'confirmed removal deletes exactly named visit');eq(C.codeView(state).root.nextSerial,serial,'removal preserves serial');
  const added=accept(C.startCodes(state,'blank',options));eq(added.key,`code-${serial}`,'new allocation cannot collide after removal');
  roundTrip(state,'full histories and visit removal');
}

// Unreadable optional histories and sibling visits remain raw while healthy work
// stays open. Unknown root formats are retained read-only without auto-repair.
{
  const state=make('b'),key=C.codeView(state).root.current;
  work(state).tests=[{future:'raw earlier test'}];work(state).kept=[{future:'raw earlier design'}];
  const rawTest=clone(work(state).tests[0]),rawKeep=clone(work(state).kept[0]);
  ok(!C.validCodeTest(rawTest));ok(!C.validKeptCode(rawKeep));
  accept(C.editCodes(state,'append','S',options));accept(C.runCodeTest(state,'all',options));accept(C.keepCodes(state,options));
  eq(work(state).tests[0],rawTest);eq(work(state).kept[0],rawKeep);
  const bad=clone(work(state));bad.source.model='future-model';state.lanternCodes.visits['earlier-future']=bad;
  const held=clone(bad);refuse(state,()=>C.resumeCodes(state,'earlier-future',options),'unknown model is read-only');
  accept(C.editCodes(state,'page','compare',options));eq(state.lanternCodes.visits['earlier-future'],held,'healthy sibling edit preserves unknown visit');
  ok(C.codeView(state).visits.some(v=>v.id==='earlier-future'&&!v.readable));
  accept(C.startCodes(state,'a',options));accept(C.resumeCodes(state,key,options));
  work(state).tests={future:'non-array history'};work(state).kept={future:'non-array keeps'};
  const rawHistories=clone({tests:work(state).tests,kept:work(state).kept});
  accept(C.editCodes(state,'rain',true,options));
  refuse(state,()=>C.runCodeTest(state,'all',options),'unextendable test history retained');
  refuse(state,()=>C.keepCodes(state,options),'unextendable kept history retained');
  eq({tests:work(state).tests,kept:work(state).kept},rawHistories);
  roundTrip(state,'malformed optional histories and future sibling');
}
for(const raw of [null,[],42,'earlier root',{version:2,current:null,visits:{}},{version:1,current:'bad key',visits:{}}]){
  const state=seed();state.lanternCodes=clone(raw);const before=clone(state);
  eq(C.codeView(state).status,'unavailable');eq(state,before,'view never repairs unreadable root');
  refuse(state,()=>C.startCodes(state,'blank',options),'unknown root not replaced');
  roundTrip(state,'opaque root');
}

// The sole owned root is the only state change, even with held unrelated formats.
{
  const state=seed();state.seedStall={version:99,held:'Synthetic waiting format'};
  state.futureDestination={nested:[1,{held:'Synthetic foreign work'}]};
  const foreign=clone(state);
  accept(C.startCodes(state,'b',options));accept(C.shareCodes(state,options));
  accept(C.supportCodes(state,'together',options));accept(C.runCodeTest(state,'all',options));accept(C.keepCodes(state,options));
  const after=clone(state);delete after.lanternCodes;eq(after,foreign,'mutations leave every foreign root exact');
  const imported=roundTrip(state,'foreign roots');delete imported.lanternCodes;eq(imported,foreign,'actual import preserves unrelated work');
}

// Regression: imported duplicate rows cannot masquerade as an all-message result.
{
 const state=make('a');accept(C.shareCodes(state,options));accept(C.runCodeTest(state,'all',options));
 const saved=clone(work(state).tests[0]),bad=clone(saved);bad.rows=Array.from({length:saved.source.messages.length},()=>clone(saved.rows[0]));
 ok(!C.validCodeTest(bad),'duplicate/missing rows stay raw, never establish all-message success');
 const invisibleRead=clone(saved);invisibleRead.rows.forEach(r=>r.observed='');ok(!C.validCodeTest(invisibleRead),'read outcomes cannot claim empty observations');
 const another=clone(saved);another.rows[0].candidates=['safe','safe'];ok(!C.validCodeTest(another),'duplicate candidate identities are malformed');
 work(state).source.presets[0].patterns={safe:'LLLLL',water:'LLLL',boards:'LLL',help:'LL'};
 const frozen=clone(work(state).source);const copyVisit=accept(C.startCodes(state,'a',{...options,source:frozen}));
 eq(work(state).patterns,frozen.presets[0].patterns,'copy uses displayed frozen preset');eq(work(state).source,frozen,'copy retains complete displayed source');
 work(state).source.presets[0].id='retired-preset';const retired=clone(work(state).source);
 accept(C.startCodes(state,'retired-preset',{...options,source:retired}));eq(work(state).patterns,retired.presets[0].patterns,'retired preset id remains usable from its source');
 state.lanternCodes.visits['bad key']={future:'retained'};const badKey=clone(state.lanternCodes.visits['bad key']);
 accept(C.editCodes(state,'rain',true,options));eq(state.lanternCodes.visits['bad key'],badKey,'bad-key sibling does not close healthy work');
}

console.log(`${checks} Lantern Codes source checks passed: 62 patterns, ${pairs} pair/weather cases, every outcome, frozen own sources and actual-report refusal/recovery boundaries.`);
