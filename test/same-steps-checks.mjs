import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stepCases,makeStepSource} from '../dist/same-steps-content.mjs';
import {validStepSource,validStepWork,newStepWork,changeStepWork,stepResult,pairResult,exampleBounds,stepSheetsView,keepStepSheet} from '../dist/same-steps-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(a,m)=>{assert.ok(a,m);n++;},clone=structuredClone,yes={canExport:()=>true},q=(n,d=1)=>({n,d});
// Rows and differences are independent expected values, not derived from the content factory.
const expected=[
 ['rise',[[0,2],[1,5],[2,8],[3,11],[4,14]],[[1,3,3],[1,3,3],[1,3,3],[1,3,3]]],
 ['fall',[[0,6],[1,4],[2,2],[3,0],[4,-2]],[[1,-2,-2],[1,-2,-2],[1,-2,-2],[1,-2,-2]]],
 ['flat',[[0,5],[1,5],[2,5],[3,5],[4,5]],[[1,0,0],[1,0,0],[1,0,0],[1,0,0]]],
 ['square',[[0,0],[1,1],[2,4],[3,9],[4,16]],[[1,1,1],[1,3,3],[1,5,5],[1,7,7]]],
 ['double',[[0,1],[1,2],[2,4],[3,8],[4,16]],[[1,1,1],[1,2,2],[1,4,4],[1,8,8]]],
 ['skip',[[0,1],[1,3],[3,7],[4,9]],[[1,2,2],[2,4,2],[1,2,2]]]
];
eq(stepCases.map(c=>c.id),expected.map(c=>c[0]),'Six deliberate open number models');
for(const [id,rows,differences] of expected){
 const s=makeStepSource(id),w=newStepWork(s);ok(validStepSource(s),'Finite source validates');
 eq(s.rows.map(p=>[p.x,p.y]),rows,'Exact supplied table, not an interpolated curve');
 eq(s.axes,{xMin:0,xMax:4,xStep:1,yMin:-4,yMax:16,yStep:2},'Axis steps explicitly differ from grid squares');
 eq(rows.slice(1).map((_,i)=>stepResult(s,w,i).actual),differences.map(([x,y,rate])=>({x,y,rate:q(rate)})),'Every actual difference and exact rate');
 const edge={...w,selected:[0,s.rows.length-2]};eq(pairResult(s,edge).sameRate,!['square','double'].includes(id),'Constant versus changing selected rates');
 eq(stepResult(s,w,0).fitKind,'absent','No automatic construction or solved-source snap');
}
eq(makeStepSource('missing'),null,'Unknown case has no replacement source');
const s=makeStepSource(),w=newStepWork(s);
eq(w,{v:1,selected:[0,1],steps:{},idea:null,referenceShown:false,exampleShown:false},'Literal initial work and support flags');
const changed=changeStepWork(s,w,'adjust',{interval:0,axis:'y',delta:1});eq(changed.steps,{'0':{x:0,y:1}},'First unit action starts from zero then makes only requested change');eq(w.steps,{},'Editing returns detached session work');
let built=changeStepWork(s,changed,'adjust',{interval:0,axis:'x',delta:1});built=changeStepWork(s,built,'adjust',{interval:0,axis:'y',delta:1});built=changeStepWork(s,built,'adjust',{interval:0,axis:'y',delta:1});
eq(stepResult(s,built,0),{index:0,start:{x:0,y:2},end:{x:1,y:5},actual:{x:1,y:3,rate:q(3)},built:{x:1,y:3,rate:q(3)},fitKind:'fit',candidateEnd:{x:1,y:5},outside:false},'Both signed differences reach next row');
eq(stepResult(s,{...w,steps:{'0':{x:2,y:6}}},0).fitKind,'same-rate','Same rate with longer vector does not reach next row');
eq(stepResult(s,{...w,steps:{'0':{x:-1,y:-3}}},0).fitKind,'same-rate','Reversed vector has equal rate but does not reach the next row');
eq(stepResult(s,{...w,steps:{'0':{x:1,y:2}}},0).fitKind,'different','Other mismatch stays literal');
for(const y of [0,5,-200]){
 const result=stepResult(s,{...w,steps:{'0':{x:0,y}}},0);eq([result.built.rate,result.fitKind],[null,'different'],'Zero across is never a defined same rate');
}
const flat=makeStepSource('flat');eq(stepResult(flat,{...newStepWork(flat),steps:{'0':{x:0,y:0}}},0).fitKind,'different','Zero vector does not inherit horizontal rate zero');
eq(stepResult(flat,{...newStepWork(flat),steps:{'0':{x:2,y:0}}},0).built.rate,q(0),'Nonzero across and zero output has exact rate zero');
const fall=makeStepSource('fall');eq(stepResult(fall,{...newStepWork(fall),steps:{'0':{x:-1,y:2}}},0).built.rate,q(-2),'Negative rate has normalized denominator');
const skip=makeStepSource('skip'),sw=newStepWork(skip);eq(pairResult(skip,sw),{rates:[q(2),q(2)],sameRate:true,sameInterval:false},'Skipped row uses divide by actual across change');
const repeat=changeStepWork(skip,sw,'select',{slot:1,index:0});eq(pairResult(skip,repeat),{rates:[q(2),q(2)],sameRate:true,sameInterval:true},'Repeated interval is explicit, not independent comparison');
const idea=changeStepWork(s,built,'idea','different'),selected=changeStepWork(s,idea,'select',{slot:0,index:3});eq([selected.idea,selected.steps],['different',built.steps],'Selections preserve literal idea and earlier constructions');
eq(changeStepWork(s,changeStepWork(s,w,'reference'),'reference',false).referenceShown,true,'Reference support sticky');
eq(changeStepWork(s,changeStepWork(s,w,'example'),'example',false).exampleShown,true,'Separate example support sticky');
const edge=changeStepWork(s,{...w,steps:{'0':{x:199,y:0,future:'held'}},future:{raw:[1,2]}},'adjust',{interval:0,axis:'x',delta:1});
eq(edge.steps['0'],{x:200,y:0,future:'held'},'End control can reach declared bound, preserving additive vector fields');eq(edge.future,{raw:[1,2]},'Unknown work fields preserved');
eq(changeStepWork(s,edge,'adjust',{interval:0,axis:'x',delta:1}),null,'Beyond bound refuses, never silently clamps');
eq(stepResult(s,edge,0).candidateEnd,{x:200,y:2},'Outside endpoint keeps actual data');eq(stepResult(s,edge,0).outside,true,'Outside state can be shown without changing stored vector');
eq(changeStepWork(s,{...w,steps:{'0':{x:-200,y:0}}},'adjust',{interval:0,axis:'x',delta:-1}),null,'Negative bound equally enforced');
for(const [action,value] of [['select',{slot:2,index:0}],['select',{slot:0,index:4}],['adjust',{interval:4,axis:'x',delta:1}],['adjust',{interval:0,axis:'other',delta:1}],['adjust',{interval:0,axis:'x',delta:2}],['idea','one'],['unknown',null]])eq(changeStepWork(s,w,action,value),null,'Invalid action has no fallback mutation');

