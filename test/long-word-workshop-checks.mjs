// Synthetic acceptance checks: literal finite-text oracles and the real Notes boundary.
import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {MAX_IMPORT_BYTES} from '../dist/progress-limits.mjs';
import {makeLongWordSource} from '../dist/long-word-workshop-content.mjs';
import * as C from '../dist/long-word-workshop-core.mjs';
import {longWordPage,longWordNotes,longWordSpeech,resetLongWordView} from '../dist/long-word-workshop-ui.mjs';
const clone=structuredClone,fresh=()=>initializeExplorerState(freshState());
const report=s=>({title:'After the Storm: observations',note:'Synthetic word study.',exportedAt:'2026-10-31T13:00:00.000Z',explorer:{avatar:'sky',color:'gold',symbol:'leaf'},recommendation:{reason:'Synthetic report'},...s});
const canExport=s=>prepareProgressImport(JSON.stringify(report(s),null,2)).ok,options={canExport};
let n=0;
const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(a,m)=>{assert.ok(a,m);n++;},yes=r=>ok(r.ok,JSON.stringify(r));
const refuse=(s,fn)=>{const before=clone(s);eq(fn().ok,false);eq(s,before,'refusal preserves the whole notebook');};
const start=(section='words')=>{const s=fresh();yes(C.openLongWordSection(s,section,options));return s;};
const root=s=>s.longWordWorkshop,word=(s,id='catchment')=>root(s).words[id];
const assemble=(s,id,order)=>{yes(C.openLongWord(s,id,options));yes(C.clearLongWord(s,id,options));for(const p of order)yes(C.appendLongPiece(s,id,p,options));};
const fitGlossary=s=>{for(const [id,c] of [['g1','a'],['g2','b'],['g3','c']])yes(C.setLongGlossaryChoice(s,id,c,options));};
const targets=['catchment','embankment','permeable','precipitation','photosynthesis','algorithm'];
const constructions=[['catchment',['catch','ment']],['embankment',['embank','ment']],['embankment',['em','bank','ment']],['permeable',['perme','able']],['precipitation',['precipit','ation']],['photosynthesis',['photo','synthesis']],['photosynthesis',['photo','syn','thesis']],['algorithm',['algorithm']]];
const source=makeLongWordSource();
eq(source.words.map(w=>w.text),targets);eq(source.words.map(w=>w.id),targets);
eq(source.glossary.map(g=>g.choices.map(c=>c.text)),[['which','witch','wich'],['permeible','permeable','permiable'],['affect','efect','effect']]);
eq(source.jobs.map(j=>j.key),['a','b','c']);eq(source.jobs.map(j=>j.steps.length),[3,0,0]);
eq(source.jobs.map(j=>j.teach[0].title),['A family can help','Look at a spelling clue','Read what a history note actually says']);
ok(source.jobs.every(j=>j.teach.length===1&&j.teach[0].steps.length===3));
eq(source.jobs.map(j=>j.choices.map(c=>c.text)),[['permeable','permeible','permiable'],['fotosynthesis','photosynthesis','photosinthesis'],['photosynthesis','catchment','algorithm']]);
eq(source.jobs[0].steps,['Find perme in permeation.','This word uses -able.','Check both parts in your chosen spelling.']);
eq(source.jobs.map(j=>j.teach[0].steps),[
 ['Define and definition share defin.','A family may show a useful letter group.','Still check the whole word and its ending.'],
 ['Photograph begins with photo.','Point to its ph.',"A clue helps us look closely; it does not settle every word's spelling."],
 ["One note may name a word's parts.",'Another may describe a later spelling change.',"Use the note's evidence; length alone cannot tell the history."]]);

source.words[0].text='synthetic changed';eq(makeLongWordSource().words[0].text,'catchment','source factory makes independent copies');

