import {crossingCopy as copy,crossingPrompts,crossingCards,twoCrossingsCopy as twoCopy,twoCrossingsPrompts,twoPanelPrompts,triangleCopy as triCopy,trianglePrompts,trianglePanelPrompts} from './crossing-angles-content.mjs';
const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
const dimension=n=>integer(n,1,12);
const angleValue=n=>integer(n,15,165)&&n%15===0;
const rotationValue=n=>integer(n,0,330)&&n%30===0;
const triAngle=n=>integer(n,15,150)&&n%15===0;
const pairs=['corresponding','alternate','co-interior'];
const spacings={near:120,middle:150,far:180};
function valid(work){return work&&typeof work==='object'&&!Array.isArray(work)&&['build','learn','parallel','triangle'].includes(work.page)&&angleValue(work.angle)&&rotationValue(work.rotation)&&['opposite','adjacent'].includes(work.pair)&&integer(work.prompt,0,5)&&integer(work.card,0,7)&&integer(work.step,0,2)&&['strips','panel'].includes(work.twoMode)&&['near','middle','far'].includes(work.twoSpacing)&&[-10,0,10].includes(work.twoLean)&&pairs.includes(work.twoPair)&&integer(work.twoMove,0,4)&&integer(work.twoPrompt,0,5)&&['free','panel'].includes(work.triMode)&&['gather','reason','outside'].includes(work.triView)&&triAngle(work.triA)&&triAngle(work.triB)&&work.triA+work.triB<=165&&['small','large'].includes(work.triSize)&&integer(work.triGather,0,2)&&integer(work.triProof,0,2)&&integer(work.triPrompt,0,5);}
export function createCrossingAngles(){return {page:'build',angle:60,rotation:0,pair:'opposite',prompt:0,card:0,step:0,twoMode:'strips',twoSpacing:'middle',twoLean:0,twoPair:'corresponding',twoMove:0,twoPrompt:0,triMode:'free',triView:'gather',triA:60,triB:60,triSize:'large',triGather:0,triProof:0,triPrompt:0};}
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
  for(const [act,key,accept] of [['tri-mode','triMode',v=>['free','panel'].includes(v)],['tri-view','triView',v=>['gather','reason','outside'].includes(v)],['tri-gather','triGather',v=>integer(v,0,2)],['tri-proof','triProof',v=>integer(v,0,2)],['tri-prompt','triPrompt',v=>integer(v,0,5)]])if(action===act)return accept(value)?set(key,value):work;
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
 return {page:work.page,build:{angle:work.angle,rotation:work.rotation,pair:work.pair,prompt:work.prompt,canLess:work.angle>15,canMore:work.angle<165},prompt:crossingPrompts[work.prompt],card:crossingCards[work.card],cardIndex:work.card,step:work.step,geometry:g,diagrams,context:panelContext(context),two:twoModel(work,context),triangle:triangleModel(work,context)};
}
export function crossingAnglesNarration(work,context=null){
 const m=crossingAnglesModel(work,context);if(!m)return '';
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
 if(work.page!=='triangle')return null;
 const step=work.triView==='gather'?work.triGather:work.triView==='reason'?work.triProof:0;
 if(work.triMode==='panel'){
  const c=captureCrossingPanel(context,context?.caseTitle);if(!c)return {mode:'panel',missing:true};
  return panelTriangleScene(c,work.rotation,work.triView,step,work.triPrompt);
 }
 const A=work.triA,B=work.triB,rad=Math.PI/180,t=Math.sin(B*rad)/Math.sin((A+B)*rad);
 return triangleScene({raw:[[0,0],[1,0],[t*Math.cos(A*rad),t*Math.sin(A*rad)]],A,B,rotation:work.rotation,view:work.triView,step,prompt:trianglePrompts[work.triPrompt],size:work.triSize});
}
