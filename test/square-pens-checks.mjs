// Independent integer geometry checks for original, synthetic paper plans.
import assert from 'node:assert/strict';
import {defaultSquarePensDraft,validSquarePensDraft,changeSquarePensDraft,nextSquarePensInvitation,squarePensModel,squarePensReference,squarePensContrast,squarePensPairs,missingSquareModel,nextMissingSquareInvitation,gridDistanceModel,nextGridDistanceInvitation} from '../dist/square-pens-core.mjs';
import {renderSquarePensMissing,renderSquarePensGrid} from '../dist/square-pens-ui.mjs';
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
const initial=defaultSquarePensDraft();eq(initial,{a:3,b:4,turn:0,move:0,page:'build',markedSide:null,lengthOpen:false,invitationIndex:0,whyStep:0,compare:false,missingC:5,missingA:3,missingStep:0,missingTurn:0,missingIndex:0,gridAx:1,gridAy:1,gridBx:4,gridBy:5,gridPoint:'B',gridStep:0,gridElbow:0,gridTrace:0,gridIndex:0},'initial paper plan');
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


// The inverse-side model is a different local material; it never borrows Build answers.
let missingCount=0;const missingWhole=[];
for(let c=2;c<=17;c++)for(let a=1;a<=12&&a<c;a++){
 missingCount++;const N=c*c-a*a;
 for(let turn=0;turn<4;turn++)for(let step=0;step<3;step++){
  const d={...initial,page:'missing',missingC:c,missingA:a,missingStep:step,missingTurn:turn},m=missingSquareModel(d),label=`missing c${c},a${a},turn${turn},step${step}`;
  eq([m.C,m.A,m.N],[c*c,a*a,N],label+' exact area subtraction');ok(N>0&&a*a+N===c*c,label+' positive remaining square area');
  ok(m.k*m.k<=N&&m.u*m.u>N&&m.u===m.k+1,label+' integer root bracket');eq(m.exact,m.k*m.k===N,label+' exact side classification');
  ok(N<c*c,label+' missing leg shorter than hypotenuse by integer comparison');
  const [O,P,Q]=m.triangle.points;
  const r=Math.sqrt(N),expectedP=[[a,0],[0,a],[-a,0],[0,-a]][turn],expectedQ=[[0,r],[-r,0],[0,-r],[r,0]][turn];
  eq(O,[0,0],label+' rotation fixes the square corner');eq(P,expectedP,label+' known leg follows independent quarter-turn table');ok(Q.every((v,i)=>Math.abs(v-expectedQ[i])<1e-9),label+' unknown leg follows independent quarter-turn table');
  ok(Math.abs(sq(O,P)-a*a)<1e-9&&Math.abs(sq(O,Q)-N)<1e-9&&Math.abs(sq(P,Q)-c*c)<1e-9,label+' drawing lengths within floating tolerance');
  ok(Math.abs(dot(sub(P,O),sub(Q,O)))<1e-9,label+' drawing right corner within floating tolerance');
  eq(twiceArea(m.nested.outer),2*c*c,label+' outer square exact area');eq(twiceArea(m.nested.known),2*a*a,label+' known square exact area');eq(twiceArea(m.nested.remaining),2*N,label+' L-shaped remainder exact area');
  ok(Math.abs(twiceArea(m.remainingSquare)-2*N)<1e-9,label+' separate drawing square has the remaining area');
  const expected=[[c,c],[a,a]];
  if(step===2){expected.push([m.k,m.k]);if(!m.exact)expected.push([m.u,m.u]);}
  const expectedPairs=[...new Set(expected.filter(([p,q])=>p>=1&&p<=12&&q>=1&&q<=12).map(pair=>pair.join(',')))].sort();
  eq(squarePensPairs(d).map(pair=>pair.join(',')).sort(),expectedPairs,label+' only visible eligible products');
  if(turn===0&&step===0&&m.exact)missingWhole.push([c,a]);
 }
}
eq(missingCount,126,'every legal c/known-leg pair exercised');
eq(missingWhole,[[5,3],[5,4],[10,6],[10,8],[13,5],[13,12],[15,9],[15,12],[17,8]],'nine whole missing-side pairs');
eq(missingSquareModel({...initial,missingTurn:1}).triangle.points,[[0,0],[0,3],[-4,0]],'inverse triangle points rotate around origin');
for(const patch of [{missingC:1},{missingC:18},{missingC:3},{missingC:'5'},{missingA:0},{missingA:13},{missingA:5},{missingA:2.5},{missingStep:-1},{missingStep:3},{missingTurn:4},{missingIndex:6}]){
 eq(changeSquarePensDraft(initial,patch),null,'invalid inverse-side patch refused atomically');eq(missingSquareModel({...initial,...patch}),null,'unsupported inverse model refused');
}
const finished={...initial,a:5,b:12,move:3,turn:2,markedSide:'c',lengthOpen:true,compare:true,invitationIndex:4,whyStep:5,page:'missing',missingStep:2,missingTurn:3,missingIndex:2};
const changedMissing=changeSquarePensDraft(finished,{missingC:13});
eq(changedMissing,{...finished,missingC:13,missingStep:0},'missing dimension resets its step only, retaining every Build choice');
eq(changeSquarePensDraft(finished,{missingA:4}),{...finished,missingA:4,missingStep:0},'known-side edit preserves both materials except its own reveal step');
eq(changeSquarePensDraft(finished,{missingTurn:0}),{...finished,missingTurn:0},'inverse turn does not reset either material or reveal');
eq(changeSquarePensDraft(finished,{a:6}),{...finished,a:6,move:0,markedSide:null},'Build edit does not reset inverse material or reveal');
let missingNext={...finished,missingC:8,missingA:2,missingIndex:0};const missingInvitations=[];
for(let i=0;i<6;i++){const before=missingNext;missingNext=nextMissingSquareInvitation(missingNext);missingInvitations.push([missingNext.missingC,missingNext.missingA]);eq(missingNext,{...before,missingC:missingNext.missingC,missingA:missingNext.missingA,missingStep:0,missingIndex:(before.missingIndex+1)%6},'inverse invitation changes only its material, step and cursor');}
eq(missingInvitations,[[13,5],[10,8],[5,4],[4,2],[2,1],[5,3]],'inverse invitations advance and wrap after free edits');
eq(pairs({page:'missing',missingC:13,missingA:5,missingStep:0}),['5,5'],'large hypotenuse filters out-of-range c product');
eq(pairs({page:'missing',missingC:13,missingA:5,missingStep:2}),['12,12','5,5'],'reveal qualifies the newly shown12-square');
eq(pairs({page:'missing',missingC:17,missingA:1,missingStep:2}),['1,1'],'large nonwhole root brackets stay outside helper without refusing display');
eq(pairs({page:'missing',missingC:2,missingA:1,missingStep:2}),['1,1','2,2'],'duplicate bracket and input squares deduplicate');
eq(pairs({page:'missing',missingC:5,missingA:4,missingStep:2}),['3,3','4,4','5,5'],'swapped known leg reveals the other side');
eq(pairs({...finished,page:'build'}),pairs({a:5,b:12,move:3,lengthOpen:true}),'inverse material cannot contaminate Build exposure');
// Inspect the actual production section, not a mirrored renderer or facts registry.
for(let c=2;c<=17;c++)for(let a=1;a<=12&&a<c;a++)for(let step=0;step<3;step++)for(let turn=0;turn<4;turn++){
 const d={...initial,page:'missing',missingC:c,missingA:a,missingStep:step,missingTurn:turn},html=renderSquarePensMissing(d),N=c*c-a*a,label=`render c${c},a${a},step${step},turn${turn}`;
 const shown=[];
 for(const match of html.matchAll(/(\d+) × (\d+) = (\d+)/g)){
  const [x,y,z]=match.slice(1).map(Number);eq(x*y,z,label+' visible product is mathematically correct');shown.push([x,y]);
 }
 for(const match of html.matchAll(/data-sp-square-side="(\d+)" data-sp-square-area="(\d+)"/g)){
  const [side,area]=match.slice(1).map(Number);eq(side*side,area,label+' pictured whole-side square has its stated area');shown.push([side,side]);
 }
 const eligible=[...new Set(shown.filter(p=>p.every(n=>n>=1&&n<=12)).map(p=>p.join(',')))].sort();
 eq(eligible,squarePensPairs(d).map(p=>p.join(',')).sort(),label+' actual shown eligible multiplication equals pre-DOM qualification');
 ok(html.includes('Your Build pieces are kept.')&&!html.includes('Your pieces wait: a='),label+' own Build dimensions never leak into this page');
 eq(html.includes('data-sp-missing-difference'),step>=1,label+' remaining area appears only after elected subtraction');
 eq(html.includes('data-sp-missing-answer'),step===2,label+' side-answer section appears only at elected length step');
 if(step<2){ok(html.includes('other short side b is unknown')&&html.includes('<dd>?</dd>'),label+' visible and aria triangle sides both stay unknown');ok(!html.includes('√')&&!html.includes('square root of')&&!html.includes('lies between'),label+' early section contains no root/bracket disclosure');}
 if(step===0)ok(!html.includes('data-sp-missing-area-label')&&!html.includes('Other square’s area:'),label+' comparison does not insert subtraction result');
 else ok(html.includes(`${c*c} − ${a*a} = ${N} square units`),label+' elected subtraction uses the exact known areas');
}
// Across the plan: independently authored rows, then aggregate finite-domain properties.
const gridRows=[
 [1,1,4,5,3,4,7,25,'5'],
 [10,9,4,1,6,8,14,100,'10'],
 [2,8,7,8,5,0,5,25,'5'],
 [6,6,6,6,0,0,0,0,'0'],
 [3,3,5,6,2,3,5,13,'√13'],
 [0,0,12,12,12,12,24,288,'√288'],
 [1,1,9,10,8,9,17,145,'√145'],
];
const gridDraft=(ax,ay,bx,by,extra={})=>({...initial,page:'grid',gridAx:ax,gridAy:ay,gridBx:bx,gridBy:by,...extra});
for(const [ax,ay,bx,by,h,v,L,N,distance] of gridRows){
 const m=gridDistanceModel(gridDraft(ax,ay,bx,by));
 eq([m.h,m.v,m.L,m.N,m.distance],[h,v,L,N,distance],'independent grid invitation/reference values');
}
let gridNext=gridDraft(7,9,2,3,{gridStep:2,gridTrace:4,gridPoint:'A',gridElbow:1});
for(let i=1;i<=6;i++){
 const before=gridNext;gridNext=nextGridDistanceInvitation(before);const row=gridRows[i%6];
 eq(gridNext,{...before,gridAx:row[0],gridAy:row[1],gridBx:row[2],gridBy:row[3],gridIndex:i%6,gridStep:0,gridTrace:0},'grid invitation advances before applying and preserves other material');
}
const heldGrid={...finished,page:'grid',gridAx:0,gridAy:0,gridBx:12,gridBy:12,gridStep:2,gridTrace:24,gridElbow:1,gridPoint:'A',gridIndex:5};
eq(changeSquarePensDraft(heldGrid,{gridBx:1,gridBy:1,gridStep:2,gridTrace:24}),{...heldGrid,gridBx:1,gridBy:1,gridStep:0,gridTrace:0},'coordinate reset precedes dependent trace validation and wins over valid explicit reveals');
eq(changeSquarePensDraft(heldGrid,{gridElbow:0,gridTrace:24}),{...heldGrid,gridElbow:0,gridTrace:0},'other corner resets trace while retaining elected stage');
eq(changeSquarePensDraft(heldGrid,{gridPoint:'B'}),{...heldGrid,gridPoint:'B'},'point selection retains endpoints and reveals');
eq(changeSquarePensDraft(heldGrid,{page:'why'}),{...heldGrid,page:'why'},'page change preserves grid material');
for(const patch of [{gridAx:-1},{gridAy:13},{gridBx:2.5},{gridBy:'3'},{gridPoint:'C'},{gridStep:3},{gridElbow:2},{gridIndex:6},{gridTrace:-1},{gridTrace:25},{gridTrace:1.5},{gridAx:1,gridStep:3},{gridAx:1,gridTrace:-1},{gridElbow:0,gridTrace:25}]){
 eq(changeSquarePensDraft(heldGrid,patch),null,'fixed domains checked even when resets could hide invalid explicit values');
 eq(validSquarePensDraft({...heldGrid,...patch}),false,'invalid grid full draft refused');
 eq(gridDistanceModel({...heldGrid,...patch}),null,'invalid grid model refused');
}
eq(changeSquarePensDraft(initial,{gridTrace:8}),null,'trace cannot exceed the unchanged edge route');
eq(changeSquarePensDraft(initial,{gridTrace:7}),{...initial,gridTrace:7},'trace reaches its exact edge bound');
// Each property is one aggregated check, with exact coordinate diagnostics on failure.
let gridCases=0;
for(let ax=0;ax<=12;ax++)for(let ay=0;ay<=12;ay++)for(let bx=0;bx<=12;bx++)for(let by=0;by<=12;by++){
 const h=Math.abs(bx-ax),v=Math.abs(by-ay),N=(bx-ax)**2+(by-ay)**2,L=h+v,roots=Array.from({length:18},(_,i)=>i).filter(i=>i*i<=N),k=roots.at(-1),label=`grid (${ax},${ay}) to (${bx},${by})`;
 for(let elbow=0;elbow<=1;elbow++){
  const d=gridDraft(ax,ay,bx,by,{gridElbow:elbow,gridTrace:L}),m=gridDistanceModel(d),E=elbow?[ax,by]:[bx,ay];
  assert.deepEqual([m.A,m.B,m.E,m.h,m.v,m.H,m.V,m.N,m.L,m.kind],[[ax,ay],[bx,by],E,h,v,h*h,v*v,N,L,h&&v?'triangle':L?'axis':'same'],label+' exact geometry');
  assert.deepEqual([m.k,m.u,m.K,m.U,m.exact,m.distance],[k,k+1,k*k,(k+1)**2,N===k*k,N===k*k?String(k):`√${N}`],label+' independent root enumeration');
  const path=[[ax,ay]];
  const append=(axis,target)=>{while(path.at(-1)[axis]!==target){const p=[...path.at(-1)];p[axis]+=p[axis]<target?1:-1;path.push(p);}};
  if(elbow){append(1,by);append(0,bx);}else{append(0,bx);append(1,by);}
  assert.deepEqual(m.segments,path.slice(1).map((p,i)=>({from:path[i],to:p})),label+' ordered unit intervals');
  assert.equal(m.segments.length,L,label+' intervals, not endpoint dots');
  assert.equal(sq(m.A,m.B),N,label+' endpoint square distance');
  if(h&&v){assert.ok(dot(sub(m.A,E),sub(m.B,E))===0,label+' perpendicular corner');assert.ok(L*L>N&&L*L===N+2*h*v,label+' strict route inequality');}
  else assert.equal(L*L,N,label+' degenerate distance equality');
  const reverse=gridDistanceModel(gridDraft(bx,by,ax,ay,{gridElbow:1-elbow}));
  assert.deepEqual(reverse.segments,m.segments.toReversed().map(s=>({from:s.to,to:s.from})),label+' reverse ordered route');
  const shifted=gridDistanceModel(gridDraft(ax-Math.min(ax,bx),ay-Math.min(ay,by),bx-Math.min(ax,bx),by-Math.min(ay,by),{gridElbow:elbow}));
  for(const other of [reverse,shifted,gridDistanceModel({...d,gridElbow:1-elbow})])assert.deepEqual([other.h,other.v,other.L,other.N,other.distance],[h,v,L,N,m.distance],label+' reflection/translation/elbow invariants');
 }
 gridCases++;
}
eq(gridCases,28561,'all point pairs with both elbows: exact geometry, integer roots, interval ordering and invariances');
let gridPairCases=0;
for(let h=0;h<=12;h++)for(let v=0;v<=12;v++)for(let step=0;step<=2;step++){
 const d=gridDraft(0,0,h,v,{gridStep:step}),N=h*h+v*v;
 let k=0;for(let root=0;root<=17;root++)if(root*root<=N)k=root;
 const shown=h&&v&&step>=1?[[h,h],[v,v]]:[];
 if(h&&v&&step===2){shown.push([k,k]);if(k*k!==N)shown.push([k+1,k+1]);}
 const expected=[...new Set(shown.filter(p=>p.every(x=>x>=1&&x<=12)).map(p=>p.join(',')))].sort();
 assert.deepEqual(squarePensPairs(d).map(p=>p.join(',')).sort(),expected,`grid qualification h${h},v${v},step${step}`);gridPairCases++;
}
eq(gridPairCases,507,'169 difference classes at three stages qualify only shown eligible products');
eq(pairs({page:'grid',gridAx:1,gridAy:1,gridBx:9,gridBy:10,gridStep:1}),['8,8','9,9'],'root-only 12-square absent before distance');
eq(pairs({page:'grid',gridAx:1,gridAy:1,gridBx:9,gridBy:10,gridStep:2}),['12,12','8,8','9,9'],'root-only 12-square newly qualified at distance');
// Bounded production-render probes: all invitation shapes, root-only 12-square,
// singular intervals and the other axis direction. Semantic surfaces, not raw numerals.
let gridRenderCases=0;
for(const row of [...gridRows,[1,2,2,3],[4,8,4,7]])for(let elbow=0;elbow<=1;elbow++)for(let step=0;step<=2;step++){
 const d=gridDraft(...row.slice(0,4),{gridStep:step,gridElbow:elbow,gridTrace:1}),L=Math.abs(row[2]-row[0])+Math.abs(row[3]-row[1]);
 d.gridTrace=Math.min(1,L);
 const m=gridDistanceModel(d),html=renderSquarePensGrid(d),child=html.replace(/<details class="sp-grid-adult">[\s\S]*?<\/details>/g,''),label=`render grid ${row.slice(0,4)}, elbow${elbow},step${step}`,shown=[];
 for(const match of child.matchAll(/(\d+) × (\d+) = (\d+)/g)){
  const [x,y,z]=match.slice(1).map(Number);assert.equal(x*y,z,label+' written product');shown.push([x,y]);
 }
 for(const match of child.matchAll(/data-sp-square-side="(\d+)" data-sp-square-area="(\d+)"/g)){
  const [side,area]=match.slice(1).map(Number);assert.equal(side*side,area,label+' pictured area');shown.push([side,side]);
 }
 const eligible=[...new Set(shown.filter(p=>p.every(x=>x>=1&&x<=12)).map(p=>p.join(',')))].sort();
 assert.deepEqual(eligible,squarePensPairs(d).map(p=>p.join(',')).sort(),label+' actual written/pictured products equal preflight facts');
 assert.equal(child.includes('data-sp-grid-areas'),m.kind==='triangle'&&step>=1,label+' area stage');
 assert.equal(child.includes('data-sp-grid-length'),step===2,label+' distance stage');
 assert.equal(child.includes('data-sp-grid-right-corner'),m.kind==='triangle',label+' no degenerate right angle');
 assert.equal([...child.matchAll(/data-sp-grid-interval="/g)].length,L,label+' one drawn edge interval per unit');
 assert.equal([...child.matchAll(/data-sp-grid-highlighted="true"/g)].length,d.gridTrace,label+' retained trace prefix');
 assert.equal(child.includes('data-sp-grid-trace-count'),step===0,label+' trace controls/counter only at counting');
 assert.ok(child.includes(`A: (${m.ax}, ${m.ay})`)&&child.includes(`B: (${m.bx}, ${m.by})`),label+' complete ordered positions');
 assert.ok(child.includes(`${Math.max(m.ax,m.bx)} − ${Math.min(m.ax,m.bx)} = ${m.h} ${m.h===1?'unit':'units'}`)&&child.includes(`${Math.max(m.ay,m.by)} − ${Math.min(m.ay,m.by)} = ${m.v} ${m.v===1?'unit':'units'}`)&&child.includes(`${m.h} + ${m.v} = ${L} ${L===1?'unit':'units'}`),label+' nonnegative differences and edge sum on every branch');
 if(step<2)assert.ok(!/√|strictly between|lies between|straight distance is \d|Straight distance: \d|positive number whose square/.test(child),label+' no early root or numeric straight distance');
 if(step===0)assert.ok(!/\d+ × \d+|square units?|Distance²|data-sp-square-side/.test(child),label+' no early area/products in text, SVG or aria');
 if(m.kind!=='triangle')assert.equal(shown.length,0,label+' no degenerate multiplication');
 assert.ok(child.includes('Your other triangle plans are kept.')&&!child.includes('Your pieces wait: a='),label+' no Build hints');
 gridRenderCases++;
}
eq(gridRenderCases,54,'bounded actual grid renders preserve reveals, products, unit geometry, degenerate branches and coordinate copy');
console.log(`Square Pens: ${n} checks passed (144 Build pairs and 126 inverse-side pairs, four rotations; 28,561 coordinate pairs with both elbows and 507 grid qualification cases).`);
