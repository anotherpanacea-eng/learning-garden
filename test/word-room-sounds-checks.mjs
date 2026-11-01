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
// Spec347: a third packet changes ownership/navigation, not the existing save semantics.
{
 const pairs=[['first-1','ham','ram',0],['first-2','sip','lip',0],['first-3','pet','wet',0],['first-4','ham','yam',0],['middle','red','rod',1],['last','web','wet',2]];
 const bank='a b c d e f g h i l m n o p r s t u w y'.split(' '),source=makeSoundMessageSource('garden');
 eq([source.id,source.revision],['garden-stage-labels',1]);eq(Object.keys(source.cases),pairs.map(x=>x[0]));
 for(const[id,left,right,place]of pairs){const c=source.cases[id];ok(core.soundCaseSource(c,id));eq([c.left.label,c.right.label,c.position],[left,right,place]);eq(c.alphabet,bank);eq(c.frames.length,3);eq([c.example.left.label,c.example.right.label],['tin','pin']);}
 for(const[id,label]of[['r','ram'],['l','lip'],['w','wet'],['y','yam']]){const t=source.teaching[id];ok(core.soundLetterSource(t,id));eq([t.glyph,t.word.label,t.position],[id,label,0]);}
 eq(source.message.text,'Put the yam on the mat. The ram has a red rod. The cup is wet.');
 eq(source.message.tokens.filter(x=>x.role==='target').map(x=>x.text),['yam','mat','ram','red','rod','cup','wet']);
 eq(source.message.tokens.filter(x=>x.role==='adult-supplied').map(x=>x.text),['Put','the','on','the','The','has','a','The','is']);
 for(const t of source.message.tokens)eq(source.message.text.slice(t.start,t.end),t.text);
 const g=freshState(),start=copy(g);core.soundMessagesView(g,'garden');wordRoomNotes(g);eq(g,start,'Garden preview/report allocates nothing');
 chooseWordRoomWord(g,'mat',yes);const legacy=copy(g.wordRoom.source);
 for(const[pack,id]of[['show','end'],['market','u-end']]){ok(core.enterSoundMessages(g,actual,pack).ok);ok(core.chooseSoundCase(g,id,'listen',actual).ok);for(const a of['partner','hidePartner'])ok(core.actSoundCase(g,a,null,actual).ok);ok(core.actSoundCase(g,'letter','b',actual).ok);ok(core.actSoundCase(g,'keep',null,actual).ok);}
 const oldShow=copy(g.wordRoom.soundMessages),oldMarket=copy(g.wordRoom.marketSoundMessages);oldShow.active=false;oldMarket.active=false;
 g.syntheticGardenSibling={raw:'x'.repeat(512000)};
 ok(core.enterSoundMessages(g,actual,'garden').ok);eq(core.activeSoundPacket(g),'garden');eq(g.wordRoom.soundMessages,oldShow);eq(g.wordRoom.marketSoundMessages,oldMarket);eq(g.wordRoom.source,legacy);
 const view=()=>core.soundMessagesView(g,'garden'),act=(a,v)=>{const r=core.actSoundCase(g,a,v,actual);ok(r.ok,a);return r;};
 act('letters');act('teachingLetter','r');eq(view().letter.source.word.label,'ram');ok(view().root.sharedHelp.letters);
 act('caseBack');
 for(const[id,,target]of pairs){
  ok(core.chooseSoundCase(g,id,'listen',actual).ok);act('partner');act('hidePartner');
  ok(!new RegExp(`\\b${target}\\b`,'i').test(wordRoomPage(g,'synthetic')),'no target text/aria/selector in Garden work');
  act('letter','b');act('keep');const first=copy(view().current.record.firstKept);act('clear');for(const l of target)act('letter',l);act('compare');eq(core.currentComparison(view().current.record).result,'match');act('back');act('keep');
  eq(view().current.record.firstKept,first);eq(view().current.record.latestKept.slots,[...target]);
  act('letters');act('teachingLetter','y');act('caseBack');eq(view().current.record.slots,[...target]);
  act('contrast');act('next');const retained=JSON.parse(raw(g));eq(core.soundMessagesView(retained).current.record.frame,1);eq(core.soundMessagesView(retained).current.source.frames,source.cases[id].frames);act('back');act('choose');
 }
 act('message');const html=wordRoomPage(g,'synthetic');ok(html.includes("Dot&#39;s garden-show note"),'retained Garden note title renders');
 ok(wordRoomNotes(g).includes('Shared garden-show note: opened'));eq(g.wordRoom.soundMessages,oldShow);eq(g.wordRoom.marketSoundMessages,oldMarket);
 const exported=JSON.parse(raw(g));eq(exported.wordRoom,g.wordRoom);eq(exported.syntheticGardenSibling,g.syntheticGardenSibling);ok(prepareProgressImport(raw(g)).ok,'all three packets and large unrelated payload fit real Notes loader');
 const all=copy(g);for(const pack of core.soundPackets)all.wordRoom[core.soundPacketField(pack)].active=true;const allBefore=copy(all);eq(core.activeSoundPacket(all),'garden');wordRoomPage(all,'synthetic');eq(all,allBefore,'import priority is a read, never normalization');ok(core.leaveSoundMessages(all,actual).ok);eq(core.soundPackets.map(p=>all.wordRoom[core.soundPacketField(p)].active),[false,false,false]);
 for(const pack of['show','market']){const damaged=copy(g);damaged.wordRoom.gardenSoundMessages.v=99;const rawGarden=copy(damaged.wordRoom.gardenSoundMessages);damaged.wordRoom[core.soundPacketField(pack)].active=true;eq(core.activeSoundPacket(damaged),pack);ok(core.enterSoundMessages(damaged,actual,pack).ok);eq(damaged.wordRoom.gardenSoundMessages,rawGarden,'unreadable Garden not deactivated or replaced');}
 const refused=copy(g),beforeRefusal=copy(g);eq(core.enterSoundMessages(refused,{canExport:()=>false},'market').ok,false);eq(refused,beforeRefusal,'refused switch cannot deactivate another packet');
 for(const run of[x=>core.actSoundCase(x,'letters',null,{canExport:()=>false}),x=>core.chooseSoundCase(x,'first-1','read',{canExport:()=>false})]){const x=copy(g),before=copy(x);eq(run(x).ok,false);eq(x,before,'Garden disclosure refused before display');}
 const broken=copy(g);broken.wordRoom.gardenSoundMessages.source.teaching.r.guidance=7;ok(core.actSoundCase(broken,'letters',null,actual).ok);eq(core.soundMessagesView(broken).letter.id,'y','selected readable card can reopen beside damaged r');
 const badCard=copy(broken);eq(core.actSoundCase(broken,'teachingLetter','r',actual).ok,false);eq(broken,badCard);ok(core.chooseSoundCase(broken,'middle','read',actual).ok,'bad letter card leaves cases open');
 const old=copy(g),frozen=copy(old.wordRoom.gardenSoundMessages.records['first-1'].source);old.wordRoom.gardenSoundMessages.source.cases['first-1'].right.label='yam';old.wordRoom.gardenSoundMessages.source.cases['first-1'].right.letters=[...'yam'];old.wordRoom.gardenSoundMessages.source.cases['first-1'].alphabet.reverse();ok(core.chooseSoundCase(old,'first-1','read',actual).ok);eq(core.soundMessagesView(old).current.source,frozen,'opened Garden record keeps own source/bank');
 const rawKeep=copy(g);rawKeep.wordRoom.gardenSoundMessages.records.last.firstKept={future:'raw'};ok(core.chooseSoundCase(rawKeep,'last','listen',actual).ok);ok(core.actSoundCase(rawKeep,'partner',null,actual).ok);ok(core.actSoundCase(rawKeep,'hidePartner',null,actual).ok);ok(core.actSoundCase(rawKeep,'keep',null,actual).ok);eq(rawKeep.wordRoom.gardenSoundMessages.records.last.firstKept,{future:'raw'});
 const tight=copy(g);delete tight.wordRoom.gardenSoundMessages.records['first-1'];tight.gardenPadding='';tight.gardenPadding='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(raw(tight)));ok(actual.canExport(tight));const before=copy(tight);eq(core.chooseSoundCase(tight,'first-1','read',actual).ok,false);eq(tight,before,'whole-report capacity refusal preserves all three packets');
}
console.log(`Sound-changing Prop Box: ${n} content/core/render checks passed; native browser checks remain separate.`);
