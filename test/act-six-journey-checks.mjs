// Spec608 · Act VI chapter 4, the first journey and someone new. Fixtures come from the real Act IV–VI APIs. Sending the
// first parcel is story progress only.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {rainSeed} from './act-six-rain-checks.mjs';
import {canExport} from './act-two-checks.mjs';
import * as S from '../dist/act-six-core.mjs';
import {actSixRoute,actSixPage,actSixNotes} from '../dist/act-six-ui.mjs';
import {actSixContent as C} from '../dist/act-six-content.mjs';

const options={canExport},clone=structuredClone,refuse={canExport:()=>false};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function journeySeed(){const s=rainSeed();assert.ok(S.sendWarning(s,options));return s;}
const page=s=>actSixPage(s,{part:'chapter',chapter:'journey'});

export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const unchanged=(s,fn,label)=>{const before=clone(s);fn();eq(s,before,label);};
 eq(actSixRoute('#almanac/opening-ways/journey'),{part:'chapter',chapter:'journey'},'chapter 4 route');

 // The gate: the warning first.
 const early=rainSeed();
 ok(page(early).includes(esc(C.journey.gate))&&page(early).includes('href="#almanac/opening-ways/long-rain"')&&!page(early).includes('data-a6h-send'),'chapter 4 waits for the warning');
 unchanged(early,()=>eq(S.sendFirstParcel(early,options),false,'no parcel before the warning'),'and nothing is written');

 // Before sending: the chapter, the packing game, honest jobs; Hollis waits.
 const s=journeySeed();
 const p=page({...s,garden:{guide:'ari'}});
 ok(p.includes(esc(C.journey.short[0]))&&C.journey.pack.items.every(i=>p.includes(`data-a6h-pack="${i.id}"`)),'the chapter and the parcel');
 ok(p.includes('href="#workshop/maps"')&&p.includes('href="#post/messages"'),'the jobs link to their places');
 ok(p.includes('data-a6h-send')&&!p.includes('data-a6h-home')&&!p.includes(esc(C.journey.letter.title)),'Send, and Léon and Hollis wait');
 ok(!p.includes('{courier}')&&!p.includes('{guide}'),'no placeholder is left');

 // Sending the first parcel is the one write.
 unchanged(s,()=>{S.actSixView(s);page(s);actSixNotes(s);},'reads and renders write nothing');
 unchanged(s,()=>eq(S.sendFirstParcel(s,refuse),false,'a refused export writes nothing'),'refusal leaves it unchanged');
 const before={IV:clone(s.story.acts.IV),V:clone(s.story.acts.V),plan:s.story.plan};
 ok(S.sendFirstParcel(s,options),'send the first parcel');
 eq(s.story.acts.VI,{started:true,plan:'full',warned:true,journey:true},'the journey is a small record');
 eq([s.story.acts.IV,s.story.acts.V,s.story.plan],[before.IV,before.V,before.plan],'nothing else changes');
 const once=clone(s);ok(S.sendFirstParcel(s,options),'sending again reports done');eq(s,once,'and writes nothing');
 const after=page({...s,garden:{guide:'ari'}});
 ok(after.includes(esc(C.journey.letter.lines[0]))&&after.includes('data-a6h-home')&&after.includes(`aria-label="${esc(C.journey.home.scene)}"`),'Léon\'s letter and the described homecoming');
 ok(after.includes(esc(C.journey.home.short[0]))&&after.includes(esc(C.journey.home.supper)),'Hollis comes home and stays for supper');
 ok(!after.includes('data-a6h-send'),'the parcel is sent');
 ok(actSixNotes(s).includes('the first parcel sent and Hollis home'),'Notes');
 ok(actSixPage(s,{part:'hub'}).includes('href="#almanac/opening-ways/journey"'),'the hub links chapter 4');

 // Saved shapes.
 const odd=journeySeed();odd.story.acts.VI.journey='yes';eq([S.actSixView(odd).journey,S.actSixView(odd).canSendParcel],[false,false],'a malformed journey is not a journey and is not overwritten');
 unchanged(odd,()=>S.sendFirstParcel(odd,options),'and stays');
 const noWarn=journeySeed();noWarn.story.acts.VI.journey=true;delete noWarn.story.acts.VI.warned;eq(S.actSixView(noWarn).journey,false,'a journey without the warning is not read as made');
 return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`Act VI first journey: ${runChecks()} checks passed`);
