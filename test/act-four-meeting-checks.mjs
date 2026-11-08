// Spec602 · Act IV chapter 4 (the meeting board) and the ending. Fixtures come from the real Act IV, ledger and Rain Paths APIs.
// Keeping a plan and reaching the ending are story progress, not learning results.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {orchardSeed} from './act-four-orchard-checks.mjs';
import {actFourHosts} from './act-four-checks.mjs';
import {canExport} from './act-two-checks.mjs';
import * as A from '../dist/act-four-core.mjs';
import {actFourPage,actFourNotes,actFourRoute} from '../dist/act-four-ui.mjs';
import {actFourContent as C} from '../dist/act-four-content.mjs';
import {ensureRainPaths,chooseRainCase,nextRainPhase,keepRainResult} from '../dist/rain-paths-core.mjs';

const options={canExport},clone=structuredClone;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function withRain(s){ensureRainPaths(s);chooseRainCase(s,'cover-12');while(nextRainPhase(s));keepRainResult(s);return s;}
// Act IV started, with the chapter 1 ledger note and the chapter 2 rain result both offered.
export function meetingSeed(){
 const s=withRain(orchardSeed());
 assert.ok(A.offerActFour(s,'account',A.actFourCandidates(s,'account')[0].key,options));
 assert.ok(A.offerActFour(s,'orchard',A.actFourCandidates(s,'orchard')[0].key,options));
 return s;
}

