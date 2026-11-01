// Original bounded content. Supplied language is practice, never evidence of original composition.
export const instructionPages=['purpose','plan','strip','words','read','keep'];
export const instructionHelpTopics=['purpose','planning','sentence','order','cause','revision','computer','example'];
export const instructionQuestions=['Which thing?','Where?','What happens first?','Why?'];
export const instructionProductionReports=['not-stated','typed','dictated','copied','mixed'];
export const instructionReadingReports=['unknown','self','together'];
export const instructionComparison={
 label:'An invitation for a visitor',invitation:'Come and watch our puppet show at the welcome table.',
 question:'Does this invite someone to watch, or tell a helper how to prepare the show?',
 instruction:'Put the welcome card on the table.',
 explanation:'Both forms can help, but the invitation does not supply preparation steps.'
};
export const instructionExample={
 title:'A separate toy-box example',sentences:['Put the toy in the box.','Close the box.'],
 steps:[
  'The toy is outside an open box.',
  'Put the toy in the box. The toy is now inside; the box is still open.',
  'Close the box. The toy is inside the closed box.',
  'Try closing first: the box is closed and the toy is still outside.',
  'Putting the toy inside now pauses: the box is closed. Nothing silently opens it.'
 ]
};
export const instructionHelp={
 purpose:'Audience means the person receiving these instructions. Purpose means what the note is meant to help them do. This ready-made form is a short practical note.',
 planning:'A plan holds the intended actions. A draft is a version of the words. Point, talk, sign, use AAC, draw off-screen, or arrange picture tickets. Copying a plan puts ready-made pieces together.',
 sentence:'Say one complete instruction before writing it, if you want. “Fold the note.” is a complete instruction: the reader is understood as the person doing it.',
 order:'Before tells an order. Because gives a reason. Ask which words specify an action, what must already be true, and whether two steps could exchange places.',
 cause:'Discuss the two ready-made explanations beside the source scene. A different explanation can be kept. Neither selecting a reason nor using the word because shows understanding.',
 revision:'Revise means change the meaning or organization to help the reader. Edit or proofread means check how the words are written. Discuss sentence starts and end marks with a person; the app does not correct spelling or grammar.',
 computer:'This device is one example of a computer. It follows its programmed action rules; it does not infer what the writer intended or understand original words.',
 example:'This toy and box are a separate worked example. They do not enter either live strip.'
};
export const instructionCases=[
 {
  id:'pocket-note',revision:1,title:'An invitation that fits',reader:'Dot',
  request:'Rabbit asks Dot to put a written invitation inside a small envelope and seal it for the puppet show.',
  readerKnowledge:'Dot knows which note and envelope Rabbit means.',
  startingDescription:'One unfolded note lies on the table beside one open envelope. This unfolded note is too wide for this envelope; folding it once makes it fit.',
  startingScene:{note:'unfolded-table',envelope:'open'},
  actions:[
   {id:'fold',label:'Fold the note',variants:{A:'Fold the note.',B:'Fold the invitation once.'}},
   {id:'insert',label:'Put the note inside',variants:{A:'Put the folded note in the envelope.',B:'Slide the folded invitation into the open envelope.'}},
   {id:'seal',label:'Seal the envelope',variants:{A:'Seal the envelope.',B:'Close and seal the envelope.'}}
  ],
  cause:'Fold the note before you put it in the envelope, because the unfolded note is too wide.',
  reversedCause:'The note is too wide because you folded it.',
  causeExplanation:'The scene establishes the width problem before folding; the second explanation reverses that reason.',
  readerVariation:'What if this were a different envelope? This pictured note needs folding to fit this pictured envelope.'
 },
 {
  id:'welcome-table',revision:1,title:'Two preparations, then an invitation',reader:'Kitten',
  request:'Pip asks Kitten to prepare a puppet-show welcome table, then invite Rabbit. Both preparations should be ready before Rabbit is invited; either preparation may come first.',
  readerKnowledge:'Kitten knows the way. Rabbit is visiting for the first time, cannot see the table from the fork, and needs an arrow at the fork and a card on the table to recognize the welcome place.',
  startingDescription:'A fork is in the path, with the table beyond it. The arrow sign is beside the fork, not placed there yet. The welcome card is beside the table, not on it yet. Rabbit has not been invited.',
  startingScene:{arrowReady:false,cardReady:false,rabbit:'not-invited',recognized:false},
  actions:[
   {id:'arrow',label:'Place the arrow',variants:{A:'Put the arrow sign at the fork.',B:'Place the arrow at the path fork.'}},
   {id:'card',label:'Place the welcome card',variants:{A:'Put the welcome card on the table.',B:'Place the welcome card on the table.'}},
   {id:'invite',label:'Invite Rabbit',variants:{A:'Invite Rabbit to the welcome table.',B:'Ask Rabbit to come to the welcome table.'}}
  ],
  cause:'Put the arrow at the fork before inviting Rabbit, because Rabbit does not know the way.',
  reversedCause:'Rabbit does not know the way because you put out the arrow.',
  causeExplanation:'The given scene says Rabbit was unfamiliar already; placing the arrow did not cause that unfamiliarity.',
  readerVariation:'What if Rabbit had visited before? Discuss with a person. The same short message can be useful to a familiar reader and insufficient for a newcomer; this does not change the runner.'
 }
];
export const instructionCase=id=>instructionCases.find(c=>c.id===id)||null;
