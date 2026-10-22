import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {chooseBatchCase,keepBatch,batchState,offerBatch} from '../dist/whole-batches-core.mjs';
import {chooseSharingCase,keepSharing,sharingState} from '../dist/sharing-counter-core.mjs';
import {chooseRecipe,keepRecipe,recipeState} from '../dist/measuring-recipes-core.mjs';
import {sourceArtifacts,nextTownCard,startTown,chooseTown,checkTown,keepTown,asideTown,supportTown,townState,townHistory,errandValid,townDisplayedFactPairs} from '../dist/town-remembers-core.mjs';
import {townPage,townInvitation,townNotes} from '../dist/town-remembers-ui.mjs';
const copy=x=>structuredClone(x), day='2026-10-21',later='2026-10-22';
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(x,m)=>{assert.ok(x,m);checks++;};
const fresh=()=>initializeExplorerState(freshState());
function tray(c,id='rehearsal-table'){const s=fresh();chooseBatchCase(s,id);const w=s.wholeBatches.cases[id];w.model.portions={'cloud-water':100*c,'star-water':150*c};ok(keepBatch(s),'keep tray');s.wholeBatches.cases[id].kept.keptDay=day;return s;}
function loaf(n,selected=[0],id='repair-halves'){const s=fresh();chooseSharingCase(s,id);const w=s.sharingCounter.cases[id],width=12;w.model={cuts:Array.from({length:n-1},(_,i)=>width/n*(i+1)),selected};ok(keepSharing(s),'keep loaf');s.sharingCounter.cases[id].kept.keptDay=day;return s;}
function jug(a,ingredient='cloud-water',id='welcome-broth'){const s=fresh();chooseRecipe(s,id);const w=s.measuringRecipes.cases[id];w.model.portions[ingredient]=a;ok(keepRecipe(s),'keep kitchen tray');s.measuringRecipes.cases[id].kept.keptDay=day;return s;}
function secondForm(s,previousKind){const first=startTown(s,later);ok(first,'first errand starts');ok(asideTown(s),'first errand aside');s.townRemembers.used=[];s.townRemembers.rotation=previousKind;const second=startTown(s,later);ok(second,'second form starts after old used key trimmed');return second;}
const choices=e=>e.choices.map(c=>c.value);
{
 const s=fresh(),raw=JSON.stringify(s);eq(nextTownCard(s,later),null,'no initial card');eq(townInvitation(s),'','no initial invitation');eq(townPage(s).includes('No neighbor is waiting just now'),true,'empty page');eq(JSON.stringify(s),raw,'render does not allocate root');
}
for(const c of [1,2,3]){
 const s=tray(c),before=copy(s);eq(sourceArtifacts(s,day).length,0,'same day waits');eq(sourceArtifacts(s,later).length,1,'later day eligible');eq(s,before,'candidate selection pure');
 const e=startTown(s,later);eq(e.form,'trays-reverse','reverse first');eq(e.expected,c*2,'guest count');eq(new Set(choices(e)).size,3,'reverse choices distinct');eq(e.choices.findIndex(x=>x.value===e.expected),(1-(c-1)+3)%3,'reverse rotated by c index');ok(e.example.cloud!==e.artifact.values.cloud,'different example');
 const imported=prepareProgressImport(JSON.stringify(s));ok(imported.ok,'errand imports');eq(imported.state.townRemembers,s.townRemembers,'frozen errand imports exactly');
 ok(chooseTown(s,e.choices[0].value),'choose');eq(s.townRemembers.errands[0].checks.length,0,'choice alone not check');const record=checkTown(s);eq(record.fit,record.choice===e.expected,'check fit own expected');ok(record.feedback.includes(`${c*2} guest`),'feedback names actual guests');ok(keepTown(s),'keep answer');eq(keepTown(s),false,'terminal keep idempotent');eq(s.wholeBatches,before.wholeBatches,'source tray unchanged by errand');
 if(c<=2){const a=tray(c),alt=secondForm(a,'jugs');eq(alt.form,'trays-shortcut','shortcut alternate');eq(alt.expected,'needs-star','shortcut fitting');eq(new Set(choices(alt)).size,3,'shortcut distinct');eq(alt.choices.findIndex(x=>x.value===alt.expected),(2-(c-1)+3)%3,'shortcut rotated');ok(alt.feedback.includes('50 mL short')&&alt.feedback.includes('below their 500 mL'),'both wrong explanations supplied');ok(alt.example.cloud!==alt.artifact.values.cloud,'shortcut help uses other tray');}
}
for(const [i,n] of [2,3,4,6].entries()){
 const s=loaf(n),e=startTown(s,later),m=[3,4,6,2][i];eq(e.form,'share-compare','compare first');eq(e.artifact.values.m,m,'next count frozen');eq(e.expected,m<n?'Bigger':'Smaller','same whole relation');eq(e.choices.findIndex(x=>x.value===e.expected),(['Smaller','Bigger','We cannot compare these pieces.'].indexOf(e.expected)-i+6)%3,'compare rotated');ok(e.example.n!==n,'comparison help different');
 const before=copy(s.townRemembers.errands[0]);delete s.sharingCounter;eq(townPage(s).includes(`Clover cuts the same`),true,'frozen errand survives deleted source');eq(s.townRemembers.errands[0],before,'render does not recompute frozen m');
 const a=loaf(n),alt=secondForm(a,'trays');eq(alt.form,'share-buns','basket alternate');eq(alt.expected,12/n,'fraction of set');eq(new Set(choices(alt)).size,3,'bun choices distinct');eq(alt.choices.findIndex(x=>x.value===alt.expected),(2-i+6)%3,'buns rotated');ok(townPage(a).includes('Twelve unselected buns'),'source set pictured');ok(alt.example.n!==n,'buns help distinct');
}
for(const n of [2,3,4,6]){
 const s=loaf(n),e=secondForm(s,'trays'),h=e.example.n,source=copy(s.sharingCounter);
 eq(townDisplayedFactPairs(s),[],'unselected buns and choices do not expose an equal-group fact');
 chooseTown(s,e.choices.find(c=>c.value!==e.expected).value);eq(townDisplayedFactPairs(s),[],'choice before Check does not expose');
 checkTown(s);eq(townDisplayedFactPairs(s),[[n,12/n]],'fitting or non-fitting Check shows frozen bun groups');
 eq(townDisplayedFactPairs(s,null,'notes'),[[n,12/n]],'expanded readable notes show checked bun groups');
 supportTown(s,'example');eq(townDisplayedFactPairs(s),[[n,12/n],[h,12/h]].filter((p,i,a)=>a.findIndex(x=>x.join('x')===p.join('x'))===i),'Help shows its separate bun groups');
 eq(townDisplayedFactPairs(prepareProgressImport(JSON.stringify(s)).state),townDisplayedFactPairs(s),'open feedback and Help restore on import');
 asideTown(s);eq(townDisplayedFactPairs(s,String(e.id)),[[n,12/n]],'closed detail shows Check but not hidden Help');
 eq(s.sharingCounter,source,'fact selection leaves source loaf unchanged');
 const changed=copy(s),old=changed.townRemembers.errands.at(-1);old.checks[0].feedback=`Split 12 buns into ${n} equal groups. Each group has 99 buns.`;
 ok(errandValid(old),'older frozen wording remains readable');eq(townDisplayedFactPairs(changed,String(e.id)),[],'mismatched checked text does not assert fact');
 old.checks[0].feedback=e.feedback;old.example={kind:'jug',amount:200};old.status='open';
 ok(errandValid(old),'alternate saved helper shape remains readable');eq(townDisplayedFactPairs(changed),[[n,12/n]],'wrong helper kind cannot assert example fact');
}
for(const c of [1,2,3]){
 const s=tray(c),e=startTown(s,later),h=e.example.guests/2;
 eq(townDisplayedFactPairs(s),[],'tray before Check exposes no Town relation');
 supportTown(s,'example');eq(townDisplayedFactPairs(s),[[h,2]],'visible tray Help supplies guests per batch');
 chooseTown(s,e.expected);checkTown(s);eq(townDisplayedFactPairs(s),[[c,2],[h,2]].filter((p,i,a)=>a.findIndex(x=>x.join('x')===p.join('x'))===i),'tray Check supplies its relation');
 keepTown(s);eq(townDisplayedFactPairs(s,String(e.id)),[[c,2]],'closed tray detail hides its separate Help');
}
for(const [i,a] of [50,100,150,200,250,300,350,400,450].entries()){
 const s=jug(a),e=startTown(s,later),lo=(Math.ceil(a/100)-1)*100,hi=(Math.floor(a/100)+1)*100;eq(e.form,'jug-coarser','scale first');eq(e.expected,a,'scale exact');eq(new Set(choices(e)),new Set([lo,a,hi]),'scale neighbors');eq(e.choices.findIndex(x=>x.value===a),(1-i%3+3)%3,'scale rotated');ok(e.example.amount!==a,'scale help different');const html=townPage(s);ok(html.includes('town-jug-drawing')&&html.includes('unnumbered'),'new scale visible');if(a%100)ok(!html.includes(`Saved amount: ${a} mL`),'exact amount withheld before check');
 const altState=jug(a),alt=secondForm(altState,'shares'),t=Math.ceil((a+1)/100)*100,more=t-a,extra=more+50===t?more+100:more+50;eq(alt.form,'jug-more','more alternate');eq(alt.expected,more,'needed pour');eq(new Set(choices(alt)),new Set([more,t,extra]),'more choices distinct');eq(alt.choices.findIndex(x=>x.value===more),(0-i%3+3)%3,'more rotated');eq(alt.artifact.values.t,t,'target frozen');ok(alt.feedback.includes(`${extra} mL would pass`),'extra distractor explained');ok(alt.example.extra!==more,'help has different pour');
}
{
 const s=tray(1),w=s.wholeBatches.cases['rehearsal-table'];delete w.kept.keptDay;eq(sourceArtifacts(s,day).length,1,'undated legacy eligible');ok(batchState(s),'legacy kept tray valid');w.kept.keptDay='2026-02-30';eq(batchState(s),null,'malformed kept day rejected by source');eq(sourceArtifacts(s,later).length,0,'malformed day ineligible');
 const b=tray(2);delete b.wholeBatches.cases['rehearsal-table'].kept.keptDay;ok(batchState(b),'legacy tray');const sh=loaf(2);delete sh.sharingCounter.cases['repair-halves'].kept.keptDay;ok(sharingState(sh),'legacy loaf');const j=jug(150);delete j.measuringRecipes.cases['welcome-broth'].kept.keptDay;ok(recipeState(j),'legacy kitchen');
}
{
 const s=tray(1),id='rehearsal-table',w=s.wholeBatches.cases[id],baseline=copy(s);
 for(const edit of [k=>{k.source.base['cloud-water']=125;},k=>{k.source.unit='g';},k=>{k.input.model.portions['star-water']=100;},k=>{k.input.model.portions['cloud-water']=0;}]){const bad=copy(baseline);edit(bad.wholeBatches.cases[id].kept);eq(sourceArtifacts(bad,later).length,0,'changed frozen base/unit or incomplete jars skipped');}
 const unequal=loaf(2);unequal.sharingCounter.cases['repair-halves'].kept.model.cuts=[5];eq(sourceArtifacts(unequal,later).length,0,'unequal frozen loaf skipped');
 const two=loaf(2,[0,1]);eq(sourceArtifacts(two,later)[0].forms,['share-compare'],'multiple selected pieces allow compare but not buns');
 for(const n of [0,500]){const edge=jug(50);edge.measuringRecipes.cases['welcome-broth'].kept.model.portions={'cloud-water':n,'star-water':0};eq(sourceArtifacts(edge,later).length,0,'empty or full kitchen portion skipped');}
 const other=jug(150,'star-water');eq(sourceArtifacts(other,later)[0].values.ingredient,'star-water','star chosen when cloud unavailable');other.measuringRecipes.cases['welcome-broth'].kept.model.portions['cloud-water']=50;eq(sourceArtifacts(other,later)[0].values.ingredient,'cloud-water','cloud chosen first when both eligible');
 const invalidApp=jug(150);invalidApp.measuringRecipes.cases['welcome-broth'].kept.source.apparatus.transfer=25;eq(sourceArtifacts(invalidApp,later).length,0,'changed frozen apparatus skipped');
}
{
 const s=fresh();for(const [id,stamp] of [['rehearsal-table',day],['story-supper',day],['quiet-picnic',null]]){chooseBatchCase(s,id);s.wholeBatches.cases[id].model.portions={'cloud-water':100,'star-water':150};keepBatch(s);if(stamp===null)delete s.wholeBatches.cases[id].kept.keptDay;else s.wholeBatches.cases[id].kept.keptDay=stamp;}
 eq(nextTownCard(s,later).artifact.caseId,'quiet-picnic','legacy undated first');startTown(s,later);asideTown(s);eq(nextTownCard(s,later).artifact.caseId,'rehearsal-table','dated tie by saved case id');startTown(s,later);asideTown(s);eq(nextTownCard(s,later).artifact.caseId,'story-supper','next dated case');
 const used=tray(1);used.townRemembers={version:1,rotation:null,used:Array.from({length:48},(_,i)=>`old-${i}`),errands:[]};const started=startTown(used,later);ok(started,'start with full used list');eq(used.townRemembers.used.length,48,'used stays bounded');ok(!used.townRemembers.used.includes('old-0'),'oldest used key trimmed');
}
{
 const s=tray(1),id='rehearsal-table';const first=sourceArtifacts(s,later)[0].key;keepBatch(s);s.wholeBatches.cases[id].kept.keptDay=day;eq(sourceArtifacts(s,later)[0].key,first,'identical rekeep same identity');s.wholeBatches.cases[id].model.portions={'cloud-water':200,'star-water':300};keepBatch(s);s.wholeBatches.cases[id].kept.keptDay=day;ok(sourceArtifacts(s,later)[0].key!==first,'changed kept portions new identity');
 const sh=loaf(2,[0]);const key=sourceArtifacts(sh,later)[0].key;sh.sharingCounter.cases['repair-halves'].model.selected=[1];keepSharing(sh);sh.sharingCounter.cases['repair-halves'].kept.keptDay=day;ok(sourceArtifacts(sh,later)[0].key!==key,'selected piece part of identity');
}
{
 const s=tray(1);const a=startTown(s,later);ok(a,'started');eq(startTown(s,later),false,'cannot start twice');const old=JSON.stringify(s);nextTownCard(s,later);townPage(s);townNotes(s);eq(JSON.stringify(s),old,'all renders pure');
 const invalid=copy(s.townRemembers.errands[0]);invalid.artifact.values.cloud={'toString':null};s.townRemembers.errands.push({...invalid,id:2,status:'kept'});eq(townHistory(s).raw.length,1,'malformed nested value held raw');ok(!townNotes(s).includes('[object Object]')&&townNotes(s).includes('toString'),'raw escaped without coercion');
 s.townRemembers.errands.push({...copy(a),id:3,form:'future-form',status:'kept'});eq(townHistory(s).raw.length,2,'unknown form isolated');ok(asideTown(s),'open known can still close');s.townRemembers.errands.push({...copy(a),id:4,form:'future-form',status:'open'});eq(nextTownCard(s,later).type,'unavailable','unknown open prevents another start');ok(asideTown(s),'unknown open can be set aside');eq(startTown(s,later),false,'used source does not recur');
 s.townRemembers.errands.push({...copy(a),status:'kept'});eq(townHistory(s).raw.length,4,'duplicate id held as raw sibling');eq(townHistory(s).readable.length,1,'original readable errand retained');
}
{
 const s=tray(1);s.townRemembers={version:1,rotation:null,used:[],errands:[{id:Number.MAX_SAFE_INTEGER,form:'future-form',status:'aside'}]};
 const before=copy(s.townRemembers);eq(startTown(s,later),false,'exhausted safe id refuses Start');eq(s.townRemembers,before,'exhausted id leaves raw work and source unchanged');
}
console.log(`Town Remembers core: ${checks} passed.`);