for(const [id,order] of constructions){
 const s=start();assemble(s,id,order);yes(C.checkLongWord(s,id,options));eq(word(s,id).check.text,id);eq(word(s,id).check.target,id);eq(word(s,id).check.status,'matches');
 refuse(s,()=>C.appendLongPiece(s,id,order[0],options));
 if(order.length>1){assemble(s,id,[...order].reverse());yes(C.checkLongWord(s,id,options));eq(word(s,id).check.status,'different');assemble(s,id,order.slice(0,-1));yes(C.checkLongWord(s,id,options));eq(word(s,id).check.status,'different');}
 yes(C.clearLongWord(s,id,options));yes(C.checkLongWord(s,id,options));eq(word(s,id).check.status,'empty');yes(C.keepLongWord(s,id,options));eq(word(s,id).latestKept.check.status,'empty');
}
const moving=start();assemble(moving,'catchment',['ment','catch']);yes(C.moveLongPiece(moving,'catchment','catch',-1,options));eq(word(moving).order,['catch','ment']);yes(C.moveLongPiece(moving,'catchment','catch',1,options));eq(word(moving).order,['ment','catch']);yes(C.removeLongPiece(moving,'catchment','ment',options));eq(word(moving).order,['catch']);yes(C.appendLongPiece(moving,'catchment','ment',options));yes(C.openLongWord(moving,'algorithm',options));eq(word(moving).order,['catch','ment'],'word navigation preserves drafts');
const w=start();assemble(w,'catchment',['catch','ment']);yes(C.checkLongWord(w,'catchment',options));yes(C.keepLongWord(w,'catchment',options));const first=clone(word(w).firstKept),checked=clone(word(w).check);
yes(C.removeLongPiece(w,'catchment','ment',options));eq(C.longWordView(w).currentWord.currentCheck,null);yes(C.keepLongWord(w,'catchment',options));eq(word(w).latestKept.check,null);eq(word(w).check,checked,'editing/unchecked Keep retains the earlier comparison');eq(word(w).firstKept,first);ok(longWordPage(w).includes('Not compared'));ok(!longWordPage(w).includes('id="lww-feedback"'));
yes(C.useLongWordHelp(w,'catchment',options));yes(C.useLongWordHelp(w,'catchment',options));eq(word(w).help,['example']);yes(C.restoreLongWord(w,'catchment','first',options));eq(word(w).order,['catch','ment']);eq(word(w).help,['example']);yes(C.restoreLongWord(w,'catchment','latest',options));eq(word(w).order,['catch']);eq(word(w).firstKept,first);
const drift=start();assemble(drift,'catchment',['catch','ment']);yes(C.checkLongWord(drift,'catchment',options));yes(C.keepLongWord(drift,'catchment',options));const oldWord=clone(word(drift));root(drift).source.words[0].text='earlier-target';root(drift).source.words.reverse();C.longWordView(drift);longWordPage(drift);longWordNotes(drift);eq(word(drift),oldWord,'source edits never rewrite saved checks or keeps');eq(C.longWordView(drift).currentWord.currentCheck,null);ok(longWordNotes(drift).includes('catchment'));

