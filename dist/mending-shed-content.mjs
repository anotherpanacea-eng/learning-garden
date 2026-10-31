// Spec 332: the Mending Shed's first slice. Every child-facing line is from the 332 copy sheet.
const freeze=x=>Object.freeze(x);
export const mendingCopy=freeze({
 title:'The Mending Shed',
 storyLabel:'A story from Willowbank',
 firstVisit:freeze(["Hob's barn smells of hay and wet wood. The flood left a heap by the door: a split bucket, a broken gate, a sack with a hole. A rack of spare materials leans on the wall.",'"Every job needs the right stuff," says Hob. "Trouble is, I never know which stuff is right."']),
 laterVisit:'The heap is smaller. What will you mend today?',
 simplified:'These are simplified pictures. Real materials can behave differently.',
 pileEntry:'The Mending Pile',pileProgress:'{n} of 12 things sorted',
 shapesEntry:'The Shape Bench',shapesProgress:'{n} of 24 shape tests tried',
 showMe:'Show me',start:'Start',whatFor:'What is this bench for?',
 pickedUp:'picked up',placed:'{chip}, in {row}',check:'Check',
 guidedSteps:freeze(['1. What is it?','2. What is it made of?']),
 board:'Object · made of',tryIt:'Try it',letGo:'Let go',
 stuck:"I'm stuck",example:'Show me an example',skip:'Skip for now',
 unreadable:"This one can't be shown here. It is still kept in your notes download. Everything else is open.",
 unknownVersion:'This Mending Shed notebook uses a format this version cannot read. Your work is kept in your notes download. The rest of the garden is open.',
 notesLink:'Download your notes',
 capacity:"There isn't room to save this change yet. Your work is unchanged. Ask a grown-up to export it or choose older work to delete.",
 scienceLabel:'A true thing about science',
 pilePrompt:'Tap a thing from the heap.',rowObject:'What is it?',rowMaterials:'What is it made of?',
 multiNote:'Some things are made of more than one material. Choose them all.',
 shapesPrompt:'Choose a sample and an action. Predict first.',
 matched:"You predicted that. Now you've seen it.",surprise:'Surprise! Different materials answer differently.',
 willowNote:'Dry willow cracks. Basket makers soak it first, so it bends.',
 teaches:'the difference between an object and its material, and how squashing, bending, twisting and stretching affect different materials.',
 claims:'the bench results are authored, simplified pictures, not measurements. It does not explain properties with particles. A sorted card is a supported sort, not proof that a child can name materials unaided.',
 grownUpLine:'Mending Shed: {n} of 12 things sorted; {m} of 24 shape tests tried{help}.',withHelp:', with help'
});
export const teachCards=freeze({
 pile:freeze({text:'An object is a thing with a job. A material is the stuff it is made of. Ask two questions.',example:'Three buckets from the heap.',steps:freeze(['What is each one? A bucket, a bucket, a bucket.','What is it made of? Wood. Metal. Plastic.','Same object. Three different materials.'])}),
 shapes:freeze({text:"Pushing and pulling can change a solid's shape. Some materials spring back. Some keep the new shape. Some hardly change, or snap.",example:'Clay and a rubber strip.',steps:freeze(['Squash the clay. Let go. It stays flat.','Stretch the rubber. Let go. It springs back.','Both are still clay and rubber.'])})
});
export const ladderExamples=freeze({
 pile:freeze({title:'A metal spoon.',body:'What is it? A spoon. Made of? Metal.',start:'Start: say "It is a ... made of ...".'}),
 shapes:freeze({title:'A sponge.',body:'Squeeze, let go, it springs back.',start:'Start: think of letting go.'})
});
export const chips=freeze(Object.fromEntries([
 ['bucket','bucket','object'],['sack','sack','object'],['spoon','spoon','object'],['basket','basket','object'],['lantern','lantern','object'],
 ['window-pane','window pane','object'],['mailbag',"Dot's mailbag",'object'],['rope','rope','object'],['roof-slate','roof slate','object'],['gate-hinge','gate hinge','object'],
 ['wood','wood','material'],['metal','metal','material'],['plastic','plastic','material'],['glass','glass','material'],['cloth','cloth','material'],
 ['cotton','cotton','material'],['sacking','sacking (jute)','material'],['leather','leather','material'],['slate','slate (a stone)','material'],
 ['rope-fiber','rope fiber (hemp)','material'],['willow','willow','material'],['iron','iron','material']
].map(([id,label,kind])=>[id,freeze({id,label,kind})])));
const card=(id,label,object,needs,also,tray,picture)=>freeze({id,label,object,needs:freeze(needs),also:freeze(also),tray:freeze(tray),picture});
// The metal bucket is offered first and is the guided card.
export const pileCards=freeze([
 card('metal-bucket','metal bucket','bucket',['metal'],[],['bucket','spoon','wood','plastic','metal','glass'],'bucket'),
 card('wooden-bucket','wooden bucket','bucket',['wood'],['metal'],['sack','bucket','wood','plastic','metal','glass'],'bucket'),
 card('plastic-bucket','plastic bucket','bucket',['plastic'],[],['basket','bucket','metal','plastic','wood','cloth'],'bucket'),
 card('lantern','lantern','lantern',['metal','glass','cotton'],[],['lantern','window-pane','plastic','metal','wood','glass','cotton'],'lantern'),
 card('sack','sack','sack',['sacking'],[],['mailbag','sack','plastic','leather','sacking','glass'],'sack'),
 card('mailbag',"Dot's mailbag",'mailbag',['cloth','leather'],[],['mailbag','sack','metal','cloth','glass','leather'],'mailbag'),
 card('window-pane','window pane','window-pane',['glass'],[],['lantern','window-pane','plastic','slate','wood','glass'],'pane'),
 card('rope','rope','rope',['rope-fiber'],[],['rope','basket','plastic','metal','willow','rope-fiber'],'rope'),
 card('basket','basket','basket',['willow'],[],['bucket','basket','willow','plastic','metal','cloth'],'basket'),
 card('roof-slate','roof slate','roof-slate',['slate'],[],['roof-slate','window-pane','wood','glass','slate','plastic'],'slate'),
 card('gate-hinge','gate hinge','gate-hinge',['iron'],[],['spoon','gate-hinge','wood','iron','plastic','glass'],'hinge'),
 card('spoon','spoon','spoon',['wood'],[],['spoon','bucket','metal','plastic','glass','wood'],'spoon')
]);
export const guidedCard='metal-bucket';
// Check lines, first that applies, in this order.
export const checkLines=freeze({
 objectInMaterials:'"{Object}" is what it is. What is it made of?',
 materialInObject:"That's what it's made of. What is the thing called?",
 objectEmpty:"What is it? Choose the thing's name.",
 wrongObject:'Look again. What is this thing called?',
 wrongMaterial:'Look closely. Is that what this one is made of?',
 materialsEmpty:'What is it made of? Choose a material.',
 missingMaterial:'Look again. Is there a part made of something else?',
 right:"That's it: {object}, made of {materials}."
});
export const predictChips=freeze([freeze({id:'springs',label:'Springs back'}),freeze({id:'keeps',label:'Keeps new shape'}),freeze({id:'hardly',label:'Hardly changes or snaps'})]);
export const actions=freeze([freeze({id:'squash',label:'Squash'}),freeze({id:'bend',label:'Bend'}),freeze({id:'twist',label:'Twist'}),freeze({id:'stretch',label:'Stretch'})]);
const sample=(id,label,material,outcomes,color)=>freeze({id,label,material,outcomes:freeze(outcomes),color});
export const samples=freeze([
 sample('clay','Clay','clay',{squash:'keeps',bend:'keeps',twist:'keeps',stretch:'keeps'},'#b9785a'),
 sample('willow-rod','Soaked willow rod','willow',{squash:'hardly',bend:'keeps',twist:'keeps',stretch:'hardly'},'#9a8a4e'),
 sample('rubber','Rubber strip','rubber',{squash:'springs',bend:'springs',twist:'springs',stretch:'springs'},'#c2564f'),
 sample('sponge','Sponge','sponge',{squash:'springs',bend:'springs',twist:'springs',stretch:'hardly'},'#e2c35a'),
 sample('slate','Slate','slate',{squash:'hardly',bend:'snaps',twist:'hardly',stretch:'hardly'},'#66727d'),
 sample('rope','Rope','rope',{squash:'hardly',bend:'keeps',twist:'keeps',stretch:'hardly'},'#b49a6a')
]);
// Every outcome matches one predict chip; snaps and hardly both match "Hardly changes or snaps".
export const outcomeChip=freeze({springs:'springs',keeps:'keeps',hardly:'hardly',snaps:'hardly'});
export const resultLines=freeze({springs:'It springs back when you let go. Still {sample}.',keeps:'It keeps the new shape. Still {sample}.',hardly:'It hardly changes. Still {sample}.',snaps:'Still slate. Now in two pieces.'});
