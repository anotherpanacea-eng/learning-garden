import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {productCases,makeProductSource} from '../dist/four-parts-content.mjs';
import {validProductFigure,validProductSource,validProductWork,newProductWork,changeProductWork,productResult,productSheetsView,keepProductSheet} from '../dist/four-parts-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(a,m)=>{assert.ok(a,m);n++;},clone=structuredClone,yes={canExport:()=>true};
const labeled=(s,x=s.initialX)=>({...newProductWork(s),x,pieces:{square:{power:2,count:1},right:{power:1,count:s.a},bottom:{power:1,count:s.b},corner:{power:0,count:s.a*s.b}},total:[1,s.a+s.b,s.a*s.b]});
const cases=[['picture',2,3,[1,5,6]],['narrow',1,4,[1,5,4]],['square',3,3,[1,6,9]],['wide',2,4,[1,6,8]],['small',1,1,[1,2,1]],['corner',3,4,[1,7,12]]];
eq(productCases.map(c=>c.id),cases.map(c=>c[0]),'Six open layouts');
for(const [id,a,b,coefficients] of cases){
 const source=makeProductSource(id);ok(validProductSource(source),'Current finite source validates');
 eq([source.a,source.b,source.initialX],[a,b,6],'Authored strips and distinguishable initial square');
 const work=labeled(source),r=productResult(source,work);
 eq(r.wholeCoefficients,coefficients,'Authored expansions have independent expected coefficients');
 eq([r.wholeFit,r.collectionFit,r.valueFit],[true,true,true],'Fitting labels and gathered tray agree in each authored case');
 ok(source.teaching.every(p=>p.figure===null||validProductFigure(p.figure)),'Current page pictures are drawable from their own metadata');
 eq([source.example.a,source.example.b,source.example.x],[1,2,10],'Separate worked plan');
}
eq(makeProductSource('missing'),null,'No unknown-case replacement');
const s=makeProductSource(),w=newProductWork(s);
eq(w,{v:1,x:6,pieces:{},total:[0,0,0],referenceShown:false,exampleShown:false,teachingShown:false},'Literal initial work contains no labels and a zero tray');
// The entire permitted dimension instrument: 36 side pairs at 12 picture sizes.
for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)for(let x=1;x<=12;x++){
 const source={...s,a,b,initialX:x},work=labeled(source,x),r=productResult(source,work);
 eq(r.pieces.map(p=>p.actual),[x*x,a*x,b*x,a*b],'Four independent rectangle areas');
 eq(r.wholeTotal,(x+a)*(x+b),'Whole from its side lengths');
 eq(r.pieces.reduce((sum,p)=>sum+p.actual,0),r.wholeTotal,'Pieces cover the rectangle without overlap');
 eq([r.labelsTotal,r.wholeCoefficients,r.trayTotal,r.wholeFit,r.collectionFit],[[1,a+b,a*b],[1,a+b,a*b],(x+a)*(x+b),true,true],'Canonical collection covers every permitted area');
}
const blank=productResult(s,w);
eq(blank.pieces.map(p=>[p.key,p.proposed,p.formFit,p.valueFit]),['square','right','bottom','corner'].map(key=>[key,null,null,null]),'Missing labels are distinct from zero');
eq([blank.labelsComplete,blank.labelsTotal,blank.collectionFit],[false,null,null],'Missing labels do not fabricate a collected sum');
const trap=labeled(s,2);trap.pieces.square={power:1,count:2};trap.total=[0,7,6];
const atTwo=productResult(s,trap);
eq([atTwo.pieces[0].actual,atTwo.pieces[0].proposedValue,atTwo.pieces[0].formFit,atTwo.pieces[0].valueFit],[4,4,false,true],'x squared and 2x coincide numerically at two without matching forms');
eq([atTwo.labelsTotal,atTwo.collectionFit,atTwo.wholeFit,atTwo.valueFit,atTwo.trayTotal,atTwo.wholeTotal],[[0,7,6],true,false,true,20,20],'Tray can gather proposed labels and match one value while differing from whole identity');
const atThree=productResult(s,changeProductWork(s,trap,'x',3));
eq([atThree.trayTotal,atThree.wholeTotal,atThree.valueFit],[27,30,false],'Changing x exposes the numerical coincidence');
eq(trap.x,2,'Changing x leaves earlier work detached');
const swap=labeled(s);swap.pieces.right.count=3;swap.pieces.bottom.count=2;
eq([productResult(s,swap).stripSwap,productResult(s,swap).wholeFit,productResult(s,swap).collectionFit],[true,true,true],'Exact unequal strip swap leaves gathered whole intact');
eq(productResult(s,swap).pieces.map(p=>p.formFit),[true,false,false,true],'Each swapped strip still differs from its own dimensions');
const strange=clone(swap);strange.pieces.square={power:0,count:0};strange.total=[0,0,0];
eq([productResult(s,strange).stripSwap,productResult(s,strange).wholeFit],[true,false],'Swap evidence describes only the two strips; UI separately gates its message on whole fit');
for(const change of [p=>p.right.count=2,p=>p.right.power=0,p=>p.bottom=null,p=>delete p.right]){const near=clone(swap);change(near.pieces);eq(productResult(s,near).stripSwap,false,'Only exact opposite strip terms establish a swap');}
const equal=makeProductSource('square');eq(productResult(equal,labeled(equal)).stripSwap,false,'Equal-width strips have no observable swap');
const incomplete=clone(swap);delete incomplete.pieces.corner;eq([productResult(s,incomplete).labelsTotal,productResult(s,incomplete).collectionFit],[null,null],'One missing label prevents collection comparison even with fitting tray');