const historical={...clone(s),id:'Earlier table é',title:'<Earlier model>',rule:'An earlier literal number label',rows:[{x:3,y:7,future:'row'},{x:1,y:3},{x:0,y:1}],axes:{xMin:-1,xMax:5,xStep:1,yMin:-4,yMax:8,yStep:2,future:'axis'},future:{raw:'source'}};
const hw={...newStepWork(historical),steps:{'0':{x:-2,y:-4,future:'vector'},'1':{x:199,y:0}},idea:'not-sure',future:{raw:'work'}};
ok(validStepWork(historical,hw),'Historical counts/order/id/labels/axes valid by own source');
eq([stepResult(historical,hw,0).actual,stepResult(historical,hw,0).fitKind,pairResult(historical,hw).sameRate],[{x:-2,y:-4,rate:q(2)},'fit',true],'Descending input changes produce exact own-source rates');
const atBound=changeStepWork(historical,hw,'adjust',{interval:1,axis:'x',delta:1});eq(stepResult(historical,atBound,1).candidateEnd,{x:201,y:3},'Imported construction at bound remains off-window and exact');
const two={...clone(s),rows:[{x:0,y:0},{x:3,y:1}],axes:{xMin:0,xMax:4,xStep:1,yMin:-1,yMax:3,yStep:1}};
eq(newStepWork(two).selected,[0,0],'Two-row source invents no second interval');
eq(stepResult(two,{...newStepWork(two),steps:{'0':{x:6,y:2}}},0).built.rate,q(1,3),'Rational rate exact, not rounded');eq(stepResult(two,{...newStepWork(two),steps:{'0':{x:6,y:2}}},0).fitKind,'same-rate','Rational equal-rate comparison exact');
const ten={...clone(s),rows:Array.from({length:10},(_,x)=>({x,y:x})),axes:{xMin:0,xMax:10,xStep:1,yMin:0,yMax:10,yStep:1}};ok(validStepSource(ten),'Historical row count need not equal catalog length');
eq(exampleBounds(s),{xMin:-1,xMax:4,yMin:-1,yMax:15},'Separate example bounds include zero with padding');
const levelExample={...clone(s),example:{start:{x:-100,y:0},end:{x:100,y:0},words:['A separate flat step.']}};
ok(validStepSource(levelExample),'Flat historical example is allowed');eq(exampleBounds(levelExample),{xMin:-101,xMax:101,yMin:-1,yMax:1},'Helper bounds stay nondegenerate, independent of source axes limits');
for(const [key,value] of [['v',2],['id','constructor'],['id',' '],['title',''],['rule',''],['rows',[]],['rows',Array(2)],['teaching',[]],['explanation','']])eq(validStepSource({...s,[key]:value}),false,'Malformed required source remains unavailable');
for(const change of [a=>a.xStep=0,a=>a.xStep=3,a=>a.xMin=4,a=>a.yMax=101,a=>{a.yMin=-100;a.yMax=100;a.yStep=1;}]){const bad=clone(s);change(bad.axes);eq(validStepSource(bad),false,'Invalid scale or excessive tick count refused');}
eq(validStepSource({...s,rows:[{x:0,y:1},{x:0,y:3}]}),false,'Distinct x values prevent undefined actual rate');eq(validStepSource({...s,rows:[{x:0,y:100},{x:1,y:1}]}),false,'Own rows must fit frozen source axes');
eq(validStepSource({...s,example:{...s.example,end:{x:1,y:8}}}),false,'Example also needs nonzero across change');
eq(validStepSource(Object.create(s)),false,'Required own fields cannot be inherited');
eq(validStepSource({...s,id:'é'.repeat(80)}),true,'Historical Unicode id permitted within bound');eq(validStepSource({...s,id:'é'.repeat(81)}),false,'ID bound counts code points');
for(const key of ['00','1.0','-0','1e0','4','constructor'])eq(validStepWork(s,{...w,steps:{[key]:{x:0,y:0}}}),false,'Only canonical resolving interval keys');
for(const change of [a=>a.selected=[0],a=>a.selected=[0,4],a=>a.selected=Array(2),a=>a.steps={'0':{x:201,y:0}},a=>a.steps={'0':{x:0.5,y:0}},a=>a.referenceShown=1,a=>a.exampleShown='yes']){const bad=clone(w);change(bad);eq(validStepWork(s,bad),false,'Malformed work is not repaired or graded');}
eq(stepResult(s,w,4),null,'Unresolving interval has no fabricated result');eq(newStepWork(null),null,'Unavailable source has no replacement work');

