import assert from 'node:assert/strict';
import {renderCafe,cafeNotes} from '../dist/cafe-ui.mjs';
import {freshState,restoreState} from '../dist/core.mjs';
import {ingredients,starterIngredients,orchardFoods,guests,wishes} from '../dist/cafe-content.mjs';
import {ensureCafe,orderFor,currentRecipe,cafeSummary,nextGuest,adjustBite,checkPlate,submitCafeNumber,supportCafe,skipCafeStage,serveCafe,skipGuest,availableIngredients} from '../dist/cafe-core.mjs';
import {startForage,chooseForage,plotId,currentForage,submitHarvest,packHarvest} from '../dist/forage-core.mjs';
import {ensureBroad,noteLegacyExposure} from '../dist/broad-core.mjs';
import {ensureGarden,startVisit,storyDraft,finishStoryNode,noteGardenFactExposure} from '../dist/garden-core.mjs';
let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const fresh=(seed=192)=>{const s=freshState();ensureCafe(s);s.cafe.seed=seed;s.cafe.range='small';nextGuest(s);return s;};
function fill(s){const c=s.cafe,o=orderFor(c);const one=ingredients.find(i=>o.wanted.every(p=>i.properties.includes(p)));for(let i=0;i<o.bites;i++)adjustBite(s,one.id,1);return one;}
const snapshot=x=>JSON.stringify(x);
function gather(s){for(const item of currentRecipe(s.cafe))while(s.cafe.stock[item.ingredient.id]<item.required){assert.ok(startForage(s,item.ingredient.id));assert.ok(chooseForage(s,plotId(currentForage(s).hunt.row,currentForage(s).hunt.column)));const t=currentForage(s);assert.ok(submitHarvest(s,t.total));assert.ok(packHarvest(s));}}
function serveWithSupplies(s){gather(s);return serveCafe(s);}
check(guests.length===12&&starterIngredients.length===8&&orchardFoods.length===3&&ingredients.length===11&&wishes.length>=8,'bounded authored variety');
for(const w of wishes){check(w.length===2&&ingredients.filter(a=>w.every(p=>a.properties.includes(p))).length>=2,'each wish pair has multiple fitting ingredients');}
for(let seed=1;seed<=12;seed++){
 const s=fresh(seed);let previous;const guestIds=new Set(),requests=new Set(),totals=new Set();
 for(let i=0;i<24;i++){
  const c=s.cafe,o=orderFor(c);guestIds.add(o.guest.id);requests.add(o.wanted.join(','));totals.add(o.total);
  check(!previous||o.guest.id!==previous.guest.id&&o.wanted.join()!==previous.wanted.join(),'next guest and wishes change');previous=o;
  const jar=fill(s);check(cafeSummary(s).valid&&checkPlate(s),'valid repeated-ingredient plate');
  check(!adjustBite(s,jar.id,-1),'plate fixed after acceptance');check(!submitCafeNumber(s,o.total+1)&&submitCafeNumber(s,o.total),'table multiplication');
  const sum=cafeSummary(s);check(sum.missing===Math.max(0,o.total-c.stock[jar.id]),'per-jar shortfall');
  check(submitCafeNumber(s,sum.missing),'shortfall including zero');gather(s);const stockBefore={...c.stock};
  check(serveCafe(s)&&c.stock[jar.id]===stockBefore[jar.id]-o.total,'consume actual gathered stock');
  check(ingredients.every(a=>c.stock[a.id]>=0&&c.stock[a.id]<=180),'stock never negative');
  const after=snapshot(c.stock),served=c.served;check(!serveCafe(s)&&snapshot(c.stock)===after&&c.served===served,'serve idempotent');
  const r=restoreState(JSON.stringify(s));ensureCafe(r);check(r.cafe.current.stage==='served'&&!serveCafe(r)&&snapshot(r.cafe.stock)===after,'served reload never spends again');
  nextGuest(s);
 }
 check(guestIds.size===guests.length&&requests.size===wishes.length&&totals.size>=4,'sequence varies cast, wishes and quantities');
 check(s.cafe.history.length===24&&s.cafe.served===24,'bounded history and total count');
}
{
 const s=fresh();const c=s.cafe,o=orderFor(c);check(!checkPlate(s)&&c.current.stage==='plate','empty plate rejected');
 const a=ingredients.find(i=>i.properties.includes(o.wanted[0])&&!i.properties.includes(o.wanted[1]));
 for(let i=0;i<o.bites;i++)adjustBite(s,a.id,1);check(!checkPlate(s)&&cafeSummary(s).missingProperties.includes(o.wanted[1]),'full plate missing one wish rejected');
 for(let i=0;i<o.bites;i++)adjustBite(s,a.id,-1);
 const b=ingredients.find(i=>i.properties.includes(o.wanted[1])&&!i.properties.includes(o.wanted[0]));
 for(let i=0;i<o.bites-1;i++)adjustBite(s,a.id,1);adjustBite(s,b.id,1);
 check(cafeSummary(s).valid&&checkPlate(s),'properties can come from different ingredients');
 supportCafe(s);s.cafe.current.total.steps=1;submitCafeNumber(s,o.total);const items=currentRecipe(c);
 c.stock[a.id]=1;c.stock[b.id]=0;const required=items.reduce((n,i)=>n+Math.max(0,i.required-c.stock[i.ingredient.id]),0);
 check(cafeSummary(s).missing===required,'shortages summed per ingredient');
 skipCafeStage(s);check(!serveCafe(s),'support cannot create missing inventory');check(serveWithSupplies(s),'supported route serves after gathering');const h=c.history.at(-1);check(h.total.supported&&h.shortfall.skipped&&h.shortfall.supported&&!h.independent,'support and skips separate from performance claims');
}
{
 const s=fresh(),c=s.cafe;const before=snapshot(c.stock),index=c.current.orderIndex;
 adjustBite(s,ingredients[0].id,1);check(skipGuest(s)&&snapshot(c.stock)===before&&c.current.orderIndex===index+1,'guest skip changes no stock');
 check(c.history.at(-1).status==='skipped','whole order skip recorded');
 fill(s);checkPlate(s);skipCafeStage(s);skipCafeStage(s);check(serveWithSupplies(s),'gathering supplies a supported order');
 const seed=c.seed;for(let i=0;i<40;i++){nextGuest(s);skipGuest(s);}check(c.history.length===24&&c.seed===seed,'history bounded during continued play');
}
{
 const s=fresh();fill(s);checkPlate(s);s.cafe.current.total.input='7';submitCafeNumber(s,7);supportCafe(s);const before=snapshot(s.cafe);
 const r=restoreState(JSON.stringify(s));ensureCafe(r);check(snapshot(r.cafe)===before,'active recipe input attempts support survive reload');
 const legacy=snapshot({baseline:r.baseline,practice:r.practice,puzzles:r.puzzles});
 for(const bad of [[],null,{version:1,stock:[],current:[]},{version:1,seed:1,nextOrder:1,current:{orderIndex:0,stage:'stock',recipe:[],total:[],shortfall:[]}}]){r.cafe=bad;ensureCafe(r);check(snapshot({baseline:r.baseline,practice:r.practice,puzzles:r.puzzles})===legacy,'malformed extension leaves legacy intact');}
 const z=fresh();fill(z);checkPlate(z);skipCafeStage(z);skipCafeStage(z);serveWithSupplies(z);const spent=snapshot(z.cafe.stock);z.cafe.current.stage='stock';z.cafe.nextOrder='broken';z.cafe.current.recipe=[];ensureCafe(z);
 check(z.cafe.current.stage==='served'&&z.cafe.current.recovered&&!serveCafe(z)&&snapshot(z.cafe.stock)===spent,'served marker beats corrupt cursor/stage/recipe');
 z.cafe.current.orderIndex='bad';z.cafe.current.stage='served';ensureCafe(z);check(z.cafe.current.stage==='served'&&z.cafe.current.recovered&&!serveCafe(z)&&snapshot(z.cafe.stock)===spent,'served marker with invalid order index stays retired');
 nextGuest(z);check(z.cafe.current.orderIndex===1,'corrupt saved next counter cannot replay spent index');
}
{
 const s=fresh();fill(s);checkPlate(s);skipCafeStage(s);skipCafeStage(s);const stale=JSON.parse(JSON.stringify(s.cafe.current));serveWithSupplies(s);
 for(let i=0;i<26;i++){nextGuest(s);fill(s);checkPlate(s);skipCafeStage(s);skipCafeStage(s);serveWithSupplies(s);}
 const before=snapshot(s.cafe.stock),served=s.cafe.served;s.cafe.current=stale;ensureCafe(s);
 check(s.cafe.current.stage==='served'&&s.cafe.current.recovered&&!serveCafe(s)&&snapshot(s.cafe.stock)===before&&s.cafe.served===served,'stale spent cursor closed even after history expires');
}
{
 const s=fresh();ensureBroad(s);ensureGarden(s);startVisit(s,'message');storyDraft(s);finishStoryNode(s,true);const d=storyDraft(s);
 noteLegacyExposure(s,[4,3]);noteGardenFactExposure(s,[4,3]);check(d.knownFact&&s.broad.seenFacts.includes('3x4'),'commuted game fact marks paused story');
 check(!submitCafeNumber(s,NaN)&&!submitCafeNumber(s,-1)&&!adjustBite(s,'bad',1),'invalid numeric/action inputs rejected');
 check(!cafeSummary(s).valid&&!serveCafe(s),'cannot serve unchecked plate');
}
{
 const s=fresh();const before=snapshot(s.cafe);check(renderCafe(s).includes('What will go together?')&&snapshot(s.cafe)===before,'rendering never starts or changes an order');
 fill(s);checkPlate(s);s.cafe.current.total.input='<script>';const html=renderCafe(s);check(!html.includes('value="<script>"')&&html.includes('&lt;script&gt;'),'stored input rendered safely');
 skipCafeStage(s);skipCafeStage(s);serveWithSupplies(s);const done=snapshot(s.cafe);check(renderCafe(s).includes('Invite the next guest')&&cafeNotes(s).includes('All café play is practice')&&snapshot(s.cafe)===done,'response and practice notes are read only');
}
console.log(`${checks} replayable café checks passed.`);
