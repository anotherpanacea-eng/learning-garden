// Synthetic296: source fidelity and state custody, never a writing-quality test.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState,recommendations} from '../dist/core.mjs';
import {keeperStoryContent} from '../dist/keeper-story-content.mjs';
import {makeMapReadingSource} from '../dist/map-reading-content.mjs';
import {prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {recoveryFitsProgressLimits} from '../dist/progress-limits.mjs';
import * as M from '../dist/map-reading-core.mjs';

const clone=structuredClone;
export const mapReport=s=>({title:'After the Storm: observations',exportedAt:'2026-10-29T12:00:00.000Z',note:'A small informal sample, not a grade or mastery assessment.',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:recommendations(s),...s});
export const mapCanExport=s=>prepareProgressImport(JSON.stringify(mapReport(s),null,2)).ok;
export const mapReadyNotebook=()=>({...freshState(),story:{version:1,opening:'returning',arrival:'mended',arrivalChosen:true,acts:{},seenScenes:['inherited-map-read']},syntheticOther:{retained:'Unrelated synthetic notebook content'}});
const options={canExport:mapCanExport};
export function runMapChecks(){
 let checks=0;
 const ok=(x,m)=>{assert.ok(x,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
 const refs=x=>{const out=[],seen=new Set();function walk(x){if(!x||typeof x!=='object'||seen.has(x))return;seen.add(x);for(const k of Reflect.ownKeys(x)){out.push([x,k,x[k]]);walk(x[k]);}}walk(x);return out;};
 const refuse=(s,fn,message)=>{const before=clone(s),r=refs(s),result=fn();ok(!result.ok,message);eq(s,before,'refusal preserves all bytes');for(const [parent,k,value] of r)assert.equal(parent[k],value,'refusal preserves references');checks++;return result;};
 const start=s=>{const r=M.startMapReading(s,options);ok(r.ok&&r.changed&&typeof r.id==='string','explicit Start');return r.id;};
 const packet=(s,id)=>s.mapReading.find(p=>p.id===id);
 const nonowner=s=>Object.fromEntries(Object.entries(s).filter(([k])=>k!=='mapReading'));
 const source=makeMapReadingSource();
 eq(source.lines.map(x=>x.id),['valley','brook','sponge','herons','road','scale']);
 eq(source.lines.map(x=>x.text).join(' '),keeperStoryContent.page.amounts.original.paragraphs[0],'actual canonical text');
 eq(source.original.match(/\[smudged word\]/g)?.length,2);
 for(const key of ['short','longer'])eq(source[key],keeperStoryContent.page.amounts[key].paragraphs.join(' '));
 eq(source.limitation,keeperStoryContent.page.mapLimit);
 ok(M.readableMapSource(source)&&M.mapTeaching(source),'reviewed source/helper readable');
 for(const word of ['Hollis','quarter-hour','s _ _ _ l y'])ok(!JSON.stringify(source).includes(word),'no later identity or invented ink');
 for(const arbitrary of [null,undefined,[],false,0,'text',{},freshState()]){
  const before=arbitrary===undefined?undefined:clone(arbitrary);ok(!M.mapReadingView(arbitrary).canStart,'no implicit eligibility');eq(arbitrary,before,'reader pure');
 }
 const absent=freshState();refuse(absent,()=>M.startMapReading(absent,options),'no reveal bypass');ok(!Object.hasOwn(absent,'mapReading'),'refusal initializes nothing');
 const s=mapReadyNotebook(),outside=clone(nonowner(s)),id=start(s),p=packet(s,id);
 eq(nonowner(s),outside,'start changes only own owner');ok(mapCanExport(s),'actual import gate accepts Notes envelope');
 for(const line of source.lines){
  const original=clone(p.source);ok(M.keepMapLine(s,id,line.id,line.text,options).ok,'literal copy retained');eq(packet(s,id).source,original,'writing never changes source');
 }
 ok(M.keepMapGap(s,id,'water-release','quickly','A possible reading; cannot recover ink.',options).ok,'no keyed guess');
 ok(M.keepMapGap(s,id,'walking-measure','','We cannot identify the word.',options).ok,'blank proposal allowed');
 ok(M.keepMapText(s,id,'comparison','The orchard is current context, not this old paragraph.',options).ok);
 ok(M.supportMapReading(s,id,'example',options).ok);ok(M.supportMapReading(s,id,'together',options).ok);
 ok(M.keepMapText(s,id,'note','The scale is incomplete. Find another source.',options).ok);
 eq(packet(s,id).lines[0].supportBefore.example,false,'later support does not rewrite prior copy');
 eq(packet(s,id).note.supportBefore.example,true,'new writing records actual support');
 eq(nonowner(s),outside,'all writing leaves story and unrelated roots unchanged');
 const r0=s.mapReading,p0=packet(s,id),note0=p0.note;
 const noOp=M.keepMapText(s,id,'note',note0.text,options);ok(noOp.ok&&!noOp.changed,'identical writing no-op');assert.equal(s.mapReading,r0);assert.equal(packet(s,id),p0);assert.equal(packet(s,id).note,note0);checks+=3;
 const supportNoOp=M.supportMapReading(s,id,'example',options);ok(supportNoOp.ok&&!supportNoOp.changed);assert.equal(s.mapReading,r0);checks++;
 refuse(s,()=>M.keepMapLine(s,id,'valley','x'.repeat(4001),options),'bounded line');
 refuse(s,()=>M.keepMapGap(s,id,'missing','x','y',options),'own gap ID required');
 refuse(s,()=>M.keepMapText(s,id,'source','not a writing field',options),'source write refused');
 refuse(s,()=>M.keepMapText(s,id,'note','new',{canExport:()=>false}),'report refusal');
 refuse(s,()=>M.keepMapText(s,id,'note','new',{}),'missing report gate');
 refuse(s,()=>M.keepMapText(s,id,'note','new',{canExport:()=>{throw Error('synthetic');}}),'throwing callback');
 const h=clone(s),hBefore=clone(nonowner(h));
 ok(M.keepMapText(h,id,'note','Safe captured text',{canExport:c=>{c.mapReading[0].note.text='hostile';c.syntheticOther.retained='hostile';return true;}}).ok);
 eq(packet(h,id).note.text,'Safe captured text','captured owner isolates hostile callback');eq(nonowner(h),hBefore,'hostile callback cannot change foreign owner');
 ok(M.keepMapEdition(s,id,options).ok,'partial or full edition can keep');
 const kept=clone(packet(s,id).kept);
 refuse(s,()=>M.keepMapText(s,id,'note','overwrite',options),'kept writing immutable');
 refuse(s,()=>M.supportMapReading(s,id,'narration',options),'kept support immutable');
 const revise=M.reviseMapEdition(s,id,options);ok(revise.ok&&revise.id!==id,'explicit revision new packet');
 eq(packet(s,revise.id).source,packet(s,id).source,'revision frozen source');eq(packet(s,revise.id).note,kept.note,'revision retains support provenance');eq(packet(s,id).kept,kept,'original immutable');
 const damaged=clone(s);packet(damaged,id).lines=false;packet(damaged,id).support='damaged';damaged.story={version:99};
 ok(M.mapReadingView(damaged,id).readable&&!M.mapReadingView(damaged,id).mutable,'readable kept survives damaged draft and story');
 ok(M.reviseMapEdition(damaged,id,options).ok,'revision uses readable kept even with broken story');
 refuse(damaged,()=>M.startMapReading(damaged,options),'new creation still needs story visibility');
 const helper=clone(s);packet(helper,revise.id).source.teaching=false;
 ok(M.mapReadingView(helper,revise.id).readable&&!M.mapReadingView(helper,revise.id).helper,'bad helper cannot close writing');
 refuse(helper,()=>M.supportMapReading(helper,revise.id,'example',options),'no malformed example exposure');
 ok(M.keepMapText(helper,revise.id,'note','Still open.',options).ok,'writing survives malformed helper');
 const earlier=clone(s),old=packet(earlier,revise.id);
 old.source={id:'earlier-map',version:9,title:'Earlier <map>',notice:'Earlier fiction',limitation:'Earlier limit',original:'Earlier source [lost].',short:'Earlier retelling',longer:'Earlier longer text',lines:[{id:'earlier',text:'Earlier source [lost].'}],gaps:[{id:'earlier-gap',lineId:'earlier'}],unknown:{kept:true}};
 old.lines=[{lineId:'earlier',text:'Earlier literal <words>',supportBefore:clone(old.support)}];old.gaps=[];old.note=null;old.comparison=null;
 ok(M.mapReadingView(earlier,revise.id).mutable,'coherent smaller historical source');
 ok(M.keepMapGap(earlier,revise.id,'earlier-gap','earlier proposed','earlier reason',options).ok,'no current gap catalog lookup');
 const freeze=clone(old.source);const actualBefore=keeperStoryContent.page.amounts.original.paragraphs[0];
 try{keeperStoryContent.page.amounts.original.paragraphs[0]='A future source edit.';ok(M.mapReadingView(earlier,revise.id).readable,'current story edit cannot close old source');refuse(earlier,()=>M.startMapReading(earlier,options),'new construction refuses mismatched authored source');eq(packet(earlier,revise.id).source,freeze);}finally{keeperStoryContent.page.amounts.original.paragraphs[0]=actualBefore;}
 for(const value of [false,0,'',{},'future']){const d=clone(earlier);packet(d,revise.id).kept=value;refuse(d,()=>M.keepMapText(d,revise.id,'note','no overwrite',options),'any nonnull kept blocks mutation');}
 for(const value of [null,false,{},'future']){const d=mapReadyNotebook();d.mapReading=value;refuse(d,()=>M.startMapReading(d,options),'unsupported root preserved');}
 const duplicate=clone(s);duplicate.mapReading.push(clone(packet(duplicate,revise.id)));ok(!M.mapReadingView(duplicate,revise.id).readable,'duplicate ambiguous');refuse(duplicate,()=>M.keepMapText(duplicate,revise.id,'note','new',options),'duplicates read-only');ok(M.mapReadingView(duplicate,id).readable,'healthy neighbor open');
 const full=mapReadyNotebook();for(let i=0;i<24;i++)start(full);refuse(full,()=>M.startMapReading(full,options),'raw capacity');ok(M.keepMapText(full,'map-reading-1','note','Existing writing remains open.',options).ok);
 full.mapReading.push({id:'map-reading-500',version:99,raw:{retained:true}});ok(M.mapReadingView(full,'map-reading-1').readable,'over-cap healthy work remains open');refuse(full,()=>M.startMapReading(full,options),'over-cap no eviction');
 const exhaustion=mapReadyNotebook();exhaustion.mapReading=[{id:'map-reading-1000000000',future:true}];refuse(exhaustion,()=>M.startMapReading(exhaustion,options),'ID exhaustion no false capacity');
 const large=mapReadyNotebook();large.syntheticOther.payload='x'.repeat(512*1024);const largeId=start(large);ok(M.keepMapText(large,largeId,'note','Literal <script> is writing.',options).ok);
 const imported=prepareProgressImport(JSON.stringify(mapReport(large),null,2));ok(imported.ok,'real large sibling report round-trip');eq(imported.state.mapReading,large.mapReading,'literal owner import');eq(imported.state.syntheticOther,large.syntheticOther,'large sibling bytes retained');
 const overflow=clone(large);overflow.syntheticOther.payload='';
 const rootBytes=Buffer.byteLength(JSON.stringify(overflow,null,2)),reportBytes=Buffer.byteLength(JSON.stringify(mapReport(overflow),null,2));
 overflow.syntheticOther.payload='x'.repeat(MAX_IMPORT_BYTES-rootBytes-Math.floor((reportBytes-rootBytes)/2));
 ok(recoveryFitsProgressLimits(overflow),'root alone fits: refusal depends on actual whole Notes envelope');
 ok(!mapCanExport(overflow),'whole-report-only overflow detected');refuse(overflow,()=>M.keepMapText(overflow,largeId,'note','Cannot be kept.',options),'actual whole-report-only refusal');
 ok(recoveryFitsProgressLimits(large),'bounded fixture fits recovery');
 return checks;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(`${runMapChecks()} map reading source/core checks passed`);