export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const unchanged=(s,fn,label)=>{const before=clone(s);fn();eq(s,before,label);};

 eq(A.actFourPlans,['wall','sponge','some-of-each'],'spec 120 §12 plan ids');
 eq(actFourRoute('#almanac/two-stories/meeting'),{part:'chapter',chapter:'meeting'},'chapter 4 route');
 eq(actFourRoute('#almanac/map-we-changed'),{part:'ending'},'ending route');
 eq(C.meeting.plans.map(p=>p.id),A.actFourPlans,'the board shows exactly the three plans');
 eq(C.meeting.plans.map(p=>p.worries.length),[3,3,3],'three worries per plan, as scripted');

 // Keeping a plan.
 const early=actFourHosts();
 unchanged(early,()=>eq(A.keepActFourPlan(early,'sponge',null,options),false,'no plan before Act IV starts'),'and nothing is written');
 const s=meetingSeed();
 eq(A.actFourView(s).planStatus,'missing','no plan yet');
 eq(A.actFourView(s).canEnd,false,'the meeting cannot end without a plan');
 unchanged(s,()=>eq(A.keepActFourPlan(s,'sponge',null,{canExport:()=>false}),false,'a refused export writes nothing'),'refusal leaves the notebook unchanged');
 unchanged(s,()=>eq(A.keepActFourPlan(s,'moat',null,options),false,'an unknown plan is refused'),'and writes nothing');
 unchanged(s,()=>eq(A.keepActFourPlan(s,'sponge','wall-upkeep',options),false,'another plan’s worry is refused'),'and writes nothing');
 const rain=clone(s.rainPaths),ledger=clone(s.ledgerGauge),receipts=clone(s.story.acts.IV.contributions);
 ok(A.keepActFourPlan(s,'sponge',null,options),'keep the Sponge');
 eq([s.story.plan,s.story.planWorry],['sponge',null],'stored as codes');
 ok(A.keepActFourPlan(s,'sponge','sponge-years',options),'add a worry');
 eq([s.story.plan,s.story.planWorry],['sponge','sponge-years'],'plan and worry codes');
 ok(A.keepActFourPlan(s,'some-of-each',null,options),'choose again before the ending');
 eq([s.story.plan,s.story.planWorry],['some-of-each',null],'choosing again replaces both codes');
 eq([s.rainPaths,s.ledgerGauge,s.story.acts.IV.contributions],[rain,ledger,receipts],'keeping a plan touches no activity and no receipt');

 // Ending readiness: a kept plan and work in any two of chapters 1 to 3.
 eq(A.actFourView(s).earlierChapters,2,'two chapters have work');
 ok(A.actFourView(s).canEnd,'the meeting can end');
 const one=withRain(orchardSeed());ok(A.offerActFour(one,'orchard',A.actFourCandidates(one,'orchard')[0].key,options));ok(A.keepActFourPlan(one,'wall',null,options));
 eq(A.actFourView(one).canEnd,false,'one chapter of work is not enough');
 unchanged(one,()=>eq(A.endActFour(one,9,options),false,'so the ending is refused'),'and nothing is written');

 // The ending.
 unchanged(s,()=>eq(A.endActFour(s,99,options),false,'an impossible month is refused'),'and writes nothing');
 unchanged(s,()=>eq(A.endActFour(s,9,{canExport:()=>false}),false,'a refused export writes nothing'),'refusal leaves the notebook unchanged');
 ok(A.endActFour(s,9,options),'end Act IV in October');
 eq([s.story.acts.IV.ended,s.story.acts.IV.season],[true,'autumn'],'ended, in autumn');
 ok(s.story.seenScenes.includes('map-changed'),'the ending scene is recorded');
 ok(A.endActFour(s,2,options),'ending again reports done');
 eq(s.story.acts.IV.season,'autumn','and keeps the first season');
 unchanged(s,()=>eq(A.keepActFourPlan(s,'wall',null,options),false,'the plan is fixed after the ending'),'and stays as kept');
 const removed=clone(s);delete removed.rainPaths;delete removed.ledgerGauge;eq(A.actFourView(removed).ended,true,'removing the activities never revokes the ending');

 // Saved data read by shape: unreadable plans are never replaced; a worry code from another version is still read.
 const bad=meetingSeed();bad.story.plan='moat';
 eq(A.actFourView(bad).planStatus,'unreadable','an unknown saved plan is unreadable');
 unchanged(bad,()=>eq(A.keepActFourPlan(bad,'wall',null,options),false,'an unreadable plan cannot be replaced'),'and stays exactly as saved');
 eq(A.actFourView(bad).canEnd,false,'and cannot end the meeting');
 const later=meetingSeed();later.story.plan='sponge';later.story.planWorry='sponge-herons';
 eq([A.actFourView(later).worryStatus,A.actFourView(later).worry],['ready','sponge-herons'],'a worry code from another version is read');
 ok(actFourPage(later,{part:'chapter',chapter:'meeting'}).includes(esc(C.meeting.earlierWorry)),'and shown plainly');
 const badWorry=meetingSeed();badWorry.story.plan='wall';badWorry.story.planWorry=42;eq(A.actFourView(badWorry).canKeepPlan,false,'a malformed worry blocks replacement');
 const endedOnly=meetingSeed();endedOnly.story.acts.IV.started=false;endedOnly.story.acts.IV.ended=true;eq(A.actFourView(endedOnly).ended,false,'a saved ended without a start is not an ending (352)');

 // Who changes their mind.
 const v=A.actFourView(s);
 eq(A.actFourMindChange(v),'orchard','after a kept rain result, the orchard keeper');
 eq(A.actFourMindChange({chapterStatus:{account:'ready',orchard:'missing'}}),'account','after only the ledger note, Pip');
 eq(A.actFourMindChange({chapterStatus:{account:'missing',orchard:'missing'}}),'fallback','otherwise the librarian');

 // Rendering.
 const fresh=meetingSeed();
 const hub=actFourPage(fresh,{part:'hub'});
 ok(hub.includes('#almanac/two-stories/meeting'),'the hub links chapter 4');
 ok(hub.includes(esc(C.meeting.needMore))&&!hub.includes('data-a4-end'),'no ending offer before a plan is kept');
 const meet=actFourPage(fresh,{part:'chapter',chapter:'meeting'});
 ok(meet.includes('data-a4-meeting')&&meet.includes(`aria-label="${C.meeting.scene}"`),'the meeting scene is described');
 eq((meet.match(/data-a4-plan="/g)||[]).length,3,'three plan cards on the board');
 eq((meet.match(/data-a4-plan-choice/g)||[]).length,3,'three plan choices');
 ok(meet.includes(esc(C.meeting.bramble.slice(1,40))),'Bramble speaks');
 ok(A.keepActFourPlan(fresh,'sponge','sponge-money',options));
 const kept=actFourPage(fresh,{part:'chapter',chapter:'meeting'});
 ok(kept.includes(esc(C.meeting.keptWorry))&&kept.includes('Your plan: The Sponge')&&kept.includes('Your worry: The orchard keepers will lose money.'),'the kept plan and worry show');
 ok(kept.includes('data-a4-end')&&actFourPage(fresh,{part:'hub'}).includes('data-a4-end'),'the ending is offered once a plan is kept');
 eq(actFourPage(fresh,{part:'ending'}).includes(esc(C.messages.unreached)),true,'the ending page waits for the ending');
 ok(A.endActFour(fresh,4,options));
 const end=actFourPage({...fresh,garden:{guide:'rowan'}},{part:'ending'});
 ok(end.includes('data-penciled="true"'),'the ending scene has new pencil');
 ok(end.includes(esc(C.ending.mind.orchard.line)),'the orchard keeper changes their mind');
 ok(end.includes('Rowan unpins the card'),'the guide unpins the card, named');
 ok(end.includes(esc(C.ending.tails.rowan))&&!end.includes('Mira draws'),'only the chosen guide’s tail');
 ok(end.includes(esc(C.ending.seasons.spring)),'the season line for May');
 ok(end.includes('We kept a plan: The Sponge.'),'the almanac line names the plan');
 ok(end.includes(esc(C.ending.between)),'the between-acts line');
 ok(actFourPage(fresh,{part:'chapter',chapter:'meeting'}).includes(esc(C.meeting.frozen)),'after the ending the plan is shown as fixed');
 ok(actFourPage(fresh,{part:'hub'}).includes('#almanac/map-we-changed'),'the hub offers the ending again');
 ok(actFourNotes(fresh).includes('a plan kept')&&actFourNotes(fresh).includes('the meeting has ended'),'Notes name the plan and the ending');
 unchanged(fresh,()=>{actFourPage(fresh,{part:'ending'});actFourPage(fresh,{part:'chapter',chapter:'meeting'});actFourNotes(fresh);A.actFourView(fresh);},'renders and views write nothing');
 return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`Act IV meeting and ending: ${runChecks()} checks passed`);
