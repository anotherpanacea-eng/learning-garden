// Original fictional game copy. No learner identity or curriculum-completion claim.
export const pileRules=[
 {id:'pile',title:'Take 1, 2 or 3',maxTake:3,lastLoses:false,rule:'Take turns taking 1, 2 or 3 seeds. Take the last seed to win.'},
 {id:'pile-two',title:'Take 1 or 2',maxTake:2,lastLoses:false,rule:'Take turns taking 1 or 2 seeds. Take the last seed to win.'},
 {id:'pile-last-loses',title:'Last seed loses',maxTake:3,lastLoses:true,rule:'Take turns taking 1, 2 or 3 seeds. Whoever takes the last seed loses.'}
];
export const pileDials=[['sleepy','Bramble is sleepy','She chooses any legal take.'],['attention','Bramble is paying attention','She spots a win right now. Otherwise, she guesses.'],['plan','Bramble has a plan','She works backwards from the end.']];
export function pileSource(id){
 const r=pileRules.find(x=>x.id===id);if(!r)return null;
 const gap=r.maxTake+1;
 const frames=r.lastLoses?[
  {pile:1,text:'One seed, on your turn. You must take it, so you lose. This is a tricky number to be left with.'},
  {pile:5,text:'Five seeds. Whatever you take, your rival can leave you one. Try taking 1, 2 or 3 and count what they could take.'},
  {pile:6,text:'From six, take one and leave five. Now your rival has the tricky pile.'},
  {pile:9,text:'The tricky numbers are 1, 5, 9, 13… One more than a multiple of four. Changing who wins changed the plan.'}
 ]:[
  {pile:r.maxTake,text:`Start at the end. With ${r.maxTake} seeds, you can take them all and win. Any smaller positive pile works too.`},
  {pile:gap,text:`Now ${gap}. Whatever you take, your rival can take the rest. This is a tricky number to have on your turn.`},
  {pile:gap+2,text:`With ${gap+2}, take two. That leaves ${gap} for your rival. Count it out on the practice board.`},
  {pile:gap*2,text:`${gap*2} is tricky again. Whatever your rival takes, take enough to make ${gap} together. Leave multiples of ${gap}. ${r.maxTake===2?'The old multiples-of-four plan does not work when you can only take one or two.':'That is why the pattern works, not just a list to remember.'}`}
 ];
 return {model:'seed-pile-v1',...r,frames,childWin:'You win this one!',brambleWin:'Bramble wins this one.'};
}
