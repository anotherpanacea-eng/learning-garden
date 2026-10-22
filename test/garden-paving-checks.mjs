import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {pavingCases,pavingCopy} from '../dist/garden-paving-content.mjs';
import * as p from '../dist/garden-paving-core.mjs';
import {pavingPage,pavingNotes} from '../dist/garden-paving-ui.mjs';
import {pavingPicture} from '../dist/garden-paving-art.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {noteLegacyExposure} from '../dist/broad-core.mjs';
import {notePendingBrambleFactExposure} from '../dist/post-rival.mjs';
let count=0;const ok=(x,m)=>{assert.ok(x,m);count++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},json=JSON.stringify,copy=structuredClone;
const fresh=()=>initializeExplorerState(freshState()),report=s=>JSON.stringify({title:'Synthetic paving notes',...s},null,2),fits=s=>prepareProgressImport(report(s)).ok,options={canExport:fits,exposeFacts:(pairs,s)=>{for(const pair of pairs){noteLegacyExposure(s,pair);notePendingBrambleFactExposure(s,pair);}}};
let combinations=0;
for(const source of pavingCases){
 ok(p.validPavingSource(source));const n=source.n;eq(source.id,`paving-${n}`);
 for(let mask=0;mask<8;mask++){
  const patches=p.maskPatches(mask),snapshot={source,patches,addedInput:'',totalInput:'',addedMode:'input',totalMode:'input',support:[]},c=p.pavingCounts(snapshot);
  eq(c.addedNow,n*Number(!!(mask&1))+n*Number(!!(mask&2))+Number(!!(mask&4)));eq(c.totalNow,n*n+c.addedNow);eq(p.pavingMask(patches),mask);
  const art=pavingPicture(n,patches),cells=[...art.matchAll(/data-paving-tile="([^"]+)"/g)].map(m=>m[1]);eq(cells.length,c.totalNow);eq(new Set(cells).size,cells.length);eq(cells.filter(x=>x.startsWith('old-')).length,n*n);ok(art.includes(`data-paving-slot="${n}-${n}"`));
  for(const key of ['added','total'])for(const a of [...Array.from({length:145},(_,i)=>i),'blank','unsure']){
   const s={...snapshot,[key+'Input']:typeof a==='number'?String(a):'',[key+'Mode']:a==='unsure'?'unsure':'input'},r=p.pavingResult(s);
   eq(r[key+'Fit'],typeof a==='number'?a===(key==='added'?2*n+1:(n+1)**2):null);eq(r.modelComplete,mask===7);eq(r.totalNow,c.totalNow);ok(p.pavingFeedback(s).includes(`${(n+1)**2} tiles altogether`));combinations++;
  }
 }
}
eq(combinations,25872);
for(const x of ['0','00','00000000',' 7 ','144'])eq(p.parsePaving(x).kind,'number');for(const x of ['+7','-0','7.0','7e0','７','٧','145','abc'])eq(p.parsePaving(x).kind,'invalid');eq(p.parsePaving('  ').kind,'blank');
{
 const s=fresh(),old=json(s);pavingPage(s);pavingNotes(s);eq(json(s),old,'view does not allocate');ok(p.startPaving(s,'paving-3',options));eq(p.pavingView(s).work.page,'learn');eq(p.pavingDisplayPairs(s),[[3,3]]);ok(s.broad.seenFacts.includes('3x3'));
 ok(p.editPaving(s,'page','build',options));ok(p.editPaving(s,'addedInput','7',options));ok(p.editPaving(s,'totalInput','16',options));ok(p.checkPaving(s,options));eq(p.pavingView(s).feedback.result,{addedFit:true,totalFit:true,modelComplete:false,addedNow:0,totalNow:9});ok(s.broad.seenFacts.includes('4x4'),'revealed feedback is budgeted and qualified');ok(p.keepPaving(s,false,options));const kept=copy(p.pavingView(s).kept);
 for(const patch of ['row','column','corner'])ok(p.editPaving(s,'patch',patch,options));ok(p.editPaving(s,'addedInput','16',options));ok(p.editPaving(s,'totalInput','7',options));ok(p.checkPaving(s,options));eq(p.pavingView(s).feedback.result,{addedFit:false,totalFit:false,modelComplete:true,addedNow:7,totalNow:16});eq(p.pavingView(s).kept,kept);
 const id=p.pavingView(s).feedback.id;ok(p.editPaving(s,'page','kept',options));eq(p.pavingView(s).feedback.id,id,'page is not assessed');ok(p.supportPaving(s,'together',options));ok(!p.pavingView(s).feedback);for(let i=0;i<6;i++)ok(p.checkPaving(s,options));eq(p.pavingView(s).readableChecks.length,4);eq(p.pavingView(s).kept,kept);ok(!p.keepPaving(s,false,options));ok(p.keepPaving(s,true,options));
 const r=prepareProgressImport(report(s));ok(r.ok);eq(r.state.gardenPaving,s.gardenPaving);ok(destinationNotes(s).includes('Garden Paving'));ok(!pavingNotes(s).includes('16 tiles'),'closed notes do not render answers');
}
{
 const s=fresh();p.startPaving(s,'paving-3');p.editPaving(s,'addedInput','7e0');let before=json(s);ok(!p.checkPaving(s,options));eq(json(s),before);ok(p.keepPaving(s,false,options),'invalid text may be kept');p.editPaving(s,'addedMode','unsure');p.editPaving(s,'totalMode','unsure');ok(p.checkPaving(s,options));eq(p.pavingView(s).feedback.result.addedFit,null);
 const w=p.pavingView(s).work,c=copy(p.pavingView(s).feedback);w.checks.push({...c,id:500,feedback:'An imported contradiction'},{...c,id:501,result:{...c.result,totalNow:99}},{id:502,future:true});w.kept={future:'raw kept'};w.feedbackId=500;const raw=copy(w.checks.slice(-3));ok(fits(s));eq(p.pavingView(s).rawChecks,raw);ok(!p.pavingView(s).feedback);ok(p.pavingView(s).keptUnreadable);ok(!p.keepPaving(s,true,options));ok(p.checkPaving(s,options));eq(p.pavingView(s).feedback.id,503);eq(p.pavingView(s).rawChecks,raw);
 const valid=copy(p.pavingView(s).feedback);valid.id=600;valid.snapshot=Object.fromEntries(Object.entries(valid.snapshot).reverse());p.pavingView(s).work.checks.push(valid);ok(p.pavingView(s).readableChecks.some(c=>c.id===600),'object-key order is harmless');
 p.pavingView(s).work.checks.push({id:Number.MAX_SAFE_INTEGER,raw:true});before=json(s);ok(!p.checkPaving(s,options));eq(json(s),before);
}
{
 const s=fresh();p.startPaving(s,'paving-3');const w=p.pavingView(s).work;w.source.id='retired-plan';w.source.title='Earlier source';w.source.n=5;w.source.copy.modelIncomplete='An earlier model is still open.';w.source.example={n:2,masks:[0,3,7],captions:['Four old tiles.','Two and two, corner missing.','One corner makes nine.']};s.gardenPaving.cases={'retired-plan':w,'paving-3':false};s.gardenPaving.current='retired-plan';ok(p.pavingView(s).work);ok(p.checkPaving(s,options));ok(p.pavingView(s).feedback.feedback.includes('An earlier model'));ok(p.pavingView(s).feedback.feedback.includes('36 tiles'));ok(!p.startPaving(s,'paving-3',options));ok(p.startPaving(s,'paving-4',options));eq(s.gardenPaving.cases['paving-3'],false);
 const before=copy(s.gardenPaving);ok(p.recoverPaving(s,options));eq(s.gardenPaving.retainedRaw,before);ok(fits(s));
}
{
 const s=fresh();p.startPaving(s,'paving-3');const w=p.pavingView(s).work;for(const key of Object.keys(w.source.copy))w.source.copy[key]='x'.repeat(800);w.source.extra='x'.repeat(3000);ok(p.validPavingSource(w.source));ok(p.checkPaving(s,options),'long source is not capped as feedback');ok(Buffer.byteLength(p.pavingView(s).feedback.feedback)<=4096);ok(json(p.pavingView(s).feedback).length>4096);ok(fits(s));ok(p.editPaving(s,'page','build'));ok(pavingPage(s).includes('Finished goal: 4 × 4 = 16 tiles.'),'checked record displays its own structural fact even when copied prose omits it');
 const old=pavingCases[2].copy.idea;pavingCases[2].copy.idea='Later catalog';ok(p.pavingView(s).work);ok(!pavingPage(s).includes('Later catalog'));pavingCases[2].copy.idea=old;
}
for(const root of [null,false,{version:9,raw:true}]){const s=fresh();s.gardenPaving=root;ok(fits(s),'raw optional root imports');eq(p.pavingView(s).status,'recovery');ok(p.recoverPaving(s,options));eq(s.gardenPaving.retainedRaw,root);}
{
 const s=fresh();p.startPaving(s,'paving-3');p.editPaving(s,'page','build');const before=json(s.gardenPaving);s.padding='';s.padding='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(report(s)));ok(fits(s));const noDisplay={canExport:fits};
 for(const fn of [()=>p.editPaving(s,'addedInput','7',noDisplay),()=>p.supportPaving(s,'help',noDisplay),()=>p.checkPaving(s,noDisplay),()=>p.keepPaving(s,false,noDisplay),()=>p.startPaving(s,'paving-4',noDisplay),()=>p.recoverPaving(s,noDisplay)]){ok(!fn());eq(json(s.gardenPaving),before);}
 const old=json(s);ok(!p.preflightPavingDisplay(s,options),'display exposure alone cannot bypass actual report cap');eq(json(s),old,'no exposure on refusal');delete s.padding;let nested={};for(let i=0;i<58;i++)nested={nested};s.gardenPaving.extra=nested;ok(fits(s));const raw=json(s);ok(!p.recoverPaving(s,options));eq(json(s),raw);
}
{
 const s=fresh();p.startPaving(s,'paving-3');p.editPaving(s,'page','build');for(let mask=0;mask<8;mask++){p.pavingView(s).work.patches=p.maskPatches(mask);const pairs=p.pavingDisplayPairs(s);ok(pairs.some(x=>json(x)==='[3,3]'));eq(pairs.some(x=>json(x)==='[4,4]'),mask===7);eq(pairs.some(x=>json(x)==='[4,3]'),!!(mask&1));eq(pairs.some(x=>json(x)==='[3,4]'),!!(mask&2));}
 eq(p.pavingDisplayPairs(s,{kind:'example',step:1}),[[3,3],[4,3],[3,4]]);eq(p.pavingDisplayPairs(s,{kind:'example',step:2}),[[3,3],[4,3],[3,4],[4,4]]);
}
console.log(`${count} Garden Paving checks passed, including ${combinations} separate proposal/model outcomes.`);
