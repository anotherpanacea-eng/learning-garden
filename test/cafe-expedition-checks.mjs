import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ingredients,starterIngredients,orchardFoods} from '../dist/cafe-content.mjs';
import {startForage,chooseForage,plotId,currentForage,submitHarvest,packHarvest} from '../dist/forage-core.mjs';
import {ensureCafe,currentRecipe,nextGuest,orderFor,setCafeRange,skipGuest,adjustBite,checkPlate,cafeSummary,submitCafeNumber,serveCafe,availableIngredients,investigateFood,collectFood,repairQuestion,answerRepair,helpRepair,leaveRepair} from '../dist/cafe-core.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const fresh=(seed=192)=>{const s=freshState();ensureCafe(s);s.cafe.seed=seed;nextGuest(s);return s;};
const snapshot=x=>JSON.stringify(x);
function gather(s){for(const item of currentRecipe(s.cafe))while(s.cafe.stock[item.ingredient.id]<item.required){assert.ok(startForage(s,item.ingredient.id));assert.ok(chooseForage(s,plotId(currentForage(s).hunt.row,currentForage(s).hunt.column)));assert.ok(submitHarvest(s,currentForage(s).total));assert.ok(packHarvest(s));}}
const fitting=s=>availableIngredients(s.cafe).find(a=>orderFor(s.cafe).wanted.every(p=>a.properties.includes(p)));
{
 const s=fresh(),pairs=new Set();check(s.cafe.range==='all','new orders default to all facts');
 for(let i=0;i<144;i++){
  const o=orderFor(s.cafe);pairs.add(o.guests+'x'+o.bites);check(o.guests>=1&&o.guests<=12&&o.bites>=1&&o.bites<=12,'full-range bounds');
  if(i===143)break;
  if(i%7===0){
   const current=snapshot(s.cafe.current),stock=snapshot(s.cafe.stock),all=s.cafe.allIndex;
   setCafeRange(s,'small');check(snapshot(s.cafe.current)===current&&snapshot(s.cafe.stock)===stock,'range change leaves waiting order intact');
   skipGuest(s);const small=orderFor(s.cafe);check(s.cafe.allIndex===all&&small.guests>=2&&small.guests<=4&&small.bites>=2&&small.bites<=3,'small creation does not advance full coverage');
   setCafeRange(s,'all');skipGuest(s);
  }else skipGuest(s);
 }
 check(pairs.size===144&&s.cafe.allIndex===144,'all 144 ordered pairs covered despite range interruptions');
 check(s.cafe.history.length===24,'continued orders retain bounded history');
}
{
 const s=freshState();s.cafe={version:1,seed:192,nextOrder:2,stock:Object.fromEntries(starterIngredients.map(a=>[a.id,9])),current:{orderIndex:1,stage:'stock',recipe:{'comet-crisp':2},total:{attempts:[4]},shortfall:{attempts:[0]}},history:[{orderIndex:0,status:'served',recipe:{'moon-crunch':2},total:{attempts:[8]},shortfall:{attempts:[0]},stockBefore:{'moon-crunch':9}}]};
 ensureCafe(s);const current=orderFor(s.cafe),old=orderFor(s.cafe,0);
 check(current.guest.id==='brolly'&&old.guest.id==='puff','legacy guest identities survive expansion from the original eight regulars');
 check(current.guests===2&&current.bites===2&&current.total===4&&old.guests===4&&old.bites===2&&old.total===8,'legacy current and history freeze original small quantities');
 check(s.cafe.current.recipe['comet-crisp']===2&&s.cafe.stock['comet-crisp']===9&&s.cafe.history[0].total.attempts[0]===8,'legacy recipes, stock and attempts preserved');
 s.cafe.seed=777;setCafeRange(s,'all');check(snapshot(orderFor(s.cafe))===snapshot(current)&&snapshot(orderFor(s.cafe,0))===snapshot(old),'frozen counts, wishes and guest survive sequence/range changes');
 check(serveCafe(s)&&s.cafe.stock['comet-crisp']===5,'legacy stock answer still serves correctly');
 const r=restoreState(JSON.stringify(s));ensureCafe(r);check(orderFor(r.cafe,0).total===8&&!serveCafe(r),'frozen history and served protection survive reload');
}
{
 const s=fresh(143),o=orderFor(s.cafe),food=fitting(s);check(o.guests===12&&o.bites===12&&o.total===144,'largest ordered pair reachable');
 for(let n=0;n<12;n++)check(adjustBite(s,food.id,1),'twelve repeated bites permitted');
 check(!adjustBite(s,food.id,1)&&checkPlate(s),'plate bound stays twelve');
 s.cafe.stock[food.id]=0;check(!submitCafeNumber(s,143)&&submitCafeNumber(s,144),'144 total checked exactly');
 check(cafeSummary(s).missing===144&&submitCafeNumber(s,144)&&!serveCafe(s),'144 plan does not fabricate stock');gather(s);check(serveCafe(s),'largest order serves after four real harvests');
 check(s.cafe.stock[food.id]===0&&!serveCafe(s),'large order stock stays nonnegative and idempotent');
}
{
 const s=fresh(),waiting=snapshot(s.cafe.current),oldStock={...s.cafe.stock};check(availableIngredients(s.cafe).length===8,'only eight starter jars initially');
 for(const food of orchardFoods){
  check(!adjustBite(s,food.id,1)&&!collectFood(s,food.id),'undiscovered food gated');
  check(investigateFood(s,food.id)&&s.cafe.orchard.steps[food.id]===1&&!collectFood(s,food.id),'one investigation does not collect');
  check(investigateFood(s,food.id)&&collectFood(s,food.id)&&s.cafe.stock[food.id]===6,'second investigation permits explicit collection');
  check(!collectFood(s,food.id)&&investigateFood(s,food.id)&&s.cafe.stock[food.id]===6,'replay cannot duplicate collection or stock');
  check(snapshot(s.cafe.current)===waiting,'orchard leaves waiting order and inputs alone');
 }
 check(availableIngredients(s.cafe).length===11&&starterIngredients.every(a=>s.cafe.stock[a.id]===oldStock[a.id]),'three new jars without restocking old jars');
 const r=restoreState(JSON.stringify(s));ensureCafe(r);check(r.cafe.discoveries.length===3&&availableIngredients(r.cafe).length===11,'discoveries and investigation steps survive reload');
}
{
 const s=fresh();check(!repairQuestion(s),'render/read does not create a repair');const recipe=snapshot(s.cafe.current.recipe);
 check(!checkPlate(s)&&repairQuestion(s).kind==='ingredient','explicit failed check creates missing-quality question');
 const q=repairQuestion(s);let correct=0;
 for(const food of q.choices){const expected=food.properties.includes(q.missingProperty);check(answerRepair(s,food.id)===expected,'every available repair choice checked by quality');if(expected)correct++;}
 check(correct>=2&&s.cafe.current.stage==='plate'&&snapshot(s.cafe.current.recipe)===recipe,'multiple repair answers work without editing or advancing plate');
 helpRepair(s);const r=restoreState(JSON.stringify(s));ensureCafe(r);check(repairQuestion(r).supported&&repairQuestion(r).attempts.length===8,'repair attempts and support survive reload');
 check(leaveRepair(r)&&!repairQuestion(r)&&r.cafe.current.stage==='plate','repair has an unconditional way back');
 check(!answerRepair(r,q.choices[0].id),'closed repair cannot take answers');
 checkPlate(r);check(r.cafe.current.repairHistory.length===1&&r.cafe.current.repairHistory[0].supported,'new failed check preserves previous repair evidence');
 adjustBite(r,fitting(r).id,1);check(!repairQuestion(r),'recipe edit closes stale question');
}
{
 const s=fresh(203),food=fitting(s);adjustBite(s,food.id,1);checkPlate(s);const q=repairQuestion(s),before=snapshot(s.cafe.current.recipe);
 check(q.kind==='count'&&q.needed===11&&q.direction==='add','count question uses actual eleven-slot gap');
 check(!answerRepair(s,0)&&answerRepair(s,11)&&snapshot(s.cafe.current.recipe)===before,'count answer never fills the plate automatically');
 helpRepair(s);leaveRepair(s);for(let i=0;i<11;i++)adjustBite(s,food.id,1);check(checkPlate(s),'child can revise and recheck original plate');
 submitCafeNumber(s,orderFor(s.cafe).total);submitCafeNumber(s,cafeSummary(s).plan.missing);gather(s);serveCafe(s);
 const record=s.cafe.history.at(-1);check(record.repair.supported&&record.repair.attempts.at(-1).correct&&record.repair.attempts[0].value===0,'served history keeps repair support and attempts separate');
}
{
 const s=fresh();s.baseline.index=2;const legacy=snapshot(s.baseline);s.cafe.orchard=[];s.cafe.discoveries=['bad',{},'star-berry','star-berry'];ensureCafe(s);
 check(s.cafe.discoveries.length===1&&s.cafe.orchard.selected===null&&s.cafe.orchard.steps['star-berry']===0,'malformed orchard containers recover');
 s.cafe.discoveries=[];s.cafe.current.recipe['star-berry']=12;s.cafe.current.repair=[];s.cafe.current.repairHistory=[null,[]];ensureCafe(s);
 check(s.cafe.current.recipe['star-berry']===0&&!s.cafe.current.repair&&!s.cafe.current.repairHistory.length&&snapshot(s.baseline)===legacy,'malformed new fields cannot unlock foods or discard legacy progress');
 s.cafe.current.recipe=Object.fromEntries(ingredients.map(a=>[a.id,12]));ensureCafe(s);check(cafeSummary(s).count===12,'restored recipe total bounded to twelve');
}
console.log(checks+' café expedition and full-range checks passed.');
