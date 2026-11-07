import {crossingCopy as copy,crossingPrompts,crossingCards,twoCrossingsCopy as twoCopy,twoCrossingsPrompts,twoPanelPrompts,triangleCopy as triCopy,trianglePrompts,trianglePanelPrompts,polygonCopy as polyCopy,polygonPrompts,polygonPanelPrompts} from './crossing-angles-content.mjs';
const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
const dimension=n=>integer(n,1,12);
const angleValue=n=>integer(n,15,165)&&n%15===0;
const rotationValue=n=>integer(n,0,330)&&n%30===0;
const triAngle=n=>integer(n,15,150)&&n%15===0;
const pairs=['corresponding','alternate','co-interior'];
const spacings={near:120,middle:150,far:180};
function valid(work){return work&&typeof work==='object'&&!Array.isArray(work)&&['build','learn','parallel','triangle'].includes(work.page)&&angleValue(work.angle)&&rotationValue(work.rotation)&&['opposite','adjacent'].includes(work.pair)&&integer(work.prompt,0,5)&&integer(work.card,0,7)&&integer(work.step,0,2)&&['strips','panel'].includes(work.twoMode)&&['near','middle','far'].includes(work.twoSpacing)&&[-10,0,10].includes(work.twoLean)&&pairs.includes(work.twoPair)&&integer(work.twoMove,0,4)&&integer(work.twoPrompt,0,5)&&['free','panel'].includes(work.triMode)&&['gather','reason','outside','polygons'].includes(work.triView)&&triAngle(work.triA)&&triAngle(work.triB)&&work.triA+work.triB<=165&&['small','large'].includes(work.triSize)&&integer(work.triGather,0,2)&&integer(work.triProof,0,2)&&integer(work.triPrompt,0,5)&&integer(work.polySides,3,12)&&['regular','stretched'].includes(work.polyKind)&&['small','large'].includes(work.polySize)&&['split','corner','walk'].includes(work.polyView)&&integer(work.polyCorner,0,work.polySides-1)&&integer(work.polyDraw,0,work.polySides-3)&&integer(work.polyWalk,0,work.polySides)&&integer(work.polyPrompt,0,5)&&integer(work.polyPanelCorner,0,3)&&integer(work.polyPanelDraw,0,1)&&integer(work.polyPanelWalk,0,4);}
export function createCrossingAngles(){return {page:'build',angle:60,rotation:0,pair:'opposite',prompt:0,card:0,step:0,twoMode:'strips',twoSpacing:'middle',twoLean:0,twoPair:'corresponding',twoMove:0,twoPrompt:0,triMode:'free',triView:'gather',triA:60,triB:60,triSize:'large',triGather:0,triProof:0,triPrompt:0,polySides:5,polyKind:'regular',polySize:'large',polyView:'split',polyCorner:0,polyDraw:0,polyWalk:0,polyPrompt:0,polyPanelCorner:0,polyPanelDraw:0,polyPanelWalk:0};}
export function changeCrossingAngles(work,action,value){
 if(!valid(work))return work;
 const set=(key,v)=>work[key]===v?work:{...work,[key]:v};
 if(action==='page')return ['build','learn','parallel','triangle'].includes(value)?set('page',value):work;
 if(work.page==='build'||work.page==='parallel'||work.page==='triangle'){
  if(action==='rotation'&&rotationValue(value))return set('rotation',value);
  if(action==='turn')return {...work,rotation:(work.rotation+30)%360};
  if(action==='angle'&&(work.page==='build'||work.page==='parallel'&&work.twoMode==='strips')&&angleValue(value))return set('angle',value);
 }
 if(work.page==='build'){
  if(action==='pair'&&['opposite','adjacent'].includes(value))return set('pair',value);
  if(action==='prompt'&&integer(value,0,5))return set('prompt',value);
 }
 if(work.page==='parallel'){
  if(action==='two-mode'&&['strips','panel'].includes(value))return set('twoMode',value);
  if(action==='two-pair'&&pairs.includes(value))return set('twoPair',value);
  if(action==='two-move'&&integer(value,0,4))return set('twoMove',value);
  if(action==='two-prompt'&&integer(value,0,5))return set('twoPrompt',value);
  if(work.twoMode==='strips'){
   if(action==='two-spacing'&&['near','middle','far'].includes(value))return set('twoSpacing',value);
   if(action==='two-lean'&&[-10,0,10].includes(value))return set('twoLean',value);
  }
 }
 if(work.page==='triangle'){
  if(action==='tri-mode')return ['free','panel'].includes(value)?set('triMode',value):work;
  if(action==='tri-view')return ['gather','reason','outside','polygons'].includes(value)?set('triView',value):work;
  if(work.triView==='polygons'){
   const panel=work.triMode==='panel',n=panel?4:work.polySides,prefix=panel?'polyPanel':'poly';
   if(action==='poly-view')return ['split','corner','walk'].includes(value)?set('polyView',value):work;
   if(action==='poly-prompt')return integer(value,0,5)?set('polyPrompt',value):work;
   if(action==='poly-corner'&&integer(value,0,n-1))return work[prefix+'Corner']===value?work:{...work,[prefix+'Corner']:value,[prefix+'Draw']:0,[prefix+'Walk']:0};
   if(action==='poly-draw')return integer(value,0,n-3)?set(prefix+'Draw',value):work;
   if(action==='poly-walk')return integer(value,0,n)?set(prefix+'Walk',value):work;
   if(!panel){
    if(action==='poly-sides'&&integer(value,3,12))return work.polySides===value?work:{...work,polySides:value,polyCorner:0,polyDraw:0,polyWalk:0};
    if(action==='poly-kind')return ['regular','stretched'].includes(value)?set('polyKind',value):work;
    if(action==='poly-size')return ['small','large'].includes(value)?set('polySize',value):work;
   }
   return work;
  }
  for(const [act,key,accept] of [['tri-gather','triGather',v=>integer(v,0,2)],['tri-proof','triProof',v=>integer(v,0,2)],['tri-prompt','triPrompt',v=>integer(v,0,5)]])if(action===act)return accept(value)?set(key,value):work;
  if(work.triMode==='free'){
   if(action==='tri-size'&&['small','large'].includes(value))return set('triSize',value);
   if(action==='tri-a'&&triAngle(value)&&value+work.triB<=165)return set('triA',value);
   if(action==='tri-b'&&triAngle(value)&&value+work.triA<=165)return set('triB',value);
  }
 }
 if(work.page==='learn'){
  if(action==='card'&&integer(value,0,7))return work.card===value?work:{...work,card:value,step:0};
  if(action==='step'&&[1,4].includes(work.card)&&integer(value,0,2))return set('step',value);
 }
 return work;
}
const normalize=a=>((a%360)+360)%360;
const direction=a=>{const r=normalize(a)*Math.PI/180;return [Math.cos(r),-Math.sin(r)];};
const at=(a,r)=>{const [x,y]=direction(a);return [320+x*r,280+y*r];};
function geometry(angle,rotation,pair='opposite'){
 const starts=[rotation,rotation+angle,rotation+180,rotation+angle+180],measures=[angle,180-angle,angle,180-angle];
 const names=['AOB','BOC','COD','DOA'],selectedNames=pair==='opposite'?['AOB','COD']:['AOB','BOC'];
 const rays=starts.map((a,i)=>({name:'ABCD'[i],angle:normalize(a),end:at(a,140),label:at(a,160)}));
 const sectors=starts.map((start,i)=>({name:names[i],start,sweep:measures[i],measure:measures[i],selected:selectedNames.includes(names[i]),label:at(start+measures[i]/2,225),leader:at(start+measures[i]/2,83),arcCount:i%2?2:1,right:angle===90}));
 const description=`Two straight lines cross at O. ${sectors.map(s=>`${s.name} is ${s.measure} degrees`).join('. ')}. ${selectedNames.join(' and ')} are the selected ${pair} pair. AOB and BOC sum to 180 degrees. All four angles sum to 360 degrees. Picture orientation ${rotation} degrees; turning the picture does not change the measures.`;
 return {center:[320,280],width:640,height:560,angle,rotation,pair,rays,sectors,selectedNames,right:angle===90,description};
}
export function captureCrossingPanel(model,title){
 if(!model||typeof model!=='object'||Array.isArray(model)||typeof title!=='string')return null;
 const {originalWidth,originalHeight,width,height}=model;
 if(![originalWidth,originalHeight,width,height].every(dimension))return null;
 return Object.freeze({caseTitle:title,originalWidth,originalHeight,width,height});
}
function frame(width,height,subscript,title){
 const scale=180/Math.max(width,height),w=width*scale,h=height*scale;
 const corners=[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(([x,y])=>[320+x,280+y]);
 const theta=Math.atan2(height,width)*180/Math.PI;
 const starts=[theta,180-theta,180+theta,360-theta],sweeps=[180-2*theta,2*theta,180-2*theta,2*theta];
 const rawDirections=[[width,height],[-width,height],[-width,-height],[width,-height]];
 const rays=rawDirections.map(([x,y],i)=>{const length=Math.hypot(x,y),d=[x/length,-y/length];return {name:'ABCD'[i],direction:d,angle:normalize(starts[i]),end:[320+d[0]*140,280+d[1]*140]};});
 const sectors=starts.map((start,i)=>({name:`${i%2?'y':'x'}${subscript}`,start,sweep:sweeps[i],label:at(start+sweeps[i]/2,225),leader:at(start+sweeps[i]/2,83),arcCount:i%2?2:1,right:width===height}));
 const description=`${title}: width ${width}, height ${height}. Opposite corners are joined. All four outside corners are right angles. ${width===height?'The diagonal crossing has four right angles.':'The diagonal crossing is not right. Matching arc marks show equal opposite angles.'} The two ${'x'+subscript} sectors face the horizontal width sides; the two ${'y'+subscript} sectors face the height sides. ${'x'+subscript} plus ${'y'+subscript} is 180 degrees.`;
 return {title,width,height,subscript,square:width===height,rectangle:{width:w,height:h,corners},inset:{center:[320,280],width:640,height:560,rays,sectors,right:width===height,description},description};
}
function panelContext(context){
 const c=captureCrossingPanel(context,context?.caseTitle);if(!c)return null;
 const original=c.originalWidth===c.originalHeight,copySquare=c.width===c.height;
 const statement=original?(copySquare?'Both panels are square, so both diagonal crossings are right. Try a non-square panel in Copy Frame to compare.':'The original is square, so its diagonal crossing is right. My copy is not square, so its crossing is not right.'):(copySquare?'My copy is square, so its diagonal crossing is right. The original is not square, so its crossing is not right.':'Neither panel is square, so neither diagonal crossing is a right angle.');
 return {...c,statement,frames:[frame(c.originalWidth,c.originalHeight,'₁','Original panel'),frame(c.width,c.height,'₂','My copy')]};
}
function twoRelation(pair,angle,lean,panel){
 const e=angle-lean,h=180-e;
 if(panel){const end='because the rectangle’s opposite sides are parallel.';
  return pair==='corresponding'?`a = e. These corresponding angles match ${end}`:pair==='alternate'?`a = g. These alternate interior angles match ${end} ${twoCopy.inside}`:`a + h = 180°. These co-interior angles make a half turn ${end} ${twoCopy.inside}`;
 }
 if(pair==='co-interior')return lean===0?`a + h = ${angle}° + ${h}° = 180°. These co-interior angles make a half turn because the lines are parallel.`:`a + h = ${angle}° + ${h}° = ${angle+h}°, not 180°. The parallel rule needs parallel lines.`;
 const letter=pair==='corresponding'?'e':'g',name=pair==='corresponding'?'corresponding':'alternate interior';
 return lean===0?`a = ${angle}° and ${letter} = ${e}°. These ${name} angles match because the lines are parallel.`:`a = ${angle}° and ${letter} = ${e}°; a ≠ ${letter}. These ${name} angles differ. The parallel rule needs parallel lines.`;
}
function twoScene({angle,lean,rotation,spacing,pair,move,prompt,context=null,worked=false}){
 const panel=!!context,mode=panel?'panel':'strips',rad=Math.PI/180;
 const v=[Math.cos(angle*rad),Math.sin(angle*rad)];
 const k=panel?160/Math.max(context.width,context.height):0,w=panel?k*context.width:0,h=panel?k*context.height:0;
 const D=panel?Math.hypot(w,h):spacings[spacing],rayLength=panel?60:100;
 const origin=[-D*v[0]/2,-D*v[1]/2],second=origin.map(n=>-n);
 const project=([x,y])=>[320+x*Math.cos(rotation*rad)-y*Math.sin(rotation*rad),280-x*Math.sin(rotation*rad)-y*Math.cos(rotation*rad)];
 const extend=(c,a,length)=>project([c[0]+Math.cos(a*rad)*length,c[1]+Math.sin(a*rad)*length]);
 const line=(c,a,length)=>({start:extend(c,a,-length),end:extend(c,a,length)});
 const selectedNames=['a',pair==='corresponding'?'e':pair==='alternate'?'g':'h'];
 const crossings=[origin,second].map((c,index)=>{
  const delta=index?lean:0,localAngle=angle-delta,starts=[delta,angle,180+delta,180+angle],sweeps=[localAngle,180-localAngle,localAngle,180-localAngle];
  const sectors=starts.map((start,i)=>{const name='abcdefgh'[index*4+i],sweep=sweeps[i],bisector=start+sweep/2;
   return {name,start:start+rotation,sweep,selected:selectedNames.includes(name),label:extend(c,bisector,66),leader:extend(c,bisector,28),inside:index?i>=2:i<2,...(panel?{}:{measure:sweep})};});
  return {name:index?'P':'O',center:project(c),sectors,rays:starts.map(a=>({start:project(c),end:extend(c,a,rayLength),angle:normalize(a+rotation)}))};
 });
 const tracingCenter=origin.map((n,i)=>n+(second[i]-n)*move/4);
 const tracing={center:project(tracingCenter),rays:[0,angle,180,180+angle].map(a=>({start:project(tracingCenter),end:extend(tracingCenter,a,rayLength)}))};
 const rails=panel?[{start:project([-w/2-60,-h/2]),end:project([w/2+60,-h/2]),parallel:true},{start:project([-w/2-60,h/2]),end:project([w/2+60,h/2]),parallel:true}]:[origin,second].map((c,i)=>({...line(c,i?lean:0,100),parallel:lean===0}));
 const rectangle=panel?{width:w,height:h,corners:[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(project)}:null;
 const transversal={start:extend(origin,angle,-rayLength),end:extend(second,angle,rayLength)};
 const relation=twoRelation(pair,angle,lean,panel),table=panel?twoCopy.symbolicTable:crossings.flatMap(c=>c.sectors).map(s=>`${s.name}: ${s.measure}°`).join('; ')+'.';
 const tracingState=move===4?(lean===0?twoCopy.aligned:twoCopy.leaning):'';
 const caption=panel?twoCopy.panelCaption:'Both rails and the transversal represent straight infinite lines. Parallel lines have the same direction in this flat plane and do not meet even when extended. Nonparallel lines may meet outside the picture.';
 const source=panel?`${context.caseTitle}. Width ${context.width}, height ${context.height}. ${caption}`:caption;
 const description=`${source} ${relation} Tracing move ${move} of 4. ${move===0?'The tracing starts at O. Four moves take it to P. ':''}${twoCopy.tracingCaption} ${tracingState}${tracingState?' ':''}Picture orientation ${rotation}°. ${prompt?`${prompt.title}. ${prompt.text}`:''}`;
 return {mode,worked,pair,move,prompt,rotation,lean,...(panel?{}:{angle,spacing}),width:640,height:560,center:[320,280],O:project(origin),P:project(second),rails,transversal,rectangle,crossings,tracing,selectedNames,relation,table,caption,tracingCaption:twoCopy.tracingCaption,tracingState,description,context:panel?{caseTitle:context.caseTitle,width:context.width,height:context.height}:null};
}
function twoModel(work,context){
 if(work.page==='parallel'){
  if(work.twoMode==='panel'){
   const c=captureCrossingPanel(context,context?.caseTitle);if(!c)return {mode:'panel',missing:true};
   return twoScene({angle:Math.atan2(c.height,c.width)*180/Math.PI,lean:0,rotation:work.rotation,pair:work.twoPair,move:work.twoMove,prompt:twoPanelPrompts[work.twoPrompt],context:c});
  }
  return twoScene({angle:work.angle,lean:work.twoLean,rotation:work.rotation,spacing:work.twoSpacing,pair:work.twoPair,move:work.twoMove,prompt:twoCrossingsPrompts[work.twoPrompt]});
 }
 if(work.page==='learn'&&work.card>=4)return twoScene({angle:60,lean:work.card===7?10:0,rotation:0,spacing:'middle',pair:work.card===5?'alternate':work.card===6?'co-interior':'corresponding',move:work.card===4&&work.step===0?0:4,prompt:null,worked:true});
 return null;
}
export function crossingAnglesModel(work,context=null){
 if(!valid(work))return null;
 const g=geometry(work.page==='build'?work.angle:60,work.page==='build'?work.rotation:0,work.page==='build'?work.pair:'opposite');
 const diagrams=work.page==='build'||work.card<2?[{title:work.page==='build'?'My crossing':'60° example',geometry:g}]:work.card===2?[{title:'60° example',geometry:g},{title:'90° example',geometry:geometry(90,0)}]:[];
 return {page:work.page,build:{angle:work.angle,rotation:work.rotation,pair:work.pair,prompt:work.prompt,canLess:work.angle>15,canMore:work.angle<165},prompt:crossingPrompts[work.prompt],card:crossingCards[work.card],cardIndex:work.card,step:work.step,geometry:g,diagrams,context:panelContext(context),two:twoModel(work,context),triangle:triangleModel(work,context),polygon:polygonModel(work,context)};
}
export function crossingAnglesNarration(work,context=null){
 const m=crossingAnglesModel(work,context);if(!m)return '';
 if(m.page==='triangle'&&m.polygon){
  const p=m.polygon;
  if(p.missing)return `${copy.title}. Polygon frames. ${polyCopy.nullContext} ${copy.lifetime} Back to Copy Frame.`;
  return `${copy.title}. Polygon frames. ${polyCopy.instruction} ${polyCopy.modes[p.mode]}. ${polyCopy.views[p.view]}. ${p.source} ${p.definition} ${p.naming} ${p.chosen} ${p.current}${p.current?' ':''}${p.counter}${p.counter?'. ':''}${p.text} ${p.equations.join('. ')}${p.equations.length?'. ':''}${p.perTurn}${p.perTurn?'. ':''}${p.fractionNote}${p.fractionNote?' ':''}${p.prompt.title}. ${p.prompt.text} ${polyCopy.modelNote} ${copy.lifetime} Back to Copy Frame.`;
 }
 if(m.page==='triangle'){
  const t=m.triangle;if(t.missing)return `${copy.title}. Triangle corners. ${triCopy.nullContext} ${copy.lifetime} Back to Copy Frame.`;
  return `${copy.title}. Triangle corners. ${triCopy.instruction} ${triCopy.modes[t.mode]}. ${triCopy.views[t.view]}. ${t.source} ${t.definition}. ${t.naming} ${t.summary} ${t.counter?`${t.counter}. `:''}${t.text} ${t.equations.join('. ')}${t.equations.length?'. ':''}${t.workedExample?`Separate worked example. ${t.workedExample} `:''}${t.prompt.title}. ${t.prompt.text} ${triCopy.modelNote} ${copy.lifetime} Back to Copy Frame.`;
 }
 let text;
 if(m.page==='parallel'){
  if(m.two.missing)return `${copy.title}. Two Crossings. ${twoCopy.nullContext} ${copy.lifetime} Back to Copy Frame.`;
  return `${copy.title}. Two Crossings. ${twoCopy.instruction} ${m.two.description} ${twoCopy.legend} ${twoCopy.modelNote} ${copy.lifetime} Back to Copy Frame.`;
 }
 if(m.page==='learn'&&m.cardIndex>=4){const step=m.card.steps?.[m.step];return `${copy.title}. See why. ${twoCopy.header} ${m.card.title}. ${step?`${step.text} ${step.equations.join('. ')}.`:`${m.card.text} ${m.card.equations.join('. ')}.`} ${twoCopy.workedCaption} ${m.two.description} ${twoCopy.legend} ${twoCopy.modelNote} ${copy.lifetime} Back to Copy Frame.`;}
 if(m.page==='build')text=`Explore. ${copy.instruction} ${m.prompt.title}. ${m.prompt.text} ${m.geometry.description} ${copy.straightTurn} ${copy.arcLegend}`;
 else if(m.cardIndex===3){
  if(!m.context)text=`${m.card.title}. ${copy.nullContext}`;
  else {const c=m.context;text=`${m.card.title}. ${m.card.text} ${copy.panelWaitingNote} ${copy.panelLabel}: ${c.caseTitle}. ${copy.panelNote} ${c.frames.map(f=>`${f.description} ${copy.insetLabel}.`).join(' ')} ${copy.subscriptNote} ${c.statement}`;}
 }else {const step=m.card.steps?.[m.step];text=`See why. ${m.card.title}. ${step?`${step.text} ${step.equations.join('. ')}.`:m.card.text} ${m.diagrams.map(d=>`${d.title}. ${d.geometry.description}`).join(' ')} ${copy.arcLegend} ${copy.straightTurn}`;}
 return `${copy.title}. ${text} ${copy.modelNote} ${copy.lifetime} Back to Copy Frame.`;
}
// This scene works only with its explicit geometric inputs. The panel caller
// supplies copied sides, never the inactive free triangle settings.
function triangleScene({raw,A,B,rotation,view,step,prompt,context=null,size='large'}){
 const panel=!!context,C=180-A-B,rad=Math.PI/180;
 const centroid=[0,1].map(i=>raw.reduce((sum,p)=>sum+p[i],0)/3);
 const centered=raw.map(p=>p.map((n,i)=>n-centroid[i]));
 const scale=(size==='small'?80:110)/Math.max(...centered.map(p=>Math.hypot(...p)));
 const local=centered.map(p=>p.map(n=>n*scale));
 const project=([x,y])=>[320+x*Math.cos(rotation*rad)-y*Math.sin(rotation*rad),280-x*Math.sin(rotation*rad)-y*Math.cos(rotation*rad)];
 const vertices=local.map(project),angles=[A,B,C],starts=[0,180-B,180+A];
 const endpoint=(center,start,radius)=>[center[0]+radius*Math.cos(start*rad),center[1]-radius*Math.sin(start*rad)];
 const original=vertices.map((center,i)=>{
  const V=local[i],P=local[(i+1)%3],Q=local[(i+2)%3],d=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]);
  const height=Math.abs((Q[0]-P[0])*(V[1]-P[1])-(Q[1]-P[1])*(V[0]-P[0]))/d(P,Q);
  const radius=Math.min(24,.35*Math.min(d(V,P),d(V,Q)),.7*height);
  return {name:'abc'[i],center,start:starts[i]+rotation,sweep:angles[i],radius,right:panel?i===1:angles[i]===90,...(panel?{}:{measure:angles[i]})};
 });
 const sector=(name,center,start,sweep,radius,role)=>({name,center,start,sweep,radius,right:false,role,...(panel?{}:{measure:sweep})});
 const outline=view!=='gather'||step===0;
 const interiors=outline?original:[],copies=[],parallel=[];
 let straight=null,extension=null,outside=null;
 if(view==='gather'&&step===1){for(const [i,index] of [0,2,1].entries())copies.push(sector('abc'[index],[160+i*160,280],starts[index]+rotation,angles[index],55,'detached'));}
 if(view==='gather'&&step===2){let start=180+rotation;for(const index of [0,2,1]){copies.push(sector('abc'[index],[320,280],start,angles[index],85,'joined'));start+=angles[index];}straight={start:endpoint([320,280],rotation,-160),end:endpoint([320,280],rotation,160)};}
 if(view==='reason'&&step>0){
  parallel.push({start:project([local[2][0]-120,local[2][1]]),end:project([local[2][0]+120,local[2][1]])},{start:project([local[0][0]-60,local[0][1]]),end:project([local[1][0]+60,local[1][1]])});
  copies.push(sector('a',vertices[2],180+rotation,A,original[2].radius,'proof'));
  if(step===2)copies.push(sector('b',vertices[2],360-B+rotation,B,original[2].radius,'proof'));
 }
 if(view==='outside'){
  const [b,c]=[local[1],local[2]],length=Math.hypot(c[0]-b[0],c[1]-b[1]);
  extension={start:vertices[2],end:project([c[0]+60*(c[0]-b[0])/length,c[1]+60*(c[1]-b[1])/length])};
  outside=sector('outside',vertices[2],180-B+rotation,A+B,original[2].radius,'outside');
 }
 const targets='abc'.split('').map(name=>copies.find(s=>s.name===name)||original['abc'.indexOf(name)]);
 const tags=targets.map((s,i)=>({name:s.name,position:[[100,70],[540,70],[320,500]][i],leader:endpoint(s.center,s.start+s.sweep/2,s.radius*.75)}));
 if(outside)tags.push({name:'outside',position:[540,500],leader:endpoint(outside.center,outside.start+outside.sweep/2,outside.radius*.75)});
 const points=outline?vertices.map((point,i)=>{const d=Math.hypot(point[0]-320,point[1]-280);return {name:'ABC'[i],point,position:[point[0]+30*(point[0]-320)/d,point[1]+30*(point[1]-280)/d],leader:point};}):[];
 const equations=view==='gather'?(step===2?[panel?'a+c+90°=180°':`${A}°+${C}°+${B}°=180°`]:[]):view==='reason'?(step===0?[]:step===1?['copied a=a']:['a+c+b=180°',panel?'Here b=90°, so a+c=90°.':`For these settings: ${A}°+${C}°+${B}°=180°.`]):panel?['outside=a+90°','c+outside=180°']:[`outside=${A}°+${B}°=${A+B}°`,`${C}°+${A+B}°=180°`];
 const text=view==='outside'?`${triCopy.outside} ${triCopy.outsideSummary}`:`${triCopy[view][step]}${view==='gather'&&step>0?` ${triCopy.sizeNote}`:''}`;
 const source=panel?`${context.caseTitle}. Width ${context.width}, height ${context.height}. ${triCopy.panelCaption}`:triCopy.freeCaption;
 return {mode:panel?'panel':'free',view,step,rotation,width:640,height:560,vertices,points,outline,interiors,copies,parallel,extension,straight,outside,tags,definition:triCopy.definition,naming:triCopy.naming,summary:panel?'a at A; b =90° at B; c =90° − a at C':`a = ${A}° at A; b = ${B}° at B; c = ${C}° at C. These are chosen model angles.`,source,caption:panel?triCopy.panelCaption:triCopy.freeCaption,text,counter:view==='outside'?'':`${view==='gather'?'Move':'Reason'} ${step} of 2`,equations,workedExample:!panel&&(view==='outside'||step===2)?triCopy.workedExample:'',prompt,...(panel?{context:{caseTitle:context.caseTitle,width:context.width,height:context.height}}:{size})};
}
function panelTriangleScene(context,rotation,view,step,promptIndex){
 const A=Math.atan2(context.height,context.width)*180/Math.PI;
 return triangleScene({raw:[[0,0],[context.width,0],[context.width,context.height]],A,B:90,rotation,view,step,prompt:trianglePanelPrompts[promptIndex],context});
}
function triangleModel(work,context){
 if(work.page!=='triangle'||work.triView==='polygons')return null;
 const step=work.triView==='gather'?work.triGather:work.triView==='reason'?work.triProof:0;
 if(work.triMode==='panel'){
  const c=captureCrossingPanel(context,context?.caseTitle);if(!c)return {mode:'panel',missing:true};
  return panelTriangleScene(c,work.rotation,work.triView,step,work.triPrompt);
 }
 const A=work.triA,B=work.triB,rad=Math.PI/180,t=Math.sin(B*rad)/Math.sin((A+B)*rad);
 return triangleScene({raw:[[0,0],[1,0],[t*Math.cos(A*rad),t*Math.sin(A*rad)]],A,B,rotation:work.rotation,view:work.triView,step,prompt:trianglePrompts[work.triPrompt],size:work.triSize});
}

