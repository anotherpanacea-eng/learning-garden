import {notePendingBrambleFactExposure} from '../dist/post-rival.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {nextGuest,adjustBite} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {drawLetter} from '../dist/letter-trail-core.mjs';
import {SHARING_CASES} from '../dist/sharing-counter-content.mjs';
import {sharingState,sharingView,chooseSharingCase,setSharingPage,toggleSharingCut,toggleSharingPiece,setSharingPartition,shareSharingRound,toggleSharingGroup,moveSharingBun,requestSharingSupport,stepSharingExample,checkSharing,keepSharing,recoverSharing,sharingDisplayedFactPairs} from '../dist/sharing-counter-core.mjs';
import {sharingCounterPage,sharingCounterNotes,sharingCounterEntry,bindSharingCounter} from '../dist/sharing-counter-ui.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {noteLegacyExposure} from '../dist/broad-core.mjs';
import {noteGardenFactExposure} from '../dist/garden-core.mjs';
import {checkin} from '../dist/content.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const fresh=()=>initializeExplorerState(freshState());
{
 const s=fresh();chooseSharingCase(s,'quarter-basket');shareSharingRound(s);keepSharing(s);chooseSharingCase(s,'half-parcel');checkSharing(s);keepSharing(s);s.sharingCounter.cases['half-parcel'].message='';setSharingPage(s,'keep');
 const sourceAt=w=>[w.source,w.checks[0].source,w.kept.source,w.kept.latestCheck.source];
 // Mutate the persisted JSON shape, including the kept request actually rendered on this page.
 for(const index of [2,0,1,3])for(const field of ['request','title','reader','reason']){
  const payload=JSON.parse(JSON.stringify(s));sourceAt(payload.sharingCounter.cases['half-parcel'])[index][field]={toString:null};const loaded=JSON.parse(JSON.stringify(payload)),raw=JSON.stringify(loaded);
  assert.doesNotThrow(()=>sharingCounterPage(loaded),`malformed ${field} in source ${index} must render recovery`);checks++;
  eq(sharingState(loaded),null,'non-string source text is unavailable');ok(sharingCounterPage(loaded).includes('earlier picnic draft'),'malformed text reaches recovery screen');eq(JSON.stringify(loaded),raw,'render leaves malformed JSON intact');
  ok(recoverSharing(loaded),'explicit text recovery succeeds');eq(loaded.sharingCounter.cases,{'quarter-basket':s.sharingCounter.cases['quarter-basket']},'only unreadable case is removed');eq(loaded.sharingCounter.recovered,JSON.parse(raw).sharingCounter,'original malformed text retained');
  ok(sharingCounterPage(loaded).includes('Who shall we pack for?'),'recovered chooser opens');chooseSharingCase(loaded,'quarter-basket');ok(sharingCounterPage(loaded).includes('1, 1, 1, 1'),'other saved arrangement still renders');
 }
 for(const source of sourceAt(s.sharingCounter.cases['half-parcel']))for(const field of ['title','reader','reason','request'])source[field]=`Earlier ${field} <wording>`;
 const historical=JSON.parse(JSON.stringify(s)),raw=JSON.stringify(historical);ok(sharingState(historical),'historical source strings remain valid');ok(sharingCounterPage(historical).includes('Earlier request &lt;wording&gt;'),'kept request renders its own escaped historical wording');eq(JSON.stringify(historical),raw,'historical rendering preserves the save');
}
for(const c of SHARING_CASES){const s=fresh();chooseSharingCase(s,c.id);for(const page of ['make','compare','keep']){setSharingPage(s,page);const raw=JSON.stringify(s),html=sharingCounterPage(s);ok(html.includes(c.request)&&html.includes('whole'),'request and whole stay available');eq(JSON.stringify(s),raw,'rendering creates no answers/support');const imported=prepareProgressImport(raw);ok(imported.ok,'all case/page drafts import');eq(imported.state.sharingCounter,s.sharingCounter,'source, arrangement and page exact');}keepSharing(s);const raw=JSON.stringify(s);ok(sharingCounterPage(s).includes('Your kept draft'),'unfinished draft is keepable');eq(prepareProgressImport(raw).state.sharingCounter,s.sharingCounter,'kept unfinished arrangement transfers');}
{
 const s=fresh();nextGuest(s);adjustBite(s,ingredients[0].id,1);startPostOffice(s,deliveries[0].id);startShow(s,'welcome');setSceneDialogue(s,'A fictional picnic show.');drawLetter(s,'post');const before=structuredClone(s);delete before.sharingCounter;
 for(const c of SHARING_CASES){chooseSharingCase(s,c.id);if(c.kind==='basket'){for(let i=0;i<3;i++)shareSharingRound(s);toggleSharingGroup(s,0);}else if(c.family==='repair'){toggleSharingPiece(s,0);toggleSharingCut(s,6);}else{setSharingPartition(s,4);toggleSharingPiece(s,0);toggleSharingPiece(s,2);}checkSharing(s);keepSharing(s);requestSharingSupport(s,'audio');setSharingPage(s,'keep');sharingCounterPage(s);}
 const after=structuredClone(s);delete after.sharingCounter;eq(after,before,'real guest/plate/stock, parcel, letters and authored show unchanged');const imported=prepareProgressImport(JSON.stringify(s));const other=structuredClone(imported.state);delete other.sharingCounter;eq(other,before,'transfer retains unrelated work');
}
{
 const s=fresh();chooseSharingCase(s,'half-parcel');setSharingPartition(s,4);toggleSharingPiece(s,0);toggleSharingPiece(s,2);setSharingPage(s,'compare');const html=sharingCounterPage(s);ok(html.includes('width="160"')&&html.includes('M200 40l-7 12h14Z'),'disjoint quarters accumulate to half on fixed 0–1 line');ok(html.includes('2 of 4 equal shares')&&html.includes('2/4'),'group fraction notation stays with the same whole');requestSharingSupport(s,'equivalence');stepSharingExample(s,1);stepSharingExample(s,1);ok(sharingCounterPage(s).includes('1/2 = 2/4'),'explicit same-whole demonstration is available');ok(sharingView(s).model.selected.join(',')==='0,2','demonstration does not replace actual selection');
}
for(const payload of [null,[],4,{version:99,earlier:'<img src=x onerror="fictional()">'}]){const s=fresh();s.sharingCounter=payload;const raw=JSON.stringify(s);ok(!sharingState(s),'unknown destination unavailable');ok(sharingCounterPage(s).includes('earlier picnic draft'),'safe recovery view');ok(!sharingCounterNotes(s).includes('<img src=x')&&!destinationNotes(s).includes('<img src=x'),'unsupported notes escaped');eq(JSON.stringify(s),raw,'unknown display read-only');const imported=prepareProgressImport(raw);ok(imported.ok,'future root imports for recovery');eq(imported.state.sharingCounter,payload,'raw unknown root exact');recoverSharing(s);eq(s.sharingCounter.recovered,payload,'recovery retains original');}
for(const missingCheck of [true,false]){const s=fresh();chooseSharingCase(s,'half-parcel');toggleSharingPiece(s,0);checkSharing(s);const w=s.sharingCounter.cases['half-parcel'];if(missingCheck)w.checks=[];else w.model.selected=[];const raw=JSON.stringify(s);ok(!sharingState(s),'missing/stale checked model unavailable');ok(sharingCounterPage(s).includes('earlier picnic draft'),'bad checked message cannot crash renderer or claim fit');const imported=prepareProgressImport(raw);ok(imported.ok,'malformed semantic root retained on import');eq(imported.state.sharingCounter,JSON.parse(raw).sharingCounter,'malformed checked payload exact');}
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk);let s=initializeExplorerState(store.load());const id=store.active.id;chooseSharingCase(s,'quarter-basket');shareSharingRound(s);store.save(s);eq(new ExplorerStore(disk).load().sharingCounter,s.sharingCounter,'partial grouping reloads exact');const other=store.add({},s);ok(!other.sharingCounter,'new explorer starts separately');s=store.select(id,other);eq(sharingView(s).model.groups,[1,1,1,1],'switch returns partial arrangement');store.setPersistence(false,s);store.save(s);eq(store.load().sharingCounter,s.sharingCounter,'save-off session stays playable');ok(!new ExplorerStore(disk).load().sharingCounter,'save-off leaves no persisted counter');ok(!store.clearActive().sharingCounter,'reset clears counter for this explorer');
}
{
 const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),source=app.slice(app.indexOf('function exposeStoryFacts('),app.indexOf('function requestParis(')),s=fresh(),q=checkin.find(q=>q.a===4&&q.b===3);s.baseline.draft={questionId:q.id,attempts:[],exposed:false};const context=vm.createContext({state:s,noteLegacyExposure,noteGardenFactExposure,notePendingBrambleFactExposure,checkin});vm.runInContext(source,context);chooseSharingCase(s,'quarter-basket');context.shown=sharingDisplayedFactPairs(s);vm.runInContext('exposeStoryFacts({facts:shown})',context);ok(!s.baseline.draft.exposed,'empty/unequal mats do not display four groups of three');for(let n=0;n<3;n++)shareSharingRound(s);context.shown=sharingDisplayedFactPairs(s);vm.runInContext('exposeStoryFacts({facts:shown})',context);ok(s.baseline.draft.exposed&&s.exposures.includes('4x3'),'actual grouping exposes waiting original fact');eq(s.baseline.observations.length,0,'viewing creates no multiplication answer');requestSharingSupport(s,'workedExample');context.shown=sharingDisplayedFactPairs(s);eq(context.shown,[[4,3]],'unopened grouping in different example is not exposed');stepSharingExample(s,1);context.shown=sharingDisplayedFactPairs(s);vm.runInContext('exposeStoryFacts({facts:shown})',context);ok(s.exposures.includes('2x4'),'visible worked example contributes separate relationship');
 const ending=app.slice(app.indexOf('function endingFilm(){'),app.indexOf("if(!choosingExplorer)playFilm('welcome');"));let calls=0;const endContext=vm.createContext({state:s,choosingExplorer:false,location:{hash:'#cafe/sharing'},cafeSupper(){calls++;return {complete:true,round:1};}});vm.runInContext(ending,endContext);eq(vm.runInContext('endingFilm()',endContext),null,'sharing does not trigger ordinary supper ending film');eq(calls,0,'counter does not inspect/advance supper ending');
}
{
 const s=fresh();chooseSharingCase(s,'quarter-basket');const put={dataset:{scBun:'0:in'}},round={addEventListener(_,fn){this.click=fn;}},previous=globalThis.document;let focused='';globalThis.document={querySelectorAll(sel){return sel==='[data-sc-bun]'?[put]:[];},querySelector(sel){return sel==='[data-sc-round]'?round:null;}};try{bindSharingCounter(s,{save(){},render(){},focus(s){focused=s;}});put.onclick();eq(focused,'[data-sc-bun="0:in"]','repeated bun move keeps same control focus');round.click();eq(focused,'[data-sc-round]','round-share retains focus while enabled');round.click();round.click();eq(focused,'#sc-basket-status','exhausted round-share uses local model status');}finally{globalThis.document=previous;}
}
ok(sharingCounterEntry().includes('#cafe/sharing'),'café entry reaches new counter');
console.log(`Sharing Counter UI/storage integration: ${checks} passed.`);
