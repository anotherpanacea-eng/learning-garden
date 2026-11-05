import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as Q from '../dist/question-bench-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
const copy=structuredClone;
let assertions=0;
const eq=(a,b,label)=>{assert.deepEqual(a,b,label);assertions++;},ok=(value,label)=>{assert.ok(value,label);assertions++;};
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const notesReport=new Function('recommendations','explorerStore',app.split('\n').find(line=>line.startsWith('function notesReport('))+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'gold',symbol:'leaf'}});
const canExport=state=>prepareProgressImport(JSON.stringify(notesReport(state),null,2)).ok;
const options={canExport};
const book=()=>initializeExplorerState(freshState());
const source=Q.questionSource('seedlings');
const work=Q.newQuestionWork(source);
const protect=state=>{const rest=copy(state);delete rest.questionCards;return rest;};
const refuse=(state,s,w,opts=options)=>{const before=copy(state);eq(Q.keepQuestionCard(state,s,w,opts),false);eq(state,before,'refusal preserves the complete notebook');};

// All sixteen questions must name the intended feature AND its context.
const meanings={
 seedlings:[['stem','setups',/On day 6, how long.*stems.*enough light and with too little light/],['stem','time',/stem length.*enough light.*day 0 to day 6/],['leaf','setups',/On day 6, how wide.*leaf spread.*enough light and with too little light/],['leaf','time',/leaf spread.*enough light.*day 0 to day 6/]],
 ramps:[['distance','height',/stopping distance.*low and high ramps.*surface, cart and release procedure stay the same/i],['distance','surface',/stopping distance.*rough and smooth.*height, cart and release procedure stay the same/i],['time','height',/time from release until stopping.*low and high ramps.*surface, cart and release procedure stay the same/i],['time','surface',/time from release until stopping.*rough and smooth.*height, cart and release procedure stay the same/i]],
 frogs:[['food','frog',/foods.*British wildlife guide.*adult common frogs\?/],['food','toad',/foods.*British wildlife guide.*adult common toads\?/],['habitat','frog',/habitats.*British wildlife guide.*adult common frogs\?/],['habitat','toad',/habitats.*British wildlife guide.*adult common toads\?/]],
 flowers:[['counts','sunflower-poppy',/how many.*sunflower, poppy or neither.*favorite\?/],['counts','daisy-iris',/how many.*daisy, iris or neither.*favorite\?/],['reasons','sunflower-poppy',/What reasons.*sunflower, poppy or neither.*favorite\?/],['reasons','daisy-iris',/What reasons.*daisy, iris or neither.*favorite\?/]]
};
for(const entry of Q.questionCases){
 const s=Q.questionSource(entry.id);ok(Q.validQuestionSource(s));eq(s.questions.length,4);
 const w=Q.newQuestionWork(s);eq(Q.questionText(s,w),null);
 for(const [focus,context,expected] of meanings[entry.id]){
  const selected=Q.changeQuestionWork(s,Q.changeQuestionWork(s,w,'focus',focus),'context',context);
  ok(expected.test(Q.questionText(s,selected)),`${entry.id}: ${focus}/${context} question meaning`);
 }
 // Every method subset can be kept; selection order is user order, not source order.
 for(let mask=0;mask<16;mask++){
  let selected=w;const ids=s.ways.map(x=>x.id).reverse().filter((_,i)=>mask&(1<<i));
  for(const id of ids)selected=Q.changeQuestionWork(s,selected,'way',id);
  eq(selected.wayIds,ids);ok(Q.validQuestionWork(s,selected));
  if(ids.length){const id=ids[0];selected=Q.changeQuestionWork(s,selected,'way',id);eq(selected.wayIds,ids.slice(1));selected=Q.changeQuestionWork(s,selected,'way',id);eq(selected.wayIds,[...ids.slice(1),id]);}
 }
 ok(s.ways.every(method=>method.can.length>0&&method.limit.length>0));
 ok(/story example.*not an analysis/.test(s.methodNotice),'frozen Notes warning frames custom wording honestly');
}
// Method limits preserve the distinct evidential boundaries of each story.
ok(/pattern alone does not establish why/.test(source.ways.find(w=>w.id==='watch').limit));
ok(/compares days, not light conditions/.test(source.ways.find(w=>w.id==='compare').limit));
ok(/cannot supply readings/.test(source.ways.find(w=>w.id==='research').limit));
ok(/not automatically the original measurement/.test(source.ways.find(w=>w.id==='ask').limit));
ok(/distance examples only.*time question needs time records/.test(Q.questionSource('ramps').ways.find(w=>w.id==='compare').limit));
ok(/not a controlled experiment/.test(Q.questionSource('frogs').ways.find(w=>w.id==='compare').limit));
ok(/does not establish.*favorite/.test(Q.questionSource('flowers').ways.find(w=>w.id==='watch').limit));
ok(/need not represent everyone/.test(Q.questionSource('flowers').ways.find(w=>w.id==='ask').limit));

