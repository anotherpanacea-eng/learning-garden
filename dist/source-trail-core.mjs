import {sourceTrailPages,sourceTrailSource} from './source-trail-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),positive=x=>Number.isSafeInteger(x)&&x>0,text=(x,max)=>typeof x==='string'&&x.length<=max,id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,60}$/.test(x),cardIds=['photo','note','dates'],codes=['help','audio','together'];
const support=x=>Array.isArray(x)&&x.length<=3&&x.every(c=>codes.includes(c))&&new Set(x).size===x.length;
const fields=(o,limits)=>object(o)&&Object.entries(limits).every(([key,max])=>text(o[key],max));
const card=o=>fields(o,{title:180,kind:100,text:2000,provenance:2000,creator:180,creationLabel:500,eventLabel:500,notice:2000,url:2000})&&cardIds.includes(o.id);
const photo=o=>fields(o,{src:500,filename:500,alt:2000,credit:500,license:180,licenseUrl:2000,url:2000,manifest:2000,inventory:180,reproduction:2000});
export function validTrailSource(s){return fields(s,{title:180,prompt:1000,help:5000,feedback:6000})&&s.version===1&&id(s.id)&&positive(s.pictureVersion)&&photo(s.photo)&&Array.isArray(s.cards)&&s.cards.length===3&&s.cards.every(card)&&new Set(s.cards.map(c=>c.id)).size===3&&Array.isArray(s.choices)&&s.choices.length>=2&&s.choices.length<=8&&s.choices.every(c=>object(c)&&id(c.id)&&text(c.label,1600))&&new Set(s.choices.map(c=>c.id)).size===s.choices.length&&s.choices.some(c=>c.id==='unsure')&&s.answerId!=='unsure'&&s.choices.some(c=>c.id===s.answerId);}
const answer=(s,x)=>x===null||s.choices.some(c=>c.id===x),input=(s,x)=>object(x)&&answer(s,x.answer)&&support(x.support);
export function validTrailCheck(c){return object(c)&&validTrailSource(c.source)&&input(c.source,c.input)&&(c.outcome===null||typeof c.outcome==='boolean')&&(c.selectedLabel===null||text(c.selectedLabel,1600))&&text(c.feedback,6500);}
export function validTrailRound(r){return object(r)&&positive(r.id)&&validTrailSource(r.source)&&input(r.source,r)&&cardIds.includes(r.card)&&typeof r.familiar==='boolean'&&Array.isArray(r.checks)&&r.checks.length<=8&&r.checks.every(validTrailCheck);}
export function trailView(state){
 const root=state.sourceTrail,base={root,rounds:[],earlier:[],current:null,page:'cards'};
 if(root===undefined)return {...base,status:'missing'};
 if(!object(root)||root.version!==1||!sourceTrailPages.includes(root.page)||!positive(root.current)||!positive(root.nextId)||!Array.isArray(root.seen)||!root.seen.every(id)||new Set(root.seen).size!==root.seen.length||!Array.isArray(root.rounds))return {...base,status:'unavailable'};
 const rounds=[],earlier=[],used=new Set();for(const r of root.rounds){if(validTrailRound(r)&&!used.has(r.id)){rounds.push(r);used.add(r.id);}else earlier.push(r);}
 return {...base,status:'ready',rounds,earlier,current:rounds.find(r=>r.id===root.current)||null,page:root.page};
}
export function startTrail(state,questionId){
 const source=sourceTrailSource(questionId),v=trailView(state);if(!source||v.status==='unavailable')return null;
 const root=v.root||{version:1,page:'cards',current:1,nextId:1,seen:[],rounds:[]};let next=root.nextId;
 for(const r of root.rounds){if(!object(r)||typeof r.id!=='number'||r.id<=0)continue;if(!Number.isFinite(r.id)||r.id>=Number.MAX_SAFE_INTEGER)return null;next=Math.max(next,Math.floor(r.id)+1);}
 if(!positive(next)||next>=Number.MAX_SAFE_INTEGER)return null;
 const round={id:next,source,answer:null,card:({origin:'note',observation:'photo',independence:'note',reply:'dates'})[questionId],familiar:root.seen.includes(source.id),support:[],checks:[]},drop=new Set(v.rounds.slice(0,Math.max(0,v.rounds.length-11)));
 root.rounds=root.rounds.filter(r=>!drop.has(r));root.rounds.push(round);root.current=next;root.nextId=next+1;root.page='cards';if(!root.seen.includes(source.id))root.seen.push(source.id);state.sourceTrail=root;return round;
}
const active=state=>trailView(state).current;
export function resumeTrail(state,id){const v=trailView(state);if(!v.rounds.some(r=>r.id===id))return false;v.root.current=id;return true;}
export function setTrailPage(state,page){const v=trailView(state);if(v.status!=='ready'||!v.current||!sourceTrailPages.includes(page))return false;v.root.page=page;return true;}
export function setTrailCard(state,card){const r=active(state);if(!r||!cardIds.includes(card))return false;r.card=card;return true;}
export function chooseTrailAnswer(state,value){const r=active(state);if(!r||!answer(r.source,value))return false;r.answer=value;return true;}
export function addTrailSupport(state,code){const r=active(state);if(!r||!codes.includes(code))return false;if(!r.support.includes(code))r.support.push(code);return true;}
export function evaluateTrail(source,proposed){
 if(!validTrailSource(source)||!input(source,proposed))return null;
 const outcome=proposed.answer===null||proposed.answer==='unsure'?null:proposed.answer===source.answerId,selectedLabel=proposed.answer===null?null:source.choices.find(c=>c.id===proposed.answer).label;
 const prefix=outcome===null?'No definite response is recorded. ':outcome?'This supplied choice fits the declared source trail. ':'This choice differs from the declared source trail and can be revised. ';
 return {source:structuredClone(source),input:{answer:proposed.answer,support:[...proposed.support]},outcome,selectedLabel,feedback:prefix+source.feedback};
}
export function checkTrail(state){const r=active(state);if(!r)return null;const c=evaluateTrail(r.source,r);if(!c)return null;r.checks.push(c);r.checks=r.checks.slice(-8);state.sourceTrail.page='kept';return c;}
export function trailCheckMatches(r,c=r.checks.at(-1)){return !!c&&JSON.stringify(c.source)===JSON.stringify(r.source)&&JSON.stringify(c.input)===JSON.stringify({answer:r.answer,support:r.support});}
