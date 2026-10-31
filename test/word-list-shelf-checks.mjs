// Synthetic saved-work tests against the real progress-import boundary.
import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {makeWordListShelfSource,wordListShelfCopy} from '../dist/word-list-shelf-content.mjs';
import {validStainedJob} from '../dist/stained-map-core.mjs';
import * as C from '../dist/word-list-shelf-core.mjs';
import * as P from '../dist/pips-copy-core.mjs';
import * as E from '../dist/endings-shelf-core.mjs';
import {wordListShelfPage,wordListShelfNotes,wordListShelfSpeech} from '../dist/word-list-shelf-ui.mjs';
const clone=structuredClone, fresh=()=>initializeExplorerState(freshState());
const report=s=>({title:'After the Storm: observations',note:'Synthetic word study.',exportedAt:'2026-10-31T13:00:00.000Z',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:{reason:'Synthetic report'},...s});
const canExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok;
const options={canExport};let n=0;
const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(v,m)=>{assert.ok(v,m);n++;},yes=r=>ok(r.ok,JSON.stringify(r));
const refuse=(s,f)=>{const before=clone(s);eq(f().ok,false);eq(s,before,'refused mutation preserves the whole notebook');};
const start=()=>{const s=fresh();yes(C.openWordListShelf(s,options));return s;};
const matchAll=s=>{for(const w of C.wordListShelfView(s).shelf.playable)yes(C.placeWordListCard(s,w.id,w.clues[0].trayId,options));};

const source=makeWordListShelfSource();
eq(source.words.length,20);eq(source.words.flatMap(w=>w.clues).length,24);
eq(source.jobs.map(j=>j.choices.findIndex(c=>c.id===j.key)),[1,0,2]);ok(source.jobs.every(validStainedJob));
eq(source.jobs[0].choices[0].text.split('m').length-1,1);eq(source.jobs[0].different.a,"This spelling needs two m's: accommodate.");
eq(source.jobs.map(j=>j.steps.length),[3,0,0]);ok(source.jobs.every(j=>j.teach.length===1&&j.teach[0].steps.length===3));
ok(Object.isFrozen(wordListShelfCopy));source.words[0].text='changed';eq(makeWordListShelfSource().words[0].text,'accommodate');
const empty=fresh(),untouched=clone(empty);eq(C.wordListShelfView(empty).status,'new');eq(empty,untouched);refuse(empty,()=>C.skipWordListJob(empty,'e1',options));

// Independent finite oracle for the three overlapping cards, including null.
const short=makeWordListShelfSource();short.words=short.words.filter(w=>['sufficient','foreign','muscle'].includes(w.id));
const ss=C.wordListShelfSource(short),expected={sufficient:['double','ending','ie'],foreign:['quiet','ie'],muscle:['quiet','family']};
const totals={incomplete:0,discussion:0,listed:0},trays=[null,'double','quiet','family','ending','ie'];
for(let code=0;code<216;code++){
 let v=code;const placements={};for(const w of ss.words){placements[w.id]=trays[v%6];v=Math.floor(v/6);}
 const status=Object.values(placements).includes(null)?'incomplete':Object.entries(placements).every(([id,t])=>expected[id].includes(t))?'listed':'discussion';
 const result=C.wordListShelfResult(ss,{placements,help:[]});eq(result.status,status);eq(result.coverage,'full');totals[status]++;
 ok(result.rows.every(r=>['unplaced','listed','discuss'].includes(r.outcome)));ok(!result.rows.some(r=>r.feedback.includes('wrong')));
}
eq(totals,{incomplete:91,discussion:113,listed:12});
for(const [key,choices] of Object.entries(expected))for(const tray of choices){const s=start();yes(C.placeWordListCard(s,key,tray,options));yes(C.checkWordListShelf(s,options));eq(s.wordListShelf.shelf.checks.at(-1).rows.find(r=>r.id===key).outcome,'listed');}

