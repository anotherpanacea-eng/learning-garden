import {validPostRival,validBrambleNotebook,rivalBlocks} from './post-rival.mjs';
import {POST_REVISION,places,recipients,deliveries,courierPresets,courierPronouns} from './post-office-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const integer=(x,min=0)=>Number.isSafeInteger(x)&&x>=min;
const clone=x=>JSON.parse(JSON.stringify(x));
const place=id=>places.some(p=>p.id===id);
const recipient=id=>recipients.some(r=>r.id===id);
const readings=new Set(['unobserved','together','independent']);
const statuses=new Set(['ready','running','clarify','delivered','ended']);
const idNumber=id=>typeof id==='string'&&/^post-\d+$/.test(id)?Number(id.slice(5)):0;
const validClause=id=>typeof id==='string'&&(id==='there'||/^(go|then):/.test(id)&&place(id.split(':')[1])&&id.split(':').length===2||id.startsWith('give:')&&recipient(id.slice(5)));
const closedReason='This saved delivery cannot safely continue with this version. Its exact work is kept; choose a fresh delivery to try again.';
function close(v){v.closed=true;v.closedReason=closedReason;return v;}
function validPictures(m){
 const groups=m.pictures?.groups;if(!Array.isArray(groups)||groups.length>12||!groups.every(g=>object(g)&&typeof g.label==='string'&&integer(g.count)&&g.count<=12&&(!('reserved'in g)||integer(g.reserved)&&g.reserved<=g.count)))return false;
 if(m.pictures.kind!==m.kind)return false;
 if(m.kind==='add')return groups.length===2&&groups[0].count===m.a&&groups[1].count===m.b&&groups.every(g=>!g.reserved);
 if(m.kind==='subtract')return groups.length===1&&groups[0].count===m.a&&groups[0].reserved===m.b;
 return groups.length===m.a&&groups.every(g=>g.count===m.b&&!g.reserved);
}
function validOrder(o){
 if(!object(o)||typeof o.id!=='string'||typeof o.title!=='string'||typeof o.request!=='string'||o.start!=='post'||!recipient(o.recipient)||!place(o.destination)||!object(o.math)||!object(o.helper))return false;
 const m=o.math,h=o.helper;
 return ['add','subtract','multiply'].includes(m.kind)&&integer(m.a,1)&&m.a<=12&&integer(m.b,1)&&m.b<=12&&integer(m.answer)&&m.answer<=144&&m.answer===(m.kind==='add'?m.a+m.b:m.kind==='subtract'?m.a-m.b:m.a*m.b)&&typeof m.unit==='string'&&typeof m.prompt==='string'&&typeof m.explanation==='string'&&object(m.pictures)&&validPictures(m)&&place(h.destination)&&h.destination!==o.destination&&recipient(h.recipient)&&h.recipient!==o.recipient&&Array.isArray(h.clauses)&&h.clauses.length===2&&h.clauses[0]===`go:${h.destination}`&&h.clauses[1]===`give:${h.recipient}`;
}
function validVisit(v){
 if('rival'in v&&!validPostRival(v.rival))return false;
 if('rivalLegacy'in v&&(v.rivalLegacy?.revision!=='bramble-1'||!validPostRival(v.rivalLegacy)||!['resolved','continued','bypassed'].includes(v.rivalLegacy.phase)))return false;
 if(v.revision!==POST_REVISION||!validOrder(v.order)||!object(v.recipientLocations)||!recipients.every(r=>place(v.recipientLocations[r.id]))||v.recipientLocations[v.order.recipient]!==v.order.destination)return false;
 if(!object(v.composer)||!place(v.composer.place)||!recipient(v.composer.recipient))return false;
 if(!Array.isArray(v.clauses)||v.clauses.length>6||!v.clauses.every(validClause)||!object(v.packing)||!object(v.playback)||!object(v.support))return false;
 const p=v.packing,r=v.playback;
 if(r.cursor>0&&!p.packed||r.status==='delivered'&&!v.completed||r.status==='ready'&&(r.cursor!==0||r.active!==null||r.location!==v.order.start||r.referent!==null))return false;
 return typeof p.input==='string'&&Array.isArray(p.attempts)&&p.attempts.length<=24&&p.attempts.every(a=>object(a)&&typeof a.input==='string'&&(a.value===null||typeof a.value==='number'&&Number.isFinite(a.value))&&typeof a.correct==='boolean')&&typeof p.packed==='boolean'&&typeof p.supported==='boolean'&&typeof p.error==='string'&&typeof p.feedback==='string'&&integer(r.cursor)&&r.cursor<=v.clauses.length&&place(r.location)&&(r.referent===null||place(r.referent))&&statuses.has(r.status)&&typeof r.feedback==='string'&&(r.active===null||integer(r.active)&&r.active<v.clauses.length)&&Array.isArray(r.log)&&r.log.length<=6&&r.log.every(x=>typeof x==='string')&&(v.prediction===null||place(v.prediction))&&typeof v.predictionAfterSupport==='boolean'&&typeof v.support.helper==='boolean'&&typeof v.support.audioRequested==='boolean'&&readings.has(v.reading)&&integer(v.revisions)&&Array.isArray(v.checks)&&v.checks.length<=24&&v.checks.every(object)&&typeof v.completed==='boolean'&&integer(v.helperStep)&&v.helperStep<=2;
}
function fresh(){return {version:1,current:null,nextVisit:1,courier:'witch',courierAvatar:'fern',courierPronouns:'she/her',visits:[]};}
function trim(p){if(p.visits.length>24){const current=p.visits.find(v=>v.id===p.current),latest=p.visits.slice(-24);if(current&&!latest.includes(current))latest[0]=current;p.visits=latest;}}
export function ensurePostOffice(state){
 if(!('postOffice'in state)){state.postOffice=fresh();return state.postOffice;}
 let p=state.postOffice;
 if(!object(p)||p.version!==1||!Array.isArray(p.visits)||!(p.current===null||typeof p.current==='string')||!courierPresets.some(c=>c.id===p.courier)||'courierAvatar'in p&&!['fern','reed','sky'].includes(p.courierAvatar)||'courierPronouns'in p&&!courierPronouns.includes(p.courierPronouns)||!validBrambleNotebook(p)){
  const payload=clone(p);p=fresh();p.kept={reason:'This saved Post Office uses an unavailable or unreadable format. Its complete original payload is kept here.',payload};state.postOffice=p;return p;
 }
 let next=Math.max(integer(p.nextVisit,1)?p.nextVisit:1,1,...p.visits.filter(object).map(v=>idNumber(v.id)+1));
 const seen=new Set();p.visits=p.visits.map(v=>{
  if(!object(v)||typeof v.id!=='string'||seen.has(v.id)){const wrapped={id:`post-${next++}`,kept:clone(v)};seen.add(wrapped.id);return close(wrapped);}
  seen.add(v.id);if(v.closed===true)return v;
  if(!validVisit(v))return close(v);return v;
 });
 p.nextVisit=next;if(!p.visits.some(v=>v.id===p.current))p.current=null;trim(p);return p;
}
export function currentPostOffice(state){const p=ensurePostOffice(state);return p.visits.find(v=>v.id===p.current)||null;}
const active=state=>{const v=currentPostOffice(state);return v&&!v.closed?v:null;};
const playback=v=>({cursor:0,location:v.order.start,referent:null,status:'ready',feedback:'',active:null,log:[]});
export function startPostOffice(state,deliveryId){
 const order=deliveries.find(d=>d.id===deliveryId);if(!order)return null;
 const p=ensurePostOffice(state);if(p.nextVisit>=Number.MAX_SAFE_INTEGER)return null;
 const v={id:`post-${p.nextVisit++}`,revision:POST_REVISION,order:clone(order),recipientLocations:Object.fromEntries(recipients.map(r=>[r.id,r.place])),composer:{place:'post',recipient:'clover'},clauses:[],packing:{input:'',attempts:[],packed:false,supported:false,error:'',feedback:''},prediction:null,predictionAfterSupport:false,support:{helper:false,audioRequested:false},reading:'unobserved',revisions:0,checks:[],completed:false,helperStep:0};
 v.playback=playback(v);p.visits.push(v);p.current=v.id;trim(p);return v;
}
export function resumePostOffice(state,id){const p=ensurePostOffice(state);if(!p.visits.some(v=>v.id===id))return false;p.current=id;return true;}
export function setPostCourier(state,style){const preset=courierPresets.find(c=>c.id===style);if(!preset)return false;const p=ensurePostOffice(state);p.courier=style;if(preset.avatar){p.courierAvatar=preset.avatar;p.courierPronouns=preset.pronouns;}return true;}
export function setPostCourierPortrait(state,id){if(!['fern','reed','sky'].includes(id))return false;ensurePostOffice(state).courierAvatar=id;return true;}
export function setPostCourierPronouns(state,value){if(!courierPronouns.includes(value))return false;ensurePostOffice(state).courierPronouns=value;return true;}
export function setPostComposer(state,key,value){const v=active(state);if(!v||!(key==='place'&&place(value)||key==='recipient'&&recipient(value)))return false;v.composer[key]=value;return true;}
export function clauseText(id){if(!validClause(id))return 'Unknown instruction';if(id==='there')return 'Go there';if(id.startsWith('give:'))return `Give the parcel to ${recipients.find(r=>r.id===id.slice(5)).name}`;return `${id.startsWith('then:')?'Then go':'Go'} to ${places.find(p=>p.id===id.split(':')[1]).name}`;}
function edited(v){v.revisions++;v.playback=playback(v);}
export function appendPostClause(state,id){const v=active(state);if(!v||v.clauses.length>=6||!validClause(id))return false;v.clauses.push(id);edited(v);return true;}
export function editPostClause(state,index,action){
 const v=active(state);if(!v||!integer(index)||index>=v.clauses.length)return false;
 if(action==='remove')v.clauses.splice(index,1);
 else if(action==='up'&&index>0)[v.clauses[index-1],v.clauses[index]]=[v.clauses[index],v.clauses[index-1]];
 else if(action==='down'&&index<v.clauses.length-1)[v.clauses[index+1],v.clauses[index]]=[v.clauses[index],v.clauses[index+1]];
 else return false;edited(v);return true;
}
export function setPostPackingInput(state,text){const v=active(state);if(!v||typeof text!=='string'||v.packing.packed)return false;v.packing.input=text;v.packing.error='';return true;}
export function submitPostPacking(state){
 const v=active(state);if(!v||v.packing.packed)return false;
 const p=v.packing,trimmed=p.input.trim(),n=trimmed!==''&&/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(trimmed)?Number(trimmed):NaN,correct=Number.isFinite(n)&&n===v.order.math.answer;
 p.attempts.push({input:p.input,value:Number.isFinite(n)?n:null,correct});p.attempts=p.attempts.slice(-24);
 if(correct){p.packed=true;p.error='';p.feedback=`Packed: ${v.order.math.answer} ${v.order.math.unit}.`;}else {p.error='Let’s check the picture together, or try another count.';p.feedback='The parcel is still waiting at the sorting counter.';}
 return true;
}
export function packPostTogether(state){const v=active(state);if(!v||v.packing.packed)return false;v.packing.packed=true;v.packing.supported=true;v.packing.error='';v.packing.feedback=v.order.math.explanation;return true;}
export function restartPostRoute(state){const v=active(state);if(!v)return false;v.playback=playback(v);return true;}
function recordCheck(v){const r=v.playback;v.checks.push({clauses:[...v.clauses],status:r.status,cursor:r.cursor,location:r.location,referent:r.referent,feedback:r.feedback,support:clone(v.support),reading:v.reading});v.checks=v.checks.slice(-24);}
export function stepPostRoute(state){
 const v=active(state);if(!v||rivalBlocks(v))return false;const r=v.playback;
 if(!v.packing.packed){r.feedback='Pack the parcel at the sorting counter first. You can count it or choose Pack together.';return true;}
 if(['clarify','ended','delivered'].includes(r.status))return false;
 if(r.cursor>=v.clauses.length){r.status='ended';r.feedback=v.clauses.length?'Your message has ended. Add an instruction to give the parcel to the requested recipient, or revise the route.':'Add an instruction to tell the courier where to go.';recordCheck(v);return true;}
 const index=r.cursor,id=v.clauses[index];r.cursor++;r.active=index;r.status='running';
 if(id==='there'){
  if(!r.referent){r.status='clarify';r.feedback='Where is “there”? Add an earlier instruction naming a place.';}else{r.location=r.referent;r.feedback=`The courier goes there: ${places.find(p=>p.id===r.location).name}.`;}
 }else if(id.startsWith('go:')||id.startsWith('then:')){
  r.location=id.split(':')[1];r.referent=r.location;r.feedback=`The courier is at ${places.find(p=>p.id===r.location).name}.`;
 }else{
  const who=id.slice(5),name=recipients.find(x=>x.id===who).name;
  if(who!==v.order.recipient){r.status='clarify';r.feedback=`This parcel is for ${recipients.find(x=>x.id===v.order.recipient).name}, not ${name}. Revise the give instruction; the parcel stays with you.`;}
  else if(r.location!==v.order.destination||v.recipientLocations[who]!==r.location){r.status='clarify';r.feedback=`${name} is waiting at ${places.find(p=>p.id===v.recipientLocations[who]).name}. Go there before giving the parcel.`;}
  else {r.status='delivered';r.feedback=`Delivered to ${name}!${r.cursor<v.clauses.length?` The remaining ${v.clauses.length-r.cursor} instruction${v.clauses.length-r.cursor===1?' is':'s are'} unused.`:''}`;if(!v.completed){v.completed=true;recordCheck(v);}}
 }
 r.log.push(`${index+1}. ${clauseText(id)}. ${r.feedback}`);r.log=r.log.slice(-6);
 if(r.status==='clarify')recordCheck(v);
 else if(r.status==='running'&&r.cursor===v.clauses.length){r.status='ended';r.feedback+=' Your message has ended. Add a give instruction if the parcel is still with you.';recordCheck(v);}
 return true;
}
export function setPostPrediction(state,value){const v=active(state);if(!v||value!==null&&!place(value))return false;v.prediction=value;if(v.playback.cursor>0||v.checks.length||v.support.helper||v.support.audioRequested||v.packing.supported)v.predictionAfterSupport=true;return true;}
export function setPostReading(state,mode){const v=active(state);if(!v||!readings.has(mode))return false;v.reading=mode;return true;}
export function setPostSupport(state,key){const v=active(state);if(!v||!['helper','audioRequested'].includes(key))return false;v.support[key]=true;return true;}
export function stepPostHelp(state,action){const v=active(state);if(!v||![1,-1,'reset'].includes(action))return false;v.support.helper=true;v.helperStep=action==='reset'?0:Math.max(0,Math.min(2,v.helperStep+action));return true;}
