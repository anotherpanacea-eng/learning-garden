import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ingredients,starterIngredients,orchardFoods} from '../dist/cafe-content.mjs';
import {ensureCafe,nextGuest,orderFor,adjustBite,checkPlate,cafeSummary,submitCafeNumber,skipCafeStage,serveCafe,availableIngredients,investigateFood,collectFood} from '../dist/cafe-core.mjs';
import {ensureForage,startForage,chooseForage,plotId,huntClue,huntPlots,supportForageSearch,submitHarvest,supportHarvest,stepHarvest,packHarvest,currentForage,resumeForage} from '../dist/forage-core.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const json=x=>JSON.stringify(x),clone=x=>JSON.parse(json(x));
function fresh(seed=143){const s=freshState();ensureCafe(s);s.cafe.seed=seed;nextGuest(s);ensureForage(s);return s;}
function foodFor(s){return availableIngredients(s.cafe).find(a=>orderFor(s.cafe).wanted.every(p=>a.properties.includes(p)));}
function prepare(s){const food=foodFor(s),o=orderFor(s.cafe);for(let i=0;i<o.bites;i++)adjustBite(s,food.id,1);check(checkPlate(s),'plate fits');return food;}
const targetPlot=t=>plotId(t.hunt.row,t.hunt.column);
function find(s,id){check(startForage(s,id),'explicit known-food trip starts');check(chooseForage(s,targetPlot(currentForage(s))),'target found');return currentForage(s);}
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
 const s=fresh(),food=starterIngredients[0];check(startForage(s,food.id),'search starts');const t=currentForage(s),wrong=huntPlots(t).find(p=>p.ingredientId!==food.id).id,stock=json(s.cafe.stock);
 check(!chooseForage(s,wrong)&&currentForage(s).stage==='search'&&currentForage(s).searchChoices.length===1,'wrong trail remains search and records play');
 check(!submitHarvest(s,t.total)&&!supportHarvest(s)&&!packHarvest(s)&&json(s.cafe.stock)===stock,'unfound patch cannot be helped into inventory');
 chooseForage(s,targetPlot(currentForage(s)));currentForage(s).input='7';check(!submitHarvest(s,7),'wrong number recorded');stepHarvest(s);supportHarvest(s,{reveal:true});
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
{
 const s=fresh(19),coordinates=new Set(),operations=new Set(),food=starterIngredients[0];
 for(let index=0;index<16;index++){
  check(startForage(s,food.id),'new map starts explicitly');const t=currentForage(s),cell=(19+index*5)%16;
  check(t.searchKind==='map-v1'&&t.hunt.version===1&&t.hunt.row===1+Math.floor(cell/4)&&t.hunt.column===1+cell%4,'frozen coordinate follows full deterministic cycle');
  coordinates.add(targetPlot(t));const plots=huntPlots(t);
  check(plots.length===16&&plots[0].id==='r4-c1'&&plots[15].id==='r1-c4'&&new Set(plots.map(p=>p.id)).size===16,'map lists top row first and columns left to right');
  check(plots.filter(p=>p.ingredientId===food.id).length===1&&plots.find(p=>p.id===targetPlot(t)).ingredientId===food.id&&plots.filter(p=>p.ingredientId!==food.id).every(p=>t.choices.includes(p.ingredientId)),'wanted food occurs only at target; frozen choices supply decoys');
  for(const axis of ['row','column']){
   const clue=huntClue(t,axis);operations.add(clue.op);
   check(clue.answer===t.hunt[axis]&&(clue.op==='+'?clue.a+clue.b:clue.a-clue.b)===clue.answer,'each clue evaluates to its coordinate');
   check(Number.isInteger(clue.a)&&Number.isInteger(clue.b)&&clue.a>=0&&clue.a<=7&&clue.b>0&&clue.b<=7&&(clue.answer===1||clue.a>0),'small clue operands are nonnegative and meaningful');
  }
 }
 check(coordinates.size===16&&operations.size===2,'all sixteen targets and both operations occur');
 check(plotId(0,1)===null&&plotId(1,5)===null&&huntClue(currentForage(s),'diagonal')===null,'invalid coordinate/clue requests rejected');
}
{
 const s=fresh(7),food=starterIngredients[1];startForage(s,food.id);const t=currentForage(s),target=targetPlot(t),wrong=huntPlots(t).find(p=>p.id!==target),stock=json(s.cafe.stock),waiting=json(s.cafe.current);
 check(!chooseForage(s,food.id)&&!chooseForage(s,'r0-c1')&&!chooseForage(s,'r1-c5'),'new map rejects named-food matching and invalid plots');
 check(!chooseForage(s,wrong.id)&&currentForage(s).hunt.inspected.includes(wrong.id)&&currentForage(s).searchChoices.at(-1)===wrong.ingredientId,'wrong inspection records both location and observed food');
 const once=json(currentForage(s));check(!chooseForage(s,wrong.id)&&json(currentForage(s))===once,'repeated wrong inspection creates no duplicate record or advancement');
 check(supportForageSearch(s)&&currentForage(s).hunt.supported&&!currentForage(s).supported&&!currentForage(s).revealed,'map help retained separately from harvest support');
 check(!packHarvest(s)&&json(s.cafe.stock)===stock,'map help never creates stock');
 const before={clues:['row','column'].map(axis=>huntClue(currentForage(s),axis)),plots:huntPlots(currentForage(s)),hunt:clone(currentForage(s).hunt),choices:[...currentForage(s).choices]};
 s.cafe.seed=888;const r=restoreState(json(s));ensureForage(r);
 check(json({clues:['row','column'].map(axis=>huntClue(currentForage(r),axis)),plots:huntPlots(currentForage(r)),hunt:currentForage(r).hunt,choices:currentForage(r).choices})===json(before),'seed change/reload cannot reroll clues, target, decoys, or revealed plot');
 check(chooseForage(r,target)&&currentForage(r).stage==='harvest'&&currentForage(r).hunt.inspected.includes(target)&&currentForage(r).searchChoices.at(-1)===food.id,'only actual target inspection opens harvest');
 check(!packHarvest(r)&&!currentForage(r).supported&&json(r.cafe.stock)===stock,'map help alone does not permit packing even after target is found');
 check(submitHarvest(r,currentForage(r).total)&&packHarvest(r)&&!packHarvest(r),'quantity answer packs exactly once after map find');
 check(json(r.cafe.current)===waiting,'map/help/harvest leave waiting guest untouched');
}
{
 const s=fresh(),food=starterIngredients[0];startForage(s,food.id);const original=clone(currentForage(s)),stock=json(s.cafe.stock);
 const badHunts=[undefined,null,[],{}, {...original.hunt,version:2},{...original.hunt,row:0},{...original.hunt,column:5},{...original.hunt,inspected:null}];
 for(const hunt of badHunts){
  const candidate={...clone(original),hunt,stage:'harvest',searchChoices:[food.id],supported:true};if(hunt===undefined)delete candidate.hunt;
  s.cafe.foraging={version:1,nextTrip:1,currentId:original.id,trips:[candidate]};ensureForage(s);
  check(!currentForage(s)&&s.cafe.foraging.nextTrip===1&&!packHarvest(s)&&json(s.cafe.stock)===stock,'missing/invalid marked map retires without legacy downgrade or stock');
 }
 for(const marker of ['map-v2','',null,7]){
  s.cafe.foraging={version:1,nextTrip:1,currentId:original.id,trips:[{...clone(original),searchKind:marker}]};ensureForage(s);
  check(!currentForage(s)&&!chooseForage(s,food.id),'unknown search marker never becomes legacy');
 }
 const noMarker=clone(original);delete noMarker.searchKind;s.cafe.foraging={version:1,nextTrip:1,currentId:original.id,trips:[noMarker]};ensureForage(s);
 check(!currentForage(s),'hunt payload without format marker is not legacy');
 const badChoices={...clone(original),choices:[]};s.cafe.foraging={version:1,nextTrip:1,currentId:original.id,trips:[badChoices]};ensureForage(s);
 check(!currentForage(s),'broken frozen map decoys retire instead of rerolling');
}
{
 const s=fresh(),food=starterIngredients[0];find(s,food.id);let t=currentForage(s),target=targetPlot(t);t.searchChoices=[];t.attempts=[t.total];t.supported=true;ensureForage(s);t=currentForage(s);
 check(t.stage==='search'&&!t.hunt.inspected.includes(target)&&!huntPlots(t).find(p=>p.id===target).inspected&&!packHarvest(s),'lost food observation clears target inspection so it can be inspected again');
 check(chooseForage(s,target)&&packHarvest(s),'reinspection can recover supported harvest without trapping the player');
 startForage(s,starterIngredients[1].id);t=currentForage(s);t.stage='harvest';t.searchChoices=[t.ingredientId];t.hunt.inspected=[];t.supported=true;ensureForage(s);
 check(currentForage(s).stage==='search'&&!packHarvest(s),'food observation alone does not prove map inspection');
 const wrongIds=huntPlots(currentForage(s)).filter(p=>p.id!==targetPlot(currentForage(s))).map(p=>p.id);
 currentForage(s).hunt.inspected=[...wrongIds,...wrongIds,'r5-c1',null,{},'r1-c0'];ensureForage(s);
 check(currentForage(s).hunt.inspected.length===15&&new Set(currentForage(s).hunt.inspected).size===15,'inspected coordinates normalized to valid unique sixteen-cell bound');
}
{
 const s=fresh(),food=starterIngredients[0];startForage(s,food.id);const old=currentForage(s);delete old.searchKind;delete old.hunt;
 const wrong=old.choices.find(id=>id!==food.id);ensureForage(s);
 check(!currentForage(s).searchKind&&!currentForage(s).hunt&&huntPlots(currentForage(s)).length===0&&huntClue(currentForage(s),'row')===null,'old matching trip remains original format');
 check(!supportForageSearch(s)&&!chooseForage(s,wrong)&&currentForage(s).stage==='search','old search preserves wrong-choice matching and has no map helper');
 check(chooseForage(s,food.id)&&currentForage(s).stage==='harvest','old named target still opens harvest');
 const saved=json(s.cafe.foraging),r=restoreState(json(s));ensureForage(r);check(json(r.cafe.foraging)===saved,'old found harvest restores unchanged');
 check(submitHarvest(r,currentForage(r).total)&&packHarvest(r)&&!packHarvest(r),'old harvest still packs once');
 startForage(s,starterIngredients[1].id);const recovery=currentForage(s);delete recovery.searchKind;delete recovery.hunt;recovery.stage='harvest';recovery.searchChoices=[];recovery.supported=true;ensureForage(s);
 check(currentForage(s).stage==='search'&&!packHarvest(s)&&chooseForage(s,recovery.ingredientId),'old malformed found state safely returns to matching search');
}
{
 const s=fresh(),food=starterIngredients[0];for(let i=0;i<30;i++){startForage(s,food.id);const t=currentForage(s),wrong=huntPlots(t).find(p=>p.id!==targetPlot(t));chooseForage(s,wrong.id);supportForageSearch(s);}
 const r=restoreState(json(s));ensureForage(r);
 check(r.cafe.foraging.trips.length===24&&r.cafe.foraging.nextTrip===30&&r.cafe.foraging.trips.every(t=>t.hunt.inspected.length===1&&t.searchChoices.length===1&&t.hunt.supported&&!t.supported&&t.guided),'bounded notebook records keep map locations/help and observed foods separate from harvest evidence');
}
console.log(checks+' gathering, map-hunt, cupboard-plan and inventory checks passed.');