const s=start();eq(s.wordListShelf.shelf.help,[]);yes(C.checkWordListShelf(s,options));eq(s.wordListShelf.shelf.checks.at(-1).status,'incomplete');yes(C.keepWordListShelf(s,options));
const first=clone(s.wordListShelf.shelf.firstKept);matchAll(s);yes(C.checkWordListShelf(s,options));eq(s.wordListShelf.shelf.checks.at(-1).status,'listed');yes(C.keepWordListShelf(s,options));const latest=clone(s.wordListShelf.shelf.latestKept);
yes(C.placeWordListCard(s,'yacht','double',options));ok(C.wordListShelfView(s).shelf.earlier);yes(C.checkWordListShelf(s,options));eq(s.wordListShelf.shelf.checks.at(-1).status,'discussion');eq(s.wordListShelf.shelf.firstKept,first);eq(s.wordListShelf.shelf.latestKept,latest);
yes(C.useWordListShelfHelp(s,'example',options));yes(C.useWordListShelfHelp(s,'example',options));eq(s.wordListShelf.shelf.help,['example']);
s.wordListShelf.shelf.future={held:true};s.wordListShelf.shelf.placements.retired={raw:[1,2]};
yes(C.restoreWordListShelf(s,'first',options));eq(s.wordListShelf.shelf.help,['example']);eq(s.wordListShelf.shelf.future,{held:true});eq(s.wordListShelf.shelf.placements.retired,{raw:[1,2]});
yes(C.keepWordListShelf(s,options));eq(s.wordListShelf.shelf.latestKept.check,null);eq(s.wordListShelf.shelf.firstKept,first);

// Opaque and duplicate addresses stay raw; matching subsets get partial copy.
const partial=start();partial.wordListShelf.source.words.push({id:'foreign',text:42,clues:[]});partial.wordListShelf.shelf.placements.sufficient='retired-tray';partial.wordListShelf.shelf.placements.foreign={raw:true};partial.wordListShelf.shelf.placements.future='opaque';
const pv=C.wordListShelfView(partial);ok(!pv.shelf.source.words.some(w=>w.id==='foreign'));eq(pv.shelf.opaque.map(w=>w.id),['sufficient']);
refuse(partial,()=>C.placeWordListCard(partial,'sufficient','double',options));matchAll(partial);yes(C.checkWordListShelf(partial,options));
const pc=partial.wordListShelf.shelf.checks.at(-1);eq(pc.status,'listed');eq(pc.coverage,'partial');eq(pc.summary,partial.wordListShelf.source.copy.partialListed);ok(pc.notice);ok(!pc.rows.some(r=>['foreign','sufficient'].includes(r.id)));
yes(C.keepWordListShelf(partial,options));yes(C.restoreWordListShelf(partial,'latest',options));eq(partial.wordListShelf.shelf.placements.sufficient,'retired-tray');eq(partial.wordListShelf.shelf.placements.foreign,{raw:true});eq(partial.wordListShelf.shelf.placements.future,'opaque');
const recovered=prepareProgressImport(JSON.stringify(report(partial),null,2));ok(recovered.ok);eq(recovered.state.wordListShelf,partial.wordListShelf);
const noContext=start();delete noContext.wordListShelf.source.words[0].sentence;eq(C.wordListShelfView(noContext).shelf.source.words[0].sentence,null);yes(C.placeWordListCard(noContext,'accommodate','double',options));
const duplicateClue=start();duplicateClue.wordListShelf.source.words.find(w=>w.id==='sufficient').clues.push({trayId:'ie',note:4});eq(C.wordListShelfView(duplicateClue).shelf.source.words.find(w=>w.id==='sufficient').clues.map(c=>c.trayId),['double','ending']);ok(C.wordListShelfView(duplicateClue).shelf.source.partial);

for(const raw of [null,{},Array(65).fill({})]){const v=start();v.wordListShelf.source.words=raw;eq(C.wordListShelfView(v).shelf.status,'unavailable');yes(C.openWordListJob(v,'e1',options));}
const invalidChecks=start();invalidChecks.wordListShelf.shelf.checks={raw:true};refuse(invalidChecks,()=>C.checkWordListShelf(invalidChecks,options));yes(C.placeWordListCard(invalidChecks,'yacht','quiet',options));yes(C.keepWordListShelf(invalidChecks,options));eq(invalidChecks.wordListShelf.shelf.latestKept.check,null);eq(invalidChecks.wordListShelf.shelf.checks,{raw:true});
const invalidCheckRow=start();invalidCheckRow.wordListShelf.shelf.checks.push({raw:true});refuse(invalidCheckRow,()=>C.checkWordListShelf(invalidCheckRow,options));yes(C.placeWordListCard(invalidCheckRow,'yacht','quiet',options));
const badFirst=start();badFirst.wordListShelf.shelf.firstKept={raw:true};yes(C.placeWordListCard(badFirst,'yacht','quiet',options));yes(C.keepWordListShelf(badFirst,options));eq(badFirst.wordListShelf.shelf.firstKept,{raw:true});
const badLatest=start();badLatest.wordListShelf.shelf.latestKept={raw:true};refuse(badLatest,()=>C.keepWordListShelf(badLatest,options));yes(C.placeWordListCard(badLatest,'yacht','quiet',options));
const badHelp=start();badHelp.wordListShelf.shelf.help={raw:true};refuse(badHelp,()=>C.placeWordListCard(badHelp,'yacht','quiet',options));yes(C.openWordListJob(badHelp,'e2',options));
const drift=start();matchAll(drift);yes(C.checkWordListShelf(drift,options));yes(C.keepWordListShelf(drift,options));const history=clone(drift.wordListShelf.shelf);
drift.wordListShelf.source.words.reverse();drift.wordListShelf.source.words.find(w=>w.id==='yacht').clues=[{trayId:'double',note:'Synthetic earlier rule.'}];C.wordListShelfView(drift);eq(drift.wordListShelf.shelf,history,'views never regrade retained checks');

