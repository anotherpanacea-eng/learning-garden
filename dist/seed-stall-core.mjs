import {recoveryFitsProgressLimits} from './progress-limits.mjs';

const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.hasOwn(x,k);
const safe=x=>Number.isSafeInteger(x)&&x>0;
const copy=structuredClone;
const marks=['sun','moon'];
const predictions=['sun','moon','same','unsure'];
const text=(x,max)=>typeof x==='string'&&x.trim().length>0&&new TextEncoder().encode(x).length<=max;
const mark=x=>marks.includes(x);
const sourceLabels={sun:'Sun',moon:'Moon'};
const predictionLabels={sun:'More sun marks',moon:'More moon marks',same:'The same number',unsure:'Not sure yet',none:'No prediction'};
const rule='This is a screen draw. Each of the six pictured seeds has the same chance each time. We return the seed before the next draw.';
const prompt='In six draws, what do you think might appear more often?';
const explanation=sun=>sun===0?'Only moon marks are in this bag. Every screen draw will show moon.':sun===6?'Only sun marks are in this bag. Every screen draw will show sun.':sun===3?'Both marks have the same chance on each draw. Six draws need not end in a tie.':sun<3?'Moon is more likely on each draw. Six draws need not match a guess about their final counts.':'Sun is more likely on each draw. Six draws need not match a guess about their final counts.';

export function seedSource(sun){
 if(!Number.isInteger(sun)||sun<0||sun>6)return null;
 return {model:'uniform-return-six-v1',slots:[...Array(sun).fill('sun'),...Array(6-sun).fill('moon')],labels:{...sourceLabels},rule,explanation:explanation(sun),predictionPrompt:prompt,predictionLabels:{...predictionLabels}};
}
export function validSeedSource(s){
 return object(s)&&s.model==='uniform-return-six-v1'&&Array.isArray(s.slots)&&s.slots.length===6&&s.slots.every(mark)&&object(s.labels)&&marks.every(k=>text(s.labels[k],64))&&text(s.rule,320)&&text(s.explanation,240)&&text(s.predictionPrompt,160)&&object(s.predictionLabels)&&[...predictions,'none'].every(k=>text(s.predictionLabels[k],80));
}
export function validSeedRun(r,s){
 return object(r)&&own(r,'prediction')&&(r.prediction===null||predictions.includes(r.prediction))&&Array.isArray(r.draws)&&r.draws.length<=6&&r.draws.every(x=>mark(x)&&s.slots.includes(x));
}
export function validSeedInvestigation(x){
 if(!object(x)||!safe(x.id)||!validSeedSource(x.source)||!Array.isArray(x.runs)||x.runs.length<1||x.runs.length>3||!x.runs.every(r=>validSeedRun(r,x.source)))return false;
 return x.runs.slice(0,-1).every(r=>r.draws.length===6);
}
export function seedView(state){
 if(!own(state,'seedStall'))return {status:'missing',root:null,readable:[],unreadable:[],current:null};
 const root=state.seedStall;
 if(!object(root)||root.version!==1||!(root.current===null||safe(root.current))||!safe(root.nextId)||!Array.isArray(root.investigations))return {status:'recovery',root,readable:[],unreadable:[],current:null};
 const ids=new Map();for(const x of root.investigations)if(safe(x?.id))ids.set(x.id,(ids.get(x.id)||0)+1);
 const readable=[],unreadable=[];
 root.investigations.forEach((entry,index)=>(validSeedInvestigation(entry)&&ids.get(entry.id)===1?readable:unreadable).push({entry,index}));
 const current=readable.find(x=>x.entry.id===root.current)?.entry||null;
 return {status:'ready',root,readable,unreadable,current};
}
export function seedCounts(draws){return {sun:draws.filter(x=>x==='sun').length,moon:draws.filter(x=>x==='moon').length};}
export function seedReplacement(view){return view.status==='ready'&&view.readable.length>=8?view.readable[0]:null;}
function fits(state,root,canExport){
 const candidate={...state,seedStall:root};
 try{return recoveryFitsProgressLimits(candidate)&&canExport(candidate)===true;}catch{return false;}
}
function nextId(root){
 let highest=root.nextId-1;
 for(const entry of root.investigations)if(safe(entry?.id)&&entry.id>highest)highest=entry.id;
 const next=highest+1;
 return safe(next)&&next<Number.MAX_SAFE_INTEGER?next:null;
}
export function startSeed(state,sun,replaceId=null,canExport=()=>true){
 const source=seedSource(sun),view=seedView(state);if(!source||view.status==='recovery')return false;
 const replacement=seedReplacement(view);
 if((replacement?.entry.id??null)!==replaceId)return false;
 const root=view.status==='missing'?{version:1,current:null,nextId:1,investigations:[]}:copy(view.root);
 const id=nextId(root);if(id===null)return false;
 if(replacement)root.investigations.splice(replacement.index,1);
 root.investigations.push({id,source,runs:[{prediction:null,draws:[]}]});root.current=id;root.nextId=id+1;
 if(!fits(state,root,canExport))return false;
 state.seedStall=root;return {id,replaced:replaceId};
}
function change(state,update,canExport=()=>true){
 const v=seedView(state);if(v.status!=='ready'||!v.current)return false;
 const root=copy(v.root),entry=root.investigations.find(x=>x?.id===v.current.id);
 if(!entry||update(root,entry)===false||!fits(state,root,canExport))return false;
 state.seedStall=root;return true;
}
export function chooseSeedPrediction(state,prediction,canExport=()=>true){
 if(prediction!==null&&!predictions.includes(prediction))return false;
 return change(state,(_root,entry)=>{const run=entry.runs.at(-1);if(run.draws.length)return false;run.prediction=prediction;},canExport);
}
export function drawSeed(state,slot,canExport=()=>true){
 if(!Number.isInteger(slot)||slot<0||slot>5)return false;
 return change(state,(_root,entry)=>{const run=entry.runs.at(-1);if(run.draws.length>=6)return false;run.draws.push(entry.source.slots[slot]);},canExport);
}
export function repeatSeed(state,canExport=()=>true){
 return change(state,(_root,entry)=>{if(entry.runs.length>=3||entry.runs.at(-1).draws.length!==6)return false;entry.runs.push({prediction:null,draws:[]});},canExport);
}
export function resumeSeed(state,id,canExport=()=>true){
 const v=seedView(state);if(v.status!=='ready'||!v.readable.some(x=>x.entry.id===id))return false;
 const root=copy(v.root);root.current=id;if(!fits(state,root,canExport))return false;state.seedStall=root;return true;
}
export function recoverSeed(state,canExport=()=>true){
 const v=seedView(state);if(v.status!=='recovery')return false;
 const root={version:1,current:null,nextId:1,investigations:[],recovered:copy(state.seedStall)};
 if(!fits(state,root,canExport))return false;state.seedStall=root;return true;
}
// Rejection sampling avoids favoring the first positions when 2^32 is not divisible by six.
export function browserSeedSlot(random=globalThis.crypto){
 if(!random||typeof random.getRandomValues!=='function')return null;
 const values=new Uint32Array(1),limit=Math.floor(4294967296/6)*6;
 try{for(let attempt=0;attempt<32;attempt++){random.getRandomValues(values);if(values[0]<limit)return values[0]%6;}return null;}catch{return null;}
}
