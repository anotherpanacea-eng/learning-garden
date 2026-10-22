import assert from 'node:assert/strict';
import {courierPresets,postCourierIdentity,deliveries} from '../dist/post-office-content.mjs';
import {ensurePostOffice,currentPostOffice,startPostOffice,setPostCourier,setPostCourierPortrait,setPostCourierPronouns,appendPostClause,editPostClause,packPostTogether,stepPostRoute,restartPostRoute,setPostReading,setPostPage} from '../dist/post-office-core.mjs';
import {postOfficePage,postOfficeNotes,postMap} from '../dist/post-office-ui.mjs';
import {startPostRival,setRivalInput,submitRival,stepRivalPractice,returnRivalQuestion,solveRivalTogether,bypassRival,continueRival,noteRivalAudio,rivalBlocks} from '../dist/post-rival.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {freshState,STORAGE_KEY} from '../dist/core.mjs';
import {ensureGarden} from '../dist/garden-core.mjs';
let n=0;const check=(v,s)=>{assert.ok(v,s);n++;},eq=(a,b,s)=>{assert.deepEqual(a,b,s);n++;},copy=x=>structuredClone(x);
function state(){const s=freshState();ensureGarden(s);ensurePostOffice(s);return s;}
const s=state(),v=startPostOffice(s,'moss-seeds'),garden=copy(s.garden);packPostTogether(s);appendPostClause(s,'go:orchard');appendPostClause(s,'give:moss');stepPostRoute(s);
const waiting=copy(v);
for(const preset of courierPresets){
 check(setPostCourier(s,preset.id),'preset accepted');const c=postCourierIdentity(s);eq(c.id,preset.id,'title selected');
 if(preset.avatar){eq(c.avatar,preset.avatar,'pictured preset portrait');eq(c.pronouns,preset.pronouns,'pictured preset pronouns');}
 check(postMap(s,v).includes(`data-courier-style="${preset.id}"`),'outfit appears in map');
 check(postOfficePage(s).includes(preset.label),'preset label visible');eq(v,waiting,'costume never alters paused work');eq(s.garden,garden,'guide and garden explorer unchanged');
}
setPostCourier(s,'wizard');setPostCourierPortrait(s,'fern');setPostCourierPronouns(s,'they/them');
eq(postCourierIdentity(s).avatar,'fern','portrait can differ from preset');eq(postCourierIdentity(s).pronouns,'they/them','pronouns can differ from preset');check(postMap(s,v).includes('flying wizard, they/them,'),'accessible map uses selected title and pronouns');
check(!setPostCourierPortrait(s,'unknown')&&!setPostCourierPronouns(s,'unknown'),'invalid character values refused');
const legacy=copy(s);delete legacy.postOffice.courierAvatar;delete legacy.postOffice.courierPronouns;legacy.garden.avatar='reed';const beforeLegacy=copy(legacy);ensurePostOffice(legacy);eq(legacy,beforeLegacy,'legacy paused notebook is not migrated');eq(postCourierIdentity(legacy).avatar,'reed','legacy courier retains explorer portrait');
for(const [key,value] of [['courierAvatar','unknown'],['courierPronouns','unknown']]){const bad=copy(s);bad.postOffice[key]=value;const raw=copy(bad.postOffice);ensurePostOffice(bad);eq(bad.postOffice.kept.payload,raw,'unknown courier fields kept exactly');}
check(startPostRival(s),'can meet rival during a paused delivery');setPostPage(s,'bramble');eq(v.rival.reason,'same-operation','packing support offers another example of that operation');
const parcel=copy(v.packing),flight=copy(v.playback),clauses=copy(v.clauses);setPostReading(s,'independent');
check(rivalBlocks(v)&&!stepPostRoute(s),'question blocks flight without advancing');eq(v.playback,flight,'question preserves pending handoff');
setRivalInput(s,'5');submitRival(s);check(v.rival.phase==='practice'&&v.rival.attempts.length===1,'miss opens practice');eq(v.rival.attempts[0].afterSupport,false,'miss retained before help');
for(const step of [0,1,2]){while(v.rival.practiceStep<step)stepRivalPractice(s,1);const html=postOfficePage(s);check(html.includes('A smaller ribbon puzzle'),'practice visible');check(html.includes(v.rival.task.practice.prompt),'separate example prompt remains');if(step>=1)check(html.includes('Count so far: 4, 8'),'group count progress has a spoken equivalent');if(step===2)check(html.includes('2 × 4 = 8'),'stepped explanation finishes with helper equation');}
returnRivalQuestion(s);eq(v.rival.input,'5','attempt input stays after practice');noteRivalAudio(s);setRivalInput(s,'12');submitRival(s);
check(v.rival.phase==='resolved'&&!stepPostRoute(s),'resolved waits for manual continuation');eq(v.rival.attempts.at(-1).afterSupport,true,'retry records support');
eq(v.packing,parcel,'rival never changes packed order');eq(v.clauses,clauses,'rival never changes route');eq(v.playback,flight,'rival never advances route');eq(v.reading,'independent','reading report retained');check(!v.support.audioRequested,'rival narration does not masquerade as order narration');
const snapshot=copy(s);postOfficePage(s);postOfficeNotes(s);eq(s,snapshot,'all rendered phases are pure');
const notes=postOfficeNotes(s);check(notes.includes('after support')&&notes.includes('Narration requested: yes'),'rival support appears separately in notes');
continueRival(s);check(stepPostRoute(s)&&v.completed,'same pending handoff continues');check(postOfficePage(s).includes('Your parcel has arrived. This encounter stays in your delivery notebook.'),'completed parcel is no longer described as waiting');const completed=copy(v);check(!startPostRival(s)&&!submitRival(s),'completed encounter cannot replay as a fresh answer');eq(v,completed,'terminal work unchanged');
restartPostRoute(s);stepPostRoute(s);stepPostRoute(s);eq(v.checks.length,completed.checks.length,'replay adds no delivery completion');
const q=state(),qv=startPostOffice(q,'clover-buns');startPostRival(q,true);const unpacked=copy(qv.packing);eq(qv.rival.phase,'practice','practice available before packing');solveRivalTogether(q);continueRival(q);eq(qv.packing,unpacked,'solving rival never packs real parcel');stepPostRoute(q);eq(qv.playback.cursor,0,'real packing is still required');
const b=state(),bv=startPostOffice(b,'ember-ribbons');packPostTogether(b);appendPostClause(b,'go:hill');appendPostClause(b,'give:ember');startPostRival(b);setRivalInput(b,'unsubmitted');const encounter=copy(bv.rival);editPostClause(b,0,'remove');restartPostRoute(b);eq(bv.rival,encounter,'editing/restart retains rival task and raw input');bypassRival(b);check(!rivalBlocks(bv)&&!bv.completed,'quiet route unlocks flight without false completion');eq(bv.rival.attempts,[],'bypass is no answer attempt');
for(const phase of ['question','practice','resolved','continued','bypassed']){
 const a=state(),av=startPostOffice(a,'dot-stars');startPostRival(a,phase==='practice');
 if(['resolved','continued'].includes(phase))solveRivalTogether(a);
 if(phase==='continued')continueRival(a);if(phase==='bypassed')bypassRival(a);
 const raw=JSON.stringify(a),r=JSON.parse(raw);ensurePostOffice(r);eq(JSON.stringify(r),raw,`${phase} reload exact`);
 const before=copy(r);postOfficePage(r);postOfficeNotes(r);eq(r,before,`${phase} rendering does not mutate`);
 const bad=copy(a);bad.postOffice.visits[0].rival.task.a=999;const kept=copy(bad.postOffice.visits[0].rival);ensurePostOffice(bad);check(currentPostOffice(bad).closed,'malformed rival closes visit');eq(currentPostOffice(bad).rival,kept,'malformed rival exact payload kept');
}
class Storage{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
const disk=new Storage(),store=new ExplorerStore(disk),one=store.load();ensureGarden(one);ensurePostOffice(one);startPostOffice(one,'purl-blankets');setPostCourier(one,'sorcerer');startPostRival(one,true);stepRivalPractice(one,1);const id=store.active.id;store.save(one);
const restored=new ExplorerStore(disk).load();eq(restored.postOffice,one.postOffice,'actual storage preserves costume, encounter and helper position');
const two=store.add({avatar:'reed',color:'blue',symbol:'shell'},one);check(!two.postOffice,'another explorer has no shared rival');eq(store.select(id,two).postOffice,one.postOffice,'returning explorer keeps exact encounter');
const exported=JSON.parse(JSON.stringify(one));eq(exported.postOffice,one.postOffice,'export serialization retains all rival data');store.setPersistence(false,one);check(![...disk.data.keys()].some(k=>k.startsWith(STORAGE_KEY)),'save off removes encounter copies');check(!store.clearActive().postOffice,'reset clears current rival and courier');
console.log(`${n} courier, rival rendering and integrated storage checks passed.`);
