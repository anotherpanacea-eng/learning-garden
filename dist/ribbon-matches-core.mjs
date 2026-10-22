import {ribbonMatchPages,ribbonMatchSource} from './ribbon-matches-content.mjs';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),positive=x=>Number.isSafeInteger(x)&&x>0,text=(x,max)=>typeof x==='string'&&x.length<=max,id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,60}$/.test(x),denominators=[2,3,4,6],codes=['help','audio','together','label'];
const integer=(x,max)=>Number.isInteger(x)&&x>=0&&x<=max,support=x=>Array.isArray(x)&&x.length<=4&&x.every(c=>codes.includes(c))&&new Set(x).size===x.length;
export function validMatchSource(s){return object(s)&&s.version===1&&id(s.id)&&text(s.title,180)&&text(s.story,1800)&&text(s.request,1000)&&text(s.namingPrompt,1000)&&denominators.includes(s.referenceDenominator)&&denominators.includes(s.workingDenominator)&&s.referenceDenominator!==s.workingDenominator&&Number.isInteger(s.referenceNumerator)&&s.referenceNumerator>=1&&s.referenceNumerator<=s.referenceDenominator&&(s.referenceNumerator*s.workingDenominator)%s.referenceDenominator===0&&s.unitTicks===12&&s.wholeLength===12&&s.wholeWidth===1&&positive(s.drawingVersion)&&text(s.help,5000)&&text(s.referencePictureText,2000);}
const position=(s,x)=>x===null||integer(x,s.workingDenominator),proposal=x=>x===null||['flag','unsure'].includes(x),numerator=(s,x)=>x===null||x==='unsure'||integer(x,s.workingDenominator);
const input=(s,x)=>object(x)&&position(s,x.index)&&proposal(x.proposal)&&(x.proposal!=='flag'||x.index!==null)&&numerator(s,x.numerator)&&support(x.support),maybeBool=x=>x===null||typeof x==='boolean';
export const matchReferenceLabel=s=>`${s.referenceNumerator}/${s.referenceDenominator}`;
export const matchWorkingLabel=(s,index)=>index===null?null:`${index}/${s.workingDenominator}`;
export function matchWorkingDescription(s,index){return `The working whole has ${s.workingDenominator} equal parts and exactly the same length and width as the reference whole. ${index===null?'No working flag is placed; the unselected ribbon is not a proposed zero.':`Its first ${index} ${index===1?'part is':'parts are'} selected from zero, with the working flag at that endpoint.`}`;}
export function matchWorkingPictureText(s,index){const description=matchWorkingDescription(s,index);return s.drawingVersion===1?description:`${description} Supplied working-position label: ${index===null?'No flag yet':matchWorkingLabel(s,index)}. This is supplied text for the unavailable picture.`;}
export function validMatchCheck(c){return object(c)&&validMatchSource(c.source)&&input(c.source,c.input)&&maybeBool(c.amountMatch)&&maybeBool(c.namingMatch)&&typeof c.fulfilled==='boolean'&&text(c.referenceLabel,100)&&(c.workingLabel===null||text(c.workingLabel,100))&&text(c.referencePictureText,2000)&&text(c.workingPictureText,2000)&&text(c.feedback,7500);}
export function validMatchRound(r){return object(r)&&positive(r.id)&&validMatchSource(r.source)&&input(r.source,r)&&typeof r.familiar==='boolean'&&Array.isArray(r.checks)&&r.checks.length<=8&&r.checks.every(validMatchCheck);}
export function matchView(state){
 const root=state.ribbonMatches,base={root,rounds:[],earlier:[],current:null,page:'make'};
 if(root===undefined)return {...base,status:'missing'};
 if(!object(root)||root.version!==1||!ribbonMatchPages.includes(root.page)||!positive(root.current)||!positive(root.nextId)||!Array.isArray(root.seen)||!root.seen.every(id)||new Set(root.seen).size!==root.seen.length||!Array.isArray(root.rounds))return {...base,status:'unavailable'};
 const rounds=[],earlier=[],used=new Set();for(const r of root.rounds){if(validMatchRound(r)&&!used.has(r.id)){rounds.push(r);used.add(r.id);}else earlier.push(r);}
 return {...base,status:'ready',rounds,earlier,current:rounds.find(r=>r.id===root.current)||null,page:root.page};
}
export function startMatch(state,caseId){
 const source=ribbonMatchSource(caseId),v=matchView(state);if(!source||v.status==='unavailable')return null;
 const root=v.root||{version:1,page:'make',current:1,nextId:1,seen:[],rounds:[]};let next=root.nextId;
 for(const r of root.rounds){if(!object(r)||typeof r.id!=='number'||r.id<=0)continue;if(!Number.isFinite(r.id)||r.id>=Number.MAX_SAFE_INTEGER)return null;next=Math.max(next,Math.floor(r.id)+1);}
 if(!positive(next)||next>=Number.MAX_SAFE_INTEGER)return null;
 const round={id:next,source,index:null,proposal:null,numerator:null,familiar:root.seen.includes(source.id),support:[],checks:[]},drop=new Set(v.rounds.slice(0,Math.max(0,v.rounds.length-11)));
 root.rounds=root.rounds.filter(r=>!drop.has(r));root.rounds.push(round);root.current=next;root.nextId=next+1;root.page='make';if(!root.seen.includes(source.id))root.seen.push(source.id);state.ribbonMatches=root;return round;
}
const active=state=>matchView(state).current;
export function resumeMatch(state,id){const v=matchView(state);if(!v.rounds.some(r=>r.id===id))return false;v.root.current=id;return true;}
export function setMatchPage(state,page){const v=matchView(state);if(!v.current||!ribbonMatchPages.includes(page))return false;v.root.page=page;return true;}
export function startMatchFlag(state){const r=active(state);if(!r)return false;r.index=0;r.proposal='flag';return true;}
export function moveMatchFlag(state,delta){const r=active(state);if(!r||r.index===null||![-1,1].includes(delta)||!integer(r.index+delta,r.source.workingDenominator))return false;r.index+=delta;r.proposal='flag';return true;}
export function chooseMatchProposal(state,value){const r=active(state);if(!r||!proposal(value)||value==='flag'&&r.index===null)return false;r.proposal=value;return true;}
export function chooseMatchNumerator(state,value){const r=active(state);if(!r||!numerator(r.source,value))return false;r.numerator=value;return true;}
export function addMatchSupport(state,code){const r=active(state);if(!r||!codes.includes(code))return false;if(!r.support.includes(code))r.support.push(code);return true;}
export function evaluateMatch(source,proposed){
 if(!validMatchSource(source)||!input(source,proposed))return null;
 const amountMatch=proposed.proposal!=='flag'?null:proposed.index*source.referenceDenominator===source.referenceNumerator*source.workingDenominator,namingMatch=proposed.index===null||proposed.numerator===null||proposed.numerator==='unsure'?null:proposed.numerator===proposed.index,referenceLabel=matchReferenceLabel(source),workingLabel=matchWorkingLabel(source,proposed.index),referencePictureText=source.referencePictureText,workingPictureText=matchWorkingPictureText(source,proposed.index);
 let feedback=amountMatch===null?'No definite amount proposal is recorded. ':amountMatch?'The proposed working endpoint matches the fixed reference. ':'The proposed working endpoint differs from the fixed reference and can be revised. ';
 feedback+=`Both wholes have the same length and width. The supplied reference is ${referenceLabel}; ${source.referenceNumerator*source.workingDenominator/source.referenceDenominator}/${source.workingDenominator} reaches the same endpoint using the requested partition. `;
 if(proposed.index===null)feedback+='There is no working flag yet, so its numerator cannot be judged; any chosen number is retained. ';
 else{feedback+=`Our retained working flag is at ${workingLabel}. `;feedback+=namingMatch===null?'No definite numerator is named. ':namingMatch?'The chosen numerator names that actual flag, whether or not it matches the reference. ':'The chosen numerator does not name that actual flag; count its selected equal parts from zero. ';}
 feedback+='The partition and labels are supplied teaching. Later fitting checks do not establish independent drawing, notation writing, explanation or an unseen equivalence algorithm.';
 return {source:structuredClone(source),input:{index:proposed.index,proposal:proposed.proposal,numerator:proposed.numerator,support:[...proposed.support]},amountMatch,namingMatch,fulfilled:amountMatch===true&&namingMatch===true,referenceLabel,workingLabel,referencePictureText,workingPictureText,feedback};
}
export function checkMatch(state){const r=active(state);if(!r)return null;const c=evaluateMatch(r.source,r);if(!c)return null;r.checks.push(c);r.checks=r.checks.slice(-8);state.ribbonMatches.page='kept';return c;}
export function matchCheckMatches(r,c=r.checks.at(-1)){return !!c&&JSON.stringify(c.source)===JSON.stringify(r.source)&&JSON.stringify(c.input)===JSON.stringify({index:r.index,proposal:r.proposal,numerator:r.numerator,support:r.support});}
