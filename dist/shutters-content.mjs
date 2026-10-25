// Original fictional teaching copy, not a historical or optimal-strategy claim.
export function shuttersSource(size=6){
 if(![6,9].includes(size))return null;
 const open=Array.from({length:size},(_,i)=>i+1);
 return {model:'shutters-v1',id:`shutters-${size}`,size,switchAt:6,title:size===6?'The little shutter box':'The full shutter box',
  rule:'Roll the dice. Shut any open numbers that add to your roll. Shut them all to finish the box.',
  won:'Every shutter is shut!',blocked:'That roll has nowhere to go. This round is finished.',frames:[
   {open,faces:[3,4],selected:[],text:'Bramble rolls a three and a four. Together they make seven. Which open numbers could make the same amount?'},
   {open,faces:[3,4],selected:[1,6],text:`One and six make seven. Two and five work too, or three and four.${size===9?' The seven shutter could do it on its own.':''} Different choices can make the same amount.`},
   {open:open.filter(n=>![1,6].includes(n)),faces:[3,4],selected:[3,4],text:'Imagine we shut one and six, then roll seven again. Those shutters cannot be used again. Three and four are still open: another way to make seven.'},
   {open:[1,2,3],faces:[4],selected:[1,3],text:'Only one, two and three remain. Their total is six, so we roll one die. A four lets us shut one and three. There is no sure way to finish every box: even a thoughtful choice can meet an unlucky next roll.'}
  ]};
}
