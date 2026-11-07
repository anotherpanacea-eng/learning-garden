import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCrossingAngles,changeCrossingAngles,crossingAnglesModel,captureCrossingPanel,crossingAnglesNarration} from '../dist/crossing-angles-core.mjs';
import {crossingCards,crossingPrompts,crossingCopy} from '../dist/crossing-angles-content.mjs';
import {copyFrameModel} from '../dist/copy-frame-core.mjs';
import {renderCrossingAngles} from '../dist/crossing-angles-ui.mjs';
const close=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-9,`${message}: ${a} vs ${b}`);
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
const initial=createCrossingAngles();
const {chase:initialChase,...legacyInitial}=initial;
assert.deepEqual(legacyInitial,{page:'build',angle:60,rotation:0,pair:'opposite',prompt:0,card:0,step:0,twoMode:'strips',twoSpacing:'middle',twoLean:0,twoPair:'corresponding',twoMove:0,twoPrompt:0,triMode:'free',triView:'gather',triA:60,triB:60,triSize:'large',triGather:0,triProof:0,triPrompt:0,polySides:5,polyKind:'regular',polySize:'large',polyView:'split',polyCorner:0,polyDraw:0,polyWalk:0,polyPrompt:0,polyPanelCorner:0,polyPanelDraw:0,polyPanelWalk:0,matching:{mode:'parts',view:'build',fit:'explore',case:'sss',prompt:0,parts:{variant:0,step:0,rotation:120,flip:true,move:0,pair:0},panel:{step:0,rotation:120,flip:true,move:0,pair:0}}});
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

