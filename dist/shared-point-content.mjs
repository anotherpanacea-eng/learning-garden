// Original finite teaching; Jane and Marble were studied as design references (spec383).
export const sharedPointCases=[
 {id:'up-down',title:'Crossing paths'},
 {id:'level',title:'A level rule'},
 {id:'below',title:'Below the start'},
 {id:'parallel',title:'Same slope, different starts'},
 {id:'together',title:'The same line twice'},
 {id:'low',title:'A low crossing'}
];
const rules={
 'up-down':[[1,1],[-1,3]],
 level:[[2,-1],[0,2]],
 below:[[-1,-1],[1,1]],
 parallel:[[1,2],[1,-1]],
 together:[[-1,1],[-1,1]],
 low:[[0,-2],[2,2]]
};
const teaching=[
 'The first coordinate, x, tells how far across. The second, y, tells how far up or down. In (1, 3), x is 1 and y is 3. The order matters.',
 'A point fits y = mx + b when its chosen y equals the result of mx + b at its chosen x. One rule has infinitely many fitting points. A solution to two rules must fit both at once.',
 'These are number rules over all real x and y, not heights or costs in the town. The picture shows only a window. Our point controls move by halves; that does not limit the mathematical solutions to halves.'
];
const example='Rule A: y = 2x - 2. Rule B: y = -x + 7. Try (1, 0). Rule A gives 2 × 1 - 2 = 0, so the point fits A. Rule B gives -1 + 7 = 6, so the same point does not fit B. Being on the x axis does not make it the shared point. Try (3, 4). A gives 2 × 3 - 2 = 4 and B gives -3 + 7 = 4. The point fits both. The lines have different slopes, so this is their only shared point. The x coordinate alone is not a complete answer: the shared pair is (3, 4).';
export function makeSharedPointSource(caseId='up-down',shift=0){
 const c=sharedPointCases.find(c=>c.id===caseId);
 if(!c||!Number.isInteger(shift)||shift<-1||shift>1)return null;
 const side=['left','center','right'][shift+1],position=['Shift left','Original position','Shift right'][shift+1];
 return {v:1,model:'two-lines-v1',id:`shared-point-${c.id}-${side}`,title:`${c.title} · ${position}`,
  story:'The surveyors have two number rules for a future plan. Mark a point. Does that same point fit both rules?',
  teaching:[...teaching],example,
  lines:rules[c.id].map(([m,b],i)=>({id:i===0?'a':'b',label:i===0?'Rule A':'Rule B',m,b:b-m*shift}))};
}