// The two entry builders deliberately accept only the active channel.
function freePolygonScene(n,kind,size,rotation,view,corner,draw,walk,promptIndex){
 const raw=Array.from({length:n},(_,i)=>{const t=(90+360*i/n)*Math.PI/180;return [(kind==='regular'?1:1.6)*Math.cos(t),Math.sin(t)];});
 return polygonScene({raw,kind,size,rotation,view,corner,draw,walk,prompt:polygonPrompts[promptIndex],mode:'free',regular:kind==='regular',equalCorners:kind==='regular',source:polyCopy.freeCaption});
}
function panelPolygonScene(context,rotation,view,corner,draw,walk,promptIndex){
 const {width,height,caseTitle}=context;
 return polygonScene({raw:[[0,0],[width,0],[width,height],[0,height]],rotation,view,corner,draw,walk,prompt:polygonPanelPrompts[promptIndex],mode:'panel',regular:width===height,equalCorners:true,source:`${caseTitle}. Copied width ${width} × height ${height}.`,context:{caseTitle,width,height}});
}
function polygonModel(work,context){
 if(work.page!=='triangle'||work.triView!=='polygons')return null;
 if(work.triMode==='panel'){
  const c=captureCrossingPanel(context,context?.caseTitle);if(!c)return {mode:'panel',missing:true};
  return panelPolygonScene(c,work.rotation,work.polyView,work.polyPanelCorner,work.polyPanelDraw,work.polyPanelWalk,work.polyPrompt);
 }
 return freePolygonScene(work.polySides,work.polyKind,work.polySize,work.rotation,work.polyView,work.polyCorner,work.polyDraw,work.polyWalk,work.polyPrompt);
}
function polygonScene({raw,kind,size='large',rotation,view,corner,draw,walk,prompt,mode,regular,equalCorners,source,context}){
 const n=raw.length,total=(n-2)*180,rad=Math.PI/180,panel=mode==='panel';
 const centroid=[0,1].map(d=>raw.reduce((s,p)=>s+p[d],0)/n),centered=raw.map(p=>p.map((v,d)=>v-centroid[d]));
 const scale=(size==='small'?120:160)/Math.max(...centered.map(p=>Math.hypot(...p))),local=centered.map(p=>p.map(v=>v*scale));
 const project=([x,y])=>[320+x*Math.cos(rotation*rad)-y*Math.sin(rotation*rad),280-x*Math.sin(rotation*rad)-y*Math.cos(rotation*rad)];
 const vertices=local.map(project),index=i=>(i+n)%n,sub=(a,b)=>a.map((v,d)=>v-b[d]),cross=(a,b)=>a[0]*b[1]-a[1]*b[0],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],unit=v=>v.map(x=>x/Math.hypot(...v));
 const add=(a,b,k=1)=>a.map((v,d)=>v+k*b[d]);
 const i=view==='walk'?index(corner+walk):corner,V=local[i],prev=local[index(i-1)],next=local[index(i+1)],incoming=unit(sub(V,prev)),out=unit(sub(next,V));
 const turn=Math.atan2(cross(incoming,out),dot(incoming,out))/rad,bearing=Math.atan2(incoming[1],incoming[0])/rad,short=Math.min(Math.hypot(...sub(V,prev)),Math.hypot(...sub(next,V)));
 const distances=local.flatMap((p,j)=>j===i||index(j+1)===i?[]:[Math.abs(cross(sub(local[index(j+1)],p),sub(V,p)))/Math.hypot(...sub(local[index(j+1)],p))]);
 const rho=Math.min(24,.35*short),interiorRadius=Math.min(rho,.7*Math.min(...distances));
 const sector=(name,start,sweep,radius,right=false)=>({name,center:vertices[i],start:start+rotation,sweep,radius,right});
 const interior=view==='corner'?sector(`a${i+1}`,bearing+turn,180-turn,interiorRadius,panel||regular&&n===4):null;
 const exterior=view==='walk'&&walk>0?sector(`e${i+1}`,bearing,turn,rho):null;
 const extension=exterior?{start:vertices[i],end:project(add(V,incoming,30))}:null,outgoing=exterior?{start:vertices[i],end:project(add(V,out,Math.min(30,Math.hypot(...sub(next,V)))))}:null;
 let marker=null,startRing=null;
 if(view==='walk'){
  const p=[incoming[1],-incoming[0]],q=[out[1],-out[0]],M=add(V,p,rho+8),tip=add(M,out,7),base=add(M,out,2);
  marker={center:project(M),leader:{start:vertices[i],end:project(M)},heading:{start:project(add(M,out,-7)),end:project(tip)},arrow:[project(tip),project(add(base,q,4)),project(add(base,q,-4))],dotRadius:3};
  startRing={center:vertices[corner],radius:5};
 }
 const complete=draw===n-3,triangles=[],diagonals=[];
 if(view==='split'){
  for(let j=1;j<=(complete?n-2:draw);j++){const indices=[corner,index(corner+j),index(corner+j+1)];triangles.push({indices,points:indices.map(k=>vertices[k])});}
  for(let j=0;j<draw;j++)diagonals.push({start:vertices[corner],end:vertices[index(corner+j+2)]});
 }
 const remaining=[corner,...Array.from({length:n-draw-1},(_,j)=>index(corner+draw+1+j))];
 const remainder=view==='split'&&!complete?{indices:remaining,points:remaining.map(j=>vertices[j])}:null;
 const point=vertices[corner],distance=Math.hypot(point[0]-320,point[1]-280),points=view==='walk'?[]:[{name:'A',point,leader:point,position:[point[0]+55*(point[0]-320)/distance,point[1]+55*(point[1]-280)/distance]}];
 const selected=interior||exterior,tags=selected?[{name:selected.name,position:interior?[85,60]:[555,500],leader:[selected.center[0]+selected.radius*.75*Math.cos((selected.start+selected.sweep/2)*rad),selected.center[1]-selected.radius*.75*Math.sin((selected.start+selected.sweep/2)*rad)]}]:[];
 const plural=(count,word)=>`${count} ${word}${count===1?'':'s'}`;
 const fractional=expr=>`${expr} is the exact size of ${expr.startsWith('360')?'one turn':expr.startsWith('180')?'this adjacent turn':'one corner'}. It is not a whole number of degrees, so no rounded value is shown.`;
 const one=`${total}°÷${n}`,pre=`180°−(${one})`,per=`360°÷${n}`;
 const exact=total%n===0,cornerValue=exact?`=${total/n}°`:'',turnValue=360%n===0?`=${360/n}°`:'';
 let text='',equations=[],perTurn='',fractionNote='',counter='';
 if(view==='split'){
  counter=`${draw} of ${n-3} diagonal${n-3===1?'':'s'}`;
  if(!complete)text=`Join A to a corner that is not its neighbor. Each new diagonal adds a piece. ${plural(draw+1,'piece')} so far: ${plural(draw,'completed triangle')} and one ${n-draw}-sided piece that is not a triangle yet. How many triangles will fill the whole frame?`;
  else {
   text=n===3?'This frame is already one triangle: no diagonal is needed. Its corners total 180°, as Triangle Corners explains.':`Every piece is now a triangle. From A: ${plural(n-3,'diagonal')} and ${n-2} triangles. The two neighbors already share sides with A. One original region plus ${plural(n-3,'added region')} makes ${n-2}. These triangles fill the convex frame, and their angles make exactly the original corners: no gaps, overlaps or extra middle corner. Each triangle contributes 180°, so add ${n-2} lots of 180°. The same argument works from any corner of any convex frame in this model.`;
   text+=' n means the number of sides.';equations=['For n sides: (n−2)×180°',`(${n}−2)×180°=${total}°`,`All corners together: ${total}°`];
  }
 }else if(view==='corner'){
  if(panel){text=`A rectangle has four right angles. All four total 360°, and each is 90°. The corners match even if the sides do not all match. ${regular?'This one is square, so it is regular.':'This rectangle is not square, so it is irregular but has equal angles.'}`;equations=['4×90°=360°','Each corner: 90° (a right angle)','Check: 360°÷4=90°'];}
  else if(regular){text=`This regular frame has ${n} equal corners and ${n} equal sides. All its corners total ${total}°. Share that total equally among the corners to find one. A total is different from one corner.`;equations=[`One corner: ${one}${cornerValue}`,`One adjacent outside turn: ${pre}${turnValue}`];if(!exact)fractionNote=`${fractional(one)} ${fractional(pre)}`;}
  else {text=`Stretching kept the frame convex, but it is no longer regular. Its corners are not all equal. All corners still total ${total}°. Dividing by ${n} finds an average; it does not find the angle at A (a${i+1}).${n===4?' All four sides are still equal, yet the corners are not. Equal sides alone do not make a regular polygon.':''}`;equations=[`All corners together: ${total}°`];}
 }else {
  counter=`${walk} of ${n} turns`;
  if(walk===0)text='Start at A, already pointing along the first side. No turns counted yet. Next stop moves to the next corner and turns there. Predict which way the marker will point after a whole lap.';
  else if(walk<n){text=`We have turned at ${walk} of ${n} corners. This outside turn goes from continuing along the incoming side to following the next side. It sits beside the inside corner on a straight line.`;equations=['Inside corner + adjacent outside turn=180°'];perTurn=panel?`${walk}×90°=${walk*90}° accumulated`:regular?`Each turn: ${pre}${turnValue}`:`Turn at corner ${i+1}: e${i+1}`;if(regular&&!exact&&!panel)fractionNote=fractional(pre);}
  else {text=`Back at A, pointing along the first side again. We made one positive turn at each corner: ${n} turns, one full 360° turn. The same final direction does not mean we turned 0°. Each inside corner and its outside turn make 180°. Taking all inside corners away from ${n} half turns leaves 360°. This convex boundary closes once without crossing or turning inward.`;equations=[`${n}×180°−(${n}−2)×180°=360°`,'All outside turns together: 360°'];perTurn=panel?'Each turn: 90°':regular?`Each turn: ${per}${turnValue}`:`Turn at corner ${i+1}: e${i+1}`;if(regular&&!exact&&!panel)fractionNote=fractional(per);}
 }
 const chosen=`A is corner ${corner+1} of ${n}.`,current=view==='walk'?`Current corner ${i+1} of ${n}.`:'',definition=`${polyCopy.definition} ${polyCopy.regularDefinition}`;
 const description=`${source} ${definition} ${polyCopy.naming} ${chosen} ${current} ${counter}${counter?'.':''} ${text} ${equations.join('. ')} ${perTurn} ${fractionNote} Picture orientation ${rotation}°.`;
 return {mode,view,n,corner,draw,walk,prompt,rotation,regular,equalCorners,total,width:640,height:560,center:[320,280],vertices,triangles,diagonals,remainder,interior,exterior,extension,outgoing,marker,startRing,points,tags,text,counter,equations,perTurn,fractionNote,source,definition,naming:polyCopy.naming,chosen,current,description,...(panel?{context}:{kind,size})};
}
