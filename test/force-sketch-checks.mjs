import assert from 'node:assert/strict';
import {forceScenes,forceTeaching,forceChoices,directions,amounts} from '../dist/force-sketch-content.mjs';
import {createForceSketch,validForceSketch,changeForceSketch,forceSketchModel,forceSketchNarration} from '../dist/force-sketch-core.mjs';

const eq=(actual,expected,message)=>assert.deepEqual(actual,expected,message);
const ok=(actual,message)=>assert.ok(actual,message);
const clone=value=>structuredClone(value);
const sorted=values=>[...values].sort();
const current=work=>work.scenes[work.scene].bodies[work.scenes[work.scene].body];
const change=(work,action,value)=>{
 const before=clone(work),next=changeForceSketch(work,action,value);
 eq(work,before,`${action} preserves its input`);
 ok(next,`${action} accepts this operation`);ok(validForceSketch(next),`${action} produces valid work`);
 return next;
};
const reject=(work,action,value)=>{
 const before=clone(work);eq(changeForceSketch(work,action,value),null,`${action} refuses invalid operation`);eq(work,before,'refusal preserves work');
};
const target=(scene,body)=>{
 let work=createForceSketch();work=change(work,'scene',scene);return change(work,'body',body);
};
const propose=(work,id,direction,amount)=>{
 work=change(work,'tool-force',id);work=change(work,'tool-direction',direction);work=change(work,'tool-amount',amount);return change(work,'add');
};
// Independent physics oracle, authored from the model situations rather than
// derived from the module's accepted IDs, vectors or prediction keys.
const oracle=[
 {scene:'parcel',body:'parcel',arrows:[['weight','down',6],['support','up',6]],net:{x:0,y:0},prediction:'same'},
 {scene:'glider',body:'glider',arrows:[['weight','down',6],['support','up',6]],net:{x:0,y:0},prediction:'same'},
 {scene:'tray',body:'tray',arrows:[['weight','down',6],['support','up',6],['rope','right',4],['friction','left',2]],net:{x:2,y:0},prediction:'right'},
 {scene:'magnets',body:'a',arrows:[['a-weight','down',6],['a-support','up',6],['b-on-a','left',4]],net:{x:-4,y:0},prediction:'left'},
 {scene:'magnets',body:'b',arrows:[['b-weight','down',6],['b-support','up',6],['a-on-b','right',4]],net:{x:4,y:0},prediction:'right'},
];
const choiceOrders={
 'parcel/parcel':['same','right','left','unknown'],
 'glider/glider':['right','same','unknown','left'],
 'tray/tray':['unknown','left','right','same'],
 'magnets/a':['same','right','unknown','left'],
 'magnets/b':['right','unknown','same','left'],
};
eq(sorted(forceScenes.map(s=>s.id)),['glider','magnets','parcel','tray']);
eq(sorted(directions),['down','left','right','up']);eq(sorted(amounts),[2,4,6]);
eq(sorted(forceChoices.map(c=>c.id)),['left','right','same','unknown']);
const opposite={up:'down',down:'up',left:'right',right:'left'};
const signed={up:[0,1],down:[0,-1],left:[-1,0],right:[1,0]};
const correctPositions=new Set();
for(const expected of oracle){
 const scene=forceScenes.find(s=>s.id===expected.scene),body=scene.bodies.find(b=>b.id===expected.body);
 ok(body);eq(sorted(body.accepted),sorted(expected.arrows.map(a=>a[0])));eq(body.prediction,expected.prediction);
 const vector={x:0,y:0};
 for(const [id,direction,amount] of expected.arrows){
  const force=scene.forces.find(f=>f.id===id);ok(force,`${expected.scene}/${id} exists`);
  eq([force.direction,force.amountN],[direction,amount]);eq(force.receiver,body.name);ok(force.present!==false);
  vector.x+=signed[direction][0]*amount;vector.y+=signed[direction][1]*amount;
 }
 eq(vector,expected.net,'independently summed interactions give the expected resultant');
 let work=target(expected.scene,expected.body),model=forceSketchModel(work);
 eq(model.net,expected.net);eq(sorted(model.reference.map(f=>f.id)),sorted(body.accepted));
 eq(model.choices.map(c=>c.id),choiceOrders[`${expected.scene}/${expected.body}`]);
 correctPositions.add(model.choices.findIndex(c=>c.id===expected.prediction));
 eq(model.choices,forceSketchModel(work).choices,'choice order is stable on repeated reads');
 ok(!current(work).compared&&!current(work).predictionChecked&&!current(work).referenceShown&&!current(work).motionShown&&!current(work).pairShown);
 ok(!forceSketchNarration(work).includes(body.explanation),'unrequested motion explanation stays out of narration');
 const empty=change(work,'compare');ok(forceSketchModel(empty).comparison.length,'empty comparison identifies missing forces');eq(current(empty).arrows,[]);
 for(const [id,direction,amount] of expected.arrows)work=propose(work,id,direction,amount);
 const drawing=clone(current(work).arrows);work=change(work,'compare');
 const exact=forceSketchModel(work).comparison;ok(exact.some(text=>/match/i.test(text)),'exact diagram receives matching feedback');eq(current(work).arrows,drawing);
 work=change(work,'show-reference');work=change(work,'prediction',expected.prediction);
 eq(current(work).predictionChecked,false,'choosing is not checking');
 work=change(work,'check-prediction');eq(current(work).predictionChecked,true);eq(current(work).prediction,expected.prediction);
 work=change(work,'show-motion');eq(current(work).motionShown,true);eq(current(work).prediction,expected.prediction);
 const fixedChoices=forceSketchModel(work).choices;work=change(work,'prediction','unknown');
 eq(current(work).predictionChecked,false);eq(current(work).motionShown,true);eq(forceSketchModel(work).choices,fixedChoices);
 work=change(work,'check-prediction');eq(current(work).prediction,'unknown','checking never substitutes the key');
 for(const id of body.accepted){
  work=change(work,'pair-force',id);eq(current(work).pairShown,false,'selecting a pair hides its drawings');
  work=change(work,'show-pair');const pair=forceSketchModel(work).pair;
  eq(pair.force.id,id);eq(pair.partner.agent,pair.force.receiver);eq(pair.partner.receiver,pair.force.agent);
  ok(pair.force.agent!==pair.force.receiver,'the interaction has different objects');
  eq(pair.partner.direction,opposite[pair.force.direction]);eq(pair.partner.amountN,pair.force.amountN);
 }
 // Proposed wrong directions and sizes remain editable valid work. Their
 // comparison changes, while the physical resultant remains source-owned.
 for(const field of ['direction','amount']){
  const wrong=clone(work);wrong.scenes[wrong.scene].bodies[expected.body].arrows[0][field]=field==='direction'?'right':2;
  ok(validForceSketch(wrong));const observed=forceSketchModel(change(wrong,'compare'));
  ok(observed.comparison.length);ok(JSON.stringify(observed.comparison)!==JSON.stringify(exact));eq(observed.net,expected.net);
 }
 // Returned work and transformations must not leak mutable aliases.
 model=forceSketchModel(work);const before=clone(work);model.work.arrows.length=0;eq(work,before,'model work is detached');
 const next=change(work,'page','motion');current(next).arrows.length=0;eq(work,before,'next work is detached');
}
ok(correctPositions.size>1,'fitting predictions occupy varied positions');

