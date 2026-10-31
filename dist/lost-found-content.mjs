// Spec 333: the Lost and Found Board's first mystery. Child-facing lines come from the 333 copy sheet and 122's companion.
const freeze=x=>{if(x&&typeof x==='object'){for(const v of Object.values(x))freeze(v);Object.freeze(x);}return x;};
export const lostFoundCopy=freeze({
 title:'The Lost and Found Board',
 firstVisit:["Dot has pinned a big cork board beside the post office counter. It's already covered in notes.",'"Since the storm, everything\'s been borrowed, moved or mixed up," says Dot. "People keep asking me where things went. I\'m the postmaster, not a detective." She looks at you. "But you could be."'],
 laterVisit:'Dot has pinned up the notes. Which mystery shall we look at?',
 hubLink:'The Lost and Found Board',
 steps:['Some sentences tell us what someone **saw** or **did**. \'I saw a blue basket on the counter.\' That\'s an **I SAW** sentence.','Some sentences tell us what someone **thinks**. \'I think the basket is Moss\'s.\' That\'s an **I THINK** sentence.','Thinking is good. Detectives think all the time. But an I THINK sentence is an idea to check. It isn\'t a clue yet.','Let\'s sort the notes. Then open the clue cards, with an explanation from each note. Only the cards in Clues are used to check an answer.'],
 next:'Next',startSorting:'Start sorting',reopenSteps:'What are the two kinds?',
 saw:'I SAW',think:'I THINK',skip:'Sort them for me',skipped:'These are sorted for you. You can look at why under each one.',why:'Why?',
 cellHelp:'Tap once for no, twice for yes, three times to clear.',marks:{yes:'yes',no:'no'},
 listMode:'Show as a list',listRow:'{row} and {thing}',notSure:'not sure',
 clear:'Clear my marks',clearAsk:'Clear every mark on this grid?',clearYes:'Yes, clear them',clearNo:'Keep them',
 clues:'Clues',cluesRule:'Only the cards in Clues are used to check an answer.',
 answerStep:'My answer',check:'Does it fit?',reveal:'Find out what happened',
 fits:'That fits every clue.',broken:'That doesn\'t fit this clue: "{clue}". Have another look.',missing:'Every row needs an answer first.',duplicate:'Use each thing and each place once. One of yours is used twice.',
 tellQuestion:'Can we tell what happened yet?',tellYes:'Yes, I know',tellNot:'Not yet: it could be more than one way',
 tellNotLine:'Right. These clues still allow more than one way. We need another clue.',tellYesLine:'Let\'s check. Here\'s another way that fits every clue so far: {arrangement}. So we can\'t be sure yet.',nextClue:'Get the next clue',
 status:{new:'Not started',started:'Started',solved:'Solved'},
 choose:'Choose',thingLabel:'{row}: thing',placeLabel:'{row}: place',
 unreadable:"This mystery can't be shown here. It is still kept in your notes download. The board is open.",
 unknownVersion:'This Lost and Found notebook uses a format this version cannot read. Your work is kept in your notes download. The rest of the garden is open.',
 notesLink:'Download your notes',
 capacity:"There isn't room to save this change yet. Your work is unchanged. Ask a grown-up to export it or choose older work to delete.",
 grownUpLine:'Lost and Found Board: Who borrowed what? {status}{help}.',withHelp:', with sorting help',
 grownUps:['These are logic-grid puzzles. The game never marks the grid for the child; it checks only an answer the child asks it to check, and names the first clue that answer breaks.','*Can we tell yet?* teaches that "not enough evidence yet" is a real and correct answer.'],
 invitation:'Next time someone at home says "I think…", ask them: "What did you see that made you think that?"'
});
// The frozen case: finite data with a fixed predicate vocabulary, never code.
const LADDER={
 format:1,id:'ladder',model:1,title:'Who borrowed what?',
 note:"After the storm, the ladder, the rope and the bucket all went missing from the shed by the mill. They're all back now. But who had which, and where did they go?",
 rows:[{id:'pip',label:'Pip'},{id:'bramble',label:'Bramble'},{id:'miller',label:'the miller'}],
 things:[{id:'ladder',label:'ladder'},{id:'rope',label:'rope'},{id:'bucket',label:'bucket'}],
 places:[{id:'footbridge',label:'the footbridge'},{id:'orchard',label:'the orchard'},{id:'mill-roof',label:'the mill roof'}],
 sentences:[
  {id:'miller-roof',round:1,writer:'The miller',text:'"I spent the whole morning up on the mill roof, putting the tiles back."',sort:'saw',why:'This is something the miller did and knows.',clue:'roof'},
  {id:'miller-wind',round:1,writer:'The miller',text:'"I think the wind will be back for those tiles."',sort:'think',why:"This is the miller's guess about what will happen.",clue:null},
  {id:'dot-bridge',round:1,writer:'Dot',text:'"I flew past the footbridge and saw someone mending the rail with the rope. The willow branches hid who it was."',sort:'saw',why:"Dot saw this. Notice what she couldn't see, too.",clue:'rope'},
  {id:'pip-orchard',round:1,writer:'Pip',text:'"I was in the orchard all morning, picking up fallen apples."',sort:'saw',why:'Pip did this and knows it.',clue:'pip'},
  {id:'pip-ladder',round:1,writer:'Pip',text:'"I think Bramble took the ladder. She\'s always climbing things."',sort:'think',why:"This is Pip's idea. We'll check it at the end.",clue:null},
  {id:'baker-ladder',round:2,writer:'The baker',text:'"When I opened the bakery, I saw the ladder leaning up against a roof."',sort:'saw',why:'The baker saw it. Which roof could it be?',clue:'ladder-roof'}
 ],
 clues:[
  {id:'roof',order:1,round:1,text:'The miller was on the mill roof.',pred:{kind:'place',row:'miller',place:'mill-roof'}},
  {id:'rope',order:2,round:1,text:'Whoever had the rope was at the footbridge.',pred:{kind:'thing-place',thing:'rope',place:'footbridge'}},
  {id:'pip',order:3,round:1,text:'Pip was in the orchard.',pred:{kind:'place',row:'pip',place:'orchard'}},
  {id:'ladder-roof',order:4,round:2,text:'Whoever had the ladder was on the mill roof.',pred:{kind:'thing-place',thing:'ladder',place:'mill-roof'}}
 ],
 worked:'The miller was on the mill roof. So let\'s put **yes** where the miller meets the mill roof. And if the miller was on the roof, nobody else was. Put **no** for Pip and Bramble on the mill roof.',
 reveal:['"The ladder? Of course I had the ladder," says the miller. "How else do you get on a roof?"','"And I mended the rail with the rope," says Bramble. "The magpie supervised."','Pip looks at the bucket by his feet. "I had the bucket. For the apples. I forgot I had it."'],
 lookingBack:{question:'Pip thought Bramble took the ladder. Was he right?',choices:[{id:'no',label:'No, she had the rope',response:"Right. Pip's idea was worth checking, and the clues showed it was the miller."},{id:'yes',label:'Yes',response:'Look at the answer again. Who had the ladder?'}]}
};
export const makeLadderSource=()=>structuredClone(LADDER);
export const caseIds=freeze(['ladder']);
