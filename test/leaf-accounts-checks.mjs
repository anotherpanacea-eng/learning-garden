import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {leafCases,leafSource} from '../dist/leaf-accounts-content.mjs';
import {validLeafSource,validLeafWork,newLeafWork,changeLeafWork,countFor,leafFormula,leafAtomAccount,leafReferenceWork,leafAccountsView,lastLeafAccount,keepLeafAccount} from '../dist/leaf-accounts-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(a,m)=>{assert.ok(a,m);n++;},clone=structuredClone,yes={canExport:()=>true};
const zero={C:0,H:0,O:0},reference={C:6,H:12,O:18};
const build=(s,counts)=>counts.reduce((w,count,i)=>changeLeafWork(s,w,'amount',{slotId:s.slots[i].id,count}),newLeafWork(s));
const expected=[
 ['leaf-light',[['co2-in','co2','in',6],['water-in','water','in',6],['glucose-out','glucose','out',1],['oxygen-out','oxygen','out',6]],['light','sugar']],
 ['leaf-respiration',[['glucose-in','glucose','in',1],['oxygen-in','oxygen','in',6],['co2-out','co2','out',6],['water-out','water','out',6]],['sugar','activity-heat']],
 ['root-respiration',[['glucose-in','glucose','in',1],['oxygen-in','oxygen','in',6],['co2-out','co2','out',6],['water-out','water','out',6]],['sugar','activity-heat']]
];
eq(leafCases.map(c=>c.id),expected.map(c=>c[0]),'Three open contexts');
for(const [id,slots,energy] of expected){
 const s=leafSource(id),w=leafReferenceWork(s);ok(validLeafSource(s),'Finite source valid');
 eq(s.species.map(p=>[p.id,p.atoms]),[['co2',{C:1,H:0,O:2}],['water',{C:0,H:2,O:1}],['glucose',{C:6,H:12,O:6}],['oxygen',{C:0,H:0,O:2}]],'Independent chemical composition expectations');
 eq(s.slots.map(p=>[p.id,p.speciesId,p.side,p.referenceCount]),slots,'Independent slot direction and reference coefficients');
 eq([w.energy.fromId,w.energy.toId],energy,'Separate source-owned energy reference');
 eq(leafAtomAccount(s,w),{used:reference,made:reference,difference:zero,empty:false,matches:true},'Independent C/H/O totals for each reviewed reference');
 eq(s.species.map(leafFormula),['CO2','H2O','C6H12O6','O2'],'Formulas derive composition, omitting zeros and subscript1');
 eq(s.teachingDemo,{speciesId:'water',count:2},'Water teaching example resolves its own composition');
}
eq(leafSource('missing'),null,'No implicit substitute for an unknown case');
const s=leafSource(),w=newLeafWork(s);
eq(w,{v:1,counts:[],energy:{fromId:null,toId:null},countShown:false,referenceShown:false,exampleSeen:0},'No inferred counts, captions or exposure');
eq(leafAtomAccount(s,w),{used:zero,made:zero,difference:zero,empty:true,matches:true},'Zero matches zero arithmetically but remains explicitly empty');
eq(leafAtomAccount(s,build(s,[12,12,2,12])),{used:{C:12,H:24,O:36},made:{C:12,H:24,O:36},difference:zero,empty:false,matches:true},'Doubled coefficients keep equal atom counts');
eq(leafAtomAccount(s,build(s,[6,5,1,6])),{used:{C:6,H:10,O:17},made:{C:6,H:12,O:18},difference:{C:0,H:2,O:1},empty:false,matches:false},'Signed output-minus-input differences, not real atom creation');
eq(leafAtomAccount(s,build(s,[1,1,1,1])),{used:{C:1,H:2,O:3},made:{C:6,H:12,O:8},difference:{C:5,H:10,O:5},empty:false,matches:false},'One of each is an unfinished construction, not a corrected summary');
const water=changeLeafWork(s,w,'amount',{slotId:'water-in',count:2});
eq(leafAtomAccount(s,water),{used:{C:0,H:4,O:2},made:zero,difference:{C:0,H:-4,O:-2},empty:false,matches:false},'Two whole water molecules have two separate groups of unchanged composition');
eq(leafFormula(s.species.find(p=>p.id==='water')),'H2O','Changing coefficient does not rewrite molecule formula');eq(w.counts,[],'Targeted count action clones work');eq(countFor(w,'water-in'),0,'Missing own slot count means zero');
const shown=changeLeafWork(s,water,'count');eq(shown.countShown,true,'Count atoms is an explicit display action');
const changed=changeLeafWork(s,{...shown,referenceShown:true,exampleSeen:2},'amount',{slotId:'co2-in',count:1});eq([changed.countShown,changed.referenceShown,changed.exampleSeen],[false,true,2],'Count edit clears only atom-comparison display');
let captions=changeLeafWork(s,shown,'energy',{field:'fromId',id:'activity-heat'});captions=changeLeafWork(s,captions,'energy',{field:'toId',id:'light'});
eq([captions.energy,captions.countShown],[{fromId:'activity-heat',toId:'light'},true],'Unexpected caption selections stay literal and ungraded');eq(leafAtomAccount(s,captions),leafAtomAccount(s,shown),'Energy choices never change atom arithmetic');
eq(changeLeafWork(s,captions,'energy',{field:'fromId',id:null}).energy.fromId,null,'Caption can return to unchosen');
const exposed=changeLeafWork(s,w,'reference');eq([exposed.counts,exposed.energy,exposed.referenceShown],[[],{fromId:null,toId:null},true],'Reference does not apply its counts/captions to learner');
eq(changeLeafWork(s,exposed,'reference',false).referenceShown,true,'Reference exposure sticky');
let example=w;for(let i=0;i<5;i++)example=changeLeafWork(s,example,'example');eq(example.exampleSeen,3,'Manual teaching seen count saturates at source frames');
const ordered={...w,counts:[{slotId:'oxygen-out',count:1,future:{raw:'oxygen'}},{slotId:'water-in',count:2,future:{raw:'water'}}],energy:{fromId:null,toId:null,future:'energy'},future:{raw:'work'}};
const target=changeLeafWork(s,ordered,'amount',{slotId:'water-in',count:0});eq(target.counts,[{slotId:'oxygen-out',count:1,future:{raw:'oxygen'}},{slotId:'water-in',count:0,future:{raw:'water'}}],'Targeted updates preserve count order, entry extras and explicit zero');
const appended=changeLeafWork(s,target,'amount',{slotId:'co2-in',count:0});eq(appended.counts.at(-1),{slotId:'co2-in',count:0},'Newly addressed zero count appended without filling every missing slot');
eq([appended.energy,appended.future],[ordered.energy,ordered.future],'Unrelated work/nested unknown fields exact');
for(const [action,value] of [['amount',{slotId:'missing',count:1}],['amount',{slotId:'co2-in',count:-1}],['amount',{slotId:'co2-in',count:0.5}],['amount',{slotId:'co2-in',count:13}],['energy',{field:'other',id:null}],['energy',{field:'toId',id:'missing'}],['other',null]])eq(changeLeafWork(s,w,action,value),null,'Invalid action refuses without repairing or grading');

