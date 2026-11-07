// Authored finite models. Partners are partial interaction views, not whole diagrams.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const directions=freeze(['up','down','left','right']);
export const amounts=freeze([2,4,6]);
export const forceChoices=freeze([
 {id:'same',label:'Keep the same velocity.'},
 {id:'right',label:'Velocity starts changing toward the right.'},
 {id:'left',label:'Velocity starts changing toward the left.'},
 {id:'unknown',label:'These described forces are not enough to tell.'}
]);
export const forceCopy=freeze({
 title:'Force Sketch',
 entry:'Choose one object and draw the forces acting on it.',
 question:'Which forces act on this object? Let’s draw them before we plan its journey.',
 temporary:'These sketches are temporary and are not saved in Notes. Reloading starts fresh.',
 model:'Invented model, with only the described interactions.',
 hint:'Name the object receiving each force. Choose its direction and size from the scene clues.',
 motionPrompt:'Use the model’s described forces. What happens to this object’s velocity at this instant?',
 pairWarning:'One interaction only. These are not complete diagrams of both objects.',
 pairExplanation:'Equal forces of the same kind, opposite directions, different receivers, at the same time.',
 duplicate:'That force is already drawn. Choose its row to edit it.',
 empty:'No arrows drawn yet.',
 missingPrediction:'Choose a prediction first, or explore another page.',
 reset:'Start this object’s sketch again? Its drawings and choices will be cleared.'
});
const opposite={up:'down',down:'up',left:'right',right:'left'};
const force=(id,agent,receiver,name,direction,amountN,kind,partnerId=`${id}-partner`)=>({
 id,agent,receiver,name,direction,amountN,present:true,kind,
 partner:{id:partnerId,agent:receiver,receiver:agent,name:name==='Weight'?'Gravity':name,direction:opposite[direction],amountN,kind}
});
const body=(id,name,accepted,prediction,explanation,choiceOrder)=>({id,name,accepted,prediction,explanation,choiceOrder});
export const forceScenes=freeze([
 {id:'parcel',title:'Parcel on a table',story:'The library needs a diagram for a resting parcel.',
  clues:'The parcel is still on a horizontal table. Earth pulls down on the parcel, 6 N. The table pushes up on the parcel, 6 N. The parcel presses down on the table, 6 N. The parcel pulls up on Earth, 6 N. Draw only forces acting on the parcel.',
  bodies:[body('parcel','Parcel',['weight','support'],'same','The reference net force is 0 N: up 6 N and down 6 N balance, and the horizontal component is zero. The parcel is still, so it stays still while these described forces are unchanged. The support and weight balance on the parcel, but are different interactions.',['same','right','left','unknown'])],
  forces:[force('weight','Earth','Parcel','Weight','down',6,'gap','earth-partner'),force('support','Table','Parcel','Support','up',6,'contact','table-partner'),force('table-partner','Parcel','Table','Support','down',6,'contact','support'),force('earth-partner','Parcel','Earth','Gravity','up',6,'gap','weight')]},
 {id:'glider',title:'Library glider',story:'The library checks a glider diagram after the person lets go.',
  clues:'The glider is already moving steadily right on a horizontal rail. In this model the rail has no friction and air resistance is left out. Earth pulls down on the glider, 6 N. The rail pushes up on the glider, 6 N. The glider presses down on the rail, 6 N. The person has let go, so the person is no longer pushing. Draw only forces acting on the glider.',
  bodies:[body('glider','Glider',['weight','support'],'same','The reference net force is 0 N: up 6 N and down 6 N balance, and the horizontal component is zero. The glider already moves right, so it keeps the same speed and direction while these described forces are unchanged. Motion does not carry a stored push; zero net force does not mean stopping.',['right','same','unknown','left'])],
  forces:[force('weight','Earth','Glider','Weight','down',6,'gap'),force('support','Rail','Glider','Support','up',6,'contact','rail-partner'),force('rail-partner','Glider','Rail','Support','down',6,'contact','support'),{id:'released-push',agent:'Person',receiver:'Glider',name:'Released person’s push',present:false,kind:'contact'}]},
 {id:'tray',title:'Pulled book tray',story:'The library checks a diagram of the tray while a rope pulls it.',
  clues:'The tray slides right on a horizontal floor. A level rope pulls right on the tray, 4 N. The floor’s friction pushes left on the tray, 2 N. Earth pulls down on the tray, 6 N. The floor pushes up on the tray, 6 N. The tray pulls left on the rope, 4 N. The tray presses down on the floor, 6 N. Air resistance is left out. Draw only forces acting on the tray.',
  bodies:[body('tray','Tray',['weight','support','rope','friction'],'right','The reference net force is 2 N right: right 4 N and left 2 N leave 2 N right; up 6 N and down 6 N balance. The tray already slides right, so this rightward velocity change means it speeds up at this instant. These givens do not tell its end speed, position or numerical acceleration.',['unknown','left','right','same'])],
  forces:[force('weight','Earth','Tray','Weight','down',6,'gap'),force('support','Floor','Tray','Support','up',6,'contact','floor-partner'),force('rope','Rope','Tray','Rope pull','right',4,'contact','rope-partner'),force('friction','Floor','Tray','Sliding friction','left',2,'contact','friction-partner'),force('rope-partner','Tray','Rope','Rope pull','left',4,'contact','rope'),force('floor-partner','Tray','Floor','Support','down',6,'contact','support')]},
 {id:'magnets',title:'Two magnetic carts',story:'The library needs separate diagrams for two carts with repelling magnets.',
  clues:'Cart A is left of Cart B. Someone held them still with a gap between them and has just let go; neither is moving at that instant. Their magnets repel. Cart B pushes left on Cart A, 4 N. Cart A pushes right on Cart B, 4 N. Earth pulls down on each cart, 6 N each. The rail pushes up on each cart, 6 N each. This ideal rail has no friction; air resistance is left out. Nothing else pushes them along the rail. Draw only forces acting on your chosen cart.',
  bodies:[body('a','Cart A',['a-weight','a-support','b-on-a'],'left','The reference net force on Cart A is 4 N left; up 6 N and down 6 N balance. Cart A is just released from rest, so its velocity starts changing left, away from Cart B, at this instant. The magnetic force may change as the carts separate; this does not predict a future path.',['same','right','unknown','left']),body('b','Cart B',['b-weight','b-support','a-on-b'],'right','The reference net force on Cart B is 4 N right; up 6 N and down 6 N balance. Cart B is just released from rest, so its velocity starts changing right, away from Cart A, at this instant. The magnetic force may change as the carts separate; this does not predict a future path.',['right','unknown','same','left'])],
  forces:[force('a-weight','Earth','Cart A','Weight','down',6,'gap'),force('a-support','Rail','Cart A','Support','up',6,'contact'),force('b-on-a','Cart B','Cart A','Magnetic push','left',4,'gap','a-on-b'),force('b-weight','Earth','Cart B','Weight','down',6,'gap'),force('b-support','Rail','Cart B','Support','up',6,'contact'),force('a-on-b','Cart A','Cart B','Magnetic push','right',4,'gap','b-on-a')]}
]);
const exampleWeight=force('example-weight','Earth','Block','Weight','down',4,'gap');
const exampleSupport=force('example-support','Support','Block','Support','up',4,'contact');
export const forceTeaching=freeze([
 {id:'object',title:'Choose one object',body:'Block',text:'A force is a push or pull that one object gives another. Our object is the block. We draw forces acting on the block.',arrows:[]},
 {id:'arrow',title:'Add a force',body:'Block',text:'Earth pulls the block downward. This is its weight. The arrow points the way the force pushes or pulls. A longer arrow means a bigger force. Arrows start at the edge of the object’s box; they do not show where it is touched. N means newtons, a unit of force. Contact forces need touching; gravity and magnetic forces can act across a gap.',arrows:[exampleWeight]},
 {id:'balance',title:'Compare both forces',body:'Block',text:'The support pushes up. These forces act on the same block. They balance: their net force is zero. The net force is all the forces on one object added with their directions. A still block stays still; an already steadily moving object would keep the same velocity—its speed and direction—while the net force stays zero. A bigger arrow means a stronger force. Equal opposing sizes cancel; a leftover points in the direction velocity changes. When a different box slides left on a rough floor, the floor’s friction pushes right. It is a contact force.',arrows:[exampleWeight,exampleSupport]},
 {id:'interaction',title:'Follow one interaction',body:'Block',text:'One interaction, two objects. The block also pushes down on the support with an equal force at the same time. These two arrows do not balance the forces on the block: they act on different objects. Earth’s pull and the support’s push balance on the block, but are different interactions.',arrows:[],pair:{force:exampleSupport,partner:exampleSupport.partner}},
 {id:'setting',title:'Try another setting',body:'Two model magnets',text:'Two repelling model magnets act across a gap. Each magnet pushes the other away. Equal opposite partners act on different objects. To predict one object’s motion, collect the forces on that object.',arrows:[]}
]);
