import {lifePages,stageIds,lifeSource} from './life-stages-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),positive=x=>Number.isSafeInteger(x)&&x>0;
const text=(x,max)=>typeof x==='string'&&x.length<=max,id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,60}$/.test(x);
const stage=x=>stageIds.includes(x),meaning=x=>['same','offspring'].includes(x),neighbor=x=>x===null||x==='unsure'||stage(x),maybeMeaning=x=>x===null||x==='unsure'||meaning(x),maybeBool=x=>x===null||typeof x==='boolean';
const codes=['help','audio','together'],support=x=>Array.isArray(x)&&x.length<=3&&x.every(c=>codes.includes(c))&&new Set(x).size===x.length;
const picture=x=>object(x)&&stage(x.id)&&text(x.label,160)&&text(x.text,1600)&&text(x.pictureText,1600)&&object(x.drawing)&&positive(x.drawing.version)&&id(x.drawing.kind);
export function validLifeSource(s){
 return object(s)&&s.version===1&&id(s.id)&&id(s.chartId)&&text(s.title,180)&&text(s.species,160)&&text(s.commonName,180)&&text(s.question,1000)&&stage(s.reference)&&['next','before'].includes(s.direction)&&text(s.overview,2000)&&text(s.help,3000)&&
  Array.isArray(s.stages)&&s.stages.length===4&&s.stages.every(picture)&&new Set(s.stages.map(x=>x.id)).size===4&&
  Array.isArray(s.options)&&s.options.length===4&&s.options.every(stage)&&new Set(s.options).size===4&&
  Array.isArray(s.links)&&s.links.length===4&&s.links.every(x=>object(x)&&stage(x.from)&&stage(x.to)&&meaning(x.meaning)&&text(x.text,1000))&&object(s.expected)&&stage(s.expected.neighbor)&&meaning(s.expected.meaning);
}
// A historical judgment is a readable record, not a current re-evaluation of its science/answer.
export function validLifeCheck(c){return object(c)&&validLifeSource(c.source)&&object(c.input)&&neighbor(c.input.neighbor)&&maybeMeaning(c.input.meaning)&&support(c.input.support)&&maybeBool(c.neighborMatch)&&maybeBool(c.meaningMatch)&&text(c.feedback,2500);}
export function validLifeRound(r){return object(r)&&positive(r.id)&&validLifeSource(r.source)&&stage(r.view)&&neighbor(r.neighbor)&&maybeMeaning(r.meaning)&&typeof r.familiar==='boolean'&&support(r.support)&&Array.isArray(r.checks)&&r.checks.length<=8&&r.checks.every(validLifeCheck);}
export function lifeView(state){
 const root=state.lifeStages,base={root,rounds:[],earlier:[],current:null,page:'inspect'};
 if(root===undefined)return {...base,status:'missing'};
 if(!object(root)||root.version!==1||!lifePages.includes(root.page)||!positive(root.current)||!positive(root.nextId)||!Array.isArray(root.seen)||!root.seen.every(id)||new Set(root.seen).size!==root.seen.length||!Array.isArray(root.rounds))return {...base,status:'unavailable'};
 const rounds=[],earlier=[],used=new Set();for(const r of root.rounds){if(validLifeRound(r)&&!used.has(r.id)){rounds.push(r);used.add(r.id);}else earlier.push(r);}
 return {...base,status:'ready',rounds,earlier,current:rounds.find(r=>r.id===root.current)||rounds.at(-1)||null,page:root.page};
}
export function startLife(state,caseId){
 const source=lifeSource(caseId),v=lifeView(state);if(!source||v.status==='unavailable')return null;
 const root=v.root||{version:1,page:'inspect',current:1,nextId:1,seen:[],rounds:[]};let next=root.nextId;
 for(const r of root.rounds){if(!object(r)||typeof r.id!=='number'||r.id<=0)continue;if(!Number.isFinite(r.id)||r.id>=Number.MAX_SAFE_INTEGER)return null;next=Math.max(next,Math.floor(r.id)+1);}
 if(!positive(next)||next>=Number.MAX_SAFE_INTEGER)return null;
 const round={id:next,source,view:source.reference,neighbor:null,meaning:null,familiar:root.seen.includes(source.chartId),support:[],checks:[]};
 const drop=new Set(v.rounds.slice(0,Math.max(0,v.rounds.length-11)));root.rounds=root.rounds.filter(r=>!drop.has(r));root.rounds.push(round);root.current=next;root.nextId=next+1;root.page='inspect';if(!root.seen.includes(source.chartId))root.seen.push(source.chartId);state.lifeStages=root;return round;
}
const active=state=>lifeView(state).current;
export function resumeLife(state,id){const v=lifeView(state);if(!v.rounds.some(r=>r.id===id))return false;v.root.current=id;return true;}
export function setLifePage(state,page){const v=lifeView(state);if(v.status!=='ready'||!lifePages.includes(page))return false;v.root.page=page;return true;}
export function setLifeView(state,value){const r=active(state);if(!r||!stage(value))return false;r.view=value;return true;}
export function chooseLifeNeighbor(state,value){const r=active(state);if(!r||!neighbor(value))return false;r.neighbor=value;return true;}
export function chooseLifeMeaning(state,value){const r=active(state);if(!r||!maybeMeaning(value))return false;r.meaning=value;return true;}
export function addLifeSupport(state,code){const r=active(state);if(!r||!codes.includes(code))return false;if(!r.support.includes(code))r.support.push(code);return true;}
export function evaluateLife(source,input){
 if(!validLifeSource(source)||!object(input)||!neighbor(input.neighbor)||!maybeMeaning(input.meaning)||!support(input.support))return null;
 const neighborMatch=input.neighbor===null||input.neighbor==='unsure'?null:input.neighbor===source.expected.neighbor;
 const meaningMatch=neighborMatch===true&&meaning(input.meaning)?input.meaning===source.expected.meaning:null;
 let feedback;
 if(neighborMatch===null)feedback='This blank or uncertain neighbor stays unobserved. Our stage pictures and words are open for another look. '+(input.meaning===null?'No meaning has been chosen yet.':'The meaning choice is kept but not assessed yet.');
 else if(!neighborMatch)feedback='This proposed pair is not the chart neighbor requested by this question. The meaning response is kept but is not assessed for a different pair. Look again, or revise either choice.';
 else{
  feedback='That neighbor fits this chart question. ';
  if(source.expected.meaning==='offspring')feedback+='This forward link crosses generations: adult females can lay eggs that begin offspring. The adult does not turn back into an egg. ';
  else feedback+='The correct forward link can show the same individual growing or changing stage. ';
  feedback+=meaningMatch===null?'No definite meaning response is recorded yet.':meaningMatch?'The selected meaning fits this chart’s link.':'The selected meaning differs from this chart’s link; it can be revised.';
 }
 return {source:structuredClone(source),input:{neighbor:input.neighbor,meaning:input.meaning,support:[...input.support]},neighborMatch,meaningMatch,feedback};
}
export function checkLife(state){const r=active(state);if(!r)return null;const c=evaluateLife(r.source,{neighbor:r.neighbor,meaning:r.meaning,support:r.support});if(!c)return null;r.checks.push(c);r.checks=r.checks.slice(-8);state.lifeStages.page='kept';return c;}
export function lifeCheckMatches(r,c=r.checks.at(-1)){return !!c&&JSON.stringify(c.source)===JSON.stringify(r.source)&&JSON.stringify(c.input)===JSON.stringify({neighbor:r.neighbor,meaning:r.meaning,support:r.support});}
