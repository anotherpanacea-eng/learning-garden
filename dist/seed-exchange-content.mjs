// Original fictional teaching. Spec316 records design references; no upstream lesson text copied.
export const seedFamilies = Object.freeze(['apples','reed','nursery']);
const freeze = x => {if(x && typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const seedCopy = freeze({
 title:'The seed exchange table',
 invitation:'The orchard keeper needs a clear card for the courier. Willowbank and Vadoalto are exchanging goods and young plants. Build a trade or share the seedlings, then keep a note for the journey.',
 notice:'A made-up exchange. The pictures and numbers are a model, not real stock or a measured harvest.',
 grownup:'These are supported constructions with visible quantity readouts. Optional help is recorded separately. A fitting model does not establish independent calculation, reading, writing or a level. Original courier notes are human-read. Local suggestions use the latest retained supported construction for this job, including retries and help. All choices stay open.',
 families:{apples:'Apples for reed',reed:'Reed for apples',nursery:'Share the seedlings'},
 note:'What should the courier know? A person can read your note; the game does not mark it. Your words stay as you wrote them when the model changes.',
});
export function seedQuantity(n,unit){const words={baskets:['basket','baskets'],bundles:['bundle','bundles'],seedlings:['seedling','seedlings'],groups:['group','groups'],parts:['part','parts']};return `${n} ${words[unit]?.[n===1?0:1]||unit}`;}
function model(family,size,serial,example=false){
 const nursery=family==='nursery',remainder=example||nursery?0:(serial-1)%(family==='apples'?3:2);
 return {family,size,basketRate:nursery?null:3,reedRate:nursery?null:2,parts:nursery?[5,3]:null,
  givenSide:nursery?'seedlings':family==='apples'?'baskets':'bundles',stock:nursery?null:(family==='apples'?3:2)*size+remainder,total:nursery?8*size:null};
}
function exampleSteps(m){
 if(m.family==='nursery')return [`There are ${seedQuantity(m.total,'seedlings')} and ${seedQuantity(m.parts[0]+m.parts[1],'parts')} altogether.`,
  `Put ${seedQuantity(m.size,'seedlings')} in every equal part.`,
  `Vadoalto gets ${m.parts[0]*m.size}; Willowbank gets ${m.parts[1]*m.size}. The two shares add to ${m.total}.`];
 const apples=m.family==='apples',cost=apples?m.basketRate:m.reedRate,gain=apples?m.reedRate:m.basketRate,send=apples?'baskets':'bundles',receive=apples?'bundles':'baskets';
 return [`With ${seedQuantity(m.stock,send)}, make ${seedQuantity(m.size,'groups')}.`,
  `Send ${seedQuantity(cost*m.size,send)} and bring back ${seedQuantity(gain*m.size,receive)}.`,
  `${seedQuantity(m.stock-cost*m.size,send)} stay home.`];
}
export function makeSeedSource(serial,{family='apples',size=1}={}){
 if(!Number.isSafeInteger(serial)||serial<1||serial>=999999999||!seedFamilies.includes(family)||!Number.isInteger(size)||size<1||size>12)return null;
 const m=model(family,size,serial),example=model(family,size%12+1,serial,true),nursery=family==='nursery',apples=family==='apples';
 const send=apples?'baskets':'bundles',receive=apples?'bundles':'baskets',cost=apples?m.basketRate:m.reedRate,gain=apples?m.reedRate:m.basketRate;
 return freeze({...m,format:1,id:`exchange-card-${serial}`,title:seedCopy.families[family],notice:seedCopy.notice,
  labels:{send:apples?'Baskets to send':'Bundles to send',receive:apples?'Bundles coming back':'Baskets coming back',left:apples?'Baskets staying home':'Bundles staying home',shortage:nursery?'Seedlings still needed':'Goods still needed',towns:['Vadoalto','Willowbank'],seedLeft:'Seedlings still to share'},
  prompt:nursery?`The nursery has ${seedQuantity(m.total,'seedlings')}. Vadoalto gets ${m.parts[0]} equal parts and Willowbank gets ${m.parts[1]} equal parts. Put the same number in every part. How many seedlings go to each town?`:
   `You have ${seedQuantity(m.stock,send)} of ${apples?'apples':'reed'}. Use as many whole trade groups as you can. How many ${receive} of ${apples?'reed':'apples'} come back? Keep any extra ${send} at home.`,
  rule:nursery?`${m.parts[0]} parts for Vadoalto and ${m.parts[1]} parts for Willowbank: ${m.parts[0]+m.parts[1]} equal parts altogether`:
   `${seedQuantity(cost,send)} of ${apples?'apples':'reed'} for ${seedQuantity(gain,receive)} of ${apples?'reed':'apples'}${apples?'':' — the same agreement, the other way round'}`,
  hint:nursery?`Count all the equal parts: ${m.parts[0]} plus ${m.parts[1]}. Share the total across all ${m.parts[0]+m.parts[1]} parts, not across just one town’s parts.`:
   `Each whole group needs ${seedQuantity(cost,send)}. Can you add another whole group with the ${send} still at home?`,
  example:{...example,steps:exampleSteps(example)},
  feedback:{match:nursery?`All ${seedQuantity(m.total,'seedlings')} are shared. Vadoalto gets ${m.parts[0]*size} and Willowbank gets ${m.parts[1]*size}, with ${size} in every equal part.`:
    `These whole groups fit the card. Send ${seedQuantity(cost*size,send)}, bring back ${seedQuantity(gain*size,receive)}, and leave ${seedQuantity(m.stock-cost*size,send)} at home.`,
   few:nursery?'Some seedlings still need a place. Add one to every equal part and compare the total.':`You can make another whole group. Check the ${send} still at home.`,
   many:nursery?'This plan needs more seedlings than the nursery has. Take one from every equal part and compare the total.':`These groups need more ${send} than this card has. Lift a group and look again.`}
 });
}
