// Spec 344: the Rod Tray. Child text is the 344 companion's (docs/content/344-rod-tray-text.md), with a true minus sign.
// `rodTraySource` is retained whole in a notebook on its first write; saved work is only ever read through that copy.
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const fb=(value,line)=>({value,line});
export const rodTraySource=freeze({
 id:'rod-tray',version:1,
 cases:[
  {id:'cross-down',title:'Down through zero',start:4,op:'add',operand:-7,result:-3,sentence:'4 + (−7)',helper:'adding',prompt:'What is 4 + (−7)? Build it on the tray.',guided:['Put out 4 red rods.','Add 7 black rods.','Pair them off and count what is left.'],hint:'Adding a negative moves down. How many steps reach zero?',explanation:'4 + (−7) = −3. Four zero pairs leave the tray. Three black rods are left.',feedback:[fb(11,'You added the sizes. Adding a negative moves down, not up.'),fb(3,'Right size. Which kind of rod is left over?')]},
  {id:'two-below',title:'Further below',start:-5,op:'add',operand:-3,result:-8,sentence:'−5 + (−3)',helper:'adding',prompt:'What is −5 + (−3)?',guided:[],hint:'Both numbers are below zero. Does adding more black rods go up or down?',explanation:'−5 + (−3) = −8. Eight black rods, no red ones to pair with.',feedback:[fb(8,'“Two minuses make a plus” doesn’t work for adding. Count the black rods.'),fb(-2,'You took the sizes apart. Adding puts more black rods in, not fewer.')]},
  {id:'pay-off',title:'The baker pays off a debt',start:-6,op:'add',operand:10,result:4,sentence:'−6 + 10',helper:'adding',prompt:'The baker owes $6. Then he takes in $10. What is his account now?',guided:[],hint:'Six black rods for what he owes. Add ten red. Pair them off.',explanation:'−6 + 10 = 4. Six dollars clear the debt. Four dollars are left over.',feedback:[fb(10,'That is what he took in. Part of it pays off the $6 first.'),fb(-4,'Right size. After paying off $6, is he still below zero?')]},
  {id:'take-black',title:'Take away what isn’t there',start:1,op:'take',operand:-3,result:4,sentence:'1 − (−3)',helper:'takeNegative',prompt:'What is 1 − (−3)?',guided:[],hint:'One red rod and no black. Add zero pairs so you can take 3 black away.',explanation:'1 − (−3) = 4. Add 3 zero pairs, take away 3 black rods, and 4 red are left.',feedback:[fb(-2,'Taking away a negative doesn’t make it more negative. Try the zero pairs.'),fb(-4,'One minus means take away. The other means below zero. Look at the brackets.')]},
  {id:'take-red',title:'Same numbers, one sign changed',start:1,op:'take',operand:3,result:-2,sentence:'1 − 3',helper:'takePositive',prompt:'What is 1 − 3?',guided:[],hint:'One red rod. You need to take away 3 red. Add zero pairs first.',explanation:'1 − 3 = −2. Add 2 zero pairs, take away 3 red rods, and 2 black are left.',feedback:[fb(2,'Right size. You took away more than you had. Which side of zero is that?'),fb(4,'That answers 1 − (−3). Here you take away 3 red rods.')]},
  {id:'remove-charge',title:'A charge taken off',start:-2,op:'take',operand:-6,result:4,sentence:'−2 − (−6)',helper:'takeNegative',prompt:'The account shows −$2. A $6 charge was a mistake. Take it off.',guided:[],hint:'Taking off a debt is taking away black rods. Do you have six?',explanation:'−2 − (−6) = 4. Add 4 zero pairs, take away 6 black, and 4 red are left.',feedback:[fb(-8,'That adds the charge again. Here it is taken away.'),fb(-4,'Right size. Taking off a debt moves the account up past zero.')]}
 ],
 helpers:{
  adding:{sentence:'5 + (−6)',steps:[{red:5,black:6,text:'Put out 5 red rods, then add 6 black.'},{red:0,black:1,text:'Pair them off: 5 zero pairs leave.'},{red:0,black:1,text:'One black rod is left: −1.'}]},
  takeNegative:{sentence:'2 − (−4)',steps:[{red:2,black:0,text:'Put out 2 red rods. There are no black rods.'},{red:6,black:4,text:'Add 4 zero pairs. The tray is still worth 2.'},{red:6,black:0,text:'Take away 4 black. Six red are left: 6.'}]},
  takePositive:{sentence:'2 − 6',steps:[{red:2,black:0,text:'Put out 2 red rods. You need to take away 6.'},{red:6,black:4,text:'Add 4 zero pairs. Now there are 6 red.'},{red:0,black:4,text:'Take away 6 red. Four black are left: −4.'}]}
 },
 teach:{
  T1:{title:'Zero pairs',text:'One red rod and one black rod make zero. Adding or removing a zero pair never changes what the tray is worth.',steps:['Put out 3 red and 3 black.','Pair them off.','Three zero pairs: the tray is worth 0.']},
  T2:{title:'Adding moves along the line',text:'Adding a positive moves right. Adding a negative moves left. You can go straight through zero.',steps:['2 + (−7).','From 2, move 7 to the left.','Two steps reach zero, five more reach −5.']},
  T3:{title:'Taking away what you don’t have',text:'To take away rods that aren’t there, add zero pairs first. They don’t change the total.',steps:['0 − (−2).','The tray is empty.','Add 2 zero pairs.','Take away 2 black.','2 red are left: 2.']},
  T4:{title:'Two jobs for one sign',text:'A minus sign can mean “below zero”, as in −3. It can mean “take away”. Brackets keep them apart.',steps:['5 − (−3): take away negative three.','Put out 5 red.','Add 3 zero pairs.','Take away 3 black.','8 red: 8.']}
 },
 lines:{nonMatch:'Not this one yet. Build the start, make the move, pair them off, then count.'}
});
// Page copy that is not saved work: labels, buttons and the fixed lines around the tray.
export const ROD_COPY=freeze({
 title:'The Rod Tray',
 entryText:'Add and take away with red and black rods, even past zero.',
 entryLink:'Open the Rod Tray',
 reason:'The baker sells bread at the market. Some days he pays out more than he takes in, so he counts with red and black rods.',
 model:'A made-up model. Red rods count one above zero. Black rods count one below zero.',
 legendRed:'Red upright rod (+): one above zero',
 legendBlack:'Black slanted rod (−): one below zero',
 empty:'The tray is empty.',
 buttons:{addRed:'Add a red rod',addBlack:'Add a black rod',takeRed:'Take away a red rod',takeBlack:'Take away a black rod',addPair:'Add a zero pair',pairOff:'Pair them off',startAgain:'Start again'},
 full:'The tray holds 12 of each kind. Pair some off first.',
 noRed:'There are no red rods to take away. Add a zero pair first.',
 noBlack:'There are no black rods to take away. Add a zero pair first.',
 paired:'Each red and black pair makes zero, so they leave the tray.',
 pairedStill:n=>`${n} zero ${n===1?'pair':'pairs'} left the tray.`,
 noPairs:'There are no pairs. Every rod here is the same kind.',
 answerLabel:'Your answer',noAnswer:'No answer yet',oneLess:'One less',oneMore:'One more',
 check:'Check my answer',
 beforeCheck:'Your tray and answer stay here. Notes keep your first check and your latest one.',
 lineButton:'Show on the line',lineCaption:'This arrow shows the move. It ends at the answer.',
 arrows:{addPositive:n=>`Adding ${n} moves ${n} to the right.`,addNegative:n=>`Adding negative ${n} moves ${n} to the left.`,takePositive:n=>`Taking away ${n} moves ${n} to the left.`,takeNegative:n=>`Taking away negative ${n} moves ${n} to the right.`,throughZero:'It goes straight through zero.'},
 contrast:'Same numbers, one sign changed. Compare the two trays.',
 tellWhy:'Tell a grown-up why your tray shows that answer.',
 helperCaption:'Example tray. Your own tray is waiting.',
 previous:'Previous',next:'Next',backToTray:'Back to my tray',
 ladder:{hint:'A hint',helper:'A different example',line:'Show on the line'},
 workedLabel:'Worked example',nextStep:'Next step',
 notesHeading:'The Rod Tray',
 teaches:'Adding and taking away whole numbers from −12 to 12 with zero pairs, and seeing each move as an arrow on a number line.',
 checkMeans:'“Matches” means the chosen answer matched this case once, with the help shown. It is not a grade or a level.',
 kept:'For each case, the first and latest check, how many checks, the tray at each check, and which help was opened first. Attempts in between are not kept. Spoken reasons are never stored.',
 refused:'That didn’t save, so nothing changed.',
 unreadable:'This saved work can’t be opened here. It is kept as it is, and you can still download it from Grown-up notes.',
 unknownVersion:'This saved work is from a different version. It is kept as it is, and you can still download it from Grown-up notes.',
 offScreen:'With a deck of cards, use red cards as +1 and black as −1. Deal a few, pair them off, and say what the hand is worth.'
});