// Fresh factory, incomplete drafts, exact own wording, and disclosure boundaries.
source.future={synthetic:['unchanged']};work.future={synthetic:'work metadata'};
eq(Q.questionSource('seedlings').future,undefined);eq(Q.questionSource('missing'),null);
const partly=Q.changeQuestionWork(source,work,'focus','leaf');eq(Q.questionText(source,partly),null);eq(work.focusId,null);eq(partly.future,work.future);ok(partly.future!==work.future);
let own=Q.changeQuestionWork(source,partly,'wording','own');eq(Q.questionText(source,own),'');
const exact='  Synthetic question?\n\n👩‍🔬 e\u0301  ';
own=Q.changeQuestionWork(source,own,'question',exact);eq(Q.questionText(source,own),exact);eq(own.focusId,'leaf');
const pieces=Q.changeQuestionWork(source,own,'wording','pieces');eq(pieces.customQuestion,exact);eq(Q.questionText(source,pieces),null);
eq(Q.questionLength('🪴'.repeat(600)),600);ok(Q.changeQuestionWork(source,own,'question','🪴'.repeat(600)));eq(Q.changeQuestionWork(source,own,'question','🪴'.repeat(601)),null);eq(Q.changeQuestionWork(source,own,'question',42),null);
let helped=work;for(let i=0;i<5;i++)helped=Q.changeQuestionWork(source,helped,'example');eq(helped.exampleSeen,3);eq(work.exampleSeen,0);eq(Q.changeQuestionWork(source,helped,'reflection').reflectionShown,true);eq(Q.changeQuestionWork(source,Q.changeQuestionWork(source,helped,'reflection'),'reflection').reflectionShown,false);eq(Q.changeQuestionWork(source,work,'unknown'),null);

