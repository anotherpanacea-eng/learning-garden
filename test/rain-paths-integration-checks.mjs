import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {nextGuest,adjustBite} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {startPostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {startShow,setSceneDialogue} from '../dist/loft-core.mjs';
import {drawLetter} from '../dist/letter-trail-core.mjs';
import {chooseSharingCase,shareSharingRound} from '../dist/sharing-counter-core.mjs';
import {RAIN_CASES,RAIN_PAGES} from '../dist/rain-paths-content.mjs';
import {rainPaths,currentRainView,chooseRainCase,setRainView,restartRainCase,setRainPage,setRainPrediction,nextRainPhase,setRainPending,submitRainComparison,keepRainResult,chooseRainPlan,setRainPlanRoute,nextRainPlan,keepRainPlan,rainPlanView,useRainSupport,rainDisplayExposure,noteRainDisplayExposure,recoverRainPaths} from '../dist/rain-paths-core.mjs';
import {rainPathsPage,rainPathsNotes,rainPathsEntry,bindRainPaths} from '../dist/rain-paths-ui.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
import {noteLegacyExposure} from '../dist/broad-core.mjs';
import {noteGardenFactExposure} from '../dist/garden-core.mjs';
import {checkin} from '../dist/content.mjs';
let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const fresh=()=>initializeExplorerState(freshState());
for(const c of RAIN_CASES){const s=fresh();chooseRainCase(s,c.id);for(const page of RAIN_PAGES){setRainPage(s,page);const raw=JSON.stringify(s),html=rainPathsPage(s);ok(html.includes('rain')||html.includes('Rain'),'each turn renders a labelled task');eq(JSON.stringify(s),raw,'pure display creates no response');const imported=prepareProgressImport(raw);ok(imported.ok,'case/page draft imports');eq(imported.state.rainPaths,s.rainPaths,'case/page preserved');}while(!currentRainView(s).complete)nextRainPhase(s);keepRainResult(s);chooseRainPlan(s,'B','holding12');while(!rainPlanView(s,'B').complete)nextRainPlan(s,'B');keepRainPlan(s,'B');setRainPage(s,'plan');const raw=JSON.stringify(s);rainPathsPage(s);eq(JSON.stringify(s),raw,'completed plan display read-only');eq(prepareProgressImport(raw).state.rainPaths,s.rainPaths,'frozen trial and plan import exact');}
{
 const s=fresh();nextGuest(s);adjustBite(s,ingredients[0].id,1);startPostOffice(s,deliveries[0].id);startShow(s,'welcome');setSceneDialogue(s,'A fictional rain-machine show.');drawLetter(s,'post');chooseSharingCase(s,'quarter-basket');shareSharingRound(s);const before=structuredClone(s);delete before.rainPaths;
 for(const c of RAIN_CASES){chooseRainCase(s,c.id);setRainPrediction(s,'unsure');useRainSupport(s,'together');while(!currentRainView(s).complete)nextRainPhase(s);setRainPending(s,'columns',['storedNew','runoffNew']);submitRainComparison(s,'columns');keepRainResult(s);chooseRainPlan(s,'B','holding12');nextRainPlan(s,'B');setRainPage(s,'plan');rainPathsPage(s);}
 const after=structuredClone(s);delete after.rainPaths;eq(after,before,'water machine leaves real guest/plate/stock/parcel/fraction/show/letters exact');const imported=prepareProgressImport(JSON.stringify(s));const other=structuredClone(imported.state);delete other.rainPaths;eq(other,before,'import retains all unrelated work');
}
{
 const s=fresh();chooseRainCase(s,'space-24');setRainPending(s,'difference','2-');nextRainPhase(s);setRainPage(s,'compare');useRainSupport(s,'audio');const imported=prepareProgressImport(JSON.stringify(s));eq(imported.state.rainPaths.cases['space-24'].pending.difference,'2-','bounded unfinished numeric draft survives pages/help/import');eq(currentRainView(imported.state).trays,currentRainView(s).trays,'partial source ledger preserved');
 while(!currentRainView(s).complete)nextRainPhase(s);chooseRainPlan(s,'B','holding12');for(let i=0;i<5;i++)nextRainPlan(s,'B');eq([rainPlanView(s,'B').cup,rainPlanView(s,'B').lowPath],[12,8],'holding twelve does not pretend to prevent overflow');keepRainPlan(s,'B');const frozen=structuredClone(s.rainPaths.cases['space-24'].keptPlans.B);setRainPlanRoute(s,'B','straight');nextRainPlan(s,'B');eq(s.rainPaths.cases['space-24'].keptPlans.B,frozen,'new route cannot mutate kept copy');
}
for(const payload of [null,[],3,{version:99,earlier:'<img src=x onerror="fictional()">'}]){const s=fresh();s.rainPaths=payload;const raw=JSON.stringify(s);ok(!rainPaths(s),'unknown unavailable');ok(!rainPathsNotes(s).includes('<img src=x')&&!destinationNotes(s).includes('<img src=x'),'raw notes escaped');rainPathsPage(s);eq(JSON.stringify(s),raw,'unavailable display read-only');const imported=prepareProgressImport(raw);ok(imported.ok,'unknown root imports for recovery');eq(imported.state.rainPaths,payload,'raw payload exact');recoverRainPaths(s);eq(s.rainPaths.recovered,payload,'recovery retains full payload');ok(s.rainPaths.exposureUnknown,'recovery cannot promise untouched prediction');}
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const disk=new Storage(),store=new ExplorerStore(disk);let s=initializeExplorerState(store.load());const id=store.active.id;chooseRainCase(s,'space-12');nextRainPhase(s);store.save(s);eq(new ExplorerStore(disk).load().rainPaths,s.rainPaths,'partial physical phase reloads');const other=store.add({},s);ok(!other.rainPaths,'new explorer separate');s=store.select(id,other);eq(currentRainView(s).progress,1,'explorer returns to exact phase');store.setPersistence(false,s);store.save(s);eq(store.load().rainPaths,s.rainPaths,'save-off play retained in session');ok(!new ExplorerStore(disk).load().rainPaths,'save-off not persisted');ok(!store.clearActive().rainPaths,'reset only active root');
}
{
 const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),source=app.slice(app.indexOf('function exposeStoryFacts('),app.indexOf('function requestParis(')),s=fresh(),q=checkin.find(q=>q.a===4&&q.b===3);s.baseline.draft={questionId:q.id,attempts:[],exposed:false};const context=vm.createContext({state:s,noteLegacyExposure,noteGardenFactExposure,checkin});vm.runInContext(source,context);chooseRainCase(s,'space-12');const seen=rainDisplayExposure(s,{view:'machine'});noteRainDisplayExposure(s,seen);context.shown=seen.facts;vm.runInContext('exposeStoryFacts({facts:shown})',context);ok(s.baseline.draft.exposed&&s.exposures.includes('3x4')&&s.exposures.includes('2x4'),'actual chamber and prior-water arrays expose existing fact');eq(s.baseline.observations.length,0,'source exposure creates no arithmetic answer');ok(!s.rainPaths.resultsExposed,'empty apparatus does not reveal runoff results');nextRainPhase(s);noteRainDisplayExposure(s,rainDisplayExposure(s,{view:'machine'}));setRainPrediction(s,'B');eq(s.rainPaths.cases['space-12'].prediction.first.timing,'after-results','partial physical source counts as prior result exposure');
}