const first=changeProductWork(s,w,'kind',{part:'square',power:1});eq(first.pieces,{square:{power:1,count:1}},'First kind selection starts at one');eq(w.pieces,{},'Construction does not mutate earlier draft');
const extras={...clone(first),future:{raw:[null,'held']},pieces:{...first.pieces,square:{power:1,count:0,future:{raw:'term'}},futurePart:{unknown:['held']}},total:[0,576,0]};
const kind=changeProductWork(s,extras,'kind',{part:'square',power:2});
eq(kind.pieces.square,{power:2,count:0,future:{raw:'term'}},'Changing kind retains literal zero and term extras');
eq([kind.future,kind.pieces.futurePart],[extras.future,extras.pieces.futurePart],'Unknown work and piece fields survive changes');
kind.pieces.square.future.raw='changed';eq(extras.pieces.square.future.raw,'term','Returned work is deeply detached');
const cleared=changeProductWork(s,extras,'clear','square');eq(cleared.pieces.square,null,'Clear returns an explicit missing label');eq(cleared.total,extras.total,'Clear leaves independently built tray intact');
eq(changeProductWork(s,cleared,'kind',{part:'square',power:0}).pieces.square,{power:0,count:1},'Choosing after clear begins a new label');
for(const flag of ['reference','example','teaching']){
 const opened=changeProductWork(s,w,flag),edited=changeProductWork(s,opened,'x',2);
 eq([opened[flag+'Shown'],edited[flag+'Shown'],changeProductWork(s,edited,flag,false)[flag+'Shown']],[true,true,true],'Each named support flag is sticky after edits');
}
for(const part of ['square','right','bottom','corner']){
 for(const [start,delta,end] of [[0,1,1],[0,5,5],[1,-1,0],[5,-5,0],[139,5,144],[143,1,144],[144,-1,143],[144,-5,139]]){
  const work={...w,pieces:{[part]:{power:0,count:start}}};eq(changeProductWork(s,work,'count',{part,delta}).pieces[part].count,end,'Count action reaches declared bounds without clamping');
 }
 for(const [count,delta] of [[0,-1],[0,-5],[144,1],[144,5],[2,-5],[142,5]])eq(changeProductWork(s,{...w,pieces:{[part]:{power:2,count}}},'count',{part,delta}),null,'Leaving piece count window refuses');
}
for(let index=0;index<3;index++){
 for(const [start,delta,end] of [[0,1,1],[0,5,5],[1,-1,0],[5,-5,0],[571,5,576],[575,1,576],[576,-1,575],[576,-5,571]]){
  const work=clone(w);work.total[index]=start;eq(changeProductWork(s,work,'total',{index,delta}).total[index],end,'Tray count reaches both declared bounds');
 }
 for(const [start,delta] of [[0,-1],[0,-5],[576,1],[576,5],[2,-5],[574,5]]){const work=clone(w);work.total[index]=start;eq(changeProductWork(s,work,'total',{index,delta}),null,'Tray does not clamp beyond bounds');}
}
const allOnes={...w,pieces:Object.fromEntries(['square','right','bottom','corner'].map(k=>[k,{power:0,count:144}])),total:[0,0,576]};
eq([productResult(s,allOnes).labelsTotal,productResult(s,allOnes).collectionFit],[[0,0,576],true],'All four maximum labels fit a single tray bucket');
for(const x of [1,12])eq(changeProductWork(s,w,'x',x).x,x,'Both picture size endpoints available');
for(const [action,value] of [['x',0],['x',13],['x',2.5],['x','2'],['kind',{part:'futurePart',power:0}],['kind',{part:'right',power:3}],['count',{part:'right',delta:1}],['count',{part:'square',delta:2}],['clear','futurePart'],['total',{index:3,delta:1}],['total',{index:0,delta:2}],['unknown',null]])eq(changeProductWork(s,first,action,value),null,'Invalid requests do not repair or mutate work');

