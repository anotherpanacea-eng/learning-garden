import {wholeCases,wholeCopy} from './whole-bundles-content.mjs';

export const wholeCase=id=>wholeCases.find(c=>c.id===id)||null;
export function createWhole(id){
 const c=wholeCase(id);
 return c?{caseId:c.id,packed:c.initialPacked}:null;
}
function material(numerator,denominator,initialPacked,packed){
 const loose=numerator-packed*denominator;
 const rows=Array.from({length:Math.max(1,Math.ceil(numerator/denominator))},(_,index)=>{
  const first=index*denominator,filled=Math.max(0,Math.min(denominator,numerator-first));
  return {index,start:index,end:index+1,pieceIds:Array.from({length:filled},(_,i)=>first+i),bundled:index<packed,filled};
 });
 const row=rows.length-1;
 return {numerator,denominator,initialPacked,packed,loose,totalPieces:numerator,unitSize:1/denominator,
  canBundle:loose>=denominator,canOpen:packed>0,
  canonicalWhole:Math.floor(numerator/denominator),canonicalRemainder:numerator%denominator,
  rows,flag:{row,x:48+504*(numerator-row*denominator)/denominator}};
}
export function wholeModel(work){
 if(!work||typeof work!=='object'||Array.isArray(work))return null;
 const c=wholeCase(work.caseId);
 if(!c||!Number.isInteger(work.packed)||work.packed<0||work.packed>Math.floor(c.numerator/c.denominator))return null;
 return {caseId:c.id,...material(c.numerator,c.denominator,c.initialPacked,work.packed)};
}
export function changeWhole(work,action){
 const m=wholeModel(work);
 if(!m)return null;
 if(action==='bundle'&&m.canBundle)return {caseId:m.caseId,packed:m.packed+1};
 if(action==='open'&&m.canOpen)return {caseId:m.caseId,packed:m.packed-1};
 return null;
}
// Authored mixed-name speech for this finite stock, rather than reading adjacent
// numerals as an arithmetic expression or changing the shared speech parser.
const mixedWords=Object.freeze({
 'seven-quarters':'one whole and three quarters',
 'eleven-quarters':'two wholes and three quarters',
 'three-and-two-fifths':'three wholes and two fifths',
 'two-and-one-eighth':'two wholes and one eighth'
});
export function wholeNames(work){
 const m=wholeModel(work);
 if(!m)return null;
 const {numerator:n,denominator:d,packed:p,loose:l,canonicalWhole:q,canonicalRemainder:r}=m;
 const equation=`${p} × ${d} + ${l} = ${n} pieces of size 1/${d}.`;
 const equationSpeech=`${p} times ${d}, plus ${l}, equals ${n} pieces of size 1/${d}.`;
 let canonical,canonicalSpeech;
 if(n===0){canonical=`0/${d} = 0. There is no ribbon.`;canonicalSpeech=canonical;}
 else if(q===0){canonical=`${n}/${d}. This amount is less than one whole; it needs no whole-number part.`;canonicalSpeech=canonical;}
 else if(r===0){canonical=`${n}/${d} = ${q} ${q===1?'whole':'wholes'}.`;canonicalSpeech=canonical;}
 else{
  canonical=`${q} ${q===1?'whole':'wholes'} and ${r}/${d} = ${n}/${d}. Each whole accounts for ${d} pieces.`;
  canonicalSpeech=`${mixedWords[m.caseId]} equals ${n}/${d}. Each whole accounts for ${d} pieces.`;
 }
 const explanation=`In ${n}/${d}, the numerator ${n} counts the pieces; the denominator ${d} tells how many equal pieces make one whole. A mixed number names whole units and a proper fractional part. An improper fraction has a numerator at least as large as its denominator; it can name one whole or more. Both names can describe the same amount.`;
 return {text:`${equation} ${canonical} ${explanation}`,spokenText:`${equationSpeech} ${canonicalSpeech} ${explanation}`,
  whole:q,remainder:r,numerator:n,denominator:d,mixedLabel:q>0&&r>0?`${q} ${r}/${d}`:null};
}
// This reference has no live case ID and cannot be passed to changeWhole.
export function wholeExample(frame){
 if(!Number.isInteger(frame)||frame<0||frame>5)return null;
 return {...material(7,3,0,[0,1,2,1,0,2][frame]),frame,text:wholeCopy.frames[frame],spokenText:wholeCopy.frameSpeech[frame],
  claim:frame===5?{numerator:3,denominator:3}:null};
}
