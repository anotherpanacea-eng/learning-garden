// A frozen practice invitation, never a copied assessment or a global learner level.
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
export const connectionSources=['living','cafe','bramble'];
export function proposedPair(a,b,outcome){if(a===0)return [1,b];if(outcome!=='first-match')return [a,b];return a<12?[a+1,b]:b<12?[a,b+1]:[11,12];}
export function validConnection(c,a=c?.a,b=c?.b){
 const fields=['version','source','sourceId','relation','sourceA','sourceB','outcome','familiarity','a','b','proposal'];
 if(!object(c)||Object.keys(c).length!==fields.length||!fields.every(k=>Object.hasOwn(c,k))||c.version!==1||!connectionSources.includes(c.source)||!integer(c.sourceId,0,Number.MAX_SAFE_INTEGER-1)||!['direct','inverse','tomorrow'].includes(c.relation)||c.source!=='living'&&c.relation!=='direct'||!integer(c.sourceA,c.relation==='tomorrow'?0:1,12)||!integer(c.sourceB,1,12)||!['retry','supported','first-match','explored'].includes(c.outcome)||!['new','familiar','unknown'].includes(c.familiarity)||!integer(c.a,1,12)||!integer(c.b,1,12)||c.a!==a||c.b!==b)return false;
 const pair=proposedPair(c.sourceA,c.sourceB,c.outcome),kind=c.sourceA===0?'positive':c.outcome==='first-match'?'nearby':'same';return c.a===pair[0]&&c.b===pair[1]&&c.proposal===kind;
}
export function connectionFrom(source,sourceId,relation,a,b,outcome,familiarity='unknown'){
 const [x,y]=proposedPair(a,b,outcome),c={version:1,source,sourceId,relation,sourceA:a,sourceB:b,outcome,familiarity,a:x,b:y,proposal:a===0?'positive':outcome==='first-match'?'nearby':'same'};return validConnection(c)?c:null;
}
