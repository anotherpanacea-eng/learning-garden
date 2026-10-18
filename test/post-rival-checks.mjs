import assert from 'node:assert/strict';
import {deliveries} from '../dist/post-office-content.mjs';
import {startPostOffice,ensurePostOffice,setPostPackingInput,submitPostPacking,packPostTogether,appendPostClause,editPostClause,restartPostRoute,stepPostRoute} from '../dist/post-office-core.mjs';
import {rivalTasks,validPostRival,rivalBlocks,startPostRival,setRivalInput,submitRival,openRivalPractice,stepRivalPractice,returnRivalQuestion,solveRivalTogether,bypassRival,continueRival,noteRivalAudio} from '../dist/post-rival.mjs';
let checks=0;
const check=(x,message)=>{assert.ok(x,message);checks++;},json=JSON.stringify,copy=x=>JSON.parse(json(x));
const fresh=(id=deliveries[0].id)=>{const s={},v=startPostOffice(s,id);return {s,v};};
const reload=s=>{const restored=copy(s);ensurePostOffice(restored);check(!restored.postOffice.visits[0].closed,'valid rival reload remains open');check(validPostRival(restored.postOffice.visits[0].rival),'reloaded rival validates');check(json(restored)===json(s),'reload retains exact encounter');};
const otherWork=v=>json(Object.fromEntries(Object.entries(v).filter(([k])=>k!=='rival')));
check(Object.isFrozen(rivalTasks)&&rivalTasks.every(t=>Object.isFrozen(t.practice.pictures.groups)),'task and practice catalogs deeply frozen');
for(const t of rivalTasks){
 for(const m of [t,t.practice]){
  check(m.answer===(m.kind==='add'?m.a+m.b:m.kind==='subtract'?m.a-m.b:m.a*m.b),'task/helper arithmetic exact');
  const g=m.pictures.groups;
  check(m.kind==='add'?g.length===2&&g[0].count===m.a&&g[1].count===m.b:m.kind==='subtract'?g.length===1&&g[0].count===m.a&&g[0].reserved===m.b:g.length===m.a&&g.every(x=>x.count===m.b),'task/helper picture counts exact');
 }
 check(t.answer!==t.practice.answer&&t.kind===t.practice.kind,'worked example differs from actual question');
}
for(const [i,d] of deliveries.entries()){
 const {s,v}=fresh(d.id),before=otherWork(v);
 check(startPostRival(s)&&v.rival.task.kind===['add','subtract','multiply'][i%3]&&v.rival.reason==='neutral-mix','neutral mix follows six order IDs');
 check(v.rival.task!==rivalTasks[i%3]&&json(v.rival.task)===json(rivalTasks[i%3]),'encounter owns exact independent snapshot');
 check(!v.packing.packed&&otherWork(v)===before&&rivalBlocks(v),'separate early puzzle preserves parcel and blocks flight');
 reload(s);
 const frozen=json(v.rival);packPostTogether(s);check(!startPostRival(s,true)&&json(v.rival)===frozen,'later packing support cannot reselect or reopen encounter');
 setRivalInput(s,String(v.rival.task.answer));submitRival(s);check(v.rival.phase==='resolved'&&rivalBlocks(v),'correct answer awaits manual continuation');reload(s);
 check(!setRivalInput(s,'0')&&!submitRival(s)&&!openRivalPractice(s)&&!bypassRival(s),'resolved answer cannot be replayed or overwritten');
 check(continueRival(s)&&!rivalBlocks(v)&&v.rival.resolution==='answered','manual continue releases gate and preserves answer resolution');reload(s);
 const terminal=json(v.rival);
 for(const action of [()=>startPostRival(s),()=>setRivalInput(s,'9'),()=>submitRival(s),()=>openRivalPractice(s),()=>stepRivalPractice(s,1),()=>returnRivalQuestion(s),()=>solveRivalTogether(s),()=>bypassRival(s),()=>continueRival(s),()=>noteRivalAudio(s)])check(!action()&&json(v.rival)===terminal,'continued encounters are read-only');
}
for(const d of deliveries){
 const {s,v}=fresh(d.id);setPostPackingInput(s,'not numeric');submitPostPacking(s);
 check(startPostRival(s)&&v.rival.reason==='same-operation'&&v.rival.task.kind===d.math.kind,'observed packing miss selects same operation');
 const {s:t,v:w}=fresh(d.id);packPostTogether(t);check(startPostRival(t)&&w.rival.reason==='same-operation'&&w.rival.task.kind===d.math.kind,'packing together selects same operation');
}
{
 const {s,v}=fresh(),before=otherWork(v);check(startPostRival(s,true)&&v.rival.supported&&v.rival.phase==='practice','practice first needs no packing or answer');reload(s);
 check(stepRivalPractice(s,-1)&&v.rival.practiceStep===0,'practice previous clamps at zero');
 for(let i=0;i<4;i++)stepRivalPractice(s,1);
 check(v.rival.practiceStep===2&&!stepRivalPractice(s,2),'practice next clamps and actions validate');
 stepRivalPractice(s,'reset');check(v.rival.practiceStep===0&&v.rival.supported,'practice reset retains support');
 check(returnRivalQuestion(s)&&setRivalInput(s,'  +011.0 ')&&submitRival(s),'finite decimal input accepted');
 check(v.rival.attempts[0].input==='  +011.0 '&&v.rival.attempts[0].value===11&&v.rival.attempts[0].afterSupport,'raw supported answer kept');
 check(otherWork(v)===before&&!v.packing.packed&&!v.completed,'rival support/answer never packs or delivers');reload(s);
}
{
 const {s,v}=fresh();startPostRival(s);const before=otherWork(v);
 setRivalInput(s,' 007.5 ');submitRival(s);
 check(v.rival.phase==='practice'&&v.rival.practiceStep===0&&v.rival.input===' 007.5 '&&v.rival.supported,'miss retains raw input and opens support');
 check(json(v.rival.attempts[0])===json({input:' 007.5 ',value:7.5,correct:false,afterSupport:false}),'miss recorded before support becomes sticky');reload(s);
 returnRivalQuestion(s);setRivalInput(s,'Infinity');submitRival(s);
 check(v.rival.attempts.at(-1).value===null&&v.rival.attempts.at(-1).afterSupport,'invalid numeric retry retains raw input with support');
 returnRivalQuestion(s);setRivalInput(s,'');submitRival(s);check(v.rival.attempts.at(-1).value===null,'empty input never means zero');
 for(let i=0;i<28;i++){returnRivalQuestion(s);setRivalInput(s,'1e1');submitRival(s);}
 check(v.rival.attempts.length===24&&v.rival.attempts.every(a=>a.afterSupport&&a.value===null)&&validPostRival(v.rival),'bounded attempts retain sticky support and reject exponent syntax');
 const attempts=json(v.rival.attempts);check(solveRivalTogether(s)&&v.rival.phase==='resolved'&&v.rival.resolution==='together'&&json(v.rival.attempts)===attempts,'solve together resolves with no fabricated attempt');
 check(otherWork(v)===before&&rivalBlocks(v),'support leaves every parcel/route/reading field unchanged');reload(s);continueRival(s);reload(s);
}
{
 const {s,v}=fresh();startPostRival(s);noteRivalAudio(s);
 check(v.rival.audioRequested&&v.rival.supported&&!v.support.audioRequested&&!v.packing.supported,'narration support scoped to rival');
 appendPostClause(s,'go:cafe');const frozen=json(v.rival);editPostClause(s,0,'remove');restartPostRoute(s);check(json(v.rival)===frozen,'route edits/restart preserve frozen encounter');
 check(bypassRival(s)&&v.rival.resolution===null&&!rivalBlocks(v),'quiet route releases gate without resolution');reload(s);
 const terminal=json(s);check(!startPostRival(s,true)&&!solveRivalTogether(s)&&!noteRivalAudio(s)&&json(s)===terminal,'bypassed encounter remains read-only');
}
{
 const {s,v}=fresh();startPostRival(s);solveRivalTogether(s);noteRivalAudio(s);check(validPostRival(v.rival)&&v.rival.attempts.length===0,'together and resolution narration require no answer toll');
 const baseline=copy(v.rival);
 const corruptions=[r=>r.revision='future',r=>r.task.a=1000000,r=>r.task.pictures.groups[0].count=99,r=>r.task.practice.answer=999,r=>r.task.extra=true,r=>r.phase='future',r=>r.practiceStep=3,r=>r.practiceStep=-1,r=>r.supported=false,r=>r.audioRequested='yes',r=>r.reason='weak-topic',r=>r.resolution=null,r=>r.extra=true,r=>r.attempts=Array(25).fill({input:'1',value:1,correct:false,afterSupport:true}),r=>r.attempts=[{input:'11',value:11,correct:false,afterSupport:true}],r=>r.attempts=[{input:'NaN',value:NaN,correct:false,afterSupport:true}],r=>r.attempts=[{input:'1',value:1,correct:false,afterSupport:'yes'}]];
 for(const corrupt of corruptions){const bad=copy(baseline);corrupt(bad);check(!validPostRival(bad),'malformed/future snapshots rejected');}
 for(const bad of [null,[],{},7,undefined])check(!validPostRival(bad),'invalid rival types rejected');
 v.closed=true;const closed=json(s);check(!startPostRival(s)&&!continueRival(s)&&!noteRivalAudio(s)&&json(s)===closed,'closed visit refuses rival changes');
 const absent={};check(!startPostRival(absent)&&!setRivalInput(absent,'1')&&!submitRival(absent)&&!rivalBlocks(null)&&json(absent)==='{}','absent visits stay absent');
 const {s:t,v:w}=fresh();w.completed=true;check(!startPostRival(t)&&!('rival'in w),'completed delivery cannot start encounter');
}
console.log(`${checks} Bramble rival checks passed.`);
