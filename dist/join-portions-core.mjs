// Original finite same-unit portion model. This bench has no learner record.
export const portionCases=Object.freeze([
 Object.freeze({id:'quarter-supper',title:'Quarters for supper',request:'One quarter is on the tray. Two more quarters are waiting. Bring both waiting pieces over, then try returning one.',a:1,b:2,d:4}),
 Object.freeze({id:'third-picnic',title:'Thirds for the picnic',request:'One third is on the tray. Another third is waiting. Join them without changing the size of either piece.',a:1,b:1,d:3}),
 Object.freeze({id:'sixth-tasters',title:'Sixths for the tasters',request:'Two sixths are on the tray. Three sixths are waiting. Move the waiting pieces over one at a time.',a:2,b:3,d:6}),
 Object.freeze({id:'past-one',title:'A little more than one loaf',request:'Three quarters are on the tray. Two quarters are waiting. Use the next same-size loaf space when the first is full.',a:3,b:2,d:4})
]);
export const portionCase=id=>portionCases.find(c=>c.id===id)||null;
export function portionModel(c,k){
 if(!c||!Number.isInteger(k)||k<0||k>c.b)return null;
 const tray=Array.from({length:c.a},(_,i)=>({id:`A${i+1}`,origin:'a',slot:i})).concat(Array.from({length:k},(_,i)=>({id:`B${i+1}`,origin:'b',slot:c.a+i})));
 const waiting=Array.from({length:c.b-k},(_,i)=>({id:`B${k+i+1}`,origin:'b',slot:k+i}));
 return {tray,waiting,trayCount:c.a+k,waitingCount:c.b-k,allCount:c.a+c.b,rowCount:Math.ceil((c.a+c.b)/c.d),denominator:c.d};
}
export function movePortion(visit,action){
 const c=portionCase(visit?.caseId);if(!portionModel(c,visit?.k)||!['move','return'].includes(action))return null;
 const k=visit.k+(action==='move'?1:-1);return portionModel(c,k)?{...visit,k,lastAction:action,exampleFrame:0}:null;
}