for(const [line,fit] of [['g1','a'],['g2','b'],['g3','c']])for(const choice of ['a','b','c']){
 const s=start('glossary');fitGlossary(s);yes(C.setLongGlossaryChoice(s,line,choice,options));yes(C.checkLongGlossary(s,options));eq(root(s).glossary.check.status,choice===fit?'matching':'discussion');eq(root(s).glossary.check.rows.find(r=>r.id===line).status,choice===fit?'matches':'different');eq(root(s).glossary.check.rows.find(r=>r.id===line).chosen,({g1:['which','witch','wich'],g2:['permeible','permeable','permiable'],g3:['affect','efect','effect']})[line][['a','b','c'].indexOf(choice)]);
}
const g=start('glossary');yes(C.checkLongGlossary(g,options));eq(root(g).glossary.check.status,'incomplete');eq(root(g).glossary.picks,{},'missing choices stay missing');yes(C.keepLongGlossary(g,options));const gFirst=clone(root(g).glossary.firstKept);fitGlossary(g);yes(C.checkLongGlossary(g,options));yes(C.keepLongGlossary(g,options));const gLatest=clone(root(g).glossary.latestKept),gCheck=clone(root(g).glossary.check);
yes(C.setLongGlossaryChoice(g,'g1','b',options));eq(C.longWordView(g).glossary.currentCheck,null);yes(C.keepLongGlossary(g,options));eq(root(g).glossary.latestKept.check,null);eq(root(g).glossary.check,gCheck);ok(longWordPage(g).includes('Not compared'));yes(C.useLongGlossaryHelp(g,'g1',options));yes(C.restoreLongGlossary(g,'first',options));eq(root(g).glossary.picks,{g1:null,g2:null,g3:null});eq(root(g).glossary.help,['g1-example']);eq(root(g).glossary.firstKept,gFirst);
root(g).glossary.latestKept=clone(gLatest);yes(C.restoreLongGlossary(g,'latest',options));eq(root(g).glossary.picks,{g1:'a',g2:'b',g3:'c'});const glossary=clone(root(g).glossary);yes(C.openLongJob(g,'F4',options));eq(root(g).glossary,glossary);ok(!Object.hasOwn(root(g).jobs,'F4'),'F4 opens the same glossary without a second job');
root(g).source.glossary[0].fits='b';root(g).source.glossary.reverse();const retainedGlossary=clone(root(g).glossary);C.longWordView(g);longWordNotes(g);eq(root(g).glossary,retainedGlossary,'key/order drift does not regrade saved work');
const partial=start('glossary');fitGlossary(partial);root(partial).glossary.picks.g1={future:'opaque'};root(partial).glossary.picks.retired='held';root(partial).source.glossary[1].before=42;
refuse(partial,()=>C.setLongGlossaryChoice(partial,'g1','a',options));yes(C.checkLongGlossary(partial,options));eq(root(partial).glossary.check.rows.map(r=>r.id),['g3']);eq(root(partial).glossary.check.status,'matching');eq(root(partial).glossary.check.coverage,'partial');eq(root(partial).glossary.check.summary,root(partial).source.copy.partialMatching);ok(root(partial).glossary.check.notice);yes(C.keepLongGlossary(partial,options));yes(C.restoreLongGlossary(partial,'latest',options));eq(root(partial).glossary.picks.g1,{future:'opaque'});eq(root(partial).glossary.picks.retired,'held');
for(const opaque of [true,false]){const s=start('glossary');if(opaque)for(const id of ['g1','g2','g3'])root(s).glossary.picks[id]={held:true};else root(s).source.glossary=[];refuse(s,()=>C.checkLongGlossary(s,options));ok(longWordPage(s).includes(root(s).source.copy.unavailable));}

for(const [id,key] of [['F1','a'],['F2','b'],['F3','c']]){
 for(const choice of ['a','b','c']){const s=fresh();yes(C.openLongJob(s,id,options));yes(C.answerLongJob(s,id,choice,options));yes(C.checkLongJob(s,id,options));eq(root(s).jobs[id].checks.at(-1).outcome,choice===key?'fit':'different');}
 const s=fresh();yes(C.openLongJob(s,id,options));const j=root(s).jobs[id],source=clone(j.source);yes(C.checkLongJob(s,id,options));eq(root(s).jobs[id].checks.at(-1).outcome,'incomplete');yes(C.keepLongJob(s,id,options));const first=clone(root(s).jobs[id].firstKept);
 yes(C.useLongJobHelp(s,id,'hint',options));yes(C.useLongJobHelp(s,id,'example',options));yes(C.answerLongJob(s,id,key,options));yes(C.checkLongJob(s,id,options));yes(C.keepLongJob(s,id,options));const latest=clone(root(s).jobs[id].latestKept),beforeSkip=clone(root(s).jobs[id]);yes(C.skipLongJob(s,id,options));eq(root(s).activeJob,null);eq(root(s).jobs[id],beforeSkip,'Skip retains the immediately preceding source, answer, help and history');yes(C.openLongJob(s,id,options));yes(C.restoreLongJob(s,id,'first',options));eq(root(s).jobs[id].work.choice,null);eq(root(s).jobs[id].help,{hint:true,example:true});eq(root(s).jobs[id].firstKept,first);yes(C.restoreLongJob(s,id,'latest',options));eq(root(s).jobs[id].work.choice,key);eq(root(s).jobs[id].latestKept,latest);
 root(s).source.jobs=[];eq(root(s).jobs[id].source,source,'opened job keeps its full source clone');yes(C.answerLongJob(s,id,null,options));root(s).jobs[id].source.key=key==='a'?'b':'a';const checks=clone(root(s).jobs[id].checks);longWordPage(s);longWordNotes(s);eq(root(s).jobs[id].checks,checks);ok(longWordPage(s).includes(source.teach[0].text.replaceAll('&','&amp;').replaceAll("'",'&#39;').replaceAll('\"','&quot;')),'teaching lead is present before optional help');
}

