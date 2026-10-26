// Original symbolic model and teaching; Jane/Marble were design references only (spec241).
import {parseLinearNumber} from './linear-pathway-core.mjs';
const gcd=(a,b)=>b?gcd(b,a%b):a;
export function fraction(n,d=1){if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d===0)throw Error('Unsafe fraction');if(d<0){n=-n;d=-d;}const g=gcd(Math.abs(n),d);n/=g;d/=g;if(Math.abs(n)>1e12||d>1e9)throw Error('Fraction outside model');return {n:n||0,d};}
const product=(a,b)=>{const v=a*b;if(!Number.isSafeInteger(v))throw Error('Unsafe arithmetic');return v;};
export const plus=(a,b)=>fraction(product(a.n,b.d)+product(b.n,a.d),product(a.d,b.d));
export const times=(a,b)=>fraction(product(a.n,b.n),product(a.d,b.d));
export const minus=(a,b)=>plus(a,fraction(-b.n,b.d));
export const divide=(a,b)=>fraction(product(a.n,b.d),product(a.d,b.n));
export const same=(a,b)=>BigInt(a.n)*BigInt(b.d)===BigInt(b.n)*BigInt(a.d);
export const formatNumber=q=>q.d===1?String(q.n):`${q.n}/${q.d}`;
const q=s=>parseLinearNumber(s),zero=fraction(0),one=fraction(1);
export function normalizeExpression(e){return {m:times(q(e.k),q(e.a)),b:plus(times(q(e.k),q(e.b)),q(e.c))};}
export function evaluateExpression(e,x){const inner=plus(times(q(e.a),x),q(e.b));return plus(times(q(e.k),inner),q(e.c));}
function term(coef,variable){if(coef.n===0)return variable?'0x':'0';if(!variable)return formatNumber(coef);if(same(coef,one))return 'x';if(same(coef,fraction(-1)))return '−x';return `${coef.d===1?formatNumber(coef):`(${formatNumber(coef)})`}x`;}
function constantText(text,b){return b.n===0?text:`${text} ${b.n<0?'−':'+'} ${formatNumber(fraction(Math.abs(b.n),b.d))}`;}
export function normalText(n){return constantText(term(n.m,true),n.b);}
export const normalEquation=s=>`${normalText(s.left)} = ${normalText(s.right)}`;
export function exprText(e){const k=q(e.k),a=q(e.a),b=q(e.b),c=q(e.c);if(a.n===0)return formatNumber(plus(times(k,b),c));let inner=constantText(term(a,true),b),out;if(same(k,one))out=inner;else if(b.n===0&&same(a,one))out=term(k,true);else out=`${k.d===1?formatNumber(k):`(${formatNumber(k)})`} × (${inner})`;return constantText(out,c);}
export function classification(left,right){const a=minus(left.m,right.m),b=minus(right.b,left.b);return a.n===0?{key:b.n===0?'every':'none',solution:null}:{key:'one',solution:divide(b,a)};}
export const equalityFamilies=[
 {id:'twins',title:'Near twins',description:'Compare rules that look almost alike.'},
 {id:'brackets',title:'Open the brackets',description:'Follow a factor through every term inside.'},
 {id:'halves',title:'Half-sized steps',description:'Use exact fractions and compare both rules.'},
 {id:'beyond',title:'Beyond the test table',description:'Find what a few tested numbers cannot tell us.'}
];
const expr=(k,a,b,c)=>Object.fromEntries(Object.entries({k,a,b,c}).map(([key,v])=>[key,String(v)]));
const sets={
 twins:[[expr(3,1,0,2),expr(1,0,0,-1)],[expr(3,1,0,2),expr(3,1,0,11)],[expr(3,1,0,2),expr(3,1,0,2)]],
 brackets:[[expr(2,1,3,0),expr(1,1,0,9)],[expr(2,1,3,0),expr(2,1,0,7)],[expr(2,1,3,0),expr(2,1,0,6)]],
 halves:[[expr('1/2',1,0,1),expr(1,0,0,'9/4')],[expr('1/2',1,0,1),expr('1/2',1,0,3)],[expr('1/2',1,2,0),expr('1/2',1,0,1)]],
 beyond:[[expr(3,1,-2,4),expr(2,1,0,7)],[expr(0,1,0,2),expr(0,1,0,7)],[expr(0,1,0,2),expr(1,0,0,2)]]
};
export const equalityExample='A different equation: 2x + 1 = 7. Trying x = 0 gives 1 on the left and 7 on the right, so 0 is not a solution. Subtract 1 from BOTH sides: 2x = 6. Divide BOTH sides by 2: x = 3. Substituting 3 gives 2 × 3 + 1 = 7. The reversible steps show this is the only solution.';
export function generateEqualitySource(family,serial){
 const f=equalityFamilies.find(x=>x.id===family);if(!f||!Number.isSafeInteger(serial)||serial<1)return null;
 const t=Math.floor((serial-1)/3)%5-2,index=(serial-1)%3;
 const [left,right]=structuredClone(sets[family][index]);for(const e of [left,right])e.b=formatNumber(minus(q(e.b),times(q(e.a),fraction(t))));
 let l=normalizeExpression(left),r=normalizeExpression(right);const result=classification(l,r),steps=[];
 const push=(operation,reason)=>steps.push({operation,left:structuredClone(l),right:structuredClone(r),reason});
 push('start','These two expressions are equal only for their solutions. We allow every real number as x.');
 push('expand','Distribute the outside factor to every term inside each bracket, then collect constants on each side. The rules have not changed.');
 const m=r.m;l={m:minus(l.m,m),b:l.b};r={m:minus(r.m,m),b:r.b};push('remove-x',`Subtract (${formatNumber(m)})x from BOTH sides. This reversible step keeps exactly the same solutions.`);
 const b=l.b;l={m:l.m,b:minus(l.b,b)};r={m:r.m,b:minus(r.b,b)};push('remove-constant',`Subtract (${formatNumber(b)}) from BOTH sides. This is reversible too.`);
 let feedback;
 if(result.key==='one'){
  const d=l.m;l={m:divide(l.m,d),b:divide(l.b,d)};r={m:divide(r.m,d),b:divide(r.b,d)};push('divide',`Divide BOTH sides by ${formatNumber(d)}, which is not zero. This leaves x = ${formatNumber(result.solution)}.`);
  const v=evaluateExpression(left,result.solution);feedback=`Exactly one real number works: x = ${formatNumber(result.solution)}. Substituting it gives ${formatNumber(v)} on BOTH sides. Reversible steps isolated x, so there are no other solutions.`;
 }else{
  feedback=result.key==='every'?'The x terms cancel and the constants agree: 0x = 0. This is true for EVERY real x, not only x = 0. Both expressions describe the same rule. There are infinitely many solutions.':`The x terms cancel but leave 0x = ${formatNumber(r.b)}. Zero cannot equal that nonzero constant. NO real x can make the original rules equal.`;
 }
 push('conclude',feedback);
 const choices=[{id:'one',label:'One number'},{id:'none',label:'No numbers'},{id:'every',label:'Every real number'}],shift=Math.floor((serial-1)/3)%3;
 return {id:`equality-source-${serial}`,title:`${f.title} · visit ${serial}`,family,domain:'real',left,right,story:'Two town surveyors wrote rules for the same mark. Help them decide when their rules agree. These are number rules, not the weights of parcels.',teaching:['A solution is an x that gives the same value on BOTH sides. We allow all real numbers, including negative numbers and fractions.','Testing a number shows whether that number works. A mismatch disproves “every number”; a few matches do not prove “every number”. A few failed tests do not prove “no numbers”.','To explain all possible solutions, use reversible changes to BOTH sides. Never divide by zero.'],help:{hint:'Try the Explain why page. After collecting terms, do any x terms remain? If none remain, are the constants equal or different?',example:equalityExample},choices:[...choices.slice(shift),...choices.slice(0,shift)],key:result.key,solution:result.solution,steps,feedback,translation:t};
}
