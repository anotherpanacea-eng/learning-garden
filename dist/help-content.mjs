import {frenchHelpers} from './french-content.mjs';
import {parisLibraryHelpers} from './paris-library.mjs';
import {parisHelpers} from './paris-content.mjs';
// Smaller, authored examples. These support the waiting task; they never score it.
export const helpers={
 'creature-trail':{id:'pond-sign',title:'Where does “there” point?',lesson:'A place word can point back to a place already named. Read the two parts together.',passage:'Walk to the pond. Wait there.',model:{type:'text',segments:['Walk to the pond.','Wait there.'],focus:0,clue:'“There” points back to the pond.'},kind:'choice',prompt:'Where does this sign ask us to wait?',choices:['At the pond','At the gate'],answer:0,explanation:'The pond is the place named before “there”. Now look for the place in your original sign.'},
 'message-note':{id:'red-bag',title:'What, and where?',lesson:'An instruction can tell us both what to bring and where to go. We can find one part at a time.',passage:'Bring the red bag to the gate.',model:{type:'text',segments:['Bring the red bag','to the gate.'],focus:0,clue:'The red bag is what to bring. The gate is where to go.'},kind:'choice',prompt:'What should someone bring?',choices:['The gate','The red bag'],answer:1,explanation:'“Bring the red bag” names the object. Try looking just after “bring” in the waiting note.'},
 'creature-observe':{id:'glow-pebbles',title:'What did we actually see?',lesson:'An observation tells what happened in the example. It does not tell what must always happen.',model:{type:'compare',labels:['First visit: glowing pebbles','Second visit: glowing pebbles'],counts:[2,3]},kind:'choice',prompt:'Which sentence fits these two visits?',choices:['There were more glowing pebbles on the second visit','There will always be three glowing pebbles'],answer:0,explanation:'We saw 2, then 3. That is more on the second visit. These two visits cannot tell us what will always happen.'},
 'shelter-test':{id:'paper-trial',title:'Compare this one trial',lesson:'Compare the results we have. Keep the conclusion about this trial.',model:{type:'compare',labels:['Paper A: wet marks','Paper B: wet marks'],counts:[4,1]},kind:'choice',prompt:'What do these results show?',choices:['Paper B can never get wet','Paper B had fewer wet marks in this trial'],answer:1,explanation:'1 is fewer than 4. That describes this trial, without claiming what will happen every time.'},
 'message-markers':{id:'two-rows',title:'One equal row at a time',lesson:'Each row has the same number. Count a row, then add another equal row.',model:{type:'array',rows:2,cols:3},kind:'number',prompt:'How many counters are in these 2 rows of 3?',answer:6,explanation:'3 + 3 = 6, so 2 × 3 = 6. Back at the stones, use the number of rows and the number in each row there.',facts:[[2,3]]},
 'shelter-ribbon':{id:'four-spaces',title:'Count spaces, not marks',lesson:'A length is the distance between two ends. Each space on this ruler is one centimetre.',model:{type:'ruler',start:1,end:5,max:6},kind:'number',prompt:'How many centimetres from 1 to 5?',answer:4,explanation:'From 1 to 2 is one space. Then 2 to 3, 3 to 4, and 4 to 5: four spaces. 5 − 1 = 4.'},
 'cafe-substitute':{id:'soft-round',title:'Different name, same wishes',lesson:'In this pretend café, a guest can tell us which properties matter. Check each wish, rather than the dish’s funny name.',model:{type:'menu',wanted:['soft','round'],items:[{name:'Cloud cushions',properties:['soft','round']},{name:'Zigzag crackers',properties:['crunchy','pointy']},{name:'Moon pillows',properties:['soft','round']}]},kind:'choice',prompt:'Which pretend dish fits both soft and round? Either fitting dish works.',choices:['Cloud cushions','Zigzag crackers','Moon pillows'],answer:0,answers:[0,2],explanation:'Both cloud cushions and moon pillows fit both wishes. Zigzag crackers fit neither. Your waiting guest has a different pair of wishes.'},
 'cafe-portions':{id:'two-guests',title:'A little order first',lesson:'Give each guest an equal group. Then count all the groups together.',model:{type:'array',rows:2,cols:2},kind:'number',prompt:'2 pretend guests want 2 star puffs each. How many puffs?',answer:4,explanation:'2 + 2 = 4. Two groups of two make four. Return to your order and check how many guests and portions it has.',facts:[[2,2]]},
 'cafe-shortfall':{id:'five-three',title:'What is missing?',lesson:'Compare how many we need with how many we have. Count the gap.',model:{type:'compare',labels:['Puffs needed','Puffs in the cupboard'],counts:[5,3]},kind:'number',prompt:'We need 5 pretend puffs and have 3. How many more?',answer:2,explanation:'3 and 2 more make 5, so 5 − 3 = 2. Use the same idea with the numbers in the waiting order.'}
};
Object.assign(helpers,parisHelpers);
export const acceptsAnswer=(q,value)=>(q.answers||[q.answer]).includes(value);
export function helperLimit(h){const m=h.model;return m.type==='array'?m.rows:m.type==='ruler'?m.end-m.start:m.type==='text'?m.segments.length:m.type==='menu'?m.items.length:m.labels.length;}
export function cleanHelper(d,nodeId){
 const h=helpers[nodeId];if(!h)return;
 if(d.helper||d.helpUsed)d.helpUsed=true;
 const x=d.helper;if(!x||typeof x!=='object'||x.exampleId!==h.id){delete d.helper;return;}
 x.open=x.open===true;x.attempts=Array.isArray(x.attempts)?x.attempts.filter(v=>Number.isInteger(v)&&v>=0&&(h.kind!=='choice'||v<h.choices.length)):[];
 x.input=typeof x.input==='string'?x.input:'';x.choice=Number.isInteger(x.choice)&&x.choice>=0&&x.choice<(h.choices?.length||0)?x.choice:null;
 x.modelUsed=x.modelUsed===true||x.steps>0||x.spotlight!==null&&x.spotlight!==undefined;x.revealed=x.revealed===true;x.steps=Number.isInteger(x.steps)?Math.max(0,Math.min(helperLimit(h),x.steps)):0;
 x.spotlight=Number.isInteger(x.spotlight)&&x.spotlight>=0&&x.spotlight<helperLimit(h)?x.spotlight:null;
}

Object.assign(helpers,parisLibraryHelpers);

Object.assign(helpers,frenchHelpers);
