import assert from 'node:assert/strict';
import {areas} from '../dist/broad-content.mjs';
import {renderModel,adjustModel,foldGeometry,foldChoices,shapeVertices,modelCaption,broadHome,checkinHub,activityLibrary} from '../dist/broad-ui.mjs';
import {pip,dot,areaScene,objectItems,objectSymbols,itemGlyph,countingGarden} from '../dist/broad-art.mjs';
import {freshState} from '../dist/core.mjs';
import {ensureBroad} from '../dist/broad-core.mjs';
let checks=0;const check=(x,m)=>{assert.ok(x,m);checks++;};
const rendered=(model,active={},mode='checkin')=>renderModel({model},{...active},true,{mode});
for(const [model,computed] of [[{type:'place',hundreds:0,tens:3,ones:4},'34 altogether'],[{type:'array',rows:4,cols:6},'= 24'],[{type:'fraction',parts:4,shaded:1},'1/4'],[{type:'ruler',max:20,start:3,end:11},'8 centimeters long'],[{type:'counters',count:7},'7 seeds'],[{type:'compass',turns:1},'Pip faces east']]){
 const before=rendered(model);check(!before.includes(computed),'computed result hidden in question playground '+model.type);check(before.includes('Show the total'),'reveal control '+model.type);
 check(rendered(model,{modelTotalShown:true}).includes(computed),'explicit reveal '+model.type);
 check(rendered(model,{revealed:true}).includes(computed),'worked solution reveal '+model.type);
 check(rendered(model,{},'activity').includes(computed),'adventure readout '+model.type);
 const x={};adjustModel({model},x,'show-total');check(x.modelTotalShown,'explicit state '+model.type);adjustModel({model},x,'reset');check(x.modelTotalShown,'reset does not erase disclosure '+model.type);
}
const q={model:{type:'fraction',parts:4,shaded:1}},x={};adjustModel(q,x,'fraction-toggle-3');check(x.model.shaded===2&&x.model.shadedPieces.join(',')==='0,3','individual distant piece shaded');adjustModel(q,x,'fraction-toggle-0');check(x.model.shaded===1&&x.model.shadedPieces[0]===3,'individual original piece unshaded');adjustModel(q,x,'parts-remove');check(x.model.shaded===0&&x.model.parts===3,'removed shaded piece updates count');adjustModel(q,x,'shade-add');check(x.model.shaded===1&&x.model.shadedPieces[0]===0,'button uses same shading state');
const fraction=rendered(q.model);check((fraction.match(/fraction-toggle-/g)||[]).length===4,'all pieces keyboard and tap targets');
const array={model:{type:'array',rows:3,cols:4,item:'cup'}},counted={};adjustModel(array,counted,'count-7');check(counted.model.counted[0]===7,'array tap counts a chosen cup');adjustModel(array,counted,'count-7');check(!counted.model.counted.length,'second tap undoes counting');adjustModel(array,counted,'count-2');adjustModel(array,counted,'row-remove');check(!counted.model.counted.length,'changed layout clears counting');check(rendered(array.model).includes('#garden-object-cup'),'story cups shown');
const ruler={model:{type:'ruler',start:3,end:11,max:20}},r={};adjustModel(ruler,r,'ruler-mark-5');check(r.model.start===5&&r.model.end===11,'nearer start moves');adjustModel(ruler,r,'ruler-mark-9');check(r.model.start===5&&r.model.end===9,'nearer end moves');adjustModel(ruler,r,'ruler-mark-7');check(r.model.start===7&&r.model.end===9,'tie moves start without reversing');adjustModel(ruler,r,'ruler-mark-20');check(r.model.start===7&&r.model.end===20,'end can reach last mark');
const compass={model:{type:'compass',turns:0}},c={};for(let i=0;i<4;i++)adjustModel(compass,c,'compass-cw');check(c.model.turns===0,'four clockwise turns return north');adjustModel(compass,c,'compass-ccw');check(c.model.turns===3,'counterclockwise faces west');adjustModel(compass,c,'reset');check(c.model.turns===0,'compass reset returns north');
const area=p=>Math.abs(p.reduce((s,[x,y],i)=>{const q=p[(i+1)%p.length];return s+x*q[1]-q[0]*y;},0)/2);
const inside=(p,poly)=>{const signs=poly.map(([x,y],i)=>{const q=poly[(i+1)%poly.length];return (q[0]-x)*(p[1]-y)-(q[1]-y)*(p[0]-x);});return signs.every(s=>s>=-1e-7)||signs.every(s=>s<=1e-7);};
for(const shape of ['triangle','rectangle','square','hexagon'])for(let turns=0;turns<4;turns++){
 const verts=shapeVertices(shape,turns),choices=foldChoices({shape,turns});check(choices.length===(shape==='hexagon'?6:4),'appropriate fold choices '+shape);
 if(shape==='triangle'){const sides=verts.map((p,i)=>Math.hypot(p[0]-verts[(i+1)%3][0],p[1]-verts[(i+1)%3][1]));check(Math.max(...sides)-Math.min(...sides)<1e-7,'triangle truly equilateral');check(Math.abs(verts.reduce((sum,p)=>sum+p[0],0)/3-100)<1e-7&&Math.abs(verts.reduce((sum,p)=>sum+p[1],0)/3-100)<1e-7,'folds cross centroid');}
 for(let i=0;i<choices.length;i++){
  const f=foldGeometry(shape,turns,choices[i].angle),matches=f.reflected.every(p=>inside(p,f.original));
  check(Math.abs(area(f.source)-area(f.reflected))<1e-7,'reflection conserves half area '+shape+i);
  check(matches===(shape==='square'||shape==='hexagon'||shape==='triangle'&&i<3||shape==='rectangle'&&i<2),'geometric fit '+shape+i+' turn '+turns);
  const a={};adjustModel({model:{type:'shape',shape,turns}},a,`fold-angle-${i}`);const html=rendered(a.model);check(html.includes('broad-fold-outside')&&html.includes('Pink shows any part that misses'),'chosen fold shows reflected half '+shape+i);
 }
 const unmarked=rendered({type:'shape',shape,turns});check(!unmarked.includes('stroke-dasharray')&&!unmarked.includes('broad-fold-outside'),'no fold or solution before choice '+shape);
}
for(const maker of [pip,dot])for(const pose of ['wave','think','point','cheer','puzzled']){
 const decorative=maker(pose),meaningful=maker(pose,false);check(Buffer.byteLength(meaningful)<2048,'pose under 2 KB '+pose);check(decorative.startsWith('<svg')&&decorative.endsWith('</svg>')&&decorative.includes('aria-hidden="true"'),'decorative SVG '+pose);check(meaningful.includes('role="img"')&&meaningful.includes('aria-label='),'meaningful pose has label '+pose);check(!meaningful.includes('gradient'),'flat palette '+pose);
}
const symbols=objectSymbols();check(new Set([...symbols.matchAll(/id="([^"]+)"/g)].map(m=>m[1])).size===objectItems.length,'one symbol per object');for(const item of objectItems)check(symbols.includes(`id="garden-object-${item}"`)&&itemGlyph(item).includes(`#garden-object-${item}`),'glyph resolves '+item);
check(itemGlyph('unknown').includes('#garden-object-seed'),'unknown object safely falls back');
for(const a of areas)check(areaScene(a.id).includes('<svg')&&areaScene(a.id).includes('aria-hidden="true"'),'original area scene '+a.id);
const flowers=countingGarden({selected:[3,1],group:'rows'});check((flowers.match(/data-garden-flower=/g)||[]).length===12,'twelve interactive flowers');check(flowers.includes('You counted 2 flowers.')&&flowers.includes('garden-show-rows'),'count and grouping rendered');check((countingGarden({group:'colors'}).match(/garden-color-group/g)||[]).length===12,'color grouping preserves twelve flowers');
const s=freshState();ensureBroad(s);for(const html of [broadHome(s,null,()=>''),checkinHub(s),activityLibrary(s,null)]){check(!html.includes('🦊')&&!html.includes('🐞'),'creatures use original art');check(!/check-in|assessment|observations/i.test(html),'child copy avoids assessment terms');}
for(const a of areas)for(const q of a.activities)check(modelCaption(q.model).startsWith('Pip'),'each example caption describes current model '+q.id);
console.log(checks+' Number Garden model and art checks passed.');
