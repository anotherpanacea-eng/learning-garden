// Spec604 · Act V opening. Fixtures come from the real Act IV APIs; choosing a path is story progress, not a learning result.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {meetingSeed} from './act-four-meeting-checks.mjs';
import {canExport} from './act-two-checks.mjs';
import {keepActFourPlan,endActFour} from '../dist/act-four-core.mjs';
import * as F from '../dist/act-five-core.mjs';
import {actFiveRoute,actFivePage,actFiveInvitation,actFiveNotes} from '../dist/act-five-ui.mjs';
import {actFourPage} from '../dist/act-four-ui.mjs';
import {keeperPages} from '../dist/keeper-story-ui.mjs';
import {actFiveContent as C} from '../dist/act-five-content.mjs';

const options={canExport},clone=structuredClone;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function endedSeed(){const s=meetingSeed();assert.ok(keepActFourPlan(s,'sponge',null,options));assert.ok(endActFour(s,0,options));return s;}
export function startedSeed(){const s=endedSeed();assert.ok(F.startActFive(s,options));return s;}

export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const unchanged=(s,fn,label)=>{const before=clone(s);fn();eq(s,before,label);};

 // Routes: the page, the hub, the six paths; an unknown segment falls back to the hub.
 eq(actFiveRoute('#almanac/next-keeper'),{part:'page'},'page 5 route');
 eq(actFiveRoute('#almanac/own-question'),{part:'hub'},'hub route');
 for(const id of F.actFivePaths)eq(actFiveRoute('#almanac/own-question/'+id),{part:'path',path:id},'path route '+id);
 eq(actFiveRoute('#almanac/own-question/elsewhere'),{part:'hub'},'an unknown path falls back to the hub');
 eq(actFiveRoute('#almanac/two-stories'),null,'Act IV routes are not Act V');
 eq(F.actFivePaths,C.paths.map(p=>p.id),'one content entry per path, in order');

 // Before the meeting ends, Act V cannot start and writes nothing.
 const early=meetingSeed();assert.ok(keepActFourPlan(early,'wall',null,options));
 eq([F.actFiveView(early).canStart,actFiveInvitation(early)],[false,''],'no invitation before the meeting ends');
 unchanged(early,()=>eq(F.startActFive(early,options),false,'cannot start before the ending'),'and nothing is written');
 ok(actFivePage(early,{part:'hub'}).includes(esc(C.messages.unreached)),'the hub says it opens later');

 // After the ending: the invitation, then Continue the story starts the act and frees Page 5 together.
 const s=endedSeed();
 ok(F.actFiveView(s).canStart&&actFiveInvitation(s).includes('data-a5-start'),'the invitation offers Continue the story');
 ok(actFourPage(s,{part:'ending'}).includes('data-a5-start'),'under the Act IV ending');
 ok(keeperPages(s).includes('data-a5-start'),'and on the Keeper\'s Pages');
 unchanged(s,()=>{F.actFiveView(s);actFivePage(s,{part:'hub'});actFivePage(s,{part:'page'});actFiveNotes(s);actFiveInvitation(s);},'reads and renders write nothing');
 unchanged(s,()=>eq(F.startActFive(s,{canExport:()=>false}),false,'a refused export writes nothing'),'refusal leaves the notebook unchanged');
 const actIV=clone(s.story.acts.IV);
 ok(F.startActFive(s,options),'start Act V');
 eq(s.story.acts.V,{started:true},'Act V is a small record');
 ok(s.story.seenScenes.includes('next-keeper-page-revealed')&&F.actFiveView(s).pageVisible,'page 5 is freed with the start');
 eq(s.story.acts.IV,actIV,'starting Act V leaves Act IV unchanged');
 ok(F.startActFive(s,options),'starting again reports done');
 ok(actFiveInvitation(s).includes('href="#almanac/own-question"'),'once started, the invitation links to the hub');

 // Page 5.
 const pg=actFivePage(s,{part:'page'});
 ok(pg.includes(esc(C.page.title))&&pg.includes('data-a5-pages')&&pg.includes(`aria-label="${esc(C.page.scene)}"`),'page 5 with its described scene');
 ok(pg.includes(`>${esc(C.page.heading)}</text>`)&&pg.includes(`class="a5-edge">${C.page.edge}<`),'the handwritten heading and the edge word');
 ok(pg.includes('Blank pages are the best kind of invitation'),'the guide line');

 // The hub: opening, six paths, the six steps.
 const hub=actFivePage({...s,garden:{guide:'ari'}},{part:'hub'});
 ok(F.actFivePaths.every(id=>hub.includes(`href="#almanac/own-question/${id}"`)),'the hub links all six paths');
 ok(C.steps.list.every(x=>hub.includes(`<strong>${esc(x.name)}.</strong>`)),'the six project steps');
 ok(hub.includes('Ari sits down on the bakery step')||hub.includes('says Ari'),'the guide is named in the opening');
 ok(!hub.includes('{guide}')&&!hub.includes('{courier}'),'no placeholder is left');

 // A path page: jobs link to activities that exist; choosing writes one code; switching keeps everything else.
 const path=actFivePage(s,{part:'path',path:'courier-route'});
 ok(path.includes('href="#workshop/maps"')&&path.includes('href="#workshop/scale"'),'the courier route links its jobs');
 ok(path.includes('The courier: ')&&!path.includes('{courier}'),'an unchosen courier reads as the courier');
 ok(path.includes('data-a5-choose="courier-route"')&&path.includes('href="#workshop/fair"'),'a choose button and the Question Bench for the Ask step');
 ok(actFivePage(s,{part:'path',path:'sponge-again'}).includes(esc(C.chosen.offScreen))&&!actFivePage(s,{part:'path',path:'sponge-again'}).includes('href="#living/notebook"'),'a job no activity can do is marked as away from the screen, with no link');
 ok(actFivePage(s,{part:'path',path:'sky-night'}).split('href="#almanac/sky"').length===3,'both Moon jobs go to Sky notes');
 unchanged(s,()=>eq(F.chooseActFivePath(s,'not-a-path',options),false,'an unknown path cannot be chosen'),'and writes nothing');
 unchanged(s,()=>eq(F.chooseActFivePath(s,'gazette',{canExport:()=>false}),false,'a refused choice writes nothing'),'refusal leaves it unchanged');
 ok(F.chooseActFivePath(s,'gazette',options),'choose the Gazette');
 eq(s.story.acts.V,{started:true,path:'gazette'},'the path is kept as a code');
 const before=clone(s);ok(F.chooseActFivePath(s,'gazette',options),'choosing the same path again reports done');eq(s,before,'and writes nothing');
 ok(actFivePage(s,{part:'path',path:'gazette'}).includes('data-a5-chosen'),'the chosen path says so');
 ok(actFivePage(s,{part:'hub'}).includes('data-a5-path="gazette" data-a5-current="true"'),'the hub marks the chosen path');
 ok(F.chooseActFivePath(s,'sponge-again',options),'switch paths');
 eq([s.story.acts.V.path,s.story.acts.IV],['sponge-again',actIV],'switching changes only the path');
 ok(actFiveNotes(s).includes('project path: The Sponge, again'),'Notes name the path');

 // Saved shapes are read, never repaired. An unknown path code from another version reads as no path.
 const later=clone(s);later.story.acts.V.path='a-future-path';
 eq([F.actFiveView(later).path,F.actFiveView(later).earlierPath],[null,true],'a path from another version reads as no path');
 ok(actFivePage(later,{part:'hub'}).includes(esc(C.chosen.earlier)),'and the hub says so');
 unchanged(later,()=>actFivePage(later,{part:'hub'}),'without rewriting it');
 const bad=clone(s);bad.story.acts.V.path=7;eq([F.actFiveView(bad).pathStatus,F.actFiveView(bad).canChoose],['unreadable',false],'a malformed path is unreadable and not overwritten');
 const badAct=clone(s);badAct.story.acts.V='started';eq(F.actFiveView(badAct).status,'unreadable','a malformed act reads as unreadable');
 ok(actFivePage(badAct,{part:'hub'}).includes(esc(C.messages.unreadableAct)),'and says so');
 const noEnd=clone(s);noEnd.story.acts.IV.ended=false;delete noEnd.story.acts.V;eq(F.actFiveView(noEnd).canStart,false,'Act V needs the Act IV ending');

 // Every content string comes from act-5.md, the 120 companion or the 604 companion.
 const sources=['../docs/content/120-story/act-5.md','../docs/content/120-keeper-of-the-ways-text.md','../docs/content/604-act-five-opening-text.md','../docs/content/605-act-five-projects-text.md'].map(f=>readFileSync(new URL(f,import.meta.url),'utf8').replaceAll('**','')).join('\n');
 const strings=[];const walk=x=>{if(typeof x==='string')strings.push(x);else if(Array.isArray(x))x.forEach(walk);else if(x&&typeof x==='object')Object.entries(x).forEach(([k,v])=>{if(!['id','href','tier','askHref'].includes(k))walk(v);});};walk(C);
 for(const t of strings)ok(sources.includes(t),'traced: '+t.slice(0,60));
 return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`Act V opening: ${runChecks()} checks passed`);