// Unknown extensions survive real export/import and subsequent legal edits.
const future=start();root(future).future={payload:[1,2]};word(future).future={held:true};root(future).words.retired={opaque:true};assemble(future,'catchment',['catch','ment']);yes(C.checkLongWord(future,'catchment',options));word(future).check.future='held';yes(C.keepLongWord(future,'catchment',options));const recovered=prepareProgressImport(JSON.stringify(report(future),null,2));ok(recovered.ok);eq(recovered.state.longWordWorkshop,root(future));yes(C.clearLongWord(future,'catchment',options));eq(word(future).future,{held:true});eq(root(future).words.retired,{opaque:true});eq(word(future).check.future,'held');
for(const raw of [null,[],3,'future',{v:99,raw:['held']}]){const s=fresh();s.longWordWorkshop=raw;eq(C.longWordView(s).status,'unsupported');refuse(s,()=>C.openLongWordSection(s,'words',options));const before=clone(s);longWordPage(s);longWordNotes(s);eq(longWordSpeech(s,'story'),'');eq(s,before);}
const version=start();root(version).source.v=99;eq(C.longWordView(version).status,'unsupported');refuse(version,()=>C.clearLongWord(version,'catchment',options));
for(const scope of ['words','glossary','jobs']){const s=start();root(s).source[scope]=null;if(scope!=='words')yes(C.appendLongPiece(s,'catchment','catch',options));if(scope!=='glossary')yes(C.openLongWordSection(s,'glossary',options));if(scope!=='jobs')yes(C.openLongJob(s,'F1',options));}
for(const kind of ['word','piece','line','choice']){const s=start();const src=root(s).source;if(kind==='word')src.words.push({...clone(src.words[0]),text:42});if(kind==='piece')src.words[0].pieces.push({id:'catch',text:42});if(kind==='line')src.glossary.push({...clone(src.glossary[0]),before:42});if(kind==='choice')src.glossary[0].choices.push({id:'a',text:42});
 if(['word','piece'].includes(kind)){ok(!C.longWordView(s).words.find(e=>e.id==='catchment')?.source,'duplicate ids are ambiguous even when one duplicate is unreadable');yes(C.openLongWord(s,'algorithm',options));}else{yes(C.openLongWordSection(s,'glossary',options));ok(!C.longWordView(s).glossary.source.lines.find(e=>e.id==='g1')?.choices.some(c=>c.id==='a'));yes(C.setLongGlossaryChoice(s,'g2','b',options));}}
for(const order of [['catch','catch'],['retired-piece']]){const s=start();word(s).order=order;refuse(s,()=>C.appendLongPiece(s,'catchment','ment',options));yes(C.openLongWord(s,'algorithm',options));eq(word(s).order,order);}
const unsafe=start();root(unsafe).source.words[0].id='unsafe id';root(unsafe).words['unsafe id']={raw:true};yes(C.openLongWord(unsafe,'algorithm',options));eq(root(unsafe).words['unsafe id'],{raw:true});
const glossaryLiteral=start('glossary');fitGlossary(glossaryLiteral);yes(C.checkLongGlossary(glossaryLiteral,options));const literalCheck=clone(root(glossaryLiteral).glossary.check);root(glossaryLiteral).source.glossary[0].flagged='earlier literal';eq(C.longWordView(glossaryLiteral).glossary.currentCheck,null);yes(C.keepLongGlossary(glossaryLiteral,options));eq(root(glossaryLiteral).glossary.latestKept.check,null);eq(root(glossaryLiteral).glossary.check,literalCheck,'literal drift hides comparison without rewriting its rows');
for(const field of ['check','firstKept','latestKept','help']){const s=start();word(s)[field]={opaque:true};if(field==='check'){refuse(s,()=>C.checkLongWord(s,'catchment',options));yes(C.appendLongPiece(s,'catchment','catch',options));yes(C.keepLongWord(s,'catchment',options));eq(word(s).latestKept.check,null);}if(field==='firstKept'){yes(C.keepLongWord(s,'catchment',options));eq(word(s).firstKept,{opaque:true});}if(field==='latestKept')refuse(s,()=>C.keepLongWord(s,'catchment',options));if(field==='help')refuse(s,()=>C.appendLongPiece(s,'catchment','catch',options));yes(C.openLongJob(s,'F2',options));}
for(const area of ['glossary','jobs']){const s=start(area);if(area==='jobs')yes(C.openLongJob(s,'F1',options));const r=area==='glossary'?root(s).glossary:root(s).jobs.F1;r[area==='glossary'?'check':'checks']={opaque:true};refuse(s,()=>area==='glossary'?C.checkLongGlossary(s,options):C.checkLongJob(s,'F1',options));yes(area==='glossary'?C.setLongGlossaryChoice(s,'g1','a',options):C.answerLongJob(s,'F1','a',options));yes(area==='glossary'?C.keepLongGlossary(s,options):C.keepLongJob(s,'F1',options));eq((area==='glossary'?root(s).glossary:root(s).jobs.F1).latestKept.check,null);}
for(const area of ['glossary','jobs'])for(const field of ['firstKept','latestKept','help']){
 const s=start(area);if(area==='jobs')yes(C.openLongJob(s,'F1',options));const r=area==='glossary'?root(s).glossary:root(s).jobs.F1;r[field]={opaque:true};
 const keep=()=>area==='glossary'?C.keepLongGlossary(s,options):C.keepLongJob(s,'F1',options);
 if(field==='firstKept'){yes(keep());eq((area==='glossary'?root(s).glossary:root(s).jobs.F1).firstKept,{opaque:true});}
 else refuse(s,keep);
 yes(C.openLongWord(s,'algorithm',options));
}
for(const id of ['constructor','prototype','__proto__','toString','F4','future-job']){const s=start();if(id==='F4')continue;refuse(s,()=>C.openLongJob(s,id,options));}
const reserved=start();root(reserved).jobs.F4={future:true};yes(C.openLongJob(reserved,'F4',options));eq(root(reserved).jobs.F4,{future:true});ok(C.longWordView(reserved).jobsPartial);

