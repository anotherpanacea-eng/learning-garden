import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {collectionSource,collectionView,startCollection,recoverCollection,editCollection,supportCollection,checkCollection,keepCollection,collectionResult} from '../dist/count-collection-core.mjs';
import {collectionPage,collectionNotes} from '../dist/count-collection-ui.mjs';
import {prepareProgressImport,initializeExplorerState,MAX_IMPORT_BYTES} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
const clone=structuredClone,json=JSON.stringify,fresh=()=>initializeExplorerState(freshState());let checks=0;
const ok=(x,m)=>{assert.ok(x,m);checks++;},eq=(x,y,m)=>{assert.deepEqual(x,y,m);checks++;};
const report=s=>JSON.stringify({title:'Synthetic collection notes',exportedAt:'2026-10-22T18:00:00Z',...s},null,2),fits=s=>prepareProgressImport(report(s)).ok;
{
 const s=fresh(),before=json(s);collectionPage(s);collectionNotes(s);eq(json(s),before,'opening is read only');ok(collectionView(s).status==='missing'&&!Object.hasOwn(s,'countCollection'),'initialization does not allocate');ok(startCollection(s,fits),'explicit start');
 for(const id of ['round','square','triangle'])eq(s.countCollection.source.categories.find(c=>c.id===id).count,0,'empty is zero');
 ok(checkCollection(s,'representation',fits),'empty picture may be checked');const result=collectionView(s).feedback.result;ok(!result.tableMatches&&result.barsMatch,'blank table not zero but zero bars match zero source');
 editCollection(s,'table','round','0.0');editCollection(s,'table','square','0');editCollection(s,'table','triangle','0');ok(checkCollection(s,'representation',fits)&&collectionView(s).feedback.result.tableMatches,'equivalent whole-valued decimal is accepted');
}
for(let a=0;a<=12;a++)for(let b=0;b<=12;b++){
 const source=clone(collectionSource);source.categories[0].count=12-a;source.categories[1].count=12-b;
 const s={source,table:{round:String(12-a),square:'',triangle:'bad'},bars:{round:a,square:b,triangle:0},scale:2,response:{choice:a===b?'same':a>b?'first':'second',difference:String(Math.abs(a-b))},support:[]};
 const r=collectionResult(s,'reading');ok(r.choiceCorrect&&r.differenceCorrect,'all boundary/tie relations read chart');eq(r.barsMatch,a===6&&b===6,'faithfulness separate from reading own mismatched bars');
}
{
 const s=fresh();startCollection(s);editCollection(s,'count','round',1);editCollection(s,'count','round',1);editCollection(s,'count','round',1);editCollection(s,'bar','round',1);editCollection(s,'bar','round',1);editCollection(s,'bar','round',1);
 editCollection(s,'table','round','3');editCollection(s,'table','square','0');editCollection(s,'table','triangle','0');supportCollection(s,'help');supportCollection(s,'together');supportCollection(s,'narrationRequested');
 ok(checkCollection(s,'representation',fits),'representation check');const old=clone(collectionView(s).feedback);ok(keepCollection(s,false,fits),'keep draft with exact applicable check');const kept=json(s.countCollection.kept);
 editCollection(s,'count','round',1);ok(!collectionView(s).feedback,'source edit removes live verdict');eq(s.countCollection.checks[0],old,'source edits leave historical result unchanged');
 for(let i=0;i<6;i++)checkCollection(s,'representation',fits);eq(collectionView(s).readable.length,4,'visible recent window rolls');eq(json(s.countCollection.kept),kept,'kept work does not roll');ok(!keepCollection(s,false,fits)&&keepCollection(s,true,fits),'replacement is explicit');
 const before=json(s.countCollection);editCollection(s,'scale',null,2);editCollection(s,'page',null,'chart');const drawn=collectionPage(s);ok(drawn.includes('data-value="3"')&&drawn.includes('width="60"'),'odd bar is not snapped on twos axis');
 const sourceWork=collectionView(s).work;sourceWork.page='table';const tableSpeech=collectionPage(s).match(/data-speak="([^"]*)"/)[1];ok(tableSpeech.includes('table entry: 3')&&!tableSpeech.includes('bar:'),'table narration names table draft rather than hidden bars');sourceWork.page='chart';
 const restored=prepareProgressImport(report(s));ok(restored.ok&&json(restored.state.countCollection)===json(s.countCollection),'actual import preserves whole current and kept model');
 s.countCollection.feedbackId=old.id;s.countCollection.checks.push(old);ok(!collectionView(s).feedback,'stale feedback never appears current beside edited source');
 s.countCollection.kept.check.snapshot.table=Object.fromEntries(Object.entries(s.countCollection.kept.check.snapshot.table).reverse());ok(!collectionView(s).keptUnreadable,'harmless saved key order does not disable kept work');ok(keepCollection(s,true,fits),'reordered own snapshot can be replaced explicitly');
 const currentLabels=collectionSource.categories.map(c=>c.label);try{collectionSource.categories[0].label='Changed current words';const r=prepareProgressImport(report(s));ok(r.ok&&collectionPage(r.state).includes('Round buttons'),'saved source is not current catalog');}finally{collectionSource.categories.forEach((c,i)=>c.label=currentLabels[i]);}
}
{
 const s=fresh();startCollection(s);s.countCollection.source.categories=[{id:'retired-a',label:'Old & first',shape:'circle',count:2},{id:'retired-b',label:'Old second',shape:'square',count:1}];s.countCollection.table={'retired-a':'','retired-b':''};s.countCollection.bars={'retired-a':1,'retired-b':2};s.countCollection.page='read';
 const html=collectionPage(s);ok(html.includes('Old &amp; first')&&html.includes('Old second')&&!html.includes('more round buttons'),'reading uses own arbitrary saved categories');
 s.countCollection.source.categories.pop();ok(collectionPage(s).includes('This version has one category')&&prepareProgressImport(report(s)).ok,'single category stays open without fabricated comparison');
}
{
 const s=fresh();startCollection(s);checkCollection(s,'representation');s.countCollection.checks.push({id:99,unknown:'kept raw'});s.countCollection.kept={future:true};const raw=clone(s.countCollection.checks.at(-1)),before=json(s);
 ok(collectionView(s).unreadable.length===1&&collectionView(s).keptUnreadable,'bad siblings isolated');collectionPage(s);collectionNotes(s);eq(json(s),before,'render preserves unknown siblings');ok(!keepCollection(s,true,fits),'unreadable kept copy cannot be overwritten');
 checkCollection(s,'representation',fits);eq(s.countCollection.checks.find(c=>c.unknown),raw,'new checks retain unknown raw slots');eq(s.countCollection.checks[1],raw,'raw sibling stays beside surviving earlier check');ok(prepareProgressImport(report(s)).ok,'actual importer retains bad siblings');
 ok(recoverCollection(s,fits)&&s.countCollection.retainedRaw.kept.future,'explicit recovery retains full earlier root');
}
for(const raw of [false,{version:99,retained:'raw'},null]){const s=fresh();s.countCollection=raw;const before=json(s);ok(prepareProgressImport(report(s)).ok&&collectionView(s).status==='recovery','raw optional root imports');collectionPage(s);eq(json(s),before,'unreadable root unchanged on display');ok(recoverCollection(s,fits)&&json(s.countCollection.retainedRaw)===json(raw),'whole raw root remains after explicit recovery');}

