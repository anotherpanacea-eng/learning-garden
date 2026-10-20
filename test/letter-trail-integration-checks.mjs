import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {MESSAGE_CATALOG,messageCase} from '../dist/message-content.mjs';
import {chooseMessageCase,setMessagePage,setMessageText,setMessageCard,setMessageClue,testMessageCard,useMessageSupport,setMessagePlayback} from '../dist/message-core.mjs';
import {letterState,currentLetter,drawLetter,selectLetter,carryLetter,keepLetter,recoverLetters} from '../dist/letter-trail-core.mjs';
import {letterPage,letterNotes,letterEntry,bindLetterTrail} from '../dist/letter-trail-ui.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const fresh=()=>initializeExplorerState(freshState());
const locate=(s,p,id)=>{for(let n=0;n<12;n++){const e=drawLetter(s,p,messageCase(id).kind||'detail');if(e.caseId===id)return currentLetter(s,p);}throw Error('Case did not rotate into view');};
for(const c of MESSAGE_CATALOG)for(const place of ['post','loft']){
 const s=fresh(),x=locate(s,place,c.id),before=structuredClone(x.episode);
 for(const page of ['inspect','revise','play','human','story']){
  setMessagePage(x.adapter,place,page);const html=letterPage(s,place),raw=JSON.stringify(s);
  ok(html.includes(c.original)&&html.includes(c.request),'current scene/request stay visible');
  ok(html.includes('My letter round')&&html.includes('Reading with'),'round and pictured reader integrated');
  if(page==='revise')eq(x.episode.cardOrder.map(id=>html.indexOf(`data-msg-card="${id}"`)),[...x.episode.cardOrder.map(id=>html.indexOf(`data-msg-card="${id}"`))].sort((a,b)=>a-b),'frozen card order rendered');
  if(page==='inspect'&&['pair','reader'].includes(c.kind))ok(html.includes('Which clue answers the whole question?'),'useful partial clues are distinct from answering the whole question');
  if(page==='inspect')eq(x.episode.clueOrder.map(id=>html.indexOf(`data-msg-clue="${id}"`)),[...x.episode.clueOrder.map(id=>html.indexOf(`data-msg-clue="${id}"`))].sort((a,b)=>a-b),'frozen clue order rendered');
  eq(JSON.stringify(s),raw,'render is read-only');const imported=prepareProgressImport(raw);ok(imported.ok,'complete loop notes import');eq(imported.state.letterTrail,s.letterTrail,'current drafts/options restore exactly');
 }
 eq(x.episode.cardOrder,before.cardOrder,'page changes do not reorder cards');eq(x.episode.clueOrder,before.clueOrder,'page changes do not reorder clues');
 setMessagePage(x.adapter,place,'play');for(const card of c.cards){setMessageCard(x.adapter,place,card.id);setMessagePlayback(x.adapter,place,1);const html=letterPage(s,place);ok(html.includes(card.text)&&html.includes(card.outcome)&&html.includes(card.reply),'all literal outcomes retain the exact supplied sentence');}
 if(c.originalActionable){setMessagePlayback(x.adapter,place,0);ok(letterPage(s,place).includes(c.originalOutcome),'before acts on actionable original rather than pretending to block');}
}
{
 const s=fresh();startPostOffice(s,deliveries[0].id);startShow(s,'delivery');setSceneDialogue(s,'A fictional show already in progress.');chooseMessageCase(s,'loft','basket');setMessageText(s,'loft','original','A fictional original desk note.');
 const original=JSON.stringify({messages:s.messages,post:s.postOffice,loft:s.loft});
 for(const k of ['detail','pair','reader']){drawLetter(s,'post',k);const x=currentLetter(s,'post');setMessageCard(x.adapter,'post',x.case.cards.find(c=>c.fits).id);setMessageClue(x.adapter,'post',x.case.clues.find(c=>c.relevant).id);testMessageCard(x.adapter,'post');keepLetter(s,'post');carryLetter(s,'post');setMessageText(currentLetter(s,'loft').adapter,'loft','reply','A fictional reply.');}
 eq(JSON.stringify({messages:s.messages,post:s.postOffice,loft:s.loft}),original,'real parcel, original desk and authored show remain exact');
 const imported=prepareProgressImport(JSON.stringify(s));eq(JSON.stringify({messages:imported.state.messages,post:imported.state.postOffice,loft:imported.state.loft}),original,'all old work survives transfer');
 const x=currentLetter(s,'loft'),text='  <img src=x onerror="fictional()"> & "hello"\n🐈  ';
 for(const field of ['original','reason','reply'])setMessageText(x.adapter,'loft',field,text);
 for(const page of ['human','story']){setMessagePage(x.adapter,'loft',page);const html=letterPage(s,'loft');ok(!html.includes('<img src=x')&&html.includes('&lt;img'),'original words escaped in all reader views');}
 ok(!destinationNotes(s).includes('<img src=x'),'notes escape all local writing');eq(prepareProgressImport(JSON.stringify(s)).state.letterTrail,s.letterTrail,'whitespace/Unicode exact in transfer');
 const earlier=structuredClone(x.episode);drawLetter(s,'post','detail');selectLetter(s,'loft',earlier.id);eq(currentLetter(s,'loft').episode,earlier,'reopening does not rewrite reader/drafts/options');
 ok(letterPage(s,'post','round').includes('latest 24 letters'),'retention disclosed on round page');ok(letterNotes(s).includes('latest 24 letters'),'retention disclosed in download notes');
}
for(const payload of [null,[],3,{version:97,words:'<script>fictional</script>'},{version:1,episodes:[]}]){
 const s=fresh();s.letterTrail=structuredClone(payload);const raw=JSON.stringify(s);ok(!letterState(s),'unsupported root unavailable');ok(letterPage(s,'post').includes('An earlier letter round is kept'),'safe unavailable view');ok(!letterNotes(s).includes('<script>fictional'),'unsupported data escaped');eq(JSON.stringify(s),raw,'unavailable rendering leaves payload exact');
 const imported=prepareProgressImport(raw);ok(imported.ok,'future loop data retained through import');eq(imported.state.letterTrail,payload,'future raw payload exact');recoverLetters(s);eq(s.letterTrail.recovered,payload,'explicit recovery retains full original');eq(prepareProgressImport(JSON.stringify(s)).state.letterTrail,s.letterTrail,'recovery transfers');
}
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const storage=new Storage(),store=new ExplorerStore(storage);let s=initializeExplorerState(store.load());const id=store.active.id;drawLetter(s,'post');setMessageText(currentLetter(s,'post').adapter,'post','original','A fictional changing note.');store.save(s);eq(new ExplorerStore(storage).load().letterTrail,s.letterTrail,'saved letter round reloads');
 const other=store.add({},s);ok(!other.letterTrail,'new explorer starts separately');s=store.select(id,other);eq(currentLetter(s,'post').work.original,'A fictional changing note.','explorer returns exact words');store.setPersistence(false,s);store.save(s);eq(store.load().letterTrail,s.letterTrail,'save-off session remains playable');ok(!new ExplorerStore(storage).load().letterTrail,'save-off leaves no persisted round');ok(!store.clearActive().letterTrail,'reset clears active letter round');
}
{
 const s=fresh();drawLetter(s,'post');const x=currentLetter(s,'post');setMessagePage(x.adapter,'post','play');setMessageCard(x.adapter,'post',x.case.cards.find(c=>c.fits).id);setMessageClue(x.adapter,'post',x.case.clues.find(c=>c.relevant).id);
 const keep={dataset:{letterKeep:'supplied'}},round={};let renders=0,focused='',saved=0;const previous=globalThis.document;
 globalThis.document={querySelectorAll(selector){return selector==='[data-letter-keep]'?[keep]:selector==='[data-letter-round]'?[round]:[];},querySelector(){return null;}};
 try{bindLetterTrail(s,'post',{save(){saved++;},render(){renders++;},navigate(){},focus(selector){focused=selector;}});keep.onclick();ok(x.episode.firstKept&&renders===1&&saved===1,'keep is explicit saved action');eq(focused,'.letter-keep','keep focuses its result');const recent=structuredClone(s.letterTrail.recent);keep.onclick();eq(s.letterTrail.recent,recent,'repeated keep through binder never counts twice');}finally{globalThis.document=previous;}
}
ok(letterEntry('post').includes('#post/letters/round')&&letterEntry('loft').includes('#loft/messages'),'both entries expose loop plus old drafts');
console.log(`Changing-letter UI/storage integration: ${checks} passed.`);
