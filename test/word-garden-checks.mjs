import assert from 'node:assert/strict';
import {roots,parts,blooms,extras,questions,discoveryInvitation} from '../dist/word-garden-content.mjs';
import {pairId,resultFor,validWords,wordState,chooseBase,choosePart,tryWord,replayWord,addAnotherPart,chooseQuestion,nextQuestion,discussWord} from '../dist/word-garden-core.mjs';
import {wordGardenPage,wordGardenNotes} from '../dist/word-garden-ui.mjs';
import {freshState} from '../dist/core.mjs';
import {ExplorerStore,SAVE_KEY} from '../dist/explorer-storage.mjs';
let n=0;const check=(v,m)=>{assert.ok(v,m);n++;},equal=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};
const grow=(s,b,p)=>{check(chooseBase(s,b));check(choosePart(s,p));check(tryWord(s));};
equal(blooms.length,23);equal(extras.length,7);equal(questions.length,8);
equal(new Set(blooms.map(b=>b.id)).size,23);
for(const base of [...roots,'helpful'])for(const p of parts){
 const s=freshState(),before=JSON.stringify(s);const html=wordGardenPage(s);check(html.includes('Word Garden'));equal(JSON.stringify(s),before,'render does not create state');
 grow(s,base,p.id);const id=pairId(base,p.id),r=resultFor(id);check(validWords(s.words));equal(s.words.draft.result,id);check(['bloom','real','wonder'].includes(r.kind));
 const output=wordGardenPage(s);check(output.includes('word-result-title'));check(!/isn.t a word|wrong answer|incorrect|wilt/i.test(output));
 if(r.kind==='bloom'){equal(s.words.grown,[r.word]);equal(s.words.discoveries,[]);check(output.includes(r.scene));}
 else{equal(s.words.discoveries,[id]);equal(s.words.grown,[]);if(r.kind==='wonder'){
  check(output.includes('a letter experiment'));check(output.includes(discoveryInvitation.replaceAll("'",'&#39;')));const speech=[...output.matchAll(/data-speak="([^"]*)"/g)].map(m=>m[1]);check(speech.some(s=>s===discoveryInvitation.replaceAll("'",'&#39;')));check(!speech.some(s=>s.includes(base+p.id)||s===p.id+base),'no unknown joined pronunciation');
 }}
 const once=JSON.stringify(s.words);check(tryWord(s));equal(JSON.stringify(s.words),once,'repeat does not duplicate');
 check(chooseBase(s,base==='pack'?'read':'pack'));equal(s.words.draft.result,id,'selection keeps result');check(replayWord(s,id));equal(s.words.draft.base,base);equal(s.words.draft.part,p.id);
 const restored=JSON.parse(JSON.stringify(s));equal(wordGardenPage(restored),wordGardenPage(s),'reload exact result');
}
{
 const s=freshState();check(!addAnotherPart(s));grow(s,'help','ful');check(addAnotherPart(s));equal(s.words.draft.base,'helpful');equal(s.words.draft.result,'help:ful');check(tryWord(s));equal(s.words.grown,['helpful','unhelpful']);check(wordGardenPage(s).includes('un- + helpful → unhelpful'));
 equal(resultFor('care:er').word,'carer');equal(resultFor('tie:er').word,'tier');check(resultFor('tie:er').note.includes('final e'));
 equal(resultFor('paint:un').kind,'real');equal(resultFor('paint:un').word,'unpaint');equal(resultFor('read:un').word,'unread');
}
{
 const s=freshState();for(const q of questions){check(chooseQuestion(s,q.id));for(let i=0;i<q.choices.length;i++){check(discussWord(s,i));check(wordGardenPage(s).includes(q.explanation));check(validWords(s.words));}}equal(s.words.seen.length,8);equal(s.words.grown,[],'transfer questions need no bloom');check(nextQuestion(s));equal(s.words.draft.choice,null);check(!discussWord(s,-1));check(!discussWord(s,999));check(!chooseQuestion(s,'unknown'));check(!replayWord(s,'pack:re'));
}
for(const raw of [null,{}, {version:2,privateFuture:'kept'}, {...wordState({}),grown:['unknown']},{...wordState({}),draft:{...wordState({}).draft,result:'paint:<img>'}}, {...wordState({}),future:'kept'}]){
 const s={...freshState(),words:raw},before=JSON.stringify(s);check(wordGardenPage(s).includes('format this version cannot read'));check(wordGardenNotes(s).includes('unchanged'));check(!chooseBase(s,'pack'));check(!choosePart(s,'re'));check(!tryWord(s));check(!replayWord(s,'pack:re'));check(!chooseQuestion(s,'again'));check(!discussWord(s,0));check(!nextQuestion(s));check(!addAnotherPart(s));equal(JSON.stringify(s),before,'unknown raw stays exact');
}
class Storage{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk),a=store.load();grow(a,'paint','un');check(chooseQuestion(a,'thankful'));check(discussWord(a,2));check(store.save(a));const first=store.active.id,expected=JSON.stringify(a.words);
 const b=store.add({},a);check(b);grow(b,'pack','re');check(store.save(b));const second=store.active.id;equal(store.select(first,b).words,a.words,'explorer isolated');equal(JSON.stringify(new ExplorerStore(disk).load().words),expected,'store reload keeps result/question/choice');
 check(store.setPersistence(false,a));equal([...disk.data.keys()],[SAVE_KEY]);equal(store.select(second,a).words.grown,['repack'],'save off retains other in-memory explorer');check(store.setPersistence(true,b));const cleared=store.clearActive();check(!Object.hasOwn(cleared,'words'));equal(store.select(first,cleared).words.discoveries,['paint:un'],'clear affects only chosen explorer');
 const unknown={...a,words:{version:99,unreadFuture:{original:['synthetic']}}};check(store.save(unknown));equal(new ExplorerStore(disk).load().words,unknown.words,'unsupported Word Garden stays in exported/saved raw state');
}
console.log(`${n} Word Garden checks passed.`);
