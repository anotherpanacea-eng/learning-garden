export const recutCases=Object.freeze([
 {id:'half-window',title:'Half for the lantern window',request:'The first half of this ribbon is colored for the lantern window. Add dividing marks to its equal spaces without moving the brass flag.',numerator:1,denominator:2,stages:[2,4,8]},
 {id:'third-tag',title:'One third for a tag',request:'The little tag keeps one third colored. Split every equal space, then try joining the pieces again.',numerator:1,denominator:3,stages:[3,6,12]},
 {id:'two-thirds-banner',title:'Two thirds for a banner',request:'The banner keeps two thirds colored. Make smaller equal spaces while its colored end stays put.',numerator:2,denominator:3,stages:[3,6,12]},
 {id:'quarter-patch',title:'One quarter for a patch',request:'The patch uses one quarter of the ribbon. Split all four equal spaces once, then join them again.',numerator:1,denominator:4,stages:[4,8]},
 {id:'three-quarter-tail',title:'Three quarters for a tail',request:'The tail keeps three quarters colored. Change the dividing marks and watch the same colored stretch.',numerator:3,denominator:4,stages:[4,8]}
]);

export const recutCase=id=>recutCases.find(c=>c.id===id)||null;
export function recutStage(c,stage){
 if(!c||!Number.isInteger(stage)||stage<0||stage>=c.stages.length)return null;
 const denominator=c.stages[stage],endpoint=24*c.numerator/c.denominator;
 return {denominator,coloredCount:endpoint*denominator/24,endpoint,boundaries:Array.from({length:denominator-1},(_,i)=>(i+1)*24/denominator)};
}
export function recutMove(visit,action){
 const c=recutCase(visit?.caseId);
 if(!c||!recutStage(c,visit.stage))return null;
 const stage=visit.stage+(action==='split'?1:action==='join'?-1:0);
 if(!['split','join'].includes(action)||!recutStage(c,stage))return null;
 return {...visit,stage,lastAction:action};
}