{
 const s=fresh();chooseRainCase(s,'cover-24');while(!currentRainView(s).complete)nextRainPhase(s);setRainView(s,'planTray','B');chooseRainPlan(s,'B','holding12');nextRainPlan(s,'B');restartRainCase(s);setRainPage(s,'plan');setRainView(s,'planTray','A');ok(rainPathsPage(s).includes('data-rp-plan-tray="B"'),'other frozen plan keeps source-tray choices accessible after restart');ok(chooseRainPlan(s,'A','straight'),'other frozen completed source can start A without rerunning or auto-keeping');setRainView(s,'planTray','B');setRainView(s,'tray','B');setRainView(s,'question','difference');setRainPending(s,'difference','2-');const imported=prepareProgressImport(JSON.stringify(s));eq(currentRainView(imported.state).views,{tray:'B',planTray:'B',question:'difference'},'exact tray and question resume through import');eq(rainPlanView(imported.state,'B').sent,4,'paused B board remains visible and exact');
 const before=JSON.stringify(s);ok(!setRainView(s,'question','fictional-unknown'),'unknown view rejected');eq(JSON.stringify(s),before,'invalid finite view action atomic');delete s.rainPaths.cases['cover-24'].views;const old=JSON.stringify(s);eq(currentRainView(s).views,{tray:'A',planTray:'A',question:'factor'},'older valid version-one record gets read-only defaults');rainPathsPage(s);eq(JSON.stringify(s),old,'old view default does not rewrite original');
}
ok(rainPathsEntry().includes('#science/rain'),'water lab entry reaches new machine');
console.log(`Rain Paths UI/storage integration: ${checks} passed.`);