for(const scene of forceScenes){
 eq(new Set(scene.forces.map(f=>f.id)).size,scene.forces.length,'candidate IDs are unique');
 for(const force of scene.forces){
  if(force.present===false){eq(force.id,'released-push');ok(!Object.hasOwn(force,'partner'));ok(!Object.hasOwn(force,'amountN'));ok(!Object.hasOwn(force,'direction'));continue;}
  ok(force.partner,'every actual interaction supplies its partner');
  eq(force.partner.agent,force.receiver);eq(force.partner.receiver,force.agent);
  eq(force.partner.direction,opposite[force.direction]);eq(force.partner.amountN,force.amountN);eq(force.partner.kind,force.kind);
  eq(force.kind,force.agent==='Earth'||force.receiver==='Earth'||['b-on-a','a-on-b'].includes(force.id)?'gap':'contact');
 }
}
// Other-receiver and absent candidates are valid proposals, then receive
// explanatory comparison rather than influencing the source's net/motion.
for(const expected of oracle){
 const scene=forceScenes.find(s=>s.id===expected.scene);
 for(const force of scene.forces.filter(f=>!expected.arrows.some(a=>a[0]===f.id))){
  let work=target(expected.scene,expected.body);
  for(const [forceId,d,a] of expected.arrows)work=propose(work,forceId,d,a);
  const exact=forceSketchModel(work).comparison;
  work=propose(work,force.id,force.direction??'right',force.amountN??4);ok(validForceSketch(work));work=change(work,'compare');
  ok(forceSketchModel(work).comparison.length);ok(JSON.stringify(forceSketchModel(work).comparison)!==JSON.stringify(exact),'an additional wrong/absent interaction receives its own diagnostic');eq(current(work).arrows.at(-1).forceId,force.id);
 }
}

