import assert from 'node:assert/strict';
import {copyFrameCases} from '../dist/copy-frame-content.mjs';
import {createCopyFrame,copyFrameModel,changeCopySide,turnCopyFrame,resetCopyMaterial,copyFrameReading,copyFrameExample,copyFactorText,copyLength,copyArea} from '../dist/copy-frame-core.mjs';
import {copyFramePage,resetCopyFrame} from '../dist/copy-frame-ui.mjs';
let checks=0,states=0;
const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
const ok=(v,m)=>{checks++;assert.ok(v,m);};
// Independent oracle: sort rectangle sides before comparing aspect ratios.
const shape=(w,h,a,b)=>Math.min(w,h)*Math.max(a,b)===Math.max(w,h)*Math.min(a,b);
const independentFraction=(n,d)=>{for(let q=Math.min(n,d);q>1;q--)if(n%q===0&&d%q===0){n/=q;d/=q;break;}return d===1?String(n):`${n}/${d}`;};
const cases=[['small-panel',2,3,2,1,8,2],['long-panel',3,5,2,1,4,2],['half-panel',4,6,1,2,8,2],['square-panel',3,3,2,1,12,1],['small-square',6,6,1,2,12,1],['triple-panel',3,4,3,1,6,2]];
eq(copyFrameCases.map(c=>c.id),cases.map(c=>c[0]));
let similarTotal=0,requestedTotal=0;
for(const [id,a,b,tn,td,similarCount,goalCount] of cases){
 const c=copyFrameCases.find(c=>c.id===id);eq([c.width,c.height,c.factor.n,c.factor.d],[a,b,tn,td]);eq(createCopyFrame(id),{caseId:id,width:a,height:b});
 let similar=0,goals=0,sameSize=0;
 for(let w=1;w<=12;w++)for(let h=1;h<=12;h++){
  states++;const state={caseId:id,width:w,height:h},before=structuredClone(state),m=copyFrameModel(state),fits=shape(w,h,a,b);
  ok(m);eq(m.area,w*h);eq(m.originalArea,a*b);eq(!!m.matching,fits);eq(m.areaFactor.n*a*b,m.areaFactor.d*w*h);
  const expectedCorrespondence=fits?(Math.sign(w-h)===Math.sign(a-b)?'direct':'turned'):null;
  eq(m.matching,expectedCorrespondence,'independent shorter/longer role determines correspondence');
  const expectedGoal=fits&&Math.min(w,h)*td===Math.min(a,b)*tn;eq(m.goal,expectedGoal);
  if(fits){similar++;similarTotal++;eq(m.scale.n*Math.min(a,b),Math.min(w,h)*m.scale.d);eq(m.areaFactor.n*m.scale.d*m.scale.d,m.areaFactor.d*m.scale.n*m.scale.n);if(w*h===a*b)sameSize++;const k=independentFraction(Math.min(w,h),Math.min(a,b)),area=independentFraction(w*h,a*b);ok(copyFrameReading(state).includes(`The area factor is ${k} × ${k} = ${area}.`),'every similar pair receives its exact length-squared area equation');}
  else eq(m.scale,null);
  if(expectedGoal){goals++;requestedTotal++;ok(copyFrameReading(state).includes('requested factor'));}
  eq(m.cells.length,w*h);const occupied=new Set();
  for(const cell of m.cells){ok(cell.x>=0&&cell.y>=0&&cell.x<w&&cell.y<h);eq([cell.width,cell.height],[1,1]);occupied.add(`${cell.x},${cell.y}`);}eq(occupied.size,w*h,'unit cells are a disjoint full cover');
  for(const side of ['width','height'])for(const step of [-1,1]){
   const next=changeCopySide(state,side,step),value=state[side]+step;
   if(value>=1&&value<=12){ok(next);eq(next[side],value);eq(next[side==='width'?'height':'width'],state[side==='width'?'height':'width']);eq(changeCopySide(next,side,-step),state);}
   else eq(next,null);
  }
  const turned=turnCopyFrame(state);eq([turned.width,turned.height],[h,w]);eq(turnCopyFrame(turned),state);eq(copyFrameModel(turned).area,m.area);eq(!!copyFrameModel(turned).matching,fits);eq(copyFrameModel(turned).goal,expectedGoal);
  eq(resetCopyMaterial(state),createCopyFrame(id));eq(state,before,'helpers never mutate prior material');
 }
 eq(similar,similarCount);eq(goals,goalCount);eq(sameSize,a===b?1:2);
}
eq(states,864);eq(similarTotal,50);eq(requestedTotal,10);
// Turned equal shape, same-area different shape, and the square exception.
ok(copyFrameModel({caseId:'small-panel',width:3,height:2}).matching==='turned');ok(copyFrameReading({caseId:'small-panel',width:3,height:2}).includes('Same shape and same size'));
for(const side of [1,2,3,4,6,12]){const m=copyFrameModel({caseId:'square-panel',width:side,height:side});ok(m.matching);ok(copyFrameReading({caseId:'square-panel',width:side,height:side}).includes('added or taken away'));}
ok(!copyFrameModel({caseId:'long-panel',width:6,height:8}).matching,'equal addition to non-square is not scaling');
for(let i=0;i<4;i++){const m=copyFrameExample(i);eq([m.width,m.height],[[2,3],[2,6],[4,6],[3,4]][i]);eq([m.originalWidth,m.originalHeight],[2,3]);eq(m.displayIndex,i+1);eq(changeCopySide(m,'width',1),null);eq(turnCopyFrame(m),null);eq(resetCopyMaterial(m),null);}
const ex=copyFrameExample(2),cells=new Set();eq(ex.panels.length,4);
for(const p of ex.panels){eq([p.width,p.height],[2,3]);for(let x=p.x;x<p.x+p.width;x++)for(let y=p.y;y<p.y+p.height;y++){ok(x>=0&&y>=0&&x<4&&y<6);const key=`${x},${y}`;ok(!cells.has(key),'original-sized panels never overlap');cells.add(key);}}eq(cells.size,24);
eq(copyFrameExample(1).area,copyFrameExample(3).area);ok(!shape(copyFrameExample(1).width,copyFrameExample(1).height,copyFrameExample(3).width,copyFrameExample(3).height),'authored same-area contrast really has different shapes');
for(const invalid of [null,{},createCopyFrame('missing'),{caseId:'small-panel',width:0,height:3},{caseId:'small-panel',width:13,height:3},{caseId:'small-panel',width:2.5,height:3},{caseId:'small-panel',width:'2',height:3}])eq(copyFrameModel(invalid),null);
eq(changeCopySide(createCopyFrame('small-panel'),'depth',1),null);eq(changeCopySide(createCopyFrame('small-panel'),'width',2),null);eq(copyFrameExample(-1),null);eq(copyFrameExample(4),null);eq(copyLength(1),'1 length unit');eq(copyArea(1),'1 square unit');eq(copyFactorText({n:1,d:2}),'1/2');
const inaccessible=new Proxy(Object.freeze({}),{get(){throw new Error('Notebook read');},set(){throw new Error('Notebook write');}});resetCopyFrame();const html=copyFramePage(inaccessible,'synthetic-explorer');ok(html.includes('data-cframe-root'));ok(!html.includes('cframe-comparison'));ok(!html.includes('requested factor 2'));resetCopyFrame();
console.log(`Copy Frame: ${checks} checks over ${states} dimension states; ${similarTotal} similar and ${requestedTotal} requested copies.`);
