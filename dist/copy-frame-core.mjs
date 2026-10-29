import {copyFrameCase,copyFrameCopy} from './copy-frame-content.mjs';
const gcd=(a,b)=>b?gcd(b,a%b):a;
export function copyFraction(n,d){if(!Number.isSafeInteger(n)||n<0||!Number.isSafeInteger(d)||d<=0)return null;const g=gcd(n,d);return {n:n/g,d:d/g};}
export const copyFactorText=f=>f?.d===1?String(f.n):f?`${f.n}/${f.d}`:'';
export const copyLength=n=>`${n} length unit${n===1?'':'s'}`;
export const copyArea=n=>`${n} square unit${n===1?'':'s'}`;
export function createCopyFrame(caseId){const c=copyFrameCase(caseId);return c?{caseId,width:c.width,height:c.height}:null;}
function derive(state,a,b,requested){
 if(!state||!Number.isInteger(state.width)||!Number.isInteger(state.height)||state.width<1||state.width>12||state.height<1||state.height>12)return null;
 const {width:w,height:h}=state,direct=w*b===h*a,turned=h*b===w*a,matching=direct?'direct':turned?'turned':null;
 const scale=matching?copyFraction(direct?w:h,a):null,area=w*h,originalArea=a*b;
 const sides=matching==='turned'?[{originalSide:'width',copySide:'height',from:a,to:h},{originalSide:'height',copySide:'width',from:b,to:w}]:[{originalSide:'width',copySide:'width',from:a,to:w},{originalSide:'height',copySide:'height',from:b,to:h}];
 return {caseId:state.caseId,width:w,height:h,originalWidth:a,originalHeight:b,area,originalArea,matching,scale,areaFactor:copyFraction(area,originalArea),
  sides:sides.map(s=>({...s,factor:copyFraction(s.to,s.from)})),
  goal:!!(scale&&requested&&scale.n*requested.d===requested.n*scale.d),requested,
  square:a===b&&w===h,canWidthLess:w>1,canWidthMore:w<12,canHeightLess:h>1,canHeightMore:h<12,
  cells:Array.from({length:area},(_,i)=>({x:i%w,y:Math.floor(i/w),width:1,height:1}))};
}
export function copyFrameModel(state){const c=copyFrameCase(state?.caseId);return c?derive(state,c.width,c.height,c.factor):null;}
export function changeCopySide(state,side,step){
 if(!copyFrameModel(state)||!['width','height'].includes(side)||![-1,1].includes(step))return null;
 const next={caseId:state.caseId,width:state.width,height:state.height};next[side]+=step;return copyFrameModel(next)?next:null;
}
export const turnCopyFrame=state=>copyFrameModel(state)?{caseId:state.caseId,width:state.height,height:state.width}:null;
export const resetCopyMaterial=state=>copyFrameModel(state)?createCopyFrame(state.caseId):null;
export function copyFrameReading(state){
 const m=copyFrameModel(state);if(!m)return null;
 if(!m.matching)return `These sides use different factors, so this rectangle has another shape. Turning cannot make these dimensions a scaled copy of the original. Its actual area factor is ${copyFactorText(m.areaFactor)}; that does not show the shape is the same.`;
 const k=copyFactorText(m.scale),wanted=copyFactorText(m.requested),size=m.scale.n===m.scale.d?'Same shape and same size. The matching-side factor is 1.':m.scale.n>m.scale.d?`Same shape, larger copy. Each matching length has factor ${k}.`:`Same shape, smaller copy. Each matching length has factor ${k}.`;
 const invitation=m.goal?`These matching sides have the requested factor ${k}. You can keep exploring.`:m.scale.n===m.scale.d?`This copy is the same size. The invitation asks for factor ${wanted}.`:`This is a scaled copy. The invitation asks for matching-side factor ${wanted}; this copy has factor ${k}.`;
 return [m.matching==='turned'?'The copy is turned. These are the matching sides; Turn copy can line their directions up.':'',size,`The area factor is ${k} × ${k} = ${copyFactorText(m.areaFactor)}. Both dimensions change by the length factor; area does not use just one of them.`,invitation,m.square?copyFrameCopy.square:''].filter(Boolean).join(' ');
}
export function copyFrameExample(index){
 if(!Number.isInteger(index)||index<0||index>3)return null;
 const [width,height]=[[2,3],[2,6],[4,6],[3,4]][index];
 return {...derive({caseId:'worked-copy',width,height},2,3,null),index,displayIndex:index+1,text:copyFrameCopy.frames[index],panels:index===2?[{x:0,y:0,width:2,height:3},{x:2,y:0,width:2,height:3},{x:0,y:3,width:2,height:3},{x:2,y:3,width:2,height:3}]:[]};
}
