import assert from 'node:assert/strict';
import {commonCases,commonCase,createCommonPair,commonPairModel,splitCommonPair,undoCommonPair,compareCommonPair,commonExample} from '../dist/common-cuts-core.mjs';
import {commonCopy,commonOriginalText,commonCurrentText,commonUnitText,commonChangeText} from '../dist/common-cuts-content.mjs';
let assertions=0;const eq=(a,b,message)=>{assert.deepEqual(a,b,message);assertions++;},ok=(x,message)=>{assert.ok(x,message);assertions++;};
// Independent arithmetic oracle: derive denominators from source fractions and
// factor histories, and compare source amounts by rational cross-products.
const sources=[['half-and-third',1,2,1,3],['equal-banners',2,3,4,6],['quarter-third',3,4,2,3],['sixth-quarter',5,6,3,4],['quarter-and-third',1,4,1,3]];
function histories(d,h=[]){return [h,...[2,3].filter(f=>d*f<=12).flatMap(f=>histories(d*f,[...h,f]))];}
const product=h=>h.reduce((p,f)=>p*f,1);
function pairAt(id,left,right){let pair=createCommonPair(id);for(const factor of left)pair=splitCommonPair(pair,'left',factor);for(const factor of right)pair=splitCommonPair(pair,'right',factor);return pair;}
let paired=0,matched=0,rowStates=0,edges=0;
eq(commonCases.length,5);
for(const [id,an,ad,bn,bd] of sources){
 const c=commonCase(id),leftHistories=histories(ad),rightHistories=histories(bd);
 eq(c.left,{numerator:an,denominator:ad});eq(c.right,{numerator:bn,denominator:bd});
 for(const [side,n,d,hs] of [['left',an,ad,leftHistories],['right',bn,bd,rightHistories]]){
  for(const h of hs){
   rowStates++;
   const pair=pairAt(id,side==='left'?h:[],side==='right'?h:[]),snapshot=structuredClone(pair),m=commonPairModel(pair)[side],count=n*product(h),denominator=d*product(h);
   eq(m.denominator,denominator);eq(m.numerator,count);eq(m.coloredCount,count);eq(m.endpoint* d,72*n);eq(m.whole,72);
   eq(m.boundaries,Array.from({length:denominator-1},(_,i)=>72*(i+1)/denominator));ok(m.boundaries.every(Number.isInteger));ok(Number.isInteger(m.endpoint));
   eq(m.numerator*d,n*m.denominator,'same original amount by cross-product');
   eq(m.canUndo,h.length>0);eq(m.canSplit2,denominator*2<=12);eq(m.canSplit3,denominator*3<=12);
   for(const factor of [2,3]){
    const next=splitCommonPair(pair,side,factor);
    if(denominator*factor>12){eq(next,null,'unavailable split refused');continue;}
    edges++;ok(next!==pair);const other=side==='left'?'right':'left';eq(next[other],pair[other]);
    const after=commonPairModel(next)[side];eq(after.endpoint,m.endpoint);ok(m.boundaries.every(p=>after.boundaries.includes(p)),'old boundaries survive');eq(after.solidBoundaries,m.boundaries,'solid old marks');eq(after.newBoundaries,after.boundaries.filter(p=>!m.boundaries.includes(p)),'only inserted marks dashed');
    const undo=undoCommonPair(next,side),back=commonPairModel(undo)[side];eq(back.boundaries,m.boundaries);eq(back.numerator,m.numerator);eq(back.denominator,m.denominator);eq(back.newBoundaries,[]);eq(back.solidBoundaries,m.boundaries);eq(undo[other],pair[other]);
   }
   if(!h.length)eq(undoCommonPair(pair,side),null,'empty undo refused');
   eq(pair,snapshot,'model/actions never mutate input');
   ok(commonOriginalText(side==='left'?'A':'B',m).includes(`${n}/${d}`));ok(commonCurrentText(m).includes(`${count}/${denominator}`));ok(commonUnitText(m).includes(`1/${denominator}`));ok(commonChangeText(m).length>20);
  }
 }
 for(const a of leftHistories)for(const b of rightHistories){
  paired++;const p=pairAt(id,a,b),m=commonPairModel(p),comparison=compareCommonPair(p),aDen=ad*product(a),bDen=bd*product(b);
  eq(comparison.matched,aDen===bDen);eq(comparison.relation,Math.sign(an*bd-bn*ad));eq(comparison.symbol,an*bd>bn*ad?'>':an*bd<bn*ad?'<':'=');eq(m.left.whole,m.right.whole);
  if(aDen===bDen){matched++;ok(comparison.text.includes(`${an*product(a)}/${aDen} ${comparison.symbol} ${bn*product(b)}/${bDen}`));eq(Math.sign(m.left.numerator-m.right.numerator),Math.sign(an*bd-bn*ad));}
  else ok(comparison.text.includes('Comparing just the coloured-piece counts will not settle the amount.'));
 }
}
eq(paired,62);eq(matched,8);eq(rowStates,35);eq(edges,25);
for(const id of ['half-and-third','equal-banners']){
 const combos=sources.find(x=>x[0]===id),ds=[];
 for(const a of histories(combos[2]))for(const b of histories(combos[4])){const m=commonPairModel(pairAt(id,a,b));if(m.left.denominator===m.right.denominator)ds.push(m.left.denominator);}
 ok(ds.includes(6)&&ds.includes(12),'both common units accepted');
}
const original=createCommonPair('half-and-third');
for(const bad of [null,undefined,{},'bad',{...original,caseId:'bad'},{...original,left:{history:[5],lastAction:null}},{...original,left:{history:[2,2,2],lastAction:{type:'split',factor:2}}},{...original,left:{history:[2],lastAction:null}},{...original,left:{history:[2],lastAction:{type:'split',factor:3}}},{...original,left:{history:[],lastAction:{type:'split'}}},{...original,left:{history:[],lastAction:{type:'bad'}}},{...original,right:{history:'2',lastAction:null}}]){
 eq(commonPairModel(bad),null);eq(splitCommonPair(bad,'left',2),null);eq(undoCommonPair(bad,'left'),null);eq(compareCommonPair(bad),null);
}
for(const factor of [0,1,4,'2',null,NaN,Infinity])eq(splitCommonPair(original,'left',factor),null);
for(const side of ['A','both',null,0]){eq(splitCommonPair(original,side,2),null);eq(undoCommonPair(original,side),null);}
eq(commonCase('unknown'),null);eq(createCommonPair('unknown'),null);
const frozen=structuredClone(original);Object.freeze(original.left.history);Object.freeze(original.left);Object.freeze(original.right.history);Object.freeze(original.right);Object.freeze(original);ok(splitCommonPair(original,'left',3));eq(original,frozen);
const frames=[0,1,2].map(commonExample);
eq(frames.map(x=>[x.left.numerator,x.left.denominator,x.right.numerator,x.right.denominator]),[[1,2,1,4],[2,4,1,4],[1,2,1,4]]);
for(const f of frames){eq(f.left.endpoint,36);eq(f.right.endpoint,18);eq(f.left.whole,f.right.whole);eq(commonPairModel(f),null);ok(f.text===commonCopy.exampleFrames[f.frame]);}
ok(frames[1].left.newBoundaries.includes(18));eq(frames[2].left.newBoundaries,[]);eq(original,frozen,'example does not change live pair');
for(const f of [-1,3,0.5,'1',null,undefined])eq(commonExample(f),null);
// Per-case visit storage belongs to UI; core states remain independent values.
const cases=Object.fromEntries(commonCases.map(c=>[c.id,createCommonPair(c.id)]));cases['half-and-third']=splitCommonPair(cases['half-and-third'],'left',3);cases['equal-banners']=splitCommonPair(cases['equal-banners'],'right',2);eq(commonPairModel(cases['half-and-third']).left.denominator,6);eq(commonPairModel(cases['equal-banners']).right.denominator,12);
console.log(`Common Cuts: ${assertions} assertions passed; ${paired} pair states, ${matched} matches, ${rowStates} row/history states, ${edges} reversible split edges.`);
