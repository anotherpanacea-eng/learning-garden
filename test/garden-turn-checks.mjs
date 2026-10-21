import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ensureCafe,nextGuest,orderFor,adjustBite,checkPlate,submitCafeNumber,reviseCafePlate} from '../dist/cafe-core.mjs';
import {ingredients} from '../dist/cafe-content.mjs';
import {renderCafe} from '../dist/cafe-ui.mjs';
import {currentSpiral,spiralState} from '../dist/living-spiral-core.mjs';
import {spiralPlaces,spiralTarget} from '../dist/living-spiral-content.mjs';
import {noteQuestion} from '../dist/living-adaptive-content.mjs';
import {startAdaptiveSpiral,setAdaptivePage,selectAdaptiveHabitat,inspectAdaptive,supportAdaptive,findAdaptive,chooseAdaptive,adaptiveView,setAdaptiveCluesOpen} from '../dist/living-adaptive-core.mjs';
import {adaptivePage} from '../dist/living-adaptive-ui.mjs';
import {prepareProgressImport,initializeExplorerState} from '../dist/progress-transfer.mjs';
let checks=0;
const check=(x,message)=>{assert.ok(x,message);checks++;};
const same=(a,b,message)=>{assert.deepEqual(a,b,message);checks++;};
const state=freshState();ensureCafe(state);check(startAdaptiveSpiral(state),'start synthetic visit');
const round=currentSpiral(state),source=structuredClone(round);
for(const page of ['notice','compare','read','pack','notice']){
 check(setAdaptivePage(state,page),'select '+page);
 const expected=structuredClone(source);expected.view={page,habitat:0};same(round,expected,'page selection changes presentation only');
 check(spiralState(state),'page state remains valid');
 const html=adaptivePage(state,'visit');
 check(!html.includes('id="adapt-count-form"'),'navigation cannot open unfound parcel task');
 check(!html.includes('data-adapt-tag='),'navigation cannot open unreadied note');
}
check(selectAdaptiveHabitat(state,2),'select single habitat');same(round.inspected,[],'selection is not inspection');
check(!round.science.help&&!round.science.audio&&!round.science.vocabulary&&!round.science.count,'selection is not support or evidence');
const notice=adaptivePage(state,'visit');check((notice.match(/class="spiral-place adapt-single-place"/g)||[]).length===1,'one habitat card at a time');
const target=spiralTarget(round.task);check(inspectAdaptive(state,target)&&inspectAdaptive(state,(target+1)%3),'collect original contrasted clues');
check(supportAdaptive(state,'science','help'),'explicit science support');
for(const page of ['compare','read','pack']){
 setAdaptivePage(state,page);const html=adaptivePage(state,'visit');
 for(const i of round.inspected)check(html.includes(spiralPlaces(round.task)[i].observation),'original inspected clue retained on '+page);
 check(html.includes('Our collected clues (2 of 3 places)'),'collected clue disclosure on '+page);
}
setAdaptivePage(state,'read');let html=adaptivePage(state,'visit');
for(const sentence of noteQuestion(round.task).sentences)check(html.includes(sentence),'complete reading source alongside question');
check(html.includes('data-adapt-tag='),'ready note opens');
check(supportAdaptive(state,'reading','help')&&findAdaptive(state),'explicit finding');
check(chooseAdaptive(state,'math','input','17'),'partially entered pack answer');
const waiting=structuredClone(round);
for(const page of ['notice','compare','read','pack']){
 setAdaptivePage(state,page);selectAdaptiveHabitat(state,1);const expected=structuredClone(waiting);expected.view={page,habitat:1};same(round,expected,'back/next retains original work, input, support, responses and parcel');
}
same(restoreState(JSON.stringify(state)),state,'reload round-trips presentation and task');
const normalized=initializeExplorerState(structuredClone(state)),imported=prepareProgressImport(JSON.stringify(state));
check(imported.ok,'import accepts saved pages');same(imported.state,normalized,'import retains all current game work and views');
check(imported.state.livingExploration.current.view.page==='pack'&&imported.state.livingExploration.current.math.input==='17','import resumes same turn and typed answer');
const priorClues=structuredClone(round);check(setAdaptiveCluesOpen(state,true),'open collected clues explicitly');const openClues=structuredClone(priorClues);openClues.view.cluesOpen=true;same(round,openClues,'opening reference clues changes presentation only');
check(adaptivePage(state,'visit').includes('class="panel adapt-collected" open'),'collected clues render open');setAdaptivePage(state,'read');check(adaptivePage(state,'visit').includes('class="panel adapt-collected" open'),'collected clues stay open after navigation');
const withClues=prepareProgressImport(JSON.stringify(state));check(withClues.ok&&withClues.state.livingExploration.current.view.cluesOpen,'collected clue visibility survives import');
const before=structuredClone(state);check(!setAdaptivePage(state,'future')&&!selectAdaptiveHabitat(state,7),'reject invalid presentation actions');same(state,before,'invalid actions leave work intact');
delete round.view;const legacy=structuredClone(state);same(adaptiveView(round),{page:'pack',habitat:round.place},'old saves choose safe progress default');adaptivePage(state,'visit');same(state,legacy,'old save render remains pure');
for(const bad of [{page:'future',habitat:0},{page:'notice',habitat:9},null]){round.view=bad;check(!spiralState(state),'invalid optional view blocks damaged record');}
delete round.view;
// The café keeps the active order first and the cupboard optional during number work.
const cafe=freshState();ensureCafe(cafe);cafe.cafe.seed=192;cafe.cafe.range='small';nextGuest(cafe);
const order=orderFor(cafe.cafe),food=ingredients.find(i=>order.wanted.every(p=>i.properties.includes(p)));
for(let i=0;i<order.bites;i++)adjustBite(cafe,food.id,1);
check(checkPlate(cafe),'accept synthetic café plate');
for(const stage of ['total','stock']){
 const snapshot=structuredClone(cafe),html=renderCafe(cafe);
 check(html.includes('<details class="cafe-cupboard-disclosure"><summary>'),'full cupboard collapsed at '+stage);
 check(html.indexOf('class="cafe-work"')<html.indexOf('class="cafe-trip-tools"'),'optional tools after task at '+stage);
 check(html.includes('aria-label="The current order"'),'order remains available at '+stage);
 same(cafe,snapshot,'café rendering preserves plate, inputs and stock');
 if(stage==='total'){check(html.includes('class="cafe-recipe-summary"')&&html.includes(`${order.bites} bites of ${food.name}`),'per-plate recipe visible beside multiplication question');check(html.indexOf('class="cafe-recipe-summary"')<html.indexOf('class="cafe-number-form"'),'recipe precedes multiplication form');check(submitCafeNumber(cafe,order.total),'advance to stock question');}
}
const originalPlan=structuredClone(cafe.cafe.current.cupboardPlan);renderCafe(cafe);same(cafe.cafe.current.cupboardPlan,originalPlan,'stock snapshot stays fixed');
// Existing return path works when the cupboard was collapsed during multiplication.
const editable=freshState();ensureCafe(editable);editable.cafe.seed=192;editable.cafe.range='small';nextGuest(editable);
const o=orderFor(editable.cafe),f=ingredients.find(i=>o.wanted.every(p=>i.properties.includes(p)));for(let i=0;i<o.bites;i++)adjustBite(editable,f.id,1);checkPlate(editable);
check(reviseCafePlate(editable),'return to plate');check(!renderCafe(editable).includes('class="cafe-cupboard-disclosure"'),'editable cupboard visible on return');
console.log(`${checks} clear garden turn, preservation, import and café checks passed.`);