{
 const s=fresh();startCollection(s);s.padding='x';const overhead=new TextEncoder().encode(report(s)).length;s.padding='x'.repeat(MAX_IMPORT_BYTES-overhead);ok(fits(s),'boundary starting notebook imports');const before=json(s.countCollection);ok(!checkCollection(s,'representation',fits)&&json(s.countCollection)===before,'actual formatted boundary refuses appended check atomically');ok(!keepCollection(s,false,fits)&&json(s.countCollection)===before,'actual formatted boundary refuses Keep atomically');
 const blank=fresh();blank.padding='x';const blankOverhead=new TextEncoder().encode(report(blank)).length;blank.padding='x'.repeat(MAX_IMPORT_BYTES-blankOverhead);ok(fits(blank),'notebook without collection fits exact boundary');const blankBefore=json(blank);ok(!startCollection(blank,fits)&&json(blank)===blankBefore,'actual formatted boundary refuses new allocation atomically');
 const deep=fresh();deep.countCollection={raw:null};let node=deep.countCollection;for(let i=0;i<59;i++)node.next=node={};const old=json(deep.countCollection);ok(fits(deep),'original deep raw notebook is importable');ok(!recoverCollection(deep,fits)&&json(deep.countCollection)===old,'nested raw recovery refuses before replacing');
}
class Storage{constructor(){this.m=new Map();this.fail=false;}get length(){return this.m.size;}key(i){return [...this.m.keys()][i]??null;}getItem(k){return this.m.get(k)??null;}setItem(k,v){if(this.fail)throw Error('quota');this.m.set(k,v);}removeItem(k){this.m.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk),s=store.load();initializeExplorerState(s);startCollection(s);editCollection(s,'table','round','');editCollection(s,'bar','round',1);editCollection(s,'page',null,'read');store.save(s);const first=store.active.id;
 const other=store.add({},s);initializeExplorerState(other);ok(!Object.hasOwn(other,'countCollection'),'new explorer remains separate');const back=store.select(first,other);eq(back.countCollection.bars.round,1,'switching preserves picture');
 ok(store.setPersistence(false,back)&&store.load()===back,'saving off keeps session');store.setPersistence(true,back);disk.fail=true;ok(!store.save(back)&&store.warning&&store.load()===back,'quota failure keeps in-memory work');disk.fail=false;const clear=store.clearActive();ok(!Object.hasOwn(clear,'countCollection'),'explicit reset clears active collection');
}
console.log(`${checks} count collection source, representation, storage and recovery checks passed.`);