// Polygon expectations derive from the actual boundary, independently of scene sectors.
const poly={...createCrossingAngles(),page:'triangle',triView:'polygons'};
const polygon=(w,c=null)=>crossingAnglesModel(w,c).polygon;
const signedArea=ps=>ps.reduce((a,p,i)=>a+cross(p,ps[(i+1)%ps.length]),0)/2;
const edgeFacts=ps=>ps.map((p,i)=>{
 const incoming=sub(p,ps[(i+ps.length-1)%ps.length]),outgoing=sub(ps[(i+1)%ps.length],p);
 // Screen y is inverted, so a mathematical left turn has negative screen cross.
 const exterior=Math.atan2(-cross(incoming,outgoing),dot(incoming,outgoing))*180/Math.PI;
 return {incoming,outgoing,exterior,interior:180-exterior,length:Math.hypot(...outgoing)};
});
const polyPointClose=(a,b,message)=>{close(a[0],b[0],`${message} x`);close(a[1],b[1],`${message} y`);};
function verifyPolygonGeometry(w,c=null){
 const g=polygon(w,c),ps=g.vertices,n=ps.length,edges=edgeFacts(ps),area=Math.abs(signedArea(ps));
 assert.equal(crossingAnglesModel(w,c).triangle,null,'polygon has an explicit projection, not triangle geometry');
 assert.equal(g.n,n);assert.ok(area>0);assert.ok(edges.every(e=>e.exterior>0&&e.exterior<180));
 close(edges.reduce((s,e)=>s+e.exterior,0),360,'convex lap from actual edge bearings');
 close(edges.reduce((s,e)=>s+e.interior,0),(n-2)*180,'actual polygon corner total');
 close(Math.max(...ps.map(p=>Math.hypot(...sub(p,[320,280])))),g.size==='small'?120:160,'uniform radius');
 polyPointClose(ps.reduce((sum,p)=>sum.map((v,d)=>v+p[d]/n),[0,0]),[320,280],'arithmetic centroid');
 for(let j=0;j<n;j++){
  close(edges[j].interior+edges[j].exterior,180,'adjacent half turn');
  assert.ok(cross(sub(ps[(j+1)%n],ps[j]),sub(ps[(j+2)%n],ps[(j+1)%n]))<0,'strict convexity');
 }
 if(g.regular){for(const e of edges){close(e.length,edges[0].length,'regular equal sides');close(e.interior,(n-2)*180/n,'regular equal corners');}}
 else if(g.mode==='free'){
  assert.ok(Math.max(...edges.map(e=>e.interior))-Math.min(...edges.map(e=>e.interior))>1,'stretch makes corners unequal');
  if(n===4)for(const e of edges)close(e.length,edges[0].length,'stretched quadrilateral has equal sides');
 }
 assert.ok(!JSON.stringify(g).includes('"measure"'),'no measured angle field in polygon projection');
 return {g,ps,edges,area};
}
for(let n=3;n<=12;n++)for(const kind of ['regular','stretched'])for(const size of ['small','large'])for(let rotation=0;rotation<360;rotation+=30)for(let a=0;a<n;a++){
 const w={...poly,polySides:n,polyKind:kind,polySize:size,rotation,polyCorner:a},base=verifyPolygonGeometry(w),ps=base.ps;
 const raw=Array.from({length:n},(_,i)=>[(kind==='regular'?1:1.6)*Math.cos((90+360*i/n)*Math.PI/180),Math.sin((90+360*i/n)*Math.PI/180)]),expectedVertices=expectedPoly(raw,rotation,size==='small'?120:160);
 ps.forEach((p,i)=>polyPointClose(p,expectedVertices[i],'finite independently expected raw-to-screen projection'));
 for(let k=0;k<=n-3;k++){
  const g=polygon({...w,polyDraw:k}),complete=k===n-3,expected=complete?n-2:k;
  assert.equal(g.triangles.length,expected);assert.equal(g.diagonals.length,k);assert.equal(g.remainder===null,complete);
  let sum=0;
  for(let j=0;j<expected;j++){
   const triangle=g.triangles[j],indices=[a,(a+j+1)%n,(a+j+2)%n];assert.deepEqual(triangle.indices,indices);
   assert.deepEqual(triangle.points,indices.map(i=>ps[i]));const area=Math.abs(signedArea(triangle.points));assert.ok(area>0);sum+=area;
   const angles=edgeFacts(triangle.points).map(e=>e.interior);close(angles.reduce((v,b)=>v+b,0),180,'fan piece is one triangle');
  }
  if(complete){close(sum,base.area,'fan triangles exactly fill boundary');
   // Triangle angles at each original vertex partition its polygon angle.
   for(let vertex=0;vertex<n;vertex++){
    let angle=0;for(const t of g.triangles){const j=t.indices.indexOf(vertex);if(j>=0)angle+=edgeFacts(t.points)[j].interior;}
    close(angle,base.edges[vertex].interior,'fan partitions original corner');
   }
  }else {assert.equal(g.remainder.points.length,n-k);assert.ok(Math.abs(signedArea(g.remainder.points))>0);close(sum+Math.abs(signedArea(g.remainder.points)),base.area,'partial pieces partition polygon');}
 }
 const corner=polygon({...w,polyView:'corner'}),s=corner.interior;
 close(s.sweep,base.edges[a].interior,'selected sector matches actual inside angle');assert.equal(s.right,kind==='regular'&&n===4);
 const start=polygon({...w,polyView:'walk'});
 for(let j=0;j<=n;j++){
  const g=polygon({...w,polyView:'walk',polyWalk:j}),i=(a+j)%n,e=base.edges[i],V=ps[i];
  assert.ok(g.current.includes(`${i+1} of ${n}`));assert.equal(g.points.length,0,'no walking point-text label');
  assert.equal(!!g.exterior,j>0);assert.equal(!!g.extension,j>0);
  const incoming=e.incoming.map(v=>v/Math.hypot(...e.incoming)),out=e.outgoing.map(v=>v/Math.hypot(...e.outgoing)),p=[-incoming[1],incoming[0]],q=[-out[1],out[0]],rho=Math.min(24,.35*Math.min(Math.hypot(...e.incoming),Math.hypot(...e.outgoing))),M=V.map((v,d)=>v+(rho+8)*p[d]);
  polyPointClose(g.marker.center,M,'offset marker from actual incoming edge');polyPointClose(g.marker.leader.start,V,'leader identifies current vertex');polyPointClose(g.marker.leader.end,M,'leader reaches offset marker');
  polyPointClose(g.marker.heading.start,M.map((v,d)=>v-7*out[d]),'marker tail');polyPointClose(g.marker.heading.end,M.map((v,d)=>v+7*out[d]),'marker tip');
  for(const [z,sign] of [[1,1],[2,-1]])polyPointClose(g.marker.arrow[z],M.map((v,d)=>v+2*out[d]+sign*4*q[d]),'marker arrow branch');
  for(const point of [g.marker.center,g.marker.heading.start,g.marker.heading.end,...g.marker.arrow]){assert.ok(Math.hypot(...sub(point,[320,280]))<=200+1e-9);assert.ok(dot(sub(point,V),p)>=rho+1-1e-9,'glyph stays beyond incoming line');}
  if(j>0){close(g.exterior.sweep,e.exterior,'exterior follows actual bearings');polyPointClose(g.extension.end,V.map((v,d)=>v+30*incoming[d]),'incoming continuation');polyPointClose(g.outgoing.end,V.map((v,d)=>v+Math.min(30,e.length)*out[d]),'outgoing ray stops by next corner');}
  if(j===n){assert.deepEqual(g.marker,start.marker,'full lap returns marker and heading');assert.ok(g.text.includes('does not mean we turned 0°'));}
 }
}
for(let width=1;width<=12;width++)for(let height=1;height<=12;height++){
 const c=captureCrossingPanel({originalWidth:13-width,originalHeight:13-height,width,height},'Synthetic polygon panel');
 for(let corner=0;corner<4;corner++){
  const w={...poly,triMode:'panel',polyPanelCorner:corner},g=verifyPolygonGeometry(w,c).g;
  assert.equal(g.regular,width===height);assert.equal(g.equalCorners,true);assert.equal(g.n,4);assert.deepEqual(g.context,{caseTitle:c.caseTitle,width,height});
  const edges=edgeFacts(g.vertices);for(const e of edges)close(e.interior,90,'copied rectangle right corner');close(edges[0].length/edges[1].length,width/height,'actual copied aspect ratio');
  const split=polygon({...w,polyPanelDraw:1},c);assert.equal(split.triangles.length,2);close(split.triangles.reduce((s,t)=>s+Math.abs(signedArea(t.points)),0),Math.abs(signedArea(g.vertices)),'panel fan area');
  assert.equal(polygon({...w,polyView:'corner'},c).interior.right,true);
 }
}
// Reducers validate the complete coupled state before changing any channel.
const polyActions=[['poly-sides',7],['poly-kind','stretched'],['poly-size','small'],['poly-view','walk'],['poly-corner',2],['poly-draw',1],['poly-walk',3],['poly-prompt',4]];
for(const [action,value] of polyActions){const changed=changeCrossingAngles(poly,action,value);assert.notEqual(changed,poly);assert.equal(changeCrossingAngles(changed,action,value),changed);for(const w of [initial,{...poly,page:'learn'},{...poly,triView:'gather'},{...poly,triView:'reason'},{...poly,triView:'outside'}])assert.equal(changeCrossingAngles(w,action,value),w,'polygon action owns only polygon view');}
for(const [action,value] of [['tri-a',45],['tri-b',45],['tri-size','small'],['tri-gather',1],['tri-proof',1],['tri-prompt',1]])assert.equal(changeCrossingAngles(poly,action,value),poly,'triangle-specific actions rejected in polygon view');
for(const [key,bad] of [['polySides',13],['polyCorner',5],['polyDraw',3],['polyWalk',6],['polyPanelCorner',4],['polyPanelDraw',2],['polyPanelWalk',5],['polyPrompt',6],['polyKind','other'],['polySize','other'],['polyView','other']]){const w={...poly,[key]:bad};assert.equal(crossingAnglesModel(w),null);assert.equal(changeCrossingAngles(w,'turn'),w);}
for(const action of ['poly-sides','poly-corner','poly-draw','poly-walk','poly-prompt'])for(const v of ['1',true,false,1.5,NaN,Infinity,null,{},[],-1,99])assert.equal(changeCrossingAngles(poly,action,v),poly);
const held={...poly,polySides:12,polyCorner:8,polyDraw:7,polyWalk:10,polyPanelCorner:2,polyPanelDraw:1,polyPanelWalk:3};
assert.deepEqual(changeCrossingAngles(held,'poly-sides',7),{...held,polySides:7,polyCorner:0,polyDraw:0,polyWalk:0});
assert.deepEqual(changeCrossingAngles(held,'poly-corner',9),{...held,polyCorner:9,polyDraw:0,polyWalk:0});
const heldPanel={...held,triMode:'panel'};
assert.deepEqual(changeCrossingAngles(heldPanel,'poly-corner',1),{...heldPanel,polyPanelCorner:1,polyPanelDraw:0,polyPanelWalk:0});
for(const [action,value] of [['poly-sides',3],['poly-kind','stretched'],['poly-size','small']])assert.equal(changeCrossingAngles(heldPanel,action,value),heldPanel);
for(const [action,value,key] of [['tri-mode','panel','triMode'],['tri-view','gather','triView'],['poly-view','walk','polyView'],['poly-kind','stretched','polyKind'],['poly-size','small','polySize'],['page','build','page']])assert.deepEqual(changeCrossingAngles(held,action,value),{...held,[key]:value});
assert.equal(changeCrossingAngles(held,'poly-sides',12),held);assert.equal(changeCrossingAngles(held,'poly-corner',8),held);
for(const [n,k,triangles,pieces] of [[3,0,1,1],[4,0,0,1],[4,1,2,2],[5,0,0,1],[5,1,1,2],[5,2,3,3],[12,8,8,9],[12,9,10,10]]){
 const g=polygon({...poly,polySides:n,polyDraw:k});assert.equal(g.triangles.length,triangles);
 if(k<n-3){assert.ok(g.text.includes(`${pieces} piece${pieces===1?'':'s'} so far`));assert.ok(g.text.includes(`${triangles} completed triangle${triangles===1?'':'s'}`));assert.ok(g.text.includes(`one ${n-k}-sided piece`));assert.deepEqual(g.equations,[]);}else {assert.ok(g.text.includes(n===3?'already one triangle':`${n-2} triangles`));assert.ok(g.equations.includes(`All corners together: ${(n-2)*180}°`));}
}
for(let n=3;n<=12;n++){
 const T=(n-2)*180,g=polygon({...poly,polySides:n,polyView:'corner'});
 assert.ok(g.equations[0].includes(`${T}°÷${n}`));assert.equal(g.equations[0].includes('='),T%n===0);
 const lap=polygon({...poly,polySides:n,polyView:'walk',polyWalk:n});assert.ok(lap.perTurn.startsWith(`Each turn: 360°÷${n}`));assert.equal(lap.perTurn.includes('='),360%n===0);
 if([7,11].includes(n)){assert.ok(g.fractionNote.includes('no rounded value is shown'));assert.ok(lap.fractionNote.includes(`360°÷${n} is the exact size of one turn`));}
}
// Factor inactive channels: each may change independently, including coupled
// free ranges, without leaking through the whole HTML or current Hear.
const inactiveChanges=[{triA:45},{triB:75},{triSize:'small'},{triGather:2},{triProof:1},{triPrompt:5},{angle:105},{pair:'adjacent'},{prompt:4},{card:6},{step:2},{twoMode:'panel'},{twoSpacing:'far'},{twoLean:10},{twoPair:'co-interior'},{twoMove:3},{twoPrompt:5}];
const polyConfigurations=[['split',0],['split',1],['corner',0],['walk',0],['walk',2],['walk',4]];
for(const [width,height] of [[1,12],[12,1],[4,4]]){
 const context=captureCrossingPanel({originalWidth:9,originalHeight:7,width,height},'Copied polygon source');
 for(const [view,step] of polyConfigurations)for(const corner of [0,2])for(let prompt=0;prompt<6;prompt++){
  const w={...poly,triMode:'panel',polyView:view,polyPanelCorner:corner,polyPanelDraw:view==='split'?step:0,polyPanelWalk:view==='walk'?step:0,polyPrompt:prompt,rotation:210};
  const g=polygon(w,context),html=renderCrossingAngles(w,context),hear=crossingAnglesNarration(w,context);
  for(const delta of [...inactiveChanges,{polySides:3,polyCorner:2,polyDraw:0,polyWalk:3},{polySides:12,polyCorner:11,polyDraw:9,polyWalk:12},{polyKind:'stretched'},{polySize:'small'}]){
   assert.deepEqual(polygon({...w,...delta},context),g);assert.equal(renderCrossingAngles({...w,...delta},context),html);assert.equal(crossingAnglesNarration({...w,...delta},context),hear);
  }
  for(const delta of [{originalWidth:1},{originalHeight:12}]){const c=captureCrossingPanel({...context,...delta},context.caseTitle);assert.deepEqual(polygon(w,c),g);assert.equal(renderCrossingAngles(w,c),html);assert.equal(crossingAnglesNarration(w,c),hear);}
 }
}
for(const view of ['split','corner','walk'])for(let polyPrompt=0;polyPrompt<6;polyPrompt++){
 const w={...held,polyView:view,polyPrompt,rotation:120},g=polygon(w),html=renderCrossingAngles(w),hear=crossingAnglesNarration(w);
 for(const delta of [...inactiveChanges,{polyPanelCorner:3},{polyPanelDraw:1},{polyPanelWalk:4}]){assert.deepEqual(polygon({...w,...delta}),g);assert.equal(renderCrossingAngles({...w,...delta}),html);assert.equal(crossingAnglesNarration({...w,...delta}),hear);}
 for(const c of [null,captureCrossingPanel({originalWidth:12,originalHeight:1,width:1,height:12},'Unrelated copied source'),captureCrossingPanel({originalWidth:1,originalHeight:12,width:12,height:1},'Another source')]){assert.deepEqual(polygon(w,c),g);assert.equal(renderCrossingAngles(w,c),html);assert.equal(crossingAnglesNarration(w,c),hear);}
}
const missingPoly='Your waiting panel could not be copied. Choose Free frame, or go back to Copy Frame.';
for(const view of ['split','corner','walk'])for(const delta of [{},...inactiveChanges,{polySides:12,polyCorner:11,polyDraw:9,polyWalk:12,polyPanelCorner:3,polyPanelDraw:1,polyPanelWalk:4,polyPrompt:5,rotation:330}]){
 const w={...poly,triMode:'panel',polyView:view,...delta};assert.deepEqual(polygon(w),{mode:'panel',missing:true});
 assert.equal(crossingAnglesNarration(w),`${crossingCopy.title}. Polygon frames. ${missingPoly} ${crossingCopy.lifetime} Back to Copy Frame.`);
 const html=renderCrossingAngles(w),region=html.match(/<div data-crossing-angles-polygon-region>([\s\S]*?)<\/div>/)[1];assert.equal(region,`<p>${missingPoly}</p>`);
 assert.ok(html.includes(`data-crossing-angles-action="poly-view" data-crossing-angles-value="${view}" aria-pressed="true"`));
}
// Keep SVG descriptions, speech/aria attributes and text in this check. Only
// the actual coordinate/style attributes and source title are excluded.
for(const w of [
 {...poly,polyKind:'stretched',polyView:'corner'},
 {...poly,polyKind:'stretched',polySides:11,polyView:'walk',polyWalk:4},
 ...[7,11].flatMap(polySides=>['corner','walk'].map(polyView=>({...poly,polySides,polyView,polyWalk:polySides}))),
 {...poly,triMode:'panel',polyView:'walk',polyPanelWalk:3},
 ...['corner','walk'].map(polyView=>({...poly,triMode:'panel',polyView,polyPanelWalk:4}))
]){
 const c=captureCrossingPanel({originalWidth:3,originalHeight:7,width:1,height:12},'Synthetic panel source'),g=polygon(w,c),html=renderCrossingAngles(w,c),hear=crossingAnglesNarration(w,c);
 const meaningful=html.replace(/\s(?:d|points|x|y|x1|y1|x2|y2|cx|cy|data-ca-x|data-ca-y|style)="[^"]*"/g,'');
 assert.ok(!/\d+\.\d+\s*(?:°|degrees\b)/.test(meaningful+' '+hear),'no approximate angle text in any generated text channel');
 assert.ok(!/a_\{|e_\{/.test(meaningful));
 if(g.mode==='panel'&&g.view==='walk'&&g.walk===3)assert.equal(g.perTurn,'3×90°=270° accumulated');
 const active=meaningful.match(/<div data-crossing-angles-polygon-region>([\s\S]*?)<\/section>/)?.[1]||meaningful;
 if(g.mode==='panel'||!g.regular)for(const match of (active+' '+hear).matchAll(/(\d+)\s*°/g))assert.ok([0,90,180,360,g.total,g.rotation,...(g.mode==='panel'?[g.walk*90]:[])].includes(Number(match[1])),'symbolic source uses only explicit degree facts');
 const ordered=[`${crossingCopy.title}. Polygon frames.`,g.source,g.definition,g.naming,g.chosen,...(g.current?[g.current]:[]),...(g.counter?[g.counter]:[]),g.text,...g.equations,...(g.perTurn?[g.perTurn]:[]),...(g.fractionNote?[g.fractionNote]:[]),g.prompt.title,g.prompt.text,'Ideal straight-sided polygons',crossingCopy.lifetime,'Back to Copy Frame.'];let at=-1;for(const part of ordered){const next=hear.indexOf(part,at+1);assert.ok(next>at,`Hear order: ${part}`);at=next;}
 assert.ok(!hear.includes('Separate worked example'));assert.ok(!hear.includes('a at A; b'));
}
// Actual SVG readback at representative extremes: independent expected vertices,
// rays and marker, then the drawing's numeric path endpoints and arrow branches.
function expectedPoly(raw,rotation,radius){
 const centroid=[0,1].map(d=>raw.reduce((s,p)=>s+p[d],0)/raw.length),ps=raw.map(p=>p.map((v,d)=>v-centroid[d])),factor=radius/Math.max(...ps.map(p=>Math.hypot(...p))),r=rotation*Math.PI/180;
 return ps.map(([x,y])=>[320+factor*(x*Math.cos(r)-y*Math.sin(r)),280-factor*(x*Math.sin(r)+y*Math.cos(r))]);
}
for(const w of [
 {...poly,polySides:3,polyCorner:2,polySize:'small',rotation:330},
 {...poly,polySides:12,polyCorner:11,polyDraw:9,rotation:210},
 {...poly,polySides:11,polyCorner:7,polyKind:'stretched',polyView:'corner',rotation:90},
 {...poly,polySides:4,polyView:'corner'},
 ...[0,1,4].map(polyPanelWalk=>({...poly,triMode:'panel',polyView:'walk',polyPanelCorner:3,polyPanelWalk,rotation:300})),
 {...poly,triMode:'panel',polyView:'corner',polyPanelCorner:2,rotation:30},
 {...poly,triMode:'panel',polyView:'split',polyPanelDraw:1}
]){
 const c=captureCrossingPanel({originalWidth:8,originalHeight:3,width:1,height:12},'Thin SVG rectangle'),g=polygon(w,c),html=renderCrossingAngles(w,c),n=g.n;
 const raw=g.mode==='panel'?[[0,0],[1,0],[1,12],[0,12]]:Array.from({length:n},(_,i)=>[(g.kind==='regular'?1:1.6)*Math.cos((90+360*i/n)*Math.PI/180),Math.sin((90+360*i/n)*Math.PI/180)]),expected=expectedPoly(raw,w.rotation,g.size==='small'?120:160);
 const outline=nums(html.match(/<polygon data-polygon-outline points="([^"]+)"/)[1]);outline.forEach((v,i)=>almost(v,expected.flat()[i],'SVG independently projected polygon vertex'));
 const lineById=id=>{const m=html.match(new RegExp(`<line data-polygon-line="${id}"[^>]*x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"`));return m?.slice(1).map(Number);};
 for(let d=0;d<g.diagonals.length;d++){const values=lineById(`diagonal-${d}`);[...expected[g.corner],...expected[(g.corner+d+2)%n]].forEach((v,i)=>almost(values[i],v,'SVG fan diagonal endpoints'));}
 const sector=g.interior||g.exterior;
 if(sector){const values=nums(html.match(/data-polygon-sector="[^"]+"[^>]*d="([^"]+)"/)[1]),i=g.view==='walk'?(g.corner+g.walk)%n:g.corner,e=edgeFacts(expected)[i],incoming=e.incoming,bearing=Math.atan2(-incoming[1],incoming[0])*180/Math.PI,start=g.interior?bearing+e.exterior:bearing,sweep=g.interior?e.interior:e.exterior;
  const first=polar(expected[i],start,sector.radius/(sector.right?Math.sqrt(2):1)),last=polar(expected[i],start+sweep,sector.radius/(sector.right?Math.sqrt(2):1));
  pointClose(values.slice(0,2),expected[i],'SVG selected sector at correct original corner');pointClose(values.slice(2,4),first,'SVG selected sector incoming boundary');pointClose(values.slice(-2),last,'SVG selected sector outgoing boundary');
  if(!sector.right){assert.equal(values[8],0,'exterior and interior use positive minor turn');assert.equal(values[7],0);}
 }
 if(g.marker){const i=(g.corner+g.walk)%n,e=edgeFacts(expected)[i],incoming=e.incoming.map(v=>v/Math.hypot(...e.incoming)),out=e.outgoing.map(v=>v/Math.hypot(...e.outgoing)),p=[-incoming[1],incoming[0]],q=[-out[1],out[0]],rho=Math.min(24,.35*Math.min(Math.hypot(...e.incoming),Math.hypot(...e.outgoing))),M=expected[i].map((v,d)=>v+(rho+8)*p[d]);
  const heading=lineById('marker-heading'),leader=lineById('marker-leader');[...expected[i],...M].forEach((v,j)=>almost(leader[j],v,'SVG marker leader'));
  [...M.map((v,d)=>v-7*out[d]),...M.map((v,d)=>v+7*out[d])].forEach((v,j)=>almost(heading[j],v,'SVG marker heading'));
  const arrow=nums(html.match(/data-polygon-arrow d="([^"]+)"/)[1]),expectedArrow=[...M.map((v,d)=>v+2*out[d]+4*q[d]),...M.map((v,d)=>v+7*out[d]),...M.map((v,d)=>v+2*out[d]-4*q[d])];arrow.forEach((v,j)=>almost(v,expectedArrow[j],'SVG arrow actual branch'));
 }
}
console.log('Polygon Frames: finite convex/fan/turn geometry, actual SVG, exact arithmetic, active-channel invariance, strict reducer ownership and current Hear passed.');

// Read the enlarged heading itself; derive its expected direction from the
// independent projected polygon edge, never a repeated direction attribute.
const directionCases=[
 [{...poly,polySides:5,polyCorner:2,rotation:30},null],
 [{...poly,polySides:12,polyCorner:11,polySize:'small',rotation:330},null],
 [{...poly,polySides:7,polyKind:'stretched',polyCorner:6,rotation:90},null],
 [{...poly,polySides:11,polyKind:'stretched',polyCorner:3,rotation:210},null],
 ...[[1,12,30,3],[12,1,300,0],[4,4,90,2]].map(([width,height,rotation,polyPanelCorner])=>[
  {...poly,triMode:'panel',rotation,polyPanelCorner},captureCrossingPanel({originalWidth:8,originalHeight:3,width,height},'Direction reference panel')
 ])
];
for(const [base,context] of directionCases){
 const n=base.triMode==='panel'?4:base.polySides,a=base.triMode==='panel'?base.polyPanelCorner:base.polyCorner;
 const raw=context?[[0,0],[context.width,0],[context.width,context.height],[0,context.height]]:Array.from({length:n},(_,i)=>[(base.polyKind==='regular'?1:1.6)*Math.cos((90+360*i/n)*Math.PI/180),Math.sin((90+360*i/n)*Math.PI/180)]);
 const expected=expectedPoly(raw,base.rotation,base.polySize==='small'?120:160);
 let startingInset;
 for(const step of [0,1,n]){
  const work={...base,polyView:'walk',...(context?{polyPanelWalk:step}:{polyWalk:step})},html=renderCrossingAngles(work,context);
  const insets=[...html.matchAll(/<svg\b([^>]*\bdata-polygon-direction-inset\b[^>]*)>([\s\S]*?)<\/svg>/g)];assert.equal(insets.length,1,'one enlarged heading for the current walking stop');
  const [,attributes,svg]=insets[0];assert.ok(/viewBox="0 0 64 64"/.test(attributes));assert.ok(/\bwidth="64"/.test(attributes));assert.ok(/\bheight="64"/.test(attributes));
  assert.ok(!/\btransform=/.test(attributes+svg),'inset has direct inspectable drawing coordinates');
  const i=(a+step)%n,edge=sub(expected[(i+1)%n],expected[i]),d=edge.map(v=>v/Math.hypot(...edge)),q=[-d[1],d[0]];
  const line=svg.match(/<line\b[^>]*\bdata-polygon-direction-heading\b[^>]*>/)?.[0];assert.ok(line,'actual inset shaft exists');
  const drawn=['x1','y1','x2','y2'].map(key=>Number(line.match(new RegExp(`\\b${key}="([^"]+)"`))[1]));
  const shaft=[32-20*d[0],32-20*d[1],32+20*d[0],32+20*d[1]];drawn.forEach((value,j)=>almost(value,shaft[j],'enlarged shaft follows outgoing boundary edge'));
  almost(Math.hypot(drawn[2]-drawn[0],drawn[3]-drawn[1]),40,'readable forty-unit inset shaft');assert.ok(dot(sub(drawn.slice(2),drawn.slice(0,2)),edge)>0,'enlarged arrow points along the next side');
  const path=svg.match(/<path\b[^>]*\bdata-polygon-direction-arrow\b[^>]*>/)?.[0];assert.ok(path,'actual inset arrowhead exists');
  const arrow=nums(path.match(/\bd="([^"]+)"/)[1]),head=[32+8*d[0]+8*q[0],32+8*d[1]+8*q[1],32+20*d[0],32+20*d[1],32+8*d[0]-8*q[0],32+8*d[1]-8*q[1]];
  assert.equal(arrow.length,6);arrow.forEach((value,j)=>almost(value,head[j],'enlarged arrowhead branches'));
  if(step===0)startingInset=svg;else if(step===n)assert.equal(svg,startingInset,'full lap restores enlarged starting direction');
 }
}
for(const work of [initial,{...initial,page:'learn'},{...initial,page:'parallel'},...['gather','reason','outside'].map(triView=>({...poly,triView})),...['split','corner'].map(polyView=>({...poly,polyView})),{...poly,triMode:'panel',polyView:'walk'}])assert.ok(!renderCrossingAngles(work).includes('data-polygon-direction-inset'),'enlarged heading absent outside readable Walk');
console.log('Polygon Frames enlarged heading: actual SVG coordinates follow independent outgoing edges at start, turn and completed lap; absent outside readable Walk.');

// Matching Triangles expectations start with the authored mathematical parts,
// independently of the model's guides, lengths, sectors or projected vertices.
const matching={...initial,page:'matching'};
const matchCases=['sss','sas','asa','aas','rhs','ssa','aaa'];
const radians=d=>d*Math.PI/180;
const matchU=5*Math.sin(radians(60))*Math.cos(radians(50))/Math.sin(radians(70));
const matchV=5*Math.sin(radians(60))*Math.sin(radians(50))/Math.sin(radians(70));
function rawMatching(kind,variant=0){
 let reference=kind==='sss'?[[0,0],[5,0],[16/5,12/5]]:kind==='sas'?[[0,0],[8,0],[2.5,2.5*Math.sqrt(3)]]:kind==='rhs'?[[0,0],[4,3],[4,0]]:kind==='ssa'?[[0,0],[3*Math.sqrt(3)+Math.sqrt(7),0],[3*Math.sqrt(3),3]]:[[0,0],[5,0],[matchU,matchV]];
 let candidate=reference.map(p=>[...p]);
 if(kind==='ssa'&&variant%2)candidate[1][0]=3*Math.sqrt(3)-Math.sqrt(7);
 if(kind==='aaa'&&variant%2)candidate=candidate.map(p=>p.map(v=>v*8/5));
 if(variant>=(['ssa','aaa'].includes(kind)?2:1))candidate=candidate.map(([x,y])=>[x,-y]);
 return {reference,candidate};
}
const matchCentroid=ps=>[0,1].map(d=>ps.reduce((n,p)=>n+p[d],0)/3);
const matchLengths=ps=>[Math.hypot(...sub(ps[1],ps[0])),Math.hypot(...sub(ps[2],ps[0])),Math.hypot(...sub(ps[2],ps[1]))];
const matchAngle=(ps,i)=>{const a=sub(ps[(i+1)%3],ps[i]),b=sub(ps[(i+2)%3],ps[i]);return Math.acos(Math.max(-1,Math.min(1,dot(a,b)/(Math.hypot(...a)*Math.hypot(...b)))))*180/Math.PI;};
function matchPose(raw,scale,rotation=0,flip=false,center=[320,280]){
 const c=matchCentroid(raw),t=radians(rotation);
 return raw.map(p=>{const x=p[0]-c[0],y=(p[1]-c[1])*(flip?-1:1);return [center[0]+scale*(x*Math.cos(t)-y*Math.sin(t)),center[1]-scale*(x*Math.sin(t)+y*Math.cos(t))];});
}
const matchWork=(delta={},channel={})=>({...matching,matching:{...matching.matching,...delta,parts:{...matching.matching.parts,...channel},panel:{...matching.matching.panel,...delta.panel}}});
const matchModel=(w,c=null)=>crossingAnglesModel(w,c).matching;
const matchBuildPoint=([x,y])=>[200+28*x,340-28*y];
const matchSame=(kind,v)=>!(['ssa','aaa'].includes(kind)&&v%2===1);

// Validate every nested field before any page can model or reduce the visit.
for(const invalid of [null,[],{},'parts',true]){
 const w={...matching,matching:invalid};assert.equal(crossingAnglesModel(w),null);assert.equal(changeCrossingAngles(w,'page','build'),w);assert.equal(crossingAnglesNarration(w),'');
}
for(const [key,invalids] of [['mode',['free',0,null]],['view',['compare',0,null]],['fit',['auto',true,null]],['case',['SSS','constructor',null]],['prompt',[-1,6,1.5,'1',NaN,Infinity,true]]])for(const value of invalids){
 const w=matchWork({[key]:value});assert.equal(crossingAnglesModel(w),null);assert.equal(changeCrossingAngles(w,'match-mode','panel'),w);
}
for(const channel of ['parts','panel']){
 for(const bad of [null,[],{},false]){const w=matchWork();w.matching[channel]=bad;assert.equal(crossingAnglesModel(w),null);assert.equal(changeCrossingAngles(w,'page','build'),w);}
 for(const [key,invalids] of [['step',[-1,3,1.5,'1',false,NaN]],['rotation',[-30,360,15,'30',true,Infinity]],['flip',[0,1,'true',null]],['move',[-1,5,1.5,'1',true]],['pair',[-1,3,1.5,'1',false]]])for(const bad of invalids){
  const w=matchWork();w.matching[channel]={...w.matching[channel],[key]:bad};assert.equal(crossingAnglesModel(w),null);assert.equal(changeCrossingAngles(w,'match-prompt',1),w);
 }
}
for(const kind of matchCases)for(const variant of [-1,['ssa','aaa'].includes(kind)?4:2,0.5,'1',true,NaN])assert.equal(crossingAnglesModel(matchWork({case:kind},{variant})),null);
for(const page of ['build','learn','parallel','triangle']){
 const w={...matching,page};assert.equal(crossingAnglesModel(w).matching,null);
 for(const [action,value] of [['match-mode','panel'],['match-view','fit'],['match-prompt',2],['match-case','sas'],['match-variant',1],['match-step',1],['match-pair',1],['match-fit','given'],['match-rotation',30],['match-move',1],['match-flip',undefined],['match-home',undefined]])assert.equal(changeCrossingAngles(w,action,value),w);
}
for(const [action,value] of [['angle',90],['rotation',30],['turn',undefined],['pair','adjacent'],['prompt',1],['card',3],['step',1],['two-mode','panel'],['two-move',1],['tri-mode','panel'],['tri-view','outside'],['tri-a',45],['poly-view','walk'],['poly-prompt',1]])assert.equal(changeCrossingAngles(matching,action,value),matching,'older controls do not own matching');
for(const mode of ['parts','panel'])for(const view of ['build','fit','letters'])for(const fit of ['explore','given']){
 const w=matchWork({mode,view,fit});
 for(const [action,value,allowed,key] of [['match-step',2,view==='build','step'],['match-pair',2,view==='letters','pair'],['match-rotation',330,view==='fit'&&fit==='explore','rotation'],['match-move',4,view==='fit'&&fit==='explore','move']]){
  const next=changeCrossingAngles(w,action,value);if(!allowed)assert.equal(next,w);else {assert.deepEqual(next,{...w,matching:{...w.matching,[mode]:{...w.matching[mode],[key]:value}}});assert.equal(changeCrossingAngles(next,action,value),next);assert.equal(next.matching[mode==='parts'?'panel':'parts'],w.matching[mode==='parts'?'panel':'parts']);}
 }
 for(const action of ['match-flip','match-home']){const next=changeCrossingAngles(w,action);if(view!=='fit'||fit!=='explore'||action==='match-home')assert.equal(next,w);else assert.equal(next.matching[mode].flip,false);assert.equal(changeCrossingAngles(w,action,1),w);}
 for(const [action,value] of [['match-step','1'],['match-pair',3],['match-rotation',15],['match-move',5],['match-fit','bad'],['match-mode',false],['match-view','compare'],['match-case','bad'],['match-prompt',6],['match-variant',4]])assert.equal(changeCrossingAngles(w,action,value),w);
 assert.equal(changeCrossingAngles(w,'match-case','sas')===w,mode==='panel');
 assert.equal(changeCrossingAngles(w,'match-variant',1)===w,mode==='panel');
 assert.equal(changeCrossingAngles(w,'match-fit','given')===w,view!=='fit'||fit==='given');
}
const matchHeld=matchWork({mode:'parts',view:'letters',fit:'given',prompt:5,panel:{step:2,rotation:30,flip:false,move:4,pair:2}},{variant:1,step:2,rotation:330,flip:false,move:4,pair:2});
assert.equal(changeCrossingAngles(matchHeld,'match-case','sss'),matchHeld,'same card never resets held work');
assert.deepEqual(changeCrossingAngles(matchHeld,'match-case','ssa'),{...matchHeld,matching:{...matchHeld.matching,case:'ssa',parts:{...initial.matching.parts}}});
assert.deepEqual(changeCrossingAngles(matchHeld,'match-variant',0),{...matchHeld,matching:{...matchHeld.matching,parts:{...matchHeld.matching.parts,variant:0}}});
const matchManual=matchWork({view:'fit'},{step:2,rotation:330,flip:false,move:4,pair:2});
assert.deepEqual(changeCrossingAngles(matchManual,'match-home'),{...matchManual,matching:{...matchManual.matching,parts:{...matchManual.matching.parts,rotation:120,flip:true,move:0}}});

// One input at a time: complete output must depend only on the active source
// and view. This catches a hidden channel leaking into speech or help as well
// as geometry, without multiplying every unrelated setting together.
const matchOldDeltas=[{angle:105},{rotation:330},{pair:'adjacent'},{prompt:5},{card:3,step:2},{twoMode:'panel'},{twoSpacing:'far'},{twoLean:10},{twoPair:'co-interior'},{twoMove:4},{twoPrompt:5},{triMode:'panel'},{triView:'outside'},{triA:45},{triB:75},{triSize:'small'},{triGather:2},{triProof:2},{triPrompt:5},{polySides:12,polyCorner:11,polyDraw:9,polyWalk:12},{polyKind:'stretched'},{polySize:'small'},{polyView:'walk'},{polyPrompt:5},{polyPanelCorner:3},{polyPanelDraw:1},{polyPanelWalk:4}];
const matchContexts=[null,captureCrossingPanel({originalWidth:9,originalHeight:7,width:1,height:12},'Tall waiting source'),captureCrossingPanel({originalWidth:2,originalHeight:11,width:12,height:1},'Wide waiting source')];
function assertMatchInvariant(base,context,changes){
 const expected=matchModel(base,context),html=renderCrossingAngles(base,context),hear=crossingAnglesNarration(base,context);
 for(const [w,c] of changes){assert.deepEqual(matchModel(w,c),expected);assert.equal(renderCrossingAngles(w,c),html);assert.equal(crossingAnglesNarration(w,c),hear);}
 for(const forbidden of [crossingCopy.straightTurn,crossingCopy.panelWaitingNote,crossingCopy.panelNote,crossingCards[3].text])if(forbidden)assert.ok(!html.includes(forbidden)&&!hear.includes(forbidden),'matching excludes original-frame and old teaching material');
 assert.match(html,/<h1 id="crossing-angles-title"[^>]*>Matching triangles<\/h1>/);
}
for(const mode of ['parts','panel'])for(const view of ['build','fit','letters'])for(const fit of ['explore','given']){
 const w=matchWork({mode,view,fit},{step:1,pair:1}),c=matchContexts[1],changes=matchOldDeltas.map(delta=>[{...w,...delta},c]);
 const inactive=mode==='parts'?'panel':'parts';
 for(const delta of [{step:2},{rotation:330},{flip:false},{move:4},{pair:2},...(inactive==='parts'?[{variant:1}]:[])])changes.push([{...w,matching:{...w.matching,[inactive]:{...w.matching[inactive],...delta}}},c]);
 if(mode==='panel')for(const delta of [{case:'aaa'},{case:'ssa'}])changes.push([{...w,matching:{...w.matching,...delta}},c]);
 else for(const context of matchContexts)changes.push([w,context]);
 if(mode==='panel')for(const delta of [{originalWidth:1},{originalHeight:12}])changes.push([w,{...c,...delta}]);
 const ignored=view==='build'?['rotation','flip','move','pair']:view==='letters'||fit==='given'?['step','rotation','flip','move',...(view==='fit'?['pair']:[])]:['step','pair'];
 for(const key of ignored)changes.push([{...w,matching:{...w.matching,[mode]:{...w.matching[mode],[key]:{step:2,rotation:330,flip:false,move:4,pair:2}[key]}}},c]);
 if(view!=='fit')changes.push([{...w,matching:{...w.matching,fit:fit==='given'?'explore':'given'}},c]);
 assertMatchInvariant(w,c,changes);
}
// Old pages ignore even valid matching changes, including source-independent
// changes to its case, view, prompt and each held channel.
for(const old of [initial,panelWork,parallel,triangle,poly]){
 const html=renderCrossingAngles(old,capture),hear=crossingAnglesNarration(old,capture);
 for(const matching of [matchWork({case:'aaa',view:'letters',prompt:5},{variant:3,step:2,rotation:330,flip:false,move:4,pair:2}).matching,matchWork({mode:'panel',view:'fit',fit:'given',panel:{step:2,rotation:30,flip:false,move:3,pair:2}}).matching]){
  const w={...old,matching};assert.equal(renderCrossingAngles(w,capture),html);assert.equal(crossingAnglesNarration(w,capture),hear);
 }
}
const matchMissing='Your waiting panel could not be copied. Choose Parts cards, or go back to Copy Frame.';
for(const view of ['build','fit','letters'])for(const fit of ['explore','given'])for(const delta of [{},{case:'aaa',prompt:5,panel:{step:2,rotation:330,flip:false,move:4,pair:2}}]){
 const w=matchWork({mode:'panel',view,fit,...delta},{variant:1,step:2,rotation:300,flip:false,move:4,pair:2});
 for(const c of [null,{},[],{...capture,width:0},{...capture,height:'6'},{...capture,originalWidth:13}]){
  assert.deepEqual(matchModel(w,c),{mode:'panel',missing:true});
  assert.equal(crossingAnglesNarration(w,c),`Matching triangles. ${matchMissing} ${crossingCopy.lifetime} Back to Copy Frame.`);
  const html=renderCrossingAngles(w,c),region=html.match(/<div data-crossing-angles-matching-region>([\s\S]*?)<\/div>/)?.[1];assert.equal(region,`<p>${matchMissing}</p>`);
  assert.ok(!html.includes('<svg'),'missing context never invents a triangle');
 }
}

function verifyMatchDrawing(g,html){
 const tags=[...html.matchAll(/<(circle|line|polygon|polyline)\b([^>]+)>/g)];
 const attr=(s,k)=>s.match(new RegExp(`(?:^|\\s)${k}="([^"]*)"`))?.[1];
 const one=(key,value)=>{const found=tags.filter(t=>value===undefined?new RegExp(`(?:^|\\s)${key}(?:\\s|$)`).test(t[2]):attr(t[2],key)===value);assert.equal(found.length,1,`${key} ${value} drawn exactly once`);return found[0][2];};
 const points=(s,expected,label)=>{const actual=nums(attr(s,'points'));assert.equal(actual.length,expected.flat().length);actual.forEach((v,i)=>almost(v,expected.flat()[i],label));};
 for(const role of ['reference','candidate'])if(g[role])points(one('data-matching-outline',role),g[role].points,'actual SVG outline');
 g.circles.forEach((c,i)=>{const t=one('data-matching-guide',`circle-${i}`);pointClose(['cx','cy'].map(k=>+attr(t,k)),c.center,'actual guide center');almost(+attr(t,'r'),c.radius,'actual guide radius');});
 for(const kind of ['rays','segments'])g[kind].forEach((r,i)=>{const t=one('data-matching-guide',`${kind==='rays'?'ray':'segment'}-${i}`);pointClose(['x1','y1'].map(k=>+attr(t,k)),r.start,'actual line start');pointClose(['x2','y2'].map(k=>+attr(t,k)),r.end,'actual line end');});
 g.meetings.forEach((m,i)=>{const t=one('data-matching-meeting',String(i));pointClose(['cx','cy'].map(k=>+attr(t,k)),m.point,'actual meeting');assert.equal(attr(t,'class').includes('ca-matching-selected'),m.selected);});
 for(const r of g.rightMarks)points(one('data-matching-right',r.role),r.points,'actual right square');
 if(g.rectangle)points(one('data-matching-rectangle'),g.rectangle,'actual panel corners');
 if(g.diagonal){const t=one('data-matching-diagonal');pointClose(['x1','y1'].map(k=>+attr(t,k)),g.diagonal.start,'actual diagonal start');pointClose(['x2','y2'].map(k=>+attr(t,k)),g.diagonal.end,'actual diagonal end');}
 assert.equal(tags.filter(t=>attr(t[2],'data-matching-guide')?.startsWith('circle-')).length,g.circles.length);
 assert.equal(tags.filter(t=>attr(t[2],'data-matching-guide')?.startsWith('ray-')).length,g.rays.length);
 assert.equal(tags.filter(t=>attr(t[2],'data-matching-meeting')!==undefined).length,g.meetings.length);
 assert.equal(tags.filter(t=>attr(t[2],'data-matching-right')!==undefined).length,g.rightMarks.length);
}
function expectedMatchRight(ps,index){
 const corner=ps[index],unit=i=>{const d=sub(ps[i],corner),n=Math.hypot(...d);return d.map(v=>12*v/n);},u=unit((index+1)%3),v=unit((index+2)%3);
 return [[corner[0]+u[0],corner[1]+u[1]],[corner[0]+u[0]+v[0],corner[1]+u[1]+v[1]],[corner[0]+v[0],corner[1]+v[1]]];
}
function verifyMatchRight(g,index){
 assert.equal(g.rightMarks.length,index===null?0:Number(!!g.reference)+Number(!!g.candidate));
 for(const r of g.rightMarks){const expected=expectedMatchRight(g[r.role].points,index);r.points.forEach((p,i)=>pointClose(p,expected[i],'right square follows both incident sides, including clockwise RHS'));}
}
function expectedBuild(kind,variant,step){
 const {candidate:p}=rawMatching(kind,variant),lower=variant>=(['ssa','aaa'].includes(kind)?2:1),sign=lower?-1:1;
 const circles=[],rays=[],meetings=[],segments=step===2?[]:[[p[0],p[['rhs','ssa'].includes(kind)?2:1]]];
 const ray=(origin,angle,length)=>rays.push([origin,[origin[0]+length*Math.cos(radians(angle)),origin[1]+length*Math.sin(radians(angle))]]);
 if(kind==='ssa')ray([0,0],0,9);
 if(step>=1){
  if(kind==='sss'){circles.push([[0,0],4],[[5,0],3]);meetings.push(p[2],[16/5,-sign*12/5]);}
  if(kind==='sas'){ray([0,0],sign*60,6);circles.push([[0,0],5]);meetings.push(p[2]);}
  if(['asa','aas','aaa'].includes(kind)){ray([0,0],sign*50,8);if(kind!=='aas'||step===2){ray(p[1],sign*120,8);meetings.push(p[2]);}}
  if(kind==='rhs'){circles.push([[0,0],5]);rays.push([[4,-4],[4,4]]);meetings.push(p[1],[4,-sign*3]);}
  if(kind==='ssa'){circles.push([p[2],4]);meetings.push(p[1],[3*Math.sqrt(3)+(variant%2?1:-1)*Math.sqrt(7),0]);}
 }
 return {p,circles,rays,meetings,segments};
}
for(const kind of matchCases)for(let variant=0;variant<(['ssa','aaa'].includes(kind)?4:2);variant++){
 const raw=rawMatching(kind,variant),lengths=matchLengths(raw.candidate),referenceLengths=matchLengths(raw.reference),same=lengths.every((v,i)=>Math.abs(v-referenceLengths[i])<1e-9);
 assert.equal(same,matchSame(kind,variant));
 if(kind==='sss')lengths.forEach((v,i)=>close(v,[5,4,3][i],'SSS exact lengths'));
 if(kind==='sas'){close(lengths[0],8,'SAS baseline');close(lengths[1],5,'SAS given leg');close(matchAngle(raw.candidate,0),60,'included SAS angle');close(lengths[2],7,'internal derived SAS third side');}
 if(['asa','aas','aaa'].includes(kind)){[50,60,70].forEach((v,i)=>close(matchAngle(raw.candidate,i),v,'exact chosen angles'));close(lengths[0],kind==='aaa'&&variant%2?8:5,'chosen baseline');}
 if(kind==='rhs'){close(lengths[0],5,'RHS hypotenuse');close(lengths[1],4,'RHS known leg');close(matchAngle(raw.candidate,2),90,'RHS right F');}
 if(kind==='ssa'){
  const near=3*Math.sqrt(3)-Math.sqrt(7),far=3*Math.sqrt(3)+Math.sqrt(7);assert.ok(near>0&&far>near);close(lengths[1],6,'SSA fixed DF');close(lengths[2],4,'SSA circle EF');close(matchAngle(raw.candidate,0),30,'SSA nonincluded angle');close(raw.candidate[1][0],variant%2?near:far,'analytic circle/ray root');
 }
 for(let step=0;step<=2;step++){
  const w=matchWork({case:kind},{variant,step}),m=matchModel(w),g=m.geometry,e=expectedBuild(kind,variant,step);
  assert.equal(g.reference,null);assert.equal(!!g.candidate,step===2);if(g.candidate)g.candidate.points.forEach((p,i)=>pointClose(p,matchBuildPoint(e.p[i]),'Build selected raw vertices'));
  assert.equal(g.circles.length,e.circles.length);g.circles.forEach((c,i)=>{pointClose(c.center,matchBuildPoint(e.circles[i][0]),'determining circle true center');close(c.radius,28*e.circles[i][1],'determining circle distance');});
  assert.equal(g.rays.length,e.rays.length);g.rays.forEach((r,i)=>{pointClose(r.start,matchBuildPoint(e.rays[i][0]),'determining ray origin');pointClose(r.end,matchBuildPoint(e.rays[i][1]),'determining ray analytic direction/length');});
  assert.equal(g.segments.length,e.segments.length);g.segments.forEach((r,i)=>{pointClose(r.start,matchBuildPoint(e.segments[i][0]),'first fixed side start');pointClose(r.end,matchBuildPoint(e.segments[i][1]),'first fixed side end');});
  assert.equal(g.meetings.length,e.meetings.length);g.meetings.forEach((p,i)=>pointClose(p.point,matchBuildPoint(e.meetings[i]),'independent true meeting'));
  const names=step===0?(['rhs','ssa'].includes(kind)?['D','F']:['D','E']):kind==='aas'&&step===1?['D','E']:['D','E','F'];assert.deepEqual(g.labels.map(l=>l.name).sort(),names.sort(),'unplaced point has no label');
  assert.equal(g.rightMarks.length,kind==='rhs'&&step>0?1:0,'only given right angles receive marks');
  if(g.rightMarks.length)g.rightMarks[0].points.forEach((p,i)=>pointClose(p,expectedMatchRight(e.p.map(matchBuildPoint),2)[i],'Build RHS square actual F'));
  for(const p of [...g.rays.flatMap(r=>[r.start,r.end]),...g.meetings.map(m=>m.point),...g.labels.map(l=>l.anchor),...g.segments.flatMap(s=>[s.start,s.end])])assert.ok(p[0]>=0&&p[0]<=640&&p[1]>=0&&p[1]<=560,'complete finite Build bounds');
  for(const c of g.circles)assert.ok(c.center[0]-c.radius>=0&&c.center[0]+c.radius<=640&&c.center[1]-c.radius>=0&&c.center[1]+c.radius<=560,'entire guide circle visible');
  verifyMatchDrawing(g,renderCrossingAngles(w));
 }
 for(const view of ['fit','letters']){
  const w=matchWork({case:kind,view,fit:'given'},{variant,step:0,pair:2}),m=matchModel(w),g=m.geometry,rp=matchPose(raw.reference,40),upper=raw.candidate.map(([x,y])=>[x,Math.abs(y)]),cp=upper.map(p=>[rp[0][0]+40*p[0],rp[0][1]-40*p[1]]);
  g.reference.points.forEach((p,i)=>pointClose(p,rp[i],'one fixed reference scale'));g.candidate.points.forEach((p,i)=>pointClose(p,cp[i],'provided pose aligns D=A without resize'));
  assert.equal(m.relationship,same?'same':'different');assert.ok(same?/(?:same shape and size|matches the reference)/.test(m.currentPair):/different (?:base lengths|sizes)/.test(m.currentPair),'current-pair prose agrees with independently corresponding lengths');assert.ok(m.reasonLabel.length>0);assert.ok(crossingAnglesNarration(w).includes(m.currentPair));assert.ok(crossingAnglesNarration(w).includes(m.completedNotice));
  assert.equal(g.labels.filter(l=>l.selected).length,view==='letters'?2:0);if(view==='letters')assert.deepEqual(g.labels.filter(l=>l.selected).map(l=>l.name),['C','F']);
  if(kind==='ssa')pointClose(g.candidate.points[2],g.reference.points[2],'both SSA closures line up fixed DF');
  for(const p of [...g.reference.points,...g.candidate.points])assert.ok(p[0]>=0&&p[0]<=640&&p[1]>=0&&p[1]<=560,'provided comparison bounds, including AAA eight');
  verifyMatchRight(g,kind==='rhs'?2:null);verifyMatchDrawing(g,renderCrossingAngles(w));
 }
 for(let rotation=0;rotation<360;rotation+=30)for(const flip of [false,true])for(let move=0;move<=4;move++){
  const w=matchWork({case:kind,view:'fit'},{variant,rotation,flip,move}),g=matchModel(w).geometry,expected=matchPose(raw.candidate,40,rotation,flip,[400-20*move,280]);
  g.candidate.points.forEach((p,i)=>pointClose(p,expected[i],'manual pose is an isometry using common scale'));
  matchLengths(g.candidate.points).forEach((v,i)=>close(v,40*lengths[i],'every manual pose preserves length'));
  for(const p of [...g.reference.points,...g.candidate.points])assert.ok(p[0]>=0&&p[0]<=640&&p[1]>=0&&p[1]<=560,'every manual pose remains in stage');
  verifyMatchRight(g,kind==='rhs'?2:null);
  if(rotation===330&&flip&&move===0)verifyMatchDrawing(g,renderCrossingAngles(w));
 }
}
for(let width=1;width<=12;width++)for(let height=1;height<=12;height++){
 const c=captureCrossingPanel({originalWidth:13-width,originalHeight:13-height,width,height},'Waiting geometry source'),raw={reference:[[0,0],[width,0],[width,height]],candidate:[[width,height],[0,height],[0,0]]};
 const radius=Math.max(...[raw.reference,raw.candidate].flatMap(ps=>{const center=matchCentroid(ps);return ps.map(p=>Math.hypot(...sub(p,center)));})),scale=180/radius;
 for(let step=0;step<=2;step++){
  const w=matchWork({mode:'panel',panel:{step}}),g=matchModel(w,c).geometry,expected=[[0,0],[width,0],[width,height],[0,height]].map(([x,y])=>[320+24*(x-width/2),280-24*(y-height/2)]);
  g.rectangle.forEach((p,i)=>pointClose(p,expected[i],'panel build true aspect/constant scale'));assert.equal(!!g.diagonal,step>0);if(g.diagonal){pointClose(g.diagonal.start,expected[0],'PR start');pointClose(g.diagonal.end,expected[2],'PR end');}
  assert.equal(!!g.candidate,step===2);assert.deepEqual(g.labels.map(l=>l.name),['P','Q','R','S']);
  const rightPoints=[expectedMatchRight([expected[0],expected[1],expected[2]],1),expectedMatchRight([expected[2],expected[3],expected[0]],1)];g.rightMarks.forEach((r,i)=>r.points.forEach((p,j)=>pointClose(p,rightPoints[i][j],'panel known right Q/S = B/E')));
  if(width===1||height===1||width===height)verifyMatchDrawing(g,renderCrossingAngles(w,c));
 }
 for(const view of ['fit','letters']){
  const w=matchWork({mode:'panel',view,fit:'given'}),m=matchModel(w,c),g=m.geometry,rp=matchPose(raw.reference,scale);
  g.reference.points.forEach((p,i)=>pointClose(p,rp[i],'panel comparison common radius scale'));g.candidate.points.forEach((p,i)=>pointClose(p,rp[i],'180 degree provided half alignment'));
  assert.equal(m.relationship,'same');verifyMatchRight(g,1);
  if(width===1||height===1||width===height)verifyMatchDrawing(g,renderCrossingAngles(w,c));
 }
 for(let rotation=0;rotation<360;rotation+=30)for(const flip of [false,true])for(let move=0;move<=4;move++){
  const w=matchWork({mode:'panel',view:'fit',panel:{rotation,flip,move}}),g=matchModel(w,c).geometry,expected=matchPose(raw.candidate,scale,rotation,flip,[400-20*move,280]);
  g.candidate.points.forEach((p,i)=>pointClose(p,expected[i],'every panel isometry preserves one shared source scale'));
  for(const p of [...g.candidate.points,...g.reference.points])assert.ok(p[0]>=0&&p[0]<=640&&p[1]>=0&&p[1]<=560,'panel manual bound');
  if(rotation===330&&flip&&move===0&&(width===1||height===1||width===height)){verifyMatchRight(g,1);verifyMatchDrawing(g,renderCrossingAngles(w,c));}
 }
}
// Visible numbers are exact givens, chosen baselines, derivations or finite
// control counters. Keep SVG descriptions, aria and speech in the scan; remove
// actual geometry/style fields and form values, not whole SVG elements.
for(const kind of matchCases)for(let variant=0;variant<(['ssa','aaa'].includes(kind)?4:2);variant++)for(const view of ['build','fit','letters'])for(const step of [0,1,2]){
 const w=matchWork({case:kind,view},{variant,step}),m=matchModel(w),html=renderCrossingAngles(w),hear=crossingAnglesNarration(w);
 const meaningful=html.replace(/\s(?:d|points|x|y|x1|y1|x2|y2|cx|cy|r|width|height|viewBox|data-ca-x|data-ca-y|style|value|data-crossing-angles-value|data-matching-meeting|data-ca-label|data-ca-leader)="[^"]*"/g,'');
 assert.ok(!/\d+\.\d+/.test(meaningful+' '+hear),'no floating measurements in any text channel');
 for(const token of [...(meaningful+' '+hear).matchAll(/(\d+)\s*°/g)])assert.ok([0,30,50,60,70,90,120,180].includes(+token[1]),`only exact given/derived/orientation angle: ${token[0]}`);
 if(kind==='sss')assert.ok(!/∠[^<;]*90|90°/.test(m.givens.join(';')),'incidental right angle is not a given');
 if(kind==='sas')assert.ok(!m.givens.some(s=>/7/.test(s)),'computed third SAS side is not a given');
 if(kind==='rhs')assert.ok(!m.givens.some(s=>/3/.test(s)),'computed third RHS side is not a given');
 if(kind==='aaa'){assert.ok(!m.givens.some(s=>/[58](?!0)/.test(s)),'chosen AAA base is separate from angle givens');assert.ok(m.chosen.includes(`base of ${variant%2?8:5} units`));}
 if(view==='build'){assert.equal(m.currentPair,'');assert.ok(!hear.includes('About the possible builds:'));}else {assert.ok(hear.includes(m.currentPair));assert.ok(hear.includes('About the possible builds:'));}
 assert.ok(!hear.includes('For grown-ups'));assert.ok(!hear.includes('One angle is a'));assert.ok(!hear.includes('Picture orientation'));
}
console.log('Matching Triangles: independent exact constructions and SVG guides, shared scales and all isometries, authored pair facts, all rectangle dimensions, strict local work and active-output invariance passed.');

// The completed AAA construction labels its authored third angle at F.
{const w=createCrossingAngles();w.page="matching";w.matching.case="aaa";w.matching.parts.step=2;const model=crossingAnglesModel(w).matching;assert.equal(model.geometry.labels.find(l=>l.name==="F").givenAngle,70);assert.match(renderCrossingAngles(w),/F · 70°/);w.matching.parts.step=1;assert.ok(!crossingAnglesModel(w).matching.geometry.labels.some(l=>l.givenAngle!==undefined));}

// Enum validation must not accept arrays or boxed strings through property-key coercion.
for(const invalidCase of [['sss'],Object('sss'),{toString:()=> 'sss'}]){
 const w={...createCrossingAngles(),page:'matching'};
 assert.equal(changeCrossingAngles(w,'match-case',invalidCase),w);
 const invalid={...w,matching:{...w.matching,case:invalidCase}};
 assert.equal(crossingAnglesModel(invalid),null);assert.equal(changeCrossingAngles(invalid,'page','build'),invalid);
}
// Figure descriptions label a family's reason separately from the displayed pair.
for(const key of ['ssa','aaa'])for(const view of ['fit','letters']){
 const w={...createCrossingAngles(),page:'matching'};w.matching.case=key;w.matching.view=view;
 const g=crossingAnglesModel(w).matching,html=renderCrossingAngles(w);
 const desc=html.match(/<desc id="crossing-angles-matching-diagram-description">([\s\S]*?)<\/desc>/)[1];
 assert.ok(desc.includes('About the possible builds: '+g.text));assert.ok(desc.indexOf(g.currentPair)<desc.indexOf('About the possible builds:'));
}

// 420: independent finite mathematical packet. Expected keys and relation
// membership come from geometry, never from the runtime catalogue or reducer.
const chaseFamilies=[
 {givens:[[43],[68],[117]],keys:[[137,137],[112,112],[63,63]],offered:[['line','triangle','point'],['opposite','line','triangle']],accepted:[['line'],['opposite','line']],example:[50,130,130]},
 {givens:[[105,135],[115,120],[125,140]],keys:[[120,60,45],[125,55,60],[95,85,40]],offered:[['point','opposite','triangle'],['line','opposite','triangle'],['parts','line','opposite']],accepted:[['point'],['line'],['parts','line']],example:[110,132,118,62,48]},
 {givens:[[37,68],[42,61],[29,84]],keys:[[75,105],[77,103],[67,113]],offered:[['triangle','opposite','point'],['line','exterior','opposite']],accepted:[['triangle'],['line','exterior']],example:[40,64,76,104]},
 {givens:[[35],[52],[68]],keys:[[35,35,145],[52,52,128],[68,68,112]],offered:[['corresponding','alternate','cointerior'],['opposite','alternate','triangle'],['line','cointerior','opposite']],accepted:[['corresponding'],['opposite','alternate'],['line','cointerior']],example:[40,40,40,140]},
 {givens:[[25],[37],[58]],keys:[[65,25,65],[53,37,53],[32,58,32]],offered:[['corner','point','insufficient'],['triangle','alternate','opposite'],['corner','alternate','opposite']],accepted:[['corner'],['triangle','alternate'],['corner','alternate']],example:[30,60,30,60]},
 {givens:[[5],[6],[8]],keys:[[108,72],[120,60],[135,45]],offered:[['regular','line','point'],['line','equalOutside','opposite']],accepted:[['regular','line'],['line','equalOutside']],example:[10,144,36]},
 {givens:[[80,110,95],[95,100,85],[105,80,70]],keys:[[75,105],[80,100],[105,75]],offered:[['quad','regular','line'],['line','quadOutside','equalOutside']],accepted:[['quad','line'],['line','quadOutside']],example:[85,115,65,95,85]}
];
const chasePacket=chaseFamilies.flatMap((f,family)=>f.keys.map((keys,variant)=>({family,variant,keys,givens:f.givens[variant],offered:f.offered,accepted:f.accepted})));
const chaseAnswer=()=>({draft:'',reason:null,checked:false,hint:false,exampleSeen:false,solution:false});
const chaseBoard=n=>({target:0,rotation:0,exampleStep:0,answers:Array.from({length:n},chaseAnswer)});
assert.deepEqual(initialChase,{case:0,view:'solve',boards:chasePacket.map(p=>chaseBoard(p.keys.length))});
const chaseFresh=createCrossingAngles().chase;
for(let i=0;i<chasePacket.length;i++){
 assert.notEqual(initialChase.boards[i],chaseFresh.boards[i]);assert.notEqual(initialChase.boards[i].answers,chaseFresh.boards[i].answers);
 for(let j=0;j<chasePacket.length;j++)if(i!==j){assert.notEqual(initialChase.boards[i],initialChase.boards[j]);assert.notEqual(initialChase.boards[i].answers,initialChase.boards[j].answers);}
 for(const a of initialChase.boards[i].answers){assert.equal(initialChase.boards.flatMap(b=>b.answers).filter(b=>b===a).length,1);assert.ok(!chaseFresh.boards.flatMap(b=>b.answers).includes(a));}
}
const chaseStart=(caseIndex=0)=>changeCrossingAngles(changeCrossingAngles(createCrossingAngles(),'page','chase'),'chase-case',caseIndex);
const chaseApply=(w,...actions)=>actions.reduce((v,[a,b])=>b===undefined?changeCrossingAngles(v,a):changeCrossingAngles(v,a,b),w);
const chaseHeld=w=>w.chase.boards[w.chase.case];
const chaseWith=(w,delta={},answerDelta=null,index=chaseHeld(w).target)=>({...w,chase:{...w.chase,boards:w.chase.boards.map((b,i)=>i!==w.chase.case?b:{...b,...delta,answers:b.answers.map((a,j)=>j===index&&answerDelta?{...a,...answerDelta}:a)})}});
const chaseWrite=(w,value,reason=null)=>chaseApply(w,['chase-clear'],...[...String(value)].map(d=>['chase-digit',d]),...(reason===null?[]:[['chase-reason',reason]]));
const chaseProjection=(w,c=null)=>crossingAnglesModel(w,c).chase;
const chaseText=w=>crossingAnglesNarration(w).replace(/\s*=\s*/g,'=');
const freezeTree=o=>{if(o&&typeof o==='object'&&!Object.isFrozen(o)){Object.freeze(o);Object.values(o).forEach(freezeTree);}return o;};
for(const [i,p] of chasePacket.entries()){
 const [a,b]=p.givens,k=p.keys;
 if(p.family===0)assert.deepEqual(k,[180-a,180-a]);
 if(p.family===1)assert.deepEqual(k,[360-a-b,a+b-180,180-b]);
 if(p.family===2)assert.deepEqual(k,[180-a-b,a+b]);
 if(p.family===3)assert.deepEqual(k,[a,a,180-a]);
 if(p.family===4)assert.deepEqual(k,[90-a,a,90-a]);
 if(p.family===5)assert.deepEqual(k,[(a-2)*180/a,360/a]);
 if(p.family===6){assert.deepEqual(k,[360-a-b-p.givens[2],a+b+p.givens[2]-180]);assert.ok([...p.givens,k[0]].every(v=>v>0&&v<180),'four positive convex corners sum to one turn');}
 assert.ok(k.every(v=>v>0&&v<180),'finite data admits positive geometric sectors');
 let w=chaseStart(i);const before=structuredClone(w);freezeTree(w);
 for(let t=0;t<k.length;t++){
  let target=changeCrossingAngles(w,'chase-target',t);assert.equal(chaseHeld(target).target,t,'every target is reachable before predecessor answers');
  for(const r of p.offered[t]){
   const answered=chaseApply(chaseWrite(target,k[t],r),['chase-check']);
   assert.deepEqual(w,before,'immutable reducer does not alter frozen source');
   const text=chaseText(answered);
   if(p.accepted[t].includes(r))assert.ok(text.includes(`${'xyz'[t]}=${k[t]}°`),`case ${i} target ${t}: accepted ${r}`);
   else {assert.match(text,/The number fits\. This relationship does not explain the marked parts\./);assert.ok(!chaseProjection(answered).active.feedback.startsWith(`${'xyz'[t]} = ${k[t]}°`),'wrong relationship has no complete-result assertion');}
   assert.equal(chaseHeld(answered).target,t,'checking never advances');
   assert.equal(changeCrossingAngles(answered,'chase-check'),answered,'repeated check identity');
  }
  const raw=chaseWrite(target,k[t]);assert.match(chaseText(raw),/Not checked yet\./);
  const numberOnly=changeCrossingAngles(raw,'chase-check');assert.match(chaseText(numberOnly),/The number fits these facts\. Choose a reason when you’re ready\./);
  assert.match(chaseText(chaseApply(chaseWrite(target,0),['chase-check'])),/Check the number using the marked facts\. Choose a reason when you’re ready\./);
  const blank=changeCrossingAngles(target,'chase-check');assert.match(chaseText(blank),/Enter a whole-number angle, then check when you’re ready\./);
  for(const v of [361,999]){
   const out=chaseApply(chaseWrite(target,v,p.offered[t][0]),['chase-check']);
   assert.match(chaseText(out),/Use a whole-number angle from 0° to 360°\./);assert.ok(!/That relationship fits here|This relationship does not explain/.test(chaseText(out)));
  }
  const wrong=chaseApply(chaseWrite(target,0,p.accepted[t][0]),['chase-check']);assert.match(chaseText(wrong),/That relationship fits here\. Check the calculation using/);
  const rejected=p.offered[t].find(r=>!p.accepted[t].includes(r));
  assert.match(chaseText(chaseApply(chaseWrite(target,0,rejected),['chase-check'])),/Let’s look at the marked facts again\./);
  const correct=chaseApply(chaseWrite(target,k[t],p.accepted[t][0]),['chase-check']);
  assert.equal(chaseHeld(changeCrossingAngles(correct,'chase-backspace')).answers[t].checked,false);
  assert.equal(chaseHeld(changeCrossingAngles(correct,'chase-reason',rejected)).answers[t].checked,false);
  for(const help of ['chase-hint','chase-solution','chase-example']){
   const supported=changeCrossingAngles(correct,help);assert.deepEqual(chaseHeld(supported).answers.map(({draft,reason,checked})=>({draft,reason,checked})),chaseHeld(correct).answers.map(({draft,reason,checked})=>({draft,reason,checked})),'support never fills, replaces or checks answers');
   if(help==='chase-example')assert.ok(chaseHeld(supported).answers.every(a=>a.exampleSeen));else assert.equal(changeCrossingAngles(supported,help),supported);
  }
 }
}
const insufficient=chaseApply(chaseStart(12),['chase-reason','insufficient'],['chase-check']);
assert.match(chaseText(insufficient),/The marked right corner and angle a do determine x\. Try a whole-number angle/);
for(const family of chaseFamilies){const exampleKeys=family.example.slice(family===chaseFamilies[6]?3:family===chaseFamilies[1]||family===chaseFamilies[2]?2:1);assert.ok(exampleKeys.every(n=>!family.keys.flat().includes(n)),'worked targets are disjoint from own practice packet');}
// The two new examples use the same mathematical totals with independent facts.
assert.deepEqual(chaseFamilies[5].example.slice(1),[(10-2)*180/10,360/10]);
assert.deepEqual(chaseFamilies[6].example.slice(3),[360-85-115-65,85+115+65-180]);
// Leading zeros remain in the draft, while values follow integer arithmetic.
{const w=chaseApply(chaseWrite(chaseApply(chaseStart(3),['chase-target',2]),'045','parts'),['chase-check']);assert.equal(chaseHeld(w).answers[2].draft,'045');assert.match(chaseText(w),/z=45°/);assert.ok(!chaseText(w).includes('z=045°'));}
// A wrong predecessor remains a response, never a source fact for a later key.
for(const [i,t,r] of [[0,1,'opposite'],[3,1,'line'],[3,2,'parts'],[6,1,'line'],[9,1,'opposite'],[9,2,'line'],[12,1,'triangle'],[12,2,'corner'],...[15,16,17,18,19,20].flatMap(i=>[[i,0,'line'],[i,1,'line']])]){
 const predecessor=i>=15?1-t:0;
 let w=chaseApply(chaseWrite(changeCrossingAngles(chaseStart(i),'chase-target',predecessor),1),['chase-check'],['chase-target',t]);
 const wrong=chaseApply(chaseWrite(w,0,r),['chase-check']);assert.match(chaseText(wrong),/and the value you used for [xyz]/,'predecessor note follows the selected method');
 w=chaseApply(chaseWrite(w,chasePacket[i].keys[t],r),['chase-check']);assert.match(chaseText(w),new RegExp(`${'xyz'[t]}=${chasePacket[i].keys[t]}°`));assert.equal(chaseHeld(w).answers[predecessor].draft,'1');assert.equal(chaseHeld(w).answers[predecessor].checked,true);
}
// Every nested field is validated, including inactive boards and answers.
function rejectChase(chase){const bad={...createCrossingAngles(),page:'chase',chase};assert.equal(crossingAnglesModel(bad),null);assert.equal(crossingAnglesNarration(bad),'');assert.equal(changeCrossingAngles(bad,'page','build'),bad);}
const validChase=chaseStart().chase;
for(const bad of [null,[],{},'solve',Object('solve')])rejectChase(bad);
for(const value of [-1,chasePacket.length,1.5,'1',Object(1),true,NaN,Infinity,null])rejectChase({...validChase,case:value});
for(const value of ['bad',null,['solve'],Object('solve'),true])rejectChase({...validChase,view:value});
for(const value of [null,{},[],validChase.boards.slice(1),[...validChase.boards,validChase.boards[0]]])rejectChase({...validChase,boards:value});
for(const boardIndex of [0,14,15,16,17,18,19,20]){
 const mutateBoard=delta=>({...validChase,boards:validChase.boards.map((b,i)=>i===boardIndex?{...b,...delta}:b)});
 const n=chasePacket[boardIndex].keys.length;
 for(const [field,values] of [['target',[-1,n,.5,'0',Object(0),null,true,NaN,Infinity]],['rotation',[-30,360,15,30.1,'30',Object(30),null,true,NaN,Infinity]],['exampleStep',[-1,n+1,.5,'0',Object(0),null,true,NaN,Infinity]],['answers',[null,{},[],validChase.boards[boardIndex].answers.slice(1),[...validChase.boards[boardIndex].answers,chaseAnswer()]]]])for(const value of values)rejectChase(mutateBoard({[field]:value}));
 for(const a of [null,[],{},'answer'])rejectChase(mutateBoard({answers:validChase.boards[boardIndex].answers.map((v,i)=>i===n-1?a:v)}));
 for(const [field,values] of [['draft',[0,null,'1000','-1','1.0',' 1','1 ','１','1e2',Object('1')]],['reason',['bad',1,[],Object('line'),{toString:()=> 'line'}]],...['checked','hint','exampleSeen','solution'].map(k=>[k,[null,0,1,'false',Object(false)]])])for(const value of values){
  const answers=validChase.boards[boardIndex].answers.map((a,i)=>i===n-1?{...a,[field]:value}:a);rejectChase(mutateBoard({answers}));
 }
}
for(const [i,p] of chasePacket.entries())for(let t=0;t<p.keys.length;t++){
 const w=chaseApply(chaseStart(i),['chase-target',t]);
 for(const id of ['line','point','opposite','triangle','parts','exterior','corresponding','alternate','cointerior','corner','insufficient','regular','equalOutside','quad','quadOutside'])if(!p.offered[t].includes(id)){
  assert.equal(changeCrossingAngles(w,'chase-reason',id),w);rejectChase(chaseWith(w,{}, {reason:id}).chase);
 }
 const reasonOrder=p.offered[t].map((_,j)=>p.offered[t][(j+(i+t)%3)%3]);
 assert.deepEqual(chaseProjection(w).active.reasons.map(r=>r.id),reasonOrder,'stable authored order rotates by case and target');
}
for(const [action,badValues] of [['chase-case',[-1,chasePacket.length,.5,'1',Object(1),true,null,NaN]],['chase-target',[-1,2,.5,'1',Object(1),true,null,NaN]],['chase-rotation',[-30,360,15,.5,'30',Object(30),true,null,NaN]],['chase-digit',['','12','a','１',1,Object('1'),true,null]],['chase-reason',['bad',1,['line'],Object('line'),true,null]]]){
 const w=chaseStart();for(const value of badValues)assert.equal(changeCrossingAngles(w,action,value),w,`${action} rejects malformed value`);
}
const chaseZero=['chase-backspace','chase-clear','chase-check','chase-hint','chase-solution','chase-example','chase-restart'];
for(const action of chaseZero)for(const value of [null,0,false,'',[],{}]){const w=chaseWrite(chaseStart(),12,'line');assert.equal(changeCrossingAngles(w,action,value),w,'zero-argument action rejects supplied value');}
const chaseSolveActions=[['chase-case',1],['chase-target',1],['chase-rotation',30],['chase-digit','1'],['chase-reason','line'],...chaseZero.map(a=>[a])];
for(const page of ['build','learn','parallel','triangle','matching']){
 const w=changeCrossingAngles(createCrossingAngles(),'page',page);for(const [action,value] of [...chaseSolveActions,['chase-example-step',1],['chase-return']])assert.equal(changeCrossingAngles(w,action,value),w,'chase action refused on older page');
}
{
 const w=chaseStart();for(const [action,value] of [['angle',90],['rotation',30],['turn'],['pair','adjacent'],['card',1],['step',1],['two-mode','panel'],['tri-a',45],['poly-sides',6],['match-case','sas']])assert.equal(changeCrossingAngles(w,action,value),w,'older action refused on Chase');
 for(const [a,v] of [['chase-case',0],['chase-target',0],['chase-rotation',0],['chase-clear'],['chase-backspace'],['chase-restart']])assert.equal(changeCrossingAngles(w,a,v),w,'default no-op retains identity');
 const digits=chaseWrite(w,'123');assert.equal(changeCrossingAngles(digits,'chase-digit','4'),digits);assert.equal(chaseHeld(changeCrossingAngles(digits,'chase-backspace')).answers[0].draft,'12');assert.equal(chaseHeld(changeCrossingAngles(digits,'chase-clear')).answers[0].draft,'');
 const selected=changeCrossingAngles(w,'chase-reason','line');assert.equal(changeCrossingAngles(selected,'chase-reason','line'),selected);
 const e=changeCrossingAngles(digits,'chase-example');for(const [a,v] of chaseSolveActions)assert.equal(changeCrossingAngles(e,a,v),e,'solve-only actions refused in Example');
 for(const value of [-1,3,.5,'1',Object(1),true,null,NaN])assert.equal(changeCrossingAngles(e,'chase-example-step',value),e);
 assert.equal(changeCrossingAngles(e,'chase-example-step',0),e);
 for(const value of [0,false,null,'',{}])assert.equal(changeCrossingAngles(e,'chase-return',value),e);
 assert.equal(changeCrossingAngles(w,'chase-return'),w);assert.equal(changeCrossingAngles(w,'chase-example-step',1),w);
 const stepped=changeCrossingAngles(e,'chase-example-step',2),back=changeCrossingAngles(stepped,'chase-return');assert.equal(back.chase.view,'solve');assert.equal(chaseHeld(back).exampleStep,2);assert.equal(changeCrossingAngles(back,'chase-example').chase.boards[0].exampleStep,2);
}
// All per-case work survives case/page movement; restart clears only its board.
{
 let w=chaseStart();
 for(let i=0;i<chasePacket.length;i++)w=chaseApply(w,['chase-case',i],['chase-target',chasePacket[i].keys.length-1],['chase-rotation',30*(i%12)],['chase-digit',String(i%10)],['chase-hint'],['chase-example'],['chase-example-step',1],['chase-return']);
 const held=structuredClone(w.chase.boards);
 for(let i=0;i<chasePacket.length;i++){w=changeCrossingAngles(w,'chase-case',i);assert.deepEqual(chaseHeld(w),held[i]);}
 for(const page of ['build','learn','parallel','triangle','matching','chase']){w=changeCrossingAngles(w,'page',page);assert.deepEqual(w.chase.boards,held);}
 w=changeCrossingAngles(w,'chase-case',7);const reset=changeCrossingAngles(w,'chase-restart');assert.equal(reset.chase.case,7);assert.deepEqual(chaseHeld(reset),chaseBoard(2));assert.equal(changeCrossingAngles(reset,'chase-restart'),reset);
 for(let i=0;i<chasePacket.length;i++)if(i!==7){assert.equal(reset.chase.boards[i],w.chase.boards[i]);assert.deepEqual(reset.chase.boards[i],held[i]);}
}
// Explicitly printed values form a finite union, not transitive inference.
for(const [i,n,provided] of [[0,1,[1]],[3,1,[0,1]],[3,2,[2]],[6,1,[1]],[9,2,[2]],[12,2,[1,2]]]){
 const w=chaseApply(chaseStart(i),['chase-target',n],['chase-solution']),m=chaseProjection(w);
 assert.deepEqual(m.targets.map((t,j)=>t.shown?j:null).filter(v=>v!==null),provided);
 for(let t=0;t<chasePacket[i].keys.length;t++){
  const active=changeCrossingAngles(w,'chase-target',t),projection=chaseProjection(active);
  assert.equal(projection.targets[t].value,provided.includes(t)?chasePacket[i].keys[t]:null);
  if(provided.includes(t)&&t!==n){assert.match(chaseText(active),/A value for this angle was shown in another solution\. Your draft is still kept\./);assert.equal(projection.active.solution,null);}
 }
 assert.ok(chaseHeld(w).answers.every(a=>a.draft===''&&a.reason===null&&!a.checked));
 const union=chaseApply(w,['chase-target',0],['chase-solution']);assert.deepEqual(chaseProjection(union).targets.map((t,j)=>t.shown?j:null).filter(v=>v!==null),[...new Set([0,...provided])].sort());
}
// Every appended solution provides only its own target; inverse line routes
// never promote a predecessor draft or a logically inferable value into help.
for(let i=15;i<chasePacket.length;i++)for(const target of [0,1]){
 const start=changeCrossingAngles(chaseStart(i),'chase-target',target),shown=changeCrossingAngles(start,'chase-solution'),m=chaseProjection(shown);
 assert.deepEqual(m.targets.map(t=>t.shown),[target===0,target===1]);
 assert.deepEqual(chaseHeld(shown).answers.map(a=>[a.draft,a.reason,a.checked]),[['',null,false],['',null,false]]);
 assert.ok(!new RegExp(`${'xy'[1-target]}\\s*=\\s*\\d+°`).test(m.active.solution),'solution never prints the other unknown as a provided value');
 const dirty=chaseApply(shown,['chase-digit','9'],['chase-hint'],['chase-example'],['chase-example-step',2],['chase-return'],['chase-rotation',330]);
 const reset=changeCrossingAngles(dirty,'chase-restart');assert.deepEqual(chaseHeld(reset),chaseBoard(2));
 for(let j=0;j<chasePacket.length;j++)if(j!==i)assert.equal(reset.chase.boards[j],dirty.chase.boards[j],'restart preserves every other board');
}
// Side counts remain source counts in facts/description/Hear, while only the
// three quadrilateral givens become positioned degree tags.
for(const {index,n} of [{index:15,n:5},{index:16,n:6},{index:17,n:8},{index:15,n:10}]){
 const w=n===10?chaseApply(chaseStart(index),['chase-example']):chaseStart(index),m=chaseProjection(w),html=renderCrossingAngles(w),hear=crossingAnglesNarration(w);
 assert.equal(m.family,'regular');assert.deepEqual(m.geometry.givens,[]);
 for(const text of [m.geometry.facts.join(' '),m.geometry.description,hear]){assert.ok(text.includes(`${n} sides`));assert.ok(!/n\s*=\s*\d+°/.test(text));assert.ok(!/Given\s*\./.test(text));}
 assert.ok(!/class="[^"]*ca-chase-given/.test(html),'no floating count or angle-given tag');
 if(n!==10)assert.equal(m.variantLabel,`Regular polygon · ${n} sides`);
}
for(const index of [18,19,20])for(const example of [false,true]){
 const w=example?chaseApply(chaseStart(index),['chase-example']):chaseStart(index),m=chaseProjection(w),html=renderCrossingAngles(w);
 assert.equal(m.family,'quadrilateral');assert.deepEqual(m.geometry.givens.map(g=>[g.name,g.value]),['a','b','c'].map((name,j)=>[name,(example?[85,115,65]:chasePacket[index].givens)[j]]));
 assert.deepEqual(m.geometry.givens.map(g=>g.position),[[100,65],[320,65],[540,65]]);
 const tags=[...html.matchAll(/<span\b[^>]*class="[^"]*ca-chase-given[^>]*>([^<]*)<\/span>/g)].map(x=>x[1]);
 assert.deepEqual(tags,m.geometry.givens.map(g=>g.label),'only the three known degree tags are rendered');
}
// Deliberately different valid inactive work has no active-page projection.
const chaseOldDeltas=[{angle:165},{rotation:330},{pair:'adjacent'},{prompt:5},{card:3},{step:2},{twoMode:'panel'},{twoSpacing:'far'},{twoLean:10},{twoPair:'alternate'},{twoMove:4},{twoPrompt:5},{triMode:'panel'},{triView:'outside'},{triA:45,triB:75},{triSize:'small'},{triGather:2},{triProof:2},{triPrompt:5},{polySides:8},{polyKind:'stretched'},{polySize:'small'},{polyView:'walk'},{polyCorner:3},{polyDraw:2},{polyWalk:3},{polyPrompt:5},{polyPanelCorner:2},{polyPanelDraw:1},{polyPanelWalk:3},{matching:{...createCrossingAngles().matching,case:'aaa',view:'letters',prompt:5}}];
const chaseContexts=[null,captureCrossingPanel({originalWidth:9,originalHeight:7,width:1,height:12},'Synthetic tall source'),captureCrossingPanel({originalWidth:2,originalHeight:11,width:12,height:1},'Synthetic wide source')];
function chaseInvariant(w,changes){const m=chaseProjection(w),html=renderCrossingAngles(w),hear=crossingAnglesNarration(w);for(const [v,c] of changes){assert.deepEqual(chaseProjection(v,c),m);assert.equal(renderCrossingAngles(v,c),html);assert.equal(crossingAnglesNarration(v,c),hear);}}
for(const i of [0,3,6,9,12,15,16,17,18,19,20]){
 const w=chaseApply(chaseStart(i),['chase-hint']);
 const inactive=w.chase.boards.map((b,j)=>j===i?b:{...b,target:chasePacket[j].keys.length-1,rotation:330,exampleStep:1,answers:b.answers.map((a,t)=>({...a,draft:'999',reason:chasePacket[j].offered[t][0],checked:true,hint:true,exampleSeen:true,solution:true}))});
 chaseInvariant(w,[...chaseOldDeltas.map(d=>[{...w,...d},null]),...chaseContexts.map(c=>[w,c]),[{...w,chase:{...w.chase,boards:inactive}},null]]);
}
for(const old of [initial,panelWork,parallel,triangle,poly,matchWork()]){
 const different={...old,chase:{...chaseStart(14).chase,boards:chaseStart(14).chase.boards.map((b,i)=>({...b,target:chasePacket[i].keys.length-1,rotation:330,exampleStep:1,answers:b.answers.map((a,t)=>({...a,draft:'999',reason:chasePacket[i].offered[t][0],checked:true,hint:true,exampleSeen:true,solution:true}))}))}};
 assert.equal(crossingAnglesModel(old).chase,null);assert.deepEqual(crossingAnglesModel(different),crossingAnglesModel(old));assert.equal(renderCrossingAngles(different,capture),renderCrossingAngles(old,capture));assert.equal(crossingAnglesNarration(different,capture),crossingAnglesNarration(old,capture));
}
// Examples reveal only their finite step; all practice state is excluded.
for(const [f,family] of chaseFamilies.entries()){
 const n=family.keys[0].length,sourceCount=f===6?3:f===1||f===2?2:1,exampleSource=family.example.slice(0,sourceCount),exampleGivens=f===5?[]:exampleSource,exampleKeys=family.example.slice(sourceCount);
 for(let step=0;step<=n;step++){
  const w=chaseApply(chaseStart(f*3),['chase-example'],['chase-example-step',step]),m=chaseProjection(w),html=renderCrossingAngles(w),hear=crossingAnglesNarration(w);
  if(f>=5){for(let t=step;t<n;t++)assert.ok(!new RegExp(`${'xy'[t]}\\s*=\\s*\\d+°`).test(m.working.join(' ')),'unrevealed example unknown has no numeric assignment in working');}
  assert.equal(m.view,'example');assert.equal(m.active,null);assert.equal(m.working.length,step);assert.deepEqual(m.targets.map(t=>t.value),exampleKeys.map((k,j)=>j<step?k:null));
  assert.deepEqual(m.geometry.givens.map(g=>g.value),exampleGivens);assert.ok(hear.startsWith('A different worked sketch'));
  assert.ok(!html.includes('data-crossing-angles-action="chase-check"'));assert.ok(!html.includes('data-crossing-angles-action="chase-case"'));assert.ok(!html.includes('data-crossing-angles-action="chase-digit"'));
  assert.ok(hear.includes(step===0?'Example: givens only':`Example step ${step} of ${n}`));
  const changes=[...chaseContexts.map(c=>[w,c]),...chaseOldDeltas.map(d=>[{...w,...d},null])];
  for(const variant of [0,1,2])for(const delta of [{target:n-1},{rotation:330},{answers:chaseHeld(w).answers.map((a,j)=>({...a,draft:'999',reason:chasePacket[f*3+variant].offered[j][0],checked:true,hint:true,solution:true}))}]){
   const other={...w,chase:{...w.chase,case:f*3+variant}};changes.push([chaseWith(other,{...delta,exampleStep:step}),null]);
  }
  chaseInvariant(w,changes);
 }
}
// Read value roles, including accessible descriptions and Hear, rather than
// forbidding incidental numeric coincidences with givens or schematic positions.
function assertChaseVisibility(w,expected){
 const m=chaseProjection(w),html=renderCrossingAngles(w),hear=crossingAnglesNarration(w),p=chasePacket[w.chase.case];
 assert.deepEqual(m.targets.map(t=>[t.value,t.shown]),expected);
 for(let t=0;t<p.keys.length;t++){
  const name='xyz'[t],cell=html.match(new RegExp(`<button\\b[^>]*data-crossing-angles-chase-target="${name}"[^>]*>([\\s\\S]*?)<\\/button>`));assert.ok(cell,'actual native angle control exists');
  const value=expected[t][0],body=cell[1].replace(/<[^>]+>/g,' ').trim();
  if(value===null){assert.ok(!/\d/.test(body),'unknown target button contains only its name');assert.ok(!new RegExp(`(?:angle )?${name}\\s*=\\s*${p.keys[t]}°`).test(m.geometry.description+' '+hear),'no hidden key in description or Hear');}
  else assert.ok(body.includes(`${value}°`),'actual target button displays available mathematical value');
 }
 assert.ok(!/data-(?:expected|answer-key|chase-key|measure)=/i.test(html),'no debug answer attributes');
 assert.ok(!hear.includes('These finite number-and-reason checks do not grade'));
}
for(const [i,p] of chasePacket.entries()){
 const blank=chaseStart(i),unknown=p.keys.map(()=>[null,false]);assertChaseVisibility(blank,unknown);
 for(let t=0;t<p.keys.length;t++){
  const w=changeCrossingAngles(blank,'chase-target',t),right=chaseWrite(w,p.keys[t]),wrong=chaseApply(chaseWrite(w,1),['chase-check']);
  assertChaseVisibility(right,unknown);assertChaseVisibility(wrong,unknown);
  const checked=changeCrossingAngles(right,'chase-check'),expected=unknown.map((v,j)=>j===t?[p.keys[t],false]:v);assertChaseVisibility(checked,expected);
  assert.match(chaseText(checked),/The number fits; its reason is still open\./);
  assertChaseVisibility(changeCrossingAngles(checked,'chase-hint'),expected);
  const shown=changeCrossingAngles(checked,'chase-solution'),provided=[t,...(p.family===1&&t===1?[0]:[]),...(p.family===4&&t===2?[1]:[])];
  assertChaseVisibility(shown,unknown.map((v,j)=>provided.includes(j)?[p.keys[j],true]:v));
  const revised=chaseApply(checked,['chase-target',(t+1)%p.keys.length],['chase-digit','1']);assertChaseVisibility(revised,expected);
 }
}
const chasePolar=d=>[3*Math.cos(d*Math.PI/180),3*Math.sin(d*Math.PI/180)];
const chaseSchematics=[
 {points:{O:[0,0],A:chasePolar(0),B:chasePolar(55),C:chasePolar(180),D:chasePolar(235)},center:[0,0],scale:52,lines:['AC','BD'],regions:{a:'OAB',x:'OBC',y:'ODA'}},
 {points:{O:[0,0],A:chasePolar(0),E:chasePolar(60),B:chasePolar(115),C:chasePolar(240)},center:[0,0],scale:52,lines:['OA','OB','CE'],regions:{p:'OAB',q:'OBC',x:'OCA',y:'OAE',z:'OEB'}},
 {points:{A:[0,0],B:[4,0],C:[1.5,3],D:[6,0]},center:[3,1.5],scale:45,lines:['AD','AC','BC'],regions:{a:'ABC',c:'CAB',x:'BCA',y:'BDC'}},
 {points:{A:[-2,1],P:[0,1],B:[2,1],C:[-2,-1],Q:[1,-1],D:[3,-1],R:[-1,3],S:[2,-3]},center:[.5,0],scale:45,lines:['AB','CD','RS'],regions:{a:'PQB',x:'QSD',y:'QPC',z:'QDP'}},
 {points:{A:[0,0],B:[4,0],C:[4,3],D:[0,3]},center:[2,1.5],scale:60,lines:['AB','BC','CD','DA','AC'],regions:{a:'ABC',x:'ACD',y:'CDA',z:'CAB'}}
];
// Polygon fixtures use the stipulated radius and vertices independently of the
// runtime plans. Internal vertices supply outline edges but have no point labels.
function regularChaseSketch(n){
 const vertices=Array.from({length:n},(_,i)=>{const a=(90+360*i/n)*Math.PI/180;return [3*Math.cos(a),3*Math.sin(a)];});
 const A=vertices[0],C=vertices[n-1],incoming=sub(A,C),length=Math.hypot(...incoming);
 const points={...Object.fromEntries(vertices.map((p,i)=>[`V${i}`,p])),A,B:vertices[1],C,D:A.map((v,i)=>v+.75*incoming[i]/length)};
 return {points,labels:[...'ABCD'],center:[0,0],scale:46,lines:[...vertices.map((_,i)=>[`V${i}`,`V${(i+1)%n}`]),['A','D']],regions:{x:'ABC',y:'ADB'}};
}
const quadChaseSketch=(()=>{const A=[0,0],B=[4,0],C=[3,3],D=[-1,2],v=sub(D,C),length=Math.hypot(...v);return {points:{A,B,C,D,E:D.map((n,i)=>n+.75*v[i]/length)},center:[1.5,1.25],scale:46,lines:['AB','BC','CD','DA','DE'],regions:{a:'ABD',b:'BCA',c:'CDB',x:'DAC',y:'DEA'}};})();
const chaseGeometryFixtures=[...chaseSchematics.map((s,f)=>({s,f,work:()=>chaseStart(f*3)})),...[5,6,8].map((n,j)=>({s:regularChaseSketch(n),f:5,work:()=>chaseStart(15+j)})),...[18,19,20].map(i=>({s:quadChaseSketch,f:6,work:()=>chaseStart(i)})),{s:regularChaseSketch(10),f:5,work:()=>chaseApply(chaseStart(15),['chase-example'])},{s:quadChaseSketch,f:6,work:()=>chaseApply(chaseStart(18),['chase-example'])}];
function chaseProject(p,s,rotation){const [x,y]=p.map((v,i)=>(v-s.center[i])*s.scale),r=rotation*Math.PI/180;return [320+x*Math.cos(r)-y*Math.sin(r),280-x*Math.sin(r)-y*Math.cos(r)];}
const chaseAttr=(s,k)=>s.match(new RegExp(`(?:^|\\s)${k}="([^"]*)"`))?.[1];
const chaseSvgTag=(html,tag,key,value)=>{const matches=[...html.matchAll(new RegExp(`<${tag}\\b([^>]+)>`,'g'))].filter(m=>chaseAttr(m[1],key)===String(value));assert.equal(matches.length,1,`${key}=${value} has exactly one actual SVG element`);return matches[0][1];};
const chaseSvgPoint=(attrs,keys)=>keys.map(k=>+chaseAttr(attrs,k));
const chaseNear=(a,b,msg)=>a.forEach((v,i)=>assert.ok(Math.abs(v-b[i])<.002,`${msg}: ${a} vs ${b}`));
function chaseExpectedArc(s,region,rotation,name){
 const [o,a,b]=region,center=chaseProject(s.points[o],s,rotation),u=sub(s.points[a],s.points[o]),v=sub(s.points[b],s.points[o]);
 const start=Math.atan2(u[1],u[0])+rotation*Math.PI/180,sweep=(Math.atan2(v[1],v[0])-Math.atan2(u[1],u[0])+2*Math.PI)%(2*Math.PI),radius=name==='p'?96:Math.min(28,...(s===chaseSchematics[2]&&name!=='y'?[Math.hypot(...u)*s.scale/5,Math.hypot(...v)*s.scale/5]:[]));
 const at=(angle,r)=>[center[0]+r*Math.cos(angle),center[1]-r*Math.sin(angle)];
 return {center,start,sweep,radius,first:at(start,radius),last:at(start+sweep,radius),leader:at(start+sweep/2,name==='p'?96:40)};
}
for(const {f,s,work} of chaseGeometryFixtures)for(let rotation=0;rotation<360;rotation+=30){
 // Examples use their fixed zero pose, regardless of held practice rotation.
 if(work().chase.view==='example'&&rotation!==0)continue;
 const w=chaseApply(work(),['chase-rotation',rotation]),m=chaseProjection(w),g=m.geometry,html=renderCrossingAngles(w);
 const visibleNames=s.labels||Object.keys(s.points);
 assert.deepEqual(g.points.map(p=>p.name).sort(),[...visibleNames].sort());
 for(const name of visibleNames){const raw=s.points[name];
  const expected=chaseProject(raw,s,rotation),point=g.points.find(p=>p.name===name);chaseNear(point.point,expected,'single common projection of actual raw point');
  assert.ok(point.point.every((v,i)=>v>=0&&v<=[640,560][i]),'rotated endpoint in plot');
  const label=[...html.matchAll(/<span\b([^>]*data-crossing-angles-label="[^"]+"[^>]*)>([^<]*)<\/span>/g)].find(x=>chaseAttr(x[1],'data-crossing-angles-label')===name);assert.ok(label,'actual HTML point label');assert.equal(label[2],name);
  const labelPosition=chaseSvgPoint(label[1],['data-ca-x','data-ca-y']);assert.ok(Math.hypot(...sub(labelPosition,expected))>=44,'point name is displaced from its own vertex');assert.ok(labelPosition.every((v,i)=>Number.isFinite(v)&&v>=0&&v<=[640,560][i]),'point name anchor remains in plot'); // Actual text-box/arc clearance is checked in the browser, not by copying a layout formula.
 }
 assert.equal(g.segments.length,s.lines.length);
 s.lines.forEach(([a,b],i)=>{
  const start=chaseProject(s.points[a],s,rotation),end=chaseProject(s.points[b],s,rotation);chaseNear(g.segments[i].start,start,'segment source endpoint');chaseNear(g.segments[i].end,end,'segment terminal endpoint');
  for(const p of [start,end])assert.ok(p.every((v,j)=>v>=0&&v<=[640,560][j]),'every outline/extension endpoint remains in plot');
  const actual=chaseSvgTag(html,'line','data-chase-line',i);chaseNear(chaseSvgPoint(actual,['x1','y1']),start,'actual SVG line source');chaseNear(chaseSvgPoint(actual,['x2','y2']),end,'actual SVG line end');
 });
 for(const [name,region] of Object.entries(s.regions)){
  const e=chaseExpectedArc(s,region,rotation,name),sector=g.sectors.find(a=>a.name===name);assert.ok(sector);chaseNear(sector.center,e.center,'true sector vertex');close(sector.sweep,e.sweep*180/Math.PI,'correct named sector sweep');close(sector.radius,e.radius,'arc radius');chaseNear(sector.arcStart,e.first,'arc starts on first named ray');chaseNear(sector.arcEnd,e.last,'arc ends on second named ray');chaseNear(sector.leader,e.leader,'connector sector bisector');
  if('xyz'.includes(name)){const button=chaseSvgTag(html,w.chase.view==='example'?'div':'button','data-crossing-angles-chase-target',name);chaseNear(chaseSvgPoint(button,['data-chase-leader-x','data-chase-leader-y']),e.leader,'actual HTML target connector source');}
  const actual=chaseSvgTag(html,'path','data-chase-sector',name),path=chaseAttr(actual,'d'),values=nums(path);assert.equal(values.length,9);chaseNear(values.slice(0,2),e.first,'actual SVG arc first ray');chaseNear(values.slice(2,4),[e.radius,e.radius],'actual SVG radius');assert.deepEqual(values.slice(4,7),[0,e.sweep>Math.PI?1:0,0]);chaseNear(values.slice(7),e.last,'actual SVG arc second ray');
  for(let a=0;a<=20;a++){const angle=e.start+e.sweep*a/20,p=[e.center[0]+e.radius*Math.cos(angle),e.center[1]-e.radius*Math.sin(angle)];assert.ok(p[0]>=0&&p[0]<=640&&p[1]>=0&&p[1]<=560,'entire swept arc lies in plot');}
 }
 if(f>=5){
  const [before,at,after]=f===5?['C','A','D']:['C','D','E'];
  close(cross(sub(s.points[before],s.points[at]),sub(s.points[after],s.points[at])),0,'inside and outside share a straight extended side');
  assert.ok(dot(sub(s.points[before],s.points[at]),sub(s.points[after],s.points[at]))<0,'extension ends on opposite side of actual vertex');
  const x=g.sectors.find(a=>a.name==='x'),y=g.sectors.find(a=>a.name==='y');close(x.sweep+y.sweep,180,'adjacent interior and positive outside angle form a half turn');
  if(f===5){close(x.sweep,(s.lines.length-3)*180/(s.lines.length-1),'regular schematic has independently determined interior angle');close(y.sweep,360/(s.lines.length-1),'regular schematic outside turn');}
  if(w.chase.view==='solve')for(const target of [0,1])assert.deepEqual(chaseProjection(changeCrossingAngles(w,'chase-target',target)).geometry.sectors.filter(a=>a.selected).map(a=>a.name).sort(),Object.keys(s.regions).sort(),'both targets emphasize all relevant sectors');
 }
 assert.equal(g.rightMarks.length,f===4?4:0);assert.equal(g.parallelMarks.length,f===3?2:f===4?6:0);
 if(f===4)for(const [j,name] of [...'ABCD'].entries()){
  const index='ABCD'.indexOf(name),raw=s.points[name],corner=chaseProject(raw,s,rotation),adjacent=['ABCD'[(index+1)%4],'ABCD'[(index+3)%4]].map(n=>chaseProject(s.points[n],s,rotation)),vectors=adjacent.map(p=>sub(p,corner)),leg=Math.min(12,...vectors.map(v=>Math.hypot(...v)/4)),u=vectors.map(v=>v.map(x=>x/Math.hypot(...v)*leg));
  const expected=[corner.map((v,i)=>v+u[0][i]),corner.map((v,i)=>v+u[0][i]+u[1][i]),corner.map((v,i)=>v+u[1][i])],actual=nums(chaseAttr(chaseSvgTag(html,'polyline','data-chase-right',j),'points'));
  // Either direction around the corner draws the same side-aware square.
  const order=g.rightMarks[j].points[0].every((v,i)=>Math.abs(v-expected[0][i])<.002)?expected:[...expected].reverse();g.rightMarks[j].points.forEach((p,i)=>chaseNear(p,order[i],'right marker follows true incident sides'));actual.forEach((v,i)=>assert.ok(Math.abs(v-order.flat()[i])<.002,'actual SVG right-square coordinate'));
 }
 if(f===3||f===4){
  const rails=(f===3?['AB','CD']:['AB','DC','AD','BC']).map(([a,b])=>[chaseProject(s.points[a],s,rotation),chaseProject(s.points[b],s,rotation)]),counts=rails.map(()=>0);
  for(let j=0;j<g.parallelMarks.length;j++){
   const points=g.parallelMarks[j].points,actual=nums(chaseAttr(chaseSvgTag(html,'polyline','data-chase-parallel',j),'points'));actual.forEach((v,i)=>assert.ok(Math.abs(v-points.flat()[i])<.002));
   const center=points[1],rail=rails.findIndex(([a,b])=>Math.abs(cross(sub(center,a),sub(b,a)))<1e-7&&dot(sub(center,a),sub(center,b))<0);assert.ok(rail>=0,'parallel mark vertex lies inside an actual rail');counts[rail]++;
   const tangent=sub(rails[rail][1],rails[rail][0]),arms=[sub(points[0],center),sub(points[2],center)];close(Math.hypot(...arms[0]),Math.sqrt(41),'arrow has true finite arm');close(Math.hypot(...arms[1]),Math.sqrt(41),'paired arm');assert.ok(cross(tangent,arms[0])*cross(tangent,arms[1])<0,'arrow straddles its rail');
  }
  assert.deepEqual(counts,f===3?[1,1]:[1,1,2,2],'matching arrow multiplicities on each parallel pair');
 }
}
// Independent incidence checks establish the named relation conditions used in
// the accepted/rejected table, including outside and co-interior positions.
{
 const zero=(a,b,c)=>close(cross(sub(b,a),sub(c,a)),0,'stated collinearity');
 const c=chaseSchematics[0].points;zero(c.A,c.O,c.C);zero(c.B,c.O,c.D);assert.ok(dot(sub(c.A,c.O),sub(c.C,c.O))<0);
 const h=chaseSchematics[1].points;zero(h.C,h.O,h.E);const hub=Object.fromEntries(Object.entries(chaseSchematics[1].regions).map(([n,r])=>[n,chaseExpectedArc(chaseSchematics[1],r,0,n).sweep]));close(hub.p,hub.y+hub.z,'outer p comprises y and z');close(hub.x+hub.p+hub.q,2*Math.PI,'whole turn counts p once');close(hub.x+hub.y,Math.PI,'hub half turn');
 const t=chaseSchematics[2].points;zero(t.A,t.B,t.D);assert.ok(dot(sub(t.A,t.B),sub(t.D,t.B))<0,'B lies between A and D');
 const p=chaseSchematics[3].points;zero(p.A,p.P,p.B);zero(p.C,p.Q,p.D);zero(p.R,p.P,p.Q);zero(p.P,p.Q,p.S);close(cross(sub(p.B,p.A),sub(p.D,p.C)),0,'rails parallel');assert.ok(p.S[1]<p.Q[1]&&p.Q[1]<p.P[1],'x outside below rails while y/z are inside');
 const r=chaseSchematics[4].points;for(const n of [...'ABCD'].keys()){const a=r['ABCD'[n]],b=r['ABCD'[(n+1)%4]],c=r['ABCD'[(n+3)%4]];close(dot(sub(b,a),sub(c,a)),0,'four actual rectangle right corners');}
}
// Each rejected choice explains its missing geometric condition. This table is
// independent of implementation wording and covers every offered rejection.
const chaseMissingCondition={opposite:/not across the same crossing/,point:/do not cover one whole turn/,triangle:/not the three inside corners.*closed triangle/,alternate:/outside.*not an alternate interior/,cointerior:/outside.*not a co-interior/,insufficient:/right corner and angle a do determine x/,line:/do not fill one straight half turn/};
for(const [i,p] of chasePacket.entries())for(let t=0;t<p.keys.length;t++){
 const w=changeCrossingAngles(chaseStart(i),'chase-target',t);
 for(const id of p.offered[t].filter(r=>!p.accepted[t].includes(r))){
  const missing=p.family===5&&id==='point'?/half turn at A.*different points/:p.family===5&&id==='opposite'?/beside each other at A, not across a crossing/:p.family===6&&id==='regular'?/inside corners are unequal.*Share equally only when/:p.family===6&&id==='equalOutside'?/outside turns are not all equal.*four equal shares do not find y/:chaseMissingCondition[id];
  assert.ok(missing);
  for(const value of [0,p.keys[t]])assert.match(chaseProjection(chaseApply(chaseWrite(w,value,id),['chase-check'])).active.feedback,missing,`case ${i}, ${'xyz'[t]} rejected ${id} explains its actual absent condition`);
 }
 for(const id of p.accepted[t]){
  const usesPredecessor=(p.family===0&&t===1&&id==='opposite')||(p.family===1&&(t===1||t===2&&id==='parts'))||(p.family===2&&t===1&&id==='line')||(p.family===3&&(t===1&&id==='opposite'||t===2&&id==='line'))||(p.family===4&&(t===1&&id==='triangle'||t===2))||(p.family>=5&&id==='line');
  const feedback=chaseProjection(chaseApply(chaseWrite(w,0,id),['chase-check'])).active.feedback;
  assert.equal(/and the value you used for [xyz]/.test(feedback),usesPredecessor,'method-specific predecessor note is independent of response history');
 }
}
for(const [i,p] of chasePacket.entries()){
 let complete=chaseStart(i);
 for(let t=0;t<p.keys.length;t++)complete=chaseApply(chaseWrite(changeCrossingAngles(complete,'chase-target',t),p.keys[t],p.accepted[t][0]),['chase-check']);
 assert.match(chaseProjection(complete).caption,/value and a reason at every marked angle/);
 const edited=changeCrossingAngles(complete,'chase-backspace');assert.equal(chaseProjection(edited).caption,'');
 for(let t=0;t<p.keys.length-1;t++)assert.equal(chaseProjection(edited).targets[t].value,p.keys[t],'revising another response retains true checked facts');
 let shown=chaseStart(i);for(let t=0;t<p.keys.length;t++)shown=chaseApply(shown,['chase-target',t],['chase-solution']);assert.match(chaseProjection(shown).caption,/Shown solutions are help/);
 const seen=chaseApply(chaseStart(i),['chase-example'],['chase-return']);for(let t=0;t<p.keys.length;t++)assert.match(chaseProjection(changeCrossingAngles(seen,'chase-target',t)).active.helpNote,/whole sketch/,'whole-board example support remains visible on every target');
}

console.log('Angle Chase: independent finite mathematics, reason alternatives, local reducer safety, exposure roles, worked-step isolation, SVG incidence and rotations passed.');