// Narration follows the active page and each explicit disclosure independently.
let narrated=target('tray','tray');const motionText=forceSketchModel(narrated).motion;
narrated=change(narrated,'page','motion');ok(!forceSketchNarration(narrated).includes(motionText));
narrated=change(narrated,'check-prediction');eq(current(narrated).predictionChecked,false);
narrated=change(narrated,'prediction','unknown');ok(!forceSketchNarration(narrated).includes(motionText));
narrated=change(narrated,'check-prediction');ok(forceSketchNarration(narrated).includes(motionText));
narrated=change(narrated,'page','build');ok(!forceSketchNarration(narrated).includes(motionText),'checked motion does not leak into Build');
narrated=change(narrated,'page','compare');ok(!forceSketchNarration(narrated).includes(forceSketchModel(narrated).netText));
narrated=change(narrated,'compare');ok(forceSketchNarration(narrated).includes(forceSketchModel(narrated).netText));
narrated=change(narrated,'toggle-pair');eq(current(narrated).pairExpanded,true);eq(current(narrated).pairShown,false);
narrated=change(narrated,'show-pair');narrated=change(narrated,'toggle-pair');eq(current(narrated).pairExpanded,false);eq(current(narrated).pairShown,true);
narrated=change(narrated,'toggle-pair');eq(current(narrated).pairShown,true,'closing and reopening retains requested pair');
narrated=change(narrated,'pair-force','rope');eq(current(narrated).pairShown,false);

// Editing, cancellation, selection and deletion preserve unrelated arrows.
let work=target('tray','tray');
for(const [id,direction,amount] of oracle[2].arrows)work=propose(work,id,direction,amount);
const complete=clone(current(work).arrows);
work=change(work,'select',2);work=change(work,'edit',2);
eq(current(work).tool,{forceId:'rope',direction:'right',amount:4,editIndex:2});
work=change(work,'tool-direction','left');work=change(work,'cancel-edit');eq(current(work).arrows,complete);
work=change(work,'edit',2);work=change(work,'tool-amount',6);work=change(work,'replace');
eq(current(work).arrows.map(a=>a.amount),[6,6,6,2]);eq(current(work).tool.editIndex,null);
work=change(work,'compare');work=change(work,'show-reference');work=change(work,'show-motion');work=change(work,'show-pair');work=change(work,'prediction','right');work=change(work,'check-prediction');
work=change(work,'edit',2);work=change(work,'tool-force','weight');reject(work,'replace');
work=change(work,'cancel-edit');work=change(work,'select',3);work=change(work,'edit',3);work=change(work,'remove',0);
eq(current(work).selected,2);eq(current(work).tool.editIndex,2);eq(current(work).arrows.map(a=>a.forceId),['support','rope','friction']);
eq(current(work).compared,false);ok(current(work).referenceShown&&current(work).motionShown&&current(work).pairShown);
eq([current(work).prediction,current(work).predictionChecked],['right',true],'drawing edits preserve the prediction about unchanged source forces');
work=change(work,'remove',2);eq(current(work).selected,null);eq(current(work).tool.editIndex,null);
reject(work,'remove',2);reject(work,'select',-1);reject(work,'edit',0.5);reject(work,'replace');
work=change(work,'tool-force','support');reject(work,'add');
work=change(work,'edit',0);reject(work,'add');work=change(work,'cancel-edit');

// Six candidates fit; capacity and uniqueness are distinct refusals.
let six=target('magnets','a');for(const force of forceScenes.find(s=>s.id==='magnets').forces)six=propose(six,force.id,'up',2);
eq(current(six).arrows.length,6);reject(six,'add');