// Historical sources have their OWN counts, IDs, text, labels and order.
const historical=copy(source);historical.id='earlier:source!';historical.title='A synthetic earlier title';historical.focusLabel='Earlier features';historical.contextLabel='Earlier context';
historical.focus=[{id:'a/b',label:'Earlier first'},{id:'a',label:'Earlier second'},{id:'c.d',label:'Earlier third'}];historical.contexts=[{id:'b/c',label:'Earlier place'}];historical.questions=historical.focus.map((f,i)=>({focusId:f.id,contextId:'b/c',text:`Synthetic historical question ${i+1}?`})).reverse();historical.ways=[{...historical.ways[3],id:'way:old!',label:'Earlier interview'},{...historical.ways[0],id:'way/second'}];historical.teaching=['One earlier example.'];historical.glossary=[{term:'Earlier word',meaning:'An earlier supplied definition.'}];
ok(Q.validQuestionSource(historical),'historical matrix is independent of current catalogue');let h=Q.newQuestionWork(historical);h=Q.changeQuestionWork(historical,Q.changeQuestionWork(historical,h,'focus','a'),'context','b/c');eq(Q.questionText(historical,h),'Synthetic historical question 2?');h=Q.changeQuestionWork(historical,h,'way','way/second');h=Q.changeQuestionWork(historical,h,'way','way:old!');eq(h.wayIds,['way/second','way:old!']);
// Exercise the full allowed matrix and method ranges, including pair IDs that
// would collide if an implementation joined them with punctuation.
const wide=copy(historical);wide.focus=[{id:'a/b',label:'One'},{id:'a',label:'Two'},{id:'3',label:'Three'},{id:'4',label:'Four'}];wide.contexts=[{id:'c',label:'First'},{id:'b/c',label:'Second'},{id:'3',label:'Third'},{id:'4',label:'Fourth'}];wide.questions=wide.focus.flatMap((f,i)=>wide.contexts.map((c,j)=>({focusId:f.id,contextId:c.id,text:`Synthetic matrix row ${i+1}, column ${j+1}?`}))).reverse();wide.ways=Array.from({length:6},(_,i)=>({...historical.ways[0],id:`earlier-way-${i}`,icon:'card'}));wide.teaching=Array.from({length:5},(_,i)=>`Synthetic example part ${i+1}.`);wide.glossary=Array.from({length:6},(_,i)=>({term:`Term ${i+1}`,meaning:'Synthetic definition.'}));ok(Q.validQuestionSource(wide));
for(const [f,c,expected] of [['a/b','c','Synthetic matrix row 1, column 1?'],['a','b/c','Synthetic matrix row 2, column 2?']]){let w=Q.newQuestionWork(wide);w=Q.changeQuestionWork(wide,Q.changeQuestionWork(wide,w,'focus',f),'context',c);eq(Q.questionText(wide,w),expected);}
const narrow=copy(wide);narrow.focus=narrow.focus.slice(0,1);narrow.contexts=narrow.contexts.slice(0,1);narrow.questions=narrow.questions.filter(q=>q.focusId==='a/b'&&q.contextId==='c');narrow.ways=narrow.ways.slice(0,1);narrow.teaching=narrow.teaching.slice(0,1);narrow.glossary=narrow.glossary.slice(0,1);ok(Q.validQuestionSource(narrow));
for(const change of [s=>s.focus.push({id:'5',label:'Too many'}),s=>s.ways.push({...s.ways[0],id:'way7'}),s=>s.teaching.push('Sixth part.'),s=>s.glossary.push({term:'Seventh',meaning:'Too many terms.'})]){const bad=copy(wide);change(bad);ok(!Q.validQuestionSource(bad));}
for(const mutate of [s=>s.questions.pop(),s=>s.questions.push(copy(s.questions[0])),s=>s.questions[0].contextId='missing',s=>s.focus[1].id=s.focus[0].id,s=>delete s.notice,s=>s.ways[0].icon='answer',s=>s.v=2,s=>s.focus[0].id='constructor',s=>s.focus[0].id='prototype',s=>s.focus[0].id='é',s=>s.teaching=Array(2),s=>s.focus=Array(2),s=>s.questions[0].text='',s=>s.ways=[]]){const bad=copy(source);mutate(bad);ok(!Q.validQuestionSource(bad));}
const inherited=Object.create(source);ok(!Q.validQuestionSource(inherited));
for(const mutate of [w=>delete w.customQuestion,w=>w.wayIds=['watch','watch'],w=>w.wayIds=['missing'],w=>w.focusId='missing',w=>w.exampleSeen=4,w=>w.exampleSeen=-1,w=>w.reflectionShown=1,w=>w.v=2]){const bad=copy(work);mutate(bad);ok(!Q.validQuestionWork(source,bad));}

