import {foodPages,cardIds,foodSource} from './food-links-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),positive=x=>Number.isSafeInteger(x)&&x>0;
const text=(x,max)=>typeof x==='string'&&x.length<=max,id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,60}$/.test(x);
const card=x=>cardIds.includes(x),meaning=x=>['energy','development','travel'].includes(x),neighbor=x=>x===null||x==='unsure'||card(x),maybeMeaning=x=>x===null||x==='unsure'||meaning(x),maybeBool=x=>x===null||typeof x==='boolean';
const codes=['help','audio','together'],support=x=>Array.isArray(x)&&x.length<=3&&x.every(c=>codes.includes(c))&&new Set(x).size===x.length;
const picture=x=>object(x)&&card(x.id)&&text(x.label,180)&&text(x.scientificName,160)&&text(x.text,1600)&&text(x.pictureText,1600)&&object(x.drawing)&&positive(x.drawing.version)&&id(x.drawing.kind);
const permutation=(xs,pred,n)=>Array.isArray(xs)&&xs.length===n&&xs.every(pred)&&new Set(xs).size===n;
export function validFoodSource(s){
 return object(s)&&s.version===1&&id(s.id)&&id(s.pathId)&&text(s.title,180)&&text(s.question,1000)&&card(s.reference)&&['food','eater'].includes(s.role)&&text(s.legend,1000)&&text(s.overview,2000)&&text(s.help,3000)&&
  Array.isArray(s.cards)&&s.cards.length===3&&s.cards.every(picture)&&new Set(s.cards.map(x=>x.id)).size===3&&permutation(s.options,card,3)&&permutation(s.meaningOptions,meaning,3)&&
  Array.isArray(s.meanings)&&s.meanings.length===4&&s.meanings.every(x=>object(x)&&(x.id==='unsure'||meaning(x.id))&&text(x.label,240))&&new Set(s.meanings.map(x=>x.id)).size===4&&
  Array.isArray(s.links)&&s.links.length===2&&s.links.every(x=>object(x)&&card(x.from)&&card(x.to)&&text(x.text,1000))&&object(s.expected)&&card(s.expected.neighbor)&&meaning(s.expected.meaning);
}
// Admitted history is a recorded result, not a fresh assessment of imported science.
export function validFoodCheck(c){return object(c)&&validFoodSource(c.source)&&object(c.input)&&neighbor(c.input.neighbor)&&maybeMeaning(c.input.meaning)&&support(c.input.support)&&maybeBool(c.neighborMatch)&&maybeBool(c.meaningMatch)&&text(c.feedback,3000);}
export function validFoodRound(r){return object(r)&&positive(r.id)&&validFoodSource(r.source)&&card(r.view)&&neighbor(r.neighbor)&&maybeMeaning(r.meaning)&&typeof r.familiar==='boolean'&&support(r.support)&&Array.isArray(r.checks)&&r.checks.length<=8&&r.checks.every(validFoodCheck);}
export function foodView(state){
 const root=state.foodLinks,base={root,rounds:[],earlier:[],current:null,page:'inspect'};
 if(root===undefined)return {...base,status:'missing'};
 if(!object(root)||root.version!==1||!foodPages.includes(root.page)||!positive(root.current)||!positive(root.nextId)||!Array.isArray(root.seen)||!root.seen.every(id)||new Set(root.seen).size!==root.seen.length||!Array.isArray(root.rounds))return {...base,status:'unavailable'};
 const rounds=[],earlier=[],used=new Set();for(const r of root.rounds){if(validFoodRound(r)&&!used.has(r.id)){rounds.push(r);used.add(r.id);}else earlier.push(r);}
 return {...base,status:'ready',rounds,earlier,current:rounds.find(r=>r.id===root.current)||rounds.at(-1)||null,page:root.page};
}
export function startFood(state,caseId){
 const source=foodSource(caseId),v=foodView(state);if(!source||v.status==='unavailable')return null;
 const root=v.root||{version:1,page:'inspect',current:1,nextId:1,seen:[],rounds:[]};let next=root.nextId;
 for(const r of root.rounds){if(!object(r)||typeof r.id!=='number'||r.id<=0)continue;if(!Number.isFinite(r.id)||r.id>=Number.MAX_SAFE_INTEGER)return null;next=Math.max(next,Math.floor(r.id)+1);}
 if(!positive(next)||next>=Number.MAX_SAFE_INTEGER)return null;
 const round={id:next,source,view:source.reference,neighbor:null,meaning:null,familiar:root.seen.includes(source.pathId),support:[],checks:[]};
 const drop=new Set(v.rounds.slice(0,Math.max(0,v.rounds.length-11)));root.rounds=root.rounds.filter(r=>!drop.has(r));root.rounds.push(round);root.current=next;root.nextId=next+1;root.page='inspect';if(!root.seen.includes(source.pathId))root.seen.push(source.pathId);state.foodLinks=root;return round;
}
const active=state=>foodView(state).current;
export function resumeFood(state,id){const v=foodView(state);if(!v.rounds.some(r=>r.id===id))return false;v.root.current=id;return true;}
export function setFoodPage(state,page){const v=foodView(state);if(v.status!=='ready'||!foodPages.includes(page))return false;v.root.page=page;return true;}
export function setFoodView(state,value){const r=active(state);if(!r||!card(value))return false;r.view=value;return true;}
export function chooseFoodNeighbor(state,value){const r=active(state);if(!r||!neighbor(value))return false;r.neighbor=value;return true;}
export function chooseFoodMeaning(state,value){const r=active(state);if(!r||!maybeMeaning(value))return false;r.meaning=value;return true;}
export function addFoodSupport(state,code){const r=active(state);if(!r||!codes.includes(code))return false;if(!r.support.includes(code))r.support.push(code);return true;}
export function evaluateFood(source,input){
 if(!validFoodSource(source)||!object(input)||!neighbor(input.neighbor)||!maybeMeaning(input.meaning)||!support(input.support))return null;
 const neighborMatch=input.neighbor===null||input.neighbor==='unsure'?null:input.neighbor===source.expected.neighbor;
 const meaningMatch=neighborMatch===true&&meaning(input.meaning)?input.meaning===source.expected.meaning:null;
 let feedback;
 if(neighborMatch===null)feedback='This blank or uncertain neighbor stays unobserved. The pictures and supplied facts remain open. '+(input.meaning===null?'No meaning has been chosen yet.':'The meaning choice is kept but not assessed yet.');
 else if(!neighborMatch)feedback='This proposed pair is not the feeding link requested by this question. It is not a confirmed diet. The meaning response is kept but not assessed for a different pair; either choice can be revised.';
 else{
  const from=source.role==='eater'?input.neighbor:source.reference,to=source.role==='eater'?source.reference:input.neighbor;
  const fact=source.links.find(x=>x.from===from&&x.to===to)?.text;
  feedback='That neighbor fits this supplied question. '+(fact?fact+' ':'')+'The kept legend says: '+source.legend+' ';
  const answerLabel=source.meanings.find(x=>x.id===source.expected.meaning).label,otherLabels=source.meanings.filter(x=>meaning(x.id)&&x.id!==source.expected.meaning).map(x=>x.label);
  feedback+='The supplied meaning is “'+answerLabel+'” rather than “'+otherLabels.join('” or “')+'”. ';
  feedback+=meaningMatch===null?'No definite meaning response is recorded yet.':meaningMatch?'The selected meaning fits the supplied answer.':'The selected meaning differs from the supplied answer; it can be revised.';
 }
 return {source:structuredClone(source),input:{neighbor:input.neighbor,meaning:input.meaning,support:[...input.support]},neighborMatch,meaningMatch,feedback};
}
export function checkFood(state){const r=active(state);if(!r)return null;const c=evaluateFood(r.source,{neighbor:r.neighbor,meaning:r.meaning,support:r.support});if(!c)return null;r.checks.push(c);r.checks=r.checks.slice(-8);state.foodLinks.page='kept';return c;}
export function foodCheckMatches(r,c=r.checks.at(-1)){return !!c&&JSON.stringify(c.source)===JSON.stringify(r.source)&&JSON.stringify(c.input)===JSON.stringify({neighbor:r.neighbor,meaning:r.meaning,support:r.support});}
