// Original model questions. Every working source freezes its controls and teaching.
const jobs=[
 {id:'library',title:'Library loads',v0:0,initialMasses:[1,2],question:'Try one push, then let the carts coast. What happens to velocity when the next force is zero?'},
 {id:'loads',title:'Keep the pushes, swap the loads',v0:2,initialMasses:[2,4],question:'Keep your force cards fixed and swap the loads. What changes in the velocity histories?'},
 {id:'against',title:'Push against the motion',v0:-2,initialMasses:[2,4],question:'Can a rightward force be followed by a leftward velocity? Watch what changes during the second.'},
 {id:'return',title:'Back to the same velocity',v0:1,initialMasses:[1,2],question:'Find a program that returns to the starting velocity but changes it partway through.'},
 {id:'control',title:'A control pair',v0:0,initialMasses:[2,2],question:'Try equal loads and the same pushes. Then change just one load. What stays the same?'},
 {id:'turn',title:'From left to right',v0:-2,initialMasses:[4,2],question:'Make a left-moving cart slow down, stop, then move right. Do the two loads change direction at the same time?'}
];
const model='one-second-net-force-v1';
const example=(masses,v0,forces,frame,history)=>({v:1,model,masses,v0,forces,frame,history});
const teaching=[
 {words:'Velocity tells speed and direction. Right is positive; left is negative. Our arrows show velocity in meters per second. A horizontal velocity line above zero means steady movement to the right, not rest.',example:example([1,2],2,[0,0,0],0,true)},
 {words:'Each chosen mass is the whole cart and its load, measured in kilograms (kg). Force is measured in newtons (N). Our card is the total horizontal force after opposing pushes and pulls are combined. Divide that force by the mass to find acceleration: how velocity changes each second. The heavier cart changes by a smaller amount under the same nonzero force.',example:example([1,2],0,[4,0,-4],1,false)},
 {words:'Zero net force means no change in velocity. A moving cart keeps moving at the same velocity in this model. A cart at rest stays at rest. Zero force does not tell us the carts have equal masses.',example:example([1,2],0,[4,0,-4],2,true)},
 {words:'A force against the motion can slow a cart before it reverses. Force direction and velocity direction need not match. A smaller velocity change does not always mean a smaller speed at that moment. The lighter cart reaches rest after the first second; keep the leftward force for the next second and it reverses.',example:example([1,2],4,[-4,-4,0],1,true)},
 {words:'These carts finish with the same velocity they started with. Their velocities changed along the way. Matching end values do not mean matching histories. Compare the lines between the start and the finish.',example:example([1,2],0,[4,0,-4],3,true)},
 {words:'With equal total masses, equal starting velocities and the same force cards, the velocity histories coincide. The graph predicts velocity through time. Straight pieces come from a constant force during each second. Our model leaves out friction and air resistance; vertical forces balance. Each load stays fixed during a run. Changing a load begins again from the starting velocity. Real carts would need real observations.',example:example([2,2],0,[4,0,-4],1,true)}
];
export const cartCases=Object.freeze(jobs.map(({id,title})=>Object.freeze({id,title})));
export function makeCartSource(id='library'){
 const j=jobs.find(j=>j.id===id);if(!j)return null;
 return structuredClone({v:1,model,...j,story:'The town is planning a traveling library. Try the same pushes on two model carts, then tell someone what changed when you changed a load.',labels:['Cart A','Cart B'],massChoices:[1,2,4],forceChoices:[-4,0,4],steps:3,initialForces:[0,0,0],teaching});
}
export const cartCopy=Object.freeze({title:'Push & Drift',entry:'Give two carts the same pushes. Try different loads.',instruction:'Choose the two loads. Then choose a net force for each second.',
 starting:'This matches the starting setup. You can change every load and force card.',
 changed:'New setup. The clock is back at zero; your other choices are still here.',
 assumptions:'These are predictions for level model carts with no friction or air resistance. Vertical forces balance. Arrows show velocity; each mass includes cart and load.',
 scale:'The arrows and graph share one scale throughout this scene.',
 draft:'Your loads and force cards wait in this open page. Keep a program to include it in Notes.',
 keepRefused:'This program could not be kept safely. Your choices and earlier programs are unchanged. Download Notes or keep exploring.',
 viewRefused:'This result could not be opened safely. Your program and earlier work are unchanged. Download Notes or try again.',
 unknown:'This earlier format stays unchanged in Notes. You can still make another program.',
 exampleUnavailable:'This earlier example picture cannot be drawn. Its words and your program are still here.',
 stale:'The kept programs changed. Reopen them before continuing.',
 saved:'When kept, this program was saved on this device.',session:'When kept, saving was off. Download Notes to keep a file.',uncertain:'When kept, device saving was not confirmed. Download Notes to keep a file.',
 sameHistory:'For this program, the two velocity histories coincide. Check the loads and forces before explaining why.',sameFinal:'The final velocities match. Earlier steps differ.',different:'These carts have different final velocities.',
 return:'Tell someone what this model predicts. What would you still need to find out about a real cart?',
 grownup:'These are given force programs and predictions from a constant-mass, one-dimensional model. Kept loads, forces and opened views are constructions, not observed physical trials, independent calculation, understanding or mastery. Initial choices are instrument starts. View flags name requests in this version, not attention or whether its current setup was run. Displayed positive integer arithmetic records prior fact exposure for matching current and later math in this explorer’s notebook through the existing helper; it records no new answer or fresh independent evidence. Other interpretations and real investigations remain human work.'});
