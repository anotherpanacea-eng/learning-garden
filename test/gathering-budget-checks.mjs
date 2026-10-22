import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gatheringCases,gatheringCase,emptyBasket,basketStatus,adjustBasket,costIdea,checkBasket} from '../dist/gathering-budget-core.mjs';
import {gatheringBudgetPage,gatheringBudgetSession,resetGatheringBudget} from '../dist/gathering-budget-ui.mjs';
import {workshopPage,workshopNotes} from '../dist/workshop-ui.mjs';
import {ensureGarden} from '../dist/garden-core.mjs';

let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;},ok=(a,m)=>{assert.ok(a,m);checks++;};
eq(gatheringCases.length,2);eq(emptyBasket(),[0,0,0,0]);eq(gatheringCase('missing'),null);
for(const c of gatheringCases){
 let vectors=0,working=0;const classes=new Set();
 for(let a=0;a<=c.items[0].stock;a++)for(let b=0;b<=c.items[1].stock;b++)for(let d=0;d<=c.items[2].stock;d++)for(let e=0;e<=c.items[3].stock;e++){
  const counts=[a,b,d,e],s=basketStatus(c,counts);
  const cost=counts.reduce((n,q,i)=>n+q*c.items[i].price,0),have=c.needs.map((_,j)=>counts.reduce((n,q,i)=>n+q*c.items[i].units[j],0));
  eq(s.cost,cost,`${c.id}: cost ${counts}`);eq(s.have,have,`${c.id}: delivered ${counts}`);
  eq(s.budgetFit,cost<=c.limit);eq(s.requestFit,have.every((n,j)=>n>=c.needs[j].minimum));
  eq(s.working,s.budgetFit&&s.requestFit);classes.add(`${s.budgetFit}/${s.requestFit}`);working+=Number(s.working);vectors++;
  for(let i=0;i<4;i++){if(counts[i]===0)eq(adjustBasket(c,counts,c.items[i].id,-1),null);if(counts[i]===c.items[i].stock)eq(adjustBasket(c,counts,c.items[i].id,1),null);}
 }
 eq(vectors,c.id==='welcome-table'?48:90);ok(working>=2);eq([...classes].sort(),['false/false','false/true','true/false','true/true']);
 eq(basketStatus(c,[-1,0,0,0]),null);eq(basketStatus(c,[0,0,0,0,0]),null);
}
const welcome=gatheringCase('welcome-table'),path=gatheringCase('path-gathering');
for(const [c,counts,cost,works] of [
 [welcome,[1,1,1,0],14,true],[welcome,[3,0,1,0],15,true],[welcome,[0,2,1,0],16,true],
 [welcome,[0,2,0,1],17,false],[welcome,[0,1,1,0],11,false],
 [path,[0,2,0,1],17,true],[path,[2,1,0,1],18,true],[path,[0,2,2,0],18,true],
 [path,[4,0,0,1],19,false]
 ]){const s=basketStatus(c,counts);eq(s.cost,cost);eq(s.working,works);}
eq(costIdea('', 'blank'),{valid:true,value:null});eq(costIdea('99','unsure'),{valid:true,value:null});
eq(costIdea('00'),{valid:true,value:0});eq(costIdea('99'),{valid:true,value:99});
for(const raw of ['１２','-1','1.5','100','a',' 4'])eq(costIdea(raw).valid,false,`invalid idea ${raw}`);
const fit=checkBasket(welcome,[1,1,1,0],'14','number');eq(fit.working,true);eq(fit.ideaFit,true);
eq(checkBasket(welcome,[1,1,1,0],'13','number').ideaFit,false);eq(checkBasket(welcome,[1,1,1,0],'bad','number'),null);
eq(checkBasket(welcome,[1,1,1,0],'','number').ideaFit,null);
resetGatheringBudget();const state={garden:{},workshop:{experiments:[{id:'original',pending:{phase:0}}]},cafe:{orders:[{id:'waiting'}]}};ensureGarden(state);const before=structuredClone(state);
const chooser=workshopPage(state,'budget','explorer-a');ok(chooser.includes('Choose a gathering request'));ok(chooser.includes('welcome-table')&&chooser.includes('path-gathering'));
eq(gatheringBudgetSession(),null);eq(state,before,'rendering creates no saved work');
ok(workshopPage(state).includes('href="#workshop/budget"'));ok(!workshopNotes(state).includes('Gathering Budget'));
const app=readFileSync(new URL('../dist/app.mjs',import.meta.url),'utf8'),ui=readFileSync(new URL('../dist/gathering-budget-ui.mjs',import.meta.url),'utf8');
ok(app.includes('resetGatheringBudget()')&&app.includes("slug==='recut'||slug==='budget'?workshopPage"),'host reset/route contract');
ok(!ui.includes('save(')&&!ui.includes('localStorage'),'table is transient');
eq(gatheringBudgetPage('explorer-b').includes('Choose a gathering request'),true);
console.log(`Gathering Budget: ${checks} assertions passed.`);
