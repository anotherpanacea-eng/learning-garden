import {clockPages,clockSource} from './preparation-clock-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),positive=x=>Number.isSafeInteger(x)&&x>0,text=(x,max)=>typeof x==='string'&&x.length<=max,id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,60}$/.test(x);
const slot=x=>Number.isInteger(x)&&x>=0&&x<24,maybeBool=x=>x===null||typeof x==='boolean',codes=['help','audio','together','digital'];
const support=x=>Array.isArray(x)&&x.length<=4&&x.every(c=>codes.includes(c))&&new Set(x).size===x.length;
const setting=x=>x===null||['clock','unsure'].includes(x);
export const clockLabel=s=>slot(s)?`${Math.floor(s/2)||12}:${s%2?'30':'00'}`:null;
export function clockPictureText(s){if(!slot(s))return null;const h=Math.floor(s/2)||12,next=h===12?1:h+1;return `The short hour hand ${s%2?`lies halfway from ${h} toward ${next}`:`points at ${h}`}; the long minute hand points at ${s%2?6:12}.`;}
function denotes(label,s){if(typeof label!=='string'||!/^(?:0?[1-9]|1[0-2]):(?:00|30)$/.test(label))return false;const [h,m]=label.split(':').map(Number);return (h%12)*2+m/30===s;}
export function validClockSource(s){return object(s)&&s.version===1&&id(s.id)&&text(s.title,180)&&text(s.story,1800)&&text(s.readingPrompt,500)&&text(s.settingPrompt,500)&&slot(s.preparationSlot)&&slot(s.departureSlot)&&denotes(s.departureLabel,s.departureSlot)&&Array.isArray(s.readingOptions)&&s.readingOptions.length===3&&s.readingOptions.every(o=>object(o)&&slot(o.slot)&&denotes(o.label,o.slot))&&new Set(s.readingOptions.map(o=>o.slot)).size===3&&s.readingOptions.some(o=>o.slot===s.preparationSlot)&&text(s.pictureText,1600)&&positive(s.drawingVersion)&&s.slotMinutes===30&&s.hourMinutes===60&&s.cycleSlots===24&&text(s.help,4000);}
const reading=(s,x)=>x===null||x==='unsure'||s.readingOptions.some(o=>o.slot===x);
export const readingLabel=(s,x)=>s.readingOptions.find(o=>o.slot===x)?.label??null;
const input=(s,i)=>object(i)&&reading(s,i.reading)&&slot(i.position)&&setting(i.settingChoice)&&support(i.support);
export function validClockCheck(c){return object(c)&&validClockSource(c.source)&&input(c.source,c.input)&&maybeBool(c.readingMatch)&&maybeBool(c.settingMatch)&&typeof c.fulfilled==='boolean'&&(c.readingLabel===null||text(c.readingLabel,80))&&text(c.modelLabel,80)&&text(c.readingPictureText,1600)&&text(c.modelPictureText,1600)&&text(c.feedback,6500);}
export function validClockRound(r){return object(r)&&positive(r.id)&&validClockSource(r.source)&&input(r.source,r)&&typeof r.familiar==='boolean'&&Array.isArray(r.checks)&&r.checks.length<=8&&r.checks.every(validClockCheck);}
export function clockView(state){
 const root=state.preparationClock,base={root,rounds:[],earlier:[],current:null,page:'read'};
 if(root===undefined)return {...base,status:'missing'};
 if(!object(root)||root.version!==1||!clockPages.includes(root.page)||!positive(root.current)||!positive(root.nextId)||!Array.isArray(root.seen)||!root.seen.every(id)||new Set(root.seen).size!==root.seen.length||!Array.isArray(root.rounds))return {...base,status:'unavailable'};
 const rounds=[],earlier=[],used=new Set();for(const r of root.rounds){if(validClockRound(r)&&!used.has(r.id)){rounds.push(r);used.add(r.id);}else earlier.push(r);}
 return {...base,status:'ready',rounds,earlier,current:rounds.find(r=>r.id===root.current)||rounds.at(-1)||null,page:root.page};
}
export function startClock(state,caseId){
 const source=clockSource(caseId),v=clockView(state);if(!source||v.status==='unavailable')return null;
 const root=v.root||{version:1,page:'read',current:1,nextId:1,seen:[],rounds:[]};let next=root.nextId;
 for(const r of root.rounds){if(!object(r)||typeof r.id!=='number'||r.id<=0)continue;if(!Number.isFinite(r.id)||r.id>=Number.MAX_SAFE_INTEGER)return null;next=Math.max(next,Math.floor(r.id)+1);}
 if(!positive(next)||next>=Number.MAX_SAFE_INTEGER)return null;
 const round={id:next,source,reading:null,position:source.preparationSlot,settingChoice:null,familiar:root.seen.includes(source.id),support:[],checks:[]},drop=new Set(v.rounds.slice(0,Math.max(0,v.rounds.length-11)));
 root.rounds=root.rounds.filter(r=>!drop.has(r));root.rounds.push(round);root.current=next;root.nextId=next+1;root.page='read';if(!root.seen.includes(source.id))root.seen.push(source.id);state.preparationClock=root;return round;
}
const active=state=>clockView(state).current;
export function resumeClock(state,id){const v=clockView(state);if(!v.rounds.some(r=>r.id===id))return false;v.root.current=id;return true;}
export function setClockPage(state,page){const v=clockView(state);if(v.status!=='ready'||!clockPages.includes(page))return false;v.root.page=page;return true;}
export function chooseClockReading(state,value){const r=active(state);if(!r||!reading(r.source,value))return false;r.reading=value;return true;}
export function chooseClockSetting(state,value){const r=active(state);if(!r||!setting(value))return false;r.settingChoice=value;return true;}
export function stepClock(state,delta){const r=active(state);if(!r||![-2,-1,1,2].includes(delta))return false;r.position=(r.position+delta+24)%24;r.settingChoice='clock';return true;}
export function addClockSupport(state,code){const r=active(state);if(!r||!codes.includes(code))return false;if(!r.support.includes(code))r.support.push(code);return true;}
export function evaluateClock(source,proposed){
 if(!validClockSource(source)||!input(source,proposed))return null;
 const readingMatch=proposed.reading===null||proposed.reading==='unsure'?null:proposed.reading===source.preparationSlot,settingMatch=proposed.settingChoice!=='clock'?null:proposed.position===source.departureSlot;
 const read=readingLabel(source,proposed.reading),model=clockLabel(proposed.position),readPicture=source.pictureText,modelPicture=source.drawingVersion===1?clockPictureText(proposed.position):`Model clock position: ${model}. This saved drawing version is unavailable.`;
 let feedback=readingMatch===null?'No definite reading was proposed. ':readingMatch?'The reading fits the fixed preparation clock. ':'The reading differs from the fixed preparation clock and can be revised. ';
 feedback+=`The preparation clock shows ${readingLabel(source,source.preparationSlot)}. ${readPicture} `;
 feedback+=settingMatch===null?'No definite model departure was proposed. ':settingMatch?'The proposed model fits the requested departure. ':'The proposed model differs from the requested departure and can be revised. ';
 feedback+=`The requested departure is ${source.departureLabel}. Our retained model position is ${model}. The model supplies coordinated hands; this does not show independent drawing or elapsed-time calculation. These checks provide teaching, not evidence of an unassisted later reading.`;
 return {source:structuredClone(source),input:{reading:proposed.reading,position:proposed.position,settingChoice:proposed.settingChoice,support:[...proposed.support]},readingMatch,settingMatch,fulfilled:readingMatch===true&&settingMatch===true,readingLabel:read,modelLabel:model,readingPictureText:readPicture,modelPictureText:modelPicture,feedback};
}
export function checkClock(state){const r=active(state);if(!r)return null;const c=evaluateClock(r.source,r);if(!c)return null;r.checks.push(c);r.checks=r.checks.slice(-8);state.preparationClock.page='kept';return c;}
export function clockCheckMatches(r,c=r.checks.at(-1)){return !!c&&JSON.stringify(c.source)===JSON.stringify(r.source)&&JSON.stringify(c.input)===JSON.stringify({reading:r.reading,position:r.position,settingChoice:r.settingChoice,support:r.support});}
