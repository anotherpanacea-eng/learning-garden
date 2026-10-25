import assert from 'node:assert/strict';
import {freshState} from '../dist/core.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import {ensureGarden} from '../dist/garden-core.mjs';
import {startPostOffice,currentPostOffice,ensurePostOffice,setPostPage,postOfficeView,returnFromPostHelp,setPostPackingInput,packPostTogether,appendPostClause,stepPostRoute,setPostComposer,setPostSupport,resumePostOffice} from '../dist/post-office-core.mjs';
import {startAdaptiveRival,setRivalInput,openRivalPractice,stepRivalPractice} from '../dist/post-rival.mjs';
import {postOfficePage,bindPostOffice} from '../dist/post-office-ui.mjs';
let n=0;
const eq=(a,b,label)=>{assert.deepEqual(a,b,label);n++;},ok=(x,label)=>{assert.ok(x,label);n++;},copy=structuredClone;
const pages=['pack','plan','fly','bramble','help'];
const fresh=()=>{const s=freshState();ensureGarden(s);startPostOffice(s,'clover-buns');return s;};
function work(v){const result=copy(v);delete result.postPage;delete result.postHelpReturn;return result;}
const s=fresh(),v=currentPostOffice(s);
setPostPackingInput(s,' 27 unfinished ');setPostComposer(s,'place','hill');setPostComposer(s,'recipient','wren');appendPostClause(s,'go:hill');appendPostClause(s,'then:cafe');appendPostClause(s,'give:clover');
startAdaptiveRival(s);setRivalInput(s,' 14 unfinished ');openRivalPractice(s);stepRivalPractice(s,1);
const before=work(v),notebook=copy(s.postOffice.bramble);
for(const page of [...pages,...pages.slice().reverse()]){
 ok(setPostPage(s,page),'all task pages remain open');eq(postOfficeView(v),page,'selected page is saved');eq(work(v),before,'navigation preserves every work field');eq(s.postOffice.bramble,notebook,'navigation preserves generated challenge selection and history');
 const prior=copy(s),html=postOfficePage(s);eq(s,prior,'page render is pure');ok(html.includes(`data-post-current-page="${page}"`),'exactly selected task is rendered');eq((html.match(/data-post-current-page=/g)||[]).length,1,'one task page rendered');
 ok(html.includes(v.order.request)&&html.includes('Parcel:</strong> waiting to be packed')&&html.includes('Courier:</strong> Willow Post Office'),'order and live parcel location stay with every task');
 ok(html.includes('Your courier · change character'),'active courier is in a disclosure');
 if(page!=='pack')ok(!html.includes('id="post-packing-form"'),'packing form absent on other pages');
 if(page!=='plan')ok(!html.includes('id="post-place"'),'composer absent on other pages');
 if(page!=='bramble')ok(!html.includes('id="post-rival-practice-title"'),'rival task absent on other pages');
 if(page==='fly')ok(html.includes('Your flight plan')&&html.includes('Then go to Almost-Right Café')&&html.includes('Change my flight plan'),'flight carries composed instructions beside map');
 if(page==='help')ok(html.includes('Pip’s separate example')&&html.includes('Return to my waiting task'),'helper has separate material and return');
}
setPostPage(s,'plan');const planHtml=postOfficePage(s);eq((planHtml.match(/data-post-to-flight/g)||[]).length,2,'flight action available before and after route cards');ok(planHtml.includes('Fly this route'),'flight action names its purpose');ok(planHtml.indexOf('Fly this route')<planHtml.indexOf('class="post-word-bank"'),'first flight action precedes the word bank');
const invalid=copy(s);ok(!setPostPage(s,'unavailable'),'unknown page rejected');eq(s,invalid,'invalid page cannot mutate');
setPostPage(s,'fly');setPostPage(s,'help');setPostPage(s,'help');ok(returnFromPostHelp(s),'helper returns');eq(postOfficeView(v),'fly','reopening same helper preserves origin');eq(work(v),before,'helper navigation preserves input, example cursor and real delivery');
// Older notebooks derive a useful page without migration writes. Unknown view data is kept.
for(const candidate of [{packed:false,clauses:[],expected:'pack'},{packed:true,clauses:[],expected:'plan'},{packed:true,clauses:['go:cafe'],expected:'fly'}]){
 const old=fresh(),visit=currentPostOffice(old);delete visit.postPage;visit.packing.packed=candidate.packed;visit.clauses=candidate.clauses;
 const saved=copy(old);eq(postOfficeView(visit),candidate.expected,'legacy page follows existing work');postOfficePage(old);eq(old,saved,'legacy view read leaves original state exact');
 visit.postPage={future:'page'};visit.unrelatedFutureField={text:'keep this'};const future=copy(old);ensurePostOffice(old);eq(old,future,'unknown optional fields do not close or rewrite delivery');
}
const waiting=fresh(),wv=currentPostOffice(waiting);delete wv.postPage;startAdaptiveRival(waiting);eq(postOfficeView(wv),'bramble','legacy pending puzzle resumes at its task');
// Actual flight cursor and unfinished rival answer survive arbitrary page visits and import.
const flying=fresh(),fv=currentPostOffice(flying);packPostTogether(flying);appendPostClause(flying,'go:cafe');appendPostClause(flying,'give:clover');stepPostRoute(flying);startAdaptiveRival(flying);setRivalInput(flying,'half written');
const pending=work(fv);for(const page of pages)setPostPage(flying,page);eq(work(fv),pending,'in-flight navigation changes no route, frozen question, input or support');
setPostPage(flying,'bramble');const imported=prepareProgressImport(JSON.stringify(flying));ok(imported.ok,'paged active challenge notebook imports');eq(imported.state.postOffice,flying.postOffice,'import keeps exact page, courier, input and flight cursor');
class Disk{constructor(){this.data=new Map();}get length(){return this.data.size;}key(i){return [...this.data.keys()][i]??null;}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
const disk=new Disk(),store=new ExplorerStore(disk),stored=store.load();ensureGarden(stored);startPostOffice(stored,'clover-buns');setPostPackingInput(stored,'not submitted');setPostPage(stored,'plan');setPostPage(stored,'help');store.save(stored);eq(new ExplorerStore(disk).load().postOffice,stored.postOffice,'actual storage preserves helper origin and partly typed packing');
const first=currentPostOffice(stored).id;startPostOffice(stored,'purl-blankets');setPostPage(stored,'bramble');resumePostOffice(stored,first);eq(postOfficeView(currentPostOffice(stored)),'help','visits keep independent page and work');
// Exercise real bindings with minimal controls: navigation is not a hidden submit or restart.
class Control{constructor(dataset={}){this.dataset=dataset;this.handlers={};}addEventListener(type,fn){this.handlers[type]=fn;}fire(type,event={}){this.handlers[type]?.(event);}}
const bound=fresh(),bv=currentPostOffice(bound),pageButtons=pages.map(postPage=>new Control({postPage})),input=new Control(),form=new Control(),rivalInput=new Control(),helpReturn=new Control(),rivalStart=new Control({rivalStart:''}),flight=new Control();let saves=0,renders=0,lastFocus='';
const oldDocument=globalThis.document;
const selectors=new Map([['[data-post-page]',pageButtons],['[data-post-help-return]',[helpReturn]],['[data-rival-start]',[rivalStart]],['[data-post-to-flight]',[flight]]]);
const single=new Map([['#post-packing-input',input],['#post-packing-form',form],['#post-rival-input',rivalInput]]);
globalThis.document={querySelectorAll:selector=>selectors.get(selector)||[],querySelector:selector=>single.get(selector)||null,getElementById:()=>null};
try{
 bindPostOffice(bound,{save:()=>saves++,render:()=>renders++,navigate:()=>{},focus:selector=>{lastFocus=selector;const html=postOfficePage(bound);ok(html.includes(`id="${selector.slice(1)}"`),'page action focuses a heading present in rendered page');}});
 input.fire('input',{target:{value:'19 unfinished'}});eq(bv.packing.input,'19 unfinished','typing is saved before navigation');eq(renders,0,'typing never rerenders input or moves caret');eq(bv.packing.attempts,[],'typing does not submit');
 pageButtons[1].fire('click');eq(lastFocus,'#post-route-title','Plan targets actual task heading');eq(bv.packing.input,'19 unfinished','navigation keeps packing draft');eq(bv.support.helper,false,'ordinary navigation is not helper support');
 rivalStart.fire('click');eq(postOfficeView(bv),'bramble','meeting rival opens Bramble page');rivalInput.fire('input',{target:{value:'22 unfinished'}});const question=copy(bv.rival);flight.fire('click');eq(bv.rival,question,'returning to flight neither resolves nor replaces rival');eq(bv.playback.cursor,0,'returning does not execute flight');
 pageButtons[4].fire('click');eq(bv.support.helper,true,'explicit Help opening records support');eq(lastFocus,'#post-example-title','Help focuses real example heading');helpReturn.fire('click');eq(postOfficeView(bv),'fly','helper returns to exact origin');eq(bv.rival,question,'helper retains unsubmitted rival work');ok(saves>=6,'presentation and input changes call existing save');
}finally{if(oldDocument===undefined)delete globalThis.document;else globalThis.document=oldDocument;}
console.log(`${n} Post Office pagination, input, binding and recovery checks passed.`);
