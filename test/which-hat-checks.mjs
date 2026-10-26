import assert from 'node:assert/strict';
import {freshState,recommendations,restoreStateResult} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {hatSource} from '../dist/which-hat-content.mjs';
import * as H from '../dist/which-hat-core.mjs';

let checks=0;
const ok=(value,label)=>{assert.ok(value,label);checks++;};
const eq=(actual,expected,label)=>{assert.deepEqual(actual,expected,label);checks++;};
const clone=structuredClone,source=clone(hatSource);
const seed=()=>initializeExplorerState(freshState());
// This is the app's actual pretty-notes shape, with synthetic profile/time.
const report=state=>({title:'After the Storm: observations',exportedAt:'2026-01-01T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(state),...state});
const serialize=state=>JSON.stringify(report(state),null,2);
const options={canExport:state=>prepareProgressImport(serialize(state)).ok};
const work=state=>H.hatView(state).work;
const accept=(result,label)=>{ok(result?.ok,label||result?.error);return result;};
function refuse(state,action,label){const before=clone(state);ok(!action().ok,label);eq(state,before,`${label}: refusal is exact and atomic`);}
function make(s=source){const state=seed();accept(H.startHats(state,{...options,source:s}));return state;}
function roundTrip(state,label){const before=clone(state.descriptions),result=prepareProgressImport(serialize(state));ok(result.ok,`${label}: actual report imports`);eq(result.state.descriptions,before,`${label}: root remains exact`);eq(restoreStateResult(JSON.stringify(state)).state.descriptions,before,`${label}: restore keeps opaque root`);return result.state;}
const edit=(state,kind,value)=>accept(H.editHat(state,kind,value,options));
function phrase(state,tiles){edit(state,'clear',null);for(const id of tiles)edit(state,'tile',id);}

// Authored table and predicates are independently transcribed from the pinned
// specification. The finite oracle does not use a production match helper or
// derive its properties/ranks from production content.
const table=[
 ['peg-1','small','old','blue','none'],['peg-2','small','new','blue','gold'],
 ['peg-3','big','old','blue','gold'],['peg-4','big','new','red','none'],
 ['peg-5','small','old','red','blue'],['peg-6','big','new','blue','blue']
];
const words=[
 ['lovely','lovely',null,null,0,false],['small','small',1,'small',1,false],
 ['big','big',1,'big',1,false],['old','old',2,'old',2,false],
 ['new','new',2,'new',2,false],['blue','blue',3,'blue',3,false],
 ['red','red',3,'red',3,false],['gold-ribbon','with a gold ribbon',4,'gold',4,true],
 ['blue-ribbon','with a blue ribbon',4,'blue',4,true]
];
const ids=words.map(w=>w[0]),hatIds=table.map(h=>h[0]);
const oracleMatches=tiles=>table.filter(h=>tiles.every(id=>{const w=words.find(w=>w[0]===id);return w[2]===null||h[w[2]]===w[3];})).map(h=>h[0]);
const oraclePhrase=tiles=>['the',...tiles.map(id=>words.find(w=>w[0]===id)).filter(w=>!w[5]).map(w=>w[1]),'hat',...tiles.map(id=>words.find(w=>w[0]===id)).filter(w=>w[5]).map(w=>w[1])].join(' ');
const oracleOrder=tiles=>{const ranks=tiles.map(id=>words.find(w=>w[0]===id)).filter(w=>!w[5]).map(w=>w[4]);return ranks.every((r,i)=>!i||r>=ranks[i-1])?'usual':'other';};
ok(H.validHatSource(source),'reviewed source is structurally readable');
eq(source.hats.map(h=>[h.id,h.size,h.age,h.color,h.ribbon]),table,'exact pinned six-hat table');
eq(source.tiles.map(t=>[t.id,t.text,t.property===null?null:['id','size','age','color','ribbon'].indexOf(t.property),t.value,t.rank,t.after]),words,'exact predicates and ranks');
let cases=0;
const counts={none:0,unique:0,several:0};
for(let mask=0;mask<512;mask++){
 const tiles=ids.filter((_,i)=>mask&(1<<i)),matches=oracleMatches(tiles);
 counts[matches.length===0?'none':matches.length===1?'unique':'several']++;
 eq(H.matchHats(source,tiles),matches,'independent finite conjunction');
 eq(H.describeHat(source,tiles),oraclePhrase(tiles),'independent phrase frame');
 for(const target of hatIds){
  const outcome=matches.length===0?'none':matches.length>1?'several':matches[0]===target?'target':'other';
  eq(H.assessHat(source,tiles,target),{phrase:oraclePhrase(tiles),matches,order:oracleOrder(tiles),outcome,feedback:source.copy.results[outcome]},'finite subset/target result');
  cases++;
 }
 const reversed=[...tiles].reverse();
 eq(H.matchHats(source,reversed),matches,'word order cannot change predicate meaning');
 eq(H.assessHat(source,reversed,'peg-1').order,oracleOrder(reversed),'order explanation follows chosen pre-noun words');
}
eq(cases,3072,'512 subsets by every target');
eq(counts,{none:404,unique:76,several:32},'independent finite class counts');
eq(H.matchHats(source,[]),hatIds,'bare hat fits all');
eq(H.matchHats(source,['lovely']),hatIds,'opinion rules out no model hat');
eq(H.matchHats(source,['small','big']),[],'contradictory size fits none');
eq(H.matchHats(source,['gold-ribbon','blue-ribbon']),[],'contradictory ribbons fit none');
eq(H.assessHat(source,['red','new'],'peg-4').outcome,'target','shorter unique phrase is useful');
eq(H.assessHat(source,['red','new'],'peg-1').outcome,'other','unique wrong hat does not return requested peg');
eq(H.describeHat(source,['gold-ribbon','blue','old','big']),'the blue old big hat with a gold ribbon','ribbon follows noun regardless of tap order');
eq(H.assessHat(source,['blue','old','big'],'peg-3').outcome,'target','understandable other order still identifies target');
eq(H.assessHat(source,['blue','old','big'],'peg-3').order,'other');

// Pinned A1–A5 order, choice positions and specific explanation distinctions.
eq(source.questions.map(q=>q.id),['a1','a2','a3','a4','a5']);
eq(source.questions.map(q=>q.choices.findIndex(c=>c.id===q.key)+1),[2,3,3,1,3],'supplied keys keep authored positions');
eq(source.questions.map(q=>q.choices.map(c=>c.text)),[
 ['the small blue hat','the small old blue hat','the small old blue hat with a gold ribbon'],
 ['a new big red hat','a red big new hat','a big new red hat'],['ribbon','blue','hat'],
 ['It tells what kind of hat','It is the head noun','It tells how something happened'],
 ['small my old hat','small old my hat','my small old hat']
]);
for(const [qid,patterns] of [['a1',[/two hats/i,/only Dot/i,/no hat/i]],['a2',[/understandable/i,/understandable/i,/size.*age.*color/i]],['a3',[/whole phrase.*hat/i,/adjective/i,/head noun/i]],['a4',[/noun describing another noun/i,/party tells what kind/i,/nothing happens/i]],['a5',[/determiner/i,/before/i,/determiner before/i]]]){
 const q=source.questions.find(q=>q.id===qid);patterns.forEach((pattern,i)=>ok(pattern.test(q.choices[i].feedback),`${qid} authored feedback ${i}`));
}

// Working choices remain editable and every kept result is a complete snapshot.
{
 const state=make();eq(work(state).source,source);eq(work(state).support,{observed:true,concept:[],reading:[]});
 phrase(state,['small','old','blue']);edit(state,'target','peg-1');
 accept(H.keepHat(state,options));const first=clone(work(state).claims[0]);
 ok(H.validHatClaim(first));eq(first.source,source);eq(first.tiles,['small','old','blue']);eq(first.matches,['peg-1']);eq(first.outcome,'target');
 edit(state,'target','peg-3');eq(work(state).tiles,['small','old','blue'],'target selection preserves phrase');
 edit(state,'later','small');eq(work(state).tiles,['old','small','blue']);edit(state,'earlier','small');eq(work(state).tiles,['small','old','blue']);
 edit(state,'remove','old');eq(work(state).tiles,['small','blue']);edit(state,'tile','blue');eq(work(state).tiles,['small']);
 edit(state,'clear',null);eq(work(state).tiles,[]);eq(work(state).target,'peg-3','clear affects phrase only');
 for(const page of ['questions','kept','build'])edit(state,'page',page);
 accept(H.keepHat(state,options));eq(work(state).claims[1].outcome,'several','empty descriptions can be kept');
 phrase(state,['small','big']);accept(H.keepHat(state,options));eq(work(state).claims[2].outcome,'none','zero matches can be kept');
 phrase(state,['new','red']);accept(H.keepHat(state,options));eq(work(state).claims[3].outcome,'other','wrong unique target kept honestly');
 eq(work(state).claims[0],first,'later choices never rewrite kept source/result');
 const frozen=clone(work(state)),key=H.hatView(state).root.current;
 accept(H.startHats(state,options));ok(H.hatView(state).root.current!==key,'new visit has separate id');
 eq(H.hatView(state).root.visits[key],frozen,'new visit preserves previous work');accept(H.resumeHats(state,key,options));eq(work(state),frozen);
 roundTrip(state,'working phrase and complete kept snapshots');
}

// The first selection is immutable; latest, skip and later help are independent.
{
 const state=make();edit(state,'page','questions');edit(state,'question','a1');
 accept(H.answerHat(state,'a',options));const first=clone(work(state).answers.a1.first);
 ok(H.validHatAnswer(first));eq(first.outcome,'again');eq(first.choice,'a');eq(first.itemId,'a1');eq(first.source,source);
 accept(H.supportHat(state,'hint',options));accept(H.supportHat(state,'audio',options));
 accept(H.answerHat(state,'b',options));const latest=clone(work(state).answers.a1.latest);
 eq(work(state).answers.a1.first,first,'help and retry preserve first');eq(latest.outcome,'fits');ok(H.validHatAnswer(latest));
 ok(latest.helpBefore.concept.some(h=>h.forId==='a1'&&h.kind==='hint'),'concept help recorded before later answer');
 ok(latest.helpBefore.reading.some(h=>h.forId==='a1'&&h.kind==='audio'),'audio recorded separately before later answer');
 eq(first.helpBefore.concept,[],'late concept help cannot enter first');eq(first.helpBefore.reading,[],'late audio cannot enter first');
 accept(H.skipHat(state,options));eq(work(state).answers.a1.first,first);eq(work(state).answers.a1.latest,latest,'skip never becomes latest answer');
 eq(work(state).answers.a1.skipped.outcome,'skipped');ok(H.validHatSkip(work(state).answers.a1.skipped),'skip is a readable separate observation');
 edit(state,'question','a2');accept(H.skipHat(state,options));ok(!work(state).answers.a2.first&&!work(state).answers.a2.latest,'skip first creates no answered attempt');
 for(const q of source.questions){edit(state,'question',q.id);accept(H.answerHat(state,q.key,options));const answer=work(state).answers[q.id].latest??work(state).answers[q.id].first;eq(answer.outcome,'fits');eq(answer.feedback,q.choices.find(c=>c.id===q.key).feedback);}
 edit(state,'page','build');edit(state,'target','peg-2');for(const kind of ['hint','example','together','readback','audio'])accept(H.supportHat(state,kind,options));
 const support=clone(work(state).support);accept(H.supportHat(state,'hint',options));eq(work(state).support,support,'repeat requests do not consume capacity');
 accept(H.keepHat(state,options));eq(work(state).claims[0].helpBefore,support,'keep freezes before-support observation');
 roundTrip(state,'first/latest/support/skip');
}

// Retired source identities, values, counts, copy, choices and keys remain usable.
{
 const retired=clone(source);retired.id='earlier-rack';retired.title='Earlier rack';
 retired.hats=retired.hats.slice(0,3).map((h,i)=>({...h,id:`old-peg-${i}`,color:h.color==='blue'?'green':h.color}));
 retired.tiles=retired.tiles.map(t=>({...t,id:`old-${t.id}`,text:`Earlier ${t.text}`,value:t.property==='color'&&t.value==='blue'?'green':t.value}));
 retired.frame={before:'this',noun:'bonnet'};retired.copy.results.target='Earlier recorded match';
 retired.questions=retired.questions.slice(0,2).map((q,i)=>({...q,id:`old-question-${i}`,key:'earlier-c',choices:q.choices.map((c,j)=>({...c,id:`earlier-${['a','b','c'][j]}`,text:`Earlier ${c.text}`,feedback:`Earlier feedback ${j}`}))}));
 ok(H.validHatSource(retired),'retired own IDs/counts/values accepted');const state=make(retired);
 phrase(state,['old-small','old-old']);edit(state,'target','old-peg-0');accept(H.keepHat(state,options));eq(work(state).claims[0].matches,['old-peg-0']);eq(work(state).claims[0].feedback,'Earlier recorded match');
 edit(state,'question','old-question-0');accept(H.answerHat(state,'earlier-c',options));eq(work(state).answers['old-question-0'].first.outcome,'fits','saved source key governs own question');
 const frozen=clone(work(state));roundTrip(state,'retired complete source');eq(work(state),frozen,'reads never refresh source');
 // Record validation checks self-consistency, not a current or saved answer key.
 const claim=work(state).claims[0];claim.matches=[];claim.outcome='none';claim.feedback='Earlier result retained';ok(H.validHatClaim(claim),'structural saved result is not regraded');
 const answer=work(state).answers['old-question-0'].first;answer.outcome='again';answer.feedback='Earlier answer retained';ok(H.validHatAnswer(answer),'historical answer is not regraded');
 roundTrip(state,'recorded feedback and historical outcomes');
 const older=clone(work(state));delete older.support;state.descriptions.visits[state.descriptions.current]=older;
 ok(H.hatView(state).work,'missing old support remains readable');accept(H.keepHat(state,options));ok(work(state).claims.at(-1).helpBefore?.observed!==true,'missing older observations remain unobserved');
 accept(H.supportHat(state,'hint',options));eq(work(state).support.observed,false,'later request cannot retroactively mark older support observed');
 eq(work(state).support.concept,[{forId:work(state).target,kind:'hint'}]);
}

for(const mutate of [s=>s.version=2,s=>s.hats=[],s=>s.hats[1].id=s.hats[0].id,s=>s.tiles[1].id=s.tiles[0].id,s=>s.tiles[1].property='unknown',s=>s.tiles[1].rank=-1,s=>s.questions[0].key='absent',s=>s.questions[0].choices[1].id=s.questions[0].choices[0].id]){const bad=clone(source);mutate(bad);ok(!H.validHatSource(bad),'malformed own-source reference or bound rejected');}
{
 const state=make();phrase(state,['small','old','blue']);accept(H.keepHat(state,options));const saved=clone(work(state).claims[0]);
 for(const change of [c=>c.matches=[],c=>c.matches=['peg-1','peg-2'],c=>c.matches=['peg-2'],c=>c.matches=['peg-1','peg-1'],c=>c.matches=['absent'],c=>c.target='absent',c=>c.tiles=['small','small'],c=>c.tiles=['absent']]){const bad=clone(saved);change(bad);ok(!H.validHatClaim(bad),'malformed outcome/count/own-source identity stays raw');}
 const several=clone(saved);several.matches=['peg-2','peg-3'];several.outcome='several';ok(H.validHatClaim(several),'historical several matches self-consistent without recomputation');
 const other=clone(saved);other.matches=['peg-2'];other.outcome='other';ok(H.validHatClaim(other),'historical different peg self-consistent without recomputation');
}

// Every mutator goes through candidate admission and the actual report limit.
{
 const state=make(),key=H.hatView(state).root.current;
 const actions=[o=>H.startHats(state,o),o=>H.resumeHats(state,key,o),o=>H.editHat(state,'page','questions',o),o=>H.editHat(state,'target','peg-2',o),o=>H.editHat(state,'tile','small',o),o=>H.editHat(state,'earlier','small',o),o=>H.editHat(state,'later','small',o),o=>H.editHat(state,'remove','small',o),o=>H.editHat(state,'clear',null,o),o=>H.editHat(state,'question','a2',o),o=>H.supportHat(state,'hint',o),o=>H.keepHat(state,o),o=>H.answerHat(state,'a',o),o=>H.skipHat(state,o),o=>H.removeHats(state,key,true,o)];
 for(const action of actions){refuse(state,()=>action({}),'missing export preflight');refuse(state,()=>action({canExport:()=>false}),'rejected export preflight');}
 const before=clone(state);let called=false;refuse(state,()=>H.editHat(state,'target','peg-2',{canExport:candidate=>{called=true;eq(work(candidate).target,'peg-2','preflight receives candidate');eq(state,before,'live state waits for admission');return false;}}),'candidate admission');ok(called);
 for(const action of [()=>H.editHat(state,'page','absent',options),()=>H.editHat(state,'target','absent',options),()=>H.editHat(state,'tile','absent',options),()=>H.editHat(state,'question','absent',options),()=>H.supportHat(state,'absent',options),()=>H.answerHat(state,'absent',options),()=>H.resumeHats(state,'absent',options),()=>H.removeHats(state,key,false,options)])refuse(state,action,'invalid/cancelled operation');
 state.syntheticPadding='';state.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(serialize(state)));eq(Buffer.byteLength(serialize(state)),MAX_IMPORT_BYTES);ok(options.canExport(state),'actual pretty report at shared byte boundary fits');
 refuse(state,()=>H.keepHat(state,options),'growing kept claim exceeds byte boundary');refuse(state,()=>H.answerHat(state,'a',options),'growing answer exceeds byte boundary');refuse(state,()=>H.startHats(state,options),'growing visit exceeds byte boundary');
}

// Capacity refuses explicitly without evicting, and removal names one visit.
{
 const state=make();for(let i=0;i<24;i++)accept(H.keepHat(state,options));refuse(state,()=>H.keepHat(state,options),'twenty-fifth discovery refuses');
 const key=H.hatView(state).root.current,old=clone(work(state));for(let i=1;i<8;i++)accept(H.startHats(state,options));eq(H.hatView(state).visits.length,8);eq(state.descriptions.visits[key],old);
 refuse(state,()=>H.startHats(state,options),'ninth visit refuses');const before=clone(state.descriptions.visits),serial=state.descriptions.nextSerial;
 accept(H.removeHats(state,key,true,options));delete before[key];eq(state.descriptions.visits,before,'confirmed removal affects named readable visit only');eq(state.descriptions.nextSerial,serial,'removal preserves serial');accept(H.startHats(state,options));eq(Object.keys(state.descriptions.visits).length,8,'removed slot reusable without replacing another visit');roundTrip(state,'capacity/removal');
}
{
 const state=make();
 for(const forId of [...hatIds,...source.questions.map(q=>q.id)]){
  edit(state,'page',hatIds.includes(forId)?'build':'questions');edit(state,hatIds.includes(forId)?'target':'question',forId);
  for(const kind of ['hint','example','together','readback','audio'])accept(H.supportHat(state,kind,options));
 }
 const total=s=>s.concept.length+s.reading.length;eq(total(work(state).support),55,'normal requests cover eleven contexts without denied help');
 const held=clone(work(state).support);accept(H.supportHat(state,'audio',options));eq(work(state).support,held,'duplicate full-context request adds no slot');
 // Retired sources can have additional target contexts. Fill the structural cap
 // with own-source IDs, keeping separate reading/concept request observations.
 const w=work(state);w.source.hats.push(...Array.from({length:2},(_,i)=>({...clone(w.source.hats[0]),id:`extra-${i}`})));
 for(const target of ['extra-0','extra-1']){edit(state,'page','build');edit(state,'target',target);for(const kind of ['hint','example','together','readback','audio']){if(total(work(state).support)<64)accept(H.supportHat(state,kind,options));}}
 eq(total(work(state).support),64,'request cap reached');refuse(state,()=>H.supportHat(state,'audio',options),'sixty-fifth distinct request refuses');roundTrip(state,'support capacity');
}
{
 const expanded=clone(source);expanded.questions.push({...clone(expanded.questions[0]),id:'earlier-sixth'});const state=make(expanded);
 for(const q of expanded.questions.slice(0,5)){edit(state,'question',q.id);accept(H.answerHat(state,q.key,options));}
 const previous=clone(work(state).answers);edit(state,'question','earlier-sixth');refuse(state,()=>H.answerHat(state,'b',options),'sixth distinct answered item refuses');refuse(state,()=>H.skipHat(state,options),'sixth distinct skipped item refuses');eq(work(state).answers,previous,'question limit evicts nothing');
 edit(state,'question','a1');accept(H.answerHat(state,'a',options));accept(H.skipHat(state,options));eq(Object.keys(work(state).answers).length,5,'retries and skips on existing items require no extra slot');roundTrip(state,'five question capacity');
}

// Malformed optional records and siblings remain raw; non-array histories cannot
// be extended, but the readable working rack remains available.
{
 const state=make(),key=H.hatView(state).root.current;
 work(state).claims=[{future:'raw claim'}];work(state).answers={a1:{first:{future:'raw answer'}}};const raw=clone({claims:work(state).claims,answers:work(state).answers});
 ok(!H.validHatClaim(raw.claims[0]));ok(!H.validHatAnswer(raw.answers.a1.first));edit(state,'tile','small');eq(work(state).claims,raw.claims);eq(work(state).answers,raw.answers);
 edit(state,'question','a1');refuse(state,()=>H.answerHat(state,'b',options),'unreadable earlier item never replaced');refuse(state,()=>H.skipHat(state,options),'skip cannot replace unreadable earlier item');
 edit(state,'question','a2');accept(H.answerHat(state,'c',options));eq(work(state).answers.a1,raw.answers.a1,'healthy answer sibling does not replace malformed record');
 const bad=clone(work(state));bad.source.version=99;state.descriptions.visits['future-visit']=bad;state.descriptions.visits['bad key']={future:'raw sibling'};const siblings=clone(state.descriptions.visits);
 refuse(state,()=>H.resumeHats(state,'future-visit',options),'unknown model visit stays read-only');edit(state,'tile','old');eq(state.descriptions.visits['future-visit'],siblings['future-visit']);eq(state.descriptions.visits['bad key'],siblings['bad key']);
 ok(H.hatView(state).visits.some(v=>v.id==='future-visit'&&!v.readable));work(state).claims={future:'non-array history'};work(state).answers={future:'non-answer sibling'};
 edit(state,'tile','blue');refuse(state,()=>H.keepHat(state,options),'malformed claim history not silently extended');roundTrip(state,'raw optional records and unknown sibling');
 accept(H.startHats(state,options));accept(H.resumeHats(state,key,options));
}
for(const raw of [null,[],42,'old root',{version:2,current:null,visits:{}}]){
 const state=seed();state.descriptions=clone(raw);const before=clone(state);eq(H.hatView(state).status,'unavailable');eq(state,before,'pure view never normalizes opaque root');refuse(state,()=>H.startHats(state,options),'opaque root not replaced');roundTrip(state,'unknown root');
}
{
 const state=make(),key=state.descriptions.current;state.descriptions.current='bad key';const before=clone(state);eq(H.hatView(state).work,null,'malformed current pointer exposes no working visit');eq(state,before,'malformed current pointer retained on read');accept(H.resumeHats(state,key,options));ok(work(state),'readable sibling remains resumable');
}
{
 const state=seed();state.seedStall={version:99,held:'Synthetic waiting format'};state.futureDestination={nested:[1,{held:'Synthetic foreign work'}]};const foreign=clone(state);
 accept(H.startHats(state,options));phrase(state,['small','old']);accept(H.supportHat(state,'together',options));accept(H.keepHat(state,options));edit(state,'question','a3');accept(H.answerHat(state,'c',options));accept(H.skipHat(state,options));
 const beforeRead=clone(state);H.hatView(state);H.matchHats(work(state).source,work(state).tiles);H.assessHat(work(state).source,work(state).tiles,work(state).target);eq(state,beforeRead,'pure reads are exact');
 const after=clone(state);delete after.descriptions;eq(after,foreign,'only descriptions root changes');const restored=roundTrip(state,'foreign roots');delete restored.descriptions;eq(restored,foreign,'actual import keeps foreign roots exact');
}

console.log(`${checks} Which Hat source checks passed: 512 subsets, ${cases} subset/target cases, frozen own sources, first/latest/support observations and actual-report refusal/recovery boundaries.`);