const book={other:{raw:['held']},notes:'n'.repeat(500000)},before=clone(book);
eq(stepSheetsView(book),{status:'absent',items:[],canKeep:true},'Opening shelf allocates nothing');eq(book,before,'View preserves notebook');
eq(keepStepSheet(book,historical,hw,yes),'rate-step-1','Keep unfinished, unexpected own-source construction');const first=clone(book.rateStepSheets[0]);
historical.future.raw='caller';hw.future.raw='caller';eq(book.rateStepSheets[0],first,'Detached snapshots keep source/work and unknown fields');
const copy=changeStepWork(first.source,first.work,'adjust',{interval:1,axis:'y',delta:1});eq(keepStepSheet(book,first.source,copy,yes),'rate-step-2','Copy appends another version');eq(book.rateStepSheets[0],first,'Original remains immutable');eq([book.other,book.notes],[before.other,before.notes],'Only elected root changes, including large Notes');
const prior=clone(book),working=clone(w);
for(const options of [{},null,{canExport:null},{canExport:()=>false},{canExport:()=>undefined},{canExport:()=>null},{canExport:()=>1},{canExport:()=>({ok:true})},{canExport:()=>{throw Error('refuse');}}]){eq(keepStepSheet(book,s,w,options),false,'Only true from actual callback commits');eq(book,prior,'Preflight refusal leaves all roots exact');eq(w,working,'Refusal leaves draft exact');}
const mutable={other:{raw:true}},other=mutable.other;
eq(keepStepSheet(mutable,s,w,{canExport:c=>{c.rateStepSheets[0].source.rows[0].y=99;c.rateStepSheets[0].work.idea='different';c.other.raw=false;return true;}}),'rate-step-1','Callback receives disposable candidate');eq(mutable.rateStepSheets,[{id:'rate-step-1',source:s,work:w}],'Callback cannot mutate committed proposal');assert.equal(mutable.other,other);n++;eq(mutable.other.raw,true,'Other root untouched by candidate mutation');
const mixed={rateStepSheets:[{id:'rate-step-9',raw:['future']},clone(first),{id:'foreign',unknown:'held'}]},old=clone(mixed);
eq(stepSheetsView(mixed).items.map(i=>[i.id,i.index,i.readable]),[['rate-step-9',0,false],['rate-step-1',1,true],[null,2,false]],'Unreadable siblings stay beside healthy historical work');eq(keepStepSheet(mixed,s,w,yes),'rate-step-10','Recognized unreadable ids reserve namespace');eq(mixed.rateStepSheets.slice(0,3),old.rateStepSheets,'Raw siblings remain exact after append');
const duplicate={rateStepSheets:[clone(first),clone(first),{...clone(first),id:'rate-step-3'}]};eq(stepSheetsView(duplicate).items.map(i=>i.readable),[false,false,true],'Duplicate ids do not close unique siblings');
const max={rateStepSheets:[{id:'rate-step-999999',raw:'held'}]};eq(stepSheetsView(max).canKeep,false,'Recognized suffix exhaustion explicit');eq(keepStepSheet(max,s,w,yes),false,'Overflow refuses without wrap or eviction');
for(const value of [null,'future',{v:2}]){const b={rateStepSheets:value,other:'held'},saved=clone(b);eq(stepSheetsView(b).status,'unavailable','Unknown wrapper stays opaque');eq(keepStepSheet(b,s,w,yes),false,'Opaque root cannot append');eq(b,saved,'Unsupported root retained exactly');}
const many={rateStepSheets:Array.from({length:33},(_,i)=>({...clone(first),id:`rate-step-${i+1}`}))};eq(keepStepSheet(many,s,w,yes),'rate-step-34','No arbitrary small history cap');eq(many.rateStepSheets.length,34,'Every earlier item retained');
const huge={notes:'x'.repeat(5*1024*1024)},hugeBefore=clone(huge);let calls=0;eq(keepStepSheet(huge,s,w,{canExport:()=>{calls++;return true;}}),false,'Whole-notebook capacity refuses without pruning');eq(calls,0,'Oversize does not reach report callback');eq(huge,hugeBefore,'Capacity refusal preserves Notes');

