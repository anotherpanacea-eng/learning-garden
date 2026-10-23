// Shared labels for existing authored passage variants, never learner levels.
export const parisLengths=Object.freeze({1:'A little text',2:'A little more',3:'A longer passage'});
export const frenchLengths=Object.freeze({1:'Short sentences',2:'More connected text',3:'A short paragraph'});
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
export function startingReadingAmount(state,language){
 const start=object(state?.garden)&&object(state.garden.start)?state.garden.start:null;
 return start&&[1,2,3].includes(start[language])?start[language]:'auto';
}
export const startingAmountNotice='Your starting choice is selected. Choose any amount for this visit; this starting choice returns when you come back.';
