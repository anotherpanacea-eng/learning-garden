import {shadowCopy as copy,shadowTeaching,shadowExample,shadowTemplates,shadowCases,shadowCase} from './shadow-yard-content.mjs';
import {copyFraction,copyFactorText} from './copy-frame-core.mjs';
const own=(x,k)=>Object.hasOwn(x,k);
const plain=x=>x!==null&&typeof x==='object'&&Object.getPrototypeOf(x)===Object.prototype;
const exact=(x,keys)=>plain(x)&&Reflect.ownKeys(x).length===keys.length&&keys.every(k=>own(x,k)&&Object.getOwnPropertyDescriptor(x,k)?.get===undefined&&Object.getOwnPropertyDescriptor(x,k)?.set===undefined);
const ids=shadowCases.map(c=>c.id);
const half=n=>n===null||Number.isInteger(n)&&n>=1&&n<=48;
function valid(w){try{return exact(w,['caseId','drafts','view','step'])&&ids.includes(w.caseId)&&plain(w.drafts)&&Reflect.ownKeys(w.drafts).every(id=>typeof id==='string'&&ids.includes(id)&&Object.getOwnPropertyDescriptor(w.drafts,id)?.get===undefined&&exact(w.drafts[id],['heightHalf','compare'])&&half(w.drafts[id].heightHalf)&&typeof w.drafts[id].compare==='boolean')&&['build','teaching','example'].includes(w.view)&&Number.isInteger(w.step)&&w.step>=0&&w.step<=3&&(w.view!=='build'||w.step===0);}catch{return false;}}
const draft=w=>own(w.drafts,w.caseId)?w.drafts[w.caseId]:{heightHalf:null,compare:false};
const line=(key,values)=>shadowTemplates[key].replace(/\{(\w+)\}/g,(_,k)=>String(values[k]));
const product=(left,right)=>line('product',{left,right,product:left*right,unit:left*right===1?'square meter':'square meters'});
const ratio=(height,shadow,n,d)=>line('ratio',{height,shadow,ratio:copyFactorText(copyFraction(n,d))});
export function initialShadowYard(){return {caseId:'flagpost',drafts:{},view:'build',step:0};}
export function changeShadowYard(work,action,value){
 if(!valid(work)||typeof action!=='string')return null;
 const next=structuredClone(work),d=draft(work);
 if(['case','choose','less','more','clear','compare'].includes(action)){
  if(work.view!=='build')return null;
  if(action==='case'){if(!ids.includes(value)||value===work.caseId)return null;next.caseId=value;return next;}
  let heightHalf=d.heightHalf,compare=d.compare;
  if(action==='choose'){if(heightHalf!==null)return null;heightHalf=2;compare=false;}
  else if(action==='less'||action==='more'){if(heightHalf===null)return null;heightHalf+=action==='less'?-1:1;if(!half(heightHalf))return null;compare=false;}
  else if(action==='clear'){if(heightHalf===null)return null;heightHalf=null;compare=false;}
  else if(action==='compare'){if(compare)return null;compare=true;}
  next.drafts[work.caseId]={heightHalf,compare};return next;
 }
 if(['build','teaching','example'].includes(action)){if(work.view===action)return null;next.view=action;next.step=0;return next;}
 if(action==='step'){if(work.view==='build'||!Number.isInteger(value)||value<0||value>3||work.step===value)return null;next.step=value;return next;}
 return null;
}
export function shadowYardModel(work){
 if(!valid(work))return null;
 const source=shadowCase(work.caseId),d={...draft(work)},height=d.heightHalf===null?null:d.heightHalf/2;
 let result=null;
 if(d.compare)result=source.condition==='different'?'unestablished':source.condition==='zero'?'zero':height===null?'incomplete':2*source.A*source.C===d.heightHalf*source.B?'match':'different';
 const comparable=work.view==='build'&&(result==='match'||result==='different');
 const ratioLines=comparable?[ratio(source.A,source.B,source.A,source.B),ratio(height,source.C,d.heightHalf,2*source.C)]:[];
 const productLines=comparable?[product(source.A,source.C),product(height,source.B)]:[];
 let picture={A:source.A,B:source.B,C:source.C,h:height,example:false};
 let caption=height===null?copy.diagramEmpty:source.condition==='zero'?copy.diagramZero:copy.diagram;
 const help=work.view==='build'?null:{...(work.view==='teaching'?shadowTeaching:shadowExample)[work.step]};
 if(work.view==='teaching'){picture=null;caption='';}
 if(work.view==='example'){picture={A:3,B:4,C:6,h:work.step>=2?4.5:null,example:true};caption=work.step>=2?copy.exampleDiagram:copy.exampleDiagramEmpty;}
 if(picture)picture.scale=Math.min(190/Math.max(picture.A,picture.h||picture.A),200/Math.max(picture.B,picture.C,1));
 return {source,draft:d,height,result,ratioLines,productLines,picture,caption,help,waiting:work.view!=='build'&&height!==null?line('waiting',{height}):'',resultText:work.view==='build'&&result?copy[result]:'',canLess:height!==null&&d.heightHalf>1,canMore:height!==null&&d.heightHalf<48};
}
export function shadowYardPairs(work){
 const m=shadowYardModel(work);if(!m)return null;
 let pairs=[];
 if(work.view==='example'&&work.step>=2)pairs=work.step===2?[[3,6]]:[[3,6],[4.5,4]];
 else if(work.view==='build'&&['match','different'].includes(m.result))pairs=[[m.source.A,m.source.C],[m.height,m.source.B]];
 const seen=new Set();return pairs.filter(p=>p.every(n=>Number.isInteger(n)&&n>=1&&n<=12)).filter(p=>{const key=p.join('x');if(seen.has(key))return false;seen.add(key);return true;});
}
export function shadowYardNarration(work){
 const m=shadowYardModel(work);if(!m)return null;
 const words=[];
 if(m.help){words.push(m.waiting,m.help.title,line('step',{number:work.step+1}),m.help.text);}
 else words.push(copy.task,m.source.title,m.source.context,copy.model);
 if(m.picture){const p=m.picture;words.push(`${p.example?copy.exampleGiven:copy.given}.`,line('height',{height:p.A}),line('shadow',{shadow:p.B}),`${p.example?copy.exampleProposed:copy.proposed}.`,p.h===null?(p.example?copy.exampleEmpty:copy.empty):line('height',{height:p.h}),line('shadow',{shadow:p.C}),m.caption);}
 if(work.view==='build')words.push(m.resultText,...m.ratioLines,...m.productLines,m.productLines.length?copy.crossNote:'',m.result==='match'||m.result==='different'?copy.returnPrompt:'');
 else if(work.view==='example'&&work.step===3)words.push(copy.crossNote);
 return words.filter(Boolean).join(' ');
}
