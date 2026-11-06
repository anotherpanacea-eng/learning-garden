// Invented panel proposals only. Explicit coefficients and divisor enumeration
// independently check the model; no check here establishes teaching adequacy.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as c from '../dist/shared-side-core.mjs';
import {sharedCases,makeSharedSource} from '../dist/shared-side-content.mjs';
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
const eq=assert.deepEqual,ok=assert.ok,copy=structuredClone,yes={canExport:()=>true};
const s=makeSharedSource(),w=c.newSharedWork(s),view=(name,patch={})=>({view:name,step:0,contrasts:false,reference:false,...patch});
eq(w,{v:1,x:4,k:null,a:null,b:null,teachingShown:false,referenceShown:false});
const expected={library:[3,2,3],notices:[4,3,2],covers:[3,3,4],small:[3,2,1],coprime:[1,7,4],posters:[5,2,3]};
for(const job of sharedCases){
 const source=makeSharedSource(job.id),empty=c.newSharedWork(source);ok(c.validSharedSource(source));ok(c.validSharedWork(source,empty));
 const [k,a,b]=expected[job.id],work={...empty,k,a,b},r=c.sharedResult(source,work);
 eq(r.reference,{k,a,b});eq(r.expanded,[job.A,job.B]);ok(r.formFit&&r.valueFit);eq(r.regionAreas,[k*a*4,k*b]);eq(r.proposedValue,job.A*4+job.B);
 eq(c.sharedDisplayPairs(source,empty,view('build')),[]);eq(c.sharedDisplayPairs(source,empty,view('compare')),[]);
}
// Exhaust the bounded target domain against independent common-divisor search.
for(let A=1;A<=24;A++)for(let B=1;B<=24;B++){
 const source={...copy(s),id:'Older targets',A,B};
 const divisors=Array.from({length:Math.min(A,B)},(_,i)=>i+1).filter(n=>A%n===0&&B%n===0),g=divisors.at(-1);
 for(const x of [1,2,4,12]){
  const work={...c.newSharedWork(source),x,k:g,a:A/g,b:B/g},r=c.sharedResult(source,work);eq(r.gcd,g);eq(r.reference,{k:g,a:A/g,b:B/g});ok(r.formFit&&r.valueFit);eq(r.targetValue,A*x+B);eq(r.regionAreas,[A*x,B]);eq(r.width,(A/g)*x+B/g);
 }
 const smaller={...c.newSharedWork(source),k:1,a:A,b:B};ok(c.sharedResult(source,smaller).formFit,'1 remains a valid integer common factor');
}
const coincidenceSource=makeSharedSource('small'),coincidence={...c.newSharedWork(coincidenceSource),x:1,k:3,a:1,b:2};
const one=c.sharedResult(coincidenceSource,coincidence);eq(one.expanded,[3,6]);eq(one.targetValue,9);eq(one.proposedValue,9);ok(one.valueFit&&!one.formFit);
const two=c.sharedResult(coincidenceSource,{...coincidence,x:2});eq(two.targetValue,15);eq(two.proposedValue,12);ok(!two.valueFit&&!two.formFit);
const smaller=c.sharedResult(makeSharedSource('notices'),{...w,k:2,a:6,b:4});ok(smaller.formFit);eq(smaller.reference,{k:4,a:3,b:2});
const partial=c.sharedResult(s,{...w,k:3,a:2});eq(partial.missing,['b']);eq(partial.expanded,null);eq(partial.width,null);eq(partial.proposedValue,null);eq(partial.targetValue,null);
for(const [a,b] of [[0,0],[0,4],[4,0]]){const r=c.sharedResult(s,{...w,k:2,a,b});eq(r.regionAreas,[8*a,2*b]);eq(r.proposedValue,2*(4*a+b));}
const zero={...w,k:1,a:0,b:0};eq(c.sharedResult(s,zero).width,0);eq(c.sharedDisplayPairs(s,zero,view('build')),[[6,4]],'only the actual target product is eligible for zero proposal');
let work={...w,future:{literal:true}};for(const [action,value] of [['k',24],['a',0],['b',24],['x',12],['teaching',undefined],['reference',undefined]]){work=c.changeSharedWork(s,work,action,value);ok(work);}
eq(work.future,{literal:true});ok(work.teachingShown&&work.referenceShown);const before=copy(work);eq(c.changeSharedWork(s,work,'k',0),null);eq(c.changeSharedWork(s,work,'a',25),null);eq(c.changeSharedWork(s,work,'x',0),null);eq(work,before);work=c.changeSharedWork(s,work,'a',null);eq(work.a,null);ok(work.teachingShown&&work.referenceShown);
for(const patch of [{id:'constructor'},{title:'x'.repeat(161)},{A:0},{B:25},{initialX:13},{teaching:['one'],teachingFacts:[]},{teachingFacts:[[[0,2]],[],[],[]]},{teachingFacts:[[[2,13]],[],[],[]]},{contrasts:[]},{example:{...s.example,k:0}}])ok(!c.validSharedSource({...s,...patch}));
const sparse=copy(s);delete sparse.teaching[0];ok(!c.validSharedSource(sparse));ok(!c.validSharedSource(Object.create(s)));
ok(c.validSharedSource({...s,title:'🌿'.repeat(160)}));ok(!c.validSharedSource({...s,title:'🌿'.repeat(161)}));
const old={...copy(s),id:'Own saved words',title:'An older panel',A:8,B:9,teaching:['One old paragraph'],teachingFacts:[[[8,9]]],contrasts:['One old contrast'],contrastFacts:[[[12,12]]],example:{A:1,B:2,k:2,a:2,b:3,x:2},future:{literal:true}};
ok(c.validSharedSource(old),'different paragraph counts and unexpected example coefficients are own-source material');
const ow=c.newSharedWork(old);eq(c.sharedDisplayPairs(old,ow,view('learn',{step:0})),[]);
eq(c.sharedDisplayPairs(old,ow,view('learn',{step:1})),[[8,9],[1,2],[2,2],[2,4],[2,3],[2,7]]);
eq(c.sharedDisplayPairs(old,ow,view('learn',{contrasts:true})),[[12,12]],'only the elected retained prose contributes facts');
eq(c.sharedDisplayPairs(s,w,view('learn',{step:1})),[[2,2],[2,5]]);
eq(c.sharedDisplayPairs(s,w,view('learn',{step:3})),[[2,2],[2,5]],'unseen numerical step and teaching figure stay unqualified');
eq(c.sharedDisplayPairs(s,w,view('learn',{step:4})),[[2,2],[2,5],[4,3],[2,3],[2,11],[2,6]]);
const complete={...w,k:3,a:2,b:3,teachingShown:true,referenceShown:true};
eq(c.sharedDisplayPairs(s,complete,view('build')),[[6,4],[2,4],[3,8],[3,3],[3,11]]);
eq(c.sharedDisplayPairs(s,complete,view('compare')),[[6,4],[2,4],[3,8],[3,3],[3,11],[3,2]]);
eq(c.sharedDisplayPairs(s,w,view('build',{reference:true})),[[3,2],[3,3]],'reference is independently elected even for incomplete proposals');
eq(c.sharedDisplayPairs(s,complete,view('learn')),[],'sticky support flags do not reveal old work or help on Learn');
eq(c.sharedDisplayPairs(s,complete,view('shelf',{reference:true})),[]);
const large={...w,x:12,k:24,a:24,b:24};eq(c.sharedDisplayPairs({...s,A:24},large,view('compare')),[],'large operands are not small facts');
const book={other:{raw:true}};eq(c.keepSharedSheet(book,old,work,yes),'shared-side-1');const first=copy(book.sharedSides[0]);old.title='Changed local title';work.b=0;eq(book.sharedSides[0],first);
const mixed={sharedSides:[first,{id:'shared-side-900',future:true},{...copy(first),id:'shared-side-777'},{...copy(first),id:'shared-side-777'},null]};
eq(c.sharedSheetsView(mixed).items.map(r=>r.readable),[true,false,false,false,false]);eq(c.keepSharedSheet(mixed,s,w,yes),'shared-side-901');
for(const suffix of ['999999','1000000','9007199254740993']){const b={sharedSides:[{id:'shared-side-'+suffix}]},prev=copy(b);eq(c.keepSharedSheet(b,s,w,yes),false);eq(b,prev);}
for(const root of [null,{},'future']){const b={sharedSides:root},prev=copy(b);eq(c.keepSharedSheet(b,s,w,yes),false);eq(b,prev);}
for(const opts of [{},{canExport:()=>false},{canExport:()=>1},{canExport:()=>{throw Error('Invented refusal');}}]){const b={other:true},prev=copy(b);eq(c.keepSharedSheet(b,s,w,opts),false);eq(b,prev);}
const hostile={other:{held:true}};ok(c.keepSharedSheet(hostile,s,w,{canExport(candidate){candidate.sharedSides=[];candidate.other=null;return true;}}));eq(hostile.other,{held:true});eq(hostile.sharedSides.length,1);
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const decl=app.match(/^function notesReport\(notebook\)\{.*\}$/m)[0],report=Function('recommendations','explorerStore',decl+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});
const canExport=b=>prepareProgressImport(JSON.stringify(report(b),null,2)).ok;
const exposeDecl=app.match(/function exposeStoryFacts\([\s\S]*?\n}\n/)[0];
const expose=Function('noteLegacyExposure','noteGardenFactExposure','notePendingBrambleFactExposure','checkin','return ('+exposeDecl+');')(noteLegacyExposure,noteGardenFactExposure,notePendingBrambleFactExposure,checkin);
const opts={canExport,exposeFacts:(pairs,target)=>expose({facts:pairs},null,target,true,false)},fresh=()=>initializeExplorerState(freshState());
const shown=c.sharedDisplayPairs(s,complete,view('build'));
const state=fresh();state.broad.drafts.waiting={question:{fact:[3,3]},attempts:[],raw:'held'};const visit=startPostOffice(state,deliveries[0].id);ok(startAdaptiveRival(state));visit.rival.task=generateRivalTask('multiply',3,3,0);const held=copy(state);
ok(c.recordSharedDisplay(state,shown,opts).changed);ok(state.broad.drafts.waiting.knownFact);ok(state.postOffice.visits[0].rival.priorFactShown);eq(state.broad.drafts.waiting.attempts,[]);eq(state.baseline.observations,held.baseline.observations);ok(!Object.hasOwn(state,'sharedSides'));
eq(c.recordSharedDisplay(state,shown,{...opts,canExport:()=>false}),{ok:true,changed:false});
state.broad.drafts.newWaiting={question:{fact:[3,3]},attempts:[]};ok(c.recordSharedDisplay(state,shown,opts).changed);ok(state.broad.drafts.newWaiting.knownFact);
const baseline=fresh(),baseQuestion=checkin.find(q=>q.fact?.[0]===4&&q.fact[1]===6);ok(baseQuestion);baseline.baseline.draft={questionId:baseQuestion.id,raw:'held'};
const baselinePairs=c.sharedDisplayPairs({...s,A:4},{...w,x:6,k:1,a:0,b:0},view('build'));eq(baselinePairs,[[4,6]]);ok(c.recordSharedDisplay(baseline,baselinePairs,opts).changed);ok(baseline.baseline.draft.exposed);eq(baseline.baseline.observations,[]);
const node=Object.values(storyNodes).find(n=>n.facts?.length&&n.facts[0].every(v=>Number.isInteger(v)&&v>=1&&v<=12));ok(node);const [ga,gx]=node.facts[0],garden=fresh();garden.garden.visits.push({id:'invented',entrance:node.entrance,drafts:{[node.id]:{attempts:[],raw:'held'}}});
ok(c.recordSharedDisplay(garden,c.sharedDisplayPairs({...s,A:ga},{...w,x:gx,k:1,a:0,b:0},view('build')),opts).changed);ok(garden.garden.visits[0].drafts[node.id].knownFact);eq(garden.garden.visits[0].drafts[node.id].attempts,[]);
const waiting=()=>{const b=fresh();b.broad.drafts.waiting={question:{fact:[3,3]},attempts:[]};return b;};
for(const options of [{...opts,canExport:()=>false},{...opts,canExport:()=>1},{...opts,exposeFacts:()=>{throw Error('Invented refusal');}}]){const b=waiting(),prev=copy(b);eq(c.recordSharedDisplay(b,shown,options),{ok:false,changed:false});eq(b,prev);}
const captured=waiting();ok(c.recordSharedDisplay(captured,shown,{...opts,canExport(b){b.broad=null;b.sharedSides=[];return true;}}).ok);ok(captured.broad.drafts.waiting.knownFact);ok(!Object.hasOwn(captured,'sharedSides'));
const transfer=fresh();transfer.sharedSides=copy(mixed.sharedSides);transfer.syntheticOther={literal:'held'};eq(c.keepSharedSheet(transfer,s,w,{canExport}),'shared-side-902');const restored=prepareProgressImport(JSON.stringify(report(transfer),null,2));ok(restored.ok);eq(restored.state.sharedSides,transfer.sharedSides);eq(restored.state.syntheticOther,transfer.syntheticOther);
const cap=waiting();cap.padding='';const proposal=copy(cap);ok(c.recordSharedDisplay(proposal,shown,{...opts,canExport:()=>true}).changed);const room=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(proposal,null,2)).length-40;cap.padding='x'.repeat(room);proposal.padding=cap.padding;ok(recoveryFitsProgressLimits(proposal));ok(!canExport(proposal));const oldCap=copy(cap);eq(c.recordSharedDisplay(cap,shown,opts),{ok:false,changed:false});eq(cap,oldCap);
const keepCap=fresh();keepCap.padding='';const kept=copy(keepCap);ok(c.keepSharedSheet(kept,s,w,yes));const keepRoom=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(kept,null,2)).length-40;keepCap.padding='x'.repeat(keepRoom);kept.padding=keepCap.padding;ok(recoveryFitsProgressLimits(kept));ok(!canExport(kept));const oldKeep=copy(keepCap);eq(c.keepSharedSheet(keepCap,s,w,{canExport}),false);eq(keepCap,oldKeep);
console.log('Shared Side: coefficient identities, source-owned proposals, visible arithmetic and actual Notes/exposure boundaries passed.');
