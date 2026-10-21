import assert from 'node:assert/strict';
import {RAIN_CASES} from '../dist/rain-paths-content.mjs';
import {chooseRainCase,currentRainView,nextRainPhase,rainPaths,keepRainResult,restartRainCase,useRainSupport,setRainView,setRainPage,setRainPrediction,noteRainDisplayExposure,recoverRainPaths} from '../dist/rain-paths-core.mjs';
import {bindRainPaths,rainPathsPage} from '../dist/rain-paths-ui.mjs';
import {rainNotebook,rainNotebookInvitation,inviteRainNotebook,rainNotebookView,toggleRainNotebookRow,setRainNotebookBarInput,setRainNotebookPage,setRainNotebookReadPrompt,keepRainNotebookDraft,recoverRainNotebook} from '../dist/rain-notebook-core.mjs';
import {rainNotebookInvitationPanel,bindRainNotebookInvitations,syncRainNotebookExposure} from '../dist/rain-notebook-bridge.mjs';
import {ensureFieldNotebook,chooseFieldCase,setFieldPage,toggleFieldRow,setFieldValue,keepFieldDraft} from '../dist/field-notebook-core.mjs';
import {rainNotebookPage} from '../dist/rain-notebook-ui.mjs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
let count=0;const ok=(a,m)=>{assert.ok(a,m);count++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},copy=x=>JSON.parse(JSON.stringify(x));
const finish=(s,id)=>{chooseRainCase(s,id);while(!currentRainView(s).complete)nextRainPhase(s);};
const cress=s=>{const x=copy(s.fieldNotebook);delete x.rain;return x;};
class El{
 constructor(dataset={},parent=null){this.dataset=dataset;this.parentElement=parent;this.tagName='SECTION';this.listeners={};this.children={};this.textContent='';this.open=true;}
 addEventListener(event,fn){(this.listeners[event]??=[]).push(fn);}
 fire(event){for(const fn of this.listeners[event]||[])fn({currentTarget:this,target:this});}
 getClientRects(){for(let p=this.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open)return [];return [{}];}
 querySelector(s){return this.children[s]||null;}
 focus(){this.focused=true;}
}
function dom({caseId='cover-12',origin='current-completed',hidden=false,replace=false}={}){
 const details=new El();details.tagName='DETAILS';details.open=!hidden;
 const panel=new El({rnbCase:caseId,rnbOrigin:origin},hidden?details:null),open=new El(),status=new El(),replacement=new El();panel.children={'[data-rnb-open]':open,'[data-rnb-status]':status,...(replace?{'[data-rnb-replace]':replacement}:{})};
 const exposure=new El({rpResults:'true',rpFacts:''},hidden?details:null);
 globalThis.document={querySelector:s=>s==='.rp-workspace'?{}:null,querySelectorAll:s=>s==='[data-rnb-invitation]'?[panel]:s==='[data-rp-expose]'?[exposure]:s==='.rp-workspace details'&&hidden?[details]:[]};
 return {panel,open,status,replacement,details};
}
function context(s){const record={saves:0,nav:[]};return {record,save:()=>record.saves++,render:()=>{},navigate:p=>record.nav.push(p),expose:e=>noteRainDisplayExposure(s,e)};}
for(const c of RAIN_CASES){
 const s={cafe:{fictional:'unchanged'},plantStudy:{unknown:'exact'}};ensureFieldNotebook(s);chooseFieldCase(s,'light-day-6-A');setFieldPage(s,'read');toggleFieldRow(s,'day-6-light-A');setFieldValue(s,'day-6-light-A',38);keepFieldDraft(s);const beforeCress=cress(s),other=copy(s.cafe),plant=copy(s.plantStudy);
 eq(rainNotebookInvitationPanel(s,{caseId:c.id,origin:'current-completed'}),'','unstarted machine offers no chart');finish(s,c.id);setRainView(s,'tray','B');setRainView(s,'question','difference');setRainPage(s,'compare');setRainPrediction(s,'unsure');const first=copy(currentRainView(s).work.prediction.first),beforeView=copy(currentRainView(s).views),beforeProgress=currentRainView(s).progress;
 const sourcePage=rainPathsPage(s);ok(sourcePage.includes('data-rnb-origin="current-completed"'),'completed compare page offers actual source invitation');ok(!sourcePage.includes('cress-only pack'),'obsolete no-import statement removed');
 const old=rainNotebookInvitation(s,c.id,'current-completed'),ui=dom({caseId:c.id}),ctx=context(s);bindRainPaths(s,ctx);ok(!inviteRainNotebook(s,old),'pre-exposure current capture becomes stale');bindRainNotebookInvitations(s,ctx);ui.open.fire('click');eq(ctx.record.nav,['#living/notebook/rain'],'post-exposure shown source imports');ok(rainNotebookView(s).source.result.familiar,'capture includes shown exposure');eq(cress(s),beforeCress,'invitation preserves every cress field');eq(s.cafe,other,'cafe exact');eq(s.plantStudy,plant,'plant exposure not invented');eq(currentRainView(s).views,beforeView,'Rain per-case views exact');eq(currentRainView(s).progress,beforeProgress,'Rain ledger progress exact');eq(currentRainView(s).work.prediction.first,first,'first prediction exact');
 toggleRainNotebookRow(s,'B:runoffNew');setRainNotebookBarInput(s,'B:runoffNew',' 2- ');setRainNotebookPage(s,'read');setRainNotebookReadPrompt(s,'model');keepRainNotebookDraft(s);const draft=copy(s.fieldNotebook.rain.cases[c.id]);
 const returnUI=dom({caseId:c.id,replace:true});bindRainNotebookInvitations(s,ctx);returnUI.open.fire('click');eq(s.fieldNotebook.rain.cases[c.id],draft,'ordinary return preserves exact pending/source/page');returnUI.replacement.fire('click');eq(rainNotebookView(s).work.selected,[],'explicit replace clears selected rows');eq(rainNotebookView(s).work.kept,draft.kept,'replacement retains frozen kept chart');eq(rainNotebookView(s).work.checks,draft.checks,'replacement retains prior checks');eq(cress(s),beforeCress,'return/replace preserve cress');
 const bridgeBefore=copy(s.rainPaths);const got=[];syncRainNotebookExposure(s,{view:'notebook',rootExposer:e=>{got.push(e);noteRainDisplayExposure(s,e);}});eq(got,[{results:true,unknown:false,facts:[]}],'chart emits known model result and no arithmetic facts');eq(s.rainPaths,bridgeBefore,'already familiar source selection/ledger/plan unchanged');ok(s.fieldNotebook.rain.resultsExposed,'display saved for later recovery');eq(cress(s),beforeCress,'chart exposure does not expose cress');
 const notes=s.fieldNotebook.rain;rainNotebookPage(s);eq(s.fieldNotebook.rain,notes,'page rendering pure');keepRainResult(s);restartRainCase(s);const partialPage=rainPathsPage(s);ok(!partialPage.includes('data-rnb-origin="current-completed"'),'restarted partial source has no current invitation');ok(/<details class="rp-kept">[\s\S]*data-rnb-origin="kept-completed"[\s\S]*<\/details>/.test(partialPage),'kept-source invitation stays inside disclosure');const hidden=dom({caseId:c.id,origin:'kept-completed',hidden:true});const hc=context(s);bindRainPaths(s,hc);bindRainNotebookInvitations(s,hc);hidden.open.fire('click');ok(hidden.status.textContent.includes('changed'),'hidden not-yet-shown invitation rejected');eq(hc.record.nav,[],'hidden source cannot navigate');hidden.details.open=true;hidden.details.fire('toggle');hidden.open.fire('click');eq(hc.record.nav,['#living/notebook/rain'],'kept source captures after actual opening exposure');
 const stale=dom({caseId:c.id,origin:'kept-completed'});bindRainNotebookInvitations(s,hc);s.rainPaths={version:99,preserve:'raw'};stale.open.fire('click');ok(stale.status.textContent.includes('changed'),'unavailable source gives visible error');ok(stale.status.focused,'error receives local focus');
 const frozen=copy(s.fieldNotebook.rain);syncRainNotebookExposure(s,{view:'notebook'});eq(s.rainPaths,{version:99,preserve:'raw'},'chart exposure preserves unsupported live source');eq(s.fieldNotebook.rain,frozen,'known frozen chart stays exact');ok(recoverRainPaths(s),'explicit Rain recovery');syncRainNotebookExposure(s);setRainPrediction(s,'A');eq(currentRainView(s).work.prediction.latest.timing,'after-results','known chart exposure replayed after recovery before prediction');
}
{
 const s={};eq(syncRainNotebookExposure(s),{results:false,unknown:false,facts:[]},'absent notebook known empty');eq(s,{},'empty replay manufactures no roots');eq(syncRainNotebookExposure(s,{view:'notebook'}),{results:false,unknown:false,facts:[]},'empty entrance no result');eq(s,{},'empty entrance remains absent');
 ensureFieldNotebook(s);s.fieldNotebook.rain={version:88,payload:'<unknown>'};const original=copy(s.fieldNotebook);syncRainNotebookExposure(s);eq(s.fieldNotebook,original,'unsupported nested branch exact');setRainPrediction(s,'A');eq(currentRainView(s).work.prediction.first.timing,'unknown','unknown notebook exposure prediction stays uncertain');ok(recoverRainNotebook(s),'explicit water recovery');eq(s.fieldNotebook.rain.recovered,original.rain,'recovery raw retained');syncRainNotebookExposure(s);setRainPrediction(s,'B');eq(currentRainView(s).work.prediction.latest.timing,'unknown','recovered unknown not cleared');eq(currentRainView(s).work.prediction.first.choice,'A','first choice not rewritten');
 const future={fieldNotebook:{version:99,anything:'<exact>'}};syncRainNotebookExposure(future,{view:'notes'});eq(future.fieldNotebook,{version:99,anything:'<exact>'},'future whole root exact');ok(future.rainPaths.exposureUnknown,'whole-root uncertainty reaches Rain');
}
{
 const s={};finish(s,'cover-12');const ui=dom(),ctx=context(s);bindRainPaths(s,ctx);bindRainNotebookInvitations(s,ctx);useRainSupport(s,'help');ui.open.fire('click');ok(ui.status.textContent.includes('changed'),'support change invalidates shown current packet');ok(!s.fieldNotebook,'stale packet creates no chart root');
}
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,String(v));}removeItem(k){this.map.delete(k);}}
{
 const s=initializeExplorerState(freshState());finish(s,'space-24');const ui=dom({caseId:'space-24'}),ctx=context(s);bindRainPaths(s,ctx);bindRainNotebookInvitations(s,ctx);ui.open.fire('click');toggleRainNotebookRow(s,'A:storedNew');setRainNotebookBarInput(s,'A:storedNew','12.');setRainNotebookPage(s,'read');setRainNotebookReadPrompt(s,'source');syncRainNotebookExposure(s,{view:'notebook'});
 const prepared=prepareProgressImport(JSON.stringify(s));ok(prepared.ok,'full application import accepts bridge state');eq(prepared.state.fieldNotebook,s.fieldNotebook,'complete cress/water payload import exact');eq(prepared.state.rainPaths,s.rainPaths,'Rain source/views/exposure import exact');
 const storage=new Storage(),store=new ExplorerStore(storage);store.save(s);const reloaded=new ExplorerStore(storage).load();eq(reloaded.fieldNotebook,s.fieldNotebook,'reload preserves raw draft and route views');const id=store.active.id,other=store.add({},s);ok(!other.fieldNotebook?.rain,'another explorer starts without chart source');const returned=store.select(id,other);eq(returned.fieldNotebook.rain,s.fieldNotebook.rain,'switch back restores independent water draft');store.setPersistence(false,returned);store.save(returned);eq(store.load().fieldNotebook.rain,s.fieldNotebook.rain,'save-off retains in-session draft');ok(!new ExplorerStore(storage).load().fieldNotebook?.rain,'save-off writes no water progress');
 const future=copy(s);future.fieldNotebook.rain={version:99,raw:'<future & exact>'};const imported=prepareProgressImport(JSON.stringify(future));ok(imported.ok,'unsupported water branch imported for recovery');eq(imported.state.fieldNotebook.rain,future.fieldNotebook.rain,'unsupported branch exact through full import');
}
delete globalThis.document;
console.log(`Rain Notebook integration: ${count} checks passed.`);
