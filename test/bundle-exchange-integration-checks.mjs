import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {nextGuest,adjustBite} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {startPostOffice,setPostPackingInput} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {drawLetter} from '../dist/letter-trail-core.mjs';
import {chooseTrailCase,setTrailReading,keepTrail} from '../dist/fraction-trail-core.mjs';
import {itemById,familiarity} from '../dist/broad-core.mjs';
import {bundleCases,bundlePages,bundleKinds,bundleHelpTopics} from '../dist/bundle-exchange-content.mjs';
import * as B from '../dist/bundle-exchange-core.mjs';
import {renderBundleExchange,bundleExchangeNotes,bundleExchangeEntry} from '../dist/bundle-exchange-ui.mjs';
import {bundleTable} from '../dist/bundle-exchange-art.mjs';
import {noteBundleDisplay} from '../dist/bundle-broad-exposure.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
let n=0;const ok=(x,m)=>{assert.ok(x,m);n++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;};const fresh=()=>initializeExplorerState(freshState());
{
 const s=fresh(),before=JSON.stringify(s);B.bundleView(s);renderBundleExchange(s);bundleExchangeNotes(s);destinationNotes(s);eq(JSON.stringify(s),before,'all readers lazy');ok(!Object.hasOwn(prepareProgressImport(before).state,'bundleExchange'),'absent root import remains absent');
}
for(const c of bundleCases){const s=fresh();B.chooseBundleCase(s,c.id);for(const k of bundleKinds)B.setBundleText(s,k,'2-');for(const page of bundlePages){B.setBundlePage(s,page);for(const topic of [null,...bundleHelpTopics]){B.setBundleHelp(s,topic);const before=JSON.stringify(s),view=renderBundleExchange(s);ok(view.html.includes(c.request),'current request retained');eq(view.facts,[],'no literal multiplication facts displayed');eq(JSON.stringify(s),before,'render creates no exposure or attempt');eq(prepareProgressImport(before).state.bundleExchange,s.bundleExchange,'raw source/model/page/help transfer exact');const v=B.bundleView(s),art=bundleTable(v.model,{total:c.total});eq((art.match(/class="bundle-seed"/g)||[]).length,c.total,'one countable mark per counter, no duplicates');if(c.total<10&&page==='digits'){ok(view.html.includes('No tens digit is written'),'no unwritten digit identification');ok(!view.html.includes('Read its tens digit'),'one-digit page never asks to locate unwritten digit');}ok(view.html.indexOf('id="bundle-page-title"')<view.html.indexOf('class="bundle-table"'),'task instruction precedes apparatus');ok(page==='exchange'?view.html.includes('data-bundle-action="move"'):!view.html.includes('data-bundle-action="move"')&&view.html.includes('Change this grouping'),'short pages preserve a route to grouping controls');}}B.keepBundle(s);eq(prepareProgressImport(JSON.stringify(s)).state.bundleExchange,s.bundleExchange,'unfinished frozen keep exact');}
{
 const s=fresh();nextGuest(s);adjustBite(s,ingredients[0].id,1);startPostOffice(s,deliveries[0].id);setPostPackingInput(s,'2-');startShow(s,'welcome');setSceneDialogue(s,'A fictional seed show.');drawLetter(s,'post');chooseTrailCase(s,'repair-thirds');setTrailReading(s,'2-');keepTrail(s);const question={...structuredClone(itemById('number-foundation')),variant:null};s.broad.drafts['checkin:number-foundation']={question,attempts:[],input:'2-',model:structuredClone(question.model),familiar:false};const before=structuredClone(s);
 for(const c of bundleCases){B.chooseBundleCase(s,c.id);B.countBundleTogether(s);B.wrapBundle(s);B.unwrapBundle(s);B.returnBundleFrame(s);for(const k of bundleKinds){B.setBundleText(s,k,'27');B.checkBundle(s,k);}B.keepBundle(s);const view=renderBundleExchange(s);noteBundleDisplay(s,view.examples);}
 const after=structuredClone(s);delete after.bundleExchange;eq(after,before,'café/post packing/letters/Loft/fraction/Number Garden drafts unchanged for nonmatching examples');const imported=prepareProgressImport(JSON.stringify(s));ok(imported.ok,'whole notebook import');delete imported.state.bundleExchange;eq(imported.state,before,'waiting crossgame work exact after import');
}
{
 const s=fresh();B.chooseBundleCase(s,'twenty-seven');const sig='bundle:0:2:7';eq(renderBundleExchange(s).examples,[],'one wrapped and seventeen loose not canonical');B.setBundlePage(s,'digits');let view=renderBundleExchange(s);eq(view.examples,[sig],'actually displayed complete conventional readout qualifies beside noncanonical table');noteBundleDisplay(s,view.examples);eq(familiarity(s,itemById('number-support')).familiar,true,'app display hook marks exact authored task');B.setBundlePage(s,'read');eq(renderBundleExchange(s).examples,[],'history does not claim currently shown canonical example');B.rearrangeBundleTogether(s);view=renderBundleExchange(s);eq(view.examples,[sig],'complete current canonical diagram qualifies');for(const k of ['wrapped-count','total-count']){B.setBundleText(s,k,k==='wrapped-count'?'2':'27');B.checkBundle(s,k);}B.moveBundleCounter(s,1);ok(B.bundleView(s).feedback['total-count'],'total feedback stays valid when frame grouping changes');eq(B.bundleView(s).feedback['wrapped-count'],null,'grouping clears wrapped feedback');
 const t=fresh();B.chooseBundleCase(t,'thirteen');B.setBundleHelp(t,'example');for(let step=0;step<4;step++){view=renderBundleExchange(t);eq(view.examples,step===2?['bundle:0:1:6']:[],'only visible wrapped16 example emits');if(step<3)B.stepBundleExample(t);}
}
for(const payload of [null,[],5,{version:99,raw:'<img src=x onerror="fictional()">'}]){const s=fresh();s.bundleExchange=payload;const before=JSON.stringify(s);ok(renderBundleExchange(s).html.includes('cannot play'),'unsupported unavailable');ok(!destinationNotes(s).includes('<img src=x'),'unknown raw notes escaped');eq(JSON.stringify(s),before,'unsupported reads preserve exact root');eq(prepareProgressImport(before).state.bundleExchange,payload,'unsupported transfer exact');B.recoverBundle(s);B.setBundleText(s,'total-count','13');B.checkBundle(s,'total-count');B.keepBundle(s);eq(B.bundleView(s).kept.priorExposureUnknown,true,'recovery keeps unknown');ok(bundleExchangeNotes(s).includes('Earlier encounters or checks are unknown'),'notes qualify history');eq(prepareProgressImport(JSON.stringify(s)).state.bundleExchange,s.bundleExchange,'recovered root exact');}
for(const support of [{},42,null]){const s=fresh();B.setBundlePage(s,'digits');s.bundleExchange.cases[s.bundleExchange.currentCase].support=support;const before=structuredClone(s.bundleExchange);eq(B.bundleState(s),null,'malformed digits support is unavailable without throwing');ok(renderBundleExchange(s).html.includes('cannot play'),'malformed known root renders recovery');eq(prepareProgressImport(JSON.stringify(s)).state.bundleExchange,before,'malformed support imports unchanged');}
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
// Generated through 5bfac02^'s API and accepted by its validator: two collections,
// five checks (including number/unit mismatches), two keeps and two input errors.
const legacyBundle=JSON.parse(fs.readFileSync(new URL('./fixtures/bundle-exchange-v1-labels.json',import.meta.url),'utf8'));
const restoredBundle=JSON.parse(JSON.stringify(legacyBundle).replaceAll('"wrapped bundles"','"wrapped"').replaceAll('"individual counters"','"counters"').replaceAll('"Enter a whole number from 0 to 99 using digits."','"needs-number"'));
for(const mode of ['units and errors','units','errors']){
 const source=structuredClone(mode==='errors'?restoredBundle:legacyBundle);
 if(mode!=='units and errors')for(const [id,w] of Object.entries(source.cases))w.errors=structuredClone((mode==='units'?restoredBundle:legacyBundle).cases[id].errors);
 const s=fresh();s.bundleExchange=source;
 const before=structuredClone(source),disk=new Storage(),store=new ExplorerStore(disk);store.load();ok(store.save(s),`${mode}: parent-format save written`);
 const reloaded=initializeExplorerState(new ExplorerStore(disk).load());
 eq(B.bundleView(reloaded).unsupported,false,`${mode}: parent-format save loads`);
 eq(B.bundleState(reloaded),restoredBundle,`${mode}: only known unit/error strings change; counts, targets, outcomes, checks and keeps survive`);
 ok(B.validBundle(B.bundleState(reloaded)),`${mode}: restored ids validate`);
 eq(reloaded.bundleExchange,before,`${mode}: reading preserves the original save`);
 eq(B.bundleHistoryUnknown(reloaded),false,`${mode}: known history stays known`);
 eq(B.recoverBundle(reloaded),false,`${mode}: readable save needs no recovery`);
 ok(renderBundleExchange(reloaded).html.includes('Enter a whole number from 0 to 99 using digits.'),`${mode}: input error still renders`);
 const imported=prepareProgressImport(JSON.stringify(reloaded));ok(imported.ok,`${mode}: notebook import succeeds`);
 eq(B.bundleState(imported.state),restoredBundle,`${mode}: imported save restores the same records`);
 const display=structuredClone(reloaded);ok(B.noteBundleExamples(display,['bundle:0:2:7']),`${mode}: display hook accepts restored save`);
 ok(B.validBundle(display.bundleExchange),`${mode}: display hook saves ids`);
 ok(B.chooseBundleCase(reloaded,'twenty-seven'),`${mode}: switch to other saved collection`);
 eq(B.bundleView(reloaded).kept,restoredBundle.cases['twenty-seven'].kept,`${mode}: other kept draft and mismatched outcomes intact`);
 eq(B.bundleView(reloaded).work.history,restoredBundle.cases['twenty-seven'].history,`${mode}: other historical drafts and targets intact`);
 B.setBundleText(reloaded,'total-count','27');ok(B.checkBundle(reloaded,'total-count'),`${mode}: restored collection can check`);
 eq(B.bundleView(reloaded).feedback['total-count'].outcomes,{numberMatches:true,unitMatches:true},`${mode}: new check uses ids`);
 eq(B.bundleView(reloaded).work.nextCheckId,restoredBundle.cases['twenty-seven'].nextCheckId+1,`${mode}: exactly one check added`);
 ok(B.keepBundle(reloaded),`${mode}: restored collection can keep`);
 ok(B.chooseBundleCase(reloaded,'empty'),`${mode}: unvisited collection remains open`);
 ok(B.chooseBundleCase(reloaded,'thirteen'),`${mode}: return to original collection`);
 eq(B.bundleView(reloaded).kept,restoredBundle.cases.thirteen.kept,`${mode}: original keep unchanged by navigation`);
 eq(B.bundleView(reloaded).work.drafts,restoredBundle.cases.thirteen.drafts,`${mode}: original raw input retained`);
 ok(B.validBundle(reloaded.bundleExchange),`${mode}: actions persist valid ids`);
 ok(store.save(reloaded),`${mode}: adapted save persists`);
 eq(new ExplorerStore(disk).load().bundleExchange,reloaded.bundleExchange,`${mode}: adapted save reloads exactly`);
}
for(const mutate of [w=>w.drafts['total-count'].unit='unknown unit',w=>w.errors['wrapped-count']='Unknown error sentence.']){
 const s=fresh();s.bundleExchange=structuredClone(legacyBundle);mutate(s.bundleExchange.cases.thirteen);const before=structuredClone(s);
 eq(B.bundleState(s),null,'unknown unit/error is not guessed');
 eq(s,before,'failed adaptation preserves the original save');
 const imported=prepareProgressImport(JSON.stringify(s));ok(imported.ok,'unreadable table leaves the rest of the notebook open');
 eq(imported.state.bundleExchange,s.bundleExchange,'unreadable table remains available for export');
}
{
 const disk=new Storage(),store=new ExplorerStore(disk);let s=initializeExplorerState(store.load());const id=store.active.id;B.chooseBundleCase(s,'forty-two');B.countBundleTogether(s);B.setBundleText(s,'total-count','2-');store.save(s);eq(new ExplorerStore(disk).load().bundleExchange,s.bundleExchange,'model/raw reload');const other=store.add({},s);ok(!other.bundleExchange,'explorer isolation');s=store.select(id,other);eq(B.bundleView(s).model,{wrapped:3,loose:2,frame:10},'same explorer resumes');store.setPersistence(false,s);store.save(s);eq(store.load().bundleExchange,s.bundleExchange,'save-off session retained');ok(!new ExplorerStore(disk).load().bundleExchange,'save-off disk removed');ok(!store.clearActive().bundleExchange,'reset clears active table');
}
{
 const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),ending=app.slice(app.indexOf('function endingFilm(){'),app.indexOf("if(!choosingExplorer)playFilm('welcome');"));let calls=0;const ctx=vm.createContext({state:fresh(),choosingExplorer:false,location:{hash:'#numbers/exchange'},cafeSupper(){calls++;return {complete:true,round:1};}});vm.runInContext(ending,ctx);eq(vm.runInContext('endingFilm()',ctx),null,'no film milestone');eq(calls,0,'no supper inspection');
}
ok(bundleExchangeEntry().includes('#numbers/exchange'),'entry reaches table');console.log(`Bundle Exchange app/storage integration: ${n} passed.`);
