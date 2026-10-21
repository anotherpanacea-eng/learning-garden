import assert from 'node:assert/strict';
import {GROUP_CASES,GROUP_UNKNOWNS,caseById,groupPrompt,groupEquations} from '../dist/equal-groups-content.mjs';
import {ensureEqualGroups,groupState,chooseGroupCase,chooseGroupUnknown,currentGroupWork,noteGroupView,moveGroupModel,modelTray,arrangementFits,setGroupInput,submitGroupAnswer,checkGroupArrangement,useGroupSupport,stepGroupExample,setGroupMethod,carryGroupWork,recoverGroupState} from '../dist/equal-groups-core.mjs';
let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};
const equal=(a,b,message)=>{assert.deepEqual(a,b,message);checks++;};
const fresh=(place='cafe',id='little-table',unknown='total')=>{const s={};ensureEqualGroups(s);chooseGroupUnknown(s,place,unknown);chooseGroupCase(s,place,id);noteGroupView(s,place);return s;};
const copy=x=>JSON.parse(JSON.stringify(x));
check(GROUP_CASES.length===6&&new Set(GROUP_CASES.map(c=>c.id)).size===6,'six distinct cases');
equal(GROUP_CASES.map(c=>[c.groups,c.each,c.total]),[[3,4,12],[4,3,12],[2,5,10],[5,6,30],[7,8,56],[12,12,144]],'reviewed triples');
check(caseById('missing')===null,'unknown case is absent');
for(const c of GROUP_CASES)for(const place of ['cafe','bramble'])for(const unknown of GROUP_UNKNOWNS){
 const s=fresh(place,c.id,unknown),x=currentGroupWork(s,place),p=groupPrompt(c,place,unknown);
 equal(p.answer,c[unknown],`${place}/${c.id}/${unknown}: answer`);
 equal(p.givens.map(g=>g.value),GROUP_UNKNOWNS.filter(k=>k!==unknown).map(k=>c[k]),'only given quantities');
 check(p.equation.includes('?')&&p.prompt.includes(place==='cafe'?'bites':'ribbons'),'question and unit');
 check(p.unit.includes(unknown==='groups'?(place==='cafe'?'plates':'bundles'):(place==='cafe'?'bites':'ribbons')),'answer unit');
 equal(x.model.groups,Array(unknown==='groups'?0:c.groups).fill(0),'initial group count does not reveal grouping answer');
 equal(modelTray(c,x.model),c.total,'all objects start on tray');
 if(unknown==='groups')for(let i=0;i<c.groups;i++)moveGroupModel(s,place,'add-group');
 for(let round=0;round<c.each;round++)check(moveGroupModel(s,place,'round'),'large model uses atomic rounds');
 check(arrangementFits(c,x.model),'exact equal arrangement fits');
 equal(modelTray(c,x.model),0,'filled tray empty');
 check(!moveGroupModel(s,place,'round'),'cannot create objects');
 setGroupInput(s,place,String(c[unknown]));
 equal(submitGroupAnswer(s,place),{valid:true,correct:true,arrangementFit:true},'correct numerical answer and arrangement');
 const a=x.draft.attempts[0];check(a.practice&&a.support.visual&&!('independent' in a),'always visual practice');
 check(groupEquations(c,place).length===4&&groupEquations(c,place).every(t=>t.includes(place==='cafe'?'bites':'ribbons')),'all four unit-labelled explanations');
 check(groupState(s)===s.equalGroups,'built state validates');
}
{
 const s=fresh(),x=currentGroupWork(s,'cafe'),c=x.case;
 check(moveGroupModel(s,'cafe','in',0),'move into group');
 equal([x.model.groups,modelTray(c,x.model)],[[1,0,0],11],'one object moved');
 check(!moveGroupModel(s,'cafe','remove-group',0),'occupied group cannot disappear');
 check(moveGroupModel(s,'cafe','out',0),'move back out');
 equal([x.model.groups,modelTray(c,x.model)],[[0,0,0],12],'reverse restores object counts');
 check(moveGroupModel(s,'cafe','remove-group',2),'remove empty group');
 equal(x.model.groups,[0,0],'one empty group removed');
 moveGroupModel(s,'cafe','add-group');
 for(let i=0;i<4;i++)moveGroupModel(s,'cafe','round');
 const full=copy(x.model);check(!moveGroupModel(s,'cafe','in',0),'no extras from empty tray');equal(x.model,full,'failed move preserves model');
 moveGroupModel(s,'cafe','reset');equal(x.model.groups,[0,0,0],'reset returns objects without changing groups');
 equal(modelTray(c,x.model),12,'reset conserves total');
 moveGroupModel(s,'cafe','scoop',0);equal(x.model.groups,[4,0,0],'given-size scoop');
 check(!arrangementFits(c,x.model),'unequal picture remains visible');
 setGroupInput(s,'cafe','12');equal(submitGroupAnswer(s,'cafe'),{valid:true,correct:true,arrangementFit:false},'number and arrangement checked separately');
 const before=x.draft.attempts.length;equal(checkGroupArrangement(s,'cafe'),{fits:false},'arrangement feedback');equal(x.draft.attempts.length,before,'checking picture is not answer attempt');
 chooseGroupUnknown(s,'cafe','each');noteGroupView(s,'cafe');
 check(!moveGroupModel(s,'cafe','scoop',1),'no scoop that reveals unknown size');
 check(x.work.drafts.each.context.familiar&&x.work.drafts.each.context.priorSupport.moves,'unknown switch carries familiarity and earlier support');
 setGroupInput(s,'cafe','4');setGroupMethod(s,'cafe','counted');submitGroupAnswer(s,'cafe');
 const nextDraft=copy(x.work.drafts.each),model=copy(x.model);
 chooseGroupUnknown(s,'cafe','total');equal(currentGroupWork(s,'cafe').draft.input,'12','old unknown draft retained');equal(currentGroupWork(s,'cafe').model,model,'switch keeps exact unequal arrangement');
 chooseGroupUnknown(s,'cafe','each');equal(currentGroupWork(s,'cafe').draft,nextDraft,'return keeps answer/support/method');
 chooseGroupCase(s,'cafe','festival');chooseGroupCase(s,'cafe','little-table');equal(currentGroupWork(s,'cafe').model,model,'case switch keeps arrangement');
 equal(currentGroupWork(copy(s),'cafe').draft,nextDraft,'JSON reload preserves current draft');
}
{
 const s=fresh('cafe','festival','groups'),x=currentGroupWork(s,'cafe');
 for(let i=0;i<12;i++)check(moveGroupModel(s,'cafe','add-group'),'add up to twelve groups');
 check(!moveGroupModel(s,'cafe','add-group'),'group bound');
 for(let i=0;i<12;i++)check(moveGroupModel(s,'cafe','in',0),'group holds up to twelve objects');
 check(!moveGroupModel(s,'cafe','in',0),'per group bound');
 const before=copy(x.model);check(!moveGroupModel(s,'cafe','round'),'full group blocks complete round');equal(x.model,before,'blocked round has no partial mutation');
 check(!moveGroupModel(s,'cafe','out',-1)&&!moveGroupModel(s,'cafe','in',99)&&!moveGroupModel(s,'cafe','remove-group',1.2),'invalid indices ignored');
}
{
 const s=fresh('cafe','picnic'),x=currentGroupWork(s,'cafe');
 for(let i=0;i<4;i++)moveGroupModel(s,'cafe','in',0);
 for(let i=0;i<5;i++)moveGroupModel(s,'cafe','in',1);
 const before=copy(x.model);check(!moveGroupModel(s,'cafe','round'),'insufficient tray blocks whole round');equal(x.model,before,'no partial round');
 for(const text of ['','   ','-1','1.5','1e1','0xA','145','999','one','<b>10</b>']){setGroupInput(s,'cafe',text);equal(submitGroupAnswer(s,'cafe'),{valid:false},'invalid input is not mathematical miss');}
 equal(x.draft.attempts.length,0,'invalid inputs have no attempts');equal(x.model,before,'invalid text preserves model');
 for(const text of ['0','144','10']){setGroupInput(s,'cafe',text);check(submitGroupAnswer(s,'cafe').valid,'whole range accepted');}
 for(let i=0;i<30;i++){setGroupInput(s,'cafe',String(i));submitGroupAnswer(s,'cafe');}
 equal(x.draft.attempts.length,24,'bounded attempt history');equal(x.draft.attempts[0].answer,6,'keep newest attempts');
 const a=copy(x.draft.attempts[23]);moveGroupModel(s,'cafe','out',0);useGroupSupport(s,'cafe','together');equal(x.draft.attempts[23],a,'attempt snapshot does not alias live model/support');
}
{
 const s=fresh(),x=currentGroupWork(s,'cafe');
 for(const kind of ['counters','equations','together','audio','example'])check(useGroupSupport(s,'cafe',kind),'explicit help');
 equal(x.draft.exampleStep,0,'worked example begins at first step');
 stepGroupExample(s,'cafe',1);stepGroupExample(s,'cafe',1);stepGroupExample(s,'cafe',1);equal(x.draft.exampleStep,2,'example upper bound');
 stepGroupExample(s,'cafe',-1);stepGroupExample(s,'cafe',-1);stepGroupExample(s,'cafe',-1);equal(x.draft.exampleStep,0,'example lower bound');
 equal(x.draft.attempts,[],'help never answers live question');check(!useGroupSupport(s,'cafe','mastery'),'unknown help rejected');
}
{
 const s=fresh(),x=currentGroupWork(s,'cafe');s.cafe={guest:'fictional guest',plate:['pretend']};s.postOffice={pending:{answer:''}};const untouched=copy([s.cafe,s.postOffice]);
 useGroupSupport(s,'cafe','counters');moveGroupModel(s,'cafe','scoop',0);setGroupInput(s,'cafe','12');submitGroupAnswer(s,'cafe');
 const sourceBefore=copy(x.work);equal(carryGroupWork(s,'cafe'),{target:'bramble',reused:false},'first carry creates destination');equal(x.work,sourceBefore,'carry preserves source record');
 const y=currentGroupWork(s,'bramble');equal(y.unknown,'each','next unknown');equal(y.model,x.model,'model values carried');check(y.model!==x.model&&y.model.groups!==x.model.groups,'carried array independent');
 equal(y.draft.input,'','no answer input copied');equal(y.draft.attempts,[],'no score copied');equal(y.draft.support,{visual:true},'local help starts separate');
 check(y.draft.context.familiar&&y.draft.context.priorSupport.counters,'prior support remains separate');equal(y.work.provenance.model,x.model,'frozen model provenance');
 moveGroupModel(s,'bramble','out',0);check(y.model.groups[0]!==x.model.groups[0],'destination edits isolated');equal(y.work.provenance.model,x.model,'provenance isolated from destination edits');
 chooseGroupUnknown(s,'bramble','groups');setGroupInput(s,'bramble','3');const destBefore=copy(y.work);
 equal(carryGroupWork(s,'cafe'),{target:'bramble',reused:true},'repeat carry reopens existing');equal(y.work,destBefore,'repeat never overwrites pending destination');equal(currentGroupWork(s,'bramble').unknown,'groups','reopens last unknown');
 equal([s.cafe,s.postOffice],untouched,'bench never mutates real café or post office');
 const sourceSnapshot=copy(x.work);carryGroupWork(s,'bramble');equal(x.work,sourceSnapshot,'return never overwrites source');
}
{
 const s={};const r=ensureEqualGroups(s);check(r===s.equalGroups,'missing root starts fresh');check(currentGroupWork(s,'cafe')===null,'landing has no model');
 chooseGroupUnknown(s,'cafe','groups');equal(r.cases,{},'landing unknown choice creates no case');chooseGroupCase(s,'cafe','little-table');equal(currentGroupWork(s,'cafe').model.groups,[],'landing choice controls first model');
 check(!chooseGroupCase(s,'nope','little-table')&&!chooseGroupCase(s,'cafe','bad')&&!chooseGroupUnknown(s,'cafe','bad'),'bad public choices ignored');
 for(const bad of [null,[],{version:2,opaque:'future'}, {...copy(r),cases:{bad:{}}}, {...copy(r),selected:{cafe:{caseId:'missing',unknown:'total'},bramble:{caseId:null,unknown:'total'}}}]){
  const t={equalGroups:bad,other:{kept:true}},before=copy(t);check(groupState(t)===null&&ensureEqualGroups(t)===null,'malformed/future root unavailable');equal(t,before,'validation read-only');check(!chooseGroupCase(t,'cafe','picnic'),'cannot overwrite invalid data');
  check(recoverGroupState(t),'explicit recovery succeeds');equal(t.equalGroups.recovered,bad,'raw old root retained');check(groupState(t)===t.equalGroups,'fresh root validates');equal(t.other,{kept:true},'unrelated data kept');
 }
 chooseGroupCase(s,'cafe','picnic');chooseGroupUnknown(s,'cafe','each');chooseGroupCase(s,'cafe','little-table');equal(currentGroupWork(s,'cafe').unknown,'each','reopened case asks the question chosen on the chooser');
 const malformed=copy(s);malformed.equalGroups.cases['little-table'].cafe.model.groups=[13];const saved=copy(malformed);check(!groupState(malformed),'invalid model rejected');equal(malformed,saved,'invalid model untouched');
 const tooMany=fresh();tooMany.equalGroups.cases['little-table'].cafe.drafts.total.attempts=Array(25).fill({});check(!groupState(tooMany),'oversized attempts rejected');
}
console.log(`Equal groups: ${checks} checks passed.`);
