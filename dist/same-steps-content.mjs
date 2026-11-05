// Original finite number models, reviewed in spec385. Rules are labels, never executable input.
export const stepCases=[
 {id:'rise',title:'Steady rise'},
 {id:'fall',title:'Steady fall'},
 {id:'flat',title:'Staying level'},
 {id:'square',title:'Square the input'},
 {id:'double',title:'Double again'},
 {id:'skip',title:'A row is missing'}
];
const models={
 rise:{rule:'y = 2 + 3x',rows:[[0,2],[1,5],[2,8],[3,11],[4,14]],explanation:'Each 1 across changes y by 3. The written rule is linear, even though its first output is 2.'},
 fall:{rule:'y = 6 − 2x',rows:[[0,6],[1,4],[2,2],[3,0],[4,-2]],explanation:'Each 1 across changes y by −2. A falling line can have a constant rate. Negative change is not changing rate.'},
 flat:{rule:'y = 5',rows:[[0,5],[1,5],[2,5],[3,5],[4,5]],explanation:'Each 1 across changes y by 0. Zero is a constant rate; a horizontal line is still straight.'},
 square:{rule:'y = x × x',rows:[[0,0],[1,1],[2,4],[3,9],[4,16]],explanation:'Equal input steps give different output changes. These dots do not all lie on one straight line. Squaring is not a linear rule. This is a few selected rows, not the whole graph.'},
 double:{rule:'Start at 1; double for each next whole input',rows:[[0,1],[1,2],[2,4],[3,8],[4,16]],explanation:'Doubling repeats a multiplier, not an added amount. Equal input steps have different output changes. These selected dots do not all lie on one straight line.'},
 skip:{rule:'y = 2x + 1',rows:[[0,1],[1,3],[3,7],[4,9]],explanation:'The output changes 2,4,2 look different, but the input changes 1,2,1 also differ. Divide each output change by its input change: the rate is 2 in every listed interval. The written rule is linear.'}
};
const teaching=[
 'Pick two steps between neighboring rows. Build the across change and the up/down change. Compare when you want to.',
 'An input change is the end x minus the start x. An output change is the end y minus the start y.',
 'Between two rows, divide the output change by the input change to find the average change per 1 across. A linear rule keeps that rate the same.',
 'Only compare raw output changes when the input steps are equal. Read the axis labels: a grid square may stand for more than 1.',
 'A few dots can show that the listed rows do not fit one straight line. Dots that fit a line do not prove every unseen value follows it. Here the written rules name the models.'
];
export function makeStepSource(caseId='rise'){
 const c=stepCases.find(c=>c.id===caseId);if(!c)return null;
 const m=models[c.id];
 return {v:1,id:`same-steps-${c.id}`,title:c.title,
  story:"Dot is comparing made-up number rules for the library's graph display. What changes between the rows?",
  rule:m.rule,rows:m.rows.map(([x,y])=>({x,y})),axes:{xMin:0,xMax:4,xStep:1,yMin:-4,yMax:16,yStep:2},
  teaching:[...teaching],explanation:m.explanation,
  example:{start:{x:1,y:4},end:{x:3,y:14},words:['2 across and 10 up.','10 ÷ 2 = 5 per 1 across.','This is a different step from every case interval. The small example has axes derived from its two points and zero, padded by 1 at each end; it is not drawn on the current case’s graph.']}};
}
export const stepCopy=Object.freeze({
 label:'Same steps?',back:'Back to equality',caseLabel:'Choose a rule',working:'Working draft',drafts:'Working drafts',fresh:'Start a fresh draft',shelf:'Kept steps',copy:'Work on a copy',earlier:'Earlier',later:'Later',
 stepA:'Step A',stepB:'Step B',across:'Across change',upDown:'Up/down change',increase:'Increase by 1',decrease:'Decrease by 1',compare:'Compare steps',keep:'Keep these steps',example:'A separate example',teaching:'How the steps work',
 absent:'No step built here yet.',repeated:'A and B name the same interval. Choose another interval if you want to compare different steps.',
 zeroAcross:'A per 1-across rate needs a nonzero across change. Your construction can still be kept.',outside:'Your step ends outside this graph window. Its coordinates are still shown and kept.',
 yours:'Your step',actual:'Between these rows',fit:'Your step reaches the next row.',sameRateVector:'Your step has the same rate but does not reach the next row. Compare both changes.',different:'Your step is different from the change between these rows. You can change it or keep this construction.',
 sameRates:'The rates in these two selected intervals are the same.',differentRates:'The rates in these two selected intervals are different.',
 idea:'Your current idea about',ideaUnchanged:'Your idea is unchanged. You can compare these steps or revise it.',sameRateChoice:'Same rate',differentRatesChoice:'Different rates',notSure:'Not sure yet',
 graphNote:'Dots show the listed rows. Lines between unlisted values are not drawn.',bound:'This change has reached the limit of this drawing tool.',
 readOnly:'These steps are kept unchanged. Work on a copy to change them.',kept:'Steps kept. If saving is off, download Notes before leaving.',
 refused:'These steps could not be kept safely. Your working draft and earlier notes are unchanged. Download Notes or keep exploring.',
 unreadable:'This earlier format stays unchanged in Notes. Other readable steps remain open.',sessionNotice:'Keep a version to include these steps in Notes. Unkept drafts last only for this session.',
 grownup:'These are supplied number models and optional construction/reference records. They do not assess independent graphing, a completed topic, or an unknown function outside its displayed rows. Reference and example requests remain separate from the learner’s current idea. Discussion and original explanations are human-read.'
});
