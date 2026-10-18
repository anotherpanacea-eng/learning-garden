import assert from 'node:assert/strict';
import {freshState,recommendations,restoreState,STORAGE_KEY} from '../dist/core.mjs';
import {ensureCafe,nextGuest} from '../dist/cafe-core.mjs';
import {ensureBroad,noteLegacyExposure} from '../dist/broad-core.mjs';
import {ensurePlantings,startOpenTask} from '../dist/plantings.mjs';
import {startLiving,livingVisit} from '../dist/living-core.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {starterIngredients} from '../dist/cafe-content.mjs';
import {spiralAnimals,spiralCases,spiralConditions,spiralPlaces,spiralTarget,spiralMatch,spiralAnimal,spiralCase} from '../dist/living-spiral-content.mjs';
import {spiralPage,spiralNotes,spiralAnimalArt,spiralPlaceArt} from '../dist/living-spiral-ui.mjs';
import {hasSpiral,spiralState,currentSpiral,validSpiralRound,spiralReady,spiralClosed,setSpiralOption,startSpiral,selectSpiralPlace,inspectSpiral,chooseSpiral,compareSpiral,supportSpiral,findSpiral,inputSpiral,submitSpiralCount,helpSpiralCount,carrySpiral,leaveSpiral,parcelPair,spiralPairsShown} from '../dist/living-spiral-core.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};const equal=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const fresh=()=>{const s=freshState();ensureCafe(s);ensureBroad(s);ensurePlantings(s);return s;};
function inspect(s,n){check(selectSpiralPlace(s,n)&&inspectSpiral(s),'inspect location');}
function ready(s,help=false){const r=currentSpiral(s),n=spiralTarget(r.task);inspect(s,n);inspect(s,(n+1)%3);if(help)supportSpiral(s,'explained');else{chooseSpiral(s,'answerPlace',n);chooseSpiral(s,'answerReason',spiralAnimal(spiralCase(r.task.caseId).animal).reason);compareSpiral(s);}check(spiralReady(r)&&findSpiral(s),'reasoned/helped search finds parcel');}
function finish(s,help=false){ready(s,help);const r=currentSpiral(s);if(help)helpSpiralCount(s);else{inputSpiral(s,String(r.task.packs*r.task.bites));check(submitSpiralCount(s),'count submission');}s.cafe.stock[r.task.ingredientId]=0;check(carrySpiral(s),'explicit carry');check(validSpiralRound(r),'finished round remains valid');}
for(const c of spiralCases)for(let rotation=0;rotation<3;rotation++){
 const task={caseId:c.id,rotation},ps=spiralPlaces(task),target=ps[spiralTarget(task)],a=spiralAnimal(c.animal);
 check(ps.length===3&&new Set(ps.map(p=>p.id)).size===3,'three distinct locations');
 const fits=p=>a.reason==='shelter'?p.damp&&p.cover:p.nectar;
 check(ps.filter(fits).length===1&&fits(target),'one defensible depicted answer');
 check(spiralMatch(task,{place:spiralTarget(task),reason:a.reason}),'target and reason match');
 for(const p of ps){check(spiralPlaceArt(p,true).includes(p.observation),'picture text agrees with observation');check(!spiralPlaceArt(p).includes(p.observation),'uninspected close-up not exposed in alt text');}
}
for(const a of spiralAnimals)check(spiralAnimalArt(a.id).includes('role="img"'),'accessible animal portrait');
for(const [range,size,min,max] of [['small',16,2,5],['all',144,1,12]]){
 const pairs=Array.from({length:size},(_,i)=>parcelPair(range,i));check(new Set(pairs.map(p=>p.join('x'))).size===size,'all ordered pairs available '+range);check(pairs.every(p=>p.every(n=>n>=min&&n<=max)),'range bounds');
}
{
 const s=fresh(),b=structuredClone(s);spiralPage(s);spiralNotes(s);equal(s,b,'landing and notes pure');check(!hasSpiral(s),'landing not a visit');
 for(const fn of [inspectSpiral,compareSpiral,findSpiral,helpSpiralCount,carrySpiral,leaveSpiral])check(!fn(s),'no mutation before explicit start');
 check(startSpiral(s),'start default');const r=structuredClone(currentSpiral(s)),before=structuredClone(s);
 check(!startSpiral(s),'open visit cannot be overwritten');equal(s,before,'failed start atomic');
 for(const [k,v] of [['animal','butterfly'],['range','all'],['ingredient','rain-chip']])check(setSpiralOption(s,k,v),'next-only preference');
 equal(currentSpiral(s),r,'open task and work unchanged by preferences');check(!findSpiral(s)&&!carrySpiral(s),'no premature parcel');
 supportSpiral(s,'vocabulary');supportSpiral(s,'audioRequested');ready(s,true);inputSpiral(s,'not a number');const invalid=structuredClone(s);check(!submitSpiralCount(s),'invalid count rejected');equal(s,invalid,'invalid count atomic');
 inputSpiral(s,'999');submitSpiralCount(s);check(!carrySpiral(s),'wrong count alone no carry');helpSpiralCount(s);check(carrySpiral(s)&&!carrySpiral(s),'assistance then exact-once carry');
 check(startSpiral(s),'closed visit replaced explicitly');check(currentSpiral(s).task.range==='all'&&currentSpiral(s).task.ingredientId==='rain-chip'&&spiralCase(currentSpiral(s).task.caseId).animal==='butterfly','new options take effect next');
 check(s.livingExploration.history.length===1,'old closed visit archived once');
}
{
 const s=fresh(),cases=new Set(),positions=new Set(),foods=new Set();
 for(let i=0;i<72;i++){check(startSpiral(s),'renewable mixed visit');const r=currentSpiral(s);cases.add(r.task.caseId);positions.add(spiralTarget(r.task));foods.add(r.task.ingredientId);check(r.task.familiar===(i>=9),'familiar case accurately labelled');finish(s,i%2===0);}
 check(cases.size===9&&positions.size===3,'all cases and answer positions reached');check(foods.size===8,'default low-jar supply reaches all starter foods');check(s.livingExploration.history.length===24,'bounded closed history');check(spiralState(s),'long-running state remains valid');
}
for(const a of spiralAnimals){
 const s=fresh();setSpiralOption(s,'animal',a.id);const cases=new Set(),positions=new Set();
 for(let i=0;i<9;i++){startSpiral(s);const r=currentSpiral(s);check(spiralCase(r.task.caseId).animal===a.id,'manual animal respected');const html=spiralPage(s,'visit');check((html.match(/data-spiral-inspect=/g)||[]).length===3&&!/undefined|NaN/.test(html),'each case renders three real inspection cards');cases.add(r.task.caseId);positions.add(spiralTarget(r.task));finish(s);}
 check(cases.size===3,'manual route includes all three cases');check(positions.size>1,'answer not fixed in manual mode');
}
for(const range of ['small','all']){
 const s=fresh();setSpiralOption(s,'range',range);const pairs=new Set();
 for(let i=0;i<(range==='all'?144:16);i++){startSpiral(s);const r=currentSpiral(s);pairs.add(`${r.task.packs}x${r.task.bites}`);finish(s,true);}
 check(pairs.size===(range==='all'?144:16),'actual visits cover ordered pool');
}
for(const f of starterIngredients){const s=fresh();setSpiralOption(s,'ingredient',f.id);startSpiral(s);check(currentSpiral(s).task.ingredientId===f.id,'manual food available');finish(s);}
for(const helper of [false,true])for(const stock of [0,174,175,180]){
 const s=fresh();startSpiral(s);ready(s,helper);const r=currentSpiral(s),n=r.task.packs*r.task.bites;helper?helpSpiralCount(s):(inputSpiral(s,String(n)),submitSpiralCount(s));s.cafe.stock[r.task.ingredientId]=stock;const b=structuredClone(s);
 check(carrySpiral(s)===(stock+n<=180),'stock cap');if(stock+n>180){equal(s,b,'cap failure atomic');s.cafe.stock[r.task.ingredientId]=0;check(carrySpiral(s),'waiting parcel can be carried later');}check(!carrySpiral(s),'cap/retry no duplicate');
 const reload=restoreState(JSON.stringify(s));check(!carrySpiral(reload),'reload no duplicate');
}
{
 const s=fresh();startSpiral(s);const stock=structuredClone(s.cafe.stock);check(leaveSpiral(s),'explicit leave allowed before solving');check(!carrySpiral(s)&&!findSpiral(s),'left visit is not stock claim');equal(s.cafe.stock,stock,'leaving gives no supplies');startSpiral(s);check(s.livingExploration.history[0].left,'left notes kept');
}
{
 const s=fresh();nextGuest(s);startOpenTask(s,'many-rectangles');s.plantings.openDraft.model={type:'array',rows:2,cols:12,item:'cup',counted:[1]};startLiving(s);s.livingGarden.inspected=['log'];
 s.science={pending:'synthetic-water'};s.workshop={pending:'synthetic-ramp'};s.postOffice={pending:'synthetic-rival'};
 const unaffected=()=>JSON.stringify({legacy:s.livingGarden,planting:s.plantings,current:s.cafe.current,history:s.cafe.history,science:s.science,workshop:s.workshop,post:s.postOffice,broad:s.broad,baseline:s.baseline});
 const b=unaffected(),rec=recommendations(s);startSpiral(s);finish(s);equal(unaffected(),b,'legacy and unrelated work exact');equal(recommendations(s),rec,'no assessment recommendation change');check(livingVisit(s),'original snail visit still playable');
 const before=structuredClone(s);spiralPage(s,'visit');spiralNotes(s);equal(s,before,'round rendering pure');
}
{
 const s=fresh();startSpiral(s);check(!spiralPairsShown(s).length,'hidden parcel no fact exposure');ready(s);const pair=spiralPairsShown(s);equal(pair,[[currentSpiral(s).task.packs,currentSpiral(s).task.bites]],'only visible pack fact exposed');const obs=structuredClone(s.baseline);noteLegacyExposure(s,pair[0]);equal(s.baseline,obs,'shared exposure not an assessment observation');check(JSON.stringify(s.broad).includes(pair[0].join('x')),'shared fact exposure retained');
}
{
 const s=fresh();startSpiral(s);ready(s);const r=currentSpiral(s),n=r.task.packs*r.task.bites;
 const html=spiralPage(s,'visit');check(html.includes('Carry the parcel to the café'),'pre-answer carry label neutral');check(!html.includes(`Carry ${n} bites to the café`),'carry control does not reveal count');
 helpSpiralCount(s);check(spiralPage(s,'visit').includes(`Carry ${n} bites to the café`),'total shown after explanation');
}
const bad=[null,[],{}, {version:2,note:'<script>future</script>'}];
{
 const s=fresh();startSpiral(s);for(const patch of [{nextRound:-1},{offered:['unknown']},{options:{animal:'future',range:'all',ingredient:'needed'}},{current:{...s.livingExploration.current,task:{...s.livingExploration.current.task,caseId:'future'}}},{current:{...s.livingExploration.current,carried:true}},{history:[s.livingExploration.current]}])bad.push({...structuredClone(s.livingExploration),...patch});
}
for(const raw of bad){const s=fresh();s.livingExploration=raw;const b=structuredClone(s);check(!spiralState(s),'unsupported/malformed retained');check(spiralPage(s).includes('An earlier exploration is kept'),'visible recovery');for(const act of [startSpiral,inspectSpiral,findSpiral,carrySpiral,leaveSpiral])check(!act(s),'bad record cannot mutate or award');check(!setSpiralOption(s,'range','small'),'bad record not reset through preferences');equal(s,b,'raw record unchanged');check(!spiralNotes(s).includes('<script>future</script>'),'notes escape raw data');}
class Storage{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk),s=store.load();ensureCafe(s);startSpiral(s);ready(s,true);inputSpiral(s,'7');supportSpiral(s,'audioRequested');store.save(s);const id=store.active.id;
 const loaded=new ExplorerStore(disk).load();equal(loaded.livingExploration,s.livingExploration,'real explorer reload retains pending visit/input/help');
 const second=store.add({avatar:'sky',color:'blue',symbol:'shell'},s);check(!hasSpiral(second),'new explorer separate');equal(store.select(id,second).livingExploration,s.livingExploration,'switch resumes');
 store.setPersistence(false,s);check(![...disk.data.keys()].some(k=>k.startsWith(STORAGE_KEY)),'save-off clears disk');equal(store.select(id).livingExploration,s.livingExploration,'session remains');check(JSON.parse(JSON.stringify(s)).livingExploration.current.input==='7','ordinary export retains input');check(!hasSpiral(store.clearActive()),'reset clears exploration and stock together');
}
console.log(`${checks} Living Garden spiral content, coverage, supply and state checks passed.`);
