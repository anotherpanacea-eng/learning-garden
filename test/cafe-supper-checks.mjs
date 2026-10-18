import assert from 'node:assert/strict';
import {freshState,restoreState} from '../dist/core.mjs';
import {ensureCafe,cafeSupper,beginCafePlus,nextGuest,orderFor,adjustBite,checkPlate,skipCafeStage,serveCafe,skipGuest,currentRecipe,reviseCafePlate} from '../dist/cafe-core.mjs';
import {ingredients,cafeSuppers} from '../dist/cafe-content.mjs';
import {renderCafe,cafeNotes} from '../dist/cafe-ui.mjs';
import {startForage,chooseForage,plotId,currentForage,submitHarvest,packHarvest} from '../dist/forage-core.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const json=JSON.stringify,fresh=()=>{const s=freshState();ensureCafe(s);s.cafe.seed=192;s.cafe.range='small';return s;};
function prepare(s){
 if(!s.cafe.current||s.cafe.current.stage==='served')nextGuest(s);
 const o=orderFor(s.cafe),food=ingredients.find(a=>!a.orchard&&o.wanted.every(p=>a.properties.includes(p)));
 for(let i=0;i<o.bites;i++)adjustBite(s,food.id,1);
 check(checkPlate(s)&&skipCafeStage(s)&&skipCafeStage(s),'assisted plate and arithmetic reach stock');
 for(const item of currentRecipe(s.cafe))while(s.cafe.stock[item.ingredient.id]<item.required){startForage(s,item.ingredient.id);chooseForage(s,plotId(currentForage(s).hunt.row,currentForage(s).hunt.column));submitHarvest(s,currentForage(s).total);packHarvest(s);}
}
{
 const s=fresh();check(cafeSupper(s.cafe).progress===0&&!beginCafePlus(s),'new café starts before its goal');
 const initial=json(s);renderCafe(s);cafeNotes(s);check(json(s)===initial,'goal rendering does not mutate state, counters, or stock');
 nextGuest(s);check(!serveCafe(s)&&cafeSupper(s.cafe).progress===0,'invalid service cannot light a lantern');
 skipGuest(s);check(cafeSupper(s.cafe).progress===0,'waiting guest does not count as served');
 for(let n=1;n<=6;n++){
  prepare(s);const before=s.cafe.served;check(cafeSupper(s.cafe).progress===n-1,'preparing or gathering does not advance the goal');
  check(serveCafe(s)&&s.cafe.served===before+1,'actual service counts exactly once');
  const stock=json(s.cafe.stock);check(!serveCafe(s)&&json(s.cafe.stock)===stock&&cafeSupper(s.cafe).progress===n,'duplicate serving cannot spend stock or count twice');
  check(cafeSupper(s.cafe).complete===(n===6),'only sixth served table completes supper');
 }
 check(renderCafe(s).includes('You did it!')&&renderCafe(s).includes('New Game Plus: another gathering')&&renderCafe(s).includes('Keep serving'),'win, New Game Plus and endless continuation are visible');
 check(s.cafe.history.filter(r=>r.status==='served').every(r=>r.total.supported&&r.total.skipped&&r.shortfall.supported&&r.shortfall.skipped),'supported service records retain support');
 const r=restoreState(json(s));ensureCafe(r);check(cafeSupper(r.cafe).complete&&r.cafe.served===6,'win survives export/restore');
 const stock=json(r.cafe.stock),history=json(r.cafe.history),discoveries=json(r.cafe.discoveries),seed=r.cafe.seed,index=r.cafe.nextOrder;
 check(beginCafePlus(r)&&r.cafe.supper.round===2&&r.cafe.supper.startedAtServed===6&&cafeSupper(r.cafe).progress===0,'New Game Plus starts another goal');
 check(r.cafe.current.stage==='plate'&&r.cafe.nextOrder===index+1,'explicit New Game Plus invites a next guest from served screen');
 const after=json(r);check(!beginCafePlus(r)&&json(r)===after,'repeated New Game Plus cannot advance twice');
 check(json(r.cafe.stock)===stock&&json(r.cafe.history)===history&&json(r.cafe.discoveries)===discoveries&&r.cafe.seed===seed,'New Game Plus retains supplies, records, discoveries and seed');
 check(cafeNotes(r).includes('New Game Plus 1')&&renderCafe(r).includes('A moonlight picnic'),'new round visible in play and notes');
}
for(const stage of ['plate','total','stock']){
 const s=fresh();s.cafe.served=42;nextGuest(s);
 if(stage!=='plate'){
  const o=orderFor(s.cafe),food=ingredients.find(a=>!a.orchard&&o.wanted.every(p=>a.properties.includes(p)));for(let i=0;i<o.bites;i++)adjustBite(s,food.id,1);checkPlate(s);
  if(stage==='stock')skipCafeStage(s);
 }
 s.cafe.current.total.input='17';const order=json(s.cafe.current),stock=json(s.cafe.stock),next=s.cafe.nextOrder;
 check(beginCafePlus(s)&&s.cafe.supper.startedAtServed===42,'earlier service credits first win and next goal starts now');
 check(json(s.cafe.current)===order&&json(s.cafe.stock)===stock&&s.cafe.nextOrder===next,`New Game Plus preserves waiting ${stage} exactly`);
 const r=restoreState(json(s));ensureCafe(r);check(json(r.cafe.current)===order&&cafeSupper(r.cafe).round===2&&cafeSupper(r.cafe).progress===0,'waiting order and new baseline restore');
 if(stage==='total')check(reviseCafePlate(r),'plate revision remains available in New Game Plus');
}
{
 const s=fresh();s.cafe.served=19;delete s.cafe.supper;ensureCafe(s);
 check(cafeSupper(s.cafe).complete&&s.cafe.supper.round===1,'legacy saved service credited to first supper');
 const stock=json(s.cafe.stock);check(beginCafePlus(s)&&s.cafe.supper.round===2&&s.cafe.supper.startedAtServed===19,'legacy counter does not require immediately completing many rounds');
 check(s.cafe.current.stage==='plate'&&json(s.cafe.stock)===stock,'resting legacy café invites without free supplies');
 prepare(s);serveCafe(s);check(cafeSupper(s.cafe).progress===1,'next service after baseline counts toward new goal');
}
for(const bad of [null,[],{},false,{round:0,startedAtServed:0},{round:2,startedAtServed:0},{round:1,startedAtServed:6},{round:2,startedAtServed:99},{round:1.5,startedAtServed:0},{round:Infinity,startedAtServed:0},{round:200000000,startedAtServed:6},{round:2,startedAtServed:NaN}]){
 const s=fresh();s.cafe.served=12;nextGuest(s);s.cafe.current.total.input='8';const order=json(s.cafe.current),stock=json(s.cafe.stock);s.cafe.supper=bad;ensureCafe(s);
 check(json(s.cafe.supper)==='{"round":1,"startedAtServed":0}'&&json(s.cafe.current)===order&&json(s.cafe.stock)===stock,'malformed supper field recovers without resetting real progress');
}
{
 const s=fresh(),colors=new Set();
 for(let n=1;n<=100;n++){
  colors.add(cafeSupper(s.cafe).theme.color);s.cafe.served=s.cafe.supper.startedAtServed+6;
  check(cafeSupper(s.cafe).complete&&beginCafePlus(s)&&s.cafe.supper.round===n+1&&!cafeSupper(s.cafe).complete,'many completed rounds continue without raising the six-table goal');
 }
 check(colors.size===cafeSuppers.length&&s.cafe.range==='small','all four visual themes repeat while number range stays chosen');
 s.cafe.served=1000000000;s.cafe.supper={round:166666667,startedAtServed:999999996};ensureCafe(s);
 check(cafeSupper(s.cafe).progress===4&&!beginCafePlus(s),'largest valid chapter arithmetic remains bounded');
}
{
 const s=fresh();for(let i=0;i<7;i++){prepare(s);serveCafe(s);}
 check(cafeSupper(s.cafe).complete&&s.cafe.served===7&&s.cafe.supper.round===1,'serving continues beyond the ending without New Game Plus');
 const reset=freshState();ensureCafe(reset);check(cafeSupper(reset.cafe).progress===0&&reset.cafe.supper.round===1,'existing reset creates initial goal');
}
console.log(`${checks} café supper, New Game Plus, state and inventory checks passed.`);
