// Spec606 · Act VI opening. Fixtures come from the real Act IV and V APIs; keeping an exchange plan is story progress only.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {keptSeed} from './act-five-projects-checks.mjs';
import {canExport} from './act-two-checks.mjs';
import {endActFive} from '../dist/act-five-core.mjs';
import * as S from '../dist/act-six-core.mjs';
import {actSixRoute,actSixPage,actSixInvitation,actSixNotes} from '../dist/act-six-ui.mjs';
import {actFivePage} from '../dist/act-five-ui.mjs';
import {keeperPages} from '../dist/keeper-story-ui.mjs';
import {setActTwoFrameAmount} from '../dist/act-two-core.mjs';
import {actSixContent as C} from '../dist/act-six-content.mjs';

const options={canExport},clone=structuredClone,refuse={canExport:()=>false};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function boundSeed(){const s=keptSeed();assert.ok(endActFive(s,'night-garden',3,options));return s;}
export function sixSeed(){const s=boundSeed();assert.ok(S.startActSix(s,options));return s;}

export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const unchanged=(s,fn,label)=>{const before=clone(s);fn();eq(s,before,label);};

 eq(actSixRoute('#almanac/opening-ways'),{part:'hub'},'hub route');
 eq(actSixRoute('#almanac/opening-ways/exchange'),{part:'chapter',chapter:'exchange'},'chapter 1 route');
 eq(actSixRoute('#almanac/opening-ways/routes'),{part:'chapter',chapter:'routes'},'chapter 2 route');
 eq(actSixRoute('#almanac/opening-ways/long-rain'),{part:'hub'},'an unbuilt chapter falls back to the hub');
 eq(actSixRoute('#almanac/own-question'),null,'Act V routes are not Act VI');

 // Before a project is bound, Act VI cannot start.
 const early=keptSeed();
 eq([S.actSixView(early).canStart,actSixInvitation(early)],[false,''],'no invitation before the Act V ending');
 unchanged(early,()=>eq(S.startActSix(early,options),false,'cannot start yet'),'and nothing is written');
 ok(actSixPage(early,{part:'hub'}).includes(esc(C.messages.unreached)),'the hub says when it opens');

 // After the ending: Continue the story under the Act V ending and on the Keeper's Pages.
 const s=boundSeed();
 ok(actFivePage(s,{part:'ending'}).includes('data-a6-start'),'under the Act V ending');
 ok(keeperPages(s).includes('data-a6-start'),'and on the Keeper\'s Pages');
 unchanged(s,()=>{S.actSixView(s);actSixPage(s,{part:'hub'});actSixPage(s,{part:'chapter',chapter:'routes'});actSixNotes(s);actSixInvitation(s);},'reads and renders write nothing');
 unchanged(s,()=>eq(S.startActSix(s,refuse),false,'a refused export writes nothing'),'refusal leaves it unchanged');
 const actV=clone(s.story.acts.V);
 ok(S.startActSix(s,options),'start Act VI');
 eq(s.story.acts.VI,{started:true},'a small record');
 ok(s.story.seenScenes.includes('nurias-list'),'the opening scene is recorded');
 eq(s.story.acts.V,actV,'Act V is untouched');
 ok(S.startActSix(s,options),'starting again reports done');
 ok(actSixInvitation(s).includes('href="#almanac/opening-ways"'),'once started, the invitation links to the hub');

 // The hub: Nuria's letter and the opening, two chapters.
 const hub=actSixPage({...s,garden:{guide:'ari'}},{part:'hub'});
 ok(hub.includes(esc(C.letter.title))&&hub.includes(esc(C.letter.short[0])),'Nuria\'s letter');
 ok(hub.includes('href="#almanac/opening-ways/exchange"')&&hub.includes('href="#almanac/opening-ways/routes"'),'the hub links both chapters');
 ok(!hub.includes('{guide}')&&!hub.includes('{courier}'),'no placeholder is left');

 // Chapter 1: the scene, the sorting game, honest jobs.
 const ch1=actSixPage(s,{part:'chapter',chapter:'exchange'});
 ok(C.exchange.sort.items.every(i=>ch1.includes(`data-a6-sort="${i.id}:up"`)&&ch1.includes(`data-a6-sort="${i.id}:down"`)),'every good can go up or down');
 ok(C.exchange.sort.items.every(i=>ch1.includes(`role="group" aria-labelledby="a6-good-${i.id}"><strong id="a6-good-${i.id}">`)),'each good labels its pair of buttons');
 eq([...new Set(C.exchange.sort.items.map(i=>i.way))].sort(),['down','up'],'both piles are needed');
 ok(ch1.includes('href="#post/messages"')&&ch1.includes(esc(C.ui.offScreen)),'the jobs link where they can and say when they can\'t');
 // Chapter 2: the map, the which-Way puzzle, the plan.
 const ch2=actSixPage(s,{part:'chapter',chapter:'routes'});
 ok(ch2.includes('data-a6-map')&&ch2.includes(`aria-label="${esc(C.routes.scene)}"`),'the described map');
 ok(['river','bridge','ford'].every(w=>ch2.includes(`data-a6-way-choice="${w}"`)&&ch2.includes(`data-a6-way="${w}"`)),'three Ways to choose, all on the map');
 eq(C.routes.ways.filter(w=>!w.feedback).map(w=>w.id),['bridge'],'only the bridge road keeps a parcel dry');
 ok(ch2.includes('data-a6-plan="full"')&&ch2.includes('data-a6-plan="small"')&&ch2.includes('data-a6-plan="later"'),'Keep it, Make it smaller, Not yet');

 // Keeping the plan.
 unchanged(s,()=>{eq(S.keepExchangePlan(s,'later',options),false,'Not yet is never a saved plan');eq(S.keepExchangePlan(s,'full',refuse),false,'a refused export writes nothing');},'and nothing is written');
 ok(S.keepExchangePlan(s,'small',options),'make it smaller');
 eq(s.story.acts.VI.plan,'small','kept as a code');
 const once=clone(s);ok(S.keepExchangePlan(s,'small',options),'the same plan again reports done');eq(s,once,'and writes nothing');
 ok(actSixPage({...s,garden:{guide:'ari'}},{part:'chapter',chapter:'routes'}).includes('Ari: &quot;One Way, once a week'),'the smaller plan has the guide\'s line');
 ok(S.keepExchangePlan(s,'full',options),'keep the whole plan instead');
 eq([s.story.acts.VI.plan,s.story.acts.V],['full',actV],'switching changes only the plan');
 ok(!actSixPage(s,{part:'chapter',chapter:'routes'}).includes('data-a6-plan="later"'),'Not yet is gone once a plan is kept');
 ok(actSixNotes(s).includes('an exchange plan kept'),'Notes');
 ok(actSixPage(s,{part:'hub'}).includes(esc(C.routes.keep.yours)),'the hub says the plan is kept');

 // Saved shapes are read, never repaired.
 const later=clone(s);later.story.acts.VI.plan='a-future-plan';
 eq([S.actSixView(later).plan,S.actSixView(later).earlierPlan],[null,true],'a plan from another version reads as no plan');
 ok(actSixPage(later,{part:'chapter',chapter:'routes'}).includes(esc(C.messages.earlierPlan)),'and says so');
 const bad=clone(s);bad.story.acts.VI.plan=2;unchanged(bad,()=>eq(S.keepExchangePlan(bad,'small',options),false,'a malformed plan is not overwritten'),'and stays');
 ok(actSixPage(bad,{part:'chapter',chapter:'routes'}).includes(esc(C.messages.unreadablePlan))&&!actSixPage(bad,{part:'chapter',chapter:'routes'}).includes('data-a6-plan='),'a malformed plan says so, with no controls');
 ok(actSixNotes(bad).includes('cannot read'),'and Notes say so');
 ok(actSixPage(bad,{part:'chapter',chapter:'exchange'}).includes('data-a6-sort-check'),'everything else stays open');
 const badAct=clone(s);badAct.story.acts.VI=['started'];eq(S.actSixView(badAct).status,'unreadable','a malformed act is unreadable');
 ok(actSixPage(badAct,{part:'hub'}).includes(esc(C.messages.unreadableAct)),'and says so');
 const noEnd=clone(boundSeed());noEnd.story.acts.V.ended=false;eq(S.actSixView(noEnd).canStart,false,'Act VI needs the Act V ending');
 // The shared reading amount works with only Act VI readable.
 const only=sixSeed();only.story.acts={VI:only.story.acts.VI};delete only.story.frameAmount;ok(setActTwoFrameAmount(only,'longer',options)&&only.story.frameAmount==='longer','frame controls work with only Act VI');

 // Every content string comes from act-6.md, letters.md or the 606 companion.
 const sources=['../docs/content/120-story/act-6.md','../docs/content/120-story/letters.md','../docs/content/606-act-six-opening-text.md'].map(f=>readFileSync(new URL(f,import.meta.url),'utf8').replaceAll('**','').replace(/^> ?/gm,'')).join('\n');
 const strings=[];const walk=x=>{if(typeof x==='string')strings.push(x);else if(Array.isArray(x))x.forEach(walk);else if(x&&typeof x==='object')Object.entries(x).forEach(([k,v])=>{if(!['id','href','tier','way'].includes(k))walk(v);});};walk(C);
 for(const t of strings)ok(sources.includes(t),'traced: '+t.slice(0,60));
 return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`Act VI opening: ${runChecks()} checks passed`);