for(const job of makeWordListShelfSource().jobs){
 const v=fresh();yes(C.openWordListJob(v,job.id,options));yes(C.checkWordListJob(v,job.id,options));eq(v.wordListShelf.jobs[job.id].checks.at(-1).outcome,'incomplete');yes(C.keepWordListJob(v,job.id,options));const rawFirst=clone(v.wordListShelf.jobs[job.id].firstKept);
 yes(C.useWordListJobHelp(v,job.id,'hint',options));yes(C.useWordListJobHelp(v,job.id,'example',options));yes(C.answerWordListJob(v,job.id,job.key,options));yes(C.checkWordListJob(v,job.id,options));eq(v.wordListShelf.jobs[job.id].checks.at(-1).outcome,'fit');yes(C.keepWordListJob(v,job.id,options));
 const record=clone(v.wordListShelf.jobs[job.id]);yes(C.skipWordListJob(v,job.id,options));eq(v.wordListShelf.view,'jobs');eq(v.wordListShelf.jobs[job.id],record,'Skip changes only the chooser view');
 yes(C.openWordListJob(v,job.id,options));yes(C.restoreWordListJob(v,job.id,'first',options));eq(v.wordListShelf.jobs[job.id].work.choice,null);eq(v.wordListShelf.jobs[job.id].help,{hint:true,example:true});eq(v.wordListShelf.jobs[job.id].firstKept,rawFirst);
 v.wordListShelf.jobs[job.id].source.key=job.choices.find(c=>c.id!==job.key).id;const before=clone(v.wordListShelf.jobs[job.id].checks);C.wordListShelfView(v);eq(v.wordListShelf.jobs[job.id].checks,before);
 v.wordListShelf.jobs[job.id].work.extra={raw:true};yes(C.answerWordListJob(v,job.id,job.key,options));eq(v.wordListShelf.jobs[job.id].work.extra,{raw:true});
 ok(prepareProgressImport(JSON.stringify(report(v),null,2)).ok);
}
const orphan=fresh();yes(C.openWordListJob(orphan,'e1',options));orphan.wordListShelf.source.jobs=[];yes(C.answerWordListJob(orphan,'e1','b',options));yes(C.checkWordListJob(orphan,'e1',options));eq(orphan.wordListShelf.jobs.e1.checks.at(-1).outcome,'fit');
const malformedJob=start();malformedJob.wordListShelf.jobs={e1:{work:{choice:'b'}}};refuse(malformedJob,()=>C.openWordListJob(malformedJob,'e1',options));yes(C.placeWordListCard(malformedJob,'yacht','quiet',options));
const identity=start();yes(C.openWordListJob(identity,'e1',options));identity.wordListShelf.jobs.e1.source.id='e2';refuse(identity,()=>C.openWordListJob(identity,'e1',options));

