// Independent spec248 oracles; synthetic notebooks and actual source-owner APIs only.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {freshStory,keepParcel,revealOldMap,setPageAmount} from '../dist/keeper-story-core.mjs';
import * as A from '../dist/act-two-core.mjs';
import {actTwoContent as C} from '../dist/act-two-content.mjs';
import * as Cafe from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import * as Coins from '../dist/coin-counter-core.mjs';
import * as Records from '../dist/town-record-core.mjs';
import * as Batches from '../dist/whole-batches-core.mjs';
import * as Loft from '../dist/loft-core.mjs';
import {recoveryFitsProgressLimits,MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';

const clone=structuredClone,chapters=['market','garden','birthday','show'];
const hosts=['coinCounter','townRecord','wholeBatches','loft'];
const report=s=>({title:'After the Storm: observations',exportedAt:'2026-10-27T12:00:00.000Z',note:'Synthetic independent test report.',explorer:{avatar:'pip',color:'blue',symbol:'leaf'},recommendation:{reason:'Synthetic report envelope'},...s});
export const canExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
function preparePlate(s){
 Cafe.nextGuest(s);const o=Cafe.orderFor(s.cafe),food=ingredients.find(i=>!i.orchard&&o.wanted.every(p=>i.properties.includes(p)));
 for(let i=0;i<o.bites;i++)Cafe.adjustBite(s,food.id,1);
 assert.ok(Cafe.checkPlate(s)&&Cafe.skipCafeStage(s)&&Cafe.skipCafeStage(s));
 for(const x of Cafe.currentRecipe(s.cafe))s.cafe.stock[x.ingredient.id]=x.required;
}
export function nearSupper(){
 const s=initializeExplorerState(freshState());s.garden.welcomeFilmSeen=true;s.story=freshStory();s.cafe.seed=192;s.cafe.range='small';
 for(let i=0;i<5;i++){preparePlate(s);assert.ok(Cafe.serveCafe(s));}preparePlate(s);return s;
}
export function pageOne(){const s=nearSupper();assert.ok(Cafe.serveCafe(s));assert.ok(keepParcel(s));assert.ok(revealOldMap(s));return s;}
export function hostWork(s){
 const round=Coins.startCoinRound(s,'ribbon');assert.ok(round); // Deliberately zero/unmatched mats, without a check.
 const visit=Records.startRecord(s,'rise');assert.ok(visit);assert.ok(Records.keepRecord(s)); // Blank, unfinished plan.
 assert.ok(Batches.chooseBatchCase(s,'rehearsal-table'));assert.ok(Batches.keepBatch(s));
 assert.ok(Batches.makeBatchTogether(s));assert.ok(Batches.offerBatch(s));
 assert.ok(Loft.startShow(s,'welcome'));assert.ok(Loft.performShow(s));assert.ok(Loft.stepShow(s,1));assert.ok(Loft.stepShow(s,1));assert.ok(Loft.meetAudience(s));
 return s;
}
export function makeFixtures(){
 const near=nearSupper(),ready=pageOne();ready.garden.filmsSeen={...ready.garden.filmsSeen,cafe:true};const work=hostWork(clone(ready));
 const partial=clone(work);assert.ok(A.startActTwo(partial));assert.ok(A.offerActTwo(partial,'garden',A.actTwoCandidates(partial,'garden')[0].key));
 partial.syntheticUnrelated={description:'Synthetic retained sibling, not learner data',payload:'x'.repeat(500*1024)};
 // A waiting, unshared show and an edited draft beside the independently kept plan.
 assert.ok(Loft.startShow(partial,'delivery'));assert.ok(Batches.setBatchCopies(partial,0));
 const noWork=clone(ready);const future=clone(ready);future.story.acts.II={started:true,ended:true,contributions:{},season:'future-season'};
 const unreadable=clone(work);unreadable.story.acts.II={started:true,ended:'future',contributions:{market:{kind:'future'}},season:{raw:'Synthetic future'}};
 return {near,ready,work,partial,noWork,future,unreadable};
}

export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const pure=(s,fn,m)=>{const before=clone(s),result=fn();eq(s,before,m||'read is pure');return result;};
 const unchanged=(s,fn,m)=>{const b=clone(s);eq(fn(),false,m);eq(s,b,'refusal atomic: '+m);};
 const start=()=>{const s=hostWork(pageOne());ok(A.startActTwo(s));return s;};
 const offer=(s,c)=>{const x=A.actTwoCandidates(s,c)[0];ok(x,'actual host yields candidate '+c);ok(A.offerActTwo(s,c,x.key));return x;};
 const full=()=>{const s=start();chapters.forEach(c=>offer(s,c));return s;};
 eq(A.actTwoChapters,chapters);
 // Receipt validation examines its own frozen address, never contemporary host work.
 {
  const receipts={market:{roundId:19,request:'synthetic-retired'},garden:{visitId:'synthetic-visit',edition:'latest',sourceId:'synthetic-source'},birthday:{caseId:'synthetic-case',edition:'offered',sourceId:'synthetic-case'},show:{edition:'shelf',showId:29}};
  const activities=['coin-counter','town-record','whole-batches','story-loft'],kinds=['coin-idea','record-plan','tray-idea','shared-show'];
  chapters.forEach((chapter,i)=>{const r={kind:'act-two-offer',version:1,chapter,activity:activities[i],artifactKind:kinds[i],ref:receipts[chapter]};ok(A.validActTwoOffer(r,chapter));for(const [k,v] of [['kind','future'],['version',2],['chapter','future'],['activity',activities[(i+1)%4]],['artifactKind',kinds[(i+1)%4]],['ref',null]])eq(A.validActTwoOffer({...r,[k]:v},chapter),false);eq(A.validActTwoOffer(r,chapters[(i+1)%4]),false);});
 }
 for(const s of [freshState(),pageOne(),hostWork(pageOne()),{story:{version:99}},{story:null}]){
  pure(s,()=>A.actTwoView(s));for(const c of chapters)pure(s,()=>A.actTwoCandidates(s,c));
 }
 const monthSeasons=['winter','winter','spring','spring','spring','summer','summer','summer','autumn','autumn','autumn','winter'];
 monthSeasons.forEach((season,m)=>eq(A.seasonForMonth(m),season));for(const m of [-1,12,.5,NaN,null,'2',undefined])eq(A.seasonForMonth(m),null);
 for(const value of [null,[],false,'raw',{version:99},{version:1,acts:null,seenScenes:[],opening:'fresh'}]){
  const s=hostWork(pageOne());s.story=clone(value);for(const f of [A.startActTwo,A.revealFloodLedger,A.openUpstreamLetter,A.addStormMark,x=>A.celebrateActTwo(x,0)])unchanged(s,()=>f(s),'unsupported story root');
 }
 // No action, film flag, correctness, current task or raw scene code substitutes for explicit offers.
 {
  const s=hostWork(pageOne());s.garden.filmsSeen={cafe:true,actTwo:true};s.story.seenScenes.push('town-celebrated','flood-ledger-revealed','vadoalto-letter-one-read');
  const v=A.actTwoView(s);eq(v.count,0);eq(v.ended,false);eq(v.pageReady,false);eq(v.letterReady,false);unchanged(s,()=>A.celebrateActTwo(s,3),'cannot celebrate before starting');
  ok(A.startActTwo(s));eq(A.actTwoView(s).count,0);unchanged(s,()=>A.revealFloodLedger(s),'scenes cannot create ending');
 }
 // Actual host API positives with independent expected identities and no body/result copies.
 {
  const s=start(),r=s.coinCounter.rounds[0],visit=Object.keys(s.townRecord.visits)[0],source=s.townRecord.visits[visit].kept.source.id;
  eq(r.a,{penny:0,nickel:0,dime:0,quarter:0});eq(r.checks,[]);eq(s.loft.draft.changes,0);
  const expected={market:[{roundId:r.id,request:'ribbon'}],garden:[{visitId:visit,edition:'first',sourceId:source},{visitId:visit,edition:'latest',sourceId:source}],birthday:[{caseId:'rehearsal-table',edition:'kept',sourceId:'rehearsal-table'},{caseId:'rehearsal-table',edition:'offered',sourceId:'rehearsal-table'}],show:[{edition:'draft',showId:1},{edition:'shelf',showId:1}]};
  for(const c of chapters){const xs=pure(s,()=>A.actTwoCandidates(s,c));eq(xs.map(x=>x.ref),expected[c],c+' exact artifact identities');ok(xs.every(x=>x.chapter===c&&typeof x.key==='string'));const old=clone(s),x=offer(s,c);eq(hosts.map(h=>s[h]),hosts.map(h=>old[h]),'story offer never edits source');const receipt=s.story.acts.II.contributions[c];eq(Object.keys(receipt).sort(),['activity','artifactKind','chapter','kind','ref','version']);eq(receipt.ref,x.ref);ok(A.validActTwoOffer(receipt,c));}
  eq(A.actTwoView(s).count,4);ok(!JSON.stringify(s.story).includes('renderedParts'));ok(!JSON.stringify(s.story).includes('assessment'));
  const kept=clone(s.story.acts.II.contributions);for(const h of hosts)delete s[h];for(const c of chapters)ok(A.offerActTwo(s,c,'no-longer-present',{canExport(){throw Error('No-op must not preflight');}}));eq(s.story.acts.II.contributions,kept);
 }
 // Every subset: exactly the four 3-of-4 combinations and the full set qualify.
 for(let mask=0;mask<16;mask++){
  const s=start();for(let i=0;i<4;i++)if(mask&(1<<i))offer(s,chapters[i]);const count=chapters.filter((_,i)=>mask&(1<<i)).length;
  eq(A.actTwoView(s).count,count);eq(A.actTwoView(s).canCelebrate,count>=3);const before=clone(s);eq(A.celebrateActTwo(s,9),count>=3);if(count<3)eq(s,before);else{eq(s.story.acts.II.season,'autumn');ok(s.story.seenScenes.includes('town-celebrated'));}
 }
 // Reader shapes are deliberately wider than current host catalogs/current correct work.
 {
  const s=start();s.coinCounter.rounds[0].request='synthetic-retired-request';s.coinCounter.rounds[0].a={};s.coinCounter.rounds[0].b={quarter:25};s.coinCounter.rounds[0].checks='opaque';s.coinCounter.rounds[0].support='opaque';eq(A.actTwoCandidates(s,'market').length,1,'no 50-cent sum/correctness gate');
  s.loft.draft.invitation='synthetic-retired-invitation';s.loft.draft.frames[0]={actor:'synthetic-actor',place:'synthetic-place',action:'synthetic-action',prop:'synthetic-prop'};s.loft.draft.mode='future';s.loft.draft.heard=false;eq(A.actTwoCandidates(s,'show').length,2,'source identity not catalog recognition');
  const w=s.wholeBatches.cases['rehearsal-table'];w.kept.assessment={ready:false,opaque:'not recomputed'};w.kept.source.destination='synthetic-retired-place';w.kept.source.unit='synthetic-unit';w.kept.input.message.destination='synthetic-retired-place';w.kept.input.message.cloudUnit='synthetic-unit';eq(A.actTwoCandidates(s,'birthday').length,2);
  const v=s.townRecord.visits[s.townRecord.current];v.source=null;v.runs='broken draft';eq(A.actTwoCandidates(s,'garden').length,2,'kept snapshots independent of malformed current draft');
 }
 // Ambiguous positive IDs are all omitted, even when one duplicate is otherwise malformed.
 {
  const s=start(),coin=clone(s.coinCounter.rounds[0]);s.coinCounter.rounds=[coin,{id:coin.id}, {...clone(coin),id:17}];const raw=clone(s.coinCounter);eq(A.actTwoCandidates(s,'market').map(x=>x.ref.roundId),[17]);eq(s.coinCounter,raw);
  const show=clone(s.loft.shelf[0]);s.loft.shelf=[show,{id:show.id}, {...clone(show),id:19}];eq(A.actTwoCandidates(s,'show').map(x=>x.ref),[{edition:'draft',showId:1},{edition:'shelf',showId:19}]);
 }
 // Structural defects exclude only their artifact/edition. Accepted receipts survive turnover.
 for(const chapter of chapters){
  const s=start(),h=hosts[chapters.indexOf(chapter)],saved=clone(s[h]);s[h].version=99;eq(A.actTwoCandidates(s,chapter),[]);eq(A.actTwoView(s).sources[chapter].status,'unavailable');s[h]=saved;
  const x=offer(s,chapter),receipt=clone(s.story.acts.II.contributions[chapter]);s[h]={version:99,raw:'synthetic retained host'};eq(A.actTwoView(s).count,1);ok(A.offerActTwo(s,chapter,x.key));eq(s.story.acts.II.contributions[chapter],receipt);
 }
 {
  const s=start(),w=s.townRecord.visits[s.townRecord.current];w.kept={raw:'Synthetic unreadable latest'};eq(A.actTwoCandidates(s,'garden').map(x=>x.ref.edition),['first']);ok(A.actTwoView(s).sources.garden.retainedUnreadable);w.firstKept={raw:'Synthetic unreadable first'};eq(A.actTwoCandidates(s,'garden'),[]);
  const b=s.wholeBatches.cases['rehearsal-table'];b.kept.support={visual:'yes'};eq(A.actTwoCandidates(s,'birthday').map(x=>x.ref.edition),['offered']);b.offered.practice=false;eq(A.actTwoCandidates(s,'birthday'),[]);
  s.loft.shelf=[];s.loft.draft.shared=false;eq(A.actTwoCandidates(s,'show'),[]);
 }
 {
  const s=start();s.loft.version=1;s.loft.draft.frames=s.loft.draft.frames.map(({dialogue,...f})=>f);s.loft.shelf=[];eq(A.actTwoCandidates(s,'show').map(x=>x.ref),[{edition:'draft',showId:1}],'original v1 three-frame show remains recognizable');
  const r=s.coinCounter.rounds[0];for(const k of ['correct','fulfilled','ready'])Object.defineProperty(r,k,{get(){throw Error('Reader must not inspect '+k);},enumerable:false});eq(A.actTwoCandidates(s,'market').length,1);
 }
 // Bad consumed boundary fields versus opaque unconsumed fields.
 for(const [path,values] of [[['id'],[0,-1,1.5,1e9+1,'1']],[['request'],['','x'.repeat(161),null]],[['price'],[0,26,'5']],[['a'],[null,[],{penny:-1},{dime:26},{quarter:.5}]]])for(const value of values){const s=start(),r=s.coinCounter.rounds[0];r[path[0]]=value;eq(A.actTwoCandidates(s,'market'),[],'bad market '+path);}
 for(const [field,value] of [['shared',false],['id',0],['invitation',''],['frames',[]],['frames',[{actor:'pip',place:'cafe',action:'offers',prop:''}]],['frames',[{actor:'pip',place:'cafe',action:'offers',prop:'letter',dialogue:'x'.repeat(401)}]]]){const s=start();s.loft.shelf=[];s.loft.draft[field]=value;eq(A.actTwoCandidates(s,'show'),[],'bad shared show '+field);}
 // Independent known-field matrix: preserve raw siblings, do not infer/rewrite reached outcomes.
 for(const raw of [null,[],false,'future']){const s=start();s.story.acts.II=raw;const before=clone(s.story);unchanged(s,()=>A.startActTwo(s),'scalar II');eq(s.story,before);ok(revealOldMap(s),'II cannot block Page1');}
 for(const raw of [null,[],false,'future']){const s=start();s.story.acts.II.contributions=raw;unchanged(s,()=>A.offerActTwo(s,'market',A.actTwoCandidates(s,'market')[0].key),'bad contributions');eq(A.actTwoView(s).count,0);s.story.acts.II.ended=true;ok(A.actTwoView(s).pageReady,'reached ending not regraded');ok(A.revealFloodLedger(s));ok(A.openUpstreamLetter(s));eq(s.story.acts.II.contributions,raw);}
 for(const field of ['started','ended'])for(const raw of [null,'yes',{},[]]){const s=full();s.story.acts.II[field]=raw;if(field==='started'){unchanged(s,()=>A.startActTwo(s),'bad started');s.story.acts.II.ended=true;ok(A.actTwoView(s).pageReady);}else{unchanged(s,()=>A.celebrateActTwo(s,2),'bad ended');eq(A.actTwoView(s).count,4);}}
 {
  const s=start();s.story.future={synthetic:'unknown root'};s.story.acts.future={synthetic:'unknown act'};s.story.acts.II.future={synthetic:'unknown field'};s.story.acts.II.contributions.future={synthetic:'unknown receipt'};s.story.acts.II.contributions.market={kind:'future-offer',version:99};const before=clone(s);unchanged(s,()=>A.offerActTwo(s,'market',A.actTwoCandidates(s,'market')[0].key),'unreadable known receipt');for(const c of ['garden','birthday','show'])offer(s,c);ok(A.celebrateActTwo(s,1));eq(s.story.future,before.story.future);eq(s.story.acts.future,before.story.acts.future);eq(s.story.acts.II.future,before.story.acts.II.future);eq(s.story.acts.II.contributions.market,before.story.acts.II.contributions.market);eq(s.story.acts.II.contributions.future,before.story.acts.II.contributions.future);
 }
 for(const season of [null,{},'future-season']){const s=full();s.story.acts.II.season=clone(season);ok(A.celebrateActTwo(s,5));eq(s.story.acts.II.season,season);eq(A.actTwoView(s).season,null);}
 for(const raw of [undefined,null,{kind:'future',version:99}]){const s=pageOne();s.story.acts.I={ended:'unreadable'};s.story.acts.II={ended:true,contributions:raw,receipt:{raw:'Synthetic older ending'}};delete s.cafe;const before=clone(s.story.acts.II);ok(A.actTwoView(s).pageReady);ok(A.celebrateActTwo(s,0,{canExport(){throw Error('replay must not rewrite');}}));eq(s.story.acts.II,before);ok(A.revealFloodLedger(s));ok(A.openUpstreamLetter(s));}
 // Explicit reveal ordering, separate preferences, no guessed year and no learning records.
 {
  const s=full();ok(setPageAmount(s,'original'));ok(A.setActTwoFrameAmount(s,'longer'));eq(s.story.pageAmount,'original');unchanged(s,()=>A.openUpstreamLetter(s),'letter before celebration');unchanged(s,()=>A.addStormMark(s),'annotation before page');ok(A.celebrateActTwo(s,4));eq(A.actTwoView(s).pageVisible,false);unchanged(s,()=>A.openUpstreamLetter(s),'letter before reveal');ok(A.revealFloodLedger(s));ok(A.setActTwoPageAmount(s,'original'));ok(A.addStormMark(s));ok(A.openUpstreamLetter(s));ok(A.setLetterAmount(s,'longer'));eq(s.story.frameAmount,'longer');eq(s.story.pageAmount,'original');eq(s.story.letterAmount,'longer');
  const before=clone(s),ref=s.story;for(const f of [A.startActTwo,A.revealFloodLedger,A.addStormMark,A.openUpstreamLetter,x=>A.celebrateActTwo(x,11)])ok(f(s,{canExport(){throw Error('reached no-op');}}));eq(s,before);eq(s.story,ref);ok(A.actTwoView(s).stormAdded);ok(A.actTwoView(s).letterVisible);eq(hosts.map(h=>s[h]),hosts.map(h=>before[h]));ok(!JSON.stringify(s.story).includes('160'),'story stores an annotation code, not copied measurements');eq(prepareProgressImport(JSON.stringify(report(s),null,2)).state.story,s.story);
 }
 for(const field of ['frameAmount','letterAmount'])for(const raw of [null,'original',{},'future']){const s=full();ok(A.celebrateActTwo(s,2));ok(A.revealFloodLedger(s));ok(A.openUpstreamLetter(s));s.story[field]=clone(raw);const setter=field==='frameAmount'?A.setActTwoFrameAmount:A.setLetterAmount;unchanged(s,()=>setter(s,'longer'),'malformed '+field);eq(A.actTwoView(s)[field],'short');eq(A.actTwoView(s)[field+'Status'],'unreadable');}
 // Atomic full-report preflight, a real envelope-boundary refusal and retained 500KiB sibling.
 {
  const s=start();s.syntheticUnrelated={payload:'x'.repeat(500*1024)};const old=clone(s);const key=A.actTwoCandidates(s,'market')[0].key;
  unchanged(s,()=>A.offerActTwo(s,'market',key,{canExport:()=>false}),'report refusal');
  ok(A.offerActTwo(s,'market',key,{canExport}));eq(s.syntheticUnrelated,old.syntheticUnrelated);
  const limited=clone(old);limited.syntheticUnrelated.payload='';const proposed=clone(limited);ok(A.offerActTwo(proposed,'market',key));const remaining=MAX_IMPORT_BYTES-new TextEncoder().encode(JSON.stringify(proposed,null,2)).length;limited.syntheticUnrelated.payload='x'.repeat(remaining-32);
  const rawProbe=clone(limited);ok(A.offerActTwo(rawProbe,'market',key),'full raw post-action candidate fits');ok(recoveryFitsProgressLimits(rawProbe));ok(!canExport(rawProbe),'actual pretty report exceeds limit');unchanged(limited,()=>A.offerActTwo(limited,'market',key,{canExport}),'full pretty report boundary');
  const s2=start();s2.padding='x'.repeat(MAX_IMPORT_BYTES);unchanged(s2,()=>A.offerActTwo(s2,'market',A.actTwoCandidates(s2,'market')[0].key),'raw candidate limit');
 }
 // Original finite content oracles: ledger never inferred from helper tables or imported taxonomy.
 eq(C.page.rows,[[4,40],[15,60],[27,120],[31,80],[34,120],[36,140],[38,100]]);
 const prose=JSON.stringify(C);ok(!/¡|¿|Bonjour|poste de crecidas/.test(prose),'English bounded release');ok(!prose.includes('Hollis'),'author stays hidden');ok(prose.includes('160'));ok(prose.includes('Vadoalto'));eq(Object.keys(C.celebration.seasons).sort(),['autumn','spring','summer','winter']);
 console.log(`Act II: ${n} independent source, finite-state, preservation and recovery checks passed.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runChecks();
