import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCrossingAngles,changeCrossingAngles,crossingAnglesModel,captureCrossingPanel,crossingAnglesNarration} from '../dist/crossing-angles-core.mjs';
import {crossingCards,crossingPrompts,crossingCopy} from '../dist/crossing-angles-content.mjs';
import {copyFrameModel} from '../dist/copy-frame-core.mjs';
import {renderCrossingAngles} from '../dist/crossing-angles-ui.mjs';
const close=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-9,`${message}: ${a} vs ${b}`);
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
const initial=createCrossingAngles();
assert.deepEqual(initial,{page:'build',angle:60,rotation:0,pair:'opposite',prompt:0,card:0,step:0,twoMode:'strips',twoSpacing:'middle',twoLean:0,twoPair:'corresponding',twoMove:0,twoPrompt:0,triMode:'free',triView:'gather',triA:60,triB:60,triSize:'large',triGather:0,triProof:0,triPrompt:0});
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
// Triangle expectations come from independent incident rays and side geometry.
const triangle={...initial,page:'triangle'};
const configurations=[['gather',0],['gather',1],['gather',2],['reason',0],['reason',1],['reason',2],['outside',0]];
const triWork=(base,view,step)=>({...base,triView:view,...(view==='gather'?{triGather:step}:view==='reason'?{triProof:step}:{})});
const freePairs=[];for(let a=15;a<=150;a+=15)for(let b=15;b<=150;b+=15)if(a+b<=165)freePairs.push([a,b]);
const almost=(a,b,msg)=>assert.ok(Math.abs(a-b)<2e-7,`${msg}: ${a} vs ${b}`);
const pointClose=(p,q,msg)=>p.forEach((v,i)=>almost(v,q[i],msg));
const rayAngle=(u,v)=>Math.atan2(Math.abs(cross(u,v)),dot(u,v))*180/Math.PI;
const mathPoint=p=>[p[0]-320,280-p[1]];
const polar=(p,bearing,r)=>[p[0]+r*Math.cos(bearing*Math.PI/180),p[1]-r*Math.sin(bearing*Math.PI/180)];
function expectedTriangle(raw,rotation,size){
 const middle=[0,1].map(i=>(raw[0][i]+raw[1][i]+raw[2][i])/3),offset=raw.map(p=>sub(p,middle));
 const factor=(size==='small'?80:110)/Math.max(...offset.map(p=>Math.hypot(...p)));
 return offset.map(p=>projected(p[0]*factor,p[1]*factor,rotation));
}
function expectedSectors(vertices,r){
 return vertices.map((v,i)=>{
  const p=vertices[(i+1)%3],q=vertices[(i+2)%3],u=mathPoint([p[0]-v[0]+320,p[1]-v[1]+280]),w=mathPoint([q[0]-v[0]+320,q[1]-v[1]+280]);
  const sweep=rayAngle(u,w),start=Math.atan2(u[1],u[0])*180/Math.PI;
  const length=Math.min(Math.hypot(...u),Math.hypot(...w)),opposite=sub(q,p),height=Math.abs(cross(opposite,sub(v,p)))/Math.hypot(...opposite);
  return {name:'abc'[i],center:v,start,sweep,radius:Math.min(24,.35*length,.7*height)};
 });
}
const sameBearing=(a,b,label)=>{const delta=((a-b)%360+540)%360-180;almost(delta,0,label);};
function sectorEqual(actual,expected){
 assert.equal(actual.name,expected.name);pointClose(actual.center,expected.center,'sector origin');sameBearing(actual.start,expected.start,'sector incident ray');almost(actual.sweep,expected.sweep,'sector angle from actual rays');almost(actual.radius,expected.radius,'radius independently capped');
}
function checkScene(t,expectedVertices,rotation,view,step,panel){
 t.vertices.forEach((v,i)=>pointClose(v,expectedVertices[i],'centroid scale rotation'));
 const original=expectedSectors(expectedVertices,rotation),[a,b,c]=original.map(s=>s.sweep),outline=view!=='gather'||step===0;
 almost(a+b+c,180,'triangle ray sum');assert.ok(cross(sub(mathPoint(t.vertices[1]),mathPoint(t.vertices[0])),sub(mathPoint(t.vertices[2]),mathPoint(t.vertices[0])))>0,'counterclockwise nondegenerate');
 assert.equal(t.outline,outline);assert.equal(t.points.length,outline?3:0);assert.equal(t.interiors.length,outline?3:0);
 t.interiors.forEach((s,i)=>{sectorEqual(s,original[i]);assert.equal(s.right,panel?i===1:Math.abs(original[i].sweep-90)<1e-7);});
 // The circular interior sectors and square marks must remain in all three
 // closed half planes, including skinny triangles. Endpoints alone miss bulges.
 for(const s of t.interiors){
  const samples=[];for(let j=0;j<=12;j++)samples.push(polar(s.center,s.start+s.sweep*j/12,s.radius));
  if(s.right){const p=polar(s.center,s.start,s.radius/Math.sqrt(2)),q=polar(s.center,s.start+s.sweep,s.radius/Math.sqrt(2));samples.push(p,q,[p[0]+q[0]-s.center[0],p[1]+q[1]-s.center[1]]);}
  for(const p of samples)for(let edge=0;edge<3;edge++)assert.ok(cross(sub(mathPoint(t.vertices[(edge+1)%3]),mathPoint(t.vertices[edge])),sub(mathPoint(p),mathPoint(t.vertices[edge])))>=-1e-7,'entire original mark inside');
 }
 const expectedCopies=[];
 if(view==='gather'&&step===1)for(const [position,index] of [0,2,1].entries())expectedCopies.push({...original[index],center:[160+position*160,280],radius:55});
 if(view==='gather'&&step===2){let bearing=180+rotation;for(const index of [0,2,1]){expectedCopies.push({...original[index],center:[320,280],start:bearing,radius:85});bearing+=original[index].sweep;}almost(bearing,360+rotation,'joined complete half turn');}
 if(view==='reason'&&step>0){expectedCopies.push({...original[0],center:expectedVertices[2],start:180+rotation,radius:original[2].radius});if(step===2)expectedCopies.push({...original[1],center:expectedVertices[2],start:360-b+rotation,radius:original[2].radius});}
 assert.equal(t.copies.length,expectedCopies.length);t.copies.forEach((s,i)=>{sectorEqual(s,expectedCopies[i]);assert.equal(s.right,false,'copies always use arcs');});
 assert.equal(t.parallel.length,view==='reason'&&step>0?2:0);
 if(t.parallel.length){
  const base=sub(expectedVertices[1],expectedVertices[0]),unit=base.map(n=>n/Math.hypot(...base));
  pointClose(t.parallel[0].start,expectedVertices[2].map((n,i)=>n-120*unit[i]),'parallel through C start');pointClose(t.parallel[0].end,expectedVertices[2].map((n,i)=>n+120*unit[i]),'parallel through C end');
  pointClose(t.parallel[1].start,expectedVertices[0].map((n,i)=>n-60*unit[i]),'AB extended start');pointClose(t.parallel[1].end,expectedVertices[1].map((n,i)=>n+60*unit[i]),'AB extended end');
 }
 assert.equal(!!t.extension,view==='outside');assert.equal(!!t.outside,view==='outside');assert.equal(!!t.straight,view==='gather'&&step===2);
 if(t.straight){pointClose(t.straight.start,polar([320,280],rotation,-160),'joined line start');pointClose(t.straight.end,polar([320,280],rotation,160),'joined line end');}
 if(t.outside){
  const bc=sub(expectedVertices[2],expectedVertices[1]),length=Math.hypot(...bc),end=expectedVertices[2].map((n,i)=>n+60*bc[i]/length);
  pointClose(t.extension.start,expectedVertices[2],'outside starts C');pointClose(t.extension.end,end,'outside extends BC direction');
  const exterior=rayAngle(sub(mathPoint(end),mathPoint(expectedVertices[2])),sub(mathPoint(expectedVertices[0]),mathPoint(expectedVertices[2])));
  almost(t.outside.sweep,exterior,'exterior derived from actual extension');almost(exterior,a+b,'far interior corners');almost(exterior+c,180,'supplement');almost(t.outside.radius,original[2].radius,'outside cap');
  sameBearing(t.outside.start,Math.atan2(-bc[1],bc[0])*180/Math.PI,'exterior starts outward BC');
 }
 for(const s of [...t.interiors,...t.copies,...(t.outside?[t.outside]:[])]){if(panel)assert.ok(!Object.hasOwn(s,'measure'));else almost(s.measure,s.sweep,'free chosen angle');}
 const targetByName=new Map([...original,...t.copies,...(t.outside?[t.outside]:[])].map(s=>[s.name,s]));
 for(const tag of t.tags){const s=targetByName.get(tag.name);pointClose(tag.leader,polar(s.center,s.start+s.sweep/2,s.radius*.75),'tag targets current sector');}
 for(const p of [...t.vertices,...t.parallel.flatMap(l=>[l.start,l.end]),...(t.extension?[t.extension.end]:[])])assert.ok(Math.hypot(p[0]-320,p[1]-280)<=230+1e-8,'bounded scene');
}
// Read the real SVG's coordinates and paths, rather than believing its data
// annotations. This parser deliberately understands only this activity's SVG.
const nums=value=>[...value.matchAll(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi)].map(m=>Number(m[0]));
function checkRenderedScene(work,context,expectedVertices,rotation,view,step,panel){
 const html=renderCrossingAngles(work,context),t=crossingAnglesModel(work,context).triangle;
 const outline=html.match(/<polygon data-triangle-outline points="([^"]+)"/);
 assert.equal(!!outline,t.outline);
 if(outline){const values=nums(outline[1]);assert.equal(values.length,6);expectedVertices.flat().forEach((v,i)=>almost(values[i],v,'rendered triangle point'));}
 const paths=[...html.matchAll(/<path ([^>]*data-triangle-sector="[^"]+"[^>]*)>/g)];
 const sectors=[...t.interiors,...t.copies,...(t.outside?[t.outside]:[])];assert.equal(paths.length,sectors.length);
 for(let i=0;i<paths.length;i++){
  const d=paths[i][1].match(/\bd="([^"]+)"/)[1],values=nums(d),s=sectors[i];
  if(s.right){const p=polar(s.center,s.start,s.radius/Math.sqrt(2)),q=polar(s.center,s.start+s.sweep,s.radius/Math.sqrt(2));const expected=[...s.center,...p,p[0]+q[0]-s.center[0],p[1]+q[1]-s.center[1],...q];assert.equal(values.length,8);values.forEach((v,j)=>almost(v,expected[j],'SVG right sector'));continue;}
  assert.equal(values.length,11,'sector path format');
  pointClose(values.slice(0,2),s.center,'SVG corner origin');pointClose(values.slice(2,4),polar(s.center,s.start,s.radius),'SVG sector start ray');pointClose(values.slice(9,11),polar(s.center,s.start+s.sweep,s.radius),'SVG sector end ray');almost(values[4],s.radius,'SVG radius');almost(values[5],s.radius,'SVG circular radius');assert.equal(values[6],0,'unrotated SVG circle');assert.equal(values[7],0,'interior/exterior arcs use their minor sweep');assert.equal(values[8],0,'counterclockwise SVG arc');
 }
 const lines=[...html.matchAll(/<line data-triangle-line="([^"]+)" x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/g)];
 const expectedLines=[...t.parallel,...(t.extension?[t.extension]:[]),...(t.straight?[t.straight]:[])];assert.equal(lines.length,expectedLines.length);
 lines.forEach((m,i)=>{pointClose(m.slice(2,4).map(Number),expectedLines[i].start,'SVG line start');pointClose(m.slice(4,6).map(Number),expectedLines[i].end,'SVG line end');});
 const squares=[...html.matchAll(/data-triangle-right="([^"]+)" d="([^"]+)"/g)];assert.equal(squares.length,t.interiors.filter(s=>s.right).length);
 for(const square of squares){const s=t.interiors.find(s=>s.name===square[1]),p=polar(s.center,s.start,s.radius/Math.sqrt(2)),q=polar(s.center,s.start+s.sweep,s.radius/Math.sqrt(2));const expected=[...p,p[0]+q[0]-s.center[0],p[1]+q[1]-s.center[1],...q];const drawn=nums(square[2]);assert.equal(drawn.length,6,'three drawn right-square points');drawn.forEach((v,i)=>almost(v,expected[i],'SVG right square'));}
 return html;
}
for(const [triA,triB] of freePairs)for(let rotation=0;rotation<360;rotation+=30)for(const triSize of ['small','large']){
 const r=triA*Math.PI/180,base=1/(Math.cos(r)+Math.sin(r)/Math.tan(triB*Math.PI/180));
 const expected=expectedTriangle([[0,0],[1,0],[base*Math.cos(r),base*Math.sin(r)]],rotation,triSize);
 for(const [view,step] of configurations){const w=triWork({...triangle,triA,triB,rotation,triSize},view,step),t=crossingAnglesModel(w).triangle;checkScene(t,expected,rotation,view,step,false);checkRenderedScene(w,null,expected,rotation,view,step,false);}
}
for(let width=1;width<=12;width++)for(let height=1;height<=12;height++)for(let rotation=0;rotation<360;rotation+=30){
 const context=captureCrossingPanel({originalWidth:13-width,originalHeight:13-height,width,height},'Synthetic triangle panel'),expected=expectedTriangle([[0,0],[width,0],[width,height]],rotation,'large');
 for(const [view,step] of configurations){const w=triWork({...triangle,triMode:'panel',rotation},view,step),t=crossingAnglesModel(w,context).triangle;checkScene(t,expected,rotation,view,step,true);checkRenderedScene(w,context,expected,rotation,view,step,true);assert.equal(t.context.width,width);assert.equal(t.context.height,height);assert.equal(t.summary,'a at A; b =90° at B; c =90° − a at C');}
}
// A remembered free shape must have no effect on the entire active panel
// projection, rendered HTML (including data-speak), or narration.
for(const [width,height] of [[1,12],[12,1],[1,1]]){
 const context=captureCrossingPanel({originalWidth:9,originalHeight:7,width,height},'Remembered copied panel');
 for(const [view,step] of configurations)for(let triPrompt=0;triPrompt<6;triPrompt++){
  const base=triWork({...triangle,triMode:'panel',triPrompt,rotation:210},view,step),expected=crossingAnglesModel(base,context).triangle,html=renderCrossingAngles(base,context),heard=crossingAnglesNarration(base,context);
  const inspect=value=>{if(value&&typeof value==='object')for(const [key,item] of Object.entries(value)){assert.ok(!['measure','triA','triB','triSize','A','B','C','angle'].includes(key),'panel metadata omits free/measure fields');inspect(item);}};inspect(expected);
  // Numeric starts/sweeps remain private drawing geometry. Ordinary text and
  // speech may state orientation and the fixed right/straight-turn facts only.
  const text=html.replace(/<svg[\s\S]*?<\/svg>/g,'').replace(/<[^>]+>/g,' ');
  for(const match of text.matchAll(/(-?\d+(?:\.\d+)?)\s*(?:°|degrees\b)/g))assert.ok([90,180,210].includes(Number(match[1])),'only orientation and fixed geometric facts in panel numeric text');
  assert.ok(heard.includes(context.caseTitle));assert.ok(heard.includes(`Width ${width}, height ${height}`));assert.ok(!heard.includes('Separate worked example'));
  for(const [triA,triB] of freePairs)for(const triSize of ['small','large']){
   const w={...base,triA,triB,triSize};assert.deepEqual(crossingAnglesModel(w,context).triangle,expected);assert.equal(renderCrossingAngles(w,context),html);assert.equal(crossingAnglesNarration(w,context),heard);
  }
 }
}
const triangleNull={...triangle,triMode:'panel'},triangleNullHear=`${crossingCopy.title}. Triangle corners. Your waiting panel could not be copied. Choose Free triangle, or go back to Copy Frame. ${crossingCopy.lifetime} Back to Copy Frame.`,triangleNullHTML=renderCrossingAngles(triangleNull);
const nullChromeInvariant=html=>html.replace(/(data-crossing-angles-action="tri-view"[^>]*aria-pressed=")[^"]+(")/g,'$1retained-view$2');
for(const context of [null,{}, {caseTitle:'Bad',originalWidth:1,originalHeight:1,width:0,height:1}])for(const [view,step] of configurations)for(let rotation=0;rotation<360;rotation+=30)for(const [triA,triB] of freePairs)for(const triSize of ['small','large']){
 const w=triWork({...triangleNull,rotation,triA,triB,triSize,triPrompt:(step+rotation/30)%6},view,step);
 assert.deepEqual(crossingAnglesModel(w,context).triangle,{mode:'panel',missing:true});assert.equal(crossingAnglesNarration(w,context),triangleNullHear);assert.equal(nullChromeInvariant(renderCrossingAngles(w,context)),nullChromeInvariant(triangleNullHTML));
}
for(const [action,key,value] of [['tri-mode','triMode','panel'],['tri-view','triView','outside'],['tri-size','triSize','small'],['tri-a','triA',45],['tri-b','triB',45],['tri-gather','triGather',2],['tri-proof','triProof',2],['tri-prompt','triPrompt',5]]){
 const changed=changeCrossingAngles(triangle,action,value);assert.equal(changed[key],value);assert.equal(changeCrossingAngles(changed,action,value),changed);assert.equal(changeCrossingAngles(initial,action,value),initial);
 for(const bad of [null,true,false,NaN,Infinity,{},[],1.5,'1',new String(value),'bogus'])assert.equal(changeCrossingAngles(triangle,action,bad),triangle,`${action} rejects bad type/range`);
}
for(const [action,values] of [['tri-a',[0,14,16,151,165,-15]],['tri-b',[0,14,16,151,165,-15]],['tri-gather',[-1,3]],['tri-proof',[-1,3]],['tri-prompt',[-1,6]]])for(const value of values)assert.equal(changeCrossingAngles(triangle,action,value),triangle);
for(const [a,b] of freePairs){const w={...triangle,triA:a,triB:b};for(let v=15;v<=150;v+=15){if(v+b>165)assert.equal(changeCrossingAngles(w,'tri-a',v),w,'invalid pair never clamps B');if(a+v>165)assert.equal(changeCrossingAngles(w,'tri-b',v),w,'invalid pair never clamps A');}}
for(const [action,value] of [['tri-a',45],['tri-b',45],['tri-size','small'],['angle',90]])assert.equal(changeCrossingAngles(triangleNull,action,value),triangleNull,'panel cannot change free shapes');
for(const w of [triangle,triangleNull]){assert.equal(changeCrossingAngles(w,'rotation',30).rotation,30);assert.equal(changeCrossingAngles({...w,rotation:330},'turn').rotation,0);assert.equal(changeCrossingAngles(w,'angle',90),w);}
for(const w of [{...triangle,triA:150},{...triangle,triA:'60'},{...triangle,triB:0},{...triangle,triMode:'other'},{...triangle,triView:'other'},{...triangle,triSize:'other'},{...triangle,triProof:3},{...triangle,triGather:-1},{...triangle,triPrompt:6}]){assert.equal(crossingAnglesModel(w),null);assert.equal(changeCrossingAngles(w,'page','build'),w);assert.equal(crossingAnglesNarration(w),'');}
const remembered={...triangle,triA:90,triB:45,triSize:'small',triGather:2,triProof:1,triPrompt:4,rotation:330};
let switched=changeCrossingAngles(changeCrossingAngles(remembered,'tri-mode','panel'),'tri-mode','free');assert.deepEqual(switched,remembered);
for(const page of ['build','learn','parallel','triangle']){switched=changeCrossingAngles(switched,'page',page);assert.deepEqual(switched,{...remembered,page});}
for(const [view,step] of configurations){
 const w=triWork({...triangle,triA:45,triB:60},view,step),t=crossingAnglesModel(w).triangle,heard=crossingAnglesNarration(w);
 assert.equal(t.equations.length>0,(view==='gather'&&step===2)||(view==='reason'&&step>0)||view==='outside');assert.equal(!!t.workedExample,(step===2)||view==='outside');assert.equal(heard.includes('Separate worked example.'),!!t.workedExample);
 const ordered=['Crossing Angles. Triangle corners.', 'A triangle’s corners can fill a straight turn.', 'Free triangle.', `${view==='gather'?'Gather corners':view==='reason'?'Why every triangle?':'Outside corner'}.`,t.source,t.definition,t.naming,t.summary,...(t.counter?[t.counter]:[]),t.text,...t.equations,...(t.workedExample?['Separate worked example.',t.workedExample]:[]),t.prompt.title,t.prompt.text,'An exact paper model of straight sides in a flat plane.',crossingCopy.lifetime,'Back to Copy Frame.'];
 let cursor=0;for(const part of ordered){const index=heard.indexOf(part,cursor);assert.ok(index>=cursor,`Hear order includes ${part}`);cursor=index+part.length;}
 assert.ok(!heard.includes('Triangle corners distinguishes gathering'),'adult note not spoken');
}
console.log('Triangle Corners: finite ray mathematics, actual SVG readback, symbolic/null invariance, strict actions, retained settings and current Hear passed.');
