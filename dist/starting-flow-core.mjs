import {applyCafeStart,followsCafeStart,effectiveCafeRange} from './cafe-start-core.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
import {parisLengths,frenchLengths} from './reading-amounts.mjs';
export const freshStartingDraft=()=>({math:'keep',reading:'keep',french:'keep'});
export const startingRefusal='These choices could not be updated safely. Your earlier work is unchanged. You can keep exploring or download your notes.';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
export const validStartingDraft=d=>object(d)&&Object.keys(d).length===3&&['math','reading','french'].every(k=>Object.hasOwn(d,k))&&['keep','small','all'].includes(d.math)&&['keep','auto',1,2,3].includes(d.reading)&&['keep','auto',1,2,3].includes(d.french);
export function applyStartingChoices(notebook,draft,canExport){
 try{
  if(!validStartingDraft(draft))return {ok:false,changed:false};
  if(Object.values(draft).every(x=>x==='keep'))return {ok:true,changed:false};
  if(!recoveryFitsProgressLimits(notebook)||!object(notebook.garden)||Object.hasOwn(notebook.garden,'start')&&!object(notebook.garden.start))return {ok:false,changed:false};
  const candidate=structuredClone(notebook),g=candidate.garden;
  if(draft.math!=='keep'&&!(followsCafeStart(candidate)&&effectiveCafeRange(candidate)===draft.math)){
   if(!applyCafeStart(candidate,draft.math==='small'?'sprout':'seedling'))return {ok:false,changed:false};
  }
  for(const k of ['reading','french'])if(draft[k]!=='keep'){g.start||={};g.start[k]=draft[k];}
  if(!recoveryFitsProgressLimits(candidate)||typeof canExport!=='function'||canExport(candidate)!==true)return {ok:false,changed:false};
  const changed=JSON.stringify(notebook)!==JSON.stringify(candidate);
  if(changed){if(Object.hasOwn(g,'start'))notebook.garden.start=g.start;if(draft.math!=='keep'&&Object.hasOwn(g,'cafeStart'))notebook.garden.cafeStart=g.cafeStart;}
  return {ok:true,changed};
 }catch{return {ok:false,changed:false};}
}
export function currentStartingChoice(notebook,k){
 const g=object(notebook?.garden)?notebook.garden:null,s=g&&object(g.start)?g.start:null;
 if(k==='math'){
  const validFollow=followsCafeStart(notebook),local=g&&g.cafeStart!=='follow'&&['small','all'].includes(notebook?.cafe?.range);
  if(validFollow||local)return effectiveCafeRange(notebook)==='small'?'2–4 guests; 2–3 bites each.':'1–12 guests and bites.';
 }else if(g&&(!Object.hasOwn(g,'start')||s&&!Object.hasOwn(s,k)))return 'Use suggestions';
 else if(s){if(s[k]==='auto')return 'Use suggestions';if([1,2,3].includes(s[k]))return (k==='reading'?parisLengths:frenchLengths)[s[k]];}
 return 'Keep existing choices';
}
export function startingDraftDescription(d,k){
 if(d[k]==='keep')return `Keep existing ${k==='math'?'Café':k==='reading'?'English':'French'} choice`;
 if(k==='math')return d.math==='small'?'Smaller orders: 2–4 guests; 2–3 bites each.':'All multiplication facts: 1–12 guests and bites.';
 return d[k]==='auto'?'Use suggestions':(k==='reading'?parisLengths:frenchLengths)[d[k]];
}
