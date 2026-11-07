import assert from 'node:assert/strict';
import {createMoonlight,changeMoonlight,moonlightModel,moonlightNarration} from '../dist/moonlight-core.mjs';
import {moonlightCopy as copy,moonlightPlaces,moonlightPlace,moonlightTeaching,moonlightInvitations} from '../dist/moonlight-content.mjs';
import {moonPath,mirrorPath} from '../dist/sky-notes-core.mjs';

// Expected geometry/phase associations are transcribed independently from the finite model.
const expected=[
 ['new','Right side','New Moon','None of this ideal view is sunlit.',282,170],
 ['thin-growing','Upper right','Thin and growing (waxing crescent)','Less than half of this view is sunlit.',170+56*Math.SQRT2,170-56*Math.SQRT2],
 ['half-growing','Top','Half and growing (first quarter)','Half of this view is sunlit.',170,58],
 ['fat-growing','Upper left','Nearly full and growing (waxing gibbous)','More than half of this view is sunlit.',170-56*Math.SQRT2,170-56*Math.SQRT2],
 ['full','Left side','Full Moon','All of this ideal view is sunlit.',58,170],
 ['fat-shrinking','Lower left','Nearly full and shrinking (waning gibbous)','More than half of this view is sunlit.',170-56*Math.SQRT2,170+56*Math.SQRT2],
 ['half-shrinking','Bottom','Half and shrinking (last quarter)','Half of this view is sunlit.',170,282],
 ['thin-shrinking','Lower right','Thin and shrinking (waning crescent)','Less than half of this view is sunlit.',170+56*Math.SQRT2,170+56*Math.SQRT2]
];
const initial={position:0,revealed:false,orientation:'north',page:'explore',step:0,invitation:0};
assert.equal(moonlightPlaces.length,8);assert.equal(moonlightTeaching.length,4);assert.equal(moonlightInvitations.length,4);
assert.deepEqual(createMoonlight(),initial);
for(const invalid of [null,undefined,'NORTH','',0,false,{},Symbol('orientation')])assert.deepEqual(createMoonlight(invalid),initial);
assert.equal(createMoonlight('south').orientation,'south');
assert.notEqual(createMoonlight(),createMoonlight());
const modelKeys=['page','step','position','location','point','phase','orientations','teaching','invitation','showingExample'];
for(const [position,[code,location,name,amount,x,y]] of expected.entries()){
 for(const orientation of ['north','south'])for(const revealed of [false,true]){
  const work={...initial,position,orientation,revealed},before=JSON.stringify(work),model=moonlightModel(work);
  assert.deepEqual(Object.keys(model),modelKeys);
  assert.equal(model.page,'explore');assert.equal(model.step,0);assert.equal(model.position,position);
  assert.equal(model.location,location);assert.ok(Math.abs(model.point.x-x)<1e-10);assert.ok(Math.abs(model.point.y-y)<1e-10);
  assert.equal(model.teaching,null);assert.equal(model.showingExample,false);assert.equal(model.invitation,moonlightInvitations[0]);
  assert.deepEqual(model.orientations,revealed?[orientation]:[]);
  if(revealed){assert.deepEqual(Object.keys(model.phase),['code','name','description','amount']);assert.equal(model.phase.code,code);assert.equal(model.phase.name,name);assert.equal(model.phase.amount,amount);assert.equal(model.phase.description,moonlightPlaces[position].description);}
  else {assert.equal(model.phase,null);assert.ok(!JSON.stringify(model).includes('"code"'));for(const value of [name,amount,moonlightPlaces[position].description])assert.ok(!moonlightNarration(work).includes(value));}
  const parts=[copy.title,copy.opening,copy.model,copy.tilt,copy.above,copy.places,copy.orbitMotion,moonlightInvitations[0],`Selected place: ${location}.`,copy.sunlight,copy.viewLine,
   ...(revealed?[copy.earthView,name,amount,moonlightPlaces[position].description,copy[orientation],copy.orientation]:[copy.hidden]),copy.returnPrompt,copy.visit];
  assert.equal(moonlightNarration(work),parts.join(' '));assert.equal(JSON.stringify(work),before);
 }
}
// Actions preserve the child's own position/reveal/orientation while examples are shown.
let work={...initial,position:7,revealed:true,orientation:'south',invitation:2};
assert.deepEqual(changeMoonlight(work,'next'),{...work,position:0});
assert.deepEqual(changeMoonlight(initial,'previous'),{...initial,position:7});
assert.deepEqual(changeMoonlight(work,'position',2),{...work,position:2});
assert.deepEqual(changeMoonlight(initial,'flip'),{...initial,orientation:'south'}); // legal even while hidden
assert.deepEqual(changeMoonlight(work,'flip'),{...work,orientation:'north'});
assert.deepEqual(changeMoonlight(work,'reveal'),{...work,revealed:false});
assert.deepEqual(changeMoonlight(initial,'reveal'),{...initial,revealed:true});
let invitationWork={...work,invitation:0};
const invitationTexts=[
 'Find a place where the view from Earth is half lit. Can you find another?',
 'Make a thin shape grow into a full circle. What stays the same in the view from above?',
 'Compare a growing crescent with a shrinking crescent. What changes when you flip the drawing?',
 'Find new Moon, then full Moon. In this flat drawing they line up with Earth and the sunlight. Why don’t real new and full moons make an eclipse every time?'
];
for(let i=0;i<4;i++){
 assert.equal(moonlightModel(invitationWork).invitation,invitationTexts[i]);
 assert.ok(moonlightNarration(invitationWork).includes(invitationTexts[i]));
 const next=changeMoonlight(invitationWork,'invitation');
 assert.deepEqual(next,{...invitationWork,invitation:(i+1)%4});invitationWork=next;
}
assert.equal(invitationWork.invitation,0);
const own=structuredClone(work),teaching=changeMoonlight(work,'teaching');
assert.deepEqual(teaching,{...own,page:'teaching',step:0});assert.deepEqual(work,own);
const examplePositions=[1,2,4,1],exampleTitles=['One half faces the Sun','Our view is another half','A phase is not Earth’s shadow','Same phase, flipped drawing'];
for(const orientation of ['north','south'])for(let step=0;step<4;step++){
 const lesson={...teaching,orientation,step},model=moonlightModel(lesson),phase=moonlightPlaces[examplePositions[step]];
 assert.deepEqual(Object.keys(model),modelKeys);assert.equal(model.position,examplePositions[step]);
 assert.deepEqual(model.teaching,{title:exampleTitles[step],text:moonlightTeaching[step].text});
 assert.equal(model.phase.code,expected[examplePositions[step]][0]);assert.equal(model.invitation,null);assert.equal(model.showingExample,true);
 assert.deepEqual(model.orientations,step===3?['north','south']:[orientation]);
 const parts=[copy.title,copy.example,`Step ${step+1} of 4.`,exampleTitles[step],moonlightTeaching[step].text,copy.model,copy.tilt,copy.above,copy.places,copy.orbitMotion,`Separate example: ${phase.location}.`,copy.sunlight,copy.viewLine,copy.earthView];
 for(const style of step===3?['north','south']:[orientation])parts.push(copy[style],phase.name,phase.amount,phase.description);
 parts.push(copy.orientation,copy.returnPrompt,copy.visit);
 assert.equal(moonlightNarration(lesson),parts.join(' '));
 assert.deepEqual(changeMoonlight(lesson,'explore'),{...own,orientation,page:'explore',step:0});
 for(const action of ['position','next','previous','reveal','flip','invitation','teaching'])assert.equal(changeMoonlight(lesson,action,action==='position'?1:undefined),null);
 assert.equal(changeMoonlight(lesson,'step',step),null);
}
assert.deepEqual(changeMoonlight(teaching,'step',3),{...teaching,step:3});
for(const action of ['position','explore','step'])assert.equal(changeMoonlight(initial,action,action==='position'?0:action==='step'?1:undefined),null);
for(const invalidValue of [-1,8,1.1,NaN,Infinity,'1',null,undefined,true])assert.equal(changeMoonlight(initial,'position',invalidValue),null);
for(const invalidValue of [-1,4,0.1,NaN,Infinity,'1',null,undefined,true])assert.equal(changeMoonlight(teaching,'step',invalidValue),null);
for(const action of ['next','previous','reveal','flip','invitation','teaching','explore'])for(const value of [null,0,false,'',{}])assert.equal(changeMoonlight(work,action,value),null);
for(const action of ['save','check','answer','support','attempt','',null,undefined,{},Symbol('action')])assert.equal(changeMoonlight(work,action),null);

