import assert from 'node:assert/strict';
import {sharedPointCases,makeSharedPointSource} from '../dist/shared-point-content.mjs';
import {validSharedPointSource,validSharedPointWork,newSharedPointWork,changeSharedPointWork,pointResult,sharedSet,sharedReasoning,sharedLineExpression,sharedLineEquation,clipSharedLine,sharedPointSheetsView,keepSharedPointSheet} from '../dist/shared-point-core.mjs';
import {freshState} from '../dist/core.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
let checks=0;
const eq=(actual,expected,label)=>{assert.deepEqual(actual,expected,label);checks++;};
const clone=structuredClone,yes={canExport:()=>true};
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const Q=(n,d=1)=>{if(d<0){n=-n;d=-d;}const g=gcd(n,d);return {n:n/g||0,d:d/g};};
// Expected rules and solution sets are independent of the content factory's output.
const cases=[
 ['up-down',[[1,1],[-1,3]],{kind:'one',x:Q(1),y:Q(2)}],
 ['level',[[2,-1],[0,2]],{kind:'one',x:Q(3,2),y:Q(2)}],
 ['below',[[-1,-1],[1,1]],{kind:'one',x:Q(-1),y:Q(0)}],
 ['parallel',[[1,2],[1,-1]],{kind:'none'}],
 ['together',[[-1,1],[-1,1]],{kind:'line'}],
 ['low',[[0,-2],[2,2]],{kind:'one',x:Q(-2),y:Q(-2)}]
];
eq(sharedPointCases.map(c=>c.id),cases.map(c=>c[0]),'Six deliberate case choices');
const expected=[],actual=[];
for(const [id,base,reference] of cases)for(const shift of [-1,0,1]){
 const s=makeSharedPointSource(id,shift),w=newSharedPointWork(s);
 const answer=reference.kind==='one'?{...reference,x:Q(reference.x.n+shift*reference.x.d,reference.x.d)}:reference;
 actual.push([validSharedPointSource(s),s.id,s.lines.map(l=>[l.m,l.b]),sharedSet(s),pointResult(s,w).kind]);
 expected.push([true,`shared-point-${id}-${['left','center','right'][shift+1]}`,base.map(([m,b])=>[m,b-m*shift]),answer,'neither']);
}
eq(actual,expected,'All18 translations, exact sets, source identity and unsolved constant default');
for(const [id,shift] of [['other',0],['up-down',2],['up-down',0.5],['up-down','0']])eq(makeSharedPointSource(id,shift),null,'Unsupported content selection is explicit');
const s=makeSharedPointSource(),w=newSharedPointWork(s);
eq(w,{v:1,x:2,y:-5,claim:null,referenceShown:false},'Default is a literal point, not a fitted answer');
eq(pointResult(s,{...w,x:1,y:2}),{x:1,y:2,outputs:[Q(2),Q(2)],fits:[true,true],kind:'both'},'One ordered pair fits both equations');
eq(pointResult(s,{...w,x:0,y:1}).kind,'first','Fits first only');
eq(pointResult(s,{...w,x:0,y:3}).kind,'second','Fits second only');
eq(pointResult(s,{...w,x:0,y:0}).kind,'neither','Fits neither');
eq(pointResult(s,{...w,x:-0.5,y:0.5}),{x:-0.5,y:0.5,outputs:[Q(1,2),Q(7,2)],fits:[true,false],kind:'first'},'Negative half coordinates substitute exactly');
eq(pointResult(s,{...w,x:0.5,y:-0.5}).kind,'neither','Swapping x/y changes the point');
const changed=changeSharedPointWork(s,{...w,future:{held:[1,2]}},'x',-1.5);
eq([changed.x,changed.y,changed.future],[-1.5,-5,{held:[1,2]}],'Coordinate edits independent, extras retained');
eq(w.x,2,'Coordinate edit clones work');
for(const claim of [null,'one','none','line'])eq(changeSharedPointWork(s,w,'claim',claim).claim,claim,'Any literal claim is valid, independent of truth');
const reference=changeSharedPointWork(s,w,'reference');
eq([reference.x,reference.y,reference.claim,reference.referenceShown],[2,-5,null,true],'Reference exposure never replaces point/claim');
eq(changeSharedPointWork(s,reference,'reference',false).referenceShown,true,'Reference exposure is sticky');
for(const [action,value] of [['x',4.5],['x',0.1],['y',-6.5],['y',NaN],['claim','every'],['missing',1]])eq(changeSharedPointWork(s,w,action,value),null,'Invalid control change refused');

