// Independent literal342 mapping: these checks establish authored material, not phoneme quality or learning.
import assert from 'node:assert/strict';
import {makeSoundMessageSource,soundMessageCopy} from '../dist/word-room-sounds-content.mjs';
import * as core from '../dist/word-room-sounds-core.mjs';
import {freshState,recommendations} from '../dist/core.mjs';
import {readFileSync} from 'node:fs';
import {prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {wordRoomPage,wordRoomNotes} from '../dist/word-room-ui.mjs';
import {chooseWordRoomWord} from '../dist/word-room-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
const s=makeSoundMessageSource();
eq(Object.keys(s.cases),['start','middle','end','show']);
const expected=[['start','mat','sat',0],['middle','cat','cot',1],['end','cat','cap',2],['show','mat','map',2]];
for(const [id,left,right,position]of expected){
 const c=s.cases[id];eq([c.id,c.left.label,c.right.label,c.position],[id,left,right,position]);
 eq(c.alphabet,['a','b','c','f','h','i','m','n','o','p','s','t']);
 eq([...left].map((x,i)=>x!==right[i]?i:null).filter(x=>x!==null),[position]);
 for(const w of[c.left,c.right,c.example.left,c.example.right]){
  eq(w.letters,[...w.label]);ok(w.letters.every(x=>c.alphabet.includes(x)));ok(w.meaning&&w.alt&&w.guidance);
 }
 eq([c.example.left.label,c.example.right.label,c.example.position],['tin','pin',0]);
 eq(c.frames.length,3);eq(c.example.frames.length,3);
 ok(!new RegExp(`\\b${right}\\b`,'i').test(soundMessageCopy.story),'generic opening never names a target');
}
eq(s.message.text,'A cat sat on a mat. A cap is on a cot. A map is in a tin.');
eq(s.message.tokens.filter(x=>x.role==='target').map(x=>x.text),['cat','sat','mat','cap','cot','map','tin']);
const words=[...s.message.text.matchAll(/[A-Za-z]+/g)];
eq(s.message.tokens.map(x=>[x.text,x.start,x.end]),words.map(x=>[x[0],x.index,x.index+x[0].length]));
eq(s.message.tokens.filter(x=>x.role==='adult-supplied').map(x=>x.text),['A','on','a','A','is','on','a','A','is','in','a']);
eq(s.message.prompt,'Where is the pretend map? Tell your partner how you know.');
ok(s.message.art==='show-message342'&&s.message.alt.includes('tin'));
s.cases.middle.right.label='changed';s.cases.middle.alphabet.pop();
eq(makeSoundMessageSource().cases.middle.right.label,'cot','factory isolates later collections');
eq(s.cases.end.alphabet.length,12,'one case cannot mutate a sibling bank');
const copy=structuredClone,yes={canExport:()=>true};
const b=freshState(),initial=copy(b);
eq(core.soundMessagesView(b).status,'new');eq(b,initial,'view does not allocate');
ok(core.enterSoundMessages(b,yes).ok);ok(core.validSoundMessages(b.wordRoom.soundMessages));
eq(b.wordRoom.source.id,'theater-props');eq(b.wordRoom.gallery,[]);
const parentSource=copy(b.wordRoom.source);
ok(core.actSoundCase(b,'message',null,yes).ok);eq(b.wordRoom.soundMessages.sharedHelp.message,true);eq(b.wordRoom.soundMessages.records,{});
const current=()=>b.wordRoom.soundMessages.records[b.wordRoom.soundMessages.selectedId];
const action=(name,value)=>core.actSoundCase(b,name,value,yes);
for(const [id,,right]of expected){
 ok(core.chooseSoundCase(b,id,'listen',yes).ok);eq(current().page,'setup');eq(current().slots,[null,null,null]);
 eq(current().help.word,false,'message does not invent task-local disclosures');
 ok(action('partner').ok);eq(current().page,'partner');ok(current().help.partnerCard);
 ok(action('hidePartner').ok);eq(current().page,'work');
 ok(action('base').ok);eq(current().slots,current().source.left.letters);ok(current().help.base);
 const nonempty=copy(b);eq(action('base').ok,false);eq(b,nonempty,'base never erases nonempty work');
 ok(action('clear').ok);ok(action('compare').ok);eq(current().comparison.result,'incomplete');ok(action('back').ok);ok(action('keep').ok);eq(current().firstKept.slots,[null,null,null]);eq(current().firstKept.comparison.result,'incomplete');
 for(const letter of right)ok(action('letter',letter).ok);
 ok(action('compare').ok);eq(core.currentComparison(current()).result,'match');ok(current().help.word);
 ok(action('back').ok);ok(action('keep').ok);eq(current().firstKept.slots,[null,null,null]);eq(current().latestKept.slots,[...right]);
 ok(action('restoreFirst').ok);eq(current().slots,[null,null,null]);ok(current().help.word,'restoring never erases disclosed help');
 ok(action('restoreLatest').ok);eq(current().slots,[...right]);
 ok(action('contrast').ok);eq(current().page,'contrast');ok(action('prev').ok);eq(current().frame,0);ok(action('next').ok);eq(current().frame,1);
 const restored=JSON.parse(JSON.stringify(b));eq(core.soundMessagesView(restored).current.record.page,'contrast');eq(core.soundMessagesView(restored).current.record.frame,1);
 for(let i=0;i<4;i++)ok(action('next').ok);eq(current().frame,2,'manual steps clamp at their final frame');
 ok(action('back').ok);ok(action('example').ok);eq(current().page,'example');ok(current().help.example);
 ok(action('back').ok);ok(core.chooseSoundCase(b,id,'read',yes).ok);eq(current().page,'work');ok(current().help.word);
 ok(action('picture').ok);ok(action('build').ok);eq(current().mode,'listen');ok(current().help.picture);
}
eq(b.wordRoom.source,parentSource,'new work preserves the old label source');
ok(core.soundMessagesView(b).complete,'all offered cases kept, including unfinished first versions');
ok(core.leaveSoundMessages(b,yes).ok);eq(core.soundMessagesView(b).active,false);
ok(core.enterSoundMessages(b,yes).ok);eq(current().source.right.label,'map');
const oldRoot=copy(b),heldSource=copy(current().source);
b.wordRoom.soundMessages.source.cases.show.right.label='new';
eq(core.soundMessagesView(b).current.source.right.label,'map','opened record owns its source');
delete b.wordRoom.soundMessages.source.cases.show;
ok(core.soundMessagesView(b).current.earlier,'omitted record remains selectable');
eq(current().source,heldSource);
b.wordRoom.soundMessages.records.end={opaque:['retain',null]};
ok(core.chooseSoundCase(b,'middle','read',yes).ok,'bad sibling does not block another case');
eq(b.wordRoom.soundMessages.records.end,{opaque:['retain',null]});
const beforeBad=copy(b);eq(core.chooseSoundCase(b,'end','read',yes).ok,false);eq(b,beforeBad,'bad record never replaced from offered source');
const changedSource=copy(oldRoot),legacyComparison=copy(changedSource.wordRoom.soundMessages.records.show.comparison);
changedSource.wordRoom.soundMessages.source.cases.show.right.label='catalogue-edit';
ok(core.actSoundCase(changedSource,'clear',null,yes).ok);
eq(changedSource.wordRoom.soundMessages.records.show.comparison,legacyComparison,'editing after offered-source change does not regrade or drop saved comparison');
const ownWork=changedSource.wordRoom.soundMessages.records.show;ownWork.source.right.label='man';ownWork.source.right.letters=[...'man'];
ok(core.soundRecord(ownWork,'show'));eq(core.currentComparison(ownWork),null,'old comparison context stays historical after own target changes');
ok(core.actSoundCase(changedSource,'word',null,yes).ok);eq(changedSource.wordRoom.soundMessages.records.show.comparison,legacyComparison);
for(const broken of[null,{version:99,earlier:['raw']},{version:1,source:null}]){
 const parent=freshState();parent.wordRoom=broken;const before=copy(parent);eq(core.enterSoundMessages(parent,yes).error,'unavailable');eq(parent,before,'malformed parent never replaced');
}
const handoff=copy(oldRoot);ok(core.chooseSoundCase(handoff,'show','listen',yes).ok);eq(handoff.wordRoom.soundMessages.records.show.page,'setup');
ok(core.actSoundCase(handoff,'partner',null,yes).ok);ok(core.chooseSoundCase(handoff,'show','listen',yes).ok);eq(handoff.wordRoom.soundMessages.records.show.page,'setup','same-mode choice restores partner hand-off');
for(const cb of[undefined,()=>false,()=>1,()=>({}),()=>{throw new Error('no');}]){
 const candidate=copy(oldRoot),before=copy(candidate);
 eq(core.actSoundCase(candidate,'word',null,{canExport:cb}).ok,false);eq(candidate,before);
}
const poisoned=copy(oldRoot);ok(core.actSoundCase(poisoned,'word',null,{canExport:c=>{c.wordRoom.source.id='poison';c.wordRoom.soundMessages.records.show.slots=['x','x','x'];c.practice=['poison'];return true;}}).ok);
eq(poisoned.wordRoom.source.id,'theater-props');eq(poisoned.wordRoom.soundMessages.records.show.slots,[...'map']);eq(poisoned.practice,[]);
const unknown=copy(oldRoot);unknown.wordRoom.soundMessages.v=9;const opaque=copy(unknown);
eq(core.enterSoundMessages(unknown,yes).ok,false);eq(unknown,opaque);eq(core.soundMessagesView(unknown).active,false,'unknown child leaves parent available');
const unreadableKeep=copy(oldRoot);unreadableKeep.wordRoom.soundMessages.records.show.firstKept={opaque:true};
ok(core.actSoundCase(unreadableKeep,'keep',null,yes).ok);eq(unreadableKeep.wordRoom.soundMessages.records.show.firstKept,{opaque:true});
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');
const reportFunction=app.match(/^function notesReport\(notebook\).*$/m)?.[0];ok(reportFunction,'use actual app report, not a minimal notebook approximation');
const report=new Function('notebook','explorerStore','recommendations',`${reportFunction};return notesReport(notebook);`);
const explorerStore={active:{avatar:'sky',color:'blue',symbol:'leaf'}};
const raw=x=>JSON.stringify(report(x,explorerStore,recommendations),null,2);
const actual={canExport:x=>prepareProgressImport(raw(x)).ok};
const transfer=copy(oldRoot);ok(actual.canExport(transfer));
const imported=JSON.parse(raw(transfer));eq(imported.wordRoom,transfer.wordRoom,'raw real Notes retains parent and new work');
const tight=copy(oldRoot);tight.padding='';tight.padding='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(raw(tight)));
eq(Buffer.byteLength(raw(tight)),MAX_IMPORT_BYTES);ok(actual.canExport(tight));
const beforeTight=copy(tight);eq(core.actSoundCase(tight,'clear',null,actual).ok,false);eq(tight,beforeTight,'real full-report overflow is atomic');
// The child replaces the entire legacy surface, including closed galleries/adult directions.
for(const[id,,target]of expected){
 const ui=freshState();chooseWordRoomWord(ui,'cat',yes);ui.wordRoom.gallery=['cat'];
 core.enterSoundMessages(ui,yes);core.chooseSoundCase(ui,id,'listen',yes);
 const render=()=>wordRoomPage(ui,'synthetic-owner');
 let html=render();ok(html.includes('data-wr-sounds-active'));ok(!/\bwr-gallery\b|\bwr-waiting\b/.test(html),'legacy parent material is absent, not covered');
 ok(!new RegExp(`\\b${target}\\b`).test(html),'setup omits the target');
 core.actSoundCase(ui,'partner',null,yes);ok(render().includes(`>${target}</p>`),'explicit partner card shows word');
 core.actSoundCase(ui,'hidePartner',null,yes);html=render();ok(!new RegExp(`\\b${target}\\b`).test(html),'partner text removed, not hidden');
 core.actSoundCase(ui,'keep',null,yes);ok(render().includes('id="wrs-kept-feedback"'),'kept acknowledgment derives from saved material');
 core.actSoundCase(ui,'example',null,yes);ok(!new RegExp(`\\b${target}\\b`).test(render()),'different worked example does not leak a target');
 ok(render().includes('id="wrs-kept-feedback"'),'kept acknowledgment survives help paging');
 core.actSoundCase(ui,'back',null,yes);core.actSoundCase(ui,'picture',null,yes);
 ok(render().includes(`>${target}</p>`)&&ui.wordRoom.soundMessages.records[id].help.word,'pictured label records its word disclosure');
 ok(wordRoomNotes(ui).includes('Sound-changing prop labels'),'ordinary Notes owns the summary');
 const raw=copy(ui);wordRoomPage(ui,'synthetic-owner');wordRoomNotes(ui);eq(ui,raw,'render and Notes are pure');
 const badView=copy(ui);badView.wordRoom.soundMessages.records[id].page='contrast';badView.wordRoom.soundMessages.records[id].help.word=false;
 const beforeBadView=copy(badView);ok(!new RegExp(`\\b${target}\\b`).test(wordRoomPage(badView,'synthetic-owner')),'malformed undisclosed panel does not reveal target');eq(badView,beforeBadView,'render does not rewrite imported flags');
}
console.log(`Sound-changing Prop Box: ${n} content/core/render checks passed; native browser checks remain separate.`);
