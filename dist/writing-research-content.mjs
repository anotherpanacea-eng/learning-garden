// Original supplied research practice. These learning cards are not external quotations.
const p=(id,text)=>({id,text});
const cards=[
 {id:'guide',title:'Common frogs in Britain',origin:"Original learning card based on Froglife and Amphibian and Reptile Conservation's common-frog guides.",notice:"Biological information about common frogs in Britain. These are our learning-card words, not those organisations' exact wording.",lines:[p('g1','In Britain, common-frog spawn often appears in late winter or spring. Timing varies with weather and location.'),p('g2','Tadpoles hatch and grow in water.'),p('g3','The back legs grow before the front legs.'),p('g4','The tail shrinks as tadpoles become froglets, which eventually leave the water.')]},
 {id:'pond',title:"The miller's pond notes",origin:'An invented Willowbank record for this activity.',notice:'Fictional observations from one pond in a story year. These are not real field data or a timetable for every frog.',lines:[p('p1',"March 3: spawn was noted at the millpond."),p('p2','March 20: tadpoles were wriggling in the water.'),p('p3','June 12: a froglet was seen on a lily pad.')]},
 {id:'pip',title:"Pip's claim",origin:"An invented character's words for this activity.",notice:'An untested claim, not a measured comparison.',lines:[p('u1','Pip says, ‘I think frogs are the best swimmers in the whole world.’'),p('u2','He has not compared them with other animals.')]}
];
const fallback=c=>p(c.id,[c.title,c.origin,c.notice,...c.lines.map((l,i)=>`${i+1}. ${l.text}`)].join('\n'));
const ref=(cardId,...lineIds)=>[{cardId,lineIds}];
const teach=[
 'A useful research note keeps the meaning you need and a source another reader can inspect.',
 'Different example: a cafe card, line 1, says ‘The bakery opens at dawn.’ A short note is ‘bakery—opens at dawn’.',
 'Keep the important fact. ‘Bakery’ alone loses when it opens.',
 "Keep the source label: cafe card, line 1. Those are this activity card's lines.",
 'Put the note under a heading that helps your reader. The source label travels with it.'
];
function task(id,kind,title,display,key,choices,links,extra){return {
 v:1,id,family:id,bench:'research',kind,title,reader:'For visitors reading a short pond page.',
 prompt:'Choose the part that helps the reader.',parts:cards.filter(c=>display.includes(c.id)).map(fallback),choices,key,teach:[...teach],
 research:{v:1,cards:structuredClone(cards),links,cardChoices:kind==='tap'},
 feedback:{fit:'',different:{},general:'Your draft is still here. You can change it.'},hint:'',example:'',...extra
};}
const caveat='A full sentence can also be a useful note. Mark copied words as a quotation and give its source. Here the job asks for a brief note that keeps the order.';
const feedback=(fit,different,general='Your draft is still here. You can change it.')=>({fit,different,general});
export const researchTasks=[
 task('research-question','choice','A question these cards can answer',['guide','pond','pip'],'spawn-date',[
  p('spawn-date','When was spawn noted in this story pond?'),p('count','How many frogs live in all of Willowbank now?'),p('croak','Why do adult frogs croak at night?')
 ],{'spawn-date':ref('pond','p1')},{prompt:'Which question can the displayed cards answer?',hint:'Look for what each card actually records.',example:'A cafe card says ‘opens at dawn’. It can answer when that cafe opens, not how many visitors came.',steps:['Read the cards.','Read each question.','Find the words that could answer it.'],feedback:feedback('The pond note records spawn on March 3. That answers when spawn was noted in this story pond, not when every frog spawns.',{count:'No card counts that population.',croak:'No displayed line explains croaking.'})}),
 task('research-sources','tap','Sources for a pond page',['guide','pond','pip'],['guide','pond'],[],{}, {
  parts:cards.map(c=>({...fallback(c),tap:true})),reader:'For a page about spawn timing and how tadpoles change.',prompt:'Tap every card that helps this page.',hint:"Useful for which question? Read the reader's job.",example:'An opening-times card helps a visitor know when to arrive. A favorite-bun opinion answers a different question.',feedback:{...feedback("The guide gives general information; the pond note gives one story pond's recorded observations. Keep those kinds of statement distinct.",{pip:"Pip's claim tells us what he says he thinks. It is not about this report's timing or development question."}),missing:'Check whether the guide or pond record could help with timing or development.'}}),
 task('research-note','choice','Keep the order',['guide'],'back-first',[
  p('front-first','tadpoles—front legs, then back legs'),p('back-first','tadpoles—back legs, then front legs'),p('legs-only','tadpoles—legs')
 ],Object.fromEntries(['front-first','back-first','legs-only'].map(k=>[k,ref('guide','g3')])),{prompt:'Which brief note keeps which legs grow first?',hint:'Which words carry the order?',example:'If a card says ‘put on socks before boots’, ‘socks, then boots’ keeps the order. ‘Clothes’ loses it.',feedback:feedback(`The short note keeps the order without repeating the whole sentence. ${caveat}`,{'front-first':'That changes the source order.','legs-only':'That loses which legs come first.'},caveat)}),
 task('research-scope','choice','One recorded date',['pond'],'local',[
  p('everywhere','Every common frog in Britain and Willowbank spawns on March 3.'),p('nothing','The note cannot tell us any date when spawn was recorded.'),p('local','The story pond note records spawn on March 3.')
 ],Object.fromEntries(['everywhere','nothing','local'].map(k=>[k,ref('pond','p1')])),{prompt:'Which sentence keeps what this pond note can tell us?',hint:'Keep the date and the place limit.',example:'A cafe note ‘one bun sold at dawn’ does not count every bakery, but it does record that sale.',feedback:feedback('The record gives a date for a recorded observation in one invented pond. It does not set a universal date.',{everywhere:'That adds an unsupported all-places rule.',nothing:'That withholds the date the note actually gives.'})}),
 task('research-opinion','choice','Useful for a different question',['pip'],'stated-view',[
  p('measured',"What scientists measured about the world's fastest swimmers last summer."),p('stated-view','What Pip said he thought about frogs as swimmers.'),p('no-view','Pip’s card contains no statement of his view of frogs.')
 ],Object.fromEntries(['measured','stated-view','no-view'].map(k=>[k,ref('pip','u1','u2')])),{prompt:"What could Pip's card support?",hint:"Separate a speaker's words from proof of the speaker's claim.",example:"Saying ‘I like cherry buns best’ can show my preference, not everyone's favorite.",feedback:feedback("Pip's words can show his stated view. They do not establish a measured ranking of animals.",{measured:'No measurements or scientists appear here.','no-view':'The card gives his stated opinion.'})}),
 task('research-organise','sort','A pond page with its sources',[],{season:'spawn',legs:'change','pond-date':'spawn',tail:'change'},[
  p('spawn','When spawn appears'),p('change','How tadpoles change')
 ],{season:ref('guide','g1'),legs:ref('guide','g3'),'pond-date':ref('pond','p1'),tail:ref('guide','g4')},{
  parts:[p('season','Britain—spawn often late winter or spring; timing varies.'),p('legs','Tadpoles—back legs, then front legs.'),p('pond-date','Story pond—spawn noted March 3.'),p('tail','Tail shrinks; froglets later leave the water.')],reader:'For visitors who need two short paragraphs: spawn timing and tadpole changes.',prompt:'Choose a note, then its heading. Its source label stays with it.',hint:'Read the two headings. Time of spawn, or a developing tadpole?',example:"For a bakery page, ‘opens at dawn’ goes under When to visit; ‘seed rolls’ goes under What's for sale. Both keep the card they came from.",feedback:feedback("Each note has a heading that matches this reader's job. Its source label still lets someone inspect the card.",Object.fromEntries(['season','legs','pond-date','tail'].map(k=>[k,'Is this note about spawn timing or a change in the tadpole? Its source stays the same whichever heading you try.'])))} )
];
export const researchTeaching=Object.freeze([...teach]);
export const researchCopy=Object.freeze({
 invitation:"Tell someone, or write on paper, two short paragraphs. Keep the general guide separate from the one story pond's record. Say where each fact came from and what needs a further source.",
 grownup:"Research Corner models choosing among supplied questions/cards, preserving meaning in short supplied notes and organising those notes with source-card locators. The sources and references are provided, not found or independently cited by the child. Checks remain guided/supported practice with frozen task material. First/latest versions preserve the elected arrangements and their record's source labels. The factual guide is an original paraphrase; the pond dates and Pip's words are fiction. Original notes, paragraphs, source searching, formal bibliography and extended synthesis remain unobserved or off-screen. Nothing here assesses independent research, transfers a level or earns story credit.",
 returnInvitation:'A reader needs to trace a statement. Reopen your kept notes, inspect an original source label, then use or revise the notes for that reader.',
 unavailableReference:'A source reference is not available here. Your original draft is retained in Notes, and other notes stay open.',
 unavailableCard:'This source card cannot open here. Your original draft is retained in Notes.'
});
