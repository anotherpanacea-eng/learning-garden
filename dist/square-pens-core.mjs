import {squarePensInvitations} from './square-pens-content.mjs';
const integer=(n,lo,hi)=>Number.isInteger(n)&&n>=lo&&n<=hi;
const keys=['a','b','turn','move','page','markedSide','lengthOpen','invitationIndex','whyStep','compare'];
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
export function defaultSquarePensDraft(){return {a:3,b:4,turn:0,move:0,page:'build',markedSide:null,lengthOpen:false,invitationIndex:0,whyStep:0,compare:false};}
export function validSquarePensDraft(d){return !!d&&typeof d==='object'&&!Array.isArray(d)&&Object.keys(d).length===keys.length&&keys.every(k=>own(d,k))&&integer(d.a,1,12)&&integer(d.b,1,12)&&integer(d.turn,0,3)&&integer(d.move,0,3)&&['build','why','corner'].includes(d.page)&&[null,'a','b','c'].includes(d.markedSide)&&typeof d.lengthOpen==='boolean'&&integer(d.invitationIndex,0,5)&&integer(d.whyStep,0,5)&&typeof d.compare==='boolean';}
// Proposals are detached. Reject unknown/out-of-domain keys before changing any material.
export function changeSquarePensDraft(d,patch){
 if(!validSquarePensDraft(d)||!patch||typeof patch!=='object'||Array.isArray(patch)||Object.keys(patch).some(k=>!keys.includes(k)))return null;
 const next={...d,...patch};if(!validSquarePensDraft(next))return null;
 if(next.a!==d.a||next.b!==d.b){next.move=0;next.markedSide=null;}
 return next;
}
export function nextSquarePensInvitation(d){if(!validSquarePensDraft(d))return null;const invitationIndex=(d.invitationIndex+1)%squarePensInvitations.length,[a,b]=squarePensInvitations[invitationIndex];return {...d,a,b,move:0,markedSide:null,invitationIndex};}
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
// Match only the selected page's actual numerical surfaces, including pictured labelled squares.
export function squarePensPairs(d){
 const m=squarePensModel(d);if(!m)return [];
 const pairs=[],add=(a,b)=>pairs.push([a,b]);
 if(d.page==='corner'){add(3,3);add(4,4);add(6,6);}
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
