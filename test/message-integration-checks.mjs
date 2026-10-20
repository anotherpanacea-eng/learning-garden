import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {MESSAGE_CASES} from '../dist/message-content.mjs';
import {messageState,currentMessage,chooseMessageCase,setMessagePage,setMessageText,setMessageCard,setMessageClue,testMessageCard,useMessageSupport,carryMessage,recoverMessages} from '../dist/message-core.mjs';
import {messagePage,messageNotes,messageEntry,bindMessages} from '../dist/message-ui.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const fresh=()=>initializeExplorerState(freshState());
{
 const s=fresh();startPostOffice(s,deliveries[0].id);startShow(s,'delivery');setSceneDialogue(s,'A fictional delivery story.');const originals=JSON.stringify({post:s.postOffice,loft:s.loft});
 for(const c of MESSAGE_CASES){chooseMessageCase(s,'post',c.id);setMessageCard(s,'post',c.cards[1].id);setMessageClue(s,'post',c.clues[0].id);useMessageSupport(s,'post','audio');testMessageCard(s,'post');carryMessage(s,'post');setMessageText(s,'loft','reply','A fictional reply.');setMessagePage(s,'loft','story');messagePage(s,'loft');carryMessage(s,'loft');}
 initializeExplorerState(s);eq(JSON.stringify({post:s.postOffice,loft:s.loft}),originals,'real pending parcel and authored show remain byte-for-byte equal across all message actions');
 const imported=prepareProgressImport(JSON.stringify(s));eq(JSON.stringify({post:imported.state.postOffice,loft:imported.state.loft}),originals,'transfer retains pending parcel and authored show');
}
for(const place of ['post','loft'])for(const c of MESSAGE_CASES){
 const s=fresh();chooseMessageCase(s,place,c.id);
 for(const page of ['inspect','revise','play','human','story']){
  setMessagePage(s,place,page);const before=JSON.stringify(s),html=messagePage(s,place);
  ok(html.includes(c.original)&&html.includes(c.request),'source note and request stay visible through every page');
  ok(html.includes('aria-label="The scene and original note"'),'pictured and described source');
  eq(JSON.stringify(s),before,'rendering is read-only');
  const imported=prepareProgressImport(before);ok(imported.ok,'complete notes import');eq(imported.state.messages,s.messages,'all page/draft state survives exact transfer');
 }
 for(const card of c.cards){setMessagePage(s,place,'revise');setMessageCard(s,place,card.id);setMessageClue(s,place,c.clues[0].id);testMessageCard(s,place);const html=messagePage(s,place);ok(html.includes(card.text)&&html.includes(card.outcome)&&html.includes(card.reply),'exact supplied sentence/outcome/response displayed');}
 setMessagePage(s,place,'revise');if(place==='loft')ok(messagePage(s,place).includes('data-msg-action="story"'),'direct Loft entry reaches reader stage without authoring text');
 ok(messagePage(s,place,'choose').includes('Choose a note to mend'),'explicit chooser leaves selected work intact');
 ok(messageEntry(place).includes(`#${place}/messages`),'entry into correct place');
}
{
 const s=fresh();chooseMessageCase(s,'post','basket');setMessageCard(s,'post','blankets');setMessagePage(s,'post','revise');
 const text='  <img src=x onerror="fictional()"> & "quotes"\n🐇  ';
 for(const field of ['original','reason','reply'])setMessageText(s,'post',field,text);
 testMessageCard(s,'post');const before=structuredClone(s);carryMessage(s,'post');
 for(const page of ['revise','human','story']){setMessagePage(s,'loft',page);const html=messagePage(s,'loft');ok(!html.includes('<img src=x'),'authored markup escaped');ok(html.includes('&lt;img'),'exact authored text shown as text');}
 const notes=destinationNotes(s);ok(!notes.includes('<img src=x')&&notes.includes('&lt;img'),'notebook escapes all authored strings');
 eq(prepareProgressImport(JSON.stringify(s)).state.messages,s.messages,'authored Unicode/newlines/whitespace preserve exact export/import');
 eq(s.messages.cases.basket.post,before.messages.cases.basket.post,'Loft revision leaves Post draft exact');
 ok(messagePage(s,'loft','kept').includes('did not replace it'),'non-overwrite crossing clearly explained');
}
for(const payload of [null,[],7,{version:99,draft:'<script>fictional</script>'},{version:1,cases:{}}]){
 const s=fresh();s.messages=structuredClone(payload);const before=JSON.stringify(s);
 ok(!messageState(s),'unsupported root unavailable');ok(messagePage(s,'post').includes('An earlier notebook is kept'),'safe unavailable page');ok(!messageNotes(s).includes('<script>fictional'),'unsupported notes escaped');eq(JSON.stringify(s),before,'rendering retains unsupported root');
 const imported=prepareProgressImport(before);ok(imported.ok,'unsupported root retained through import');eq(imported.state.messages,payload,'payload exact after import');
 ok(recoverMessages(s),'explicit recovery available');eq(s.messages.recovered,payload,'recovery retains exact previous value');eq(prepareProgressImport(JSON.stringify(s)).state.messages,s.messages,'recovery export/import');
}
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const storage=new Storage(),store=new ExplorerStore(storage);let s=initializeExplorerState(store.load());const id=store.active.id;
 chooseMessageCase(s,'post','flags');setMessageText(s,'post','original','Hang the flags for our neighbours.');store.save(s);
 eq(new ExplorerStore(storage).load().messages,s.messages,'saved message reloads');const other=store.add({},s);ok(!other.messages,'new explorer does not inherit another notebook');
 s=store.select(id,other);eq(currentMessage(s,'post').work.original,'Hang the flags for our neighbours.','switch returns exact original');
 store.setPersistence(false,s);setMessageText(s,'post','original','Only in this session.');store.save(s);eq(store.load().messages,s.messages,'save-off keeps session');ok(!new ExplorerStore(storage).load().messages,'save-off removes persistent messages');
 const reset=store.clearActive();ok(!reset.messages,'reset clears only active message root');
}
{
 const s=fresh();chooseMessageCase(s,'loft','basket');setMessagePage(s,'loft','story');setMessageCard(s,'loft','blankets');testMessageCard(s,'loft');
 const input={dataset:{msgText:'reason'},value:'A fictional reason.',addEventListener(event,fn){this[event]=fn;}},bubble={textContent:'',hidden:true},supplied={hidden:false},feedback={removed:false,remove(){this.removed=true;}};let saved=0;
 const previous=globalThis.document;globalThis.document={querySelectorAll(selector){return selector==='[data-msg-text]'?[input]:[];},querySelector(selector){return {'#msg-feedback':feedback,'[data-msg-story-bubble]':bubble,'.msg-supplied-dialogue':supplied}[selector]||null;}};
 try{bindMessages(s,'loft',{save(){saved++;},render(){throw Error('Typing must not rerender or lose caret');}});input.input();eq(currentMessage(s,'loft').work.reason,input.value,'typing saves exact reason');eq(bubble.textContent,input.value,'stage preview uses textContent');ok(saved===1&&feedback.removed&&!bubble.hidden&&supplied.hidden,'typing clears stale feedback and keeps authored preview');}finally{globalThis.document=previous;}
}
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8');ok(app.includes("['post','loft'].includes(root)&&slug==='messages'"),'both message routes before normal game');ok(app.includes("!['choose','groups','messages','letters'].includes(slug)"),'message route does not trigger Bramble ending');ok(app.includes('!groupBench&&!messageBench'),'unrelated invitations suppressed on focused task');
console.log(`Message-reader UI/storage integration: ${checks} passed.`);