const historical={...clone(s),id:'earlier-model',title:'<Earlier composition>',process:'An earlier descriptive process',
 species:[{id:'earlier-material',label:'<Earlier material>',atoms:{C:24,H:24,O:0,future:'atoms'},future:{raw:'species'}}],
 slots:[{id:'earlier-out',speciesId:'earlier-material',side:'out',referenceCount:0,future:'slot'},...Array.from({length:7},(_,i)=>({id:`earlier-in-${i}`,speciesId:'earlier-material',side:'in',referenceCount:i}))],
 energyOptions:[{id:'earlier-energy',label:'<Earlier caption>',description:'An earlier saved caption.',future:'option'}],energyReference:{fromId:'earlier-energy',toId:'earlier-energy',note:'An earlier reference.',future:'reference'},teachingDemo:{speciesId:'earlier-material',count:3,future:'demo'},teaching:['Earlier teaching words.'],future:{raw:'source'}};
ok(validLeafSource(historical),'Own source may change species counts, IDs, slot count/order, process and reference without catalog validation');
eq(leafFormula(historical.species[0]),'C24H24','Own historical composition controls formula');
const hw={...build(historical,Array(8).fill(12)),energy:{fromId:'earlier-energy',toId:null,future:'work energy'},countShown:true,referenceShown:true,exampleSeen:1,future:{raw:'work'}};
eq(leafAtomAccount(historical,hw),{used:{C:2016,H:2016,O:0},made:{C:288,H:288,O:0},difference:{C:-1728,H:-1728,O:0},empty:false,matches:false},'Maximum own-source arithmetic includes repeated species in distinct slots');
eq(leafReferenceWork(historical).counts.map(p=>p.count),[0,0,1,2,3,4,5,6],'Unexpected historical reference retained literally');
eq(leafReferenceWork(historical).energy,{fromId:'earlier-energy',toId:'earlier-energy'},'Reference captions resolve own options without current biology key');
const sparse={...newLeafWork(historical),counts:[{slotId:'earlier-in-0',count:1}]};eq(leafAtomAccount(historical,sparse).used,{C:24,H:24,O:0},'Missing historical slot entries contribute zero, not an invented full set');
for(const [key,value] of [['v',2],['model','other'],['id','constructor'],['title',''],['process',''],['species',[]],['slots',Array(2)],['energyOptions',[]],['teaching',[]]])eq(validLeafSource({...s,[key]:value}),false,'Malformed required source remains unavailable');
const badSources=[a=>a.species[0].atoms.C=25,a=>a.species[0].atoms={C:0,H:0,O:0},a=>a.species[0].atoms={C:24,H:24,O:1},a=>a.species.push(clone(a.species[0])),a=>a.slots[0].speciesId='missing',a=>a.slots[0].referenceCount=13,a=>a.slots.forEach(p=>p.side='in'),a=>a.energyOptions.push(clone(a.energyOptions[0])),a=>a.energyReference.toId='missing',a=>a.teachingDemo.speciesId='missing',a=>a.teachingDemo.count=4];
for(const damage of badSources){const bad=clone(s);damage(bad);eq(validLeafSource(bad),false,'Malformed own references or bounds never draw a substitute source');}
eq(validLeafSource(Object.create(s)),false,'Own source fields required');
for(const damage of [a=>a.counts=Array(1),a=>a.counts=[{slotId:'co2-in',count:1},{slotId:'co2-in',count:2}],a=>a.counts=[{slotId:'missing',count:1}],a=>a.energy.toId='missing',a=>a.exampleSeen=4,a=>a.countShown='yes',a=>a.referenceShown=1]){const bad=clone(w);damage(bad);eq(validLeafWork(s,bad),false,'Bad work is unreadable, not silently normalized');}
eq(newLeafWork(null),null,'Bad source has no pretend work');eq(leafAtomAccount(s,{...w,v:2}),null,'Future work is not recomputed as present work');eq(leafFormula({id:'bad',label:'bad',atoms:{C:0,H:0,O:0}}),null,'Empty malformed composition has no invented formula');

