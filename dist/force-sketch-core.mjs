import {forceScenes,forceTeaching,forceChoices,directions,amounts,forceCopy} from './force-sketch-content.mjs';
const pages=['build','compare','motion'],flags=['compared','referenceShown','motionShown','pairExpanded','pairShown','teachingShown','predictionChecked'];
const clone=x=>structuredClone(x);
const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
const keys=(x,wanted)=>plain(x)&&Object.keys(x).length===wanted.length&&wanted.every(k=>Object.hasOwn(x,k));
const sceneFor=id=>forceScenes.find(s=>s.id===id);
const choiceOK=id=>forceChoices.some(c=>c.id===id);
const indexOK=(n,a)=>Number.isInteger(n)&&n>=0&&n<a.length;
const arrowOK=(a,s)=>keys(a,['forceId','direction','amount'])&&s.forces.some(f=>f.id===a.forceId)&&directions.includes(a.direction)&&amounts.includes(a.amount);
function initialBody(s,b){return {arrows:[],tool:{forceId:s.forces[0].id,direction:'up',amount:2,editIndex:null},selected:null,compared:false,referenceShown:false,motionShown:false,pairExpanded:false,pairShown:false,teachingShown:false,prediction:null,predictionChecked:false,pairForceId:b.accepted[0]};}
export function createForceSketch(){return {scene:forceScenes[0].id,page:'build',teachingStep:0,beforeHelp:'build',scenes:Object.fromEntries(forceScenes.map(s=>[s.id,{body:s.bodies[0].id,bodies:Object.fromEntries(s.bodies.map(b=>[b.id,initialBody(s,b)]))}]))};}
export function validForceSketch(w){try{
 if(!keys(w,['scene','page','teachingStep','beforeHelp','scenes'])||!sceneFor(w.scene)||![...pages,'teaching'].includes(w.page)||!Number.isInteger(w.teachingStep)||w.teachingStep<0||w.teachingStep>4||!pages.includes(w.beforeHelp)||!keys(w.scenes,forceScenes.map(s=>s.id)))return false;
 for(const s of forceScenes){const v=w.scenes[s.id];if(!keys(v,['body','bodies'])||!s.bodies.some(b=>b.id===v.body)||!keys(v.bodies,s.bodies.map(b=>b.id)))return false;
  for(const b of s.bodies){const a=v.bodies[b.id];if(!keys(a,['arrows','tool','selected',...flags,'prediction','pairForceId'])||!Array.isArray(a.arrows)||a.arrows.length>6||Object.keys(a.arrows).length!==a.arrows.length||!Array.from({length:a.arrows.length},(_,i)=>Object.hasOwn(a.arrows,i)&&arrowOK(a.arrows[i],s)).every(Boolean)||new Set(a.arrows.map(p=>p.forceId)).size!==a.arrows.length)return false;
   if(!keys(a.tool,['forceId','direction','amount','editIndex'])||!arrowOK({forceId:a.tool.forceId,direction:a.tool.direction,amount:a.tool.amount},s)||(a.tool.editIndex!==null&&!indexOK(a.tool.editIndex,a.arrows))||(a.selected!==null&&!indexOK(a.selected,a.arrows))||flags.some(k=>typeof a[k]!=='boolean')||(a.prediction!==null&&!choiceOK(a.prediction))||!b.accepted.includes(a.pairForceId)||!s.forces.find(f=>f.id===a.pairForceId)?.partner)return false;
  }
 }return true;
 }catch{return false;}}
