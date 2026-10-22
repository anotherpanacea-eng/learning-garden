import assert from 'node:assert/strict';
import fs from 'node:fs';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState,prepareProgressImport} from '../dist/progress-transfer.mjs';
import {ExplorerStore} from '../dist/explorer-storage.mjs';
import * as J from '../dist/joining-orders-core.mjs';
import {renderJoiningOrders,joiningOrdersNotes,joiningOrdersEntry} from '../dist/joining-orders-ui.mjs';
import {renderBundleExchange} from '../dist/bundle-exchange-ui.mjs';
import {destinationNotes} from '../dist/notebook-sections.mjs';
const copy=x=>structuredClone(x),fresh=()=>initializeExplorerState(freshState());
class Storage{constructor(){this.map=new Map();}get length(){return this.map.size;}key(i){return [...this.map.keys()][i]??null;}getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
{
 const s=fresh(),before=JSON.stringify(s);assert.equal(renderJoiningOrders(s).facts.length,0);assert.match(renderJoiningOrders(s).html,/data-join-start="steady-orders"/);assert.equal(joiningOrdersNotes(s),'');destinationNotes(s);assert.equal(JSON.stringify(s),before,'view and notes are lazy');assert.equal(Object.hasOwn(prepareProgressImport(before).state,'joiningOrders'),false);
}
for(const c of J.joiningCases){
 const s=fresh();J.startJoiningOrder(s,c.id);const before=JSON.stringify(s),separate=renderJoiningOrders(s);assert.equal((separate.html.match(/data-join-counter /g)||[]).length,c.total,'source cards have one mark per counter');assert.equal((separate.html.match(/data-origin="pip"/g)||[]).length,24);assert.equal((separate.html.match(/data-origin="dot"/g)||[]).length,c.dot);assert.equal(separate.facts.length,0);assert.equal(JSON.stringify(s),before);
 J.joinOrders(s);const joined=renderJoiningOrders(s);assert.equal((joined.html.match(/data-join-counter /g)||[]).length,c.total,'joined table preserves total without duplicate source marks');assert.match(joined.html,/data-join-action="wrap" disabled/);assert.match(joined.html,/data-join-total/);J.setJoiningTotal(s,'bad');J.keepJoiningDraft(s);assert.match(renderJoiningOrders(s).html,/bad/);assert.match(renderJoiningOrders(s).html,/<p id="join-kept-confirmation"[^>]*>This draft is kept/,'Keep confirmation is visible outside closed history');assert.equal(prepareProgressImport(JSON.stringify(s)).state.joiningOrders!==undefined,true);
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
console.log('Joining Supply Orders integration: lazy views, exact marks, transfer, recovery and host wiring passed.');