// Every mutator is offered a real export preflight; refusal is atomic.
const base=start();assemble(base,'catchment',['catch','ment']);yes(C.checkLongWord(base,'catchment',options));yes(C.keepLongWord(base,'catchment',options));yes(C.openLongWordSection(base,'glossary',options));fitGlossary(base);yes(C.checkLongGlossary(base,options));yes(C.keepLongGlossary(base,options));yes(C.openLongJob(base,'F1',options));yes(C.answerLongJob(base,'F1','a',options));yes(C.checkLongJob(base,'F1',options));yes(C.keepLongJob(base,'F1',options));
yes(C.openLongWord(base,'algorithm',options));yes(C.openLongJob(base,'F1',options));
const operations=[(s,o)=>C.openLongWordSection(s,'words',o),(s,o)=>C.openLongWord(s,'algorithm',o),(s,o)=>C.appendLongPiece(s,'algorithm','algorithm',o),(s,o)=>C.selectLongLine(s,'g2',o),(s,o)=>C.moveLongPiece(s,'catchment','ment',-1,o),(s,o)=>C.removeLongPiece(s,'catchment','ment',o),(s,o)=>C.clearLongWord(s,'catchment',o),(s,o)=>C.useLongWordHelp(s,'catchment',o),(s,o)=>C.checkLongWord(s,'catchment',o),(s,o)=>C.keepLongWord(s,'catchment',o),(s,o)=>C.restoreLongWord(s,'catchment','first',o),(s,o)=>C.setLongGlossaryChoice(s,'g1','b',o),(s,o)=>C.useLongGlossaryHelp(s,'g1',o),(s,o)=>C.checkLongGlossary(s,o),(s,o)=>C.keepLongGlossary(s,o),(s,o)=>C.restoreLongGlossary(s,'first',o),(s,o)=>C.openLongJob(s,'F2',o),(s,o)=>C.answerLongJob(s,'F1','b',o),(s,o)=>C.useLongJobHelp(s,'F1','example',o),(s,o)=>C.checkLongJob(s,'F1',o),(s,o)=>C.keepLongJob(s,'F1',o),(s,o)=>C.restoreLongJob(s,'F1','first',o),(s,o)=>C.skipLongJob(s,'F1',o)];
for(const canExport of [undefined,()=>false,()=>{throw Error('Synthetic refusal');},s=>{s.garden={changed:true};s.longWordWorkshop={changed:true};return false;}])for(const op of operations){const s=clone(base);refuse(s,()=>op(s,{canExport}));}
for(const op of operations){const s=clone(base),before=clone(s);yes(op(s,{canExport:c=>{c.garden={changed:true};c.longWordWorkshop={changed:true};return true;}}));const expected=clone(before);expected.longWordWorkshop=clone(root(s));eq(s,expected,'successful hostile callback cannot install changes to another root');ok(root(s).source?.id==='long-word-workshop-1','callback receives disposable proposal');}
for(const canExport of [undefined,()=>false,()=>{throw Error('Synthetic refusal');}]){const s=fresh();refuse(s,()=>C.openLongWordSection(s,'words',{canExport}));}
const help=start(),helpBefore=longWordPage(help);refuse(help,()=>C.useLongWordHelp(help,'catchment',{canExport:()=>false}));eq(longWordPage(help),helpBefore,'denied help remains unopened and root is preserved');ok(!longWordPage(help).includes('data-lww-example='));
const oversized=start();const big=root(oversized).source.words[0];big.text='synthetic';big.pieces=Array.from({length:64},(_,i)=>({id:'p'+i,text:'x'.repeat(64)}));big.example.order=['p0'];word(oversized).order=big.pieces.map(p=>p.id);eq(C.longWordText(big,word(oversized).order).length,4096);ok(canExport(oversized));refuse(oversized,()=>C.checkLongWord(oversized,'catchment',options));
const limit=start();let lo=0,hi=MAX_IMPORT_BYTES;while(lo<hi){const mid=Math.floor((lo+hi+1)/2);limit.syntheticPadding='x'.repeat(mid);if(canExport(limit))lo=mid;else hi=mid-1;}limit.syntheticPadding='x'.repeat(lo);ok(canExport(limit));refuse(limit,()=>C.checkLongWord(limit,'catchment',options));

