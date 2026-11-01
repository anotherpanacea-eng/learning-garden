// Original351 pure visit state. No notebook, storage, speech or export dependency.
import {makeLetterpressSource} from './letterpress-content.mjs';
export function createLetterpressVisit(){
 const source=makeLetterpressSource();
 return {source,mode:'drawer',selected:'a',chooserOpen:false,contrast:'Aa',label:'cat',wallOpen:false,wall:{},
  letters:Object.fromEntries(source.pairs.map(p=>[p.id,{tool:'model',direction:'capital-target',choice:null}])),
  labels:Object.fromEntries(Object.keys(source.labels).map(id=>[id,{pattern:id,pairsOpen:['cat','pin'].includes(id),posterOpen:false}]))};
}
export const letterpressPair=(v,id=v.selected)=>v.source.pairs.find(p=>p.id===id)||null;
export function letterpressChoices(v){
 const all=v.source.pairs,i=all.findIndex(p=>p.id===v.selected);if(i<0)return [];
 const ids=[i,(i+1)%all.length,(i+2)%all.length].sort((a,b)=>a-b),k=i%3;
 return [...ids.slice(k),...ids.slice(0,k)].map(n=>all[n]);
}
export const letterpressFill=(text,values)=>text.replace(/\{([A-Za-z0-9]+)\}/g,(whole,key)=>Object.hasOwn(values,key)?String(values[key]):whole);
export function letterpressStrip(v,pattern=v.labels[v.label].pattern,id=v.label){
 const names={};for(let i=0;i<3;i++){const p=letterpressPair(v,v.source.labels[id].letters[i]);names['case'+(i+1)]=pattern[i]===p.capital?'capital':'lowercase';names['glyph'+(i+1)]=pattern[i];}
 return letterpressFill(v.source.copy.stripName,names);
}
export const letterpressCapitalWord=(v,id=v.label)=>v.source.labels[id].letters.map(l=>letterpressPair(v,l).capital).join('');
export function letterpressComparison(v){
 const pair=letterpressPair(v),work=v.letters[v.selected],chosen=letterpressPair(v,work.choice);if(!chosen)return null;
 const capital=work.direction==='capital-target',values={targetCase:capital?'capital':'lowercase',target:capital?pair.capital:pair.lowercase,choiceCase:capital?'lowercase':'capital',choice:capital?chosen.lowercase:chosen.capital};
 return {literal:letterpressFill(v.source.copy.literal,values),text:chosen.id===pair.id?v.source.copy.fits:letterpressFill(v.source.copy.other,pair)};
}
function selectLabel(v,id){
 if(!Object.hasOwn(v.labels,id))return null;
 if(v.label===id)return v;
 return {...v,label:id,labels:{...v.labels,[v.label]:{...v.labels[v.label],pairsOpen:false,posterOpen:false}}};
}
export function changeLetterpress(v,action,value){
 if(action==='chooser'&&v.mode==='drawer')return {...v,chooserOpen:!v.chooserOpen};
 if((action==='letter'||action==='next')&&v.mode==='drawer'){
  const id=action==='next'?v.source.pairs[(v.source.pairs.findIndex(p=>p.id===v.selected)+1)%26].id:value;
  return letterpressPair(v,id)?{...v,selected:id,chooserOpen:false}:null;
 }
 if(action==='look'&&v.mode==='drawer')return {...v,mode:'contrast'};
 if(action==='print'&&v.mode==='drawer')return {...v,mode:'print'};
 if(action==='back'&&v.mode!=='drawer')return {...v,mode:'drawer'};
 if(action==='contrast'&&v.mode==='contrast')return Object.hasOwn(v.source.copy.contrasts,value)?{...v,contrast:value}:null;
 if(v.mode==='drawer'){
  const work=v.letters[v.selected];let next;
  if(action==='try'||action==='model')next={...work,tool:action};
  else if(action==='flip'&&work.tool==='try')next={...work,direction:work.direction==='capital-target'?'lowercase-target':'capital-target',choice:null};
  else if(action==='choose'&&work.tool==='try'&&letterpressChoices(v).some(p=>p.id===value))next={...work,choice:value};
  else return null;
  return {...v,letters:{...v.letters,[v.selected]:next}};
 }
 if(v.mode!=='print')return null;
 if(action==='label')return selectLabel(v,value);
 if(action==='wallSelect')return Object.hasOwn(v.wall,value)?selectLabel(v,value):null;
 if(action==='wall')return {...v,wallOpen:!v.wallOpen};
 const work=v.labels[v.label];
 if(action==='pin')return {...v,wallOpen:true,wall:{...v.wall,[v.label]:work.pattern}};
 let next;
 if(action==='place'){
  if(!Number.isInteger(value)||value<0||value>2)return null;
  const p=letterpressPair(v,v.source.labels[v.label].letters[value]),glyph=work.pattern[value]===p.lowercase?p.capital:p.lowercase;
  next={...work,pattern:work.pattern.slice(0,value)+glyph+work.pattern.slice(value+1)};
 }else if(action==='all'&&['capital','lowercase'].includes(value))next={...work,pattern:v.source.labels[v.label].letters.map(id=>letterpressPair(v,id)[value]).join('')};
 else if(action==='pairs')next={...work,pairsOpen:!work.pairsOpen};
 else if(action==='poster')next={...work,posterOpen:true};
 else if(action==='posterBack')next={...work,posterOpen:false};
 else return null;
 return {...v,labels:{...v.labels,[v.label]:next}};
}
