import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {applyStartingChoices,freshStartingDraft,currentStartingChoice,startingDraftDescription} from '../dist/starting-flow-core.mjs';
import {startingReadingAmount,parisLengths,frenchLengths} from '../dist/reading-amounts.mjs';
import {parisPlan} from '../dist/paris-core.mjs';
import {frenchPlan} from '../dist/french-core.mjs';
import {parisStories} from '../dist/paris-library.mjs';
import {startVisit,storyDraft} from '../dist/garden-core.mjs';
import {nextGuest,orderFor,adjustBite,checkPlate,submitCafeNumber} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const report=new Function('recommendations','explorerStore',app.split('\n').find(l=>l.startsWith('function notesReport('))+';return notesReport;')(recommendations,{active:{avatar:'sky',color:'gold',symbol:'leaf'}});
const canExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const seed=()=>{const s=initializeExplorerState(freshState());s.garden.start={math:'sapling',future:{raw:'Synthetic future preference'}};s.garden.cafeStart='follow';s.future={raw:'Synthetic <future> notebook'};nextGuest(s);startVisit(s,'paris',{destination:'bookstall',variant:1});storyDraft(s).input='Synthetic waiting reply';startVisit(s,'french',{destination:'river',variant:3});const pack=parisStories.find(s=>s.packId);startVisit(s,'paris',{destination:pack.destination,variant:2,storyId:pack.id});s.baseline.draft={questionId:'groups',attempts:[],input:'Synthetic math reply'};return s;};
const protectedBook=s=>{const c=structuredClone(s);delete c.garden.start;delete c.garden.cafeStart;return c;};
for(const math of ['keep','small','all'])for(const reading of ['keep','auto',1,2,3])for(const french of ['keep','auto',1,2,3]){
 const s=seed(),before=structuredClone(s),autoEnglish=parisPlan(s,'bookstall'),autoFrench=frenchPlan(s,'bookstall'),d={math,reading,french};let calls=0;
 const result=applyStartingChoices(s,d,c=>{calls++;return canExport(c);});ok(result.ok,'each of75finite drafts applies');eq(protectedBook(s),protectedBook(before),'all pending/source/stock/history/cursors exact');eq(s.garden.start.future,before.garden.start.future);
 for(const k of ['reading','french'])eq(startingReadingAmount(s,k),d[k]==='keep'?'auto':d[k]);
 eq(s.garden.start.math,math==='small'?'sprout':'sapling','same-output full follow preserves Sapling');eq(s.garden.cafeStart,'follow');eq(parisPlan(s,'bookstall'),autoEnglish,'English automatic algorithm unchanged');eq(frenchPlan(s,'bookstall'),autoFrench,'French automatic algorithm unchanged');eq(calls,Object.values(d).every(x=>x==='keep')?0:1);ok(canExport(s));
 const imported=prepareProgressImport(JSON.stringify(report(s),null,2));eq(imported.state.garden.start,s.garden.start,'actual report/import preferences');eq(imported.state.garden.visits,s.garden.visits,'frozen visits survive actual import');
}
for(const stage of ['plate','total','stock','repair']){const s=seed();if(stage==='repair')checkPlate(s);else if(stage!=='plate'){const o=orderFor(s.cafe),food=ingredients.find(i=>o.wanted.every(p=>i.properties.includes(p)));for(let j=0;j<o.bites;j++)adjustBite(s,food.id,1);ok(checkPlate(s));if(stage==='stock')ok(submitCafeNumber(s,o.total));}eq(s.cafe.current.stage,stage==='repair'?'plate':stage);if(stage==='repair')ok(s.cafe.current.repair.open);const before=structuredClone(s);ok(applyStartingChoices(s,{math:'small',reading:3,french:1},canExport).ok);eq(protectedBook(s),protectedBook(before));}
for(const bad of [null,[],42,'future'])for(const container of ['garden','start']){const s=seed();if(container==='garden')s.garden=bad;else s.garden.start=bad;const before=structuredClone(s);eq(startingReadingAmount(s,'reading'),'auto');eq(currentStartingChoice(s,'reading'),'Keep existing choices');ok(applyStartingChoices(s,freshStartingDraft(),()=>{throw Error('no preflight for allKeep');}).ok);eq(s,before);ok(!applyStartingChoices(s,{math:'small',reading:3,french:'keep'},canExport).ok);eq(s,before);}
for(const d of [{math:'wrong',reading:1,french:2},{math:'small',reading:'3',french:2},{math:'all',reading:1,french:99},{...freshStartingDraft(),extra:true}]){const s=seed(),before=structuredClone(s);ok(!applyStartingChoices(s,d,canExport).ok);eq(s,before);}
for(const mutate of [s=>s.garden.start.reading={future:'raw'},s=>s.garden.start.reading='3']){const s=seed();mutate(s);const before=structuredClone(s);eq(startingReadingAmount(s,'reading'),'auto');eq(currentStartingChoice(s,'reading'),'Keep existing choices');eq(s,before);ok(applyStartingChoices(s,{math:'keep',reading:'keep',french:1},canExport).ok);eq(s.garden.start.reading,before.garden.start.reading);}
{const s=seed(),before=structuredClone(s);eq(applyStartingChoices(s,{math:'all',reading:'keep',french:'keep'},canExport),{ok:true,changed:false});eq(s,before);s.garden.cafeStart='local';ok(applyStartingChoices(s,{math:'all',reading:'keep',french:'keep'},canExport).changed);eq(s.garden.start.math,'seedling');}
{const s=seed();s.padding='x'.repeat(MAX_IMPORT_BYTES);const before=structuredClone(s);ok(!applyStartingChoices(s,{math:'small',reading:1,french:2},canExport).ok);eq(s,before);ok(applyStartingChoices(s,freshStartingDraft(),canExport).ok);eq(s,before);}
{const s=seed();s.padding='';const bytes=new TextEncoder().encode(JSON.stringify(report(s),null,2)).length;s.padding='x'.repeat(MAX_IMPORT_BYTES-bytes+1);ok(new TextEncoder().encode(JSON.stringify(s)).length<MAX_IMPORT_BYTES,'bare state fits but actual pretty report does not');const before=structuredClone(s);ok(!applyStartingChoices(s,{math:'small',reading:1,french:2},canExport).ok);eq(s,before,'failed composite has no partial math write');}
{const s=initializeExplorerState(freshState());eq(currentStartingChoice(s,'reading'),'Use suggestions');eq(currentStartingChoice(s,'french'),'Use suggestions');eq(startingDraftDescription(freshStartingDraft(),'reading'),'Keep existing English choice');ok(Object.isFrozen(parisLengths)&&Object.isFrozen(frenchLengths));}
console.log(`Starting flow: ${n} finite choice/preservation checks passed.`);
