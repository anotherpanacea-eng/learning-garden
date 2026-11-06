import {squarePensInvitations,missingSquareInvitations} from './square-pens-content.mjs';
const integer=(n,lo,hi)=>Number.isInteger(n)&&n>=lo&&n<=hi;
const keys=['a','b','turn','move','page','markedSide','lengthOpen','invitationIndex','whyStep','compare','missingC','missingA','missingStep','missingTurn','missingIndex'];
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
export function defaultSquarePensDraft(){return {a:3,b:4,turn:0,move:0,page:'build',markedSide:null,lengthOpen:false,invitationIndex:0,whyStep:0,compare:false,missingC:5,missingA:3,missingStep:0,missingTurn:0,missingIndex:0};}
export function validSquarePensDraft(d){return !!d&&typeof d==='object'&&!Array.isArray(d)&&Object.keys(d).length===keys.length&&keys.every(k=>own(d,k))&&integer(d.a,1,12)&&integer(d.b,1,12)&&integer(d.turn,0,3)&&integer(d.move,0,3)&&['build','why','corner','missing'].includes(d.page)&&[null,'a','b','c'].includes(d.markedSide)&&typeof d.lengthOpen==='boolean'&&integer(d.invitationIndex,0,5)&&integer(d.whyStep,0,5)&&typeof d.compare==='boolean'&&integer(d.missingC,2,17)&&integer(d.missingA,1,12)&&d.missingA<d.missingC&&integer(d.missingStep,0,2)&&integer(d.missingTurn,0,3)&&integer(d.missingIndex,0,5);}
// Proposals are detached. Reject unknown/out-of-domain keys before changing any material.
export function changeSquarePensDraft(d,patch){
 if(!validSquarePensDraft(d)||!patch||typeof patch!=='object'||Array.isArray(patch)||Object.keys(patch).some(k=>!keys.includes(k)))return null;
 const next={...d,...patch};if(!validSquarePensDraft(next))return null;
 if(next.a!==d.a||next.b!==d.b){next.move=0;next.markedSide=null;}
 if(next.missingC!==d.missingC||next.missingA!==d.missingA)next.missingStep=0;
 return next;
}
export function nextSquarePensInvitation(d){if(!validSquarePensDraft(d))return null;const invitationIndex=(d.invitationIndex+1)%squarePensInvitations.length,[a,b]=squarePensInvitations[invitationIndex];return {...d,a,b,move:0,markedSide:null,invitationIndex};}
export function nextMissingSquareInvitation(d){if(!validSquarePensDraft(d))return null;const missingIndex=(d.missingIndex+1)%missingSquareInvitations.length,[missingC,missingA]=missingSquareInvitations[missingIndex];return {...d,missingC,missingA,missingStep:0,missingIndex};}
// Area/root decisions are exact integers. The square root below positions drawing points only.
export function missingSquareModel(d){
 if(!validSquarePensDraft(d))return null;
 const c=d.missingC,a=d.missingA,C=c*c,A=a*a,N=C-A,turn=d.missingTurn,step=d.missingStep;
 let k=0;while((k+1)*(k+1)<=N)k++;const u=k+1,exact=k*k===N,drawingLength=Math.sqrt(N);
 const rotate=point=>{let [x,y]=point;for(let i=0;i<turn;i++)[x,y]=[-y,x];return [x===0?0:x,y===0?0:y];},O=rotate([0,0]),P=rotate([a,0]),Q=rotate([0,drawingLength]);
 return {c,a,C,A,N,k,u,K:k*k,U:u*u,exact,b:exact?k:`√${N}`,drawingLength,turn,step,
  triangle:{points:[O,P,Q],rightCorner:O,sides:{a:[O,P],b:[O,Q],c:[P,Q]}},
  nested:{outer:[[0,0],[c,0],[c,c],[0,c]],known:[[0,c-a],[a,c-a],[a,c],[0,c]],remaining:[[0,0],[c,0],[c,c],[a,c],[a,c-a],[0,c-a]]},
  remainingSquare:[[0,0],[drawingLength,0],[drawingLength,drawingLength],[0,drawingLength]]};
}
const shift=(points,dx,dy)=>points.map(([x,y])=>[x+dx,y+dy]);
function rotatePoint(point,L,turn){let [x,y]=point;for(let i=0;i<turn;i++)[x,y]=[L-y,x];return [x,y];}
export function squarePensModel(d){
 if(!validSquarePensDraft(d))return null;
 const {a,b,turn,move}=d,L=a+b,N=a*a+b*b,rotate=points=>points.map(p=>rotatePoint(p,L,turn));
 const originals=[[[0,0],[a,0],[0,b]],[[a,0],[L,0],[L,a]],[[L,a],[L,L],[b,L]],[[0,b],[b,L],[0,L]]];
 const corners=[[0,0],[L,0],[L,L],[0,L]],moves=[{index:0,dx:0,dy:a},{index:2,dx:-b,dy:0},{index:3,dx:a,dy:-b}];
 const piece=(points,i,rightCorner)=>({id:`T${i}`,points:rotate(points),rightCorner:rotatePoint(rightCorner,L,turn)});
 const initial=originals.map((p,i)=>piece(p,i,corners[i]));
 const at=count=>originals.map((p,i)=>{const m=moves.slice(0,count).find(m=>m.index===i);return piece(m?shift(p,m.dx,m.dy):p,i,m?[corners[i][0]+m.dx,corners[i][1]+m.dy]:corners[i]);});
 let k=0;while((k+1)*(k+1)<=N)k++;
 const middle=rotate([[a,0],[L,a],[b,L],[0,b]]),squares=[{id:'a',side:a,area:a*a,points:rotate([[0,0],[a,0],[a,a],[0,a]])},{id:'b',side:b,area:b*b,points:rotate([[a,a],[L,a],[L,L],[a,L]])}];
 const rp=p=>rotatePoint(p,L,turn),ghost=move?{id:`T${moves[move-1].index}`,points:initial[moves[move-1].index].points.map(p=>[...p])}:null;
 return {a,b,L,turn,move,a2:a*a,b2:b*b,N,ab:a*b,frameArea:L*L,trianglesArea:2*a*b,k,exact:k*k===N,c:k*k===N?k:`√${N}`,rootLower:k,rootUpper:k+1,initial,final:at(3),pieces:at(move),middle,squares,frame:rotate([[0,0],[L,0],[L,L],[0,L]]),triangle:{points:rotate(originals[0]),rightCorner:rp([0,0]),sides:{a:[rp([0,0]),rp([a,0])],b:[rp([0,0]),rp([0,b])],c:[rp([a,0]),rp([0,b])]}},ghost,moving:move===1||move===2};
}
export function squarePensReference(whyStep=0){if(!integer(whyStep,0,5))return null;return squarePensModel({...defaultSquarePensDraft(),whyStep,move:whyStep>=3?3:0});}
export function squarePensContrast(){return {points:[[0,0],[3,0],[-11/6,Math.sqrt(455)/6]],labels:['A','B','C'],sides:{a:3,b:4,c:6},corner:0,areas:[9,16,36]};}
// Match only the selected page's actual numerical surfaces, including pictured labeled squares.
export function squarePensPairs(d){
 if(!validSquarePensDraft(d))return [];
 const m=d.page==='missing'?null:squarePensModel(d),pairs=[],add=(a,b)=>pairs.push([a,b]);
 if(d.page==='missing'){const missing=missingSquareModel(d);add(missing.c,missing.c);add(missing.a,missing.a);if(d.missingStep===2){add(missing.k,missing.k);if(!missing.exact)add(missing.u,missing.u);}}
 else if(d.page==='corner'){add(3,3);add(4,4);add(6,6);}
 else if(d.page==='why'){
  if(d.whyStep>=4){add(3,3);add(4,4);}
  if(d.whyStep===5){add(5,5);add(7,7);add(3,4);add(2,12);}
 }else{
  add(m.L,m.L);add(d.a,d.b);add(2,m.ab);
  if(d.move===3||d.compare||d.lengthOpen){add(d.a,d.a);add(d.b,d.b);}
  if(d.lengthOpen){add(m.k,m.k);if(!m.exact)add(m.k+1,m.k+1);}
 }
 const seen=new Set();return pairs.filter(([a,b])=>{if(!integer(a,1,12)||!integer(b,1,12))return false;const id=`${a},${b}`;if(seen.has(id))return false;seen.add(id);return true;});
}
