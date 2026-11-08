// Spec605 · Act V project page and ending. Fixtures come from the real Act IV and V APIs; a project is story progress only.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {startedSeed} from './act-five-checks.mjs';
import {canExport} from './act-two-checks.mjs';
import * as F from '../dist/act-five-core.mjs';
import {actFivePage,actFiveNotes,actFiveRoute} from '../dist/act-five-ui.mjs';
import {actFiveContent as C} from '../dist/act-five-content.mjs';

const options={canExport},clone=structuredClone,refuse={canExport:()=>false};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function keptSeed(path='night-garden',limit='fell-asleep'){const s=startedSeed();for(const ok of [F.chooseActFivePath(s,path,options),F.markActFiveMade(s,path,options),F.setActFiveChange(s,path,'kept',options),F.keepActFiveLimit(s,path,limit,options)])assert.ok(ok);return s;}

export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const unchanged=(s,fn,label)=>{const before=clone(s);fn();eq(s,before,label);};
 eq(actFiveRoute('#almanac/question-of-our-own'),{part:'ending'},'ending route');
 eq(Object.keys(F.actFiveLimits),F.actFivePaths,'three limit cards for every path');
 for(const p of C.paths)eq(p.limits.map(l=>l.id),F.actFiveLimits[p.id],'limit codes match the text: '+p.id);

 // Steps happen only on the chosen path, in order.
 const s=startedSeed();
 unchanged(s,()=>eq(F.markActFiveMade(s,'gazette',options),false,'no project before a path is chosen'),'and nothing is written');
 ok(F.chooseActFivePath(s,'gazette',options),'choose the Gazette');
 let page=actFivePage(s,{part:'path',path:'gazette'});
 ok(page.includes('data-a5-made')&&!page.includes('data-a5-change-save')&&!page.includes(esc(C.paths[1].show)),'only Make is offered first, and the Show line waits');
 unchanged(s,()=>{eq(F.setActFiveChange(s,'gazette','changed',options),false,'no change before a first version');eq(F.keepActFiveLimit(s,'gazette','few-people',options),false,'no limit before a first version');eq(F.markActFiveMade(s,'sky-night',options),false,'no project on another path');},'out-of-order steps write nothing');
 unchanged(s,()=>eq(F.markActFiveMade(s,'gazette',refuse),false,'a refused export writes nothing'),'refusal leaves the notebook unchanged');
 const actIV=clone(s.story.acts.IV);
 ok(F.markActFiveMade(s,'gazette',options),'make a first version');
 eq(s.story.acts.V.projects,{gazette:{made:true}},'the project is a small record');
 const once=clone(s);ok(F.markActFiveMade(s,'gazette',options),'making again reports done');eq(s,once,'and writes nothing');
 page=actFivePage(s,{part:'path',path:'gazette'});
 ok(page.includes(esc(C.paths[1].show))&&page.includes('data-a5-change-save')&&!page.includes('data-a5-limit-save'),'then the Show line and Change');
 unchanged(s,()=>{eq(F.setActFiveChange(s,'gazette','rewritten',options),false,'an unknown change is refused');eq(F.keepActFiveLimit(s,'gazette','few-people',options),false,'no limit before Change');},'and writes nothing');
 ok(F.setActFiveChange(s,'gazette','changed',options),'changed one thing');
 ok(actFivePage(s,{part:'path',path:'gazette'}).includes('data-a5-limit-save'),'then Keep');
 unchanged(s,()=>{eq(F.keepActFiveLimit(s,'gazette','cloudy',options),false,'another path\'s card is refused');eq(F.keepActFiveLimit(s,'gazette','made-up',options),false,'an unknown card is refused');},'and writes nothing');
 ok(F.keepActFiveLimit(s,'gazette','column-unchecked',options),'keep a limit');
 eq(s.story.acts.V.projects.gazette,{made:true,change:'changed',limit:'column-unchecked'},'codes only');
 eq(s.story.acts.IV,actIV,'Act IV is untouched');
 page=actFivePage(s,{part:'path',path:'gazette'});
 ok(page.includes(esc(C.project.pageTitle))&&page.includes(esc("What it can't tell us yet: Bramble's column is not checked."))&&page.includes('data-a5-end'),'the project page, with its limit and the bind button');
 ok(F.setActFiveChange(s,'gazette','kept',options)&&F.keepActFiveLimit(s,'gazette','few-people',options),'choices can change before binding');

 // Switching keeps the project; another path starts its own.
 ok(F.chooseActFivePath(s,'sponge-again',options),'switch paths');
 ok(actFivePage(s,{part:'path',path:'gazette'}).includes(esc(C.project.otherPath)),'the earlier project is kept as it was');
 eq(s.story.acts.V.projects.gazette,{made:true,change:'kept',limit:'few-people'},'and unchanged');
 ok(F.chooseActFivePath(s,'gazette',options),'switch back');

 // The ending binds one complete project, with its season; afterwards everything is a record.
 const v=F.actFiveView(s);
 ok(F.canEndActFive(v,'gazette')&&!F.canEndActFive(v,'sponge-again'),'only a complete project can be bound');
 unchanged(s,()=>eq(F.endActFive(s,'gazette',6,refuse),false,'a refused bind writes nothing'),'refusal leaves it unchanged');
 unchanged(s,()=>eq(F.endActFive(s,'gazette',12,options),false,'an impossible month is refused'),'and writes nothing');
 ok(actFivePage(s,{part:'ending'}).includes(esc(C.messages.endUnreached)),'the ending waits for a bind');
 ok(F.endActFive(s,'gazette',6,options),'bind it in July');
 const a=s.story.acts.V;eq([a.ended,a.kept,a.season,s.story.seenScenes.includes('question-of-our-own')],[true,'gazette','summer',true],'ended, kept, season and scene');
 ok(F.endActFive(s,'gazette',0,options),'binding again reports done');eq(s.story.acts.V.season,'summer','and keeps the season');
 unchanged(s,()=>{eq(F.endActFive(s,'sponge-again',0,options),false,'a second bind is refused');eq(F.chooseActFivePath(s,'sky-night',options),false,'no new path after the ending');eq(F.keepActFiveLimit(s,'gazette','news-after',options),false,'no project edits after the ending');},'after the ending nothing changes');
 const end=actFivePage({...s,garden:{guide:'ari'}},{part:'ending'});
 ok(end.includes('data-a5-binding')&&end.includes('data-a5-season="summer"')&&end.includes(`aria-label="${esc(C.ending.scene)}"`),'the described binding scene wears its season');
 ok(end.includes(esc(C.ending.seasons.summer))&&end.includes('Our project: The Willowbank Gazette. What it can&#39;t tell us yet: We only asked a few people.'),'the season line and the almanac line');
 ok(end.includes(esc(C.ending.short[0]).slice(0,40)),'the ending text');
 ok(actFivePage(s,{part:'hub'}).includes('href="#almanac/question-of-our-own"'),'the hub links the ending');
 page=actFivePage(s,{part:'path',path:'gazette'});
 ok(page.includes(esc(C.project.bound))&&!page.includes('data-a5-end')&&!page.includes('data-a5-limit-save')&&page.includes('disabled'),'the project page is a record now');
 ok(actFiveNotes(s).includes('1 project kept with a limit, a project is bound'),'Notes');

 // Saved shapes are read, never repaired.
 const later=keptSeed('courier-route','goat');later.story.acts.V.projects['courier-route'].limit='a-future-limit';
 ok(F.actFiveView(later).projects['courier-route'].complete,'a limit from another version still counts as stated');
 ok(actFivePage(later,{part:'path',path:'courier-route'}).includes(esc(C.project.limitEarlier)),'and is named plainly');
 for(const [label,make] of [['projects not an object',x=>{x.projects=[];}],['a project not an object',x=>{x.projects['courier-route']='done';}],['made not true',x=>{x.projects['courier-route'].made='yes';}],['a numeric limit',x=>{x.projects['courier-route'].limit=3;}]]){
  const y=keptSeed('courier-route','goat');make(y.story.acts.V);
  unchanged(y,()=>{eq(F.endActFive(y,'courier-route',0,options),false,'cannot bind: '+label);eq(F.setActFiveChange(y,'courier-route','changed',options),false,'cannot edit: '+label);},'unreadable and unchanged: '+label);
 }
 const preset=keptSeed();preset.story.acts.V.season='winter';ok(F.endActFive(preset,'night-garden',6,options));eq(preset.story.acts.V.season,'winter','a saved season is never replaced');
 const unknownKept=clone(s);unknownKept.story.acts.V.kept='a-future-path';
 ok(actFivePage(unknownKept,{part:'ending'}).includes(esc(C.ending.earlierProject)),'a bound project from another version is named plainly');
 const noStart=keptSeed();noStart.story.acts.V.ended=true;noStart.story.acts.V.started=false;eq(F.actFiveView(noStart).ended,false,'ended without started is not an ending');
 return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`Act V projects and ending: ${runChecks()} checks passed`);
