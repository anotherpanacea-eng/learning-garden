import {measurementChoiceCodes,measurementCopyKeys,measurementSource,measurementSupportCodes} from './measuring-desk-content.mjs';
import {recoveryFitsProgressLimits} from './progress-limits.mjs';

const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),own=(x,k)=>Object.hasOwn(x,k),copy=structuredClone;
const size=x=>new TextEncoder().encode(x).length;
const line=(x,max)=>typeof x==='string'&&x.trim().length>0&&size(x)<=max&&!/[\u0000-\u001f\u007f-\u009f]/u.test(x);
const safe=x=>Number.isSafeInteger(x)&&x>0;
const raw=x=>typeof x==='string'&&x.length<=24;
const choice=x=>x===null||measurementChoiceCodes.includes(x);
const support=x=>Array.isArray(x)&&new Set(x).size===x.length&&x.every(v=>typeof v==='string'&&measurementSupportCodes.includes(v));
const fields=x=>object(x)&&['first','second','gap'].every(k=>raw(x[k]));
const uniqueCodes=x=>Array.isArray(x)&&x.length===3&&new Set(x.map(c=>c?.code)).size===3&&measurementChoiceCodes.every(code=>x.some(c=>c?.code===code))&&x.every(c=>object(c)&&line(c.label,160));

