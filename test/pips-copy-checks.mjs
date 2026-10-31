// Spec335 finite meanings and retained work, using the actual Notes import gate.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {pipsCopyPage,pipsCopyNotes} from '../dist/pips-copy-ui.mjs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {makePipsCopySource,pipsCopyCopy} from '../dist/pips-copy-content.mjs';
import * as P from '../dist/pips-copy-core.mjs';
import * as E from '../dist/endings-shelf-core.mjs';
import * as S from '../dist/stained-map-core.mjs';
const clone=structuredClone;
const report=s=>({title:'After the Storm: observations',note:'Synthetic postcard work.',exportedAt:'2026-10-31T12:00:00.000Z',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:{reason:'Synthetic report'},...s});
export const canExportPips=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const options={canExport:canExportPips},fresh=()=>initializeExplorerState(freshState());
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
 const revised=start();for(const [id,key] of Object.entries(keys))yes(P.placePipsWord(revised,id,key,options));yes(P.checkPipsPostcard(revised,options));yes(P.placePipsWord(revised,'high','hi',options));ok(!pipsCopyPage(revised).includes(source.copy.fit),'an earlier fit is not presented as feedback for revised work');ok(!pipsCopyNotes(revised).split('<details><summary>Full retained')[0].includes(source.copy.fit),'Notes summary does not pair current work with a different check');
 const html=pipsCopyPage(start());ok(html.includes('high · Not chosen yet'));ok(html.includes('data-pc-panel="original"'));ok(!html.includes('undefined'));
 console.log(`Pip's Copy core: ${n} checks passed.`);return n;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runChecks();