const historical={...clone(s),id:'earlier-source',title:'<Earlier table>',story:'An earlier own-source story',lines:[{id:'second',label:'<Earlier B>',m:0,b:1},{id:'first',label:'Earlier A',m:3,b:0}],future:{raw:[1,2]}};
const hw={...w,x:0.5,y:1,claim:'none',referenceShown:true,future:'held'};
eq(validSharedPointWork(historical,hw),true,'Historical id/order/labels/coefficients/claim need no catalogue equality');
eq(sharedSet(historical),{kind:'one',x:Q(1,3),y:Q(1)},'Exact rational crossing beyond halfstep learner controls');
eq(pointResult(historical,hw),{x:0.5,y:1,outputs:[Q(1),Q(3,2)],fits:[true,false],kind:'first'},'Historical slot order controls its literal fit');
eq(sharedReasoning(historical).map(row=>row.equation),['1 = 3x','-3x = -1','x = 1/3','y = 0 × (1/3) + (1) = 1','<Earlier B>: 1 = 0 × (1/3) + (1); Earlier A: 1 = 3 × (1/3) + (0)'],'Own-source exact reasoning uses originals and original labels');
const offwindow={...clone(s),lines:[{id:'a',label:'A',m:4,b:12},{id:'b',label:'B',m:3,b:-12}]};
eq(sharedSet(offwindow),{kind:'one',x:Q(-24),y:Q(-84)},'Offwindow crossing remains a unique pair');
eq(sharedReasoning(makeSharedPointSource('parallel')).map(r=>r.equation),['x + 2 = x - 1','0x = -3','0 = -3'],'Parallel contradiction without division');
eq(sharedReasoning(makeSharedPointSource('together')).map(r=>r.equation),['-x + 1 = -x + 1','0x = 0','0 = 0; y = -x + 1'],'Coincident result keeps its line, not whole plane');
const horizontal={...clone(s),lines:[{id:'a',label:'A',m:0,b:2},{id:'b',label:'B',m:0,b:2}]};
eq(sharedSet(horizontal),{kind:'line'},'Identical horizontal rules are one shared line');
horizontal.lines[1].b=-2;eq(sharedSet(horizontal),{kind:'none'},'Different horizontal rules never cross');
eq([sharedLineExpression(s.lines[0]),sharedLineEquation(s.lines[1]),sharedLineEquation({m:0,b:-2})],['x + 1','y = -x + 3','y = -2'],'Linear forms retain zero/unit/negative coefficients');
for(const [key,value] of [['v',2],['model','vertical'],['id','constructor'],['title',''],['teaching',[]],['teaching',Array(2)],['lines',Array(2)]])eq(validSharedPointSource({...s,[key]:value}),false,'Malformed source does not become a different exercise');
for(const line of [{...s.lines[0],m:5},{...s.lines[0],b:13},{...s.lines[0],m:0.5},{...s.lines[0],id:'__proto__'}])eq(validSharedPointSource({...s,lines:[line,s.lines[1]]}),false,'Known line bounds and safe own id enforced');
eq(validSharedPointSource({...s,lines:[s.lines[0],s.lines[0]]}),false,'Own line ids must be distinct');
eq(validSharedPointSource(Object.create(s)),false,'Inherited source does not supply own fields');
eq(newSharedPointWork(null),null,'Malformed source has no pretend work');
eq(pointResult(s,{...w,v:2}),null,'Future work version retained uneditable');
eq(sharedSet({...s,model:'other'}),null,'Unknown model has no inferred reference');

eq(clipSharedLine({m:1,b:0}),{from:[-4,-4],to:[4,4]},'Diagonal clips at x edges');
eq(clipSharedLine({m:2,b:0}),{from:[-3,-6],to:[3,6]},'Steeper line clips at y edges');
eq(clipSharedLine({m:-2,b:1}),{from:[-2.5,6],to:[3.5,-6]},'Negative line clipping has correct orientation');
eq(clipSharedLine({m:0,b:6}),{from:[-4,6],to:[4,6]},'Boundary horizontal has positive length');
eq(clipSharedLine({m:0,b:7}),null,'Offwindow horizontal has no visible segment');
eq(clipSharedLine({m:1,b:10}),null,'Corner-only touch is not a path');
eq(clipSharedLine({m:-1,b:-10}),null,'Opposite corner-only touch is not a path');
eq(clipSharedLine({m:1,b:11}),null,'Entirely offwindow line has no segment');
eq(clipSharedLine({m:NaN,b:0}),null,'Malformed geometry does not propagate NaN');

