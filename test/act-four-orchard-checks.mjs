// Spec601 · Act IV chapter 2. Fixtures come from the real Act IV and Rain Paths APIs; story offers are not learning results.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {actFourHosts} from './act-four-checks.mjs';
import {canExport} from './act-two-checks.mjs';
import * as A from '../dist/act-four-core.mjs';
import {actFourPage,actFourNotes,actFourReturn,actFourRoute} from '../dist/act-four-ui.mjs';
import {actFourContent as C} from '../dist/act-four-content.mjs';
import {ensureRainPaths,chooseRainCase,nextRainPhase,keepRainResult} from '../dist/rain-paths-core.mjs';
import {rainCaseById} from '../dist/rain-paths-content.mjs';
import {guides} from '../dist/companions.mjs';

const options={canExport},clone=structuredClone;
function keepRain(s,caseId){
 ensureRainPaths(s);assert.ok(chooseRainCase(s,caseId));
 while(nextRainPhase(s));
 assert.ok(keepRainResult(s),'a completed run can be kept');
}
export function orchardSeed(){const s=actFourHosts();assert.ok(A.startActFour(s,options));return s;}

export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;};
 const unchanged=(s,fn,label)=>{const before=clone(s);fn();eq(s,before,label);};

 eq(A.actFourLiveChapters,['account','orchard'],'two chapters have readers; gazette and meeting stay reserved');
 eq(actFourRoute('#almanac/two-stories/orchard'),{part:'chapter',chapter:'orchard'},'chapter 2 route');
 eq(actFourRoute('#almanac/two-stories/gazette'),{part:'hub'},'a reserved chapter still falls back to the hub');

 // No Rain Paths root, or no kept result yet.
 const s=orchardSeed();
 eq(A.actFourView(s).sources.orchard,{status:'missing',retainedUnreadable:false,candidates:[]},'no Rain Paths root reads as missing');
 ensureRainPaths(s);chooseRainCase(s,'cover-12');nextRainPhase(s);
 eq(A.actFourCandidates(s,'orchard'),[],'an unfinished, unkept run offers nothing');
 ok(actFourPage(s,{part:'chapter',chapter:'orchard'}).includes(C.orchard.noWork),'the chapter says nothing is ready yet');

 // Real keeps make candidates, one per kept case, labelled by case and never by outcome.
 keepRain(s,'cover-12');keepRain(s,'space-24');
 const cands=A.actFourCandidates(s,'orchard');
 eq(cands.map(c=>c.ref),[{caseId:'cover-12'},{caseId:'space-24'}],'one candidate per kept case');
 eq(cands.map(c=>c.key),[JSON.stringify(['orchard','cover-12']),JSON.stringify(['orchard','space-24'])],'deterministic keys');
 eq(cands[0].caseLabel,rainCaseById('cover-12').label,'labelled by the case');
 unchanged(s,()=>{A.actFourView(s);A.actFourCandidates(s,'orchard');actFourPage(s,{part:'chapter',chapter:'orchard'});actFourNotes(s);},'reads and renders write nothing');

 // Keeping again after another run does not change the frozen kept result, so the candidate stays the same.
 const before=clone(s.rainPaths.cases['cover-12'].keptResult);keepRain(s,'cover-12');
 eq(s.rainPaths.cases['cover-12'].keptResult,before,'the kept result is frozen at its first keep');

 // Offering: atomic refusal, one receipt, a repeat is a no-op, chapter 1 untouched.
 unchanged(s,()=>eq(A.offerActFour(s,'orchard',cands[0].key,{canExport:()=>false}),false,'a refused export writes nothing'),'refusal leaves the whole notebook unchanged');
 eq(A.offerActFour(s,'orchard','not-a-key',options),false,'an unknown key is refused');
 const accountBefore=clone(s.story.acts.IV.contributions.account??null);
 ok(A.offerActFour(s,'orchard',cands[0].key,options),'offer a kept rain result');
 eq(s.story.acts.IV.contributions.orchard,{kind:'act-four-offer',version:1,chapter:'orchard',activity:'rain-paths',artifactKind:'kept-result',ref:{caseId:'cover-12'}},'the receipt holds ids only');
 eq(s.story.acts.IV.contributions.account??null,accountBefore,'chapter 1 is untouched');
 eq(A.actFourView(s).chapterStatus.orchard,'ready');
 ok(A.offerActFour(s,'orchard',cands[1].key,options),'offering again reports done');
 eq(s.story.acts.IV.contributions.orchard.ref,{caseId:'cover-12'},'the first receipt is kept');

 // Host removal and damage never revoke the receipt.
 const removed=clone(s);delete removed.rainPaths;eq(A.actFourView(removed).chapterStatus.orchard,'ready','removing Rain Paths keeps the receipt');
 const damaged=clone(s);damaged.rainPaths='broken';eq(A.actFourView(damaged).chapterStatus.orchard,'ready','a broken host keeps the receipt');

 // Chapter 1 still works after chapter 2.
 const c1=A.actFourCandidates(s,'account');ok(c1.length>=1,'chapter 1 still has its ledger note');
 ok(A.offerActFour(s,'account',c1[0].key,options),'chapter 1 can still be offered');
 eq(Object.keys(s.story.acts.IV.contributions).sort(),['account','orchard'],'both chapters hold one receipt');

 // Unreadable siblings are omitted and kept raw; an unsupported root offers nothing.
 const t=orchardSeed();keepRain(t,'cover-12');keepRain(t,'cover-24');
 t.rainPaths.cases['cover-24'].keptResult.rows=[];
 t.rainPaths.cases['flood-99']={keptResult:{caseId:'flood-99'}};
 const rawBefore=clone(t.rainPaths);
 const src=A.actFourView(t).sources.orchard;
 eq(src.candidates.map(c=>c.ref.caseId),['cover-12'],'only the readable kept case is offered');
 ok(src.retainedUnreadable,'unreadable and unknown cases are reported, not hidden');
 eq(t.rainPaths,rawBefore,'unreadable entries stay exactly as saved');
 const u=clone(t);u.rainPaths.version=2;eq(A.actFourView(u).sources.orchard.status,'unreadable','an unsupported root reads as unreadable');eq(A.actFourCandidates(u,'orchard'),[],'and offers nothing');
 const w=clone(t);w.rainPaths.cases['cover-12'].keptResult={...w.rainPaths.cases['cover-12'].keptResult,caseId:'space-12'};eq(A.actFourCandidates(w,'orchard').length,0,'a kept result filed under the wrong case is not offered');

 // Receipt validation is shape only.
 const good={kind:'act-four-offer',version:1,chapter:'orchard',activity:'rain-paths',artifactKind:'kept-result',ref:{caseId:'cover-12'}};
 ok(A.validActFourOffer(good),'a well-formed receipt');
 ok(A.validActFourOffer({...good,ref:{caseId:'a-future-case'}}),'a case id from a later version is still a readable receipt');
 for(const [label,bad] of [['activity',{...good,activity:'ledger-gauge'}],['kind',{...good,artifactKind:'evidence-note'}],['extra ref key',{...good,ref:{caseId:'cover-12',x:1}}],['empty id',{...good,ref:{caseId:''}}],['version',{...good,version:2}],['chapter mismatch',{...good,chapter:'gazette'}]])ok(!A.validActFourOffer(bad),'rejects '+label);
 eq(A.offerActFour(t,'gazette','x',options),false,'a reserved chapter cannot be offered');

 // Before Act IV starts, nothing can be offered.
 const early=actFourHosts();keepRain(early,'cover-12');
 unchanged(early,()=>eq(A.offerActFour(early,'orchard',A.actFourCandidates(early,'orchard')[0]?.key,options),false,'no offer before Act IV starts'),'and nothing is written');

 // Rendering: the hub lists both chapters; chapter 2 has its scene, host link, kept line and guide line.
 const hub=actFourPage(s,{part:'hub'});
 ok(hub.includes('#almanac/two-stories/account')&&hub.includes('#almanac/two-stories/orchard'),'the hub links both chapters');
 const page=actFourPage({...s,garden:{guide:'ari'}},{part:'chapter',chapter:'orchard'});
 ok(page.includes('data-a4-corner')&&page.includes(`aria-label="${C.orchard.scene}"`),'the chapter shows the corner scene with its description');
 ok(page.includes('href="#science/rain"'),'the chapter links Rain Paths');
 ok(page.includes(C.orchard.kept)&&page.includes(C.orchard.offered),'after an offer, the kept line shows');
 ok(page.includes('Ari looks at the trays'),'the guide line names the chosen guide');
 ok(!page.includes(C.guideChecking[0].replace('{guide}','Ari')),'chapter 2 does not repeat chapter 1’s guide line');
 eq(actFourPage(s,{part:'chapter',chapter:'nonsense'}),actFourPage(s,{part:'chapter',chapter:'account'}),'an unknown chapter id renders chapter 1, as before');
 ok(actFourNotes(s).includes('chapter 2 has work'),'Notes name chapter 2');
 ok(actFourReturn(s,'orchard').includes('#almanac/two-stories/orchard'),'the return link on Rain Paths goes to chapter 2');
 eq(actFourReturn(actFourHosts(),'orchard'),'','no return link before Act IV starts');
 ok(guides.length===3,'three guides');
 return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`Act IV chapter 2: ${runChecks()} checks passed`);
