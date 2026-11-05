// Original supplied material adapted from project277; scope/source study in spec381.
const p=(id,text)=>({id,text});
const teach=[
 'Revising changes writing for its reader. Editing checks spelling, punctuation and similar conventions. They can overlap. Use the reader’s purpose to decide what change helps.',
 'A note for a gardener.',
 '“Meet by the thing.” The gardener has never been here. Change it to “Meet by the greenhouse.” That clarifies the place: revising.',
 'Another note says “Meet by the greenhous.” Change greenhous to greenhouse. That fixes the spelling in this separate note: editing.',
 '“A lovely garden” and “a beautiful garden” can both fit a friendly welcome. A preference need not be a correction.'
];
const strips=[
 p('time','The bakery opens at seven in the morning.'),
 p('place','The bakery is on the square, next to the post office.'),
 p('flour','Leave flour sacks at the side door.'),
 p('pause','Deliveries pause from noon to one in the afternoon.'),
 p('front','Visitors use the front door.')
];
const headings=[p('use','On this notice'),p('aside','Set aside for this reader')];
const feedback=(fit,different,general)=>({fit,different,general});
function task(id,kind,title,extra){return {v:1,id,family:id,bench:'revision',kind,title,teach:[...teach],parts:[],choices:[],...extra};}
const visitor=task('pencil-notice','sort','A notice for a visitor',{
 reader:"A first-time visitor needs the bakery's opening time, location and entrance. This is a brief visit notice, not delivery instructions.",prompt:'Make a notice for this visitor.',parts:strips,choices:headings,key:{time:'use',place:'use',flour:'aside',pause:'aside',front:'use'},
 redPencil:{v:1,keepId:'use',asideId:'aside',otherReader:{taskId:'pencil-courier',label:'Make a notice for the courier'},destinationLabels:{use:'Put on this notice',aside:'Set aside for this reader'}},
 feedback:feedback("The notice answers this visitor's three requests. Set-aside lines remain available for another reader.",{
  time:'This reader asked when the bakery opens. The time helps them plan.',place:'This visitor needs to find the bakery. Keep its location available.',flour:"This line is for a flour delivery. This visitor's request does not need it.",pause:"This pause applies to deliveries, not the visitor's opening-time question.",front:'The visitor asked which entrance to use. This line answers that.'
 },"Compare each line with this reader's request."),
 hint:'Which lines answer opening time, location and entrance?',example:'A gardener who needs a meeting place benefits from “Meet by the greenhouse.” A lunch story would not answer that request.',steps:["Read the reader's request.",'Choose a strip.','Put it on the notice or set it aside.']
});
const courier=task('pencil-courier','sort','A notice for a flour courier',{
 reader:"A flour courier already knows the address, opening time and visitors' entrance. They need where to leave sacks and when deliveries pause.",prompt:'Make a notice for this courier.',parts:strips,choices:headings,key:{time:'aside',place:'aside',flour:'use',pause:'use',front:'aside'},
 redPencil:{v:1,keepId:'use',asideId:'aside',otherReader:{taskId:'pencil-notice',label:'Make a notice for the visitor'},destinationLabels:{use:'Put on this notice',aside:'Set aside for this reader'}},
 feedback:feedback("The notice answers this courier's two requests. A line useful to a visitor need not belong on this brief notice.",{
  time:'The courier already knows the opening time. This brief request is about drop-off and delivery pauses.',place:'The courier already knows the address. They need the drop-off instructions here.',flour:'This line names the drop-off door. The courier needs it.',pause:'This line says when deliveries pause. The courier needs it.',front:"The visitors' entrance is already known. Flour sacks go to the side door."
 },'Check the request, not whether a sentence is interesting or true. Unfinished versions can be kept.'),
 hint:'Which lines tell this courier where to leave sacks and when deliveries pause?',example:'A gardener who knows the meeting place may instead need which gate is unlocked. Useful details depend on the request.',steps:["Read this reader's request.",'Choose from the five strips.','Decide what this notice needs.']
});
const changes=task('pencil-changes','sort',"What is the change's main job?",{
 reader:'Pip wants to understand why someone changed a notice. These clear examples ask for the main job; other changes can do both jobs.',prompt:'Sort these changes by their main job.',
 parts:[p('spelling','Change “bred” to “bread” when naming the food.'),p('location','Add where the bakery is so visitors can find it.'),p('period','Add a missing period to finish a full written sentence.'),p('order','Put opening times first so visitors can find them quickly.')],
 choices:[p('revise','Revise for the reader'),p('edit','Edit spelling or punctuation')],key:{spelling:'edit',location:'revise',period:'edit',order:'revise'},redPencil:{v:1,destinationLabels:{revise:'Revise for the reader',edit:'Edit spelling or punctuation'}},
 feedback:feedback('These examples separate the main jobs. Real revision and editing can overlap.',{
  spelling:'Here the food is already intended. This change fixes the spelling used for it.',location:'This adds information the reader needs. Its main job is revising the content.',period:"The sentence's meaning is already clear. This change supplies its expected end punctuation.",order:'This reorganizes information for the reader. Its main job is revising the order.'
 },'Ask what this particular change mainly does. This is practice with these examples, not a rule for every change.'),
 hint:'Is the main job revising for the reader, or editing spelling or punctuation?',example:'In one note, change “the thing” to “the greenhouse” to clarify the place. In a separate note, change “greenhous” to “greenhouse” to edit spelling.'
});
const editing=task('pencil-edit','choice','A word for the food',{
 reader:'A bakery visitor needs the ordinary spelling of the food in this sentence.',prompt:'Which spelling names the food here?',parts:[p('draft','The bakery sells bred.')],choices:[p('bread','bread'),p('bred','bred'),p('breed','breed')],key:'bread',preview:{bread:'The bakery sells bread.',bred:'The bakery sells bred.',breed:'The bakery sells breed.'},
 feedback:feedback('Bread names this food. This correction is an example of editing.',{bred:'Bred is a different word. Here the sentence is naming the food bread.',breed:'Breed is a different word. The food in this sentence is bread.'},"Use the sentence's meaning. These printed choices are support, not a spelling-from-memory check."),
 hint:'The sentence is naming food you might buy at the bakery.',example:'“Please bring teh plates” needs the spelling the in place of teh. The intended word is already known.'
});
const plan=task('pencil-plan','choice','A plan for reaching the show',{
 reader:"A visitor at the bridge needs to reach today's show on time. The note gives its place, start time and a usable marked route.",prompt:'Which plan serves this reader?',parts:[p('place',"Today's show is at the Story Loft."),p('time','It starts at six in the evening.'),p('route','From the bridge, follow the star signs to the Story Loft.')],
 choices:[p('history','Describe the old show and name each past actor.'),p('arrival',"Use today's place, start time and marked route."),p('wait','Wait for every earlier route to be fully mapped.')],key:'arrival',
 feedback:feedback("The given place, time and current route answer this visitor's request. A plan starts with what the reader needs.",{history:"Past actors do not tell this visitor how to reach today's show on time.",wait:'A usable current route is already given. Earlier routes are not needed for this visit.'},'Match the plan to the stated purpose; do not add a requirement the supplied facts do not need.'),
 hint:'What does this visitor need to do now?',example:'A first-time bakery visitor needs the opening time, place and entrance more than the history of every bun.'
});
const taste=task('pencil-taste','choice','A preference is not always a correction',{
 reader:'A story reader only needs to understand that Pip ran with speed. Compare the two versions for this purpose.',prompt:'Which versions can fit this purpose?',parts:[p('fast','Version 1: “Pip ran fast.”'),p('quickly','Version 2: “Pip ran quickly.”')],choices:[p('first','Only the first can work.'),p('second','Only the second can work.'),p('both','Both can work.'),p('neither','Neither can work.')],key:'both',
 feedback:feedback('Fast can be an adverb here, and quickly also works. A writer may prefer either without calling the other a mistake.',{first:'You may prefer fast. That does not make quickly incorrect for this purpose.',second:'You may prefer quickly. Fast is also a standard adverb here.',neither:'Both versions can describe running with speed here. There is no need to reject both.'},'Explain your preference to a person. This check asks what can work, not what you must like.'),
 hint:'A standard adverb does not always end in -ly.',example:'A friendly reading-room sign could describe a quiet corner or a peaceful corner. A writer may prefer one effect without calling the other incorrect.'
});
export const revisionTasks=[visitor,courier,changes,editing,plan,taste];
export const revisionCopy=Object.freeze({
 label:'The Red Pencil',header:"Read the reader's request. What change would help?",invitation:'Try a short message aloud or on paper. Ask a person what needs clarifying, correcting, or deliberately keeping.',messageLabel:'Try my own message',
 together:'Tell someone which reader your change helps. Ask them what they would clarify, correct or keep. These are questions to try, not a claim someone has read your writing.',summary:'Compare the draft with the stated request.',feedbackDetails:'Look at the line notes',
 grownup:"Revising and editing are overlapping processes, not a universal two-box taxonomy. The classification task supplies clear main-purpose examples. Notice checks use each frozen reader request; they do not assess independent composition or the truth of original prose. The writer may keep a stylistic preference. Existing original messages and case-note revision remain separate, with their own saving choices.",
 unavailableReader:"That reader's earlier draft is unavailable here. Its original stays in Notes."
});