const book={other:{raw:['held']},notes:'n'.repeat(500000)},before=clone(book);
eq(leafAccountsView(book),{status:'absent',items:[],canKeep:true},'Reading shelf allocates no root');eq(book,before,'Source reader leaves whole notebook unchanged');
eq(keepLeafAccount(book,historical,hw,yes),'leaf-account-1','Explicit Keep appends unfinished historical work');const first=clone(book.leafAccounts[0]);
historical.future.raw='caller';hw.future.raw='caller';eq(book.leafAccounts[0],first,'Frozen source/work and unknown fields have no caller aliases');
const copy=changeLeafWork(first.source,first.work,'amount',{slotId:'earlier-out',count:0});eq(keepLeafAccount(book,first.source,copy,yes),'leaf-account-2','Edited copy appends separate snapshot');eq(book.leafAccounts[0],first,'Original survives later copy');eq([book.other,book.notes],[before.other,before.notes],'Only leaf root replaced');
const prior=clone(book),draft=clone(w);
for(const options of [{},null,{canExport:null},{canExport:()=>undefined},{canExport:()=>null},{canExport:()=>1},{canExport:()=>({ok:true})},{canExport:()=>false},{canExport:()=>{throw Error('refuse');}}]){eq(keepLeafAccount(book,s,w,options),false,'Only true from actual preflight commits');eq(book,prior,'Missing/refused/throwing preflight preserves notebook');eq(w,draft,'Refusal keeps working construction');}
const mutable={other:{held:true}},other=mutable.other;
eq(keepLeafAccount(mutable,s,w,{canExport:c=>{c.leafAccounts[0].source.species[0].atoms.C=24;c.leafAccounts[0].work.energy.fromId='light';c.other.held=false;return true;}}),'leaf-account-1','Preflight receives disposable candidate');eq(mutable.leafAccounts,[{id:'leaf-account-1',source:s,work:w}],'Callback cannot rewrite committed proposal');assert.equal(mutable.other,other);n++;eq(mutable.other.held,true,'Callback does not replace unrelated original root');
const mixed={leafAccounts:[{id:'leaf-account-900',future:['raw']},clone(first),{id:'foreign',raw:'unknown'}]},old=clone(mixed);
eq(leafAccountsView(mixed).items.map(p=>[p.id,p.index,p.readable]),[['leaf-account-900',0,false],['leaf-account-1',1,true],[null,2,false]],'Unreadable siblings stay represented without closing healthy sheet');eq(lastLeafAccount(mixed).id,'leaf-account-1','Return picks last readable raw item, not last arbitrary row');
eq(keepLeafAccount(mixed,s,w,yes),'leaf-account-901','Unreadable raw IDs reserve monotone namespace');eq(mixed.leafAccounts.slice(0,3),old.leafAccounts,'Earlier raw siblings exact after append');
const duplicate={leafAccounts:[clone(first),clone(first),{...clone(first),id:'leaf-account-3'}]};eq(leafAccountsView(duplicate).items.map(p=>p.readable),[false,false,true],'Duplicate IDs unavailable individually');
for(const value of [null,'future',{v:2}]){const b={leafAccounts:value,other:'held'},saved=clone(b);eq(leafAccountsView(b).canKeep,false,'Opaque root blocks only Keep');eq(keepLeafAccount(b,s,w,yes),false,'Unknown root not overwritten');eq(b,saved,'Opaque original exact');}
const exhausted={leafAccounts:[{id:'leaf-account-999999',raw:'held'}]};eq(leafAccountsView(exhausted).canKeep,false,'ID exhaustion explicit');eq(keepLeafAccount(exhausted,s,w,yes),false,'No wraparound or eviction');
const many={leafAccounts:Array.from({length:33},(_,i)=>({...clone(first),id:`leaf-account-${i+1}`}))};eq(keepLeafAccount(many,s,w,yes),'leaf-account-34','No arbitrary small record cap');eq(many.leafAccounts.length,34,'All earlier raw rows remain for paging');
const huge={notes:'x'.repeat(5*1024*1024)},hugeBefore=clone(huge);let calls=0;eq(keepLeafAccount(huge,s,w,{canExport:()=>{calls++;return true;}}),false,'Whole-notebook byte limit refuses without pruning');eq(calls,0,'Oversize never reaches export callback');eq(huge,hugeBefore,'Capacity refusal preserves Notes');

