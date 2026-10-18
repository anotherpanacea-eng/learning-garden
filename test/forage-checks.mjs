import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ingredients,starterIngredients,orchardFoods} from '../dist/cafe-content.mjs';
import {ensureCafe,nextGuest,orderFor,adjustBite,checkPlate,cafeSummary,submitCafeNumber,skipCafeStage,serveCafe,availableIngredients,investigateFood,collectFood} from '../dist/cafe-core.mjs';
import {ensureForage,startForage,chooseForage,submitHarvest,supportHarvest,stepHarvest,packHarvest,currentForage,resumeForage} from '../dist/forage-core.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const json=x=>JSON.stringify(x),clone=x=>JSON.parse(json(x));
function fresh(seed=143){const s=freshState();ensureCafe(s);s.cafe.seed=seed;nextGuest(s);ensureForage(s);return s;}
function foodFor(s){return availableIngredients(s.cafe).find(a=>orderFor(s.cafe).wanted.every(p=>a.properties.includes(p)));}
function prepare(s){const food=foodFor(s),o=orderFor(s.cafe);for(let i=0;i<o.bites;i++)adjustBite(s,food.id,1);check(checkPlate(s),'plate fits');return food;}
function find(s,id){check(startForage(s,id),'explicit known-food trip starts');check(chooseForage(s,id),'target found');return currentForage(s);}
{
 const s=freshState();ensureCafe(s);check(starterIngredients.every(a=>s.cafe.stock[a.id]>=2&&s.cafe.stock[a.id]<=9),'only fresh bootstrap initializes modest starter stock');
 for(const value of [undefined,[],null,{},'bad']){s.cafe.stock=value;ensureCafe(s);check(ingredients.every(a=>s.cafe.stock[a.id]===0),'established missing/malformed stock recovers to zero');}
 s.cafe.stock=Object.fromEntries(ingredients.map((a,i)=>[a.id,i===0?180:i===1?30:i===2?-1:i===3?181:0]));ensureCafe(s);
 check(s.cafe.stock[ingredients[0].id]===180&&s.cafe.stock[ingredients[1].id]===30&&s.cafe.stock[ingredients[2].id]===0&&s.cafe.stock[ingredients[3].id]===0,'valid old and expanded stock retained; invalid values recover to zero');
}
{
 const s=fresh(),food=prepare(s);s.cafe.stock[food.id]=0;const o=orderFor(s.cafe);
 check(submitCafeNumber(s,o.total),'table quantity advances');const plan=json(cafeSummary(s).plan);
 check(cafeSummary(s).plan.missing===144&&!cafeSummary(s).ready,'original 144-bite cupboard plan frozen');
 check(submitCafeNumber(s,144)&&!serveCafe(s),'correct arithmetic cannot manufacture stock');
 const waiting=json(s.cafe.current);
 for(let i=0;i<4;i++){
  const t=find(s,food.id);check(t.baskets===6&&t.bites===6&&t.total===36,'large shortfalls use full 36-bite harvests');
  check(!packHarvest(s),'unanswered unsupported harvest cannot pack');check(submitHarvest(s,36)&&packHarvest(s),'correct harvest packs');
  check(!packHarvest(s),'one trip supplies its jar once');check(json(s.cafe.current)===waiting,'trip leaves waiting order and all attempts unchanged');
 }
 check(cafeSummary(s).ready&&cafeSummary(s).missing===0&&json(cafeSummary(s).plan)===plan,'live readiness changes; original plan remains unchanged');
 check(!submitCafeNumber(s,0)&&submitCafeNumber(s,144),'return still answers original question');
 check(serveCafe(s)&&s.cafe.stock[food.id]===0,'serving consumes actual 144 stock');
 const h=s.cafe.history.at(-1);check(h.cupboardPlan.missing===144&&h.stockBefore[food.id]===0&&h.stockAtServe[food.id]===144,'history separates original plan stock from actual serve stock');
 const r=restoreState(json(s));ensureForage(r);check(!serveCafe(r)&&!packHarvest(r)&&r.cafe.stock[food.id]===0,'served and collected reload never awards/spends again');
}
{
 const s=fresh(),food=prepare(s);s.cafe.stock[food.id]=0;skipCafeStage(s);skipCafeStage(s);
 check(!serveCafe(s)&&s.cafe.current.shortfall.supported&&s.cafe.current.shortfall.skipped,'explicit arithmetic support still requires real inventory');
 while(!cafeSummary(s).ready){find(s,food.id);supportHarvest(s);check(packHarvest(s),'explicit support permits packing found harvest');}
 check(serveCafe(s),'supported order serves only after inventory exists');
 check(s.cafe.history.at(-1).shortfall.skipped&&!s.cafe.history.at(-1).independent,'skip/support history preserved without independent claim');
}
{
 const s=fresh(),waiting=json(s.cafe.current);check(!startForage(s,'star-berry')&&!startForage(s,'bad'),'locked and unknown foods cannot start trips');
 for(const food of orchardFoods){investigateFood(s,food.id);investigateFood(s,food.id);check(collectFood(s,food.id)&&s.cafe.stock[food.id]===6,'first discovery still supplies six once');}
 for(const food of ingredients){
  const otherStock={...s.cafe.stock},t=find(s,food.id);check(t.choices.length===3&&new Set(t.choices).size===3&&t.choices.every(id=>availableIngredients(s.cafe).some(a=>a.id===id)),'three distinct known pictured choices');
  check(t.baskets>=2&&t.baskets<=6&&t.bites>=2&&t.bites<=6&&t.total===t.baskets*t.bites,'bounded frozen harvest quantities');
  check(submitHarvest(s,t.total)&&packHarvest(s),'every known food can be gathered');
  check(s.cafe.stock[food.id]===otherStock[food.id]+t.total&&ingredients.filter(a=>a.id!==food.id).every(a=>s.cafe.stock[a.id]===otherStock[a.id]),'trip supplies only its target jar');
 }
 check(json(s.cafe.current)===waiting,'all eleven gathering routes preserve pending guest');
 for(const food of orchardFoods){const n=s.cafe.stock[food.id];investigateFood(s,food.id);check(!collectFood(s,food.id)&&s.cafe.stock[food.id]===n,'discovery replay cannot replace gathering');}
}
{
 const s=fresh(),food=starterIngredients[0];check(startForage(s,food.id),'search starts');const t=currentForage(s),wrong=t.choices.find(id=>id!==food.id),stock=json(s.cafe.stock);
 check(!chooseForage(s,wrong)&&currentForage(s).stage==='search'&&currentForage(s).searchChoices.length===1,'wrong trail remains search and records play');
 check(!submitHarvest(s,t.total)&&!supportHarvest(s)&&!packHarvest(s)&&json(s.cafe.stock)===stock,'unfound patch cannot be helped into inventory');
 chooseForage(s,food.id);currentForage(s).input='7';check(!submitHarvest(s,7),'wrong number recorded');stepHarvest(s);supportHarvest(s,{reveal:true});
 const saved=json(s.cafe.foraging),r=restoreState(json(s));ensureForage(r);
 check(json(r.cafe.foraging)===saved&&currentForage(r).input==='7'&&currentForage(r).attempts[0]===7,'trip input, wrong answer, search and support survive reload');
 check(currentForage(r).supported&&currentForage(r).revealed&&currentForage(r).steps===1&&currentForage(r).guided&&!currentForage(r).independent,'support permanent; evidence explicitly guided play');
 check(packHarvest(r),'supported harvest can pack without forced numeric answer');
}
{
 const s=fresh();startForage(s,starterIngredients[0].id);const a=currentForage(s).id;currentForage(s).input='11';
 startForage(s,starterIngredients[1].id);const b=currentForage(s).id;
 check(a!==b&&resumeForage(s,a)&&currentForage(s).input==='11'&&currentForage(s).stage==='search','retained unfinished trip resumes without creating or advancing');
 check(resumeForage(s,b)&&s.cafe.foraging.nextTrip===2,'switching retained visits does not consume IDs');
 for(let i=0;i<28;i++)startForage(s,starterIngredients[i%8].id);
 check(s.cafe.foraging.trips.length===24&&s.cafe.foraging.nextTrip===30&&!resumeForage(s,a),'24-trip bound and permanent counter retire expired IDs');
 const stale={id:a,index:0,ingredientId:starterIngredients[0].id,stage:'harvest',baskets:6,bites:6,searchChoices:[starterIngredients[0].id],supported:true};
 s.cafe.foraging.trips.push(stale);s.cafe.foraging.currentId=a;const stock=json(s.cafe.stock);ensureForage(s);
 check(!currentForage(s)&&!packHarvest(s)&&json(s.cafe.stock)===stock,'stale trip cannot award after history expiry');
 startForage(s,starterIngredients[0].id);check(currentForage(s).id==='forage-30','expired IDs are never reused');
}
{
 const s=fresh(),food=starterIngredients[0];s.cafe.stock[food.id]=145;
 check(!startForage(s,food.id)&&s.cafe.foraging.nextTrip===0&&!currentForage(s),'jar above 144 rejects starting without consuming a trip');
 s.cafe.stock[food.id]=144;check(startForage(s,food.id),'144-stock jar may still start one fitting harvest');
}
{
 const s=fresh(),food=starterIngredients[0];find(s,food.id);supportHarvest(s);s.cafe.stock[food.id]=180;
 const t=currentForage(s),id=t.id,n=t.total;check(!packHarvest(s)&&s.cafe.stock[food.id]===180&&currentForage(s).stage==='harvest'&&!currentForage(s).collected&&currentForage(s).error.includes('180'),'overflow refuses waste without consuming the trip');
 s.cafe.stock[food.id]=180-n;check(packHarvest(s)&&s.cafe.stock[food.id]===180&&currentForage(s).id===id,'same retained harvest fits exactly at capacity later');
 const raw=clone(currentForage(s));raw.collected=false;s.cafe.foraging.trips=[raw];ensureForage(s);check(currentForage(s).collected&&!packHarvest(s)&&s.cafe.stock[food.id]===180,'packed stage wins over malformed collected flag');
}
{
 const s=fresh(),food=starterIngredients[0];find(s,food.id);const t=currentForage(s);t.searchChoices=[];t.attempts=[t.total];t.supported=true;ensureForage(s);
 check(currentForage(s).stage==='search'&&!packHarvest(s),'saved harvest without a correct find returns to search');
 const unknown={...clone(t),id:'forage-1',index:1,ingredientId:'star-berry'};s.cafe.foraging.trips.push(unknown);s.cafe.foraging.nextTrip=2;ensureForage(s);check(s.cafe.foraging.trips.length===1,'malformed locked target does not unlock discovery');
 const legacy=json({baseline:s.baseline,practice:s.practice,puzzles:s.puzzles});s.cafe.foraging=[];ensureForage(s);
 check(!currentForage(s)&&s.cafe.foraging.trips.length===0&&json({baseline:s.baseline,practice:s.practice,puzzles:s.puzzles})===legacy,'malformed extension clears safely without touching legacy learning state');
}
{
 const s=fresh(),food=prepare(s);s.cafe.stock[food.id]=127;submitCafeNumber(s,144);const t=find(s,food.id);
 check(t.total>=17&&t.total===18,'small gap gets smallest available sufficient harvest');
 const before=json(s);for(let i=0;i<5;i++){currentForage(s);cafeSummary(s);}check(json(s)===before,'read-only selectors never start trips, gather, or serve');
}
console.log(checks+' gathering, cupboard-plan and inventory checks passed.');
