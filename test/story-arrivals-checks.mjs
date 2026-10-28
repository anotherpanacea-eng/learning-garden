// Independent249 eligibility/context oracles, actual activity fixtures, synthetic only.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES,recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
import {freshStory,storyView,storyArrivalContext,keepParcel,revealOldMap} from '../dist/keeper-story-core.mjs';
import {arrivalView,chooseStoryArrival,arrivalSkipsWelcome} from '../dist/story-arrivals-core.mjs';
import {arrivalContent as C} from '../dist/story-arrivals-content.mjs';
import * as A from '../dist/act-two-core.mjs';
import {nearSupper,hostWork,pageOne} from './act-two-checks.mjs';
import {serveCafe,nextGuest} from '../dist/cafe-core.mjs';
import {startVisit,storyDraft} from '../dist/garden-core.mjs';
import {rememberPathway} from '../dist/pathway-entry-core.mjs';
import {pathwaySubjects} from '../dist/pathway-entry-content.mjs';

const copy=structuredClone,choices=['storm','mended','letter'];
const report=s=>({title:'After the Storm: observations',exportedAt:'2026-10-27T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'blue',symbol:'leaf'},recommendation:recommendations(s),...s});
export const exportable=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
export function waitingNotebook(){
 const s=initializeExplorerState(freshState());s.story={...freshStory(),frameAmount:'longer',pageAmount:'original',letterAmount:'longer'};s.garden.welcomeFilmSeen=false;
 s.garden.start={math:'sapling',reading:3,french:1,future:{raw:'Synthetic preference sibling'}};s.garden.cafeStart='follow';
 nextGuest(s);
 assert.ok(startVisit(s,'paris',{destination:'bookstall',variant:2}));storyDraft(s).input='Synthetic waiting English reply';
 assert.ok(startVisit(s,'french',{destination:'bookstall',variant:1}));storyDraft(s).input='Synthetic waiting French reply';
 for(const subject of pathwaySubjects)assert.ok(rememberPathway(s,subject.id,subject.goals[0].id,{canExport:exportable}));
 s.syntheticOther={raw:'Synthetic future sibling retained'};s.loft={version:99,raw:'Synthetic unsupported Loft'};
 return s;
}
export function arrivalFixtures(){
 const base=waitingNotebook(),legacy=nearSupper();assert.ok(serveCafe(legacy));delete legacy.story;
 const later=copy(base);assert.ok(chooseStoryArrival(later,'letter'));assert.ok(A.openUpstreamLetter(later));
 later.syntheticOther.payload='x'.repeat(500*1024);
 const completed=hostWork(pageOne());assert.ok(A.startActTwo(completed));for(const c of ['market','garden','birthday'])assert.ok(A.offerActTwo(completed,c,A.actTwoCandidates(completed,c)[0].key));assert.ok(A.celebrateActTwo(completed,5));assert.ok(A.revealFloodLedger(completed));assert.ok(A.openUpstreamLetter(completed));
 const retained=copy(base);retained.story.acts.II={started:true,contributions:{},ended:false};
 const malformed=copy(base);malformed.story.arrival='letter';malformed.story.arrivalChosen='future';malformed.story.acts.II={started:true,contributions:{},ended:false};
 const inheritedBad=copy(base);assert.ok(chooseStoryArrival(inheritedBad,'letter'));inheritedBad.story.acts.I={ended:'future'};inheritedBad.story.acts.II={contributions:'future',ended:'future'};
 const transfer=copy(base);transfer.syntheticOther.payload='x'.repeat(500*1024);
 const unsupported=copy(base);unsupported.story={version:99,raw:'Synthetic future whole story'};
 return {base,legacy,later,completed,retained,malformed,inheritedBad,transfer,unsupported};
}

export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const pure=(s,fn)=>{const before=copy(s),out=fn();eq(s,before,'view/context is pure');return out;};
 const refuse=(s,fn,m)=>{const before=copy(s);eq(fn(),false,m);eq(s,before,'refusal leaves every root exact');};
 const withoutStory=s=>{const c=copy(s);delete c.story;return c;};
 const grant={storm:[false,false,false,false,false],mended:[true,false,true,false,false],letter:[true,true,true,true,true]};
 const fields=['inheritedActI','inheritedActII','inheritedPageOne','inheritedPageTwo','inheritedLetter'];
 // Declarative rows distinguish structural context, explicit decisions and actual progress.
 const cases=[
  {name:'missing',story:undefined,eligible:true,reason:'eligible'},
  {name:'structural',story:freshStory(),eligible:true,reason:'eligible'},
  {name:'absent arrival',story:{version:1,opening:'returning',acts:{},seenScenes:[]},eligible:true,reason:'eligible'},
  {name:'false marker',story:{...freshStory(),arrivalChosen:false},eligible:true,reason:'eligible'},
  {name:'preferences only',story:{...freshStory(),pageAmount:'original',frameAmount:'longer',letterAmount:'longer',future:{raw:'Synthetic'}},eligible:true,reason:'eligible'},
  ...['parcel-found','old-map-revealed','unknown-scene'].map(scene=>({name:scene,story:{...freshStory(),seenScenes:[scene]},eligible:false,reason:'progress'})),
  ...[{I:{ended:true}},{II:{started:true}},{future:{raw:'Synthetic'}}].map(acts=>({name:'nonempty acts',story:{...freshStory(),acts},eligible:false,reason:'progress'})),
  ...[null,'yes',{},[],0].map(arrivalChosen=>({name:'bad marker',story:{...freshStory(),arrivalChosen},eligible:false,reason:'unreadable'})),
  ...['mended','letter'].map(arrival=>({name:'missing marker later',story:{...freshStory(),arrival},eligible:false,reason:'unreadable'})),
  {name:'true without arrival',story:{version:1,opening:'fresh',acts:{},seenScenes:[],arrivalChosen:true},eligible:false,reason:'unreadable'},
  ...[null,[],false,{...freshStory(),version:99},{...freshStory(),arrival:'future'},{...freshStory(),acts:null},{...freshStory(),seenScenes:{}}].map(story=>({name:'unsupported root',story,eligible:false,reason:'unavailable'}))
 ];
 for(const row of cases){
  const s=freshState();if(row.story!==undefined)s.story=copy(row.story);
  const v=pure(s,()=>arrivalView(s));pure(s,()=>storyArrivalContext(s));pure(s,()=>storyView(s));pure(s,()=>A.actTwoView(s));eq(v.canChoose,row.eligible,row.name);eq(v.reason,row.reason,row.name);eq(fields.map(k=>v[k]),[false,false,false,false,false],row.name+' grants no implicit context');
  for(const choice of choices){const candidate=copy(s),before=copy(candidate);eq(chooseStoryArrival(candidate,choice),row.eligible,row.name+' '+choice);if(!row.eligible)eq(candidate,before);}
 }
 for(const choice of choices){
  const s=waitingNotebook(),before=copy(s),old=copy(s.story);ok(chooseStoryArrival(s,choice,{canExport:exportable}));eq(withoutStory(s),withoutStory(before),'Join commits only story');eq(s.story,{...old,arrival:choice,arrivalChosen:true});
  const v=arrivalView(s);eq(v.canChoose,false);eq(v.reason,'chosen');eq(v.choice,choice);eq(fields.map(k=>v[k]),grant[choice]);eq(arrivalSkipsWelcome(s),choice!=='storm');eq(storyView(s).parcelFound,false);eq(storyView(s).ended,false);eq(A.actTwoView(s).started,false);eq(A.actTwoView(s).ended,false);eq(A.actTwoView(s).count,0);eq(s.story.acts,{});eq(s.story.seenScenes,[]);eq(s.garden.welcomeFilmSeen,false);
  const ref=s.story,raw=copy(s);ok(chooseStoryArrival(s,choice,{canExport(){throw Error('Same choice must not preflight');}}));eq(s.story,ref);eq(s,raw);for(const other of choices.filter(x=>x!==choice))refuse(s,()=>chooseStoryArrival(s,other),'one explicit choice only');
  s.story.acts.future={raw:'Synthetic later work'};ok(chooseStoryArrival(s,choice));eq(s.story.acts.future,{raw:'Synthetic later work'});
 }
 // Eligibility never reads activity counts/correctness or presentation metadata.
 {
  const s={story:freshStory()};for(const key of ['cafe','garden','facts','learningRoutes'])Object.defineProperty(s,key,{get(){throw Error('Arrival eligibility must not inspect '+key);}});
  eq(storyArrivalContext(s).canChoose,true);eq(storyArrivalContext(s).reason,'eligible');eq(arrivalSkipsWelcome(s),false);
 }
 for(const choice of ['mended','letter']){
  const s=arrivalFixtures().legacy,prior=copy(s);eq(s.cafe.served,6);ok(chooseStoryArrival(s,choice));eq(withoutStory(s),withoutStory(prior));eq(s.story.opening,'returning');ok(!Object.hasOwn(s.story.acts,'I'));eq(storyView(s).receipt.served,6,'actual Café source remains visible');eq(storyView(s).ended,false);
  const beforeKeep=copy(s.story),identity=s.story;ok(keepParcel(s,{canExport(){throw Error('Inherited parcel no-op');}}));eq(s.story,identity);eq(s.story,beforeKeep);
  ok(revealOldMap(s));eq(s.story.seenScenes,['inherited-map-read']);eq(s.story.acts,{},'inherited read must never capture real legacy supper');eq(storyView(s).pageVisible,true);eq(storyView(s).parcelFound,false);eq(s.cafe,prior.cafe);const raw=copy(s);ok(revealOldMap(s));eq(s,raw);
 }
 {
  const s=waitingNotebook();ok(chooseStoryArrival(s,'letter'));eq(A.actTwoView(s).letterReady,true);eq(A.actTwoView(s).pageReady,true);eq(A.actTwoView(s).celebrationAvailable,true);eq(A.actTwoView(s).pageVisible,false);
  refuse(s,()=>A.addStormMark(s),'annotation still requires actual Page2 read');ok(A.openUpstreamLetter(s));eq(s.story.seenScenes,['vadoalto-letter-one-read']);eq(A.actTwoView(s).letterVisible,true);ok(A.revealFloodLedger(s));eq(s.story.seenScenes,['vadoalto-letter-one-read','inherited-ledger-read']);ok(A.addStormMark(s));ok(revealOldMap(s));eq(storyView(s).pageVisible,true);eq(s.story.acts,{});ok(!s.story.seenScenes.includes('parcel-found')&&!s.story.seenScenes.includes('town-celebrated'));
  ok(A.setActTwoFrameAmount(s,'longer'));eq(s.story.frameAmount,'longer');eq(A.actTwoView(s).season,null);
 }
 // Earned children continue; unreadable decision children neither grant nor revoke earned work.
 for(const decision of [{arrival:'letter',arrivalChosen:'bad'},{arrival:'mended'},{arrival:'storm',arrivalChosen:null}]){
  const s=pageOne();Object.assign(s.story,decision);const before=copy(s.story);ok(storyView(s).pageVisible);eq(arrivalView(s).reason,'unreadable');eq(arrivalView(s).inheritedPageOne,false);refuse(s,()=>chooseStoryArrival(s,'storm'),'raw decision cannot be repaired');eq(s.story,before);
 }
 for(const act of [{started:true,contributions:{},ended:false},{ended:true,contributions:'raw'},{ended:true,receipt:{raw:'Synthetic earlier receipt'}}]){
  const s=waitingNotebook();s.story.acts.II=copy(act);s.story.acts.I={ended:'bad'};delete s.cafe;eq(A.actTwoView(s).started,true);if(act.ended===true)ok(A.actTwoView(s).pageReady);eq(s.story.acts.II,act);
 }
 for(const raw of [null,[],{contributions:'raw',ended:'bad'},{started:null,ended:null}]){
  const s=waitingNotebook();ok(chooseStoryArrival(s,'letter'));s.story.acts.I={ended:'bad'};s.story.acts.II=copy(raw);const prior=copy(s.story.acts);ok(storyView(s).pageReady);ok(A.actTwoView(s).pageReady);ok(A.actTwoView(s).letterReady);ok(A.openUpstreamLetter(s));ok(A.revealFloodLedger(s));ok(revealOldMap(s));eq(s.story.acts,prior,'inherited grant preserves malformed children');
 }
 // Voluntary real work after contextual arrival keeps normal first receipts and read IDs.
 {
  const s=initializeExplorerState(freshState());s.story=freshStory();ok(chooseStoryArrival(s,'letter'));ok(revealOldMap(s));hostWork(s);ok(A.startActTwo(s));for(const chapter of ['market','garden','birthday']){const c=A.actTwoCandidates(s,chapter)[0];ok(A.offerActTwo(s,chapter,c.key));}const offers=copy(s.story.acts.II.contributions);ok(A.celebrateActTwo(s,6));ok(A.revealFloodLedger(s));eq(s.story.acts.II.contributions,offers);ok(s.story.seenScenes.includes('inherited-ledger-read'));ok(!s.story.seenScenes.includes('flood-ledger-revealed'));ok(arrivalView(s).inheritedActII);eq(s.story.arrival,'letter');
 }
 // Unknown owned data is preserved; failures are atomic; report boundary isolated.
 {
  const s=waitingNotebook();s.story.future={raw:'Synthetic root'};s.story.frameAmount={future:'Synthetic preference'};const prior=copy(s);refuse(s,()=>chooseStoryArrival(s,'letter',{canExport:()=>false}),'actual export preflight refusal');ok(chooseStoryArrival(s,'letter'));eq(s.story.future,prior.story.future);eq(s.story.frameAmount,prior.story.frameAmount);
  const limited=waitingNotebook();limited.syntheticPadding='';const proposed=copy(limited);ok(chooseStoryArrival(proposed,'letter'));const rawSize=Buffer.byteLength(JSON.stringify(proposed,null,2));limited.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES-rawSize-32);const raw=copy(limited);ok(chooseStoryArrival(raw,'letter'));ok(recoveryFitsProgressLimits(raw));eq(exportable(raw),false);refuse(limited,()=>chooseStoryArrival(limited,'letter',{canExport:exportable}),'actual pretty report alone refuses');
  const huge=waitingNotebook();huge.syntheticPadding='x'.repeat(MAX_IMPORT_BYTES);refuse(huge,()=>chooseStoryArrival(huge,'letter'),'raw full-notebook capacity');
 }
 eq(C.choices.map(x=>x.id),choices);eq(C.label,'Story · Willowbank is an invented town');const words=JSON.stringify(C);ok(!words.includes('Hollis')&&!words.includes('Bonjour')&&!words.includes('¡'));ok(!words.includes('get worse'));ok(C.choices.find(x=>x.id==='letter').longer.join(' ').includes('Years without an entry are not measured zero'));
 console.log(`Story arrivals: ${n} independent eligibility, context, real-source and atomic preservation checks passed.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runChecks();
