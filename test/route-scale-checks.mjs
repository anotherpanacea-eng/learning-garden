import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {generatedBroad} from '../dist/broad-variants.mjs';
import {noteLegacyExposure,itemById} from '../dist/broad-core.mjs';
import {noteGardenFactExposure,startVisit} from '../dist/garden-core.mjs';
import {notePendingBrambleFactExposure,startAdaptiveRival,generateRivalTask} from '../dist/post-rival.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {checkin} from '../dist/content.mjs';
import {initialScale,changeScale,scaleGeometry,scaleDisplayPairs,scaleReadouts,scaleNarration,recordScaleDisplay,scalePage,resetScaleSession} from '../dist/route-scale.mjs';
let count=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(a,m)=>{assert.ok(a,m);count++;},clone=structuredClone;
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
// Execute the actual host seam, not a second test implementation of exposure.
const seam=app.slice(app.indexOf('function exposeStoryFacts('),app.indexOf('\nfunction requestParis('));
const expose=new Function('noteLegacyExposure','noteGardenFactExposure','notePendingBrambleFactExposure','checkin',`return (${seam})`)(noteLegacyExposure,noteGardenFactExposure,notePendingBrambleFactExposure,checkin);
const fresh=()=>initializeExplorerState(freshState());
const report=s=>({title:'After the Storm: observations',exportedAt:'2026-10-22T00:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
const canExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const options={canExport,exposeFacts:(pairs,candidate)=>expose({facts:pairs},null,candidate,true)};
for(const key of [2,4])for(const compare of [false,true]){
 const v={key,compare,undo:null},s=fresh(),before=clone(s),g=scaleGeometry(key);
 eq(g.east*key,8);eq(g.north*key,4);eq(g.edges*key,12);eq(g.east/g.north,2);
 eq(scaleDisplayPairs(v).length,compare?7:key===2?4:3);ok(recordScaleDisplay(s,v,options).ok);
 for(const [a,b]of scaleDisplayPairs(v)){ok(s.exposures.includes(`${a}x${b}`));ok(s.broad.seenFacts.includes([a,b].sort((a,b)=>a-b).join('x')));}
 const recorded=clone(s);eq(recordScaleDisplay(s,v,options),{ok:true,changed:false},'view is idempotent');eq(s,recorded);
 eq(s.practice,before.practice);eq(s.baseline.observations,before.baseline.observations);eq(s.puzzles,before.puzzles);eq(s.sessions,before.sessions);
 for(const action of ['key','compare']){
  const next=changeScale(v,action,key===2?4:2);ok(next);eq(changeScale(next,'undo'),v,'one-step Undo exact');eq(changeScale(changeScale(next,'undo'),'undo'),null);
 }
 eq(changeScale(v,'key',key),null);eq(changeScale(v,'unknown'),null);
 const narration=scaleNarration(v);for(const k of compare?[key,key===2?4:2]:[key])for(const t of scaleReadouts(k))ok(narration.includes(t));
}
eq(scaleDisplayPairs(initialScale()),[[1,2],[4,2],[2,2],[6,2]],'single-edge unit relation is included');
// Actual waiting Broad and Garden drafts, matching in either orientation.
for(const pair of [[4,2],[2,4]]){
 const s=fresh();
 s.broad.drafts['activity:synthetic']={attempts:[],question:{...clone(itemById('groups')),id:'synthetic',fact:pair},input:'unsubmitted',model:{future:true}};
 // Unknown frozen question/model is deliberately not readable: cleanup must refuse.
 const before=clone(s);ok(!recordScaleDisplay(s,initialScale(),options).ok);eq(s,before,'old unknown question is preserved on refusal');
}
{
 const s=fresh(),q=generatedBroad(itemById('operations-anchor'),'scale-11');
 s.broad.drafts['activity:'+q.id]={attempts:[],question:q,input:'unsubmitted'};
 s.broad.drafts['activity:operations-anchor-alt']={attempts:[],input:'other'};
 s.baseline.draft={questionId:'groups',attempts:[],input:'waiting'};
 const v=startVisit(s,'message');v.drafts['message-markers']={attempts:[],input:'waiting'};
 const before=clone(s);ok(recordScaleDisplay(s,{key:4,compare:false,undo:null},options).ok);
 eq(s.broad.drafts['activity:'+q.id].knownFact,true,'valid frozen Broad reversed pair qualifies');
 eq(s.broad.drafts['activity:operations-anchor-alt'].knownFact,undefined,'nonmatching Broad stays unqualified');
 eq(s.garden.visits.find(x=>x.id===v.id).drafts['message-markers'].knownFact,true,'waiting Garden fact qualifies');
 eq(s.baseline.draft.exposed,true,'matching baseline qualifies reversed pair');
 delete s.broad.drafts['activity:'+q.id].knownFact;delete s.garden.visits.find(x=>x.id===v.id).drafts['message-markers'].knownFact;delete s.baseline.draft.exposed;
 eq(s.broad.drafts,before.broad.drafts,'all other Broad fields exact');eq(s.garden.visits,before.garden.visits,'all other story fields exact');eq(s.baseline,before.baseline,'baseline attempts/reply exact');
}
for(const change of [s=>s.broad.observations.push({future:'raw'}),s=>s.broad.seenVariants.push({future:'raw'}),s=>s.broad.drafts.future={raw:{reply:'untouched'}},s=>s.garden.visits.push({id:'future',version:99,raw:'kept'}),s=>s.garden.seen.push('future-unknown')]){
 const s=fresh();change(s);const before=clone(s);ok(!recordScaleDisplay(s,initialScale(),options).ok,'helper cleanup refuses');eq(s,before,'nested raw work is exact');
}
for(const change of [s=>s.future={unknown:[1,2]},s=>s.cartographer={version:77,raw:'kept'},s=>delete s.cartographer]){
 const s=fresh();change(s);const before=clone(s);ok(recordScaleDisplay(s,initialScale(),options).ok);eq(s.future,before.future);eq(s.cartographer,before.cartographer);
}
{
 const s=fresh(),v=startPostOffice(s,deliveries[0].id);ok(startAdaptiveRival(s));v.rival.task=generateRivalTask('multiply',2,4,0);const before=clone(s.postOffice);ok(recordScaleDisplay(s,initialScale(),options).ok);eq(s.postOffice.visits.find(x=>x.id===v.id).rival.priorFactShown,true,'pending Bramble qualifies reversed pair');delete s.postOffice.visits.find(x=>x.id===v.id).rival.priorFactShown;eq(s.postOffice,before,'all other Bramble work is unchanged');
}
{
 const s=freshState();ok(recordScaleDisplay(s,initialScale(),options).ok,'missing helper roots initialize normally');ok(!Object.hasOwn(s,'cartographer'));ok(!Object.hasOwn(s,'routeScale'));
}
{
 const s=fresh(),v=startPostOffice(s,deliveries[0].id);ok(startAdaptiveRival(s));v.rival.task=generateRivalTask('multiply',2,4,0);ok(recordScaleDisplay(s,initialScale(),options).ok);delete s.postOffice.visits.find(x=>x.id===v.id).rival.priorFactShown;
 s.padding='';s.padding='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(JSON.stringify(report(s),null,2))-1);
 ok(canExport(s),'actual pretty report fits just below limit before pending flag');
 const before=clone(s);ok(!recordScaleDisplay(s,initialScale(),options).ok,'pending-flag-only report growth refuses atomically');eq(s,before,'failed flag-only transaction exact');
 s.padding=s.padding.slice(0,-100);ok(recordScaleDisplay(s,initialScale(),options).ok,'same pending flag fits after real room exists');
}
for(const opt of [{...options,canExport:()=>false},{...options,exposeFacts:()=>{throw Error('unreadable');}},{...options,canExport:()=>{throw Error('wrapper');}}]){
 const s=fresh(),before=clone(s);eq(recordScaleDisplay(s,initialScale(),opt),{ok:false,changed:false});eq(s,before);
}
{
 const s=fresh();s.raw='ü'.repeat(MAX_IMPORT_BYTES/2);const before=clone(s);ok(!recordScaleDisplay(s,initialScale(),options).ok,'UTF8 actual report bound');eq(s,before);
}
{
 const s=fresh();let n=s;s.raw={};n=s.raw;for(let i=0;i<61;i++)n=n.next={};const before=clone(s);ok(!recordScaleDisplay(s,initialScale(),options).ok,'raw depth bound');eq(s,before);
}
{
 const s=fresh();resetScaleSession();const before=clone(s),html=scalePage(s,'synthetic',{...options,canExport:()=>false});ok(html.includes('data-scale-blocked'));ok(!html.includes('Invented town route')&&!html.includes('<svg')&&!html.includes('data-speak='),'initial refusal is source-free');eq(s,before);resetScaleSession();
}
ok(app.indexOf('if(scaleBench){')<app.indexOf('  ensureGarden(state);'),'route precedes host normalizers');
// Both labels already used U+00A0 at f87; explicit escapes make that intent inspectable.
const routeSource=fs.readFileSync(new URL('../dist/route-scale.mjs',import.meta.url),'utf8');
const unitEscape=String.raw`\u00a0`;
ok(routeSource.includes('${key}'+unitEscape+'m</h2>'),'heading source has an explicit nonbreaking unit separator');
ok(routeSource.includes('${k}'+unitEscape+'m per edge'),'key-button source has an explicit nonbreaking unit separator');
resetScaleSession();const unitHtml=scalePage(fresh(),'synthetic-unit-labels',options);
ok(unitHtml.includes('1 edge represents 2\u00a0m</h2>'),'rendered heading uses U+00A0');
for(const k of [2,4])ok(unitHtml.includes(`${k}\u00a0m per edge`),'rendered key label uses U+00A0');
resetScaleSession();
console.log(`${count} route-scale source checks passed.`);
