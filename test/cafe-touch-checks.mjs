// Synthetic285 fixtures and public renderer contract; browser checks own interaction.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {freshState} from '../dist/core.mjs';
import {initializeExplorerState} from '../dist/progress-transfer.mjs';
import * as C from '../dist/cafe-core.mjs';
import {renderCafe} from '../dist/cafe-ui.mjs';
export function cafeTouchFixtures(){
 const base=initializeExplorerState(freshState());base.garden.welcomeFilmSeen=true;
 base.cafe.seed=17;base.cafe.range='small';C.nextGuest(base);
 base.cafe.current.params={guestId:'puff',wanted:['crunchy','sweet'],guests:2,bites:2};
 base.cafe.stock['moon-crunch']=3;base.cafe.stock['dew-drop']=0;base.syntheticOther={raw:'Synthetic unrelated root',payload:'x'.repeat(128000)};
 const discovered=structuredClone(base);for(const id of ['star-berry','spiral-pod','wobble-fruit']){C.investigateFood(discovered,id);C.investigateFood(discovered,id);C.collectFood(discovered,id);}
 const overfull=structuredClone(base);overfull.cafe.current.recipe['moon-crunch']=2;overfull.cafe.current.recipe['dew-drop']=2;
 const total=structuredClone(base);C.adjustBite(total,'moon-crunch',1);C.adjustBite(total,'moon-crunch',1);C.checkPlate(total);total.cafe.current.total.input='9';C.submitCafeNumber(total,9);C.supportCafe(total);
 const expanded=structuredClone(base);expanded.cafe.current.params.guests=12;expanded.cafe.current.params.bites=12;
 const completed=structuredClone(base);completed.cafe.served=6;
 return {base,discovered,overfull,total,expanded,completed};
}
// A genuinely finished ribbon task offers 4 groups of 3, distinct from the visible 2 by 2 table.
export async function cafeOfferFixture(){
 const {startPostOffice}=await import('../dist/post-office-core.mjs');
 const {deliveries}=await import('../dist/post-office-content.mjs');
 const {startAdaptiveRival,solveRivalTogether,continueRival}=await import('../dist/post-rival.mjs');
 const {connectionFrom}=await import('../dist/learning-connection-data.mjs');
 const s=cafeTouchFixtures().base;startPostOffice(s,deliveries[0].id);
 startAdaptiveRival(s,false,connectionFrom('living',1,'direct',4,3,'supported'));
 solveRivalTogether(s);continueRival(s);
 s.baseline.draft={questionId:'groups',attempts:[],exposed:false};return s;
}
export function runCafeTouchChecks(){
 let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;};const f=cafeTouchFixtures();
 for(const [name,s] of Object.entries(f)){
  const before=structuredClone(s),html=renderCafe(s,{touch:true,moreActivities:'<a href="#cafe/portions">Other café bench</a>'});
  assert.deepEqual(s,before,'public render is read-only: '+name);checks++;
  ok(html.includes('data-cafe-touch'),'explicit compact renderer '+name);
  ok(html.includes('More café activities')&&html.includes('#cafe/portions'),'app fragment retained '+name);
  ok(html.includes('Café tools'),'native tools offered '+name);
  ok(!renderCafe(s).includes('data-cafe-touch'),'legacy public call remains fallback '+name);
 }
 const overflow=renderCafe(f.overfull,{touch:true});
 ok((overflow.match(/data-cafe-plate-remove=/g)||[]).length===4,'all four accepted units removable for two requested spaces');
 ok(overflow.includes('data-cafe-plate-remove="dew-drop"'),'overflow ingredient has its own removal identity');
 ok(!renderCafe(f.total,{touch:true}).includes('data-cafe-plate-remove='),'total is read only');
 ok(renderCafe(f.total,{touch:true}).includes('data-cafe-action="revise-plate"'),'total offers explicit revision');
 const done=renderCafe(f.completed,{touch:true});ok(done.includes('Keep serving')&&done.includes('Plan another gathering'),'complete supper offers both continuation actions');
 console.log(`Café touch: ${checks} public renderer assertions passed.`);return checks;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)runCafeTouchChecks();