// Independent caches survive scene/body navigation and teaching; reset affects
// only the current object, including its disclosure/help flags.
work=target('magnets','a');work=propose(work,'b-on-a','left',4);work=change(work,'page','motion');work=change(work,'prediction','left');
const aBefore=clone(current(work));work=change(work,'body','b');eq(work.page,'build');eq(current(work).arrows,[]);
work=propose(work,'a-on-b','right',4);const bBefore=clone(current(work));work=change(work,'body','a');eq(current(work),aBefore);
work=change(work,'page','compare');work=change(work,'teaching-open');eq(work.page,'teaching');eq(work.beforeHelp,'compare');ok(current(work).teachingShown);
const draftBeforeHelp=clone(current(work).arrows);
work=change(work,'teaching-step',99);eq(work.teachingStep,4);work=change(work,'teaching-step',1);eq(work.teachingStep,4);
work=change(work,'teaching-step',-99);eq(work.teachingStep,0);work=change(work,'teaching-step',-1);eq(work.teachingStep,0);
work=change(work,'teaching-close');eq(work.page,'compare');eq(current(work).arrows,draftBeforeHelp);
work=change(work,'scene','parcel');eq(work.page,'build');work=propose(work,'weight','down',6);const parcelBefore=clone(current(work));
work=change(work,'scene','magnets');eq(current(work).arrows,draftBeforeHelp);
work=change(work,'reset-object');eq(current(work),current(target('magnets','a')));eq(work.scenes.magnets.bodies.b,bBefore);eq(work.scenes.parcel.bodies.parcel,parcelBefore);
eq(forceTeaching.length,5);ok(forceTeaching.every(page=>page&&typeof page.text==='string'&&page.text.length));
ok(forceTeaching.some(page=>page.arrows?.some(force=>force.amountN===4)),'worked teaching supplies separate 4 N data');
const frozenTeaching=clone(forceTeaching);work=change(work,'teaching-open');work=change(work,'teaching-step',1);eq(forceTeaching,frozenTeaching,'practice/help traversal leaves authored teaching exact');

// Invalid shapes cannot become a second way of submitting malformed work.
const valid=createForceSketch();ok(validForceSketch(valid));eq(createForceSketch(),valid,'fresh construction is deterministic');
const malformed=[null,[],{}, {...valid,unknown:true}, {...valid,scene:'missing'}, {...valid,page:'missing'}, {...valid,teachingStep:-1}, {...valid,teachingStep:5}, {...valid,beforeHelp:'teaching'}];
for(const edit of [
 w=>{current(w).arrows=[{forceId:'missing',direction:'up',amount:2}];},
 w=>{current(w).arrows=[{forceId:'weight',direction:'diagonal',amount:2}];},
 w=>{current(w).arrows=[{forceId:'weight',direction:'up',amount:NaN}];},
 w=>{current(w).arrows=[{forceId:'weight',direction:'up',amount:Infinity}];},
 w=>{current(w).arrows=[{forceId:'weight',direction:'up',amount:3}];},
 w=>{current(w).arrows=Array(2).fill({forceId:'weight',direction:'up',amount:2});},
 w=>{current(w).arrows=Array(1);},
 w=>{current(w).selected=0;},w=>{current(w).tool.editIndex=0;},w=>{current(w).tool.amount='2';},
 w=>{current(w).prediction='missing';},w=>{current(w).predictionChecked='yes';},w=>{current(w).pairForceId='table-partner';},
 w=>{w.scenes.parcel.body='missing';},w=>{delete w.scenes.tray;},w=>{current(w).compared=1;},
]){const bad=clone(valid);edit(bad);malformed.push(bad);}
for(const bad of malformed){
 const before=clone(bad);eq(validForceSketch(bad),false);eq(forceSketchModel(bad),null);eq(changeForceSketch(bad,'page','build'),null);eq(bad,before);
}
for(const [action,value] of [['missing'],['scene','missing'],['body','a'],['page','missing'],['tool-force','missing'],['tool-direction','diagonal'],['tool-amount',3],['tool-amount',NaN],['prediction','missing'],['pair-force','table-partner'],['teaching-step',0.5]])reject(valid,action,value);
console.log('Force Sketch source behavior: finite physics, interaction partners, pure editing, disclosure, teaching, caches and invalid-input boundaries passed.');