// Keep is immutable, append-only and changes no assessment or other roots.
const state=book(),before=copy(state);eq(Q.questionCardsView(state),{status:'absent',items:[],canKeep:true});eq(state,before,'read-only entry never initializes');eq(Q.lastQuestionCard(state),null);
eq(Q.keepQuestionCard(state,source,own,options),'question-card-1');eq(protect(state),before);ok(state.questionCards[0].source!==source);ok(state.questionCards[0].work!==own);
state.questionCards[0].outerFuture={synthetic:'original only'};const kept=copy(state.questionCards[0]);const working=copy(kept);working.work=Q.changeQuestionWork(working.source,working.work,'question','Synthetic copy?');
eq(Q.keepQuestionCard(state,working.source,working.work,options),'question-card-2');eq(state.questionCards[0],kept);eq(state.questionCards[1].outerFuture,undefined);eq(state.questionCards[1].source.future,source.future);eq(state.questionCards[1].work.future,own.future);
working.source.title='Changed after Keep';working.work.customQuestion='Changed after Keep';eq(state.questionCards[1].work.customQuestion,'Synthetic copy?');eq(state.questionCards[1].source.title,kept.source.title);
const imported=prepareProgressImport(JSON.stringify(notesReport(state),null,2));ok(imported.ok);eq(imported.state.questionCards,state.questionCards,'actual Notes wrapper retains all raw data');

// Unsupported siblings retain their positions; duplicate targets are all unavailable.
state.questionCards.push({id:'question-card-17',source:{v:92},work:null,outerFuture:'retain'},null,{id:'question-card-03'},'synthetic raw');
eq(Q.keepQuestionCard(state,historical,h,options),'question-card-18');eq(Q.lastQuestionCard(state).index,6);eq(Q.lastQuestionCard(state).raw.source,historical);
state.questionCards.push(copy(state.questionCards[0]));const view=Q.questionCardsView(state);eq(view.items[0].readable,false);eq(view.items[7].readable,false);eq(view.items[2].readable,false);eq(view.items[3].raw,null);
for(let i=0;i<3;i++)ok(Q.keepQuestionCard(state,source,work,options));eq(Q.questionCardsView(state).items.length,11,'shelf has raw siblings beyond eight entries');eq(Q.lastQuestionCard(state).index,10);
const rawRoundtrip=prepareProgressImport(JSON.stringify(notesReport(state),null,2));ok(rawRoundtrip.ok);eq(rawRoundtrip.state.questionCards,state.questionCards);
for(const root of [null,{},'synthetic future root',42]){const s=book();s.questionCards=root;eq(Q.questionCardsView(s).status,'unavailable');refuse(s,source,work);const loaded=prepareProgressImport(JSON.stringify(notesReport(s),null,2));ok(loaded.ok);eq(loaded.state.questionCards,root);}
const exhausted=book();exhausted.questionCards=[{id:'question-card-999999',source:{v:99}}];eq(Q.questionCardsView(exhausted).canKeep,false);refuse(exhausted,source,work);
const noncanonical=book();noncanonical.questionCards=[{id:'question-card-0009'},{id:'question-card-1000000'},{id:'question-card-4x'}];eq(Q.keepQuestionCard(noncanonical,source,work,options),'question-card-1');
refuse(state,source,work,{canExport:()=>false});refuse(state,source,work,{});refuse(state,source,work,{canExport:()=>{throw Error('Synthetic export refusal');}});
const hostile=book(),held=copy(hostile);eq(Q.keepQuestionCard(hostile,source,work,{canExport:c=>{c.sessions=999;c.questionCards[0].work.customQuestion='Changed by callback';return true;}}),'question-card-1');eq(protect(hostile),held);eq(hostile.questionCards[0].work.customQuestion,'','disposable callback cannot rewrite the proposal');

// A genuine Notes-wrapper size refusal, while the proposed bare state fits.
const large=book();large.syntheticPadding='';const proposed=copy(large);proposed.questionCards=[{id:'question-card-1',source:copy(source),work:copy(work)}];const bytes=new TextEncoder().encode(JSON.stringify(proposed,null,2)).length;large.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-bytes-10);proposed.syntheticPadding=large.syntheticPadding;ok(recoveryFitsProgressLimits(proposed));ok(!canExport(proposed),'the actual Notes wrapper crosses the limit');refuse(large,source,work);
const complex=book();let nested={};complex.syntheticFuture=nested;for(let i=0;i<61;i++){nested.next={};nested=nested.next;}refuse(complex,source,work);
console.log(`Question Bench: ${assertions} content, frozen-work, append and actual Notes checks passed.`);