const historical={...clone(s),id:'Earlier layout é',title:'<Earlier title>',a:6,b:5,initialX:1,teaching:[{words:'Historical words',figure:{kind:'future-picture',data:[7]},future:'page'}],explanation:'Earlier explanation',example:{a:6,b:6,x:12,words:['An earlier example'],future:'example'},future:{raw:'source'}};
const hw={...labeled(historical,12),future:{raw:'work'},pieces:{...labeled(historical).pieces,futurePart:{raw:true},square:{power:2,count:1,future:'term'}},referenceShown:true,exampleShown:true,teachingShown:true};
ok(validProductWork(historical,hw),'Historical dimensions, words, examples and extras are source owned');
eq([productResult(historical,hw).wholeTotal,productResult(historical,hw).wholeCoefficients],[306,[1,11,30]],'Historical comparisons use frozen source');
for(const figure of [undefined,null,7,'future',{kind:'future'}, {kind:'rectangle',a:0,b:2,x:3,notation:'letters'}]){
 const source=clone(historical);if(figure===undefined)delete source.teaching[0].figure;else source.teaching[0].figure=figure;
 ok(validProductSource(source),'Unsupported or missing optional figure does not invalidate words');eq(validProductFigure(figure),false,'Only separately valid nonnull metadata draws');
 const saved={};eq(keepProductSheet(saved,source,newProductWork(source),yes),'area-product-1','Words remain keepable without a drawable picture');eq(saved.areaProducts[0].source,source,'Optional raw metadata survives Keep exactly');
}
for(const figure of [{kind:'rectangle',a:1,b:6,x:12,notation:'numbers'},{kind:'rectangle',a:6,b:1,x:1,notation:'letters'},{kind:'square-and-strip',xs:[1,12],strip:6}])ok(validProductFigure(figure),'Valid figure endpoints');
for(const figure of [{kind:'rectangle',a:1,b:2,x:3},{kind:'rectangle',a:1,b:2,x:3,notation:'other'},{kind:'square-and-strip',xs:[2,2],strip:2},{kind:'square-and-strip',xs:[0,3],strip:2},{kind:'square-and-strip',xs:Array(2),strip:2},{kind:'square-and-strip',xs:[2,3],strip:7},Object.create({kind:'rectangle',a:1,b:2,x:3,notation:'numbers'})])eq(validProductFigure(figure),false,'Malformed figure never draws');
for(const [key,value] of [['v',2],['id','constructor'],['id',' '],['id','é'.repeat(81)],['title',''],['title','t'.repeat(161)],['story','s'.repeat(1501)],['explanation',''],['a',0],['a',7],['b',1.5],['b',7],['initialX',0],['initialX',13],['teaching',[]],['teaching',Array(1)],['teaching',Array.from({length:9},()=>({words:'held'}))],['teaching',[{words:' '}]],['example',{a:1,b:2,x:3,words:[]}],['example',{a:0,b:2,x:3,words:['held']}],['example',{a:1,b:2,x:13,words:['held']}]])eq(validProductSource({...s,[key]:value}),false,'Required source shape and text bounds enforced');
eq(validProductSource({...historical,id:'é'.repeat(80)}),true,'ID code point bound accepts Unicode history');eq(validProductSource(Object.create(s)),false,'Required source fields must be own');
for(const change of [a=>a.v=2,a=>a.x=0,a=>a.x=13,a=>a.pieces=[],a=>a.pieces.square={},a=>a.pieces.right={power:3,count:1},a=>a.pieces.corner={power:0,count:145},a=>a.pieces.bottom={power:1,count:-1},a=>a.total=Array(3),a=>a.total=[0,0],a=>a.total=[0,0,577],a=>a.total=[0,0,-1],a=>a.referenceShown=1,a=>a.exampleShown=null,a=>delete a.teachingShown]){const bad=clone(w);change(bad);eq(validProductWork(s,bad),false,'Malformed work unavailable without normalization');eq(productResult(s,bad),null,'Invalid work has no fabricated result');}
eq(newProductWork(null),null,'Unavailable source has no new draft');

