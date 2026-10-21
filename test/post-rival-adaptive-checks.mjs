import assert from 'node:assert/strict';
import {startPostOffice,ensurePostOffice} from '../dist/post-office-core.mjs';
import {deliveries} from '../dist/post-office-content.mjs';
import {generateRivalTask,rivalTasks,validPostRival,validBrambleNotebook,startPostRival,startAdaptiveRival,nextRivalChallenge,setBrambleMode,setBrambleTable,setRivalInput,submitRival,openRivalPractice,returnRivalQuestion,solveRivalTogether,bypassRival,continueRival,noteRivalAudio,setRivalMethod,stepRivalDecomposition} from '../dist/post-rival.mjs';
let checks=0;
const check=(x,message)=>{assert.ok(x,message);checks++;};
const json=JSON.stringify,copy=x=>JSON.parse(json(x));
const fresh=()=>{const s={},v=startPostOffice(s,deliveries[0].id);return {s,v};};
const answer=s=>{setRivalInput(s,String(s.postOffice.visits.find(v=>v.id===s.postOffice.current).rival.task.answer));submitRival(s);};
const key=r=>`${r.task.kind}:${r.task.a}:${r.task.b}`;
function picture(m){const g=m.pictures.groups;return m.kind==='multiply'?g.length===m.a&&g.every(x=>x.count===m.b):m.kind==='add'?g.length===2&&g[0].count===m.a&&g[1].count===m.b:g.length===1&&g[0].count===m.a&&g[0].reserved===m.b;}
for(const kind of ['multiply','add','subtract'])for(let a=kind==='subtract'?2:1;a<=(kind==='multiply'?12:20);a++)for(let b=1;b<=(kind==='multiply'?12:kind==='add'?20:a-1);b++)for(let scene=0;scene<3;scene++){
 const t=generateRivalTask(kind,a,b,scene);
 for(const m of [t,t.practice]){check(m.answer===(kind==='multiply'?m.a*m.b:kind==='add'?m.a+m.b:m.a-m.b),'every generated answer exact');check(picture(m),'every generated picture literal');}
 check(t.a!==t.practice.a||t.b!==t.practice.b,'worked example uses different parameters');
 check(t.practice.kind===t.kind&&t.practice.answer>0&&t.prompt!==t.practice.prompt,'helper same operation and positive');
}
for(const args of [['multiply',13,1],['multiply',0,1],['add',21,1],['subtract',2,2],['subtract',1,0],['future',1,1],['multiply',1,1,3],['add',NaN,2]])check(generateRivalTask(...args)===null,'invalid generator parameters rejected');
{
 const {s,v}=fresh();startAdaptiveRival(s);const template=copy(v.rival);
 for(const kind of ['add','subtract','multiply'])for(let scene=0;scene<3;scene++){
  const r=copy(template);r.task=generateRivalTask(kind,8,3,scene);
  for(const m of [r.task,r.task.practice]){m.prompt='Earlier saved question wording.';m.explanation='Earlier saved explanation.';for(const group of m.pictures.groups)group.label='Earlier saved picture label.';}
  check(validPostRival(r),'frozen wording can differ in every generated operation and scene');
  const changes=[
   r=>r.task.answer++,r=>r.task.a++,r=>r.task.scene=3,r=>r.task.unit='stones',r=>r.task.kind='future',
   r=>r.task.pictures.kind='add',r=>r.task.pictures.groups[0].count++,r=>r.task.pictures.groups.push(copy(r.task.pictures.groups[0])),
   r=>r.task.practice.answer++,r=>r.task.practice.a++,r=>r.task.practice.scene=(r.task.practice.scene+1)%3,r=>r.task.practice.unit='stones',
   r=>r.task.practice.pictures.groups[0].count++,r=>r.task.practice=copy(r.task),
   r=>r.task.prompt=null,r=>r.task.explanation=[],r=>r.task.pictures.groups[0].label={},r=>r.task.practice.prompt=42,
   r=>r.task.extra=true,r=>r.task.pictures.extra=true,r=>r.task.pictures.groups[0].extra=true,r=>r.task.practice.extra=true,
   r=>r.task.practice.pictures.extra=true,r=>r.task.practice.pictures.groups[0].extra=true,r=>r.task.practice.practice={},r=>r.revision='bramble-3',
  ];
  // Pick an actually different picture kind for addition as well.
  changes[5]=r=>r.task.pictures.kind=kind==='add'?'multiply':'add';
  if(kind==='subtract')changes.push(r=>r.task.pictures.groups[0].reserved++,r=>r.task.practice.pictures.groups[0].reserved++);
  else changes.push(r=>r.task.pictures.groups[0].reserved=0,r=>r.task.practice.pictures.groups[0].reserved=0);
  for(const change of changes){const bad=copy(r);change(bad);check(!validPostRival(bad),'copy continuity never permits numeric, practice, type or future-shape changes');}
 }
}
{
 const {s,v}=fresh();const initial=json(s);check(validBrambleNotebook(s.postOffice)&&json(s)===initial&&!('bramble'in s.postOffice),'validation leaves legacy root exact');
 s.facts={marker:'untouched'};s.cafe={marker:'untouched'};const other=json({...v});
 check(setBrambleMode(s,'multiply')&&setBrambleTable(s,12)&&startAdaptiveRival(s),'explicit choices start adaptive challenge');
 check(v.rival.id===1&&v.rival.task.a===12&&v.rival.method===null&&v.rival.decompositionStep===null&&validPostRival(v.rival),'first round has bounded frozen values');
 check(json(Object.fromEntries(Object.entries(v).filter(([k])=>k!=='rival')))===other&&s.facts.marker==='untouched'&&s.cafe.marker==='untouched','only rival fields changed');
 const frozen=json(v.rival);check(setBrambleMode(s,'add')&&setBrambleTable(s,4)&&json(v.rival)===frozen,'manual preferences apply next only');
 check(!startAdaptiveRival(s)&&!nextRivalChallenge(s)&&json(v.rival)===frozen,'pending encounter cannot be overwritten');
 const saved=json(s);ensurePostOffice(s);check(json(s)===saved,'reload never selects a fresh challenge');
 answer(s);check(v.rival.phase==='resolved'&&setRivalMethod(s,'recalled')&&!v.rival.supported,'recall report is separate from support');
 check(setRivalMethod(s,'together')&&setRivalMethod(s,null)&&v.rival.supported,'together remains supported after changed report');
 check(nextRivalChallenge(s)&&s.postOffice.bramble.history.length===1&&s.postOffice.bramble.history[0].phase==='continued'&&v.rival.task.kind==='add','resolved replacement archives once and uses choice');
 check(s.postOffice.bramble.history[0].method===null&&s.postOffice.bramble.history[0].supported,'archive preserves optional method and support');
 check(bypassRival(s)&&s.postOffice.bramble.history.length===2,'bypass archives exposure once');
 const terminal=json(s);for(const action of [()=>bypassRival(s),()=>continueRival(s),()=>setRivalMethod(s,'worked'),()=>noteRivalAudio(s),()=>stepRivalDecomposition(s,1)])check(!action()&&json(s)===terminal,'terminal round read-only');
 v.completed=true;check(nextRivalChallenge(s)&&v.completed,'completed delivery still permits next challenge');
 check(startPostOffice(s,deliveries[1].id)&&validBrambleNotebook(s.postOffice),'new delivery leaves earlier round frozen');
}
for(const support of [false,true])for(const table of [0,1,3,12]){
 const {s,v}=fresh();setBrambleMode(s,'multiply');setBrambleTable(s,table);const seen=new Set();
 for(let i=0;i<600;i++){
  check(i?nextRivalChallenge(s):startAdaptiveRival(s),'renewable round starts');
  const r=v.rival;seen.add(`${r.task.a}:${r.task.b}`);check(!table||r.task.a===table,'fixed table keeps first factor');
  if(support){openRivalPractice(s);returnRivalQuestion(s);}
  answer(s);continueRival(s);
  check(validBrambleNotebook(s.postOffice),'every renewed notebook valid');
 }
 check(seen.size===(table?12:144),'fair pool covers every ordered pair with clean or support-heavy history');
 check(s.postOffice.bramble.history.length===96&&s.postOffice.bramble.nextRound===601,'history trims independently of ID counter');
}
{
 const {s,v}=fresh();setBrambleMode(s,'multiply');let previous=[];
 for(let i=0;i<60;i++){i?nextRivalChallenge(s):startAdaptiveRival(s);check(!previous.includes(key(v.rival)),'avoid last three exact examples when pool permits');previous=[...previous,key(v.rival)].slice(-3);answer(s);continueRival(s);}
}
{
 const {s,v}=fresh();startAdaptiveRival(s);check(stepRivalDecomposition(s,'reset')&&v.rival.decompositionStep===0&&v.rival.supported,'opening decomposition marks support');
 for(let i=0;i<5;i++)stepRivalDecomposition(s,1);
 check(v.rival.decompositionStep===2&&stepRivalDecomposition(s,-1)&&v.rival.decompositionStep===1&&!stepRivalDecomposition(s,2),'decomposition saved and bounded');
 const input=' not a number ';setRivalInput(s,input);submitRival(s);check(v.rival.input===input&&v.rival.attempts[0].value===null&&v.rival.phase==='practice','miss retains exact input');
 check(!setRivalMethod(s,'worked'),'method only offered for correct numeric resolution');
 solveRivalTogether(s);check(!setRivalMethod(s,'recalled')&&v.rival.attempts.length===1,'solve together invents no attempt or method');
 continueRival(s);check(s.postOffice.bramble.history[0].decompositionStep===1,'archive retains decomposition step');
}
{
 const {s,v}=fresh();setBrambleMode(s,'add');startAdaptiveRival(s);const first=v.rival.id;
 const second=startPostOffice(s,deliveries[1].id);startAdaptiveRival(s);answer(s);continueRival(s);
 s.postOffice.current=v.id;solveRivalTogether(s);continueRival(s);
 check(json(s.postOffice.bramble.history.map(r=>r.id))===json([first+1,first]),'archives append in finish order rather than allocation order');
 check(validBrambleNotebook(s.postOffice),'out-of-order visits validate');
 const b=copy(s.postOffice);b.visits[1].rival=copy(v.rival);check(!validBrambleNotebook(b),'duplicate IDs across visits rejected');
 const c=copy(s.postOffice);c.bramble.history.push(copy(c.bramble.history[0]));check(!validBrambleNotebook(c),'duplicate IDs in history rejected');
 const d=copy(s.postOffice);d.bramble.history[0].method='recalled';check(!validBrambleNotebook(d),'archived/current mismatch rejected');
 check(second.rival.id===first+1,'other visit round unchanged');
}
for(const phase of ['question','practice','resolved','continued','bypassed']){
 const {s,v}=fresh();startPostRival(s,phase==='practice');
 if(['resolved','continued'].includes(phase)){solveRivalTogether(s);if(phase==='continued')continueRival(s);}
 if(phase==='bypassed')bypassRival(s);
 const old=copy(v.rival);check(validPostRival(old)&&validBrambleNotebook(s.postOffice),'authored phase stays valid');
 const ok=startAdaptiveRival(s);check(ok===['resolved','continued','bypassed'].includes(phase),'legacy pending work cannot be overwritten');
 if(ok){check(json(v.rivalLegacy)===json(old)&&s.postOffice.bramble.history.length===0,'legacy replacement retained exactly outside adaptive evidence');solveRivalTogether(s);nextRivalChallenge(s);check(json(v.rivalLegacy)===json(old)&&s.postOffice.bramble.history.length===1,'legacy preserved once through further replacements');}
 else check(json(v.rival)===json(old)&&!('bramble'in s.postOffice),'pending legacy unchanged without extension');
}
{
 const {s,v}=fresh();startAdaptiveRival(s);answer(s);continueRival(s);const baseline=copy(s);
 const corruptions=[p=>p.bramble.version=2,p=>p.bramble.nextRound=1,p=>p.bramble.nextRound=Infinity,p=>p.bramble.mode='future',p=>p.bramble.table=13,p=>p.bramble.cursors.multiply=144,p=>p.bramble.cursors.add=-1,p=>p.bramble.history[0].task.answer++,p=>p.bramble.history[0].phase='resolved',p=>p.bramble.extra=true];
 for(const corrupt of corruptions){const bad=copy(baseline);corrupt(bad.postOffice);check(!validBrambleNotebook(bad.postOffice),'malformed notebook rejected');}
 const round=copy(v.rival);for(const corrupt of [r=>r.id=0,r=>r.id=Number.MAX_SAFE_INTEGER,r=>r.task.a=13,r=>r.task.scene=3,r=>r.task.practice.a=99,r=>r.decompositionStep=3,r=>r.method='future',r=>r.supported=false,r=>r.extra=true]){const bad=copy(round);if(corrupt.toString().includes('supported')){bad.decompositionStep=0;}corrupt(bad);check(!validPostRival(bad),'malformed generated round rejected');}
 s.postOffice.bramble.nextRound=Number.MAX_SAFE_INTEGER;const exact=json(s);check(!nextRivalChallenge(s)&&json(s)===exact,'exhaustion preserves terminal work and history');
}
{
 // An old terminal still on a waiting visit must never be re-archived after trimming.
 const {s,v}=fresh();startAdaptiveRival(s);answer(s);continueRival(s);const old=copy(v.rival);
 const waiting=startPostOffice(s,deliveries[1].id);for(let i=0;i<100;i++){i?nextRivalChallenge(s):startAdaptiveRival(s);answer(s);continueRival(s);}
 check(!s.postOffice.bramble.history.some(r=>r.id===old.id)&&validBrambleNotebook(s.postOffice),'older terminal may outlive archive window');
 s.postOffice.current=v.id;nextRivalChallenge(s);check(!s.postOffice.bramble.history.some(r=>r.id===old.id)&&waiting.rival.id===101,'replacing old terminal never archives twice');
}
{
 // Latest assessed evidence wins, and later bypass cannot overwrite an assessment.
 const {s,v}=fresh();setBrambleMode(s,'multiply');setBrambleTable(s,7);startAdaptiveRival(s);const b=s.postOffice.bramble;
 const record=(id,a,n,style)=>({revision:'bramble-2',id,task:generateRivalTask('multiply',a,n,0),reason:'new example',phase:style==='bypass'?'bypassed':'continued',input:style==='together'?'':String(a*n),feedback:'',practiceStep:0,supported:style==='together',audioRequested:false,attempts:style==='together'||style==='bypass'?[]:[{input:String(a*n),value:a*n,correct:true,afterSupport:false}],resolution:style==='bypass'?null:style==='together'?'together':'answered',method:null,decompositionStep:null});
 b.history=[record(2,7,8,'together'),record(3,7,8,'clean'),record(4,7,9,'together'),record(5,7,9,'bypass'),record(6,7,1,'bypass'),record(7,7,2,'bypass'),record(8,7,3,'bypass')];
 b.nextRound=10;delete v.rival;check(startAdaptiveRival(s)&&v.rival.task.b===9&&v.rival.reason==='revisit','later clean supersedes miss; bypass leaves assessed revisit evidence');
 solveRivalTogether(s);continueRival(s);b.nextRound=11;delete v.rival;check(startAdaptiveRival(s)&&v.rival.task.b===8&&v.rival.reason==='familiar example','latest clean assessed example informs comfortable turn');
}
check(Object.isFrozen(rivalTasks),'legacy task catalog stays frozen');
console.log(`${checks} adaptive Bramble checks passed.`);
