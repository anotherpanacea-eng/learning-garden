import {bodyPages,bodyLegOptions,bodyFeatureChoices,bodySource} from './body-clues-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),positive=x=>Number.isSafeInteger(x)&&x>0;
const text=(x,max)=>typeof x==='string'&&x.length<=max,id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,60}$/.test(x);
const numeric=['0','6','14'],kinds=['snail','worm','ladybird','woodlouse'],supports=['help','audio','together'];
const leg=x=>bodyLegOptions.some(o=>o.id===x),maybeLeg=x=>x===null||leg(x),feature=(s,x)=>x==='other'||x==='unsure'||s.key.some(k=>k.body===x),maybeFeature=(s,x)=>x===null||feature(s,x),nullableBool=x=>x===null||typeof x==='boolean';
const supportList=x=>Array.isArray(x)&&x.length<=3&&x.every(c=>supports.includes(c))&&new Set(x).size===x.length;
export function validBodySource(s){
 if(!object(s)||s.version!==1||!id(s.id)||!text(s.title,120)||!text(s.label,120)||!['inspection','bodyText','detailText','help'].every(k=>text(s[k],1200)))return false;
 if(!object(s.drawing)||s.drawing.version!==1||!kinds.includes(s.drawing.kind)||!object(s.expected)||!numeric.includes(s.expected.legs))return false;
 if(!Array.isArray(s.key)||s.key.length<2||s.key.length>32||!s.key.every(k=>object(k)&&id(k.id)&&numeric.includes(k.legs)&&id(k.body)&&!['other','unsure'].includes(k.body)&&text(k.label,120)&&text(k.clue,300)))return false;
 return new Set(s.key.map(k=>k.id)).size===s.key.length&&new Set(s.key.map(k=>`${k.legs}:${k.body}`)).size===s.key.length&&s.key.some(k=>k.legs===s.expected.legs&&k.body===s.expected.body);
}
// Historical results are readable shapes, not recomputed judgments. Their own source travels with them.
export function validBodyCheck(c){return object(c)&&validBodySource(c.source)&&object(c.input)&&leg(c.input.legs)&&maybeFeature(c.source,c.input.feature)&&(c.named===null||object(c.named)&&id(c.named.id)&&text(c.named.label,120))&&[null,'unclear','outside'].includes(c.stop)&&object(c.features)&&nullableBool(c.features.legs)&&nullableBool(c.features.body)&&text(c.feedback,1600)&&(!Object.hasOwn(c,'support')||supportList(c.support));}
export function validBodyRound(r){
 if(!object(r)||!positive(r.id)||!validBodySource(r.source)||typeof r.familiar!=='boolean'||!['body','detail'].includes(r.view)||!maybeLeg(r.legs)||!maybeFeature(r.source,r.feature))return false;
 if(r.feature!==null&&!bodyFeatureChoices(r.source,r.legs).some(c=>c.id===r.feature))return false;
 return supportList(r.support)&&Array.isArray(r.checks)&&r.checks.length<=8&&r.checks.every(validBodyCheck);
}
export function bodyView(state){
 const root=state.bodyClues,base={root,rounds:[],earlier:[],current:null,page:'inspect'};
 if(root===undefined)return {...base,status:'missing'};
 if(!object(root)||root.version!==1||!bodyPages.includes(root.page)||!positive(root.current)||!positive(root.nextId)||!Array.isArray(root.seen)||!root.seen.every(id)||new Set(root.seen).size!==root.seen.length||!Array.isArray(root.rounds))return {...base,status:'unavailable'};
 const rounds=[],earlier=[],used=new Set();for(const r of root.rounds){if(validBodyRound(r)&&!used.has(r.id)){rounds.push(r);used.add(r.id);}else earlier.push(r);}
 return {...base,status:'ready',rounds,earlier,current:rounds.find(r=>r.id===root.current)||rounds.at(-1)||null,page:root.page};
}
export function startBody(state,picture){
 const source=bodySource(picture),v=bodyView(state);if(!source||v.status==='unavailable')return null;
 const root=v.root||{version:1,page:'inspect',current:1,nextId:1,seen:[],rounds:[]};let next=root.nextId;
 for(const r of root.rounds){if(!object(r)||typeof r.id!=='number'||r.id<=0)continue;if(!Number.isFinite(r.id)||r.id>=Number.MAX_SAFE_INTEGER)return null;next=Math.max(next,Math.floor(r.id)+1);}
 if(!positive(next)||next>=Number.MAX_SAFE_INTEGER)return null;
 const round={id:next,source,familiar:root.seen.includes(source.id),view:'body',legs:null,feature:null,support:[],checks:[]};
 const drop=new Set(v.rounds.slice(0,Math.max(0,v.rounds.length-11)));root.rounds=root.rounds.filter(r=>!drop.has(r));root.rounds.push(round);root.current=next;root.nextId=next+1;root.page='inspect';if(!root.seen.includes(source.id))root.seen.push(source.id);state.bodyClues=root;return round;
}
const active=state=>bodyView(state).current;
export function setBodyPage(state,page){const v=bodyView(state);if(v.status!=='ready'||!bodyPages.includes(page))return false;v.root.page=page;return true;}
export function setBodyView(state,view){const r=active(state);if(!r||!['body','detail'].includes(view))return false;r.view=view;return true;}
export function chooseBodyLegs(state,value){const r=active(state);if(!r||!maybeLeg(value))return false;if(r.legs!==value){r.legs=value;r.feature=null;}return true;}
export function chooseBodyFeature(state,value){const r=active(state);if(!r||value!==null&&!bodyFeatureChoices(r.source,r.legs).some(c=>c.id===value))return false;r.feature=value;return true;}
export function addBodySupport(state,code){const r=active(state);if(!r||!supports.includes(code))return false;if(!r.support.includes(code))r.support.push(code);return true;}
export function resumeBody(state,id){const v=bodyView(state);if(v.status!=='ready'||!v.rounds.some(r=>r.id===id))return false;v.root.current=id;return true;}
export function evaluateBody(source,input){
 if(!validBodySource(source)||!object(input)||!leg(input.legs)||!maybeFeature(source,input.feature))return null;
 const numericBranch=numeric.includes(input.legs);if(numericBranch&&!bodyFeatureChoices(source,input.legs).some(c=>c.id===input.feature)||!numericBranch&&input.feature!==null)return null;
 const leaf=source.key.find(k=>k.legs===input.legs&&k.body===input.feature),named=leaf?{id:leaf.id,label:leaf.label}:null;
 const stop=input.legs==='unsure'||input.feature==='unsure'?'unclear':!named?'outside':null;
 const compared={legs:input.legs==='unsure'?null:input.legs===source.expected.legs,body:input.feature===null||input.feature==='unsure'?null:input.feature===source.expected.body};
 let feedback;
 if(stop==='unclear')feedback='We kept an uncertain trail. A clearer look can help us choose a branch; an unclear clue is not an absent feature.';
 else if(stop==='outside')feedback=`This chosen trail stops outside our ${source.key.length}-picture key. That does not tell us a different animal is in the picture. Look again at the walking-leg detail and body clue.`;
 else if(compared.legs&&compared.body)feedback=`These two chosen clues fit this supplied adult picture. Our key names ${named.label}.`;
 else feedback=`This chosen trail names ${named.label}. Compare it with our picture: ${source.inspection} Change a clue or take another look whenever you like.`;
 return {source:structuredClone(source),input:{legs:input.legs,feature:input.feature},named,stop,features:compared,feedback};
}
export function checkBody(state){const r=active(state);if(!r)return null;const c=evaluateBody(r.source,{legs:r.legs,feature:r.feature});if(!c)return null;c.support=[...r.support];r.checks.push(c);r.checks=r.checks.slice(-8);state.bodyClues.page='keep';return c;}
export function bodyCheckMatches(r,c=r.checks.at(-1)){return !!c&&c.input.legs===r.legs&&c.input.feature===r.feature&&JSON.stringify(c.source)===JSON.stringify(r.source);}
