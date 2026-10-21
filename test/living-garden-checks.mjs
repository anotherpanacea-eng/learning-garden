import assert from 'node:assert/strict';
import {freshState,recommendations,STORAGE_KEY,restoreState} from '../dist/core.mjs';
import {ensureBroad} from '../dist/broad-core.mjs';
import {ensureCafe,nextGuest} from '../dist/cafe-core.mjs';
import {ensurePlantings,startOpenTask} from '../dist/plantings.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {habitatPlaces,habitatReasons,habitatParcel} from '../dist/living-content.mjs';
import {livingPage,livingNotes,habitatArt} from '../dist/living-ui.mjs';
import {livingVisit,hasLivingRecord,searchReady,startLiving,selectLivingPlace,inspectLiving,chooseLiving,compareLiving,helpLiving,audioLiving,findLivingParcel,carryLivingParcel} from '../dist/living-core.mjs';
import {learningInvitations,learningExplore} from '../dist/learning-invitations.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};const equal=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const fresh=()=>{const s=freshState();ensureBroad(s);ensureCafe(s);ensurePlantings(s);return s;};
const inspect=(s,id)=>{check(selectLivingPlace(s,id),'select '+id);check(inspectLiving(s),'inspect '+id);};
const compare=(s,place,reason)=>{check(chooseLiving(s,'answerPlace',place),'choose place');check(chooseLiving(s,'answerReason',reason),'choose reason');check(compareLiving(s),'compare');};
const ready=(s,help=false)=>{startLiving(s);inspect(s,'log');inspect(s,'sunny');if(help)helpLiving(s);else compare(s,'log','shelter');};
{
 const s=fresh(),before=structuredClone(s);check(!hasLivingRecord(s),'no implicit visit');check(livingPage(s).includes('data-living-start'),'explicit start');equal(s,before,'opening render pure');
 for(const fn of [inspectLiving,compareLiving,helpLiving,audioLiving,findLivingParcel,carryLivingParcel])check(!fn(s),'no mutation before start');
 check(startLiving(s)&&!startLiving(s),'start once');const visit=structuredClone(s.livingGarden);livingPage(s);equal(s.livingGarden,visit,'started render pure');
 check(!findLivingParcel(s)&&!carryLivingParcel(s),'no unearned parcel');
 for(const p of habitatPlaces){inspect(s,p.id);const n=s.livingGarden.inspected.length;inspectLiving(s);check(s.livingGarden.inspected.length===n,'inspection idempotent');check(livingPage(s).includes(p.observation),'text equivalent for each observation');check(habitatArt(p.id,true).includes('role="img"'),'accessible illustration');}
 check(!findLivingParcel(s),'inspection alone not story resolution');
}
for(const p of habitatPlaces)for(const r of habitatReasons){
 const s=fresh();startLiving(s);inspect(s,'log');inspect(s,'pond');compare(s,p.id,r.id);
 check(searchReady(livingVisit(s))===(p.id==='log'&&r.id==='shelter'),'only matched place and reason resolve');
 check(!carryLivingParcel(s),'must explicitly find before carrying');
 helpLiving(s);check(searchReady(livingVisit(s)),'help keeps route open after any idea');
 check(findLivingParcel(s)&&!findLivingParcel(s),'find once');const before=s.cafe.stock['moon-crunch'];
 check(carryLivingParcel(s)&&!carryLivingParcel(s),'carry once');check(s.cafe.stock['moon-crunch']===before+12,'exact parcel count');
 const restored=restoreState(JSON.stringify(s));check(!carryLivingParcel(restored),'reload cannot duplicate supply');
 check(!startLiving(restored),'reread does not reset collection');
}
{
 const s=fresh();startLiving(s);helpLiving(s);check(!findLivingParcel(s),'explanation does not inspect places');inspect(s,'log');check(!findLivingParcel(s),'contrast still needed');inspect(s,'pond');check(findLivingParcel(s),'help plus comparison search locates parcel');
 check(livingNotes(s).includes('Explanation help: yes'),'help recorded separately');audioLiving(s);check(livingNotes(s).includes('Audio requested during visit: yes'),'audio requested only, no playback claim');
}
for(const stock of [0,168,169,179,180]){
 const s=fresh();s.cafe.stock['moon-crunch']=stock;ready(s);findLivingParcel(s);const before=structuredClone(s);
 check(carryLivingParcel(s)===(stock<=168),'180 cap');
 if(stock>168){equal(s,before,'cap failure leaves every record and stock untouched');s.cafe.stock['moon-crunch']=160;check(carryLivingParcel(s),'found parcel waits until jar has room');check(s.cafe.stock['moon-crunch']===172,'cap retry delivers once');}
 else check(s.cafe.stock['moon-crunch']===stock+12,'boundary stock exact');
}
{
 const s=fresh();nextGuest(s);startOpenTask(s,'many-rectangles');s.plantings.openDraft.model={type:'array',rows:2,cols:12,item:'cup',counted:[0]};
 s.science={pending:'synthetic-water'};s.workshop={pending:'synthetic-cart'};s.postOffice={pending:'synthetic-rival'};
 const unrelated=()=>JSON.stringify({current:s.cafe.current,history:s.cafe.history,plantings:s.plantings,science:s.science,workshop:s.workshop,post:s.postOffice,broad:s.broad,baseline:s.baseline});
 const before=unrelated(),rec=recommendations(s),stock=structuredClone(s.cafe.stock);ready(s);findLivingParcel(s);carryLivingParcel(s);
 equal(unrelated(),before,'waiting guest, plan, other visits and learning evidence unchanged');equal(recommendations(s),rec,'no math recommendation change');
 for(const [id,n] of Object.entries(stock))check(s.cafe.stock[id]===n+(id==='moon-crunch'?12:0),'only named inventory changes');
 for(let i=0;i<30;i++)compare(s,'pond','underwater');check(livingVisit(s)?.found&&livingVisit(s).carried,'old matched choice survives bounded recent history');check(s.livingGarden.attempts.length===24,'history bounded');
 const b=structuredClone(s);livingPage(s);livingNotes(s);equal(s,b,'completed views pure');
}
const malformed=[null,{},[],{version:2,note:'<script>future</script>'},{version:1,revision:'future-snail'}];
{
 const s=fresh();ready(s);const base=structuredClone(s.livingGarden);
 for(const patch of [{inspected:['bad']},{inspected:['log','log']},{attempts:[{place:'log',reason:'bad',afterHelp:false}]},{matched:'yes'},{found:true,inspected:[]},{carried:true,found:false},{answerReason:'bad'},{place:'missing'}])malformed.push({...base,...patch});
}
for(const raw of malformed){
 const s=fresh();s.livingGarden=raw;const before=structuredClone(s);check(!livingVisit(s),'invalid/future record not interpreted');
 check(livingPage(s).includes('An earlier investigation is kept'),'visible recovery');
 check(!startLiving(s)&&!helpLiving(s)&&!inspectLiving(s)&&!carryLivingParcel(s),'invalid records cannot reset or issue stock');
 equal(s,before,'raw malformed record exactly preserved');check(!livingNotes(s).includes('<script>future</script>'),'recovery notes escape saved strings');
}
{
 const s=fresh();ready(s);const b=structuredClone(s);check(!selectLivingPlace(s,'bad')&&!chooseLiving(s,'unexpected','log')&&!chooseLiving(s,'answerReason','bad'),'invalid actions rejected');equal(s,b,'invalid actions unchanged');
}
class Storage{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk),s=store.load();ensureCafe(s);ready(s,true);findLivingParcel(s);carryLivingParcel(s);store.save(s);
 const id=store.active.id,reloaded=new ExplorerStore(disk).load();equal(reloaded.livingGarden,s.livingGarden,'actual explorer reload retains visit');check(!carryLivingParcel(reloaded),'actual explorer reload cannot supply twice');
 const second=store.add({avatar:'sky',color:'blue',symbol:'shell'},s);check(!hasLivingRecord(second),'second explorer separate');equal(store.select(id,second).livingGarden,s.livingGarden,'switching retains first visit');
 check(JSON.parse(JSON.stringify(s)).livingGarden.carried,'normal notes JSON includes parcel record');
 store.setPersistence(false,s);check(![...disk.data.keys()].some(k=>k.startsWith(STORAGE_KEY)),'saving off removes persistent visit');equal(store.select(id).livingGarden,s.livingGarden,'saving off keeps session work');
 check(!hasLivingRecord(store.clearActive()),'reset clears active visit with its inventory');
}
for(const context of ['numbers','water','cafe','orchard'])check(learningInvitations(context).includes('href="#living"'),'entry from '+context);
for(const href of ['#numbers','#science','#cafe'])check(learningInvitations('living').includes(`href="${href}"`),'return link '+href);
check(learningExplore(null).includes('href="#living"'),'directory exposes actual destination');
check(habitatParcel.packs*habitatParcel.bites===habitatParcel.total,'parcel picture and inventory agree');
console.log(`${checks} Living Garden habitat, supply, recovery and explorer checks passed.`);
