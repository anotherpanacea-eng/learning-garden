import {configurations} from './workshop-core.mjs';
import {pages,missions,predictionChoices,claimChoices} from './fair-test-content.mjs';

const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const positive=x=>Number.isSafeInteger(x)&&x>0;
const config=id=>configurations.find(c=>c.id===id);
const choice=(list,id)=>id===null||list.some(x=>x.id===id);
const sides=['A','B'],supportCodes=['help','audio','together'];
const sameTrial=(a,b)=>a?.side===b?.side&&a?.index===b?.index;

// Historical observations are bounded data, never recomputed against today's model.
export function validFairInvestigation(i){
 if(!object(i)||!positive(i.id)||!missions.some(m=>m.id===i.mission)||!config(i.a)||!config(i.b)||!choice(predictionChoices,i.prediction)||!choice(claimChoices,i.claim)||typeof i.predictionAfterResults!=='boolean'||typeof i.familiar!=='boolean'||typeof i.kept!=='boolean'||typeof i.note!=='string'||i.note.length>800||!Array.isArray(i.support)||i.support.length>3||!i.support.every(s=>supportCodes.includes(s))||new Set(i.support).size!==i.support.length||!Array.isArray(i.trials)||i.trials.length>6)return false;
 const seen=new Set();
 for(const t of i.trials){
  if(!object(t)||!sides.includes(t.side)||![1,2,3].includes(t.index)||t.setup!==i[t.side.toLowerCase()]||!Number.isInteger(t.distance)||t.distance<0||t.distance>30||t.unit!=='model-cm'||t.source!=='authored-ramp')return false;
  const key=`${t.side}${t.index}`;if(seen.has(key))return false;seen.add(key);
 }
 return i.selected===null||object(i.selected)&&i.trials.some(t=>sameTrial(t,i.selected));
}

export function fairView(state){
 const r=state.fairTests;
 if(r===undefined)return {status:'missing',root:null,investigations:[],earlier:[],current:null,page:'plan'};
 if(!object(r)||r.version!==1||!pages.includes(r.page)||!positive(r.current)||!positive(r.nextId)||typeof r.seen!=='boolean'||!Array.isArray(r.investigations))return {status:'unavailable',root:r,investigations:[],earlier:[],current:null,page:'plan'};
 const investigations=[],earlier=[],ids=new Set();
 for(const i of r.investigations){if(validFairInvestigation(i)&&!ids.has(i.id)){investigations.push(i);ids.add(i.id);}else earlier.push(i);}
 return {status:'ready',root:r,investigations,earlier,current:investigations.find(i=>i.id===r.current)||investigations.at(-1)||null,page:r.page};
}

export function startFair(state,options={}){
 const before=fairView(state);if(before.status==='unavailable')return null;
 const mission=options.mission??'height',a=options.a??'low-smooth',b=options.b??'low-smooth';
 if(!missions.some(m=>m.id===mission)||!config(a)||!config(b))return null;
 const r=before.root||{version:1,page:'plan',current:1,nextId:1,seen:false,investigations:[]};
 const next=Math.max(r.nextId,...r.investigations.filter(i=>object(i)&&positive(i.id)).map(i=>i.id+1));
 if(!positive(next)||next>=Number.MAX_SAFE_INTEGER)return null;
 const i={id:next,mission,a,b,prediction:null,predictionAfterResults:false,claim:null,note:'',support:[],familiar:r.seen,trials:[],selected:null,kept:false};
 // Only this explicit new-investigation action can evict readable history.
 const oldIds=new Set(before.investigations.slice(0,Math.max(0,before.investigations.length-11)).map(i=>i.id));
 r.investigations=r.investigations.filter(item=>!before.investigations.includes(item)||!oldIds.has(item.id));
 r.investigations.push(i);r.current=i.id;r.nextId=next+1;r.seen=true;r.page='plan';state.fairTests=r;return i;
}

const active=state=>{const v=fairView(state);return v.status==='unavailable'?null:v.current||startFair(state);};
export function setFairPlan(state,key,value){
 if(!['mission','a','b'].includes(key)||(key==='mission'?!missions.some(m=>m.id===value):!config(value)))return 'invalid';
 const i=active(state);if(!i)return 'invalid';if(i[key]===value)return 'changed';
 if(i.trials.length){
  if(fairView(state).investigations.length>=12)return 'capacity';
  const next=startFair(state,{mission:i.mission,a:i.a,b:i.b,[key]:value});return next?'forked':'invalid';
 }
 i[key]=value;i.kept=false;return 'changed';
}
export function setFairPage(state,page){if(!pages.includes(page)||!active(state))return false;state.fairTests.page=page;return true;}
export function setFairPrediction(state,value){if(!choice(predictionChoices,value))return false;const i=active(state);if(!i)return false;i.prediction=value;i.predictionAfterResults||=i.trials.length>0;i.kept=false;return true;}
export function setFairClaim(state,value){if(!choice(claimChoices,value))return false;const i=active(state);if(!i)return false;i.claim=value;i.kept=false;return true;}
export function setFairNote(state,text){if(typeof text!=='string'||text.length>800)return false;const i=active(state);if(!i)return false;i.note=text;i.kept=false;return true;}
export function addFairSupport(state,code){if(!supportCodes.includes(code))return false;const i=active(state);if(!i)return false;if(!i.support.includes(code))i.support.push(code);return true;}
export function revealFair(state,side){
 if(!sides.includes(side))return null;const i=active(state);if(!i)return null;
 const index=[1,2,3].find(n=>!i.trials.some(t=>t.side===side&&t.index===n));if(!index)return null;
 const setup=i[side.toLowerCase()],distance=config(setup).distances[index-1],t={side,index,setup,distance,unit:'model-cm',source:'authored-ramp'};
 i.trials.push(t);i.selected={side,index};i.kept=false;return t;
}
export function selectFairTrial(state,side,index){const i=active(state);if(!i||!i.trials.some(t=>t.side===side&&t.index===index))return false;i.selected={side,index};return true;}
export function resumeFair(state,id){const v=fairView(state);if(!v.investigations.some(i=>i.id===id))return false;v.root.current=id;return true;}
export function keepFair(state){const i=active(state);if(!i)return false;i.kept=true;return true;}

export function designFor(i){
 const a=config(i.a),b=config(i.b),changed=['height','surface'].filter(k=>a[k]!==b[k]);
 return {code:changed.length===0?'same':changed.length===2?'confounded':changed[0]===i.mission?'focused':'wrong-factor',changed};
}
export function evidenceFor(i){
 const rows=Object.fromEntries(sides.map(side=>[side,i.trials.filter(t=>t.side===side).map(t=>t.distance)]));
 const counts={A:rows.A.length,B:rows.B.length};
 const ranges=Object.fromEntries(sides.map(side=>[side,rows[side].length?{min:Math.min(...rows[side]),max:Math.max(...rows[side])}:null]));
 const variation=Object.fromEntries(sides.map(side=>[side,rows[side].length<2?null:ranges[side].min!==ranges[side].max]));
 const status=!counts.A||!counts.B?'missing':counts.A!==counts.B?'unbalanced':ranges.A.min>ranges.B.max?'A':ranges.B.min>ranges.A.max?'B':'overlap';
 return {counts,ranges,status,variation,design:designFor(i).code};
}
