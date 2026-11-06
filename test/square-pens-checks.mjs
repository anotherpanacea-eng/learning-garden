// Independent integer geometry checks for original, synthetic paper plans.
import assert from 'node:assert/strict';
import {defaultSquarePensDraft,validSquarePensDraft,changeSquarePensDraft,nextSquarePensInvitation,squarePensModel,squarePensReference,squarePensContrast,squarePensPairs} from '../dist/square-pens-core.mjs';
let n=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);n++;},ok=(x,m)=>{assert.ok(x,m);n++;};
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],sq=(a,b)=>dot(sub(a,b),sub(a,b));
function twiceArea(ps){let sum=0;for(let i=0;i<ps.length;i++){const p=ps[i],q=ps[(i+1)%ps.length];sum+=p[0]*q[1]-q[0]*p[1];}return Math.abs(sum);}
// Exact separating-axis test for convex integer polygons. Touching boundaries are allowed.
function disjointInteriors(p,q){
 for(const poly of [p,q])for(let i=0;i<poly.length;i++){
  const edge=sub(poly[(i+1)%poly.length],poly[i]),axis=[-edge[1],edge[0]],P=p.map(v=>dot(v,axis)),Q=q.map(v=>dot(v,axis));
  if(Math.max(...P)<=Math.min(...Q)||Math.max(...Q)<=Math.min(...P))return true;
 }
 return false;
}
function endpoint(polygons,L,label){
 for(const poly of polygons)for(const [x,y] of poly)ok(Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&x<=L&&y>=0&&y<=L,label+' stays inside the frame');
 for(let i=0;i<polygons.length;i++)for(let j=i+1;j<polygons.length;j++)ok(disjointInteriors(polygons[i],polygons[j]),label+' has no overlapping interiors');
 eq(polygons.reduce((total,p)=>total+twiceArea(p),0),2*L*L,label+' exactly fills the frame');
}
const initial=defaultSquarePensDraft();eq(initial,{a:3,b:4,turn:0,move:0,page:'build',markedSide:null,lengthOpen:false,invitationIndex:0,whyStep:0,compare:false},'initial paper plan');
const whole=[];
for(let a=1;a<=12;a++)for(let b=1;b<=12;b++)for(let turn=0;turn<4;turn++){
 const d={...initial,a,b,turn},m=squarePensModel(d),L=a+b,expectedN=a*a+b*b,label=`${a},${b},turn${turn}`;
 eq([m.a2,m.b2,m.N,m.ab,m.frameArea,m.trianglesArea],[a*a,b*b,expectedN,a*b,L*L,2*a*b],label+' exact area measures');
 eq(twiceArea(m.frame),2*L*L,label+' square frame');
 const expectedSides=[a*a,b*b,expectedN].sort((x,y)=>x-y);
 for(const pieces of [m.initial,m.final]){
  eq(new Set(pieces.map(p=>p.id)).size,4,label+' four persistent pieces');
  for(const p of pieces){
   eq(twiceArea(p.points),a*b,label+' each triangle is half the a-by-b rectangle');
   eq([sq(p.points[0],p.points[1]),sq(p.points[1],p.points[2]),sq(p.points[2],p.points[0])].sort((x,y)=>x-y),expectedSides,label+' congruent triangle sides');
   const others=p.points.filter(q=>q[0]!==p.rightCorner[0]||q[1]!==p.rightCorner[1]);
   eq(others.length,2,label+' right corner is a piece vertex');ok(dot(sub(others[0],p.rightCorner),sub(others[1],p.rightCorner))===0,label+' square corner');
  }
 }
 eq(m.initial.map(p=>p.id),m.final.map(p=>p.id),label+' piece identity survives rearrangement');
 for(let i=0;i<4;i++){
  eq(sq(m.middle[i],m.middle[(i+1)%4]),expectedN,label+' middle side is a hypotenuse');
  ok(dot(sub(m.middle[(i+3)%4],m.middle[i]),sub(m.middle[(i+1)%4],m.middle[i]))===0,label+' middle corner is right');
 }
 eq(twiceArea(m.middle),2*expectedN,label+' middle square area');
 eq(m.squares.map(s=>twiceArea(s.points)),[2*a*a,2*b*b],label+' two end squares');
 endpoint([...m.initial.map(p=>p.points),m.middle],L,label+' initial layout');
 endpoint([...m.final.map(p=>p.points),...m.squares.map(s=>s.points)],L,label+' final layout');
 eq([sq(...m.triangle.sides.a),sq(...m.triangle.sides.b),sq(...m.triangle.sides.c)],[a*a,b*b,expectedN],label+' separate triangle labels retain meaning');
 const low=m.rootLower,high=m.rootUpper;ok(low*low<=expectedN&&high*high>expectedN&&high===low+1,label+' exact integer bracket');
 eq(m.exact,low*low===expectedN,label+' whole side only at a perfect square');ok(expectedN>a*a&&expectedN>b*b,label+' long side exceeds both legs');
 if(turn===0&&m.exact)whole.push([a,b]);
 for(let move=0;move<4;move++){
  const step=squarePensModel({...d,move});eq(step.pieces.map(p=>twiceArea(p.points)),[a*b,a*b,a*b,a*b],label+' moving pieces retain area');
  eq(step.moving,move===1||move===2,label+' intermediate view is not an endpoint proof');
 }
}
eq(whole,[[3,4],[4,3],[5,12],[6,8],[8,6],[9,12],[12,5],[12,9]],'exactly the eight ordered integer-hypotenuse pairs in this board');
eq(squarePensModel({...initial,turn:1}).triangle.sides.a,[[7,0],[7,3]],'clockwise turn transforms mathematical points, not just presentation');
eq(squarePensModel({...initial,turn:1}).triangle.sides.b,[[7,0],[3,0]],'the turned second leg remains labelled b');
for(const bad of [null,[],{}, {...initial,a:0},{...initial,b:13},{...initial,a:1.5},{...initial,a:'3'},{...initial,a:NaN},{...initial,turn:4},{...initial,move:-1},{...initial,page:'shelf'},{...initial,whyStep:6},{...initial,markedSide:'T0'},{...initial,lengthOpen:1},{...initial,compare:null},{...initial,invitationIndex:6},{...initial,extra:true}]){eq(validSquarePensDraft(bad),false,'unsupported complete draft refused');eq(squarePensModel(bad),null,'unsupported geometry refused');eq(squarePensPairs(bad),[],'unsupported draft supplies no arithmetic');}
for(const patch of [null,[],{a:0},{a:13},{a:'2'},{b:1.5},{turn:4},{move:-1},{whyStep:6},{page:'unknown'},{compare:1},{markedSide:'x'},{newKey:3}])eq(changeSquarePensDraft(initial,patch),null,'invalid patch refused atomically');
const marked={...initial,a:2,move:3,turn:2,markedSide:'c',lengthOpen:true,whyStep:4,compare:true,invitationIndex:3};
eq(changeSquarePensDraft(marked,{b:5}),{...marked,b:5,move:0,markedSide:null},'dimension change resets only pieces and side mark');
eq(changeSquarePensDraft(marked,{turn:3}),{...marked,turn:3},'turn retains every other local choice');
eq(marked.a,2,'proposal does not mutate its draft');
let next={...initial,a:7,b:9};const invitations=[];for(let i=0;i<6;i++){next=nextSquarePensInvitation(next);invitations.push([next.a,next.b]);}
eq(invitations,[[5,12],[6,8],[1,1],[2,3],[4,3],[3,4]],'invitation cursor advances through the authored cycle after free edits');eq(next.invitationIndex,0,'invitation cursor wraps');
const pairs=(d)=>squarePensPairs({...initial,...d}).map(p=>p.join(',')).sort();
eq(pairs({}),['2,12','3,4','7,7'],'initial Build exposes only frame and paired/four-triangle arithmetic');
eq(pairs({move:1}),pairs({}),'an overlapping intermediate move supplies no unshown square areas');
eq(pairs({move:2}),pairs({}),'second intermediate move supplies no unshown square areas');
eq(pairs({move:3}),['2,12','3,3','3,4','4,4','7,7'],'completed Build adds the two labelled square areas');
eq(pairs({compare:true}),pairs({move:3}),'comparison qualifies both completed plans independent of draft move');
eq(pairs({lengthOpen:true}),['2,12','3,3','3,4','4,4','5,5','7,7'],'elected exact length takes the full visible union');
eq(pairs({a:5,b:12,lengthOpen:true}),['12,12','5,12','5,5'],'13 length and17 frame remain visible math but never out-of-range helper pairs');
eq(pairs({a:12,b:12,lengthOpen:true}),['12,12'],'16/17 root brackets and24 frame are filtered, not a display refusal');
eq(pairs({a:2,b:3,lengthOpen:true}),['2,2','2,3','2,6','3,3','4,4','5,5'],'nonwhole length adds both bounding square facts');
for(let whyStep=0;whyStep<4;whyStep++)eq(pairs({page:'why',whyStep,lengthOpen:true,compare:true,move:3}),[],'early frozen reference has no hidden or own-draft area facts');
eq(pairs({page:'why',whyStep:4}),['3,3','4,4'],'Why step5 exposes only its two labelled square products');
eq(pairs({page:'why',whyStep:5}),['2,12','3,3','3,4','4,4','5,5','7,7'],'Why step6 qualifies every visible reference product');
eq(pairs({page:'corner',lengthOpen:true,a:12,b:12}),['3,3','4,4','6,6'],'corner contrast uses its own frozen squares only');
for(let whyStep=0;whyStep<6;whyStep++){const ref=squarePensReference(whyStep);eq([ref.a,ref.b,ref.turn],[3,4,0],'reference never adopts free material');}eq(squarePensReference(6),null,'unknown teaching frame refused');
const contrast=squarePensContrast(),[A,B,C]=contrast.points;
ok(Math.abs(sq(A,B)-9)<1e-12&&Math.abs(sq(A,C)-16)<1e-12&&Math.abs(sq(B,C)-36)<1e-12,'contrast coordinates have sides3,4,6');
eq(dot(sub(B,A),sub(C,A)),-11/2,'contrast angle A is obtuse');ok(dot(sub(A,B),sub(C,B))>0&&dot(sub(A,C),sub(B,C))>0,'other contrast angles are acute');
console.log(`Square Pens: ${n} checks passed (all 144 ordered leg pairs, four rotations, exact endpoint geometry).`);