// Explicitly absent options refuse rather than throwing; a new full comparison
// replaces the known partial notice while retaining unknown check extensions.
for(const op of operations){const s=clone(base);refuse(s,()=>op(s,null));}
const renewed=start('glossary');root(renewed).glossary.picks.g1={future:'opaque'};yes(C.checkLongGlossary(renewed,options));ok(Object.hasOwn(root(renewed).glossary.check,'notice'));root(renewed).glossary.check.future='held';root(renewed).glossary.picks.g1='a';yes(C.checkLongGlossary(renewed,options));eq(root(renewed).glossary.check.coverage,'full');ok(!Object.hasOwn(root(renewed).glossary.check,'notice'));eq(root(renewed).glossary.check.future,'held');

// Recovery copy names an unknown format; accepted feedback uses its declared
// 16000-character bound rather than the 4000-character ordinary-source bound.
const unknownPage=longWordPage({longWordWorkshop:{v:99}});ok(unknownPage.includes(source.copy.unknownVersion));
const longFeedback=start('glossary');root(longFeedback).source.glossary[0].feedback.a='x'.repeat(5000);ok(C.longWordView(longFeedback).glossary.source.lines.some(g=>g.id==='g1'));yes(C.setLongGlossaryChoice(longFeedback,'g1','a',options));yes(C.checkLongGlossary(longFeedback,options));eq(root(longFeedback).glossary.check.rows.find(g=>g.id==='g1').feedback.length,5000);

// Pure readers/speech never create an activity or mark help; no choices are narrated.
const passive=fresh(),passiveBefore=clone(passive);resetLongWordView();ok(longWordPage(passive).includes('data-long-word-root'));eq(longWordNotes(passive),'');C.longWordView(passive);longWordSpeech(passive,'story');longWordSpeech(passive,'instruction');eq(passive,passiveBefore);
for(const id of targets){const s=start();yes(C.openLongWord(s,id,options));const before=clone(s);eq(longWordSpeech(s,'sentence'),root(s).source.words.find(w=>w.id===id).sentence);for(const kind of ['pieces','choices','clue','example','feedback','trial','prompt'])eq(longWordSpeech(s,kind),'');longWordPage(s);longWordNotes(s);eq(s,before);}
for(const id of ['F1','F2','F3']){const s=fresh();yes(C.openLongJob(s,id,options));const before=clone(s);eq(longWordSpeech(s,'prompt'),root(s).jobs[id].source.prompt);for(const kind of ['choices','example','hint','feedback','sentence'])eq(longWordSpeech(s,kind),'');longWordPage(s);longWordNotes(s);eq(s,before);}
const silent=start('glossary'),silentBefore=clone(silent);for(const kind of ['sentence','prompt','choices','glossary','readback','feedback'])eq(longWordSpeech(silent,kind),'');longWordPage(silent);longWordNotes(silent);eq(silent,silentBefore);
console.log(`Long-Word Workshop: ${n} finite-content, retained-work, partial-read and atomic Notes checks passed.`);
