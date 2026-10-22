const copy={
 instruction:'Move a whole sentence with Earlier or Later. More than one order can work for a reader.',
 help:'Look at what the photograph itself shows. Read the museum record for a date, use or interpretation. Which sentence says more than this one source can show? Try naming who says it, or naming what is not known.',
 draftWarning:'Draft claim to inspect. This sentence says more than this source supports.',
 carefulNotice:'Careful source wording names what The Met reports or interprets.',
 earlierResponse:'Earlier response to a different draft. Ask again to hear about this version.',
 humanRead:'Tell a person your own version. You can speak, sign or write elsewhere; the app does not judge your words.'
};
const openings={
 object:'You introduce the object first, so I know what the label is about before its other details.',
 use:'You begin with what people did with this kind of object, then let me find out which object it is.',
 claim:'You begin with the claim sentence before identifying the object. I can still read it; would another opening help this visitor?'
};
const sharedNote="The photograph shows this surviving object. The Met's record supplies its date, materials and explanation. Our label sentences are modern summaries, not words written on the object.";
export const labelCases=[
 {
  version:1,model:'three-sentence-label-v1',id:'writing-board',title:'Writing board of an apprentice scribe',
  readerRequest:'What was this board, and why does its writing interest museum researchers?',
  sourceCard:{objectNumber:'28.9.5',date:'Ancient Egypt; about 2030 BCE',materials:'Wood, whitewash and ink',alt:'A pale rectangular writing board with dark signs of varied shapes and spacing.',credit:'The Metropolitan Museum of Art, 28.9.5. Public Domain / CC0.',recordUrl:'https://www.metmuseum.org/art/collection/search/545112',assetId:'egypt-writing-board-28-9-5.jpg',sharedNote},
  sentences:{object:'This wooden writing board from ancient Egypt has a pale whitewash surface with ink signs.',use:'Ink could be removed and the board coated again for another round of writing.',claim:{careful:"The Met interprets the uneven signs as a learner's practice; the record does not name that learner.",broad:'Every Egyptian child practiced on a board like this.'}},
  initialOrder:['claim','object','use'],initialWording:'broad',
  modelFrames:[
   {text:"A photograph can show this board's shape and written marks.",caption:'That is a visual observation.'},
   {text:'The Met explains that a board like this could be recoated and used again.',caption:'That is a museum explanation about use.'},
   {text:'A photograph cannot tell us that every Egyptian child used one.',caption:'The larger claim would need more evidence.'}
  ],copy,visitor:{openings,claims:{broad:'This record describes one board. It does not show that every Egyptian child practiced on one. I would narrow that sentence.',careful:"I can tell this is The Met's interpretation of the uneven writing, and I know the learner is unnamed."}}
 },
 {
  version:1,model:'three-sentence-label-v1',id:'scribe-palette',title:"Scribe's Palette",
  readerRequest:'What did this palette hold, and what remains on it now?',
  sourceCard:{objectNumber:'10.176.62',date:'Ancient Egypt; about 2030–1550 BCE',materials:'Wood and pigment',alt:'A long narrow wooden palette with a central slot and two round ink recesses; one recess has dark material.',credit:'The Metropolitan Museum of Art, 10.176.62. Public Domain / CC0.',recordUrl:'https://www.metmuseum.org/art/collection/search/560805',assetId:'egypt-scribe-palette-10-176-62.jpg',sharedNote},
  sentences:{object:'This wooden palette from ancient Egypt has a long slot and two round places for ink.',use:'Scribes used palettes to hold ink and reed brushes for writing.',claim:{careful:'The Met reports black ink still on this palette and very little red; it does not name an owner.',broad:'This palette proves its owner used only black ink.'}},
  initialOrder:['use','claim','object'],initialWording:'broad',
  modelFrames:[
   {text:"A photograph can show this palette's long shape and ink recesses.",caption:'That is a visual observation.'},
   {text:'The Met says palettes held ink and brushes.',caption:'That is a museum explanation about use.'},
   {text:'A photograph cannot identify the person who used this palette.',caption:'The owner is not named in the record.'}
  ],copy,visitor:{openings,claims:{broad:'The Met reports black ink remaining and red almost gone. That does not prove an owner used only black ink.',careful:'I can tell what The Met reports about both inks without inventing an owner.'}}
 }
];