const book={other:{raw:['held']},notes:'n'.repeat(500000)},before=clone(book);
eq(sharedPointSheetsView(book),{status:'absent',items:[],canKeep:true},'Pure empty shelf does not create root');
eq(book,before,'View preserves entire notebook');
eq(keepSharedPointSheet(book,historical,hw,yes),'shared-point-1','Keep accepts unfinished unexpected own-source work');
eq([book.other,book.notes],[before.other,before.notes],'Keep touches only elected root, including large Notes');
const first=clone(book.sharedPointSheets[0]);
eq(first.source,historical,'Source and unknown fields kept exact');
eq(first.work,hw,'Raw claim/point/support and unknowns kept exact');
historical.future.raw.push(3);hw.future='caller edit';
eq(book.sharedPointSheets[0],first,'Snapshot has no caller aliases');
const copy=changeSharedPointWork(first.source,first.work,'x',2.5);
eq(keepSharedPointSheet(book,first.source,copy,yes),'shared-point-2','Copy appends distinct sheet');
eq(book.sharedPointSheets[0],first,'Original remains exact after changed copy');
const saved=clone(book),working=clone(w);
for(const opts of [{},{canExport:()=>false},{canExport:()=>{throw Error('refuse');}}]){
 eq(keepSharedPointSheet(book,s,w,opts),false,'Missing/refused/throwing actual preflight refuses');eq(book,saved,'Refusal leaves notebook exact');eq(w,working,'Refusal leaves working point exact');
}
const mutated={};
eq(keepSharedPointSheet(mutated,s,w,{canExport:c=>{c.sharedPointSheets[0].source.lines[0].m=4;c.sharedPointSheets[0].work.x=-4;c.other='bad';return true;}}),'shared-point-1','Accepted preflight receives disposable candidate');
eq([mutated.sharedPointSheets[0].source,mutated.sharedPointSheets[0].work,Object.hasOwn(mutated,'other')],[s,w,false],'Preflight mutation cannot change committed proposal or unrelated root');
const huge={notes:'z'.repeat(5*1024*1024)},hugeBefore=clone(huge);let calls=0;
eq(keepSharedPointSheet(huge,s,w,{canExport:()=>{calls++;return true;}}),false,'Whole notebook capacity refuses without pruning');eq(calls,0,'Too-large root never reaches export callback');eq(huge,hugeBefore,'Capacity refusal preserves notes');
const mixed={sharedPointSheets:[{id:'shared-point-8',future:'raw'},clone(first),{id:'foreign',raw:[1,2]}]};
const mixedBefore=clone(mixed.sharedPointSheets);
eq(sharedPointSheetsView(mixed).items.map(i=>[i.id,i.index,i.readable]),[['shared-point-8',0,false],['shared-point-1',1,true],[null,2,false]],'Unreadable and foreign siblings do not hide healthy source');
eq(keepSharedPointSheet(mixed,s,w,yes),'shared-point-9','Unreadable canonical ids reserve allocation');eq(mixed.sharedPointSheets.slice(0,3),mixedBefore,'Earlier raw siblings exact after append');
const duplicate={sharedPointSheets:[clone(first),clone(first),{...clone(first),id:'shared-point-3'}]};
eq(sharedPointSheetsView(duplicate).items.map(i=>i.readable),[false,false,true],'Duplicate ids unavailable without closing independent siblings');
for(const value of [null,'future',{v:2}]){const b={sharedPointSheets:value,other:'held'},old=clone(b);eq(sharedPointSheetsView(b).canKeep,false,'Unknown root unappendable');eq(keepSharedPointSheet(b,s,w,yes),false,'Unknown root not replaced');eq(b,old,'Opaque root retained');}
const exhausted={sharedPointSheets:[{id:'shared-point-999999',future:'held'}]};eq(sharedPointSheetsView(exhausted).canKeep,false,'Id exhaustion explicit');eq(keepSharedPointSheet(exhausted,s,w,yes),false,'No wraparound or eviction');
const many={sharedPointSheets:Array.from({length:33},(_,i)=>({...clone(first),id:`shared-point-${i+1}`}))};eq(keepSharedPointSheet(many,s,w,yes),'shared-point-34','No arbitrary small sheet cap');eq(many.sharedPointSheets.length,34,'Every earlier sheet stays available for pagination');
const transfer={...freshState(),sharedPointSheets:clone(mixed.sharedPointSheets),notes:'n'.repeat(500000),futureRoot:{exact:[1,2]}};
const imported=prepareProgressImport(JSON.stringify(transfer));
eq(imported.ok,true,'Actual generic import accepts optional own-source sheets');
eq(imported.state.sharedPointSheets,transfer.sharedPointSheets,'Actual import keeps historical/raw siblings exact');
eq([imported.state.notes,imported.state.futureRoot],[transfer.notes,transfer.futureRoot],'Actual import retains large Notes and unknown root');
console.log(`One Shared Point: ${checks} checks passed.`);
