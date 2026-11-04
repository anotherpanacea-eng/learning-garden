// Spec335 finite meanings and retained work, using the actual Notes import gate.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {pipsCopyPage,pipsCopyNotes} from '../dist/pips-copy-ui.mjs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {makePipsCopySource,makePipsPageThreeSource,pipsCopyCopy} from '../dist/pips-copy-content.mjs';
import {actFourSeed} from './act-four-checks.mjs';
import {actThreeContent} from '../dist/act-three-content.mjs';
import * as P from '../dist/pips-copy-core.mjs';
import * as E from '../dist/endings-shelf-core.mjs';
import * as S from '../dist/stained-map-core.mjs';
const clone=structuredClone;
const report=s=>({title:'After the Storm: observations',note:'Synthetic postcard work.',exportedAt:'2026-10-31T12:00:00.000Z',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:{reason:'Synthetic report'},...s});
export const canExportPips=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const options={canExport:canExportPips},fresh=()=>initializeExplorerState(freshState());
export const pipsPageThreeSeed=()=>initializeExplorerState(actFourSeed());
export function runChecks(){
 let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;},yes=r=>ok(r.ok,JSON.stringify(r));
 const refusal=(s,fn)=>{const before=clone(s);eq(fn().ok,false);eq(s,before,'refusal preserves the entire notebook');};
 const start=()=>{const s=fresh();yes(P.openPipsTable(s,'postcard',options));return s;};
 const source=makePipsCopySource(),keys={high:'high',advice:'advice',effect:'effect',led:'led'};
 eq(Object.fromEntries(source.postcard.slots.map(x=>[x.id,x.original])),{high:'high',advice:'advise',effect:'affect',led:'lead'});
 eq(Object.fromEntries(source.postcard.slots.map(x=>[x.id,x.key])),keys);
 eq(source.postcard.slots.map(x=>x.choices.findIndex(c=>c.id===x.key)),[1,0,1,2]);
 eq(source.jobs.map(x=>x.choices.findIndex(c=>c.id===x.key)),[2,0,1,0,2]);
 eq(source.jobs.map(x=>x.teach[0].id),['card14-flour','card14','card14-rain','card14-today','card14-which']);
 eq(source.jobs[0].steps.at(-1),'Choose the one with k and ea.');
 eq(source.jobs[2].hint,'Here the sentence names a result of the storm.');
 eq(source.jobs[4].choices.map(x=>[x.id,x.text]),[['witch','Witch'],['wich','Wich'],['which','Which']]);
 eq(source.cards.length,1);ok(source.jobs.every(j=>P.validPipsJob(j)&&j.teach[0].steps.length===3));ok(Object.isFrozen(pipsCopyCopy));
 const detached=makePipsCopySource();detached.postcard.slots[0].original='changed';eq(makePipsCopySource().postcard.slots[0].original,'high');
 const postcard=P.pipsPostcardSource(source),totals={incomplete:0,different:0,fit:0};
 eq(P.pipsWord(postcard,postcard.parts[0],null),'high');eq(P.pipsWord(postcard,postcard.parts[1],postcard.parts[1].choices[1]),'advize');eq(postcard.parts[3].context,{before:'Yesterday the baker ',after:' us to the mill.'});
 for(let code=0;code<256;code++){let value=code;const work={placements:{}};for(const slot of postcard.parts){const pick=value%4;value=Math.floor(value/4);work.placements[slot.id]=pick===3?null:slot.choices[pick].id;}
  const expected=Object.values(work.placements).includes(null)?'incomplete':Object.entries(keys).every(([id,key])=>work.placements[id]===key)?'fit':'different';const result=P.pipsPostcardResult(postcard,work);eq(result.outcome,expected);totals[result.outcome]++;
 }
 eq(totals,{incomplete:175,different:80,fit:1});
 const s=start();eq(P.pipsCopyView(s).postcard.record.work.placements,{high:null,advice:null,effect:null,led:null});
 yes(P.checkPipsPostcard(s,options));eq(s.pipsCopy.postcard.checks.at(-1).outcome,'incomplete');yes(P.keepPipsPostcard(s,options));const first=clone(s.pipsCopy.postcard.firstKept);
 for(const [id,key] of Object.entries(keys))yes(P.placePipsWord(s,id,key,options));yes(P.checkPipsPostcard(s,options));yes(P.keepPipsPostcard(s,options));const latest=clone(s.pipsCopy.postcard.latestKept);
 yes(P.placePipsWord(s,'effect','efect',options));yes(P.checkPipsPostcard(s,options));eq(s.pipsCopy.postcard.checks.at(-1).feedback,[source.copy.different,'The rain: Here the word for the result is effect, with two f\'s.']);
 eq(s.pipsCopy.postcard.firstKept,first);eq(s.pipsCopy.postcard.latestKept,latest);yes(P.keepPipsPostcard(s,options));
 s.pipsCopy.postcard.work.future={opaque:true};s.pipsCopy.postcard.work.placements.future={opaque:[1,2]};yes(P.restorePipsPostcard(s,'first',options));eq(s.pipsCopy.postcard.work.future,{opaque:true});eq(s.pipsCopy.postcard.work.placements.future,{opaque:[1,2]});eq(s.pipsCopy.postcard.firstKept,first);
 yes(P.keepPipsPostcard(s,options));eq(s.pipsCopy.postcard.latestKept.check,null,'latest check does not match the restored draft');
 for(const job of source.jobs){yes(P.openPipsJob(s,job.id,options));yes(P.checkPipsJob(s,job.id,options));eq(s.pipsCopy.items[job.id].checks.at(-1).feedback,[source.copy.jobIncomplete]);
  yes(P.keepPipsJob(s,job.id,options));yes(P.usePipsHelp(s,job.id,'example',options));yes(P.answerPipsJob(s,job.id,job.key,options));yes(P.checkPipsJob(s,job.id,options));eq(s.pipsCopy.items[job.id].checks.at(-1).outcome,'fit');eq(s.pipsCopy.items[job.id].checks.at(-1).guided,true);
  s.pipsCopy.items[job.id].work.future='keep';yes(P.restorePipsJob(s,job.id,'first',options));eq(s.pipsCopy.items[job.id].work,{choice:null,future:'keep'});eq(s.pipsCopy.items[job.id].help.example,true);
 }
 const saved=clone(s);const imported=prepareProgressImport(JSON.stringify(report(s),null,2));ok(imported.ok);eq(imported.state.pipsCopy,s.pipsCopy);eq(s,saved,'import preparation is read-only');
 for(const canExport of [undefined,()=>false,()=>{throw Error('Synthetic refusal');}]){const v=fresh();refusal(v,()=>P.openPipsTable(v,'postcard',{canExport}));}
 const callback=fresh(),beforeOther=clone(callback);yes(P.openPipsTable(callback,'postcard',{canExport:c=>{c.garden={tampered:true};c.pipsCopy={tampered:true};return true;}}));eq(callback.garden,beforeOther.garden);eq(callback.pipsCopy.source.id,source.id);
 refusal(callback,()=>P.placePipsWord(callback,'high','hi',{canExport:c=>{c.garden={tampered:true};return false;}}));
 for(const order of ['pips-first','siblings-first']){const v=fresh();if(order==='pips-first')yes(P.openPipsTable(v,'postcard',options));yes(E.openEndingsTable(v,'letter',options));yes(S.openStainedTable(v,'map',options));if(order==='siblings-first')yes(P.openPipsTable(v,'postcard',options));const e=clone(v.endingsShelf),old=clone(v.spellings);yes(P.placePipsWord(v,'high','hi',options));eq(v.endingsShelf,e);eq(v.spellings,old);}
 const partial=start();partial.pipsCopy.source.postcard.slots.push(clone(partial.pipsCopy.source.postcard.slots[1]));partial.pipsCopy.postcard.work.placements.advice={opaque:'earlier'};const pv=P.pipsCopyView(partial);eq(pv.postcard.source.parts.length,3);ok(pv.postcard.source.partial);ok(pv.postcard.source.segments.some(x=>x.unavailable));
 for(const part of pv.postcard.source.parts)yes(P.placePipsWord(partial,part.id,part.key,options));yes(P.checkPipsPostcard(partial,options));eq(partial.pipsCopy.postcard.checks.at(-1).feedback,[source.copy.partialFit,source.copy.partial]);yes(P.keepPipsPostcard(partial,options));yes(P.restorePipsPostcard(partial,'latest',options));eq(partial.pipsCopy.postcard.work.placements.advice,{opaque:'earlier'});
 const context=start();delete context.pipsCopy.source.postcard.slots[0].context;context.pipsCopy.source.postcard.slots[1].context=[];const cv=P.pipsCopyView(context);eq(cv.postcard.source.parts.length,4);eq(cv.postcard.source.partial,false);eq(cv.postcard.source.parts.slice(0,2).map(x=>x.context),[null,null]);
 const old=start();old.pipsCopy.source.postcard.slots.reverse();old.pipsCopy.source.postcard.slots[0].key='lead';yes(P.placePipsWord(old,'led','lead',options));yes(P.checkPipsPostcard(old,options));const oldChecks=clone(old.pipsCopy.postcard.checks);P.pipsCopyView(old);eq(old.pipsCopy.postcard.checks,oldChecks);
 const oversized=start();oversized.pipsCopy.source.postcard.segments=Array(65).fill({text:'x'});eq(P.pipsCopyView(oversized).postcard.status,'unavailable');yes(P.openPipsJob(oversized,'d1',options));
 const unknown=fresh();unknown.pipsCopy={v:99,future:['raw']};refusal(unknown,()=>P.openPipsTable(unknown,'postcard',options));yes(E.openEndingsTable(unknown,'letter',options));eq(unknown.pipsCopy,{v:99,future:['raw']});
 const badChecks=start();badChecks.pipsCopy.postcard.checks={future:true};refusal(badChecks,()=>P.checkPipsPostcard(badChecks,options));yes(P.placePipsWord(badChecks,'high','high',options));yes(P.keepPipsPostcard(badChecks,options));eq(badChecks.pipsCopy.postcard.latestKept.check,null);eq(badChecks.pipsCopy.postcard.checks,{future:true});
 const max=makePipsCopySource(),base=max.postcard.slots[0];max.postcard.slots=Array.from({length:64},(_,i)=>({...clone(base),id:'slot-'+i}));max.postcard.segments=max.postcard.slots.map(x=>({slotId:x.id}));const mp=P.pipsPostcardSource(max);ok(mp&&mp.parts.length===64);const mr=P.pipsPostcardResult(mp,{placements:Object.fromEntries(mp.parts.map(x=>[x.id,'hi']))});eq(mr.feedback.length,65);
 const capacity=start();let low=0,high=MAX_IMPORT_BYTES;while(low<high){const mid=Math.floor((low+high+1)/2);capacity.syntheticPadding='x'.repeat(mid);if(canExportPips(capacity))low=mid;else high=mid-1;}capacity.syntheticPadding='x'.repeat(low);ok(canExportPips(capacity));refusal(capacity,()=>P.checkPipsPostcard(capacity,options));
 const inherited=start();inherited.pipsCopy.source.postcard.slots[0].choices.push({id:'hasOwnProperty',text:'Synthetic older response'});inherited.pipsCopy.source.postcard.slots[0].different={};yes(P.placePipsWord(inherited,'high','hasOwnProperty',options));yes(P.checkPipsPostcard(inherited,options));eq(inherited.pipsCopy.postcard.checks.at(-1).feedback[1],'The river: '+source.copy.neutral);
 for(const value of [null,[],3,'future',{v:99}]){const v={pipsCopy:value};ok(typeof pipsCopyNotes(v)==='string');ok(typeof pipsCopyPage(v)==='string');}
 const history=start();for(const [id,key] of Object.entries(keys))yes(P.placePipsWord(history,id,id==='effect'?'efect':key,options));yes(P.checkPipsPostcard(history,options));yes(P.keepPipsPostcard(history,options));const oldFirst=clone(history.pipsCopy.postcard.firstKept);yes(P.placePipsWord(history,'effect','effect',options));yes(P.checkPipsPostcard(history,options));yes(P.keepPipsPostcard(history,options));const oldFit=clone(history.pipsCopy.postcard.latestKept);yes(P.placePipsWord(history,'effect','efect',options));yes(P.checkPipsPostcard(history,options));eq(history.pipsCopy.postcard.checks.map(c=>c.outcome),['different','fit','different']);eq(history.pipsCopy.postcard.firstKept,oldFirst);eq(history.pipsCopy.postcard.latestKept,oldFit);
 const revised=start();for(const [id,key] of Object.entries(keys))yes(P.placePipsWord(revised,id,key,options));yes(P.checkPipsPostcard(revised,options));yes(P.placePipsWord(revised,'high','hi',options));ok(!pipsCopyPage(revised).includes(source.copy.fit),'an earlier fit is not presented as feedback for revised work');ok(!pipsCopyNotes(revised).split('<details><summary>Full retained')[0].includes(source.copy.fit),'Notes summary does not pair current work with a different check');
 const html=pipsCopyPage(start());ok(html.includes('high · Not chosen yet'));ok(html.includes('data-pc-panel="original"'));ok(!html.includes('undefined'));
 // Spec357: one fixed, gated child preserves the legacy host and its retained history.
 {
  const o={...options,deck:'page-three'},expected={there:'there',ways:'ways',road:'road',high:'high',need:'need',which:'which',where:'where',too:'too'};
  const originals={there:'Their',ways:'Weighs',road:'rode',high:'hi',need:'knead',which:'witch',where:'wear',too:'to'};
  const alternatives={there:['theyre','there','their'],ways:['ways','ways-possessive','weighs'],road:['rowed','rode','road'],high:['hie','high','hi'],need:['need','kneed','knead'],which:['wich','witch','which'],where:['where','ware','wear'],too:['two','too','to']};
  const newPage=()=>{const v=pipsPageThreeSeed();yes(P.openPipsTable(v,'postcard',o));return v;};
  const raw=makePipsPageThreeSource(),normalized=P.pipsPostcardSource(raw,'page-three');ok(normalized);eq(raw.id,'pips-page-three-357');eq(raw.reference,{title:actThreeContent.page.title,paragraphs:actThreeContent.page.original});eq(raw.jobs,[]);
  eq(Object.fromEntries(normalized.parts.map(g=>[g.id,g.original])),originals);eq(Object.fromEntries(normalized.parts.map(g=>[g.id,g.key])),expected);eq(Object.fromEntries(normalized.parts.map(g=>[g.id,g.choices.map(c=>c.id)])),alternatives);eq(normalized.parts.map(g=>g.choices.findIndex(c=>c.id===g.key)),[1,0,2,1,0,2,0,1]);
  const corrected=normalized.segments.map(x=>Object.hasOwn(x,'text')?x.text:normalized.parts.find(g=>g.id===x.slotId).choices.find(c=>c.id===expected[x.slotId]).text).join('');
  eq(corrected,actThreeContent.page.original.join('\n\n'),'the corrected supplied copy reconstructs the full current canonical page');ok(corrected.endsWith('Those need keeping too. A town that closes them [smudged] finds out where the water goes instead. H.'));
  const all={placements:{...expected}};
  for(const g of normalized.parts){
   const absent=clone(all);delete absent.placements[g.id];eq(P.pipsPostcardResult(normalized,absent).outcome,'incomplete',g.id+' absent is not a decision');
   for(const c of g.choices){const w=clone(all);w.placements[g.id]=c.id;const r=P.pipsPostcardResult(normalized,w);eq(r.outcome,c.id===expected[g.id]?'fit':'different',g.id+' '+c.id+' meaning');if(c.id!==expected[g.id])eq(r.feedback[1],g.label+': '+g.different[c.id]);}
  }
  const page=newPage();ok(!Object.hasOwn(page.pipsCopy,'postcard'),'opening child first never opens the postcard');eq(Object.keys(page.pipsCopy.pageThree).sort(),['postcard','source','v']);eq(page.pipsCopy.view,'postcard');eq(P.pipsCopyView(page).postcard.status,'missing');eq(P.pipsCopyView(page,'page-three').root,page.pipsCopy);eq(page.story,pipsPageThreeSeed().story,'opening does not change the story');
  yes(P.keepPipsPostcard(page,o));const firstChild=clone(page.pipsCopy.pageThree.postcard.firstKept);
  for(const [id,key] of Object.entries(expected))yes(P.placePipsWord(page,id,key,o));yes(P.checkPipsPostcard(page,o));yes(P.keepPipsPostcard(page,o));eq(page.pipsCopy.pageThree.postcard.checks.at(-1).outcome,'fit');const fitKeep=clone(page.pipsCopy.pageThree.postcard.latestKept);
  yes(P.placePipsWord(page,'high','hi',o));yes(P.checkPipsPostcard(page,o));eq(page.pipsCopy.pageThree.postcard.checks.at(-1).outcome,'different');eq(page.pipsCopy.pageThree.postcard.latestKept,fitKeep,'checking never rewrites latest keep');
  page.pipsCopy.pageThree.postcard.work.placements.future={opaque:true};page.pipsCopy.pageThree.postcard.work.future=['raw'];yes(P.restorePipsPostcard(page,'first',o));eq(page.pipsCopy.pageThree.postcard.firstKept,firstChild);eq(page.pipsCopy.pageThree.postcard.work.placements.future,{opaque:true});eq(page.pipsCopy.pageThree.postcard.work.future,['raw']);
  yes(P.openPipsTable(page,'postcard',options));yes(P.placePipsWord(page,'high','hi',options));yes(P.openPipsJob(page,'d1',options));yes(P.keepPipsJob(page,'d1',options));page.pipsCopy.unknown={retained:true};const siblings=clone(page.pipsCopy);yes(P.openPipsTable(page,'postcard',o));yes(P.placePipsWord(page,'there','there',o));const actual=clone(page.pipsCopy);delete actual.pageThree;delete siblings.pageThree;eq(actual,siblings,'child writes preserve every legacy pointer, job and unknown sibling');
  const absentKeep=newPage();delete absentKeep.pipsCopy.pageThree.postcard.work.placements.there;const absentBefore=clone(absentKeep.pipsCopy.pageThree.postcard.work);yes(P.keepPipsPostcard(absentKeep,o));eq(absentKeep.pipsCopy.pageThree.postcard.work,absentBefore,'keeping never fills missing placements');yes(P.placePipsWord(absentKeep,'there','there',o));yes(P.restorePipsPostcard(absentKeep,'first',o));ok(!Object.hasOwn(absentKeep.pipsCopy.pageThree.postcard.work.placements,'there'),'restoring child keeps a missing placement absent');
  const afterChild=clone(page.pipsCopy.pageThree);yes(P.answerPipsJob(page,'d1','kneads',options));eq(page.pipsCopy.pageThree,afterChild,'legacy job write preserves child');
  const imported=prepareProgressImport(JSON.stringify(report(page),null,2));ok(imported.ok);eq(imported.state.pipsCopy,page.pipsCopy,'real pretty Notes roundtrip preserves parent, child and unknowns');
  // A historical source is authoritative, even if title, key, context and reference differ from this release.
  const historical=newPage(),hs=historical.pipsCopy.pageThree.source;hs.id='older-copy';hs.reference.title='An earlier title';hs.reference.paragraphs=['A retained earlier page.'];hs.postcard.slots[0].key='their';hs.postcard.slots[0].referenceText='Their paths are open.';hs.postcard.slots[0].context={before:'',after:' paths are open.'};
  yes(P.placePipsWord(historical,'there','their',o));yes(P.checkPipsPostcard(historical,o));const history=clone(historical.pipsCopy.pageThree.postcard.checks);P.pipsCopyView(historical,'page-three');eq(historical.pipsCopy.pageThree.postcard.checks,history,'historical checks never regraded');eq(P.pipsCopyView(historical,'page-three').postcard.source.reference.title,'An earlier title');eq(P.pipsCopyView(historical,'page-three').postcard.source.parts[0].referenceText,'Their paths are open.');for(const [slot,key] of Object.entries(expected))yes(P.placePipsWord(historical,slot,slot==='there'?'their':key,o));yes(P.checkPipsPostcard(historical,o));eq(historical.pipsCopy.pageThree.postcard.checks.at(-1).outcome,'fit','retained changed key wins over the current canonical spelling');eq(historical.pipsCopy.pageThree.postcard.checks[0],history[0],'later current work never rewrites the old check');
  for(const bad of [undefined,null,[],{},'', '   ',{title:'x',paragraphs:[]},{title:'x',paragraphs:['']},{title:'x',paragraphs:['x'.repeat(4001)]},{title:'x'.repeat(4001),paragraphs:['x']}]){
   const v=newPage();if(bad===undefined)delete v.pipsCopy.pageThree.source.reference;else v.pipsCopy.pageThree.source.reference=bad;
   eq(P.pipsCopyView(v,'page-three').postcard.status,'unavailable','bad reference pauses only child');refusal(v,()=>P.checkPipsPostcard(v,o));yes(P.openPipsTable(v,'postcard',options));
  }
  for(const slot of Object.keys(expected))for(const bad of [undefined,null,7,'','   ','x'.repeat(4001)]){
   const v=newPage(),g=v.pipsCopy.pageThree.source.postcard.slots.find(g=>g.id===slot);if(bad===undefined)delete g.referenceText;else g.referenceText=bad;
   v.pipsCopy.pageThree.postcard.work.placements[slot]={opaque:'raw'};const vs=P.pipsCopyView(v,'page-three').postcard.source;eq(vs.parts.length,7,slot+' bad sentence isolates one slot');ok(vs.partial);ok(!vs.parts.some(g=>g.id===slot));
   for(const g of vs.parts)yes(P.placePipsWord(v,g.id,expected[g.id],o));yes(P.checkPipsPostcard(v,o));eq(v.pipsCopy.pageThree.postcard.checks.at(-1).outcome,'fit');eq(v.pipsCopy.pageThree.postcard.checks.at(-1).feedback,[raw.copy.partialFit,raw.copy.partial]);yes(P.keepPipsPostcard(v,o));yes(P.restorePipsPostcard(v,'latest',o));eq(v.pipsCopy.pageThree.postcard.work.placements[slot],{opaque:'raw'});
  }
  const none=newPage();for(const g of none.pipsCopy.pageThree.source.postcard.slots)delete g.referenceText;eq(P.pipsCopyView(none,'page-three').postcard.status,'unavailable');refusal(none,()=>P.keepPipsPostcard(none,o));
  const duplicate=newPage();duplicate.pipsCopy.pageThree.source.postcard.slots.push(clone(duplicate.pipsCopy.pageThree.source.postcard.slots[0]));eq(P.pipsCopyView(duplicate,'page-three').postcard.source.parts.length,7);ok(P.pipsCopyView(duplicate,'page-three').postcard.source.partial);
  for(const mode of ['missing','ended-only','scene-only','bad-act','bad-story']){
   const v=newPage();if(mode==='missing')delete v.story;else if(mode==='ended-only')v.story.seenScenes=v.story.seenScenes.filter(x=>x!=='ways-page-revealed');else if(mode==='scene-only')v.story.acts.III.ended=false;else if(mode==='bad-act')v.story.acts.III='future';else v.story.version=99;
   const before=clone(v);eq(P.pipsCopyView(v,'page-three').status,'locked');for(const fn of [()=>P.openPipsTable(v,'postcard',o),()=>P.placePipsWord(v,'high','high',o),()=>P.checkPipsPostcard(v,o),()=>P.keepPipsPostcard(v,o),()=>P.restorePipsPostcard(v,'first',o)])refusal(v,fn);eq(v,before,'lost visibility keeps retained material');
  }
  for(const bad of [null,[],{},'future',{v:99,raw:true}]){const v=pipsPageThreeSeed();v.pipsCopy={v:1,source:makePipsCopySource(),items:{},pageThree:bad};refusal(v,()=>P.openPipsTable(v,'postcard',o));yes(P.openPipsTable(v,'postcard',options));eq(v.pipsCopy.pageThree,bad);}
  for(const parent of [null,[],{},'future',{v:99}]){const v=pipsPageThreeSeed();v.pipsCopy=parent;refusal(v,()=>P.openPipsTable(v,'postcard',o));refusal(v,()=>P.openPipsTable(v,'postcard',options));}
  for(const deck of [null,'page-four','postcard',0]){const v=pipsPageThreeSeed();refusal(v,()=>P.openPipsTable(v,'postcard',{...options,deck}));eq(P.pipsCopyView(v,deck).status,'unsupported');}
  for(const fn of [v=>P.openPipsTable(v,'practice',o),v=>P.openPipsJob(v,'d1',o),v=>P.answerPipsJob(v,'d1','kneads',o),v=>P.checkPipsJob(v,'d1',o),v=>P.keepPipsJob(v,'d1',o),v=>P.restorePipsJob(v,'d1','first',o),v=>P.usePipsHelp(v,'d1','hint',o)]){const v=newPage();refusal(v,()=>fn(v));}
  for(const gate of [undefined,()=>false,()=>1,()=>{throw Error('Synthetic refused preflight');}]){
   const v=pipsPageThreeSeed();refusal(v,()=>P.openPipsTable(v,'postcard',{deck:'page-three',canExport:gate}));
   const w=newPage();refusal(w,()=>P.placePipsWord(w,'there','there',{deck:'page-three',canExport:gate}));
  }
  const hostile=newPage();yes(P.openPipsTable(hostile,'postcard',options));yes(P.openPipsJob(hostile,'d1',options));hostile.pipsCopy.unknown={safe:true};hostile.syntheticSibling={safe:true};const parent=clone(hostile.pipsCopy),outside=clone(hostile.syntheticSibling),story=clone(hostile.story);
  yes(P.placePipsWord(hostile,'there','there',{deck:'page-three',canExport:c=>{ok(!!c.pipsCopy.postcard&&!!c.pipsCopy.items.d1&&!!c.syntheticSibling,'preflight sees full parent/notebook');const accepted=canExportPips(c);c.pipsCopy={tampered:true};c.syntheticSibling='tampered';c.story='tampered';return accepted;}}));
  eq(hostile.syntheticSibling,outside);eq(hostile.story,story);const hp=clone(hostile.pipsCopy);delete hp.pageThree;delete parent.pageThree;eq(hp,parent,'whole proposed parent captured before callback mutation');
  const cap=newPage();let low=0,high=MAX_IMPORT_BYTES;while(low<high){const mid=Math.floor((low+high+1)/2);cap.syntheticPadding='x'.repeat(mid);if(canExportPips(cap))low=mid;else high=mid-1;}cap.syntheticPadding='x'.repeat(low);ok(canExportPips(cap));refusal(cap,()=>P.checkPipsPostcard(cap,o));
 }
 {
  const future=pipsPageThreeSeed();future.pipsCopy={v:2,pageThree:{unknown:'retained'}};const before=clone(future),html=pipsCopyNotes(future);
  ok(html.includes(pipsCopyCopy.unsupported),'unsupported parent keeps its own recovery message');ok(!html.includes('The postcard and other jobs are still open.'),'unsupported parent never promises editable legacy games');ok(html.includes('unknown'),'full future child remains in the raw report');eq(future,before,'future Notes remains pure');
 }
 console.log(`Pip's Copy core: ${n} checks passed.`);return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runChecks();