// Reject malformed objects without running accessors or allowing an inherited work record.
let getterCalls=0;
const accessor={...initial};Object.defineProperty(accessor,'position',{get(){getterCalls++;throw Error('must not run');}});
const inherited=Object.create(initial),inheritedExtra=Object.assign(Object.create({extra:true}),initial);
const revoked=Proxy.revocable({},{});revoked.revoke();
const invalidWorks=[null,undefined,[],42,'work',inherited,inheritedExtra,accessor,revoked.proxy,{...initial,extra:true},{...initial,[Symbol('extra')]:true}];
for(const field of Object.keys(initial)){const missing={...initial};delete missing[field];invalidWorks.push(missing);}
for(const [key,values] of Object.entries({position:[-1,8,1.5,'0',NaN],revealed:[0,'false',null],orientation:['east',null],page:['help',null],step:[-1,4,1,'0'],invitation:[-1,4,1.5,'0']}))for(const value of values)invalidWorks.push({...initial,[key]:value});
for(const invalid of invalidWorks){assert.equal(moonlightModel(invalid),null);assert.equal(moonlightNarration(invalid),null);assert.equal(changeMoonlight(invalid,'next'),null);}
assert.equal(getterCalls,0);
assert.deepEqual(moonlightModel(Object.assign(Object.create(null),initial)),moonlightModel(initial));

