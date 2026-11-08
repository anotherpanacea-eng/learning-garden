// Spec607 · Act VI chapter 3, the long rain, with spec 120 §12's missing-plan fallback. Fixtures come from the real Act IV,
// V and VI APIs. Sending the warning is story progress only.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {sixSeed} from './act-six-checks.mjs';
import {canExport} from './act-two-checks.mjs';
import * as S from '../dist/act-six-core.mjs';
import {actSixRoute,actSixPage,actSixNotes} from '../dist/act-six-ui.mjs';
import {actSixContent as C} from '../dist/act-six-content.mjs';

const options={canExport},clone=structuredClone,refuse={canExport:()=>false};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function rainSeed(){const s=sixSeed();assert.ok(S.keepExchangePlan(s,'full',options));return s;}
const page=s=>actSixPage(s,{part:'chapter',chapter:'long-rain'});

export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const unchanged=(s,fn,label)=>{const before=clone(s);fn();eq(s,before,label);};
 eq(actSixRoute('#almanac/opening-ways/long-rain'),{part:'chapter',chapter:'long-rain'},'chapter 3 route');

 // The gate: the exchange plan first.
 const early=sixSeed();
 ok(page(early).includes(esc(C.rain.gate))&&page(early).includes('href="#almanac/opening-ways/routes"')&&!page(early).includes('data-a6r-send'),'chapter 3 waits for the exchange plan');
 unchanged(early,()=>eq(S.sendWarning(early,options),false,'no warning before the plan'),'and nothing is written');

 // The rain starts; getting ready; the warning card at three depths.
 const s=rainSeed();
 const p=page({...s,garden:{guide:'ari'}});
 ok(p.includes('data-a6r-post')&&p.includes(`aria-label="${esc(C.rain.start.scene)}"`)&&p.includes(esc(C.rain.start.runnerCard)),'the rain scene and the runner\'s card');
 ok(C.rain.prep.shelf.items.every(i=>p.includes(`data-a6r-shelf="${i.id}:top"`)&&p.includes(`data-a6r-shelf="${i.id}:middle"`)),'the shelf game');
 ok(p.includes('href="#post/instructions"')&&p.includes(esc(C.ui.offScreen)),'honest preparation jobs');
 ok(p.includes(`<span lang="fr">${esc(C.rain.warning.card.french)}</span>`),'the French card is marked as French');
 eq(C.rain.warning.choose.options.filter(o=>o.text===C.rain.warning.card.french).map(o=>o.id),['right'],'exactly one French choice matches the card');
 eq(C.rain.warning.build.answer.map(id=>C.rain.warning.build.cards.find(c=>c.id===id).fr).join(' '),C.rain.warning.card.french.replace(/\./g,''),'the word cards build the card');
 ok(p.includes('data-a6r-send')&&!p.includes('a6r-water-title'),'Send, and the water waits');

 // Sending is the one write.
 unchanged(s,()=>{S.actSixView(s);page(s);actSixNotes(s);},'reads and renders write nothing');
 unchanged(s,()=>eq(S.sendWarning(s,refuse),false,'a refused export writes nothing'),'refusal leaves it unchanged');
 const before={IV:clone(s.story.acts.IV),V:clone(s.story.acts.V),plan:s.story.plan};
 ok(S.sendWarning(s,options),'send the warning');
 eq(s.story.acts.VI,{started:true,plan:'full',warned:true},'the warning is a small record');
 eq([s.story.acts.IV,s.story.acts.V,s.story.plan],[before.IV,before.V,before.plan],'nothing else changes');
 const once=clone(s);ok(S.sendWarning(s,options),'sending again reports done');eq(s,once,'and writes nothing');
 ok(actSixNotes(s).includes('the warning sent'),'Notes');
 ok(page(s).includes('The courier is already halfway down the river path.')&&!page(s).includes('{courier}'),'an unchosen courier reads as the courier');

 // The water arrives: the kept plan's scene (spec 120 §12, known plan).
 for(const plan of ['wall','sponge','some-of-each']){
  const y=clone(s);y.story.plan=plan;const w=page(y);
  ok(w.includes(esc(C.rain.water.scenes[plan].short[0]))&&w.includes('data-arrived="true"')&&w.includes(esc(C.rain.water.ends).slice(0,30)),`the ${plan} scene, then every version ends`);
  ok(!w.includes(esc(C.rain.water.plain.short[0]))&&!w.includes('data-a6r-plan='),`no fallback for a known plan (${plan})`);
 }

 // Absent plan: the meeting, offered again; choosing writes only the plan; Let the water come writes nothing.
 const none=clone(s);delete none.story.plan;none.story.planWorry='a-future-worry';
 let w=page(none);
 ok(w.includes(esc(C.rain.water.offer))&&['wall','sponge','some-of-each','none'].every(k=>w.includes(`data-a6r-plan="${k}"`)),'the meeting is offered again, with Let the water come');
 ok(!w.includes(esc(C.rain.water.plain.short[0]))&&!Object.values(C.rain.water.scenes).some(x=>w.includes(esc(x.short[0]))),'no scene before the choice');
 unchanged(none,()=>{eq(S.chooseRainPlan(none,'a-future-plan',options),false,'an unknown plan cannot be chosen');eq(S.chooseRainPlan(none,'sponge',refuse),false,'a refused export writes nothing');},'and nothing is written');
 ok(S.chooseRainPlan(none,'sponge',options),'choose the Sponge');
 eq([none.story.plan,none.story.planWorry],['sponge','a-future-worry'],'only the plan is written; the saved worry is untouched');
 ok(page(none).includes(esc(C.rain.water.scenes.sponge.short[0])),'and its scene plays');
 const again=clone(none);eq(S.chooseRainPlan(again,'wall',options),false,'a plan, once present, is never replaced');eq(again,none,'and nothing changes');

 // A plan from another version, or a malformed one: the guide's line and the plain scene, never a choice or a rewrite.
 for(const [label,value] of [['later','a-future-plan'],['malformed',7],['malformed object',{plan:'wall'}]]){
  const y=clone(s);y.story.plan=value;const w2=page({...y,garden:{guide:'ari'}});
  eq(S.storyPlanKind(y.story).kind,label.startsWith('malformed')?'malformed':'later',`${label} is read by shape`);
  ok(w2.includes('Ari: &quot;The plan from the meeting is on a page this story can&#39;t read yet.')&&w2.includes(esc(C.rain.water.plain.short[0])),`${label}: the guide's line and the plain scene`);
  ok(!w2.includes('data-a6r-plan='),`${label}: no choice offered`);
  unchanged(y,()=>eq(S.chooseRainPlan(y,'wall',options),false,`${label}: never overwritten`),`${label} stays exactly as saved`);
 }
 const bad=clone(s);bad.story.plan=7;ok(actSixNotes(bad).includes(esc(C.messages.badStoryPlan)),'Notes say a damaged plan is kept unchanged');

 // The plain scene attributes no outcome to a plan (an editorial check made concrete for the reviewed text).
 const plain=[...C.rain.water.plain.short,...C.rain.water.plain.longer].join(' ').toLowerCase();
 ok(!['wall','marsh','sponge','orchard','meadow','reed','apple'].some(x=>plain.includes(x)),'the plain scene names no plan feature');

 // Saved shapes for the warning itself.
 const odd=clone(s);odd.story.acts.VI.warned='yes';eq([S.actSixView(odd).warned,S.actSixView(odd).canWarn],[false,false],'a malformed warning is not a warning and is not overwritten');
 unchanged(odd,()=>S.sendWarning(odd,options),'and stays');
 return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`Act VI long rain: ${runChecks()} checks passed`);
