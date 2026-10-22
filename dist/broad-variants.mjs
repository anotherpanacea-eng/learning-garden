import {seededRandom} from './random.mjs';
const P=(type,...names)=>(...values)=>Object.fromEntries([['type',type],...names.map((n,i)=>[n,values[i]])]);
const bundle=P('bundle','hundreds','tens','ones'),value=P('value','hundreds','tens','ones'),tens=P('tens','hundreds','tens','ones','add');
const add=P('add','a','b'),subtract=P('subtract','a','b'),group=P('group','rows','cols'),share=P('share','rows','cols'),packs=P('packs','rows','cols','extra','sign');
const part=P('part','parts','shaded','size'),fractionName=P('fractionName','parts'),sequence=P('sequence','start','step','shown','n');
const sym=P('symmetry','shape'),corners=P('corners','shape'),ribbon=P('ribbon','start','length'),perimeter=P('perimeter','length','width'),area=P('area','rows','cols'),missingSide=P('missingSide','length','width'),missing=P('missing','known','total'),story=P('story','start','first','second','sign'),claim=P('claim','rows','cols'),double=P('double','rows','cols');
const authored={
 'number-foundation':bundle(0,3,4),'number-anchor':value(4,6,2),'number-anchor-alt':value(7,3,5),'number-stretch':tens(3,8,7,2),'number-support':bundle(0,2,7),'number-explore':value(5,8,3),'number-stretch-activity':tens(6,9,4,3),
 'operations-foundation':add(8,5),'operations-anchor':group(4,6),'operations-anchor-alt':share(4,7),'operations-stretch':packs(6,8,5,1),'operations-support':subtract(17,8),'operations-explore':share(5,7),'operations-stretch-activity':packs(7,6,9,-1),
 'fractions-foundation':fractionName(2),'fractions-anchor':part(4,1,5),'fractions-anchor-alt':part(3,1,6),'fractions-stretch':part(4,3,6),'fractions-support':fractionName(4),'fractions-explore':part(4,1,7),'fractions-stretch-activity':part(3,2,7),
 'patterns-foundation':sequence(2,2,3,4),'patterns-anchor':sequence(4,4,4,5),'patterns-anchor-alt':sequence(8,8,3,4),'patterns-stretch':sequence(3,5,3,5),'patterns-support':sequence(10,2,3,4),'patterns-explore':sequence(20,4,3,4),'patterns-stretch-activity':sequence(2,6,3,5),
 'geometry-foundation':{type:'shapeName',shape:'triangle'},'geometry-anchor':sym('square'),'geometry-anchor-alt':sym('rectangle'),'geometry-stretch':sym('hexagon'),'geometry-support':corners('triangle'),'geometry-explore':sym('rectangle'),'geometry-stretch-activity':{type:'turn',turns:3,direction:1},
 'measurement-foundation':ribbon(0,6),'measurement-anchor':ribbon(3,11),'measurement-anchor-alt':ribbon(5,12),'measurement-stretch':perimeter(5,3),'measurement-support':ribbon(2,7),'measurement-explore':area(4,5),'measurement-stretch-activity':missingSide(7,4),
 'reasoning-foundation':missing(6,10),'reasoning-anchor':story(18,7,4,-1),'reasoning-anchor-alt':story(16,6,9,1),'reasoning-stretch':claim(3,4),'reasoning-support':missing(7,12),'reasoning-explore':story(23,8,6,-1),'reasoning-stretch-activity':double(2,4)
};
const shapeNames={triangle:'equilateral triangle',square:'square',rectangle:'long rectangle',hexagon:'regular hexagon'};
const shapeSides={triangle:3,square:4,rectangle:4,hexagon:6},symmetries={triangle:3,square:4,rectangle:2,hexagon:6};
const fractionNames={2:'half',3:'third',4:'quarter',5:'fifth'};
const numberWords=['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
const clone=x=>JSON.parse(JSON.stringify(x));
export function authoredBroadParams(q){return clone(authored[q.id]);}
function draw(p,r){
 switch(p.type){
 case 'bundle':return bundle(0,r.int(1,9),r.int(0,9));
 case 'value':{const ds=r.shuffle([1,2,3,4,5,6,7,8,9]);return value(...ds.slice(0,3));}
 case 'tens':{const h=r.int(1,7),t=r.int(0,9),o=r.int(0,9),a=r.int(1,4);return {...tens(h,t,o,a),regroup:t+a>=10};}
 case 'add':{const a=r.int(6,9);return add(a,r.int(11-a,9));}
 case 'subtract':{const a=r.int(11,18);return subtract(a,r.int(a-9,9));}
 case 'group':case 'share':return {type:p.type,rows:r.int(2,9),cols:r.int(2,9)};
 case 'packs':{const rows=r.int(2,9),cols=r.int(2,9);return packs(rows,cols,r.int(1,Math.min(9,rows*cols-1)),p.sign);}
 case 'fractionName':return fractionName(r.int(2,5));
 case 'part':{const d=r.int(p.shaded===1?2:3,5);return part(d,p.shaded===1?1:r.int(2,d-1),r.int(2,9));}
 case 'sequence':{const start=r.int(0,12),step=r.int(2,9),n=p.n>p.shown+1?r.int(5,7):r.int(4,7);return sequence(start,step,Math.min(3,n-1),n);}
 case 'shapeName':case 'symmetry':case 'corners':return {type:p.type,shape:r.pick(Object.keys(shapeNames))};
 case 'turn':return {type:'turn',turns:r.int(1,3),direction:r.pick([-1,1])};
 case 'ribbon':{const start=r.int(0,8);return ribbon(start,r.int(3,Math.min(12,20-start)));}
 case 'perimeter':case 'missingSide':return {type:p.type,length:r.int(2,9),width:r.int(2,9)};
 case 'area':return area(r.int(2,9),r.int(2,9));
 case 'missing':{const total=r.int(5,20);return missing(r.int(1,total-1),total);}
 case 'story':{const start=r.int(10,30),first=r.int(1,9),second=r.int(1,Math.min(9,start-first));return story(start,first,second,p.sign);}
 case 'claim':case 'double':return {type:p.type,rows:r.int(2,8),cols:r.int(2,8)};
 }
}
export function validBroadParams(p){
 if(!p||typeof p!=='object'||Array.isArray(p))return false;
 const between=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
 const factors=()=>between(p.rows,2,9)&&between(p.cols,2,9);
 switch(p.type){
 case 'bundle':return p.hundreds===0&&between(p.tens,1,9)&&between(p.ones,0,9);
 case 'value':return [p.hundreds,p.tens,p.ones].every(v=>between(v,1,9))&&new Set([p.hundreds,p.tens,p.ones]).size===3;
 case 'tens':return between(p.hundreds,1,7)&&between(p.tens,0,9)&&between(p.ones,0,9)&&between(p.add,1,4)&&p.regroup===(p.tens+p.add>=10);
 case 'add':return between(p.a,6,9)&&between(p.b,2,9)&&p.a+p.b>10&&p.a+p.b<=20;
 case 'subtract':return between(p.a,11,18)&&between(p.b,2,9)&&p.a-p.b>=0&&p.a-p.b<10;
 case 'group':case 'share':case 'area':return factors();
 case 'packs':return factors()&&between(p.extra,1,9)&&[-1,1].includes(p.sign)&&p.rows*p.cols+p.sign*p.extra>=0&&p.rows*p.cols+p.sign*p.extra<100;
 case 'fractionName':return between(p.parts,2,5);
 case 'part':return between(p.parts,2,5)&&between(p.shaded,1,p.parts-1)&&between(p.size,2,9);
 case 'sequence':return between(p.start,0,12)&&between(p.step,2,9)&&between(p.n,4,7)&&between(p.shown,2,p.n-1);
 case 'shapeName':case 'symmetry':case 'corners':return Object.hasOwn(shapeNames,p.shape);
 case 'turn':return between(p.turns,1,3)&&[-1,1].includes(p.direction);
 case 'ribbon':return between(p.start,0,8)&&between(p.length,3,12)&&p.start+p.length<=20;
 case 'perimeter':case 'missingSide':return between(p.length,2,9)&&between(p.width,2,9);
 case 'missing':return between(p.total,5,20)&&between(p.known,1,p.total-1);
 case 'story':return between(p.start,10,30)&&between(p.first,1,9)&&between(p.second,1,9)&&[-1,1].includes(p.sign)&&p.start+p.sign*p.first>=0&&p.start+p.sign*p.first-p.sign*p.second>=0&&p.start+p.sign*p.first-p.sign*p.second<50;
 case 'claim':case 'double':return between(p.rows,2,8)&&between(p.cols,2,8);
 default:return false;
 }
}
function choiceFields(options,correct,r){const choices=r?r.shuffle(options):options;return {choices,answer:choices.indexOf(correct)};}
function fields(p,r){
 const base={params:p,fact:null},v=p.hundreds*100+p.tens*10+p.ones;
 switch(p.type){
 case 'bundle':return {...base,prompt:`Pip packs ${p.tens} tens and ${p.ones} ones. What number does that make?`,answer:v,model:{type:'place',hundreds:p.hundreds,tens:p.tens,ones:p.ones},hint:'Count the value of the bundles, then the loose ones.',solution:`${p.tens} tens are ${p.tens*10}. ${p.tens*10} + ${p.ones} = ${v}.`,talk:'What is each digit counting?'};
 case 'value':return {...base,prompt:`Dot writes ${v} on a seed box. What is the value of the digit ${p.tens}?`,answer:p.tens*10,model:{type:'place',hundreds:p.hundreds,tens:p.tens,ones:p.ones},hint:`The digit ${p.tens} sits on the tens shelf. What is a ten worth?`,solution:`${p.tens} tens have value ${p.tens*10}.`,talk:'What would change if two digits traded places?'};
 case 'tens':return {...base,prompt:`Pip starts with ${v} seeds and adds ${p.add} tens of seeds. How many seeds are there now?`,answer:v+p.add*10,model:{type:'place',hundreds:p.hundreds,tens:p.tens,ones:p.ones},hint:'Add bundles of ten. Trade ten tens for a hundred if needed.',solution:`${v} + ${p.add*10} = ${v+p.add*10}. The ones digit stays the same.`,talk:'Did the tens need a trade for a hundred?'};
 case 'add':case 'subtract':{const plus=p.type==='add',answer=plus?p.a+p.b:p.a-p.b;return {...base,prompt:plus?`Pip has ${p.a} berries. Dot brings ${p.b} more. How many berries altogether?`:`Pip has ${p.a} muffins and gives away ${p.b}. How many remain?`,answer,model:{type:'counters',count:p.a},hint:'Use ten as a stopping place on your way.',solution:`${p.a} ${plus?'+':'−'} ${p.b} = ${answer}.`,talk:'How could you check by undoing the change?'};}
 case 'group':case 'share':{const sharing=p.type==='share',total=p.rows*p.cols;return {...base,prompt:sharing?`Dot shares ${total} berries equally among ${p.rows} plates. How many go on each plate?`:`Pip sets out ${p.rows} rows with ${p.cols} cups in each. How many cups altogether?`,answer:sharing?p.cols:total,model:{type:'array',rows:p.rows,cols:p.cols},hint:sharing?`Find the missing factor: ${p.rows} × ? = ${total}.`:'Each row has the same number. Count every row.',solution:sharing?`${total} ÷ ${p.rows} = ${p.cols}.`:`${p.rows} × ${p.cols} = ${total}.`,fact:[p.rows,p.cols],talk:'How does sharing connect to equal groups?'};}
 case 'packs':{const total=p.rows*p.cols,answer=total+p.sign*p.extra;return {...base,prompt:`Pip packs ${p.rows} bags with ${p.cols} crackers in each. ${p.sign===1?`Dot adds ${p.extra} loose crackers`:`Helpers eat ${p.extra} crackers`}. How many crackers ${p.sign===1?'altogether':'remain'}?`,answer,model:{type:'array',rows:p.rows,cols:p.cols},hint:'Find all the bags first, then account for the loose or eaten crackers.',solution:`${p.rows} × ${p.cols} = ${total}. Then ${total} ${p.sign===1?'+':'−'} ${p.extra} = ${answer}.`,fact:[p.rows,p.cols],talk:'What does each step count?'};}
 case 'fractionName':{const correct=`One ${fractionNames[p.parts]}`;return {...base,kind:'choice',prompt:`A whole mat is split into ${p.parts} equal parts. What do we call one part?`,...choiceFields(Object.values(fractionNames).map(n=>`One ${n}`),correct,r),model:{type:'fraction',parts:p.parts,shaded:1},hint:'The name comes from how many equal parts make the whole.',solution:`One of ${p.parts} equal parts is ${correct.toLowerCase()}.`,talk:'Why must the parts be equal?'};}
 case 'part':{const total=p.parts*p.size,answer=p.shaded*p.size;return {...base,prompt:`A collection has ${total} seeds. Find ${p.shaded===1?`one ${fractionNames[p.parts]}`:`${numberWords[p.shaded]||p.shaded} ${p.parts===2?'halves':fractionNames[p.parts]+'s'}`} of the collection. How many seeds is that?`,answer,model:{type:'fraction',parts:p.parts,shaded:p.shaded},hint:'Find one equal share first; then count the chosen shares.',solution:`${total} ÷ ${p.parts} = ${p.size} in one share. ${p.shaded} × ${p.size} = ${answer}.`,fact:p.shaded===1?[p.parts,p.size]:null,talk:'How could the shares left over help you check?'};}
 case 'sequence':{const values=Array.from({length:p.shown},(_,i)=>p.start+i*p.step),answer=p.start+(p.n-1)*p.step;return {...base,prompt:`Start at ${p.start} and add ${p.step} each time: ${values.join(', ')}. Stone 1 says ${p.start}. What number is on stone ${p.n}?`,answer,model:{type:'pattern',values,step:p.step},hint:'The first stone is there before any jumps. Count the jumps to that stone.',solution:`Stone ${p.n} needs ${p.n-1} jumps: ${p.start} + ${p.n-1} × ${p.step} = ${answer}.`,talk:'Why are there fewer jumps than stones?'};}
 case 'shapeName':{const correct=shapeNames[p.shape];return {...base,kind:'choice',prompt:'Which name matches this flat shape?',...choiceFields(Object.values(shapeNames),correct,r),model:{type:'shape',shape:p.shape,turns:0},hint:'Count its straight sides and notice whether they are equal.',solution:`This is a ${correct}. It has ${shapeSides[p.shape]} sides.`,talk:'Would turning it change its name?'};}
 case 'corners':case 'symmetry':{const isCorners=p.type==='corners',answer=isCorners?shapeSides[p.shape]:symmetries[p.shape];return {...base,prompt:isCorners?`How many corners does ${/^[aeiou]/.test(shapeNames[p.shape])?'an':'a'} ${shapeNames[p.shape]} have?`:`How many lines of symmetry does ${/^[aeiou]/.test(shapeNames[p.shape])?'an':'a'} ${shapeNames[p.shape]} have? A fold must match the whole shape.`,answer,model:{type:'shape',shape:p.shape,turns:0},hint:isCorners?'Trace each edge until you return to the start. Count where edges meet.':'Test folds through the middle, including diagonals. Do both halves match?',solution:isCorners?`The ${shapeNames[p.shape]} has ${answer} corners.`:`The ${shapeNames[p.shape]} has ${answer} lines of symmetry.`,talk:'Show why each feature you counted belongs.'};}
 case 'turn':{const index=((p.turns*p.direction)%4+4)%4,correct=['North','East','South','West'][index];return {...base,kind:'choice',prompt:`Pip faces north and makes ${p.turns} quarter-turn${p.turns===1?'':'s'} ${p.direction===1?'clockwise':'counterclockwise'}. Which direction does Pip face?`,...choiceFields(['North','East','South','West'],correct,r),model:{type:'compass',turns:0},hint:'Begin at north. Follow each quarter-turn in the named direction.',solution:`After ${p.turns} quarter-turn${p.turns===1?'':'s'} ${p.direction===1?'clockwise':'counterclockwise'}, Pip faces ${correct.toLowerCase()}.`,talk:'How could turns in the other direction reach the same place?'};}
 case 'ribbon':return {...base,prompt:`A ribbon starts at ${p.start} cm and ends at ${p.start+p.length} cm. How long is it, in cm?`,answer:p.length,model:{type:'ruler',start:p.start,end:p.start+p.length,max:20},hint:'Length counts the spaces from the start mark to the end mark.',solution:`${p.start+p.length} − ${p.start} = ${p.length} cm.`,talk:'Would sliding the ribbon change its length?'};
 case 'perimeter':case 'missingSide':{const perimeter=2*(p.length+p.width),isMissing=p.type==='missingSide';return {...base,prompt:isMissing?`A rectangle has perimeter ${perimeter} m and length ${p.length} m. What is its width, in meters?`:`A rectangular bed is ${p.length} m long and ${p.width} m wide. What is its perimeter, in meters?`,answer:isMissing?p.width:perimeter,model:{type:'array',rows:p.width,cols:p.length},hint:isMissing?'Remove both lengths. The remaining fence makes two equal widths.':'Trace around all four sides. Count each length and width twice.',solution:isMissing?`${perimeter} − ${p.length} − ${p.length} = ${2*p.width}. Divide by 2: the width is ${p.width} m.`:`${p.length} + ${p.width} + ${p.length} + ${p.width} = ${perimeter} m.`,talk:'How does distance around differ from space inside?'};}
 case 'area':return {...base,prompt:`A mat has ${p.rows} rows of ${p.cols} tiles, with no gaps or overlaps. Each tile covers one square centimeter. What is the area, in square cm?`,answer:p.rows*p.cols,model:{type:'array',rows:p.rows,cols:p.cols},fact:[p.rows,p.cols],hint:'Count all the equal rows of square units.',solution:`${p.rows} × ${p.cols} = ${p.rows*p.cols} square cm.`,talk:'Why are square units useful for covering space?'};
 case 'missing':return {...base,prompt:`Which number makes ${p.known} + __ = ${p.total} true?`,say:`What number added to ${p.known} makes ${p.total}?`,answer:p.total-p.known,model:{type:'counters',count:p.known},hint:'Find the part that joins the known part to make the whole.',solution:`${p.total} − ${p.known} = ${p.total-p.known}.`,talk:'Put your answer back into the equation to check.'};
 case 'story':{const mid=p.start+p.sign*p.first,answer=mid-p.sign*p.second;return {...base,prompt:`Dot has ${p.start} buttons, ${p.sign===1?'finds':'gives away'} ${p.first}, then ${p.sign===1?'gives away':'finds'} ${p.second}. How many buttons now?`,answer,model:{type:'counters',count:p.start},hint:'Pause after each event. Decide whether that event adds or takes away.',solution:`${p.start} ${p.sign===1?'+':'−'} ${p.first} = ${mid}. Then ${mid} ${p.sign===1?'−':'+'} ${p.second} = ${answer}.`,talk:'Tell what each step means in the story.'};}
 case 'claim':{const old=p.rows*p.cols,answer=p.rows*(p.cols+1),correct=`An extra dot in each row adds ${p.rows}, making ${answer}.`;return {...base,kind:'choice',prompt:`Pip says a ${p.rows}-by-${p.cols} array has ${old} dots, so a ${p.rows}-by-${p.cols+1} array also has ${old}. Which reply checks the claim?`,...choiceFields([`The total stays at ${old} because only the shape changed.`,correct,`One extra dot is added in all, making ${old+1}.`],correct,r),model:{type:'array',rows:p.rows,cols:p.cols},hint:'Each row gains a dot. Account for every row.',solution:`${p.rows} rows gain one dot each: ${old} + ${p.rows} = ${answer}.`,fact:[p.rows,p.cols+1],talk:'Draw both arrays and show the added dots.'};}
 case 'double':{const old=p.rows*p.cols,correct=`Each original row gains a matching row: ${old} more dots, making ${old*2}.`;return {...base,kind:'choice',prompt:`An array has ${p.rows} rows of ${p.cols}. Double the rows and keep ${p.cols} in each. Why does the total double?`,...choiceFields([`Each row gets one more dot: ${p.rows} more dots, making ${old+p.rows}.`,`Only one new row is added: ${p.cols} more dots, making ${old+p.cols}.`,correct],correct,r),model:{type:'array',rows:p.rows,cols:p.cols},hint:'Imagine a whole matching copy of the original rows.',solution:`${p.rows} × ${p.cols} = ${old}. A matching copy adds ${old}, making ${old*2}.`,talk:'What if the number in each row changed too?'};}
 }
}
const lessonByArea={number:'A digit gets its value from its place. Ten ones can trade for a ten; ten tens can trade for a hundred.',operations:'Joining adds, taking away subtracts, and equal groups connect multiplication with sharing.',fractions:'A fraction names equal parts of one whole. Find one share before collecting several shares.',patterns:'A stated rule gives the same jump each time. The first stone is already there before any jumps.',geometry:'A shape keeps its properties when turned. A mirror fold must match every part of both halves.',measurement:'Length counts equal spaces, area counts square units inside, and perimeter follows the outside.',reasoning:'Keep track of each change, then put your answer back into the story or equation to check.'};
function scaffolds(q){
 const p=q.params,m={};const add=(v,label,message)=>{if(Number.isInteger(v)&&v>=0&&v!==q.answer)m[v]={label,message};};
 if(q.kind==='choice'){q.choices.forEach((c,i)=>add(i,'a different explanation','Check the words against the picture or story. Does this choice account for every part?'));}
 else switch(p.type){
 case 'bundle':add(p.tens+p.ones,'counted bundles as ones','A bundle of ten is worth more than one loose seed. What is each bundle worth?');break;
 case 'value':add(p.tens,'the digit itself',`The ${p.tens} is on the tens shelf. How much is each thing on that shelf worth?`);break;
 case 'tens':add(p.hundreds*100+p.tens*10+p.ones+p.add,'added ones instead of tens','Pip added bundles of ten, not single seeds. How much does each bundle add?');break;
 case 'group':case 'area':add(p.rows+p.cols,'added the factors','Each row has several things. Does adding those two numbers count every one inside?');break;
 case 'share':add(p.rows*p.cols,'the whole collection','That is the whole collection. How many go in just one equal group?');break;
 case 'packs':add(p.rows*p.cols,'the first step only','That counts the bags. What happened after the bags were packed?');break;
 case 'part':add(p.parts,'the number of groups','That counts the equal groups. How many seeds belong in the chosen share?');break;
 case 'sequence':add(p.start+p.n*p.step,'one jump too many','The first stone is there before any jumps. To get to that stone, how many jumps do you make?');break;
 case 'symmetry':if(p.shape==='square')add(2,'missed diagonal folds','Try folding from corner to opposite corner, too.');if(p.shape==='rectangle')add(4,'counted the diagonals','Fold along a diagonal. Do all the edges match?');break;
 case 'ribbon':add(p.start+p.length,'the end mark','That is where the ribbon ends. Where did it start?');break;
 case 'perimeter':add(p.length*p.width,'the area','That counts squares inside. The fence goes around the outside.');break;
 case 'missingSide':add(2*p.width,'both widths','That is enough fence for both equal widths. How much belongs to one width?');break;
 case 'missing':add(p.total,'the whole instead of the missing part',`Put that in the space, then add ${p.known}. Is the equation balanced?`);break;
 case 'story':add(p.start+p.sign*p.first,'the first event only','That tracks the first event. What changes in the final event?');break;
 }
 const steps={bundle:['Find the value of the bundles of ten first.','Keep the loose ones separate until the last step.'],value:['Locate the tens place between hundreds and ones.','That digit tells how many bundles of ten sit on the shelf.'],tens:['Build the starting number.','Add the bundles of ten. If you have ten tens, trade them for a hundred.'],add:['Begin with the first collection.','Make a ten if that is helpful, then account for what remains.'],subtract:['Begin with the whole collection.','Take away enough to reach ten, then finish taking away.'],group:['Draw one row.','Make each of the other rows match it.'],share:['Draw one space for each equal group.','Deal the collection fairly, keeping the groups equal.'],packs:['Count the crackers in all the bags.','Then account for the loose or eaten crackers.'],fractionName:['Count how many equal parts make the whole.','Use that number to name one share.'],part:['Divide the whole collection into equal shares.','Count only the selected shares.'],sequence:['Write the first number on stone 1.','Make one fewer jump than the stone number.'],shapeName:['Trace all the straight edges.','Notice which edges and angles match.'],corners:['Choose a starting corner.','Trace the boundary, counting each meeting of two sides once.'],symmetry:['Try a fold through the center.','Check whether every point on one side matches the other.'],turn:['Point north to begin.','Move one quarter-turn at a time in the named direction.'],ribbon:['Locate the start mark.','Count the spaces from there to the end.'],perimeter:['Trace the outside boundary.','Include both copies of each side length.'],missingSide:['Remove the two known lengths from the perimeter.','Share the remaining boundary between the two widths.'],area:['Count the square units in one row.','Count all the equal rows.'],missing:['Show the known part of the whole.','Find the extra part needed to balance the equation.'],story:['Record what remains after the first event.','Decide whether the last event adds or takes away.'],claim:['Draw the original rows.','Add one dot to every row, keeping track of all the new dots.'],double:['Draw the original array.','Put a matching copy of the entire array beside it.']};
 return {misconceptions:m,steps:steps[p.type],childLesson:lessonByArea[q.area]};
}
export function decorateBroad(q){const params=q.params||authoredBroadParams(q);if(params.type==='tens')params.regroup=params.tens+params.add>=10;const result={...q,params};
 const facts=q.fact?[q.fact]:[];
 if(params.type==='claim')facts.push([params.rows,params.cols],[params.rows,params.cols+1]);
 if(params.type==='double')facts.push([params.rows,params.cols],[params.rows*2,params.cols]);
 if(params.type==='part')facts.push([params.parts,params.size],[params.shaded,params.size]);
 return {...result,facts:[...new Map(facts.map(f=>[f.join('x'),f])).values()],...scaffolds(result)};}
export function generatedBroad(q,seed){
 const r=seededRandom(seed),original=authoredBroadParams(q);let p;
 for(let i=0;i<50;i++){const candidate=draw(original,r);if(validBroadParams(candidate)){p=candidate;break;}}
 if(!p)return {...decorateBroad(q),variant:null};
 let result={...q,...fields(p,r),variant:{seed:String(seed),params:clone(p)}};
 // Pip's numerical teaching example stays authored; shapes must remain structurally compatible.
 if(q.lesson&&!['shapeName','corners','symmetry','turn'].includes(p.type))result.model=clone(q.model);
 return decorateBroad(result);
}
export function broadFeedback(q,value){const x=q.misconceptions?.[value];return {message:x?.message||'Let’s take another look. You can get a hint, try a model, or skip it for now.',misconception:x?.label||null};}