for(const key of ['constructor','prototype','toString','valueOf','__proto__','shelf','jobs']){const v=fresh();refuse(v,()=>C.openWordListJob(v,key,options));}
for(const raw of [null,[],3,'future',{v:99,raw:['held']}]){const v=fresh();v.wordListShelf=raw;const before=clone(v.wordListShelf);eq(C.wordListShelfView(v).status,'unsupported');refuse(v,()=>C.openWordListShelf(v,options));yes(P.openPipsTable(v,'postcard',options));eq(v.wordListShelf,before);}
for(const callback of [undefined,()=>false,()=>{throw Error('Synthetic refusal');}]){const v=fresh();refuse(v,()=>C.openWordListShelf(v,{canExport:callback}));}
const hostile=fresh(),beforeGarden=clone(hostile.garden);yes(C.openWordListShelf(hostile,{canExport:c=>{c.garden={changed:true};c.wordListShelf={changed:true};return true;}}));eq(hostile.garden,beforeGarden);eq(hostile.wordListShelf.source.id,'word-list-shelf-1');
for(const order of ['shelf-first','siblings-first']){const v=fresh();if(order==='shelf-first')yes(C.openWordListShelf(v,options));yes(P.openPipsTable(v,'postcard',options));yes(E.openEndingsTable(v,'letter',options));if(order==='siblings-first')yes(C.openWordListShelf(v,options));const siblings={pipsCopy:clone(v.pipsCopy),endingsShelf:clone(v.endingsShelf)};yes(C.placeWordListCard(v,'yacht','quiet',options));eq(v.pipsCopy,siblings.pipsCopy);eq(v.endingsShelf,siblings.endingsShelf);}
const max=makeWordListShelfSource();max.words=Array.from({length:64},(_,i)=>({...clone(max.words[0]),id:'w'+i}));const ms=C.wordListShelfSource(max);ok(ms);eq(C.wordListShelfResult(ms,{placements:Object.fromEntries(ms.words.map(w=>[w.id,'double'])),help:[]}).rows.length,64);
const htmlState=fresh(),htmlBefore=clone(htmlState);ok(wordListShelfPage(htmlState).includes('data-word-list-shelf-root'));eq(wordListShelfNotes(htmlState),'');eq(htmlState,htmlBefore,'rendering and Notes allocate nothing');
const ui=start();yes(C.checkWordListShelf(ui,options));yes(C.keepWordListShelf(ui,options));matchAll(ui);yes(C.checkWordListShelf(ui,options));yes(C.keepWordListShelf(ui,options));
ok(wordListShelfPage(ui).includes('id="wls-feedback"'));ok(wordListShelfNotes(ui).includes('First kept'));ok(wordListShelfNotes(ui).includes('Latest kept'));
yes(C.placeWordListCard(ui,'yacht','double',options));ok(!wordListShelfPage(ui).includes('id="wls-feedback"'),'stale current verdict is not rendered');
const uiBefore=clone(ui);wordListShelfPage(ui);wordListShelfNotes(ui);eq(ui,uiBefore,'viewing keeps/history never rewrites records');
eq(wordListShelfSpeech(ui,'sentence','yacht'),'The yacht is moored beside the ferry.');eq(wordListShelfSpeech(ui,'contrast'),'');eq(wordListShelfSpeech(ui,'example'),'');
yes(C.openWordListJob(ui,'e1',options));const spoken=wordListShelfSpeech(ui,'question');ok(spoken.includes(' blank '));ok(!spoken.includes('accomodate'));ok(!spoken.includes('accommodate'));ok(!spoken.includes('accommadate'));
delete ui.wordListShelf.source.words[0].sentence;eq(wordListShelfSpeech(ui,'sentence','accommodate'),'');ui.wordListShelf.source.story.short='x'.repeat(4001);eq(wordListShelfSpeech(ui,'story'),'');
for(const raw of [null,[],3,'future',{v:99,raw:['held']}]){const v={wordListShelf:raw},before=clone(v);ok(typeof wordListShelfPage(v)==='string');ok(typeof wordListShelfNotes(v)==='string');eq(wordListShelfSpeech(v,'story'),'');eq(v,before);}
const unreadable=start();unreadable.wordListShelf.shelf.help={raw:true};ok(wordListShelfNotes(unreadable).includes(wordListShelfCopy.unavailable));ok(!wordListShelfPage(unreadable).includes('undefined'));
const escaped=start();escaped.wordListShelf.source.words[0].text='<script>not executed</script>';const escapedHtml=wordListShelfPage(escaped);ok(escapedHtml.includes('&lt;script&gt;'));ok(!escapedHtml.includes('<script>'));
const limit=start();let lo=0,hi=MAX_IMPORT_BYTES;while(lo<hi){const mid=Math.floor((lo+hi+1)/2);limit.syntheticPadding='x'.repeat(mid);if(canExport(limit))lo=mid;else hi=mid-1;}limit.syntheticPadding='x'.repeat(lo);ok(canExport(limit));refuse(limit,()=>C.checkWordListShelf(limit,options));
console.log(`Word List Shelf: ${n} finite content, retained-source, revision, partial-work and atomic-save checks passed.`);
