import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCrossingAngles,changeCrossingAngles,crossingAnglesModel,captureCrossingPanel,crossingAnglesNarration} from '../dist/crossing-angles-core.mjs';
import {crossingCards,crossingPrompts,crossingCopy} from '../dist/crossing-angles-content.mjs';
import {copyFrameModel} from '../dist/copy-frame-core.mjs';
import {renderCrossingAngles} from '../dist/crossing-angles-ui.mjs';
const close=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-9,`${message}: ${a} vs ${b}`);
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
const initial=createCrossingAngles();
assert.deepEqual(initial,{page:'build',angle:60,rotation:0,pair:'opposite',prompt:0,card:0,step:0});
for(let a=15;a<180;a+=15)for(let r=0;r<360;r+=30)for(const pair of ['opposite','adjacent']){
 const work={...initial,angle:a,rotation:r,pair},g=crossingAnglesModel(work).geometry;
 assert.deepEqual(g.sectors.map(s=>s.measure),[a,180-a,a,180-a]);
 assert.equal(g.sectors.reduce((n,s)=>n+s.measure,0),360);
 assert.deepEqual(g.selectedNames,pair==='opposite'?['AOB','COD']:['AOB','BOC']);
 assert.deepEqual(g.sectors.filter(s=>s.selected).map(s=>s.name),g.selectedNames);
 const vectors=g.rays.map(ray=>sub(ray.end,g.center));
 for(let i=0;i<4;i++){
  const rad=(r+[0,a,180,a+180][i])*Math.PI/180;
  close(vectors[i][0],140*Math.cos(rad),'ray x');close(vectors[i][1],-140*Math.sin(rad),'inverted screen y');
  close(Math.hypot(...vectors[i]),140,'equal ray lengths');
  close(cross(vectors[i],vectors[(i+2)%4]),0,'opposite rays collinear');
  close(dot(vectors[i],vectors[(i+2)%4]),-(140**2),'opposite rays point away');
  const sector=g.sectors[i],bisector=(sector.start+sector.sweep/2)*Math.PI/180;
  close(sector.label[0],320+225*Math.cos(bisector),'label follows actual sector');
  close(sector.label[1],280-225*Math.sin(bisector),'label follows actual sector y');
  assert.equal(sector.right,a===90);
  assert.equal(sector.arcCount,i%2?2:1);
  assert.equal(sector.measure+g.sectors[(i+1)%4].measure,180);
 }
 const turned=crossingAnglesModel(changeCrossingAngles(work,'turn')).geometry;
 assert.deepEqual(turned.sectors.map(s=>s.measure),g.sectors.map(s=>s.measure));
 assert.equal(turned.rotation,(r+30)%360);
}
for(const [a,expected] of [[15,[15,165,15,165]],[60,[60,120,60,120]],[90,[90,90,90,90]],[135,[135,45,135,45]],[165,[165,15,165,15]]])assert.deepEqual(crossingAnglesModel({...initial,angle:a}).geometry.sectors.map(s=>s.measure),expected);
const learn=changeCrossingAngles({...initial,angle:165,rotation:330,pair:'adjacent',prompt:5},'page','learn');
assert.deepEqual(learn,{...initial,page:'learn',angle:165,rotation:330,pair:'adjacent',prompt:5});
for(let card=0;card<4;card++){
 const w=changeCrossingAngles(learn,'card',card),m=crossingAnglesModel(w);
 assert.equal(m.card,crossingCards[card]);
 assert.deepEqual(m.diagrams.map(d=>d.geometry.angle),card<2?[60]:card===2?[60,90]:[]);
 for(const d of m.diagrams)assert.equal(d.geometry.rotation,0,'teaching examples do not borrow Build orientation');
 assert.equal(changeCrossingAngles(w,'angle',60),w,'learn does not change Build');
 assert.equal(changeCrossingAngles(w,'turn'),w);
 if(card!==1)assert.equal(changeCrossingAngles(w,'step',1),w);
}
let reason=changeCrossingAngles(learn,'card',1);
for(let step=0;step<3;step++){
 reason=changeCrossingAngles(reason,'step',step);
 const narration=crossingAnglesNarration(reason);
 assert.ok(narration.includes(crossingCards[1].steps[step].text));
 for(let hidden=0;hidden<3;hidden++)if(hidden!==step)assert.ok(!narration.includes(crossingCards[1].steps[hidden].text),'Hear includes no hidden reasoning step');
}
assert.equal(changeCrossingAngles(reason,'card',1),reason,'choosing same card retains identity and step');
assert.equal(changeCrossingAngles(reason,'card',2).step,0);
assert.deepEqual(changeCrossingAngles(reason,'page','build'),{...reason,page:'build'},'page retains all choices');
for(const [action,badValues] of [['angle',[0,180,16,'60',true,NaN,Infinity,60.5,null]],['rotation',[-30,360,15,'30',false,NaN,30.2]],['prompt',[-1,6,'1',true,1.1,NaN]],['pair',['other',1,null]],['page',['cover',true,null]]])for(const bad of badValues)assert.equal(changeCrossingAngles(initial,action,bad),initial,`${action} rejects ${String(bad)}`);
for(const [action,badValues] of [['card',[-1,4,'1',true,1.5,NaN]],['step',[-1,3,'1',false,0.5,NaN]]])for(const bad of badValues)assert.equal(changeCrossingAngles(reason,action,bad),reason);
for(const action of ['angle','rotation','pair','prompt','page'])assert.equal(changeCrossingAngles(initial,action,initial[action]),initial);
for(const action of ['card','step','unknown'])assert.equal(changeCrossingAngles(initial,action,1),initial);
for(const bad of [null,[],{}, {...initial,angle:'60'},{...initial,rotation:360},{...initial,step:3},{...initial,card:4},{...initial,prompt:6}]){
 assert.equal(crossingAnglesModel(bad),null);assert.equal(changeCrossingAngles(bad,'page','learn'),bad);assert.equal(crossingAnglesNarration(bad),'');
}
for(let prompt=0;prompt<6;prompt++){
 const w=changeCrossingAngles(initial,'prompt',prompt),m=crossingAnglesModel(w);
 assert.equal(m.prompt,crossingPrompts[prompt]);assert.deepEqual([w.angle,w.rotation,w.pair],[60,0,'opposite']);
 assert.ok(crossingAnglesNarration(w).includes(m.prompt.text));
}
const panelWork={...initial,page:'learn',card:3};
for(let width=1;width<=12;width++)for(let height=1;height<=12;height++){
 const snapshot=captureCrossingPanel({originalWidth:width,originalHeight:height,width:height,height:width},'Synthetic panel');
 const m=crossingAnglesModel(panelWork,snapshot);
 for(const f of m.context.frames){
  assert.equal(f.square,f.width===f.height);
  close(f.rectangle.width/f.rectangle.height,f.width/f.height,'fitted aspect ratio');
  close(Math.max(f.rectangle.width,f.rectangle.height),180,'longest side fitted');
  const corners=f.rectangle.corners;
  const edges=corners.map((c,i)=>sub(corners[(i+1)%4],c));
  for(let i=0;i<4;i++)close(dot(edges[i],edges[(i+1)%4]),0,'rectangle outside corners right');
  const diagonals=[sub(corners[2],corners[0]),sub(corners[3],corners[1])];
  assert.equal(Math.abs(dot(...diagonals))<1e-9,f.width===f.height,'perpendicular diagonals exactly for squares');
  const dirs=f.inset.rays.map(ray=>ray.direction),raw=[[f.width,-f.height],[-f.width,-f.height],[-f.width,f.height],[f.width,f.height]];
  for(let i=0;i<4;i++){
   close(Math.hypot(...dirs[i]),1,'normalized inset ray');close(cross(dirs[i],raw[i]),0,'inset preserves diagonal direction');assert.ok(dot(dirs[i],raw[i])>0);
   close(cross(dirs[i],dirs[(i+2)%4]),0,'inset has complete straight lines');close(dot(dirs[i],dirs[(i+2)%4]),-1,'opposite inset directions');
   const s=f.inset.sectors[i];assert.equal(s.name,`${i%2?'y':'x'}${f.subscript}`);assert.equal(s.right,f.square);
   const centerY=s.label[1]-280,centerX=s.label[0]-320;
   if(i%2===0){close(centerX,0,'x sectors face horizontal width sides');assert.ok(i===0?centerY<0:centerY>0);}
   else {close(centerY,0,'y sectors face vertical height sides');assert.ok(i===1?centerX<0:centerX>0);}
  }
  close(f.inset.sectors[0].sweep+f.inset.sectors[1].sweep,180,'symbolic neighbors supplement');
 }
}
const cases=[[[2,3,4,6],'Neither panel'],[[2,2,4,6],'The original is square'],[[2,3,4,4],'My copy is square'],[[2,2,4,4],'Both panels']];
for(const [[originalWidth,originalHeight,width,height],prefix] of cases)assert.ok(crossingAnglesModel(panelWork,{caseTitle:'Synthetic',originalWidth,originalHeight,width,height}).context.statement.startsWith(prefix));
const actual={originalWidth:2,originalHeight:3,width:4,height:6,caseId:'ignored',unrelated:{private:'not copied'}};
const capture=captureCrossingPanel(actual,'Actual waiting model');
assert.deepEqual(capture,{caseTitle:'Actual waiting model',originalWidth:2,originalHeight:3,width:4,height:6});assert.ok(Object.isFrozen(capture));
actual.width=7;assert.equal(capture.width,4,'no live parent reference');
for(const bad of [null,[],{},copyFrameModel(null),{...actual,width:0},{...actual,height:13},{...actual,width:'4'},{...actual,height:1.5},{...actual,originalWidth:NaN},{...actual,originalHeight:Infinity}])assert.equal(captureCrossingPanel(bad,'Synthetic'),null);
for(const title of [null,1,{},true])assert.equal(captureCrossingPanel(actual,title),null);
assert.equal(crossingAnglesModel(panelWork).context,null);
const missing=crossingAnglesNarration(panelWork);
assert.ok(missing.includes(crossingCopy.nullContext));assert.ok(!missing.includes(crossingCards[3].text));assert.ok(!missing.includes(crossingCopy.panelWaitingNote));
for(const work of [initial,panelWork,reason])assert.ok(!crossingAnglesNarration(work,capture).includes(crossingCopy.adultNote),'Hear excludes grown-up note');
assert.ok(!crossingAnglesNarration(initial,capture).includes(capture.caseTitle),'Build does not read hidden copied panel');
const heard=crossingAnglesNarration(panelWork,capture);assert.equal(heard.split(capture.caseTitle).length-1,1,'context title once');
// Inspect the actual host capability object, without running its callbacks or
// constructing a notebook. These seven callbacks are the child's whole authority.
const host=readFileSync(new URL('../dist/copy-frame-ui.mjs',import.meta.url),'utf8');
const childObject=host.match(/bindCrossingAngles\(work,context,(\{[\s\S]*?\n  \})\);return;/)?.[1];
assert.ok(childObject,'host passes an explicit Crossing Angles capability object');
assert.ok(!childObject.includes('...'),'host does not spread application access into child');
const capabilities=Function('live',`return (${childObject});`)(()=>false);
assert.deepEqual(Object.keys(capabilities).sort(),['live','change','render','focus','back','stopSpeech','stopSound'].sort());
assert.ok(Object.values(capabilities).every(value=>typeof value==='function'),'every child capability is a callback');
// The allowlist is the dependency boundary: no app, storage, given-math writer,
// indirect service dependency or dynamic import belongs in these local modules.
for(const [module,allowed] of [
 ['content',[]],['core',['./crossing-angles-content.mjs']],
 ['ui',['./crossing-angles-content.mjs','./crossing-angles-core.mjs']]
]){
 const source=readFileSync(new URL(`../dist/crossing-angles-${module}.mjs`,import.meta.url),'utf8');
 const imports=[...source.matchAll(/\b(?:import|export)\s+(?:[^'";]*?\s+from\s*)?['"]([^'"]+)['"]/g)].map(match=>match[1]);
 assert.deepEqual(imports.sort(),allowed.sort(),`${module} imports only local crossing modules`);
 assert.ok(!/\bimport\s*\(/.test(source),`${module} has no dynamic service import`);
}
const emptyPanelHTML=renderCrossingAngles(panelWork,null);
assert.ok(emptyPanelHTML.includes(`<h3>${crossingCards[3].title}</h3>`));
assert.ok(emptyPanelHTML.includes(crossingCopy.nullContext));
for(const omitted of [crossingCards[3].text,crossingCopy.panelWaitingNote,crossingCopy.panelNote,crossingCopy.subscriptNote,'data-crossing-angles-panel=','data-crossing-angles-inset='])assert.ok(!emptyPanelHTML.includes(omitted),'null panel renderer omits copied-panel material');
for(const [[originalWidth,originalHeight,width,height]] of cases){
 const statement=crossingAnglesModel(panelWork,{caseTitle:'Synthetic',originalWidth,originalHeight,width,height}).context.statement;
 assert.ok(!emptyPanelHTML.includes(statement),'null panel renderer omits square-case conclusions');
}
console.log('Crossing Angles: finite crossing geometry, teaching/reducer boundaries, all rectangle shapes and copied-context safety passed.');