const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),declaration=app.match(/^function notesReport\(notebook\)\{.*\}$/m)?.[0];ok(declaration,'Actual app Notes report available');
const report=new Function('recommendations','explorerStore',`${declaration}; return notesReport;`)(recommendations,{active:{avatar:'sky',color:'blue',symbol:'leaf'}});
const pretty=b=>JSON.stringify(report(b),null,2),actual={canExport:b=>prepareProgressImport(pretty(b)).ok};
const transfer=initializeExplorerState(freshState());transfer.syntheticNeighbour={payload:'n'.repeat(500000),raw:['held',null,7]};transfer.leafAccounts=clone(mixed.leafAccounts);
eq(keepLeafAccount(transfer,first.source,first.work,actual),'leaf-account-902','Actual pretty Notes preflight with own historical source and large sibling');const raw=clone(transfer),imported=prepareProgressImport(pretty(transfer));ok(imported.ok,'Actual Notes report imports');
eq(imported.state.leafAccounts,transfer.leafAccounts,'Atom compositions, literal counts/captions/support and raw siblings transfer exactly');eq(imported.state.syntheticNeighbour,transfer.syntheticNeighbour,'Large unknown root preserved');eq(prepareProgressImport(pretty(imported.state)).state.leafAccounts,transfer.leafAccounts,'Second report/import preserves frozen sheets');eq(transfer,raw,'Report/import did not rewrite the source notebook');
console.log(`Leaf accounts: ${n} composition, arithmetic, history and actual Notes checks passed.`);
