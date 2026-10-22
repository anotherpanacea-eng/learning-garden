import assert from 'node:assert/strict';
import * as J from '../dist/joining-orders-core.mjs';
const copy=x=>structuredClone(x),work=s=>J.joiningView(s).work,model=s=>work(s).model;
const make=id=>{const s={};assert.equal(J.startJoiningOrder(s,id),true);return s;};
const actions=[
 s=>J.joinOrders(s),s=>J.moveJoiningOne(s,'pip',true),s=>J.moveJoiningOne(s,'dot',true),
 s=>J.moveJoiningOne(s,'pip',false),s=>J.moveJoiningOne(s,'dot',false),
 s=>J.wrapJoiningTen(s),s=>J.unwrapJoiningTen(s),s=>J.resetJoiningModel(s)
];
const key=m=>Object.values(m).join(',');
for(const [id,expectedStates,expectedTransitions] of [['steady-orders',21,83],['full-frame-orders',44,182]]){
 const root=make(id),seen=new Set([key(model(root))]),pending=[root];let transitions=0;
 while(pending.length){const at=pending.pop();for(const action of actions){const next=copy(at),before=copy(next),changed=action(next);if(!changed){assert.deepEqual(next,before,'refused action atomic');continue;}transitions++;assert.equal(J.validJoiningOrders(next.joiningOrders),true,'all reachable saves readable');const m=model(next),source=work(next).source;assert.equal(m.loosePip+m.framePip+m.newTenPip,4);assert.equal(m.looseDot+m.frameDot+m.newTenDot,source.dot%10);assert.ok(m.framePip+m.frameDot<=10);assert.ok([0,10].includes(m.newTenPip+m.newTenDot));const k=key(m);if(!seen.has(k)){seen.add(k);pending.push(next);}}}
 assert.equal(seen.size,expectedStates,`${id} reachable grouping states`);assert.equal(transitions,expectedTransitions,`${id} enabled transitions`);
}
for(const raw of ['0','99',' 037 ','00000','000000000000000000000007'])assert.notEqual(J.parseJoiningTotal(raw),null,raw);
for(const raw of ['',' ','100','-1','+1','1.0','.5','1e1','1 2','１','١','0x10','7\n2','0000000000000000000000000',{}])assert.equal(J.parseJoiningTotal(raw),null,String(raw));
for(const c of J.joiningCases){
 const s=make(c.id),w=work(s);assert.equal(J.validJoiningOrders(s.joiningOrders),true);assert.equal(J.wrapJoiningTen(s),false);assert.equal(J.keepJoiningDraft(s),true);assert.equal(w.kept.raw,'');
 for(const bad of ['','1e1','100']){J.setJoiningTotal(s,bad);J.checkJoiningTotal(s);assert.equal(w.error,'needs-number');assert.equal(w.history.length,0);}
 J.setJoiningTotal(s,String(c.total+1));J.checkJoiningTotal(s);assert.equal(w.history[0].outcome.numberMatches,false);assert.equal(w.history[0].joined,false);assert.equal(w.history[0].regrouped,false);assert.equal(w.history[0].support.includes('feedback'),false);assert.equal(w.feedbackId,1);assert.equal(J.validJoiningOrders(s.joiningOrders),true);
 J.joinOrders(s);J.setJoiningTotal(s,` 0${c.total} `);J.checkJoiningTotal(s);assert.equal(w.history.at(-1).outcome.numberMatches,true);assert.equal(w.history.at(-1).joined,true);assert.equal(w.history.at(-1).regrouped,false);assert.equal(w.history.at(-1).familiar,true);assert.equal(w.feedbackId,2);
 const historic=copy(w.history);J.keepJoiningDraft(s);const kept=copy(w.kept);J.resetJoiningModel(s);assert.equal(w.raw,` 0${c.total} `);assert.equal(w.feedbackId,2,'numeric feedback survives regroup/reset');assert.deepEqual(w.kept,kept);assert.deepEqual(w.history,historic);w.source.title='A later title';w.source.request='A later request.';assert.equal(w.history.at(-1).feedbackText,historic.at(-1).feedbackText,'historical feedback wording remains frozen');J.setJoiningTotal(s,'');assert.equal(w.feedbackId,null);assert.equal(J.validJoiningOrders(s.joiningOrders),true);
}
{
 const s=make('full-frame-orders');J.joinOrders(s);for(let i=0;i<3;i++)J.moveJoiningOne(s,'pip',true);for(let i=0;i<7;i++)J.moveJoiningOne(s,'dot',true);assert.equal(J.wrapJoiningTen(s),true);assert.equal(model(s).newTenPip,3);assert.equal(model(s).newTenDot,7);J.moveJoiningOne(s,'pip',true);assert.equal(J.unwrapJoiningTen(s),false,'last one in frame blocks unwrap');J.moveJoiningOne(s,'pip',false);assert.equal(J.unwrapJoiningTen(s),true);assert.equal(model(s).framePip,3);assert.equal(model(s).frameDot,7);J.setJoiningTotal(s,'41');J.checkJoiningTotal(s);assert.equal(work(s).history[0].regrouped,false,'wrap then unwrap does not claim current regroup');
}
{
 const s=make('full-frame-orders');J.joinOrders(s);for(let i=0;i<4;i++)J.moveJoiningOne(s,'pip',true);for(let i=0;i<6;i++)J.moveJoiningOne(s,'dot',true);J.wrapJoiningTen(s);assert.equal(model(s).newTenPip,4);assert.equal(model(s).newTenDot,6);J.setJoiningTotal(s,'41');J.checkJoiningTotal(s);assert.equal(work(s).history[0].regrouped,true);
 J.openJoiningHelp(s,'example');J.useJoiningSupport(s,'narrationRequested');const h=copy(work(s).history[0]);J.startJoiningOrder(s,'steady-orders');J.setJoiningTotal(s,'37');J.checkJoiningTotal(s);assert.equal(work(s).history[0].familiar,true,'other started case qualifies first check');assert.equal(work(s).history[0].support.includes('example'),false,'other-case support is not copied');J.startJoiningOrder(s,'full-frame-orders');assert.deepEqual(work(s).history[0],h,'old check frozen');
}
{
 const s=make('steady-orders'),w=work(s);J.setJoiningTotal(s,'37');J.checkJoiningTotal(s);J.keepJoiningDraft(s);const saved=copy(w.kept);for(let i=0;i<9;i++)J.checkJoiningTotal(s);assert.equal(w.history.length,8);assert.equal(w.history[0].id,3);assert.deepEqual(w.kept,saved,'kept evicted check survives');assert.equal(J.validJoiningOrders(s.joiningOrders),true);
 const bad=copy(s);bad.joiningOrders.cases['steady-orders'].history.at(-1).outcome.numberMatches=false;const raw=copy(bad.joiningOrders);assert.equal(J.joiningState(bad),null,'forged math enters raw recovery');assert.equal(J.checkJoiningTotal(bad),false);assert.equal(J.recoverJoiningOrders(bad),true);assert.deepEqual(bad.joiningOrders.recovered,raw);assert.equal(J.joiningView(bad).priorExposureUnknown,true);
}
{
 const s=make('steady-orders');for(const mutate of [w=>w.model.framePip=11,w=>w.source.total=38,w=>w.source.title={toString:null},w=>w.source.id={toString:null},w=>w.support={},w=>w.nextCheckId=Number.MAX_SAFE_INTEGER+1]){const bad=copy(s);mutate(bad.joiningOrders.cases['steady-orders']);assert.equal(J.joiningState(bad),null);}
 const bad=copy(s);bad.joiningOrders={version:99,raw:'<img src=x onerror="fictional()">'};const old=copy(bad.joiningOrders);assert.equal(J.joiningState(bad),null);assert.equal(J.recoverJoiningOrders(bad),true);assert.deepEqual(bad.joiningOrders.recovered,old);
}
console.log('Joining Supply Orders core: conserved reachable states, checks, frozen work, context and recovery passed.');