export function validMeasurementSource(s){
 if(!object(s)||s.version!==1||s.model!=='reported-jug-ml-v1'||s.unit!=='mL'||typeof s.id!=='string'||!/^[a-z][a-z0-9-]{0,63}$/.test(s.id)||!line(s.title,160)||!object(s.copy)||!object(s.labels)||!object(s.drawing)||!Array.isArray(s.credits)||s.credits.length<1||s.credits.length>4)return false;
 if(!measurementCopyKeys.every(k=>line(s.copy[k],1600))||!Array.isArray(s.copy.steps)||s.copy.steps.length!==4||!s.copy.steps.every(x=>line(x,1600))||!uniqueCodes(s.copy.choices))return false;
 if(!['first','second','gap'].every(k=>line(s.labels[k],160)))return false;
 if(!safe(s.drawing.version)||!line(s.drawing.kind,80)||!line(s.drawing.description,1600))return false;
 if(!s.credits.every(c=>object(c)&&line(c.title,160)&&line(c.url,500)&&/^https:\/\/[a-z0-9]/i.test(c.url)&&line(c.role,1600)))return false;
 try{return size(JSON.stringify(s))<=16384;}catch{return false;}
}
export function parseMeasurement(rawValue){
 if(!raw(rawValue))return null;const text=rawValue.trim();if(!/^[0-9]+(?:\.[0-9]{1,3})?$/.test(text))return null;
 const [whole,fraction='']=text.split('.');const n=Number(whole)*1000+Number(fraction.padEnd(3,'0'));
 return Number.isSafeInteger(n)&&n>=0&&n<=2000000?n:null;
}
export function formatMeasurement(milli){if(!Number.isInteger(milli)||milli<0||milli>2000000)return null;const whole=Math.floor(milli/1000),fraction=String(milli%1000).padStart(3,'0').replace(/0+$/,'');return fraction?`${whole}.${fraction}`:String(whole);}
const same=(a,b)=>a===b||Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i]))||object(a)&&object(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>own(b,k)&&same(a[k],b[k]));
const snapshotValid=x=>object(x)&&validMeasurementSource(x.source)&&fields(x.raw)&&choice(x.choice)&&support(x.support)&&own(x,'comparison')&&(!own(x,'earlierRawComparisons')||Array.isArray(x.earlierRawComparisons));
const draftValid=x=>snapshotValid(x)&&['record','compare','kept'].includes(x.page);
const relation=(a,b)=>a===b?'same':a>b?'first':'second';
export function comparisonResult(rawFields,chosen){const a=parseMeasurement(rawFields?.first),b=parseMeasurement(rawFields?.second);if(a===null||b===null||!choice(chosen))return null;const answer=relation(a,b);return {relation:answer,difference:Math.abs(a-b),choiceMatches:chosen===null?null:chosen===answer};}
export function validMeasurementComparison(c){
 if(!object(c)||!validMeasurementSource(c.source)||!fields(c.raw)||!choice(c.choice)||!support(c.support)||!c.support.includes('arithmeticShown')||!line(c.summary,1600)||!line(c.limit,1600))return false;
 const r=comparisonResult(c.raw,c.choice);if(!r||c.relation!==r.relation||c.difference!==r.difference||c.choiceMatches!==r.choiceMatches||c.summary!==c.source.copy[r.relation==='same'?'same':'different']||c.limit!==c.source.copy.limit)return false;
 return size(c.summary)+size(c.limit)<=16384;
}
export function currentMeasurementComparison(draft){const c=draft?.comparison;return validMeasurementComparison(c)&&same(c.raw,draft.raw)&&c.choice===draft.choice&&same(c.support,draft.support)&&same(c.source,draft.source)?c:null;}
export function measurementView(state){
 if(!own(state,'measurementNotes'))return {status:'absent',entries:[],rawEntries:[]};const root=state.measurementNotes;
 if(!object(root)||root.version!==1||!draftValid(root.draft)||!Array.isArray(root.entries)||!safe(root.nextId))return {status:'recovery',raw:root,reason:'unreadable'};
 const entries=[],rawEntries=[],seen=new Set();let maxId=root.nextId-1;
 root.entries.forEach((item,index)=>{if(safe(item?.id))maxId=Math.max(maxId,item.id);if(!object(item)||!safe(item.id)||!snapshotValid(item.snapshot)||seen.has(item.id)){rawEntries.push({index,raw:item});return;}seen.add(item.id);entries.push({index,entry:item});});
 if(maxId>=Number.MAX_SAFE_INTEGER)return {status:'recovery',raw:root,reason:'ids-exhausted',entries,rawEntries};
 return {status:'ready',root,draft:root.draft,entries,rawEntries,nextId:maxId+1,current:currentMeasurementComparison(root.draft),comparisonUnreadable:root.draft.comparison!==null&&!validMeasurementComparison(root.draft.comparison)};
}
export const freshMeasurementDraft=()=>({source:measurementSource(),page:'record',raw:{first:'',second:'',gap:''},choice:null,support:[],comparison:null});
export const freshMeasurementRoot=()=>({version:1,draft:freshMeasurementDraft(),entries:[],nextId:1});
export function startMeasurement(state){if(own(state,'measurementNotes'))return false;state.measurementNotes=freshMeasurementRoot();return true;}
export function recoverMeasurement(state){if(!own(state,'measurementNotes')||measurementView(state).status==='ready')return false;state.measurementNotes={...freshMeasurementRoot(),retainedRaw:copy(state.measurementNotes)};return true;}
const active=state=>{const v=measurementView(state);return v.status==='ready'?v.draft:null;};
export function setMeasurementPage(state,page){const d=active(state);if(!d||!['record','compare','kept'].includes(page))return false;d.page=page;return true;}
export function editMeasurementRaw(state,key,value){const d=active(state);if(!d||!['first','second','gap'].includes(key)||!raw(value))return false;d.raw[key]=value;return true;}
export function chooseMeasurementRelation(state,value){const d=active(state);if(!d||!choice(value))return false;d.choice=value;return true;}
export function useMeasurementSupport(state,key){const d=active(state);if(!d||!['help','narrationRequested','together'].includes(key))return false;if(!d.support.includes(key))d.support.push(key);return true;}
export function compareMeasurement(state,replaceMalformed=false){const d=active(state);if(!d)return false;const result=comparisonResult(d.raw,d.choice);if(!result)return false;
 if(d.comparison!==null&&!validMeasurementComparison(d.comparison)){if(!replaceMalformed)return false;if(!Array.isArray(d.earlierRawComparisons))d.earlierRawComparisons=[];d.earlierRawComparisons.push(copy(d.comparison));}
 if(!d.support.includes('arithmeticShown'))d.support.push('arithmeticShown');const c={source:copy(d.source),raw:copy(d.raw),choice:d.choice,support:[...d.support],...result,summary:d.source.copy[result.relation==='same'?'same':'different'],limit:d.source.copy.limit};if(!validMeasurementComparison(c))return false;d.comparison=c;d.page='compare';return true;
}
const entrySnapshot=d=>{const s=copy(d);delete s.page;return s;};
function appendMeasurement(root){let id=root.nextId;for(const entry of root.entries)if(safe(entry?.id))id=Math.max(id,entry.id+1);if(!safe(id)||id>=Number.MAX_SAFE_INTEGER)return false;root.entries.push({id,snapshot:entrySnapshot(root.draft)});root.nextId=id+1;return id;}
export function keepMeasurement(state,newPair=false){const v=measurementView(state);if(v.status!=='ready')return false;const id=appendMeasurement(v.root);if(!id)return false;if(newPair)v.root.draft=freshMeasurementDraft();else v.root.draft.page='kept';return id;}
export function commitMeasurement(state,mutate,canExport=()=>true){let candidate;try{candidate=copy(state);}catch{return false;}if(!mutate(candidate)||!recoveryFitsProgressLimits(candidate)||!canExport(candidate))return false;state.measurementNotes=candidate.measurementNotes;return true;}
