import assert from 'node:assert/strict';
import {freshState,restoreStateResult} from '../dist/core.mjs';
import {freshStory,storyView,firstSupperReceipt,keepParcel,captureFirstSupper,revealOldMap,setPageAmount} from '../dist/keeper-story-core.mjs';
import {keeperStoryContent as content,keeperPageAmounts} from '../dist/keeper-story-content.mjs';
import {ensureCafe,nextGuest,orderFor,adjustBite,checkPlate,skipCafeStage,serveCafe,beginCafePlus,currentRecipe} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;},copy=structuredClone;
const fresh=()=>({...freshState(),story:freshStory()}),json=JSON.stringify;
const source=served=>({...freshState(),cafe:{version:1,served}});
const before=(state,fn,message)=>{const original=copy(state),out=fn();eq(state,original,message);return out;};
// These are structural arrival facts, never completed story or learning records.
eq(freshStory(),{version:1,opening:'fresh',arrival:'storm',acts:{},seenScenes:[]});
{const one=freshStory(),two=freshStory();one.seenScenes.push('synthetic-scene');eq(two.seenScenes,[]);}
for(const state of [freshState(),fresh(),source(6),{...source(6),story:null}])before(state,()=>storyView(state),'all views are read-only');
const a=fresh();eq(storyView(a).opening,'fresh');eq(storyView(a).pageAmount,'short');eq(storyView(freshState()).opening,'returning');
// Independent boundary matrix for the one existing artifact contract.
for(const version of [undefined,null,0,1,2,'1'])for(const served of [-1,0,1,5,6,7,19,1000000000,1000000001,0.5,NaN,Infinity,Number.MAX_SAFE_INTEGER,'6']){
 const state={cafe:{version,served}},eligible=version===1&&typeof served==='number'&&Number.isSafeInteger(served)&&served>=6&&served<=1000000000;
 const r=before(state,()=>firstSupperReceipt(state),'receipt adapter is pure');eq(r!==null,eligible,'receipt boundary independent of later story');if(eligible)eq(r,{kind:'cafe-first-supper',version:1,served});
}
for(const value of [undefined,null,[],false,{},'future'])eq(firstSupperReceipt({cafe:value}),null);
for(const served of [0,5]){
 const state=source(served);state.cafe.current={served:true,stage:'served'};state.cafe.history=Array.from({length:6},(_,orderIndex)=>({orderIndex,status:'served'}));state.garden={filmsSeen:{cafe:true},welcomeFilmSeen:true};eq(firstSupperReceipt(state),null,'films, closed-order flags and six history rows cannot invent service');
}
{
 const cafe={version:1,served:6,supper:{round:2,startedAtServed:6}};
 for(const key of ['history','current','correct','supported','hinted','total','shortfall'])Object.defineProperty(cafe,key,{get(){throw Error('Forbidden contributor read: '+key);}});
 eq(firstSupperReceipt({cafe}),{kind:'cafe-first-supper',version:1,served:6,supper:{round:2,startedAtServed:6}},'adapter does not inspect learning/help/current-answer state');
}
for(const supper of [null,[],{},false,{round:0,startedAtServed:0},{round:2,startedAtServed:7},{round:Infinity,startedAtServed:0}])eq(firstSupperReceipt({cafe:{version:1,served:6,supper}}),{kind:'cafe-first-supper',version:1,served:6},'unreadable optional provenance does not erase service');
{
 const state=source(6);state.cafe.supper={round:2,startedAtServed:6,unused:'synthetic'};const receipt=firstSupperReceipt(state);state.cafe.supper.startedAtServed=999;eq(receipt.supper,{round:2,startedAtServed:6},'receipt is a copied observation');
}
// Missing/legacy notebooks remain untouched until a deliberate action.
{
 const state=source(5),baseline=copy(state);storyView(state);eq(state,baseline);eq(revealOldMap(state),false);eq(setPageAmount(state,'longer'),false);eq(captureFirstSupper(state),false);eq(state,baseline);
 ok(keepParcel(state));eq(state.story.opening,'returning');ok(!Object.hasOwn(state.story,'arrival'));eq(state.story.seenScenes,['parcel-found']);eq(state.story.acts,{});eq(storyView(state).pageReady,false);eq(storyView(state).pageVisible,false);eq(state.cafe,baseline.cafe);
}
// Actual Café APIs: every number can be supported/skipped; only six real services qualify.
{
 const state=fresh();ensureCafe(state);state.cafe.seed=192;state.cafe.range='small';ok(keepParcel(state));
 for(let tables=1;tables<=6;tables++){
  nextGuest(state);const order=orderFor(state.cafe),food=ingredients.find(i=>!i.orchard&&order.wanted.every(p=>i.properties.includes(p)));ok(food,'synthetic order has a matching pretend ingredient');
  for(let i=0;i<order.bites;i++)adjustBite(state,food.id,1);
  ok(checkPlate(state));ok(skipCafeStage(state));ok(skipCafeStage(state));
  for(const item of currentRecipe(state.cafe))state.cafe.stock[item.ingredient.id]=item.required; // Synthetic stocked fixture; no production restock action.
  const prepared=copy(state.cafe);eq(firstSupperReceipt(state)!==null,tables>6,'preparing the sixth plate is not yet service');
  ok(serveCafe(state));eq(state.cafe.served,tables);eq(captureFirstSupper(state),tables===6);eq(storyView(state).ended,tables===6);ok(state.cafe.current.total.skipped&&state.cafe.current.shortfall.skipped);
  eq(serveCafe(state),false,'duplicate service does not advance');eq(state.cafe.served,tables);ok(prepared.current.stage==='stock');
 }
 const kept=copy(state.story.acts.I);eq(kept.receipt.served,6);ok(storyView(state).pageReady);eq(storyView(state).pageVisible,false);ok(revealOldMap(state));ok(storyView(state).pageVisible);ok(beginCafePlus(state));eq(state.cafe.supper,{round:2,startedAtServed:6});ok(storyView(state).eligible,'new gathering starts empty without losing the first one');
 state.cafe.served=7;ok(captureFirstSupper(state));eq(state.story.acts.I,kept,'later services never refresh first receipt');
 delete state.cafe;ok(storyView(state).pageVisible,'reached ending persists without Café');
}
// Legacy first supper and New Game Plus are already eligible without six retained rows.
for(const [served,supper] of [[6,undefined],[19,undefined],[6,{round:2,startedAtServed:6}],[42,{round:4,startedAtServed:42}]]){
 const state=source(served);if(supper)state.cafe.supper=copy(supper);const originalCafe=copy(state.cafe);ok(storyView(state).eligible);eq(storyView(state).pageReady,false);ok(keepParcel(state));ok(storyView(state).pageReady);eq(storyView(state).pageVisible,false);ok(revealOldMap(state));ok(storyView(state).pageVisible);eq(state.cafe,originalCafe,'scene actions consume no service or stock');
}
// Previously reached outcomes are not regraded against today's threshold or provenance format.
for(const receipt of [undefined,null,{kind:'future-receipt',version:99,raw:'Synthetic provenance'},{kind:'cafe-first-supper',version:1,served:0},'synthetic-older-value']){
 const state=fresh();state.story.acts.I={ended:true,unknown:'Synthetic retained field'};if(receipt!==undefined)state.story.acts.I.receipt=copy(receipt);const raw=copy(state.story.acts.I);ok(storyView(state).ended);ok(storyView(state).eligible);ok(keepParcel(state));ok(revealOldMap(state));ok(storyView(state).pageVisible);ok(captureFirstSupper(state));eq(state.story.acts.I,raw,'receipt absence/copy changes do not hide a reached ending');
}
// A newly observed contribution updates only the owned fields of a readable open act.
{
 const state={...source(6),story:freshStory()};state.story.acts.I={ended:false,receipt:{kind:'synthetic-old-proposal'},future:{raw:'Synthetic unknown act field'}};ok(captureFirstSupper(state));eq(state.story.acts.I.ended,true);eq(state.story.acts.I.receipt,{kind:'cafe-first-supper',version:1,served:6});eq(state.story.acts.I.future,{raw:'Synthetic unknown act field'});
 const original=copy(state.story);state.cafe={version:99,served:0};ok(storyView(state).ended);ok(storyView(state).eligible);ok(captureFirstSupper(state));eq(state.story,original,'future activity format cannot refresh a reached outcome');
}
// An unreadable sibling act is retained while parcel and available map remain usable.
for(const act of [null,[],false,{},'synthetic-future',{ended:'yes',raw:'Synthetic retained outcome'}]){
 const state={...source(6),story:freshStory()};state.story.acts.I=copy(act);state.story.acts['future-act']={raw:'Synthetic future act'};const raw=copy(state.story.acts.I);eq(storyView(state).actIStatus,'unreadable');eq(captureFirstSupper(state),false);ok(keepParcel(state));ok(revealOldMap(state));ok(setPageAmount(state,'original'));eq(state.story.acts.I,raw);eq(state.story.acts['future-act'],{raw:'Synthetic future act'});eq(storyView(state).ended,false,'an unreadable ending is never decoded');ok(storyView(state).pageVisible,'the separate valid receipt still supports the page');
}
for(const raw of [null,[],{version:99,raw:'Synthetic story'},{version:1,opening:'future',acts:{},seenScenes:[]},{version:1,opening:'fresh',acts:null,seenScenes:[]},{version:1,opening:'fresh',acts:{},seenScenes:[{}]}]){
 const state={...source(6),story:copy(raw)},original=copy(state);eq(storyView(state).status,'unavailable');for(const fn of [keepParcel,captureFirstSupper,revealOldMap,s=>setPageAmount(s,'short')])eq(fn(state),false);eq(state,original,'unsupported roots remain byte-shaped and all other games untouched');
}
// Additions preserve unknown codes/keys, and repeated actions do not rewrite or allocate.
{
 const state={...source(6),story:freshStory(),garden:{start:{reading:2,french:1}},future:{raw:'Synthetic sibling'}};state.story.future={raw:'Synthetic story extension'};state.story.acts.future={kind:'Synthetic unknown'};state.story.seenScenes=['future-scene','future-scene'];ok(keepParcel(state));ok(revealOldMap(state));const original=copy(state),identity=state.story;
 const refuse={canExport(){throw Error('No-op must not preflight a rewrite');}};ok(keepParcel(state,refuse));ok(revealOldMap(state,refuse));ok(captureFirstSupper(state,refuse));eq(state,original);eq(state.story,identity);eq(state.story.seenScenes,['future-scene','future-scene','parcel-found','old-map-revealed']);
 for(const amount of keeperPageAmounts){ok(setPageAmount(state,amount));eq(storyView(state).pageAmount,amount);eq(state.garden,original.garden);eq(state.future,original.future);eq(state.story.future,original.story.future);}
 const unknown=copy(state);state.story.pageAmount={raw:'Synthetic future preference'};const p=copy(state);eq(storyView(state).pageAmount,'short');eq(state,p);ok(setPageAmount(state,'longer'));eq(state.story.pageAmount,'longer');eq(state.story.acts,unknown.story.acts);
}
// Atomic growth refusal keeps the whole notebook; mutation commits only story.
{
 const state=source(6),old=copy(state);eq(keepParcel(state,{canExport:()=>false}),false);eq(state,old);
 ok(keepParcel(state,{canExport:candidate=>{candidate.syntheticOther='Must not be committed';return true;}}));ok(!Object.hasOwn(state,'syntheticOther'));ok(!Object.hasOwn(state.story,'arrival'));
 const current=copy(state);eq(revealOldMap(state,{canExport:()=>false}),false);eq(state,current);
 state.padding='x'.repeat(5*1024*1024);const padded=copy(state);eq(revealOldMap(state),false);eq(state,padded,'bounds refusal does not lose source or a served order');
}
{
 const state={...source(6),story:freshStory()};ok(keepParcel(state));ok(revealOldMap(state));ok(setPageAmount(state,'original'));const roundTrip=restoreStateResult(json(state));eq(roundTrip.reason,null);eq(roundTrip.state.story,state.story);ok(recoveryFitsProgressLimits(state));
 const raw=json(state.story);ok(!raw.includes(content.page.amounts.short.paragraphs[0]),'learner save stores IDs/preferences, not story text');ok(!raw.includes('Hollis'));ok(!Object.hasOwn(state.story,'pages'),'availability is derived');
}
// Authored finite scope and accessibility wording; no later-page or author reveal in shipping text.
eq(keeperPageAmounts,['short','longer','original']);eq(content.parcel.fresh.length,6);eq(content.parcel.returning.length,5);ok(content.parcel.after.includes('wrapper')&&content.parcel.after.includes('windowsill'));ok(content.parcel.fresh.join(' ').includes('{guide}'));ok(content.parcel.returning[0].startsWith('Pip has been keeping'));
const prose=json(content);ok(!prose.includes('Hollis'));ok(!prose.includes('Vadoalto'));ok(!prose.includes('flood ledger'));eq((content.page.amounts.original.paragraphs[0].match(/\[smudged word\]/g)||[]).length,2);ok(content.page.guideLine.includes('how someone drew'));ok(content.page.mapLegend.includes('marsh'));ok(content.page.mapLimit.includes('not to scale'));ok(content.page.reveal[0].startsWith('A little later'));ok(!prose.includes('While everyone is eating'));eq(content.invitation.reread.title,'Read the old map again');eq(Object.keys(content.glossary),['marsh','brook']);
console.log(`Keeper story: ${n} contribution, finite-content, scene-order and preservation checks passed.`);