const book={other:{raw:['held']},notes:'n'.repeat(500000)},before=clone(book);
eq(productSheetsView(book),{status:'absent',items:[],canKeep:true},'Viewing never initializes the retained root');eq(book,before,'Notebook remains exact on view');
eq(keepProductSheet(book,historical,hw,yes),'area-product-1','Unusual historical work can be kept');const kept=clone(book.areaProducts[0]);
historical.future.raw='caller';hw.future.raw='caller';eq(book.areaProducts[0],kept,'Source and work are detached snapshots');
const copy=changeProductWork(kept.source,kept.work,'x',2);eq(keepProductSheet(book,kept.source,copy,yes),'area-product-2','A copy appends another version');eq(book.areaProducts[0],kept,'Earlier version remains exact');eq(book.areaProducts[1].work,copy,'Copies carry all support flags and extras');eq([book.other,book.notes],[before.other,before.notes],'Only elected retained root changes');
const prior=clone(book),working=clone(w);
for(const options of [{},null,{canExport:null},{canExport:()=>false},{canExport:()=>undefined},{canExport:()=>null},{canExport:()=>1},{canExport:()=>({ok:true})},{canExport:()=>{throw Error('refuse');}}]){eq(keepProductSheet(book,s,w,options),false,'Only strict true permits Keep');eq(book,prior,'Refusal leaves all roots exact');eq(w,working,'Refusal leaves draft exact');}
const mutable={other:{raw:true}},other=mutable.other;
eq(keepProductSheet(mutable,s,w,{canExport:c=>{c.areaProducts[0].source.a=6;c.areaProducts[0].work.x=12;c.areaProducts.push({id:'injected'});c.other.raw=false;return true;}}),'area-product-1','Callback receives a disposable actual-notebook candidate');
eq(mutable.areaProducts,[{id:'area-product-1',source:s,work:w}],'Callback mutation cannot change committed detached proposal');assert.equal(mutable.other,other);n++;eq(mutable.other.raw,true,'Other roots retain identity and values');
const mixed={areaProducts:[{id:'area-product-9',raw:['future']},clone(kept),{id:'foreign',unknown:'held'},null]},mixedBefore=clone(mixed);
eq(productSheetsView(mixed).items.map(i=>[i.id,i.index,i.readable]),[['area-product-9',0,false],['area-product-1',1,true],[null,2,false],[null,3,false]],'Unreadable neighbors retain array positions');
eq(keepProductSheet(mixed,s,w,yes),'area-product-10','Unreadable canonical ids reserve their suffix');eq(mixed.areaProducts.slice(0,4),mixedBefore.areaProducts,'Raw future siblings remain exact');
const duplicate={areaProducts:[clone(kept),clone(kept),{...clone(kept),id:'area-product-3'}]};eq(productSheetsView(duplicate).items.map(i=>i.readable),[false,false,true],'Only duplicate entries are individually unreadable');eq(keepProductSheet(duplicate,s,w,yes),'area-product-4','Duplicate history still reserves its number');
for(const id of ['area-product-999999','area-product-1000000','area-product-9007199254740992','area-product-'+'9'.repeat(400)]){
 const max={areaProducts:[{id,raw:'held'},{...clone(kept),id:'area-product-3'}]},saved=clone(max);
 eq([productSheetsView(max).canKeep,productSheetsView(max).items.map(i=>i.readable)],[false,[false,true]],'Exhausted or unsafe canonical suffix refuses Keep without closing healthy sibling');eq(keepProductSheet(max,s,w,yes),false,'No overflow, wrap or pruning');eq(max,saved,'Future suffix retained exact');
}
for(const id of ['area-product-0','area-product-01','area-product-1.0','area-product--1','area-product-1e2']){const b={areaProducts:[{id}]};eq(productSheetsView(b).items[0].readable,false,'Noncanonical id cannot be opened');eq(keepProductSheet(b,s,w,yes),'area-product-1','Only canonical positive suffixes reserve allocation');}
for(const value of [null,'future',{v:2}]){const b={areaProducts:value,other:'held'},saved=clone(b);eq(productSheetsView(b).status,'unavailable','Unknown root stays opaque');eq(keepProductSheet(b,s,w,yes),false,'Opaque root refuses append');eq(b,saved,'Unknown wrapper retained exact');}
const many={areaProducts:Array.from({length:33},(_,i)=>({...clone(kept),id:`area-product-${i+1}`}))};eq(keepProductSheet(many,s,w,yes),'area-product-34','No arbitrary fixed record cap');
const huge={notes:'x'.repeat(MAX_IMPORT_BYTES)},hugeBefore=clone(huge);let calls=0;eq(keepProductSheet(huge,s,w,{canExport:()=>{calls++;return true;}}),false,'Whole-notebook capacity refuses without eviction');eq(calls,0,'Oversized candidate does not call export callback');eq(huge,hugeBefore,'Capacity refusal leaves raw Notes exact');