// Every exposed record is detached from caller work and the frozen finite sources.
const detachedInput=createMoonlight('south'),detachedNext=changeMoonlight(detachedInput,'reveal');
detachedNext.position=3;assert.deepEqual(detachedInput,createMoonlight('south'));
const revealed={...initial,revealed:true},first=moonlightModel(revealed),beforeModel=moonlightModel(revealed);
first.point.x=0;first.phase.name='changed';first.orientations.push('other');first.location='changed';
assert.deepEqual(moonlightModel(revealed),beforeModel);
const example=moonlightModel({...teaching,step:3});example.teaching.title='changed';example.orientations.reverse();
assert.equal(moonlightModel({...teaching,step:3}).teaching.title,exampleTitles[3]);assert.deepEqual(moonlightModel({...teaching,step:3}).orientations,['north','south']);
for(let i=0;i<8;i++){const record=moonlightPlace(i);record.name='changed';assert.equal(moonlightPlace(i).name,expected[i][2]);}
for(const value of [-1,8,0.1,'0',null,undefined])assert.equal(moonlightPlace(value),null);

// The existing qualitative silhouettes put growing light on the right and shrinking on the left.
assert.equal(moonPath('half-growing','north'),'M24 4 A20 20 0 0 1 24 44 Z');
assert.equal(moonPath('half-shrinking','north'),'M24 4 A20 20 0 0 0 24 44 Z');
assert.equal(moonPath('thin-growing','north'),'M24 4 A20 20 0 0 1 24 44 A14 20 0 0 0 24 4 Z');
assert.equal(moonPath('fat-growing','north'),'M24 4 A20 20 0 0 1 24 44 A14 20 0 0 1 24 4 Z');
for(const stem of ['thin','half','fat']){
 assert.equal(moonPath(`${stem}-shrinking`,'north'),mirrorPath(moonPath(`${stem}-growing`,'north')));
 for(const trend of ['growing','shrinking'])assert.equal(moonPath(`${stem}-${trend}`,'south'),mirrorPath(moonPath(`${stem}-${trend}`,'north')));
}
assert.equal(moonPath('full','north'),moonPath('full','south'));
console.log('Moonlight Bench: finite model, transitions, narration, detachment and qualitative silhouettes passed.');
