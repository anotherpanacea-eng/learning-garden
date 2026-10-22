// Original fixed-whole requests. Upstream curriculum descriptions informed scope, not this copy or art.
export const HUNDREDTHS_WHOLE='One whole repair-material unit, shown as a square with 100 equal small parts.';
export const HUNDREDTHS_BUILD_HELP='This is one whole square. One row holds ten hundredths, so one row is one tenth. Add a row for one tenth or one small square for one hundredth. Three rows cover 30/100, written 0.30 or 0.3. Five more squares make 35/100, written 0.35.';
export const HUNDREDTHS_COMPARE_HELP='Both pictures show the same-size whole square. Count the filled rows and extra squares. The labels 0.3 and 0.30 name the same amount. Thirty-five hundredths is above thirty and below forty hundredths.';
const base={version:1,wholeId:'repair-whole-one',wholeLabel:HUNDREDTHS_WHOLE,partCount:100};
export const hundredthsCases=[
 {id:'three-tenths',title:'A smaller square name',request:'Make 0.3 of this whole repair square using its smaller parts.',kind:'build',target:30},
 {id:'thirty-five',title:'A little more than three rows',request:'Make 0.35 of this same whole repair square.',kind:'build',target:35},
 {id:'three-and-five',title:'A joined label',request:'Make 0.3 + 0.05 of this same whole repair square.',kind:'build',target:35},
 {id:'same-names',title:'Two labels, one amount',request:'Compare 0.3 and 0.30 on two pictures of the same whole square.',kind:'compare',left:30,right:30},
 {id:'more-than-three',title:'Five more small parts',request:'Compare 0.35 and 0.30 on two pictures of the same whole square.',kind:'compare',left:35,right:30},
 {id:'less-than-four',title:'Five fewer small parts',request:'Compare 0.35 and 0.40 on two pictures of the same whole square.',kind:'compare',left:35,right:40}
].map(c=>({...base,...c,help:c.kind==='build'?HUNDREDTHS_BUILD_HELP:HUNDREDTHS_COMPARE_HELP}));
export const hundredthsDecimal=n=>n===100?'1.00':`0.${String(n).padStart(2,'0')}`;
export const hundredthsName=n=>`${n}/100 = ${hundredthsDecimal(n)}${n===100?' = 1':''}`;
export const relation=(a,b)=>a<b?'less':a>b?'greater':'same';
