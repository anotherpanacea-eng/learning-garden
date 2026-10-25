// Original fictional story text; prose is code-mapped, never stored as learner evidence.
const parcelTail=[
 'The label is smudged, but you can still read it: To the Keeper of the Ways, Willowbank, by Willow Brook.',
 '“Who’s the Keeper of the Ways?” asks Pip.',
 '{guide} turns the parcel over. “I don’t know. Somebody sent this a long way to find them.”',
 'Inside, the pages are stuck together in one damp lump. “We dry them,” says Dot. “Slowly. Nobody is peeling anything.”'
];
export const keeperStoryContent={
 title:'The Keeper’s Pages',label:'Story · an invented valley and map',
 ui:{reminderTitle:'The parcel in Pip’s satchel',revealTitle:'A page comes free',revealReplayTitle:'How the page came free',recoveryTitle:'Your earlier story is safe',recoveryBody:'This version cannot continue that saved story. Its contents remain unchanged in your notes. Every other place is open.',recoveryReplay:'Read the parcel story together',orchardToggle:'See where the orchard is now'},
 parcel:{
  title:'A very wet parcel',
  fresh:['The rain has stopped. Everything drips.','Pip is tugging at something wedged against the flowerpot. “It’s a parcel,” says Dot. “A very wet parcel.”',...parcelTail],
  returning:['Pip has been keeping something for you. “I found it after the storm,” he says, “and I didn’t open it. Mostly.”',...parcelTail],
  after:'Pip tucks the wrapper, label and all, into his satchel. Dot carries the damp pages to the bakery windowsill. “Warmest one in Willowbank,” she says.',
  reminder:'The wrapper is safe in Pip’s satchel. The damp pages are drying on the bakery windowsill.',
  keepLabel:'Keep it safe',replayLabel:'Read the parcel scene again'
 },
 page:{
  title:'The old map',
  reveal:['A little later, Dot comes back from the bakery holding one page by its corners. “This one came free,” she says. “It’s a map.”'],
  revealLabel:'Read the old map',
  amounts:{
   short:{label:'Short',paragraphs:['An old map of our valley. The brook wanders through a big green patch called the Sponge. The orchard is there now.']},
   longer:{label:'Longer',paragraphs:['It is a map of the whole valley, drawn by hand. Willow Brook doesn’t run straight the way it does now. It wanders in loops through a wide green patch with tiny reeds drawn all over it. Someone has written the Sponge across the middle. Pip puts his paw on the spot. “That’s where the orchard is,” he says. “There’s no Sponge there now.” Dot looks at the map for a long time. “Then where did it go?”']},
   original:{label:'Water-stained original · story',paragraphs:['The valley, drawn in my second year of keeping. Willow Brook from the high ford to the mill. The Sponge holds the spring water and lets it go [smudged word], so the mill boards are seldom needed. Reeds, frogs, a great many herons, one of them me. The bridge road runs on the dry side. Scale: one finger to a [smudged word] walk.']}
  },
  guideLine:'{guide}: A map shows how someone drew a place. What might have changed?',
  stuckAlt:'A damp page stuck to the others, with one readable word: Sponge',
  drying:'Drying on the bakery windowsill.',
  dryLine:'One page is dry. The rest are still stuck.',
  mapLegend:'The Sponge: a marsh, drawn with tiny reeds. The old brook loops through it. The orchard occupies that part of the valley now.',
  mapLimit:'A fictional sketch, not to scale or real geography. This comparison alone does not show when, why or how the landscape changed.',
  overlayLabel:'Orchard now · shown over the old map'
 },
 glossary:{marsh:'wet ground where reeds and other plants can grow',brook:'a small stream'},
 invitation:{
  found:{title:'A page has come free',body:'A page has come free on the bakery windowsill. There is a map on it.'},
  unfound:{title:'Pip has a parcel for you',body:'Keep the damp parcel safe, then see if a page comes free.'},
  reread:{title:'Read the old map again',body:'The first dry page is kept in the Keeper’s Pages. The remaining pages are still stuck.'},
  button:'Visit the Keeper’s Pages'
 }
};
export const keeperPageAmounts=['short','longer','original'];
