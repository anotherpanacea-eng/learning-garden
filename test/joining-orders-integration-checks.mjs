import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import * as J from '../dist/joining-orders-core.mjs';
import {renderJoiningOrders,joiningOrdersNotes,joiningOrdersEntry} from '../dist/joining-orders-ui.mjs';
import {bundleQuestionExposure,noteBundleDisplay} from '../dist/bundle-broad-exposure.mjs';
import {generatedBroad} from '../dist/broad-variants.mjs';
import {itemById} from '../dist/broad-core.mjs';
import {renderBundleExchange} from '../dist/bundle-exchange-ui.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
const copy=x=>structuredClone(x),fresh=()=>initializeExplorerState(freshState());
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const s=fresh(),before=JSON.stringify(s),chooser=renderJoiningOrders(s);assert.equal(chooser.facts.length,0);assert.deepEqual(chooser.examples,[]);assert.match(chooser.html,/data-join-start="steady-orders"/);assert.doesNotMatch(chooser.html,/2 tens|1 ten|3 ones|7 ones/,'chooser discloses no decomposition');assert.equal(joiningOrdersNotes(s),'');destinationNotes(s);assert.equal(JSON.stringify(s),before,'view and notes are lazy');assert.equal(Object.hasOwn(prepareProgressImport(before).state,'joiningOrders'),false);
}
{
 const s=fresh(),q={params:{type:'bundle',hundreds:0,tens:2,ones:4}},near={params:{type:'bundle',hundreds:0,tens:2,ones:5}};
 assert.equal(bundleQuestionExposure(s,q).familiar,false);J.startJoiningOrder(s,'steady-orders');let view=renderJoiningOrders(s);assert.deepEqual(view.examples,['bundle:0:2:4','bundle:0:1:3']);assert.equal(bundleQuestionExposure(s,q).familiar,false,'pure render does not persist exposure');assert.equal(J.noteJoiningExamples(s,view.examples),true);assert.equal(bundleQuestionExposure(s,q).familiar,true);assert.equal(bundleQuestionExposure(s,near).familiar,false);
 J.joinOrders(s);view=renderJoiningOrders(s);assert.deepEqual(view.examples,[],'joined strip does not re-report hidden source cards');assert.equal(view.examples.includes('bundle:0:3:7'),false,'pictured parts without current total do not qualify');J.setJoiningTotal(s,'0');J.checkJoiningTotal(s);view=renderJoiningOrders(s);assert.equal(view.examples.includes('bundle:0:3:7'),true,'visible feedback total and empty-frame parts qualify');J.moveJoiningOne(s,'pip',true);assert.equal(renderJoiningOrders(s).examples.includes('bundle:0:3:7'),false,'partial frame does not create a fresh signature');
 J.openJoiningHelp(s,'example');assert.equal(renderJoiningOrders(s).examples.includes('bundle:0:3:0'),true);
 const generated=generatedBroad(itemById('number-foundation'),'probe:35');assert.deepEqual(generated.variant.params,{type:'bundle',hundreds:0,tens:2,ones:4});s.broad.drafts['checkin:number-foundation']={question:generated,familiar:false};assert.equal(noteBundleDisplay(s,[]),true);assert.equal(s.broad.drafts['checkin:number-foundation'].familiar,true,'waiting exact generated task becomes familiar');
 const legacy=fresh();J.startJoiningOrder(legacy,'steady-orders');delete legacy.joiningOrders.shownBundleExamples;assert.deepEqual(bundleQuestionExposure(legacy,q),{familiar:false,priorExposureUnknown:true});assert.equal(bundleQuestionExposure(legacy,near).priorExposureUnknown,false);const raw=copy(legacy.joiningOrders);assert.equal(J.recoverJoiningOrders(legacy),true);assert.deepEqual(legacy.joiningOrders.recovered,raw);assert.equal(bundleQuestionExposure(legacy,q).priorExposureUnknown,true);
 const resumed=fresh();J.startJoiningOrder(resumed,'steady-orders');J.joinOrders(resumed);assert.deepEqual(resumed.joiningOrders.shownBundleExamples,[]);assert.deepEqual(renderJoiningOrders(resumed).examples,[],'readable joined import with no display history reveals no source cards');assert.equal(bundleQuestionExposure(resumed,q).familiar,false);J.resetJoiningModel(resumed);assert.deepEqual(renderJoiningOrders(resumed).examples,['bundle:0:2:4','bundle:0:1:3'],'reset visibly restores source cards');
}
{
 const s=fresh(),target={params:{type:'bundle',hundreds:0,tens:4,ones:1}};J.startJoiningOrder(s,'full-frame-orders');assert.deepEqual(renderJoiningOrders(s).examples,['bundle:0:2:4','bundle:0:1:7']);J.joinOrders(s);for(let i=0;i<4;i++)J.moveJoiningOne(s,'pip',true);for(let i=0;i<6;i++)J.moveJoiningOne(s,'dot',true);J.wrapJoiningTen(s);assert.equal(renderJoiningOrders(s).examples.includes('bundle:0:4:1'),false,'wrapped parts without visible total do not qualify');J.setJoiningTotal(s,'40');J.checkJoiningTotal(s);let view=renderJoiningOrders(s);assert.equal(view.examples.includes('bundle:0:4:1'),true,'incorrect answer feedback still supplies visible source total');J.moveJoiningOne(s,'dot',true);assert.equal(renderJoiningOrders(s).examples.includes('bundle:0:4:1'),false,'remaining one in frame does not form canonical display');J.moveJoiningOne(s,'dot',false);view=renderJoiningOrders(s);assert.equal(view.examples.includes('bundle:0:4:1'),true);assert.equal(J.noteJoiningExamples(s,view.examples),true);assert.equal(bundleQuestionExposure(s,target).familiar,true);J.resetJoiningModel(s);assert.equal(renderJoiningOrders(s).examples.includes('bundle:0:4:1'),false);assert.equal(bundleQuestionExposure(s,target).familiar,true,'prior actual display remains familiar after reset');
}
for(const c of J.joiningCases){
 const s=fresh();J.startJoiningOrder(s,c.id);const before=JSON.stringify(s),separate=renderJoiningOrders(s);assert.equal((separate.html.match(/data-join-counter /g)||[]).length,c.total,'source cards have one mark per counter');assert.equal((separate.html.match(/data-origin="pip"/g)||[]).length,24);assert.equal((separate.html.match(/data-origin="dot"/g)||[]).length,c.dot);assert.equal(separate.facts.length,0);assert.equal(JSON.stringify(s),before);
 J.joinOrders(s);const joined=renderJoiningOrders(s);assert.equal((joined.html.match(/data-join-counter /g)||[]).length,c.total,'joined table preserves total without duplicate source marks');assert.match(joined.html,/data-join-action="wrap" disabled/);assert.match(joined.html,/data-join-total/);J.setJoiningTotal(s,'bad');J.keepJoiningDraft(s);assert.match(renderJoiningOrders(s).html,/bad/);assert.match(renderJoiningOrders(s).html,/<p id="join-kept-confirmation"[^>]*>A copy is kept in Saved work\. Later changes need another Keep\./,'Keep confirmation is visible outside closed history');assert.equal(prepareProgressImport(JSON.stringify(s)).state.joiningOrders!==undefined,true);
}
{
 const s=fresh();J.startJoiningOrder(s,'steady-orders');J.openJoiningHelp(s,'help');let html=renderJoiningOrders(s).html;assert.match(html,/<details class="join-help" open>/);assert.match(html,/<p id="join-help-content" tabindex="-1">/);
 J.openJoiningHelp(s,'example');html=renderJoiningOrders(s).html;assert.match(html,/<p id="join-example-content" tabindex="-1">/);
 const other=fresh();J.startJoiningOrder(other,'steady-orders');J.useJoiningSupport(other,'together');html=renderJoiningOrders(other).html;assert.match(html,/<details class="join-help" open>/,'Together keeps its panel open after render');assert.match(html,/data-join-together aria-pressed="true"/);
}
{
 const s=fresh();J.startJoiningOrder(s,'steady-orders');J.setJoiningTotal(s,'37');for(let i=0;i<7;i++)J.checkJoiningTotal(s);assert.doesNotMatch(renderJoiningOrders(s).html,/The next check removes/);J.checkJoiningTotal(s);assert.match(renderJoiningOrders(s).html,/The next check removes the oldest of eight saved checks/);J.checkJoiningTotal(s);assert.equal(J.joiningView(s).work.history[0].id,2);assert.match(renderJoiningOrders(s).html,/The next check removes/);
}
{
 const s=fresh(),other=copy(s);J.startJoiningOrder(s,'full-frame-orders');J.joinOrders(s);for(let i=0;i<4;i++)J.moveJoiningOne(s,'pip',true);for(let i=0;i<6;i++)J.moveJoiningOne(s,'dot',true);J.wrapJoiningTen(s);const view=renderJoiningOrders(s);assert.equal((view.html.match(/data-join-counter /g)||[]).length,41);assert.equal((view.html.match(/data-origin="pip"/g)||[]).length,24);assert.equal((view.html.match(/data-origin="dot"/g)||[]).length,17);assert.match(view.html,/One new wrapped ten/);assert.match(view.html,/data-join-action="unwrap"/);assert.doesNotMatch(view.html,/Only a full frame of ten can be wrapped/);assert.match(view.html,/The new ten is wrapped. You can unwrap it into the empty frame/);J.setJoiningTotal(s,'41');J.checkJoiningTotal(s);J.keepJoiningDraft(s);assert.match(renderJoiningOrders(s).html,/24 \+ 17 = 41/);J.resetJoiningModel(s);assert.match(renderJoiningOrders(s).html,/Earlier grouping: this check used/);const frozen=J.joiningView(s).feedback.feedbackText;J.joiningView(s).work.source.request='A revised request.';assert.match(renderJoiningOrders(s).html,new RegExp(frozen.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));assert.match(joiningOrdersNotes(s),/pictured joining and one entered total/);const unchanged=copy(s);delete unchanged.joiningOrders;assert.deepEqual(unchanged,other,'all other explorer roots untouched');
 const imported=prepareProgressImport(JSON.stringify(s));assert.equal(imported.ok,true);assert.deepEqual(imported.state.joiningOrders,s.joiningOrders);assert.deepEqual(imported.summary.destinations.includes('Joining Supply Orders'),true);
 const disk=new Storage(),store=new ExplorerStore(disk);store.load();assert.equal(store.save(s),true);assert.deepEqual(new ExplorerStore(disk).load().joiningOrders,s.joiningOrders);const second=store.add({},s);assert.equal(Object.hasOwn(second,'joiningOrders'),false,'another explorer is isolated');const resumed=store.select(store.explorers?.[0]?.id||store.active.id,second);assert.ok(resumed);store.setPersistence(false,s);store.save(s);assert.equal(new ExplorerStore(disk).load().joiningOrders,undefined,'save-off clears disk');
}
for(const payload of [null,[],5,{version:99,html:'<img src=x onerror="fictional()">'}]){
 const s=fresh();s.joiningOrders=payload;const before=JSON.stringify(s);assert.match(renderJoiningOrders(s).html,/unfamiliar format/);assert.equal(joiningOrdersNotes(s).includes('<img src=x'),false);assert.equal(JSON.stringify(s),before);assert.deepEqual(prepareProgressImport(before).state.joiningOrders,payload);assert.equal(J.recoverJoiningOrders(s),true);assert.deepEqual(s.joiningOrders.recovered,payload);J.setJoiningTotal(s,'37');J.checkJoiningTotal(s);J.keepJoiningDraft(s);assert.equal(J.joiningView(s).work.kept.priorExposureUnknown,true);assert.match(joiningOrdersNotes(s),/Original recovered work/);
}
const app=fs.readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');assert.match(app,/joiningBench=root==='numbers'&&slug==='join'/);assert.match(app,/bindJoiningOrders\(state/);assert.match(html,/joining-orders\.css/);assert.match(joiningOrdersEntry(),/#numbers\/join/);
assert.match(renderBundleExchange(fresh()).html,/#numbers\/join/,'Exchange Table links back to Joining Supply Orders');
// A recovery must not make an accepted notebook impossible to import again.
{
 const s=fresh();s.joiningOrders={version:99,padding:''};
 const cap=5*1024*1024;s.joiningOrders.padding='x'.repeat(cap-JSON.stringify(s).length-32);
 assert.equal(prepareProgressImport(JSON.stringify(s)).ok,true,'size-boundary original imports');
 const before=JSON.stringify(s);assert.equal(J.recoverJoiningOrders(s),false,'oversize proposed wrapper is refused');assert.equal(JSON.stringify(s),before,'size refusal is atomic');
}
{
 const s=fresh();let raw={version:99};s.joiningOrders=raw;
 while(true){const next={version:99,earlier:raw},candidate={...s,joiningOrders:next};if(!prepareProgressImport(JSON.stringify(candidate)).ok)break;raw=next;s.joiningOrders=raw;}
 const before=JSON.stringify(s);assert.equal(prepareProgressImport(before).ok,true,'depth-boundary original imports');assert.equal(J.recoverJoiningOrders(s),false,'extra recovery depth is refused');assert.equal(JSON.stringify(s),before,'depth refusal preserves whole prior root');
}
{
 const s=fresh();s.joiningOrders={version:99,earlier:'kept'};const before=JSON.stringify(s);
 assert.equal(J.recoverJoiningOrders(s,()=>false),false,'actual report preflight may refuse metadata overhead');assert.equal(JSON.stringify(s),before);
 assert.equal(J.recoverJoiningOrders(s),true);assert.equal(prepareProgressImport(JSON.stringify(s,null,2)).ok,true,'ordinary recovered notebook round-trips');
}
console.log('Joining Supply Orders integration: lazy views, exact marks, transfer, recovery and host wiring passed.');
