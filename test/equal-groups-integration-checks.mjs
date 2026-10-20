import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {freshState,restoreState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {nextGuest,adjustBite,orderFor,checkPlate,skipCafeStage,serveCafe,currentRecipe} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startAdaptiveRival} from '../dist/post-rival.mjs';
import {GROUP_CASES,GROUP_UNKNOWNS,groupPrompt} from '../dist/equal-groups-content.mjs';
import {ensureEqualGroups,groupState,chooseGroupCase,chooseGroupUnknown,currentGroupWork,moveGroupModel,setGroupInput,submitGroupAnswer,useGroupSupport,noteGroupView,carryGroupWork,setGroupMethod,recoverGroupState} from '../dist/equal-groups-core.mjs';
import {equalGroupsPage,equalGroupsNotes,equalGroupEntry,equalGroupPairsShown,bindEqualGroups} from '../dist/equal-groups-ui.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {noteLegacyExposure} from '../dist/broad-core.mjs';
import {noteGardenFactExposure} from '../dist/garden-core.mjs';
import {checkin} from '../dist/content.mjs';
let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(a,m)=>{assert.ok(a,m);checks++;},json=JSON.stringify;
const fresh=()=>initializeExplorerState(freshState());
class Storage{constructor(){this.data=new Map();this.fail=false;}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){if(this.fail)throw Error('Synthetic quota failure');this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
for(const place of ['cafe','bramble'])for(const c of GROUP_CASES)for(const unknown of GROUP_UNKNOWNS){
 const s=fresh();chooseGroupUnknown(s,place,unknown);chooseGroupCase(s,place,c.id);noteGroupView(s,place);const before=json(s),q=groupPrompt(c,place,unknown),html=equalGroupsPage(s,place);
 ok(html.includes(q.prompt)&&html.includes('Try my answer'),'actual question and answer form render');
 ok(html.includes(`aria-label="Tray holding ${c.total}`),'accessible tray model');
 eq(json(s),before,'question rendering is read-only');
 for(const given of q.givens)ok(html.includes(`<dd>${given.value}</dd>`),'only given ticket values rendered');
 ok(!html.includes(`<dd>${q.answer}</dd>`)||q.givens.some(g=>g.value===q.answer),'unknown value is not a ticket answer');
 eq(json(equalGroupPairsShown(s,place)),json([[c.groups,c.each]]),'current model exposes its real ordered pair');
 useGroupSupport(s,place,'example');ok(equalGroupsPage(s,place).includes('class="eg-help" open'),'worked example opens visibly');eq(json(equalGroupPairsShown(s,place)),json([[c.groups,c.each],[2,3]]),'worked example has its own exposure');
 setGroupInput(s,place,String(q.answer));submitGroupAnswer(s,place);ok(equalGroupsPage(s,place).includes('number fits'),'number match is distinct from an unfinished arrangement');
 const copied=restoreState(json(s));initializeExplorerState(copied);eq(json(copied.equalGroups),json(s.equalGroups),'save/restore keeps actual selection and model');
}
{
 const s=fresh();nextGuest(s);adjustBite(s,ingredients[0].id,1);startPostOffice(s,deliveries[0].id);startAdaptiveRival(s);
 const original=json({cafe:s.cafe,postOffice:s.postOffice});chooseGroupCase(s,'cafe','little-table');moveGroupModel(s,'cafe','scoop',0);useGroupSupport(s,'cafe','counters');setGroupInput(s,'cafe','12');submitGroupAnswer(s,'cafe');setGroupMethod(s,'cafe','together');
 const source=json(s.equalGroups.cases['little-table'].cafe);carryGroupWork(s,'cafe');noteGroupView(s,'bramble');
 const target=currentGroupWork(s,'bramble');eq(target.unknown,'each','crossing asks another unknown');eq(target.draft.attempts.length,0,'destination has no copied success');ok(target.draft.context.familiar&&target.draft.context.priorSupport.together,'late together report is retained as prior support');
 moveGroupModel(s,'bramble','out',0);setGroupInput(s,'bramble','4');submitGroupAnswer(s,'bramble');eq(json(s.equalGroups.cases['little-table'].cafe),source,'destination model edits preserve source record');eq(json({cafe:s.cafe,postOffice:s.postOffice}),original,'waiting guest/plate and unresolved rival are byte-for-byte unchanged');
 const html=destinationNotes(s);ok(html.includes('Source arrangement and help')&&html.includes('visual practice'),'notes show provenance and limits');
 const imported=prepareProgressImport(json(s));ok(imported.ok&&imported.summary.destinations.includes('Equal-group benches'),'actual import includes bench destination');eq(json(imported.state.equalGroups),json(s.equalGroups),'import preserves exact frozen model and evidence');
}
{
 const s=fresh();s.cafe.seed=192;s.cafe.range='small';nextGuest(s);const o=orderFor(s.cafe),food=ingredients.find(a=>!a.orchard&&o.wanted.every(p=>a.properties.includes(p)));for(let i=0;i<o.bites;i++)adjustBite(s,food.id,1);ok(checkPlate(s)&&skipCafeStage(s)&&skipCafeStage(s),'ordinary order reaches service stage');
 for(const item of currentRecipe(s.cafe))s.cafe.stock[item.ingredient.id]=Math.max(s.cafe.stock[item.ingredient.id],item.required);
 const before=json(s.cafe);chooseGroupCase(s,'cafe','festival');for(let n=0;n<12;n++)moveGroupModel(s,'cafe','round');carryGroupWork(s,'cafe');eq(json(s.cafe),before,'144-object bench does not charge stock');ok(serveCafe(s),'original serving still works');const served=json(s.cafe);ok(!serveCafe(s),'serving is still once only');eq(json(s.cafe),served,'no second inventory charge');
}
{
 const disk=new Storage(),store=new ExplorerStore(disk);const s=initializeExplorerState(store.load()),id=store.active.id;chooseGroupCase(s,'cafe','picnic');moveGroupModel(s,'cafe','round');setGroupInput(s,'cafe','10');store.save(s);
 const reload=new ExplorerStore(disk),r=initializeExplorerState(reload.load());eq(json(r.equalGroups),json(s.equalGroups),'ExplorerStore reload preserves unfinished work');
 const other=initializeExplorerState(reload.add({},r));eq(Object.keys(other.equalGroups.cases).length,0,'another explorer starts separately');const first=initializeExplorerState(reload.select(id,other));eq(json(first.equalGroups),json(s.equalGroups),'switching returns to exact work');
 const imported=prepareProgressImport(json(s)),result=reload.importState(imported);ok(result.ok,'bench can be imported as a separate explorer');eq(json(result.state.equalGroups),json(s.equalGroups),'separate explorer retains the draft');
 const cleared=initializeExplorerState(reload.clearActive());eq(Object.keys(cleared.equalGroups.cases).length,0,'reset clears only active bench');eq(json(reload.select(id,cleared).equalGroups),json(s.equalGroups),'reset preserves another explorer’s bench');
}
for(const failWrites of [false,true]){
 const disk=new Storage(),store=new ExplorerStore(disk),s=initializeExplorerState(store.load());if(!failWrites)store.setPersistence(false,s);else disk.fail=true;
 const diskBefore=json([...disk.data]);chooseGroupCase(s,'cafe','same-twelve');moveGroupModel(s,'cafe','scoop',0);store.save(s);carryGroupWork(s,'cafe');store.save(s);
 eq(json([...disk.data]),diskBefore,'save-off or failed saving does not write bench work');eq(store.load(),s,'same in-memory session survives');ok(currentGroupWork(s,'bramble'),'crossing works without disk storage');
}
for(const raw of [null,[],{version:87,note:'<img src=x onerror=alert(1)>'}]){
 const s=fresh();s.equalGroups=raw;const before=json(s);ok(!groupState(s),'unknown root is unavailable');ok(!equalGroupsNotes(s).includes('<img src=x'),'raw recovery data is escaped');eq(json(s),before,'notes never overwrite unknown raw state');ok(prepareProgressImport(json(s)).ok,'complete import retains unknown destination');recoverGroupState(s);eq(s.equalGroups.recovered,raw,'explicit recovery keeps original payload');
}
{
 const s=fresh();chooseGroupCase(s,'cafe','little-table');setGroupInput(s,'cafe','<img src=x onerror=alert(1)>');ok(!equalGroupsPage(s,'cafe').includes('<img src=x'),'draft input escaped');ok(!equalGroupsNotes(s).includes('<img src=x'),'notes escape authored/imported fields');
}
{
 // Run the app's real exposure bridge with real core functions, rather than a test substitute.
 const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),source=app.slice(app.indexOf('function exposeStoryFacts('),app.indexOf('function requestParis('));
 const s=fresh(),q=checkin.find(q=>q.a===4&&q.b===3);ok(q,'legacy reversed 4×3 fixture exists');s.baseline.draft={questionId:q.id,attempts:[],exposed:false};
 const context=vm.createContext({state:s,noteLegacyExposure,noteGardenFactExposure,checkin});vm.runInContext(source,context);
 chooseGroupCase(s,'cafe','little-table');context.shown=equalGroupPairsShown(s,'cafe');vm.runInContext('exposeStoryFacts({facts:shown})',context);ok(s.baseline.draft.exposed&&s.exposures.includes('3x4'),'bench marks matching waiting legacy question exposed');
 useGroupSupport(s,'cafe','example');context.shown=equalGroupPairsShown(s,'cafe');vm.runInContext('exposeStoryFacts({facts:shown})',context);ok(s.exposures.includes('2x3'),'smaller example marks its separate fact exposed');eq(s.baseline.observations.length,0,'no baseline answer or success created');
 ok(app.includes("else if(groupBench)"),'bench is routed before normal game pages');ok(equalGroupEntry('cafe').includes('#cafe/groups')&&equalGroupEntry('bramble').includes('#post/groups'),'entries lead to both benches');
}
{
 const s=fresh();chooseGroupCase(s,'cafe','little-table');setGroupInput(s,'cafe','12');submitGroupAnswer(s,'cafe');setGroupMethod(s,'cafe','together');
 const x=currentGroupWork(s,'cafe');ok(x.draft.attempts[0].method==='together'&&x.draft.attempts[0].support.together,'post-answer together report belongs to actual latest attempt');setGroupMethod(s,'cafe','worked');ok(x.draft.attempts[0].support.together,'later method change cannot erase reported support');
 setGroupInput(s,'cafe','12');submitGroupAnswer(s,'cafe');eq(x.draft.attempts.at(-1).method,null,'a later attempt does not inherit the previous answer’s method report');eq(x.draft.method,null,'new answer asks for its own optional report');
 setGroupInput(s,'cafe','5');const changed=equalGroupsPage(s,'cafe');ok(!changed.includes('That number fits')&&!changed.includes('Your last answer,'),'editing input removes stale success');
 chooseGroupUnknown(s,'cafe','each');setGroupInput(s,'cafe','4');submitGroupAnswer(s,'cafe');moveGroupModel(s,'cafe','in',0);chooseGroupUnknown(s,'cafe','total');ok(!currentGroupWork(s,'cafe').draft.feedback,'shared model edits invalidate earlier question’s model feedback');
}
{
 const s=fresh();chooseGroupCase(s,'cafe','little-table');setGroupInput(s,'cafe','12');submitGroupAnswer(s,'cafe');const handlers={},feedback={textContent:'That number fits'},error={textContent:'Old error'},last={removed:false,remove(){this.removed=true;}},input={addEventListener:(event,fn)=>handlers[event]=fn};
 const previous=globalThis.document;globalThis.document={querySelector:selector=>({'#eg-answer':input,'#eg-feedback':feedback,'#eg-error':error,'#eg-last-answer':last}[selector]||null),querySelectorAll:()=>[]};
 try{bindEqualGroups(s,'cafe',{save(){},render(){throw Error('Typing must preserve input focus');}});handlers.input({target:{value:'5'}});eq(feedback.textContent,'','typing clears already-rendered stale success');eq(error.textContent,'','typing clears displayed old error');ok(last.removed,'typing removes displayed old answer qualification');eq(currentGroupWork(s,'cafe').draft.input,'5','typing preserves updated draft');}finally{globalThis.document=previous;}
}
console.log(`${checks} equal-group UI, exposure and storage integration checks passed.`);
