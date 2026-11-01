// Spec343 behavior and independent finite-content oracles. No acoustic/learning claim.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshState,recommendations} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {makeSoundMessageSource} from '../dist/word-room-sounds-content.mjs';
import * as m from '../dist/word-room-sounds-core.mjs';
import {wordRoomPage,wordRoomNotes} from '../dist/word-room-ui.mjs';
import {chooseWordRoomWord} from '../dist/word-room-core.mjs';
let checks=0;const eq=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;},ok=(x,label)=>{assert.ok(x,label);checks++;};
const clone=structuredClone,yes={canExport:()=>true},fresh=()=>initializeExplorerState(freshState());
const enter=s=>ok(m.enterSoundMessages(s,yes,'market').ok),view=s=>m.soundMessagesView(s,'market'),act=(s,a,v)=>ok(m.actSoundCase(s,a,v,yes).ok);
const pairs=[['e-middle','pan','pen',1],['u-middle','cap','cup',1],['two-vowels','bed','bud',1],['g-word','bag','bug',1],['e-start','hen','pen',0],['u-end','cup','cub',2]];
const source=makeSoundMessageSource('market');
eq([source.id,source.revision],['market-labels',1]);eq(Object.keys(source.cases),pairs.map(x=>x[0]));
for(const [id,left,right,position]of pairs){const c=source.cases[id];ok(m.soundCaseSource(c,id));eq([c.left.label,c.right.label,c.position],[left,right,position]);eq(c.alphabet,['a','b','c','d','e','f','g','h','i','m','n','o','p','s','t','u']);eq(c.left.letters,[...left]);eq(c.right.letters,[...right]);eq([c.example.left.label,c.example.right.label,c.example.position],['tin','pin',0]);}
for(const [id,word,pos]of [['e','hen',1],['u','cup',1],['d','bed',2],['g','bug',2]]){const t=source.teaching[id];ok(m.soundLetterSource(t,id));eq([t.glyph,t.word.label,t.position],[id,word,pos]);ok(t.guidance.includes(word));}
eq(source.message.text,'A bug is on a bud. A pen is in a cup. A cub is on a mat.');
eq(source.message.tokens.map(x=>x.text),['A','bug','is','on','a','bud','A','pen','is','in','a','cup','A','cub','is','on','a','mat']);
eq(source.message.tokens.map((x,i)=>x.role==='target'?i:null).filter(x=>x!==null),[1,5,7,11,13,17]);
for(const t of source.message.tokens)eq(source.message.text.slice(t.start,t.end),t.text);
const isolated=makeSoundMessageSource('market');isolated.cases['e-middle'].right.label='changed';eq(makeSoundMessageSource('market'),source,'factories do not share mutable source state');
const s=fresh();chooseWordRoomWord(s,'mat');ok(m.enterSoundMessages(s,yes).ok);ok(m.chooseSoundCase(s,'end','listen',yes).ok);act(s,'partner');act(s,'hidePartner');
act(s,'letter','c');act(s,'keep');s.wordRoom.soundMessages.records.end.source.right.label='cab';s.wordRoom.soundMessages.records.end.source.right.letters=[...'cab'];
s.syntheticOther={payload:'x'.repeat(300000)};const old=clone(s.wordRoom.soundMessages),parent=clone(s.wordRoom.source),other=clone(s.syntheticOther);
enter(s);old.active=false;eq(s.wordRoom.soundMessages,old,'entry changes only readable sibling navigation flag');eq(s.wordRoom.source,parent);eq(s.syntheticOther,other);
eq(m.activeSoundPacket(s),'market');eq(view(s).page,'choose');eq(view(s).root.sharedHelp,{message:false,letters:false});
act(s,'letters');eq([view(s).root.sharedHelp.letters,view(s).root.letterId],[true,'e']);act(s,'teachingLetter','g');eq(view(s).letter.source.word.label,'bug');
let html=wordRoomPage(s,'synthetic');ok(html.includes('Meet g')&&html.includes('bug'),'actual letter page renders selected frozen source');ok(!html.includes('data-speak='),'no phonics playback control');
const resumed=JSON.parse(JSON.stringify(s));eq(view(resumed).root.letterId,'g');eq(view(resumed).page,'letters');act(s,'caseBack');eq(view(s).page,'choose');
for(const [id,,target]of pairs){
 ok(m.chooseSoundCase(s,id,'listen',yes).ok);act(s,'partner');act(s,'hidePartner');
 html=wordRoomPage(s,'synthetic');ok(!new RegExp(`\\b${target}\\b`,'i').test(html),'no target in hidden-word DOM '+id);
 act(s,'letter','b');act(s,'keep');const first=clone(view(s).current.record.firstKept);act(s,'clear');for(const l of target)act(s,'letter',l);act(s,'compare');eq(m.currentComparison(view(s).current.record).result,'match');act(s,'back');act(s,'keep');
 eq(view(s).current.record.firstKept,first);eq(view(s).current.record.latestKept.slots,[...target]);
 act(s,'letters');act(s,'teachingLetter','u');act(s,'caseBack');eq(view(s).current.record.slots,[...target],'teaching roundtrip keeps exact work');
 act(s,'restoreFirst');eq(view(s).current.record.slots,['b',null,null]);ok(view(s).current.record.help.word,'restoring older material does not erase later disclosures');act(s,'choose');
}
eq(s.wordRoom.soundMessages,old,'all new-card actions leave old sources, draft, help and keeps intact');eq(s.syntheticOther,other);
act(s,'message');ok(wordRoomPage(s,'synthetic').includes(source.message.text.split(' ')[0]));eq(view(s).root.sharedHelp.message,true);ok(wordRoomNotes(s).includes('Market labels')&&wordRoomNotes(s).includes('Sound-changing prop labels'),'both packet notes, including inactive work');
const bookBefore=JSON.stringify(s);wordRoomPage(s,'synthetic');wordRoomNotes(s);eq(JSON.stringify(s),bookBefore,'render/report do not normalize records');
for(const run of [x=>m.enterSoundMessages(x,{canExport:()=>false},'show'),x=>m.actSoundCase(x,'letters',null,{canExport:()=>false}),x=>m.chooseSoundCase(x,'e-middle','read',{canExport:()=>false})]){const x=clone(s),before=clone(x);eq(run(x).ok,false);eq(x,before,'refusal preserves both packets and disclosures');}
const letters=clone(s);act(letters,'letters');const beforeLetter=clone(letters);eq(m.actSoundCase(letters,'teachingLetter','d',{canExport:()=>false}).ok,false);eq(letters,beforeLetter);
const stale=clone(s),staleBefore=clone(stale);eq(m.enterSoundMessages(stale,{canExport:()=>true,isCurrent:()=>false},'show').ok,false);eq(stale,staleBefore);
const poison=clone(s),replacement=clone(s.wordRoom);replacement.source.id='replacement-box';eq(m.enterSoundMessages(poison,{canExport:()=>{poison.wordRoom=replacement;return true;}},'show').error,'stale');eq(poison.wordRoom,replacement);
const broken=clone(s);broken.wordRoom.marketSoundMessages.source.teaching.e.guidance=7;act(broken,'letters');ok(view(broken).letter.source,'one bad lesson does not block readable lessons');const brokenBefore=clone(broken);eq(m.actSoundCase(broken,'teachingLetter','e',yes).ok,false);eq(broken,brokenBefore);ok(view(broken).cases.every(x=>x.source),'all cases still readable');
const badKey='Y'.repeat(160),badCard=clone(s);badCard.wordRoom.marketSoundMessages.source.teaching[badKey]={opaque:true};act(badCard,'letters');const badBefore=clone(badCard);const badHtml=wordRoomPage(badCard,'synthetic');ok(badHtml.includes('Card unavailable')&&!badHtml.includes(badKey),'unreadable source keys stay in saved data, not child controls');eq(badCard,badBefore);
const older=clone(s);delete older.wordRoom.marketSoundMessages.source.cases['u-end'];eq(view(older).status,'ready','do not demand today’s six source cases');ok(view(older).cases.find(x=>x.id==='u-end').earlier,'record-only earlier case retained');
const subset=clone(s);delete subset.wordRoom.marketSoundMessages.source.teaching.g;delete subset.wordRoom.marketSoundMessages.sharedHelp.letters;subset.wordRoom.marketSoundMessages.page='choose';eq(view(subset).status,'ready');ok(wordRoomNotes(subset).includes('not recorded'),'missing historic disclosure is not inferred false');
const opaque=clone(s);opaque.wordRoom.marketSoundMessages.v=99;const opaqueRaw=clone(opaque.wordRoom.marketSoundMessages);ok(m.enterSoundMessages(opaque,yes,'show').ok);eq(opaque.wordRoom.marketSoundMessages,opaqueRaw);ok(wordRoomPage(opaque,'synthetic').includes('Labels for the show'));
const opaqueOld=clone(s);opaqueOld.wordRoom.soundMessages.v=99;const opaqueOldRaw=clone(opaqueOld.wordRoom.soundMessages);enter(opaqueOld);eq(opaqueOld.wordRoom.soundMessages,opaqueOldRaw);
const dual=clone(s);dual.wordRoom.soundMessages.active=true;dual.wordRoom.marketSoundMessages.active=true;eq(m.activeSoundPacket(dual),'market');ok(m.leaveSoundMessages(dual,yes).ok);eq([dual.wordRoom.soundMessages.active,dual.wordRoom.marketSoundMessages.active],[false,false]);
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');const fn=app.match(/^function notesReport\(notebook\).*$/m)?.[0];ok(fn,'exercise actual full Notes report');const report=new Function('notebook','explorerStore','recommendations',`${fn};return notesReport(notebook);`),store={active:{avatar:'sky',color:'blue',symbol:'leaf'}};
const raw=x=>JSON.stringify(report(x,store,recommendations),null,2),real={canExport:x=>prepareProgressImport(raw(x)).ok};
ok(real.canExport(s));eq(JSON.parse(raw(s)).wordRoom,s.wordRoom,'actual transfer bytes retain both packets and their frozen sources');eq(JSON.parse(raw(s)).syntheticOther,s.syntheticOther);
const tight=clone(s);tight.wordRoom.marketSoundMessages.page='choose';tight.wordRoom.marketSoundMessages.sharedHelp.letters=false;delete tight.wordRoom.marketSoundMessages.letterId;tight.padding='';tight.padding='x'.repeat(MAX_IMPORT_BYTES-Buffer.byteLength(raw(tight)));eq(Buffer.byteLength(raw(tight)),MAX_IMPORT_BYTES);ok(real.canExport(tight));
const tightBefore=clone(tight);eq(m.actSoundCase(tight,'letters',null,real).ok,false);eq(tight,tightBefore,'full report overflow refuses new help atomically');
console.log(`Market Labels: ${checks} finite-content, packet, teaching, history and actual Notes assertions passed; oral performance remains unobserved.`);
