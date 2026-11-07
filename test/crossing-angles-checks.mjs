import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCrossingAngles,changeCrossingAngles,crossingAnglesModel,captureCrossingPanel,crossingAnglesNarration} from '../dist/crossing-angles-core.mjs';
import {crossingCards,crossingPrompts,crossingCopy} from '../dist/crossing-angles-content.mjs';
import {copyFrameModel} from '../dist/copy-frame-core.mjs';
import {renderCrossingAngles} from '../dist/crossing-angles-ui.mjs';
const close=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-9,`${message}: ${a} vs ${b}`);
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
const initial=createCrossingAngles();
assert.deepEqual(initial,{page:'build',angle:60,rotation:0,pair:'opposite',prompt:0,card:0,step:0,twoMode:'strips',twoSpacing:'middle',twoLean:0,twoPair:'corresponding',twoMove:0,twoPrompt:0});
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
for(const [action,badValues] of [['card',[-1,8,'1',true,1.5,NaN]],['step',[-1,3,'1',false,0.5,NaN]]])for(const bad of badValues)assert.equal(changeCrossingAngles(reason,action,bad),reason);
for(const action of ['angle','rotation','pair','prompt','page'])assert.equal(changeCrossingAngles(initial,action,initial[action]),initial);
for(const action of ['card','step','unknown'])assert.equal(changeCrossingAngles(initial,action,1),initial);
for(const bad of [null,[],{}, {...initial,angle:'60'},{...initial,rotation:360},{...initial,step:3},{...initial,card:8},{...initial,prompt:6}]){
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
 const imports=[...source.matchAll(/\b(?:import|export)\b\s*(?:[^'";]*?\bfrom\s*)?['"]([^'"]+)['"]/g)].map(match=>match[1]);
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
// Compact boundary fixtures: this is deliberately not a JavaScript parser.
const importPattern=/\b(?:import|export)\b\s*(?:[^'";]*?\bfrom\s*)?['"]([^'"]+)['"]/g;
for(const fixture of ["import{x}from './local.mjs';","import*as x from './local.mjs';","export{x}from './local.mjs';","import './local.mjs';"])assert.deepEqual([...fixture.matchAll(importPattern)].map(m=>m[1]),['./local.mjs']);
console.log('Crossing Angles: finite crossing geometry, teaching/reducer boundaries, all rectangle shapes and copied-context safety passed.');
// Expectations below use independently written mathematical coordinates and
// vectors rather than the renderer's sector paths or its direction helper.
const parallel={...initial,page:'parallel'};
const twoPairs=['corresponding','alternate','co-interior'];
const projected=(x,y,r)=>{const t=r*Math.PI/180;return [320+x*Math.cos(t)-y*Math.sin(t),280-x*Math.sin(t)-y*Math.cos(t)];};
const coord=(actual,expected,label)=>actual.forEach((v,i)=>close(v,expected[i],label));
for(let a=15;a<=165;a+=15)for(let r=0;r<360;r+=30)for(const lean of [-10,0,10])for(const spacing of ['near','middle','far']){
 const D={near:120,middle:150,far:180}[spacing],t=a*Math.PI/180,v=[Math.cos(t),Math.sin(t)],base={...parallel,angle:a,rotation:r,twoLean:lean,twoSpacing:spacing};
 const m=crossingAnglesModel(base).two;
 coord(m.O,projected(-D*v[0]/2,-D*v[1]/2,r),'first crossing');coord(m.P,projected(D*v[0]/2,D*v[1]/2,r),'second crossing');
 const all=m.crossings.flatMap(c=>c.sectors),expected=[a,180-a,a,180-a,a-lean,180-a+lean,a-lean,180-a+lean];
 assert.deepEqual(all.map(s=>s.name),[...'abcdefgh']);assert.deepEqual(all.map(s=>s.measure),expected);assert.deepEqual(all.map(s=>s.inside),[true,true,false,false,false,false,true,true]);
 for(let i=0;i<8;i++){assert.ok(expected[i]>0&&expected[i]<180);close(all[i].sweep,expected[i],'exact sector sweep');}
 for(let i=0;i<2;i++){
  const c=m.crossings[i],rail=m.rails[i],d=sub(rail.end,rail.start),theta=(r+(i?lean:0))*Math.PI/180;
  coord(d,[200*Math.cos(theta),-200*Math.sin(theta)],'rail direction');
  for(const s of c.sectors){const t=(s.start+s.sweep/2)*Math.PI/180;coord(sub(s.leader,c.center),[28*Math.cos(t),-28*Math.sin(t)],'leader exact bisector');}
 }
 const endpoints=[...m.rails.flatMap(l=>[l.start,l.end]),m.transversal.start,m.transversal.end];
 for(const p of endpoints)assert.ok(Math.hypot(p[0]-320,p[1]-280)<=190+1e-9,'free bounds');
 for(let move=0;move<=4;move++){
  const g=crossingAnglesModel({...base,twoMove:move}).two;
  coord(g.tracing.center,m.O.map((n,i)=>n+(m.P[i]-n)*move/4),'linear tracing');
  for(let i=0;i<4;i++){coord(sub(g.tracing.rays[i].end,g.tracing.center),sub(m.crossings[0].rays[i].end,m.O),'copy never turns or stretches');assert.ok(Math.hypot(g.tracing.rays[i].end[0]-320,g.tracing.rays[i].end[1]-280)<=190+1e-9);}
  assert.equal(g.tracingState!== '',move===4);
 }
 // Pair selection is factored from geometry: all pair relations are checked
 // here without repeating the five interpolation computations per pair.
 for(const pair of twoPairs){const g=crossingAnglesModel({...base,twoPair:pair}).two;
  assert.deepEqual(g.selectedNames,['a',pair==='corresponding'?'e':pair==='alternate'?'g':'h']);
  assert.deepEqual(g.crossings.flatMap(c=>c.sectors).filter(s=>s.selected).map(s=>s.name),g.selectedNames);
  assert.equal(g.rails.every(l=>l.parallel),lean===0);
  if(pair==='co-interior'){assert.equal(expected[0]+expected[7],180+lean);assert.ok(g.relation.includes(lean===0?'= 180°':`= ${180+lean}°, not 180°`));}
  else {assert.equal(expected[0]-expected[pair==='corresponding'?4:6],lean);assert.equal(g.relation.includes(' ≠ '),lean!==0);}
 }
}
for(const [a,d,e,h] of [[60,0,60,120],[60,10,50,130],[60,-10,70,110],[90,0,90,90],[15,10,5,175],[165,-10,175,5]]){
 const s=crossingAnglesModel({...parallel,angle:a,twoLean:d}).two.crossings[1].sectors;assert.equal(s[0].measure,e);assert.equal(s[2].measure,e);assert.equal(s[3].measure,h);
}
for(let width=1;width<=12;width++)for(let height=1;height<=12;height++){
 const context=captureCrossingPanel({originalWidth:12,originalHeight:11,width,height},'Synthetic copied panel');
 const g=crossingAnglesModel({...parallel,twoMode:'panel',twoPair:'co-interior',twoMove:4},context).two;
 close(g.rectangle.width/g.rectangle.height,width/height,'actual copy ratio');close(Math.max(g.rectangle.width,g.rectangle.height),160,'panel equal scale');
 const corners=g.rectangle.corners,edges=corners.map((p,i)=>sub(corners[(i+1)%4],p));
 close(cross(edges[0],edges[2]),0,'opposite sides parallel');close(dot(edges[0],edges[1]),0,'rectangle corner');
 coord(g.O,corners[0],'diagonal starts lower left');coord(g.P,corners[2],'diagonal ends upper right');
 close(cross(sub(g.transversal.end,g.transversal.start),sub(g.P,g.O)),0,'one diagonal correct');
 for(const rail of g.rails)close(Math.hypot(...sub(rail.end,rail.start)),g.rectangle.width+120,'full width plus extensions');
 for(const c of g.crossings)for(const s of c.sectors){assert.ok(!Object.hasOwn(s,'measure'),'panel sectors have no measure field');assert.ok(s.sweep>0&&s.sweep<180);}
 assert.equal(g.lean,0);assert.ok(!Object.hasOwn(g,'angle'));assert.ok(!Object.hasOwn(g,'spacing'));
 assert.equal(g.table,'a: first angle; c = e = g = a; b = d = f = h = 180° − a.');assert.ok(g.relation.includes('Inside means between'));
 const ends=[...g.rails.flatMap(l=>[l.start,l.end]),g.transversal.start,g.transversal.end,...g.tracing.rays.map(l=>l.end)];
 for(const point of ends)assert.ok(Math.hypot(point[0]-320,point[1]-280)<175,'panel bounds');
 const html=renderCrossingAngles({...parallel,twoMode:'panel',twoPair:'co-interior',twoMove:4},context);
 assert.ok(!/data-crossing-angles-label="[a-h]"[^>]*>[^<]*<strong>/.test(html),'no numeric angle tag');
 for(const match of html.matchAll(/([0-9]+(?:\.[0-9]+)?)°/g))assert.ok(['0','180'].includes(match[1]),'only orientation and fixed half turn have degree values in panel HTML');assert.ok(!html.includes('≈'));
}
// Complete output invariance across inactive free inputs, including data-speak.
for(const context of [captureCrossingPanel({originalWidth:3,originalHeight:2,width:1,height:12},'Tall copied panel'),captureCrossingPanel({originalWidth:3,originalHeight:2,width:4,height:4},'Square copied panel'),null]){
 const base={...parallel,twoMode:'panel',twoPair:'alternate',twoMove:2,twoPrompt:3,rotation:150};
 const expected=crossingAnglesModel(base,context).two,html=renderCrossingAngles(base,context),heard=crossingAnglesNarration(base,context);
 for(let angle=15;angle<=165;angle+=15)for(const twoLean of [-10,0,10])for(const twoSpacing of ['near','middle','far']){
  const w={...base,angle,twoLean,twoSpacing};assert.deepEqual(crossingAnglesModel(w,context).two,expected);assert.equal(renderCrossingAngles(w,context),html);assert.equal(crossingAnglesNarration(w,context),heard);
 }
}
const nullBase={...parallel,twoMode:'panel'};
const nullHear=`${crossingCopy.title}. Two Crossings. Your waiting panel could not be copied. Choose Free strips to explore two crossings, or go back to Copy Frame. ${crossingCopy.lifetime} Back to Copy Frame.`;
for(const twoPair of twoPairs)for(let twoMove=0;twoMove<=4;twoMove++)for(let twoPrompt=0;twoPrompt<=5;twoPrompt++)for(let rotation=0;rotation<360;rotation+=30){
 const w={...nullBase,twoPair,twoMove,twoPrompt,rotation};assert.deepEqual(crossingAnglesModel(w).two,{mode:'panel',missing:true});assert.equal(crossingAnglesNarration(w),nullHear);assert.equal(renderCrossingAngles(w),renderCrossingAngles(nullBase));
}
for(const [action,validValue,key] of [['two-mode','panel','twoMode'],['two-spacing','far','twoSpacing'],['two-lean',10,'twoLean'],['two-pair','alternate','twoPair'],['two-move',4,'twoMove'],['two-prompt',5,'twoPrompt']]){
 const changed=changeCrossingAngles(parallel,action,validValue);assert.equal(changed[key],validValue);assert.equal(changeCrossingAngles(initial,action,validValue),initial);assert.equal(changeCrossingAngles(changed,action,validValue),changed);
 for(const bad of [null,true,NaN,Infinity,{},'bogus',1.5,new String('far')])assert.equal(changeCrossingAngles(parallel,action,bad),parallel);
}
for(const action of ['two-lean','two-move','two-prompt'])assert.equal(changeCrossingAngles(parallel,action,'0'),parallel);
const panelMode={...parallel,twoMode:'panel'};for(const [action,value] of [['angle',90],['two-lean',10],['two-spacing','far']])assert.equal(changeCrossingAngles(panelMode,action,value),panelMode);
const returned=changeCrossingAngles(changeCrossingAngles({...parallel,angle:165,twoLean:-10,twoSpacing:'far'},'two-mode','panel'),'two-mode','strips');assert.deepEqual([returned.angle,returned.twoLean,returned.twoSpacing],[165,-10,'far']);
for(let card=4;card<=7;card++)for(let step=0;step<=2;step++){
 const w={...initial,page:'learn',card,step},m=crossingAnglesModel(w),heard=crossingAnglesNarration(w);
 assert.ok(m.two);assert.equal(m.two.move,card===4&&step===0?0:4);assert.equal(m.two.lean,card===7?10:0);assert.equal(m.two.rotation,0);assert.equal(m.two.angle,60);
 assert.ok(!heard.includes(crossingCopy.arcLegend));assert.ok(!heard.includes(crossingCopy.modelNote));
 const html=renderCrossingAngles(w);assert.ok(!html.includes(crossingCopy.arcLegend));assert.ok(!html.includes(crossingCopy.modelNote));
 if(card===4){const selected=crossingCards[card].steps[step];assert.ok(heard.includes(selected.text));for(let hidden=0;hidden<3;hidden++)if(hidden!==step)assert.ok(!heard.includes(crossingCards[card].steps[hidden].text));}
 assert.deepEqual(crossingAnglesModel({...w,angle:15,rotation:330,twoLean:-10,twoSpacing:'far',twoPair:'co-interior',twoMove:3}).two,m.two,'worked settings fixed');
}
console.log('Two Crossings: complete free geometry, tracing, symbolic panels, output invariance and strict ownership passed.');