export function changeForceSketch(w,action,value){if(!validForceSketch(w)||typeof action!=='string')return null;const next=clone(w),s=sceneFor(next.scene),v=next.scenes[s.id],b=s.bodies.find(b=>b.id===v.body),a=v.bodies[b.id];
 switch(action){
  case 'scene':if(!sceneFor(value))return null;next.scene=value;next.page=next.beforeHelp='build';break;
  case 'body':if(!s.bodies.some(b=>b.id===value))return null;v.body=value;next.page=next.beforeHelp='build';break;
  case 'page':if(!pages.includes(value))return null;next.page=value;next.beforeHelp=value;break;
  case 'teaching-open':if(next.page!=='teaching')next.beforeHelp=next.page;next.page='teaching';a.teachingShown=true;break;
  case 'teaching-step':if(next.page!=='teaching'||!Number.isInteger(value))return null;next.teachingStep=Math.max(0,Math.min(4,next.teachingStep+value));break;
  case 'teaching-close':if(next.page!=='teaching')return null;next.page=next.beforeHelp;break;
  case 'tool-force':if(!s.forces.some(f=>f.id===value))return null;a.tool.forceId=value;break;
  case 'tool-direction':if(!directions.includes(value))return null;a.tool.direction=value;break;
  case 'tool-amount':if(!amounts.includes(value))return null;a.tool.amount=value;break;
  case 'add':if(a.tool.editIndex!==null||a.arrows.length>=6||a.arrows.some(p=>p.forceId===a.tool.forceId))return null;a.arrows.push({forceId:a.tool.forceId,direction:a.tool.direction,amount:a.tool.amount});a.compared=false;break;
  case 'select':if(!indexOK(value,a.arrows))return null;a.selected=value;break;
  case 'edit':if(!indexOK(value,a.arrows))return null;a.tool={...a.arrows[value],editIndex:value};a.selected=value;a.compared=false;break;
  case 'replace':{const i=a.tool.editIndex;if(i===null||a.arrows.some((p,j)=>j!==i&&p.forceId===a.tool.forceId))return null;a.arrows[i]={forceId:a.tool.forceId,direction:a.tool.direction,amount:a.tool.amount};a.tool.editIndex=null;a.compared=false;break;}
  case 'cancel-edit':a.tool.editIndex=null;break;
  case 'remove':if(!indexOK(value,a.arrows))return null;a.arrows.splice(value,1);for(const [obj,k] of [[a,'selected'],[a.tool,'editIndex']]){if(obj[k]===value)obj[k]=null;else if(obj[k]!==null&&obj[k]>value)obj[k]--;}a.compared=false;break;
  case 'reset-object':v.bodies[b.id]=initialBody(s,b);break;
  case 'compare':a.compared=true;break;
  case 'show-reference':a.referenceShown=true;break;
  case 'prediction':if(!choiceOK(value))return null;if(a.prediction!==value){a.prediction=value;a.predictionChecked=false;}break;
  case 'check-prediction':if(a.prediction!==null)a.predictionChecked=true;break;
  case 'show-motion':a.motionShown=true;break;
  case 'toggle-pair':a.pairExpanded=!a.pairExpanded;break;
  case 'pair-force':if(!b.accepted.includes(value)||!s.forces.find(f=>f.id===value)?.partner)return null;if(a.pairForceId!==value){a.pairForceId=value;a.pairShown=false;}break;
  case 'show-pair':a.pairShown=true;break;
  default:return null;
 }return next;
}
const forceWords=f=>`${f.agent} → ${f.receiver}: ${f.name}, ${f.amountN} N ${f.direction}`;
function compare(s,b,a){const out=[];
 for(const id of b.accepted){if(!a.arrows.some(p=>p.forceId===id)){const f=s.forces.find(f=>f.id===id);out.push(`Missing from your drawing: ${forceWords(f)}.`);}}
 for(const p of a.arrows){const f=s.forces.find(f=>f.id===p.forceId);
  if(!f.present){out.push(`Your drawing includes ${f.agent} → ${f.receiver}. The person has let go; this push is absent in the described model.`);continue;}
  if(!b.accepted.includes(f.id))out.push(`Your drawing includes ${f.agent} → ${f.receiver}. It acts on ${f.receiver}, not ${b.name}. Leave it out of this object's diagram.`);
  if(p.direction!==f.direction)out.push(`Your drawing points ${f.agent} → ${f.receiver} ${p.direction}; the described force points ${f.direction}.`);
  if(p.amount!==f.amountN)out.push(`Your drawing gives ${f.agent} → ${f.receiver} ${p.amount} N; the described force is ${f.amountN} N.`);
 }return out.length?out:['Your drawn arrows match the described model.'];
}
function netDescription(reference){const sum=d=>reference.filter(f=>f.direction===d).reduce((n,f)=>n+f.amountN,0),right=sum('right'),left=sum('left'),up=sum('up'),down=sum('down');const component=(p,n,pn,nn)=>p===n?`${pn} ${p} N and ${nn} ${n} N balance`:`${pn} ${p} N and ${nn} ${n} N leave ${Math.abs(p-n)} N ${p>n?pn:nn}`;return `Model net: ${component(right,left,'right','left')}; ${component(up,down,'up','down')}.`;}
export function forceSketchModel(w){if(!validForceSketch(w))return null;const s=sceneFor(w.scene),b=s.bodies.find(b=>b.id===w.scenes[s.id].body),a=w.scenes[s.id].bodies[b.id],reference=b.accepted.map(id=>s.forces.find(f=>f.id===id)),net={x:0,y:0};for(const f of reference){if(f.direction==='right')net.x+=f.amountN;if(f.direction==='left')net.x-=f.amountN;if(f.direction==='up')net.y+=f.amountN;if(f.direction==='down')net.y-=f.amountN;}const f=s.forces.find(f=>f.id===a.pairForceId);
 return {scene:s,body:b,work:clone(a),arrows:a.arrows.map(p=>({...p,force:s.forces.find(f=>f.id===p.forceId)})),reference:[...reference],net,comparison:compare(s,b,a),choices:b.choiceOrder.map(id=>forceChoices.find(c=>c.id===id)),pair:{force:f,partner:f.partner},motion:b.explanation,netText:netDescription(reference),predictionFeedback:a.prediction===null?forceCopy.missingPrediction:`${a.prediction===b.prediction?'Your prediction fits this model.':'Compare your prediction with the model.'} ${b.explanation}${a.prediction==='unknown'?' The complete described forces tell the direction of velocity change, even though they do not give its numerical rate or future path.':''}`};
}
export function forceSketchNarration(w){const m=forceSketchModel(w);if(!m)return '';const a=m.work;
 if(w.page==='teaching'){const t=forceTeaching[w.teachingStep];return [forceCopy.model,t.title,t.text,...t.arrows.map(forceWords),...(t.pair?[forceCopy.pairWarning,forceWords(t.pair.force),forceWords(t.pair.partner)]:[])].join(' ');}
 const text=[forceCopy.model,m.scene.title,m.scene.story,m.scene.clues,`Chosen object: ${m.body.name}.`,w.page==='motion'?forceCopy.motionPrompt:w.page==='compare'?`Compare your arrows with the forces described for ${m.body.name}.`:forceCopy.hint];
 if(w.page==='build'||w.page==='compare')text.push(...(m.arrows.length?m.arrows.map(p=>`Your drawing: ${p.force.agent} → ${p.force.receiver}, ${p.amount} N ${p.direction}.`):[forceCopy.empty]));
 if(w.page==='compare'){if(a.compared)text.push(...m.comparison,m.netText);if(a.referenceShown)text.push('Model reference.',...m.reference.map(forceWords));if(a.pairExpanded&&a.pairShown)text.push(forceCopy.pairWarning,forceWords(m.pair.force),forceWords(m.pair.partner),forceCopy.pairExplanation);}
 if(w.page==='motion'){text.push(...m.choices.map(c=>c.label));if(a.prediction!==null)text.push(`Your prediction: ${m.choices.find(c=>c.id===a.prediction).label}`);if(a.predictionChecked)text.push(m.predictionFeedback);if(a.motionShown)text.push(m.motion);}
 return text.join(' ');
}
