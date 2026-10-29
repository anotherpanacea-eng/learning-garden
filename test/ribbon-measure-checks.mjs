import assert from 'node:assert/strict';
import {ribbonMeasureCases} from '../dist/ribbon-measure-content.mjs';
import {ribbonUnit,createRibbonMeasure,ribbonMeasureModel,splitRibbonMeasure,undoRibbonSplit,layRibbonPiece,liftRibbonPiece,returnRibbonPieces,ribbonLayAdvice,ribbonPieceName,ribbonPieceTally,ribbonReading,ribbonCompletion,ribbonMeasureExample,ribbonLengthName,ribbonGroupName} from '../dist/ribbon-measure-core.mjs';
import {ribbonMeasurePage,resetRibbonMeasures} from '../dist/ribbon-measure-ui.mjs';
let checks=0,states=0;
const eq=(a,b,m)=>{checks++;assert.deepEqual(a,b,m);};
const ok=(a,m)=>{checks++;assert.ok(a,m);};
// Independent counting unit: one twelfth of a group. This oracle does not
// reproduce the production original-length coordinates or fraction reduction.
const inputs=[['unit-quarter',1,1,1,4,48],['three-quarters',3,4,1,4,36],['eighth-group',3,4,3,8,24],['partial-group',1,2,3,4,8],['mixed-groups',5,6,1,3,30],['beyond-one',3,2,3,4,24]];
const qs=[1,2,3,4,6],histories=[[],[2],[3],[2,2],[2,3],[3,2]];
const product=xs=>xs.reduce((a,b)=>a*b,1);
function pathsTo(target){const paths=new Map([[0,[]]]),queue=[0];for(const value of queue)for(const q of qs){const next=value+12/q;if(next<=target&&!paths.has(next)){paths.set(next,[...paths.get(value),q]);queue.push(next);}}return paths;}
eq(ribbonMeasureCases.map(c=>c.id),inputs.map(c=>c[0]));
for(const [id,an,ad,bn,bd,target] of inputs){
 const c=ribbonMeasureCases.find(c=>c.id===id);eq(c.amount,{n:an,d:ad});eq(c.group,{n:bn,d:bd});
 const paths=pathsTo(target);ok(paths.has(target));ok(paths.has(target-1),'a valid mixed exploration can leave a one-twelfth-group gap');
 for(const [covered,path] of paths)for(const cuts of histories){
  states++;const state={caseId:id,cuts:[...cuts],pieces:[...path]},before=structuredClone(state),m=ribbonMeasureModel(state),q=product(cuts);
  ok(m);eq(m.q,q);eq(m.covered*12,covered*m.group);eq(m.gap*12,(target-covered)*m.group);eq(m.amount*ad,an*ribbonUnit);eq(m.group*bd,bn*ribbonUnit);
  eq(m.groupCount.n*12,covered*m.groupCount.d,'group count counts fractions of groups, not pieces');
  eq(m.complete,covered===target);eq(m.unfillableGap,target-covered===1);eq(m.canLay,12/q<=target-covered);eq(m.canUndo,cuts.length>0);
  let point=0;
  for(let i=0;i<path.length;i++){const segment=m.segments[i];eq(segment.q,path[i]);eq(segment.start,point);eq(segment.length*path[i],m.group);point=segment.end;}
  eq(point,m.covered);eq(m.segments.length,path.length);
  const laid=layRibbonPiece(state);
  if(m.canLay){ok(laid);eq(laid.pieces,[...path,q]);eq(laid.cuts,cuts);eq(ribbonMeasureModel(laid).covered*12,(covered+12/q)*m.group);}
  else{eq(laid,null);ok(ribbonLayAdvice(state).length>0,'disabled Lay gets a reason');}
  for(const factor of [2,3]){
   const split=splitRibbonMeasure(state,factor);
   if(q*factor<=6){ok(split);eq(split.pieces,path);eq(split.cuts,[...cuts,factor]);eq(ribbonMeasureModel(split).covered,m.covered,'template cuts never alter laid lengths');eq(undoRibbonSplit(split),state);}
   else eq(split,null);
  }
  const undone=undoRibbonSplit(state);if(cuts.length){ok(undone);eq(undone.pieces,path);eq(undone.cuts,cuts.slice(0,-1));eq(ribbonMeasureModel(undone).covered,m.covered);}else eq(undone,null);
  const lifted=liftRibbonPiece(state);
  if(path.length){ok(lifted);eq(lifted.pieces,path.slice(0,-1));eq(ribbonMeasureModel(lifted).covered*12,(covered-12/path.at(-1))*m.group);}
  else eq(lifted,null);
  const returned=returnRibbonPieces(state);eq(returned.pieces,[]);eq(returned.cuts,cuts);
  if(m.unfillableGap){const text=ribbonLayAdvice(state);ok(text.includes('1/12 of one measuring group'));ok(text.includes('Lift last piece'));ok(!text.includes('Try splitting'),'never promises a finer offered piece for an unfillable gap');ok(m.canLift);const remaining=target-(covered-12/path.at(-1));ok(pathsTo(remaining).has(remaining),'one Lift restores a fillable gap');}
  if(m.complete)ok(ribbonCompletion(state).includes('This measures all of the ribbon'));else eq(ribbonCompletion(state),null);
  eq(state,before,'pure actions never mutate earlier material');
 }
}
eq(states,1020);
// Mixed pieces need their own sizes after both directions of template change.
const mixed={caseId:'partial-group',cuts:[2,3],pieces:[4,4,6]};eq(ribbonMeasureModel(mixed).complete,true);eq(ribbonMeasureModel(mixed).groupCount,{n:2,d:3});eq(ribbonPieceTally(mixed),'2 quarter-group pieces; 1 sixth-group piece');ok(ribbonReading(mixed).includes('2/3 of one measuring group'));ok(!ribbonReading(mixed).includes('2/3 of one length unit'));
eq(ribbonMeasureModel({...mixed,pieces:[3,3]}).complete,true);eq(ribbonMeasureModel({...mixed,pieces:[6,6,6,6]}).complete,true);
const tiny={caseId:'partial-group',cuts:[2,2],pieces:[3,4]};ok(ribbonLayAdvice(tiny).includes('smaller than any piece'));
const undoFirst={caseId:'partial-group',cuts:[2,2],pieces:[2]};ok(ribbonLayAdvice(undoFirst).includes('Undo last split'));eq(ribbonMeasureModel(undoFirst).gap*6,ribbonMeasureModel(undoFirst).group);
const changed=splitRibbonMeasure(undoRibbonSplit(undoFirst),3);eq(ribbonMeasureModel(layRibbonPiece(changed)).complete,true);
let sixths=createRibbonMeasure('unit-quarter');sixths=splitRibbonMeasure(splitRibbonMeasure(sixths,2),3);for(let i=0;i<24;i++)sixths=layRibbonPiece(sixths);eq(ribbonMeasureModel(sixths).complete,true);ok(ribbonReading(sixths).includes('24 sixth-group pieces'));ok(ribbonReading(sixths).includes('4 measuring groups'));eq(layRibbonPiece(sixths),null);
let small=createRibbonMeasure('partial-group');ok(!ribbonReading(small).startsWith('Lay'),'empty nonfitting group has actionable split guidance');small=splitRibbonMeasure(small,3);small=returnRibbonPieces(layRibbonPiece(small));ok(ribbonMeasureModel(small).canLay);ok(ribbonReading(small).startsWith('Lay'),'returned fractional piece remains selectable');
eq(ribbonLengthName(0),'0 length units');eq(ribbonLengthName(144),'1/2 of one length unit');eq(ribbonLengthName(288),'1 length unit');eq(ribbonLengthName(432),'1 1/2 length units');eq(ribbonGroupName(2,3),'2/3 of one measuring group');eq(ribbonGroupName(1,1),'1 measuring group');eq(ribbonGroupName(5,2),'2 1/2 measuring groups (5/2 groups)');ok(!ribbonPieceName(createRibbonMeasure('unit-quarter')).includes('1/1'));
for(let i=0;i<4;i++){const e=ribbonMeasureExample(i);eq(e.index,i);eq(e.displayIndex,i+1);eq(e.amount,144);eq(e.group,96);eq(e.covered,[0,96,96,144][i]);eq(e.q,[1,1,2,2][i]);eq(e.showSixths,i>=2);eq(layRibbonPiece(e),null,'worked example is not a live mutable case');}eq(ribbonMeasureExample(3).groupCount,{n:3,d:2});
for(const bad of [null,{},createRibbonMeasure('missing'),{caseId:'partial-group',cuts:[2,2,2],pieces:[]},{caseId:'partial-group',cuts:[],pieces:[5]},{caseId:'partial-group',cuts:[],pieces:[1]},{caseId:'unit-quarter',cuts:[],pieces:Array(25).fill(6)},{caseId:'unit-quarter',cuts:['2'],pieces:[]}])eq(ribbonMeasureModel(bad),null);
eq(splitRibbonMeasure(createRibbonMeasure('unit-quarter'),4),null);eq(ribbonMeasureExample(-1),null);eq(ribbonMeasureExample(4),null);
const inaccessible=new Proxy(Object.freeze({}),{get(){throw new Error('Notebook read');},set(){throw new Error('Notebook write');}});
resetRibbonMeasures();const html=ribbonMeasurePage(inaccessible,'synthetic-explorer');ok(html.includes('data-rmeasure-root'));ok(html.includes('1/4 of one length unit'));ok(!html.includes('rmeasure-complete'));resetRibbonMeasures();
console.log(`Ribbon Measures: ${checks} checks over ${states} rational material/template states.`);
