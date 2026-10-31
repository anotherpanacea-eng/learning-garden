// Spec330's finite oracles and synthetic notebooks; no learner records.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {makeStainedMapSource} from '../dist/stained-map-content.mjs';
import * as S from '../dist/stained-map-core.mjs';

const clone=structuredClone;
const report=s=>({title:'After the Storm: observations',exportedAt:'2026-10-31T12:00:00.000Z',note:'Synthetic spelling checks.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:{reason:'Synthetic report'},...s});
export const canExportStained=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const options={canExport:canExportStained};
const fresh=()=>initializeExplorerState(freshState());
const mapKey={high:'gh',knoll:'k',writing:'w',gnat:'g',lamb:'b',thistle:'t',island:'s',sponge:'none'};
const historiesKey={knoll:'once',write:'once',gnat:'once',lamb:'once',high:'once',island:'added',debt:'added',doubt:'added'};
const familiesKey={sign:'signal',muscle:'muscular',bomb:'bombard',solemn:'solemnity',autumn:'autumnal',doubt:'dubious',debt:'debit'};
const jobKey={a1:'gh',a2:{knife:'once',write:'once',island:'added',debt:'added'},a3:'island',a4:'signal',a5:{'statement-1':'false','statement-2':'true','statement-3':'true'}};

export function runChecks(){
 let count=0;
 const eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(a,m)=>{assert.ok(a,m);count++;};
 const accepted=result=>ok(result.ok,JSON.stringify(result));
 const refuse=(s,fn)=>{const before=clone(s);eq(fn().ok,false);eq(s,before,'refusal leaves every root untouched');};
 const open=kind=>{const s=fresh();accepted(S.openStainedTable(s,kind,options));return s;};
 const fill=(s,kind,key)=>{for(const [part,choice] of Object.entries(key))accepted(S.placeStainedCard(s,kind,part,choice,options));};
 const source=makeStainedMapSource();
 for(const [list,key] of [['labels',mapKey],['histories',historiesKey],['families',familiesKey]])eq(Object.fromEntries(source[list].map(p=>[p.id,p.key])),key);
 eq(Object.fromEntries(source.jobs.map(p=>[p.id,p.key])),jobKey);
 eq(source.cards[0].steps[1],'The note says: '+source.labels.find(p=>p.id==='knoll').note);
 eq(source.jobs.map(j=>j.kind==='choice'?j.choices.findIndex(c=>c.id===j.key):null),[0,null,1,2,null]);
 eq(source.jobs[4].choices.map(c=>c.id),['true','false']);
 const independent=makeStainedMapSource();independent.labels[0].note='Synthetic changed note';eq(makeStainedMapSource(),source,'factory clones the full source');
 {
  const s=fresh(),before=clone(s);eq(S.stainedMapView(s).status,'new');eq(s,before,'read does not create root');
  eq(S.stainedMapCards(source).length,4);eq(s,before);
 }
 // All eight literal label restorations, every tile and null, independently specified.
 const restored={high:'High Ford',knoll:'Knoll Wood',writing:'The Writing Stone',gnat:'Gnat Corner',lamb:'Lamb Fold',thistle:'Thistle Bank',island:'The Island',sponge:'The Sponge'};
 for(const part of source.labels){
  for(const tile of [null,...source.tiles]){
   const expected=!part.stains?part.before+part.after:!tile||tile.id==='none'?part.before+'▢'.repeat(part.stains)+part.after:part.before+(part.capitalStart?tile.text[0].toUpperCase()+tile.text.slice(1):tile.text)+part.after;
   eq(S.stainedLabel(part,tile),expected);
   const s=open('map');accepted(S.placeStainedCard(s,'map',part.id,tile?.id??null,options));
   const result=S.checkStainedTable(s,'map',options);accepted(result);eq(result.outcome,'incomplete');
   if(tile){eq(result.feedback.length,2);ok(result.feedback[1].startsWith(part.before+'▢'.repeat(part.stains)+part.after+': '));}
   else eq(result.feedback,[source.copy.incomplete]);
  }
  eq(S.stainedLabel(part,source.tiles.find(t=>t.id===mapKey[part.id])),restored[part.id]);
 }
 eq(S.stainedLabel(source.labels[1],source.tiles[0]),'Ghnoll Wood');
 for(const [kind,key] of [['map',mapKey],['histories',historiesKey],['families',familiesKey]]){
  const s=open(kind);accepted(S.keepStainedTable(s,kind,options));const first=clone(s.spellings.benches[kind].firstKept);eq(first.check,null);
  fill(s,kind,key);accepted(S.checkStainedTable(s,kind,options));let view=S.stainedMapView(s).tables[kind];eq(view.last.outcome,'fit');eq(view.earlier,false);
  accepted(S.openStainedTable(s,kind,options));eq(S.stainedMapView(s).tables[kind].earlier,false,'navigation does not change work');
  accepted(S.keepStainedTable(s,kind,options));eq(s.spellings.benches[kind].firstKept,first);eq(s.spellings.benches[kind].latestKept.check.outcome,'fit');
  const part=view.source.parts[0],wrong=view.source.choices.find(c=>c.id!==key[part.id]);
  accepted(S.placeStainedCard(s,kind,part.id,wrong.id,options));eq(S.stainedMapView(s).tables[kind].earlier,true);
  accepted(S.checkStainedTable(s,kind,options));eq(S.stainedMapView(s).tables[kind].last.outcome,'different');
  accepted(S.placeStainedCard(s,kind,part.id,null,options));accepted(S.checkStainedTable(s,kind,options));eq(S.stainedMapView(s).tables[kind].last.outcome,'incomplete');
  accepted(S.restoreStainedTable(s,kind,'latest',options));eq(s.spellings.benches[kind].work.placements,key);eq(s.spellings.benches[kind].firstKept,first);
  accepted(S.restoreStainedTable(s,kind,'first',options));ok(Object.values(s.spellings.benches[kind].work.placements).every(x=>x===null));
 }
 for(const job of source.jobs){
  const s=fresh();accepted(S.openStainedJob(s,job.id,options));accepted(S.checkStainedJob(s,job.id,options));let record=s.spellings.items[job.id];eq(record.checks[0].outcome,'incomplete');eq(record.checks[0].feedback.at(-1),job.explanation);
  accepted(S.keepStainedJob(s,job.id,options));const first=clone(s.spellings.items[job.id].firstKept);
  if(job.kind==='choice')accepted(S.answerStainedJob(s,job.id,null,jobKey[job.id],options));
  else for(const [part,pick] of Object.entries(jobKey[job.id]))accepted(S.answerStainedJob(s,job.id,part,pick,options));
  accepted(S.useStainedHelp(s,job.id,'hint',options));accepted(S.checkStainedJob(s,job.id,options));record=s.spellings.items[job.id];eq(record.checks.at(-1).outcome,'fit');eq(record.checks.at(-1).supported,true);eq(record.checks.at(-1).guided,true);
  accepted(S.keepStainedJob(s,job.id,options));accepted(S.useStainedHelp(s,job.id,'example',options));accepted(S.restoreStainedJob(s,job.id,'first',options));record=s.spellings.items[job.id];eq(record.help,{hint:true,example:true});eq(record.firstKept,first);
  if(job.kind==='match'){
   for(const part of job.parts){
    accepted(S.restoreStainedJob(s,job.id,'latest',options));const wrong=job.choices.find(c=>c.id!==jobKey[job.id][part.id]);accepted(S.answerStainedJob(s,job.id,part.id,wrong.id,options));
    accepted(S.checkStainedJob(s,job.id,options));const feedback=s.spellings.items[job.id].checks.at(-1).feedback;
    eq(feedback,[part.text+': '+(job.different[part.id]??source.copy.partDifferent),job.explanation]);
   }
   const r=s.spellings.items[job.id];r.source.different={};const result=S.stainedJobResult(r.source,r.work);ok(result.feedback.some(line=>line.endsWith(source.copy.partDifferent)));
  }
 }
 {
  const s=fresh();accepted(S.openStainedJob(s,'a5',options));accepted(S.answerStainedJob(s,'a5','statement-2','true',options));accepted(S.answerStainedJob(s,'a5','statement-3','true',options));accepted(S.checkStainedJob(s,'a5',options));eq(S.stainedMapView(s).current.last.outcome,'incomplete','unanswered universal is not false');
  accepted(S.answerStainedJob(s,'a5','statement-1','false',options));accepted(S.checkStainedJob(s,'a5',options));eq(S.stainedMapView(s).current.last.outcome,'fit');
 }
 // Old source counts, keys, feedback and order own their interpretation.
 {
  const s=open('map');s.spellings.source.labels=s.spellings.source.labels.slice(0,2).reverse();s.spellings.benches.map.work.placements={};
  s.spellings.source.labels[0].key='gh';s.spellings.source.copy.mapDifferent='Synthetic retained message';
  fill(s,'map',{knoll:'gh',high:'gh'});accepted(S.checkStainedTable(s,'map',options));eq(S.stainedMapView(s).tables.map.last.outcome,'fit');
  const historic=clone(s.spellings.benches.map.checks);s.spellings.source.labels[0].key='k';eq(S.stainedMapView(s).tables.map.last.outcome,'fit','saved outcome is not regraded');eq(s.spellings.benches.map.checks,historic);
  accepted(S.placeStainedCard(s,'map','knoll','none',options));accepted(S.checkStainedTable(s,'map',options));ok(s.spellings.benches.map.checks.at(-1).feedback[0].startsWith('▢noll Wood: '));
 }
 {
  const s=open('histories');s.spellings.source.labels.push({...s.spellings.source.labels[0],note:7});const before=clone(s);const v=S.stainedMapView(s);eq(v.tables.map.source.parts.some(p=>p.id==='high'),false,'invalid duplicate also reserves identity');eq(v.tables.histories.status,'ready');eq(s,before);
  s.spellings.benches.histories.firstKept={future:true};accepted(S.placeStainedCard(s,'histories','knoll','once',options));accepted(S.keepStainedTable(s,'histories',options));eq(s.spellings.benches.histories.firstKept,{future:true});
  s.spellings.benches.histories.latestKept={future:true};refuse(s,()=>S.keepStainedTable(s,'histories',options));
  s.spellings.benches.histories.checks={future:true};refuse(s,()=>S.checkStainedTable(s,'histories',options));accepted(S.openStainedJob(s,'a1',options));
  s.spellings.benches={future:true};accepted(S.openStainedJob(s,'a3',options));
 }
 {
  const s=open('practice');accepted(S.openStainedJob(s,'a1',options));s.spellings.source=null;accepted(S.answerStainedJob(s,'a1',null,'gh',options));accepted(S.checkStainedJob(s,'a1',options));eq(S.stainedMapView(s).current.last.outcome,'fit','own frozen job survives unavailable collection');
  const job=clone(source.jobs[0]);job.teach.push({...job.teach[0]});eq(S.validStainedJob(job),false);
 }
 {
  const s=fresh();s.spellings={v:99,future:{raw:'Synthetic future'}};const before=clone(s);eq(S.stainedMapView(s).status,'unsupported');eq(s,before);refuse(s,()=>S.openStainedTable(s,'map',options));
 }
 // Real export preparation, required callback, callback isolation, and exact byte boundary.
 for(const cb of [undefined,()=>false,()=>{throw Error('Synthetic refusal');}]){
  const s=fresh(),o=cb?{canExport:cb}:{};refuse(s,()=>S.openStainedTable(s,'map',o));
  accepted(S.openStainedTable(s,'map',options));refuse(s,()=>S.placeStainedCard(s,'map','high','gh',o));refuse(s,()=>S.checkStainedTable(s,'map',o));refuse(s,()=>S.keepStainedTable(s,'map',o));
 }
 {
  const s=fresh(),before=clone(s);accepted(S.openStainedTable(s,'map',{canExport:c=>{ok(canExportStained(c));c.spellings={v:99};c.story={synthetic:'callback mutation'};return true;}}));eq(s.spellings.v,1);const {spellings,...rest}=s;eq(rest,before,'commit changes only owned root');
  accepted(S.keepStainedTable(s,'map',options));const imported=prepareProgressImport(JSON.stringify(report(s),null,2));ok(imported.ok);eq(imported.state.spellings,s.spellings);
 }
 {
  const s=open('map');let low=0,high=MAX_IMPORT_BYTES;while(low<high){const mid=Math.floor((low+high+1)/2);s.syntheticPadding='x'.repeat(mid);if(canExportStained(s))low=mid;else high=mid-1;}s.syntheticPadding='x'.repeat(low);ok(canExportStained(s));refuse(s,()=>S.checkStainedTable(s,'map',options));
 }
 // A maximum-count, short-label source creates 65 feedback lines, not an unreadable save.
 {
  const s=open('map'),base=clone(source.labels[0]);s.spellings.source.labels=Array.from({length:64},(_,i)=>({...base,id:'label-'+i}));s.spellings.benches.map.work={placements:Object.fromEntries(s.spellings.source.labels.map(p=>[p.id,'gh']))};
  accepted(S.checkStainedTable(s,'map',options));eq(S.stainedMapView(s).tables.map.last.feedback.length,65);accepted(S.keepStainedTable(s,'map',options));eq(S.stainedMapView(s).tables.map.latestStatus,'ready');
 }
 {
  const s=open('map');s.spellings.source.labels=[{...source.labels[0],before:'x'.repeat(4000),after:'y'.repeat(4000)}];s.spellings.benches.map.work={placements:{high:'gh'}};
  accepted(S.checkStainedTable(s,'map',options));ok(S.stainedMapView(s).tables.map.last.feedback[0].length>4000);accepted(S.keepStainedTable(s,'map',options));eq(S.stainedMapView(s).tables.map.latestStatus,'ready');
 }
 return count;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log('Stained Map checks:',runChecks());
