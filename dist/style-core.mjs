// Spec 322 §3: the one writer and the one reader of garden.style.
import {recoveryFitsProgressLimits} from './progress-limits.mjs';
export const STYLES=Object.freeze(['storybook','field-journal']);
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
export function styleOf(state){
 const g=state?.garden;
 return plain(g)&&g.style==='field-journal'?'field-journal':'storybook';
}
// Returns 'saved' after a write, or the reason nothing was written: 'same', 'unreadable' or 'report-safety'.
// An unreadable garden is declined, never replaced. The change is tried on a whole copy of the notebook first,
// and the notebook is written only when that copy fits the recovery limits and canExport returns exactly true.
export function chooseStyle(state,style,canExport){
 if(!state||!STYLES.includes(style))return 'unreadable';
 if(state.garden!==undefined&&!plain(state.garden))return 'unreadable';
 if(state.garden?.style===style)return 'same';
 try{
  const proposal=state.garden===undefined?{}:structuredClone(state.garden);proposal.style=style;
  const candidate=structuredClone(state);candidate.garden=structuredClone(proposal);
  if(typeof canExport!=='function'||!recoveryFitsProgressLimits(candidate)||canExport(candidate)!==true)return 'report-safety';
  if(state.garden===undefined)state.garden=proposal;else state.garden.style=style;
  return 'saved';
 }catch{return 'report-safety';}
}