const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),declaration=app.match(/^function notesReport\(notebook\)\{.*\}$/m)?.[0];ok(declaration,'Actual Notes report available');
const report=new Function('recommendations','explorerStore',`${declaration}; return notesReport;`)(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});
const pretty=b=>JSON.stringify(report(b),null,2),actual={canExport:b=>prepareProgressImport(pretty(b)).ok};
const transfer=initializeExplorerState(freshState());transfer.syntheticNeighbour={payload:'n'.repeat(500000),raw:[null,7,'held']};transfer.rateStepSheets=clone(mixed.rateStepSheets);
eq(keepStepSheet(transfer,first.source,first.work,actual),'rate-step-11','Actual pretty Notes preflight with large raw sibling');const raw=clone(transfer),imported=prepareProgressImport(pretty(transfer));ok(imported.ok,'Actual report imports');eq(imported.state.rateStepSheets,transfer.rateStepSheets,'Own source/constructed steps/history and raw siblings transfer exactly');eq(imported.state.syntheticNeighbour,transfer.syntheticNeighbour,'Large unknown root exact');eq(prepareProgressImport(pretty(imported.state)).state.rateStepSheets,transfer.rateStepSheets,'Second report/import preserves kept steps');eq(transfer,raw,'Report/import did not rewrite notebook');
console.log(`Same steps: ${n} mathematics, construction, history and actual Notes checks passed.`);
