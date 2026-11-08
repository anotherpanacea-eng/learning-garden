// Spec609 · Act VI ending: page 6, Hollis's letter, and The Opening of the Ways. Fixtures come from the real Act IV–VI
// APIs. Ending the act is story progress only.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {journeySeed} from './act-six-journey-checks.mjs';
import {canExport} from './act-two-checks.mjs';
import * as S from '../dist/act-six-core.mjs';
import {actSixRoute,actSixPage,actSixNotes,actSixInvitation} from '../dist/act-six-ui.mjs';
import {keeperPages} from '../dist/keeper-story-ui.mjs';
import {actSixContent as C} from '../dist/act-six-content.mjs';

const options={canExport},clone=structuredClone,refuse={canExport:()=>false};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function homeSeed(){const s=journeySeed();assert.ok(S.sendFirstParcel(s,options));return s;}

export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const unchanged=(s,fn,label)=>{const before=clone(s);fn();eq(s,before,label);};
 eq(actSixRoute('#almanac/hollis-letter'),{part:'letter'},'page 6 route');
 eq(actSixRoute('#almanac/ways-open'),{part:'ending'},'ending route');

 // The ending needs all three: a kept exchange plan, the long rain, the first journey.
 const early=journeySeed();
 eq(S.actSixView(early).canEnd,false,'not before the first journey');
 unchanged(early,()=>eq(S.endActSix(early,5,options),false,'cannot end yet'),'and nothing is written');
 ok(!actSixPage(early,{part:'chapter',chapter:'journey'}).includes('data-a6e-end'),'no letter before the journey');
 ok(actSixPage(early,{part:'letter'}).includes(esc(C.ending.unreached))&&actSixPage(early,{part:'ending'}).includes(esc(C.ending.unreached)),'page 6 and the ending wait');
 for(const [label,make] of [['no exchange plan',x=>{delete x.story.acts.VI.plan;}],['no warning',x=>{delete x.story.acts.VI.warned;}],['a malformed ended',x=>{x.story.acts.VI.ended='yes';}],['a malformed season',x=>{x.story.acts.VI.season='monsoon';}]]){
  const y=homeSeed();make(y);unchanged(y,()=>eq(S.endActSix(y,5,options),false,'cannot end: '+label),'and nothing is written: '+label);
 }

 // After supper: reading Hollis's letter ends the act.
 const s=homeSeed();
 ok(S.actSixView(s).canEnd&&actSixPage(s,{part:'chapter',chapter:'journey'}).includes('data-a6e-end'),'after supper, the letter is offered');
 unchanged(s,()=>{eq(S.endActSix(s,5,refuse),false,'a refused export writes nothing');eq(S.endActSix(s,12,options),false,'an impossible month is refused');},'and nothing is written');
 const before={IV:clone(s.story.acts.IV),V:clone(s.story.acts.V),plan:s.story.plan};
 ok(S.endActSix(s,5,options),'end the act in June');
 const a=s.story.acts.VI;eq([a.ended,a.season],[true,'summer'],'ended and its season');
 eq([s.story.acts.IV,s.story.acts.V,s.story.plan],[before.IV,before.V,before.plan],'nothing else changes');
 ok(S.endActSix(s,0,options),'ending again reports done');eq(s.story.acts.VI.season,'summer','and keeps the season');
 const preset=homeSeed();preset.story.acts.VI.season='winter';ok(S.endActSix(preset,5,options));eq(preset.story.acts.VI.season,'winter','a saved season is never replaced');

 // Page 6 and the ending.
 const letter=actSixPage(s,{part:'letter'});
 ok(C.ending.page.lines.every(l=>letter.includes(esc(l)))&&letter.includes('href="#almanac/ways-open"'),'Hollis\'s whole letter, then the way to the bridge');
 const end=actSixPage({...s,garden:{guide:'ari'}},{part:'ending'});
 ok(end.includes('data-a6e-ways')&&end.includes('data-a6e-season="summer"')&&end.includes(`aria-label="${esc(C.ending.scene)}"`),'the described ribbons, wearing summer');
 ok(end.includes(esc(C.ending.seasons.summer))&&end.includes(esc(C.ending.almanac.replaceAll('*','')))&&end.includes(esc(C.ending.village.replaceAll('*',''))),'the season, almanac and village lines');
 ok(end.includes(esc(C.ending.short[0]).slice(0,40)),'the ending text');
 const longer=actSixPage({...s,garden:{guide:'ari'},story:{...s.story,frameAmount:'longer'}},{part:'ending'});
 ok(longer.includes('Ari and I will show you')&&!longer.includes('{guide}'),'the longer ending names the guide');
 ok(actSixPage(s,{part:'hub'}).includes('href="#almanac/ways-open"')&&actSixPage(s,{part:'chapter',chapter:'journey'}).includes('href="#almanac/hollis-letter"'),'the hub and chapter 4 link back');
 ok(actSixInvitation(s).includes(esc(C.ending.village.replaceAll('*','')))&&keeperPages(s).includes('href="#almanac/ways-open"'),'the Keeper\'s Pages show the village line and the ending');
 ok(actSixNotes(s).includes('the Ways are open'),'Notes');
 unchanged(s,()=>{actSixPage(s,{part:'letter'});actSixPage(s,{part:'ending'});},'reading page 6 and the ending writes nothing');
 const noStart=homeSeed();noStart.story.acts.VI.ended=true;noStart.story.acts.VI.started=false;eq(S.actSixView(noStart).ended,false,'ended without started is not an ending');
 return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`Act VI ending: ${runChecks()} checks passed`);
