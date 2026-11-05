// Original finite number rules; upstream study and scope are recorded in spec380.
export const inequalityFamilies=[
 {id:'positive-less',label:'Growing rule · less than'},
 {id:'positive-more',label:'Growing rule · greater than'},
 {id:'negative-less',label:'Falling rule · less than'},
 {id:'negative-more',label:'Falling rule · greater than'}
];
export function createInequalitySource(family,index){
 const entry=inequalityFamilies.find(f=>f.id===family);
 if(!entry||!Number.isInteger(index)||index<1||index>10)return null;
 const a=family.startsWith('negative')?-2:2,b=3,boundary=(index-1)%5-2;
 const relation=family.endsWith('less')?(index<=5?'lt':'le'):(index<=5?'gt':'ge');
 return {v:1,model:'linear-inequality-v1',id:`inequality-${family}-${index}`,title:`${entry.label} · rule ${index}`,a,b,c:a*boundary+b,relation,
 story:'The surveyor is making a number display for Willowbank. Which marks fit this rule? Draw a line that tells another visitor about all the numbers that fit.',
 notice:'These are rules for any real number, including negative numbers and fractions. They are not counts of objects or safety limits. The drawing shows only part of an endless number line.',
 teaching:[
  'An expression gives a value. An equation says two values are equal. An inequality says one value is less than, greater than, or possibly equal to another.',
  'For a different rule, 2x + 1 is less than or equal to 5: subtract 1 from both sides, then divide both sides by 2. Every x less than or equal to 2 fits.',
  'Compare three choices: the single point x = 2; all numbers less than 2, with an open endpoint; all numbers less than or equal to 2, with a filled endpoint. Only the last choice gives every solution to that example.',
  'Trying a number tells you about that number. Reversible changes to both sides explain the whole set. The arrow includes every real value along it, including values between the printed ticks.'
 ]};
}
