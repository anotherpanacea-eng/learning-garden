import {crossingCopy as copy,crossingPrompts,crossingCards,twoCrossingsCopy as twoCopy,twoCrossingsPrompts,twoPanelPrompts,triangleCopy as triCopy,trianglePrompts,trianglePanelPrompts,polygonCopy as polyCopy,polygonPrompts,polygonPanelPrompts,matchingCopy,matchingCases,matchingPrompts,matchingPanelPrompts,chaseCopy,chaseCases,chaseExamples,chaseRules} from './crossing-angles-content.mjs';
const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
const dimension=n=>integer(n,1,12);
const angleValue=n=>integer(n,15,165)&&n%15===0;
const rotationValue=n=>integer(n,0,330)&&n%30===0;
const triAngle=n=>integer(n,15,150)&&n%15===0;
const pairs=['corresponding','alternate','co-interior'];
const matchDefaults=()=>({step:0,rotation:120,flip:true,move:0,pair:0});
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const matchChannel=v=>object(v)&&integer(v.step,0,2)&&rotationValue(v.rotation)&&typeof v.flip==='boolean'&&integer(v.move,0,4)&&integer(v.pair,0,2);
function validMatching(m){return object(m)&&['parts','panel'].includes(m.mode)&&['build','fit','letters'].includes(m.view)&&['explore','given'].includes(m.fit)&&typeof m.case==='string'&&Object.hasOwn(matchingCases,m.case)&&integer(m.prompt,0,5)&&matchChannel(m.parts)&&matchChannel(m.panel)&&integer(m.parts.variant,0,['ssa','aaa'].includes(m.case)?3:1);}
const spacings={near:120,middle:150,far:180};
function valid(work){return work&&typeof work==='object'&&!Array.isArray(work)&&['build','learn','parallel','triangle','matching','chase'].includes(work.page)&&validChase(work.chase)&&validMatching(work.matching)&&angleValue(work.angle)&&rotationValue(work.rotation)&&['opposite','adjacent'].includes(work.pair)&&integer(work.prompt,0,5)&&integer(work.card,0,7)&&integer(work.step,0,2)&&['strips','panel'].includes(work.twoMode)&&['near','middle','far'].includes(work.twoSpacing)&&[-10,0,10].includes(work.twoLean)&&pairs.includes(work.twoPair)&&integer(work.twoMove,0,4)&&integer(work.twoPrompt,0,5)&&['free','panel'].includes(work.triMode)&&['gather','reason','outside','polygons'].includes(work.triView)&&triAngle(work.triA)&&triAngle(work.triB)&&work.triA+work.triB<=165&&['small','large'].includes(work.triSize)&&integer(work.triGather,0,2)&&integer(work.triProof,0,2)&&integer(work.triPrompt,0,5)&&integer(work.polySides,3,12)&&['regular','stretched'].includes(work.polyKind)&&['small','large'].includes(work.polySize)&&['split','corner','walk'].includes(work.polyView)&&integer(work.polyCorner,0,work.polySides-1)&&integer(work.polyDraw,0,work.polySides-3)&&integer(work.polyWalk,0,work.polySides)&&integer(work.polyPrompt,0,5)&&integer(work.polyPanelCorner,0,3)&&integer(work.polyPanelDraw,0,1)&&integer(work.polyPanelWalk,0,4);}
export function createCrossingAngles(){return {page:'build',angle:60,rotation:0,pair:'opposite',prompt:0,card:0,step:0,twoMode:'strips',twoSpacing:'middle',twoLean:0,twoPair:'corresponding',twoMove:0,twoPrompt:0,triMode:'free',triView:'gather',triA:60,triB:60,triSize:'large',triGather:0,triProof:0,triPrompt:0,polySides:5,polyKind:'regular',polySize:'large',polyView:'split',polyCorner:0,polyDraw:0,polyWalk:0,polyPrompt:0,polyPanelCorner:0,polyPanelDraw:0,polyPanelWalk:0,chase:createChase(),matching:{mode:'parts',view:'build',fit:'explore',case:'sss',prompt:0,parts:{variant:0,...matchDefaults()},panel:matchDefaults()}};}
export function changeCrossingAngles(work,action,value){
 if(!valid(work))return work;
 const set=(key,v)=>work[key]===v?work:{...work,[key]:v};
 if(action==='page')return ['build','learn','parallel','triangle','matching','chase'].includes(value)?set('page',value):work;
 if(work.page==='chase')return changeChase(work,action,value);
 if(work.page==='matching'){
  const m=work.matching,channel=m.mode;
  const outer=(key,v)=>m[key]===v?work:{...work,matching:{...m,[key]:v}};
  const inner=(key,v)=>m[channel][key]===v?work:{...work,matching:{...m,[channel]:{...m[channel],[key]:v}}};
  if(action==='match-mode')return ['parts','panel'].includes(value)?outer('mode',value):work;
  if(action==='match-view')return ['build','fit','letters'].includes(value)?outer('view',value):work;
  if(action==='match-prompt')return integer(value,0,5)?outer('prompt',value):work;
  if(channel==='parts'){
   if(action==='match-case')return typeof value==='string'&&Object.hasOwn(matchingCases,value)&&m.case!==value?{...work,matching:{...m,case:value,parts:{variant:0,...matchDefaults()}}}:work;
   if(action==='match-variant')return integer(value,0,['ssa','aaa'].includes(m.case)?3:1)?inner('variant',value):work;
  }
  if(action==='match-step'&&m.view==='build')return integer(value,0,2)?inner('step',value):work;
  if(action==='match-pair'&&m.view==='letters')return integer(value,0,2)?inner('pair',value):work;
  if(m.view==='fit'){
   if(action==='match-fit')return ['explore','given'].includes(value)?outer('fit',value):work;
   if(m.fit==='explore'){
    if(action==='match-rotation')return rotationValue(value)?inner('rotation',value):work;
    if(action==='match-move')return integer(value,0,4)?inner('move',value):work;
    if(action==='match-flip'&&value===undefined)return inner('flip',!m[channel].flip);
    if(action==='match-home'&&value===undefined)return m[channel].rotation===120&&m[channel].flip===true&&m[channel].move===0?work:{...work,matching:{...m,[channel]:{...m[channel],rotation:120,flip:true,move:0}}};
   }
  }
  return work;
 }
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
 if(work.page==='chase'){const c=work.chase,b=c.boards[c.case];return {page:'chase',chase:c.view==='example'?buildChaseExample(chaseCases[c.case].family,b.exampleStep):buildChaseSolve({caseIndex:c.case,target:b.target,rotation:b.rotation,answers:b.answers,view:c.view,exampleStep:b.exampleStep})};}
 const g=geometry(work.page==='build'?work.angle:60,work.page==='build'?work.rotation:0,work.page==='build'?work.pair:'opposite');
 const diagrams=work.page==='build'||work.card<2?[{title:work.page==='build'?'My crossing':'60° example',geometry:g}]:work.card===2?[{title:'60° example',geometry:g},{title:'90° example',geometry:geometry(90,0)}]:[];
 return {page:work.page,chase:null,build:{angle:work.angle,rotation:work.rotation,pair:work.pair,prompt:work.prompt,canLess:work.angle>15,canMore:work.angle<165},prompt:crossingPrompts[work.prompt],card:crossingCards[work.card],cardIndex:work.card,step:work.step,geometry:g,diagrams,context:panelContext(context),two:twoModel(work,context),triangle:triangleModel(work,context),polygon:polygonModel(work,context),matching:matchingModel(work,context)};
}
export function crossingAnglesNarration(work,context=null){
 const m=crossingAnglesModel(work,context);if(!m)return '';
 if(m.page==='chase')return chaseNarration(m.chase);
 if(m.page==='matching'){
  const t=m.matching;if(t.missing)return `${matchingCopy.title}. ${matchingCopy.nullContext} ${copy.lifetime} Back to Copy Frame.`;
  return `${matchingCopy.title}. ${matchingCopy.instruction} ${matchingCopy.modes[t.mode]}. ${matchingCopy.views[t.view]}. ${t.source}. ${t.variantLabel?`${t.variantLabel}. `:''}${t.givens.join('; ')}. ${t.chosen} ${t.counter}. ${t.view==='fit'&&t.fit==='explore'?`Copy reflection: ${t.flip?'reflected':'unreflected'}. `:''}${t.legend} ${t.caption} ${t.poseNote} ${t.completedNotice} ${t.currentPair} ${t.reasonLabel} ${t.text} ${t.view==='letters'?`${t.definition} ${t.naming} ${t.notation}`:''} ${t.prompt.title}. ${t.prompt.text} ${matchingCopy.modelNote} ${copy.lifetime} Back to Copy Frame.`;
 }
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

// Matching scenes receive only active inputs; no other page or source can
// participate in a construction or in its authored geometric explanation.
const matchRad=Math.PI/180;
const matchU=5*Math.sin(60*matchRad)*Math.cos(50*matchRad)/Math.sin(70*matchRad);
const matchV=5*Math.sin(60*matchRad)*Math.sin(50*matchRad)/Math.sin(70*matchRad);
const matchCentroid=raw=>[0,1].map(i=>raw.reduce((n,p)=>n+p[i],0)/3);
const matchTurn=([x,y],rotation,flip)=>{y=flip?-y:y;const r=rotation*matchRad;return [x*Math.cos(r)-y*Math.sin(r),x*Math.sin(r)+y*Math.cos(r)];};
function matchRaw(key,variant){
 let raw;
 if(key==='sss')raw=[[0,0],[5,0],[16/5,12/5]];
 else if(key==='sas')raw=[[0,0],[8,0],[5/2,5*Math.sqrt(3)/2]];
 else if(key==='rhs')raw=[[0,0],[4,3],[4,0]];
 else if(key==='ssa')raw=[[0,0],[3*Math.sqrt(3)+(variant%2?-1:1)*Math.sqrt(7),0],[3*Math.sqrt(3),3]];
 else {const k=key==='aaa'&&variant%2?8/5:1;raw=[[0,0],[5*k,0],[matchU*k,matchV*k]];}
 const lower=['ssa','aaa'].includes(key)?variant>=2:variant===1;
 return raw.map(([x,y])=>[x,lower?-y:y]);
}
function matchRight(points,index,role){
 const b=points[index],a=points[(index+1)%3],c=points[(index+2)%3];
 const unit=p=>{const d=[p[0]-b[0],p[1]-b[1]],n=Math.hypot(...d);return d.map(v=>v/n*12);};
 const u=unit(a),v=unit(c);
 return {role,points:[[b[0]+u[0],b[1]+u[1]],[b[0]+u[0]+v[0],b[1]+u[1]+v[1]],[b[0]+v[0],b[1]+v[1]]]};
}
function matchGeometry(){return {width:640,height:560,reference:null,candidate:null,segments:[],circles:[],rays:[],meetings:[],labels:[],rightMarks:[],rectangle:null,diagonal:null,description:''};}
function matchLabel(g,name,point,anchor,role='candidate',selected=false){g.labels.push({name,point,anchor,role,selected});}
function matchBuild(key,variant,step){
 const g=matchGeometry(),raw=matchRaw(key,variant),project=([x,y])=>[200+28*x,340-28*y],p=raw.map(project),lower=['ssa','aaa'].includes(key)?variant>=2:variant===1,sign=lower?-1:1;
 const seg=(a,b)=>g.segments.push({start:p[a],end:p[b],role:'candidate'});
 const ray=(origin,angle,length)=>g.rays.push({start:project(origin),end:project([origin[0]+length*Math.cos(angle*matchRad),origin[1]+length*Math.sin(angle*matchRad)])});
 const circle=(center,radius)=>g.circles.push({center:project(center),radius:radius*28});
 const meeting=(point,selected)=>g.meetings.push({point:project(point),selected});
 const first=['rhs','ssa'].includes(key)?2:1;seg(0,first);
 let placed=[0,first];
 if(key==='ssa')ray([0,0],0,9);
 if(step>=1){
  if(key==='sss'){circle(raw[0],4);circle(raw[1],3);meeting(raw[2],true);meeting([16/5,-sign*12/5],false);}
  if(key==='sas'){ray([0,0],sign*60,6);circle([0,0],5);meeting(raw[2],true);}
  if(['asa','aas','aaa'].includes(key)){
   ray([0,0],sign*50,8);
   if(key!=='aas'||step===2){ray(raw[1],sign*120,8);meeting(raw[2],true);}
  }
  if(key==='rhs'){
   circle([0,0],5);g.rays.push({start:project([4,-4]),end:project([4,4]),line:true});meeting(raw[1],true);meeting([4,-sign*3],false);g.rightMarks.push(matchRight(p,2,'candidate'));
  }
  if(key==='ssa'){
   circle(raw[2],4);meeting(raw[1],true);meeting([3*Math.sqrt(3)+(variant%2?1:-1)*Math.sqrt(7),0],false);
  }
  if(key!=='aas'||step===2)placed=[0,1,2];
 }
 if(step===2){g.candidate={points:p,names:['D','E','F']};g.segments=[];}
 placed.forEach(i=>matchLabel(g,'DEF'[i],p[i],[[85,70],[555,70],[85,500]][i]));
 return g;
}
function matchCompare(reference,candidate,scale,view,fit,channel,panel,lower,rightIndex){
 const g=matchGeometry(),rc=matchCentroid(reference),cc=matchCentroid(candidate),provided=view==='letters'||fit==='given';
 const screen=([x,y])=>[320+x*scale,280-y*scale];
 const rp=reference.map(p=>screen(p.map((v,i)=>v-rc[i])));
 const rotation=provided?(panel?180:0):channel.rotation,flip=provided?(panel?false:lower):channel.flip;
 const turned=candidate.map(p=>matchTurn(p.map((v,i)=>v-cc[i]),rotation,flip));
 const offset=provided?[rp[0][0]-320-turned[0][0]*scale,rp[0][1]-280+turned[0][1]*scale]:[80-20*channel.move,0];
 const cp=turned.map(p=>{const q=screen(p);return [q[0]+offset[0],q[1]+offset[1]];});
 g.reference={points:rp,names:['A','B','C']};g.candidate={points:cp,names:['D','E','F']};
 rp.forEach((p,i)=>matchLabel(g,'ABC'[i],p,[[70,70],[320,50],[570,70]][i],'reference',view==='letters'&&channel.pair===i));
 cp.forEach((p,i)=>matchLabel(g,'DEF'[i],p,[[70,500],[320,520],[570,500]][i],'candidate',view==='letters'&&channel.pair===i));
 if(rightIndex!==null){g.rightMarks.push(matchRight(rp,rightIndex,'reference'),matchRight(cp,rightIndex,'candidate'));}
 return g;
}
function matchCommon(mode,view,fit,promptIndex,channel){
 return {mode,view,...(view==='fit'?{fit}:{}),promptIndex,prompt:(mode==='panel'?matchingPanelPrompts:matchingPrompts)[promptIndex],...(view==='build'?{step:channel.step}:{}),...(view==='letters'?{pair:channel.pair}:{}),...(view==='fit'&&fit==='explore'?{rotation:channel.rotation,flip:channel.flip,move:channel.move}:{}),source:'',givens:[],chosen:'',definition:matchingCopy.definition,naming:matchingCopy.naming,notation:matchingCopy.notation,legend:view==='build'?'D, E and F name the construction points. Light guides locate possible meetings.':'Dark solid outline: reference A/B/C. Purple dashed outline: copy D/E/F. Thin dotted lines lead to the letter tags.',text:'',reasonLabel:'',currentPair:'',completedNotice:view==='build'?'':mode==='parts'?'Compare and Letters use completed outlines from this parts card. Your construction step is kept.':'Compare and Letters use the two complete rectangle halves. Your construction step is kept.',counter:view==='build'?`Step ${channel.step} of 2`:view==='letters'?`Point pair ${channel.pair+1} of 3: ${['A ↔ D','B ↔ E','C ↔ F'][channel.pair]}`:fit==='explore'?`Slide ${channel.move} of 4. Copy turn: ${channel.rotation}°`:'Line up the given parts',caption:'',poseNote:view==='build'?'':view==='letters'?'A steady comparison for reading letters; your move-and-turn choices are kept.':fit==='explore'?matchingCopy.miss:'A provided rigid comparison pose lines up the given parts without changing any length.'};
}
function matchingParts(key,variant,view,fit,channel,prompt){
 const m=matchCommon('parts',view,fit,prompt,channel),c=matchingCases[key],lower=['ssa','aaa'].includes(key)?variant>=2:variant===1;
 const base=key==='aaa'&&variant%2?8:5;
 Object.assign(m,{case:key,caseTitle:c.title,variant,variantCount:['ssa','aaa'].includes(key)?4:2,variantLabel:key==='ssa'?`${variant%2?'Near closure, shorter base':'Far closure, longer base'}; ${lower?'reflected lower':'upper'} placement`:key==='aaa'?`Chosen base ${base}; ${lower?'reflected lower':'upper'} placement`:`${lower?'Reflected lower':'Upper'} placement`,givens:c.givens,source:c.title});
 if(key==='aaa')m.chosen=`This build uses a base of ${base} units; the parts card did not fix it.`;
 const reason=c.reason+' '+matchingCopy.circleFacts+(!['ssa','aaa'].includes(key)?' '+matchingCopy.uniqueness:'');
 if(view==='build'){
  m.text=channel.step===0?`Start with ${key==='aaa'?`chosen DE ${base}`:c.firstPart}. The card fixes: ${c.givens.join('; ')}. Where could the missing point go? ${m.chosen}`:channel.step===1?`${matchingCopy.circleRay} ${c.guide}`:reason;
  m.caption=key==='sss'&&channel.step>=1?'The light unselected meeting is the reflected alternative.':key==='rhs'&&channel.step>=1?'The light unselected meeting is on the other side of DF.':key==='ssa'&&channel.step>=1?'Both meetings are on the positive DE ray: one shorter base and one longer base. The light dot is the other closure.':'';
  m.geometry=matchBuild(key,variant,channel.step);
  if(key==='aaa'&&channel.step===2)m.geometry.labels.find(label=>label.name==='F').givenAngle=70;
 }else{
  m.text=reason;m.reasonLabel='About the possible builds:';
  m.currentPair=key==='ssa'?(variant%2?'This near closure and the far reference have different base lengths. Moving, turning or reflecting keeps those lengths.':'This build matches the reference closure. The card also allows a shorter base. Try Another build.'):key==='aaa'?(variant%2?'The same angles allow this base of 8 and the reference base of 5. These triangles have different sizes.':'This chosen size matches the reference. The angles card also allows other sizes. Try Another build.'):'This build has the same shape and size as the reference. Another build may reflect its placement.';
  m.relationship=['ssa','aaa'].includes(key)&&variant%2?'different':'same';
  m.geometry=matchCompare(matchRaw(key,0),matchRaw(key,variant),40,view,fit,channel,false,lower,key==='rhs'?2:null);
 }
 m.geometry.description=`${c.title}. ${m.counter}. ${m.caption} ${view==='build'?m.text:m.currentPair}`;
 return m;
}
function matchingPanel(source,view,fit,channel,prompt){
 const {width:w,height:h,caseTitle}=source,m=matchCommon('panel',view,fit,prompt,channel);
 m.source=`${caseTitle}. Waiting rectangle: width ${w}, height ${h}.`;m.givens=[`AB = DE = ${w}`,`BC = EF = ${h}`,'CA and FD are the same diagonal','∠B = ∠E = 90°'];
 m.caption='ABC uses P, Q, R. DEF uses R, S, P. Opposite rectangle sides match, and both included corners are right angles.';
 if(view==='build'){
  const g=matchGeometry(),project=([x,y])=>[320+24*(x-w/2),280-24*(y-h/2)],raw=[[0,0],[w,0],[w,h],[0,h]],p=raw.map(project);
  g.rectangle=p;
  if(channel.step>=1)g.diagonal={start:p[0],end:p[2]};
  if(channel.step===2){g.reference={points:[p[0],p[1],p[2]],names:['A','B','C']};g.candidate={points:[p[2],p[3],p[0]],names:['D','E','F']};}
  p.forEach((point,i)=>matchLabel(g,'PQRS'[i],point,[[85,500],[555,500],[555,70],[85,70]][i],'panel'));
  g.rightMarks=[matchRight([p[0],p[1],p[2]],1,'reference'),matchRight([p[2],p[3],p[0]],1,'candidate')];
  m.geometry=g;m.text=channel.step===0?`This is your waiting rectangle: width ${w}, height ${h}. What can you say about opposite sides and square corners?`:channel.step===1?'Join P to R with one diagonal. It makes two triangular halves, and both share that same segment.':matchingCopy.panelReason;
 }else{
  const reference=[[0,0],[w,0],[w,h]],candidate=[[w,h],[0,h],[0,0]],rc=matchCentroid(reference),cc=matchCentroid(candidate),radius=Math.max(...reference.map(p=>Math.hypot(...p.map((v,i)=>v-rc[i]))),...candidate.map(p=>Math.hypot(...p.map((v,i)=>v-cc[i]))));
  m.geometry=matchCompare(reference,candidate,180/radius,view,fit,channel,true,false,1);m.text=matchingCopy.panelReason;m.reasonLabel='About the rectangle halves:';m.currentPair='The two rectangle halves have the same shape and size. Their opposite sides match and they share the diagonal.';m.relationship='same';
 }
 m.caption+=' Drawing zoom can vary between views; the part lengths do not. Both compared outlines always share one scale.';
 m.geometry.description=`${m.source} ${m.counter}. ${m.caption} ${view==='build'?m.text:m.currentPair}`;
 return m;
}
function matchingModel(work,context){
 if(work.page!=='matching')return null;
 const m=work.matching;
 if(m.mode==='parts')return matchingParts(m.case,m.parts.variant,m.view,m.fit,m.parts,m.prompt);
 const captured=captureCrossingPanel(context,context?.caseTitle);
 if(!captured)return {mode:'panel',missing:true};
 const {caseTitle,width,height}=captured;
 return matchingPanel({caseTitle,width,height},m.view,m.fit,m.panel,m.prompt);
}

const freshChaseAnswer=()=>({draft:'',reason:null,checked:false,hint:false,exampleSeen:false,solution:false});
const freshChaseBoard=c=>({target:0,rotation:0,exampleStep:0,answers:c.targets.map(freshChaseAnswer)});
const createChase=()=>({case:0,view:'solve',boards:chaseCases.map(freshChaseBoard)});
function validChase(c){return object(c)&&integer(c.case,0,chaseCases.length-1)&&['solve','example'].includes(c.view)&&Array.isArray(c.boards)&&c.boards.length===chaseCases.length&&Array.from(c.boards).every((b,i)=>object(b)&&integer(b.target,0,chaseCases[i].targets.length-1)&&rotationValue(b.rotation)&&integer(b.exampleStep,0,chaseCases[i].targets.length)&&Array.isArray(b.answers)&&b.answers.length===chaseCases[i].targets.length&&Array.from(b.answers).every((a,j)=>object(a)&&typeof a.draft==='string'&&/^[0-9]{0,3}$/.test(a.draft)&&(a.reason===null||typeof a.reason==='string'&&chaseCases[i].targets[j].offered.includes(a.reason))&&['checked','hint','exampleSeen','solution'].every(k=>typeof a[k]==='boolean')));}
function changeChase(work,action,value){
 const c=work.chase,b=c.boards[c.case],spec=chaseCases[c.case],a=b.answers[b.target];
 const outer=(k,v)=>c[k]===v?work:{...work,chase:{...c,[k]:v}};
 const board=next=>next===b?work:{...work,chase:{...c,boards:c.boards.map((v,i)=>i===c.case?next:v)}};
 const field=(k,v)=>b[k]===v?work:board({...b,[k]:v});
 const answerPatch=patch=>Object.entries(patch).every(([k,v])=>a[k]===v)?work:board({...b,answers:b.answers.map((v,i)=>i===b.target?{...v,...patch}:v)});
 if(c.view==='example'){
  if(action==='chase-example-step'&&integer(value,0,spec.targets.length))return field('exampleStep',value);
  if(action==='chase-return'&&value===undefined)return outer('view','solve');
  return work;
 }
 if(action==='chase-case'&&integer(value,0,chaseCases.length-1))return outer('case',value);
 if(action==='chase-target'&&integer(value,0,spec.targets.length-1))return field('target',value);
 if(action==='chase-rotation'&&rotationValue(value))return field('rotation',value);
 if(action==='chase-digit'&&typeof value==='string'&&/^[0-9]$/.test(value)&&a.draft.length<3)return answerPatch({draft:a.draft+value,checked:false});
 if(action==='chase-reason'&&spec.targets[b.target].offered.includes(value))return a.reason===value?work:answerPatch({reason:value,checked:false});
 if(value!==undefined)return work;
 if(action==='chase-clear')return a.draft===''?work:answerPatch({draft:'',checked:false});
 if(action==='chase-backspace')return a.draft===''?work:answerPatch({draft:a.draft.slice(0,-1),checked:false});
 if(action==='chase-check')return answerPatch({checked:true});
 if(action==='chase-hint')return answerPatch({hint:true});
 if(action==='chase-solution')return answerPatch({solution:true});
 if(action==='chase-example')return {...work,chase:{...c,view:'example',boards:c.boards.map((v,i)=>i===c.case?{...b,answers:b.answers.map(x=>x.exampleSeen?x:{...x,exampleSeen:true})}:v)}};
 if(action==='chase-restart')return b.target===0&&b.rotation===0&&b.exampleStep===0&&b.answers.every(a=>a.draft===''&&a.reason===null&&!a.checked&&!a.hint&&!a.exampleSeen&&!a.solution)?work:board(freshChaseBoard(spec));
 return work;
}
const numericChase=a=>a.draft!==''?Number(a.draft):null;
function chaseMissing(spec,t,id){
 if(spec.family==='regular'&&t.name==='x'&&id==='point')return "x and y fill a half turn at A. The polygon's corners are different points, not parts of one turn around A.";
 if(spec.family==='regular'&&t.name==='y'&&id==='opposite')return 'x and y are beside each other at A, not across a crossing.';
 if(spec.family==='quadrilateral'&&t.name==='x'&&id==='regular')return 'The marked inside corners are unequal. Share equally only when the corners are equal; here subtract the known corners.';
 if(spec.family==='quadrilateral'&&t.name==='y'&&id==='equalOutside')return 'The known inside corners are not all equal, so the outside turns are not all equal either. The four positive outside turns still total 360°, but four equal shares do not find y.';
 if(id==='insufficient')return 'The marked right corner and angle a do determine x.';
 if(id==='opposite')return 'The marked regions are not across the same crossing from each other.';
 if(id==='point')return 'These marked parts do not cover one whole turn around the point.';
 if(id==='triangle')return 'These marked regions are not the three inside corners of one closed triangle.';
 if(id==='alternate')return 'x is outside the parallel lines at Q; it is not an alternate interior partner of a.';
 if(id==='cointerior')return 'x is outside the parallel lines at Q; it is not a co-interior partner of a.';
 return 'These marked parts do not fill one straight half turn.';
}
function chaseFeedback(spec,t,a){
 if(!a.checked)return 'Not checked yet.';
 const v=numericChase(a),number=v===spec.key[t.name],reason=t.accepted.includes(a.reason),r=t.relations[a.reason];
 if(v===null)return spec.family==='rectangle'&&t.name==='x'&&a.reason==='insufficient'?'The marked right corner and angle a do determine x. Try a whole-number angle, or open a hint when you’re ready.':'Enter a whole-number angle, then check when you’re ready.';
 if(v>360)return 'Use a whole-number angle from 0° to 360°.';
 if(a.reason===null)return number?'The number fits these facts. Choose a reason when you’re ready.':'Check the number using the marked facts. Choose a reason when you’re ready.';
 if(number&&reason)return `${t.name} = ${v}°. ${r.text}`;
 if(number)return `The number fits. This relationship does not explain the marked parts. ${chaseMissing(spec,t,a.reason)}`;
 if(reason)return `That relationship fits here. Check the calculation using ${r.formula}${r.predecessor?`, and the value you used for ${r.predecessor}`:''}.`;
 return `Let’s look at the marked facts again. ${chaseMissing(spec,t,a.reason)} A hint or a different worked sketch can help.`;
}
function polygonChaseWorking(spec,name){
 const {a,b,c,n}=spec.givens,k=spec.key;
 if(spec.family==='regular')return name==='x'?`x = (${n} − 2) × 180° ÷ ${n} = ${(n-2)*180}° ÷ ${n} = ${k.x}°. A fan has n − 2 triangles, each with 180°. The inside corners are equal, so share the total equally.`:`y = 360° ÷ ${n} = ${k.y}°. One positive outside turn at each corner totals 360°. The turns are equal because the inside corners are equal. These corners are different points, not parts of one turn around A.`;
 return name==='x'?`x = 360° − ${a}° − ${b}° − ${c}° = ${k.x}°. Subtract the three known inside corners from the four-corner total.`:`y = 360° − (180° − ${a}°) − (180° − ${b}°) − (180° − ${c}°) = ${k.y}°. Each known inside corner has an adjacent outside turn. The four positive outside turns total 360°. These corners are different points, not parts of one turn around D.`;
}
function chaseSolution(spec,name){
 if(['regular','quadrilateral'].includes(spec.family))return `Shown solution: ${name} = ${spec.key[name]}°. ${polygonChaseWorking(spec,name)} This is provided help; your answer is kept separately.`;
 const {a,c,p,q}=spec.givens,k=spec.key;
 const routes={crossing:{x:`x = 180° − ${a}° = ${k.x}°. A–O–C is straight.`,y:`y = 180° − ${a}° = ${k.y}°. B–O–D is straight.`},hub:{x:`x = 360° − ${p}° − ${q}° = ${k.x}°. p, q and x fill one whole turn at O.`,y:`p + q + x = 360° around O gives x = 360° − ${p}° − ${q}° = ${k.x}°. Then y = 180° − ${k.x}° = ${k.y}° on straight C–O–E.`,z:`z = 180° − ${q}° = ${k.z}°. E–O–C is straight.`},triangle:{x:`x = 180° − ${a}° − ${c}° = ${k.x}°. These are the inside corners of ABC.`,y:`y = ${a}° + ${c}° = ${k.y}°. The outside angle equals the two far inside corners.`},parallel:{x:`x = a = ${a}°. Corresponding angles on the marked parallel lines match.`,y:`y = a = ${a}°. Alternate interior angles on the marked parallel lines match.`,z:`z = 180° − ${a}° = ${k.z}°. Co-interior angles on the marked parallel lines total 180°.`},rectangle:{x:`x = 90° − ${a}° = ${k.x}°. The corner at A is right.`,y:`y = a = ${a}°. Alternate interior angles on AB ∥ DC match.`,z:`First y = a = ${a}° by alternate angles on AB ∥ DC. Then z = 90° − ${k.y}° = ${k.z}° at right corner C.`}};
 const extra=spec.family==='hub'&&name==='y'||spec.family==='rectangle'&&name==='z';
 return `Shown solution: ${name} = ${k[name]}°. ${routes[spec.family][name]} This is provided help; your answer is kept separately.${extra?' This working shows a value used by another angle. It does not fill your answers.':''}`;
}
function chaseProvided(spec,answers){const set=new Set();answers.forEach((a,i)=>{if(a.solution){const name=spec.targets[i].name;set.add(name);if(spec.family==='hub'&&name==='y')set.add('x');if(spec.family==='rectangle'&&name==='z')set.add('y');}});return set;}
// The schematic has source-authored incidence. Its visual angles do not measure keys.
function chaseGeometry(spec,rotation,visible,activeName=null){
 const rad=Math.PI/180,polar=a=>[3*Math.cos(a*rad),3*Math.sin(a*rad)];
 const plans={
 crossing:{points:{O:[0,0],A:polar(0),B:polar(55),C:polar(180),D:polar(235)},center:[0,0],scale:52,lines:[['A','C'],['B','D']],sectors:[['a','O','A','B'],['x','O','B','C'],['y','O','D','A']]},
 hub:{points:{O:[0,0],A:polar(0),E:polar(60),B:polar(115),C:polar(240)},center:[0,0],scale:52,lines:[['O','A'],['O','B'],['C','E']],sectors:[['p','O','A','B',96],['q','O','B','C'],['x','O','C','A'],['y','O','A','E'],['z','O','E','B']]},
 triangle:{points:{A:[0,0],B:[4,0],C:[1.5,3],D:[6,0]},center:[3,1.5],scale:45,lines:[['A','D'],['A','C'],['B','C']],sectors:[['a','A','B','C'],['c','C','A','B'],['x','B','C','A'],['y','B','D','C']]},
 parallel:{points:{A:[-2,1],P:[0,1],B:[2,1],C:[-2,-1],Q:[1,-1],D:[3,-1],R:[-1,3],S:[2,-3]},center:[.5,0],scale:45,lines:[['A','B'],['C','D'],['R','S']],sectors:[['a','P','Q','B'],['x','Q','S','D'],['y','Q','P','C'],['z','Q','D','P']]},
 rectangle:{points:{A:[0,0],B:[4,0],C:[4,3],D:[0,3]},center:[2,1.5],scale:60,lines:[['A','B'],['B','C'],['C','D'],['D','A'],['A','C']],sectors:[['a','A','B','C'],['x','A','C','D'],['y','C','D','A'],['z','C','A','B']]}
 };
 if(spec.family==='regular'){
  const vertices=Array.from({length:spec.givens.n},(_,i)=>polar(90+360*i/spec.givens.n)),A=vertices[0],C=vertices.at(-1),length=Math.hypot(A[0]-C[0],A[1]-C[1]);
  const points=Object.fromEntries(vertices.map((p,i)=>[i===0?'A':i===1?'B':i===vertices.length-1?'C':`vertex${i}`,p]));
  points.D=A.map((v,i)=>v+.75*(v-C[i])/length);
  const names=Object.keys(points).filter(n=>n!=='D');
  plans.regular={points,visiblePoints:['A','B','C','D'],center:[0,0],scale:46,lines:[...names.map((n,i)=>[n,names[(i+1)%names.length]]),['A','D']],sectors:[['x','A','B','C'],['y','A','D','B']]};
 }
 if(spec.family==='quadrilateral'){
  const points={A:[0,0],B:[4,0],C:[3,3],D:[-1,2]},length=Math.hypot(4,1);
  points.E=points.D.map((v,i)=>v+.75*(v-points.C[i])/length);
  plans.quadrilateral={points,center:[1.5,1.25],scale:46,lines:[['A','B'],['B','C'],['C','D'],['D','A'],['D','E']],sectors:[['a','A','B','D'],['b','B','C','A'],['c','C','D','B'],['x','D','A','C'],['y','D','E','A']]};
 }
 const plan=plans[spec.family],rot=rotation*rad;
 const project=([x,y])=>{x=(x-plan.center[0])*plan.scale;y=(y-plan.center[1])*plan.scale;return [320+x*Math.cos(rot)-y*Math.sin(rot),280-x*Math.sin(rot)-y*Math.cos(rot)];};
 // Point names must sit beyond the small angle arcs, including on phones.
 // Crossing/hub centres and parallel intersections use unmarked directions.
 const labelAngles={crossing:{O:207.5},hub:{O:180},parallel:{P:148,Q:238}};
 const points=Object.entries(plan.points).filter(([name])=>!plan.visiblePoints||plan.visiblePoints.includes(name)).map(([name,p])=>{
  const point=project(p),fixed=labelAngles[spec.family]?.[name],dx=point[0]-320,dy=point[1]-280,length=Math.hypot(dx,dy)||1;
  const offset=fixed===undefined?[64*dx/length,64*dy/length]:[80*Math.cos((fixed+rotation)*rad),-80*Math.sin((fixed+rotation)*rad)];
  // Keep quadrilateral names below the fixed given row at every rotation.
  // These finite anchors also clear the actual corner arcs on narrow screens.
  const anchor=spec.family==='quadrilateral'?{A:[0,-140],B:[140,0],C:[0,140],D:[-130,-50],E:[-107,90]}[name]:null;
  const position=anchor?[320+anchor[0]*Math.cos(rot)-anchor[1]*Math.sin(rot),280-anchor[0]*Math.sin(rot)-anchor[1]*Math.cos(rot)]:point.map((v,i)=>v+offset[i]);return {name,point,position,label:position};
 });
 const segments=plan.lines.map(([a,b])=>({start:project(plan.points[a]),end:project(plan.points[b])}));
 const selected={crossing:{x:['a','x'],y:['a','x','y']},hub:{x:['p','q','x'],y:['x','y'],z:['p','y','z','q']},triangle:{x:['a','c','x'],y:['a','c','x','y']},parallel:{x:['a','x'],y:['a','x','y'],z:['a','y','z']},rectangle:{x:['a','x'],y:['a','x','y'],z:['x','y','z']},regular:{x:['x','y'],y:['x','y']},quadrilateral:{x:['a','b','c','x','y'],y:['a','b','c','x','y']}};
 const sectors=plan.sectors.map(([name,o,a,b,radius=28])=>{
  const c=plan.points[o],u=plan.points[a].map((v,i)=>v-c[i]),v=plan.points[b].map((v,i)=>v-c[i]);
  const start=normalize(Math.atan2(u[1],u[0])/rad+rotation),sweep=normalize(Math.atan2(v[1],v[0])/rad-Math.atan2(u[1],u[0])/rad),center=project(c);
  if(spec.family==='triangle'&&name!=='y')radius=Math.min(radius,Math.hypot(...u)*plan.scale/5,Math.hypot(...v)*plan.scale/5);
  const at=(angle,r)=>[center[0]+r*Math.cos(angle*rad),center[1]-r*Math.sin(angle*rad)];
  const arcStart=at(start,radius),arcEnd=at(start+sweep,radius),leader=at(start+sweep/2,name==='p'?96:40);
  const path=`M ${arcStart.join(' ')} A ${radius} ${radius} 0 ${sweep>180?1:0} 0 ${arcEnd.join(' ')}`;
  return {name,center,start,sweep,radius,arcStart,arcEnd,path,areaPath:`M ${center.join(' ')} L ${arcStart.join(' ')} A ${radius} ${radius} 0 ${sweep>180?1:0} 0 ${arcEnd.join(' ')} Z`,leader,selected:!!activeName&&selected[spec.family][activeName].includes(name)};
 });
 const rightMarks=[];
 if(spec.family==='rectangle')for(const [o,a,b] of [['A','B','D'],['B','A','C'],['C','B','D'],['D','A','C']]){
  const center=project(plan.points[o]),ends=[a,b].map(n=>project(plan.points[n])),lengths=ends.map(p=>Math.hypot(p[0]-center[0],p[1]-center[1])),leg=Math.min(12,...lengths.map(n=>n/4));
  const vectors=ends.map((p,i)=>p.map((n,j)=>(n-center[j])/lengths[i]*leg));
  rightMarks.push({points:[center.map((n,j)=>n+vectors[0][j]),center.map((n,j)=>n+vectors[0][j]+vectors[1][j]),center.map((n,j)=>n+vectors[1][j])]});
 }
 const parallelMarks=[];
 const mark=(a,b,fraction,count=1)=>{const A=project(plan.points[a]),B=project(plan.points[b]),length=Math.hypot(B[0]-A[0],B[1]-A[1]),u=[(B[0]-A[0])/length,(B[1]-A[1])/length],v=[-u[1],u[0]];for(let i=0;i<count;i++){const c=A.map((n,j)=>n+(B[j]-n)*fraction+u[j]*i*7);parallelMarks.push({points:[c.map((n,j)=>n-u[j]*5+v[j]*4),c,c.map((n,j)=>n-u[j]*5-v[j]*4)]});}};
 if(spec.family==='parallel'){mark('A','B',.23);mark('C','D',.23);}
 if(spec.family==='rectangle'){mark('A','B',.55);mark('D','C',.55);mark('A','D',.55,2);mark('B','C',.55,2);}
 const givens=Object.entries(spec.givens).filter(([name])=>name!=='n').map(([name,value],i)=>({name,value,label:`${name} = ${value}°`,position:[spec.family==='quadrilateral'?[100,320,540][i]:i?540:100,65]}));
 const names=spec.targets.map(t=>{const x=visible.find(x=>x.name===t.name);return x?.value!==null&&x?.value!==undefined?`${t.name} = ${x.value}°${x.shown?' shown':''}`:t.name;});
 return {width:640,height:560,points,segments,sectors,rightMarks,parallelMarks,givens,facts:[spec.facts],description:`${chaseCopy.modelNote} ${spec.facts}${givens.length?` Given ${givens.map(g=>g.label).join('; ')}.`:''} Marked targets: ${names.join('; ')}.`};
}
export function buildChaseSolve({caseIndex,target,rotation,answers,view,exampleStep}){
 const spec=chaseCases[caseIndex],provided=chaseProvided(spec,answers),t=spec.targets[target],a=answers[target];
 const targets=spec.targets.map((t,i)=>{const answer=answers[i],shown=provided.has(t.name),numericChecked=answer.checked&&numericChase(answer)===spec.key[t.name],value=shown||numericChecked?spec.key[t.name]:null;return {name:t.name,value,shown,numericChecked,label:value===null?t.name:`${t.name} = ${value}°${shown?' shown':''}`};});
 const geometry=chaseGeometry(spec,rotation,targets,t.name);targets.forEach(t=>{t.leader=geometry.sectors.find(s=>s.name===t.name).leader;});
 const openReason=targets[target].numericChecked&&!t.accepted.includes(a.reason)?'The number fits; its reason is still open.':'';
 const helpNote=[provided.has(t.name)&&!a.solution?'A value for this angle was shown in another solution. Your draft is still kept.':'',answers.some(x=>x.exampleSeen)?'A different worked sketch has been opened for this whole sketch.':'',a.hint?'A hint has been opened for this angle.':'',openReason].filter(Boolean).join(' ');
 const caption=spec.targets.every((t,i)=>provided.has(t.name)||answers[i].checked&&numericChase(answers[i])===spec.key[t.name]&&t.accepted.includes(answers[i].reason))?chaseCopy.complete:'';
 return {view,caseIndex,returnInvitation:['regular','quadrilateral'].includes(spec.family)?chaseCopy.polygonReturnInvitation:chaseCopy.returnInvitation,family:spec.family,familyLabel:spec.familyLabel,variantLabel:spec.variantLabel,caseOptions:chaseCases.map((c,value)=>({value,label:c.variantLabel})),targetIndex:target,rotation,exampleStep,targets,active:{name:t.name,draft:a.draft,reason:a.reason,checked:a.checked,feedback:chaseFeedback(spec,t,a),hint:a.hint?t.hint:null,solution:a.solution?chaseSolution(spec,t.name):null,helpNote,reasons:t.offered.map(id=>({id,label:chaseRules[id],selected:a.reason===id}))},question:`Find ${t.name}. ${chaseCopy.question}`,counter:`Angle ${target+1} of ${spec.targets.length}`,caption,geometry,working:[]};
}
function chaseExampleWorking(spec,t){
 if(['regular','quadrilateral'].includes(spec.family))return t.name==='x'?polygonChaseWorking(spec,'x'):`y = 180° − ${spec.key.x}° = ${spec.key.y}°. ${spec.family==='regular'?'C–A–D':'C–D–E'} is straight.`;
 const {a,c,p,q}=spec.givens,k=spec.key;
 const routes={crossing:{x:`x = 180° − ${a}° = ${k.x}°. A–O–C is straight.`,y:`y = x = ${k.y}°. x and y are opposite at O.`},hub:{x:`x = 360° − ${p}° − ${q}° = ${k.x}°. p, q and x fill one whole turn.`,y:`y = 180° − ${k.x}° = ${k.y}°. C–O–E is straight.`,z:`z = ${p}° − ${k.y}° = ${k.z}°. Parts y and z add to p.`},triangle:{x:`x = 180° − ${a}° − ${c}° = ${k.x}°. The three inside triangle corners total 180°.`,y:`y = 180° − ${k.x}° = ${k.y}°. A–B–D is straight.`},parallel:{x:`x = a = ${a}°. Corresponding angles on parallel lines match.`,y:`y = x = ${k.y}°. x and y are opposite at Q.`,z:`z = 180° − ${k.y}° = ${k.z}°. C–Q–D is straight.`},rectangle:{x:`x = 90° − ${a}° = ${k.x}°. A rectangle corner is 90°.`,y:`y = 180° − 90° − ${k.x}° = ${k.y}°. These are the inside corners of triangle ADC.`,z:`z = 90° − ${k.y}° = ${k.z}°. A rectangle corner is 90°.`}};
 return routes[spec.family][t.name];
}
export function buildChaseExample(family,exampleStep){
 const spec=chaseExamples[family],targets=spec.targets.map((t,i)=>({name:t.name,value:i<exampleStep?spec.key[t.name]:null,shown:i<exampleStep,numericChecked:false,label:i<exampleStep?`${t.name} = ${spec.key[t.name]}° shown`:t.name})),geometry=chaseGeometry(spec,0,targets,exampleStep?spec.targets[exampleStep-1].name:null);
 targets.forEach(t=>{t.leader=geometry.sectors.find(s=>s.name===t.name).leader;});
 return {view:'example',family,familyLabel:spec.familyLabel,variantLabel:'',caseOptions:[],targetIndex:null,rotation:0,exampleStep,targets,active:null,heading:chaseCopy.exampleTitle,notice:chaseCopy.exampleNotice,question:'',counter:exampleStep===0?'Example: givens only':`Example step ${exampleStep} of ${targets.length}`,caption:'',geometry,working:spec.targets.slice(0,exampleStep).map(t=>chaseExampleWorking(spec,t))};
}
function chaseNarration(c){
 if(c.view==='example')return `${chaseCopy.exampleTitle}. ${chaseCopy.exampleNotice} ${c.geometry.givens.length?c.geometry.givens.map(g=>g.label).join('; ')+'. ':''}${c.geometry.facts.join(" ")} ${c.counter}. ${c.working.join(' ')} Back to your sketch. ${copy.lifetime} Back to Copy Frame.`;
 const a=c.active;
 return `${chaseCopy.title}. ${chaseCopy.instruction} ${chaseCopy.modelNote} ${c.variantLabel}. ${c.geometry.givens.length?c.geometry.givens.map(g=>g.label).join('; ')+'. ':''}${c.geometry.facts.join(" ")} ${c.targets.map(t=>t.label).join('; ')}. Current target ${a.name}. ${c.counter}. Your answer: ${a.draft||'blank'}. ${a.reason?chaseRules[a.reason]:'No reason chosen.'} ${a.feedback} ${a.hint||''} ${a.solution||''} ${a.helpNote} ${c.caption} ${c.returnInvitation} ${copy.lifetime} Back to Copy Frame.`;
}