// Exercise the real Notes envelope and importer rather than a mirror schema.
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),declaration=app.match(/^function notesReport\(notebook\)\{.*\}$/m)?.[0];ok(declaration,'Actual Notes report available');
const report=new Function('recommendations','explorerStore',`${declaration}; return notesReport;`)(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});
const pretty=b=>JSON.stringify(report(b),null,2),actual={canExport:b=>prepareProgressImport(pretty(b)).ok};
const transfer=initializeExplorerState(freshState());transfer.syntheticNeighbour={payload:'n'.repeat(500000),raw:[null,7,'held']};transfer.areaProducts=clone(mixed.areaProducts);
eq(keepProductSheet(transfer,kept.source,kept.work,actual),'area-product-11','Actual pretty Notes preflight includes large unknown neighbor');
const raw=clone(transfer),imported=prepareProgressImport(pretty(transfer));ok(imported.ok,'Actual report imports');eq(imported.state.areaProducts,transfer.areaProducts,'Labels, tray, flags, figures and raw history transfer exactly');eq(imported.state.syntheticNeighbour,transfer.syntheticNeighbour,'Large unknown sibling exact');eq(prepareProgressImport(pretty(imported.state)).state.areaProducts,transfer.areaProducts,'Second report/import preserves the same kept bytes');eq(transfer,raw,'Report/import does not rewrite source notebook');
// Choose padding so the raw candidate fits but its actual Notes envelope does not.
const near=initializeExplorerState(freshState()),probe=clone(near);keepProductSheet(probe,s,w,yes);probe.capacityPadding='';
const rawBytes=Buffer.byteLength(JSON.stringify(probe,null,2)),reportBytes=Buffer.byteLength(pretty(probe));ok(reportBytes>rawBytes,'Actual Notes has envelope overhead');
near.capacityPadding='x'.repeat(MAX_IMPORT_BYTES-rawBytes-Math.floor((reportBytes-rawBytes)/2));
const nearBefore=clone(near);let actualCalls=0;
eq(keepProductSheet(near,s,w,{canExport:c=>{actualCalls++;ok(recoveryFitsProgressLimits(c),'Raw whole-notebook candidate fits');return prepareProgressImport(pretty(c)).ok;}}),false,'Actual Notes wrapper can refuse an otherwise raw-fitting append');eq(actualCalls,1,'Actual Notes preflight is reached at the boundary');eq(near,nearBefore,'Actual Notes refusal remains atomic');
console.log(`Four Parts: ${n} mathematics, construction, history and actual Notes checks passed.`);
