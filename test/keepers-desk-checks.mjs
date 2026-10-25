import assert from 'node:assert/strict';
import {deskSource} from '../dist/keepers-desk-content.mjs';
import {parseAffine,parseShare,checkDeskValue,deskView,startDesk,setDeskLocation,setDeskDraft,showDeskLearn,foldDeskLearn,addDeskSupport,deskHelp,keepDeskTask,addDeskTrial,setDeskRecommendation,useDeskObjection,keepDeskRecommendation} from '../dist/keepers-desk-core.mjs';
import {freshState} from '../dist/core.mjs';
import {prepareProgressImport} from '../dist/progress-transfer.mjs';
let count=0;const equal=(a,b,m)=>{assert.deepEqual(a,b,m);count++;},ok=(v,m)=>{assert.ok(v,m);count++;};
const make=()=>{const s=freshState();ok(startDesk(s));return s;};
const canExport=s=>prepareProgressImport(JSON.stringify(s,null,2)).ok;
const compare=(task,value,outcome)=>equal(checkDeskValue(deskSource,task,value).outcome,outcome,task+': '+JSON.stringify(value));
for(const [expression,a,b] of [['1200+60L',60,1200],['60l + 1,200',60,1200],['(600+600)+(2*30)*L',60,1200],['-(-60 L) + (1200)',60,1200],['400 + 100×L',100,400],['L−L + 9',0,9],['(L-L)*L+1200+60L',60,1200]])equal(parseAffine(expression),{ok:true,coefficient:a,constant:b},expression);
for(const bad of ['', 'L*L-L*L+1200+60L','60/L+1200','L**2','Math.random()','globalThis','(1200+60L','1200+60L)','1,20+60L','1e3+L','9007199254740992','999999999999999*999999999999999','('.repeat(13)+'L'+')'.repeat(13),'L+'.repeat(49)+'L', 'x'.repeat(161),'2.5L'])ok(!parseAffine(bad).ok,bad);
// Independent integer oracle across varied constants and coefficient compositions.
for(let setup=0;setup<30;setup++)for(let rate=0;rate<20;rate++){
 const p=parseAffine(`(${setup}+${rate}L)+(3L-2L)`);ok(p.ok);for(const l of [0,1,7,100])equal(p.constant+p.coefficient*l,setup+rate*l+l);
}
for(const [value,n,d] of [['1/4',1n,4n],['45/180',1n,4n],['.25',1n,4n],['0.2500',1n,4n],['25%',1n,4n],['5 %',1n,20n],['0',0n,1n],['0.0000000000000000000001',1n,10000000000000000000000n]])equal(parseShare(value),{ok:true,numerator:n,denominator:d});
for(const bad of ['1:4','1/0','1/4/2','NaN','Infinity','-0.25','1e-2','one quarter'])ok(!parseShare(bad).ok,bad);
for(const [task,answer] of [['1a','2640'],['1b','1900'],['1d','20'],['1e-bridge','60L+1200'],['1e-causeway','100L+400'],['2a','1:3'],['2b','25%'],['2c-ratio','1:19'],['2c-share','1/20']])compare(task,answer,'match');
compare('1a','2,640 coins','match');compare('1d','L = 20 m','match');compare('1c',{bridge:'fits',causeway:'fits',both:'not'},'match');compare('1c',{bridge:'fits'},'uncheckable');compare('1c',{bridge:'not',causeway:'fits',both:'not'},'different');
for(const [task,value] of [['1a','1440'],['1a','1260'],['1a','30240'],['1b','1500'],['1b','500'],['1b','7500'],['1d','800'],['1d','40'],['1d','2400'],['1e-bridge','(1200+60)L'],['1e-causeway','100+400L'],['2a','45:135'],['2a','3:1'],['2c-ratio','19:1'],['2b','1/3'],['2c-share','1/19']])compare(task,value,'different');
for(const t of deskSource.tasks){if(t.kind==='choice')for(const c of t.choices){const r=checkDeskValue(deskSource,t.id,c.id);equal(r.outcome,'interpretation');equal(r.feedback,c.reply);}if(t.kind==='multi'){equal(checkDeskValue(deskSource,t.id,[]).outcome,'interpretation');for(const c of t.choices)equal(checkDeskValue(deskSource,t.id,[c.id]).feedback,c.reply);}if(t.kind==='source')for(const kind of deskSource.sourceKinds)for(const left of ['can','cannot'])for(const right of ['can','cannot'])equal(checkDeskValue(deskSource,t.id,{kind:kind.id,cards:{[t.claims[0].id]:left,[t.claims[1].id]:right}}).outcome,'interpretation');}
{
 const s=freshState(),before=structuredClone(s);equal(deskView(s).status,'missing');equal(s,before);ok(!startDesk(s,{canExport:()=>false}));equal(s,before);ok(startDesk(s,{canExport}));equal(s.desk.location,{stepId:null,taskId:null});ok(!startDesk(s));
}
{
 const s=make();ok(setDeskLocation(s,'cost','1a'));equal(s.desk.steps.cost.shownLearn,1);equal(s.desk.steps.cost.shownGuided,['1a']);setDeskDraft(s,'1a','2640');const first=keepDeskTask(s,'1a');equal(first.outcome,'match');equal(first.support.learn,[0]);equal(first.support.guidedLines,[0,1,2]);ok(foldDeskLearn(s,'cost',true));equal(s.desk.steps.cost.support,[]);addDeskSupport(s,'cost','together');const second=keepDeskTask(s,'1a');equal(second.support.events,[{code:'together',count:1}]);equal(first.support.events,[],'later support cannot alter old attempt');ok(second.familiar);ok(!first.familiar);ok(foldDeskLearn(s,'cost',false));equal(s.desk.steps.cost.support.at(-1).code,'show-how');ok(showDeskLearn(s,'cost'));equal(s.desk.steps.cost.shownLearn,2);
 for(let i=0;i<40;i++)keepDeskTask(s,'1a');equal(s.desk.steps.cost.attempts['1a'].length,32);equal(s.desk.steps.cost.first['1a'],first);equal(s.desk.steps.cost.counts['1a'],42);
 ok(setDeskLocation(s,'crossings','2b'));ok(foldDeskLearn(s,'crossings',true));ok(setDeskLocation(s,'crossings','2a'));equal(s.desk.steps.crossings.shownGuided,[],'folded first-task guidance was not shown');ok(foldDeskLearn(s,'crossings',false));equal(s.desk.steps.crossings.shownGuided,['2a']);
 const old=structuredClone(s.desk);equal(prepareProgressImport(JSON.stringify(s)).state.desk,old,'whole import keeps source/support/attempts');
}
{
 const s=make();setDeskLocation(s,'cost','1c');equal(deskHelp(s,'1c'),1);equal(deskHelp(s,'1c'),2);setDeskLocation(s,'cost','1a');setDeskDraft(s,'1a','2640');const r=keepDeskTask(s,'1a');ok(r.support.events.some(x=>x.taskId==='1c'&&x.code==='similar-example'),'earlier-cost help exposure follows later cost checks');const skip=deskHelp(s,'1a');equal(skip,1);deskHelp(s,'1a');equal(deskHelp(s,'1a').outcome,'skipped');
 for(let i=0;i<24;i++)ok(addDeskTrial(s,i));equal(s.desk.steps.cost.trials.length,20);equal(s.desk.steps.cost.trials[0],{length:4,bridge:1440,causeway:800});ok(!addDeskTrial(s,101));
}
{
 const s=make();setDeskLocation(s,'recommendation');equal(keepDeskRecommendation(s),false);const r=deskSource.recommendation;
 ok(setDeskRecommendation(s,'plan',r.plans[0].label,{planId:'bridge',supplied:true}));ok(setDeskRecommendation(s,'reason',r.starters.reason[0],{supplied:true}));ok(setDeskRecommendation(s,'objection',r.starters.objection[0],{supplied:true}));ok(setDeskRecommendation(s,'uncertainty',r.starters.uncertainty[0],{supplied:true}));const first=keepDeskRecommendation(s);ok(first);equal(first.objectionCode,'bridge');equal(first.objectionQuestion,r.objections.bridge);equal(Object.values(s.desk.steps).flatMap(x=>Object.keys(x.attempts)),[],'supported closure never completes unseen tasks');
 setDeskRecommendation(s,'plan',r.plans[1].label,{planId:'causeway',supplied:true});equal(s.desk.recommendation.objectionCode,'bridge');equal(s.desk.recommendation.draft.objection,first.objection);const kept=keepDeskRecommendation(s);equal(kept.objectionQuestion,r.objections.bridge,'old answer retains old question');ok(useDeskObjection(s));equal(s.desk.recommendation.draft.objection,'');equal(s.desk.recommendation.objectionCode,'causeway');equal(s.desk.recommendation.first,first);equal(s.desk.recommendation.kept,kept);setDeskRecommendation(s,'objection','A synthetic revised answer');ok(keepDeskRecommendation(s));equal(s.desk.recommendation.first,first);
 equal(prepareProgressImport(JSON.stringify(s)).state.desk,s.desk,'recommendation export/import exact');
}
{
 const s=make();setDeskLocation(s,'cost','1a');setDeskDraft(s,'1a','2640');const kept=keepDeskTask(s,'1a');const original=structuredClone(s.desk);s.desk.source.model.bridge.rate=70;equal(s.desk.steps.cost.first['1a'],kept,'key changes do not regrade');equal(deskView(s).status,'ready');setDeskDraft(s,'1a','2880');equal(keepDeskTask(s,'1a').outcome,'match','new check uses saved model, not authored current key');
 s.desk.steps.cost={synthetic:'Unreadable preserved <raw>'};const broken=structuredClone(s.desk.steps.cost);equal(deskView(s).steps.cost,null);ok(setDeskLocation(s,'crossings','2a'));setDeskDraft(s,'2a','1:3');equal(keepDeskTask(s,'2a').outcome,'match');equal(s.desk.steps.cost,broken);ok(!setDeskDraft(s,'1a','1'));equal(s.desk.steps.cost,broken);equal(prepareProgressImport(JSON.stringify(s)).state.desk,s.desk);
 s.desk.version=99;const unknown=structuredClone(s);equal(deskView(s).status,'unavailable');ok(!setDeskLocation(s,'cost','1a'));equal(s,unknown);equal(original.steps.cost.first['1a'],kept);
}
{
 const s=make();setDeskLocation(s,'cost','1a');const old=structuredClone(s);ok(!setDeskDraft(s,'1a','100',{canExport:()=>false}));equal(s,old);ok(!setDeskRecommendation(s,'reason','x'.repeat(1001)));equal(s,old);ok(!setDeskDraft(s,'1a','x'.repeat(1001)));equal(s,old);
}
{
 const mutations=[
 s=>delete s.desk.source.arrival,s=>s.desk.source.arrival.words={},s=>delete s.desk.source.plans,
 s=>s.desk.source.records[0].text=[],s=>s.desk.source.records[1].entries=[{}],s=>s.desk.source.equality=[null],
 s=>s.desk.source.recommendation.plans=null,s=>s.desk.source.recommendation.starters.reason=[{}],s=>s.desk.source.recommendation.objections.bridge={},
 s=>s.desk.source.tasks.find(t=>t.kind==='rule').tiles=null,s=>s.desk.source.tasks.find(t=>t.kind==='share').day='future-day',
 s=>s.desk.source.tasks.find(t=>t.kind==='source').claims=[{}],s=>s.desk.source.tasks.find(t=>t.kind==='choice').choices[0].reply={},
 s=>s.desk.source.model.bridge.rate=1e12,s=>s.desk.source.model.saturday.carts=-1
 ];
 for(const mutate of mutations){const s=make();mutate(s);const before=structuredClone(s);equal(deskView(s).status,'unavailable');ok(!setDeskLocation(s,'cost','1a'));equal(s,before,'bad source remains raw');}
 const s=make();s.desk.recommendation.kept={unexpected:'Synthetic saved page'};const before=structuredClone(s.desk.recommendation);equal(deskView(s).recommendation,null);ok(setDeskLocation(s,'cost','1a'));equal(s.desk.recommendation,before,'malformed recommendation does not block cost sibling');
}
{
 const s=make();const before=structuredClone(s);ok(!keepDeskTask(s,'1a'));equal(s,before,'checking unopened task cannot manufacture exposure');ok(!keepDeskRecommendation(s));equal(s,before);ok(setDeskLocation(s,'cost','1a'));ok(setDeskLocation(s,null,null));equal(s.desk.location,{stepId:null,taskId:null});
 setDeskLocation(s,'cost','1a');const old=structuredClone(s);ok(!setDeskDraft(s,'1a','1'.repeat(161)));equal(s,old,'answer limit checked before writing');
 // Legacy append logs stay readable; a new event cannot strand the step at an arbitrary event cap.
 s.desk.steps.cost.support=Array.from({length:10000},()=>({code:'reference'}));const legacy=structuredClone(s.desk.steps.cost.support);ok(addDeskSupport(s,'cost','together'));equal(s.desk.steps.cost.support.slice(0,10000),legacy);equal(deskView(s).steps.cost.support.length,10001);
}
{
 const s=make();setDeskLocation(s,'crossings','2d');const task=s.desk.source.tasks.find(t=>t.id==='2d');task.choices[0].id='future-reading';setDeskDraft(s,'2d','future-reading');equal(keepDeskTask(s,'2d').outcome,'interpretation');equal(prepareProgressImport(JSON.stringify(s)).state.desk,s.desk,'saved choice IDs/order not restricted to current catalog');
 const held=structuredClone(s.desk.steps.crossings.first['2d']);task.choices.reverse();equal(s.desk.steps.crossings.first['2d'],held,'saved reading not regraded after source arrangement change');
}
{
 for(const [task,value] of [['1a',''],['1a','twelve'],['1c',{bridge:'fits'}],['1e-bridge','L*L'],['2d',''],['3a-hob',{kind:'memory',cards:{'hob-experience':'can'}}]]){
 const s=make(),t=s.desk.source.tasks.find(t=>t.id===task);setDeskLocation(s,t.stepId,task);setDeskDraft(s,task,value);const before=structuredClone(s),answer=keepDeskTask(s,task);equal(answer.outcome,'uncheckable');equal(answer.recorded,false);equal(s,before,'invalid check writes no attempt, first version or familiarity');equal(s.desk.steps[t.stepId].counts[task],undefined);equal(s.desk.steps[t.stepId].first[task],undefined);
 }
 const s=make();setDeskLocation(s,'cost','1a');setDeskDraft(s,'1a','');keepDeskTask(s,'1a');setDeskDraft(s,'1a','2640');const checked=keepDeskTask(s,'1a');equal(checked.priorAttempts,0);equal(checked.familiar,false);equal(s.desk.steps.cost.first['1a'],checked);
 for(const value of ['1 200 + 60L','12 34','1200+6 0L'])ok(!parseAffine(value).ok,'numeric adjacency is a grammar error');
 for(const [task,value] of [['2a','0:90'],['2a','44:134'],['2c-ratio','1:37']])ok(checkDeskValue(deskSource,task,value).feedback.startsWith('Taking the same amount off both parts'),'subtraction misconception');
}
{
 const s=make();setDeskLocation(s,'recommendation');const reasons=deskSource.recommendation.starters;
 setDeskRecommendation(s,'plan','Build the timber footbridge',{planId:'bridge',supplied:true});const displayed=deskSource.recommendation.objections.bridge;
 setDeskRecommendation(s,'plan','Build the timber footbridge with a wider hand-cart rail');equal(s.desk.recommendation.planId,'bridge','adapting chosen plan preserves identity');equal(s.desk.recommendation.objectionCode,'bridge');
 setDeskRecommendation(s,'objection','A synthetic reply to the displayed footbridge question',{objectionCode:'bridge'});setDeskRecommendation(s,'reason',reasons.reason[0],{supplied:true});setDeskRecommendation(s,'uncertainty',reasons.uncertainty[0],{supplied:true});equal(keepDeskRecommendation(s).objectionQuestion,displayed);
 setDeskRecommendation(s,'plan','Build the stone causeway',{planId:'causeway'});const oldQuestion=s.desk.recommendation.objectionCode;setDeskRecommendation(s,'objection','');equal(s.desk.recommendation.objectionCode,oldQuestion,'clearing the answer does not silently change its visible question');setDeskRecommendation(s,'objection','Another synthetic answer',{objectionCode:'bridge'});equal(keepDeskRecommendation(s).objectionQuestion,displayed);
 const before=structuredClone(s);ok(!setDeskRecommendation(s,'objection','',{objectionCode:'unknown-question'}),'invalid code cannot overwrite an answer');equal(s,before);
}
{
 const s=make();setDeskLocation(s,'cost','1e-bridge');for(let i=0;i<2000;i++)ok(addDeskSupport(s,'cost','tiles','1e-bridge'));
 equal(s.desk.steps.cost.support,[{code:'tiles',taskId:'1e-bridge',count:2000}],'tile context has one bounded counter');setDeskDraft(s,'1e-bridge','1200+60L');const first=keepDeskTask(s,'1e-bridge');equal(first.support.events,[{code:'tiles',taskId:'1e-bridge',count:2000}]);
 addDeskSupport(s,'cost','tiles','1e-bridge');equal(first.support.events[0].count,2000,'later events do not alter old snapshots');const later=keepDeskTask(s,'1e-bridge');equal(later.support.events[0].count,2001);
 for(const task of s.desk.source.tasks.filter(t=>t.stepId==='cost')){setDeskLocation(s,'cost',task.id);const input={'1a':'2640','1b':'1900','1c':{bridge:'fits',causeway:'fits',both:'not'},'1d':'20','1e-bridge':'1200+60L','1e-causeway':'400+100L'}[task.id];setDeskDraft(s,task.id,input);for(let i=0;i<35;i++)ok(keepDeskTask(s,task.id));}
 ok(canExport(s),'2,001 tile events and all six task histories preserve whole-notebook headroom');ok(JSON.stringify(s).length<200000,'support snapshot size depends on distinct contexts, not repeated taps');
 setDeskLocation(s,'cost','1a');deskHelp(s,'1a');deskHelp(s,'1a');deskHelp(s,'1a');const skipped=structuredClone(s);const again=deskHelp(s,'1a');equal(again.recorded,false);equal(s,skipped,'repeated skip at rung3 adds neither event nor attempt');
}
console.log(`Keeper’s Desk: ${count} oracle, content, support, preservation and boundary checks passed.`);
